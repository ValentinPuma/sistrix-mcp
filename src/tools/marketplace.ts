import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { callSistrixApi } from "../server.js";

function buildParams(args: Record<string, unknown>): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(args)) {
    if (value !== undefined && value !== null) {
      params[key] = value as string | number | boolean;
    }
  }
  return params;
}

const mpOptionalParams = {
  country: z.string().optional().describe("Marketplace country code (e.g., 'de', 'us')"),
  num: z.number().optional().describe("Number of results to return"),
  offset: z.number().optional().describe("Offset for pagination"),
};

export function registerMarketplaceTools(server: McpServer): void {
  server.tool("marketplace_product", "Get details for a specific Amazon product by ASIN", { asin: z.string().describe("Amazon ASIN"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.product", buildParams(args)));
  server.tool("marketplace_product_overview", "Get an overview of an Amazon product", { asin: z.string().describe("Amazon ASIN"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.product.overview", buildParams(args)));
  server.tool("marketplace_product_keywords", "Get keywords that an Amazon product ranks for", { asin: z.string().describe("Amazon ASIN"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.product.keywords", buildParams(args)));
  server.tool("marketplace_product_bestsellers", "Get bestseller rankings for an Amazon product", { asin: z.string().describe("Amazon ASIN"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.product.bestsellers", buildParams(args)));
  server.tool("marketplace_product_price", "Get price history for an Amazon product", { asin: z.string().describe("Amazon ASIN"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.product.price", buildParams(args)));
  server.tool("marketplace_product_reviews", "Get review data for an Amazon product", { asin: z.string().describe("Amazon ASIN"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.product.reviews", buildParams(args)));
  server.tool("marketplace_sales_overview", "Get sales overview data for Amazon marketplace", { ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.sales.overview", buildParams(args)));
  server.tool("marketplace_brand_sellers", "Get sellers for a specific brand on Amazon", { brand: z.string().describe("Brand name"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.brand.sellers", buildParams(args)));
  server.tool("marketplace_category_products", "Get products in a specific Amazon category", { category: z.string().describe("Category ID or path"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.category.products", buildParams(args)));
  server.tool("marketplace_keyword_environment", "Get the keyword environment/context on Amazon", { kw: z.string().describe("Keyword to analyze"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.keyword.environment", buildParams(args)));
  server.tool("marketplace_keyword_search_ideas", "Get keyword search ideas/suggestions on Amazon", { kw: z.string().describe("Seed keyword"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.keyword.search.ideas", buildParams(args)));
  server.tool("marketplace_keyword_traffic", "Get traffic data for a keyword on Amazon", { kw: z.string().describe("Keyword to analyze"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.keyword.traffic", buildParams(args)));
  server.tool("marketplace_serp_history", "Get SERP history for a keyword on Amazon", { kw: z.string().describe("Keyword to analyze"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.serp.history", buildParams(args)));
  server.tool("marketplace_visibility_list", "Get a list of marketplace visibility data", { ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.visibility.list", buildParams(args)));
  server.tool("marketplace_visibility_brand", "Get visibility index for a brand on Amazon", { brand: z.string().describe("Brand name"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.visindex.brand", buildParams(args)));
  server.tool("marketplace_visibility_product", "Get visibility index for a product on Amazon", { asin: z.string().describe("Amazon ASIN"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.visindex.product", buildParams(args)));
  server.tool("marketplace_visibility_seller", "Get visibility index for a seller on Amazon", { seller: z.string().describe("Seller ID"), ...mpOptionalParams }, async (args) => callSistrixApi("marketplace.visindex.seller", buildParams(args)));
}
