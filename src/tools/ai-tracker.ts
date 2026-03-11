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

const trackerOptionalParams = {
  num: z.number().optional().describe("Number of results to return"),
  offset: z.number().optional().describe("Offset for pagination"),
};

export function registerAiTrackerTools(server: McpServer): void {
  server.tool("ai_tracker_overview", "Get an overview of your AI tracker project — tracked prompts and visibility", { project: z.string().describe("AI tracker project hash"), ...trackerOptionalParams }, async (args) => callSistrixApi("ai.tracker.overview", buildParams(args)));
  server.tool("ai_tracker_competitors", "Get competitors in your AI tracker project", { project: z.string().describe("AI tracker project hash"), ...trackerOptionalParams }, async (args) => callSistrixApi("ai.tracker.competitors", buildParams(args)));
  server.tool("ai_tracker_environment", "Get the AI environment/context for your tracker project", { project: z.string().describe("AI tracker project hash"), ...trackerOptionalParams }, async (args) => callSistrixApi("ai.tracker.environment", buildParams(args)));
  server.tool("ai_tracker_prompts", "Get tracked prompts in your AI tracker project", { project: z.string().describe("AI tracker project hash"), ...trackerOptionalParams }, async (args) => callSistrixApi("ai.tracker.prompts", buildParams(args)));
  server.tool("ai_tracker_sources_domains", "Get source domains cited in AI results for your tracker project", { project: z.string().describe("AI tracker project hash"), ...trackerOptionalParams }, async (args) => callSistrixApi("ai.tracker.sources.domains", buildParams(args)));
  server.tool("ai_tracker_sources_hosts", "Get source hosts cited in AI results for your tracker project", { project: z.string().describe("AI tracker project hash"), ...trackerOptionalParams }, async (args) => callSistrixApi("ai.tracker.sources.hosts", buildParams(args)));
  server.tool("ai_tracker_sources_urls", "Get source URLs cited in AI results for your tracker project", { project: z.string().describe("AI tracker project hash"), ...trackerOptionalParams }, async (args) => callSistrixApi("ai.tracker.sources.urls", buildParams(args)));
}
