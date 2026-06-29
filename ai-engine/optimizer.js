import { callLLM } from "./llmClient.js";
import { buildOptimizerPrompt } from "./prompts.js";

/**
 * Given an anomaly + root cause, returns a structured workflow + action plan.
 * @param {object} anomaly
 * @param {string} rootCause - from explainer.js
 * @returns {Promise<{ title, problem, nodes, edges, actionPlan }>}
 */
export async function optimizeWorkflow(anomaly, rootCause) {
  const prompt = buildOptimizerPrompt(anomaly, rootCause);

  const raw = await callLLM(prompt, { json: true, maxTokens: 1500 });

  return parseOptimizerResponse(raw);
}

function parseOptimizerResponse(raw) {
  let parsed;

  try {
    const clean = raw.replace(/```json|```/gi, "").trim();
    parsed = JSON.parse(clean);
  } catch (err) {
    throw new Error(`[optimizer] Failed to parse workflow JSON: ${err.message}\nRaw: ${raw.slice(0, 300)}`);
  }

  const required = ["title", "problem", "nodes", "edges", "actionPlan"];
  for (const key of required) {
    if (!parsed[key]) throw new Error(`[optimizer] Missing required field: ${key}`);
  }

  if (!Array.isArray(parsed.nodes) || parsed.nodes.length < 4) {
    throw new Error("[optimizer] nodes must be an array with at least 4 items");
  }

  if (!Array.isArray(parsed.actionPlan) || parsed.actionPlan.length < 3) {
    throw new Error("[optimizer] actionPlan must have at least 3 steps");
  }

  return parsed;
}