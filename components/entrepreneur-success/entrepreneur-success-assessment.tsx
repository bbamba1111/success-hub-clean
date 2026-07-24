"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  OPERATING_PILLARS,
  ASSESSMENT_QUESTIONS,
  OPERATING_PRACTICES,
} from "@/lib/entrepreneur-success/esa-registry"
import { computeEsaResults, type ResponseValue } from "@/lib/entrepreneur-success/scoring"
import { saveEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import type { AssessmentQuestion } from "@/lib/entrepreneur-success/types"
import { ArrowRight } from "lucide-react"

const REDIRECT_DELAY = 6 // seconds before auto-redirect

/* ── Cherry Blossom completion screen ──────────────────────────────────── */
function CompletionScreen({ resultsUrl }: { resultsUrl: string }) {
  const router = useRouter()
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_DELAY)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval)
          router.push(resultsUrl)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [router, resultsUrl])

  const pct = ((REDIRECT_DELAY - secondsLeft) / REDIRECT_DELAY) * 100

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-0">
      {/* Cherry Blossom avatar */}
      <span className="relative inline-flex h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-brand-blush shadow-md mb-5">
        <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
      </span>

      <span className="text-xs font-bold uppercase tracking-[0.22em] text-brand-coral mb-6">
        Cherry Blossom&trade;
      </span>

      {/* Card */}
      <section
        aria-label="Assessment complete — Cherry Blossom message"
        className="relative overflow-hidden rounded-2xl border border-brand-blush bg-white/80 backdrop-blur-sm shadow-ds w-full text-left"
      >
        {/* Coral left spine */}
        <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-brand-coral/70 rounded-l-2xl" />
        {/* Blush ambient */}
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-blush/50 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-brand-green/10 blur-2xl" />

        <div className="relative px-8 py-9 sm:px-10 sm:py-10">
          <p className="font-sans font-bold text-2xl text-brand-ink mb-4 text-balance">
            You did it. That took courage.
          </p>

          <div className="font-sans font-medium text-[15px] leading-relaxed text-brand-ink-soft space-y-3 text-pretty mb-7">
            <p>
              You just completed the <strong>Entrepreneur Success Assessment&trade;</strong> — a
              honest look at how you are actually operating across the Eight Pillars&trade; of a
              high-performing founder life.
            </p>
            <p>
              Most women never stop long enough to ask these questions. You did. That
              is already a form of leadership.
            </p>
            <p>
              I am taking everything you shared and weaving it into your personal{" "}
              <strong>Work-Life Harmony Blueprint&trade;</strong>. This is where your operating
              system begins.
            </p>
            <p>
              Get ready. Your blueprint is being prepared now.
            </p>
          </div>

          {/* Auto-redirect progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-brand-ink-soft">
                Preparing your Blueprint&trade;&hellip;
              </span>
              <span className="text-xs font-semibold tabular-nums text-brand-coral">
                {secondsLeft}s
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-brand-green/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-green transition-all duration-1000 ease-linear"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Manual CTA */}
          <button
            type="button"
            onClick={() => router.push(resultsUrl)}
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-white shadow-ds transition-colors hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30"
          >
            Take Me to My Blueprint&trade;
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </section>
    </div>
  )
}

const ORDERED_QUESTIONS: AssessmentQuestion[] = OPERATING_PILLARS.flatMap((pillar) =>
  ASSESSMENT_QUESTIONS.filter(
    (q) => q.pillarId === pillar.id && q.status === "active"
  ).sort((a, b) => a.order - b.order)
)

const TOTAL = ORDERED_QUESTIONS.length

/**
 * Descending green palette: Always (darkest) → Never (lightest).
 * Mirrors the WLB Audit pink scale exactly — same structure, different hue.
 */
const ESA_OPTIONS = [
  { label: "Always",    value: 100 as ResponseValue, bg: "bg-[#1E5C2B]", hover: "hover:bg-[#174D24]", text: "text-white",      dot: "1" },
  { label: "Often",     value: 75  as ResponseValue, bg: "bg-[#3A7D48]", hover: "hover:bg-[#2E6B3C]", text: "text-white",      dot: "2" },
  { label: "Sometimes", value: 50  as ResponseValue, bg: "bg-[#5B9E6A]", hover: "hover:bg-[#4E8E5C]", text: "text-white",      dot: "3" },
  { label: "Rarely",    value: 25  as ResponseValue, bg: "bg-[#A3C9A8]", hover: "hover:bg-[#93BA98]", text: "text-brand-ink",  dot: "4" },
  { label: "Never",     value: 0   as ResponseValue, bg: "bg-[#D4EAD6]", hover: "hover:bg-[#C5DFC8]", text: "text-brand-ink",  dot: "5" },
]

