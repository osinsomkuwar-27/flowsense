import crypto from "crypto";
import { NormalizedEvent } from "../types";

// In production this would use Redis SET with TTL
// For hackathon scope, in-memory LRU with a fixed window
const seen = new Set<string>();
const MAX_SIZE = 10000;

export function generateDedupKey(event: Omit<NormalizedEvent, "id" | "version" | "dedupKey" | "ingestedAt">): string {
  const payload = `${event.source}:${event.eventType}:${event.resource}:${event.metric}:${event.timestamp}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export function isDuplicate(dedupKey: string): boolean {
  if (seen.has(dedupKey)) return true;
  if (seen.size >= MAX_SIZE) {
    // evict oldest — Set maintains insertion order
    const firstKey = seen.values().next().value;
    if (firstKey !== undefined) {
      seen.delete(firstKey);
    }
  }
  seen.add(dedupKey);
  return false;
}