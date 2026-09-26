"use client"

/**
 * Build Path™ picker (Phase 9F)
 * ---------------------------------------------------------------------------
 * "How would you like to build this?" — 8 choice cards shown beneath a
 * Founder GPS™ recommendation. The recommendation itself stays read-only
 * above this; selecting a card is the founder's explicit choice to begin
 * the build, which is what turns the recommendation into a Build Blueprint™.
 */

import {
  Hammer,
  Users,
  Sparkles,
  UserCheck,
  UserPlus,
  Briefcase,
  ShoppingCart,
  Handshake,
  Compass,
  type LucideIcon,
} from "lucide-react"

import { BUILD_PATH_DEFINITIONS } from "@/lib/build-strategy/build-path-registry"
import type { BuildPathId } from "@/lib/build-strategy/types"

const ICONS: Record<string, LucideIcon> = {
  Hammer,
  Users,
  Sparkles,
  UserCheck,
  UserPlus,
  Briefcase,
  ShoppingCart,
  Handshake,
}

/**
 * `recommendedPath`/`recommendedReason` are additive (Phase 11) — the
 * founder can still accept, ignore, or override the recommendation. Nothing
 * here silently forces a choice.
 */
export function BuildPathPicker({
  selected,
  onSelect,
  recommendedPath = null,
  recommendedReason = null,
}: {
  selected: BuildPathId | null
  onSelect: (id: BuildPathId) => void
  recommendedPath?: BuildPathId | null
  recommendedReason?: string | null
}) {
  return (
    <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/60 px-5 py-5 sm:px-6 sm:py-6">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-1">
        Build Strategy™
      </p>
      <h3 className="font-display text-base font-semibold text-brand-ink mb-4 text-pretty">
        How would you like to build this?
      </h3>

      {recommendedPath && recommendedReason && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#C13B6B]/25 bg-[#C13B6B]/[0.06] px-4 py-3">
          <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[#C13B6B]" aria-hidden />
          <p className="font-sans text-xs leading-relaxed text-brand-ink text-pretty">
            <span className="font-bold">Recommended: </span>
            {BUILD_PATH_DEFINITIONS.find((p) => p.id === recommendedPath)?.label ?? recommendedPath}. {recommendedReason}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {BUILD_PATH_DEFINITIONS.map((path) => {
          const Icon = ICONS[path.icon] ?? Hammer
          const isSelected = selected === path.id
          const isRecommended = recommendedPath === path.id
          return (
            <button
              key={path.id}
              type="button"
              onClick={() => onSelect(path.id)}
              aria-pressed={isSelected}
              className={`relative flex items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                isSelected
                  ? "border-[#C13B6B] bg-[#C13B6B]/[0.06]"
                  : "border-brand-blush/70 bg-white hover:border-[#C13B6B]/40"
              }`}
            >
              {isRecommended && (
                <span className="absolute -top-2 right-3 rounded-full bg-[#C13B6B] px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-white">
                  Recommended
                </span>
              )}
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isSelected ? "bg-[#C13B6B]/15" : "bg-brand-blush/50"
                }`}
              >
                <Icon className="h-4 w-4" style={{ color: isSelected ? "#C13B6B" : "#8B7B76" }} aria-hidden />
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-brand-ink leading-snug">{path.label}</p>
                <p className="mt-0.5 font-sans text-xs leading-relaxed text-brand-ink-soft text-pretty">
                  {path.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
