// scripts/src/services/contentRewriter.js
import { generateText } from "./llmService.js";

function truncateText(s, n = 1200) {
  if (!s) return "";
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n) + "..." : t;
}

/**
 * Aim: produce a publication-ready HTML article (~700-1200 words)
 */
export async function rewriteArticle(original, ref1, ref2, refUrls) {
  const originalSnippet = truncateText(original, 2200); // allow more original context
  const ref1Snip = truncateText(ref1, 1000);
  const ref2Snip = truncateText(ref2, 1000);

  const prompt = `
You are a professional copy editor and content writer with SEO experience.

GOAL:
Rewrite the ORIGINAL ARTICLE into a high-quality, publication-ready HTML article suitable for a technical blog.
Produce the final article only (no commentary, no JSON).

STYLE & STRUCTURE REQUIREMENTS:
1. Title (use the original title or improve it if needed).
2. A one-line subtitle (optional).
3. A short "TL;DR" summary (1-2 sentences).
4. A meta description (max 160 characters) as an HTML comment: <!-- meta: ... -->
5. Use clear H2 and H3 headings, and short paragraphs (< 4 sentences).
6. Use bullet lists where appropriate.
7. Include a "Conclusion" section.
8. Include a "References" section at the end with the provided reference URLs.
9. Keep the voice neutral, authoritative, and helpful.
10. Preserve the original meaning and facts, but improve clarity and flow.
11. Target length: approximately 700–1200 words (aim for this; don't be excessively long).

INPUTS:
ORIGINAL ARTICLE:
${originalSnippet}

REFERENCE 1 (short excerpt):
${ref1Snip}

REFERENCE 2 (short excerpt):
${ref2Snip}

REFERENCES:
${refUrls.map((u) => "- " + u).join("\n")}

OUTPUT RULES:
- Output only valid HTML content (start from <article>...</article> or at least <h1> ...).
- At the very top, include the meta description as an HTML comment:
  <!-- meta: <your meta description here> -->
- At the very end include:
  <section id="references"><h2>References</h2><ul>...links...</ul></section>
- Do not include any non-HTML text outside the HTML.
- Make sure HTML is well-formed and uses semantic tags (<h1>, <h2>, <p>, <ul>, <li>, <strong>, <em>, <figure> if images, etc.)

Now rewrite the article according to the above.
`;

  return generateText(prompt, {
    maxOutputTokens: Number(process.env.MAX_OUTPUT_TOKENS) || 1400,
    temperature: 0.08
  });
}