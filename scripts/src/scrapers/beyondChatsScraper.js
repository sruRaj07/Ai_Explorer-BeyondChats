import axios from "axios";
import * as cheerioModule from "cheerio";
const cheerio = cheerioModule.default || cheerioModule;
import { URL } from "url";

/**
 * Find last page of BeyondChats blogs
 */
export async function getLastPageUrl() {
  const { data } = await axios.get("https://beyondchats.com/blogs/");
  const $ = cheerio.load(data);

  const lastPage =
    $("a.page-numbers").last().attr("href") ||
    "https://beyondchats.com/blogs/";

  return lastPage;
}

/**
 * Extract article links from last page
 * - Only keep links that look like article pages (not listing / pagination)
 * - Resolve relative URLs to absolute
 */
export async function getArticleLinks(pageUrl) {
  const { data } = await axios.get(pageUrl);
  const $ = cheerio.load(data);
  const base = new URL(pageUrl).origin;

  const links = new Set();

  $("a").each((_, el) => {
    let href = $(el).attr("href");
    if (!href) return;

    // resolve to absolute
    try {
      const u = new URL(href, base).href;
      href = u;
    } catch (err) {
      return;
    }

    // skip generic listing or pagination URLs
    if (href === "https://beyondchats.com/blogs/" || href.includes("/blogs/page/")) return;

    // keep only /blogs/<something> article-style links
    // crude but effective: require '/blogs/' followed by something more (not just trailing slash)
    const path = new URL(href).pathname;
    if (!path.startsWith("/blogs/")) return;
    // now ensure there's more than just '/blogs/' (e.g. '/blogs/some-article-slug' or '/blogs/2024/...')
    if (path.replace(/^\/blogs\/?/, "") === "") return;

    links.add(href);
  });

  return [...links].slice(0, 5);
}

/**
 * Extract article title and content (with fallbacks)
 */
export async function extractArticle(url) {
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(data);

  // try common selectors first
  let title = $("h1").first().text().trim();

  // fallback to open graph or page title
  if (!title) {
    title = $('meta[property="og:title"]').attr('content') || $('title').text().trim() || "";
  }

  // content: try article container, then common classes, then fallback to body text
  let content =
    $("article").html()?.trim() ||
    $(".post-content").html()?.trim() ||
    $("main").html()?.trim() ||
    $("body").html()?.trim() ||
    "";

  // remove scripts/styles from content (basic)
  content = content.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");

  return { title, content };
}