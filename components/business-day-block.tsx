"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export type BlockStatus = "current" | "upcoming" | "completed"

export interface BusinessDayBlockProps {
  sectionId: string
  /** Swap this single value when a permanent image is ready. Layout never depends on it. */
  backgroundImage?: string
  emoji?: string
  time: string
  title: string
  description: ReactNode
  buttonText: string
  /** Space-separated RGB for the left panel tint, e.g. "251 239 230". */
  tint?: string
  /** Placeholder state. Phase 2 (Circadian Rhythm Engine) will drive this automatically. */
  status?: BlockStatus
  /** Optional extra content rendered inside the panel (e.g. a featured sub-card). */
  children?: ReactNode
  /** Fired when the member enters the live segment (opens the Operating Planner™). */
  onAction?: () => void
  /** Elapsed progress (0–100) through the current segment. Drives the bar. */
  segmentProgress?: number
  /** Human label for time left in the segment, e.g. "22m left". */
  segmentRemaining?: string
  /** Preview of this segment's active Operating Rule™ (shown on the card). */
  operatingRulePreview?: string
}

const STATUS_LABEL: Record<BlockStatus, string> = {
  current: "Happening Now",
  upcoming: "Upcoming",
  completed: "Completed",
}

const STATUS_BADGE: Record<BlockStatus, string> = {
  current: "bg-[#7FB069] text-white",
  upcoming: "bg-[#7FB069]/15 text-[#5A7A45]",
  completed: "bg-black/10 text-[#6B5860]",
}

export function BusinessDayBlock({
  sectionId,
  backgroundImage = "/placeholder.svg?height=560&width=1600",
  emoji,
  time,
  title,
  description,
  buttonText,
  tint = "248 243 236",
  status = "upcoming",
  children,
  onAction,
  segmentProgress,
  segmentRemaining,
  operatingRulePreview,
}: BusinessDayBlockProps) {
  const isCurrent = status === "current"
  const showProgress = isCurrent && typeof segmentProgress === "number"

  return (
    <section id={sectionId} aria-label={title} className="scroll-mt-24 w-full px-4 py-3 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ boxShadow: "0 24px 50px -12px rgba(28,22,26,0.35)" }}
        className={`relative w-full overflow-hidden rounded-3xl shadow-lg ${
          isCurrent ? "ring-2 ring-[#7FB069] ring-offset-2 ring-offset-[#F5F1E8]" : ""
        }`}
        style={{ backgroundColor: `rgb(${tint})` }}
      >
        {/* Segment progress — thin bar showing how much of the in-session block remains */}
        {showProgress && (
          <div className="absolute inset-x-0 top-0 z-20 h-1.5 bg-[#7FB069]/15">
            <motion.div
              className="h-full bg-[#7FB069]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, segmentProgress as number))}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        )}

        {/* Two-column experience layout: clean content panel (~36%) + dominant photography (~64%).
            The in-session card is ~1/3 taller so it clearly stands out. */}
        <div
          className={`relative z-10 flex flex-col md:flex-row ${
            isCurrent ? "min-h-[380px] md:min-h-[420px]" : "min-h-[280px] md:min-h-[300px]"
          }`}
        >
          {/* Left content panel — 42% tablet, 34–38% desktop, capped at 600px */}
          <div
            className="flex items-center px-5 py-6 sm:px-8 md:w-[42%] md:max-w-[600px] md:px-10 lg:w-[36%]"
            style={{ backgroundColor: `rgb(${tint})` }}
          >
            <div className="w-full">
              <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${STATUS_BADGE[status]}`}
                >
                  {STATUS_LABEL[status]}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B5860]">{time}</span>
                {isCurrent && segmentRemaining && (
                  <span className="inline-flex items-center rounded-full bg-[#7FB069]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5A7A45]">
                    {segmentRemaining}
                  </span>
                )}
              </div>

              <h3 className="font-playfair text-xl font-medium leading-tight text-balance text-[#3A2E33] sm:text-2xl">
                {emoji ? <span className="mr-2">{emoji}</span> : null}
                {title}
              </h3>

              <div className="mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-[#5C4F55]">{description}</div>

              {/* Today's Operating Rule™ preview — the single commitment guiding
                  this segment. Keeps the card informative without a workspace. */}
              {operatingRulePreview && (
                <div className="mt-3 rounded-xl border border-[#7FB069]/20 bg-white/60 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5B835F]">
                    {"Today's Operating Rule™"}
                  </p>
                  <p className="mt-0.5 line-clamp-2 font-serif text-sm italic leading-snug text-[#3A2E33]">
                    {operatingRulePreview}
                  </p>
                </div>
              )}

              {children}

              {/* One clear next action: only the live segment invites the member
                  into the Operating Planner™ workspace below the hero. Upcoming
                  and completed segments stay calm and action-free. */}
              {isCurrent && (
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <Button
                    size="sm"
                    onClick={onAction}
                    className="bg-[#7FB069] text-white hover:bg-[#6FA058]"
                  >
                    {buttonText}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right image area — dominant photography, fills the rest of the card */}
          <div className="relative min-h-[200px] flex-1">
            <img
              src={backgroundImage || "/placeholder.svg"}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            {/* Soft ~48px horizontal fade blending the panel into the photography (desktop only) */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 md:block"
              style={{ background: `linear-gradient(90deg, rgb(${tint}) 0%, rgb(${tint} / 0) 100%)` }}
            />
          </div>
        </div>

        {/* Phase 3B.1: the in-session workspace now lives once, full-width,
            in the Operating Planner™ below the hero — not repeated on each
            schedule card. These cards are a clean visual timeline only. */}
      </motion.div>
    </section>
  )
}
