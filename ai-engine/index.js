import { explainAnomaly } from "./explainer.js";
import { optimizeWorkflow } from "./optimizer.js";
import { renderWorkflowSVG } from "./svgRenderer.js";

/**
 * Full AI pipeline: anomaly → explanation + workflow SVG
 * Called by backend routes when anomaly-engine emits an event.
 *
 * @param {object} anomaly - normalised anomaly from anomaly-engine
 * @returns {Promise<{
 *   rootCause: string,
 *   businessImpact: string,
 *   factors: string[],
 *   urgency: string,
 *   workflow: object,
 *   svg: string
 * }>}
 */
export async function processAnomaly(anomaly) {
  console.log(`[ai-engine] Processing anomaly: ${anomaly.metric} (${anomaly.severity})`);

  const explanation = await explainAnomaly(anomaly);
  console.log("[ai-engine] Explanation done");

  const workflow = await optimizeWorkflow(anomaly, explanation.rootCause);
  console.log("[ai-engine] Workflow optimised:", workflow.title);

  const svg = renderWorkflowSVG(workflow);
  console.log("[ai-engine] SVG rendered");

  return {
    ...explanation,
    workflow,
    svg,
  };
}

export { explainAnomaly, optimizeWorkflow, renderWorkflowSVG };