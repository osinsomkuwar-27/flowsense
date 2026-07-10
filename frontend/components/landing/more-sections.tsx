"use client"

import { useRef, useState } from "react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, ChevronDown } from "lucide-react"

/* ─── Pricing ─── */

const tiers = [
  {
    name: "Starter",
    price: "Free",
    sub: "Forever",
    desc: "For small teams getting started with monitoring.",
    features: ["Up to 3 integrations", "1,000 events/day", "Basic anomaly detection", "7-day history"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    sub: "/ month",
    desc: "For engineering teams running 5+ active pipelines.",
    features: [
      "Unlimited integrations",
      "50,000 events/day",
      "AI root-cause analysis",
      "Workflow optimization",
      "30-day history",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "$49",
    sub: "/ month",
    desc: "For organizations with multiple squads and pipelines.",
    features: ["Everything in Pro", "Unlimited events", "Custom alert rules", "90-day history", "SSO & RBAC", "API access"],
    cta: "Talk to us",
    highlight: false,
  },
]

/* ─── FAQ ─── */

const faqs = [
  {
    q: "Is there really a free tier?",
    a: "Yes — Starter is free forever and supports up to 3 integrations. Perfect for small teams or side projects.",
  },
  {
    q: "What data do you access from my tools?",
    a: "FlowSense only reads event metadata (timestamps, types, counts). We never access code content, file contents, or private messages.",
  },
  {
    q: "How does anomaly detection work?",
    a: "We build a statistical baseline from your event history and flag deviations using z-score analysis and trend detection. No manual threshold setting required.",
  },
  {
    q: "Can I integrate tools beyond GitHub, Jira, and Notion?",
    a: "More integrations are on the roadmap (Slack, PagerDuty, Linear). Pro and Team plans will get early access.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted in transit and at rest. Events are isolated per workspace. We never share or sell your data.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are month-to-month. Cancel from settings — no calls, no emails required.",
  },
]



/* ─── Pricing Section ─── */

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl text-[#0f172a] sm:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-[#64748b]">
            Start free. Upgrade when your team needs more.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative overflow-hidden rounded-2xl border p-7 transition-all duration-300 ${
                tier.highlight
                  ? "border-[#0F172A] bg-[#0F172A] text-white shadow-[0_20px_60px_rgba(34,34,59,0.3)]"
                  : "border-[#e2e8f0] bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
              }`}
            >
              {tier.highlight && (
                <span className="absolute top-4 right-4 rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                  Popular
                </span>
              )}
              <p className={`text-sm font-medium ${tier.highlight ? "text-white/70" : "text-[#64748b]"}`}>
                {tier.name}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className={`text-sm ${tier.highlight ? "text-white/60" : "text-[#94a3b8]"}`}>
                  {tier.sub}
                </span>
              </div>
              <p className={`mt-3 text-sm ${tier.highlight ? "text-white/70" : "text-[#64748b]"}`}>
                {tier.desc}
              </p>
              <ul className="mt-6 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tier.highlight ? "text-[#8f9be6]" : "text-[#6f7bd2]"}`} />
                    <span className={tier.highlight ? "text-white/85" : "text-[#334155]"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-7 block">
                <Button
                  variant={tier.highlight ? "default" : "secondary"}
                  className="w-full"
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ Section ─── */

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-b border-[#e2e8f0]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-[15px] font-medium text-[#0f172a] pr-4">{faq.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#94a3b8] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-[#64748b]">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqSection() {
  return (
    <section id="faq" className="bg-[#f8f9fd] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center font-display text-3xl text-[#0f172a] sm:text-4xl lg:text-5xl"
        >
          Frequently asked questions
        </motion.h2>
        <div>
          {faqs.map((faq) => (
            <FaqItem key={faq.q} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  )
}
