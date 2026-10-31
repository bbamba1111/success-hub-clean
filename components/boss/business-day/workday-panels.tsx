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
    <Panel title={`You need to decide (${items.length})`} description="Nothing moves forward without your OK.">
      {items.length === 0 ? (
        <EmptyState title="Nothing needs you right now" />
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
          label: "Say yes?",
          question: `Can ${resourceName(state, item.assigneeId)} do this task? ${
            check.status === "not_authorized" ? `(${check.reason})` : ""
          }`,
          yes: "Yes, for this task only",
          no: "No, give it back to me",
        }
      : item.status === "under_review"
        ? { label: "Check the work", question: `Look at the work: ${item.evidence || "the work they sent"}`, yes: "Looks good, mark done", no: "Needs changes" }
        : { label: "Decide", question: item.decisionQuestion || "Make a choice about this task.", yes: "Save my choice", no: "Decide later" }
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border p-5">
      <span className="text-base font-semibold text-brand-coral-dark">{kind.label}</span>
      <p className="text-xl font-semibold leading-snug text-brand-ink">{item.title}</p>
      <p className="text-base leading-relaxed text-brand-ink-soft">{kind.question}</p>
      <input
        className={fieldClass}
        placeholder="Add a note (you can skip this)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        aria-label={`Note for ${item.id}`}
      />
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onResolve(true, note)}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-green px-5 text-base font-semibold text-primary-foreground hover:bg-brand-green-dark"
        >
          <Check className="h-5 w-5" aria-hidden />
          {kind.yes}
        </button>
        <button
          onClick={() => onResolve(false, note)}
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-border px-5 text-base font-medium text-brand-ink hover:bg-muted"
        >
          <X className="h-5 w-5" aria-hidden />
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
      title={`Tell people about a change? (${pending.length})`}
      description="A change you made affects someone. Should we tell them? In this practice version, nothing is sent."
      className="border-brand-coral/30"
    >
      <ul className="flex flex-col gap-3">
        {pending.map((n) => (
          <li key={n.id} className="flex flex-col gap-3 rounded-xl bg-brand-blush/50 p-4 text-base leading-relaxed">
            <p className="flex-1 text-brand-ink">
              {n.summary}
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                onClick={() => dispatch({ type: "RESOLVE_NOTICE", id: n.id, authorize: true })}
                className="h-12 rounded-xl bg-brand-green px-5 font-semibold text-primary-foreground hover:bg-brand-green-dark"
              >
                Yes, tell them
              </button>
              <button
                onClick={() => dispatch({ type: "RESOLVE_NOTICE", id: n.id, authorize: false })}
                className="h-12 rounded-xl border border-border bg-card px-5 font-medium hover:bg-muted"
              >
                No
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

const EVENT_LABEL: Record<CoordinatorEvent["kind"], { label: string; tone: string }> = {
  proposed: { label: "Idea", tone: "text-brand-tan-dark" },
  awaiting_authorization: { label: "Needs your OK", tone: "text-brand-coral-dark" },
  authorized: { label: "You said yes", tone: "text-brand-green-dark" },
  simulated: { label: "Practice step", tone: "text-brand-ink-soft" },
  verified: { label: "Done and saved", tone: "text-brand-green-dark" },
  exception: { label: "Problem", tone: "text-brand-coral-dark" },
  note: { label: "Update", tone: "text-muted-foreground" },
}

export function CoordinatorFeed({ phase, limit = 8 }: { phase: string; limit?: number }) {
  const { state, dispatch } = useBoss()
  const events = state.coordinator.slice(0, limit)
  return (
    <Panel
      title={
        <span className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-brand-green" aria-hidden />
          Your AI helper
        </span>
      }
      description="It only does what you allow. This practice version uses simple rules, not real AI."
      action={
        <button
          disabled={phase !== "workday"}
          onClick={() => dispatch({ type: "COORDINATOR_STEP", phase })}
          className="h-12 shrink-0 rounded-xl border border-brand-green/40 px-5 text-base font-semibold text-brand-green-dark hover:bg-brand-sage-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          Move allowed work forward
        </button>
      }
    >
      <ol className="flex flex-col gap-4">
        {events.map((e) => (
          <li key={e.id} className="flex flex-col gap-2 border-l-4 border-border pl-4">
            <p className="flex items-center gap-3 text-base">
              <span className={cn("font-semibold", EVENT_LABEL[e.kind].tone)}>{EVENT_LABEL[e.kind].label}</span>
              <span className="text-muted-foreground">{formatStamp(e.at)}</span>
            </p>
            <p className="text-base leading-relaxed text-brand-ink">{e.summary}</p>
            {e.proposal && e.resolution === "open" && (
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={() => dispatch({ type: "RESOLVE_PROPOSAL", eventId: e.id, accept: true })}
                  className="h-12 rounded-xl bg-brand-green px-5 text-base font-semibold text-primary-foreground hover:bg-brand-green-dark"
                >
                  Yes, give it to them
                </button>
                <button
                  onClick={() => dispatch({ type: "RESOLVE_PROPOSAL", eventId: e.id, accept: false })}
                  className="h-12 rounded-xl border border-border px-5 text-base hover:bg-muted"
                >
                  No
                </button>
              </div>
            )}
            {e.proposal && e.resolution !== "open" && (
              <p className="text-base text-muted-foreground">You {e.resolution} this idea.</p>
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
    <Panel title="Changes today" description="We save every change in the Work Register.">
      {entries.length === 0 ? (
        <EmptyState title="No changes yet" description="When you change a task, it shows up here." />
      ) : (
        <ol className="flex flex-col gap-3">
          {entries.map((c) => (
            <li key={c.id} className="flex gap-4 text-base leading-relaxed">
              <span className="w-20 shrink-0 text-muted-foreground">{formatStamp(c.at)}</span>
              <span className="text-brand-ink">
                                {c.summary}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
