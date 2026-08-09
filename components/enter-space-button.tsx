"use client"

/**
 * EnterSpaceButton — the shared "Enter the Space™" CTA rendered in both the
 * Hero and the Welcome section, guaranteeing identical behavior:
 *  - Normal case: jumps to + expands the current live block's accordion.
 *  - Monday special case: while waiting on the 9:45 AM gate, shows a
 *    disabled countdown instead of a clickable CTA.
 */

import { Lock, Sparkles } from "lucide-react"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { useActiveSpace } from "@/components/active-space-provider"
import { SPACE_LABEL } from "@/operating-engine/config/space-labels"

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "00:00"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export function EnterSpaceButton({ variant }: { variant: "hero" | "welcome" }) {
  const experience = useOperatingEngine()
  const activeSpace = useActiveSpace()

  if (!experience || !activeSpace) return null

  const current = experience.businessDay.current
  const label = SPACE_LABEL[current.id] ?? "Enter the Space™"

  const isMondayGate =
    current.id === "monday-reality-check" && activeSpace.reflectionComplete && !activeSpace.alignmentUnlocked

  const baseClasses =
    "inline-flex items-center gap-2 rounded-full font-montserrat text-sm font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

  const sizeClasses = variant === "hero" ? "px-6 py-2.5" : "px-5 py-2.5"

  if (isMondayGate) {
    return (
      <div
        className={`${baseClasses} ${sizeClasses} cursor-not-allowed bg-black/[0.04] text-[#6B5860]/70`}
        aria-live="polite"
        aria-label={`Alignment Space opens in ${formatCountdown(activeSpace.secondsUntilAlignment)}`}
      >
        <Lock className="h-4 w-4 shrink-0" aria-hidden />
        <span className="tabular-nums">
          Alignment Space™ opens in {formatCountdown(activeSpace.secondsUntilAlignment)}
        </span>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => activeSpace.enterSpace(current.id, current.sectionId)}
      className={`${baseClasses} ${sizeClasses} bg-[#C13B6B] text-white shadow-sm hover:bg-[#A8305A] focus-visible:ring-[#C13B6B]/40`}
    >
      <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
      {`Enter ${label}`}
    </button>
  )
}
