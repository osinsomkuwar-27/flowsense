"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion"

const features = [
  {
    id: "01",
    title: "GitHub monitoring",
    body: "Track pushes, PRs, CI runs, releases, and workflow failures in real time.",
    patternCx: 380,
    patternCy: 380,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 16c0-2 1.5-3 4-3s4 1 4 3" />
        <circle cx="12" cy="10" r="2" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Jira tracking",
    body: "Sprint velocity, ticket creation rates, blockers, and scope changes — all visible.",
    patternCx: 20,
    patternCy: 20,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M7 9h10M7 13h7M7 17h5" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Notion sync",
    body: "Page updates, database modifications, and planning activity — correlated with dev events.",
    patternCx: 380,
    patternCy: 50,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h6M8 15h4" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Anomaly engine",
    body: "Statistical detection that learns your baseline and flags deviations automatically.",
    patternCx: 200,
    patternCy: 380,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      </svg>
    ),
  },
  {
    id: "05",
    title: "AI root-cause analysis",
    body: "LLM-powered root cause explanations, business impact assessment, and actionable suggestions.",
    patternCx: 200,
    patternCy: 20,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: "06",
    title: "Smart dashboard",
    body: "Event volume, open anomalies, pipeline health, and resolution rates — all at a glance.",
    patternCx: 200,
    patternCy: 200,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
        <rect x="2" y="3" width="20" height="18" rx="3" />
        <path d="M2 9h20M8 9v12" />
      </svg>
    ),
  },
]

function FeatureLayer({
  feature,
  index,
  total,
  progress,
}: {
  feature: typeof features[number]
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const enterStart = Math.max(0, (index - 1) / total)
  const enterEnd = index / total
  const coverStart = index / total
  const coverEnd = Math.min(1, (index + 1) / total)

  // Scroll Transforms for sliding from bottom (100% to 0%)
  const yFirst = useTransform(progress, [0, 1], ["0%", "0%"])
  const yOther = useTransform(progress, [enterStart, enterEnd], ["100%", "0%"])
  const y = index === 0 ? yFirst : yOther

  // Opacity Transforms to hide cards completely until they begin entering
  const opacityFirst = useTransform(progress, [0, 1], [1, 1])
  const opacityOther = useTransform(progress, [enterStart, enterStart + 0.03], [0, 1])
  const opacity = index === 0 ? opacityFirst : opacityOther

  // Translucent dark shadow/overlay to dim bottom cards as cards stack
  const overlayMoving = useTransform(progress, [coverStart, coverEnd], [0, 0.45])
  const overlayStatic = useTransform(progress, [0, 1], [0, 0])
  const overlayOpacity = index < total - 1 ? overlayMoving : overlayStatic

  const isEven = index % 2 === 0

  return (
    <motion.div
      className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[2rem] border border-[#e2e8f0] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.05)]"
      style={{ y, opacity, zIndex: index + 1 }}
    >
      {/* Visual Half — light periwinkle with concentric circles & number */}
      <div
        className={`relative h-[180px] md:h-auto overflow-hidden bg-[#eef0fb] flex items-center justify-center ${
          isEven ? "md:order-1 md:border-r border-[#e2e6f4]" : "md:order-2 md:border-l border-[#e2e6f4]"
        } border-b md:border-b-0`}
      >
        <svg
          className="absolute inset-0 h-full w-full text-[#6f7bd2]/20"
          viewBox="0 0 400 400"
          fill="none"
          stroke="currentColor"
        >
          <circle cx={feature.patternCx} cy={feature.patternCy} r="30" strokeWidth="1" />
          <circle cx={feature.patternCx} cy={feature.patternCy} r="50" strokeWidth="1" />
          <circle cx={feature.patternCx} cy={feature.patternCy} r="70" strokeWidth="1" />
          <circle cx={feature.patternCx} cy={feature.patternCy} r="90" strokeWidth="1" />
          <circle cx={feature.patternCx} cy={feature.patternCy} r="110" strokeWidth="1" />
          <circle cx={feature.patternCx} cy={feature.patternCy} r="130" strokeWidth="1" />
          <circle cx={feature.patternCx} cy={feature.patternCy} r="150" strokeWidth="1" />
          <circle cx={feature.patternCx} cy={feature.patternCy} r="170" strokeWidth="1" />
          <circle cx={feature.patternCx} cy={feature.patternCy} r="190" strokeWidth="1" />
          <circle cx={feature.patternCx} cy={feature.patternCy} r="210" strokeWidth="1" />
          <circle cx={feature.patternCx} cy={feature.patternCy} r="230" strokeWidth="1" />
        </svg>
        <span className="absolute bottom-[-10px] right-4 font-display text-[130px] font-bold tracking-tighter text-[#6f7bd2]/20 select-none">
          {feature.id}
        </span>
      </div>

      {/* Text Details Half */}
      <div
        className={`p-6 sm:p-8 md:p-12 flex flex-col items-start gap-4 md:gap-5 justify-center relative z-10 bg-white ${
          isEven ? "md:order-2" : "md:order-1"
        }`}
      >
        <span className="text-[10px] font-bold tracking-[0.16em] text-[#6f7bd2] uppercase">
          - {feature.id}, FEATURE
        </span>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6f7bd2] text-white">
          {feature.icon}
        </div>

        <h3 className="text-xl sm:text-2xl font-semibold text-[#0f172a] leading-tight">
          {feature.title}
        </h3>

        <p className="text-sm leading-relaxed text-[#64748b]">
          {feature.body}
        </p>
      </div>

      {/* Background overlay that dims the card when covered */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[#0f172a]"
        style={{ opacity: overlayOpacity }}
      />
    </motion.div>
  )
}

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <section id="features" className="bg-[#f8f9fd] py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 pb-8 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-[11px] font-medium text-[#64748b]">
            Features
          </span>
          <h2 className="mt-4 font-display text-3xl text-[#0f172a] sm:text-4xl lg:text-5xl">
            Everything you need to stay ahead of incidents.
          </h2>
        </motion.div>
      </div>

      {/* Sticky cards viewport & scroll height container */}
      <div ref={ref} className="relative animate-fade-in" style={{ height: `${features.length * 75}vh` }}>
        <div className="sticky top-[15vh] mx-auto h-[65vh] max-w-5xl px-6">
          <div className="relative h-full">
            {features.map((feature, i) => (
              <FeatureLayer
                key={feature.title}
                feature={feature}
                index={i}
                total={features.length}
                progress={smoothProgress}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
