import { callLLM } from "./llmClient.js";
import { buildExplainerPrompt } from "./prompts.js";

/**
 * Given an anomaly event, returns a structured root cause explanation.
 * @param {object} anomaly - normalised anomaly from anomaly-engine
 * @returns {Promise<{ rootCause: string, businessImpact: string, factors: string[], urgency: string, raw: string, model: string }>}
 */
export async function explainAnomaly(anomaly) {
  const prompt = buildExplainerPrompt(anomaly);

  const raw = await callLLM(prompt, { json: false, maxTokens: 600 });

  return { ...parseExplainerResponse(raw), raw };
}

function parseExplainerResponse(text) {
  const extract = (label) => {
    const regex = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  const rootCause = extract("ROOT CAUSE");
  const businessImpact = extract("BUSINESS IMPACT");
  const urgency = extract("URGENCY");

  const factorsBlock = extract("CONTRIBUTING FACTORS");
  const factors = factorsBlock
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

  return { rootCause, businessImpact, factors, urgency };
}