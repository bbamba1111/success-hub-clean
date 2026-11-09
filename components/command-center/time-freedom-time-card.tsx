"use client"

/**
 * Time Freedom Time™ — the signature Command Center card.
 *
 * No other business platform counts down to your LIFE. On business days it
 * shows when Time Freedom™ begins and the time remaining; after 5:00 PM and on
 * the weekend it celebrates that the member is living it; on Sunday it invites
 * the ~20-minute Design Day™ ritual, then celebrates the rest of the weekend.
 */
import Link from "next/link"
import { Clock, Leaf } from "lucide-react"
import type { TimeFreedomTimeState } from "@/lib/founder-intelligence/types"

export function TimeFreedomTimeCard({ state }: { state: TimeFreedomTimeState }) {
  const counting = state.phase === "before"

  return (
    <section
      aria-label="Time Freedom Time"
      className="relative overflow-hidden rounded-3xl border border-[#8AC28E]/30 bg-gradient-to-br from-[#5D9D61]/12 via-[#F4EFE7] to-white p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 text-[#5D9D61]">
        <Leaf className="h-5 w-5" aria-hidden="true" />
        <span className="text-sm font-medium uppercase tracking-wide">Time Freedom Time™</span>
      </div>

      <h2 className="mt-3 font-playfair text-2xl italic text-[#3A2E33] sm:text-3xl text-balance">
        {state.emoji} {state.headline}
      </h2>

      {(state.beginsAtLabel || state.remainingLabel) && (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          {state.beginsAtLabel && (
            <span className="flex items-center gap-1.5 text-3xl font-semibold text-[#5D9D61] sm:text-4xl">
              <Clock className="h-6 w-6" aria-hidden="true" />
              {state.beginsAtLabel}
            </span>
          )}
          {state.remainingLabel && (
            <span className="text-lg font-medium text-[#3A2E33]/80">{state.remainingLabel}</span>
          )}
        </div>
      )}

      <p className="mt-3 max-w-xl leading-relaxed text-[#5C4F55] text-pretty">{state.subline}</p>

      {state.plannedActivities.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-[#3A2E33]">
            {counting ? "Tonight you've planned" : "Cherry Blossom remembers you enjoy"}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {state.plannedActivities.map((activity) => (
              <li
                key={activity}
                className="rounded-full border border-[#8AC28E]/40 bg-white/70 px-3 py-1 text-sm text-[#3A2E33]"
              >
                {activity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.plannedActivities.length === 0 && state.suggestions.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-[#3A2E33]">A few ways to spend it</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {state.suggestions.map((s) => (
              <li key={s} className="rounded-full bg-white/60 px-3 py-1 text-sm text-[#5C4F55]">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href={state.cta.href}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#5D9D61] px-6 py-3 font-medium text-white transition hover:bg-[#4F8A53]"
      >
        {state.cta.label}
      </Link>
    </section>
  )
}
