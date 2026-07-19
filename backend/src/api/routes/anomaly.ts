// This router serves Shreeja's anomaly engine
// She hits these endpoints to pull raw normalized events for analysis
import { Router, Request, Response } from "express";
import { eventStore } from "../../events/eventStore";
import { logger } from "../../logger";
import { prisma } from "../../config/db";

const router = Router();

// GET /api/anomaly/feed?source=github&limit=500
// Anomaly engine uses this to fetch events and build baselines
router.get("/feed", async (req: Request, res: Response) => {
  const source = req.query.source as string | undefined;
  const limit = parseInt((req.query.limit as string) ?? "500", 10);

  const data = source
    ? await eventStore.getBySource(source, limit)
    : await eventStore.getAll(limit);

  res.json({ success: true, data, count: data.length });
});

// GET /api/anomaly/context?metric=pr.age_hours&source=github&limit=100
// Anomaly engine fetches historical context for a specific metric
router.get("/context", async (req: Request, res: Response) => {
  const { metric, source, limit: rawLimit } = req.query;
  const limit = parseInt((rawLimit as string) ?? "100", 10);

  let data = await eventStore.getAll(5000);

  if (source) data = data.filter((e) => e.source === source);
  if (metric) data = data.filter((e) => e.metric === metric);

  data = data.slice(-limit);

  res.json({ success: true, data, count: data.length });
});

router.post("/report", async (req: Request, res: Response) => {
  const anomaly = req.body;
  if (!anomaly || typeof anomaly !== "object") {
    res.status(400).json({ success: false, error: "Invalid payload" });
    return;
  }
  
  try {
    const record = await prisma.anomaly.create({
      data: {
        id: anomaly.anomalyId,
        detectedAt: anomaly.timestamp ? new Date(anomaly.timestamp) : new Date(),
        severity: anomaly.severity,
        status: "open",
        metric: anomaly.metric,
        source: anomaly.source || "github",
        rootCause: anomaly.description || null,
        eventsCount: 1,
      }
    });

    logger.info("[Anomaly] Persisted anomaly report to database", {
      anomalyId: record.id,
      metric: record.metric,
      severity: record.severity,
    });

    res.json({ success: true, message: "Anomaly received and stored", id: record.id });
  } catch (err) {
    logger.error("Failed to store anomaly in database", { error: (err as Error).message });
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;