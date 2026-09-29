"use client"

/**
 * EnterSpaceButton — the shared "Enter the Space™" CTA rendered in both the
 * Hero and the Welcome section, guaranteeing identical behavior: jumps to +
 * expands the current live block's accordion.
 */

import { Sparkles } from "lucide-react"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { useActiveSpace } from "@/components/active-space-provider"
import { SPACE_LABEL } from "@/operating-engine/config/space-labels"

export function EnterSpaceButton({ variant }: { variant: "hero" | "welcome" }) {
  const experience = useOperatingEngine()
  const activeSpace = useActiveSpace()

  if (!experience || !activeSpace) return null

  const current = experience.businessDay.current
  const label = SPACE_LABEL[current.id] ?? "Enter the Space™"

  const baseClasses =
    "inline-flex items-center gap-2 rounded-full font-montserrat text-sm font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

  const sizeClasses = variant === "hero" ? "px-6 py-2.5" : "px-5 py-2.5"

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
