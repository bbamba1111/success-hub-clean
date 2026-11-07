"use client"

/**
 * SleepTrackerMorningCard — the next-morning completion surface for the
 * Sleep Tracker™, shown inside Flex Time™.
 *
 * The Sleep Tracker™ intention is set the previous evening during Power Down™;
 * the actual sleep is logged the following morning. This card surfaces that
 * outstanding "From last night" item at the top of Flex Time™ — available from
 * first login and staying put until the founder completes it — WITHOUT
 * interrupting Morning GIV•EN™ (it is an inline card, never a modal or a
 * forced step).
 *
 * It renders nothing unless there is a pending intention whose morning has
 * arrived, so it quietly disappears once sleep is logged (or when there is
 * nothing to complete).
 */

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Moon, Sunrise } from "lucide-react"
import { SleepTrackerWidget } from "@/components/planners/sleep-tracker-widget"
import { getPendingSleepIntention, isSleepIntentionActionable } from "@/lib/daily-plan/sleep-tracker-storage"

export function SleepTrackerMorningCard() {
  const [mounted, setMounted] = useState(false)
  const [actionable, setActionable] = useState(false)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const check = () => {
      const pending = getPendingSleepIntention()
      setActionable(!!pending && isSleepIntentionActionable(pending))
    }
    check()
    setMounted(true)
    // The pending record clears when sleep is logged and the morning may tick
    // over while the page is open — re-check periodically so the card appears
    // and disappears on its own.
    const interval = setInterval(check, 30_000)
    // Also re-check when returning to the tab (e.g. logging in for the morning).
    const onVisible = () => check()
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  if (!mounted || !actionable) return null

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border-2 border-[#7FB069]/40 bg-[#7FB069]/[0.06] shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7FB069]/15 text-[#5c8a45]">
          <Moon className="h-5 w-5" aria-hidden />
        </span>
        <span className="flex-1">
          <span className="flex items-center gap-1.5 font-sans text-xs font-extrabold uppercase tracking-[0.14em] text-[#5c8a45]">
            <Sunrise className="h-3.5 w-3.5" aria-hidden />
            From Last Night
          </span>
          <span className="mt-0.5 block font-sans text-base font-bold text-brand-ink">
            Complete your Sleep Tracker™
          </span>
          <span className="mt-0.5 block font-sans text-sm text-brand-ink-soft">
            Log how you actually slept — before Morning GIV•EN™ begins.
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#5c8a45] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#7FB069]/25 bg-white px-4 py-6 sm:px-6">
              <SleepTrackerWidget />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SleepTrackerMorningCard
