"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  GitBranch,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { colors } from "@/lib/colors"
import { Logo } from "@/components/ui/logo"

const NAV_GROUPS = [
  {
    title: "MONITORING",
    items: [
      { href: "/dashboard", label: "Overview", Icon: LayoutDashboard },
      { href: "/dashboard/events", label: "Events", Icon: Activity },
      { href: "/dashboard/anomalies", label: "Anomalies", Icon: AlertTriangle },
    ],
  },
  {
    title: "AUTOMATION",
    items: [
      { href: "/dashboard/workflows", label: "Workflows", Icon: GitBranch },
      { href: "/dashboard/integrations", label: "Integrations", Icon: Plug },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { href: "/dashboard/settings", label: "Settings", Icon: Settings },
    ],
  },
]

const BORDER = "1px solid #F1F5F9"

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: collapsed ? 60 : 240,
        minWidth: collapsed ? 60 : 240,
        background: "#fff",
        borderRight: BORDER,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "width 0.2s ease, min-width 0.2s ease",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          padding: collapsed ? "0 16px" : "0 20px",
          display: "flex",
          alignItems: "center",
          borderBottom: BORDER,
          transition: "padding 0.2s ease",
        }}
      >
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            color: colors.navy,
          }}
        >
          <Logo size={24} />
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.title} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {!collapsed && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "0.08em",
                  padding: "4px 8px",
                  marginBottom: 2,
                }}
              >
                {group.title}
              </span>
            )}
            {group.items.map(({ href, label, Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "9px 14px",
                    borderRadius: 9999,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? colors.navy : "#64748b",
                    background: isActive ? "#ffffff" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "rgba(242, 233, 228, 0.4)"
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent"
                  }}
                >
                  <Icon style={{ width: 16, height: 16, flexShrink: 0, color: isActive ? colors.navy : "#94a3b8" }} />
                  {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
                  {!collapsed && <span style={{ fontSize: 10, opacity: 0.35 }}>›</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div style={{ borderTop: BORDER, padding: "12px" }}>
        {/* User section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.indigo}, ${colors.mauve})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            FS
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: colors.navy, lineHeight: 1.3 }}>
                Demo User
              </p>
              <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", lineHeight: 1.3 }}>
                Admin
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
