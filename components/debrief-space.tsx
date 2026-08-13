"use client"

/**
 * DebriefSpace™
 *
 * Placeholder-level content for the Work-Life Balance Debrief™ — the
 * Monday-only block between the Reality Check™ and the Movement Window™.
 *
 * This is intentionally lightweight: a Cherry Blossom™ coaching moment plus
 * a few reflective prompts (display-only, not persisted) so the Debrief™
 * card never renders empty when expanded. Internal functionality (guided
 * journaling, AI reflection, scoring) is deferred to a later pass — mirrors
 * the "placeholder-level structure" convention used across
 * `operating-planner/planner-config.ts`.
 */

import { Sparkles } from "lucide-react"
import { useActiveSpace } from "@/components/active-space-provider"
import { SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"

const PROMPTS = [
  "What surfaced during your Reality Check™ that deserves a second look?",
  "What is one thing you're ready to let go of before the week gets moving?",
  "What would make today's Movement Window™ feel like a fresh start?",
]

export function DebriefSpace() {
  const activeSpace = useActiveSpace()
  const movementWindow = SCHEDULE_BY_ID["movement-window"]

  return (
    <section className="w-full space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3 pb-2">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">
          Debrief Space™
        </p>
        <h2 className="font-serif text-3xl font-semibold text-[#2E1F27] text-balance leading-tight">
          A protected pause to sit with what surfaced — before you move into today&apos;s Movement Window™.
        </h2>
      </div>

      {/* ── Cherry Blossom coaching ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#E26C73]/20 bg-[#FDF8F5] px-6 py-5 flex gap-4 items-start">
        <div className="shrink-0 mt-0.5">
          <span className="text-xl select-none" role="img" aria-label="Cherry blossom">
            🌸
          </span>
        </div>
        <div className="space-y-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#E26C73]">Cherry Blossom™</p>
          <p className="font-serif text-base font-semibold text-[#2E1F27] leading-snug">
            Sit with what surfaced.
          </p>
          <p className="font-sans text-sm text-[#3A2E33] leading-relaxed">
            Awareness without a pause to process it rarely becomes lasting change. Take a few quiet minutes before
            you move — no forms to fill out, nothing to complete. Just presence with what you already know.
          </p>
        </div>
      </div>

      {/* ── Reflective prompts — placeholder, display-only ─────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
          A Few Questions to Sit With
        </p>
        <div className="space-y-4">
          {PROMPTS.map((prompt) => (
            <div key={prompt} className="rounded-2xl border border-[#C8A4A7]/25 bg-[#FDFAF6] px-5 py-4">
              <p className="font-sans text-sm text-[#3A2E33] leading-relaxed">{prompt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Next Space™ handoff ───────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#7FB069]/20 bg-[#F7FBF4] px-6 py-5 text-center space-y-2">
        <p className="font-serif text-base font-semibold text-[#5B835F]">Ready when you are.</p>
        <p className="font-sans text-xs text-[#6B5860]">
          Carry this awareness straight into today&apos;s Movement Window™.
        </p>
        {movementWindow && (
          <button
            type="button"
            onClick={() => activeSpace?.enterSpace("movement-window", movementWindow.sectionId)}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#7FB069] px-6 py-2.5 font-montserrat text-sm font-bold uppercase tracking-[0.08em] text-white shadow-sm transition-colors hover:bg-[#6FA058] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB069]/40 focus-visible:ring-offset-2"
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            Enter Movement Space™
          </button>
        )}
      </div>
    </section>
  )
}
