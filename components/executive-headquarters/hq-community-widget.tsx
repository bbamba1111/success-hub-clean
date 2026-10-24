"use client"

/**
 * HQCommunityWidget — Phase 16.1
 * ---------------------------------------------------------------------------
 * Compact Executive Headquarters™ widget showing:
 *   • Upcoming live session (from EVENTS_CATALOG)
 *   • Active challenge progress
 *   • Quick Join button → /community
 */

import Link from "next/link"
import { Radio, Zap, ArrowRight, Users } from "lucide-react"
import { EVENTS_CATALOG } from "@/lib/events/events-data"
import { STATIC_CHALLENGES } from "@/lib/community/community-data"

interface HQCommunityWidgetProps {
  accentColor: string
}

export function HQCommunityWidget({ accentColor }: HQCommunityWidgetProps) {
  // Always show the first Live Co-Working event as the "upcoming" session
  const liveSession = EVENTS_CATALOG.find((e) => e.category === "live-co-working")
  const topChallenge = STATIC_CHALLENGES[0]

  return (
    <section aria-labelledby="hq-community-heading">
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between">
        <h2
          id="hq-community-heading"
          className="font-playfair text-base font-semibold text-[#1C2B2B]"
        >
          Community™
        </h2>
        <Link
          href="/community"
          className="flex items-center gap-1 font-montserrat text-xs font-semibold uppercase tracking-wider"
          style={{ color: accentColor }}
        >
          Open Community
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

        {/* Upcoming Live Session */}
        {liveSession && (
          <article
            className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4"
            style={{ borderLeft: `4px solid ${liveSession.accentColor}` }}
          >
            <span
              className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${liveSession.accentColor}18` }}
            >
              <Radio className="h-4 w-4" style={{ color: liveSession.accentColor }} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-montserrat text-xs font-semibold uppercase tracking-wider text-gray-400">
                Live Session
              </p>
              <p className="mt-0.5 font-playfair text-sm font-semibold text-[#1C2B2B]">
                {liveSession.title}
              </p>
              <p className="mt-0.5 font-montserrat text-[12px] text-gray-500">
                {liveSession.schedule.nextSessionLabel}
              </p>
              <Link
                href={liveSession.joinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-montserrat text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: liveSession.accentColor }}
              >
                Join Live
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </article>
        )}

        {/* Active Challenge */}
        {topChallenge && (
          <article
            className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4"
            style={{ borderLeft: `4px solid ${topChallenge.accentColor}` }}
          >
            <span
              className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${topChallenge.accentColor}18` }}
            >
              <Zap className="h-4 w-4" style={{ color: topChallenge.accentColor }} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-montserrat text-xs font-semibold uppercase tracking-wider text-gray-400">
                Active Challenge
              </p>
              <p className="mt-0.5 font-playfair text-sm font-semibold leading-snug text-[#1C2B2B]">
                {topChallenge.title}
              </p>

              {/* Mini progress bar */}
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-[11px]" style={{ color: topChallenge.accentColor }}>
                    {topChallenge.progress}%
                  </span>
                  <span className="flex items-center gap-1 font-montserrat text-[11px] text-gray-400">
                    <Users className="h-3 w-3" />
                    {topChallenge.participants}
                  </span>
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${topChallenge.progress}%`,
                      backgroundColor: topChallenge.accentColor,
                    }}
                  />
                </div>
              </div>

              <Link
                href="/community"
                className="mt-2 inline-flex items-center gap-1 font-montserrat text-xs font-semibold"
                style={{ color: topChallenge.accentColor }}
              >
                View Challenge
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </article>
        )}

      </div>
    </section>
  )
}
