"use client"

import { type ReactNode, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { OperatingPlanner } from "@/components/operating-planner/operating-planner"
import { PLANNER_CONFIG } from "@/components/operating-planner/planner-config"
import { TodaysMoveCard } from "@/components/operating-planner/todays-move-card"
import { ReflectionSpace } from "@/components/reflection-space"
import { DebriefSpace } from "@/components/debrief-space"
import { DecideIdentitySpace } from "@/components/daily-identity/decide-identity-space"
import { TodaysMovementCard } from "@/components/daily-plan/todays-movement-card"
import { TodaysLunchCard } from "@/components/daily-plan/todays-lunch-card"
import { TodaysCeoWorkdayCard } from "@/components/daily-plan/todays-ceo-workday-card"
import { TimeFreedomTodayCard } from "@/components/daily-plan/time-freedom-today-card"
import { PowerDownReleaseCard } from "@/components/daily-plan/power-down-release-card"
import { SoundRitual } from "@/components/sound-ritual"
import { useActiveSpace } from "@/components/active-space-provider"
import { SPACE_LABEL } from "@/operating-engine/config/space-labels"
import { SEGMENT_INNER_BG, SEGMENT_SAGE_OUTER, type SegmentInnerTone } from "@/lib/segment-theme"

export type BlockStatus = "current" | "upcoming" | "completed"

export interface BusinessDayBlockProps {
  sectionId: string
  /** Swap this single value when a permanent image is ready. Layout never depends on it.
   *  Pass an array (2+ images) to slowly crossfade between them, e.g. to show the
   *  laptop screen "changing" every few seconds. */
  backgroundImage?: string | string[]
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
  /** Fired when the "Continue Segment™" button is clicked — triggers the Daily Transition™ overlay. */
  onTransition?: () => void
  /** Elapsed progress (0–100) through the current segment. Drives the bar. */
  segmentProgress?: number
  /** Human label for time left in the segment, e.g. "22m left". */
  segmentRemaining?: string
  /** Preview of this segment's active Operating Rule™ (shown on the card). */
  operatingRulePreview?: string
  /** Rich content for the "About This Segment" accordion. Falls back to description. */
  aboutContent?: ReactNode
  /** Overnight closure (e.g. Unplug Space™ / Digital Detox™) — nothing is
   *  actionable here, so both the expand toggle and the "Continue Segment™"
   *  CTA are hidden entirely rather than opening onto an empty accordion. */
  isClosed?: boolean
  /**
   * "sage" gives the segment the two-layer Daily Operating Segment™ treatment
   * — a soft sage-green OUTER frame with a lighter INNER content panel
   * (color set by `innerTone`) — used for the six Decide → Populate →
   * Execute segments (Decide & Design™, Movement Window™, Lunch Break™, CEO
   * Workday™, Time Freedom™, Power Down™). Everything else ("default") keeps
   * the original cream/blush gradient, single flat layer.
   */
  theme?: "default" | "sage"
  /**
   * The INNER content panel's color when `theme="sage"`. "white" for the
   * four daytime segments, "warm" for Time Freedom™, "evening" for Power
   * Down™. Ignored when `theme="default"`.
   */
  innerTone?: SegmentInnerTone
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

/** The Power Down™ evening panel is dark, so its status badges need a light variant — every other tone (white/warm/default) uses STATUS_BADGE above. */
const STATUS_BADGE_EVENING: Record<BlockStatus, string> = {
  current: "bg-white text-[#2C4442]",
  upcoming: "bg-white/15 text-white/80",
  completed: "bg-white/10 text-white/60",
}

const CREAM_GRADIENT = "linear-gradient(135deg, #FDF6F0 0%, #FBF0F4 40%, #F0F5EE 70%, #FDFAF6 100%)"
const SOLID_GREEN = "#7FB069"

/** These 5 segments now get a dedicated "Today's X" card (reading Today's Plan™) instead of the old generic Operating Planner™ chip-picker flow. `daily-planning-gps` was already excluded — it renders `DecideIdentitySpace` instead. */
const LEGACY_PLANNER_EXCLUDED_IDS = new Set([
  "movement-window",
  "lunch-break",
  "ceo-workday",
  "time-freedom",
  "power-down",
])

/** Sound Ritual™ is removed from these 6 segments only — kept everywhere else (morning-given, time-freedom, power-down, monday-debrief, and any other segment). */
const SOUND_RITUAL_EXCLUDED_IDS = new Set([
  "early-access",
  "movement-window",
  "monday-reality-check",
  "daily-planning-gps",
  "lunch-break",
  "ceo-workday",
])

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
  onTransition,
  segmentProgress,
  segmentRemaining,
  operatingRulePreview,
  aboutContent,
  isClosed = false,
  theme = "default",
  innerTone = "white",
}: BusinessDayBlockProps) {
  const isCurrent = status === "current"
  const isSage = theme === "sage"
  // For the "default" theme the inner panel is simply the same cream
  // gradient as the outer frame, so no visible seam/frame appears — this
  // keeps every non-sage segment (morning-given, the Monday-only blocks,
  // digital-detox, etc.) pixel-identical to before.
  const outerBg = isSage ? SEGMENT_SAGE_OUTER : CREAM_GRADIENT
  const innerBg = isSage ? SEGMENT_INNER_BG[innerTone] : CREAM_GRADIENT
  const isEvening = isSage && innerTone === "evening"
  const showProgress = isCurrent && typeof segmentProgress === "number"
  const [open, setOpen] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [music, setMusic] = useState<MusicChoice | null>(null)
  const activeSpace = useActiveSpace()

  // Support crossfading through multiple background images (e.g. the laptop
  // screen "changing" every few seconds) when an array is passed.
  const backgroundImages = Array.isArray(backgroundImage)
    ? backgroundImage
    : [backgroundImage]
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    if (backgroundImages.length < 2) return
    const id = setInterval(() => {
      setImageIndex((i) => (i + 1) % backgroundImages.length)
    }, 3500)
    return () => clearInterval(id)
  }, [backgroundImages.length])

  // "Enter the Space™" — auto-expand this accordion when the shared
  // provider targets this block (Hero CTA, Welcome CTA, or the in-flow
  // "Enter Alignment Space™" button inside ReflectionSpace).
  useEffect(() => {
    if (blockId && activeSpace?.expandBlockId === blockId) {
      setOpen(true)
    }
  }, [activeSpace?.expandBlockId, blockId])

  // Force-close this accordion when the shared provider says to — used to
  // collapse Reflection Space™ the moment the member enters Alignment Space™.
  useEffect(() => {
    if (blockId && activeSpace?.collapseBlockId === blockId) {
      setOpen(false)
    }
  }, [activeSpace?.collapseBlockId, blockId])

  const isHighlighted = Boolean(blockId && activeSpace?.highlightBlockId === blockId)

  return (
    <section id={sectionId} aria-label={title} className="scroll-mt-24 w-full px-4 py-3 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        // `amount` is a fraction of THIS element's own height, not the viewport's.
        // These cards are ~365px collapsed but can grow to 2000px+ once expanded
        // (e.g. via "Enter the Space™" hand-offs), and 30% of a 2000px+ tall card
        // can never fit in the viewport — so the fade-in never fired and the card
        // stayed stuck at opacity: 0 (invisible) until the member scrolled far
        // enough to satisfy the old, much-shorter collapsed height. `amount: 0`
        // fires as soon as any pixel of the card is visible, regardless of height.
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ boxShadow: "0 24px 50px -12px rgba(28,22,26,0.35)" }}
        className={`relative w-full overflow-hidden rounded-3xl shadow-lg transition-shadow duration-700 ${
          isHighlighted
            ? "ring-4 ring-[#C13B6B]/40 ring-offset-2 ring-offset-[#F5F1E8]"
            : isCurrent
              ? "ring-2 ring-[#7FB069] ring-offset-2 ring-offset-[#F5F1E8]"
              : ""
        }`}
        style={{ background: outerBg }}
      >

        {/*
         * LAYER 2 — the inner content panel. For "sage" segments this floats
         * inset from the outer edges (revealing the sage OUTER frame as a
         * border on all sides); for "default" segments the margin is 0 and
         * this background matches the outer exactly, so nothing visually
         * changes from before.
         */}
        <div
          className={`relative ${isSage ? "m-2 overflow-hidden rounded-[1.6rem] sm:m-2.5 sm:rounded-[1.75rem]" : ""}`}
          style={{ background: innerBg }}
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
            style={{ background: innerBg }}
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
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      isEvening ? STATUS_BADGE_EVENING[status] : STATUS_BADGE[status]
                    }`}
                  >
                    {STATUS_LABEL[status]}
                  </span>
                )}
                <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${isEvening ? "text-white/75" : "text-[#6B5860]"}`}>
                  {time}
                </span>
                {isCurrent && segmentRemaining && (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      isEvening ? "bg-white/15 text-white" : "bg-[#7FB069]/15 text-[#5A7A45]"
                    }`}
                  >
                    {segmentRemaining}
                  </span>
                )}
              </div>

              <h3
                className={`font-playfair text-xl font-medium leading-tight text-balance sm:text-2xl ${
                  isEvening ? "text-white" : "text-[#3A2E33]"
                }`}
              >
                {emoji ? <span className="mr-2">{emoji}</span> : null}
                {title}
              </h3>

              <div
                className={`mt-2 line-clamp-2 text-pretty text-sm leading-relaxed ${
                  isEvening ? "text-white/80" : "text-[#5C4F55]"
                }`}
              >
                {description}
              </div>

              {children}

              {/* One clear next action: only the live segment invites the member
                  into the Operating Planner™ workspace below the hero. Upcoming
                  and completed segments stay calm and action-free. Overnight
                  closures (Unplug Space™) have no action at all — there is
                  nothing to continue into while the community is closed. */}
              {isCurrent && !isClosed && (
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (onTransition) {
                        onTransition()
                      } else {
                        onAction?.()
                        setOpen(true)
                      }
                    }}
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
            <AnimatePresence>
              <motion.img
                key={imageIndex}
                src={backgroundImages[imageIndex] || "/placeholder.svg"}
                alt=""
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </AnimatePresence>
            {/* Soft ~48px horizontal fade blending the panel into the photography (desktop only) */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 md:block"
              style={{ background: `linear-gradient(90deg, ${isSage ? innerBg : "#FDF6F0"} 0%, transparent 100%)` }}
            />
          </div>
        </div>

        {/* Expand toggle — hidden entirely for overnight closures (Unplug
            Space™): there is no live room, planner, or music to open while
            the community is closed for the night. */}
        {!isClosed && (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`flex w-full items-center justify-center gap-1.5 border-t py-3 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${
              isEvening
                ? "border-white/15 text-white/75 hover:bg-white/10"
                : "border-black/[0.06] text-[#6B5860]/60 hover:bg-black/[0.02]"
            }`}
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
            {open
              ? "Close"
              : blockId && SPACE_LABEL[blockId as keyof typeof SPACE_LABEL]
                ? `Enter ${SPACE_LABEL[blockId as keyof typeof SPACE_LABEL]}`
                : "Open Segment"}
          </button>
        )}

        {/* 3-part expandable body — stays on the same INNER panel color
            (white/warm/evening) as the hero above it, so the whole segment
            reads as one continuous content space inside the sage frame. */}
        {!isClosed && open && (
          <div
            className={`border-t ${isEvening ? "border-white/10" : "border-black/[0.06]"}`}
            style={{ background: innerBg }}
          >

            {/* Reflection Space™ — guided Work-Life Balance Reality Check™ for Monday */}
            {blockId === "monday-reality-check" && (
              <div className="px-7 py-8">
                <ReflectionSpace />
              </div>
            )}

            {/* Debrief Space™ — placeholder reflective pause between the Reality Check™ and Movement Window™.
                Today's Design™ (DecideIdentitySpace) runs immediately after it on Monday too, so the
                weekly decision layer flows straight into the same daily design engine Tue–Thu already
                use — no separate Monday planner, no dead link into the excluded daily-planning-gps block. */}
            {blockId === "monday-debrief" && (
              <div className="px-7 py-8 space-y-8">
                <DebriefSpace />
                <DecideIdentitySpace />
              </div>
            )}

            {/* Decide My Identity & Design My Business Boundaries For Today™ (Tue–Thu) —
                Founder GPS™ Next Best Move™ (read-only) + This Week's Menu recap,
                identity + boundary decision, and the CEO Workday™ outcome picker
                that feeds directly into the Weekly WLBB Menu™'s DailyEntry
                (same store the CEO Workspace™ reads). */}
            {blockId === "daily-planning-gps" && (
              <div className="px-7 py-8">
                <DecideIdentitySpace />
              </div>
            )}

            {/* Today's Move™ (Phase 1: Execute → Check) — shows the Decide-originated
                declaration + why-it-matters for THIS segment, if the founder set one
                today via the "Where do I need to focus today?" picker. Renders nothing
                (no regression) when no such declaration exists. Excluded for the 5
                segments that now render a dedicated "Today's X" card instead. */}
            {blockId && blockId !== "digital-detox" && blockId !== "monday-reality-check" && blockId !== "monday-debrief" && blockId !== "daily-planning-gps" && !LEGACY_PLANNER_EXCLUDED_IDS.has(blockId) && PLANNER_CONFIG[blockId as keyof typeof PLANNER_CONFIG] && (
              <TodaysMoveCard segmentId={blockId} segmentRemaining={segmentRemaining} />
            )}

            {/* Operating Planner™ — chip picker → commitment → declaration → Install This™
                Uses the exact same working component as /design-my-week.
                Skips digital-detox, the two Monday-only reflective blocks, and the 5
                segments that now render a dedicated "Today's X" card instead. */}
            {blockId && blockId !== "digital-detox" && blockId !== "monday-reality-check" && blockId !== "monday-debrief" && blockId !== "daily-planning-gps" && !LEGACY_PLANNER_EXCLUDED_IDS.has(blockId) && PLANNER_CONFIG[blockId as keyof typeof PLANNER_CONFIG] && (
              <OperatingPlanner blockId={blockId as any} />
            )}

            {/* Today's X cards — Decide → Populate → Execute. Each reads the
                SAME `TodaysPlanRecord` the founder decided in Decide &
                Design™; nothing is re-entered here. */}
            {blockId === "movement-window" && <TodaysMovementCard />}
            {blockId === "lunch-break" && <TodaysLunchCard />}
            {blockId === "ceo-workday" && <TodaysCeoWorkdayCard />}
            {blockId === "time-freedom" && <TimeFreedomTodayCard />}
            {blockId === "power-down" && <PowerDownReleaseCard />}

            {/* Row 1 — Join Us Live™. The Work-Life Balance Debrief™ and Decide &
                Design™ are intentionally independent of Zoom — self-guided windows,
                not live rooms. Flex Time™ (early-access) now also carries the
                Join Us Live™ link. */}
            {blockId !== "monday-debrief" && blockId !== "daily-planning-gps" && (
              <>
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

                <div className={`mx-7 border-t ${isEvening ? "border-white/10" : "border-black/[0.05]"}`} />
              </>
            )}

            {/* Sound Ritual™ — curated ambient soundscapes per segment. Removed
                from the 6 segments in SOUND_RITUAL_EXCLUDED_IDS; kept everywhere else.
                Passes "evening" so its text/hover states stay legible on Power
                Down™'s dusk-teal panel — every other tone is unaffected. */}
            {blockId && !SOUND_RITUAL_EXCLUDED_IDS.has(blockId) && (
              <SoundRitual blockId={blockId} surface={isEvening ? "evening" : "light"} />
            )}

            <div className={`mx-7 border-t ${isEvening ? "border-white/10" : "border-black/[0.05]"}`} />

            {/* Row 2 — Music */}
            <div className="px-7 py-5">
              <p className={`font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] mb-3 ${isEvening ? "text-white/60" : "text-[#6B5860]/50"}`}>
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
                          : isEvening
                            ? "text-white/75 hover:bg-white/10"
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

            <div className={`mx-7 border-t ${isEvening ? "border-white/10" : "border-black/[0.05]"}`} />

            {/* Row 3 — About This Segment */}
            <div>
              <button
                type="button"
                aria-expanded={showAbout}
                onClick={() => setShowAbout((v) => !v)}
                className={`flex w-full items-center gap-2 px-7 py-4 text-left transition-colors ${isEvening ? "hover:bg-white/5" : "hover:bg-black/[0.02]"}`}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${showAbout ? "rotate-180" : ""} ${isEvening ? "text-white/50" : "text-[#6B5860]/40"}`}
                  aria-hidden
                />
                <span className={`font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] ${isEvening ? "text-white/60" : "text-[#6B5860]/50"}`}>
                  About This Segment
                </span>
              </button>
              {showAbout && (
                <div className={`px-7 pb-7 pt-4 border-t space-y-4 ${isEvening ? "border-white/10" : "border-black/[0.05]"}`}>
                  {aboutContent ?? (
                    <div className={`text-sm leading-relaxed ${isEvening ? "text-white/80" : "text-[#5C4F55]"}`}>{description}</div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        </div>
        {/* end LAYER 2 — inner content panel */}

      </motion.div>
    </section>
  )
}
