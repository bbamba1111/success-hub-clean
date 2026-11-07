"use client"

/**
 * Founder Command Center™ — Today's Headquarters™.
 *
 * The single screen a member lands on to answer "what should I do right now?"
 * Every card is powered by the same Founder Intelligence Context™, so Today's
 * Next Best Step™, the Cherry Blossom Executive Brief™, and Time Freedom Time™
 * always tell one coherent story.
 */
import { useEffect, useMemo, useState } from "react"
import { loadFounderContext } from "@/lib/founder-intelligence/load-context"
import {
  deriveExecutiveBrief,
  deriveNextBestStep,
  deriveTimeFreedomTime,
} from "@/lib/founder-intelligence/engine"
import type { FounderIntelligenceContext } from "@/lib/founder-intelligence/types"
import { NextBestStepCard } from "./next-best-step-card"
import { ExecutiveBriefCard } from "./executive-brief"
import { TimeFreedomTimeCard } from "./time-freedom-time-card"
import { OperatingDayRail } from "./operating-day-rail"

export function FounderCommandCenter() {
  const [ctx, setCtx] = useState<FounderIntelligenceContext | null>(null)
  // Re-tick each minute so countdowns and block transitions stay live.
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let active = true
    loadFounderContext(now).then((next) => {
      if (active) setCtx(next)
    })
    return () => {
      active = false
    }
    // Reload the full context when the minute (and thus the block/phase) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now])

  const derived = useMemo(() => {
    if (!ctx) return null
    return {
      step: deriveNextBestStep(ctx),
      brief: deriveExecutiveBrief(ctx),
      timeFreedom: deriveTimeFreedomTime(ctx),
    }
  }, [ctx])

  if (!ctx || !derived) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="h-64 animate-pulse rounded-3xl bg-[#3A2E33]/5" aria-hidden="true" />
        <span className="sr-only">Loading your headquarters…</span>
      </div>
    )
  }

  const { experience } = ctx

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-[#5D9D61]">
          {experience.theme.label} · {experience.time.dayName}
        </p>
        <h1 className="mt-1 font-playfair text-3xl italic text-[#3A2E33] sm:text-4xl text-balance">
          Today&apos;s Headquarters™
        </h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-[#5C4F55] text-pretty">
          Your Founder Command Center™ — one clear next step, a concise brief from Cherry Blossom, and the life your
          work is building toward.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Primary column: the decision + the brief. */}
        <div className="space-y-6 lg:col-span-2">
          <NextBestStepCard step={derived.step} />
          <TimeFreedomTimeCard state={derived.timeFreedom} />
          <ExecutiveBriefCard brief={derived.brief} />
        </div>

        {/* Rail: where you are in the operating day. */}
        <div className="lg:col-span-1">
          <OperatingDayRail experience={experience} />
        </div>
      </div>
    </main>
  )
}
