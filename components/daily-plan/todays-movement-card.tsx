"use client"

/**
 * Today's Movement™ card — the real 30-Minute Movement Window™ segment.
 *
 * Step 1 (Set My Movement Intention™) lives in Decide & Design™ and hands
 * off a `MovementDeclaration` through `lib/daily-plan/movement-declaration`.
 * This card is where Steps 2 and 3 actually happen:
 *
 *   Step 2 — Read + declare it. Shows the moment the founder opens this
 *            segment, so she reads it aloud and lives from it.
 *   Step 3 — Wrap-up. Auto-appears 5 minutes after she arrives here, so she
 *            can log how it went.
 *
 * The Movement Tracker™ (weekly stats) and Movement History™ (past
 * sessions) are always visible below, regardless of where today's
 * declaration/wrap-up stands.
 */

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, ChevronRight, Sparkles } from "lucide-react"
import {
  loadMovementDeclaration,
  markMovementDeclarationStarted,
  minutesElapsedSinceStart,
  clearMovementDeclaration,
  MOVEMENT_DECLARATION_EVENT,
  MOVEMENT_WRAP_UP_MINUTES,
  type MovementDeclaration,
} from "@/lib/daily-plan/movement-declaration"
import {
  loadMovementHistory,
  saveWorkoutEntry,
  deleteWorkoutEntry,
  getWeeklyMovementStats,
  type WorkoutEntry,
} from "@/lib/daily-plan/movement-history"
import { MovementTrackerStats } from "@/components/planners/movement-tracker-stats"
import { MovementHistoryList } from "@/components/planners/movement-history-list"

type CompletionStatus = "yes" | "partially" | "no"

export function TodaysMovementCard() {
  const [mounted, setMounted] = useState(false)
  const [declaration, setDeclaration] = useState<MovementDeclaration | null>(null)
  const [history, setHistory] = useState<WorkoutEntry[]>([])
  const [showWrapUp, setShowWrapUp] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loggedToday, setLoggedToday] = useState(false)

  // Step 3 fields
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null)
  const [completedDuration, setCompletedDuration] = useState(30)
  const [reflection, setReflection] = useState("")

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = () => {
    const d = loadMovementDeclaration()
    setDeclaration(d)
    setHistory(loadMovementHistory())
    if (d) {
      markMovementDeclarationStarted(d.dateKey)
      const elapsed = minutesElapsedSinceStart(d.dateKey)
      setShowWrapUp(elapsed !== null && elapsed >= MOVEMENT_WRAP_UP_MINUTES)
      setCompletedDuration((prev) => (prev === 30 ? d.duration : prev))
    }
  }

  useEffect(() => {
    refresh()
    setMounted(true)
    pollRef.current = setInterval(refresh, 15000)
    window.addEventListener(MOVEMENT_DECLARATION_EVENT, refresh)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      window.removeEventListener(MOVEMENT_DECLARATION_EVENT, refresh)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCopy = async () => {
    if (!declaration) return
    try {
      await navigator.clipboard.writeText(declaration.declaration)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {}
  }

  const handleSave = () => {
    if (!declaration || !completionStatus) return
    const now = new Date().toISOString()
    const entry: WorkoutEntry = {
      id: Date.now().toString(),
      date: now.split("T")[0],
      type: declaration.type,
      duration: completionStatus === "partially" ? completedDuration : declaration.duration,
      declaration: declaration.declaration,
      completionStatus,
      completedDuration: completionStatus === "partially" ? completedDuration : undefined,
      reflection,
    }
    setHistory(saveWorkoutEntry(entry))
    setLoggedToday(true)
  }

  const deleteEntry = (id: string) => setHistory(deleteWorkoutEntry(id))

  const handleNewIntention = () => {
    clearMovementDeclaration()
    setDeclaration(null)
    setShowWrapUp(false)
    setLoggedToday(false)
    setCompletionStatus(null)
    setReflection("")
    window.location.href = "/?openSpace=monday-debrief"
  }

  if (!mounted) return null

  const weeklyStats = getWeeklyMovementStats(history)

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
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
              Today&apos;s Movement Declaration™
            </p>
            <p className="mt-2 font-sans text-sm text-[#3A2E33]">
              You haven&apos;t set today&apos;s Movement Intention™ yet.
            </p>
            <a
              href="/?openSpace=monday-debrief"
              className="mt-3 inline-flex items-center rounded-full border border-[#8DAE72]/40 bg-white px-4 py-2 font-sans text-xs font-semibold text-[#3A2E33] transition-colors hover:bg-[#F4F7F0]"
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
            className="rounded-3xl border-2 border-[#7FB069]/30 bg-[#7FB069]/5 px-6 py-6 sm:px-7 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
                Step 2 · My Intention Declaration™
              </p>
              <span className="rounded-full bg-[#7FB069]/15 px-2.5 py-1 font-montserrat text-[10px] font-semibold text-[#3A6B3E]">
                {declaration.duration} min · {declaration.type}
              </span>
            </div>
            <p className="font-serif text-lg italic leading-relaxed text-[#2E1F27] sm:text-xl">
              {declaration.declaration}
            </p>
            <p className="font-sans text-sm text-[#6B5860]">Read it aloud. Live from it for the next few minutes.</p>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="border-[#7FB069]/40 text-[#3A6B3E] hover:bg-[#7FB069]/10 bg-transparent"
            >
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied!" : "Copy to Zoom Chat"}
            </Button>
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
            <Card className="border-2 border-[#7FB069]/30">
              <CardContent className="pt-6 pb-6 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-[#7FB069] uppercase tracking-widest mb-1">Step 3 · Wrap Up</p>
                  <h4 className="text-xl font-bold text-gray-800 mb-1">How did it go?</h4>
                  <p className="text-sm text-gray-500">
                    Your intention was{" "}
                    <span className="font-semibold text-gray-700">
                      {declaration.duration} min of {declaration.type}
                    </span>
                    .
                  </p>
                </div>

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

                {completionStatus === "partially" && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">How many minutes did you complete?</p>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={1}
                        max={declaration.duration}
                        value={completedDuration}
                        onChange={(e) => setCompletedDuration(Number(e.target.value))}
                        className="flex-1 accent-[#7FB069]"
                      />
                      <span className="text-lg font-bold text-[#7FB069] w-16 text-right">{completedDuration} min</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Reflection (optional)</p>
                  <Textarea
                    placeholder="How did you feel? What did you notice?"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={3}
                    className="resize-none border-gray-200 text-sm"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={!completionStatus}
                  className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white py-6 text-base font-semibold disabled:opacity-40"
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
            <Card className="border-2 border-[#7FB069]/30 text-center">
              <CardContent className="pt-10 pb-10 space-y-4">
                <div className="text-5xl mb-2">🌸</div>
                <h4 className="text-xl font-bold text-[#7FB069]">
                  {completionStatus === "yes"
                    ? "You showed up fully. That's everything."
                    : completionStatus === "partially"
                      ? "Partial is powerful. You still moved."
                      : "You were honest with yourself. That matters."}
                </h4>
                <Button
                  onClick={handleNewIntention}
                  className="mt-4 bg-[#7FB069] hover:bg-[#6FA055] text-white px-8 py-5 font-semibold"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Set a New Intention <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Movement Tracker™ + Movement History™ — always present ── */}
      <MovementTrackerStats stats={weeklyStats} />
      <MovementHistoryList history={history} onDelete={deleteEntry} />
    </div>
  )
}
