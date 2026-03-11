export class SistrixApiError extends Error {
  public readonly statusCode: number;
  public readonly endpoint: string;

  constructor(message: string, statusCode: number, endpoint: string) {
    super(message);
    this.name = "SistrixApiError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}

export class RateLimitError extends Error {
  constructor(message = "Rate limit exceeded. Please try again shortly.") {
    super(message);
    this.name = "RateLimitError";
  }
}

export class AuthenticationError extends Error {
  constructor(message = "Invalid or missing SISTRIX API key.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export function formatErrorForMcp(error: unknown): string {
  if (error instanceof SistrixApiError) {
    return `SISTRIX API Error (${error.statusCode}) on ${error.endpoint}: ${error.message}`;
  }
  if (error instanceof RateLimitError) {
    return error.message;
  }
  if (error instanceof AuthenticationError) {
    return error.message;
  }
  if (error instanceof Error) {
    return `Unexpected error: ${error.message}`;
  }
  return "An unknown error occurred.";
}
