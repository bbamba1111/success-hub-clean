"use client"

/**
 * CommunityCelebrationCard — shimmer dark card for win celebrations.
 * Distinct from the founder-memory CelebrationCard — this variant is
 * designed for the wins wall and has a Cherry Blossom auto-note.
 */

import type { FounderWin } from "@/lib/community/types"
import { Trophy } from "lucide-react"

const WIN_MESSAGES: Record<FounderWin["category"], string> = {
  "harmony-week": "Living your Harmony Week™ is the whole practice. This is it.",
  streak: "Consistency is the compounding asset. This streak is real evidence.",
  "score-increase": "Every point is a boundary honored. You earned this.",
  "time-freedom": "You protected the life your business exists to support. Well done.",
  "co-working": "Showing up in community amplifies everything. I see you here.",
  milestone: "Milestones only come to those who kept going. You kept going.",
}

interface CommunityCelebrationCardProps {
  win: FounderWin
}

export function CommunityCelebrationCard({ win }: CommunityCelebrationCardProps) {
  const note = WIN_MESSAGES[win.category]

  return (
    <article className="relative overflow-hidden rounded-2xl bg-[#1C2B2B] p-5">
      {/* Shimmer overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)",
          backgroundSize: "8px 8px",
        }}
        aria-hidden="true"
      />

      {/* Trophy + title */}
      <div className="relative flex items-start gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
          <Trophy className="h-4.5 w-4.5 text-[#C6924A]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-playfair text-sm font-semibold leading-snug text-white">
            {win.title}
          </p>
          <p className="mt-0.5 font-montserrat text-[12px] leading-relaxed text-white/60">
            {win.description}
          </p>
        </div>
      </div>

      {/* Cherry Blossom note */}
      <div className="relative mt-4 rounded-xl bg-white/5 px-4 py-3">
        <p className="font-playfair text-[13px] italic leading-relaxed text-white/80">
          &ldquo;{note}&rdquo;
        </p>
        <p className="mt-1 font-montserrat text-[10px] uppercase tracking-wider text-white/30">
          Cherry Blossom
        </p>
      </div>

      {/* Date */}
      <time
        dateTime={win.date}
        className="relative mt-3 block font-montserrat text-[11px] text-white/30"
      >
        {new Date(win.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </time>
    </article>
  )
}
