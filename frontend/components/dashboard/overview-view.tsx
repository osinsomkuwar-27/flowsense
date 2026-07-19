import { useState, useEffect } from "react"
import { colors } from "@/lib/colors"
import {
  AlertTriangle,
  Clock3,
  TrendingUp,
  Activity,
  Bell,
  Share2,
  Printer,
  Download,
  Calendar,
  ChevronDown,
  Plus,
  CheckCircle2,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  mockMetrics,
  mockEventVolume,
  mockFocusStats,
  mockAttentionItems,
} from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  fetchDashboardMetrics,
  fetchFocusStats,
  fetchRecentEvents,
  fetchWorkflows,
} from "@/lib/api-client"
import type { DashboardMetrics, FocusStats } from "@/lib/types"

type TooltipProps = {
  active?: boolean
  label?: string
  payload?: any[]
}

function CustomChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: "#0F172A",
        borderRadius: 8,
        padding: "8px 12px",
        fontFamily: "var(--font-sans)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
        border: "none",
      }}
    >
      <p style={{ margin: 0, fontSize: 10, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", fontWeight: 600 }}>
        {label}
      </p>
      {payload.map((p, i) => {
        const color = p.stroke || p.color || p.payload?.fill || "#334155"
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 12, color: "#e2e8f0" }}>{p.name}:</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
              {Number(p.value).toLocaleString()}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function OverviewView() {
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState("Demo User")
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [focusStats, setFocusStats] = useState<FocusStats | null>(null)
  const [attentionItems, setAttentionItems] = useState(mockAttentionItems)
  const [loading, setLoading] = useState(true)

  // Interactive header state hooks
  const [activeTab, setActiveTab] = useState("Overview")
  const [activeEnv, setActiveEnv] = useState("Production")
  const [isEnvOpen, setIsEnvOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userFullName")
      if (stored) {
        setUserName(stored)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    async function loadData() {
      try {
        const [m, f, workflows, events] = await Promise.all([
          fetchDashboardMetrics(),
          fetchFocusStats(),
          fetchWorkflows(),
          fetchRecentEvents(),
        ])
        setMetrics(m)
        setFocusStats(f)

        // Build dynamic attention items from high/critical events
        const dynamicAttention = events
          .filter(e => e.severity === "high" || e.severity === "critical")
          .slice(0, 4)
          .map(e => ({
            id: e.id,
            title: e.metric.replace(/_/g, " ").replace(/\./g, " "),
            subtitle: `${e.resource} — value: ${e.value}`,
            tone: e.severity === "critical" ? ("danger" as const) : ("warn" as const),
            value: new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }))

        if (dynamicAttention.length > 0) {
          setAttentionItems(dynamicAttention)
        }
      } catch (err) {
        console.error("Failed to load overview data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [mounted])


  // Generate comparison data for double line chart (current vs baseline)
  const lineChartData = mockEventVolume.map((item, idx) => {
    // Generate a baseline event volume that aligns logically
    const baselines = [880, 1000, 1250, 1150, 1420, 1550, 1100]
    return {
      ...item,
      baseline: baselines[idx] || 1000,
    }
  })

  // Data for sparkline in solid card
  const sparkData = [
    { value: 120 }, { value: 180 }, { value: 140 }, { value: 250 }, 
    { value: 200 }, { value: 310 }, { value: 260 }, { value: 357 }
  ]

  // Data for radial rings (resolution rate and pipeline uptime)
  const resRingData = [
    { name: "Resolved", value: 75, fill: colors.accent },
    { name: "Remaining", value: 25, fill: "#F1F5F9" },
  ]
  const uptimeRingData = [
    { name: "Uptime", value: 99, fill: colors.indigo },
    { name: "Downtime", value: 1, fill: "#F1F5F9" },
  ]

  // Event volumes per platform for bottom bar chart
  const barChartData = [
    { name: "GitHub", events: 847, fill: colors.navy },
    { name: "Jira", events: 312, fill: colors.indigo },
    { name: "Notion", events: 88, fill: colors.mauve },
  ]

  return (
    <div style={{ padding: "28px 36px", maxWidth: 1280, margin: "0 auto", fontFamily: "var(--font-sans)" }}>
      
      {/* 1. Header Greeting Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 300, color: "#1e293b", letterSpacing: "-0.02em" }}>
            Good Morning, <span style={{ fontWeight: 400, color: colors.accent }}>{userName}</span>
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", marginTop: 4 }}>
            Your DevOps performance summary this week
          </p>
        </div>

        {/* Right side controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Environment Dropdown */}
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => { setIsEnvOpen(!isEnvOpen); setIsNotificationsOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                background: "#fff",
                fontSize: 12,
                fontWeight: 600,
                color: "#475569",
                cursor: "pointer",
              }}
            >
              {activeEnv} Env
              <ChevronDown style={{ width: 14, height: 14, color: "#94a3b8" }} />
            </button>
            {isEnvOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                zIndex: 100,
                minWidth: 140,
                overflow: "hidden"
              }}>
                {["Production", "Staging", "Development"].map((envOpt) => (
                  <button
                    key={envOpt}
                    onClick={() => { setActiveEnv(envOpt); setIsEnvOpen(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px 14px",
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#334155",
                      background: activeEnv === envOpt ? "#F8FAFC" : "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {envOpt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calendar Picker */}
          <div style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
            background: "#fff",
            overflow: "hidden"
          }}>
            <div style={{ padding: "8px 10px", borderRight: "1px solid #E2E8F0", display: "flex", alignItems: "center" }}>
              <Calendar style={{ width: 14, height: 14, color: "#64748b" }} />
            </div>
            <span style={{ padding: "8px 12px", fontSize: 12, fontWeight: 500, color: "#475569" }}>
              {mounted ? new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) : "--/--/----"}
            </span>
          </div>

          {/* Notifications Center */}
          <div style={{ position: "relative" }}>
            <button 
              onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsEnvOpen(false); }}
              style={{ 
                width: 34, 
                height: 34, 
                borderRadius: "50%", 
                background: "#fff", 
                border: "1px solid #E2E8F0", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                color: "#64748b", 
                cursor: "pointer", 
                position: "relative" 
              }}
            >
              <Bell style={{ width: 14, height: 14 }} />
              <span style={{ position: "absolute", top: 10, right: 10, width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
            </button>
            {isNotificationsOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                zIndex: 100,
                width: 280,
                padding: "14px 16px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.navy }}>Alert Center</h4>
                  <span style={{ fontSize: 10, background: "#FEF2F2", color: "#EF4444", padding: "2px 6px", borderRadius: 10, fontWeight: 600 }}>Active</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 11, borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: "#1E293B" }}>🔴 Blocker Anomaly Detected</p>
                    <p style={{ margin: "2px 0 0 0", color: "#64748B", lineHeight: 1.3 }}>Pull Request #94 is stagnant for over 72 hours.</p>
                  </div>
                  <div style={{ fontSize: 11, borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: "#1E293B" }}>🟡 Integration Warning</p>
                    <p style={{ margin: "2px 0 0 0", color: "#64748B", lineHeight: 1.3 }}>Polling repository flowsense/backend returned 401 Unauthorized.</p>
                  </div>
                  <div style={{ fontSize: 11 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: "#1E293B" }}>🟢 System Status Normal</p>
                    <p style={{ margin: "2px 0 0 0", color: "#64748B", lineHeight: 1.3 }}>SQLite dev.db active with custom mock telemetry logs.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${colors.indigo}, ${colors.mauve})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            marginLeft: 4,
            boxShadow: "0 2px 8px rgba(74, 78, 105, 0.25)"
          }}>
            DU
          </div>
        </div>
      </div>

      {/* 2. Sub-Header Section Selector / Action Buttons */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #E2E8F0",
        paddingBottom: 0,
        marginBottom: 24,
      }}>
        {/* Navigation Tabs (Only keeping Overview) */}
        <div style={{ display: "flex", gap: 24 }}>
          {["Overview"].map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 2px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: isActive ? colors.navy : "#94a3b8",
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive ? `2px solid ${colors.navy}` : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  marginBottom: -1,
                }}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Share/Print/Export Actions */}
        <div style={{ display: "flex", gap: 8, paddingBottom: 6 }}>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(window.location.origin + "/dashboard")
                setShareCopied(true)
                setTimeout(() => setShareCopied(false), 2000)
              }
            }}
            style={{ padding: "6px 12px", height: 32 }}
          >
            <Share2 style={{ width: 12, height: 12 }} />
            {shareCopied ? "Copied!" : "Share"}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => window.print()}
            style={{ padding: "6px 12px", height: 32 }}
          >
            <Printer style={{ width: 12, height: 12 }} />
            Print
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            disabled={exporting}
            onClick={() => {
              setExporting(true)
              setTimeout(() => {
                setExporting(false)
                setExportSuccess(true)
                setTimeout(() => setExportSuccess(false), 2000)
              }, 1200)
            }}
            style={{ padding: "6px 14px", height: 32 }}
          >
            <Download style={{ width: 12, height: 12 }} />
            {exporting ? "Exporting..." : exportSuccess ? "Exported!" : "Export"}
          </Button>
        </div>
      </div>

      {/* 3. Text Key Metrics Row with Dividers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 14,
        padding: "20px 0",
        marginBottom: 24,
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.01)"
      }}>
        {[
          { label: "Bounce Rate", value: "32.53%", trend: "-0.5%", isUp: false },
          { label: "Page Views", value: (metrics || mockMetrics).eventsToday.toLocaleString(), trend: "+12%", isUp: true },
          { label: "Active Pipelines", value: (metrics || mockMetrics).activePipelines, trend: "+2", isUp: true },
          { label: "Avg. Time on Site", value: "2m:35s", trend: "+0.8%", isUp: true },
          { label: "Open Anomalies", value: (metrics || mockMetrics).openAnomalies, trend: "-3", isUp: false },
          { label: "Critical Alerts", value: (metrics || mockMetrics).criticalAlerts, trend: "0", isUp: true },
        ].map((metric, idx) => (
          <div
            key={metric.label}
            style={{
              padding: "0 24px",
              borderRight: idx < 5 ? "1px solid #F1F5F9" : "none",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 500, color: "#64748b" }}>{metric.label}</span>
            <span style={{ fontSize: 24, fontWeight: 500, color: colors.navy, letterSpacing: "-0.03em" }}>{metric.value}</span>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: metric.isUp ? "#22c55e" : "#ef4444",
              display: "flex",
              alignItems: "center",
              gap: 2
            }}>
              {metric.isUp ? "▲" : "▼"} {metric.trend}
            </span>
          </div>
        ))}
      </div>

      {/* 4. Main Grid Section (Charts) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 20, marginBottom: 24 }}>
        
        {/* Left Side: Performance Line Chart */}
        <div style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.navy }}>Performance Line Chart</h2>
              <p style={{ margin: 0, fontSize: 12, color: "#94A3B8", marginTop: 4 }}>DevOps event volume triggers and system baselines</p>
            </div>
            {/* Custom Legends */}
            <div style={{ display: "flex", gap: 16, fontSize: 11, fontWeight: 500, color: "#64748b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.navy }} />
                This week
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.accent }} />
                Last week
              </div>
            </div>
          </div>

          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineChartData} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.navy} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={colors.navy} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.accent} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={45} />
                <RechartsTooltip content={<CustomChartTooltip />} />
                <Area
                  name="This week"
                  type="monotone"
                  dataKey="events"
                  stroke={colors.navy}
                  strokeWidth={2}
                  fill="url(#currentGradient)"
                />
                <Area
                  name="Last week"
                  type="monotone"
                  dataKey="baseline"
                  stroke={colors.accent}
                  strokeWidth={2}
                  fill="url(#baselineGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side Stack: Status Summary & Radial Rings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Card 1: Solid Color Status Summary Card */}
          <div style={{
            background: colors.indigo,
            borderRadius: 14,
            padding: "22px 24px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: 155,
            boxShadow: "0 4px 20px rgba(74, 78, 105, 0.15)"
          }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#fff/80" }}>Status Summary</h3>
            <span style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.6)", marginTop: 4 }}>Closed Anomalies Value</span>
            <span style={{ fontSize: 32, fontWeight: 500, color: "#fff", marginTop: 8, letterSpacing: "-0.03em" }}>357</span>
            
            {/* Sparkline line wave */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 50 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <defs>
                    <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.cream} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={colors.cream} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={1.5}
                    fill="url(#sparkGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2: Dual Health Ring Indicators Card */}
          <div style={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 14,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            height: 155,
          }}>
            {/* Resolution Ring */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 70, height: 70, position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resRingData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="85%"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {resRingData.map((e) => (
                        <Cell key={e.name} fill={e.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 12, fontWeight: 500, color: colors.navy }}>
                  75%
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 11, color: "#64748b" }}>Resolution</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>Rate</span>
              </div>
            </div>

            {/* Uptime Ring */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 70, height: 70, position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={uptimeRingData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="85%"
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {uptimeRingData.map((e) => (
                        <Cell key={e.name} fill={e.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 12, fontWeight: 500, color: colors.navy }}>
                  99%
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 11, color: "#64748b" }}>System</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>Uptime</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 5. Bottom Grid (Market Overview & To Do List) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 20 }}>
        
        {/* Left Side: Market Overview Bar Chart */}
        <div style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: "24px",
          minHeight: 280,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.navy }}>Market Overview</h3>
              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Platform event volume and distribution rates</p>
            </div>
            <button style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #E2E8F0",
              background: "#fff",
              fontSize: 11,
              fontWeight: 600,
              color: "#475569",
              cursor: "pointer",
            }}>
              This month
              <ChevronDown style={{ width: 12, height: 12, color: "#94a3b8" }} />
            </button>
          </div>

          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ left: -20, bottom: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomChartTooltip />} />
                <Bar dataKey="events" radius={[6, 6, 0, 0]}>
                  {barChartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Needs Attention Tasks List */}
        <div style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          minHeight: 280,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.navy }}>Needs Attention</h3>
            <button style={{ width: 28, height: 28, borderRadius: "50%", background: colors.navy, border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" }}>
              <Plus style={{ width: 14, height: 14 }} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            {attentionItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "#FAF9F8",
                  border: "1px solid #F1F5F9",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle2
                    style={{
                      width: 16,
                      height: 16,
                      color: item.tone === "danger" ? "#ef4444" : item.tone === "warn" ? "#f59e0b" : "#22c55e",
                      cursor: "pointer",
                      flexShrink: 0
                    }}
                  />
                  <div>
                    <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: colors.navy }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: 10.5, color: "#94A3B8", marginTop: 1 }}>{item.subtitle}</p>
                  </div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
