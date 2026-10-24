"use client"

/**
 * Business Bottleneck Audit™ (BBA™) — Baseline Wizard
 * ---------------------------------------------------------------------------
 * Fully data-driven against lib/business-bottleneck-audit/bba-registry.ts —
 * adding a question later never requires touching this component. Renders
 * ONE category per screen (15 screens total) with generic single-select /
 * multi-select / text / number renderers, and evaluates each question's
 * optional `showIf` conditional branch against the founder's live answers.
 *
 * This is a ONE-TIME baseline (manually re-runnable later) — it is NOT
 * retaken every Monday. See bba-weekly-checkin.tsx for the lightweight
 * Monday layer.
 */

import { useCallback, useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { BBA_CATEGORIES, BBA_QUESTIONS } from "@/lib/business-bottleneck-audit/bba-registry"
import {
  BBA_OWNERSHIP_OPTIONS,
  type BbaBaselineResponses,
  type BbaCategoryId,
  type BbaQuestion,
  type BbaResponseValue,
} from "@/lib/business-bottleneck-audit/types"
import { saveBaselineDraft, saveBbaBaseline } from "@/lib/business-bottleneck-audit/bba-storage"

function questionIsVisible(question: BbaQuestion, responses: Record<string, BbaResponseValue>): boolean {
  if (!question.showIf) return true
  const answer = responses[question.showIf.questionId]
  if (answer === undefined) return false
  const answerIds = Array.isArray(answer) ? answer : [String(answer)]
  return question.showIf.equalsAny.some((id) => answerIds.includes(id))
}

function OtherTextField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Please specify…"
      className="mt-2 w-full rounded-xl border border-brand-green/25 bg-white px-4 py-2.5 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-brand-green/40"
    />
  )
}

