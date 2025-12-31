import { generateText } from "./services/llmService.js";

(async () => {
  const out = await generateText("Write a short HTML paragraph saying hello.");
  console.log(out);
})();