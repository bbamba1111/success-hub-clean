"use client"

import { useEffect, useState } from "react"
import { CalendarHeart } from "lucide-react"

interface LifeEvent {
  label: string
  detail: string
  days: number
}

interface UpcomingLifeEventsProps {
  /** Called with a ready-made planning prompt when a member taps "Plan this with Cherry Blossom." */
  onPlan: (prompt: string) => void
}

function whenLabel(days: number): string {
  if (days === 0) return "today"
  if (days === 1) return "tomorrow"
  return `in ${days} days`
}

/**
 * Life Events™ — a small read-only card listing upcoming dates (Memory
 * Vault™ important dates + seasonal holidays) within the next 30 days. Each
 * row can hand off straight into the adjacent Cherry Blossom chat.
 */
export function UpcomingLifeEvents({ onPlan }: UpcomingLifeEventsProps) {
  const [events, setEvents] = useState<LifeEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch("/api/cherry-blossom/upcoming-events")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setEvents(Array.isArray(data.events) ? data.events : [])
      })
      .catch(() => {
        if (!cancelled) setEvents([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="rounded-2xl border border-[#E26C73]/20 bg-[#FDF8F5] px-5 py-4 space-y-3">
      <div className="flex items-center gap-2">
        <CalendarHeart className="h-3.5 w-3.5 text-[#C0545A]" aria-hidden />
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
          Life Events™ — Coming Up
        </p>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-[#6B5860]">Checking your Memory Vault™…</p>
      ) : events.length === 0 ? (
        <p className="font-sans text-sm text-[#6B5860]">
          Nothing on the calendar in the next 30 days — Cherry Blossom will surface dates here as they get close.
        </p>
      ) : (
        <ul className="space-y-2">
          {events.map((event, index) => (
            <li
              key={`${event.label}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#E26C73]/15 bg-white px-4 py-2.5"
            >
              <div className="min-w-0">
                <p className="font-sans text-sm font-semibold text-[#2E1F27] truncate">{event.detail}</p>
                <p className="font-sans text-xs text-[#6B5860]">{whenLabel(event.days)}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onPlan(
                    `I'd love some help planning something special for ${event.detail}, which is ${whenLabel(event.days)}.`,
                  )
                }
                className="shrink-0 rounded-full border border-[#E26C73]/30 bg-[#FDF8F5] px-3 py-1.5 font-sans text-xs font-semibold text-[#C0545A] transition-colors hover:bg-[#E26C73]/10"
              >
                Plan with Cherry Blossom
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UpcomingLifeEvents