function QuestionBlock({
  question,
  response,
  otherText,
  onAnswer,
  onOtherText,
}: {
  question: BbaQuestion
  response: BbaResponseValue | undefined
  otherText: string
  onAnswer: (value: BbaResponseValue) => void
  onOtherText: (value: string) => void
}) {
  const selectedIds = Array.isArray(response) ? response : response !== undefined ? [String(response)] : []
  const showOtherField = question.options?.some((o) => o.allowOtherText && selectedIds.includes(o.id))

  return (
    <div className="py-5 border-b border-brand-green/10 last:border-b-0">
      <p className="font-sans text-[15px] font-semibold leading-snug text-brand-ink text-balance mb-1">
        {question.prompt}
      </p>
      {question.helperText && (
        <p className="font-sans text-xs font-medium text-brand-ink-soft mb-3">{question.helperText}</p>
      )}

      {(question.kind === "single-select" || question.kind === "multi-select") && question.options && (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={question.prompt}>
          {question.options.map((option) => {
            const isSelected = selectedIds.includes(option.id)
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  if (question.kind === "single-select") {
                    onAnswer(option.id)
                  } else {
                    const next = isSelected ? selectedIds.filter((id) => id !== option.id) : [...selectedIds, option.id]
                    onAnswer(next)
                  }
                }}
                className={`rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors border ${
                  isSelected
                    ? "bg-brand-green text-white border-brand-green"
                    : "bg-white text-brand-ink-soft border-brand-green/25 hover:border-brand-green/50"
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}

      {question.kind === "text" && (
        <input
          type="text"
          value={typeof response === "string" ? response : ""}
          onChange={(e) => onAnswer(e.target.value)}
          className="mt-2 w-full rounded-xl border border-brand-green/25 bg-white px-4 py-2.5 font-sans text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/40"
        />
      )}

      {question.kind === "number" && (
        <input
          type="number"
          value={typeof response === "number" ? response : ""}
          onChange={(e) => onAnswer(e.target.value === "" ? "" : Number(e.target.value))}
          className="mt-2 w-full max-w-[10rem] rounded-xl border border-brand-green/25 bg-white px-4 py-2.5 font-sans text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/40"
        />
      )}

      {question.kind === "time" && (
        <input
          type="time"
          value={typeof response === "string" ? response : ""}
          onChange={(e) => onAnswer(e.target.value)}
          className="mt-2 w-full max-w-[10rem] rounded-xl border border-brand-green/25 bg-white px-4 py-2.5 font-sans text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/40"
        />
      )}

      {showOtherField && <OtherTextField value={otherText} onChange={onOtherText} />}
    </div>
  )
}

export default function BbaBaselineWizard({
  onComplete,
  initialResponses,
  initialOtherText,
  startCategoryId,
  completeLabel = "Complete Audit",
}: {
  onComplete: () => void
  /** Prefill answers when re-opening the audit to edit an existing baseline. */
  initialResponses?: BbaBaselineResponses
  initialOtherText?: Record<string, string>
  /** Open directly on a specific category (used by the summary's per-section Edit). */
  startCategoryId?: BbaCategoryId
  /** Label for the final action — e.g. "Save Changes" when editing. */
  completeLabel?: string
}) {
  const orderedCategories = useMemo(() => [...BBA_CATEGORIES].sort((a, b) => a.order - b.order), [])
  const [categoryIndex, setCategoryIndex] = useState(() => {
    if (!startCategoryId) return 0
    const idx = orderedCategories.findIndex((c) => c.id === startCategoryId)
    return idx >= 0 ? idx : 0
  })
  const [responses, setResponses] = useState<Record<string, BbaResponseValue>>(() => initialResponses ?? {})
  const [otherText, setOtherText] = useState<Record<string, string>>(() => initialOtherText ?? {})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const category = orderedCategories[categoryIndex]
  const isLastCategory = categoryIndex === orderedCategories.length - 1

  const categoryQuestions = useMemo(
    () =>
      BBA_QUESTIONS.filter((q) => q.categoryId === category.id && q.status === "active").sort((a, b) => a.order - b.order),
    [category.id],
  )

  const visibleQuestions = categoryQuestions.filter((q) => questionIsVisible(q, responses))

  const handleAnswer = useCallback(
    (questionId: string, value: BbaResponseValue) => {
      setResponses((prev) => {
        const next = { ...prev, [questionId]: value }
        saveBaselineDraft(next, otherText)
        return next
      })
    },
    [otherText],
  )

  const handleOtherText = useCallback(
    (questionId: string, value: string) => {
      setOtherText((prev) => {
        const next = { ...prev, [questionId]: value }
        saveBaselineDraft(responses, next)
        return next
      })
    },
    [responses],
  )

  const handleNext = useCallback(async () => {
    if (!isLastCategory) {
      setCategoryIndex((i) => i + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setSaving(true)
    setSaveError(null)
    const result = await saveBbaBaseline(responses, otherText)
    setSaving(false)

    if (!result.success) {
      setSaveError(
        result.error === "not-signed-in"
          ? "Please sign in to save your Business Bottleneck Audit™."
          : "We couldn't save your audit — please try again.",
      )
      return
    }

    onComplete()
  }, [isLastCategory, onComplete, otherText, responses])

  const handleBack = useCallback(() => {
    if (categoryIndex > 0) {
      setCategoryIndex((i) => i - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [categoryIndex])

  const globalProgress = ((categoryIndex + 1) / orderedCategories.length) * 100

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Progress header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-brand-green-dark">
            Business Bottleneck Audit™
          </span>
          <span className="font-sans text-xs font-medium text-brand-ink-soft tabular-nums">
            Category {categoryIndex + 1} / {orderedCategories.length}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-brand-green/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-green transition-all duration-300"
            style={{ width: `${globalProgress}%` }}
          />
        </div>
      </div>

      {/* Category card */}
      <div className="rounded-3xl bg-white border border-brand-green/20 shadow-lg overflow-hidden">
        <div className="px-7 pt-8 pb-2 sm:px-9 sm:pt-9">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green-dark mb-1">
            {category.name}
          </p>
          <p className="font-sans text-sm font-medium text-brand-ink-soft mb-2">
            Answer honestly — there are no right or wrong answers. This becomes the baseline GPS™ uses to guide your
            next Business Building Assignment.
          </p>

          <div className="divide-y divide-transparent">
            {visibleQuestions.map((question) => (
              <QuestionBlock
                key={question.id}
                question={question}
                response={responses[question.id]}
                otherText={otherText[question.id] ?? ""}
                onAnswer={(value) => handleAnswer(question.id, value)}
                onOtherText={(value) => handleOtherText(question.id, value)}
              />
            ))}

            {category.hasOwnershipQuestion && (
              <QuestionBlock
                question={{
                  id: `${category.id}.ownership`,
                  categoryId: category.id,
                  kind: "single-select",
                  prompt: `Who currently owns ${category.name}?`,
                  options: BBA_OWNERSHIP_OPTIONS,
                  order: 999,
                  status: "active",
                }}
                response={responses[`${category.id}.ownership`]}
                otherText={otherText[`${category.id}.ownership`] ?? ""}
                onAnswer={(value) => handleAnswer(`${category.id}.ownership`, value)}
                onOtherText={(value) => handleOtherText(`${category.id}.ownership`, value)}
              />
            )}
          </div>
        </div>

        {saveError && (
          <div className="px-7 sm:px-9 pb-2">
            <p className="font-sans text-sm font-medium text-red-600">{saveError}</p>
          </div>
        )}

        {/* Footer nav */}
        <div className="flex items-center justify-between border-t border-brand-green/20 px-7 py-4 sm:px-9">
          <button
            type="button"
            onClick={handleBack}
            disabled={categoryIndex === 0}
            className="font-sans text-sm font-medium text-brand-ink-soft hover:text-brand-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2 font-sans text-sm font-bold text-white shadow transition-colors hover:bg-brand-green-dark disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
          >
            {saving ? "Saving…" : isLastCategory ? completeLabel : "Next Category"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Category progress chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {orderedCategories.map((c, i) => (
          <span
            key={c.id}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-semibold transition-colors ${
              i < categoryIndex
                ? "bg-brand-green/15 text-brand-green-dark"
                : i === categoryIndex
                  ? "bg-brand-green text-white"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {c.name.replace("™", "")}
          </span>
        ))}
      </div>
    </div>
  )
}
