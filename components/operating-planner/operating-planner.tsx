"use client"

/**
 * OperatingPlanner™ — the ONE reusable workspace every Operating Segment uses.
 * Phase 3C reframes it as an immersive ROOM, not a stack of UI boxes: members
 * enter the 4-Hour Focused CEO Workday™ (etc.), and the planner is simply part
 * of that experience.
 *
 * Editorial principles applied here:
 *   • Sections are separated by whitespace + Harmony Divider™ hairlines, not
 *     borders around every block.
 *   • Glass is reserved for MOMENTS — Cherry Blossom Guidance™ and Today's
 *     Operating Rule™ — everything else stays beautifully minimal.
 *   • Typography carries the hierarchy: Playfair (titles), Lora (guidance,
 *     prompts, reflections), Montserrat (labels, UI).
 *   • The experience reveals slowly and calmly on open.
 *
 * The five parts of every room:
 *   1. Cherry Blossom Guidance™ — a concierge welcome
 *   2. Today's Operating Rule™  — the centerpiece commitment (PERSISTED)
 *   3. Operating Planner™        — a short executive planning session (prompts)
 *   4. CEO Workday Blocks™       — CEO only, a 5-step journey (built later)
 *   5. Harmony Soundscapes™ / Win the Segment™ — quiet placeholders
 */

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import type { BlockId } from "@/operating-engine"
import { PLANNER_CONFIG, type CeoBlock } from "@/components/operating-planner/planner-config"
import { OperatingRuleCard } from "@/components/operating-planner/operating-rule-card"

interface OperatingPlannerProps {
  blockId: BlockId
}

/** Time-of-day concierge greeting — warm, never robotic. */
function useGreeting() {
  const [greeting, setGreeting] = useState("Welcome.")
  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? "Good morning." : h < 17 ? "Good afternoon." : "Good evening.")
  }, [])
  return greeting
}

/**
 * A calm, staggered reveal so the room settles in gently rather than snapping
 * open. Purely presentational; respects reduced-motion via motion-safe.
 */
function Reveal({ show, index = 0, children }: { show: boolean; index?: number; children: React.ReactNode }) {
  return (
    <div
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
      style={{ transitionDelay: show ? `${index * 110}ms` : "0ms" }}
    >
      {children}
    </div>
  )
}

/** A quiet editorial section label — no box, just typographic hierarchy. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="ds-eyebrow text-brand-green-dark/80">{children}</p>
}

/** Operating Planner™ — an executive planning session of reflective prompts. */
function PlanningSession({ prompts }: { prompts: string[] }) {
  const [answers, setAnswers] = useState<string[]>(() => prompts.map(() => ""))
  return (
    <div className="space-y-7">
      {prompts.map((prompt, i) => (
        <div key={prompt}>
          <label className="block font-serif text-lg leading-snug text-brand-ink" htmlFor={`prompt-${i}`}>
            {prompt}
          </label>
          <textarea
            id={`prompt-${i}`}
            value={answers[i]}
            onChange={(e) => setAnswers((prev) => prev.map((a, idx) => (idx === i ? e.target.value : a)))}
            rows={1}
            placeholder="Take a moment…"
            className="mt-2 w-full resize-none border-0 border-b border-black/10 bg-transparent px-0 py-2 font-serif text-[15px] italic leading-relaxed text-brand-ink-soft placeholder:not-italic placeholder:text-muted-foreground/60 focus:border-brand-green focus:outline-none focus:ring-0"
          />
        </div>
      ))}
    </div>
  )
}

