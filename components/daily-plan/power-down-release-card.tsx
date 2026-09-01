"use client"

/**
 * Today's Power Down™ card — the real Power Down™ segment.
 *
 * Step 1 (Set My Power Down Intention™) lives in Decide & Design™ and hands
 * off a `PowerDownDeclaration` through `lib/daily-plan/power-down-declaration`.
 * This card is where Steps 2 and 3 actually happen — mirrors
 * `TodaysMovementCard` / `TodaysLunchCard` exactly, minus any duration
 * tracking:
 *
 *   Step 2 — Read + declare it. Shows the moment the founder opens this
 *            segment, so she reads it aloud and lives from it. The
 *            declaration now combines the Power Down activity AND tonight's
 *            planned sleep hours as ONE declaration (set together in Step 1).
 *   Step 3 — Wrap-up. Auto-appears 5 minutes after she arrives here, asking
 *            how tonight's wind-down went.
 *
 * The Power Down History™ is always visible below, followed by the Sleep
 * Tracker™ (bedtime/wake time + Sleep History™) so tonight's sleep can be
 * tracked without leaving this space. Ends in the static UNPLUG™ closure
 * banner. Text and backgrounds throughout are intentionally light — this is
 * a wind-down space, not a high-contrast one.
 */

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, ChevronRight, Sparkles } from "lucide-react"
import {
  loadPowerDownDeclaration,
  markPowerDownDeclarationStarted,
  minutesElapsedSincePowerDownStart,
  clearPowerDownDeclaration,
  POWER_DOWN_DECLARATION_EVENT,
  POWER_DOWN_WRAP_UP_MINUTES,
  type PowerDownDeclaration,
} from "@/lib/daily-plan/power-down-declaration"
import {
  loadPowerDownHistory,
  savePowerDownLogEntry,
  deletePowerDownLogEntry,
  type PowerDownLogEntry,
} from "@/lib/daily-plan/power-down-history"
import { PowerDownHistoryList } from "@/components/planners/power-down-history-list"
import { SleepTrackerWidget } from "@/components/planners/sleep-tracker-widget"

type CompletionStatus = "yes" | "partially" | "no"

