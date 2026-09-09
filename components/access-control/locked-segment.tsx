"use client"

/**
 * LockedSegment — what a member sees inside a segment's space *before* its
 * time has arrived. The interactive workspace (Reflection Space™, Debrief
 * Space™, Operating Planner™, Join Us Live™, music) is withheld, but the
 * segment's own "About This Segment™" content stays fully readable so the
 * member can prepare for what's coming. A calm countdown shows exactly when
 * the space unlocks.
 *
 * This is the visible half of Segment Access Control™ (see
 * `lib/access-control/segment-access.ts`). Admins and any active manual
 * unlock never reach this view — they get the live workspace.
 */

import type { ReactNode } from "react"
import { Lock } from "lucide-react"
import type { SegmentAccess } from "@/lib/access-control/segment-access"

function formatCountdown(minutes: number): string {
  if (minutes <= 0) return "any moment now"
  if (minutes < 60) return `in ${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `in ${h} hr`
  return `in ${h} hr ${m} min`
}

export function LockedSegment({
  access,
  aboutContent,
  isEvening = false,
}: {
  access: SegmentAccess
  /** The segment's "About This Segment™" content, always shown while locked. */
  aboutContent?: ReactNode
  /** Power Down™'s dusk panel needs light-on-dark text. */
  isEvening?: boolean
}) {
  const notToday = access.reason === "not-today"
  const closedForDay = access.reason === "closed-for-day"

  const eyebrow = closedForDay ? "Complete For Today" : notToday ? "Not Available Today" : "Opens Soon"

  const headline = closedForDay
    ? "This space is complete for today"
    : notToday
      ? "This space opens on its scheduled day"
      : `This space unlocks at ${access.unlockAtLabel ?? "its scheduled time"}`

  const subline = closedForDay
    ? "Your work window has closed at 5:00 PM. Step fully into the rest of your day — this space returns tomorrow."
    : notToday
      ? "It isn't part of today's Work-Life Balance Business Day™ — it'll be here when its day comes around."
      : `Honoring the rhythm of the day keeps you present. You'll be able to enter ${formatCountdown(
          access.minutesUntilUnlock,
        )}.`

  return (
    <div className="px-7 py-8 space-y-6">
      {/* Lock notice + countdown */}
      <div
        className={`flex items-start gap-3 rounded-2xl border px-5 py-4 ${
          isEvening ? "border-white/15 bg-white/5" : "border-[#C13B6B]/20 bg-[#C13B6B]/[0.04]"
        }`}
      >
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isEvening ? "bg-white/10 text-white/80" : "bg-[#C13B6B]/10 text-[#C13B6B]"
          }`}
        >
          <Lock className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p
            className={`font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] ${
              isEvening ? "text-white/60" : "text-[#C13B6B]"
            }`}
          >
            {eyebrow}
          </p>
          <p
            className={`mt-1 font-playfair text-lg font-medium leading-snug text-balance ${
              isEvening ? "text-white" : "text-[#3A2E33]"
            }`}
          >
            {headline}
          </p>
          <p className={`mt-1 text-sm leading-relaxed text-pretty ${isEvening ? "text-white/70" : "text-[#5C4F55]"}`}>
            {subline}
          </p>
          {!notToday && !closedForDay && access.unlockAtLabel && (
            <p
              className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-sans text-xs font-bold tabular-nums ${
                isEvening ? "bg-white/10 text-white" : "bg-[#7FB069]/15 text-[#5A7A45]"
              }`}
            >
              Unlocks {formatCountdown(access.minutesUntilUnlock)} · {access.unlockAtLabel}
            </p>
          )}
        </div>
      </div>

      {/* About This Segment™ — always readable while locked. Framed as the
          segment's Work-Life Balance Time & Space Boundary™ (spec §17). */}
      {aboutContent && (
        <div className="space-y-4">
          <p
            className={`font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] ${
              isEvening ? "text-white/60" : "text-[#6B5860]/60"
            }`}
          >
            Work-Life Balance Time &amp; Space Boundary™
          </p>
          <div className={isEvening ? "text-white/80" : ""}>{aboutContent}</div>
        </div>
      )}
    </div>
  )
}
