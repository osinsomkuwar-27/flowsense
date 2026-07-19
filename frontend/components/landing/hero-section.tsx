"use client"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Button } from "@/components/ui/button"
import { ShaderBackground } from "@/components/ui/shaders-hero-section"
import { heroContainer, heroItem } from "@/components/landing/data"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <ShaderBackground>
      <Navbar />
      <section id="home" className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_50%_0%,rgba(202,229,255,0.55)_0%,rgba(152,181,237,0.28)_28%,rgba(74,78,105,0.62)_54%,rgba(34,34,59,0.88)_100%)]" />
        <div className="absolute -top-24 left-1/2 h-[540px] w-[900px] -translate-x-1/2 rounded-full bg-[#64748B]/16 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[420px] w-[1200px] -translate-x-1/2 rounded-full bg-[#0F172A]/46 blur-3xl" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-6 pt-28 pb-0 sm:px-10 lg:px-12">
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="show"
            className="z-20 flex max-w-4xl flex-col items-center text-center"
          >
            <motion.div
              variants={heroItem}
              className="inline-flex items-center rounded-full border border-white/35 bg-white/20 px-4 py-1.5 text-xs font-medium tracking-tight text-white/90 backdrop-blur-sm"
            >
              Detect Before It Breaks
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-serif-display text-4xl leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              See Everything. Catch Anything.
              <br />
              <span className="text-white">
                Fix It Before It Ships.
              </span>
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
            >
              AI-driven workflow monitoring for modern engineering teams.
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                >
                  Get Started
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/button:translate-x-0.5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mt-12 w-full max-w-5xl"
          >
            <div className="overflow-hidden rounded-xl border border-white/20 bg-white/10 p-1 shadow-[0_40px_80px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <img
                src="/dashboard-preview.png"
                alt="FlowSense DevOps Dashboard"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
            {/* Bottom glow */}
            <div className="absolute -bottom-8 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-full bg-[#64748B]/20 blur-2xl" />
          </motion.div>

          {/* Spacer for content below */}
          <div className="h-20" />
        </div>
      </section>
    </ShaderBackground>
  )
}
