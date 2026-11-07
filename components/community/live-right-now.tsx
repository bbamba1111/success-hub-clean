"use client"

/**
 * LiveRightNow — shows live sessions derived from EVENTS_CATALOG.
 * Co-Working is live Mon–Thu 1–5 PM ET; Monday Sync Mon 7–9 AM ET.
 * Everything else shows as "Upcoming".
 */

import Link from "next/link"
import { Radio, ArrowUpRight, Users } from "lucide-react"
import { EVENTS_CATALOG } from "@/lib/events/events-data"

const ET_OFFSET_HOURS = -5 // EST; simplified (no DST)

function getETHour(): { day: number; hour: number; minute: number } {
  const now = new Date()
  // Approximate ET by converting UTC
  const etMs = now.getTime() + ET_OFFSET_HOURS * 60 * 60 * 1000
  const et = new Date(etMs)
  return { day: et.getUTCDay(), hour: et.getUTCHours(), minute: et.getUTCMinutes() }
}

function isEventLiveNow(eventId: string): boolean {
  const { day, hour, minute } = getETHour()
  const totalMin = hour * 60 + minute

  if (eventId === "live-co-working") {
    // Mon–Thu (1–4), 13:00–17:00 ET
    return day >= 1 && day <= 4 && totalMin >= 780 && totalMin < 1020
  }
  if (eventId === "monday-sync") {
    // Monday (1), 07:00–09:00 ET
    return day === 1 && totalMin >= 420 && totalMin < 540
  }
  return false
}

export function LiveRightNow() {
  const liveEvents = EVENTS_CATALOG.filter((e) => isEventLiveNow(e.id))
  const upcomingEvents = EVENTS_CATALOG.filter((e) => !isEventLiveNow(e.id)).slice(0, 3)

  if (liveEvents.length === 0 && upcomingEvents.length === 0) return null

  return (
    <section aria-labelledby="live-heading">
      <div className="mb-4 flex items-center gap-2">
        <Radio className="h-4 w-4 text-[#E26C73]" aria-hidden="true" />
        <h2
          id="live-heading"
          className="font-playfair text-xl font-bold text-[#1C2B2B]"
        >
          {liveEvents.length > 0 ? "Live Right Now" : "Coming Up Next"}
        </h2>
        {liveEvents.length > 0 && (
          <span className="animate-pulse rounded-full bg-[#E26C73] px-2 py-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-wider text-white">
            Live
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(liveEvents.length > 0 ? liveEvents : upcomingEvents).map((event) => {
          const isLive = isEventLiveNow(event.id)
          return (
            <article
              key={event.id}
              className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5"
              style={{ borderLeft: `4px solid ${event.accentColor}` }}
            >
              {isLive && (
                <span
                  className="mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-montserrat text-[10px] font-semibold uppercase tracking-wider text-white"
                  style={{ backgroundColor: event.accentColor }}
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
                  Live Now
                </span>
              )}

              <h3 className="font-playfair text-sm font-semibold text-[#1C2B2B]">
                {event.title}
              </h3>
              <p className="mt-1 font-montserrat text-[12px] text-gray-500">
                {event.schedule.timeRange} &middot; {event.schedule.days}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <Link
                  href={event.joinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-montserrat text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: event.accentColor }}
                >
                  {isLive ? "Join Live" : "Register"}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
                <span className="flex items-center gap-1 font-montserrat text-[11px] text-gray-400">
                  <Users className="h-3 w-3" />
                  Open
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
