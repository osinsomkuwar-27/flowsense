import axios from "axios";
import { config } from "../config";
import { NormalizedEvent } from "../types";
import { logger } from "../logger";

const anomalyClient = axios.create({
  baseURL: config.downstream.anomalyEngineUrl,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export async function emitToAnomalyEngine(events: NormalizedEvent[]): Promise<void> {
  if (!events.length) return;

  try {
    await anomalyClient.post("/api/ingest", { events });
    logger.debug(`[AnomalyEmitter] Sent ${events.length} events to anomaly engine`);
  } catch (err) {
    // Non-fatal — anomaly engine may not be running during dev
    logger.warn("[AnomalyEmitter] Could not reach anomaly engine", {
      error: (err as Error).message,
    });
  }
}