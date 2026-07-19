"use client"

import { useState, useEffect } from "react"
import { colors } from "@/lib/colors"
import { GitBranch, ArrowRight } from "lucide-react"
import { mockWorkflows } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { fetchWorkflows, executeWorkflow } from "@/lib/api-client"
import type { WorkflowSuggestion } from "@/lib/types"

export function WorkflowsView() {
  const [mounted, setMounted] = useState(false)
  const [workflows, setWorkflows] = useState<WorkflowSuggestion[]>([])
  const [executingId, setExecutingId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    async function loadWorkflows() {
      try {
        const data = await fetchWorkflows()
        setWorkflows(data)
      } catch (err) {
        console.error("Failed to load workflows:", err)
      }
    }

    loadWorkflows()
  }, [mounted])

  const [successId, setSuccessId] = useState<string | null>(null)
  const [errorId, setErrorId] = useState<string | null>(null)

  const handleApplyWorkflow = async (id: string) => {
    setExecutingId(id)
    setSuccessId(null)
    setErrorId(null)
    try {
      await executeWorkflow(id)
      setSuccessId(id)
      setTimeout(() => setSuccessId(null), 3000)
    } catch (err) {
      console.error("Workflow execution failed:", err)
      setErrorId(id)
      setTimeout(() => setErrorId(null), 4000)
    } finally {
      setExecutingId(null)
    }
  }

  const activeWorkflows = workflows.length > 0 ? workflows : mockWorkflows

  return (
    <div style={{ padding: "24px 28px", maxWidth: 1200 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.navy }}>Workflows</h1>
        <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", marginTop: 4 }}>
          AI-generated workflow optimizations for detected anomalies
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {activeWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            style={{
              background: "#fff",
              border: "1px solid #F1F5F9",
              borderRadius: 12,
              padding: "20px 24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#F0F4FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <GitBranch style={{ width: 18, height: 18, color: "#6f7bd2" }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: colors.navy }}>
                  {workflow.title}
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "#64748B", marginTop: 4, lineHeight: 1.5 }}>
                  {workflow.description}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8", marginTop: 4 }}>
                  Anomaly: {workflow.anomalyId} • Created {workflow.createdAt.replace("T", " ").slice(0, 16)} UTC
                </p>
              </div>
            </div>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginLeft: 20 }}>
              {workflow.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 14 }}>
                  {/* Timeline */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${colors.indigo}, ${colors.mauve})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    {i < workflow.steps.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: "#E2E8F0", minHeight: 24 }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ paddingBottom: i < workflow.steps.length - 1 ? 16 : 0, paddingTop: 2 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: colors.navy }}>
                      {step.label}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748B", marginTop: 2, lineHeight: 1.4 }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {workflow.svg && (
              <div 
                style={{ 
                  marginTop: 16, 
                  padding: "12px 20px", 
                  background: "#F8FAFC", 
                  borderRadius: 8, 
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "auto",
                  maxWidth: 650,
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
                dangerouslySetInnerHTML={{ __html: workflow.svg }}
              />
            )}

            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                {successId === workflow.id && (
                  <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    ✓ Applied successfully!
                  </span>
                )}
                {errorId === workflow.id && (
                  <span style={{ fontSize: 12, color: "#DC2626", fontWeight: 600 }}>
                    ❌ Execution failed
                  </span>
                )}
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleApplyWorkflow(workflow.id)}
                disabled={executingId === workflow.id || successId === workflow.id}
                style={successId === workflow.id ? { backgroundColor: "#16A34A", color: "#fff", borderColor: "#16A34A" } : undefined}
              >
                {executingId === workflow.id ? "Executing..." : successId === workflow.id ? "Applied" : "Apply workflow"}
                <ArrowRight style={{ width: 14, height: 14 }} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
