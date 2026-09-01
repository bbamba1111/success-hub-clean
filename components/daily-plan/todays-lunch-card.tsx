"use client"

/**
 * Today's Lunch card — the real Extended Healthy Hybrid Lunch Break™ segment.
 *
 * Step 1 (Set My Lunch Break Intention™) lives in Decide & Design™ and hands
 * off a `LunchDeclaration` through `lib/daily-plan/lunch-declaration`. This
 * card is where Steps 2 and 3 actually happen — mirrors `TodaysMovementCard`
 * exactly, minus any duration tracking:
 *
 *   Step 2 — Read + declare it. Shows the moment the founder opens this
 *            segment, so she reads it aloud and lives from it.
 *   Step 3 — Wrap-up. Auto-appears 5 minutes after she arrives here, asking
 *            how lunch went and whether she took it at all.
 *
 * The Lunch Break History™ is always visible below, regardless of where
 * today's declaration/wrap-up stands.
 */

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, Sparkles } from "lucide-react"
import {
  loadLunchDeclaration,
  markLunchDeclarationStarted,
  minutesElapsedSinceLunchStart,
  clearLunchDeclaration,
  LUNCH_DECLARATION_EVENT,
  LUNCH_WRAP_UP_MINUTES,
  type LunchDeclaration,
} from "@/lib/daily-plan/lunch-declaration"
import {
  loadLunchHistory,
  saveLunchLogEntry,
  deleteLunchLogEntry,
  type LunchLogEntry,
} from "@/lib/daily-plan/lunch-history"
import { LunchHistoryList } from "@/components/planners/lunch-history-list"
import { MiddayTimeFreedomSocial } from "@/components/midday-time-freedom-social"

type CompletionStatus = "yes" | "partially" | "no"

