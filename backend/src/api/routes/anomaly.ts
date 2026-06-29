// This router serves Shreeja's anomaly engine
// She hits these endpoints to pull raw normalized events for analysis
import { Router, Request, Response } from "express";
import { eventStore } from "../../events/eventStore";

const router = Router();

// GET /api/anomaly/feed?source=github&limit=500
// Anomaly engine uses this to fetch events and build baselines
router.get("/feed", (req: Request, res: Response) => {
  const source = req.query.source as string | undefined;
  const limit = parseInt((req.query.limit as string) ?? "500", 10);

  const data = source
    ? eventStore.getBySource(source, limit)
    : eventStore.getAll(limit);

  res.json({ success: true, data, count: data.length });
});

// GET /api/anomaly/context?metric=pr.age_hours&source=github&limit=100
// Anomaly engine fetches historical context for a specific metric
router.get("/context", (req: Request, res: Response) => {
  const { metric, source, limit: rawLimit } = req.query;
  const limit = parseInt((rawLimit as string) ?? "100", 10);

  let data = eventStore.getAll(5000);

  if (source) data = data.filter((e) => e.source === source);
  if (metric) data = data.filter((e) => e.metric === metric);

  data = data.slice(-limit);

  res.json({ success: true, data, count: data.length });
});

export default router;