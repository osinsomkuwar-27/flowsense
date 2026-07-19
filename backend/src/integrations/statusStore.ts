export interface IntegrationStatus {
  source: string;
  name: string;
  status: "connected" | "disconnected" | "error";
  lastPollAt: string;
  error?: string;
}

const statusMap = new Map<string, IntegrationStatus>([
  ["github", { source: "github", name: "GitHub", status: "connected", lastPollAt: new Date().toISOString() }],
  ["jira", { source: "jira", name: "Jira", status: "connected", lastPollAt: new Date().toISOString() }],
  ["notion", { source: "notion", name: "Notion", status: "connected", lastPollAt: new Date().toISOString() }],
]);

export const integrationStatusStore = {
  update(source: string, status: "connected" | "disconnected" | "error", error?: string) {
    statusMap.set(source, {
      source,
      name: source === "github" ? "GitHub" : source === "jira" ? "Jira" : "Notion",
      status,
      lastPollAt: new Date().toISOString(),
      error,
    });
  },
  getAll() {
    return Array.from(statusMap.values());
  }
};
