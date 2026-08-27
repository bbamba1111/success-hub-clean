"use client"

import { Briefcase, GraduationCap, Printer, ShoppingBag, Sparkles, Users, Zap, type LucideIcon } from "lucide-react"
import { BUILD_MODES, type BuildModeId } from "@/lib/business-asset-library/build-modes"

const ICONS: Record<string, LucideIcon> = { Sparkles, Zap, GraduationCap, Users, Briefcase, ShoppingBag, Printer }

/**
 * BuildModePicker — "Decision 2": how the founder wants to get this asset
 * done. "Print / Work Offline" is rendered disabled — architecture only, no
 * PDF generation this phase (see build-modes.ts). "Build With AI", "Let AI
 * Do It", and "Do It Myself" are all AI-guided — "Do It Myself" is NOT a
 * blank worksheet, it is the AI Executive coaching the founder step by step.
 * "Give It to My Team", "Hire an Expert", and "Buy It" generate a static,
 * deterministic brief or guidance panel from the asset's own content.
 */
export function BuildModePicker({
  activeMode,
  onSelect,
}: {
  activeMode: BuildModeId | null
  onSelect: (mode: BuildModeId) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="How would you like to work on this?">
      {BUILD_MODES.map((mode) => {
        const Icon = ICONS[mode.icon] ?? Sparkles
        const active = activeMode === mode.id
        return (
          <button
            key={mode.id}
            type="button"
            disabled={!mode.available}
            onClick={() => mode.available && onSelect(mode.id)}
            aria-pressed={active}
            className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left ds-transition ${
              !mode.available
                ? "cursor-not-allowed border-black/[0.06] bg-muted/40 opacity-60"
                : active
                  ? "border-brand-green bg-brand-green/5"
                  : "border-black/[0.08] bg-card hover:border-brand-green/40 hover:bg-brand-green/5"
            }`}
          >
            <span
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                active ? "bg-brand-green text-white" : "bg-brand-green/10 text-brand-green"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-display text-sm font-semibold text-brand-ink">
              {mode.label}
              {!mode.available && (
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  Coming Soon
                </span>
              )}
            </span>
            <span className="text-xs leading-relaxed text-brand-ink-soft">{mode.description}</span>
          </button>
        )
      })}
    </div>
  )
}
