// scripts/src/phase2_update.js
import axios from "axios";
import { ENV } from "./config/env.js";
import { googleSearch } from "./scrapers/googleSearch.js";
import { extractMainContent } from "./scrapers/articleExtractor.js";
import { rewriteArticle } from "./services/contentRewriter.js";

function sleep(ms) { return new Promise((res) => setTimeout(res, ms)); }

async function run() {
  console.log("🚀 Phase 2 started (Gemini-only, rate-limited)");

  const resp = await axios.get(`${ENV.LARAVEL_API}/articles`);
  const articles = resp.data?.data || [];

  if (!articles.length) {
    console.log("No articles found in API.");
    return;
  }

  const maxArticles = ENV.MAX_ARTICLES || 1;
  const delayMs = ENV.DELAY_MS || 10000;

  let processed = 0;

  for (const article of articles) {
    if (processed >= maxArticles) break;

    console.log(`\n🔍 Processing: ${article.title}`);

    let refs;
    try {
      refs = await googleSearch(article.title);
    } catch (err) {
      console.error("❌ Google search failed for:", article.title, err.message || err);
      continue;
    }

    if (!refs || refs.length < 2) {
      console.warn("⚠️ Not enough references for:", article.title);
      continue;
    }

    console.log("📎 References found:", refs);

    // fetch short snippets (these calls may 403; handle per-URL)
    let ref1 = "", ref2 = "";
    try {
      ref1 = await extractMainContent(refs[0]);
    } catch (e) {
      console.warn("⚠️ Failed to fetch reference 1:", refs[0], e.message || e);
      // continue but try second ref
    }
    try {
      ref2 = await extractMainContent(refs[1]);
    } catch (e) {
      console.warn("⚠️ Failed to fetch reference 2:", refs[1], e.message || e);
    }

    try {
      const updatedHtml = await rewriteArticle(article.original_content, ref1, ref2, refs);

      await axios.put(`${ENV.LARAVEL_API}/articles/${article.id}`, {
        updated_content: updatedHtml,
        references: refs
      });

      console.log(`✅ Updated: ${article.title}`);
      processed++;
    } catch (err) {
      const msg = err?.response?.data || err.message || err;
      console.error("❌ Failed processing article:", msg);

      // If quota/rate error then abort further processing
      const lower = String(msg).toLowerCase();
      if (lower.includes("quota") || lower.includes("rate") || lower.includes("limit")) {
        console.error("⚠️ Quota or rate limit detected — aborting further processing. Check Gemini quotas in Google Cloud Console.");
        break;
      }

      // If it's a bad request due to prompt size/invalid model, log and skip
      if (err?.response?.status === 400 || err?.response?.status === 413 || err?.response?.status === 422) {
        console.error("⚠️ Bad request from Gemini (likely prompt too large or invalid model) — skipping this article.");
        continue;
      }
    }

    // rate-limit delay between articles
    if (processed < maxArticles) {
      console.log(`⏳ Waiting ${delayMs}ms before next article...`);
      await sleep(delayMs);
    }
  }

  console.log("\n🎉 Phase 2 finished (limited-run). Increase MAX_ARTICLES/DELAY_MS when ready.");
}

run();