import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { callSistrixApi } from "../server.js";

function buildParams(args: Record<string, unknown>): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(args)) {
    if (value !== undefined && value !== null) {
      params[key] = value as string | number | boolean;
    }
  }
  return params;
}

const projectOptionalParams = {
  num: z.number().optional().describe("Number of results to return"),
  offset: z.number().optional().describe("Offset for pagination"),
};

export function registerProjectTools(server: McpServer): void {
  server.tool("project_overview", "List all your Optimizer projects", {}, async () => callSistrixApi("project.overview"));
  server.tool("project_create", "Create a new Optimizer project for a domain", { domain: z.string().describe("Domain for the new project") }, async (args) => callSistrixApi("project.create", buildParams(args)));
  server.tool("project_competitors", "Get competitors configured for an Optimizer project", { project: z.string().describe("Project hash"), ...projectOptionalParams }, async (args) => callSistrixApi("project.competitors", buildParams(args)));
  server.tool("project_ranking", "Get keyword rankings tracked in an Optimizer project", { project: z.string().describe("Project hash"), ...projectOptionalParams }, async (args) => callSistrixApi("project.ranking", buildParams(args)));
  server.tool("project_visibility_index", "Get the Visibility Index for an Optimizer project", { project: z.string().describe("Project hash") }, async (args) => callSistrixApi("project.visibilityindex", buildParams(args)));
  server.tool("project_external_links", "Get external links found for an Optimizer project", { project: z.string().describe("Project hash"), ...projectOptionalParams }, async (args) => callSistrixApi("project.external.links", buildParams(args)));
  server.tool("project_keyword_serps", "Get SERP snapshots for tracked keywords in an Optimizer project", { project: z.string().describe("Project hash"), kw: z.string().describe("Keyword to get SERP for"), ...projectOptionalParams }, async (args) => callSistrixApi("project.keyword.serps", buildParams(args)));
  server.tool("project_onpage", "Get on-page issues found in an Optimizer project crawl", { project: z.string().describe("Project hash"), ...projectOptionalParams }, async (args) => callSistrixApi("project.onpage", buildParams(args)));
  server.tool("project_onpage_overview", "Get an overview of on-page health for a project", { project: z.string().describe("Project hash") }, async (args) => callSistrixApi("project.onpage.overview", buildParams(args)));
  server.tool("project_onpage_crawl", "Get crawl data from the latest on-page crawl", { project: z.string().describe("Project hash"), ...projectOptionalParams }, async (args) => callSistrixApi("project.onpage.crawl", buildParams(args)));
  server.tool("project_onpage_urls", "Get crawled URLs from the on-page analysis", { project: z.string().describe("Project hash"), ...projectOptionalParams }, async (args) => callSistrixApi("project.onpage.urls", buildParams(args)));
  server.tool("project_onpage_links", "Get internal link data from the on-page crawl", { project: z.string().describe("Project hash"), ...projectOptionalParams }, async (args) => callSistrixApi("project.onpage.links", buildParams(args)));
  server.tool("project_start_onpage_check", "Trigger a new on-page crawl for an Optimizer project", { project: z.string().describe("Project hash") }, async (args) => callSistrixApi("project.start.onpage.check", buildParams(args)));
}
