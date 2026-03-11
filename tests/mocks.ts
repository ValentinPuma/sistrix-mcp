import type { SistrixResponse } from "../src/api/client.js";

export const mockResponses: Record<string, SistrixResponse> = {
  credits: { answer: [{ credits: 45000, credits_used: 5000 }], status: { credits: 0 } },
  "domain.overview": { answer: [{ domain: "example.com", visibilityindex: 12.345, kwcount: { seo: 8500, sem: 320 }, traffic: { estimation: 125000 }, age: "2005-03-15" }], status: { credits: 1 } },
  "domain.visibilityindex": { answer: [{ date: "2026-03-03", value: 12.1 }, { date: "2026-03-10", value: 12.345 }], status: { credits: 1 } },
  "domain.competitors.seo": { answer: [{ domain: "competitor1.com", visibility: 8.5, match: 0.45 }, { domain: "competitor2.com", visibility: 6.2, match: 0.38 }], status: { credits: 5 } },
  "domain.kwcount.seo": { answer: [{ value: 8500 }], status: { credits: 1 } },
  "domain.ranking.distribution": { answer: [{ "1-3": 120, "4-10": 450, "11-20": 980, "21-50": 3200, "51-100": 3750 }], status: { credits: 1 } },
  "links.overview": { answer: [{ total: 125000, domains_from: 3400, ips_from: 2800, networks_from: 1200, class_c: 950 }], status: { credits: 1 } },
  "keyword.seo.metrics": { answer: [{ kw: "seo tools", search_volume: 12100, cpc: 4.5, competition: 0.85, results: 450000000 }], status: { credits: 1 } },
  "keyword.seo.searchintent": { answer: [{ kw: "seo tools", intent: "commercial", probability: 0.78 }], status: { credits: 1 } },
  "keyword.questions": { answer: [{ question: "What are the best SEO tools?" }, { question: "How much do SEO tools cost?" }, { question: "Are free SEO tools any good?" }], status: { credits: 1 } },
  "ai.entity.overview": { answer: [{ domain: "example.com", mentions: 45, models: ["chatgpt", "claude", "gemini"] }], status: { credits: 5 } },
  "ai.top.brands": { answer: [{ brand: "example.com", mentions: 45 }, { brand: "competitor.com", mentions: 32 }], status: { credits: 5 } },
};

export function getMockResponse(endpoint: string): SistrixResponse {
  return mockResponses[endpoint] || { answer: [{ message: `Mock data for ${endpoint}` }], status: { credits: 1 } };
}
