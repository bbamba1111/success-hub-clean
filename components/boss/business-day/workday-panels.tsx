"use client"

import { useState } from "react"
import { Bot, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { authorityFor, resourceName } from "@/lib/boss/reducer"
import { isClosed } from "@/lib/boss/constants"
import { formatStamp } from "@/lib/boss/clock"
import type { CoordinatorEvent, WorkItem } from "@/lib/boss/types"
import { EmptyState, Panel, StatusBadge, fieldClass } from "../primitives"

export function founderDecisionItems(work: WorkItem[]) {
  return work.filter(
    (w) =>
      !isClosed(w.status) &&
      (w.requiresFounderDecision || w.status === "awaiting_approval" || w.status === "under_review"),
  )
}

export function DecisionsPanel({ limitToPlan = true }: { limitToPlan?: boolean }) {
  const { state, dispatch } = useBoss()
  const items = founderDecisionItems(state.work.filter((w) => !limitToPlan || w.inTodayPlan))
  return (
    <Panel title={`Founder decisions & approvals (${items.length})`} description="Nothing proceeds past its authority without you.">
      {items.length === 0 ? (
        <EmptyState title="No decisions waiting" />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((w) => (
            <DecisionRow key={w.id} item={w} onResolve={(approve, note) => dispatch({ type: "RESOLVE_DECISION", id: w.id, approve, note })} />
          ))}
        </ul>
      )}
    </Panel>
  )
}

function DecisionRow({ item, onResolve }: { item: WorkItem; onResolve: (approve: boolean, note: string) => void }) {
  const { state } = useBoss()
  const [note, setNote] = useState("")
  const check = authorityFor(state, item.assigneeId, item)
  const kind =
    item.status === "awaiting_approval"
      ? {
          label: "Authorization",
          question: `Approve ${resourceName(state, item.assigneeId)} to carry out this assignment? ${
            check.status === "not_authorized" ? `(${check.reason})` : ""
          }`,
          yes: "Approve this task only",
          no: "Decline · return to me",
        }
      : item.status === "under_review"
        ? { label: "Review", question: `Review output: ${item.evidence || "submitted work"}`, yes: "Approve & complete", no: "Request revisions" }
        : { label: "Decision", question: item.decisionQuestion || "Decision required", yes: "Record decision", no: "Defer" }
  return (
    <li className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-coral-dark">{kind.label}</span>
        <span className="font-mono text-[11px] text-muted-foreground">{item.id}</span>
        <StatusBadge status={item.status} />
      </div>
      <p className="text-sm font-medium leading-snug text-brand-ink">{item.title}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{kind.question}</p>
      <input
        className={cn(fieldClass, "py-1.5 text-xs")}
        placeholder="Note for the record (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        aria-label={`Note for ${item.id}`}
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onResolve(true, note)}
          className="inline-flex items-center gap-1 rounded-md bg-brand-green px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-brand-green-dark"
        >
          <Check className="h-3.5 w-3.5" aria-hidden />
          {kind.yes}
        </button>
        <button
          onClick={() => onResolve(false, note)}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-brand-ink hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
          {kind.no}
        </button>
      </div>
    </li>
  )
}

