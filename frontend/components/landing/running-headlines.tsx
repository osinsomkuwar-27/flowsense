"use client"

import { motion } from "framer-motion"

const POINTS = [
  "Anomaly Detection",
  "Workflow Monitoring",
  "AI Root Cause Analysis",
  "Pipeline Visibility",
  "Real-Time Alerts",
  "Smart Workflows",
  "Event Correlation",
  "DevOps Intelligence",
]

export function RunningHeadlines() {
  const items = [...POINTS, ...POINTS, ...POINTS]
  const separators = ["#8f9be6", "#7e8ad9", "#a8b0e8", "#6e7aca"]

  return (
    <section className="relative overflow-hidden border-y border-[#dfe4f3] bg-[#f8f9fd] py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#f8f9fd] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#f8f9fd] to-transparent" />

      <motion.div
        className="animate-marquee flex w-max items-center gap-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {items.map((text, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-[#3d4a6b] sm:text-base">
              {text}
            </span>
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: separators[i % separators.length] }}
            />
          </span>
        ))}
      </motion.div>
    </section>
  )
}
