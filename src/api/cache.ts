import { LRUCache } from "lru-cache";
import { config } from "../config.js";

export class ApiCache {
  private cache: LRUCache<string, unknown>;

  constructor(maxEntries?: number, ttlSeconds?: number) {
    this.cache = new LRUCache({
      max: maxEntries || config.CACHE_MAX_ENTRIES,
      ttl: (ttlSeconds || config.CACHE_TTL_SECONDS) * 1000,
    });
  }

  /**
   * Generate a cache key from endpoint and params.
   */
  private makeKey(
    endpoint: string,
    params: Record<string, string | number | boolean>
  ): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&");
    return `${endpoint}?${sortedParams}`;
  }

  /**
   * Get a cached value, or undefined if not cached / expired.
   */
  get<T>(
    endpoint: string,
    params: Record<string, string | number | boolean>
  ): T | undefined {
    const key = this.makeKey(endpoint, params);
    const value = this.cache.get(key);
    if (value !== undefined) {
      console.log(`⚡ Cache HIT: ${key}`);
      return value as T;
    }
    return undefined;
  }

  /**
   * Store a value in the cache.
   */
  set(
    endpoint: string,
    params: Record<string, string | number | boolean>,
    value: unknown
  ): void {
    const key = this.makeKey(endpoint, params);
    this.cache.set(key, value);
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.cache.clear();
    console.log("🗑️  Cache cleared.");
  }

  /**
   * Get cache stats.
   */
  stats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
    };
  }
}
