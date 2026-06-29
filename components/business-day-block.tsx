"use client"

import type { ReactNode } from "react"
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
  onAction?: () => void
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
}: BusinessDayBlockProps) {
  const isCompleted = status === "completed"
  const isCurrent = status === "current"

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
        {/* Per-block image — sits only in the RIGHT region and shows the FULL scene (no crop). Replace only `backgroundImage` later. */}
        <div className="absolute inset-y-0 right-0 w-full md:w-[62%] lg:w-[66%]" style={{ backgroundColor: `rgb(${tint})` }}>
          <img
            src={backgroundImage || "/placeholder.svg"}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain object-right"
          />
        </div>

        {/* Left tinted panel that feathers into the image so the full scene shows on the right */}
        <div
          className="absolute inset-y-0 left-0 w-full md:w-[44%] lg:w-[40%]"
          style={{
            background: `linear-gradient(90deg, rgb(${tint}) 0%, rgb(${tint}) 70%, rgb(${tint} / 0) 100%)`,
          }}
        />

        {/* Content — sits within the solid portion of the left panel */}
        <div className="relative z-10 flex min-h-[280px] items-center px-5 py-6 sm:px-8 md:min-h-[300px] lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${STATUS_BADGE[status]}`}
              >
                {STATUS_LABEL[status]}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B5860]">{time}</span>
            </div>

            <h3 className="text-xl font-bold leading-tight text-balance text-[#3A2E33] sm:text-2xl">
              {emoji ? <span className="mr-2">{emoji}</span> : null}
              {title}
            </h3>

            <div className="mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-[#5C4F55]">{description}</div>

            {children}

            <div className="mt-4">
              <Button
                size="sm"
                onClick={onAction}
                disabled={isCompleted}
                className="bg-[#7FB069] text-white hover:bg-[#6FA058] disabled:opacity-50"
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
