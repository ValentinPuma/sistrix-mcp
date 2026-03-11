import { describe, it, expect } from "vitest";
import { formatResponse, extractSistrixData, formatCreditsUsed } from "../src/utils/response.js";

describe("formatResponse", () => {
  it("should pass through strings", () => { expect(formatResponse("hello")).toBe("hello"); });
  it("should handle null/undefined", () => { expect(formatResponse(null)).toBe("No data returned."); expect(formatResponse(undefined)).toBe("No data returned."); });
  it("should JSON stringify objects", () => {
    const obj = { foo: "bar" };
    const result = formatResponse(obj);
    expect(result).toContain('"foo"');
    expect(JSON.parse(result)).toEqual(obj);
  });
});

describe("extractSistrixData", () => {
  it("should unwrap single-item answer array", () => {
    const response = { answer: [{ visibility: 12.5, domain: "example.com" }] };
    expect(extractSistrixData(response)).toEqual({ visibility: 12.5, domain: "example.com" });
  });
  it("should keep multi-item answer arrays intact", () => {
    const response = { answer: [{ domain: "a.com", visibility: 10 }, { domain: "b.com", visibility: 8 }] };
    expect(extractSistrixData(response)).toEqual(response.answer);
  });
  it("should return the full response if no answer field", () => {
    const response = { status: { credits: 5 } };
    expect(extractSistrixData(response)).toEqual(response);
  });
});

describe("formatCreditsUsed", () => {
  it("should format credits when present", () => {
    const result = formatCreditsUsed({ status: { credits: 5 } });
    expect(result).toContain("5"); expect(result).toContain("Credits used");
  });
  it("should return empty string when no credits info", () => { expect(formatCreditsUsed({ answer: [] })).toBe(""); });
});
