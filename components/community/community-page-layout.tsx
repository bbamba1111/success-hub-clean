"use client"

/**
 * CommunityPageLayout — full page orchestrator.
 *
 * Section order:
 *   Welcome Banner → Live Right Now → Highlights →
 *   Daily Accountability → Founder Wins Wall →
 *   Discussions → Challenges → Calendar → Groups
 */

import { CommunityWelcomeBanner } from "./community-welcome-banner"
import { LiveRightNow } from "./live-right-now"
import { CommunityHighlights } from "./community-highlights"
import { DailyAccountability } from "./daily-accountability"
import { FounderWinsWall } from "./founder-wins-wall"
import { CommunityDiscussions } from "./community-discussions"
import { ChallengeCard } from "./challenge-card"
import { STATIC_CHALLENGES, STATIC_GROUPS } from "@/lib/community/community-data"
import { toCalendarEntries } from "@/lib/community/community-calendar"
import Link from "next/link"
import { Calendar, Users, ArrowUpRight } from "lucide-react"

export function CommunityPageLayout() {
  const calendarEntries = toCalendarEntries()

  return (
    <main className="mx-auto w-full max-w-5xl space-y-12 px-4 py-8 sm:px-6">

      {/* Welcome */}
      <CommunityWelcomeBanner />

      {/* Live sessions */}
      <LiveRightNow />

      {/* Highlights */}
      <CommunityHighlights />

      {/* Daily Accountability */}
      <DailyAccountability />

      {/* Wins Wall */}
      <FounderWinsWall />

      {/* Discussions */}
      <CommunityDiscussions />

      {/* Challenges */}
      <section aria-labelledby="challenges-heading">
        <div className="mb-4">
          <h2
            id="challenges-heading"
            className="font-playfair text-xl font-bold text-[#1C2B2B]"
          >
            Active Challenges
          </h2>
          <p className="mt-1 font-montserrat text-[13px] text-gray-500">
            Community-wide challenges running right now.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STATIC_CHALLENGES.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </section>

      {/* Calendar */}
      <section aria-labelledby="calendar-heading">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#5D9D61]" aria-hidden="true" />
          <h2
            id="calendar-heading"
            className="font-playfair text-xl font-bold text-[#1C2B2B]"
          >
            Community Calendar
          </h2>
        </div>
        <div className="space-y-2">
          {calendarEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4"
              style={{ borderLeft: `4px solid ${entry.accentColor}` }}
            >
              <div>
                <p className="font-montserrat text-sm font-semibold text-[#1C2B2B]">
                  {entry.title}
                </p>
                <p className="mt-0.5 font-montserrat text-[12px] text-gray-400">
                  {entry.scheduleLabel}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-montserrat text-[12px] text-gray-400">
                  {entry.nextSessionLabel}
                </span>
                <Link
                  href={entry.joinHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-xl border px-3 py-1.5 font-montserrat text-xs font-semibold transition-colors"
                  style={{ borderColor: entry.accentColor, color: entry.accentColor }}
                >
                  Join
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Groups */}
      <section aria-labelledby="groups-heading">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#7C5C8A]" aria-hidden="true" />
          <h2
            id="groups-heading"
            className="font-playfair text-xl font-bold text-[#1C2B2B]"
          >
            Accountability Groups
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STATIC_GROUPS.map((group) => (
            <article
              key={group.id}
              className="rounded-2xl border border-gray-100 bg-white p-5"
              style={{ borderLeft: `4px solid ${group.accentColor}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-playfair text-sm font-semibold text-[#1C2B2B]">
                    {group.name}
                  </h3>
                  <p className="mt-1 font-montserrat text-[12px] leading-relaxed text-gray-500">
                    {group.description}
                  </p>
                </div>
                <span
                  className="flex-shrink-0 rounded-full px-2.5 py-1 font-montserrat text-[11px] font-semibold"
                  style={{
                    backgroundColor: `${group.accentColor}18`,
                    color: group.accentColor,
                  }}
                >
                  {group.memberCount} members
                </span>
              </div>
              {(group.upcomingSession || group.recentActivity) && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {group.upcomingSession && (
                    <span className="font-montserrat text-[12px] text-gray-400">
                      Next: {group.upcomingSession}
                    </span>
                  )}
                  {group.recentActivity && (
                    <span className="font-montserrat text-[12px] text-gray-400">
                      {group.recentActivity}
                    </span>
                  )}
                </div>
              )}
              <Link
                href="https://www.facebook.com/groups/maketimeformore"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 font-montserrat text-xs font-semibold uppercase tracking-wider"
                style={{ color: group.accentColor }}
              >
                Join Group
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </article>
          ))}
        </div>
      </section>

    </main>
  )
}
