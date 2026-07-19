export type Severity = "low" | "medium" | "high" | "critical"
export type EventStatus = "open" | "resolved" | "acknowledged" | "pending"
export type EventSource = "github" | "jira" | "notion"

export interface NormalizedEvent {
  id: string
  source: EventSource
  eventType: string
  resource: string
  timestamp: string
  metric: string
  value: number | string | boolean | null
  severity: Severity
  status: EventStatus
  tags: string[]
}

export interface AnomalyPayload {
  anomalyId: string
  detectedAt: string
  severity: Severity
  status: EventStatus
  metric: string
  source: EventSource
  rootCause?: string
  businessImpact?: string
  factors?: string[]
  urgency?: string
  eventsCount: number
}

export interface WorkflowSuggestion {
  id: string
  anomalyId: string
  title: string
  description: string
  steps: { label: string; description: string }[]
  createdAt: string
  svg?: string
}

export interface Integration {
  id: string
  source: EventSource
  name: string
  status: "connected" | "disconnected" | "error"
  lastPollAt: string
  eventsToday: number
  totalEvents: number
}

export interface DashboardMetrics {
  eventsToday: number
  activePipelines: number
  openAnomalies: number
  criticalAlerts: number
}

export interface EventVolumeData {
  date: string
  events: number
}

export interface FocusStats {
  pendingReview: number
  criticalOpen: number
  unresolvedAnomalies: number
}
