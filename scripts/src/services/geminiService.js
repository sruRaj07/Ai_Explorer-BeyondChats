/**
 * Gemini service (REST) — uses the Generative Language API v1beta
 * Default model is picked from ENV.GEMINI_MODEL (gemini-2.0-flash-lite recommended)
 *
 * NOTE: If you get "location not supported" or "permission" errors,
 * enable the Gemini Developer API in Google AI Studio / Cloud and verify
 * the API key is allowed for your project/region. See docs.
 */

import axios from "axios";
import { ENV } from "../config/env.js";

const BASE = "https://generativelanguage.googleapis.com/v1beta";
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function callGemini(prompt, opts = {}) {
  const model = ENV.GEMINI_MODEL || "gemini-1.5-flash-lite";
  const apiKey = ENV.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env");

  const url = `${BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  // request body format per Generative Language docs
  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    // optional params you can tune:
    // temperature: 0.2,
    // maxOutputTokens: 200,
    // safetySettings: [...]
    ...opts
  };

  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 120000
      });

      // response shape: res.data.candidates[0].content.parts[0].text
      const candidate = res.data?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("No text returned from Gemini: " + JSON.stringify(res.data || {}));
      }

      return text;
    } catch (error) {
      lastError = error;

      // Handle rate limit (429) with exponential backoff retry
      if (error.response?.status === 429) {
        if (attempt < MAX_RETRIES) {
          const retryAfter = error.response.headers['retry-after'] || error.response.headers['Retry-After'];
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : INITIAL_RETRY_DELAY * Math.pow(2, attempt);

          console.warn(`⚠️ Rate limited (429). Retrying after ${waitTime}ms... (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
          await sleep(waitTime);
          continue;
        } else {
          const errorMsg = error.response?.data?.error?.message || error.message;
          throw new Error(`Rate limit exceeded after ${MAX_RETRIES + 1} attempts. ${errorMsg} Please wait before making more requests.`);
        }
      }

      // For other errors, throw immediately
      throw error;
    }
  }

  // Should not reach here, but just in case
  throw lastError || new Error("Failed to call Gemini API");
}