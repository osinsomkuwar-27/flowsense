"use client"

import { useState, useEffect } from "react"
import { colors } from "@/lib/colors"
import { Search, Filter, ExternalLink } from "lucide-react"
import { mockEvents } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import type { EventSource, Severity } from "@/lib/types"

const SOURCE_COLORS: Record<EventSource, { bg: string; text: string }> = {
  github: { bg: "#F0F4FF", text: "#3B5998" },
  jira: { bg: "#E6F0FF", text: "#0052CC" },
  notion: { bg: "#F5F5F5", text: "#191919" },
}

const SEVERITY_COLORS: Record<Severity, { bg: string; text: string }> = {
  low: { bg: "#F0FDF4", text: "#166534" },
  medium: { bg: "#FFF7ED", text: "#92400E" },
  high: { bg: "#FEF2F2", text: "#DC2626" },
  critical: { bg: "#FEE2E2", text: "#991B1B" },
}

import { fetchEvents } from "@/lib/api-client"

export function EventsView() {
  const [mounted, setMounted] = useState(false)
  const [events, setEvents] = useState<NormalizedEvent[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sourceFilter, setSourceFilter] = useState<EventSource | "all">("all")

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const src = params.get("source")
      if (src === "github" || src === "jira" || src === "notion") {
        setSourceFilter(src)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    async function loadEvents() {
      try {
        const response = await fetchEvents({
          page,
          limit: 100,
          source: sourceFilter === "all" ? undefined : sourceFilter,
        })
        setEvents(response.data)
        setTotal(response.total)
      } catch (err) {
        console.error("Failed to load events from API:", err)
      }
    }

    loadEvents()
  }, [mounted, page, sourceFilter])

  const filtered = (events.length > 0 ? events : mockEvents).filter((e) => {
    const matchesSearch = e.resource.toLowerCase().includes(search.toLowerCase()) ||
      e.eventType.toLowerCase().includes(search.toLowerCase()) ||
      e.metric.toLowerCase().includes(search.toLowerCase())
    const matchesSource = sourceFilter === "all" || e.source === sourceFilter
    return matchesSearch && matchesSource
  })

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.navy }}>Events</h1>
        <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", marginTop: 4 }}>
          Normalized events from all connected integrations
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 360 }}>
          <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#94A3B8" }} />
          <input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              fontSize: 13,
              outline: "none",
              background: "#fff",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "github", "jira", "notion"] as const).map((src) => (
            <Button
              key={src}
              onClick={() => setSourceFilter(src)}
              variant={sourceFilter === src ? "default" : "secondary"}
              size="sm"
              className="capitalize"
            >
              {src}
            </Button>
          ))}
        </div>
      </div>

      {/* Events list */}
      <div style={{ background: "#fff", border: "1px solid #F1F5F9", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
              {["Source", "Event Type", "Resource", "Metric", "Severity", "Status", "Time"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr key={event.id} style={{ borderBottom: "1px solid #F8FAFC", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFC")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    background: SOURCE_COLORS[event.source].bg,
                    color: SOURCE_COLORS[event.source].text,
                    textTransform: "capitalize",
                  }}>
                    {event.source}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", color: colors.navy, fontWeight: 500 }}>{event.eventType.replace(/_/g, " ")}</td>
                <td style={{ padding: "10px 14px", color: "#64748B" }}>{event.resource}</td>
                <td style={{ padding: "10px 14px", color: "#64748B", fontFamily: "var(--font-mono)", fontSize: 12 }}>{event.metric}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    background: SEVERITY_COLORS[event.severity].bg,
                    color: SEVERITY_COLORS[event.severity].text,
                    textTransform: "capitalize",
                  }}>
                    {event.severity}
                  </span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 500,
                    background: event.status === "resolved" ? "#F0FDF4" : event.status === "acknowledged" ? "#FFF7ED" : "#F8FAFC",
                    color: event.status === "resolved" ? "#166534" : event.status === "acknowledged" ? "#92400E" : "#64748B",
                    textTransform: "capitalize",
                  }}>
                    {event.status}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", color: "#94A3B8", fontSize: 12 }}>
                  {mounted ? new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
