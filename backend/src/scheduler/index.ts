import { config } from "../config";
import { logger } from "../logger";
import { pollGitHub } from "../integrations/github/poller";
import { pollJira } from "../integrations/jira/poller";
import { pollNotion } from "../integrations/notion/poller";
import { eventStore } from "../events/eventStore";
import { emitToAnomalyEngine } from "../queue/anomalyEmitter";
import { NormalizedEvent } from "../types";
import { integrationStatusStore } from "../integrations/statusStore";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPoller(
  name: string,
  source: string,
  pollFn: () => Promise<NormalizedEvent[]>,
  intervalMs: number
): Promise<void> {
  logger.info(`[Scheduler] Starting poller: ${name} (interval: ${intervalMs}ms)`);

  while (true) {
    const start = Date.now();
    try {
      const events = await pollFn();
      if (events.length > 0) {
        eventStore.append(events);
        await emitToAnomalyEngine(events);
        logger.info(`[Scheduler] ${name} → ${events.length} events ingested`);
      } else {
        logger.debug(`[Scheduler] ${name} → 0 new events`);
      }
      integrationStatusStore.update(source, "connected");
    } catch (err) {
      const errMsg = (err as Error).message;
      logger.error(`[Scheduler] ${name} poll failed`, {
        error: errMsg,
      });
      integrationStatusStore.update(source, "error", errMsg);
    }

    const elapsed = Date.now() - start;
    const waitTime = Math.max(0, intervalMs - elapsed);
    await sleep(waitTime);
  }
}

export function startScheduler(): void {
  // Run all pollers in parallel, each with their own independent interval loop
  runPoller("GitHub", "github", pollGitHub, config.github.pollIntervalMs).catch((err) =>
    logger.error("[Scheduler] GitHub poller crashed", { error: err.message })
  );

  runPoller("Jira", "jira", pollJira, config.jira.pollIntervalMs).catch((err) =>
    logger.error("[Scheduler] Jira poller crashed", { error: err.message })
  );

  runPoller("Notion", "notion", pollNotion, config.notion.pollIntervalMs).catch((err) =>
    logger.error("[Scheduler] Notion poller crashed", { error: err.message })
  );
}