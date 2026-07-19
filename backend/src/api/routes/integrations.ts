import { Router, Response } from "express";
import { integrationStatusStore } from "../../integrations/statusStore";
import { eventStore } from "../../events/eventStore";
import { pollGitHub } from "../../integrations/github/poller";
import { pollJira } from "../../integrations/jira/poller";
import { pollNotion } from "../../integrations/notion/poller";
import { emitToAnomalyEngine } from "../../queue/anomalyEmitter";
import { logger } from "../../logger";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { prisma } from "../../config/db";

const router = Router();

// Helper to calculate event statistics from database
async function getStatsForSource(source: string) {
  const allEvents = await eventStore.getAll(50000);
  const totalEvents = allEvents.filter((e) => e.source === source).length;
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const eventsToday = allEvents.filter(
    (e) => e.source === source && new Date(e.timestamp) >= todayStart
  ).length;

  return { eventsToday, totalEvents };
}

// GET /api/integrations
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  try {
    const integrations = await prisma.integration.findMany({
      where: { userId }
    });

    const statuses = integrationStatusStore.getAll();
    const data = await Promise.all(
      statuses.map(async (status) => {
        const stats = await getStatsForSource(status.source);
        const matchingDb = integrations.find(i => i.source === status.source);
        
        return {
          id: matchingDb?.id || status.source,
          source: status.source,
          name: status.name,
          status: status.status,
          lastPollAt: status.lastPollAt,
          eventsToday: stats.eventsToday,
          totalEvents: stats.totalEvents,
        };
      })
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// POST /api/integrations
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { source, name, config } = req.body;
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  try {
    const record = await prisma.integration.create({
      data: {
        userId,
        source,
        name,
        configJson: JSON.stringify(config || {}),
      }
    });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// POST /api/integrations/poll/:source
router.post("/poll/:source", authMiddleware, async (req: AuthRequest, res: Response) => {
  const source = String(req.params.source);
  logger.info(`[Integrations API] Triggering manual poll for: ${source}`);

  try {
    let events = [];
    if (source === "github") {
      events = await pollGitHub();
    } else if (source === "jira") {
      events = await pollJira();
    } else if (source === "notion") {
      events = await pollNotion();
    } else {
      res.status(400).json({ success: false, error: "Invalid integration source" });
      return;
    }

    if (events.length > 0) {
      await eventStore.append(events);
      await emitToAnomalyEngine(events);
    }
    
    integrationStatusStore.update(source, "connected");
    const stats = await getStatsForSource(source);
    
    res.json({
      success: true,
      message: `Successfully polled ${source}`,
      data: {
        id: source,
        source,
        name: source === "github" ? "GitHub" : source === "jira" ? "Jira" : "Notion",
        status: "connected",
        lastPollAt: new Date().toISOString(),
        eventsToday: stats.eventsToday,
        totalEvents: stats.totalEvents,
      }
    });
  } catch (err) {
    const errMsg = (err as Error).message;
    logger.error(`[Integrations API] Manual poll failed for ${source}`, { error: errMsg });
    integrationStatusStore.update(source, "error", errMsg);
    
    res.status(500).json({
      success: false,
      error: `Polling failed: ${errMsg}`,
    });
  }
});

export default router;
