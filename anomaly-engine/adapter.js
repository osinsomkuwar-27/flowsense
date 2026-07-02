/**
 * anomaly-engine/adapter.js
 * Owner: Shreeja
 *
 * Bridges Osin's backend (NormalizedEvent[] flat array)
 * to your detection engine (metricsMap keyed by metric name)
 * and wraps output to match his AnomalyPayload interface.
 */

const { runDetectionCycle } = require("./anomalyEngine");

/**
 * Groups a flat array of NormalizedEvent objects into
 * { metricName: [{ timestamp, value }, ...] } shape,
 * sorted chronologically per metric.
 *
 * @param {Array} events - NormalizedEvent[] from backend
 * @returns {Object} metricsMap
 */
function groupEventsByMetric(events) {
  const metricsMap = {};

  for (const event of events) {
    const { metric, value, timestamp } = event;

    // coerce value to number — skip if not numeric (engine only handles numeric metrics)
    const numericValue = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(numericValue)) continue;

    if (!metricsMap[metric]) metricsMap[metric] = [];
    metricsMap[metric].push({ timestamp, value: numericValue });
  }

  // sort each series chronologically (NormalizedEvent.timestamp is ISO 8601 UTC)
  for (const metric in metricsMap) {
    metricsMap[metric].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  }

  return metricsMap;
}

/**
 * Main entry point for integration: takes raw NormalizedEvent[] from
 * Osin's backend, runs detection, and returns AnomalyPayload[] shaped
 * objects ready for Kshitij's ai-engine.
 *
 * @param {Array} normalizedEvents - NormalizedEvent[]
 * @param {Object} opts - { windowSize, checkLastN }
 * @returns {Array} AnomalyPayload[]
 */
function detectFromNormalizedEvents(normalizedEvents, opts = {}) {
  const metricsMap = groupEventsByMetric(normalizedEvents);
  const rawAnomalies = runDetectionCycle(metricsMap, opts);

  return rawAnomalies.map((anomaly) => {
    // find recent history + matching events for this metric, for context
    const recentHistory = normalizedEvents.filter(
      (e) => e.metric === anomaly.metric
    );

    const matchingEvent = recentHistory.find(
      (e) => e.timestamp === anomaly.timestamp
    );

    return {
      anomalyId: cryptoRandomId(),
      detectedAt: new Date().toISOString(),
      events: matchingEvent ? [matchingEvent] : [],
      context: {
        source: matchingEvent ? matchingEvent.source : null,
        metric: anomaly.metric,
        recentHistory,
      },
      // flattened fields your downstream Claude prompts use directly
      severity: anomaly.severity,
      description: anomaly.description,
      zScore: anomaly.zScore,
      baselineMean: anomaly.baselineMean,
      baselineStddev: anomaly.baselineStddev,
      currentWorkflow: anomaly.currentWorkflow,
    };
  });
}

// lightweight UUID fallback if not running in Node 19+ with crypto.randomUUID
function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "anomaly-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);
}

module.exports = {
  groupEventsByMetric,
  detectFromNormalizedEvents,
};