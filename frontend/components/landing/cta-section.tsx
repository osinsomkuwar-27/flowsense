"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(242,233,228,0.7),rgba(201,173,167,0.28))]">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(74,78,105,0.14),transparent)]" />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[2rem] border border-[rgba(74,78,105,0.14)] bg-[rgba(255,255,255,0.82)] px-8 py-9 text-[var(--color-navy)] shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-md sm:px-12 sm:py-14 lg:flex lg:items-center lg:justify-between"
        >
          <div className="max-w-xl">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              Stop reacting.
              <br />
              Start predicting.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#334155] sm:text-base">
              FlowSense gives your team the visibility to catch issues before they become incidents. Set up in under 5 minutes.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
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
                variant="secondary"
                size="lg"
              >
                Learn more
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
