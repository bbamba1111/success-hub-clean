"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { FUNCTIONS, PRIORITIES, STATUS_LABEL, LIFECYCLE, EXCEPTIONS } from "@/lib/boss/constants"
import type { WorkItem, WorkStatus } from "@/lib/boss/types"
import { EmptyState, MoreDetails, PageHeader, fieldClass } from "./primitives"
import { ReassignDialog, TaskEditorDialog, type EditorTarget } from "./task-dialogs"
import { WorkItemCard } from "./business-day/work-item-card"
import { founderDecisionItems } from "./business-day/workday-panels"

type View = "new" | "ready" | "progress" | "waiting" | "decisions" | "completed"

const VIEWS: { id: View; label: string }[] = [
  { id: "new", label: "New" },
  { id: "ready", label: "Needs someone" },
  { id: "progress", label: "Doing now" },
  { id: "waiting", label: "Stuck or waiting" },
  { id: "decisions", label: "Needs you" },
  { id: "completed", label: "Done" },
]

function inView(view: View, w: WorkItem, decisions: Set<string>) {
  switch (view) {
    case "new":
      return !w.assigneeId && ["captured"].includes(w.status)
    case "ready":
      return !w.assigneeId && ["defined", "planned", "authorized"].includes(w.status)
    case "progress":
      return ["assigned", "in_progress", "under_review"].includes(w.status) && !decisions.has(w.id)
    case "waiting":
      return ["blocked", "awaiting_external", "on_hold", "failed"].includes(w.status)
    case "decisions":
      return decisions.has(w.id)
    case "completed":
      return w.status === "completed" || w.status === "cancelled"
  }
}

export function WorkQueue() {
  const { state } = useBoss()
  const [view, setView] = useState<View>("progress")
  const [fn, setFn] = useState("all")
  const [resource, setResource] = useState("all")
  const [priority, setPriority] = useState("all")
  const [status, setStatus] = useState("all")
  const [due, setDue] = useState("all")
  const [editor, setEditor] = useState<EditorTarget>(null)
  const [reassignId, setReassignId] = useState<string | null>(null)

  const decisions = useMemo(() => new Set(founderDecisionItems(state.work).map((w) => w.id)), [state.work])
  const filtered = state.work.filter(
    (w) =>
      (fn === "all" || w.fn === fn) &&
      (resource === "all" || (resource === "none" ? !w.assigneeId : w.assigneeId === resource)) &&
      (priority === "all" || w.priority === priority) &&
      (status === "all" || w.status === status) &&
      (due === "all" || (due === "today" ? w.dueDate <= state.day.date : w.dueDate > state.day.date)),
  )
  const parents = filtered.filter((w) => !w.parentId || !filtered.some((p) => p.id === w.parentId))
  const items = parents.filter((w) => inView(view, w, decisions)).sort((a, b) => a.rank - b.rank)
  const handlers = { onEdit: setEditor, onReassign: setReassignId }

  return (
    <>
      <PageHeader
        eyebrow="Business Work Queue"
        title="All your work"
        description="Every task, not just today's. Changes here also change your day plan."
        actions={
          <Button onClick={() => setEditor({ mode: "create", inPlan: false })}>
            <Plus className="h-4 w-4" aria-hidden />
            Add work
          </Button>
        }
      />

      <div role="tablist" aria-label="Show work" className="flex flex-wrap gap-2">
        {VIEWS.map((v) => {
          const count = parents.filter((w) => inView(v.id, w, decisions)).length
          return (
            <button
              key={v.id}
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={cn(
                "inline-flex h-12 shrink-0 items-center gap-2 rounded-full border px-5 text-base font-medium transition-colors",
                view === v.id ? "border-brand-green bg-brand-green text-primary-foreground" : "border-border bg-card hover:bg-muted",
              )}
            >
              {v.label}
              <span className={cn("rounded-full px-2 text-sm tabular-nums", view === v.id ? "bg-primary-foreground/20" : "bg-muted")}>{count}</span>
            </button>
          )
        })}
      </div>

      <MoreDetails summary="Filter the list">
      <div className="grid gap-4 sm:grid-cols-2">
        <Filter label="Part of the business" value={fn} onChange={setFn} options={FUNCTIONS.map((f) => [f.id, f.label])} />
        <Filter
          label="Who"
          value={resource}
          onChange={setResource}
          options={[["none", "No one yet"], ...state.resources.map((r) => [r.id, r.name] as [string, string])]}
        />
        <Filter label="How important" value={priority} onChange={setPriority} options={PRIORITIES.map((p) => [p.id, p.label])} />
        <Filter
          label="Where it is now"
          value={status}
          onChange={setStatus}
          options={[...LIFECYCLE, ...EXCEPTIONS].map((s) => [s, STATUS_LABEL[s as WorkStatus]])}
        />
        <Filter label="When is it due?" value={due} onChange={setDue} options={[["today", "Today or late"], ["later", "Later"]]} />
      </div>
      </MoreDetails>

      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <EmptyState title="Nothing here" description="Try another tab. Or change the filter." />
        ) : (
          items.map((w) => <WorkItemCard key={w.id} item={w} handlers={handlers} allowReorder={false} />)
        )}
      </div>

      <TaskEditorDialog target={editor} onClose={() => setEditor(null)} />
      <ReassignDialog workId={reassignId} onClose={() => setReassignId(null)} />
    </>
  )
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: [string, string][]
}) {
  return (
    <label className="flex flex-col gap-2 text-base font-semibold text-brand-ink">
      {label}
      <select className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="all">All</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}
