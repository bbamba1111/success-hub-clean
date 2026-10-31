"use client"

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Ban,
  Bot,
  CheckCircle2,
  ChevronDown,
  CornerDownRight,
  ListPlus,
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
  const [showMore, setShowMore] = useState(false)
  const authority = authorityFor(state, item.assigneeId, item)
  const subtasks = state.work.filter((w) => w.parentId === item.id)
  const unmet = item.dependsOn.filter((d) => state.work.find((w) => w.id === d)?.status !== "completed")
  const unmetTitles = unmet.map((id) => state.work.find((w) => w.id === id)?.title ?? id)
  const closed = isClosed(item.status)
  const founderOwned = item.assigneeId === "R-FOUNDER"
  const canMove = allowReorder && position !== undefined && total !== undefined && !closed
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
    if (item.status === "in_progress" && item.reviewRequired && !founderOwned)
      return { label: "Send to me to check", icon: CheckCircle2, run: () => dispatch({ type: "SET_STATUS", id: item.id, status: "under_review" }) }
    if (item.status === "in_progress")
      return { label: "Mark done", icon: CheckCircle2, run: () => dispatch({ type: "SET_STATUS", id: item.id, status: "completed", note: founderOwned ? "Completed by founder" : undefined }) }
    if (item.status === "on_hold")
      return { label: "Keep going", icon: Play, run: () => dispatch({ type: "SET_STATUS", id: item.id, status: item.assigneeId ? "assigned" : "planned" }) }
    if (item.status === "blocked" && unmet.length === 0)
      return { label: "It is not stuck now", icon: Play, run: () => dispatch({ type: "SET_STATUS", id: item.id, status: item.assigneeId ? "assigned" : "planned", note: "Unblocked by founder" }) }
    return null
  })()

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-card p-5 md:p-6",
        item.status === "in_progress" ? "border-brand-green/60" : "border-border",
        closed && "opacity-70",
      )}
    >
      <div className="flex items-start gap-4">
        {position !== undefined && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-sage-light text-base font-semibold text-brand-green-dark">
            {position}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 className="text-pretty text-xl font-semibold leading-snug text-brand-ink">{item.title}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-brand-ink-soft">
            <StatusBadge status={item.status} />
            <span>
              Who: <span className="font-medium text-brand-ink">{resourceName(state, item.assigneeId)}</span>
            </span>
          </div>
        </div>
      </div>

      {!closed && (unmet.length > 0 || item.requiresFounderDecision) && (
        <div className="flex flex-col gap-2 rounded-xl bg-brand-blush/60 p-4 text-base leading-relaxed">
          {unmet.length > 0 && (
            <p className="flex items-start gap-2 text-brand-coral-dark">
              <Link2 className="mt-1 h-5 w-5 shrink-0" aria-hidden />
              Waiting for: {unmetTitles.join(", ")}
            </p>
          )}
          {item.requiresFounderDecision && (
            <p className="text-brand-ink">
              <span className="font-semibold">You need to decide:</span> {item.decisionQuestion || "Make a choice about this task."}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {primary && (
          <button
            onClick={primary.run}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-green px-5 text-base font-semibold text-primary-foreground hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <primary.icon className="h-5 w-5" aria-hidden />
            {primary.label}
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-border px-5 text-base font-medium text-brand-ink hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Pencil className="h-5 w-5" aria-hidden />
            Change
          </button>
          {menuOpen && (
            <>
              <button className="fixed inset-0 z-10 cursor-default" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
              <div role="menu" className="absolute left-0 top-14 z-20 flex w-72 flex-col rounded-2xl border border-border bg-card p-2 shadow-ds-md">
                <MenuItem icon={Pencil} label="Edit this task" onClick={act(() => handlers.onEdit({ mode: "edit", id: item.id }))} />
                {canMove && position! > 1 && <MenuItem icon={ArrowUp} label="Move up" onClick={act(() => dispatch({ type: "MOVE", id: item.id, dir: -1 }))} />}
                {canMove && position! < total! && <MenuItem icon={ArrowDown} label="Move down" onClick={act(() => dispatch({ type: "MOVE", id: item.id, dir: 1 }))} />}
                {!closed && <MenuItem icon={UserRoundCog} label="Give to someone else" onClick={act(() => handlers.onReassign(item.id))} />}
                {!closed && <MenuItem icon={Bot} label="Let my AI helper pick someone" onClick={act(() => dispatch({ type: "DELEGATE", id: item.id }))} />}
                {!closed && <MenuItem icon={ListPlus} label="Add a smaller step" onClick={act(() => handlers.onEdit({ mode: "create", inPlan: item.inTodayPlan, parentId: item.id }))} />}
                {!closed && item.status !== "on_hold" && (
                  <MenuItem icon={Pause} label="Pause" onClick={act(() => dispatch({ type: "SET_STATUS", id: item.id, status: "on_hold" }))} />
                )}
                {item.inTodayPlan && !closed && (
                  <MenuItem icon={Undo2} label="Take off today's plan" onClick={act(() => dispatch({ type: "PLAN", id: item.id, include: false }))} />
                )}
                {!item.inTodayPlan && !closed && (
                  <MenuItem icon={ListPlus} label="Add to today's plan" onClick={act(() => dispatch({ type: "PLAN", id: item.id, include: true }))} />
                )}
                {!closed && (
                  <MenuItem
                    icon={Ban}
                    label="Stop this task"
                    danger
                    onClick={act(() => {
                      if (window.confirm(`Stop "${item.title}"? We will still keep a record of it.`))
                        dispatch({ type: "SET_STATUS", id: item.id, status: "cancelled" })
                    })}
                  />
                )}
              </div>
            </>
          )}
        </div>
        {!compact && (
          <button
            onClick={() => setShowMore((s) => !s)}
            aria-expanded={showMore}
            className="inline-flex h-12 items-center gap-2 rounded-xl px-3 text-base font-medium text-brand-green-dark hover:bg-brand-sage-light"
          >
            {showMore ? "Hide details" : "More details"}
            <ChevronDown className={cn("h-5 w-5 transition-transform", showMore && "rotate-180")} aria-hidden />
          </button>
        )}
      </div>

      {showMore && !compact && (
        <dl className="grid gap-4 border-t border-border pt-4 text-base sm:grid-cols-2">
          {item.outcome && <Detail label="Done looks like" value={item.outcome} wide />}
          <Detail label="Part of the business" value={<FunctionBadge fn={item.fn} full />} />
          <Detail label="How important" value={<PriorityBadge priority={item.priority} />} />
          <Detail label="Permission" value={<AuthorityBadge check={authority} />} />
          <Detail label="Due" value={formatDate(item.dueDate, { month: "long", day: "numeric" })} />
          {item.effortMins > 0 && <Detail label="Your time" value={formatDuration(item.effortMins)} />}
          {item.carriedFrom && <Detail label="Moved from" value={formatDate(item.carriedFrom, { month: "long", day: "numeric" })} />}
          {item.approach && <Detail label="How to do it" value={item.approach} wide />}
          {delegationOpportunity && !closed && <Detail label="Tip" value="Someone on your team can do this. You could give it to them." wide />}
          <Detail label="Task number" value={item.id} />
          {subtasks.length > 0 && (
            <div className="flex flex-col gap-2 sm:col-span-2">
              <dt className="font-semibold text-brand-ink">Smaller steps</dt>
              <dd>
                <ul className="flex flex-col gap-2">
                  {subtasks.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center gap-3">
                      <CornerDownRight className="h-5 w-5 text-muted-foreground" aria-hidden />
                      <button className="text-left text-brand-ink underline-offset-4 hover:underline" onClick={() => handlers.onEdit({ mode: "edit", id: s.id })}>
                        {s.title}
                      </button>
                      <StatusBadge status={s.status} />
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      )}
    </article>
  )
}

function Detail({ label, value, wide }: { label: string; value: React.ReactNode; wide?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-1", wide && "sm:col-span-2")}>
      <dt className="font-semibold text-brand-ink">{label}</dt>
      <dd className="leading-relaxed text-brand-ink-soft">{value}</dd>
    </div>
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
        "flex min-h-12 items-center gap-3 rounded-xl px-4 text-left text-base hover:bg-muted focus:bg-muted focus:outline-none",
        danger ? "text-brand-coral-dark" : "text-brand-ink",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      {label}
    </button>
  )
}
