"use client"

/**
 * CommunityWelcomeBanner — Cherry Blossom greeting with day theme accent
 * and live member count chip.
 */

import { useOperatingEngine } from "@/components/operating-engine-provider"
import { useHarmonyWeek } from "@/components/harmony-week/harmony-week-provider"
import { Users } from "lucide-react"

// Seeded community size — shown as "active today"
const COMMUNITY_SIZE = 847

export function CommunityWelcomeBanner() {
  const experience = useOperatingEngine()
  const harmonyWeek = useHarmonyWeek()

  const greeting = experience?.member.greeting ?? "Welcome"
  const accent = harmonyWeek?.accent.color ?? "#5D9D61"
  const dayName = harmonyWeek?.dayName ?? "today"
  const dayMessage = harmonyWeek?.cherryBlossomMessage ?? "You are not on this journey alone."

  return (
    <header
      className="relative overflow-hidden rounded-2xl px-6 py-8 sm:px-8"
      style={{ background: `linear-gradient(135deg, ${accent}12 0%, ${accent}06 100%)` }}
    >
      {/* Thin accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />

      {/* Member count chip */}
      <div className="flex items-center gap-2 font-montserrat text-[12px] text-gray-500">
        <span
          className="flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ backgroundColor: accent }}
            aria-hidden="true"
          />
          <Users className="h-3 w-3" />
          {COMMUNITY_SIZE.toLocaleString()} founders active today
        </span>
      </div>

      {/* Greeting */}
      <h1 className="mt-4 font-playfair text-2xl font-bold leading-tight text-[#1C2B2B] sm:text-3xl">
        {greeting}
      </h1>
      <p className="mt-1 font-montserrat text-sm text-gray-500">
        {dayName} in community.
      </p>

      {/* Cherry Blossom message */}
      <blockquote className="mt-5 max-w-lg font-playfair text-[15px] italic leading-relaxed text-[#3D4F4F]">
        &ldquo;{dayMessage}&rdquo;
        <footer className="mt-2 font-montserrat text-[11px] not-italic uppercase tracking-wider text-gray-400">
          Cherry Blossom
        </footer>
      </blockquote>
    </header>
  )
}
