"use client"

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Ban,
  Bot,
  CheckCircle2,
  CornerDownRight,
  ListPlus,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Undo2,
  UserRoundCog,
  Link2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { authorityFor, resourceName } from "@/lib/boss/reducer"
import { isClosed } from "@/lib/boss/constants"
import { formatDate, formatDuration } from "@/lib/boss/clock"
import type { WorkItem } from "@/lib/boss/types"
import { AuthorityBadge, FunctionBadge, PriorityBadge, StatusBadge } from "../primitives"
import type { EditorTarget } from "../task-dialogs"

export interface WorkCardHandlers {
  onEdit: (t: EditorTarget) => void
  onReassign: (id: string) => void
}

export function WorkItemCard({
  item,
  position,
  total,
  handlers,
  compact,
  allowReorder = true,
}: {
  item: WorkItem
  position?: number
  total?: number
  handlers: WorkCardHandlers
  compact?: boolean
  allowReorder?: boolean
}) {
  const { state, dispatch } = useBoss()
  const [menuOpen, setMenuOpen] = useState(false)
  const authority = authorityFor(state, item.assigneeId, item)
  const subtasks = state.work.filter((w) => w.parentId === item.id)
  const unmet = item.dependsOn.filter((d) => state.work.find((w) => w.id === d)?.status !== "completed")
  const closed = isClosed(item.status)
  const founderOwned = item.assigneeId === "R-FOUNDER"
  const delegationOpportunity =
    founderOwned &&
    !item.requiresFounderDecision &&
    state.resources.some((r) => r.category !== "founder" && r.category !== "external" && r.id !== "R-COORD" && r.functions.includes(item.fn))

  const act = (fn: () => void) => () => {
    fn()
    setMenuOpen(false)
  }

  const primary = (() => {
    if (closed) return null
    if (["planned", "assigned", "authorized", "defined", "captured"].includes(item.status) && founderOwned)
      return { label: "Start", icon: Play, run: () => dispatch({ type: "SET_STATUS", id: item.id, status: "in_progress" }) }
    if (item.status === "in_progress" && (item.reviewRequired && !founderOwned))
      return { label: "Send to review", icon: CheckCircle2, run: () => dispatch({ type: "SET_STATUS", id: item.id, status: "under_review" }) }
    if (item.status === "in_progress")
      return { label: "Complete", icon: CheckCircle2, run: () => dispatch({ type: "SET_STATUS", id: item.id, status: "completed", note: founderOwned ? "Completed by founder" : undefined }) }
    if (item.status === "on_hold")
      return { label: "Resume", icon: Play, run: () => dispatch({ type: "SET_STATUS", id: item.id, status: item.assigneeId ? "assigned" : "planned" }) }
    if (item.status === "blocked" && unmet.length === 0)
      return { label: "Unblock", icon: Play, run: () => dispatch({ type: "SET_STATUS", id: item.id, status: item.assigneeId ? "assigned" : "planned", note: "Unblocked by founder" }) }
    return null
  })()

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-ds-sm",
        item.status === "in_progress" ? "border-brand-green/50" : "border-border",
        closed && "opacity-70",
      )}
    >
      <div className="flex items-start gap-3">
        {position !== undefined && (
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-brand-ink-soft">
            {position}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">{item.id}</span>
            <FunctionBadge fn={item.fn} />
            <StatusBadge status={item.status} />
            {item.carriedFrom && (
              <span className="text-[11px] text-muted-foreground">Carried from {formatDate(item.carriedFrom, { month: "short", day: "numeric" })}</span>
            )}
          </div>
          <h3 className="text-pretty text-sm font-semibold leading-snug text-brand-ink">{item.title}</h3>
          {item.outcome && !compact && <p className="text-xs leading-relaxed text-muted-foreground">Outcome: {item.outcome}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {primary && (
            <button
              onClick={primary.run}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-green px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <primary.icon className="h-3.5 w-3.5" aria-hidden />
              {primary.label}
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={`Actions for ${item.id}`}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <button className="fixed inset-0 z-10 cursor-default" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
                <div role="menu" className="absolute right-0 top-8 z-20 flex w-56 flex-col rounded-lg border border-border bg-card p-1 shadow-ds-md">
                  <MenuItem icon={Pencil} label="Edit task, outcome, approach" onClick={act(() => handlers.onEdit({ mode: "edit", id: item.id }))} />
                  {!closed && <MenuItem icon={UserRoundCog} label="Reassign" onClick={act(() => handlers.onReassign(item.id))} />}
                  {!closed && <MenuItem icon={Bot} label="Delegate via Coordinator" onClick={act(() => dispatch({ type: "DELEGATE", id: item.id }))} />}
                  {!closed && <MenuItem icon={ListPlus} label="Add subtask" onClick={act(() => handlers.onEdit({ mode: "create", inPlan: item.inTodayPlan, parentId: item.id }))} />}
                  {!closed && item.status !== "on_hold" && (
                    <MenuItem icon={Pause} label="Put on hold" onClick={act(() => dispatch({ type: "SET_STATUS", id: item.id, status: "on_hold" }))} />
                  )}
                  {item.inTodayPlan && !closed && (
                    <MenuItem icon={Undo2} label="Remove from today's plan" onClick={act(() => dispatch({ type: "PLAN", id: item.id, include: false }))} />
                  )}
                  {!item.inTodayPlan && !closed && (
                    <MenuItem icon={ListPlus} label="Add to today's plan" onClick={act(() => dispatch({ type: "PLAN", id: item.id, include: true }))} />
                  )}
                  {!closed && (
                    <MenuItem
                      icon={Ban}
                      label="Cancel task"
                      danger
                      onClick={act(() => {
                        if (window.confirm(`Cancel ${item.id}? The record is kept in the Work Register.`))
                          dispatch({ type: "SET_STATUS", id: item.id, status: "cancelled" })
                      })}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <dl className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Priority</dt>
          <dd>
            <PriorityBadge priority={item.priority} />
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt>Resource</dt>
          <dd className="font-medium text-brand-ink">{resourceName(state, item.assigneeId)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Authority</dt>
          <dd>
            <AuthorityBadge check={authority} />
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt>Due</dt>
          <dd className="text-brand-ink">{formatDate(item.dueDate, { month: "short", day: "numeric" })}</dd>
        </div>
        {item.effortMins > 0 && (
          <div className="flex items-center gap-1.5">
            <dt>Founder effort</dt>
            <dd className="text-brand-ink">{formatDuration(item.effortMins)}</dd>
          </div>
        )}
      </dl>

      {(unmet.length > 0 || item.requiresFounderDecision || delegationOpportunity || item.approach) && !compact && (
        <div className="flex flex-col gap-1 text-xs leading-relaxed">
          {unmet.length > 0 && !closed && (
            <p className="flex items-center gap-1.5 text-brand-coral-dark">
              <Link2 className="h-3.5 w-3.5" aria-hidden />
              Waiting on {unmet.join(", ")}
            </p>
          )}
          {item.requiresFounderDecision && !closed && (
            <p className="text-brand-ink">
              <span className="font-semibold">Founder decision:</span> {item.decisionQuestion || "Decision required"}
            </p>
          )}
          {delegationOpportunity && !closed && (
            <p className="text-brand-green-dark">Delegation opportunity — another registered resource covers this function.</p>
          )}
          {item.approach && <p className="text-muted-foreground">Approach: {item.approach}</p>}
        </div>
      )}

      {subtasks.length > 0 && (
        <ul className="flex flex-col gap-1 border-t border-border pt-2">
          {subtasks.map((s) => (
            <li key={s.id} className="flex items-center gap-2 text-xs">
              <CornerDownRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              <span className="font-mono text-muted-foreground">{s.id}</span>
              <button className="truncate text-left text-brand-ink hover:underline" onClick={() => handlers.onEdit({ mode: "edit", id: s.id })}>
                {s.title}
              </button>
              <StatusBadge status={s.status} />
            </li>
          ))}
        </ul>
      )}

      {allowReorder && position !== undefined && total !== undefined && !closed && (
        <div className="absolute -left-3 top-1/2 hidden -translate-y-1/2 flex-col gap-1 group-hover:flex group-focus-within:flex">
          <button
            disabled={position === 1}
            onClick={() => dispatch({ type: "MOVE", id: item.id, dir: -1 })}
            className="rounded-full border border-border bg-card p-1 shadow-ds-sm hover:bg-muted disabled:opacity-40"
            aria-label={`Move ${item.id} up`}
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <button
            disabled={position === total}
            onClick={() => dispatch({ type: "MOVE", id: item.id, dir: 1 })}
            className="rounded-full border border-border bg-card p-1 shadow-ds-sm hover:bg-muted disabled:opacity-40"
            aria-label={`Move ${item.id} down`}
          >
            <ArrowDown className="h-3 w-3" />
          </button>
        </div>
      )}
    </article>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Pencil
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none",
        danger ? "text-brand-coral-dark" : "text-brand-ink",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </button>
  )
}
