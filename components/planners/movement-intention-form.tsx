"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react"
import {
  saveMovementDeclaration,
  loadMovementDeclaration,
  type MovementDeclaration,
} from "@/lib/daily-plan/movement-declaration"

const WORKOUT_TYPES = [
  "Radio Taiso", "Yoga", "Pilates", "HIIT", "Walking", "Running",
  "Cycling", "Swimming", "Strength Training", "Dance", "Tai Chi",
  "Qigong", "Stretching", "Barre", "Boxing", "Kickboxing", "Rowing",
  "Jump Rope", "Zumba", "CrossFit", "Other",
]

const DURATION_OPTIONS = [10, 15, 20, 25, 30, 45, 60]

function buildDeclaration(type: string, duration: number): string {
  if (!type) return ""
  return `I am someone who moves their body with intention. Today I commit to ${duration} minutes of ${type} — not because I have to, but because I choose to show up for myself.`
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
  const [type, setType] = useState("")
  const [duration, setDuration] = useState(30)
  const [built, setBuilt] = useState<MovementDeclaration | null>(null)

  useEffect(() => {
    setBuilt(loadMovementDeclaration())
  }, [])

  const handleBuild = () => {
    if (!type) return
    const record = saveMovementDeclaration({ type, duration, declaration: buildDeclaration(type, duration) })
    setBuilt(record)
  }

  const handleEdit = () => {
    if (built) {
      setType(built.type)
      setDuration(built.duration)
    }
    setBuilt(null)
  }

  if (built) {
    return (
      <div className="space-y-4 rounded-2xl border-2 border-[#7FB069]/30 bg-[#7FB069]/5 px-5 py-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-[#7FB069]" aria-hidden />
        <div>
          <p className="font-sans text-base font-bold text-[#2E1F27]">Your Movement Declaration™ is ready</p>
          <p className="mt-1 font-sans text-sm text-[#6B5860]">
            {built.duration} minutes of {built.type}
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
          Choose an activity below … or create your own
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {WORKOUT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-full border px-3 py-1.5 font-sans text-sm transition-all ${
                type === t
                  ? "border-[#7FB069] bg-[#7FB069] font-semibold text-white"
                  : "border-[#E5E5E5] bg-white text-[#3A2E33] hover:border-[#7FB069] hover:text-[#7FB069]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Or type your own activity…"
          value={WORKOUT_TYPES.includes(type) ? "" : type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-lg border border-[#E5E5E5] px-3 py-2 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
        />
      </div>

      <div>
        <p className="mb-3 font-sans text-sm font-semibold text-[#2E1F27]">Duration</p>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className={`rounded-full border px-4 py-2 font-sans text-sm transition-all ${
                duration === d
                  ? "border-[#7FB069] bg-[#7FB069] font-semibold text-white"
                  : "border-[#E5E5E5] bg-white text-[#3A2E33] hover:border-[#7FB069] hover:text-[#7FB069]"
              }`}
            >
              {d} min
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleBuild}
        disabled={!type}
        className="w-full bg-[#7FB069] py-6 text-base font-semibold text-white hover:bg-[#6FA055] disabled:opacity-40"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Build My Declaration <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
