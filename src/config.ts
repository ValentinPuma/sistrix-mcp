import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const configSchema = z.object({
  SISTRIX_API_KEY: z.string().min(1, "SISTRIX_API_KEY is required"),
  PORT: z.coerce.number().default(3000),
  CACHE_TTL_SECONDS: z.coerce.number().default(300),
  CACHE_MAX_ENTRIES: z.coerce.number().default(500),
  RATE_LIMIT_RPS: z.coerce.number().default(10),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export type Config = z.infer<typeof configSchema>;

function loadConfig(): Config {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid configuration:");
    for (const issue of result.error.issues) {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }
  return result.data;
}

export const config = loadConfig();
