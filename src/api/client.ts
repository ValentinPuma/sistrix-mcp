import { config } from "../config.js";
import { SistrixApiError, AuthenticationError } from "../utils/errors.js";

const BASE_URL = "https://api.sistrix.com";

export interface SistrixResponse {
  answer?: unknown[];
  status?: {
    credits?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export class SistrixClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || config.SISTRIX_API_KEY;
    if (!this.apiKey || this.apiKey === "your_api_key_here") {
      console.warn(
        "⚠️  No valid SISTRIX API key configured. API calls will fail."
      );
    }
  }

  /**
   * Make a GET request to the SISTRIX API.
   * @param endpoint - API endpoint path (e.g., "domain.overview")
   * @param params - Query parameters (excluding api_key and format)
   */
  async get(
    endpoint: string,
    params: Record<string, string | number | boolean> = {}
  ): Promise<SistrixResponse> {
    const url = new URL(`${BASE_URL}/${endpoint}`);
    url.searchParams.set("api_key", this.apiKey);
    url.searchParams.set("format", "json");

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }

    try {
      const response = await fetch(url.toString());

      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError();
      }

      if (!response.ok) {
        const body = await response.text();
        throw new SistrixApiError(
          body || `HTTP ${response.status}`,
          response.status,
          endpoint
        );
      }

      const data = (await response.json()) as SistrixResponse;

      // Log credit usage
      if (data.status?.credits !== undefined) {
        console.log(`📊 [${endpoint}] Credits used: ${data.status.credits}`);
      }

      return data;
    } catch (error) {
      if (
        error instanceof SistrixApiError ||
        error instanceof AuthenticationError
      ) {
        throw error;
      }
      throw new SistrixApiError(
        error instanceof Error ? error.message : "Unknown fetch error",
        0,
        endpoint
      );
    }
  }
}
