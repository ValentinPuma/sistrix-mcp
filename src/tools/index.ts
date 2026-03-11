import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerCreditsTools } from "./credits.js";
import { registerDomainTools } from "./domain.js";
import { registerKeywordTools } from "./keyword.js";
import { registerLinksTools } from "./links.js";
import { registerAiTools } from "./ai.js";
import { registerAiTrackerTools } from "./ai-tracker.js";
import { registerProjectTools } from "./project.js";
import { registerMarketplaceTools } from "./marketplace.js";
import { registerCompoundTools } from "./compound.js";

export function registerAllTools(server: McpServer): void {
  registerCreditsTools(server);
  registerDomainTools(server);
  registerKeywordTools(server);
  registerLinksTools(server);
  registerAiTools(server);
  registerAiTrackerTools(server);
  registerProjectTools(server);
  registerMarketplaceTools(server);
  registerCompoundTools(server);
  console.log("✅ All tool modules registered.");
}
