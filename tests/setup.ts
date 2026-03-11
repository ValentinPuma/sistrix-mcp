/**
 * Test setup: set env vars BEFORE any source module is imported,
 * so config.ts doesn't exit on missing SISTRIX_API_KEY.
 */
process.env.SISTRIX_API_KEY = "test_key_for_unit_tests";
process.env.PORT = "3999";
process.env.CACHE_TTL_SECONDS = "60";
process.env.CACHE_MAX_ENTRIES = "100";
process.env.RATE_LIMIT_RPS = "50";
process.env.NODE_ENV = "development";
