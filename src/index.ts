import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createServer } from "http";
import { config } from "./config.js";
import { createMcpServer } from "./server.js";
import { registerAllTools } from "./tools/index.js";

const mcpServer = createMcpServer();
registerAllTools(mcpServer);

// Track active transports for cleanup
const transports = new Map<string, SSEServerTransport>();

const httpServer = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  // Health check
  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", version: "1.0.0" }));
    return;
  }

  // SSE endpoint — client connects here to establish MCP session
  if (url.pathname === "/sse") {
    console.log("🔌 New SSE connection");
    const transport = new SSEServerTransport("/messages", res);
    const sessionId = transport.sessionId;
    transports.set(sessionId, transport);

    res.on("close", () => {
      console.log(`🔌 SSE connection closed: ${sessionId}`);
      transports.delete(sessionId);
    });

    await mcpServer.connect(transport);
    return;
  }

  // Messages endpoint — client sends MCP messages here
  if (url.pathname === "/messages") {
    const sessionId = url.searchParams.get("sessionId");
    if (!sessionId || !transports.has(sessionId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid or missing sessionId" }));
      return;
    }

    const transport = transports.get(sessionId)!;
    await transport.handlePostMessage(req, res);
    return;
  }

  // Root — basic info
  if (url.pathname === "//") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        name: "sistrix-mcp",
        version: "1.0.0",
        description: "Custom SISTRIX MCP Server — full API coverage",
        endpoints: {
          sse: "/sse",
          messages: "/messages",
          health: "/health",
        },
      })
    );
    return;
  }

  // 404
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

httpServer.listen(config.PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║         SISTRIX MCP Server v1.0.0                  ║
╠════════════════════════════════════════════════════╣
║  SSE endpoint:    http://localhost:${config.PORT}/sse       ║
║  Health check:    http://localhost:${config.PORT}/health     ║
║  Environment:     ${config.NODE_ENV.padEnd(30)}║
╚════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...");
  for (const [id, transport] of transports) {
    transports.delete(id);
  }
  httpServer.close(() => {
    console.log("👋 Server stopped.");
    process.exit(0);
  });
});
