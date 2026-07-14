"use client"

/**
 * WeeklyRhythmGate — the day-aware boundary for the Founder Operating System™.
 *
 * It answers one question: "Given today and this member's access level, what
 * should the CEO Dashboard show right now?"
 *
 *   • Sunday        → Sunday Design Day™ invitation (still Time Freedom™; a
 *                     short optional ritual, not a workday). Open to everyone.
 *   • Mon–Thu       → the full Business Day workspaces (the {children}) IF the
 *                     day is unlocked for this member; otherwise the
 *                     "inspirationally locked" preview (Monday members, Tue–Thu).
 *   • Fri / Sat     → Time Freedom™ rest screen — business workspaces close.
 *
 * The route that renders this gate does not mount the OperatingEngineProvider,
 * so the day is derived client-side. A `?day=0..6` query override is supported
 * for admin/QA preview (0 = Sunday … 6 = Saturday).
 */

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Leaf, ArrowRight, Sparkles, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { resolveAccessLevel } from "@/utils/membership-storage"
import {
  resolveDayAccess,
  buildWeekProgress,
  type AccessLevel,
  type DayDefinition,
  type DayIndex,
} from "@/lib/membership/access"
import { LockedDayPreview } from "@/components/founder-os/locked-day-preview"

function parseDayOverride(): DayIndex | null {
  if (typeof window === "undefined") return null
  const raw = new URLSearchParams(window.location.search).get("day")
  if (raw === null) return null
  const n = Number(raw)
  return Number.isInteger(n) && n >= 0 && n <= 6 ? (n as DayIndex) : null
}

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" aria-live="polite" aria-busy="true">
      <Loader2 className="h-6 w-6 animate-spin text-[#5D9D61]" aria-hidden />
      <span className="sr-only">Preparing your day</span>
    </div>
  )
}

/** Friday / Saturday — business workspaces intentionally rest. */
function TimeFreedomRest({ day }: { day: DayDefinition }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#5D9D61]/10 px-4 py-1.5 text-sm font-semibold text-[#3A6845]">
        <Leaf className="h-4 w-4" aria-hidden />
        {day.weekday} · Time Freedom™
      </span>
      <h1 className="mt-5 text-balance font-playfair text-4xl font-semibold leading-tight text-[#2F5A3A] md:text-5xl">
        {day.title}
      </h1>
      <p className="mt-3 font-montserrat text-lg font-medium text-[#5D9D61]">{day.tagline}</p>
      <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-[#4A3A42]">{day.description}</p>
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#78AD7D]/25 bg-white/70 p-6">
        <p className="flex items-start gap-2 text-left text-pretty leading-relaxed text-[#3A2E33]">
          <span aria-hidden className="text-lg">
            🌸
          </span>
          <span>
            The business is closed today — and that&apos;s by design. The focused work you did Monday through Thursday
            is what earns these three days of Time Freedom™. I&apos;ll see you on Sunday to gently design the week
            ahead.
          </span>
        </p>
      </div>
      <div className="mt-8">
        <Button asChild variant="outline" className="border-[#78AD7D]/40 bg-transparent font-semibold text-[#3A6845] hover:bg-[#78AD7D]/10">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </section>
  )
}

/** Sunday — Design Day™: a short, optional ritual inside Time Freedom™. */
function SundayInvitation({ day }: { day: DayDefinition }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#5D9D61]/10 px-4 py-1.5 text-sm font-semibold text-[#3A6845]">
        <Sun className="h-4 w-4" aria-hidden />
        Sunday · Still Time Freedom™
      </span>
      <h1 className="mt-5 text-balance font-playfair text-4xl font-semibold leading-tight text-[#2F5A3A] md:text-5xl">
        {day.title}
      </h1>
      <p className="mt-3 font-montserrat text-lg font-medium text-[#5D9D61]">{day.tagline}</p>
      <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-[#4A3A42]">{day.description}</p>
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#78AD7D]/25 bg-white/70 p-6">
        <p className="flex items-start gap-2 text-left text-pretty leading-relaxed text-[#3A2E33]">
          <span aria-hidden className="text-lg">
            🌸
          </span>
          <span>
            Sunday is still yours. In about twenty intentional minutes we&apos;ll design the week ahead — a Weekly
            Reality Check, your Human Intention, and your Business Focus — and then you get right back to your Time
            Freedom™.
          </span>
        </p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="bg-[#78AD7D] px-6 font-semibold text-white hover:bg-[#6a9c6f]">
          <Link href="/begin">
            Design My Week™
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-[#78AD7D]/40 bg-transparent font-semibold text-[#3A6845] hover:bg-[#78AD7D]/10">
          <Link href="/">Not Today</Link>
        </Button>
      </div>
    </section>
  )
}

export function WeeklyRhythmGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [day, setDay] = useState<DayIndex>(1)
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("business_week")

  useEffect(() => {
    let active = true
    const resolvedDay = parseDayOverride() ?? (new Date().getDay() as DayIndex)
    resolveAccessLevel()
      .then((level) => {
        if (!active) return
        setDay(resolvedDay)
        setAccessLevel(level)
        setReady(true)
      })
      .catch(() => {
        if (!active) return
        setDay(resolvedDay)
        setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  // Server + first client paint render the same skeleton, avoiding hydration mismatch.
  if (!ready) return <Loading />

  const access = resolveDayAccess(accessLevel, day)

  if (access.day.dayType === "sunday_design") return <SundayInvitation day={access.day} />
  if (access.day.dayType === "time_freedom") return <TimeFreedomRest day={access.day} />

  if (access.locked) {
    return (
      <LockedDayPreview
        day={access.day}
        progress={buildWeekProgress(accessLevel, new Date(refDateForDay(day)))}
        onUpgrade={() => router.push("/pricing")}
        onAskCherryBlossom={() => router.push("/cherry-blossom")}
      />
    )
  }

  return <>{children}</>
}

/**
 * Builds a reference Date whose weekday equals the requested day, so the
 * progress indicator highlights the correct "Today" when a `?day=` override is
 * active. For the real current day this simply returns now.
 */
function refDateForDay(day: DayIndex): number {
  const base = new Date()
  const diff = day - base.getDay()
  base.setDate(base.getDate() + diff)
  return base.getTime()
}
