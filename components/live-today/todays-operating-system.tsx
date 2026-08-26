"use client"

/**
 * TodaysOperatingSystem™ — Live & Lead Today™ (Phase 8.1)
 *
 * ⚠️ ORPHANED — NOT MOUNTED BY ANY LIVE PAGE OR COMPONENT (confirmed by
 * repo-wide import search, architecture audit). Only reference anywhere is
 * `docs/harmony-lane-operating-manual.md`. The live CEO Workday™ segment
 * runs through `business-day-block.tsx` → `TodaysCeoWorkdayCard` →
 * `FounderGpsWorkspace`, which calls the canonical `deriveNextBestMove()`
 * in `lib/founder-gps/next-best-move-engine.ts` — NOT `deriveGpsRecommendation()`
 * from `lib/founder-gps/engine.ts` used here.
 *
 * DO NOT mount this component and DO NOT build new features on top of
 * `deriveGpsRecommendation()`/`CeoWorkdayWorkspace`/`GpsRecommendationCard`
 * — they are a superseded, pre-Next-Best-Move segment-recommendation system
 * left in place only for historical reference. Any new CEO Workday work
 * belongs in `FounderGpsWorkspace` against the canonical `GpsRecommendation`
 * pipeline.
 *
 * Single Voice Principle™: Cherry Blossom™ is the only voice.
 * Founder Intelligence™, Founder GPS™, Harmony Context Engine™ and all other
 * intelligence engines work behind the scenes. Cherry Blossom presents.
 *
 * Phase 8.1 additions:
 *   - Founder GPS™ recommendations are live in every segment card
 *   - Every recommendation is explainable (Why This Recommendation™)
 *   - Every recommendation assigns an Executive™
 *   - Business Asset Intelligence™ shows the compounding value being built
 *
 * Flow:
 *   Dynamic Hero™ → Current Operating Segment™ → Cherry Blossom™ →
 *   Founder GPS™ Recommendation → Daily Non-Negotiable™ →
 *   Intention Declaration™ → Learn More About This Segment™ → Reflection
 */

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, ChevronDown, Flower2, ChevronsDown } from "lucide-react"
import { useHarmonyContext } from "@/components/harmony-context/harmony-context-provider"
import type { HarmonySegment } from "@/lib/harmony-context/types"
import {
  HONOR_OPTIONS,
  getTodayResponses,
  setTodayResponse,
  type HonorResponse,
} from "@/lib/sunday-design-day/non-negotiable-log"
import { CeoWorkdayWorkspace } from "@/components/live-today/ceo-workday-workspace"
import { GpsRecommendationCard } from "@/components/live-today/gps-recommendation-card"
import { deriveGpsRecommendation, type SegmentId } from "@/lib/founder-gps/engine"

import { assembleHarmonyContext } from "@/lib/founder-gps/context/harmony-context-aggregator"
import { FounderPresenceBanner } from "@/components/adaptive-workspace/founder-presence-banner"
import { OperatingModeCard } from "@/components/adaptive-workspace/operating-mode-card"

// ─── DMW reminder day logic ───────────────────────────────────────────────────

/**
 * Returns true when Design My Week™ is available and the reminder should show.
 *
 * Available windows (Phase 9.4):
 *   Friday, Saturday, Sunday  — all day
 *   Monday 7:00 AM – 9:00 AM  — Early Entry / Flex Time™ grace period
 *
 * At 9:00 AM Monday the design phase closes; the founder begins living the week.
 */
function shouldShowDmwReminder(): boolean {
  const now = new Date()
  const day = now.getDay() // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  const hour = now.getHours()
  if (day === 5 || day === 6 || day === 0) return true           // Fri / Sat / Sun — all day
  if (day === 1 && hour >= 7 && hour < 9) return true            // Mon 7:00–8:59 AM grace period
  return false
}

/**
 * Returns true when Time Freedom™ is active.
 * Window: Thursday 5:00 PM → Monday 7:00 AM.
 */
function isTimeFreedomDay(): boolean {
  const now = new Date()
  const day = now.getDay()   // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  const hour = now.getHours()
  if (day === 4 && hour >= 17) return true  // Thu 5 PM+
  if (day === 5 || day === 6 || day === 0) return true // Fri / Sat / Sun — all day
  if (day === 1 && hour < 7) return true    // Mon before 7 AM
  return false
}

