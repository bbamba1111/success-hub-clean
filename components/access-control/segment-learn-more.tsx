"use client"

import { type ReactNode, useId, useState } from "react"
import { ChevronDown, Info } from "lucide-react"
import { useAboutSeen } from "@/lib/access-control/about-seen-store"

/**
 * SegmentLearnMore — the single canonical "Learn More About This Boundary™"
 * surface. It reuses the segment's EXISTING About This Segment™ content
 * (`SEGMENT_ABOUT` → `renderSegmentAbout()`), passed in as `aboutContent`, so
 * there is exactly one source of truth. The same component is rendered on a
 * LOCKED workspace card and inside the OPEN workspace.
 *
 * Content expands inline as a dropdown (never a popup) so it reads as part of
 * the workspace it belongs to.
 */
export function SegmentLearnMore({
  segmentId,
  title,
  aboutContent,
  isEvening = false,
  tone = "default",
  className,
}: {
  /** Segment id — records a quiet "Reviewed" marker once opened. */
  segmentId?: string
  /** The segment name, announced to screen readers. */
  title: string
  /** The segment's existing About This Segment™ content (single source). */
  aboutContent: ReactNode
  /** Power Down™'s dusk panel needs light-on-dark styling. */
  isEvening?: boolean
  /** "locked" gives the trigger a slightly more prominent, invitational look. */
  tone?: "default" | "locked"
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const { seen, markSeen } = useAboutSeen(segmentId)
  const panelId = useId()

  const labelColor = isEvening
    ? "text-white/90"
    : tone === "locked"
      ? "text-[#C13B6B]"
      : "text-[#47632f]"
  const iconColor = isEvening ? "text-white/80" : tone === "locked" ? "text-[#C13B6B]" : "text-[#5A7A45]"
  const shell = isEvening
    ? "border-white/15 bg-white/5"
    : "border-[#7FB069]/25 bg-[#7FB069]/[0.05]"

  return (
    <div className={`w-full overflow-hidden rounded-2xl border ${shell} ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          if (!open) markSeen()
        }}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C13B6B]/40 ${
          isEvening ? "hover:bg-white/10" : "hover:bg-[#7FB069]/[0.08]"
        }`}
      >
        <span className={`flex items-center gap-2 font-sans text-[14px] font-bold ${labelColor}`}>
          <Info className={`h-5 w-5 ${iconColor}`} aria-hidden />
          Learn More About This Boundary&trade;
          <span className="sr-only">: {title}</span>
          {seen && (
            <span
              className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-semibold ${
                isEvening ? "bg-white/15 text-white/70" : "bg-[#7FB069]/15 text-[#5A7A45]"
              }`}
            >
              Reviewed
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${iconColor} ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={panelId}
          className={`flex flex-col gap-5 border-t px-5 pb-6 pt-4 ${
            isEvening ? "border-white/10 bg-white/95 text-[#3A2E33]" : "border-[#7FB069]/15"
          }`}
        >
          {aboutContent}
        </div>
      )}
    </div>
  )
}
