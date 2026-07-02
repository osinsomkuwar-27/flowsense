/**
 * anomaly-engine/anomalyEngine.js
 * Owner: Shreeja
 *
 * Pure detection logic — no API calls, no DB, no framework deps.
 * Input: array of metric data points { timestamp, metric, value }
 * Output: array of anomaly events
 *
 * Can be tested completely in isolation with mock arrays.
 */

const SEVERITY_THRESHOLDS = {
  critical: 3.5,
  high: 2.5,
  medium: 2.0,
  low: 1.5,
};

/**
 * Rolling baseline: mean + stddev over a sliding window
 * @param {number[]} values
 * @param {number} windowSize
 * @returns {{mean: number, stddev: number}}
 */
function computeBaseline(values, windowSize = 24) {
  const window = values.slice(-windowSize);
  const n = window.length;
  if (n === 0) return { mean: 0, stddev: 0 };

  const mean = window.reduce((sum, v) => sum + v, 0) / n;
  const variance =
    window.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
  const stddev = Math.sqrt(variance);

  return { mean, stddev };
}

/**
 * Z-score for a single point against baseline
 */
function zScore(value, mean, stddev) {
  if (stddev === 0) return 0; // no variance, can't be anomalous
  return (value - mean) / stddev;
}

/**
 * Maps absolute z-score to severity label
 */
function classifySeverity(absZ) {
  if (absZ >= SEVERITY_THRESHOLDS.critical) return "critical";
  if (absZ >= SEVERITY_THRESHOLDS.high) return "high";
  if (absZ >= SEVERITY_THRESHOLDS.medium) return "medium";
  if (absZ >= SEVERITY_THRESHOLDS.low) return "low";
  return null; // not anomalous
}

/**
 * Main entry point: takes a metric's historical series,
 * checks the latest point(s) against rolling baseline,
 * emits anomaly events.
 *
 * @param {string} metricName - e.g. "pr_review_time_hours"
 * @param {Array<{timestamp: string, value: number}>} series - chronological order
 * @param {object} opts - { windowSize, checkLastN }
 * @returns {Array} anomaly events
 */
function detectAnomalies(metricName, series, opts = {}) {
  const { windowSize = 24, checkLastN = 1 } = opts;

  if (series.length < windowSize + 1) {
    return []; // not enough history yet
  }

  const values = series.map((p) => p.value);
  const anomalies = [];

  const pointsToCheck = series.slice(-checkLastN);

  pointsToCheck.forEach((point) => {
    const idx = series.indexOf(point);
    const historyBeforePoint = values.slice(0, idx); // exclude current point from baseline
    const { mean, stddev } = computeBaseline(historyBeforePoint, windowSize);

    const z = zScore(point.value, mean, stddev);
    const absZ = Math.abs(z);
    const severity = classifySeverity(absZ);

    if (severity) {
      anomalies.push({
        metric: metricName,
        timestamp: point.timestamp,
        value: point.value,
        baselineMean: Number(mean.toFixed(2)),
        baselineStddev: Number(stddev.toFixed(2)),
        zScore: Number(z.toFixed(2)),
        severity,
        description: generateDescription(metricName, point.value, mean, z),
        currentWorkflow: null, // filled in by whoever owns workflow context (can default to a string)
      });
    }
  });

  return anomalies;
}

/**
 * Quick human-readable description (not Claude-generated, just a fallback/seed)
 */
function generateDescription(metricName, value, mean, z) {
  const direction = z > 0 ? "spiked" : "dropped";
  const multiplier = mean !== 0 ? (value / mean).toFixed(1) : "N/A";
  return `${metricName} ${direction} to ${value} (baseline ~${mean.toFixed(
    1
  )}, ${multiplier}x normal)`;
}

/**
 * Batch runner — call this on every poll cycle with fresh data
 * for all tracked metrics.
 *
 * @param {Object<string, Array>} metricsMap - { metricName: series[] }
 */
function runDetectionCycle(metricsMap, opts = {}) {
  const allAnomalies = [];
  for (const [metricName, series] of Object.entries(metricsMap)) {
    const found = detectAnomalies(metricName, series, opts);
    allAnomalies.push(...found);
  }
  return allAnomalies;
}

module.exports = {
  computeBaseline,
  zScore,
  classifySeverity,
  detectAnomalies,
  runDetectionCycle,
  SEVERITY_THRESHOLDS,
};