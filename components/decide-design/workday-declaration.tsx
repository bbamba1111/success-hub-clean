"use client"

import { useState } from "react"
import { RefreshCw, Sparkles } from "lucide-react"
import { useWeeklyCommitments } from "@/lib/weekly-commitments/use-weekly-commitments"
import {
  buildWorkdayDeclaration,
  hasEnoughForDeclaration,
  WORKDAY_DECLARATION_VARIANT_COUNT,
} from "@/lib/weekly-commitments/workday-declaration"

/**
 * My 4-Hour CEO Workday Declaration™
 *
 * Builder mode (Decide & Design™ → 4-Hour Focused CEO Workday accordion):
 * shows the three chosen priorities as the raw material, then "Build My
 * Declaration" weaves them into one first-person statement the founder can
 * cycle, edit, and save. It persists on the weekly commitments record.
 *
 * Read mode (live CEO Workday™ Mon–Thu): the saved declaration only, to be
 * read before the first hour block. Nothing else.
 */
export function WorkdayDeclaration({ mode = "build" }: { mode?: "build" | "read" }) {
  const { commitments: c, update, saveWeek, isLoading } = useWeeklyCommitments()
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const ready = hasEnoughForDeclaration(c)

  if (mode === "read") {
    if (!c.workdayDeclaration) return null
    return (
      <blockquote className="rounded-2xl border border-brand-green/25 bg-brand-green/[0.05] px-6 py-6 sm:px-8">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-green">
          My 4-Hour CEO Workday Declaration™ · read this first
        </p>
        <p className="mt-3 font-serif text-lg leading-relaxed text-foreground text-pretty sm:text-xl">{c.workdayDeclaration}</p>
      </blockquote>
    )
  }

  function build(variant = c.workdayDeclarationVariant) {
    const text = buildWorkdayDeclaration(c, variant)
    update({
      workdayDeclaration: text,
      workdayDeclarationVariant: variant,
      workdayDeclarationEdited: false,
      workdayDeclarationBuiltAt: new Date().toISOString(),
    })
  }

  async function save() {
    setSaving(true)
    setError(null)
    const res = await saveWeek()
    setSaving(false)
    if (res.ok) setSavedAt(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }))
    else setError(res.error ?? "Could not save.")
  }

  const rows: Array<{ label: string; value: string | null }> = [
    { label: "Life", value: c.lifePriority },
    { label: "Delegation", value: c.delegationPriority },
    { label: "Operating rule", value: c.operatingRule },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-green">
          My 4-Hour CEO Workday Declaration™
        </p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground text-pretty">
          Your three Weekly Priorities™ become one declaration — what these four hours are for, and what they are
          protected from. It opens your CEO Workday™ every day this week.
        </p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-3">
        {rows.map((r) => (
          <li key={r.label} className="rounded-xl border border-border bg-card px-4 py-3">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{r.label}</p>
            <p className={`mt-1 font-sans text-sm ${r.value ? "text-foreground" : "italic text-muted-foreground"}`}>
              {r.value ?? "Still to choose"}
            </p>
          </li>
        ))}
      </ul>

      {!ready ? (
        <p className="font-sans text-sm italic text-muted-foreground">
          Choose at least one priority above and your declaration can be built.
        </p>
      ) : !c.workdayDeclaration ? (
        <button
          type="button"
          onClick={() => build(0)}
          disabled={isLoading}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 font-sans text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" aria-hidden /> Build My Declaration
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <label className="block">
            <span className="sr-only">My 4-Hour CEO Workday Declaration</span>
            <textarea
              value={c.workdayDeclaration}
              onChange={(e) => update({ workdayDeclaration: e.target.value, workdayDeclarationEdited: true })}
              rows={5}
              className="w-full resize-y rounded-2xl border border-brand-green/25 bg-brand-green/[0.05] px-5 py-4 font-serif text-base leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/30 sm:text-lg"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => build((c.workdayDeclarationVariant + 1) % WORKDAY_DECLARATION_VARIANT_COUNT)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 font-sans text-xs font-semibold text-foreground hover:bg-muted"
            >
              <RefreshCw className="h-3 w-3" aria-hidden /> Say it differently
            </button>
            {c.workdayDeclarationEdited && (
              <button
                type="button"
                onClick={() => build()}
                className="font-sans text-xs font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                Reset to generated
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="ml-auto rounded-full bg-brand-green px-5 py-2 font-sans text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save My Declaration"}
            </button>
          </div>
          {savedAt && !error && (
            <p className="font-sans text-xs text-brand-green">Saved {savedAt}. It will open your CEO Workday™ this week.</p>
          )}
          {error && <p className="font-sans text-xs text-destructive">{error}</p>}
        </div>
      )}
    </div>
  )
}
