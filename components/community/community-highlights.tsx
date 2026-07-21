"use client"

/**
 * CommunityHighlights — curated 3-col grid of recent meaningful activity.
 */

import { COMMUNITY_HIGHLIGHTS } from "@/lib/community/community-highlights"
import { ActivityCard } from "./activity-card"

export function CommunityHighlights() {
  return (
    <section aria-labelledby="highlights-heading">
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="highlights-heading"
          className="font-playfair text-xl font-bold text-[#1C2B2B]"
        >
          Community Highlights
        </h2>
        <span className="font-montserrat text-xs uppercase tracking-wider text-gray-400">
          This Week
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COMMUNITY_HIGHLIGHTS.slice(0, 9).map((entry) => (
          <ActivityCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  )
}
