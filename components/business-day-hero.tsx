"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

type StatusKey = "LIVE" | "NEXT" | "NIGHT" | "OPEN"

const STATUS_META: Record<StatusKey, { label: string; icon: string; className: string }> = {
  LIVE: {
    label: "LIVE NOW",
    icon: "🔴",
    className: "bg-[#E26C73] text-white",
  },
  NEXT: {
    label: "STARTING NEXT",
    icon: "🟢",
    className: "bg-[#7FB069] text-white",
  },
  NIGHT: {
    label: "CLOSED FOR THE NIGHT",
    icon: "🌙",
    className: "bg-[#2E2A3A] text-white",
  },
  OPEN: {
    label: "COMMUNITY OPEN",
    icon: "🌅",
    className: "bg-white/85 text-[#5A4A52]",
  },
}

type Block = {
  /** minutes from midnight when this block begins */
  start: number
  cta: string
  status: StatusKey
}

// Ordered schedule for the Work-Life Balance Business Day™
const SCHEDULE: Block[] = [
  { start: 7 * 60 + 30, cta: "Enter Early Access™", status: "OPEN" }, // 7:30 AM
  { start: 9 * 60, cta: "Join Morning GIV•EN™", status: "LIVE" }, // 9:00 AM
  { start: 10 * 60 + 45, cta: "Start Your Movement Window™", status: "LIVE" }, // 10:45 AM
  { start: 11 * 60 + 30, cta: "Begin Lunch Break™", status: "OPEN" }, // 11:30 AM
  { start: 13 * 60 + 15, cta: "Enter CEO Workday™", status: "LIVE" }, // 1:15 PM
  { start: 18 * 60, cta: "Enjoy Time Freedom™", status: "OPEN" }, // 6:00 PM
  { start: 22 * 60 + 15, cta: "Join Power Down™", status: "LIVE" }, // 10:15 PM
  { start: 23 * 60 + 30, cta: "Community Closed", status: "NIGHT" }, // 11:30 PM
]

function resolveNow(now: Date) {
  const dayName = DAY_NAMES[now.getDay()]
  const minutes = now.getHours() * 60 + now.getMinutes()

  // Before the day opens -> night / closed
  if (minutes < SCHEDULE[0].start) {
    const minutesUntilOpen = SCHEDULE[0].start - minutes
    if (minutesUntilOpen <= 30) {
      return { dayName, status: "NEXT" as StatusKey, cta: "Enter Early Access™" }
    }
    return { dayName, status: "NIGHT" as StatusKey, cta: "Community Closed" }
  }

  // Find the active block (last block whose start has passed)
  let activeIndex = 0
  for (let i = 0; i < SCHEDULE.length; i++) {
    if (minutes >= SCHEDULE[i].start) activeIndex = i
  }

  const active = SCHEDULE[activeIndex]
  const next = SCHEDULE[activeIndex + 1]

  // If we are within 15 minutes of the next block, surface "STARTING NEXT"
  if (next && next.start - minutes <= 15) {
    return { dayName, status: "NEXT" as StatusKey, cta: next.cta }
  }

  return { dayName, status: active.status, cta: active.cta }
}

export function BusinessDayHero() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const resolved = useMemo(() => (now ? resolveNow(now) : null), [now])
  const status = resolved ? STATUS_META[resolved.status] : null

  return (
    <section className="relative w-full overflow-hidden">
      {/* Static reusable hero background */}
      <div className="absolute inset-0">
        <img
          src="/images/business-day-hero-bg.png"
          alt="Serene cherry blossom lakeside workspace at sunrise"
          className="h-full w-full object-cover"
        />
        {/* Soft left-weighted wash so the glass panel reads clearly */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,241,245,0.55) 0%, rgba(255,241,245,0.2) 38%, rgba(255,241,245,0) 60%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[460px] max-w-7xl items-center px-6 py-16 sm:min-h-[540px] lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-xl rounded-3xl border border-white/40 bg-white/25 p-8 shadow-xl backdrop-blur-md sm:p-10"
        >
          {/* Dynamic day + status row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-[#5A4A52]">
              <span aria-hidden>🌸</span>
              {resolved ? `Today is ${resolved.dayName}` : "Today"}
            </span>
            {status && (
              <motion.span
                key={status.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] shadow-sm ${status.className}`}
              >
                <span aria-hidden>{status.icon}</span>
                {status.label}
              </motion.span>
            )}
          </div>

          <h2 className="text-pretty text-4xl font-bold leading-tight text-[#C13B6B] sm:text-5xl">
            <span aria-hidden>🌸 </span>
            Today&apos;s{" "}
            <span className="text-[#7FB069]">Work-Life Balance Business Day™</span>
          </h2>

          <p className="mt-5 text-lg font-medium leading-relaxed text-[#5A4A52]">
            Practice The New 9-to-5™ &amp; Nighttime SOP{" "}
            <span className="whitespace-nowrap">(Sustainable Operating Practices™)</span>
          </p>

          <p className="mt-2 text-base italic text-[#8A6B74]">
            Live intentionally. Lead successfully.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              className="bg-[#E26C73] px-8 text-base font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              {resolved ? resolved.cta : "Enter Today's Business Day"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#7FB069] bg-white/60 px-8 text-base font-semibold text-[#5A7F46] hover:bg-white/80"
            >
              View Today&apos;s Rhythm
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
