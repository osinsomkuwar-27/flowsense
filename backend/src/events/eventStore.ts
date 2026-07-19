import { NormalizedEvent, EventQuery, EventSource, Severity, EventStatus } from "../types";
import { logger } from "../logger";
import { prisma } from "../config/db";

function parseValue(val: string): number | string | boolean | null {
  if (val === "null" || val === "") return null;
  if (val === "true") return true;
  if (val === "false") return false;
  const num = Number(val);
  if (!isNaN(num)) return num;
  return val;
}

function mapPrismaEvent(e: any): NormalizedEvent {
  return {
    id: e.id,
    version: 1,
    source: e.source as EventSource,
    eventType: e.eventType,
    resource: e.resource,
    timestamp: e.timestamp.toISOString(),
    ingestedAt: e.timestamp.toISOString(),
    metric: e.metric,
    value: parseValue(e.value),
    metadata: e.metadata ? JSON.parse(e.metadata) : {},
    severity: e.severity as Severity,
    status: e.status as EventStatus,
    dedupKey: e.id,
    tags: e.tags ? e.tags.split(",") : [],
  };
}

class EventStore {
  async append(events: NormalizedEvent[]): Promise<void> {
    if (events.length === 0) return;

    try {
      const data = events.map((e) => ({
        id: e.id,
        source: e.source,
        eventType: e.eventType,
        resource: e.resource,
        timestamp: new Date(e.timestamp),
        metric: e.metric,
        value: String(e.value ?? ""),
        severity: e.severity,
        status: e.status,
        tags: e.tags.join(","),
        metadata: JSON.stringify(e.metadata || {}),
      }));

      // In SQLite, write one by one to avoid duplicate key constraints and prisma type differences
      for (const item of data) {
        try {
          await prisma.event.create({
            data: item,
          });
        } catch (e) {
          // ignore duplicate keys (e.g. from overlapping polls)
        }
      }

      logger.debug(`EventStore: Appended ${events.length} events to SQLite database`);
    } catch (err) {
      logger.error("EventStore append failed", { error: (err as Error).message });
    }
  }

  async query(opts: EventQuery): Promise<{ data: NormalizedEvent[]; total: number }> {
    try {
      const where: any = {};

      if (opts.source) where.source = opts.source;
      if (opts.eventType) where.eventType = opts.eventType;
      if (opts.severity) where.severity = opts.severity;
      if (opts.status) where.status = opts.status;
      if (opts.resource) {
        where.resource = { contains: opts.resource };
      }
      if (opts.from || opts.to) {
        where.timestamp = {};
        if (opts.from) where.timestamp.gte = new Date(opts.from);
        if (opts.to) where.timestamp.lte = new Date(opts.to);
      }

      const total = await prisma.event.count({ where });

      const page = opts.page ?? 1;
      const limit = opts.limit ?? 50;
      const skip = (page - 1) * limit;

      const events = await prisma.event.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip,
        take: limit,
      });

      return {
        data: events.map(mapPrismaEvent),
        total,
      };
    } catch (err) {
      logger.error("EventStore query failed", { error: (err as Error).message });
      return { data: [], total: 0 };
    }
  }

  async getBySource(source: string, limit = 200): Promise<NormalizedEvent[]> {
    try {
      const events = await prisma.event.findMany({
        where: { source },
        orderBy: { timestamp: "desc" },
        take: limit,
      });
      return events.map(mapPrismaEvent).reverse(); // maintain chronological order for anomaly engine
    } catch (err) {
      logger.error(`EventStore getBySource failed for ${source}`, { error: (err as Error).message });
      return [];
    }
  }

  async getAll(limit = 500): Promise<NormalizedEvent[]> {
    try {
      const events = await prisma.event.findMany({
        orderBy: { timestamp: "desc" },
        take: limit,
      });
      return events.map(mapPrismaEvent).reverse();
    } catch (err) {
      logger.error("EventStore getAll failed", { error: (err as Error).message });
      return [];
    }
  }

  async count(): Promise<number> {
    try {
      return await prisma.event.count();
    } catch (err) {
      logger.error("EventStore count failed", { error: (err as Error).message });
      return 0;
    }
  }
}

export const eventStore = new EventStore();