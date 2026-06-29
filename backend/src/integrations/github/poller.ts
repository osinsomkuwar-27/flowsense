import { githubGet } from "./client";
import { config } from "../../config";
import { normalizeMany } from "../../normalizer";
import { NormalizedEvent, Severity } from "../../types";
import { logger } from "../../logger";
import { toUTCISO } from "../../utils/timestamp";

interface GHPullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  draft: boolean;
  user: { login: string };
  head: { ref: string };
  base: { ref: string };
  requested_reviewers: { login: string }[];
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

interface GHCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  author: { login: string } | null;
}

interface GHWorkflowRun {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  created_at: string;
  updated_at: string;
  head_branch: string;
}

function prSeverity(pr: GHPullRequest): Severity {
  const ageHours =
    (Date.now() - new Date(pr.created_at).getTime()) / (1000 * 60 * 60);
  if (ageHours > 72 && pr.state === "open") return "high";
  if (ageHours > 48 && pr.state === "open") return "medium";
  return "low";
}

async function pollPullRequests(repo: string): Promise<NormalizedEvent[]> {
  const prs = await githubGet<GHPullRequest[]>(
    `/repos/${config.github.org}/${repo}/pulls`,
    { state: "all", per_page: 50, sort: "updated", direction: "desc" }
  );

  return normalizeMany(
    prs.map((pr) => ({
      source: "github",
      eventType: pr.state === "open" ? "pr.open" : pr.merged_at ? "pr.merged" : "pr.closed",
      resource: `${config.github.org}/${repo}/pulls/${pr.number}`,
      timestamp: pr.updated_at,
      metric: "pr.age_hours",
      value: parseFloat(
        (
          (Date.now() - new Date(pr.created_at).getTime()) /
          (1000 * 60 * 60)
        ).toFixed(2)
      ),
      severity: prSeverity(pr),
      status: pr.state === "open" ? "open" : "resolved",
      tags: ["github", "pullrequest", repo],
      metadata: {
        prNumber: pr.number,
        title: pr.title,
        author: pr.user.login,
        branch: pr.head.ref,
        targetBranch: pr.base.ref,
        reviewers: pr.requested_reviewers.map((r) => r.login),
        reviewComments: pr.review_comments,
        commits: pr.commits,
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
        draft: pr.draft,
        mergedAt: pr.merged_at,
        createdAt: toUTCISO(pr.created_at),
      },
    }))
  );
}

async function pollCommits(repo: string): Promise<NormalizedEvent[]> {
  const commits = await githubGet<GHCommit[]>(
    `/repos/${config.github.org}/${repo}/commits`,
    { per_page: 30 }
  );

  return normalizeMany(
    commits.map((c) => ({
      source: "github",
      eventType: "commit.pushed",
      resource: `${config.github.org}/${repo}/commits/${c.sha}`,
      timestamp: c.commit.author.date,
      metric: "commit.count",
      value: 1,
      severity: "low",
      status: "open",
      tags: ["github", "commit", repo],
      metadata: {
        sha: c.sha,
        message: c.commit.message.slice(0, 200),
        author: c.commit.author.name,
        githubLogin: c.author?.login ?? null,
      },
    }))
  );
}

async function pollWorkflowRuns(repo: string): Promise<NormalizedEvent[]> {
  const res = await githubGet<{ workflow_runs: GHWorkflowRun[] }>(
    `/repos/${config.github.org}/${repo}/actions/runs`,
    { per_page: 20 }
  );

  return normalizeMany(
    res.workflow_runs.map((run) => {
      const failed = run.conclusion === "failure";
      return {
        source: "github",
        eventType: `workflow.${run.conclusion ?? run.status}`,
        resource: `${config.github.org}/${repo}/actions/runs/${run.id}`,
        timestamp: run.updated_at,
        metric: "workflow.failure",
        value: failed ? 1 : 0,
        severity: failed ? "high" : "low",
        status: failed ? "open" : "resolved",
        tags: ["github", "workflow", "cicd", repo],
        metadata: {
          runId: run.id,
          workflowName: run.name,
          status: run.status,
          conclusion: run.conclusion,
          branch: run.head_branch,
          createdAt: toUTCISO(run.created_at),
        },
      };
    })
  );
}

export async function pollGitHub(): Promise<NormalizedEvent[]> {
  const allEvents: NormalizedEvent[] = [];

  for (const repo of config.github.repos) {
    try {
      const [prs, commits, workflows] = await Promise.all([
        pollPullRequests(repo),
        pollCommits(repo),
        pollWorkflowRuns(repo),
      ]);
      allEvents.push(...prs, ...commits, ...workflows);
      logger.info(`[GitHub] Polled ${repo}: ${prs.length} PRs, ${commits.length} commits, ${workflows.length} workflow runs`);
    } catch (err) {
      logger.error(`[GitHub] Failed to poll repo ${repo}`, { error: (err as Error).message });
    }
  }

  return allEvents;
}