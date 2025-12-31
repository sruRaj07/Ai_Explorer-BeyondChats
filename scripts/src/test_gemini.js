import { callGemini } from "./services/geminiService.js";

async function test() {
  try {
    const out = await callGemini("Write a short HTML paragraph that says Hello world.");
    console.log("Gemini output:", out);
  } catch (e) {
    console.error("Gemini test failed:", e.message);
  }
}

test();