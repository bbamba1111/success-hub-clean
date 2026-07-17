"use client"

/**
 * WorkspacePriorityBar™ — Phase 13.0
 * ---------------------------------------------------------------------------
 * Compact banner showing today's Harmony Week™ workspace priorities as chips.
 * Used at the top of AdaptiveWorkspaceSectionClient and any other section
 * that benefits from day-aware priority signalling.
 */

import { useHarmonyWeek } from "./harmony-week-provider"

export function WorkspacePriorityBar() {
  const theme = useHarmonyWeek()

  if (!theme) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-4 py-3">
      {/* Day label */}
      <span
        className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] shrink-0"
        style={{ color: theme.accent.color }}
      >
        {theme.themeName}
      </span>

      <span className="text-[#C9B8BC] text-xs" aria-hidden>·</span>

      {/* Priority chips */}
      {theme.workspacePriorities.map((priority) => (
        <span
          key={priority}
          className="inline-flex items-center rounded-full px-2.5 py-0.5 font-montserrat text-[11px] font-semibold"
          style={{
            backgroundColor: theme.accent.color + "18",
            color: theme.accent.color,
          }}
        >
          {priority}
        </span>
      ))}
    </div>
  )
}
