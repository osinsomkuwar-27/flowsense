"use client"

import { colors } from "@/lib/colors"
import { Plug, RefreshCw, ExternalLink } from "lucide-react"
import { mockIntegrations } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

const SOURCE_ICONS: Record<string, { icon: string; color: string }> = {
  github: { icon: "⬡", color: "#24292f" },
  jira: { icon: "◆", color: "#0052CC" },
  notion: { icon: "▣", color: "#191919" },
}

export function IntegrationsView() {
  return (
    <div style={{ padding: "24px 28px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.navy }}>Integrations</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", marginTop: 4 }}>
            Connected data sources and polling status
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => {}}
        >
          <Plug style={{ width: 15, height: 15 }} />
          Add Integration
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
        {mockIntegrations.map((integration) => {
          const sourceStyle = SOURCE_ICONS[integration.source]
          return (
            <div
              key={integration.id}
              style={{
                background: "#fff",
                border: "1px solid #F1F5F9",
                borderRadius: 12,
                padding: "20px 24px",
                transition: "box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: sourceStyle.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: "#fff",
                  }}
                >
                  {sourceStyle.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: colors.navy }}>
                    {integration.name}
                  </h3>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 3,
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background: integration.status === "connected" ? "#F0FDF4" : "#FEF2F2",
                      color: integration.status === "connected" ? "#166534" : "#DC2626",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: integration.status === "connected" ? "#22C55E" : "#DC2626",
                      }}
                    />
                    {integration.status}
                  </span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div style={{ background: "#FAFBFC", borderRadius: 8, padding: "10px 12px" }}>
                  <p style={{ margin: 0, fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Events today</p>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.navy, marginTop: 2 }}>
                    {integration.eventsToday.toLocaleString()}
                  </p>
                </div>
                <div style={{ background: "#FAFBFC", borderRadius: 8, padding: "10px 12px" }}>
                  <p style={{ margin: 0, fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total events</p>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.navy, marginTop: 2 }}>
                    {integration.totalEvents.toLocaleString()}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>
                  Last polled: {new Date(integration.lastPollAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {}}
                >
                  <RefreshCw style={{ width: 12, height: 12 }} />
                  Poll now
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
