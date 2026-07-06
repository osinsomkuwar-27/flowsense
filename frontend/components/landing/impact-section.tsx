"use client"

import { motion } from "framer-motion"

const IMPACT_STATS = [
  {
    value: "73%",
    label: "faster incident detection",
    accent: "#6f7bd2",
  },
  {
    value: "12,000+",
    label: "events processed daily",
    accent: "#7f89db",
  },
  {
    value: "3.5hrs",
    label: "saved per team per week",
    accent: "#8b96e1",
  },
  {
    value: "99.2%",
    label: "anomalies caught",
    accent: "#5d6bc9",
  },
]

export function ImpactSection() {
  return (
    <section className="bg-[#f8f9fd] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-2 divide-y divide-[#e2e6f4] md:grid-cols-4 md:divide-x md:divide-y-0">
          {IMPACT_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center px-4 py-6 text-center md:py-0"
            >
              <span
                className="text-4xl font-bold tracking-tight sm:text-5xl"
                style={{ color: stat.accent }}
              >
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-[#64748b]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
