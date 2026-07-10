"use client"

/**
 * Today's Operating System™ (Phase 4B.1.5).
 *
 * Surfaces the week the member designed on Sunday inside Live Today™. For each
 * operating segment it shows Today's Operating Rule™ (the strategic standard)
 * and Today's Non-Negotiable™ (the commitment lived today), plus a lightweight
 * end-of-segment accountability check.
 *
 * SESSION-ONLY this pass: reads the installed week and writes honor responses to
 * sessionStorage. No scoring, coaching, journaling, streaks, or DB persistence —
 * those belong to Phase 4B.2.
 */

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Sparkles, ArrowRight } from "lucide-react"
import { DESIGN_SEGMENTS } from "@/components/sunday-design-day/sdd-config"
import { getInstalledWeek, type InstalledWeek } from "@/lib/sunday-design-day/installed-week"
import {
  HONOR_OPTIONS,
  getTodayResponses,
  setTodayResponse,
  type HonorResponse,
} from "@/lib/sunday-design-day/non-negotiable-log"

/** Cherry Blossom™ time-of-day greeting. */
function greetingFor(date: Date): string {
  const h = date.getHours()
  if (h < 12) return "Good Morning"
  if (h < 17) return "Good Afternoon"
  if (h < 21) return "Good Evening"
  return "Good Night"
}

interface SurfacedSegment {
  id: string
  title: string
  rule: string
  nonNegotiable: string
}

export function TodaysOperatingSystem() {
  // Session/browser-only data: read after mount to keep SSR markup stable.
  const [installed, setInstalled] = useState<InstalledWeek | null>(null)
  const [greeting, setGreeting] = useState("Welcome")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setInstalled(getInstalledWeek())
    setGreeting(greetingFor(new Date()))
    setReady(true)
  }, [])

  // Order segments by the canonical lived sequence, keep only those with a rule,
  // and fall back to the suggested Non-Negotiable™ when the member left it blank.
  const segments = useMemo<SurfacedSegment[]>(() => {
    if (!installed) return []
    const byId = new Map(installed.segments.map((s) => [s.id, s]))
    return DESIGN_SEGMENTS.flatMap((cfg) => {
      const s = byId.get(cfg.id)
      if (!s || !s.rule) return []
      return [
        {
          id: cfg.id,
          title: cfg.title,
          rule: s.rule,
          nonNegotiable: s.nonNegotiable || cfg.defaultNonNegotiable,
        },
      ]
    })
  }, [installed])

  if (!ready) return null

  return (
    <section
      aria-labelledby="todays-os-heading"
      className="w-full bg-gradient-to-br from-[#F5F1E8] to-white px-4 pt-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 font-montserrat text-xs font-medium uppercase tracking-[0.18em] text-[#5B835F]">
            <Sparkles className="h-4 w-4" aria-hidden />
            Cherry Blossom™
          </p>
          <h2
            id="todays-os-heading"
            className="mt-2 text-pretty font-playfair text-3xl font-medium text-[#3A2E33] sm:text-4xl"
          >
            {greeting}.
          </h2>
          <p className="mt-2 text-pretty font-montserrat text-sm leading-relaxed text-[#6B5860]">
            {installed
              ? "Here is the Operating System™ you designed on Sunday. Live it one segment at a time."
              : "Your week hasn't been designed yet."}
          </p>
        </div>

        {installed ? (
          <div className="mt-8 space-y-4">
            {segments.map((seg) => (
              <SegmentCard key={seg.id} segment={seg} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  )
}

function EmptyState() {
  return (
    <div className="glass-panel mt-8 rounded-2xl px-6 py-8 text-center">
      <p className="text-pretty font-playfair text-xl font-medium italic text-[#3A2E33]">
        Design tomorrow, then live it tomorrow.
      </p>
      <p className="mx-auto mt-2 max-w-md font-montserrat text-sm leading-relaxed text-[#6B5860]">
        Complete Sunday Design Day™ to install your Operating Rules™ and Daily Non-Negotiables™. They&apos;ll appear
        here to guide each segment of your day.
      </p>
      <Link
        href="/sunday-design-day"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#5B835F] px-5 py-2.5 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#4c6f50]"
      >
        Begin Sunday Design Day™
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  )
}

function SegmentCard({ segment }: { segment: SurfacedSegment }) {
  const [response, setResponse] = useState<HonorResponse | null>(null)

  useEffect(() => {
    setResponse(getTodayResponses()[segment.id] ?? null)
  }, [segment.id])

  function choose(value: HonorResponse) {
    setResponse(value)
    setTodayResponse(segment.id, value)
  }

  return (
    <article className="glass-panel rounded-2xl px-6 py-5">
      <h3 className="font-playfair text-xl font-medium text-[#5B835F]">{segment.title}</h3>

      <div className="mt-4 space-y-4">
        <div>
          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860]">
            Today&apos;s Operating Rule™
          </p>
          <p className="mt-1 font-montserrat text-[15px] leading-relaxed text-[#3A2E33]">{segment.rule}</p>
        </div>

        <div className="rounded-xl border border-[#C13B6B]/15 bg-[#C13B6B]/[0.04] px-4 py-3">
          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#C13B6B]">
            Today&apos;s Non-Negotiable™
          </p>
          <p className="mt-1 font-montserrat text-[15px] leading-relaxed text-[#3A2E33]">{segment.nonNegotiable}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-black/[0.06] pt-4">
        <p className="font-montserrat text-sm font-medium text-[#3A2E33]">Did you honor today&apos;s Non-Negotiable™?</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`Honor check for ${segment.title}`}>
          {HONOR_OPTIONS.map((opt) => {
            const selected = response === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={selected}
                onClick={() => choose(opt.value)}
                className={`rounded-full px-4 py-1.5 font-montserrat text-sm font-medium transition-colors ${
                  selected ? toneSelected(opt.tone) : "bg-white/70 text-[#6B5860] hover:bg-white"
                } ${selected ? "" : "ring-1 ring-black/[0.06]"}`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    </article>
  )
}

function toneSelected(tone: "green" | "amber" | "rose"): string {
  switch (tone) {
    case "green":
      return "bg-[#5B835F] text-white"
    case "amber":
      return "bg-[#C9A24B] text-white"
    case "rose":
      return "bg-[#C13B6B] text-white"
  }
}