/** CEO Workday Blocks™ — a five-step journey, not a set of dropdowns. */
function CeoJourney({ blocks }: { blocks: CeoBlock[] }) {
  return (
    <ol className="space-y-6">
      {blocks.map((block, i) => (
        <li key={block.id} className="flex gap-4 sm:gap-5">
          {/* Step indicator + connector */}
          <div className="flex flex-col items-center">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-green/40 bg-white/70 font-sans text-sm font-semibold text-brand-green-dark">
              {i + 1}
            </span>
            {i < blocks.length - 1 && <span className="mt-1 w-px flex-1 bg-black/10" aria-hidden />}
          </div>
          {/* Step content */}
          <div className="pb-1">
            <p className="ds-eyebrow text-brand-green-dark/70">{`Step ${i + 1} of ${blocks.length}`}</p>
            <h4 className="mt-0.5 font-display text-lg text-brand-ink">{block.title}</h4>
            <p className="mt-1 font-serif text-[15px] leading-relaxed text-brand-ink-soft">{block.description}</p>
            <span className="mt-2 inline-block text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
              Arriving soon
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function OperatingPlanner({ blockId }: OperatingPlannerProps) {
  const config = PLANNER_CONFIG[blockId]
  const [open, setOpen] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const greeting = useGreeting()

  // Trigger the staggered reveal shortly after the body opens.
  useEffect(() => {
    if (!open) {
      setRevealed(false)
      return
    }
    const t = setTimeout(() => setRevealed(true), 40)
    return () => clearTimeout(t)
  }, [open])

  if (!config) return null
  const isCeo = blockId === "ceo-workday"

  return (
    // The room. Sits fully below the hero on a white band; its surface tint and
    // generous spacing make it feel like a distinct, calm environment.
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-[4.5rem] pt-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl shadow-ds" style={{ backgroundColor: config.surface }}>
        {/* Room header — identifies the SEGMENT, not "the planner". */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`operating-planner-body-${blockId}`}
          className="flex w-full items-start justify-between gap-4 px-6 pt-8 pb-6 text-left sm:px-10 sm:pt-10"
        >
          <span>
            <span className="ds-eyebrow text-brand-green-dark/70">{config.workspaceLabel}</span>
            <span className="mt-1.5 block font-display text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
              {config.title}
            </span>
            <span className="mt-2 block font-serif text-sm italic text-brand-ink-soft">{config.atmosphere}</span>
          </span>
          <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-brand-ink-soft">
            <ChevronDown className={`ds-icon transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
            <span className="sr-only">{open ? "Collapse workspace" : "Expand workspace"}</span>
          </span>
        </button>

        {open && (
          <div
            id={`operating-planner-body-${blockId}`}
            className="px-6 pb-12 sm:px-10 lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-x-14"
          >
            {/* LEFT COLUMN — guidance + the planning session */}
            <div className="space-y-10">
              {/* 1 · Cherry Blossom Guidance™ — a concierge welcome, in glass */}
              <Reveal show={revealed} index={0}>
                <section className="harmony-glass p-6 sm:p-7">
                  <SectionLabel>Cherry Blossom Guidance™</SectionLabel>
                  <p className="mt-3 font-serif text-xl leading-relaxed text-brand-ink">{greeting}</p>
                  <p className="mt-2 font-serif text-lg leading-relaxed text-brand-ink-soft text-pretty">
                    {config.guidance}
                  </p>
                </section>
              </Reveal>

              {/* 3 · Operating Planner™ — the executive planning session */}
              <Reveal show={revealed} index={2}>
                <section>
                  <SectionLabel>Operating Planner™</SectionLabel>
                  <h3 className="mt-1 font-display text-xl text-brand-ink">Design this segment</h3>
                  <div className="mt-5">
                    <PlanningSession prompts={config.prompts} />
                  </div>
                </section>
              </Reveal>

              {/* 4 · CEO Workday Blocks™ — the journey (CEO only) */}
              {isCeo && config.ceoBlocks && (
                <Reveal show={revealed} index={3}>
                  <section>
                    <hr className="harmony-divider mb-8" />
                    <SectionLabel>CEO Workday Blocks™</SectionLabel>
                    <h3 className="mt-1 mb-6 font-display text-xl text-brand-ink">Your execution journey</h3>
                    <CeoJourney blocks={config.ceoBlocks} />
                  </section>
                </Reveal>
              )}
            </div>

            {/* RIGHT COLUMN — the centerpiece rule + quiet placeholders */}
            <div className="mt-10 space-y-10 lg:mt-0">
              {/* 2 · Today's Operating Rule™ — the centerpiece commitment */}
              <Reveal show={revealed} index={1}>
                <OperatingRuleCard segmentId={blockId} defaultRuleType={config.defaultRuleType} allowAllTypes={isCeo} />
              </Reveal>

              {/* 5 · Quiet placeholders — minimal, no heavy boxes */}
              <Reveal show={revealed} index={4}>
                <section>
                  <hr className="harmony-divider mb-8" />
                  <div className="space-y-6">
                    <div>
                      <SectionLabel>Harmony Soundscapes™</SectionLabel>
                      <p className="mt-1.5 font-serif text-[15px] leading-relaxed text-brand-ink-soft">
                        Curated soundscapes to help you find focus and flow.{" "}
                        <span className="text-muted-foreground/70">Arriving soon.</span>
                      </p>
                    </div>
                    <div>
                      <SectionLabel>Win the Segment™</SectionLabel>
                      <p className="mt-1.5 font-serif text-[15px] leading-relaxed text-brand-ink-soft">
                        A short reflection to capture your win and close with intention.{" "}
                        <span className="text-muted-foreground/70">Arriving soon.</span>
                      </p>
                    </div>
                  </div>
                </section>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OperatingPlanner
