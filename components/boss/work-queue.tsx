"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { FUNCTIONS, PRIORITIES, STATUS_LABEL, LIFECYCLE, EXCEPTIONS } from "@/lib/boss/constants"
import type { WorkItem, WorkStatus } from "@/lib/boss/types"
import { EmptyState, PageHeader, fieldClass } from "./primitives"
import { ReassignDialog, TaskEditorDialog, type EditorTarget } from "./task-dialogs"
import { WorkItemCard } from "./business-day/work-item-card"
import { founderDecisionItems } from "./business-day/workday-panels"

type View = "new" | "ready" | "progress" | "waiting" | "decisions" | "completed"

const VIEWS: { id: View; label: string }[] = [
  { id: "new", label: "New & Unassigned" },
  { id: "ready", label: "Ready to Assign" },
  { id: "progress", label: "In Progress" },
  { id: "waiting", label: "Waiting & Blocked" },
  { id: "decisions", label: "Founder Decisions" },
  { id: "completed", label: "Completed" },
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
        title="All business assignments"
        description="The central command view. The same records you change during the CEO Workday."
        actions={
          <Button onClick={() => setEditor({ mode: "create", inPlan: false })}>
            <Plus className="h-4 w-4" aria-hidden />
            Capture work
          </Button>
        }
      />

      <div role="tablist" aria-label="Queue views" className="flex gap-2 overflow-x-auto pb-1">
        {VIEWS.map((v) => {
          const count = parents.filter((w) => inView(v.id, w, decisions)).length
          return (
            <button
              key={v.id}
              role="tab"
              aria-selected={view === v.id}
              onClick={() => setView(v.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                view === v.id ? "border-brand-ink bg-brand-ink text-primary-foreground" : "border-border bg-card hover:bg-muted",
              )}
            >
              {v.label}
              <span className={cn("rounded-full px-1.5 text-xs tabular-nums", view === v.id ? "bg-primary-foreground/20" : "bg-muted")}>{count}</span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
        <Filter label="Business function" value={fn} onChange={setFn} options={FUNCTIONS.map((f) => [f.id, f.label])} />
        <Filter
          label="Resource"
          value={resource}
          onChange={setResource}
          options={[["none", "Unassigned"], ...state.resources.map((r) => [r.id, r.name] as [string, string])]}
        />
        <Filter label="Priority" value={priority} onChange={setPriority} options={PRIORITIES.map((p) => [p.id, p.label])} />
        <Filter
          label="Status"
          value={status}
          onChange={setStatus}
          options={[...LIFECYCLE, ...EXCEPTIONS].map((s) => [s, STATUS_LABEL[s as WorkStatus]])}
        />
        <Filter label="Due date" value={due} onChange={setDue} options={[["today", "Due today or overdue"], ["later", "Due later"]]} />
      </div>

      <div className="flex flex-col gap-3 pl-2">
        {items.length === 0 ? (
          <EmptyState title="No assignments in this view" description="Try another view or clear filters." />
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
    <label className="flex flex-col gap-1 text-xs font-semibold text-brand-ink-soft">
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
