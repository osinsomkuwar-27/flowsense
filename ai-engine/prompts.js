/**
 * Builds the root-cause explainer prompt.
 * @param {object} anomaly - anomaly event from anomaly-engine
 */
export function buildExplainerPrompt(anomaly) {
  const { metric, value, baseline, zScore, severity, source, timestamp, metadata = {} } = anomaly;

  return `You are a senior DevOps engineer analysing a workflow anomaly. Be concise and direct.

## Anomaly Detected
- Source: ${source}  (GitHub / Jira / Notion)
- Metric: ${metric}
- Observed value: ${value}
- 7-day rolling baseline: ${baseline}
- Z-score: ${zScore.toFixed(2)}
- Severity: ${severity.toUpperCase()}
- Detected at: ${timestamp}
${Object.keys(metadata).length ? `- Extra context: ${JSON.stringify(metadata)}` : ""}

## Your Task
Respond in this EXACT structure (plain text, no markdown headers):

ROOT CAUSE:
<One sentence — what specifically broke or spiked and why>

BUSINESS IMPACT:
<One sentence — what this means for the team / product / delivery>

CONTRIBUTING FACTORS:
- <factor 1>
- <factor 2>
- <factor 3 if applicable>

URGENCY:
<One sentence — how quickly this needs attention based on severity>`;
}

/**
 * Builds the workflow optimiser prompt.
 * @param {object} anomaly - anomaly event
 * @param {string} rootCause - output from explainer
 */
export function buildOptimizerPrompt(anomaly, rootCause) {
  const { metric, source, severity, metadata = {} } = anomaly;

  return `You are a workflow architect. Analyse the broken process and return an optimised workflow.

## Context
- Anomaly source: ${source}
- Broken metric: ${metric}
- Severity: ${severity}
- Root cause summary: ${rootCause}
${Object.keys(metadata).length ? `- Extra context: ${JSON.stringify(metadata)}` : ""}

## Your Task
Return ONLY a valid JSON object — no explanation, no markdown, no code fences.

The JSON must follow this exact schema:
{
  "title": "string — name of the optimised workflow",
  "problem": "string — one-line problem statement",
  "nodes": [
    {
      "id": "string — unique node id e.g. n1",
      "label": "string — short step label (max 5 words)",
      "type": "start | process | decision | end",
      "owner": "string — team or role responsible",
      "eta": "string — e.g. '2h', '1 day'"
    }
  ],
  "edges": [
    {
      "from": "string — node id",
      "to": "string — node id",
      "label": "string — optional condition e.g. 'if blocked'"
    }
  ],
  "actionPlan": [
    {
      "step": "number",
      "action": "string — concrete action",
      "owner": "string",
      "eta": "string"
    }
  ]
}

Rules:
- Minimum 4 nodes, maximum 8 nodes
- Every node must have at least one edge connecting it
- actionPlan must have 3–5 steps
- Return ONLY the JSON, nothing else`;
}