"use client"

/**
 * Today's Power Down™ card — the real Power Down™ segment.
 *
 * Step 1 (Set My Power Down Intention™) is built in Decide & Design™, but
 * also lives right here inside a "Change My Power Down Intention™"
 * collapsible below the declaration — so a founder never has to leave this
 * space to set it for the first time or make a last-minute edit. The
 * declaration, the Sleep Intention™ tracker, and the wind-down wrap-up all
 * happen below that — mirrors `TodaysMovementCard` / `TodaysLunchCard`
 * exactly, minus any duration tracking:
 *
 *   Declaration — Read + declare it. Shows the moment the founder opens this
 *            segment, so she reads it aloud and lives from it. The
 *            declaration now combines the Power Down activity AND tonight's
 *            planned sleep hours as ONE declaration (set together in Step 1).
 *   Sleep Intention™ — set tonight's sleep intention here; the actual sleep
 *            is logged next morning in Flex Time™.
 *   Wrap-up — Auto-appears 5 minutes after she arrives here, asking how
 *            tonight's wind-down went. Sits below the Sleep Intention™.
 *
 * Today's declaration is never auto-cleared — it (and the wrap-up/celebrate
 * state) stays visible in this segment for the rest of the day, so a
 * founder can come back and review it any time before the 11 PM UNPLUG™.
 * Building a new declaration in the collapsible simply overwrites it in
 * place, resetting the declaration & wrap-up for the fresh intention.
 *
 * The Power Down History™ is always visible below. Ends in the static
 * UNPLUG™ closure banner. Text and backgrounds throughout are intentionally
 * light and green — this is a wind-down space, not a high-contrast one.
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
import { PowerDownIntentionForm } from "@/components/planners/power-down-intention-form"
import { CollapsibleSubSection } from "@/components/collapsible-sub-section"

type CompletionStatus = "yes" | "partially" | "no"

export function PowerDownReleaseCard() {
  const [mounted, setMounted] = useState(false)
  const [declaration, setDeclaration] = useState<PowerDownDeclaration | null>(null)
  const [history, setHistory] = useState<PowerDownLogEntry[]>([])
  const [showWrapUp, setShowWrapUp] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loggedToday, setLoggedToday] = useState(false)
  // Controls the inline "Change My Power Down Intention™" collapsible so
  // Step 1 can be set/edited without ever leaving this segment.
  const [editOpen, setEditOpen] = useState(false)

  // Wrap-up fields
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | null>(null)
  const [reflection, setReflection] = useState("")

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastBuiltAtRef = useRef<string | null>(null)

  const refresh = () => {
    const d = loadPowerDownDeclaration()
    setHistory(loadPowerDownHistory())
    if (d) {
      // A new declaration (fresh `builtAt`) was just built in the inline
      // editor — start the declaration & wrap-up over for it instead of
      // showing the prior wrap-up/celebrate state against the new intention.
      if (lastBuiltAtRef.current && lastBuiltAtRef.current !== d.builtAt) {
        setLoggedToday(false)
        setCompletionStatus(null)
        setReflection("")
      }
      lastBuiltAtRef.current = d.builtAt
      markPowerDownDeclarationStarted(d.dateKey)
      const elapsed = minutesElapsedSincePowerDownStart(d.dateKey)
      setShowWrapUp(elapsed !== null && elapsed >= POWER_DOWN_WRAP_UP_MINUTES)
    }
    setDeclaration(d)
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
      activity: declaration.activities.join(", "),
      sleepHours: declaration.sleepHours,
      declaration: declaration.declaration,
      completionStatus,
      reflection,
    }
    setHistory(savePowerDownLogEntry(entry))
    setLoggedToday(true)
  }

  const deleteEntry = (id: string) => setHistory(deletePowerDownLogEntry(id))

  // Opens the inline "Change My Power Down Intention™" collapsible right
  // here in the segment — tonight's celebrated declaration stays visible
  // until a new one is actually built (or until the day rolls over).
  const handleNewIntention = () => setEditOpen(true)

  if (!mounted) return null

  return (
    <div className="px-7 py-8 space-y-8">
      {/* ── The declaration itself, or an empty state pointing back to Decide & Design ── */}
      <AnimatePresence mode="wait">
        {!declaration ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-[#2F5233]/15 bg-[#F5F8F5] px-7 py-7 sm:px-8 sm:py-8"
          >
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5E8C63]">
              Tonight&apos;s Power Down Declaration™
            </p>
            <p className="mt-3 font-sans text-sm text-[#2F5233]/70">
              You haven&apos;t set tonight&apos;s Power Down Intention™ yet.
            </p>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="mt-4 inline-flex items-center rounded-full border border-[#2F5233]/30 bg-white px-4 py-2 font-sans text-xs font-semibold text-[#2F5233] transition-colors hover:bg-[#2F5233]/10"
            >
              Set It Now
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={declaration.builtAt}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="rounded-3xl border-2 border-[#2F5233]/20 bg-white px-7 py-8 sm:px-8 space-y-6"
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5E8C63]">
                My Intention Declaration™
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#2F5233]/10 px-2.5 py-1 font-montserrat text-[10px] font-semibold text-[#2F5233]">
                  {declaration.activities.join(", ")}
                </span>
                {declaration.sleepHours > 0 && (
                  <span className="rounded-full bg-[#2F5233]/10 px-2.5 py-1 font-montserrat text-[10px] font-semibold text-[#2F5233]">
                    {declaration.sleepHours}h sleep
                  </span>
                )}
              </div>
            </div>
            <p className="font-serif text-lg italic leading-relaxed text-[#2F5233] sm:text-xl">
              {declaration.declaration}
            </p>
            <p className="font-sans text-sm text-[#2F5233]/60">Read it aloud. Let the day release for real.</p>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="border-[#2F5233]/30 text-[#2F5233] hover:bg-[#2F5233]/5 bg-transparent"
            >
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied!" : "Copy to Zoom Chat"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Step 1, inline: set or change tonight's Power Down Intention™ without
          ever leaving this segment. Opens by itself when there's nothing set yet. ── */}
      <CollapsibleSubSection
        title={declaration ? "Change My Power Down Intention™" : "Set My Power Down Intention™"}
        open={editOpen}
        onOpenChange={setEditOpen}
      >
        <PowerDownIntentionForm />
      </CollapsibleSubSection>

      {/* ── Sleep Tracker™ + Sleep History™ — set tonight's sleep intention here;
             the actual sleep is logged next morning in Flex Time™. Sits above the
             wind-down wrap-up. ── */}
      <SleepTrackerWidget />

      {/* ── Wrap-up, auto-arrives 5 minutes in ── */}
      <AnimatePresence>
        {declaration && showWrapUp && !loggedToday && (
          <motion.div
            key="wrap-up"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-[#2F5233]/20">
              <CardContent className="pt-8 pb-8 space-y-7">
                <div>
                  <p className="text-xs font-semibold text-[#5E8C63] uppercase tracking-widest mb-2">Wrap Up</p>
                  <h4 className="text-xl font-semibold text-[#5E8C63] mb-2">How did tonight&apos;s Power Down go?</h4>
                  <p className="text-sm text-[#2F5233]/60">
                    Your intention was{" "}
                    <span className="font-medium text-[#2F5233]/80">
                      {declaration.activities.map((a) => a.toLowerCase()).join(", ")}
                    </span>
                    .
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#2F5233]/80 mb-3">Did you actually power down?</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(["yes", "partially", "no"] as const).map((status) => {
                      const labels = { yes: "Yes, fully", partially: "Partially", no: "Not this time" }
                      const active = {
                        yes: "border-[#5E8C63] bg-[#5E8C63]/10 text-[#5E8C63]",
                        partially: "border-[#7FA36E] bg-[#7FA36E]/10 text-[#5E7A4E]",
                        no: "border-[#2F5233] bg-[#2F5233]/10 text-[#2F5233]",
                      }
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setCompletionStatus(status)}
                          className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                            completionStatus === status
                              ? active[status]
                              : "border-[#2F5233]/15 text-[#2F5233]/70 hover:border-[#2F5233]/30"
                          }`}
                        >
                          {labels[status]}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#2F5233]/80">How was it? (optional)</p>
                  <Textarea
                    placeholder="What did you notice? What helped you release the day?"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={3}
                    className="resize-none border-[#2F5233]/20 text-sm"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={!completionStatus}
                  className="w-full bg-[#2F5233] hover:bg-[#24401E] text-white py-6 text-base font-semibold disabled:opacity-40"
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
            <Card className="border-2 border-[#2F5233]/20 text-center">
              <CardContent className="pt-12 pb-12 space-y-5">
                <div className="text-5xl mb-2">🌙</div>
                <h4 className="text-xl font-semibold text-[#5E8C63]">
                  {completionStatus === "yes"
                    ? "You released the day fully. That's everything."
                    : completionStatus === "partially"
                      ? "Partial release still counts. You still stepped back."
                      : "You were honest with yourself. That matters."}
                </h4>
                {declaration && declaration.sleepHours > 0 && (
                  <p className="text-[#2F5233]/60 text-sm max-w-xs mx-auto">
                    Tonight&apos;s plan: {declaration.sleepHours}h of sleep, starting at 11:00 PM.
                  </p>
                )}
                <Button
                  onClick={handleNewIntention}
                  className="mt-4 bg-[#2F5233] hover:bg-[#24401E] text-white px-8 py-5 font-semibold"
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

      {/* Static closure banner — no new planning, just the day's honest end. */}
      <div className="rounded-2xl bg-[#2F5233] px-6 py-6 text-center">
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