export function TodaysLunchCard() {
  const [mounted, setMounted] = useState(false)
  const [declaration, setDeclaration] = useState<LunchDeclaration | null>(null)
  const [history, setHistory] = useState<LunchLogEntry[]>([])
  const [showWrapUp, setShowWrapUp] = useState(false)
  const [loggedToday, setLoggedToday] = useState(false)

  // Step 3 fields
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null)
  const [reflection, setReflection] = useState("")

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = () => {
    const d = loadLunchDeclaration()
    setDeclaration(d)
    setHistory(loadLunchHistory())
    if (d) {
      markLunchDeclarationStarted(d.dateKey)
      const elapsed = minutesElapsedSinceLunchStart(d.dateKey)
      setShowWrapUp(elapsed !== null && elapsed >= LUNCH_WRAP_UP_MINUTES)
    }
  }

  useEffect(() => {
    refresh()
    setMounted(true)
    pollRef.current = setInterval(refresh, 15000)
    window.addEventListener(LUNCH_DECLARATION_EVENT, refresh)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      window.removeEventListener(LUNCH_DECLARATION_EVENT, refresh)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = () => {
    if (!declaration || !completionStatus) return
    const now = new Date().toISOString()
    const entry: LunchLogEntry = {
      id: Date.now().toString(),
      date: now.split("T")[0],
      activity: declaration.activity,
      declaration: declaration.declaration,
      completionStatus,
      reflection,
    }
    setHistory(saveLunchLogEntry(entry))
    setLoggedToday(true)
  }

  const deleteEntry = (id: string) => setHistory(deleteLunchLogEntry(id))

  const handleNewIntention = () => {
    clearLunchDeclaration()
    setDeclaration(null)
    setShowWrapUp(false)
    setLoggedToday(false)
    setCompletionStatus(null)
    setReflection("")
    window.location.href = "/?openSpace=monday-debrief"
  }

  if (!mounted) return null

  return (
    <div className="px-7 py-6 space-y-5">
      {/* ── Step 2: the declaration itself, or an empty state pointing back to Decide & Design ── */}
      <AnimatePresence mode="wait">
        {!declaration ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-[#E8DFE2] bg-white px-6 py-5 sm:px-7 sm:py-6"
          >
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
              Today&apos;s Lunch Declaration™
            </p>
            <p className="mt-2 font-sans text-sm text-[#3A2E33]">
              You haven&apos;t set today&apos;s Lunch Break Intention™ yet.
            </p>
            <a
              href="/?openSpace=monday-debrief"
              className="mt-3 inline-flex items-center rounded-full border border-[#E26C73]/40 bg-white px-4 py-2 font-sans text-xs font-semibold text-[#3A2E33] transition-colors hover:bg-[#FDF3F4]"
            >
              Set it in Decide &amp; Design™
            </a>
          </motion.div>
        ) : (
          <motion.div
            key={declaration.builtAt}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="rounded-3xl border-2 border-[#E26C73]/30 bg-[#E26C73]/5 px-6 py-6 sm:px-7 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
                Step 2 · My Intention Declaration™
              </p>
              <span className="rounded-full bg-[#E26C73]/15 px-2.5 py-1 font-montserrat text-[10px] font-semibold text-[#C0545A]">
                {declaration.activity}
              </span>
            </div>
            <p className="font-serif text-lg italic leading-relaxed text-[#2E1F27] sm:text-xl">
              {declaration.declaration}
            </p>
            <p className="font-sans text-sm text-[#6B5860]">Read it aloud. Step away and live from it.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step 3: wrap-up, auto-arrives 5 minutes in ── */}
      <AnimatePresence>
        {declaration && showWrapUp && !loggedToday && (
          <motion.div
            key="wrap-up"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-[#E26C73]/30">
              <CardContent className="pt-6 pb-6 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-[#E26C73] uppercase tracking-widest mb-1">Step 3 · Wrap Up</p>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">How was lunch?</h4>
                  <p className="text-sm text-gray-500">
                    Your intention was{" "}
                    <span className="font-semibold text-gray-700">{declaration.activity.toLowerCase()}</span>.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Did you take your lunch break?</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(["yes", "partially", "no"] as const).map((status) => {
                      const labels = { yes: "Yes, fully", partially: "Partially", no: "Not this time" }
                      const active = {
                        yes: "border-[#7FB069] bg-[#7FB069]/10 text-[#7FB069]",
                        partially: "border-amber-400 bg-amber-50 text-amber-700",
                        no: "border-[#E26C73] bg-[#E26C73]/10 text-[#E26C73]",
                      }
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setCompletionStatus(status)}
                          className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                            completionStatus === status ? active[status] : "border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          {labels[status]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">How was it? (optional)</p>
                  <Textarea
                    placeholder="What did you notice? What nourished you?"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={3}
                    className="resize-none border-gray-200 text-sm"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={!completionStatus}
                  className="w-full bg-[#E26C73] hover:bg-[#D05A60] text-white py-6 text-base font-semibold disabled:opacity-40"
                >
                  Save &amp; Celebrate
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Celebrate, once logged ── */}
      <AnimatePresence>
        {loggedToday && (
          <motion.div
            key="celebrate"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-2 border-[#E26C73]/30 text-center">
              <CardContent className="pt-10 pb-10 space-y-4">
                <div className="text-5xl mb-2">🌸</div>
                <h4 className="text-xl font-bold text-[#E26C73]">
                  {completionStatus === "yes"
                    ? "You protected your break fully. That's everything."
                    : completionStatus === "partially"
                      ? "Partial rest is still rest. You still stepped away."
                      : "You were honest with yourself. That matters."}
                </h4>
                <Button
                  onClick={handleNewIntention}
                  className="mt-4 bg-[#E26C73] hover:bg-[#D05A60] text-white px-8 py-5 font-semibold"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Set a New Intention <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lunch Break History™ — always present ── */}
      <LunchHistoryList history={history} onDelete={deleteEntry} />

      {/* ── Midday & Time Freedom Moments™ — moved here from Decide & Design's
          lunch collapsible, renamed, now living in the real Lunch Break™ segment ── */}
      <MiddayTimeFreedomSocial active={mounted} />
    </div>
  )
}
