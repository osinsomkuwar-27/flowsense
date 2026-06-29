import crypto from "crypto";
import { NormalizedEvent, Severity, EventStatus, EventSource } from "../types";
import { generateDedupKey, isDuplicate } from "../utils/dedup";
import { safeValidateEvent } from "../validators/eventValidator";
import { nowUTC, toUTCISO } from "../utils/timestamp";
import { logger } from "../logger";

interface RawEventInput {
  source: EventSource;
  eventType: string;
  resource: string;
  timestamp: string | number | Date | null | undefined;
  metric: string;
  value: number | string | boolean | null;
  metadata?: Record<string, unknown>;
  severity?: Severity;
  status?: EventStatus;
  tags?: string[];
}

export function buildNormalizedEvent(raw: RawEventInput): NormalizedEvent | null {
  const timestamp = toUTCISO(raw.timestamp);
  const ingestedAt = nowUTC();

  const partial = {
    source: raw.source,
    eventType: raw.eventType,
    resource: raw.resource,
    timestamp,
    metric: raw.metric,
    value: raw.value,
    metadata: raw.metadata ?? {},
    severity: raw.severity ?? "low",
    status: raw.status ?? "open",
    tags: raw.tags ?? [],
  };

  const dedupKey = generateDedupKey(partial as any);

  if (isDuplicate(dedupKey)) {
    logger.debug(`Duplicate event suppressed: ${dedupKey}`);
    return null;
  }

  const event: NormalizedEvent = {
    id: crypto.randomUUID(),
    version: 1,
    ...partial,
    ingestedAt,
    dedupKey,
  };

  const validation = safeValidateEvent(event);
  if (!validation.success) {
    logger.error("Event validation failed", { error: validation.error, event });
    return null;
  }

  return validation.data;
}

export function normalizeMany(raws: RawEventInput[]): NormalizedEvent[] {
  const results: NormalizedEvent[] = [];
  for (const raw of raws) {
    const event = buildNormalizedEvent(raw);
    if (event) results.push(event);
  }
  return results;
}