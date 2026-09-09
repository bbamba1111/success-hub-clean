"use client"

/**
 * Business Bottleneck Audit™ (BBA™) — Completed Baseline Summary
 * ---------------------------------------------------------------------------
 * The read-back view of a finished baseline, mirroring the Business Context
 * Profile™ summary: every category is a card listing the founder's answers,
 * and each card's "Edit" re-opens the baseline wizard at that category (see
 * BbaPageClient). Fully data-driven from bba-registry.ts — it resolves option
 * ids to labels, expands multi-selects, folds in each "Other: ___" free text,
 * and appends the shared ownership answer, so adding a question later needs
 * no change here.
 */

import { ChevronRight, Pencil } from "lucide-react"
import { BBA_CATEGORIES, BBA_QUESTIONS } from "@/lib/business-bottleneck-audit/bba-registry"
import {
  BBA_OWNERSHIP_OPTIONS,
  type BbaBaselineResponses,
  type BbaCategoryId,
  type BbaOption,
  type BbaQuestion,
  type BbaResponseValue,
} from "@/lib/business-bottleneck-audit/types"

function questionIsVisible(question: BbaQuestion, responses: BbaBaselineResponses): boolean {
  if (!question.showIf) return true
  const answer = responses[question.showIf.questionId]
  if (answer === undefined) return false
  const answerIds = Array.isArray(answer) ? answer : [String(answer)]
  return question.showIf.equalsAny.some((id) => answerIds.includes(id))
}

function optionLabel(
  options: BbaOption[] | undefined,
  id: string,
  questionId: string,
  otherText: Record<string, string>,
): string {
  const opt = options?.find((o) => o.id === id)
  if (!opt) return id
  if (opt.allowOtherText && otherText[questionId]) return `${opt.label}: ${otherText[questionId]}`
  return opt.label
}

function formatAnswer(
  question: BbaQuestion,
  value: BbaResponseValue | undefined,
  otherText: Record<string, string>,
): string | null {
  if (value === undefined || value === "") return null
  if (Array.isArray(value)) {
    if (value.length === 0) return null
    return value.map((id) => optionLabel(question.options, id, question.id, otherText)).join(", ")
  }
  if (question.kind === "single-select") {
    return optionLabel(question.options, String(value), question.id, otherText)
  }
  return String(value)
}

interface AnsweredItem {
  prompt: string
  answer: string
}

function Field({ prompt, answer }: AnsweredItem) {
  return (
    <div>
      <p className="font-sans text-[13px] font-semibold leading-snug text-brand-ink mb-0.5 text-pretty">{prompt}</p>
      <p className="font-sans text-sm text-brand-ink-soft leading-relaxed">{answer}</p>
    </div>
  )
}

function SummarySection({
  title,
  items,
  onEdit,
}: {
  title: string
  items: AnsweredItem[]
  onEdit: () => void
}) {
  return (
    <div className="rounded-3xl border border-brand-green/20 bg-white shadow-sm px-6 py-6 sm:px-8">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green-dark">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/25 bg-white px-3.5 py-1.5 font-sans text-xs font-semibold text-brand-ink-soft transition-colors hover:border-brand-green/50 hover:text-brand-ink"
        >
          <Pencil className="h-3 w-3" aria-hidden />
          Edit
        </button>
      </div>
      {items.length > 0 ? (
        <div className="grid gap-3.5 sm:grid-cols-2">
          {items.map((item) => (
            <Field key={item.prompt} prompt={item.prompt} answer={item.answer} />
          ))}
        </div>
      ) : (
        <p className="font-sans text-sm text-brand-ink-soft/70 italic">No answers recorded for this area yet.</p>
      )}
    </div>
  )
}

export function BbaBaselineSummary({
  responses,
  otherText,
  onEditCategory,
  onContinue,
  continueLabel = "Continue",
}: {
  responses: BbaBaselineResponses
  otherText: Record<string, string>
  onEditCategory: (categoryId: BbaCategoryId) => void
  /** Advances to the next onboarding step. Omit outside onboarding. */
  onContinue?: () => void
  continueLabel?: string
}) {
  const orderedCategories = [...BBA_CATEGORIES].sort((a, b) => a.order - b.order)

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <span className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-green-dark">
            Business Bottleneck Audit™
          </span>
          <p className="mt-1 font-sans text-xl font-bold text-brand-ink">Complete — review &amp; edit</p>
        </div>
        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 font-sans text-sm font-bold text-white transition-colors hover:bg-brand-green-dark"
          >
            {continueLabel}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </div>

      {orderedCategories.map((category) => {
        const categoryQuestions = BBA_QUESTIONS.filter(
          (q) => q.categoryId === category.id && q.status === "active",
        ).sort((a, b) => a.order - b.order)

        const items: AnsweredItem[] = []
        for (const question of categoryQuestions) {
          if (!questionIsVisible(question, responses)) continue
          const answer = formatAnswer(question, responses[question.id], otherText)
          if (answer) items.push({ prompt: question.prompt, answer })
        }

        if (category.hasOwnershipQuestion) {
          const ownershipId = `${category.id}.ownership`
          const ownershipQuestion: BbaQuestion = {
            id: ownershipId,
            categoryId: category.id,
            kind: "single-select",
            prompt: `Who currently owns ${category.name}?`,
            options: BBA_OWNERSHIP_OPTIONS,
            order: 999,
            status: "active",
          }
          const answer = formatAnswer(ownershipQuestion, responses[ownershipId], otherText)
          if (answer) items.push({ prompt: ownershipQuestion.prompt, answer })
        }

        return (
          <SummarySection
            key={category.id}
            title={category.name}
            items={items}
            onEdit={() => onEditCategory(category.id)}
          />
        )
      })}

      {onContinue && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-6 py-3 font-sans text-sm font-bold text-white transition-colors hover:bg-brand-green-dark"
          >
            {continueLabel}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}
