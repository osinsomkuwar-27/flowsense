import Bottleneck from "bottleneck";

// GitHub allows 5000 req/hour for authenticated users
export const githubLimiter = new Bottleneck({
  reservoir: 5000,
  reservoirRefreshAmount: 5000,
  reservoirRefreshInterval: 60 * 60 * 1000, // 1 hour
  maxConcurrent: 5,
  minTime: 200,
});

// Jira Cloud rate limit: ~10 req/second per user
export const jiraLimiter = new Bottleneck({
  reservoir: 600,
  reservoirRefreshAmount: 600,
  reservoirRefreshInterval: 60 * 1000, // per minute
  maxConcurrent: 3,
  minTime: 100,
});

// Notion: 3 req/second
export const notionLimiter = new Bottleneck({
  reservoir: 180,
  reservoirRefreshAmount: 180,
  reservoirRefreshInterval: 60 * 1000,
  maxConcurrent: 2,
  minTime: 350,
});