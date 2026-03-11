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

const aiOptionalParams = {
  country: z.string().optional().describe("Country code (e.g., 'de', 'us')"),
  num: z.number().optional().describe("Number of results to return"),
  offset: z.number().optional().describe("Offset for pagination"),
};

export function registerAiTools(server: McpServer): void {
  server.tool("ai_models", "Get a list of available AI models tracked by SISTRIX", {}, async () => callSistrixApi("ai.models"));
  server.tool("ai_entity_overview", "Get an overview of how entity/brand appears in AI-generated results", { domain: z.string().describe("Domain/entity to analyze"), ...aiOptionalParams }, async (args) => callSistrixApi("ai.entity.overview", buildParams(args)));
  server.tool("ai_entity_competition", "See which competitors appear alongside your entity in AI results", { domain: z.string().describe("Domain/entity to analyze"), ...aiOptionalParams }, async (args) => callSistrixApi("ai.entity.competition", buildParams(args)));
  server.tool("ai_entity_environment", "Get the environment/context in which an entity appears in AI results", { domain: z.string().describe("Domain/entity to analyze"), ...aiOptionalParams }, async (args) => callSistrixApi("ai.entity.environment", buildParams(args)));
  server.tool("ai_entity_prompts", "Get the prompts/questions that mention a specific entity in AI results", { domain: z.string().describe("Domain/entity to analyze"), ...aiOptionalParams }, async (args) => callSistrixApi("ai.entity.prompts", buildParams(args)));
  server.tool("ai_entity_prompts_count", "Get the count of prompts mentioning an entity in AI results", { domain: z.string().describe("Domain/entity to analyze"), ...aiOptionalParams }, async (args) => callSistrixApi("ai.entity.prompts.count", buildParams(args)));
  server.tool("ai_entity_sources", "Get the sources cited by AI models when mentioning an entity", { domain: z.string().describe("Domain/entity to analyze"), ...aiOptionalParams }, async (args) => callSistrixApi("ai.entity.sources", buildParams(args)));
  server.tool("ai_prompt_answers", "Get AI-generated answers for specific prompts across models", { prompt: z.string().describe("The prompt/question to look up"), ...aiOptionalParams }, async (args) => callSistrixApi("ai.prompt.answers", buildParams(args)));
  server.tool("ai_top_brands", "Get the top brands most frequently mentioned in AI results", { ...aiOptionalParams }, async (args) => callSistrixApi("ai.top.brands", buildParams(args)));
  server.tool("ai_top_entities", "Get the top entities most frequently mentioned in AI results", { ...aiOptionalParams }, async (args) => callSistrixApi("ai.top.entities", buildParams(args)));
  server.tool("ai_top_sources", "Get the top sources most frequently cited in AI results", { ...aiOptionalParams }, async (args) => callSistrixApi("ai.top.sources", buildParams(args)));
}
