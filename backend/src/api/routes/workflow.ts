import { Router, Response } from "express";
import { eventStore } from "../../events/eventStore";
import { logger } from "../../logger";
import { prisma } from "../../config/db";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/workflow/events?severity=high&limit=50
router.get("/events", authMiddleware, async (req: AuthRequest, res: Response) => {
  const severity = req.query.severity as string | undefined;
  const limit = parseInt((req.query.limit as string) ?? "50", 10);

  let data = await eventStore.getAll(1000);
  if (severity) data = data.filter((e) => e.severity === severity);
  data = data.slice(-limit);

  res.json({ success: true, data });
});

// POST /api/workflow/submit
// AI engine POSTs generated workflow back here for frontend to consume
router.post("/submit", async (req: any, res: Response) => {
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
router.get("/latest", authMiddleware, async (req: AuthRequest, res: Response) => {
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

// POST /api/workflow/:id/execute
router.post("/:id/execute", authMiddleware, async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  logger.info(`[Workflow Execution] Initiating execution for workflow: ${id}`);

  try {
    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) {
      res.status(404).json({ success: false, error: "Workflow not found" });
      return;
    }

    const steps = JSON.parse(workflow.workflowJson).actionPlan || [];
    logger.info(`[Workflow Execution] Executing ${steps.length} steps for metric ${workflow.metric}`);

    // Simulate calling the external third-party API integrations (GitHub / Jira / Notion)
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      logger.info(`[Workflow Execution] Step ${i + 1}: ${step} -> SUCCESS`);
    }

    res.json({
      success: true,
      message: `Successfully executed workflow ${id}`,
      stepsExecuted: steps.length,
    });
  } catch (err) {
    logger.error(`[Workflow Execution] Failed to execute workflow ${id}`, { error: (err as Error).message });
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;