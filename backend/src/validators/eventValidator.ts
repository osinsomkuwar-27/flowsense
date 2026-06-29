import { z } from "zod";
import { NormalizedEvent } from "../types";

const NormalizedEventSchema = z.object({
  id: z.string().uuid(),
  version: z.number().int().positive(),
  source: z.enum(["github", "jira", "notion"]),
  eventType: z.string().min(1),
  resource: z.string().min(1),
  timestamp: z.string().datetime({ offset: true }),
  ingestedAt: z.string().datetime({ offset: true }),
  metric: z.string().min(1),
  value: z.union([z.number(), z.string(), z.boolean(), z.null()]),
  metadata: z.record(z.string(), z.unknown()),
  severity: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "resolved", "acknowledged", "pending"]),
  dedupKey: z.string().min(1),
  tags: z.array(z.string()),
});

export function validateEvent(event: unknown): NormalizedEvent {
  return NormalizedEventSchema.parse(event) as NormalizedEvent;
}

export function safeValidateEvent(event: unknown): { success: true; data: NormalizedEvent } | { success: false; error: string } {
  const result = NormalizedEventSchema.safeParse(event);
  if (result.success) return { success: true, data: result.data as NormalizedEvent };
  return { success: false, error: result.error.message };
}