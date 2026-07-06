"use client"

import { motion } from "framer-motion"

export function BuiltForSection() {
  const audiences = [
    {
      label: "01",
      title: "Platform Engineers",
      description: "Monitor CI/CD pipelines, deployments, and infrastructure events.",
    },
    {
      label: "02",
      title: "Engineering Managers",
      description: "Track team velocity, sprint health, and bottlenecks at a glance.",
    },
    {
      label: "03",
      title: "DevOps Teams",
      description: "Correlate alerts across tools into a single source of truth.",
    },
    {
      label: "04",
      title: "Startups",
      description: "Ship faster with automated anomaly detection from day one.",
    },
  ]

  return (
    <section className="relative overflow-hidden py-28">
      <div className="orb-soft absolute -left-20 top-10 -z-10 h-56 w-56 animate-float opacity-70" />
      <div className="orb-soft absolute -right-24 bottom-10 -z-10 h-72 w-72 animate-float-slow opacity-60" />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-[11px] font-medium text-ink-soft">
              Built for engineering teams
            </span>
            <h2 className="mt-4 font-display text-4xl text-ink sm:text-5xl">
              Made for the way you actually work.
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">
              Whether you manage three pipelines or thirty microservices, FlowSense bends to
              your workflow — not the other way around.
            </p>

            <div className="mt-8 max-w-[700px] overflow-hidden rounded-[1.25rem] border border-[#d9dfec]">
              <div className="grid gap-px bg-[#d9dfec] sm:grid-cols-2">
                {audiences.map((audience, index) => (
                  <motion.article
                    key={audience.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="group isolate relative min-h-[150px] overflow-hidden bg-white p-4 transition-all duration-700 ease-out hover:-translate-y-1 hover:bg-[var(--color-navy)] hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] sm:min-h-[165px] sm:p-5"
                  >
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-white/80 transition-transform duration-700 ease-out group-hover:scale-x-100" />
                    <div className="flex items-start justify-between">
                      <p className="text-[8px] font-semibold tracking-[0.16em] text-[#5c7192] transition-colors duration-700 ease-out group-hover:text-white/60">
                        {audience.label}
                      </p>
                      <span className="mt-1 h-px w-9 bg-[#cfd8e8] transition-all duration-700 ease-out group-hover:w-14 group-hover:bg-white/55" />
                    </div>

                    <h3 className="mt-5 text-[1.65rem] font-normal leading-none tracking-tight text-[#0f172a] transition-all duration-700 ease-out group-hover:-translate-y-0.5 group-hover:text-white">
                      {audience.title}
                    </h3>
                    <p className="mt-2 max-w-[30ch] text-[13.5px] leading-[1.4] text-[#5a6f8e] transition-colors duration-700 ease-out group-hover:text-white/70">
                      {audience.description}
                    </p>
                    <span className="pointer-events-none absolute bottom-4 right-4 text-base text-white/0 transition-all duration-700 ease-out group-hover:translate-x-0.5 group-hover:text-white/50">
                      →
                    </span>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            {/* Visual — integration cards stack */}
            <div className="relative mx-auto w-full max-w-sm">
              {[
                { name: "GitHub", color: "#24292f", icon: "⬡", events: "847 events/day" },
                { name: "Jira", color: "#0052CC", icon: "◆", events: "312 events/day" },
                { name: "Notion", color: "#000000", icon: "▣", events: "88 events/day" },
              ].map((integration, i) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
                  className="mb-4 rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-lg"
                        style={{ background: integration.color }}
                      >
                        {integration.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">{integration.name}</p>
                        <p className="text-xs text-[#64748b]">{integration.events}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Connected
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function StatisticsSection() {
  return (
    <section className="bg-white py-4">
      <div className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[#e2e6f4] to-transparent" />
    </section>
  )
}
