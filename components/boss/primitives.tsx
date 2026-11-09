import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { fnMeta, levelMeta, PERMISSION_STATUS_LABEL, PRIORITIES, STATUS_LABEL } from "@/lib/boss/constants"
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
    <header className="flex flex-col gap-5 pb-2 md:flex-row md:items-end md:justify-between">
      <div className="flex max-w-3xl flex-col gap-3">
        {eyebrow && <p className="text-base font-semibold text-brand-green-dark">{eyebrow}</p>}
        <h1 className="text-balance font-display text-4xl font-semibold leading-tight text-brand-ink md:text-5xl">{title}</h1>
        {description && <p className="text-pretty text-lg leading-relaxed text-brand-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
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
    <section className={cn("rounded-2xl border border-border bg-card", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-4 px-6 pt-6">
          <div className="flex flex-col gap-1.5">
            {title && <h2 className="text-xl font-semibold text-brand-ink">{title}</h2>}
            {description && <p className="text-base leading-relaxed text-brand-ink-soft">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </section>
  )
}

const pill = "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium"

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
    <span className={cn("inline-flex items-center gap-2 text-sm font-semibold", tone)}>
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-3 w-1.5 rounded-full", i <= dots ? "bg-current" : "bg-border")} />
        ))}
      </span>
      {PRIORITIES.find((p) => p.id === priority)?.label} priority
    </span>
  )
}

export function AuthorityBadge({ check }: { check: AuthorityCheck }) {
  switch (check.status) {
    case "founder":
      return <span className={cn(pill, "border-border bg-card text-brand-ink")}>You do this</span>
    case "external":
      return <span className={cn(pill, "border-border bg-muted text-brand-ink-soft")}>Outside partner · they choose</span>
    case "unassigned":
      return <span className={cn(pill, "border-dashed border-border bg-card text-muted-foreground")}>No one yet</span>
    case "task_approved":
      return <span className={cn(pill, "border-brand-green/40 bg-brand-sage-light text-brand-green-dark")}>OK for this task</span>
    case "authorized":
      return (
        <span className={cn(pill, "border-brand-green/40 bg-brand-sage-light text-brand-green-dark")}>
          {levelMeta(check.permission.level).label}
        </span>
      )
    case "not_authorized":
      return <span className={cn(pill, "border-brand-coral/40 bg-brand-blush text-brand-coral-dark")}>Not allowed yet</span>
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

export function DemoTag({ children = "Sample data" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-dashed border-brand-tan/60 bg-brand-tan-light px-2.5 py-1 text-sm font-semibold text-brand-tan-dark">
      {children}
    </span>
  )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center">
      <p className="text-lg font-medium text-brand-ink">{title}</p>
      {description && <p className="max-w-md text-base leading-relaxed text-brand-ink-soft">{description}</p>}
    </div>
  )
}

export const fieldClass =
  "min-h-12 w-full rounded-lg border border-input bg-card px-4 py-3 text-base text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export const labelClass = "text-base font-semibold text-brand-ink"

export function MoreDetails({
  summary,
  children,
  className,
  defaultOpen,
}: {
  summary: ReactNode
  children: ReactNode
  className?: string
  defaultOpen?: boolean
}) {
  return (
    <details open={defaultOpen} className={cn("group rounded-2xl border border-border bg-card", className)}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-6 py-4 text-lg font-semibold text-brand-ink hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDown className="h-5 w-5 shrink-0 text-brand-green-dark transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="flex flex-col gap-6 px-6 pb-6">{children}</div>
    </details>
  )
}

export function WordsToKnow({ words }: { words: [string, string][] }) {
  return (
    <MoreDetails summary="Words to know">
      <dl className="flex flex-col gap-4">
        {words.map(([term, meaning]) => (
          <div key={term} className="flex flex-col gap-1">
            <dt className="text-base font-semibold text-brand-green-dark">{term}</dt>
            <dd className="text-base leading-relaxed text-brand-ink">{meaning}</dd>
          </div>
        ))}
      </dl>
    </MoreDetails>
  )
}

export const bigButton = "h-12 rounded-xl px-6 text-base"
