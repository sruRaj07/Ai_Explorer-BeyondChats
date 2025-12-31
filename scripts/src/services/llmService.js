// scripts/src/services/llmService.js
import axios from "axios";
import { ENV } from "../config/env.js";

const BASE = "https://generativelanguage.googleapis.com/v1beta";

function sleep(ms) { return new Promise((res) => setTimeout(res, ms)); }

function isQuotaError(err) {
  const status = err?.response?.status;
  const dataMsg = err?.response?.data?.error?.message || "";
  if (status === 429) return true;
  if (/quota|exceeded|quota_exceeded|insufficient_quota/i.test(dataMsg)) return true;
  return false;
}

function isBadRequest(err) {
  const status = err?.response?.status;
  return status === 400 || status === 413 || status === 422;
}

async function callGeminiOnce(prompt, opts = {}) {
  if (!ENV.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  const model = ENV.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `${BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(ENV.GEMINI_API_KEY)}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: opts.maxOutputTokens ?? Number(process.env.MAX_OUTPUT_TOKENS) ?? 1200,
      temperature: opts.temperature ?? 0.12,
      // add other safe options if needed
    }
  };

  const res = await axios.post(url, body, {
    headers: { "Content-Type": "application/json" },
    timeout: 180000
  });

  const candidate = res.data?.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No text returned from Gemini: " + JSON.stringify(res.data || {}));
  }
  return text;
}

/**
 * generateText(prompt, opts)
 * - single Gemini attempt with one gentle retry for transient errors
 * - abort on quota/bad-request (so you can inspect)
 */
export async function generateText(prompt, opts = {}) {
  let attempt = 0;
  const maxAttempts = 2;
  let delay = 1500;

  while (attempt < maxAttempts) {
    attempt++;
    try {
      console.log(`🤖 Gemini attempt ${attempt} (model: ${ENV.GEMINI_MODEL})`);
      const out = await callGeminiOnce(prompt, opts);
      return out;
    } catch (err) {
      if (isBadRequest(err)) {
        console.error("❌ Gemini bad request (400/413/422). Prompt or model likely invalid:", err.response?.data || err.message);
        throw err;
      }
      if (isQuotaError(err)) {
        console.warn("⚠️ Gemini quota/rate error:", err.response?.data?.error?.message || err.message);
        if (attempt < maxAttempts) {
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await sleep(delay);
          delay *= 2;
          continue;
        } else {
          throw new Error("Gemini quota/rate limit encountered — aborting to avoid further requests.");
        }
      }
      console.warn("⚠️ Gemini transient error:", err.message || err);
      if (attempt < maxAttempts) {
        await sleep(delay);
        delay *= 2;
        continue;
      } else {
        throw err;
      }
    }
  }

  throw new Error("Failed to generate text via Gemini after retries.");
}