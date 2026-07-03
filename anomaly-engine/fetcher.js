/**
 * anomaly-engine/fetcher.js
 * Owner: Shreeja
 *
 * Pulls normalized events from Osin's backend over HTTP,
 * then runs them through the detection engine.
 *
 * Requires: node-fetch (if Node < 18) — Node 18+ has fetch built in.
 */

const { detectFromNormalizedEvents } = require("./adapter");

const BACKEND_BASE_URL = process.env.BACKEND_URL || "http://localhost:4000";

/**
 * Pulls all recent events (optionally filtered by source) from the feed endpoint.
 * @param {Object} opts - { source, limit }
 * @returns {Promise<Array>} NormalizedEvent[]
 */
async function fetchFeed(opts = {}) {
  const { source, limit = 500 } = opts;
  const params = new URLSearchParams();
  if (source) params.set("source", source);
  params.set("limit", String(limit));

  const url = `${BACKEND_BASE_URL}/api/anomaly/feed?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data; // NormalizedEvent[]
}

/**
 * Pulls historical context for a specific metric.
 * Useful if you want to check one metric in isolation instead of pulling everything.
 * @param {Object} opts - { metric, source, limit }
 * @returns {Promise<Array>} NormalizedEvent[]
 */
async function fetchContext(opts = {}) {
  const { metric, source, limit = 100 } = opts;
  const params = new URLSearchParams();
  if (metric) params.set("metric", metric);
  if (source) params.set("source", source);
  params.set("limit", String(limit));

  const url = `${BACKEND_BASE_URL}/api/anomaly/context?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch context: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data; // NormalizedEvent[]
}

/**
 * Full cycle: pull latest events from backend, run detection, return anomalies.
 * Call this on a timer (e.g. every 60s) to simulate live monitoring for the demo.
 * @param {Object} opts - { source, limit, windowSize, checkLastN }
 * @returns {Promise<Array>} AnomalyPayload[]
 */
async function runLiveDetectionCycle(opts = {}) {
  const { source, limit = 500, windowSize = 3, checkLastN = 3 } = opts;

  const events = await fetchFeed({ source, limit });
  const anomalies = detectFromNormalizedEvents(events, { windowSize, checkLastN });

  return anomalies;
}

module.exports = {
  fetchFeed,
  fetchContext,
  runLiveDetectionCycle,
};