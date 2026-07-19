import { Router, Request, Response } from "express";
import { eventStore } from "../../events/eventStore";
import { EventQuery } from "../../types";

const router = Router();

// GET /api/events
router.get("/", async (req: Request, res: Response) => {
  const query: EventQuery = {
    page: parseInt((req.query.page as string) ?? "1", 10),
    limit: Math.min(parseInt((req.query.limit as string) ?? "50", 10), 200),
    source: req.query.source as any,
    eventType: req.query.eventType as string,
    severity: req.query.severity as any,
    status: req.query.status as any,
    from: req.query.from as string,
    to: req.query.to as string,
    resource: req.query.resource as string,
  };

  const { data, total } = await eventStore.query(query);

  res.json({
    success: true,
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.ceil(total / query.limit),
    },
  });
});

// GET /api/events/recent
router.get("/recent", async (_req: Request, res: Response) => {
  const data = await eventStore.getAll(200);
  res.json({ success: true, data, count: data.length });
});

// GET /api/events/by-source/:source
router.get("/by-source/:source", async (req: Request, res: Response) => {
  const source = String(req.params.source);
  const limit = parseInt((req.query.limit as string) ?? "100", 10);
  const data = await eventStore.getBySource(source, limit);
  res.json({ success: true, data, count: data.length, source });
});

// GET /api/events/stats
router.get("/stats", async (_req: Request, res: Response) => {
  const count = await eventStore.count();
  const all = await eventStore.getAll(count);
  const bySeverity = all.reduce<Record<string, number>>((acc, e) => {
    acc[e.severity] = (acc[e.severity] ?? 0) + 1;
    return acc;
  }, {});
  const bySource = all.reduce<Record<string, number>>((acc, e) => {
    acc[e.source] = (acc[e.source] ?? 0) + 1;
    return acc;
  }, {});
  const byStatus = all.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      total: all.length,
      bySeverity,
      bySource,
      byStatus,
    },
  });
});

export default router;