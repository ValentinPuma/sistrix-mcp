import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { callSistrixApi } from "../server.js";
import { formatResponse } from "../utils/response.js";
import { formatErrorForMcp } from "../utils/errors.js";
import { sistrixClient } from "../server.js";
import { cache, rateLimiter } from "../server.js";
import { extractSistrixData, formatCreditsUsed } from "../utils/response.js";
import type { SistrixResponse } from "../api/client.js";

async function multiCall(
  calls: Array<{ label: string; endpoint: string; params: Record<string, string | number | boolean> }>
): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
  try {
    const results: Record<string, unknown> = {};
    let totalCredits = 0;
    const promises = calls.map(async ({ label, endpoint, params }) => {
      const cached = cache.get<SistrixResponse>(endpoint, params);
      if (cached) { results[label] = extractSistrixData(cached as Record<string, unknown>); return; }
      await rateLimiter.waitAndConsume();
      const response = await sistrixClient.get(endpoint, params);
      cache.set(endpoint, params, response);
      results[label] = extractSistrixData(response as Record<string, unknown>);
      if (response.status?.credits && typeof response.status.credits === "number") { totalCredits += response.status.credits; }
    });
    await Promise.all(promises);
    let text = "";
    for (const [label, data] of Object.entries(results)) { text += `## ${label}\n\n${formatResponse(data)}\n\n`; }
    if (totalCredits > 0) { text += `---\n_Total credits used: ${totalCredits}_`; }
    return { content: [{ type: "text" as const, text }] };
  } catch (error) {
    return { content: [{ type: "text" as const, text: formatErrorForMcp(error) }], isError: true };
  }
}

export function registerCompoundTools(server: McpServer): void {
  server.tool("full_domain_audit", "Comprehensive SEO audit: visibility index, keyword counts, ranking distribution, backlink overview, and organic competitors — all in one call", { domain: z.string().describe("Domain to audit (e.g., 'example.com')"), country: z.string().optional().describe("Country code (e.g., 'de', 'us')") }, async (args) => {
    const params: Record<string, string | number | boolean> = { domain: args.domain };
    if (args.country) params.country = args.country;
    return multiCall([{ label: "Domain Overview", endpoint: "domain.overview", params }, { label: "Visibility Index", endpoint: "domain.visibilityindex", params }, { label: "Keyword Count (Organic)", endpoint: "domain.kwcount.seo", params }, { label: "Ranking Distribution", endpoint: "domain.ranking.distribution", params }, { label: "Backlink Overview", endpoint: "links.overview", params: { domain: args.domain } }, { label: "Organic Competitors", endpoint: "domain.competitors.seo", params }]);
  });
  server.tool("keyword_deep_analysis", "Full keyword analysis: SEO metrics, search intent, competition score, SERP features, and related questions — all in one call", { kw: z.string().describe("Keyword to analyze"), country: z.string().optional().describe("Country code (e.g., 'de', 'us')") }, async (args) => {
    const params: Record<string, string | number | boolean> = { kw: args.kw };
    if (args.country) params.country = args.country;
    return multiCall([{ label: "SEO Metrics", endpoint: "keyword.seo.metrics", params }, { label: "Search Intent", endpoint: "keyword.seo.searchintent", params }, { label: "Competition", endpoint: "keyword.seo.competition", params }, { label: "SERP Features", endpoint: "keyword.seo.serpfeatures", params }, { label: "Related Questions", endpoint: "keyword.questions", params }]);
  });
  server.tool("competitor_comparison", "Side-by-side comparison of up to 5 domains: visibility index and overview for each", { domains: z.array(z.string()).min(2).max(5).describe("Array of domains to compare (2-5)"), country: z.string().optional().describe("Country code (e.g., 'de', 'us')") }, async (args) => {
    const calls = args.domains.flatMap((domain) => { const params: Record<string, string | number | boolean> = { domain }; if (args.country) params.country = args.country; return [{ label: `${domain} — Overview`, endpoint: "domain.overview", params }, { label: `${domain} — Visibility Index`, endpoint: "domain.visibilityindex", params }]; });
    return multiCall(calls);
  });
  server.tool("backlink_report", "Full backlink profile: overview, top links, anchor texts, and most-linked pages — all in one call", { domain: z.string().describe("Domain to analyze"), num: z.number().optional().describe("Number of results per section") }, async (args) => {
    const params: Record<string, string | number | boolean> = { domain: args.domain };
    if (args.num) params.num = args.num;
    return multiCall([{ label: "Backlink Overview", endpoint: "links.overview", params: { domain: args.domain } }, { label: "Backlink List", endpoint: "links.list", params }, { label: "Anchor Texts", endpoint: "links.linktexts", params }, { label: "Most Linked Pages", endpoint: "links.linktargets", params }]);
  });
  server.tool("ai_visibility_report", "AI presence report: how a brand/domain appears in AI-generated results, competition, and cited sources — all in one call", { domain: z.string().describe("Domain/brand to analyze"), country: z.string().optional().describe("Country code") }, async (args) => {
    const params: Record<string, string | number | boolean> = { domain: args.domain };
    if (args.country) params.country = args.country;
    return multiCall([{ label: "AI Entity Overview", endpoint: "ai.entity.overview", params }, { label: "AI Competition", endpoint: "ai.entity.competition", params }, { label: "AI Sources", endpoint: "ai.entity.sources", params }, { label: "Top Brands in AI", endpoint: "ai.top.brands", params: {} }]);
  });
}
