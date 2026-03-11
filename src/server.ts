import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SistrixClient, type SistrixResponse } from "./api/client.js";
import { ApiCache } from "./api/cache.js";
import { RateLimiter } from "./api/rate-limiter.js";
import { extractSistrixData, formatResponse, formatCreditsUsed } from "./utils/response.js";
import { formatErrorForMcp } from "./utils/errors.js";

// Shared instances
export const sistrixClient = new SistrixClient();
export const cache = new ApiCache();
export const rateLimiter = new RateLimiter();

/**
 * Helper to make a cached, rate-limited SISTRIX API call.
 * Used by all tool handlers.
 */
export async function callSistrixApi(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
  try {
    // Check cache first
    const cached = cache.get<SistrixResponse>(endpoint, params);
    if (cached) {
      const data = extractSistrixData(cached as Record<string, unknown>);
      return {
        content: [
          {
            type: "text" as const,
            text: formatResponse(data) + "\n\n_[cached result]_",
          },
        ],
      };
    }

    // Rate limit
    await rateLimiter.waitAndConsume();

    // Call API
    const response = await sistrixClient.get(endpoint, params);

    // Cache result
    cache.set(endpoint, params, response);

    // Format
    const data = extractSistrixData(response as Record<string, unknown>);
    const creditsInfo = formatCreditsUsed(response as Record<string, unknown>);

    return {
      content: [
        {
          type: "text" as const,
          text: formatResponse(data) + creditsInfo,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: formatErrorForMcp(error),
        },
      ],
      isError: true,
    };
  }
}

/**
 * Create and configure the MCP server with all tools.
 */
export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "sistrix-mcp",
    version: "1.0.0",
  });

  return server;
}
