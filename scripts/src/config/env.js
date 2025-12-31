import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  LARAVEL_API: process.env.LARAVEL_API || "http://127.0.0.1:8000/api",
  SERPAPI_KEY: process.env.SERPAPI_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  // controls for rate limiting / testing
  MAX_ARTICLES: Number(process.env.MAX_ARTICLES || 1),
  DELAY_MS: Number(process.env.DELAY_MS || 10000)
};