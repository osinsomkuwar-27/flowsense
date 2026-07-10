"use client"

import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
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
      {/* Mobile straight line — single and thin */}
      <div className="absolute left-6 top-0 bottom-0 w-[1.5px] sm:left-8 lg:hidden">
        <motion.div
          className="w-full origin-top bg-[#6f7bd2]"
          style={{ scaleY: scrollYProgress, height: "100%" }}
        />
      </div>

      {/* Desktop curved winding path — single, curved, and thin */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-48 hidden lg:block">
        <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
          <motion.path
            d="M 50 0 L 50 12.5 C 20 20.8, 20 29.2, 50 37.5 C 80 45.8, 80 54.2, 50 62.5 C 20 70.8, 20 79.2, 50 87.5 L 50 100"
            fill="none"
            stroke="#6f7bd2"
            strokeWidth="1.5"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
      </div>

      {steps.map((step, i) => (
        <StepCard key={step.index} step={step} index={i} progress={scrollYProgress} />
      ))}
    </div>
  )
}

function StepCard({
  step,
  index,
  progress,
}: {
  step: Step
  index: number
  progress: MotionValue<number>
}) {
  const Icon = step.icon
  const isEven = index % 2 === 0

  // Calculate progress markers for each dot (Dot 1: 0.125, Dot 2: 0.375, Dot 3: 0.625, Dot 4: 0.875)
  const dotProgress = 0.125 + index * 0.25
  const startProgress = Math.max(0, dotProgress - 0.12)
  const endProgress = dotProgress

  const opacity = useTransform(progress, [startProgress, endProgress], [0, 1])
  const y = useTransform(progress, [startProgress, endProgress], [40, 0])

  return (
    <motion.div
      style={{ opacity, y }}
      className={`relative flex items-start gap-6 py-28 lg:py-36 pl-16 sm:pl-20 lg:pl-0 ${
        isEven ? "lg:flex-row" : "lg:flex-row-reverse"
      } lg:items-center lg:gap-16`}
    >
      {/* Milestone Number Circle on the line */}
      <div className="absolute left-2 top-11 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#6f7bd2] text-white font-display font-medium text-sm sm:left-4 lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 shadow-[0_0_0_6px_#f8f9fd]">
        {step.index}
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

      {/* Empty placeholder column to balance layout on desktop */}
      <div className="hidden lg:block flex-1" />
    </motion.div>
  )
}
