"use client"

/**
 * Today's Operating System™ (Phase 4B.2).
 *
 * The intelligence surface of Live Today™. Cherry Blossom™ — the Executive
 * Operating Guide™ — reads the shared Harmony Context Engine™ to know exactly
 * where the member is inside the Operating System and reinforces what they
 * intentionally designed on Sunday. She never asks what to do today; the
 * Operating System already knows.
 *
 * Shows: a context-aware greeting, the current Operating Segment™ with Today's
 * Operating Rule™ + Non-Negotiable™, the Weekly Intention™, Priority Focus
 * Areas™, the full designed day (current segment highlighted, with a
 * lightweight honor check), and an AI Executive Leadership Team™ placeholder.
 *
 * SESSION-ONLY this pass: context and honor responses live in sessionStorage.
 * No scoring, coaching, journaling, streaks, AI chat, or DB persistence.
 */

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Compass, Users } from "lucide-react"
import { useHarmonyContext } from "@/components/harmony-context/harmony-context-provider"
import { assembleMorningExecutiveBrief } from "@/lib/cherry-blossom/executive-brief"
import type { HarmonySegment } from "@/lib/harmony-context/types"
import {
  HONOR_OPTIONS,
  getTodayResponses,
  setTodayResponse,
  type HonorResponse,
} from "@/lib/sunday-design-day/non-negotiable-log"

