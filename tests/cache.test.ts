import { describe, it, expect } from "vitest";
import { ApiCache } from "../src/api/cache.js";

describe("ApiCache", () => {
  it("should return undefined for cache miss", () => {
    const cache = new ApiCache(100, 60);
    const result = cache.get("domain.overview", { domain: "example.com" });
    expect(result).toBeUndefined();
  });
  it("should return cached value on cache hit", () => {
    const cache = new ApiCache(100, 60);
    const data = { answer: [{ visibility: 12.5 }] };
    cache.set("domain.overview", { domain: "example.com" }, data);
    const result = cache.get("domain.overview", { domain: "example.com" });
    expect(result).toEqual(data);
  });
  it("should generate same key regardless of param insertion order", () => {
    const cache = new ApiCache(100, 60);
    const data = { answer: [{ visibility: 12.5 }] };
    cache.set("domain.overview", { domain: "example.com", country: "de" }, data);
    const result = cache.get("domain.overview", { country: "de", domain: "example.com" });
    expect(result).toEqual(data);
  });
  it("should not cross-contaminate between different endpoints", () => {
    const cache = new ApiCache(100, 60);
    const data1 = { answer: [{ visibility: 12.5 }] };
    const data2 = { answer: [{ keywords: 500 }] };
    cache.set("domain.overview", { domain: "example.com" }, data1);
    cache.set("domain.kwcount.seo", { domain: "example.com" }, data2);
    expect(cache.get("domain.overview", { domain: "example.com" })).toEqual(data1);
    expect(cache.get("domain.kwcount.seo", { domain: "example.com" })).toEqual(data2);
  });
  it("should not cross-contaminate between different param values", () => {
    const cache = new ApiCache(100, 60);
    const data1 = { answer: [{ visibility: 12.5 }] };
    const data2 = { answer: [{ visibility: 8.0 }] };
    cache.set("domain.overview", { domain: "example.com" }, data1);
    cache.set("domain.overview", { domain: "other.com" }, data2);
    expect(cache.get("domain.overview", { domain: "example.com" })).toEqual(data1);
    expect(cache.get("domain.overview", { domain: "other.com" })).toEqual(data2);
  });
  it("should clear all entries", () => {
    const cache = new ApiCache(100, 60);
    cache.set("domain.overview", { domain: "a.com" }, { answer: [] });
    cache.set("domain.overview", { domain: "b.com" }, { answer: [] });
    cache.clear();
    expect(cache.get("domain.overview", { domain: "a.com" })).toBeUndefined();
    expect(cache.get("domain.overview", { domain: "b.com" })).toBeUndefined();
    expect(cache.stats().size).toBe(0);
  });
  it("should report correct stats", () => {
    const cache = new ApiCache(100, 60);
    expect(cache.stats().size).toBe(0);
    expect(cache.stats().maxSize).toBe(100);
    cache.set("credits", {}, { answer: [] });
    expect(cache.stats().size).toBe(1);
  });
});
