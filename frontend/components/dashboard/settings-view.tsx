"use client"

import { useState } from "react"
import { colors } from "@/lib/colors"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SettingsView() {
  const [settings, setSettings] = useState({
    pollInterval: "60",
    alertThreshold: "medium",
    emailNotifications: true,
    slackNotifications: false,
    apiKey: "fs_live_sk_••••••••••••••••",
    name: "Demo User",
    email: "demo@flowsense.dev",
  })

  return (
    <div style={{ padding: "24px 28px", maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.navy }}>Settings</h1>
        <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", marginTop: 4 }}>
          Configure your monitoring preferences
        </p>
      </div>

      {/* Profile */}
      <div style={{ background: "#fff", border: "1px solid #F1F5F9", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: colors.navy, marginBottom: 16 }}>Profile</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#64748B", marginBottom: 6 }}>Name</label>
            <input
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#64748B", marginBottom: 6 }}>Email</label>
            <input
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, outline: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Monitoring */}
      <div style={{ background: "#fff", border: "1px solid #F1F5F9", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: colors.navy, marginBottom: 16 }}>Monitoring</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#64748B", marginBottom: 6 }}>Poll interval (seconds)</label>
            <select
              value={settings.pollInterval}
              onChange={(e) => setSettings({ ...settings, pollInterval: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, outline: "none", background: "#fff" }}
            >
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
              <option value="120">2 minutes</option>
              <option value="300">5 minutes</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#64748B", marginBottom: 6 }}>Alert threshold</label>
            <select
              value={settings.alertThreshold}
              onChange={(e) => setSettings({ ...settings, alertThreshold: e.target.value })}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, outline: "none", background: "#fff" }}
            >
              <option value="low">Low and above</option>
              <option value="medium">Medium and above</option>
              <option value="high">High and above</option>
              <option value="critical">Critical only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: "#fff", border: "1px solid #F1F5F9", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: colors.navy, marginBottom: 16 }}>Notifications</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Email notifications", key: "emailNotifications" as const, desc: "Receive anomaly alerts via email" },
            { label: "Slack notifications", key: "slackNotifications" as const, desc: "Push alerts to a Slack channel (coming soon)" },
          ].map((item) => (
            <label key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, background: "#FAFBFC", cursor: "pointer" }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: colors.navy }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{item.desc}</p>
              </div>
              <div
                onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  background: settings[item.key] ? colors.navy : "#E2E8F0",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 2,
                  left: settings[item.key] ? 20 : 2,
                  transition: "left 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div style={{ background: "#fff", border: "1px solid #F1F5F9", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: colors.navy, marginBottom: 16 }}>API Key</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={settings.apiKey}
            readOnly
            style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, fontFamily: "var(--font-mono)", color: "#64748B", background: "#FAFBFC", outline: "none" }}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {}}
          >
            Copy
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {}}
          >
            Regenerate
          </Button>
        </div>
      </div>

      <Button
        variant="default"
        size="default"
        onClick={() => {}}
      >
        <Save style={{ width: 15, height: 15 }} />
        Save changes
      </Button>
    </div>
  )
}
