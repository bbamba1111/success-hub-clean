"use client"

import { useState, useTransition } from "react"
import { ArrowDown, ArrowUp, Check, History, Link2, Pencil, RotateCcw, Undo2, Archive } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  approveBusinessFact,
  getBusinessFactHistory,
  moveBusinessFact,
  reactivateBusinessFact,
  rejectBusinessFactChange,
  restoreBusinessFactVersion,
  retireBusinessFact,
  updateBusinessFact,
} from "@/app/actions/business-profile"
import {
  ACTION_LABEL,
  ACTOR_LABEL,
  STATUS_LABEL,
  type BusinessFact,
  type FactHistoryEntry,
  type FactStatus,
} from "@/lib/business-profile/definitions"

export const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-brand-ink outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
export const buttonBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-base font-medium transition-colors disabled:opacity-50"
export const primaryButton = cn(buttonBase, "bg-brand-green text-primary-foreground hover:bg-brand-green-dark")
export const quietButton = cn(buttonBase, "border border-border bg-card text-brand-ink hover:bg-muted")

const STATUS_STYLE: Record<FactStatus, string> = {
  approved: "border-brand-green/30 bg-brand-green/10 text-brand-green-dark",
  draft: "border-border bg-muted text-brand-ink-soft",
  needs_review: "border-brand-coral/40 bg-brand-coral/10 text-brand-coral-dark",
  retired: "border-border bg-background text-brand-ink-soft",
}

export function StatusBadge({ status }: { status: FactStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium", STATUS_STYLE[status])}>
      {STATUS_LABEL[status]}
    </span>
  )
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
}

