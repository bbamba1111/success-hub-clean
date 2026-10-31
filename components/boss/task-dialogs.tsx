"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useBoss } from "@/lib/boss/store"
import { CATEGORIES, FUNCTIONS, PRIORITIES, STATUS_LABEL, LIFECYCLE, EXCEPTIONS, isClosed } from "@/lib/boss/constants"
import { authorityFor, canProceed } from "@/lib/boss/reducer"
import type { BusinessFunction, Priority, WorkItem, WorkStatus } from "@/lib/boss/types"
import { AuthorityBadge, bigButton, fieldClass, labelClass } from "./primitives"
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
        <DialogTitle className="font-display text-3xl">
          {existing ? "Edit this task" : parent ? "Add a smaller step" : "Add a task"}
        </DialogTitle>
        <DialogDescription className="text-base leading-relaxed">
          Fill in what you know. You can change it later.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-5 py-2 md:grid-cols-2">
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className={labelClass}>What is the task?</span>
          <input className={fieldClass} value={d.title} onChange={(e) => set("title", e.target.value)} autoFocus />
        </label>
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className={labelClass}>What does done look like?</span>
          <input
            className={fieldClass}
            value={d.outcome}
            placeholder="Example: The email is sent to all clients"
            onChange={(e) => set("outcome", e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Which part of the business?</span>
          <select className={fieldClass} value={d.fn} onChange={(e) => set("fn", e.target.value as BusinessFunction)}>
            {FUNCTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>How important is it?</span>
          <select className={fieldClass} value={d.priority} onChange={(e) => set("priority", e.target.value as Priority)}>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Who will do it?</span>
          <select className={fieldClass} value={d.assigneeId ?? ""} onChange={(e) => set("assigneeId", e.target.value || null)}>
            <option value="">No one yet</option>
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
          <span className="flex flex-wrap items-center gap-2 text-base text-brand-ink-soft">
            Permission: <AuthorityBadge check={authority} />
          </span>
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>When is it due?</span>
          <input type="date" className={fieldClass} value={d.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>How many minutes of your time?</span>
          <input
            type="number"
            min={0}
            step={5}
            className={fieldClass}
            value={d.effortMins}
            onChange={(e) => set("effortMins", Math.max(0, Number(e.target.value)))}
          />
        </label>
        <label className="flex items-center gap-3 text-base">
          <input
            type="checkbox"
            className="h-5 w-5 accent-[hsl(var(--primary))]"
            checked={d.inTodayPlan}
            onChange={(e) => set("inTodayPlan", e.target.checked)}
          />
          {"Include in today's plan"}
        </label>
        <details className="group rounded-xl border border-border md:col-span-2">
          <summary className="flex min-h-12 cursor-pointer list-none items-center px-4 text-base font-semibold text-brand-green-dark [&::-webkit-details-marker]:hidden">
            More options
          </summary>
          <div className="grid gap-5 p-4 pt-1 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Where is it now?</span>
          <select className={fieldClass} value={d.status} onChange={(e) => set("status", e.target.value as WorkStatus)}>
            <optgroup label="Normal steps">
              {LIFECYCLE.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </optgroup>
            <optgroup label="Problems">
              {EXCEPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className={labelClass}>How should it be done?</span>
          <textarea
            rows={2}
            className={fieldClass}
            value={d.approach}
            placeholder="Write the steps, if you know them"
            onChange={(e) => set("approach", e.target.value)}
          />
        </label>
        <fieldset className="flex flex-col gap-2 md:col-span-2">
          <legend className={cn(labelClass, "mb-2")}>Must another task be done first?</legend>
          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto rounded-lg border border-border p-3">
            {depOptions.map((w) => (
              <label key={w.id} className="flex items-center gap-3 text-base">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-[hsl(var(--primary))]"
                  checked={d.dependsOn.includes(w.id)}
                  onChange={(e) =>
                    set("dependsOn", e.target.checked ? [...d.dependsOn, w.id] : d.dependsOn.filter((x) => x !== w.id))
                  }
                />
                <span className="truncate">{w.title}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-center gap-3 text-base">
          <input
            type="checkbox"
            className="h-5 w-5 accent-[hsl(var(--primary))]"
            checked={d.reviewRequired}
            onChange={(e) => set("reviewRequired", e.target.checked)}
          />
          I want to check it before it is done
        </label>
        <label className="flex items-center gap-3 text-base md:col-span-2">
          <input
            type="checkbox"
            className="h-5 w-5 accent-[hsl(var(--primary))]"
            checked={d.requiresFounderDecision}
            onChange={(e) => set("requiresFounderDecision", e.target.checked)}
          />
          I need to make a choice about this
        </label>
        {d.requiresFounderDecision && (
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className={labelClass}>What do you need to decide?</span>
            <input className={fieldClass} value={d.decisionQuestion} onChange={(e) => set("decisionQuestion", e.target.value)} />
          </label>
        )}
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className={labelClass}>Proof it is done</span>
          <input
            className={fieldClass}
            value={d.evidence}
            placeholder="A link, or a few words"
            onChange={(e) => set("evidence", e.target.value)}
          />
        </label>
          </div>
        </details>
      </div>

      {(affected.length > 0 || assigneeChangesOther || (d.assigneeId && !canProceed(authority) && authority.status !== "unassigned")) && (
        <div className="flex flex-col gap-2 rounded-xl border border-brand-coral/30 bg-brand-blush/60 p-4 text-base leading-relaxed text-brand-ink">
          <p className="font-semibold">Good to know</p>
          {affected.length > 0 && <p>Other tasks wait on this one. We will update them: {affected.map((a) => a.title).join(", ")}.</p>}
          {assigneeChangesOther && <p>The person who had this task should know. We will ask you before telling them.</p>}
          {authority.status === "not_authorized" && <p>{`This helper is not allowed to do this yet (${authority.reason}). It will wait for your OK.`}</p>}
          {authority.status === "external" && <p>This is an outside partner. We will ask them. They choose yes or no.</p>}
        </div>
      )}

      <DialogFooter className="gap-3">
        <Button className={bigButton} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className={bigButton} onClick={save} disabled={!d.title.trim()}>
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
              <DialogTitle className="font-display text-3xl">Give this task to someone else</DialogTitle>
              <DialogDescription className="text-base">{item.title}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3" role="radiogroup" aria-label="Choose who">
              {state.resources
                .filter((r) => r.id !== item.assigneeId && r.id !== "R-COORD")
                .map((r) => {
                  const check = authorityFor(state, r.id, item)
                  return (
                    <label
                      key={r.id}
                      className={cn(
                        "flex cursor-pointer flex-wrap items-center gap-3 rounded-xl border p-4 text-base transition-colors",
                        toId === r.id ? "border-brand-green bg-brand-sage-light/60" : "border-border hover:bg-muted/60",
                      )}
                    >
                      <input
                        type="radio"
                        name="assignee"
                        className="h-5 w-5 accent-[hsl(var(--primary))]"
                        checked={toId === r.id}
                        onChange={() => setToId(r.id)}
                      />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="text-lg font-medium text-brand-ink">{r.name}</span>
                        <span className="truncate text-base text-muted-foreground">
                          {r.role}
                        </span>
                      </span>
                      <AuthorityBadge check={check} />
                    </label>
                  )
                })}
            </div>
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Why? (You can skip this.)</span>
              <input className={fieldClass} value={reason} onChange={(e) => setReason(e.target.value)} />
            </label>
            {item.assigneeId && item.assigneeId !== "R-FOUNDER" && (
              <p className="text-base leading-relaxed text-brand-ink-soft">
                {state.resources.find((r) => r.id === item.assigneeId)?.name} has this task now. We will ask you before telling them.
              </p>
            )}
            <DialogFooter className="gap-3">
              <Button className={bigButton} variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className={bigButton}
                disabled={!toId}
                onClick={() => {
                  dispatch({ type: "REASSIGN", id: item.id, toId, reason })
                  setToId("")
                  setReason("")
                  onClose()
                }}
              >
                Give it to them
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
