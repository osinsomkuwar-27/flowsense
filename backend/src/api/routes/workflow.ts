// This router serves Kshitij's AI engine
// AI engine pulls normalized events and posts back generated workflows
import { Router, Request, Response } from "express";
import { eventStore } from "../../events/eventStore";
import { logger } from "../../logger";

const router = Router();

// Kshitij stores generated workflows here temporarily
const workflowStore: Record<string, unknown>[] = [];

// GET /api/workflow/events?severity=high&limit=50
router.get("/events", (req: Request, res: Response) => {
  const severity = req.query.severity as string | undefined;
  const limit = parseInt((req.query.limit as string) ?? "50", 10);

  let data = eventStore.getAll(1000);
  if (severity) data = data.filter((e) => e.severity === severity);
  data = data.slice(-limit);

  res.json({ success: true, data });
});

// POST /api/workflow/submit
// AI engine POSTs generated workflow back here for frontend to consume
router.post("/submit", (req: Request, res: Response) => {
  const workflow = req.body;
  if (!workflow || typeof workflow !== "object") {
    res.status(400).json({ success: false, error: "Invalid workflow payload" });
    return;
  }
  workflowStore.push({ ...workflow, receivedAt: new Date().toISOString() });
  logger.info("[Workflow] Received workflow from AI engine", {
    id: (workflow as any).id,
  });
  res.json({ success: true, message: "Workflow stored" });
});

// GET /api/workflow/latest?limit=10
// Frontend fetches latest workflows from here
router.get("/latest", (req: Request, res: Response) => {
  const limit = parseInt((req.query.limit as string) ?? "10", 10);
  const data = workflowStore.slice(-limit).reverse();
  res.json({ success: true, data, count: data.length });
});

export default router;