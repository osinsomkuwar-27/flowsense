import axios from "axios";
import { config } from "../../config";
import { notionLimiter } from "../../utils/rateLimiter";
import { withRetry } from "../../utils/retry";

const notionAxios = axios.create({
  baseURL: "https://api.notion.com/v1",
  headers: {
    Authorization: `Bearer ${config.notion.token}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export async function notionPost<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  return withRetry(
    () =>
      notionLimiter.schedule(() =>
        notionAxios.post<T>(path, body ?? {}).then((r) => r.data)
      ),
    `notion:POST:${path}`
  );
}