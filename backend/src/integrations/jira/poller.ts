import { jiraGet } from "./client";
import { config } from "../../config";
import { normalizeMany } from "../../normalizer";
import { NormalizedEvent, Severity } from "../../types";
import { logger } from "../../logger";

interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    priority: { name: string };
    issuetype: { name: string };
    created: string;
    updated: string;
    resolutiondate: string | null;
    assignee: { displayName: string; emailAddress: string } | null;
    reporter: { displayName: string } | null;
    comment: { total: number };
    customfield_10016: number | null; // story points
    customfield_10020: { id: string; name: string; state: string } | null; // sprint
  };
}

interface JiraSearchResult {
  issues: JiraIssue[];
  total: number;
  maxResults: number;
}

function jiraSeverity(priority: string): Severity {
  const p = priority.toLowerCase();
  if (p === "critical" || p === "blocker") return "critical";
  if (p === "high" || p === "major") return "high";
  if (p === "medium") return "medium";
  return "low";
}

async function pollIssues(projectKey: string): Promise<NormalizedEvent[]> {
  const jql = `project = ${projectKey} AND updated >= -1h ORDER BY updated DESC`;
  const res = await jiraGet<JiraSearchResult>("/rest/api/3/search", {
    jql,
    maxResults: 100,
    fields: "summary,status,priority,issuetype,created,updated,resolutiondate,assignee,reporter,comment,customfield_10016,customfield_10020",
  });

  return normalizeMany(
    res.issues.map((issue) => {
      const resolved = !!issue.fields.resolutiondate;
      const ageHours =
        (Date.now() - new Date(issue.fields.created).getTime()) / (1000 * 60 * 60);

      return {
        source: "jira",
        eventType: resolved ? "issue.resolved" : `issue.${issue.fields.status.name.toLowerCase().replace(/\s+/g, "_")}`,
        resource: `${config.jira.baseUrl}/browse/${issue.key}`,
        timestamp: issue.fields.updated,
        metric: "issue.age_hours",
        value: parseFloat(ageHours.toFixed(2)),
        severity: jiraSeverity(issue.fields.priority?.name ?? "low"),
        status: resolved ? "resolved" : "open",
        tags: ["jira", "issue", projectKey, issue.fields.issuetype.name.toLowerCase()],
        metadata: {
          issueKey: issue.key,
          summary: issue.fields.summary,
          issueType: issue.fields.issuetype.name,
          priority: issue.fields.priority?.name,
          statusName: issue.fields.status.name,
          assignee: issue.fields.assignee?.displayName ?? null,
          reporter: issue.fields.reporter?.displayName ?? null,
          storyPoints: issue.fields.customfield_10016,
          sprint: issue.fields.customfield_10020?.name ?? null,
          sprintState: issue.fields.customfield_10020?.state ?? null,
          comments: issue.fields.comment.total,
          resolutionDate: issue.fields.resolutiondate,
          createdAt: issue.fields.created,
        },
      };
    })
  );
}

async function pollSprintVelocity(projectKey: string): Promise<NormalizedEvent[]> {
  // Jira Agile API — get current board
  try {
    const boards = await jiraGet<{ values: { id: number; name: string }[] }>(
      "/rest/agile/1.0/board",
      { projectKeyOrId: projectKey, maxResults: 1 }
    );
    if (!boards.values.length) return [];
    const boardId = boards.values[0].id;

    const sprints = await jiraGet<{ values: { id: number; name: string; state: string; startDate?: string; endDate?: string }[] }>(
      `/rest/agile/1.0/board/${boardId}/sprint`,
      { state: "active,closed", maxResults: 2 }
    );

    const events: NormalizedEvent[] = [];
    for (const sprint of sprints.values) {
      const sprintIssues = await jiraGet<JiraSearchResult>(
        "/rest/api/3/search",
        {
          jql: `sprint = ${sprint.id} AND project = ${projectKey}`,
          maxResults: 200,
          fields: "status,customfield_10016,resolutiondate",
        }
      );
      const totalPoints = sprintIssues.issues.reduce(
        (sum, i) => sum + (i.fields.customfield_10016 ?? 0),
        0
      );
      const completedPoints = sprintIssues.issues
        .filter((i) => i.fields.resolutiondate)
        .reduce((sum, i) => sum + (i.fields.customfield_10016 ?? 0), 0);

      const normalized = normalizeMany([
        {
          source: "jira",
          eventType: "sprint.velocity",
          resource: `${config.jira.baseUrl}/jira/software/projects/${projectKey}/boards/${boardId}`,
          timestamp: sprint.startDate ?? new Date().toISOString(),
          metric: "sprint.velocity_points",
          value: completedPoints,
          severity: completedPoints < totalPoints * 0.5 ? "high" : "low",
          status: sprint.state === "active" ? "open" : "resolved",
          tags: ["jira", "sprint", "velocity", projectKey],
          metadata: {
            sprintId: sprint.id,
            sprintName: sprint.name,
            sprintState: sprint.state,
            totalPoints,
            completedPoints,
            completionRate: totalPoints > 0 ? completedPoints / totalPoints : 0,
            boardId,
          },
        },
      ]);
      events.push(...normalized);
    }
    return events;
  } catch (err) {
    logger.warn(`[Jira] Could not poll sprint velocity for ${projectKey}`, {
      error: (err as Error).message,
    });
    return [];
  }
}

export async function pollJira(): Promise<NormalizedEvent[]> {
  const allEvents: NormalizedEvent[] = [];

  for (const projectKey of config.jira.projectKeys) {
    try {
      const [issues, velocity] = await Promise.all([
        pollIssues(projectKey),
        pollSprintVelocity(projectKey),
      ]);
      allEvents.push(...issues, ...velocity);
      logger.info(`[Jira] Polled ${projectKey}: ${issues.length} issues, ${velocity.length} sprint events`);
    } catch (err) {
      logger.error(`[Jira] Failed to poll project ${projectKey}`, {
        error: (err as Error).message,
      });
    }
  }

  return allEvents;
}