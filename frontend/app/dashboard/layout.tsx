"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7" }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main
        style={{
          flex: 1,
          overflow: "auto",
          transition: "margin-left 0.2s ease",
        }}
      >
        {children}
      </main>
    </div>
  )
}
