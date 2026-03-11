import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { callSistrixApi } from "../server.js";

// Common optional params for domain tools
const domainOptionalParams = {
  country: z.string().optional().describe("Country code (e.g., 'de', 'us', 'gb')"),
  date: z.string().optional().describe("Date for historical data (YYYY-MM-DD)"),
  mobile: z.boolean().optional().describe("Use mobile index (true) or desktop (false)"),
  num: z.number().optional().describe("Number of results to return"),
  offset: z.number().optional().describe("Offset for pagination"),
};

function buildParams(args: Record<string, unknown>): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(args)) {
    if (value !== undefined && value !== null) {
      params[key] = value as string | number | boolean;
    }
  }
  return params;
}

export function registerDomainTools(server: McpServer): void {
  server.tool("domain_overview", "Get a comprehensive overview of a domain including visibility, keywords, and traffic data", { domain: z.string().describe("Domain to analyze (e.g., 'example.com')"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.overview", buildParams(args)));
  server.tool("domain_visibility_index", "Get the SISTRIX Visibility Index history for a domain", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.visibilityindex", buildParams(args)));
  server.tool("domain_visibility_overview", "Get Visibility Index overview across all available countries", { domain: z.string().describe("Domain to analyze") }, async (args) => callSistrixApi("domain.visibilityindex.overview", buildParams(args)));
  server.tool("domain_keyword_count_seo", "Get the number of organic keywords a domain ranks for", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.kwcount.seo", buildParams(args)));
  server.tool("domain_keyword_count_seo_top10", "Get the number of organic keywords in the top 10 for a domain", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.kwcount.seo.top10", buildParams(args)));
  server.tool("domain_keyword_count_sem", "Get the number of paid/SEM keywords for a domain", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.kwcount.sem", buildParams(args)));
  server.tool("domain_ranking_distribution", "Get the ranking position distribution for a domain (positions 1-10, 11-20, etc.)", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.ranking.distribution", buildParams(args)));
  server.tool("domain_competitors_seo", "Find organic/SEO competitors for a domain", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.competitors.seo", buildParams(args)));
  server.tool("domain_competitors_sem", "Find paid/SEM competitors for a domain", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.competitors.sem", buildParams(args)));
  server.tool("domain_ideas", "Get content and keyword ideas based on a domain's current rankings", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.ideas", buildParams(args)));
  server.tool("domain_opportunities", "Find SEO opportunities — keywords where the domain could improve rankings", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.opportunities", buildParams(args)));
  server.tool("domain_traffic_estimation", "Get estimated organic traffic for a domain", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.traffic.estimation", buildParams(args)));
  server.tool("domain_urls", "Get the list of indexed URLs for a domain with their rankings", { domain: z.string().describe("Domain to analyze"), ...domainOptionalParams }, async (args) => callSistrixApi("domain.urls", buildParams(args)));
}
