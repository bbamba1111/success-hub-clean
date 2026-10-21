"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import useSWR, { useSWRConfig } from "swr"
import { ArrowRight, History, Loader2, RotateCcw } from "lucide-react"
import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"
import { WeeklyResults, formatAuditDate, formatPeriod } from "@/components/weekly-audit/weekly-results"
import { WeeklyPriorityPicker } from "@/components/weekly-audit/weekly-priority-picker"
import {
  completeWeeklyAudit,
  loadWeeklyAudit,
  saveWeeklyDraft,
  setWeeklyPriorities,
} from "@/lib/boundary-report/weekly-actions"
import { CURRENT_PRIORITY_FOCUS_KEY, useCurrentPriorityFocus } from "@/lib/boundary-report/use-current-priority-focus"
import type { WeeklyAuditDraft, WeeklyAuditReport } from "@/lib/boundary-report/weekly-types"
import { AUDIT_QUESTION_COUNT } from "@/lib/work-life-balance-audit/questions"

const WEEKLY_AUDIT_KEY = "weekly-audit"

type Stage = "overview" | "questions" | "submitting" | "results" | "priorities" | "saved"

export function WeeklyAuditFlow() {
  const { data, isLoading, mutate } = useSWR(WEEKLY_AUDIT_KEY, () => loadWeeklyAudit(), { revalidateOnFocus: false })
  const { data: currentFocus } = useCurrentPriorityFocus()
  const { mutate: globalMutate } = useSWRConfig()

  const [stage, setStage] = useState<Stage>("overview")
  const [active, setActive] = useState<{ id: string; report: WeeklyAuditReport } | null>(null)
  const [resumeDraft, setResumeDraft] = useState<WeeklyAuditDraft | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const saveChain = useRef<Promise<unknown>>(Promise.resolve())
  const pendingDraft = useRef<WeeklyAuditDraft | null>(null)
  const submitting = useRef(false)

  function queueDraftSave(draft: WeeklyAuditDraft) {
    if (submitting.current) return
    pendingDraft.current = draft
    setSaveStatus("saving")
    saveChain.current = saveChain.current.then(async () => {
      const next = pendingDraft.current
      if (!next || submitting.current) return
      pendingDraft.current = null
      const res = await saveWeeklyDraft(next)
      setSaveStatus(res.ok ? "saved" : "error")
    })
  }

  async function submit(answers: Record<number, number>) {
    submitting.current = true
    setStage("submitting")
    setError(null)
    await saveChain.current.catch(() => undefined)
    const res = await completeWeeklyAudit(answers)
    submitting.current = false
    if (!res.ok || !res.id || !res.report) {
      setError(res.error ?? "We couldn't save your 7-day results.")
      setResumeDraft({ answers, questionIndex: AUDIT_QUESTION_COUNT - 1 })
      setStage("questions")
      return
    }
    setActive({ id: res.id, report: res.report })
    setStage("results")
    void mutate()
  }

  async function savePriorities(keys: string[]): Promise<string | null> {
    if (!active) return "We couldn't find these results."
    const res = await setWeeklyPriorities(active.id, keys)
    if (!res.ok || !res.report) return res.error ?? "We couldn't save your priorities."
    setActive({ id: active.id, report: res.report })
    setStage("saved")
    void mutate()
    void globalMutate(CURRENT_PRIORITY_FOCUS_KEY)
    return null
  }

  function begin(draft: WeeklyAuditDraft | null) {
    setResumeDraft(draft)
    setSaveStatus("idle")
    setError(null)
    setStage("questions")
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 font-sans text-sm text-brand-ink-soft">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading your weekly audit…
      </div>
    )
  }

  if (!data.signedIn) {
    return (
      <p className="py-8 text-center font-sans text-sm text-brand-ink-soft">
        Sign in to take your Weekly 7-Day Work-Life Balance Audit™ and keep your results.
      </p>
    )
  }

  if (stage === "questions") {
    return (
      <div className="flex flex-col">
        {error && (
          <p role="alert" className="mx-auto w-full max-w-4xl px-4 pt-4 font-sans text-sm text-brand-coral">
            {error}
          </p>
        )}
        <p aria-live="polite" className="mx-auto h-5 w-full max-w-4xl px-4 pt-3 text-right font-sans text-xs text-brand-ink-soft">
          {saveStatus === "saving" && "Saving your progress…"}
          {saveStatus === "saved" && "Progress saved"}
          {saveStatus === "error" && "We couldn't save your progress"}
        </p>
        <WorkLifeBalanceAudit
          assessmentWindow="7-day"
          assessmentType="weekly_7_day"
          persistLocally={false}
          initialAnswers={resumeDraft?.answers}
          initialQuestionIndex={resumeDraft?.questionIndex}
          onAnswersChange={(answers, questionIndex) => queueDraftSave({ answers, questionIndex })}
          onComplete={(_results, answers) => void submit(answers)}
        />
      </div>
    )
  }

  if (stage === "submitting") {
    return (
      <div className="flex items-center justify-center gap-2 py-12 font-sans text-sm text-brand-ink-soft">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Saving your 7-day results…
      </div>
    )
  }

  if (active && (stage === "results" || stage === "priorities" || stage === "saved")) {
    const previous =
      currentFocus && currentFocus.reportId !== active.id
        ? {
            labels: currentFocus.priorityAreas.map((a) => a.label),
            keys: currentFocus.priorityAreas.map((a) => a.key),
            date: currentFocus.date,
          }
        : null
    return (
      <div className="flex flex-col gap-8 px-4 py-8 sm:px-6">
        {stage === "saved" && (
          <p role="status" className="rounded-2xl bg-brand-green/10 px-5 py-3 font-sans text-sm font-semibold text-brand-green">
            Your Priority Focus Areas™ are saved and now guide Decide &amp; Design™ and your CEO Workday Declaration™.
          </p>
        )}
        <WeeklyResults report={active.report} />
        {stage === "results" && (
          <button
            type="button"
            onClick={() => setStage("priorities")}
            className="inline-flex items-center justify-center gap-2 self-end rounded-full bg-brand-coral px-7 py-3 font-sans text-sm font-bold text-white shadow-md transition-all hover:brightness-105"
          >
            Choose My Priority Focus Areas™
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        )}
        {stage === "priorities" && (
          <WeeklyPriorityPicker
            areas={active.report.areas}
            resultsDate={active.report.completedAt}
            previous={previous}
            initialKeys={active.report.priorityAreas.map((a) => a.key)}
            onSave={savePriorities}
          />
        )}
        {stage === "saved" && (
          <button
            type="button"
            onClick={() => setStage("priorities")}
            className="self-end font-sans text-sm font-semibold text-brand-coral underline-offset-4 hover:underline"
          >
            Change my priorities
          </button>
        )}
      </div>
    )
  }

  const { draft, latest, history } = data
  const answered = draft ? Object.keys(draft.answers).length : 0

  return (
    <div className="flex flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-brand-blush bg-white px-6 py-6">
        <p className="font-sans text-sm leading-relaxed text-brand-ink text-pretty">
          Fifteen questions about the past seven days. Your answers save as you go, so you can leave and resume anytime.
          This weekly audit is separate from your 30-day baseline, which is never changed.
        </p>
        <div className="flex flex-wrap gap-3">
          {draft && answered > 0 ? (
            <>
              <button
                type="button"
                onClick={() => begin(draft)}
                className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-6 py-3 font-sans text-sm font-bold text-white shadow-md transition-all hover:brightness-105"
              >
                Resume my audit ({answered} of {AUDIT_QUESTION_COUNT} answered)
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => begin({ answers: {}, questionIndex: 0 })}
                className="inline-flex items-center gap-2 rounded-full border border-brand-coral/40 px-6 py-3 font-sans text-sm font-bold text-brand-coral hover:bg-brand-blush/40"
              >
                <RotateCcw className="h-4 w-4" aria-hidden /> Start over
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => begin(null)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-6 py-3 font-sans text-sm font-bold text-white shadow-md transition-all hover:brightness-105"
            >
              Begin My 7-Day Audit
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {latest && (
        <div className="flex flex-col gap-3 rounded-3xl border border-brand-blush bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">
              Latest 7-day results
            </p>
            <p className="font-sans text-sm text-brand-ink">
              <span className="font-bold tabular-nums">{latest.report.overall}</span> overall · completed{" "}
              {formatAuditDate(latest.report.completedAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActive(latest)
              setStage("priorities")
            }}
            className="self-start rounded-full border border-brand-coral/40 px-5 py-2.5 font-sans text-xs font-bold text-brand-coral hover:bg-brand-blush/40 sm:self-center"
          >
            Use these results to choose priorities
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">
            <History className="h-3.5 w-3.5" aria-hidden /> Weekly audit history
          </p>
          <ul className="flex flex-col gap-2">
            {history.map((h) => (
              <li key={h.id}>
                <Link
                  href={`/my-report/weekly/${h.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-brand-blush bg-white px-5 py-3 transition-colors hover:border-brand-coral/50"
                >
                  <span className="flex flex-col">
                    <span className="font-sans text-sm font-semibold text-brand-ink">
                      {formatPeriod(h.periodStart, h.periodEnd)}
                    </span>
                    <span className="font-sans text-xs text-brand-ink-soft">
                      {h.priorityLabels.length > 0 ? h.priorityLabels.join(", ") : "No priorities chosen"}
                    </span>
                  </span>
                  <span className="font-sans text-sm font-bold tabular-nums text-brand-ink">{h.overall}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
