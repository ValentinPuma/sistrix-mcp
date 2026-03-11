import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMockResponse } from "./mocks.js";

describe("MCP Server & Tools", () => {
  beforeEach(() => { vi.restoreAllMocks(); });
  it("should create an MCP server with correct metadata", async () => { const { createMcpServer } = await import("../src/server.js"); const server = createMcpServer(); expect(server).toBeDefined(); });
  it("should register all tool modules without error", async () => { const { createMcpServer } = await import("../src/server.js"); const { registerAllTools } = await import("../src/tools/index.js"); const server = createMcpServer(); expect(() => registerAllTools(server)).not.toThrow(); });
  it("callSistrixApi should return formatted data on success", async () => {
    const mockData = getMockResponse("credits");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(mockData) }));
    const { callSistrixApi } = await import("../src/server.js");
    const result = await callSistrixApi("credits");
    expect(result.isError).toBeUndefined(); expect(result.content).toHaveLength(1); expect(result.content[0].text).toContain("45000");
  });
  it("callSistrixApi should return error on 401", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401, text: () => Promise.resolve("Unauthorized") }));
    const { callSistrixApi } = await import("../src/server.js");
    const result = await callSistrixApi("domain.overview", { domain: "test.com" });
    expect(result.isError).toBe(true); expect(result.content[0].text).toContain("API key");
  });
  it("callSistrixApi should return cached result on second call", async () => {
    const mockData = getMockResponse("domain.overview");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(mockData) }));
    const { callSistrixApi, cache } = await import("../src/server.js");
    cache.clear();
    await callSistrixApi("domain.overview", { domain: "cached-test.com" });
    const result2 = await callSistrixApi("domain.overview", { domain: "cached-test.com" });
    expect(result2.content[0].text).toContain("cached result");
  });
  it("callSistrixApi should handle network errors gracefully", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network timeout")));
    const { callSistrixApi, cache } = await import("../src/server.js");
    cache.clear();
    const result = await callSistrixApi("domain.overview", { domain: "fail.com" });
    expect(result.isError).toBe(true); expect(result.content[0].text).toContain("Network timeout");
  });
});

describe("Mock Responses", () => {
  it("should return defined mocks for known endpoints", () => {
    for (const ep of ["credits", "domain.overview", "domain.visibilityindex", "keyword.seo.metrics", "links.overview", "ai.entity.overview"]) {
      const response = getMockResponse(ep); expect(response.answer).toBeDefined(); expect(Array.isArray(response.answer)).toBe(true);
    }
  });
  it("should return generic mock for unknown endpoints", () => { const response = getMockResponse("nonexistent.endpoint"); expect(response.answer).toBeDefined(); expect(response.answer![0]).toHaveProperty("message"); });
});
