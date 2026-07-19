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
    <section id="built-for" className="relative overflow-hidden py-28">
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
              Continuous Intelligence
            </span>
            <h2 className="mt-4 font-display text-4xl text-ink sm:text-5xl">
              Made for the way you actually work.
            </h2>
            <p className="mt-4 max-w-md text-sm text-ink-soft">
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
                    <p className="mt-2 max-w-[30ch] text-xs leading-[1.4] text-[#5a6f8e] transition-colors duration-700 ease-out group-hover:text-white/70">
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
            {/* Visual — animated stacked cards */}
            <div className="relative mx-auto w-full max-w-md h-[460px]">
              
              {/* Background ambient periwinkle glow */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6f7bd2]/25 blur-3xl" />
              
              {/* Card 1: Active Pipeline (top left) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-[340px] rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] z-10"
              >
                <span className="text-[10px] font-bold tracking-[0.12em] text-[#6f7bd2] uppercase">
                  Active Pipeline
                </span>
                <h4 className="mt-1.5 text-sm font-semibold text-[#0f172a]">
                  Main branch deployment · production-api
                </h4>
                
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    Running
                  </span>
                  <span className="text-slate-400">Duration: 4m 12s</span>
                </div>
                
                {/* Progress bar */}
                <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[68%] rounded-full bg-[#6f7bd2]" />
                </div>
                
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span>847 of 1,240 checks completed</span>
                  <span className="font-semibold text-[#6f7bd2]">68%</span>
                </div>
              </motion.div>

              {/* Card 2: Event Received (middle right) */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.4 }}
                className="absolute top-28 right-0 w-[300px] rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_16px_48px_rgba(0,0,0,0.08)] z-20"
              >
                <span className="text-[10px] font-bold tracking-[0.12em] text-[#6f7bd2] uppercase">
                  Event Received
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4.5 w-4.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0f172a]">GitHub webhook</p>
                    <p className="text-xs text-slate-500">Push to main branch · Acme Corp</p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: AI alert (bottom left) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.2 }}
                className="absolute top-64 left-4 w-[340px] rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] z-10"
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase">
                    AI suggestion
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700 italic">
                  "High database lock wait time resolved by scaling write capacity to avoid pipeline blocks."
                </p>
                <p className="mt-2.5 text-[10px] text-slate-400">
                  Anomaly Engine · 2 minutes ago
                </p>
              </motion.div>

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
