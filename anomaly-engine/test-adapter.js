/**
 * anomaly-engine/test-adapter.js
 * Run: node test-adapter.js
 * Verifies the adapter works with data shaped exactly like
 * Osin's NormalizedEvent[] output, using REAL metric names
 * from his GitHub poller (integrations/github/poller.ts).
 */

const { detectFromNormalizedEvents } = require("./adapter");

function makeEvent(hourOffset, value) {
  return {
    id: "evt-" + hourOffset,
    version: 1,
    source: "github",
    eventType: "pr.open",
    resource: `org/repo/pulls/${100 + hourOffset}`,
    timestamp: `2026-06-29T${String(hourOffset).padStart(2, "0")}:00:00Z`,
    ingestedAt: new Date().toISOString(),
    metric: "pr.age_hours", // <-- corrected: matches Osin's real metric name
    value: value,
    metadata: {},
    severity: "low",
    status: "open",
    dedupKey: "dedup-" + hourOffset,
    tags: ["github", "pullrequest", "repo"],
  };
}

// 24 normal hours, then one spike
const normalizedEvents = Array.from({ length: 24 }, (_, i) =>
  makeEvent(i, 2 + Math.random() * 0.5)
).concat([
  {
    ...makeEvent(24, 8.2),
    timestamp: "2026-06-30T01:00:00Z",
  },
]);

const anomalyPayloads = detectFromNormalizedEvents(normalizedEvents, {
  windowSize: 24,
  checkLastN: 1,
});

console.log(JSON.stringify(anomalyPayloads, null, 2));