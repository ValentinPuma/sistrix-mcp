import { config } from "../config.js";
import { RateLimitError } from "../utils/errors.js";

/**
 * Simple token-bucket rate limiter.
 * Limits the number of API requests per second to respect SISTRIX fair-use policy.
 */
export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number; // tokens per ms
  private lastRefill: number;

  constructor(requestsPerSecond?: number) {
    const rps = requestsPerSecond || config.RATE_LIMIT_RPS;
    this.maxTokens = rps;
    this.tokens = rps;
    this.refillRate = rps / 1000; // tokens per millisecond
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }

  /**
   * Consume one token. Throws RateLimitError if no tokens available.
   */
  consume(): void {
    this.refill();
    if (this.tokens < 1) {
      throw new RateLimitError(
        `Rate limit exceeded (${this.maxTokens} req/s). Please wait a moment.`
      );
    }
    this.tokens -= 1;
  }

  /**
   * Wait until a token is available, then consume it.
   */
  async waitAndConsume(): Promise<void> {
    this.refill();
    if (this.tokens < 1) {
      const waitMs = Math.ceil((1 - this.tokens) / this.refillRate);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      this.refill();
    }
    this.tokens -= 1;
  }
}
