"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { MAX_WEEKLY_PRIORITIES, type WeeklyAreaScore } from "@/lib/boundary-report/weekly-types"
import { formatAuditDate } from "@/components/weekly-audit/weekly-results"

export function WeeklyPriorityPicker({
  areas,
  resultsDate,
  previous,
  initialKeys,
  onSave,
}: {
  areas: WeeklyAreaScore[]
  resultsDate: string
  previous: { labels: string[]; keys: string[]; date: string } | null
  initialKeys: string[]
  onSave: (keys: string[]) => Promise<string | null>
}) {
  const [selected, setSelected] = useState<string[]>(initialKeys)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sorted = [...areas].sort((a, b) => a.score - b.score)

  function toggle(key: string) {
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : s.length >= MAX_WEEKLY_PRIORITIES ? s : [...s, key]))
  }

  async function save() {
    setSaving(true)
    setError(null)
    const err = await onSave(selected)
    setSaving(false)
    if (err) setError(err)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-brand-tan-dark">
          My Priority Focus Areas™
        </p>
        <p className="font-sans text-sm leading-relaxed text-brand-ink text-pretty">
          Choose one to three areas to focus on this week, informed by your latest Work-Life Balance Audit™.
        </p>
        <p className="font-sans text-xs text-brand-ink-soft">
          Based on your 7-day results from {formatAuditDate(resultsDate)}. These are this week&apos;s priorities, separate
          from your Monthly Business Boundary Focus™.
        </p>
      </div>

      {previous && previous.labels.length > 0 && (
        <div className="flex flex-col gap-2 rounded-2xl border border-brand-sage-light bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-brand-ink-soft text-pretty">
            Last selected {formatAuditDate(previous.date)}:{" "}
            <span className="font-semibold text-brand-ink">{previous.labels.join(", ")}</span>
          </p>
          <button
            type="button"
            onClick={() => setSelected(previous.keys.filter((k) => areas.some((a) => a.key === k)).slice(0, MAX_WEEKLY_PRIORITIES))}
            className="shrink-0 self-start rounded-full border border-brand-tan-dark/40 px-4 py-2 font-sans text-xs font-bold text-brand-tan-dark hover:bg-brand-sage-light/40 sm:self-center"
          >
            Carry these forward
          </button>
        </div>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Priority Focus Areas, choose up to three</legend>
        <p aria-live="polite" className="font-sans text-xs font-semibold text-brand-ink-soft">
          {selected.length} of {MAX_WEEKLY_PRIORITIES} selected
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {sorted.map((a) => {
            const active = selected.includes(a.key)
            const disabled = !active && selected.length >= MAX_WEEKLY_PRIORITIES
            return (
              <button
                key={a.key}
                type="button"
                aria-pressed={active}
                disabled={disabled}
                onClick={() => toggle(a.key)}
                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left font-sans text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  active ? "border-brand-tan-dark bg-brand-tan-dark/10 text-brand-ink" : "border-brand-sage-light bg-white text-brand-ink hover:border-brand-tan-dark/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${active ? "border-brand-tan-dark bg-brand-tan-dark" : "border-brand-sage-light"}`}
                    aria-hidden
                  >
                    {active && <Check className="h-3 w-3 text-white" />}
                  </span>
                  {a.label}
                </span>
                <span className="tabular-nums text-brand-ink-soft">{a.score}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="font-sans text-sm text-brand-tan-dark">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={save}
        disabled={saving || selected.length < 1}
        className="inline-flex items-center justify-center gap-2 self-end rounded-full bg-brand-tan-dark px-7 py-3 font-sans text-sm font-bold text-white shadow-md transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Save My Priority Focus Areas™
      </button>
    </div>
  )
}
