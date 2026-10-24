"use client"

/**
 * Second Opinion™ panel (Phase 11)
 * ---------------------------------------------------------------------------
 * Explains the existing recommendation — never a second intelligence engine.
 * Every answer here comes from `deriveSecondOpinion()`, which restates real
 * Founder GPS™ / Executive Decision Engine™ / Build Blueprint™ signals.
 */

import { useState } from "react"
import { MessageCircleQuestion, ChevronDown } from "lucide-react"

import type { SecondOpinion } from "@/lib/build-strategy/types"

function QARow({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-brand-blush/50 pb-3 last:border-0 last:pb-0">
      <p className="font-sans text-xs font-bold text-brand-ink">{question}</p>
      <p className="mt-1 font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">{answer}</p>
    </div>
  )
}

function QAList({ question, answers }: { question: string; answers: string[] }) {
  if (answers.length === 0) return null
  return (
    <div className="border-b border-brand-blush/50 pb-3 last:border-0 last:pb-0">
      <p className="font-sans text-xs font-bold text-brand-ink">{question}</p>
      <ul className="mt-1 space-y-1">
        {answers.map((a, i) => (
          <li key={i} className="font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">
            • {a}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SecondOpinionPanel({ secondOpinion }: { secondOpinion: SecondOpinion }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-brand-blush/60 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2.5">
          <MessageCircleQuestion className="h-4 w-4 text-[#C13B6B]" aria-hidden />
          <span className="font-sans text-sm font-semibold text-brand-ink">Get a Second Opinion™</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-brand-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-brand-blush/60 bg-brand-cream/40 px-5 py-4">
          <p className="font-sans text-xs leading-relaxed text-brand-ink-soft/80 text-pretty">
            This restates what your Founder GPS™, Business Model Profile™, and Executive Decision Engine™ already
            know — it's not a second recommendation.
          </p>
          <QARow question="Is this the right thing to build?" answer={secondOpinion.isRightThingToBuild} />
          <QARow question="Is this the right time?" answer={secondOpinion.isRightTime} />
          <QARow question="Is this the right Build Path™?" answer={secondOpinion.isRightBuildPath} />
          <QAList question="What are the alternatives?" answers={secondOpinion.alternatives} />
          <QAList question="What are the tradeoffs?" answers={secondOpinion.tradeoffs} />
          <QAList question="What would change this recommendation?" answers={secondOpinion.whatWouldChangeThisRecommendation} />
          <QAList question="What should you retain?" answers={secondOpinion.founderShouldRetain} />
          <QAList question="What can be handed off?" answers={secondOpinion.canBeHandedOff} />
          <QARow question="What is the risk of doing nothing?" answer={secondOpinion.riskOfDoingNothing} />
        </div>
      )}
    </div>
  )
}
