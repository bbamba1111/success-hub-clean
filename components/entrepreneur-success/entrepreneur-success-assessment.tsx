"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ChevronLeft } from "lucide-react"
import {
  OPERATING_PILLARS,
  ASSESSMENT_QUESTIONS,
  OPERATING_PRACTICES,
} from "@/lib/entrepreneur-success/esa-registry"
import { RESPONSE_OPTIONS, computeEsaResults, type ResponseValue } from "@/lib/entrepreneur-success/scoring"
import { saveEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import type { AssessmentQuestion } from "@/lib/entrepreneur-success/types"

/* ---------------------------------------------------------------------------
 * Build a flat ordered list: questions grouped by pillar, pillars in registry
 * order. This gives a natural narrative arc matching the 8 Operating Pillars™.
 * -------------------------------------------------------------------------*/
const ORDERED_QUESTIONS: AssessmentQuestion[] = OPERATING_PILLARS.flatMap((pillar) =>
  ASSESSMENT_QUESTIONS.filter(
    (q) => q.pillarId === pillar.id && q.status === "active"
  ).sort((a, b) => a.order - b.order)
)

const TOTAL = ORDERED_QUESTIONS.length

/* pillar color accent — neutral editorial palette, never purple */
const PILLAR_ACCENT: Record<string, string> = {
  "strategic-foundation": "bg-brand-ink",
  "revenue-engine": "bg-brand-green",
  "operations-systems": "bg-brand-ink-soft",
  "financial-intelligence": "bg-brand-green-dark",
  "people-leadership": "bg-brand-coral",
  "client-excellence": "bg-brand-coral-dark",
  "growth-innovation": "bg-brand-ink",
  "human-sustainability": "bg-brand-green",
}

export default function EntrepreneurSuccessAssessment({
  resultsUrl = "/my-results/entrepreneur-success",
}: {
  resultsUrl?: string
}) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})

  const question = ORDERED_QUESTIONS[currentIndex]
  const pillar = OPERATING_PILLARS.find((p) => p.id === question.pillarId)
  const practice = OPERATING_PRACTICES.find((p) => p.id === question.practiceId)

  /* Count how many questions belong to the CURRENT pillar for the sub-progress */
  const pillarQuestions = ORDERED_QUESTIONS.filter((q) => q.pillarId === question.pillarId)
  const pillarQuestionIndex = pillarQuestions.findIndex((q) => q.id === question.id)
  const pillarProgress = ((pillarQuestionIndex + 1) / pillarQuestions.length) * 100

  /* ── Check whether we've moved to a new pillar ────────────────────────── */
  const prevPillarId = currentIndex > 0 ? ORDERED_QUESTIONS[currentIndex - 1].pillarId : null
  const isNewPillar = currentIndex === 0 || prevPillarId !== question.pillarId

  /* ── Global progress ─────────────────────────────────────────────────── */
  const globalProgress = ((currentIndex) / TOTAL) * 100

  /* ── Handle answer selection ─────────────────────────────────────────── */
  const handleAnswer = useCallback(
    (value: ResponseValue) => {
      const updated = { ...responses, [question.id]: value }
      setResponses(updated)

      if (currentIndex < TOTAL - 1) {
        setCurrentIndex((i) => i + 1)
      } else {
        /* Assessment complete */
        const results = computeEsaResults(updated)
        saveEsaResults(results)
        router.push(resultsUrl)
      }
    },
    [currentIndex, question.id, responses, router, resultsUrl]
  )

  /* ── Navigate back ───────────────────────────────────────────────────── */
  const handleBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }, [currentIndex])

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── Progress header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Entrepreneur Success Assessment™
            </span>
            <span className="text-xs font-medium text-muted-foreground tabular-nums">
              {currentIndex + 1} / {TOTAL}
            </span>
          </div>
          <Progress value={globalProgress} className="h-1.5 bg-muted" />
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-24 pt-8">

        {/* ── Pillar transition card ─────────────────────────────────────── */}
        {isNewPillar && pillar && (
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-ds">
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 h-10 w-1 shrink-0 rounded-full ${PILLAR_ACCENT[pillar.id] ?? "bg-brand-ink"}`}
                aria-hidden
              />
              <div>
                <p className="ds-eyebrow text-brand-coral mb-1">
                  {`Pillar ${OPERATING_PILLARS.findIndex((p) => p.id === pillar.id) + 1} of ${OPERATING_PILLARS.length}`}
                </p>
                <h2 className="font-display text-xl font-bold tracking-tight text-brand-ink">{pillar.name}</h2>
                <p className="mt-1 text-sm leading-relaxed text-brand-ink-soft">{pillar.tagline}</p>
              </div>
            </div>
            <div className="mt-3 ml-6">
              <Progress value={pillarProgress} className="h-1 bg-muted" />
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                {pillarQuestionIndex + 1} of {pillarQuestions.length} questions in this pillar
              </p>
            </div>
          </div>
        )}

        {/* ── Question card ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card shadow-ds">
          <div className="p-6 sm:p-8">
            {/* Practice name */}
            {practice && (
              <p className="ds-eyebrow text-brand-coral-dark mb-3">{practice.name}</p>
            )}

            {/* Question text */}
            <p className="font-display text-xl font-semibold leading-snug tracking-tight text-brand-ink text-balance mb-6">
              {question.question}
            </p>

            {/* Coaching context */}
            {question.coachingContext && (
              <div className="mb-6 rounded-xl border border-brand-blush bg-brand-blush/30 px-4 py-3">
                <p className="text-sm font-serif italic leading-relaxed text-brand-ink-soft">
                  {question.coachingContext}
                </p>
              </div>
            )}

            {/* Response buttons */}
            <div
              className="flex flex-col gap-3"
              role="radiogroup"
              aria-label="Response options"
            >
              {RESPONSE_OPTIONS.map((option) => {
                const isSelected = responses[question.id] === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleAnswer(option.value as ResponseValue)}
                    className={`
                      flex items-center justify-between rounded-xl border px-5 py-4 text-left
                      transition-all duration-150 focus:outline-none focus-visible:ring-2
                      focus-visible:ring-brand-green/40
                      ${
                        isSelected
                          ? "border-brand-green bg-brand-green/5 shadow-sm"
                          : "border-border bg-background hover:border-brand-ink/30 hover:bg-muted/40"
                      }
                    `}
                  >
                    <span
                      className={`text-base font-semibold ${
                        isSelected ? "text-brand-green-dark" : "text-brand-ink"
                      }`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="ml-auto h-5 w-5 rounded-full bg-brand-green flex items-center justify-center shrink-0">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer navigation */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink-soft transition-colors hover:text-brand-ink disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back
            </button>
            {responses[question.id] !== undefined && (
              <button
                type="button"
                onClick={() => handleAnswer(responses[question.id] as ResponseValue)}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2 text-sm font-semibold text-white shadow-ds transition-colors hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
              >
                {currentIndex < TOTAL - 1 ? "Next" : "View Results"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>

        {/* ── Remaining pillar overview ──────────────────────────────────── */}
        <div className="mt-8 flex flex-wrap gap-2">
          {OPERATING_PILLARS.map((p, i) => {
            const pillarQs = ORDERED_QUESTIONS.filter((q) => q.pillarId === p.id)
            const firstIdx = ORDERED_QUESTIONS.findIndex((q) => q.pillarId === p.id)
            const isCompleted = pillarQs.every((q) => responses[q.id] !== undefined)
            const isCurrent = p.id === question.pillarId
            return (
              <span
                key={p.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isCompleted
                    ? "bg-brand-green/10 text-brand-green-dark"
                    : isCurrent
                    ? "bg-brand-ink text-white"
                    : "bg-muted text-muted-foreground"
                }`}
                aria-label={`${p.name}: ${isCompleted ? "completed" : isCurrent ? "in progress" : "upcoming"}`}
              >
                {isCompleted && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {p.name.replace("™", "")}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
