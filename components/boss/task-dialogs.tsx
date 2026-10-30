"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useBoss } from "@/lib/boss/store"
import { CATEGORIES, FUNCTIONS, PRIORITIES, STATUS_LABEL, LIFECYCLE, EXCEPTIONS, isClosed } from "@/lib/boss/constants"
import { authorityFor, canProceed } from "@/lib/boss/reducer"
import type { BusinessFunction, Priority, WorkItem, WorkStatus } from "@/lib/boss/types"
import { AuthorityBadge, fieldClass, labelClass } from "./primitives"
import { cn } from "@/lib/utils"

type Draft = Omit<WorkItem, "id" | "history" | "rank" | "createdAt" | "carriedFrom" | "ownerId" | "plannedForDate">

function blankDraft(date: string, inPlan: boolean, parent?: WorkItem): Draft {
  return {
    title: "",
    outcome: "",
    fn: parent?.fn ?? "operations",
    priority: "medium",
    assigneeId: null,
    status: inPlan ? "planned" : "captured",
    dueDate: parent?.dueDate ?? date,
    effortMins: 30,
    dependsOn: [],
    parentId: parent?.id ?? null,
    approach: "",
    requiresFounderDecision: false,
    decisionQuestion: "",
    reviewRequired: false,
    evidence: "",
    inTodayPlan: inPlan,
  }
}

export type EditorTarget =
  | { mode: "create"; inPlan: boolean; parentId?: string; title?: string; fn?: BusinessFunction }
  | { mode: "edit"; id: string }
  | null

