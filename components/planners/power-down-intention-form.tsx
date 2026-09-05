"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react"
import {
  savePowerDownDeclaration,
  loadPowerDownDeclaration,
  type PowerDownDeclaration,
} from "@/lib/daily-plan/power-down-declaration"

const GLASS_REVEAL_MS = 9000

const POWER_DOWN_ACTIVITIES = [
  "Reading for pleasure", "Journaling", "Gentle stretch", "Warm bath or shower",
  "Herbal tea, no screens", "Meditation", "Gratitude list", "Screens off early",
  "Quiet music", "Time with family", "Skincare ritual", "Tidying tomorrow's space",
  "Nothing — just rest", "Other",
]

const SLEEP_HOURS_OPTIONS = [6, 6.5, 7, 7.5, 8, 8.5, 9]

function formatHours(h: number): string {
  const whole = Math.floor(h)
  const mins = Math.round((h - whole) * 60)
  return mins > 0 ? `${whole}h ${mins}m` : `${whole}h`
}

/** Joins a list of selections into natural language: "A", "A and B", "A, B, and C". */
function joinNaturally(items: string[]): string {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
}

function buildDeclaration(activities: string[], sleepHours: number): string {
  if (activities.length === 0 || !sleepHours) return ""
  const joined = joinNaturally(activities.map((a) => a.toLowerCase()))
  return `I am someone who protects my Power Down™ and honours my rest. Tonight I commit to ${joined}, and to ${formatHours(sleepHours)} of sleep starting at 11:00 PM — because rest is what makes tomorrow's clarity possible.`
}

/**
 * PowerDownIntentionForm — Step 1 of 3, and the ONLY step that lives inside
 * the "Power Down" collapsible in Decide & Design™. Mirrors
 * `MovementIntentionForm` / `LunchIntentionForm` exactly — no duration is
 * set or tracked; this protected window is honoured, not timed. Also
 * captures planned sleep hours for the 11 PM Unplug Digital Detox™ window,
 * so Power Down and tonight's sleep intention arrive as ONE combined
 * declaration rather than two separate ones. Building a declaration here
 * saves it to the shared Power Down Declaration™ store; Steps 2 (read +
 * declare) and 3 (completion check-in) then populate on their own inside
 * the real Power Down™ segment later in the day, alongside the
 * always-present Power Down History™, Sleep Tracker™, and Sleep History™.
 */