/** Returns the day-of-week main heading and sub-line for the Dynamic Hero™. */
function getDayGreeting(): { heading: string; subline: string; badge: string } {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()

  // Time Freedom™ window: Thu 5pm – Mon 7am
  if (day === 4 && hour >= 17) return {
    heading: "Welcome to Your Time Freedom™",
    subline: "Your business week is complete. Enjoy the freedom you intentionally designed. Rest, reconnect, and recharge before next week's journey begins.",
    badge: "TIME FREEDOM™",
  }
  if (day === 5) return {
    heading: "Welcome to Your Time Freedom™",
    subline: "Your business week is complete. Protect the freedom you intentionally created.",
    badge: "TIME FREEDOM™",
  }
  if (day === 6) return {
    heading: "Welcome to Your Time Freedom™",
    subline: "Slow down, recharge, connect, and enjoy the life you designed your business to support.",
    badge: "TIME FREEDOM™",
  }
  if (day === 0) return {
    heading: "Welcome to Your Time Freedom™",
    subline: "Enjoy the final day of your Time Freedom™. Reflect on the week you've completed and prepare to intentionally begin another Work-Life Balance Business Week™ tomorrow.",
    badge: "TIME FREEDOM™",
  }
  if (day === 1 && hour < 7) return {
    heading: "Welcome to Your Time Freedom™",
    subline: "Enjoy the final day of your Time Freedom™. Reflect on the week you've completed and prepare to intentionally begin another Work-Life Balance Business Week™ tomorrow.",
    badge: "TIME FREEDOM™",
  }

  // Workweek days
  if (day === 1) return {
    heading: "Welcome to Make Time For More Mondays™",
    subline: "Your Redesigned Entry Into the Workweek. Today we intentionally begin another Work-Life Balance Business Week™ with clarity, purpose, and balance.",
    badge: "MAKE TIME FOR MORE MONDAYS™",
  }
  if (day === 2) return {
    heading: "Welcome to Tuesday's Work-Life Balance Business Day™",
    subline: "Continue living the commitments you designed. Protect your rhythm. Lead with intention.",
    badge: "WORK-LIFE BALANCE BUSINESS WEEK™",
  }
  if (day === 3) return {
    heading: "Welcome to Wednesday's Work-Life Balance Business Day™",
    subline: "Consistency creates momentum. Honor today's commitments and continue building the life you designed.",
    badge: "WORK-LIFE BALANCE BUSINESS WEEK™",
  }
  if (day === 4) return {
    heading: "Welcome to Thursday's Work-Life Balance Business Day™",
    subline: "Finish your business week strong. Complete what matters most before entering Time Freedom™.",
    badge: "WORK-LIFE BALANCE BUSINESS WEEK™",
  }

  // Fallback
  return {
    heading: "Welcome to Your Work-Life Balance Business Day™",
    subline: "Live, Lead, and Love Today.",
    badge: "WORK-LIFE BALANCE BUSINESS WEEK™",
  }
}

/** Returns just the day name string for the banner pill. */
function getDayName(): string {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return names[new Date().getDay()]
}

// ─── Day-of-Week Banner™ ──────────────────────────────────────────────────────
// Full-width display heading — large serif, day name in italic brand-coral,
// matching the panoramic section style shown in the design reference.

