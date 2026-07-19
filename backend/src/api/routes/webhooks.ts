import { Router, Request, Response } from "express";
import { eventStore } from "../../events/eventStore";
import { emitToAnomalyEngine } from "../../queue/anomalyEmitter";
import { logger } from "../../logger";

const router = Router();

// POST /api/webhooks/github
router.post("/github", async (req: Request, res: Response) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  logger.info(`[Webhooks] Received GitHub webhook event: ${event}`);

  try {
    let normalized: any[] = [];
    
    if (event === "push") {
      normalized = [{
        id: `gh-webhook-${payload.after || Date.now()}`,
        source: "github",
        eventType: "commit.pushed",
        resource: payload.repository?.full_name || "flowsense/repo",
        timestamp: new Date().toISOString(),
        metric: "commit.count",
        value: payload.commits?.length || 1,
        severity: "low",
        status: "open",
        tags: ["github", "webhook", "push"],
        metadata: {
          sha: payload.after,
          message: payload.head_commit?.message || "Webhook push commit",
          author: payload.head_commit?.author?.name || "Webhook author",
        }
      }];
    } else if (event === "pull_request") {
      const pr = payload.pull_request;
      normalized = [{
        id: `gh-webhook-pr-${pr?.id || Date.now()}`,
        source: "github",
        eventType: `pr.${payload.action}`,
        resource: pr?.html_url || "flowsense/pr",
        timestamp: new Date().toISOString(),
        metric: "pr.age_hours",
        value: 0,
        severity: "low",
        status: pr?.state === "open" ? "open" : "resolved",
        tags: ["github", "webhook", "pullrequest"],
        metadata: {
          prNumber: pr?.number,
          title: pr?.title,
          author: pr?.user?.login,
        }
      }];
    }

    if (normalized.length > 0) {
      await eventStore.append(normalized);
      await emitToAnomalyEngine(normalized);
      logger.info(`[Webhooks] Ingested webhook event successfully: ${event}`);
    }

    res.json({ success: true, message: "Webhook processed" });
  } catch (err) {
    logger.error("Failed to process GitHub webhook", { error: (err as Error).message });
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
