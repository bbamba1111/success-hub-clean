"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, RefreshCw, Sparkles } from "lucide-react"
import { useWeeklyCommitments } from "@/lib/weekly-commitments/use-weekly-commitments"
import { getLatestBoundaryReport } from "@/lib/boundary-report/actions"
import type { BoundaryReportData } from "@/lib/boundary-report/types"
import { useWeeklyBoundaryFocus } from "@/lib/weekly-boundary-focus/use-weekly-boundary-focus"
import { getDateKey, loadDailyIdentity } from "@/lib/daily-identity/storage"

/**
 * My 4-Hour CEO Workday Declaration™
 *
 * Builder mode (Decide & Design™): woven from this week's THREE decisions —
 *   1. Decide Who You're Being This Week (daily identity statement)
 *   2. My Weekly Life Priorities™ (what I'm making room for)
 *   3. My Weekly Work-Life Balance Boundary Focus™ (the one boundary)
 * "Build My Declaration" weaves them into one first-person statement the
 * founder can cycle, edit, and save. It persists on the weekly commitments
 * record (workdayDeclaration) so the live CEO Workday™ can read it all week.
 *
 * Read mode (live CEO Workday™): the saved declaration only, to be read
 * before the first hour block. Nothing else.
 */

const VARIANT_COUNT = 3

function lowerFirst(s: string): string {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s
}

function joinList(items: string[]): string {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
}

function buildDeclaration(
  identity: string,
  priorityLabels: string[],
  boundary: string,
  variant: number,
): string {
  const who = lowerFirst(identity.trim())
  const prio = joinList(priorityLabels)
  const bound = boundary.trim()
  const sentences: string[] = []

  switch (variant % VARIANT_COUNT) {
    case 0: {
      if (who) sentences.push(`This week I am being ${who}.`)
      if (prio) sentences.push(`I am focused on ${prio}.`)
      if (bound) sentences.push(`The one boundary I am building into my business and living this week: ${bound}.`)
      break
    }
    case 1: {
      if (who) sentences.push(`I am ${who} this week.`)
      if (prio && bound)
        sentences.push(`I'm protecting time for ${prio}, and I'm holding one boundary that makes it real: ${bound}.`)
      else if (prio) sentences.push(`I'm protecting time for ${prio}.`)
      else if (bound) sentences.push(`I'm holding one boundary that makes it real: ${bound}.`)
      break
    }
    default: {
      if (who) sentences.push(`This week I lead as ${who}.`)
      if (prio && bound)
        sentences.push(`My life comes first — ${prio} — and I protect it with one boundary: ${bound}.`)
      else if (prio) sentences.push(`My life comes first: ${prio}.`)
      else if (bound) sentences.push(`I protect my life with one boundary: ${bound}.`)
      break
    }
  }

  return sentences.join(" ")
}

export function WorkdayDeclaration({ mode = "build" }: { mode?: "build" | "read" }) {
  const { commitments: c, update, saveWeek, isLoading } = useWeeklyCommitments()
  const { focus } = useWeeklyBoundaryFocus()

  // Priority Focus Areas™ are carried over from the most recent Work-Life
  // Balance Reality Check™ (Thursday/Sunday) — they replace the old freeform
  // "life priorities" as the middle strand of the declaration.
  const [report, setReport] = useState<BoundaryReportData | null>(null)
  useEffect(() => {
    let active = true
    getLatestBoundaryReport()
      .then((res) => {
        if (active) setReport(res?.data ?? null)
      })
      .catch(() => {
        if (active) setReport(null)
      })
    return () => {
      active = false
    }
  }, [])

  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Identity is stored per-day in localStorage. Re-read it whenever the other
  // two inputs change so the preview stays fresh; build() also reads it live.
  const [identity, setIdentity] = useState("")
  useEffect(() => {
    setIdentity(loadDailyIdentity(getDateKey())?.identityStatement?.trim() ?? "")
  }, [report, focus.boundaryText])

  if (mode === "read") {
    if (!c.workdayDeclaration) return null
    return (
      <blockquote className="rounded-2xl border border-brand-green/25 bg-brand-green/[0.05] px-6 py-6 sm:px-8">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-green">
          My 4-Hour CEO Workday Declaration™ · read this first
        </p>
        <p className="mt-3 font-serif text-lg leading-relaxed text-foreground text-pretty sm:text-xl">
          {c.workdayDeclaration}
        </p>
      </blockquote>
    )
  }

  const priorityLabels = (report?.priorityAreas ?? []).map((a) => a.label)
  const boundary = focus.boundaryText ?? ""
  const ready = Boolean(identity.trim() || priorityLabels.length > 0 || boundary.trim())

  function build(variant = c.workdayDeclarationVariant) {
    // Read identity live at build time so the saved declaration is always current.
    const liveIdentity = loadDailyIdentity(getDateKey())?.identityStatement?.trim() ?? identity
    const text = buildDeclaration(liveIdentity, priorityLabels, boundary, variant)
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
    { label: "Who I'm being", value: identity.trim() || null },
    { label: "Priority Focus Areas", value: priorityLabels.length > 0 ? priorityLabels.join(", ") : null },
    { label: "Boundary focus", value: boundary.trim() || null },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-brand-green">
          My 4-Hour CEO Workday Declaration™
        </p>
        <p className="mt-1 font-sans text-sm text-muted-foreground leading-relaxed text-pretty">
          One statement of what these four hours are for — and what they protect.
        </p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-3">
        {rows.map((r) => (
          <li
            key={r.label}
            className={`relative rounded-xl border px-4 py-3 ${
              r.value ? "border-brand-green/40 bg-brand-green/[0.05]" : "border-border bg-card"
            }`}
          >
            {r.value && (
              <CheckCircle2
                className="absolute right-2 top-2 h-4 w-4 text-brand-green"
                aria-label="Confirmed"
              />
            )}
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground pr-6">
              {r.label}
            </p>
            <p className={`mt-1 font-sans text-sm ${r.value ? "text-foreground" : "italic text-muted-foreground"}`}>
              {r.value ?? "Still to choose"}
            </p>
          </li>
        ))}
      </ul>

      {!ready ? (
        <p className="font-sans text-sm italic text-muted-foreground">
          Decide who you&apos;re being or set your boundary focus, and your declaration can be built. Your Priority Focus
          Areas™ carry over from your Reality Check™.
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
              onClick={() => build((c.workdayDeclarationVariant + 1) % VARIANT_COUNT)}
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
            <p className="font-sans text-xs text-brand-green">
              Saved {savedAt}. It will open your CEO Workday™ this week.
            </p>
          )}
          {error && <p className="font-sans text-xs text-destructive">{error}</p>}
        </div>
      )}
    </div>
  )
}
