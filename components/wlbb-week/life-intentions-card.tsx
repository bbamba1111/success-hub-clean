"use client"

/**
 * 🌸 Your WLBB Life Intentions — read-only hand-off from the Monday
 * Debrief™ into the Time Freedom™ segment. "This is what you chose to
 * make time for this week." No auto-scheduling — just a reminder.
 */

import { useEffect, useState } from "react"
import { getWeekKey, loadWeek } from "@/lib/wlbb-week/storage"
import type { LifeIntention } from "@/lib/wlbb-week/types"

export function LifeIntentionsCard() {
  const [intentions, setIntentions] = useState<LifeIntention[] | null>(null)

  useEffect(() => {
    setIntentions(loadWeek(getWeekKey()).life.intentions)
  }, [])

  if (!intentions || intentions.length === 0) return null

  const scheduled = intentions.filter((i) => i.day || i.time)
  const open = intentions.filter((i) => !i.day && !i.time)

  return (
    <div className="mb-6 rounded-2xl border border-brand-blush bg-brand-cream/50 px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base select-none" role="img" aria-label="Cherry blossom">
          🌸
        </span>
        <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-brand-ink">
          Your WLBB Life Intentions
        </p>
      </div>
      <p className="mb-3 font-sans text-[13px] text-brand-ink-soft">
        This is what you chose to make time for this week.
      </p>
      <ul className="space-y-1.5">
        {scheduled.map((intention) => (
          <li key={intention.id} className="font-sans text-sm text-brand-ink">
            <span className="font-semibold">{[intention.day, intention.time].filter(Boolean).join(" ")}</span>
            {" — "}
            {intention.label}
          </li>
        ))}
        {open.map((intention) => (
          <li key={intention.id} className="font-sans text-sm text-brand-ink-soft">
            {intention.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
