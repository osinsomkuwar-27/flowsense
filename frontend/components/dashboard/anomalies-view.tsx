"use client"

import { useState } from "react"
import { colors } from "@/lib/colors"
import { AlertTriangle, ChevronDown, ChevronUp, Clock, Zap } from "lucide-react"
import { mockAnomalies } from "@/lib/mock-data"
import type { Severity } from "@/lib/types"

const SEVERITY_STYLES: Record<Severity, { bg: string; text: string; border: string }> = {
  critical: { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
  high: { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
  medium: { bg: "#FFF7ED", text: "#92400E", border: "#FED7AA" },
  low: { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
}

export function AnomaliesView() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.navy }}>Anomalies</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", marginTop: 4 }}>
            Detected anomalies with AI-powered analysis
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: "#FEE2E2", color: "#991B1B" }}>
            {mockAnomalies.filter((a) => a.severity === "critical").length} Critical
          </span>
          <span style={{ padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: "#FEF2F2", color: "#DC2626" }}>
            {mockAnomalies.filter((a) => a.severity === "high").length} High
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {mockAnomalies.map((anomaly) => {
          const isExpanded = expanded === anomaly.anomalyId
          const styles = SEVERITY_STYLES[anomaly.severity]

          return (
            <div
              key={anomaly.anomalyId}
              style={{
                background: "#fff",
                border: "1px solid #F1F5F9",
                borderRadius: 12,
                overflow: "hidden",
                transition: "box-shadow 0.2s ease",
                boxShadow: isExpanded ? "0 4px 24px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : anomaly.anomalyId)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: styles.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <AlertTriangle style={{ width: 16, height: 16, color: styles.text }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: colors.navy }}>{anomaly.metric.replace(/_/g, " ")}</span>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 600,
                        background: styles.bg,
                        color: styles.text,
                        border: `1px solid ${styles.border}`,
                        textTransform: "uppercase",
                      }}>
                        {anomaly.severity}
                      </span>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 500,
                        background: "#F8FAFC",
                        color: "#64748B",
                        textTransform: "capitalize",
                      }}>
                        {anomaly.source}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#94A3B8", marginTop: 3 }}>
                      {anomaly.eventsCount} events • Detected {anomaly.detectedAt.replace("T", " ").slice(0, 16)} UTC
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp style={{ width: 16, height: 16, color: "#94A3B8" }} />
                ) : (
                  <ChevronDown style={{ width: 16, height: 16, color: "#94A3B8" }} />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid #F1F5F9" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                        Root Cause
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: colors.navy, lineHeight: 1.5 }}>
                        {anomaly.rootCause}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                        Business Impact
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: colors.navy, lineHeight: 1.5 }}>
                        {anomaly.businessImpact}
                      </p>
                    </div>
                  </div>
                  {anomaly.factors && (
                    <div style={{ marginTop: 14 }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                        Contributing Factors
                      </p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {anomaly.factors.map((f) => (
                          <span key={f} style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontSize: 11,
                            background: "#F8FAFC",
                            color: "#475569",
                            border: "1px solid #E2E8F0",
                          }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
                    <Zap style={{ width: 14, height: 14, color: "#F59E0B" }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#92400E" }}>
                      Urgency: {anomaly.urgency}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
