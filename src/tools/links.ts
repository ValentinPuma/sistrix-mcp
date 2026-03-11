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

const linksOptionalParams = {
  num: z.number().optional().describe("Number of results to return"),
  offset: z.number().optional().describe("Offset for pagination"),
};

export function registerLinksTools(server: McpServer): void {
  server.tool("links_overview", "Get a backlink profile overview for a domain — total links, referring domains, etc.", { domain: z.string().describe("Domain to analyze (e.g., 'example.com')") }, async (args) => callSistrixApi("links.overview", buildParams(args)));
  server.tool("links_list", "Get a list of individual backlinks pointing to a domain", { domain: z.string().describe("Domain to get backlinks for"), ...linksOptionalParams }, async (args) => callSistrixApi("links.list", buildParams(args)));
  server.tool("links_linktargets", "Get the most linked-to target URLs on a domain", { domain: z.string().describe("Domain to analyze"), ...linksOptionalParams }, async (args) => callSistrixApi("links.linktargets", buildParams(args)));
  server.tool("links_linktexts", "Get anchor text distribution for backlinks to a domain", { domain: z.string().describe("Domain to analyze"), ...linksOptionalParams }, async (args) => callSistrixApi("links.linktexts", buildParams(args)));
}
