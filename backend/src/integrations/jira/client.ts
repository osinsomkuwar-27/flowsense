import axios from "axios";
import { config } from "../../config";
import { jiraLimiter } from "../../utils/rateLimiter";
import { withRetry } from "../../utils/retry";

const token = Buffer.from(`${config.jira.email}:${config.jira.apiToken}`).toString("base64");

const jiraAxios = axios.create({
  baseURL: config.jira.baseUrl,
  headers: {
    Authorization: `Basic ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

export async function jiraGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  return withRetry(
    () =>
      jiraLimiter.schedule(() =>
        jiraAxios.get<T>(path, { params }).then((r) => r.data)
      ),
    `jira:GET:${path}`
  );
}

export async function jiraPost<T>(
  path: string,
  data?: Record<string, unknown>
): Promise<T> {
  return withRetry(
    () =>
      jiraLimiter.schedule(() =>
        jiraAxios.post<T>(path, data).then((r) => r.data)
      ),
    `jira:POST:${path}`
  );
}