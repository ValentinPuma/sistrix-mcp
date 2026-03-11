/**
 * Format SISTRIX API response data into readable MCP text content.
 */
export function formatResponse(data: unknown): string {
  if (typeof data === "string") return data;
  if (data === null || data === undefined) return "No data returned.";
  return JSON.stringify(data, null, 2);
}

/**
 * Extract the result array/object from a SISTRIX API JSON response.
 * SISTRIX responses have the shape: { answer: [{ ... }] }
 */
export function extractSistrixData(response: Record<string, unknown>): unknown {
  if (response.answer && Array.isArray(response.answer)) {
    // If single result, unwrap
    if (response.answer.length === 1) {
      return response.answer[0];
    }
    return response.answer;
  }
  return response;
}

/**
 * Format credits info from API response.
 */
export function formatCreditsUsed(response: Record<string, unknown>): string {
  if (response.status && typeof response.status === "object") {
    const status = response.status as Record<string, unknown>;
    if (status.credits !== undefined) {
      return `\n\n---\n_Credits used for this request: ${status.credits}_`;
    }
  }
  return "";
}
