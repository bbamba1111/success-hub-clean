"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, type ReactNode } from "react"
import {
  Bot,
  BookOpenCheck,
  Building2,
  CalendarClock,
  Clock,
  ClipboardList,
  Gauge,
  KeyRound,
  ListChecks,
  Menu,
  RotateCcw,
  Settings,
  Sprout,
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
  { href: "/boss", label: "My Business Day", hint: "Plan and do today", icon: CalendarClock },
  { href: "/boss/dashboard", label: "Business Dashboard", hint: "See how it is going", icon: Gauge },
  { href: "/boss/fundamentals", label: "Startup Business Fundamentals", hint: "Build and strengthen the basics", icon: Sprout },
  { href: "/boss/queue", label: "Jobs", hint: "Who is doing what", icon: ListChecks },
  { href: "/boss/opportunities", label: "Opportunities", hint: "Chances to grow", icon: Sparkles, child: true },
  { href: "/boss/register", label: "Work Register", hint: "The record of all work", icon: ClipboardList },
  { href: "/boss/workforce", label: "Team", hint: "Your people and helpers", icon: Users },
  { href: "/boss/authority", label: "Authority & Permissions", hint: "Who may do what", icon: KeyRound },
  { href: "/boss/coordinator", label: "AI Operations Coordinator", hint: "Your AI helper", icon: Bot },
  { href: "/boss/business-profile", label: "Business Profile", hint: "About your business", icon: Building2 },
  { href: "/boss/founder-profile", label: "Founder Profile", hint: "About you", icon: UserRound },
  { href: "/boss/systems", label: "Business Systems & SOPs", hint: "How you do things", icon: BookOpenCheck },
]

const CLOCK_OPTIONS: { id: ClockMode; label: string }[] = [
  { id: "live", label: "Real time (Eastern)" },
  { id: "planning", label: "Pretend it is morning" },
  { id: "workday", label: "Pretend it is work time" },
  { id: "closeout", label: "Pretend it is 5:00 PM" },
  { id: "protected", label: "Pretend it is the weekend" },
]

const PHASE_LABEL = {
  planning: "Morning · plan your day",
  workday: "Work time · 1:00 to 5:00 PM",
  after_hours: "Free time · work is done",
  protected_weekend: "Weekend · work is done",
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav aria-label="The BO$$" className="flex flex-col gap-1">
      {NAV.map(({ href, label, hint, icon: Icon, child }) => {
        const active = href === "/boss" ? pathname === "/boss" : pathname?.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              child && "ml-6",
              active
                ? "bg-brand-sage-light font-semibold text-brand-green-dark"
                : "text-brand-ink-soft hover:bg-muted hover:text-brand-ink",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="flex flex-col">
              <span className="leading-snug">{label}</span>
              <span className={cn("text-sm font-normal", active ? "text-brand-green-dark/80" : "text-muted-foreground")}>{hint}</span>
            </span>
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
      <span className="text-sm text-muted-foreground">Run your business, keep your life</span>
    </Link>
  )
}

function AccountArea() {
  const { state } = useBoss()
  const founder = state.resources.find((r) => r.category === "founder")
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-blush text-base font-semibold text-brand-coral-dark">
        {founder?.name
          .split(" ")
          .map((p) => p[0])
          .join("")}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-brand-ink">{founder?.name}</p>
        <p className="truncate text-sm text-muted-foreground">Sample account</p>
      </div>
      <Link
        href="/boss/founder-profile"
        className="rounded-lg p-2.5 text-muted-foreground hover:bg-muted hover:text-brand-ink"
        aria-label="Account settings"
      >
        <Settings className="h-5 w-5" />
      </Link>
    </div>
  )
}

function DemoTools() {
  const { state, dispatch, resetDemo } = useBoss()
  return (
    <details className="relative">
      <summary className="flex h-12 cursor-pointer list-none items-center gap-2 rounded-xl border border-border px-4 text-base font-medium text-brand-ink hover:bg-muted [&::-webkit-details-marker]:hidden">
        <Clock className="h-5 w-5 text-brand-green-dark" aria-hidden />
        <span className="hidden sm:inline">Practice tools</span>
      </summary>
      <div className="absolute right-0 top-14 z-30 flex w-80 flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-ds-md">
        <p className="text-base leading-relaxed text-brand-ink-soft">
          This is a practice version. Your changes stay on this computer only.
        </p>
        <label className="flex flex-col gap-2">
          <span className="text-base font-semibold text-brand-ink">Pick a time of day to try</span>
          <select
            value={state.clockMode}
            onChange={(e) => dispatch({ type: "SET_CLOCK", mode: e.target.value as ClockMode })}
            className="h-12 rounded-lg border border-input bg-card px-3 text-base text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {CLOCK_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => {
            if (window.confirm("Start over with the sample data?")) resetDemo()
          }}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border text-base text-brand-ink hover:bg-muted"
        >
          <RotateCcw className="h-5 w-5" aria-hidden />
          Start over
        </button>
      </div>
    </details>
  )
}

export function BossAppShell({ children }: { children: ReactNode }) {
  const { clock } = useBoss()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-muted/40 text-brand-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-80 flex-col gap-6 border-r border-border bg-card px-4 py-6 lg:flex">
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

      <div className="lg:pl-80">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-card/95 px-4 py-4 backdrop-blur md:px-10">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2.5 hover:bg-muted lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate text-lg font-semibold text-brand-ink">
              {formatDate(clock.dateISO)}
              {clock.phase !== "planning" && <span className="font-normal text-muted-foreground"> · {formatMinutes(clock.minutes)} ET</span>}
            </p>
            <p className="flex items-center gap-2 truncate text-base text-brand-ink-soft">
              <span
                aria-hidden
                className={cn(
                  "h-2.5 w-2.5 shrink-0 rounded-full",
                  clock.phase === "workday" ? "bg-brand-green" : clock.phase === "planning" ? "bg-brand-tan" : "bg-brand-coral",
                )}
              />
              {PHASE_LABEL[clock.phase]}
              {clock.isPreview && " · pretend time"}
            </p>
          </div>
          <DemoTools />
        </header>
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 text-base md:px-10">{children}</main>
      </div>
    </div>
  )
}
