import axios from "axios";
import * as cheerioModule from "cheerio";
const cheerio = cheerioModule.default || cheerioModule;

export async function extractMainContent(url) {
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    timeout: 20000
  });

  const $ = cheerio.load(data);

  let content =
    $("article").text().trim() ||
    $("main").text().trim() ||
    $(".post-content").text().trim() ||
    $("body").text().trim() ||
    "";

  // Clean whitespace and return a small slice
  content = content.replace(/\s+/g, " ").trim();

  // Return only first ~1000 chars (keeps prompt small)
  return content.slice(0, 1000);
}