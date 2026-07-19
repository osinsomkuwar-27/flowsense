"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section id="referrals" className="relative px-6 py-28 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-border bg-gradient-hero p-12 text-center shadow-3d sm:p-20"
      >
        {/* Background grid and shimmer layers (z-0) */}
        <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30 z-0" />
        <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 rotate-[20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer z-0" />

        {/* Floating gradient bubble layers (z-10) */}
        <div className="orb absolute -left-16 -top-16 h-56 w-56 animate-float opacity-80 z-10" />
        <div className="orb-soft absolute -right-20 -bottom-20 h-64 w-64 animate-spin-slow opacity-90 z-10" />

        {/* Interactive content layer (z-20) */}
        <div className="relative z-20">
          <span className="inline-flex items-center rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
            Continuous Intelligence
          </span>
          <h2 className="mt-5 font-display text-4xl text-white sm:text-6xl tracking-tight leading-tight">
            Stop reacting. Start predicting.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/85 text-sm sm:text-base leading-relaxed">
            FlowSense gives your team the visibility to catch issues before they become incidents. Set up in under 5 minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
              >
                Get started free
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button
                variant="link"
                size="lg"
                className="border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:no-underline"
              >
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
