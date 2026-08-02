"use client"

import { type ReactNode, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { OperatingPlanner } from "@/components/operating-planner/operating-planner"
import { PLANNER_CONFIG } from "@/components/operating-planner/planner-config"

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
  /** The id of the current block, used to pick the right status label. */
  blockId?: string
  /** Fired when the member enters the live segment (opens the Operating Planner™). */
  onAction?: () => void
  /** Elapsed progress (0–100) through the current segment. Drives the bar. */
  segmentProgress?: number
  /** Human label for time left in the segment, e.g. "22m left". */
  segmentRemaining?: string
  /** Preview of this segment's active Operating Rule™ (shown on the card). */
  operatingRulePreview?: string
  /** Rich content for the "About This Segment" accordion. Falls back to description. */
  aboutContent?: ReactNode
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

type MusicChoice = "barbara" | "my-playlist" | "silent"

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
  blockId,
  onAction,
  segmentProgress,
  segmentRemaining,
  operatingRulePreview,
  aboutContent,
}: BusinessDayBlockProps) {
  const isCurrent = status === "current"
  const showProgress = isCurrent && typeof segmentProgress === "number"
  const [open, setOpen] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [music, setMusic] = useState<MusicChoice | null>(null)

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
        style={{ background: "linear-gradient(135deg, #FDF6F0 0%, #FBF0F4 40%, #F0F5EE 70%, #FDFAF6 100%)" }}
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
            style={{ background: "linear-gradient(135deg, #FDF6F0 0%, #FBF0F4 40%, #F0F5EE 70%, #FDFAF6 100%)" }}
          >
            <div className="w-full">
              <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                {isCurrent ? (() => {
                  const nowLabel = blockId === "digital-detox"
                    ? "Sleeping Now"
                    : blockId === "ceo-workday"
                    ? "Working Now"
                    : "Living Now"
                  return (
                    <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#78AD7D] shadow-sm backdrop-blur-sm ring-1 ring-white/60">
                      <span className="relative flex h-[12px] w-[12px] shrink-0 items-center justify-center">
                        <span
                          className="absolute inset-[-2px] rounded-full animate-ping"
                          style={{ backgroundColor: "rgba(120,173,125,0.30)", animationDuration: "2s" }}
                        />
                        <span
                          className="relative text-[10px] leading-none"
                          style={{ animation: "pulse 2s ease-in-out infinite" }}
                        >
                          🌸
                        </span>
                      </span>
                      {nowLabel}
                    </span>
                  )
                })() : (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${STATUS_BADGE[status]}`}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                )}
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

              {children}

              {/* One clear next action: only the live segment invites the member
                  into the Operating Planner™ workspace below the hero. Upcoming
                  and completed segments stay calm and action-free. */}
              {isCurrent && (
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <Button
                    size="sm"
                    onClick={() => { onAction?.(); setOpen(true) }}
                    className="animate-[pulse_2.4s_ease-in-out_infinite] bg-[#7FB069] text-white hover:bg-[#6FA058]"
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
              style={{ background: "linear-gradient(90deg, #FDF6F0 0%, transparent 100%)" }}
            />
          </div>
        </div>

        {/* Expand toggle — always visible */}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-black/[0.06] py-3 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60 transition-colors hover:bg-black/[0.02]"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
          {open ? "Close" : "Open Segment"}
        </button>

        {/* 3-part expandable body */}
        {open && (
          <div className="border-t border-black/[0.06]">

            {/* Operating Planner™ — chip picker → commitment → declaration → Install This™
                Uses the exact same working component as /design-my-week.
                Skips digital-detox and placeholder segments (no PLANNER_CONFIG entry). */}
            {blockId && blockId !== "digital-detox" && PLANNER_CONFIG[blockId as keyof typeof PLANNER_CONFIG] && (
              <OperatingPlanner blockId={blockId as any} />
            )}

            {/* Row 1 — Join Us Live™ */}
            <div className="px-7 py-5">
              <a
                href="https://us05web.zoom.us/j/2648726290?pwd=ubrd71NpIvu9tEkwDbvxQ9uaiuIIpS.1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#E26C73] px-6 py-3 font-sans text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#c04d54] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E26C73]/40"
              >
                <span className="h-2 w-2 rounded-full bg-white animate-pulse shrink-0" aria-hidden />
                Join Us Live™
              </a>
            </div>

            <div className="mx-7 border-t border-black/[0.05]" />

            {/* Row 2 — Music */}
            <div className="px-7 py-5">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/50 mb-3">
                Music
              </p>
              <div className="flex flex-col gap-1" role="group" aria-label="Music options">
                {(
                  [
                    { val: "barbara" as const, label: "Barbara's Recommended Playlist" },
                    { val: "my-playlist" as const, label: "My Playlist" },
                    { val: "silent" as const, label: "Silent" },
                  ] as const
                ).map(({ val, label }) => {
                  const selected = music === val
                  return (
                    <button
                      key={val}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setMusic(selected ? null : val)}
                      className={`w-fit text-left rounded-lg px-4 py-2 font-sans text-sm font-medium transition-colors ${
                        selected
                          ? "bg-[#7FB069] text-white shadow-sm"
                          : "text-[#5C4F55] hover:bg-black/[0.04]"
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {music === "barbara" && (
                <div className="mt-4">
                  <div className="overflow-hidden rounded-xl border border-black/[0.07] shadow-sm">
                    <iframe
                      src="https://www.youtube.com/embed/videoseries?list=OLAK5uy_l3HOZ6_m7VDrRL6zuazqyC7T9Af5c6jQw&autoplay=1"
                      title="Barbara's Recommended Playlist"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full"
                      style={{ height: 200 }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mx-7 border-t border-black/[0.05]" />

            {/* Row 3 — About This Segment */}
            <div>
              <button
                type="button"
                aria-expanded={showAbout}
                onClick={() => setShowAbout((v) => !v)}
                className="flex w-full items-center gap-2 px-7 py-4 text-left transition-colors hover:bg-black/[0.02]"
              >
                <ChevronDown
                  className={`h-4 w-4 text-[#6B5860]/40 transition-transform duration-200 ${showAbout ? "rotate-180" : ""}`}
                  aria-hidden
                />
                <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/50">
                  About This Segment
                </span>
              </button>
              {showAbout && (
                <div className="px-7 pb-7 pt-4 border-t border-black/[0.05] space-y-4">
                  {aboutContent ?? (
                    <div className="text-sm leading-relaxed text-[#5C4F55]">{description}</div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </motion.div>
    </section>
  )
}