function DayOfWeekBanner() {
  const { heading, subline, badge } = getDayGreeting()
  const dayName = getDayName()

  // Split heading to italicise + colour the day name portion
  // e.g. "Welcome to Tuesday's Work-Life Balance Business Day™"
  //   → ["Welcome to ", "Tuesday's", " Work-Life Balance Business Day™"]
  const parts = heading.split(new RegExp(`(${dayName}(?:'s)?)`, "i"))

  return (
    <div className="w-full bg-[#FAF6F0] px-6 py-14 text-center sm:px-10 sm:py-20">
      {/* Badge pill — exact spec text */}
      <div className="mb-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1.5 font-montserrat text-[11px] font-bold uppercase tracking-[0.22em] text-brand-green-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden />
          {badge}
        </span>
      </div>

      {/* Main heading — day name in italic brand-coral */}
      <h1 className="font-playfair text-4xl font-bold text-brand-ink leading-tight text-balance sm:text-5xl lg:text-6xl">
        {parts.map((part, i) =>
          part.toLowerCase().startsWith(dayName.toLowerCase()) ? (
            <span key={i} className="italic text-brand-coral">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </h1>

      {/* Subline */}
      <p className="mt-5 mx-auto max-w-2xl font-montserrat text-base leading-relaxed text-brand-green sm:text-lg">
        {subline}
      </p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TodaysOperatingSystem() {
  const ctx = useHarmonyContext()

  if (!ctx.ready) return null

  const showReminder = !ctx.hasDesignedWeek && shouldShowDmwReminder()

  return (
    <div className="w-full">
      {/* Founder Presence Banner™ — Phase 10.6: thin contextual layer above hero */}
      <FounderPresenceBanner />

      {/* Day-of-Week Banner™ — full-width display heading above Dynamic Hero */}
      <DayOfWeekBanner />

      {/* Dynamic Hero™ */}
      <DynamicHero ctx={ctx} />

      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        {/* Conditional DMW Reminder — only when week not designed and day is right */}
        {showReminder && <DmwReminder />}

        {/* Operating Mode Card™ — Phase 10.6: shown when week is designed */}
        {ctx.hasDesignedWeek && <OperatingModeCard />}

        {ctx.hasDesignedWeek ? (
          <div className="mt-8 space-y-4">
            {ctx.segments.map((seg) =>
              seg.id === "ceo-workday" ? (
                <CeoWorkdayWorkspace
                  key={seg.id}
                  segment={seg}
                  isCurrent={ctx.currentSegment?.id === seg.id}
                />
              ) : (
                <SegmentCard
                  key={seg.id}
                  segment={seg}
                  isCurrent={ctx.currentSegment?.id === seg.id}
                />
              )
            )}
          </div>
        ) : (
          !showReminder && <NoWeekState />
        )}
      </div>
    </div>
  )
}

// ─── Dynamic Hero™ (Phase 9.0 — Living Intelligence™) ────────────────────────
//
// Cherry Blossom's hero now speaks from real context:
//   getCherryBlossomGuidance() reads HarmonyContextValue + ProgressSummary.
// The static cbSegmentIntro() lookup is retired. She now gives a personalized
// message that changes based on streaks, intentions, CEO context, and upcoming
// life events.

function DynamicHero({ ctx }: { ctx: ReturnType<typeof useHarmonyContext> }) {
  const seg = ctx.currentSegment
  const { heading, subline } = getDayGreeting()

  return (
    <header className="relative overflow-hidden bg-[#2C3E2D] px-6 py-10 sm:py-14">
      {/* Subtle texture overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/images/executive-suite.jpg')] bg-cover bg-center opacity-[0.08]" />

      <div className="relative mx-auto max-w-3xl">
        {/* Cherry Blossom identity */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 shadow-lg shrink-0">
            <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#E8C4A0]">
              Cherry Blossom™
            </p>
            <p className="font-montserrat text-[11px] text-white/50">
              Your Harmony Lane™ Operating Guide
            </p>
          </div>
        </div>

        {/* Day-of-week main greeting */}
        <h1 className="font-playfair text-3xl font-medium text-white leading-tight text-balance sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-2 font-montserrat text-sm font-semibold text-[#E8C4A0]/90 text-balance max-w-xl">
          {subline}
        </p>

        {/* Current segment — shown as a contextual badge below the main heading */}
        {seg && !isTimeFreedomDay() && (
          <div className="mt-4 flex items-center gap-2">
            <span className="font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Current Segment:
            </span>
            <span className="font-montserrat text-xs font-semibold text-white/80">
              {seg.title}
            </span>
          </div>
        )}

        {/* Animated scroll prompt */}
        <div className="mt-8 flex flex-col items-start gap-1.5 select-none pointer-events-none" aria-hidden>
          <span className="font-montserrat text-sm font-semibold text-white/70 tracking-wide">
            Go Live, Lead &amp; Love Today!™
          </span>
          <ChevronsDown className="h-5 w-5 text-white/50 animate-bounce" strokeWidth={2} />
        </div>
      </div>
    </header>
  )
}

// ─── Conditional DMW Reminder ─────────────────────────────���──��────────────────

function DmwReminder() {
  const timeFreedom = isTimeFreedomDay()
  const isMonday = new Date().getDay() === 1

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-[#E26C73]/25 bg-[#FDF6F6] shadow-sm">
      <div aria-hidden className="h-[3px] bg-[#E26C73]" />
      <div className="px-6 py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 overflow-hidden rounded-full border border-[#E26C73]/30 shrink-0">
            <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#E26C73]">
              Cherry Blossom™
            </p>
            <p className="font-montserrat text-[11px] text-[#6B5860]/70">Your Harmony Lane™ Operating Guide</p>
          </div>
        </div>

        {timeFreedom ? (
          <>
            <p className="font-playfair text-xl font-medium text-[#1A1A1A] leading-snug text-balance">
              Time Freedom™ is active. Your business is resting.
            </p>
            <p className="mt-2 font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
              Use this weekend to design your upcoming <strong>Work-Life Balance Business Week™</strong>.
              Design My Week™ closes at <strong>11:00 PM Sunday</strong>.
            </p>
          </>
        ) : (
          <>
            <p className="font-playfair text-xl font-medium text-[#1A1A1A] leading-snug text-balance">
              Your next Work-Life Balance Business Week™ has not been designed yet.
            </p>
            <p className="mt-2 font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
              {isMonday
                ? "Design My Week™ closes at 9:00 AM. Make your final adjustments before your CEO Workday™ begins."
                : "Before your next CEO Workday™ begins, design your Daily Non-Negotiables™ and Business Operating Rules™ for the week ahead."}
            </p>
          </>
        )}

        <Link
          href="/design-my-week"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5B835F] px-5 py-3 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#4c6f50]"
        >
          Design My Week™
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  )
}

// ─── No week / outside reminder window ───────────────────────────────────────

function NoWeekState() {
  return (
    <div className="mt-8 rounded-2xl border border-[#5B835F]/20 bg-white/70 px-6 py-8 text-center shadow-sm">
      <Flower2 className="mx-auto h-8 w-8 text-[#5B835F]/40 mb-3" aria-hidden />
      <p className="font-playfair text-xl font-medium italic text-[#3A2E33] text-balance">
        Design your week. Then live it.
      </p>
      <p className="mx-auto mt-2 max-w-md font-montserrat text-sm leading-relaxed text-[#6B5860]">
        Design your Daily Non-Negotiables™ and Business Operating Rules™ during Time Freedom™ weekend,
        and they will guide every Operating Segment™ of your week.
      </p>
      <Link
        href="/design-my-week"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5B835F] px-5 py-3 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#4c6f50]"
      >
        Design My Week™
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  )
}

// ─── SegmentCard (Sustainable Operating Practices™ segments only) ────────────

/** Maps SDD segment ids to GPS SegmentId values (Phase 8.1). */
function toGpsSegmentId(id: string): SegmentId | null {
  const map: Record<string, SegmentId> = {
    "early-entry": "early-entry",
    "morning-given": "morning-given",
    "workout": "workout",
    "healthy-lunch": "healthy-lunch",
    "ceo-workday": "ceo-workday",
    "time-freedom": "time-freedom",
    "power-down": "power-down",
  }
  return map[id] ?? null
}

function SegmentCard({ segment, isCurrent }: { segment: HarmonySegment; isCurrent: boolean }) {
  const ctx = useHarmonyContext()
  const [expanded, setExpanded] = useState(isCurrent)
  const [response, setResponse] = useState<HonorResponse | null>(null)
  const [showLearnMore, setShowLearnMore] = useState(false)

  useEffect(() => {
    if (isCurrent) setExpanded(true)
  }, [isCurrent])

  useEffect(() => {
    setResponse(getTodayResponses()[segment.id] ?? null)
  }, [segment.id])

  function choose(value: HonorResponse) {
    setResponse(value)
    setTodayResponse(segment.id, value)
  }

  // Derive Founder GPS™ recommendation for this segment (Phase 10.2: aggregate-enriched)
  const gpsSegmentId = toGpsSegmentId(segment.id)
  const gpsProgress = deriveProgressSummary()
  const gpsAggregate = assembleHarmonyContext(ctx)
  const gpsCard = gpsSegmentId
    ? deriveGpsRecommendation(gpsSegmentId, ctx, gpsProgress, gpsAggregate)
    : null

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-sm shadow-sm transition-shadow ${
        isCurrent
          ? "border-[#5B835F]/40 shadow-md ring-1 ring-[#5B835F]/20"
          : "border-black/[0.06]"
      }`}
    >
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          {isCurrent && (
            <span className="shrink-0 rounded-full bg-[#5B835F] px-2.5 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              Now
            </span>
          )}
          <h2 className="font-montserrat text-base font-bold text-[#3A2E33] truncate">{segment.title}</h2>
        </div>
        <ChevronDown
          className={`shrink-0 h-4 w-4 text-[#6B5860] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {/* Expanded workspace */}
      {expanded && (
        <div className="border-t border-black/[0.05] px-6 pb-6 space-y-5">

          {/* Founder GPS™ Recommendation — Phase 8.1 */}
          {gpsCard && (
            <div className="mt-5">
              <GpsRecommendationCard card={gpsCard} />
            </div>
          )}

          {/* Cherry Blossom™ — Intention Declaration™ (Practice™) */}
          {segment.declaration && (
            <div className="rounded-xl border border-[#5B835F]/25 bg-[#5B835F]/[0.05] px-5 py-4">
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#5B835F]">
                Your Intention Declaration™
              </p>
              <p className="mt-2 font-montserrat text-[15px] font-medium italic leading-relaxed text-[#3A2E33] text-pretty">
                &ldquo;{segment.declaration}&rdquo;
              </p>
              {isCurrent && (
                <p className="mt-2 font-montserrat text-[11px] leading-relaxed text-[#6B5860]/70">
                  This is the operating standard you committed to. It defines how you show up during this segment today.
                </p>
              )}
            </div>
          )}

          {/* Daily Non-Negotiable™ */}
          <div className="rounded-xl border border-[#C13B6B]/20 bg-[#C13B6B]/[0.04] px-4 py-3">
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#C13B6B]">
              My Daily Non-Negotiable™
            </p>
            <p className="mt-1 font-montserrat text-[14px] leading-relaxed text-[#3A2E33]">
              {segment.nonNegotiable}
            </p>
          </div>

          {/* Learn More About This Segment™ */}
          <div className="overflow-hidden rounded-xl border border-black/[0.06]">
            <button
              type="button"
              onClick={() => setShowLearnMore((v) => !v)}
              className="flex w-full items-center justify-between bg-white/40 px-4 py-3 text-left transition-colors hover:bg-white/60"
              aria-expanded={showLearnMore}
            >
              <p className="font-montserrat text-xs font-semibold text-[#6B5860]">
                Learn More About This Segment™
              </p>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#6B5860]/60 transition-transform duration-200 ${showLearnMore ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {showLearnMore && (
              <div className="bg-white/20 px-4 py-4 font-montserrat text-[12px] leading-relaxed text-[#6B5860]">
                <p>
                  Open{" "}
                  <Link
                    href="/design-my-week"
                    className="font-semibold text-[#5B835F] underline underline-offset-2"
                  >
                    Design My Week™
                  </Link>{" "}
                  to review the full purpose, scientific foundation, business value, and Cherry Blossom™ tips for this segment.
                </p>
              </div>
            )}
          </div>

          {/* Reflection — Follow-Through™ */}
          <div className="border-t border-black/[0.06] pt-4">
            <p className="font-montserrat text-sm font-semibold text-[#3A2E33]">
              Did you keep this commitment today?
            </p>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="group"
              aria-label={`Follow-through check for ${segment.title}`}
            >
              {HONOR_OPTIONS.map((opt) => {
                const selected = response === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => choose(opt.value)}
                    className={`rounded-full px-4 py-1.5 font-montserrat text-sm font-medium transition-colors ${
                      selected ? toneSelected(opt.tone) : "bg-white/70 text-[#6B5860] ring-1 ring-black/[0.06] hover:bg-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {response && (
              <p className="mt-3 font-montserrat text-[12px] leading-relaxed text-[#6B5860]/80 text-pretty">
                {response === "yes"
                  ? "Cherry Blossom\u2122 has recorded this. Consistent honoring of this commitment builds it into your operating default."
                  : response === "partial"
                  ? "Cherry Blossom\u2122 has recorded this. Partial honoring is still practice. Each repetition strengthens the pattern."
                  : "Cherry Blossom\u2122 has recorded this without judgment. The purpose is learning, not perfection. Tomorrow is another opportunity to practice."}
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toneSelected(tone: "green" | "amber" | "rose"): string {
  switch (tone) {
    case "green": return "bg-[#5B835F] text-white"
    case "amber": return "bg-amber-500 text-white"
    case "rose":  return "bg-[#C13B6B] text-white"
  }
}
