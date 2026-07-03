/**
 * anomaly-engine/index.js
 * Owner: Shreeja
 *
 * Entry point — polls Osin's backend for events,
 * runs detection cycle, reports anomalies back.
 */

require("dotenv").config();
const { runLiveDetectionCycle } = require("./fetcher");

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS ?? "60000", 10);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function withRetry(fn, label, retries = MAX_RETRIES) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1); // 2s, 4s, 8s
      console.warn(`[anomaly-engine] ${label} failed (attempt ${attempt}/${retries}): ${err.message}`);
      if (attempt < retries) {
        console.warn(`[anomaly-engine] Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      }
    }
  }
  throw new Error(`[anomaly-engine] ${label} failed after ${retries} attempts: ${lastErr.message}`);
}

async function submitAnomaly(anomaly) {
  return withRetry(async () => {
    const res = await fetch(`${BACKEND_URL}/api/anomaly/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(anomaly),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }, `submitAnomaly(${anomaly.context?.metric})`);
}

async function poll() {
  console.log("[anomaly-engine] Running detection cycle...");

  let anomalies;
  try {
    anomalies = await withRetry(
      () => runLiveDetectionCycle({ limit: 500 }),
      "runLiveDetectionCycle"
    );
  } catch (err) {
    console.error("[anomaly-engine] Detection cycle failed, skipping:", err.message);
    return;
  }

  if (anomalies.length === 0) {
    console.log("[anomaly-engine] No anomalies detected.");
    return;
  }

  console.log(`[anomaly-engine] ${anomalies.length} anomaly/anomalies found.`);

  for (const anomaly of anomalies) {
    try {
      await submitAnomaly(anomaly);
      console.log(`[anomaly-engine] ✅ Reported: ${anomaly.context?.metric} (${anomaly.severity})`);
    } catch (err) {
      console.error(`[anomaly-engine] ❌ Failed to report ${anomaly.anomalyId}:`, err.message);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log(`[anomaly-engine] Starting — polling every ${POLL_INTERVAL_MS / 1000}s → ${BACKEND_URL}`);
poll();
setInterval(poll, POLL_INTERVAL_MS);

const http = require("http");

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", service: "anomaly-engine" }));
}).listen(process.env.PORT ?? 5000, () => {
  console.log(`[anomaly-engine] HTTP server on :${process.env.PORT ?? 5000}`);
});