export function NoticesPanel() {
  const { state, dispatch } = useBoss()
  const pending = state.notices.filter((n) => n.status === "pending_authorization")
  if (pending.length === 0) return null
  return (
    <Panel
      title={`Notifications awaiting authorization (${pending.length})`}
      description="Plan changes that affect other resources. Prototype only: authorizing records the step but sends nothing."
      className="border-brand-coral/30"
    >
      <ul className="flex flex-col gap-2">
        {pending.map((n) => (
          <li key={n.id} className="flex flex-col gap-2 rounded-lg bg-brand-blush/50 p-3 text-xs leading-relaxed sm:flex-row sm:items-center">
            <p className="flex-1 text-brand-ink">
              <span className="font-mono text-muted-foreground">{n.workId}</span> · {n.summary}
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => dispatch({ type: "RESOLVE_NOTICE", id: n.id, authorize: true })}
                className="rounded-md bg-brand-green px-2.5 py-1 font-semibold text-primary-foreground hover:bg-brand-green-dark"
              >
                Authorize
              </button>
              <button
                onClick={() => dispatch({ type: "RESOLVE_NOTICE", id: n.id, authorize: false })}
                className="rounded-md border border-border bg-card px-2.5 py-1 font-medium hover:bg-muted"
              >
                Dismiss
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

const EVENT_LABEL: Record<CoordinatorEvent["kind"], { label: string; tone: string }> = {
  proposed: { label: "Proposed action", tone: "text-brand-tan-dark" },
  awaiting_authorization: { label: "Awaiting authorization", tone: "text-brand-coral-dark" },
  authorized: { label: "Authorized", tone: "text-brand-green-dark" },
  simulated: { label: "Simulated execution", tone: "text-brand-ink-soft" },
  verified: { label: "Completed & recorded", tone: "text-brand-green-dark" },
  exception: { label: "Exception", tone: "text-brand-coral-dark" },
  note: { label: "Update", tone: "text-muted-foreground" },
}

export function CoordinatorFeed({ phase, limit = 8 }: { phase: string; limit?: number }) {
  const { state, dispatch } = useBoss()
  const events = state.coordinator.slice(0, limit)
  return (
    <Panel
      title={
        <span className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-brand-green" aria-hidden />
          Central AI Operations Coordinator
        </span>
      }
      description="Rule-based prototype simulation. No real AI execution or external actions."
      action={
        <button
          disabled={phase !== "workday"}
          onClick={() => dispatch({ type: "COORDINATOR_STEP", phase })}
          className="shrink-0 rounded-md border border-brand-green/40 px-2.5 py-1.5 text-xs font-semibold text-brand-green-dark hover:bg-brand-sage-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          Advance authorized work
        </button>
      }
    >
      <ol className="flex flex-col gap-3">
        {events.map((e) => (
          <li key={e.id} className="flex flex-col gap-1 border-l-2 border-border pl-3">
            <p className="flex items-center gap-2 text-[11px]">
              <span className={cn("font-semibold uppercase tracking-wider", EVENT_LABEL[e.kind].tone)}>{EVENT_LABEL[e.kind].label}</span>
              <span className="text-muted-foreground">{formatStamp(e.at)}</span>
            </p>
            <p className="text-xs leading-relaxed text-brand-ink">{e.summary}</p>
            {e.proposal && e.resolution === "open" && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => dispatch({ type: "RESOLVE_PROPOSAL", eventId: e.id, accept: true })}
                  className="rounded-md bg-brand-green px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-brand-green-dark"
                >
                  Accept delegation
                </button>
                <button
                  onClick={() => dispatch({ type: "RESOLVE_PROPOSAL", eventId: e.id, accept: false })}
                  className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-muted"
                >
                  Decline
                </button>
              </div>
            )}
            {e.proposal && e.resolution !== "open" && (
              <p className="text-[11px] text-muted-foreground">Founder {e.resolution} this proposal.</p>
            )}
          </li>
        ))}
      </ol>
    </Panel>
  )
}

export function ChangeLogPanel({ limit = 10 }: { limit?: number }) {
  const { state } = useBoss()
  const entries = state.changes.slice(0, limit)
  return (
    <Panel title="Plan changes today" description="Every change is recorded in the Work Register.">
      {entries.length === 0 ? (
        <EmptyState title="No changes yet" description="Edits, reassignments, and status changes will appear here." />
      ) : (
        <ol className="flex flex-col gap-2">
          {entries.map((c) => (
            <li key={c.id} className="flex gap-3 text-xs leading-relaxed">
              <span className="w-16 shrink-0 text-muted-foreground">{formatStamp(c.at)}</span>
              <span className="text-brand-ink">
                {c.workId && <span className="font-mono text-muted-foreground">{c.workId} · </span>}
                {c.summary}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
