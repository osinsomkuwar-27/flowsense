// This router serves Kshitij's AI engine
// AI engine pulls normalized events and posts back generated workflows
import { Router, Request, Response } from "express";
import { eventStore } from "../../events/eventStore";
import { logger } from "../../logger";
import { prisma } from "../../config/db";

const router = Router();

// GET /api/workflow/events?severity=high&limit=50
router.get("/events", async (req: Request, res: Response) => {
  const severity = req.query.severity as string | undefined;
  const limit = parseInt((req.query.limit as string) ?? "50", 10);

  let data = await eventStore.getAll(1000);
  if (severity) data = data.filter((e) => e.severity === severity);
  data = data.slice(-limit);

  res.json({ success: true, data });
});

// POST /api/workflow/submit
// AI engine POSTs generated workflow back here for frontend to consume
router.post("/submit", async (req: Request, res: Response) => {
  const payload = req.body;
  if (!payload || typeof payload !== "object") {
    res.status(400).json({ success: false, error: "Invalid workflow payload" });
    return;
  }
  
  try {
    const record = await prisma.workflow.upsert({
      where: { id: payload.id },
      update: {
        metric: payload.metric,
        severity: payload.severity,
        source: payload.source,
        rootCause: payload.rootCause || "",
        businessImpact: payload.businessImpact || "",
        factors: Array.isArray(payload.factors) ? payload.factors.join(",") : "",
        urgency: payload.urgency || "medium",
        workflowJson: JSON.stringify(payload.workflow || {}),
        svg: payload.svg || null,
        processedAt: payload.processedAt ? new Date(payload.processedAt) : new Date(),
      },
      create: {
        id: payload.id,
        metric: payload.metric,
        severity: payload.severity,
        source: payload.source,
        rootCause: payload.rootCause || "",
        businessImpact: payload.businessImpact || "",
        factors: Array.isArray(payload.factors) ? payload.factors.join(",") : "",
        urgency: payload.urgency || "medium",
        workflowJson: JSON.stringify(payload.workflow || {}),
        svg: payload.svg || null,
        processedAt: payload.processedAt ? new Date(payload.processedAt) : new Date(),
      }
    });

    logger.info("[Workflow] Received and persisted workflow from AI engine", {
      id: record.id,
    });
    res.json({ success: true, message: "Workflow stored", id: record.id });
  } catch (err) {
    logger.error("Failed to save workflow to database", { error: (err as Error).message });
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/workflow/latest?limit=10
// Frontend fetches latest workflows from here
router.get("/latest", async (req: Request, res: Response) => {
  const limit = parseInt((req.query.limit as string) ?? "10", 10);
  try {
    const data = await prisma.workflow.findMany({
      orderBy: { processedAt: "desc" },
      take: limit,
    });

    const parsed = data.map((item) => ({
      id: item.id,
      metric: item.metric,
      severity: item.severity,
      source: item.source,
      rootCause: item.rootCause,
      businessImpact: item.businessImpact,
      factors: item.factors ? item.factors.split(",") : [],
      urgency: item.urgency,
      workflow: JSON.parse(item.workflowJson),
      svg: item.svg,
      processedAt: item.processedAt.toISOString(),
    }));

    res.json({ success: true, data: parsed, count: parsed.length });
  } catch (err) {
    logger.error("Failed to query workflows from database", { error: (err as Error).message });
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;