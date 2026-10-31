"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { useBoss } from "@/lib/boss/store"
import { authorityFor, resourceName } from "@/lib/boss/reducer"
import { formatDate, formatStamp } from "@/lib/boss/clock"
import { AuthorityBadge, FunctionBadge, PageHeader, Panel, PriorityBadge, StatusBadge, fieldClass } from "./primitives"
import { TaskEditorDialog, type EditorTarget } from "./task-dialogs"

export function WorkRegister() {
  const { state } = useBoss()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<string | null>(null)
  const [editor, setEditor] = useState<EditorTarget>(null)
  const rows = state.work
    .filter((w) => `${w.id} ${w.title} ${w.outcome}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.id.localeCompare(b.id))

  return (
    <>
      <PageHeader
        eyebrow="Work Register"
        title="The record of all your work"
        description="Every task, even ones you stopped. Tap a task to see what changed."
      />
      <input className={`${fieldClass} max-w-md`} placeholder="Search for a task" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the Work Register" />

      <ul className="flex flex-col gap-3">
        {rows.map((w) => (
          <li key={w.id} className="rounded-2xl border border-border bg-card">
            <button
              onClick={() => setOpen(open === w.id ? null : w.id)}
              aria-expanded={open === w.id}
              className="flex w-full items-center gap-4 rounded-2xl p-5 text-left hover:bg-muted/40"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="text-lg font-semibold text-brand-ink">{w.title}</span>
                <span className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-brand-ink-soft">
                  <StatusBadge status={w.status} />
                  <span>Who: {resourceName(state, w.assigneeId)}</span>
                </span>
              </span>
              <ChevronDown className={`h-6 w-6 shrink-0 text-brand-green-dark transition-transform ${open === w.id ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {open === w.id && (
              <div className="flex flex-col gap-5 border-t border-border p-5 text-base">
                <dl className="grid gap-4 sm:grid-cols-2">
                  {w.outcome && <RegisterDetail label="Done looks like" value={w.outcome} />}
                  <RegisterDetail label="Part of the business" value={<FunctionBadge fn={w.fn} full />} />
                  <RegisterDetail label="How important" value={<PriorityBadge priority={w.priority} />} />
                  <RegisterDetail label="Permission" value={<AuthorityBadge check={authorityFor(state, w.assigneeId, w)} />} />
                  <RegisterDetail label="Due" value={formatDate(w.dueDate, { month: "long", day: "numeric" })} />
                  <RegisterDetail label="Owner" value={resourceName(state, w.ownerId)} />
                  <RegisterDetail label="Do you check it first?" value={w.reviewRequired ? "Yes" : "No"} />
                  <RegisterDetail label="Proof it is done" value={w.evidence || "None yet"} />
                  <RegisterDetail label="Task number" value={`${w.id}${w.parentId ? ` · part of ${w.parentId}` : ""}`} />
                </dl>
                <div className="flex flex-col gap-3">
                  <p className="font-semibold text-brand-ink">What changed</p>
                  <ol className="flex flex-col gap-2">
                    {w.history.length === 0 && <li className="text-muted-foreground">No changes yet.</li>}
                    {w.history.map((h) => (
                      <li key={h.id} className="flex gap-4">
                        <span className="w-20 shrink-0 text-muted-foreground">{formatStamp(h.at)}</span>
                        <span className="text-brand-ink">{h.summary}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <button onClick={() => setEditor({ mode: "edit", id: w.id })} className="h-12 rounded-xl border border-border px-5 font-medium hover:bg-muted">
                    Edit this task
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {state.pastDays.length > 0 && (
        <Panel title="Days you closed">
          <ul className="flex flex-col gap-3 text-base">
            {state.pastDays.map((d) => (
              <li key={d.closedAt} className="flex flex-wrap gap-x-4 gap-y-1">
                <span className="font-semibold">{formatDate(d.date)}</span>
                <span className="text-muted-foreground">
                  {d.completed.length} done · {d.carried.length} moved · {d.returned.length} saved · {d.cancelled.length} stopped
                </span>
                {d.notes && <span className="w-full text-muted-foreground">Note: {d.notes}</span>}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <TaskEditorDialog target={editor} onClose={() => setEditor(null)} />
    </>
  )
}

function RegisterDetail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-semibold text-brand-ink">{label}</dt>
      <dd className="leading-relaxed text-brand-ink-soft">{value}</dd>
    </div>
  )
}
