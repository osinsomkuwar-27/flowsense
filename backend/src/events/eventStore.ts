import { NormalizedEvent, EventQuery } from "../types";
import { logger } from "../logger";

// In-memory store for hackathon. In production: replace with TimescaleDB or ClickHouse.
class EventStore {
  private events: NormalizedEvent[] = [];
  private readonly MAX_EVENTS = 50000;

  append(events: NormalizedEvent[]): void {
    this.events.push(...events);
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(this.events.length - this.MAX_EVENTS);
    }
    logger.debug(`EventStore: total events = ${this.events.length}`);
  }

  query(opts: EventQuery): { data: NormalizedEvent[]; total: number } {
    let filtered = [...this.events];

    if (opts.source) filtered = filtered.filter((e) => e.source === opts.source);
    if (opts.eventType) filtered = filtered.filter((e) => e.eventType === opts.eventType);
    if (opts.severity) filtered = filtered.filter((e) => e.severity === opts.severity);
    if (opts.status) filtered = filtered.filter((e) => e.status === opts.status);
    if (opts.resource) filtered = filtered.filter((e) => e.resource.includes(opts.resource!));
    if (opts.from) {
      const from = new Date(opts.from).getTime();
      filtered = filtered.filter((e) => new Date(e.timestamp).getTime() >= from);
    }
    if (opts.to) {
      const to = new Date(opts.to).getTime();
      filtered = filtered.filter((e) => new Date(e.timestamp).getTime() <= to);
    }

    // Sort descending
    filtered.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const total = filtered.length;
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 50;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total };
  }

  getBySource(source: string, limit = 200): NormalizedEvent[] {
    return this.events
      .filter((e) => e.source === source)
      .slice(-limit);
  }

  getAll(limit = 500): NormalizedEvent[] {
    return this.events.slice(-limit);
  }

  count(): number {
    return this.events.length;
  }
}

export const eventStore = new EventStore();