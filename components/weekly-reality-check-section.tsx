"use client"

/**
 * WeeklyRealityCheckSection — an inline, expandable module that sits directly
 * beneath the Time Freedom™ segment card.
 *
 * IMPORTANT: This is NOT a Business Day boundary and NOT part of the schedule.
 * It is a guided 90-minute experience that takes place *inside* the protected
 * Time Freedom™ window:
 *
 *   TIME FREEDOM™                    = the protected time-space boundary
 *   WEEKLY WORK-LIFE BALANCE
 *     REALITY CHECK™                 = the guided experience happening within it
 *
 * When opened, the completed diagnostic flow (BoundaryReportJourney) expands
 * inline — no modal, no drawer, no navigation away. The two live rooms each
 * week are Thursday 6:00–7:30 PM ET and Sunday 11:00 AM–12:30 PM ET; the
 * module surfaces a live / starting-soon state during those windows.
 */

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { BoundaryReportJourney } from "@/components/boundary-report/boundary-report-journey"

type SessionState = "live" | "soon" | "none"

type LiveSession = {
  state: SessionState
  /** The window the member is currently inside or approaching. */
  activeLabel: string
}

/** Resolve the current weekday (0=Sun) and minutes-since-midnight in ET. */
function etDayAndMinutes(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now)
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun"
  // hour12:false renders midnight as "24" in some engines — normalize to 0.
  const rawHour = Number(parts.find((p) => p.type === "hour")?.value ?? "0")
  const hour = rawHour === 24 ? 0 : rawHour
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0")
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return { day: dayMap[weekday] ?? 0, minutes: hour * 60 + minute }
}

const SESSIONS = [
  { day: 4, start: 18 * 60, end: 18 * 60 + 90, label: "Thursday · 6:00–7:30 PM ET" },
  { day: 0, start: 11 * 60, end: 11 * 60 + 90, label: "Sunday · 11:00 AM–12:30 PM ET" },
] as const

function getLiveSession(now: Date): LiveSession {
  const { day, minutes } = etDayAndMinutes(now)
  for (const s of SESSIONS) {
    if (day !== s.day) continue
    if (minutes >= s.start && minutes < s.end) return { state: "live", activeLabel: s.label }
    if (minutes >= s.start - 30 && minutes < s.start) return { state: "soon", activeLabel: s.label }
  }
  return { state: "none", activeLabel: "" }
}

export function WeeklyRealityCheckSection() {
  const [open, setOpen] = useState(false)

  // The live/soon state depends on the current instant, so compute it only
  // after mount (server and client agree on a neutral first paint) and tick
  // every 30s so the badge flips into/out of the window on its own.
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  const session: LiveSession = now ? getLiveSession(now) : { state: "none", activeLabel: "" }
  const isActive = session.state !== "none"

  return (
    <section
      id="weekly-reality-check"
      aria-label="Weekly Work-Life Balance Reality Check"
      className="scroll-mt-24 w-full px-4 py-3 sm:px-6 lg:px-8"
    >
      {/* Connective tissue — a short vertical thread visually tying this module
          to the Time Freedom™ card directly above it, reinforcing that the
          Reality Check happens *within* Time Freedom™. */}
      <div className="mx-auto -mt-1 mb-2 flex justify-center" aria-hidden="true">
        <span className="h-5 w-px bg-gradient-to-b from-transparent to-[#C13B6B]/35" />
      </div>

      <div
        className={`relative w-full overflow-hidden rounded-3xl shadow-lg transition-shadow duration-500 ${
          session.state === "live" ? "ring-2 ring-[#C13B6B]/45 ring-offset-2 ring-offset-[#F5F1E8]" : ""
        }`}
        style={{
          background: "linear-gradient(135deg, #FDF6F0 0%, #FBF0F4 45%, #F0F5EE 100%)",
        }}
      >
        {/* Header — always visible. Acts as the accordion toggle. */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="weekly-reality-check-panel"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full flex-col gap-4 px-5 py-6 text-left sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7"
        >
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#78AD7D]">
                Inside Time Freedom™
              </span>
              {isActive && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
                  style={{ backgroundColor: session.state === "live" ? "#C13B6B" : "#4A7C59" }}
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70"
                      style={{ animationDuration: "1.6s" }}
                    />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  {session.state === "live" ? "Live Now" : "Starting Soon"}
                </span>
              )}
            </div>

            <h2 className="font-playfair text-xl font-semibold leading-tight text-[#1C161A] text-balance sm:text-2xl">
              Weekly Work-Life Balance Reality Check™
            </h2>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#5C4F55]">
              The Reality Check™ is where you see what your business is actually making possible in your life.
            </p>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#5C4F55]">
              A guided 90-minute experience with Thought Leader Barbara.
            </p>

            {/* Both weekly live windows — the currently active one is emphasized. */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {SESSIONS.map((s) => {
                const activeThis = isActive && session.activeLabel === s.label
                return (
                  <span
                    key={s.label}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
                      activeThis
                        ? "bg-[#C13B6B]/12 text-[#A8305C] ring-1 ring-[#C13B6B]/25"
                        : "bg-black/[0.04] text-[#6B5860]"
                    }`}
                  >
                    {s.label}
                  </span>
                )
              })}
            </div>
          </div>

          <span
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[#C13B6B] px-4 py-2 font-montserrat text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#A8305C] sm:self-center"
          >
            {open ? "Close Reality Check" : "Open Reality Check"}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </span>
        </button>

        {/* Expanded panel — the completed guided diagnostic renders inline. */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="weekly-reality-check-panel"
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#C13B6B]/12 bg-white/40">
                <BoundaryReportJourney />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