export default function EntrepreneurSuccessAssessment({
  resultsUrl = "https://success-hub-clean-ics7g40y6-thought-leader-barbaras-projects.vercel.app/harmony-blueprint",
}: {
  resultsUrl?: string
}) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [complete, setComplete] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  // Only scroll to the question card after the founder answers the first question.
  // This preserves the hero-first experience on initial page load.
  const hasAnsweredRef = useRef(false)

  // Hero-first: always start at the top of the page on mount.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  const question = ORDERED_QUESTIONS[currentIndex]
  const pillar = OPERATING_PILLARS.find((p) => p.id === question.pillarId)
  const practice = OPERATING_PRACTICES.find((p) => p.id === question.practiceId)

  const prevPillarId = currentIndex > 0 ? ORDERED_QUESTIONS[currentIndex - 1].pillarId : null
  const isNewPillar = currentIndex === 0 || prevPillarId !== question.pillarId

  const pillarQuestions = ORDERED_QUESTIONS.filter((q) => q.pillarId === question.pillarId)
  const pillarQuestionIndex = pillarQuestions.findIndex((q) => q.id === question.id)
  const pillarProgress = ((pillarQuestionIndex + 1) / pillarQuestions.length) * 100

  const globalProgress = (currentIndex / TOTAL) * 100

  // Scroll to the question card on every question change — but NOT on the initial
  // mount so the hero section is visible when the page first loads.
  useEffect(() => {
    if (!hasAnsweredRef.current) return
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [currentIndex])

  const handleAnswer = useCallback(
    (value: ResponseValue) => {
      hasAnsweredRef.current = true
      const updated = { ...responses, [question.id]: value }
      setResponses(updated)
      if (currentIndex < TOTAL - 1) {
        setCurrentIndex((i) => i + 1)
      } else {
        const results = computeEsaResults(updated)
        saveEsaResults(results)
        setComplete(true)
      }
    },
    [currentIndex, question.id, responses, router, resultsUrl]
  )

  const handleBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }, [currentIndex])

  if (complete) {
    return <CompletionScreen resultsUrl={resultsUrl} />
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10" ref={cardRef}>
      {/* Progress header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-green-dark">
            Entrepreneur Success Assessment™
          </span>
          <span className="font-sans text-xs font-medium text-brand-ink-soft tabular-nums">
            {currentIndex + 1} / {TOTAL}
          </span>
        </div>
        {/* Progress bar — brand green */}
        <div className="h-1.5 w-full rounded-full bg-brand-green/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-green transition-all duration-300"
            style={{ width: `${globalProgress}%` }}
          />
        </div>
      </div>

      {/* Pillar transition banner — shown at first question of each new pillar */}
      {isNewPillar && pillar && (
        <div className="mb-5 rounded-2xl bg-brand-green/8 border border-brand-green/20 px-6 py-4 flex items-start gap-4">
          <div className="mt-1 h-10 w-1 rounded-full bg-brand-green shrink-0" aria-hidden />
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green-dark mb-0.5">
              Pillar {OPERATING_PILLARS.findIndex((p) => p.id === pillar.id) + 1} of {OPERATING_PILLARS.length}
            </p>
            <p className="font-sans text-base font-bold text-brand-ink">{pillar.name}</p>
            <p className="font-sans text-sm font-medium text-brand-ink-soft mt-0.5">{pillar.tagline}</p>
          </div>
        </div>
      )}

      {/* Question card — same dimensions as WLB Audit card */}
      <div className="rounded-3xl bg-white border border-brand-green/20 shadow-lg overflow-hidden">
        <div className="px-7 pt-8 pb-2 sm:px-9 sm:pt-9">
          {/* Practice label */}
          {practice && (
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green-dark mb-3">
              {practice.name}
            </p>
          )}

          {/* Question text — Montserrat semibold, NOT Playfair */}
          <p className="font-sans text-[17px] font-semibold leading-snug text-brand-ink text-balance mb-2">
            {question.question}
          </p>

          {/* Coaching context */}
          {question.coachingContext && (
            <p className="font-sans text-sm font-medium text-brand-ink-soft mb-5 leading-relaxed">
              {question.coachingContext}
            </p>
          )}

          {!question.coachingContext && (
            <p className="font-sans text-sm font-medium text-brand-ink-soft mb-7">
              On a scale from 1 to 5 &mdash; 1 being never, 5 being always.
            </p>
          )}

          {/* Answer options — descending green */}
          <div className="flex flex-col gap-2.5 pb-7" role="radiogroup" aria-label="Response options">
            {ESA_OPTIONS.map((option, i) => {
              const isSelected = responses[question.id] === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleAnswer(option.value)}
                  className={`
                    ${isSelected ? "ring-2 ring-brand-green ring-offset-1" : ""}
                    ${option.bg} ${option.hover} ${option.text}
                    w-full flex items-center gap-4 rounded-2xl px-5 py-4
                    font-sans font-semibold text-[15px] text-left
                    transition-all duration-150 hover:scale-[1.015] active:scale-[0.99]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/50
                  `}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold text-sm">
                    {5 - i}
                  </span>
                  {option.label}
                  {isSelected && (
                    <span className="ml-auto h-5 w-5 rounded-full bg-white/30 flex items-center justify-center shrink-0">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer nav — mirrors WLB Audit footer */}
        <div className="flex items-center justify-between border-t border-brand-green/20 px-7 py-4 sm:px-9">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="font-sans text-sm font-medium text-brand-ink-soft hover:text-brand-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            ← Previous
          </button>
          {responses[question.id] !== undefined && (
            <button
              type="button"
              onClick={() => handleAnswer(responses[question.id] as ResponseValue)}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2 font-sans text-sm font-bold text-white shadow transition-colors hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
            >
              {currentIndex < TOTAL - 1 ? "Next" : "View Results"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Pillar progress chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {OPERATING_PILLARS.map((p) => {
          const pillarQs = ORDERED_QUESTIONS.filter((q) => q.pillarId === p.id)
          const isCompleted = pillarQs.every((q) => responses[q.id] !== undefined)
          const isCurrent = p.id === question.pillarId
          return (
            <span
              key={p.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-semibold transition-colors ${
                isCompleted
                  ? "bg-brand-green/15 text-brand-green-dark"
                  : isCurrent
                  ? "bg-brand-green text-white"
                  : "bg-muted text-muted-foreground"
              }`}
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
  )
}
