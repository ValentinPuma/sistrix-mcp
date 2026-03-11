import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { callSistrixApi } from "../server.js";

const keywordOptionalParams = {
  country: z.string().optional().describe("Country code (e.g., 'de', 'us', 'gb')"),
  date: z.string().optional().describe("Date for historical data (YYYY-MM-DD)"),
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

export function registerKeywordTools(server: McpServer): void {
  server.tool("keyword_seo", "Get organic SERP results for a keyword — which domains rank and at which positions", { kw: z.string().describe("Keyword to analyze"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.seo", buildParams(args)));
  server.tool("keyword_sem", "Get paid/SEM SERP results for a keyword — which domains bid on this keyword", { kw: z.string().describe("Keyword to analyze"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.sem", buildParams(args)));
  server.tool("keyword_domain_seo", "Get a specific domain's organic rankings for a keyword", { kw: z.string().describe("Keyword to analyze"), domain: z.string().describe("Domain to check rankings for"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.domain.seo", buildParams(args)));
  server.tool("keyword_domain_sem", "Get a specific domain's paid/SEM rankings for a keyword", { kw: z.string().describe("Keyword to analyze"), domain: z.string().describe("Domain to check"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.domain.sem", buildParams(args)));
  server.tool("keyword_seo_metrics", "Get SEO metrics for a keyword: search volume, CPC, competition level", { kw: z.string().describe("Keyword to analyze"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.seo.metrics", buildParams(args)));
  server.tool("keyword_seo_competition", "Get competition/difficulty score for a keyword in organic search", { kw: z.string().describe("Keyword to analyze"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.seo.competition", buildParams(args)));
  server.tool("keyword_seo_searchintent", "Get the search intent classification for a keyword (informational, navigational, transactional, commercial)", { kw: z.string().describe("Keyword to analyze"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.seo.searchintent", buildParams(args)));
  server.tool("keyword_seo_serpfeatures", "Get SERP features present for a keyword (featured snippets, knowledge panels, etc.)", { kw: z.string().describe("Keyword to analyze"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.seo.serpfeatures", buildParams(args)));
  server.tool("keyword_seo_traffic", "Get organic traffic data for a keyword", { kw: z.string().describe("Keyword to analyze"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.seo.traffic", buildParams(args)));
  server.tool("keyword_seo_traffic_estimation", "Get estimated traffic for a keyword based on search volume and position", { kw: z.string().describe("Keyword to analyze"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.seo.traffic.estimation", buildParams(args)));
  server.tool("keyword_questions", "Get related questions (People Also Ask) for a keyword", { kw: z.string().describe("Keyword to analyze"), ...keywordOptionalParams }, async (args) => callSistrixApi("keyword.questions", buildParams(args)));
}