export function FactCard({
  fact,
  isFirst,
  isLast,
  onError,
}: {
  fact: BusinessFact
  isFirst: boolean
  isLast: boolean
  onError: (message: string | null) => void
}) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(fact.label)
  const [value, setValue] = useState(fact.value ?? "")
  const [history, setHistory] = useState<FactHistoryEntry[] | null>(null)
  const [pending, startTransition] = useTransition()

  const run = (action: () => Promise<{ ok: true } | { ok: false; error: string }>, after?: () => void) =>
    startTransition(async () => {
      const result = await action()
      if (!result.ok) return onError(result.error)
      onError(null)
      after?.()
      if (history) {
        const refreshed = await getBusinessFactHistory(fact.id)
        if (refreshed.ok) setHistory(refreshed.history)
      }
    })

  const toggleHistory = () => {
    if (history) return setHistory(null)
    startTransition(async () => {
      const result = await getBusinessFactHistory(fact.id)
      if (!result.ok) return onError(result.error)
      setHistory(result.history)
    })
  }

  const retired = fact.status === "retired"
  const hasPendingChange = fact.status === "needs_review" && fact.approvedValue !== null

  return (
    <article className={cn("flex flex-col gap-4 rounded-2xl border border-border bg-card p-5", retired && "bg-muted/40")} aria-busy={pending}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h4 className="text-lg font-semibold text-brand-ink">{fact.label}</h4>
          <div className="flex flex-wrap items-center gap-2 text-sm text-brand-ink-soft">
            <StatusBadge status={fact.status} />
            {fact.sourceType === "reference" && (
              <span className="inline-flex items-center gap-1">
                <Link2 className="size-4" aria-hidden="true" />
                Linked to your existing records
              </span>
            )}
            {fact.lastChangeActor !== "founder" && fact.status !== "approved" && (
              <span>Suggested by {ACTOR_LABEL[fact.lastChangeActor]}</span>
            )}
          </div>
        </div>
        {!retired && !editing && (
          <div className="flex items-center gap-1">
            <button type="button" className="rounded-full p-2 text-brand-ink-soft hover:bg-muted disabled:opacity-30" disabled={isFirst || pending} onClick={() => run(() => moveBusinessFact({ factId: fact.id, direction: "up" }))}>
              <ArrowUp className="size-5" aria-hidden="true" />
              <span className="sr-only">Move {fact.label} up</span>
            </button>
            <button type="button" className="rounded-full p-2 text-brand-ink-soft hover:bg-muted disabled:opacity-30" disabled={isLast || pending} onClick={() => run(() => moveBusinessFact({ factId: fact.id, direction: "down" }))}>
              <ArrowDown className="size-5" aria-hidden="true" />
              <span className="sr-only">Move {fact.label} down</span>
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            run(() => updateBusinessFact({ factId: fact.id, label, value }), () => setEditing(false))
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-base font-medium text-brand-ink">Name</span>
            <input className={fieldClass} value={label} onChange={(e) => setLabel(e.target.value)} maxLength={120} required />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-base font-medium text-brand-ink">Details</span>
            <textarea className={fieldClass} rows={4} value={value} onChange={(e) => setValue(e.target.value)} maxLength={8000} />
          </label>
          {fact.status === "approved" && (
            <p className="text-base leading-relaxed text-brand-coral-dark">
              Saving a change will pause this item for external use until you approve the new wording.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="submit" className={primaryButton} disabled={pending}>
              Save as draft
            </button>
            <button
              type="button"
              className={quietButton}
              onClick={() => {
                setEditing(false)
                setLabel(fact.label)
                setValue(fact.value ?? "")
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className={cn("whitespace-pre-wrap text-base leading-relaxed", fact.value ? "text-brand-ink" : "italic text-brand-ink-soft")}>
          {fact.value || "No details added yet."}
        </p>
      )}

      {hasPendingChange && !editing && (
        <div className="flex flex-col gap-1 rounded-xl border border-brand-coral/30 bg-brand-blush/40 p-4">
          <p className="text-sm font-semibold text-brand-coral-dark">Previously approved</p>
          {fact.approvedLabel !== fact.label && <p className="text-base font-medium text-brand-ink">{fact.approvedLabel}</p>}
          <p className="whitespace-pre-wrap text-base leading-relaxed text-brand-ink-soft">{fact.approvedValue}</p>
        </div>
      )}

      {!editing && (
        <div className="flex flex-wrap gap-2">
          {retired ? (
            <button type="button" className={quietButton} disabled={pending} onClick={() => run(() => reactivateBusinessFact(fact.id))}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Reactivate
            </button>
          ) : (
            <>
              {fact.status !== "approved" && fact.value && (
                <button
                  type="button"
                  className={primaryButton}
                  disabled={pending}
                  onClick={() => run(() => approveBusinessFact({ factId: fact.id, label: fact.label, value: fact.value ?? "" }))}
                >
                  <Check className="size-4" aria-hidden="true" />
                  {hasPendingChange ? "Approve new wording" : "Approve"}
                </button>
              )}
              {(hasPendingChange || (fact.status === "draft" && fact.lastChangeActor !== "founder")) && (
                <button type="button" className={quietButton} disabled={pending} onClick={() => run(() => rejectBusinessFactChange(fact.id))}>
                  <Undo2 className="size-4" aria-hidden="true" />
                  {hasPendingChange ? "Keep previous wording" : "Reject suggestion"}
                </button>
              )}
              <button type="button" className={quietButton} disabled={pending} onClick={() => setEditing(true)}>
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </button>
              <button type="button" className={quietButton} disabled={pending} onClick={() => run(() => retireBusinessFact(fact.id))}>
                <Archive className="size-4" aria-hidden="true" />
                Retire
              </button>
            </>
          )}
          <button type="button" className={quietButton} disabled={pending} onClick={toggleHistory} aria-expanded={Boolean(history)}>
            <History className="size-4" aria-hidden="true" />
            {history ? "Hide history" : "History"}
          </button>
        </div>
      )}

      {history && (
        <ol className="flex flex-col gap-3 border-t border-border pt-4" aria-label={`History for ${fact.label}`}>
          {history.length === 0 && <li className="text-base text-brand-ink-soft">No history recorded yet.</li>}
          {history.map((entry) => {
            const canRestore =
              !retired && entry.newLabel && (entry.newValue !== fact.value || entry.newLabel !== fact.label) && entry.action !== "retired"
            return (
              <li key={entry.id} className="flex flex-col gap-2 rounded-xl bg-muted/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-base font-semibold text-brand-ink">
                    {ACTION_LABEL[entry.action] ?? entry.action} · {ACTOR_LABEL[entry.actor] ?? entry.actor}
                  </p>
                  <time className="text-sm text-brand-ink-soft" dateTime={entry.createdAt}>
                    {formatWhen(entry.createdAt)}
                  </time>
                </div>
                {entry.previousValue !== null && entry.previousValue !== entry.newValue && (
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-brand-ink-soft">
                    <span className="font-medium text-brand-ink">Before: </span>
                    {entry.previousValue || "(empty)"}
                  </p>
                )}
                <p className="whitespace-pre-wrap text-base leading-relaxed text-brand-ink-soft">
                  <span className="font-medium text-brand-ink">{entry.previousValue === null ? "Value: " : "After: "}</span>
                  {entry.newValue || "(empty)"}
                </p>
                {entry.previousApprovedValue !== entry.newApprovedValue && entry.previousApprovedValue && (
                  <p className="text-base leading-relaxed text-brand-ink-soft">
                    <span className="font-medium text-brand-ink">Previously approved: </span>
                    {entry.previousApprovedValue}
                  </p>
                )}
                {entry.note && <p className="text-sm text-brand-ink-soft">{entry.note}</p>}
                {canRestore && (
                  <button
                    type="button"
                    className={cn(quietButton, "self-start")}
                    disabled={pending}
                    onClick={() => run(() => restoreBusinessFactVersion({ factId: fact.id, historyId: entry.id }))}
                  >
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Restore this version
                  </button>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </article>
  )
}
