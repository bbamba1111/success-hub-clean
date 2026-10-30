import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { fnMeta, levelMeta, PERMISSION_STATUS_LABEL, STATUS_LABEL } from "@/lib/boss/constants"
import type { AuthorityCheck } from "@/lib/boss/reducer"
import type { AuthLevel, BusinessFunction, PermissionStatus, Priority, WorkStatus } from "@/lib/boss/types"

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-3xl flex-col gap-2">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green-dark">{eyebrow}</p>}
        <h1 className="text-balance font-display text-3xl font-semibold text-brand-ink md:text-4xl">{title}</h1>
        {description && <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex flex-col gap-1">
            {title && <h2 className="text-sm font-semibold text-brand-ink">{title}</h2>}
            {description && <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

const pill = "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium"

export function FunctionBadge({ fn, full }: { fn: BusinessFunction; full?: boolean }) {
  const m = fnMeta(fn)
  return <span className={cn(pill, m.tone)}>{full ? m.label : m.short}</span>
}

const STATUS_TONE: Partial<Record<WorkStatus, string>> = {
  in_progress: "border-brand-green/40 bg-brand-sage-light text-brand-green-dark",
  completed: "border-brand-green bg-brand-green text-primary-foreground",
  under_review: "border-brand-tan/50 bg-brand-tan-light text-brand-tan-dark",
  blocked: "border-brand-coral/40 bg-brand-blush text-brand-coral-dark",
  failed: "border-brand-coral/40 bg-brand-blush text-brand-coral-dark",
  awaiting_approval: "border-brand-coral/40 bg-card text-brand-coral-dark",
  awaiting_external: "border-border bg-muted text-brand-ink-soft",
  on_hold: "border-border bg-muted text-muted-foreground",
  cancelled: "border-border bg-muted text-muted-foreground line-through",
}

export function StatusBadge({ status }: { status: WorkStatus }) {
  return <span className={cn(pill, STATUS_TONE[status] ?? "border-border bg-card text-brand-ink-soft")}>{STATUS_LABEL[status]}</span>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const tone =
    priority === "critical"
      ? "text-brand-coral-dark"
      : priority === "high"
        ? "text-brand-ink"
        : "text-muted-foreground"
  const dots = { critical: 4, high: 3, medium: 2, low: 1 }[priority]
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide", tone)}>
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-2.5 w-1 rounded-full", i <= dots ? "bg-current" : "bg-border")} />
        ))}
      </span>
      {priority}
    </span>
  )
}

export function AuthorityBadge({ check }: { check: AuthorityCheck }) {
  switch (check.status) {
    case "founder":
      return <span className={cn(pill, "border-border bg-card text-brand-ink")}>Founder authority</span>
    case "external":
      return <span className={cn(pill, "border-border bg-muted text-brand-ink-soft")}>External · by agreement</span>
    case "unassigned":
      return <span className={cn(pill, "border-dashed border-border bg-card text-muted-foreground")}>No resource</span>
    case "task_approved":
      return <span className={cn(pill, "border-brand-green/40 bg-brand-sage-light text-brand-green-dark")}>Approved for this task</span>
    case "authorized":
      return (
        <span className={cn(pill, "border-brand-green/40 bg-brand-sage-light text-brand-green-dark")}>
          {levelMeta(check.permission.level).label}
        </span>
      )
    case "not_authorized":
      return <span className={cn(pill, "border-brand-coral/40 bg-brand-blush text-brand-coral-dark")}>Not authorized</span>
  }
}

export function LevelBadge({ level }: { level: AuthLevel }) {
  return <span className={cn(pill, "border-brand-green/30 bg-card text-brand-green-dark")}>{levelMeta(level).label}</span>
}

export function PermissionStatusBadge({ status }: { status: PermissionStatus }) {
  const tone: Record<PermissionStatus, string> = {
    authorized: "border-brand-green bg-brand-green text-primary-foreground",
    awaiting_approval: "border-brand-coral/40 bg-brand-blush text-brand-coral-dark",
    not_authorized: "border-border bg-muted text-brand-ink-soft",
    suspended: "border-brand-tan/50 bg-brand-tan-light text-brand-tan-dark",
    expired: "border-border bg-muted text-muted-foreground",
  }
  return <span className={cn(pill, tone[status])}>{PERMISSION_STATUS_LABEL[status]}</span>
}

export function DemoTag({ children = "Demo data" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-dashed border-brand-tan/60 bg-brand-tan-light px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-tan-dark">
      {children}
    </span>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-border px-4 py-8 text-center">
      <p className="text-sm font-medium text-brand-ink">{title}</p>
      {description && <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  )
}

export const fieldClass =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export const labelClass = "text-xs font-semibold text-brand-ink-soft"