export function PowerDownReleaseCard() {
  const [mounted, setMounted] = useState(false)
  const [declaration, setDeclaration] = useState<PowerDownDeclaration | null>(null)
  const [history, setHistory] = useState<PowerDownLogEntry[]>([])
  const [showWrapUp, setShowWrapUp] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loggedToday, setLoggedToday] = useState(false)

  // Step 3 fields
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null)
  const [reflection, setReflection] = useState("")

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = () => {
    const d = loadPowerDownDeclaration()
    setDeclaration(d)
    setHistory(loadPowerDownHistory())
    if (d) {
      markPowerDownDeclarationStarted(d.dateKey)
      const elapsed = minutesElapsedSincePowerDownStart(d.dateKey)
      setShowWrapUp(elapsed !== null && elapsed >= POWER_DOWN_WRAP_UP_MINUTES)
    }
  }

  useEffect(() => {
    refresh()
    setMounted(true)
    pollRef.current = setInterval(refresh, 15000)
    window.addEventListener(POWER_DOWN_DECLARATION_EVENT, refresh)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      window.removeEventListener(POWER_DOWN_DECLARATION_EVENT, refresh)
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
    const entry: PowerDownLogEntry = {
      id: Date.now().toString(),
      date: now.split("T")[0],
      activity: declaration.activity,
      sleepHours: declaration.sleepHours,
      declaration: declaration.declaration,
      completionStatus,
      reflection,
    }
    setHistory(savePowerDownLogEntry(entry))
    setLoggedToday(true)
  }

  const deleteEntry = (id: string) => setHistory(deletePowerDownLogEntry(id))

  const handleNewIntention = () => {
    clearPowerDownDeclaration()
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
            className="rounded-3xl border border-[#8B8FA3]/20 bg-[#F9FAFC] px-6 py-5 sm:px-7 sm:py-6"
          >
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7599]">
              Tonight&apos;s Power Down Declaration™
            </p>
            <p className="mt-2 font-sans text-sm text-[#7A7178]">
              You haven&apos;t set tonight&apos;s Power Down Intention™ yet.
            </p>
            <a
              href="/?openSpace=monday-debrief"
              className="mt-3 inline-flex items-center rounded-full border border-[#5B6EA8]/40 bg-white px-4 py-2 font-sans text-xs font-semibold text-[#3A2E33] transition-colors hover:bg-[#5B6EA8]/10"
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
            className="rounded-3xl border-2 border-[#5B6EA8]/20 bg-[#5B6EA8]/[0.025] px-6 py-6 sm:px-7 space-y-4"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7599]">
                Step 2 · My Intention Declaration™
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#5B6EA8]/10 px-2.5 py-1 font-montserrat text-[10px] font-semibold text-[#6B7599]">
                  {declaration.activity}
                </span>
                {declaration.sleepHours > 0 && (
                  <span className="rounded-full bg-[#5B6EA8]/10 px-2.5 py-1 font-montserrat text-[10px] font-semibold text-[#6B7599]">
                    {declaration.sleepHours}h sleep
                  </span>
                )}
              </div>
            </div>
            <p className="font-serif text-lg italic leading-relaxed text-[#5C5865] sm:text-xl">
              {declaration.declaration}
            </p>
            <p className="font-sans text-sm text-[#8A8090]">Read it aloud. Let the day release for real.</p>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="border-[#5B6EA8]/30 text-[#6B7599] hover:bg-[#5B6EA8]/5 bg-transparent"
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
            <Card className="border-2 border-[#5B6EA8]/20">
              <CardContent className="pt-6 pb-6 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-[#6B7599] uppercase tracking-widest mb-1">Step 3 · Wrap Up</p>
                  <h4 className="text-xl font-semibold text-gray-600 mb-1">How did tonight&apos;s Power Down go?</h4>
                  <p className="text-sm text-gray-400">
                    Your intention was{" "}
                    <span className="font-medium text-gray-500">{declaration.activity.toLowerCase()}</span>.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-3">Did you actually power down?</p>
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
                  <p className="text-sm font-medium text-gray-500">How was it? (optional)</p>
                  <Textarea
                    placeholder="What did you notice? What helped you release the day?"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={3}
                    className="resize-none border-gray-200 text-sm"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={!completionStatus}
                  className="w-full bg-[#5B6EA8] hover:bg-[#4A5D97] text-white py-6 text-base font-semibold disabled:opacity-40"
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
            <Card className="border-2 border-[#5B6EA8]/20 text-center">
              <CardContent className="pt-10 pb-10 space-y-4">
                <div className="text-5xl mb-2">🌙</div>
                <h4 className="text-xl font-semibold text-[#8890B5]">
                  {completionStatus === "yes"
                    ? "You released the day fully. That's everything."
                    : completionStatus === "partially"
                      ? "Partial release still counts. You still stepped back."
                      : "You were honest with yourself. That matters."}
                </h4>
                {declaration && declaration.sleepHours > 0 && (
                  <p className="text-gray-400 text-sm max-w-xs mx-auto">
                    Tonight&apos;s plan: {declaration.sleepHours}h of sleep, starting at 11:00 PM.
                  </p>
                )}
                <Button
                  onClick={handleNewIntention}
                  className="mt-4 bg-[#5B6EA8] hover:bg-[#4A5D97] text-white px-8 py-5 font-semibold"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Set a New Intention <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Power Down History™ — always present ── */}
      <PowerDownHistoryList history={history} onDelete={deleteEntry} />

      {/* ── Sleep Tracker™ + Sleep History™ — track tonight's actual rest without leaving Power Down ── */}
      <SleepTrackerWidget />

      {/* Static closure banner — no new planning, just the day's honest end. */}
      <div className="rounded-2xl bg-[#2E2F3A] px-5 py-4 text-center">
        <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          11:00 PM — UNPLUG™
        </p>
        <p className="mt-1 font-sans text-xs text-white/70">
          Business Closed · Screens Off · Devices Away · Day Released
        </p>
      </div>
    </div>
  )
}
