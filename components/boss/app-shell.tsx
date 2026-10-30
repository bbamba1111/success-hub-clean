"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, type ReactNode } from "react"
import {
  Bot,
  BookOpenCheck,
  Building2,
  CalendarClock,
  ClipboardList,
  Gauge,
  KeyRound,
  ListChecks,
  Menu,
  RotateCcw,
  Settings,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { formatDate, formatMinutes } from "@/lib/boss/clock"
import type { ClockMode } from "@/lib/boss/types"

const NAV = [
  { href: "/boss", label: "My Business Day", icon: CalendarClock },
  { href: "/boss/dashboard", label: "Business Dashboard", icon: Gauge },
  { href: "/boss/queue", label: "Business Work Queue", icon: ListChecks },
  { href: "/boss/opportunities", label: "Opportunities", icon: Sparkles, child: true },
  { href: "/boss/register", label: "Work Register", icon: ClipboardList },
  { href: "/boss/workforce", label: "Workforce Registry", icon: Users },
  { href: "/boss/authority", label: "Authority & Permissions", icon: KeyRound },
  { href: "/boss/coordinator", label: "Central AI Operations Coordinator", icon: Bot },
  { href: "/boss/business-profile", label: "Business Profile", icon: Building2 },
  { href: "/boss/founder-profile", label: "Founder Profile", icon: UserRound },
  { href: "/boss/systems", label: "Business Systems & SOPs", icon: BookOpenCheck },
]

const CLOCK_OPTIONS: { id: ClockMode; label: string }[] = [
  { id: "live", label: "Live time (ET)" },
  { id: "planning", label: "Preview · Decide & Design" },
  { id: "workday", label: "Preview · CEO Workday" },
  { id: "closeout", label: "Preview · 5:00 PM closeout" },
  { id: "protected", label: "Preview · Protected weekend" },
]

const PHASE_LABEL = {
  planning: "Decide & Design",
  workday: "CEO Workday in session",
  after_hours: "Time Freedom™ · protected",
  protected_weekend: "Protected weekend",
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav aria-label="The BO$$" className="flex flex-col gap-0.5">
      {NAV.map(({ href, label, icon: Icon, child }) => {
        const active = href === "/boss" ? pathname === "/boss" : pathname?.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              child && "ml-5 py-1.5 text-[13px]",
              active
                ? "bg-brand-sage-light font-semibold text-brand-green-dark"
                : "text-brand-ink-soft hover:bg-muted hover:text-brand-ink",
            )}
          >
            <Icon className={cn("shrink-0", child ? "h-3.5 w-3.5" : "h-4 w-4")} aria-hidden />
            <span className="leading-snug">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function Brand() {
  return (
    <Link href="/boss" className="flex flex-col">
      <span className="font-display text-2xl font-semibold tracking-tight text-brand-ink">
        The BO<span className="text-brand-green">$$</span>
      </span>
      <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Business Operating System</span>
    </Link>
  )
}

function AccountArea() {
  const { state } = useBoss()
  const founder = state.resources.find((r) => r.category === "founder")
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blush text-sm font-semibold text-brand-coral-dark">
        {founder?.name
          .split(" ")
          .map((p) => p[0])
          .join("")}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-brand-ink">{founder?.name}</p>
        <p className="truncate text-xs text-muted-foreground">Demo founder account</p>
      </div>
      <Link
        href="/boss/founder-profile"
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-brand-ink"
        aria-label="Account settings"
      >
        <Settings className="h-4 w-4" />
      </Link>
    </div>
  )
}

export function BossAppShell({ children }: { children: ReactNode }) {
  const { state, dispatch, clock, resetDemo } = useBoss()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-muted/40 text-brand-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col gap-6 border-r border-border bg-card px-4 py-6 lg:flex">
        <div className="px-2">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <AccountArea />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="absolute inset-0 bg-brand-ink/30" aria-label="Close navigation" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col gap-6 bg-card px-4 py-6 shadow-xl">
            <div className="flex items-center justify-between px-2">
              <Brand />
              <button onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-muted" aria-label="Close navigation">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav onNavigate={() => setOpen(false)} />
            </div>
            <AccountArea />
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:px-8">
          <button
            onClick={() => setOpen(true)}
            className="rounded-md p-2 hover:bg-muted lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate text-sm font-semibold text-brand-ink">
              {formatDate(clock.dateISO)}
              {clock.phase !== "planning" && <span className="font-normal text-muted-foreground"> · {formatMinutes(clock.minutes)} ET</span>}
            </p>
            <p className="flex items-center gap-2 truncate text-xs text-muted-foreground">
              <span
                aria-hidden
                className={cn(
                  "h-2 w-2 rounded-full",
                  clock.phase === "workday" ? "bg-brand-green" : clock.phase === "planning" ? "bg-brand-tan" : "bg-brand-coral",
                )}
              />
              {PHASE_LABEL[clock.phase]}
              {clock.isPreview && " · prototype clock"}
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Clock</span>
            <select
              value={state.clockMode}
              onChange={(e) => dispatch({ type: "SET_CLOCK", mode: e.target.value as ClockMode })}
              className="rounded-md border border-input bg-card px-2 py-1.5 text-xs text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {CLOCK_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <span className="hidden rounded-md border border-dashed border-brand-tan/60 bg-brand-tan-light px-2 py-1 text-[11px] font-medium text-brand-tan-dark md:inline">
            Prototype · saved in this browser only
          </span>
          <button
            onClick={() => {
              if (window.confirm("Reset all demo data to its starting state?")) resetDemo()
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-brand-ink-soft hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset demo
          </button>
        </header>
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  )
}
