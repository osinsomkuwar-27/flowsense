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
    token: optionalEnv("GITHUB_TOKEN", "mock-token-123"),
    org: optionalEnv("GITHUB_ORG", "flowsense"),
    repos: optionalEnv("GITHUB_REPOS", "repo1,repo2").split(",").map((r) => r.trim()),
    pollIntervalMs: parseInt(
      optionalEnv("GITHUB_POLL_INTERVAL_MS", "60000"),
      10
    ),
  },
  jira: {
    baseUrl: optionalEnv("JIRA_BASE_URL", "https://flowsense.atlassian.net"),
    email: optionalEnv("JIRA_EMAIL", "dev@flowsense.io"),
    apiToken: optionalEnv("JIRA_API_TOKEN", "mock-jira-token"),
    projectKeys: optionalEnv("JIRA_PROJECT_KEYS", "PROJ1,PROJ2")
      .split(",")
      .map((k) => k.trim()),
    pollIntervalMs: parseInt(
      optionalEnv("JIRA_POLL_INTERVAL_MS", "90000"),
      10
    ),
  },
  notion: {
    token: optionalEnv("NOTION_TOKEN", "mock-notion-token"),
    databaseIds: optionalEnv("NOTION_DATABASE_IDS", "db1,db2")
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