export function TaskEditorDialog({ target, onClose }: { target: EditorTarget; onClose: () => void }) {
  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {target && <EditorBody key={target.mode === "edit" ? target.id : "new"} target={target} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}

function EditorBody({ target, onClose }: { target: NonNullable<EditorTarget>; onClose: () => void }) {
  const { state, dispatch } = useBoss()
  const existing = target.mode === "edit" ? state.work.find((w) => w.id === target.id) : undefined
  const parent = target.mode === "create" && target.parentId ? state.work.find((w) => w.id === target.parentId) : undefined
  const [d, setD] = useState<Draft>(() => {
    if (existing) {
      const { id, history, rank, createdAt, carriedFrom, ownerId, plannedForDate, ...rest } = existing
      return rest
    }
    const base = blankDraft(state.day.date, target.mode === "create" && target.inPlan, parent)
    if (target.mode === "create") {
      if (target.title) base.title = target.title
      if (target.fn) base.fn = target.fn
    }
    return base
  })
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }))
  const authority = authorityFor(state, d.assigneeId, { fn: d.fn, id: existing?.id ?? "new" })
  const depOptions = state.work.filter((w) => w.id !== existing?.id && !isClosed(w.status))
  const affected = existing ? state.work.filter((w) => w.dependsOn.includes(existing.id) && !isClosed(w.status)) : []
  const assigneeChangesOther =
    existing && existing.assigneeId !== d.assigneeId && existing.assigneeId && state.resources.find((r) => r.id === existing.assigneeId)?.category !== "founder"

  function save() {
    if (!d.title.trim()) return
    if (existing) dispatch({ type: "UPDATE_WORK", id: existing.id, patch: d })
    else dispatch({ type: "ADD_WORK", draft: d })
    onClose()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">
          {existing ? `Edit ${existing.id}` : parent ? `Add subtask to ${parent.id}` : "Add business task"}
        </DialogTitle>
        <DialogDescription>
          Changes update the Work Register, the Work Queue, and anything that depends on this task.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-2 md:grid-cols-2">
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className={labelClass}>Assignment title</span>
          <input className={fieldClass} value={d.title} onChange={(e) => set("title", e.target.value)} autoFocus />
        </label>
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className={labelClass}>Desired outcome</span>
          <input
            className={fieldClass}
            value={d.outcome}
            placeholder="What will be true when this is done?"
            onChange={(e) => set("outcome", e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Business function</span>
          <select className={fieldClass} value={d.fn} onChange={(e) => set("fn", e.target.value as BusinessFunction)}>
            {FUNCTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Priority</span>
          <select className={fieldClass} value={d.priority} onChange={(e) => set("priority", e.target.value as Priority)}>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Assigned resource</span>
          <select className={fieldClass} value={d.assigneeId ?? ""} onChange={(e) => set("assigneeId", e.target.value || null)}>
            <option value="">Unassigned</option>
            {CATEGORIES.map((c) => (
              <optgroup key={c.id} label={c.label}>
                {state.resources
                  .filter((r) => r.category === c.id)
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            Authority: <AuthorityBadge check={authority} />
          </span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Status</span>
          <select className={fieldClass} value={d.status} onChange={(e) => set("status", e.target.value as WorkStatus)}>
            <optgroup label="Lifecycle">
              {LIFECYCLE.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </optgroup>
            <optgroup label="Exceptions">
              {EXCEPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Due date</span>
          <input type="date" className={fieldClass} value={d.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Founder effort (minutes)</span>
          <input
            type="number"
            min={0}
            step={5}
            className={fieldClass}
            value={d.effortMins}
            onChange={(e) => set("effortMins", Math.max(0, Number(e.target.value)))}
          />
        </label>
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className={labelClass}>Execution approach</span>
          <textarea
            rows={2}
            className={fieldClass}
            value={d.approach}
            placeholder="How should this work be done?"
            onChange={(e) => set("approach", e.target.value)}
          />
        </label>
        <fieldset className="flex flex-col gap-1.5 md:col-span-2">
          <legend className={cn(labelClass, "mb-1.5")}>Dependencies</legend>
          <div className="flex max-h-32 flex-col gap-1 overflow-y-auto rounded-md border border-border p-2">
            {depOptions.map((w) => (
              <label key={w.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-[hsl(var(--primary))]"
                  checked={d.dependsOn.includes(w.id)}
                  onChange={(e) =>
                    set("dependsOn", e.target.checked ? [...d.dependsOn, w.id] : d.dependsOn.filter((x) => x !== w.id))
                  }
                />
                <span className="font-mono text-xs text-muted-foreground">{w.id}</span>
                <span className="truncate">{w.title}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-[hsl(var(--primary))]"
            checked={d.reviewRequired}
            onChange={(e) => set("reviewRequired", e.target.checked)}
          />
          Founder review required before completion
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-[hsl(var(--primary))]"
            checked={d.inTodayPlan}
            onChange={(e) => set("inTodayPlan", e.target.checked)}
          />
          {"Include in today's plan"}
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            className="accent-[hsl(var(--primary))]"
            checked={d.requiresFounderDecision}
            onChange={(e) => set("requiresFounderDecision", e.target.checked)}
          />
          Requires a founder decision
        </label>
        {d.requiresFounderDecision && (
          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className={labelClass}>Decision needed</span>
            <input className={fieldClass} value={d.decisionQuestion} onChange={(e) => set("decisionQuestion", e.target.value)} />
          </label>
        )}
        <label className="flex flex-col gap-1.5 md:col-span-2">
          <span className={labelClass}>Completion evidence</span>
          <input
            className={fieldClass}
            value={d.evidence}
            placeholder="Link or description of what proves this is done"
            onChange={(e) => set("evidence", e.target.value)}
          />
        </label>
      </div>

      {(affected.length > 0 || assigneeChangesOther || (d.assigneeId && !canProceed(authority) && authority.status !== "unassigned")) && (
        <div className="flex flex-col gap-1 rounded-lg border border-brand-coral/30 bg-brand-blush/60 p-3 text-xs leading-relaxed text-brand-ink">
          <p className="font-semibold">This change affects other work</p>
          {affected.length > 0 && <p>Dependent tasks will be updated: {affected.map((a) => a.id).join(", ")}.</p>}
          {assigneeChangesOther && <p>The previous resource must be notified. A notification request will await your authorization.</p>}
          {authority.status === "not_authorized" && <p>{`The selected resource is not authorized for this work (${authority.reason}). It will wait for your approval.`}</p>}
          {authority.status === "external" && <p>External collaborators are not under your direct control. This becomes a request awaiting their response.</p>}
        </div>
      )}

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={save} disabled={!d.title.trim()}>
          {existing ? "Save changes" : "Add task"}
        </Button>
      </DialogFooter>
    </>
  )
}

export function ReassignDialog({ workId, onClose }: { workId: string | null; onClose: () => void }) {
  const { state, dispatch } = useBoss()
  const item = state.work.find((w) => w.id === workId)
  const [toId, setToId] = useState<string>("")
  const [reason, setReason] = useState("")

  return (
    <Dialog
      open={!!item}
      onOpenChange={(o) => {
        if (!o) {
          setToId("")
          setReason("")
          onClose()
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        {item && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Reassign {item.id}</DialogTitle>
              <DialogDescription>{item.title}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label="Choose a resource">
              {state.resources
                .filter((r) => r.id !== item.assigneeId && r.id !== "R-COORD")
                .map((r) => {
                  const check = authorityFor(state, r.id, item)
                  return (
                    <label
                      key={r.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors",
                        toId === r.id ? "border-brand-green bg-brand-sage-light/60" : "border-border hover:bg-muted/60",
                      )}
                    >
                      <input
                        type="radio"
                        name="assignee"
                        className="accent-[hsl(var(--primary))]"
                        checked={toId === r.id}
                        onChange={() => setToId(r.id)}
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="font-medium text-brand-ink">{r.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {CATEGORIES.find((c) => c.id === r.category)?.label} · {r.role}
                        </span>
                      </span>
                      <AuthorityBadge check={check} />
                    </label>
                  )
                })}
            </div>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Reason (recorded in the Work Register)</span>
              <input className={fieldClass} value={reason} onChange={(e) => setReason(e.target.value)} />
            </label>
            {item.assigneeId && item.assigneeId !== "R-FOUNDER" && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {state.resources.find((r) => r.id === item.assigneeId)?.name} is currently assigned. A notification to them will be
                queued for your authorization. No message is sent automatically.
              </p>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={!toId}
                onClick={() => {
                  dispatch({ type: "REASSIGN", id: item.id, toId, reason })
                  setToId("")
                  setReason("")
                  onClose()
                }}
              >
                Reassign
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
