import axios from "axios";
import { config } from "../../config";
import { githubLimiter } from "../../utils/rateLimiter";
import { withRetry } from "../../utils/retry";

const githubAxios = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${config.github.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
  timeout: 15000,
});

export async function githubGet<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  return withRetry(
    () =>
      githubLimiter.schedule(() =>
        githubAxios.get<T>(path, { params }).then((r) => r.data)
      ),
    `github:GET:${path}`
  );
}