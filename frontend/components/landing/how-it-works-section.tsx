"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Link2, Activity, AlertTriangle, Workflow } from "lucide-react"

type Step = {
  icon: typeof Link2
  index: string
  kicker: string
  title: string
  body: string
}

const steps: Step[] = [
  {
    icon: Link2,
    index: "01",
    kicker: "Connect",
    title: "Link your tools",
    body: "Connect GitHub, Jira, and Notion in seconds. FlowSense starts monitoring immediately.",
  },
  {
    icon: Activity,
    index: "02",
    kicker: "Monitor",
    title: "Continuous event polling",
    body: "FlowSense polls your integrations for events, metrics, and changes around the clock.",
  },
  {
    icon: AlertTriangle,
    index: "03",
    kicker: "Detect",
    title: "Anomaly detection in real time",
    body: "Statistical models flag unusual patterns — CI spikes, velocity drops, or stale PRs — before they escalate.",
  },
  {
    icon: Workflow,
    index: "04",
    kicker: "Resolve",
    title: "AI-powered root cause & workflow",
    body: "One click to understand why a metric deviated. Get an optimized recovery workflow with visual diagrams.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#f8f9fd] px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center font-display text-3xl leading-tight text-[#0F172A] sm:text-4xl lg:text-5xl"
        >
          How it works
        </motion.h2>

        <StepRail />
      </div>
    </section>
  )
}

function StepRail() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  })

  return (
    <div ref={ref} className="relative mt-16 space-y-0">
      {/* Progress line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-[#e2e6f4] sm:left-8 lg:left-1/2 lg:-translate-x-px">
        <motion.div
          className="w-full origin-top bg-gradient-to-b from-[#6f7bd2] to-[#8F2D56]"
          style={{ scaleY: scrollYProgress, height: "100%" }}
        />
      </div>

      {steps.map((step, i) => (
        <StepCard key={step.index} step={step} index={i} />
      ))}
    </div>
  )
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex items-start gap-6 py-10 pl-16 sm:pl-20 lg:pl-0 ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      } lg:items-center lg:gap-16`}
    >
      {/* Dot on the line */}
      <div className="absolute left-4 top-12 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#6f7bd2] bg-white sm:left-6 lg:left-1/2 lg:-translate-x-1/2">
        <div className="h-2 w-2 rounded-full bg-[#6f7bd2]" />
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-md ${isEven ? "lg:text-right" : "lg:text-left"}`}>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f7bd2]">
          {step.kicker}
        </span>
        <h3 className="mt-2 text-xl font-semibold text-[#0F172A] sm:text-2xl">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#64748b]">{step.body}</p>
      </div>

      {/* Icon card */}
      <div className={`hidden lg:flex flex-1 ${isEven ? "justify-start" : "justify-end"}`}>
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#e2e6f4] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <Icon className="h-8 w-8 text-[#334155]" />
        </div>
      </div>
    </motion.div>
  )
}
