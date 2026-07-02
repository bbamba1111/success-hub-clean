"use client"

import { useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CherryBlossomWorkstation } from "@/components/cherry-blossom-workstation"
import { TimeFreedomSocial } from "@/components/time-freedom-social"

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
  /** External link for the CTA. When provided, the button renders as a link. */
  href?: string
  onAction?: () => void
  /**
   * Chat context key for Cherry Blossom's inline planning workstation
   * (e.g. "lunch-break"). When provided on the current block, an expandable
   * workstation appears below the card.
   */
  chatContext?: string
  /**
   * When true on the current block, an expandable "Time Freedom Social Media
   * Sharing" community feed (photos + short videos) appears below the card.
   */
  socialSharing?: boolean
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
  href,
  onAction,
  chatContext,
  socialSharing = false,
}: BusinessDayBlockProps) {
  const isCompleted = status === "completed"
  const isCurrent = status === "current"

  // The inline planning workstation is offered only on the block that's
  // happening right now, and only when a chat context is available.
  const hasWorkstation = isCurrent && Boolean(chatContext)
  const [workstationOpen, setWorkstationOpen] = useState(false)

  // Time Freedom Social Media Sharing — community feed under the current block.
  const hasSocial = isCurrent && socialSharing
  const [socialOpen, setSocialOpen] = useState(false)

  return (
    <section id={sectionId} aria-label={title} className="scroll-mt-24 w-full px-4 py-3 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: isCompleted ? 0.65 : 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ boxShadow: "0 24px 50px -12px rgba(28,22,26,0.35)" }}
        className={`relative w-full overflow-hidden rounded-3xl shadow-lg ${
          isCurrent ? "ring-2 ring-[#7FB069] ring-offset-2 ring-offset-[#F5F1E8]" : ""
        }`}
        style={{ backgroundColor: `rgb(${tint})` }}
      >
        {/* Two-column experience layout: clean content panel (~36%) + dominant photography (~64%) */}
        <div className="relative z-10 flex min-h-[280px] flex-col md:min-h-[300px] md:flex-row">
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
              </div>

              <h3 className="font-playfair text-xl font-medium italic leading-tight text-balance text-[#3A2E33] sm:text-2xl">
                {emoji ? <span className="mr-2">{emoji}</span> : null}
                {title}
              </h3>

              <div className="mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-[#5C4F55]">{description}</div>

              {children}

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {href && !isCompleted ? (
                  <Button
                    asChild
                    size="sm"
                    className="bg-[#7FB069] text-white hover:bg-[#6FA058]"
                  >
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {buttonText}
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={onAction}
                    disabled={isCompleted}
                    className="bg-[#7FB069] text-white hover:bg-[#6FA058] disabled:opacity-50"
                  >
                    {buttonText}
                  </Button>
                )}

                {hasWorkstation && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setWorkstationOpen((open) => !open)}
                    aria-expanded={workstationOpen}
                    className="border-[#7FB069]/40 bg-white/70 text-[#4A6B38] hover:bg-[#7FB069]/10 hover:text-[#4A6B38]"
                  >
                    <span className="mr-1.5">🌸</span>
                    {workstationOpen ? "Close Planning" : "Plan with Cherry Blossom"}
                    <ChevronDown
                      className={`ml-1.5 h-4 w-4 transition-transform duration-300 ${
                        workstationOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                )}

                {hasSocial && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSocialOpen((open) => !open)}
                    aria-expanded={socialOpen}
                    className="border-[#7FB069]/40 bg-white/70 text-[#4A6B38] hover:bg-[#7FB069]/10 hover:text-[#4A6B38]"
                  >
                    <Users className="mr-1.5 h-4 w-4" />
                    {socialOpen ? "Close Sharing" : "Social Media Sharing"}
                    <ChevronDown
                      className={`ml-1.5 h-4 w-4 transition-transform duration-300 ${
                        socialOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                )}
              </div>
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

        {/* Inline planning workstation — expands/collapses below the current activity */}
        {hasWorkstation && (
          <AnimatePresence initial={false}>
            {workstationOpen && (
              <motion.div
                key="workstation"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="relative z-10 overflow-hidden"
                style={{ backgroundColor: `rgb(${tint})` }}
              >
                <div className="px-5 pb-6 pt-2 sm:px-8 md:px-10">
                  <CherryBlossomWorkstation context={chatContext as string} active={workstationOpen} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Time Freedom Social Media Sharing — community feed below the current activity */}
        {hasSocial && (
          <AnimatePresence initial={false}>
            {socialOpen && (
              <motion.div
                key="social"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="relative z-10 overflow-hidden border-t border-[#7FB069]/20"
                style={{ backgroundColor: `rgb(${tint})` }}
              >
                <div className="px-5 pb-6 pt-4 sm:px-8 md:px-10">
                  <div className="mb-4">
                    <h4 className="font-playfair text-lg font-medium italic text-[#3A2E33]">
                      Time Freedom Social Media Sharing
                    </h4>
                    <p className="mt-0.5 text-sm text-[#5C4F55]">
                      Share how you&apos;re spending your Time Freedom and connect with the community.
                    </p>
                  </div>
                  <TimeFreedomSocial active={socialOpen} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </section>
  )
}
