import { notionPost } from "./client";
import { config } from "../../config";
import { normalizeMany } from "../../normalizer";
import { NormalizedEvent } from "../../types";
import { logger } from "../../logger";
import { toUTCISO } from "../../utils/timestamp";

interface NotionPageResult {
  results: Array<{
    id: string;
    created_time: string;
    last_edited_time: string;
    url: string;
    properties: Record<string, any>;
  }>;
}

export async function pollNotion(): Promise<NormalizedEvent[]> {
  const results: NormalizedEvent[] = [];

  for (const dbId of config.notion.databaseIds) {
    try {
      const res = await notionPost<NotionPageResult>(`/databases/${dbId}/query`, {
        page_size: 50,
      });

      const events = normalizeMany(
        res.results.map((page) => ({
          source: "notion",
          eventType: "page.updated",
          resource: page.url,
          timestamp: page.last_edited_time,
          metric: "page.inactivity_days",
          value: 1,
          severity: "low",
          status: "open",
          tags: ["notion", dbId],
          metadata: {
            pageId: page.id,
            createdAt: toUTCISO(page.created_time),
            updatedAt: toUTCISO(page.last_edited_time),
            pageUrl: page.url,
          },
        }))
      );

      results.push(...events);
      logger.info(`[Notion] Polled database ${dbId}: ${events.length} pages`);
    } catch (err) {
      logger.error(`[Notion] Failed to poll database ${dbId}`, {
        error: (err as Error).message,
      });
    }
  }

  return results;
}
