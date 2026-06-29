import { buildNormalizedEvent } from "../normalizer";

describe("buildNormalizedEvent", () => {
  it("builds a valid event from raw input", () => {
    const event = buildNormalizedEvent({
      source: "github",
      eventType: "pr.open",
      resource: "org/repo/pulls/1",
      timestamp: new Date().toISOString(),
      metric: "pr.age_hours",
      value: 5.2,
      severity: "low",
      status: "open",
      tags: ["github", "pr"],
    });

    expect(event).not.toBeNull();
    expect(event?.source).toBe("github");
    expect(event?.eventType).toBe("pr.open");
    expect(event?.version).toBe(1);
    expect(event?.dedupKey).toBeDefined();
    expect(event?.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it("deduplicates identical events", () => {
    const raw = {
      source: "jira" as const,
      eventType: "issue.open",
      resource: "org/project/issues/42",
      timestamp: "2024-01-01T00:00:00.000Z",
      metric: "issue.age_hours",
      value: 10,
      severity: "medium" as const,
      status: "open" as const,
    };
    const first = buildNormalizedEvent(raw);
    const second = buildNormalizedEvent(raw);
    expect(first).not.toBeNull();
    expect(second).toBeNull(); // duplicate suppressed
  });

  it("handles null timestamp gracefully", () => {
    const event = buildNormalizedEvent({
      source: "notion",
      eventType: "page.updated",
      resource: "https://notion.so/page-id",
      timestamp: null,
      metric: "page.inactivity_days",
      value: 3,
    });
    expect(event).not.toBeNull();
    expect(event?.timestamp).toBeDefined();
  });
});