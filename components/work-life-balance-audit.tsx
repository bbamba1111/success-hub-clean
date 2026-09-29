"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight, RotateCcw } from "lucide-react"
import { saveAuditResults, type AuditData } from "@/utils/audit-storage"
import { saveRealityCheckSnapshot } from "@/utils/reality-check-storage"
import { useRouter } from "next/navigation"
import { getTimePhrase, saveAssessmentMeta, type AssessmentWindow, type AssessmentType } from "@/lib/assessment-cadence"

export const categoryLabels = {
  spiritual: "Spiritual Well-being",
  mental: "Mental Health",
  physicalMovement: "Physical Movement",
  physicalNourishment: "Physical Nourishment",
  physicalSleep: "Physical Sleep",
  emotional: "Emotional Health",
  personal: "Personal Growth",
  intellectual: "Intellectual Development",
  professional: "Professional Life",
  financial: "Financial Health",
  environmental: "Environmental Wellness",
  relational: "Relationships",
  social: "Social Connections",
  recreational: "Recreation & Fun",
  charitable: "Charitable Giving",
}

const questionBodies = [
  { id: 1,  category: "spiritual",           body: "how often have you connected to your spiritual life through prayer, study, fellowship, praise, music, meditation, nature, etc...?" },
  { id: 2,  category: "mental",              body: "how often have you effectively managed stress, made clear decisions, and maintained good mental health?" },
  { id: 3,  category: "physicalMovement",    body: "how often have you engaged in intentional movement or exercise?" },
  { id: 4,  category: "physicalNourishment", body: "how often have you nourished your body with adequate hydration and healthy meals?" },
  { id: 5,  category: "physicalSleep",       body: "how often have you gone to bed on time and gotten 8 hours of restorative sleep?" },
  { id: 6,  category: "emotional",           body: "how often have you felt happy, balanced, peaceful, and joyful emotionally?" },
  { id: 7,  category: "personal",            body: "how often have you made time for self-care and personal growth activities?" },
  { id: 8,  category: "intellectual",        body: "how often have you engaged in learning something new or a skill-building activity?" },
  { id: 9,  category: "professional",        body: "how often have you shared your expertise through partnerships, collaboration, public speaking or publishing and/or expanded your professional visibility through media, podcast interviews or publicity?" },
  { id: 10, category: "financial",          body: "how often have you focused intentionally on income/revenue generation, financial planning, retirement planning, business valuation and/or exit planning?" },
  { id: 11, category: "environmental",      body: "how often have you made effort to create beauty, balance, or order in your home or office environment?" },
  { id: 12, category: "relational",         body: "how often have you been attentive and present with your loved ones and in your closest relationships?" },
  { id: 13, category: "social",             body: "how often have you engaged with your friends or supportive, like-minded individuals?" },
  { id: 14, category: "recreational",       body: "how often have you created space for joy, creativity, vacation, travel or play?" },
  { id: 15, category: "charitable",         body: "how often have you contributed to supporting or inspiring others through donating, charity, volunteering or other philanthropic endeavors?" },
]

/**
 * Descending pink palette: Always (darkest) → Never (lightest).
 * Hover states shift one tone darker.
 */
const AUDIT_OPTIONS = [
  { value: 5, label: "Always",    bg: "bg-[#B5294A]", hover: "hover:bg-[#9E2040]", text: "text-white" },
  { value: 4, label: "Often",     bg: "bg-[#D45475]", hover: "hover:bg-[#C0466A]", text: "text-white" },
  { value: 3, label: "Sometimes", bg: "bg-[#E2849A]", hover: "hover:bg-[#D4738B]", text: "text-white" },
  { value: 2, label: "Rarely",    bg: "bg-[#EEB0BF]", hover: "hover:bg-[#E5A0B0]", text: "text-brand-ink" },
  { value: 1, label: "Never",     bg: "bg-[#F8DAE2]", hover: "hover:bg-[#F0CCD6]", text: "text-brand-ink" },
]