export function TodaysOperatingSystem() {
  const ctx = useHarmonyContext()

  // Avoid rendering context-dependent markup until the engine + session are ready.
  if (!ctx.ready) return null

  const brief = assembleMorningExecutiveBrief(ctx)

  return (
    <section
      aria-labelledby="todays-os-heading"
      className="w-full bg-white px-4 pt-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        {/* Cherry Blossom™ Executive Brief entry card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E26C73]/25 bg-[#FDF6F6] shadow-sm">
          {/* Coral left spine */}
          <div aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[#E26C73]" />

          <div className="px-7 py-6">
            {/* CB identity row */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 overflow-hidden rounded-full border border-[#E26C73]/30 shadow-sm shrink-0">
                <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-[#E26C73]">
                  Cherry Blossom™
                </p>
                <p className="font-montserrat text-[11px] text-[#6B5860]/70">
                  Chief of Staff &amp; Executive Conductor™
                </p>
              </div>
            </div>

            {/* Greeting + opening statement */}
            <h2
              id="todays-os-heading"
              className="mt-4 font-playfair text-2xl font-medium leading-tight text-[#1A1A1A] text-balance sm:text-3xl"
            >
              {brief.greeting}
            </h2>
            <p className="mt-2 font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
              {brief.openingStatement}
            </p>

            {/* Today's focus — the single sentence that defines the day */}
            <div className="mt-5 rounded-xl border border-[#5B835F]/20 bg-white/70 px-5 py-4">
              <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#5B835F]">
                Today&apos;s Executive Focus™
              </p>
              <p className="mt-1 font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
                {brief.executiveFocus.statement}
              </p>
            </div>

            {/* Highest leverage outcome + assigned executive — two-col */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-black/[0.06] bg-white/70 px-4 py-4">
                <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860]">
                  Highest-Leverage Outcome™
                </p>
                <p className="mt-1 font-montserrat text-[13px] font-medium leading-snug text-[#1A1A1A]">
                  {brief.highestLeverageOutcome.title}
                </p>
              </div>
              {brief.assignedExecutive && (
                <div className="rounded-xl border border-black/[0.06] bg-white/70 px-4 py-4">
                  <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860]">
                    Today&apos;s Executive™
                  </p>
                  <p className="mt-1 font-montserrat text-[13px] font-medium leading-snug text-[#1A1A1A]">
                    {brief.assignedExecutive.name}
                  </p>
                  <p className="font-montserrat text-[11px] text-[#E26C73]">
                    {brief.assignedExecutive.title}
                  </p>
                </div>
              )}
            </div>

            {/* CTA — full brief */}
            <div className="mt-5">
              <Link
                href="/cherry-blossom"
                className="inline-flex items-center gap-2 font-montserrat text-sm font-semibold text-[#E26C73] transition-colors hover:text-[#C13B6B]"
              >
                Read your full Executive Brief™
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        {ctx.hasDesignedWeek ? (
          <>
            <RightNowPanel ctx={ctx} />

            <div className="mt-8">
              <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860]">
                Today&apos;s Operating System™
              </p>
              <div className="mt-4 space-y-4">
                {ctx.segments.map((seg) => (
                  <SegmentCard
                    key={seg.id}
                    segment={seg}
                    isCurrent={ctx.currentSegment?.id === seg.id}
                  />
                ))}
              </div>
            </div>

            <AiExecutiveTeamPanel />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  )
}

/** "Today, Right Now" — the single glance that reflects Sunday's design. */
function RightNowPanel({ ctx }: { ctx: ReturnType<typeof useHarmonyContext> }) {
  const seg = ctx.currentSegment
  return (
    <div className="mt-8 rounded-2xl border border-[#5B835F]/20 bg-white/70 px-6 py-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Compass className="h-4 w-4 text-[#5B835F]" aria-hidden />
        <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#5B835F]">
          Current Operating Segment™
        </p>
      </div>
      <p className="mt-1.5 font-playfair text-2xl font-medium text-[#3A2E33]">
        {seg ? seg.title : ctx.currentBlockTitle || "Resting"}
      </p>

      {seg ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Today's Operating Rule™" tone="ink">
            {seg.rule}
          </Field>
          <Field label="Today's Non-Negotiable™" tone="rose">
            {seg.nonNegotiable}
          </Field>
        </div>
      ) : (
        <p className="mt-3 font-montserrat text-[15px] leading-relaxed text-[#6B5860]">
          You&apos;re between designed segments right now. Rest easy — tomorrow is already designed.
        </p>
      )}

      <div className="mt-5 border-t border-black/[0.06] pt-5">
        {ctx.weeklyIntention && (
          <Field label="Weekly Intention™" tone="ink">
            {ctx.weeklyIntention}
          </Field>
        )}
        {ctx.focusAreas.length > 0 && (
          <div className="mt-4">
            <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860]">
              Priority Focus Areas™
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ctx.focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-[#5B835F]/10 px-3 py-1 font-montserrat text-sm font-medium text-[#4c6f50]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  tone,
  children,
}: {
  label: string
  tone: "ink" | "rose"
  children: React.ReactNode
}) {
  return (
    <div>
      <p
        className={`font-montserrat text-xs font-semibold uppercase tracking-[0.14em] ${
          tone === "rose" ? "text-[#C13B6B]" : "text-[#6B5860]"
        }`}
      >
        {label}
      </p>
      <p className="mt-1 font-montserrat text-[15px] leading-relaxed text-[#3A2E33]">{children}</p>
    </div>
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

function SegmentCard({ segment, isCurrent }: { segment: HarmonySegment; isCurrent: boolean }) {
  const [response, setResponse] = useState<HonorResponse | null>(null)

  useEffect(() => {
    setResponse(getTodayResponses()[segment.id] ?? null)
  }, [segment.id])

  function choose(value: HonorResponse) {
    setResponse(value)
    setTodayResponse(segment.id, value)
  }

  return (
    <article
      className={`glass-panel rounded-2xl px-6 py-5 ${
        isCurrent ? "ring-2 ring-[#5B835F]/50" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-playfair text-xl font-medium text-[#5B835F]">{segment.title}</h3>
        {isCurrent && (
          <span className="shrink-0 rounded-full bg-[#5B835F] px-3 py-1 font-montserrat text-xs font-semibold uppercase tracking-[0.12em] text-white">
            Now
          </span>
        )}
      </div>

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

/** Executive Leadership Team™ — entry point to the boardroom (recommendation logic arrives later). */
function AiExecutiveTeamPanel() {
  return (
    <Link
      href="/executive-leadership-team"
      className="group mt-8 block rounded-2xl border border-dashed border-[#5B835F]/30 bg-white/50 px-6 py-6 text-center ds-transition hover:border-[#5B835F]/50 hover:bg-white/70"
    >
      <div className="inline-flex items-center gap-2">
        <Users className="h-4 w-4 text-[#5B835F]" aria-hidden />
        <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#5B835F]">
          Executive Leadership Team™
        </p>
      </div>
      <p className="mx-auto mt-2 max-w-lg font-montserrat text-sm leading-relaxed text-[#6B5860]">
        Based on your CEO priorities, Cherry Blossom™ will soon bring in the most relevant executive for research,
        planning, decision support, and deliverables.
      </p>
      <span className="mt-3 inline-flex items-center gap-1.5 font-montserrat text-sm font-semibold text-[#5B835F]">
        Meet your Executive Leadership Team™
        <ArrowRight className="h-4 w-4 ds-transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
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
