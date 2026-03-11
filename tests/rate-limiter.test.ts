import { describe, it, expect } from "vitest";
import { RateLimiter } from "../src/api/rate-limiter.js";
import { RateLimitError } from "../src/utils/errors.js";

describe("RateLimiter", () => {
  it("should allow requests within the rate limit", () => {
    const limiter = new RateLimiter(10);
    for (let i = 0; i < 10; i++) { expect(() => limiter.consume()).not.toThrow(); }
  });
  it("should throw RateLimitError when tokens are exhausted", () => {
    const limiter = new RateLimiter(3);
    limiter.consume(); limiter.consume(); limiter.consume();
    expect(() => limiter.consume()).toThrow(RateLimitError);
  });
  it("should refill tokens over time", async () => {
    const limiter = new RateLimiter(5);
    for (let i = 0; i < 5; i++) { limiter.consume(); }
    expect(() => limiter.consume()).toThrow(RateLimitError);
    await new Promise((r) => setTimeout(r, 250));
    expect(() => limiter.consume()).not.toThrow();
  });
  it("waitAndConsume should resolve after token becomes available", async () => {
    const limiter = new RateLimiter(2);
    limiter.consume(); limiter.consume();
    const start = Date.now();
    await limiter.waitAndConsume();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThan(0);
  });
});
