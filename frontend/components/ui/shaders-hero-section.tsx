"use client"

import { MeshGradient } from "@paper-design/shaders-react"
import type React from "react"

export function ShaderBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#0F172A", "#334155", "#64748B", "#8F2D56", "#ffffff"]}
        speed={0.3}
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#0F172A", "#64748B", "#ffffff", "#334155", "#8F2D56"]}
        speed={0.15}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
