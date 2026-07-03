import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GROQ_MODEL = "llama-3.3-70b-versatile";
const GEMINI_MODEL = "gemini-2.0-flash";
const GROQ_TIMEOUT_MS = 150000;

/**
 * @param {string} prompt
 * @param {{ json?: boolean, maxTokens?: number }} options
 * @returns {Promise<string>} raw text response
 */
export async function callLLM(prompt, { json = false, maxTokens = 1500 } = {}) {
  try {
    return await callGroq(prompt, { json, maxTokens });
  } catch (groqErr) {
    console.warn("[llmClient] Groq failed, falling back to Gemini:", groqErr.message);
    try {
      return await callGemini(prompt, { json, maxTokens });
    } catch (geminiErr) {
      console.error("[llmClient] Gemini also failed:", geminiErr.message);
      throw new Error(`Both LLMs failed. Groq: ${groqErr.message} | Gemini: ${geminiErr.message}`);
    }
  }
}

async function callGroq(prompt, { json, maxTokens }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

  try {
    const response = await groq.chat.completions.create(
      {
        model: GROQ_MODEL,
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
        ...(json && { response_format: { type: "json_object" } }),
      },
      { signal: controller.signal }
    );
    return response.choices[0].message.content.trim();
  } finally {
    clearTimeout(timer);
  }
}

async function callGemini(prompt, { json, maxTokens }) {
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      maxOutputTokens: maxTokens,
      ...(json && { responseMimeType: "application/json" }),
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}