export function PowerDownIntentionForm() {
  const [activities, setActivities] = useState<string[]>([])
  const [customActivity, setCustomActivity] = useState("")
  const [sleepHours, setSleepHours] = useState(0)
  const [built, setBuilt] = useState<PowerDownDeclaration | null>(null)
  const [showGlass, setShowGlass] = useState(false)
  const glassTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setBuilt(loadPowerDownDeclaration())
    return () => {
      if (glassTimerRef.current) clearTimeout(glassTimerRef.current)
    }
  }, [])

  const toggleActivity = (a: string) => {
    setActivities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  const addCustomActivity = () => {
    const value = customActivity.trim()
    if (!value || activities.includes(value)) return
    setActivities((prev) => [...prev, value])
    setCustomActivity("")
  }

  const handleBuild = () => {
    if (activities.length === 0 || !sleepHours) return
    const record = savePowerDownDeclaration({
      activities,
      sleepHours,
      declaration: buildDeclaration(activities, sleepHours),
    })
    setBuilt(record)
    setShowGlass(true)
    if (glassTimerRef.current) clearTimeout(glassTimerRef.current)
    glassTimerRef.current = setTimeout(() => setShowGlass(false), GLASS_REVEAL_MS)
  }

  const handleEdit = () => {
    if (built) {
      setActivities(built.activities)
      setSleepHours(built.sleepHours)
    }
    setBuilt(null)
  }

  if (built) {
    return (
      <>
        {/* Glass reveal — the declaration itself holds mid-screen for 9 seconds,
            then drops away, as if descending into the real Power Down™ segment. */}
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
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#3A4A7A]">
                Your Power Down Declaration™
              </p>
              <p className="mt-2 font-serif text-lg italic leading-snug text-[#1F1F2A]">{built.declaration}</p>
              <p className="mt-3 font-montserrat text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3A4A7A]/80">
                Arriving in your Power Down™ …
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4 rounded-2xl border-2 border-[#5B6EA8]/30 bg-[#5B6EA8]/5 px-5 py-6 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-[#5B6EA8]" aria-hidden />
          <div>
            <p className="font-sans text-base font-bold text-[#2E1F27]">Your Power Down Declaration™ is ready</p>
            <p className="mt-1 font-sans text-sm text-[#6B5860]">{joinNaturally(built.activities)}</p>
          </div>
          <p className="mx-auto max-w-sm font-sans text-sm leading-relaxed text-[#6B5860]">
            It will appear at the top of your{" "}
            <span className="font-semibold text-[#2E1F27]">Power Down™</span> — open it and you&apos;ll see it
            arrive, ready to read aloud and declare.
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
        <p className="mb-1 font-montserrat text-xs font-semibold uppercase tracking-widest text-[#5B6EA8]">
          Step 1 of 3
        </p>
        <h4 className="mb-1 font-sans text-xl font-bold text-[#2E1F27]">Set My Power Down Intention™</h4>
        <p className="font-sans text-sm text-[#6B5860]">
          I will transform your intention into an Intention Declaration™ you will live from, tonight.
        </p>
      </div>

      <div>
        <p className="mb-3 font-sans text-sm font-semibold text-[#2E1F27]">
          Choose one or more activities below … or add your own
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {POWER_DOWN_ACTIVITIES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={activities.includes(t)}
              onClick={() => toggleActivity(t)}
              className={`rounded-full border px-3 py-1.5 font-sans text-sm transition-all ${
                activities.includes(t)
                  ? "border-[#5B6EA8] bg-[#5B6EA8] font-semibold text-white"
                  : "border-[#E5E5E5] bg-white text-[#3A2E33] hover:border-[#5B6EA8] hover:text-[#5B6EA8]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Or type your own plan…"
            value={customActivity}
            onChange={(e) => setCustomActivity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault()
                addCustomActivity()
              }
            }}
            className="flex-1 rounded-lg border border-[#E5E5E5] px-3 py-2 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5B6EA8]/40"
          />
          <button
            type="button"
            onClick={addCustomActivity}
            disabled={!customActivity.trim()}
            className="rounded-lg border border-[#5B6EA8]/40 px-4 py-2 font-sans text-sm font-semibold text-[#3A4A7A] transition-colors hover:bg-[#5B6EA8]/10 disabled:opacity-40"
          >
            Add
          </button>
        </div>
        {activities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activities.map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#5B6EA8]/10 px-3 py-1 font-sans text-xs font-semibold text-[#3A4A7A]"
              >
                {a}
                <button
                  type="button"
                  onClick={() => toggleActivity(a)}
                  aria-label={`Remove ${a}`}
                  className="text-[#3A4A7A]/60 hover:text-[#3A4A7A]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-1 font-sans text-sm font-semibold text-[#2E1F27]">
          How many hours are you planning to sleep tonight?
        </p>
        <p className="mb-3 font-sans text-xs text-[#6B5860]">
          Your Unplug Digital Detox™ begins at 11:00 PM — this becomes part of the same declaration.
        </p>
        <div className="flex flex-wrap gap-2">
          {SLEEP_HOURS_OPTIONS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setSleepHours(h)}
              className={`rounded-full border px-3 py-1.5 font-sans text-sm transition-all ${
                sleepHours === h
                  ? "border-[#5B6EA8] bg-[#5B6EA8] font-semibold text-white"
                  : "border-[#E5E5E5] bg-white text-[#3A2E33] hover:border-[#5B6EA8] hover:text-[#5B6EA8]"
              }`}
            >
              {formatHours(h)}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleBuild}
        disabled={activities.length === 0 || !sleepHours}
        className="w-full bg-[#5B6EA8] py-6 text-base font-semibold text-white hover:bg-[#4A5D97] disabled:opacity-40"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Build My Declaration <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
