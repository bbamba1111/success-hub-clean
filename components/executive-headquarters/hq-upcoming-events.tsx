"use client"

/**
 * HQUpcomingEvents — Phase 15.2
 * A compact horizontal strip showing the next 3 community experiences.
 * Reuses EVENTS_CATALOG data directly — no extra fetch.
 */

import Link from "next/link"
import { ArrowRight, Clock, Users } from "lucide-react"
import { EVENTS_CATALOG } from "@/lib/events/events-data"

const FEATURED_IDS = ["live-co-working", "monday-sync", "office-hours"]

export function HQUpcomingEvents() {
  const events = FEATURED_IDS
    .map((id) => EVENTS_CATALOG.find((e) => e.id === id))
    .filter(Boolean) as typeof EVENTS_CATALOG

  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-montserrat text-sm font-bold uppercase tracking-[0.14em] text-[#1C161A]">
          Upcoming Live Experiences™
        </h2>
        <Link
          href="/events"
          className="inline-flex items-center gap-1 font-montserrat text-xs font-semibold text-[#5D9D61] transition-colors hover:opacity-80"
        >
          Full calendar
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>

      {/* Event strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex flex-col gap-3 rounded-xl border border-black/[0.07] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            style={{ borderLeft: `3px solid ${event.accentColor}` }}
          >
            {/* Title + category */}
            <div className="flex flex-col gap-1">
              <span
                className="font-montserrat text-[10px] font-bold uppercase tracking-wider"
                style={{ color: event.accentColor }}
              >
                {event.category.replace(/-/g, " ")}
              </span>
              <p className="font-montserrat text-sm font-semibold leading-snug text-[#1C161A]">
                {event.title}
              </p>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 font-montserrat text-[10px] text-[#9CA3AF]">
                <Clock className="h-3 w-3" aria-hidden />
                {event.schedule.timeRange}
              </span>
              <span className="inline-flex items-center gap-1 font-montserrat text-[10px] text-[#9CA3AF]">
                <Users className="h-3 w-3" aria-hidden />
                {event.seats}
              </span>
            </div>

            {/* Join CTA */}
            <a
              href={event.joinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-1 self-start font-montserrat text-xs font-semibold transition-colors hover:opacity-80"
              style={{ color: event.accentColor }}
            >
              Join
              <ArrowRight className="h-3 w-3" aria-hidden />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
