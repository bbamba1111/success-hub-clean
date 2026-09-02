"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react"
import {
  saveMovementDeclaration,
  loadMovementDeclaration,
  type MovementDeclaration,
} from "@/lib/daily-plan/movement-declaration"

const GLASS_REVEAL_MS = 8000

// Ordered by general popularity among movement & exercise routines (most‑practiced first),
// so the most likely choices are fastest to find and tap.
const WORKOUT_TYPES = [
  "Walking", "Running", "Strength Training", "Yoga", "Cycling",
  "HIIT", "Swimming", "Pilates", "Stretching", "Dance",
  "CrossFit", "Boxing", "Kickboxing", "Zumba", "Rowing",
  "Jump Rope", "Barre", "Tai Chi", "Qigong", "Radio Taiso", "Other",
]

const MIN_DURATION = 1
const MAX_DURATION = 30

/** Joins a list of selections into natural language: "A", "A and B", "A, B, and C". */
function joinNaturally(items: string[]): string {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
}

function buildDeclaration(types: string[], duration: number): string {
  if (types.length === 0) return ""
  return `I am someone who moves their body with intention. Today I commit to ${duration} minutes of ${joinNaturally(
    types,
  )} — not because I have to, but because I choose to show up for myself.`
}

/**
 * MovementIntentionForm — Step 1 of 3, and the ONLY step that lives inside
 * the "30-Minute Movement Window" collapsible in Decide & Design™. Building
 * a declaration here saves it to the shared Movement Declaration™ store;
 * Steps 2 (read + declare) and 3 (completion check-in) then populate on
 * their own inside the real 30-Minute Movement Window™ segment later in the
 * day, alongside the always-present Movement Tracker™ and Movement History™.
 */
export function MovementIntentionForm() {
  const [types, setTypes] = useState<string[]>([])
  const [customType, setCustomType] = useState("")
  const [duration, setDuration] = useState(30)
  const [built, setBuilt] = useState<MovementDeclaration | null>(null)
  const [showGlass, setShowGlass] = useState(false)
  const glassTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setBuilt(loadMovementDeclaration())
    return () => {
      if (glassTimerRef.current) clearTimeout(glassTimerRef.current)
    }
  }, [])

  const toggleType = (t: string) => {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  const addCustomType = () => {
    const value = customType.trim()
    if (!value || types.includes(value)) return
    setTypes((prev) => [...prev, value])
    setCustomType("")
  }

  const handleBuild = () => {
    if (types.length === 0) return
    const record = saveMovementDeclaration({ types, duration, declaration: buildDeclaration(types, duration) })
    setBuilt(record)
    setShowGlass(true)
    if (glassTimerRef.current) clearTimeout(glassTimerRef.current)
    glassTimerRef.current = setTimeout(() => setShowGlass(false), GLASS_REVEAL_MS)
  }

  const handleEdit = () => {
    if (built) {
      setTypes(built.types)
      setDuration(built.duration)
    }
    setBuilt(null)
  }

  if (built) {
    return (
      <>
        {/* Glass reveal — dynamic-hero-message style: the declaration itself holds mid-screen for
            8 seconds, then drops away, as if descending into the real 30-Minute Movement Window™. */}
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
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#3A6B3E]">
                Your Movement Declaration™
              </p>
              <p className="mt-2 font-serif text-lg italic leading-snug text-[#1F2A1F]">{built.declaration}</p>
              <p className="mt-3 font-montserrat text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3A6B3E]/80">
                Arriving in your 30-Minute Movement Window™ …
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4 rounded-2xl border-2 border-[#7FB069]/30 bg-[#7FB069]/5 px-5 py-6 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-[#7FB069]" aria-hidden />
          <div>
            <p className="font-sans text-base font-bold text-[#2E1F27]">Your Movement Declaration™ is ready</p>
            <p className="mt-1 font-sans text-sm text-[#6B5860]">
              {built.duration} minutes of {joinNaturally(built.types)}
            </p>
          </div>
          <p className="mx-auto max-w-sm font-sans text-sm leading-relaxed text-[#6B5860]">
            It will appear at the top of your{" "}
            <span className="font-semibold text-[#2E1F27]">30-Minute Movement Window™</span> — open it and you&apos;ll
            see it arrive, ready to read aloud and declare.
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
        <p className="mb-1 font-montserrat text-xs font-semibold uppercase tracking-widest text-[#7FB069]">
          Step 1 of 3
        </p>
        <h4 className="mb-1 font-sans text-xl font-bold text-[#2E1F27]">Set My Movement Intention™</h4>
        <p className="font-sans text-sm text-[#6B5860]">
          I will transform your intention into an Intention Declaration™ you will live from, in this segment.
        </p>
      </div>

      <div>
        <p className="mb-3 font-sans text-sm font-semibold text-[#2E1F27]">
          Choose one or more activities below … or add your own
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {WORKOUT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={types.includes(t)}
              onClick={() => toggleType(t)}
              className={`rounded-full border px-3 py-1.5 font-sans text-sm transition-all ${
                types.includes(t)
                  ? "border-[#7FB069] bg-[#7FB069] font-semibold text-white"
                  : "border-[#E5E5E5] bg-white text-[#3A2E33] hover:border-[#7FB069] hover:text-[#7FB069]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Or type your own activity…"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault()
                addCustomType()
              }
            }}
            className="flex-1 rounded-lg border border-[#E5E5E5] px-3 py-2 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
          />
          <button
            type="button"
            onClick={addCustomType}
            disabled={!customType.trim()}
            className="rounded-lg border border-[#7FB069]/40 px-4 py-2 font-sans text-sm font-semibold text-[#3A6B3E] transition-colors hover:bg-[#7FB069]/10 disabled:opacity-40"
          >
            Add
          </button>
        </div>
        {types.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {types.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#7FB069]/10 px-3 py-1 font-sans text-xs font-semibold text-[#3A6B3E]"
              >
                {t}
                <button
                  type="button"
                  onClick={() => toggleType(t)}
                  aria-label={`Remove ${t}`}
                  className="text-[#3A6B3E]/60 hover:text-[#3A6B3E]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-1 font-sans text-sm font-semibold text-[#2E1F27]">Duration</p>
        <p className="mb-3 font-sans text-xs text-[#6B5860]">Set your Movement Window anywhere from 1 to 30 minutes.</p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={MIN_DURATION}
            max={MAX_DURATION}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="flex-1 accent-[#7FB069]"
          />
          <span className="w-20 shrink-0 text-right font-sans text-lg font-bold text-[#3A6B3E]">
            {duration} min
          </span>
        </div>
      </div>

      <Button
        onClick={handleBuild}
        disabled={types.length === 0}
        className="w-full bg-[#7FB069] py-6 text-base font-semibold text-white hover:bg-[#6FA055] disabled:opacity-40"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Build My Declaration <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
