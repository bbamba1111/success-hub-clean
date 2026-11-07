"use client"

/**
 * ActivityCard — single activity row: category icon chip, title,
 * summary, relative timestamp. Used in highlights and activity feeds.
 */

import type { ActivityEntry } from "@/lib/community/types"
import { Users, Trophy, Star, Calendar, MessageCircle } from "lucide-react"

const CATEGORY_CONFIG: Record<
  ActivityEntry["category"],
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  checkin: { label: "Check-In", icon: Star, color: "#8AAF8C" },
  win: { label: "Win", icon: Trophy, color: "#C6924A" },
  highlight: { label: "Highlight", icon: Star, color: "#5D9D61" },
  event: { label: "Event", icon: Calendar, color: "#4A7FA5" },
  discussion: { label: "Discussion", icon: MessageCircle, color: "#7C5C8A" },
}

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

interface ActivityCardProps {
  entry: ActivityEntry
  showMember?: boolean
}

export function ActivityCard({ entry, showMember = false }: ActivityCardProps) {
  const config = CATEGORY_CONFIG[entry.category]
  const Icon = config.icon
  const accent = (entry.metadata?.accent as string | undefined) ?? config.color

  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4">
      {/* Icon chip */}
      <span
        className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${accent}20` }}
      >
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </span>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-montserrat text-sm font-semibold leading-snug text-[#1C2B2B]">
            {entry.title}
          </p>
          <time
            dateTime={entry.timestamp}
            className="flex-shrink-0 font-montserrat text-[11px] text-gray-400"
          >
            {relativeTime(entry.timestamp)}
          </time>
        </div>

        {entry.summary && (
          <p className="mt-1 font-montserrat text-[13px] leading-relaxed text-gray-500">
            {entry.summary}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          {/* Phase chip */}
          {entry.metadata?.phase && (
            <span
              className="rounded-full px-2 py-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${accent}18`, color: accent }}
            >
              {entry.metadata.phase as string}
            </span>
          )}

          {/* Category chip */}
          <span className="font-montserrat text-[10px] uppercase tracking-wider text-gray-400">
            {config.label}
          </span>
        </div>
      </div>
    </div>
  )
}
