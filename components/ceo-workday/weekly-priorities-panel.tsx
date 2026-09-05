"use client"

/**
 * This Week's Three Priorities™ — inside the live CEO Workday™.
 *
 * Mirrors the three Weekly Priorities™ the founder chose in Decide & Design™
 * (Supabase `weekly_commitments`, via the shared SWR hook, so it updates the
 * moment "Save My Week" lands). The priority wording stays owned by Decide &
 * Design, but each priority's INTENTION can be edited inline right here in the
 * workday via the same shared hook. The whole panel is collapsible so it can
 * step out of the way while she works. Nothing here is GPS-authored and
 * nothing is a task list — these are the three conditions the founder is
 * operating under this week, kept in view while she works.
 */

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, Compass, Pencil, SlidersHorizontal } from "lucide-react"

import { useWeeklyCommitments } from "@/lib/weekly-commitments/use-weekly-commitments"
import type { WeeklyCommitments } from "@/lib/weekly-commitments/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { WeeklyPrioritiesDesigner } from "@/components/decide-design/weekly-priorities-designer"

/** Maps each priority row to the `weekly_commitments` field its intention persists to. */
const INTENTION_FIELD: Record<string, keyof WeeklyCommitments> = {
  life: "lifeIntention",
  delegation: "delegationIntention",
  rule: "operatingRuleIntention",
}

const STATUS_LABEL: Record<string, string> = {
  "not-planned": "Not yet planned",
  "not-started": "Not started",
  planned: "Planned",
  "in-progress": "In progress",
  experienced: "Experienced",
  delegated: "Delegated",
  completed: "Completed",
  implemented: "In place",
  "needs-adjustment": "Needs adjustment",
  deferred: "Deferred",
  changed: "Changed",
  "no-longer-needed": "No longer needed",
}

const DONE = new Set(["experienced", "delegated", "completed", "implemented"])

function pick(c: WeeklyCommitments) {
  return [
    {
      key: "life",
      label: "Weekly Life Priority™",
      lead: "I am protecting",
      value: c.lifePriority,
      intention: c.lifeIntention,
      status: c.lifeStatus,
    },
    {
      key: "delegation",
      label: "Weekly Delegation Priority™",
      lead: "I am moving off my plate",
      value: c.delegationPriority,
      intention: c.delegationIntention,
      status: c.delegationStatus,
    },
    {
      key: "rule",
      label: "Weekly Operating Rule Priority™",
      lead: "I am changing how work operates",
      value: c.operatingRule,
      intention: c.operatingRuleIntention,
      status: c.operatingRuleStatus,
    },
  ]
}

export function WeeklyPrioritiesPanel() {
  const { commitments, update, isLoading } = useWeeklyCommitments()
  const [open, setOpen] = useState(true)
  // Which priority's intention is being edited inline, and its draft text.
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  // Full "Edit This Week's Priorities™" surface — reuses the exact Decide &
  // Design designer against the same shared weekly_commitments records.
  const [editingWeek, setEditingWeek] = useState(false)

  if (isLoading && !commitments.id) return null

  const rows = pick(commitments)
  const chosen = rows.filter((r) => r.value)

  function startEdit(key: string, current: string | null | undefined) {
    setEditingKey(key)
    setDraft(current ?? "")
  }

  function saveEdit(key: string) {
    const field = INTENTION_FIELD[key]
    if (field) update({ [field]: draft.trim() } as Partial<WeeklyCommitments>)
    setEditingKey(null)
  }

  return (
    <section
      aria-labelledby="weekly-priorities-heading"
      className="rounded-3xl border border-[#8DAE72]/30 bg-[#F4F7F0] px-6 py-7 sm:px-8 space-y-5"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 text-left"
      >
        <Compass className="h-5 w-5 text-[#5A7A45]" aria-hidden />
        <p
          id="weekly-priorities-heading"
          className="flex-1 font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5A7A45]"
        >
          This Week&apos;s Three Priorities™
        </p>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#5A7A45] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {!open ? null : chosen.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#8DAE72]/40 bg-white px-6 py-6 flex flex-col gap-3 items-start">
          <p className="font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">
            Your three weekly priorities haven&apos;t been chosen yet. Decide them in Decide &amp; Design and they
            will appear here for the rest of the week.
          </p>
          <Link
            href={new Date().getDay() === 1 ? "/?openSpace=monday-debrief" : "/?openSpace=daily-planning-gps"}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#5A7A45] hover:underline"
          >
            Open Decide &amp; Design
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-3">
          {rows.map((r) => (
            <li key={r.key} className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B5860]">
                  {r.label}
                </p>
                {r.value && (
                  <span
                    className={
                      "shrink-0 inline-flex items-center rounded-full px-2.5 py-1 font-montserrat text-[9px] font-bold uppercase tracking-[0.12em] whitespace-nowrap " +
                      (DONE.has(r.status) ? "bg-[#8DAE72]/20 text-[#5A7A45]" : "bg-[#F4F7F0] text-[#6B5860]")
                    }
                  >
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                )}
              </div>

              {r.value ? (
                <>
                  <p className="font-display text-lg font-semibold leading-snug text-[#2E1F27] text-pretty">
                    {r.value}
                  </p>
                  {editingKey === r.key ? (
                    <div className="space-y-2">
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={3}
                        autoFocus
                        placeholder="What's my intention for this priority?"
                        className="w-full rounded-lg border border-[#8DAE72]/40 bg-white p-2.5 font-sans text-sm text-[#3A2E33] outline-none focus:border-[#5A7A45]"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => saveEdit(r.key)}
                          className="rounded-full bg-[#5A7A45] px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:opacity-90"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingKey(null)}
                          className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B5860] hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(r.key, r.intention)}
                      className="group flex items-start gap-1.5 text-left"
                    >
                      <span className="font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">
                        {r.intention || <span className="text-[#6B5860] italic">Add my intention for this priority…</span>}
                      </span>
                      <Pencil
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8DAE72] opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                    </button>
                  )}
                </>
              ) : (
                <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
                  <span className="font-semibold">{r.lead}:</span> still to choose in Decide &amp; Design.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Explicit, intentional edit of the week's priorities — opens the exact
          Decide & Design designer bound to the same records. Nothing here or
          in the designer regenerates priorities; only the founder's edits and
          Save land changes. */}
      {open && chosen.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setEditingWeek(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#8DAE72] bg-white px-4 py-2 font-sans text-sm font-bold text-[#5A7A45] hover:bg-[#F4F7F0]"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Edit This Week&apos;s Priorities™
          </button>
        </div>
      )}

      <Dialog open={editingWeek} onOpenChange={setEditingWeek}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto bg-[#FBFAF7]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#2E1F27]">Edit This Week&apos;s Priorities™</DialogTitle>
          </DialogHeader>
          {/* Same designer, same weekly_commitments source of truth — edits made
              here save straight back and the panel updates via the shared hook.
              The founder can close this the moment she's done. */}
          <WeeklyPrioritiesDesigner />
        </DialogContent>
      </Dialog>
    </section>
  )
}