interface WorkLifeBalanceAuditProps {
  resultsUrl?: string
  assessmentWindow?: AssessmentWindow
  assessmentType?: AssessmentType
  /** When provided, the audit fires this immediately on completion instead of showing its own "Audit Complete" screen — used to embed the audit inline (e.g. Reflection Space™). Receives the final per-question answer map so the caller can persist it for reopening/retaking later. */
  onComplete?: (results: AuditData, answers: Record<number, number>) => void
  /** Reopening a previously completed audit (review or retake) — pre-fills every
   *  answer so selections are highlighted and nothing is lost if the member
   *  doesn't change anything. */
  initialAnswers?: Record<number, number>
  /** Jump straight to the last question when reopening — lets the member land on
   *  "← Previous" immediately to step backward and change an earlier answer,
   *  rather than re-clicking through all 15 questions from the top. */
  startAtLastQuestion?: boolean
}

export default function WorkLifeBalanceAudit({
  resultsUrl = "/my-results",
  assessmentWindow = "30-day" as AssessmentWindow,
  assessmentType = "baseline_30_day" as AssessmentType,
  onComplete,
  initialAnswers,
  startAtLastQuestion = false,
}: WorkLifeBalanceAuditProps) {
  const [currentQuestion, setCurrentQuestion] = useState(
    startAtLastQuestion ? questionBodies.length - 1 : 0,
  )
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers ?? {})
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState<any>(null)
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const completionRef = useRef<HTMLDivElement>(null)
  // Only scroll to the question card after the founder has answered Q1.
  // On initial page load the hero is visible and the founder scrolls down naturally.
  const hasAnsweredRef = useRef(false)

  // Hero-first: always start at the top of the page on mount — but only on the
  // standalone /audit page. When embedded (onComplete provided, e.g. Reflection
  // Space™), the audit lives inside an already-scrolled-to accordion, so forcing
  // the whole page back to its top here would yank the member away from the
  // card they just opened.
  useEffect(() => {
    if (onComplete) return
    window.scrollTo({ top: 0, behavior: "instant" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const timePhrase = getTimePhrase(assessmentWindow)
  const questions = questionBodies.map((q) => ({
    ...q,
    question: `${timePhrase}, ${q.body}`,
  }))

  // Scroll to the question card on every question change — but NOT on the initial
  // mount so the hero section is visible when the page first loads.
  useEffect(() => {
    if (!hasAnsweredRef.current) return
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [currentQuestion])

  // Scroll to Cherry Blossom's completion message when the audit finishes.
  useEffect(() => {
    if (isComplete && completionRef.current) {
      setTimeout(() => {
        completionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 120)
    }
  }, [isComplete])

  const handleAnswer = (questionId: number, score: number) => {
    hasAnsweredRef.current = true
    const newAnswers = { ...answers, [questionId]: score }
    setAnswers(newAnswers)
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults(newAnswers)
    }
  }

  const calculateResults = (finalAnswers: Record<number, number>) => {
    const categoryScores: Record<string, number[]> = {}
    questions.forEach((q) => {
      const score = finalAnswers[q.id] || 0
      if (!categoryScores[q.category]) categoryScores[q.category] = []
      categoryScores[q.category].push(score)
    })
    const categoryResults = Object.entries(categoryScores).map(([category, scores]) => {
      const average = scores.reduce((s, v) => s + v, 0) / scores.length
      return {
        category,
        percentage: Math.round((average / 5) * 100),
        label: categoryLabels[category as keyof typeof categoryLabels],
      }
    })
    const overallScore = Math.round(
      categoryResults.reduce((s, r) => s + r.percentage, 0) / categoryResults.length,
    )
    const auditResults = { overallScore, results: categoryResults, timestamp: Date.now(), assessmentType }
    setResults(auditResults)
    saveAssessmentMeta({ assessmentType, assessmentWindow, submittedAt: auditResults.timestamp })
    saveAuditResults(auditResults)
    void saveRealityCheckSnapshot({ overallScore, results: categoryResults, assessmentType })
    if (onComplete) {
      onComplete(auditResults, finalAnswers)
    } else {
      setIsComplete(true)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]

  if (isComplete && results) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-10" ref={completionRef}>
        <div className="rounded-3xl bg-white border border-brand-blush shadow-lg overflow-hidden">
          <div className="bg-brand-blush/40 px-8 py-6 text-center">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-brand-coral mb-2">
              Cherry Blossom&trade;
            </p>
            <h2 className="font-playfair text-3xl font-bold text-brand-ink">Audit Complete</h2>
          </div>
          <div className="px-8 py-8 text-center">
            <div className="text-6xl font-bold text-brand-coral font-sans mb-2">{results.overallScore}%</div>
            <p className="font-sans font-medium text-brand-ink-soft mb-8">
              {results.overallScore >= 80
                ? "Excellent Balance"
                : results.overallScore >= 70
                  ? "Good Balance"
                  : results.overallScore >= 60
                    ? "Fair Balance"
                    : "Room to Grow"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push(resultsUrl)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-coral px-8 py-3 font-sans text-sm font-bold text-white shadow transition-colors hover:bg-brand-coral-dark"
              >
                View Detailed Results
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setCurrentQuestion(0); setAnswers({}); setIsComplete(false); setResults(null) }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-coral/40 px-8 py-3 font-sans text-sm font-bold text-brand-coral hover:bg-brand-blush/40 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Audit
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10" ref={cardRef}>
      {/* Progress header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-coral">
            Work-Life Balance Audit™
          </span>
          <span className="font-sans text-xs font-medium text-brand-ink-soft tabular-nums">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
        {/* Progress bar — brand pink */}
        <div className="h-1.5 w-full rounded-full bg-brand-blush overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-coral transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-3xl bg-white border border-brand-blush/60 shadow-lg overflow-hidden">
        <div className="px-7 pt-8 pb-2 sm:px-9 sm:pt-9">
          {/* Category label */}
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-coral mb-3">
            {categoryLabels[currentQ.category as keyof typeof categoryLabels]}
          </p>

          {/* Question — Montserrat semibold, NOT Playfair */}
          <p className="font-sans text-[17px] font-semibold leading-snug text-brand-ink text-balance mb-2">
            {currentQ.question}
          </p>
          <p className="font-sans text-sm font-medium text-brand-ink-soft mb-7">
            On a scale from 1 to 5 &mdash; 1 being never, 5 being always.
          </p>

          {/* Answer options — descending pink. Previously-saved selections (when
              reopening a completed audit to review or change an answer) are
              highlighted with a ring so the member can see what they picked. */}
          <div className="flex flex-col gap-2.5 pb-7">
            {AUDIT_OPTIONS.map((option) => {
              const isSelected = answers[currentQ.id] === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                  aria-pressed={isSelected}
                  className={`
                    ${option.bg} ${option.hover} ${option.text}
                    w-full flex items-center gap-4 rounded-2xl px-5 py-4
                    font-sans font-semibold text-[15px] text-left
                    transition-all duration-150 hover:scale-[1.015] active:scale-[0.99]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/50
                    ${isSelected ? "ring-2 ring-offset-2 ring-brand-coral" : ""}
                  `}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold text-sm">
                    {option.value}
                  </span>
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between border-t border-brand-blush/50 px-7 py-4 sm:px-9">
          <button
            type="button"
            onClick={() => setCurrentQuestion((q) => Math.max(0, q - 1))}
            disabled={currentQuestion === 0}
            className="font-sans text-sm font-medium text-brand-ink-soft hover:text-brand-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            ← Previous
          </button>
          <span className="font-sans text-xs font-medium text-brand-ink-soft">
            {Math.round(progress)}% complete
          </span>
        </div>
      </div>
    </div>
  )
}
