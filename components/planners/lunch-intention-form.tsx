"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react"
import {
  saveLunchDeclaration,
  loadLunchDeclaration,
  type LunchDeclaration,
} from "@/lib/daily-plan/lunch-declaration"

const GLASS_REVEAL_MS = 9000

const LUNCH_ACTIVITIES = [
  "Nourishing meal, away from my desk", "Walk outside", "Meal with a friend or colleague",
  "Cook something fresh", "Rest on the couch", "Read for pleasure", "Sit in the sun",
  "Stretch or light movement", "Journal", "Meditate", "Prep tomorrow's meals",
  "Call someone I love", "Nap", "Other",
]

function buildDeclaration(activity: string): string {
  if (!activity) return ""
  return `I am someone who protects my Extended Healthy Hybrid Lunch Break™. Today I commit to ${activity.toLowerCase()} — because a nourished body and an unrushed mind build a sustainable business.`
}

/**
 * LunchIntentionForm — Step 1 of 3, and the ONLY step that lives inside the
 * "Extended Healthy Hybrid Lunch Break" collapsible in Decide & Design™.
 * Mirrors `MovementIntentionForm` exactly — no duration is set or tracked;
 * this protected window is honoured, not timed. Building a declaration here
 * saves it to the shared Lunch Declaration™ store; Steps 2 (read + declare)
 * and 3 (completion check-in) then populate on their own inside the real
 * Lunch Break™ segment later in the day, alongside the always-present Lunch
 * Break History™.
 */
export function LunchIntentionForm() {
  const [activity, setActivity] = useState("")
  const [built, setBuilt] = useState<LunchDeclaration | null>(null)
  const [showGlass, setShowGlass] = useState(false)
  const glassTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setBuilt(loadLunchDeclaration())
    return () => {
      if (glassTimerRef.current) clearTimeout(glassTimerRef.current)
    }
  }, [])

  const handleBuild = () => {
    if (!activity) return
    const record = saveLunchDeclaration({ activity, declaration: buildDeclaration(activity) })
    setBuilt(record)
    setShowGlass(true)
    if (glassTimerRef.current) clearTimeout(glassTimerRef.current)
    glassTimerRef.current = setTimeout(() => setShowGlass(false), GLASS_REVEAL_MS)
  }

  const handleEdit = () => {
    if (built) setActivity(built.activity)
    setBuilt(null)
  }

  if (built) {
    return (
      <>
        {/* Glass reveal — the declaration itself holds mid-screen for 9 seconds,
            then drops away, as if descending into the real Lunch Break™ segment. */}
        <AnimatePresence>
          {showGlass && (
            <motion.div
              key={built.builtAt}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 240 }}
              transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
              className="pointer-events-none fixed left-1/2 top-24 z-50 w-[min(90vw,420px)] -translate-x-1/2 px-6 py-5 text-center"
              style={{
                background: "rgba(255,255,255,0.28)",
                backdropFilter: "blur(16px) saturate(1.3)",
                WebkitBackdropFilter: "blur(16px) saturate(1.3)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
                Your Lunch Declaration™
              </p>
              <p className="mt-2 font-serif text-lg italic leading-snug text-[#2E1F27]">{built.declaration}</p>
              <p className="mt-3 font-montserrat text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C0545A]/80">
                Arriving in your Lunch Break™ …
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4 rounded-2xl border-2 border-[#E26C73]/30 bg-[#E26C73]/5 px-5 py-6 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-[#E26C73]" aria-hidden />
          <div>
            <p className="font-sans text-base font-bold text-[#2E1F27]">Your Lunch Declaration™ is ready</p>
            <p className="mt-1 font-sans text-sm text-[#6B5860]">{built.activity}</p>
          </div>
          <p className="mx-auto max-w-sm font-sans text-sm leading-relaxed text-[#6B5860]">
            It will appear at the top of your{" "}
            <span className="font-semibold text-[#2E1F27]">Extended Healthy Hybrid Lunch Break™</span> — open it and
            you&apos;ll see it arrive, ready to read aloud and declare.
          </p>
          <button
            type="button"
            onClick={handleEdit}
            className="font-sans text-xs font-semibold text-[#6B5860] underline underline-offset-2 hover:text-[#2E1F27]"
          >
            Build a different declaration
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 font-montserrat text-xs font-semibold uppercase tracking-widest text-[#E26C73]">
          Step 1 of 3
        </p>
        <h4 className="mb-1 font-sans text-xl font-bold text-[#2E1F27]">Set My Lunch Break Intention™</h4>
        <p className="font-sans text-sm text-[#6B5860]">
          I will transform your intention into an Intention Declaration™ you will live from, in this break.
        </p>
      </div>

      <div>
        <p className="mb-3 font-sans text-sm font-semibold text-[#2E1F27]">
          Choose an activity below … or create your own
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {LUNCH_ACTIVITIES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActivity(t)}
              className={`rounded-full border px-3 py-1.5 font-sans text-sm transition-all ${
                activity === t
                  ? "border-[#E26C73] bg-[#E26C73] font-semibold text-white"
                  : "border-[#E5E5E5] bg-white text-[#3A2E33] hover:border-[#E26C73] hover:text-[#E26C73]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Or type your own plan…"
          value={LUNCH_ACTIVITIES.includes(activity) ? "" : activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#E26C73]/40"
        />
      </div>

      <Button
        onClick={handleBuild}
        disabled={!activity}
        className="w-full bg-[#E26C73] py-6 text-base font-semibold text-white hover:bg-[#D05A60] disabled:opacity-40"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Build My Declaration <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
