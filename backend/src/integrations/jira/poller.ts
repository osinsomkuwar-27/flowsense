import { jiraGet, jiraPost } from "./client";
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
  // Removed time filter (-1h) — was causing 400. Fetch all recent issues instead.
  const jql = `project = ${projectKey} ORDER BY updated DESC`;

const res = await jiraPost<JiraSearchResult>("/rest/api/3/search/jql", {
    jql,
    maxResults: 100,
    fields: [
      "summary", "status", "priority", "issuetype",
      "created", "updated", "resolutiondate", "assignee",
      "reporter", "comment", "customfield_10016", "customfield_10020"
    ],
    fieldsByKeys: false,
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

// Sprint velocity removed — KK is a Jira Core project, Agile API not supported

export async function pollJira(): Promise<NormalizedEvent[]> {
  const allEvents: NormalizedEvent[] = [];

  for (const projectKey of config.jira.projectKeys) {
    try {
      const issues = await pollIssues(projectKey);
      allEvents.push(...issues);
      logger.info(`[Jira] Polled ${projectKey}: ${issues.length} issues`);
    } catch (err) {
      logger.error(`[Jira] Failed to poll project ${projectKey}`, {
        error: (err as Error).message,
      });
    }
  }

  return allEvents;
}