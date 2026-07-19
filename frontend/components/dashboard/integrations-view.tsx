import React, { useState, useEffect } from "react"
import { colors } from "@/lib/colors"
import { Plug, RefreshCw, ExternalLink } from "lucide-react"
import { mockIntegrations } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

const SOURCE_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  github: {
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    color: "#24292f"
  },
  jira: {
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z" />
      </svg>
    ),
    color: "#0052CC"
  },
  notion: {
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
      </svg>
    ),
    color: "#191919"
  }
}

import { fetchIntegrations, triggerManualPoll } from "@/lib/api-client"
import type { Integration } from "@/lib/types"

export function IntegrationsView() {
  const [mounted, setMounted] = useState(false)
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [pollingSource, setPollingSource] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    async function loadIntegrations() {
      try {
        const data = await fetchIntegrations()
        setIntegrations(data)
      } catch (err) {
        console.error("Failed to load integrations:", err)
      }
    }

    loadIntegrations()
  }, [mounted])

  const activeIntegrations = integrations.length > 0 ? integrations : mockIntegrations

  const handlePollNow = async (source: string) => {
    setPollingSource(source)
    try {
      const updated = await triggerManualPoll(source)
      setIntegrations((prev) =>
        prev.map((item) => (item.source === source ? updated : item))
      )
    } catch (err) {
      console.error("Manual poll failed:", err)
    } finally {
      setPollingSource(null)
    }
  }

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
        {activeIntegrations.map((integration) => {
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
                  Last polled: {mounted ? new Date(integration.lastPollAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePollNow(integration.source)}
                  disabled={pollingSource === integration.source}
                >
                  <RefreshCw style={{ width: 12, height: 12 }} className={pollingSource === integration.source ? "animate-spin" : ""} />
                  {pollingSource === integration.source ? "Polling..." : "Poll now"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
