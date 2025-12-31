import { getLastPageUrl, getArticleLinks, extractArticle } from "./scrapers/beyondChatsScraper.js";
import { saveArticle } from "./services/laravelApi.js";
import { makeSlug } from "./utils/slugify.js";

async function run() {
  try {
    console.log("🔍 Finding last blog page...");
    const lastPage = await getLastPageUrl();

    console.log("📄 Last Page:", lastPage);
    const links = await getArticleLinks(lastPage);

    if (!links.length) {
      console.log("⚠️ No article links found on last page. Exiting.");
      return;
    }

    for (const link of links) {
      console.log("📝 Scraping:", link);
      const article = await extractArticle(link);

      if (!article.title || article.title.length < 3) {
        console.warn("⚠️ Skipping — no title extracted for:", link);
        continue; // skip this one and continue with next
      }

      const payload = {
        title: article.title,
        slug: makeSlug(article.title),
        source_url: link,
        original_content: article.content || article.title, // ensure something non-empty
        scraped_at: new Date().toISOString()
      };

      try {
        await saveArticle(payload);
        console.log("✅ Saved:", article.title);
      } catch (err) {
        console.error("❌ Save failed for:", link);
        console.error(err.response?.data || err.message);
      }
    }

    console.log("🎉 Phase 1 scraping completed!");
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

run();