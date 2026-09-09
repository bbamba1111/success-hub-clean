"use client"

/**
 * ChallengeCard — progress bar, participants count, days remaining, and
 * a join/complete CTA.
 */

import type { Challenge } from "@/lib/community/types"
import { Users, Clock } from "lucide-react"

interface ChallengeCardProps {
  challenge: Challenge
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { accentColor, progress, participants, daysRemaining, isCompleted } = challenge

  return (
    <article
      className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      {/* Title */}
      <h3 className="font-playfair text-sm font-semibold leading-snug text-[#1C2B2B]">
        {challenge.title}
      </h3>
      <p className="mt-1.5 font-montserrat text-[13px] leading-relaxed text-gray-500">
        {challenge.description}
      </p>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="font-montserrat text-xs font-semibold" style={{ color: accentColor }}>
            {progress}% complete
          </span>
          {isCompleted && (
            <span className="rounded-full bg-green-50 px-2 py-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-wider text-green-600">
              Done
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 flex items-center gap-4">
        <span className="flex items-center gap-1 font-montserrat text-[12px] text-gray-400">
          <Users className="h-3.5 w-3.5" />
          {participants.toLocaleString()} founders
        </span>
        <span className="flex items-center gap-1 font-montserrat text-[12px] text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          {daysRemaining}d remaining
        </span>
      </div>

      {/* CTA */}
      {!isCompleted && (
        <button
          type="button"
          className="mt-4 w-full rounded-xl py-2 font-montserrat text-xs font-semibold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          Join Challenge
        </button>
      )}
    </article>
  )
}
