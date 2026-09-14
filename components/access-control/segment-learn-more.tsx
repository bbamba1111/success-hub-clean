"use client"

import { type ReactNode, useState } from "react"
import { ArrowRight, BookOpen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAboutSeen } from "@/lib/access-control/about-seen-store"

/**
 * SegmentLearnMore — the single canonical "Learn More About This Segment™"
 * surface. It reuses the segment's EXISTING About This Segment™ content
 * (`SEGMENT_ABOUT` → `renderSegmentAbout()`), passed in as `aboutContent`, so
 * there is exactly one source of truth. The same component is rendered:
 *
 *   • on a LOCKED workspace card (pre-Day discovery — the founder is already
 *     inside Harmony Lane™ and can explore the destination before it opens), and
 *   • inside the OPEN workspace (Learn More stays available after access opens).
 *
 * Both render identical content because both read the same `aboutContent`.
 *
 * The trigger is a real, always-clickable button (never hover-only) and the
 * content opens in a centered, scrollable modal that works on desktop, tablet,
 * and mobile.
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
  /** The segment name, shown as the modal heading. */
  title: string
  /** The segment's existing About This Segment™ content (single source). */
  aboutContent: ReactNode
  /** Power Down™'s dusk panel needs light-on-dark trigger styling. */
  isEvening?: boolean
  /** "locked" gives the trigger a slightly more prominent, invitational look. */
  tone?: "default" | "locked"
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const { seen, markSeen } = useAboutSeen(segmentId)

  const triggerColor = isEvening
    ? "text-white/85 hover:text-white"
    : tone === "locked"
      ? "text-[#C13B6B] hover:text-[#a52f58]"
      : "text-[#5A7A45] hover:text-[#47632f]"

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          markSeen()
        }}
        className={`group inline-flex items-center gap-1.5 font-montserrat text-[11px] font-bold uppercase tracking-[0.14em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C13B6B]/40 focus-visible:ring-offset-2 ${triggerColor} ${className ?? ""}`}
      >
        <BookOpen className="h-3.5 w-3.5" aria-hidden />
        Learn More About This Segment
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
        {seen && (
          <span
            className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold normal-case tracking-normal ${
              isEvening ? "bg-white/15 text-white/70" : "bg-[#7FB069]/15 text-[#5A7A45]"
            }`}
          >
            Reviewed
          </span>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto border-[#EADFD3] bg-[#FDFAF6]">
          <DialogHeader>
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
              Work-Life Balance Time &amp; Space Boundary&trade;
            </p>
            <DialogTitle className="font-playfair text-2xl font-medium text-[#3A2E33]">{title}</DialogTitle>
            <DialogDescription className="sr-only">
              Learn more about the {title} segment of the Work-Life Balance Business Day.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">{aboutContent}</div>
        </DialogContent>
      </Dialog>
    </>
  )
}
