import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { callSistrixApi } from "../server.js";

export function registerCreditsTools(server: McpServer): void {
  server.tool(
    "credit_status",
    "Check your remaining SISTRIX API credits and usage",
    {},
    async () => {
      return callSistrixApi("credits");
    }
  );
}
