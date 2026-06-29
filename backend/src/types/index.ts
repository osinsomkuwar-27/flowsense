export type Severity = "low" | "medium" | "high" | "critical";
export type EventStatus = "open" | "resolved" | "acknowledged" | "pending";
export type EventSource = "github" | "jira" | "notion";

export interface NormalizedEvent {
  id: string;
  version: number;
  source: EventSource;
  eventType: string;
  resource: string;
  timestamp: string; // ISO 8601 UTC
  ingestedAt: string; // ISO 8601 UTC
  metric: string;
  value: number | string | boolean | null;
  metadata: Record<string, unknown>;
  severity: Severity;
  status: EventStatus;
  dedupKey: string; // for deduplication
  tags: string[];
}

export interface AnomalyPayload {
  anomalyId: string;
  detectedAt: string;
  events: NormalizedEvent[];
  context: {
    source: EventSource;
    metric: string;
    recentHistory: NormalizedEvent[];
  };
}

export interface PollResult {
  source: EventSource;
  events: NormalizedEvent[];
  polledAt: string;
  durationMs: number;
  error?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface EventQuery extends PaginationOptions {
  source?: EventSource;
  eventType?: string;
  severity?: Severity;
  status?: EventStatus;
  from?: string;
  to?: string;
  resource?: string;
}