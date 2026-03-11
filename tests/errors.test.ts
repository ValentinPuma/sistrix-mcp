import { describe, it, expect } from "vitest";
import { SistrixApiError, RateLimitError, AuthenticationError, formatErrorForMcp } from "../src/utils/errors.js";

describe("Error Classes", () => {
  it("SistrixApiError should store statusCode and endpoint", () => {
    const err = new SistrixApiError("Not found", 404, "domain.overview");
    expect(err.message).toBe("Not found"); expect(err.statusCode).toBe(404); expect(err.endpoint).toBe("domain.overview"); expect(err.name).toBe("SistrixApiError");
  });
  it("RateLimitError should have default message", () => { const err = new RateLimitError(); expect(err.message).toContain("Rate limit"); expect(err.name).toBe("RateLimitError"); });
  it("AuthenticationError should have default message", () => { const err = new AuthenticationError(); expect(err.message).toContain("API key"); expect(err.name).toBe("AuthenticationError"); });
});

describe("formatErrorForMcp", () => {
  it("should format SistrixApiError", () => { const err = new SistrixApiError("Bad request", 400, "keyword.seo"); const result = formatErrorForMcp(err); expect(result).toContain("400"); expect(result).toContain("keyword.seo"); expect(result).toContain("Bad request"); });
  it("should format RateLimitError", () => { expect(formatErrorForMcp(new RateLimitError("Too fast!"))).toBe("Too fast!"); });
  it("should format AuthenticationError", () => { expect(formatErrorForMcp(new AuthenticationError("No key"))).toBe("No key"); });
  it("should format generic Error", () => { expect(formatErrorForMcp(new Error("Something went wrong"))).toContain("Something went wrong"); });
  it("should handle non-Error values", () => { expect(formatErrorForMcp("string error")).toContain("unknown error"); expect(formatErrorForMcp(42)).toContain("unknown error"); });
});
