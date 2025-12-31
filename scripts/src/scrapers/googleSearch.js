import axios from "axios";
import { ENV } from "../config/env.js";

export async function googleSearch(query) {
  const res = await axios.get("https://serpapi.com/search", {
    params: {
      q: query,
      engine: "google",
      api_key: ENV.SERPAPI_KEY,
      num: 5
    }
  });

  // extract only organic blog/article links
  const results = res.data.organic_results || [];
  return results
    .map(r => r.link)
    .filter(Boolean)
    .slice(0, 2); // top 2
}