import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config = {
  env: optionalEnv("NODE_ENV", "development"),
  port: parseInt(optionalEnv("PORT", "4000"), 10),
  redis: {
    url: optionalEnv("REDIS_URL", "redis://localhost:6379"),
  },
  github: {
    token: requireEnv("GITHUB_TOKEN"),
    org: requireEnv("GITHUB_ORG"),
    repos: requireEnv("GITHUB_REPOS").split(",").map((r) => r.trim()),
    pollIntervalMs: parseInt(
      optionalEnv("GITHUB_POLL_INTERVAL_MS", "60000"),
      10
    ),
  },
  jira: {
    baseUrl: requireEnv("JIRA_BASE_URL"),
    email: requireEnv("JIRA_EMAIL"),
    apiToken: requireEnv("JIRA_API_TOKEN"),
    projectKeys: requireEnv("JIRA_PROJECT_KEYS")
      .split(",")
      .map((k) => k.trim()),
    pollIntervalMs: parseInt(
      optionalEnv("JIRA_POLL_INTERVAL_MS", "90000"),
      10
    ),
  },
  notion: {
    token: requireEnv("NOTION_TOKEN"),
    databaseIds: requireEnv("NOTION_DATABASE_IDS")
      .split(",")
      .map((id) => id.trim()),
    pollIntervalMs: parseInt(
      optionalEnv("NOTION_POLL_INTERVAL_MS", "120000"),
      10
    ),
  },
  downstream: {
    anomalyEngineUrl: optionalEnv(
      "ANOMALY_ENGINE_URL",
      "http://localhost:5000"
    ),
    aiEngineUrl: optionalEnv("AI_ENGINE_URL", "http://localhost:6000"),
  },
};