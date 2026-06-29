"use client"

import type { ReactNode } from "react"
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
  /** Placeholder state. Phase 2 (Circadian Rhythm Engine) will drive this automatically. */
  status?: BlockStatus
  /** Optional extra content rendered inside the glass panel (e.g. a featured sub-card). */
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
  upcoming: "bg-white/25 text-white",
  completed: "bg-white/15 text-white/80",
}

export function BusinessDayBlock({
  sectionId,
  backgroundImage = "/placeholder.svg?height=560&width=1600",
  emoji,
  time,
  title,
  description,
  buttonText,
  status = "upcoming",
  children,
  onAction,
}: BusinessDayBlockProps) {
  const isCompleted = status === "completed"
  const isCurrent = status === "current"

  return (
    <section
      id={sectionId}
      aria-label={title}
      className="scroll-mt-24 w-full px-4 py-3 sm:px-6 lg:px-8"
    >
      <div
        className={`relative w-full overflow-hidden rounded-3xl shadow-lg transition-all duration-500 ${
          isCompleted ? "opacity-60" : "opacity-100"
        } ${isCurrent ? "ring-2 ring-[#7FB069] ring-offset-2 ring-offset-[#F5F1E8]" : ""}`}
      >
        {/* Per-block background image — replace only `backgroundImage` later */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage || "/placeholder.svg"}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          {/* Left-weighted wash so the glass panel text stays legible over any image */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(28,22,26,0.45) 0%, rgba(28,22,26,0.25) 45%, rgba(28,22,26,0.05) 100%)",
            }}
          />
        </div>

        {/* Content row — compact timeline card (~300px) */}
        <div className="relative z-10 flex min-h-[280px] items-center px-4 py-5 sm:px-6 md:min-h-[300px] lg:px-10">
          {/* Frosted glass content panel on the left */}
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/15 p-5 backdrop-blur-md sm:p-6">
            <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${STATUS_BADGE[status]}`}
              >
                {STATUS_LABEL[status]}
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/90">{time}</span>
            </div>

            <h3 className="text-xl font-bold leading-tight text-balance text-white sm:text-2xl">
              {emoji ? <span className="mr-2">{emoji}</span> : null}
              {title}
            </h3>

            <div className="mt-2 line-clamp-2 text-pretty text-sm leading-relaxed text-white/90">{description}</div>

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
      </div>
    </section>
  )
}
