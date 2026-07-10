"use client"

import { useState, useEffect, useRef } from "react"
import { motion, animate, useInView } from "framer-motion"

/* 
  Kinetic text: rack-focus blur-in word reveal.
  Scenes cycle continuously once the section is in view.
  Rewritten to not call hooks inside .map() — uses CSS transitions instead.
*/

interface WordDef {
  text: string
  highlight?: boolean
}

interface Scene {
  words: WordDef[]
  slideAndReveal?: WordDef[]
  holdMs: number
}

const SCENES: Scene[] = [
  {
    words: [{ text: "Every" }, { text: "Event" }],
    holdMs: 700,
  },
  {
    words: [{ text: "Every" }, { text: "Anomaly" }],
    holdMs: 700,
  },
  {
    words: [{ text: "Nothing" }, { text: "slips" }, { text: "—" }],
    slideAndReveal: [
      { text: "FlowSense", highlight: true },
      { text: "handles", highlight: true },
      { text: "it.", highlight: true },
    ],
    holdMs: 900,
  },
]

const WORD_DELAY = 0.22    // seconds between words appearing
const HOLD_MS   = 700      // extra hold after last word
const EXIT_MS   = 320      // duration of exit blur

type WordState = "hidden" | "visible" | "exiting"

interface WordAnim {
  text: string
  highlight: boolean
  state: WordState
}

function buildInitial(scene: Scene): WordAnim[] {
  const all = [
    ...scene.words.map((w) => ({ text: w.text, highlight: !!w.highlight, state: "hidden" as WordState })),
    ...(scene.slideAndReveal ?? []).map((w) => ({ text: w.text, highlight: !!w.highlight, state: "hidden" as WordState })),
  ]
  return all
}

function AnimWord({ word }: { word: WordAnim }) {
  const isVisible  = word.state === "visible"
  const isExiting  = word.state === "exiting"
  const isHidden   = word.state === "hidden"

  const opacity = isVisible ? 1 : 0
  const blur    = isVisible ? 0 : 18
  const scale   = isVisible ? 1 : isExiting ? 1.08 : 1.12
  const color   = word.highlight ? (isVisible ? "#6f7bd2" : "#0d0d0d") : "#0d0d0d"

  return (
    <span
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        transition: isHidden
          ? "none"
          : `opacity ${isExiting ? EXIT_MS : 300}ms cubic-bezier(0.22,1,0.36,1),
             filter ${isExiting ? EXIT_MS : 300}ms cubic-bezier(0.22,1,0.36,1),
             transform ${isExiting ? EXIT_MS : 300}ms cubic-bezier(0.22,1,0.36,1),
             color 200ms ease`,
        opacity,
        filter: `blur(${blur}px)`,
        transform: `scale(${scale})`,
        color,
      }}
    >
      {word.text}
    </span>
  )
}

function SceneView({
  scene,
  onDone,
}: {
  scene: Scene
  onDone: () => void
}) {
  const totalWords = scene.words.length + (scene.slideAndReveal?.length ?? 0)
  const [words, setWords] = useState<WordAnim[]>(buildInitial(scene))

  useEffect(() => {
    let cancelled = false

    async function run() {
      // Reveal each word one by one
      for (let i = 0; i < totalWords; i++) {
        if (cancelled) return
        await new Promise<void>((r) => setTimeout(r, i === 0 ? 60 : WORD_DELAY * 1000))
        if (cancelled) return
        setWords((prev) =>
          prev.map((w, idx) => (idx === i ? { ...w, state: "visible" } : w))
        )
      }

      // Hold
      await new Promise<void>((r) => setTimeout(r, scene.holdMs + HOLD_MS))
      if (cancelled) return

      // Exit all
      setWords((prev) => prev.map((w) => ({ ...w, state: "exiting" })))
      await new Promise<void>((r) => setTimeout(r, EXIT_MS + 60))

      if (!cancelled) onDone()
    }

    run()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <span className="inline-flex flex-wrap items-baseline justify-center gap-x-[0.32em]">
      {words.map((word, i) => (
        <AnimWord key={i} word={word} />
      ))}
    </span>
  )
}

export function KineticTextSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [sceneIndex, setSceneIndex] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (inView && !started) setStarted(true)
  }, [inView, started])

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-20"
    >
      <div className="text-center font-display text-4xl leading-tight text-[#0d0d0d] sm:text-5xl lg:text-6xl">
        {started && (
          <SceneView
            key={sceneIndex}
            scene={SCENES[sceneIndex]}
            onDone={() => setSceneIndex((prev) => (prev + 1) % SCENES.length)}
          />
        )}
      </div>
    </section>
  )
}
