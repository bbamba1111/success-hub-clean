"use client"

import { Fragment, useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
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
        title="The record of all business work"
        description="Every assignment, including cancelled work, with its full change history. Prototype record — not a production audit log."
      />
      <input className={`${fieldClass} max-w-md`} placeholder="Search by ID, title, or outcome" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the Work Register" />

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-8 px-3 py-3" />
              <th className="px-3 py-3 font-semibold">Work ID</th>
              <th className="px-3 py-3 font-semibold">Assignment</th>
              <th className="px-3 py-3 font-semibold">Function</th>
              <th className="px-3 py-3 font-semibold">Priority</th>
              <th className="px-3 py-3 font-semibold">Resource</th>
              <th className="px-3 py-3 font-semibold">Authority</th>
              <th className="px-3 py-3 font-semibold">Due</th>
              <th className="px-3 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((w) => (
              <Fragment key={w.id}>
                <tr className="align-top hover:bg-muted/30">
                  <td className="px-3 py-3">
                    <button
                      onClick={() => setOpen(open === w.id ? null : w.id)}
                      aria-expanded={open === w.id}
                      aria-label={`Show history for ${w.id}`}
                      className="rounded p-0.5 hover:bg-muted"
                    >
                      {open === w.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                    {w.id}
                    {w.parentId && <span className="block">↳ {w.parentId}</span>}
                  </td>
                  <td className="max-w-xs px-3 py-3">
                    <button className="text-left font-medium text-brand-ink hover:underline" onClick={() => setEditor({ mode: "edit", id: w.id })}>
                      {w.title}
                    </button>
                    {w.outcome && <p className="mt-0.5 text-xs text-muted-foreground">{w.outcome}</p>}
                    {w.dependsOn.length > 0 && <p className="mt-0.5 text-xs text-muted-foreground">Depends on {w.dependsOn.join(", ")}</p>}
                  </td>
                  <td className="px-3 py-3"><FunctionBadge fn={w.fn} /></td>
                  <td className="px-3 py-3"><PriorityBadge priority={w.priority} /></td>
                  <td className="px-3 py-3 text-xs">{resourceName(state, w.assigneeId)}</td>
                  <td className="px-3 py-3"><AuthorityBadge check={authorityFor(state, w.assigneeId, w)} /></td>
                  <td className="px-3 py-3 text-xs">{formatDate(w.dueDate, { month: "short", day: "numeric" })}</td>
                  <td className="px-3 py-3"><StatusBadge status={w.status} /></td>
                </tr>
                {open === w.id && (
                  <tr className="bg-muted/30">
                    <td />
                    <td colSpan={8} className="px-3 py-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <dl className="flex flex-col gap-1 text-xs">
                          <dt className="font-semibold text-brand-ink-soft">Responsible owner</dt>
                          <dd>{resourceName(state, w.ownerId)}</dd>
                          <dt className="mt-2 font-semibold text-brand-ink-soft">Review requirement</dt>
                          <dd>{w.reviewRequired ? "Founder review before completion" : "None"}</dd>
                          <dt className="mt-2 font-semibold text-brand-ink-soft">Completion evidence</dt>
                          <dd>{w.evidence || "Not yet provided"}</dd>
                        </dl>
                        <ol className="flex flex-col gap-1.5 text-xs md:col-span-2">
                          {w.history.length === 0 && <li className="text-muted-foreground">No changes recorded in this session.</li>}
                          {w.history.map((h) => (
                            <li key={h.id} className="flex gap-3">
                              <span className="w-16 shrink-0 text-muted-foreground">{formatStamp(h.at)}</span>
                              <span className="w-20 shrink-0 text-muted-foreground">{h.actor === "R-COORD" ? "Coordinator" : h.actor}</span>
                              <span className="text-brand-ink">{h.summary}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {state.pastDays.length > 0 && (
        <Panel title="Business-day closeouts">
          <ul className="flex flex-col gap-2 text-sm">
            {state.pastDays.map((d) => (
              <li key={d.closedAt} className="flex flex-wrap gap-x-4 gap-y-1">
                <span className="font-semibold">{formatDate(d.date)}</span>
                <span className="text-muted-foreground">
                  {d.completed.length} completed · {d.carried.length} carried · {d.returned.length} returned · {d.cancelled.length} cancelled
                </span>
                {d.notes && <span className="w-full text-xs text-muted-foreground">Note: {d.notes}</span>}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <TaskEditorDialog target={editor} onClose={() => setEditor(null)} />
    </>
  )
}
