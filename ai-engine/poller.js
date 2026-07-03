import "dotenv/config";
import http from "http";
import { processAnomaly } from "./index.js";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";
const POLL_INTERVAL_MS = 15000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; 
let isRunning = false;

const processed = new Set();

async function withRetry(fn, label, retries = MAX_RETRIES) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1); // 2s, 4s, 8s
      console.warn(`[poller] ${label} failed (attempt ${attempt}/${retries}): ${err.message}`);
      if (attempt < retries) {
        console.warn(`[poller] Retrying in ${delay / 1000}s...`);
        await sleep(delay);
      }
    }
  }
  throw new Error(`[poller] ${label} failed after ${retries} attempts: ${lastErr.message}`);
}

async function fetchEvents() {
  return withRetry(async () => {
    const res = await fetch(`${BACKEND_URL}/api/workflow/events?limit=5`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data } = await res.json();
    return data;
  }, "fetchEvents");
}

async function submitWorkflow(event, result) {
  return withRetry(async () => {
    const res = await fetch(`${BACKEND_URL}/api/workflow/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: event.id,
        metric: event.metric,
        severity: event.severity,
        source: event.source,
        rootCause: result.rootCause,
        businessImpact: result.businessImpact,
        factors: result.factors,
        urgency: result.urgency,
        workflow: result.workflow,
        svg: result.svg,
        processedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }, `submitWorkflow(${event.id})`);
}

async function processEvent(event) {
  return withRetry(
    () => processAnomaly(event),
    `processAnomaly(${event.metric})`
  );
}

async function poll() {
  if (isRunning) {
    console.log("[poller] Previous cycle still running, skipping...");
    return;
  }
  isRunning = true;

  console.log("[poller] Polling for new events...");

  try {
    const events = await fetchEvents();
    const newEvents = events.filter((e) => !processed.has(e.id));

    if (newEvents.length === 0) {
      console.log("[poller] No new events.");
      return;
    }

    console.log(`[poller] ${newEvents.length} new event(s) to process.`);

    for (const event of newEvents) {
      processed.add(event.id);
      try {
        const result = await processEvent(event);
        await submitWorkflow(event, result);
        console.log(`[poller] Done: ${event.id}`);
        await sleep(3000);
      } catch (err) {
        processed.delete(event.id);
        console.error(`[poller] Failed for event ${event.id}:`, err.message);
      }
    }
  } catch (err) {
    console.error("[poller] Could not fetch events, skipping cycle:", err.message);
  } finally {
    isRunning = false; 
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log(`[poller] Starting — polling every ${POLL_INTERVAL_MS / 1000}s → ${BACKEND_URL}`);
poll();
setInterval(poll, POLL_INTERVAL_MS);

http.createServer((req, res) => {
  res.writeHead(200);
  res.end(JSON.stringify({ status: "ok", service: "ai-engine" }));
}).listen(process.env.PORT ?? 6000, () => {
  console.log(`[ai-engine] HTTP server on :${process.env.PORT ?? 6000}`);
});