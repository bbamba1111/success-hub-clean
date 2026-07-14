"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"

/* ── Daily Non-Negotiable segments ──────────────────────────────────────── */
const SEGMENTS = [
  {
    id: "morning-given",
    title: "Morning GIV\u2022EN™",
    description: "Your morning ritual — the intentional start that sets the tone for everything that follows.",
    example: "8 hours of restorative sleep and a mindful morning routine",
    intentionPrefix: "I begin each day with ",
  },
  {
    id: "workout",
    title: "Workout Window™",
    description: "Your dedicated movement practice — non-negotiable for your energy and longevity.",
    example: "30 minutes of intentional movement",
    intentionPrefix: "I protect my body through ",
  },
  {
    id: "healthy-lunch",
    title: "Healthy Hybrid Lunch™",
    description: "A nourishing midday pause that refuels your body and creates a natural rhythm break.",
    example: "a healthy lunch away from my desk",
    intentionPrefix: "I nourish my body each day with ",
  },
  {
    id: "ceo-workday",
    title: "4-Hour CEO Workday™",
    description: "Your focused business-building window — contained, intentional, high-leverage.",
    example: "4 focused hours of CEO-level work",
    intentionPrefix: "I build my business through ",
  },
  {
    id: "time-freedom",
    title: "Time Freedom™",
    description: "The protected life outside your business — the reason you built it in the first place.",
    example: "present, phone-free family time",
    intentionPrefix: "I protect my freedom through ",
  },
  {
    id: "power-down",
    title: "Power Down & Unplug™",
    description: "A clear, intentional end to every business day — so your rest is truly restorative.",
    example: "an 8:30 PM technology curfew",
    intentionPrefix: "I close each day by honoring ",
  },
]

type InstallState = {
  input: string
  declaration: string | null
  confirmed: boolean
}

function generateDeclaration(prefix: string, input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ""
  // Lowercase first char if joining into the prefix sentence
  const body = trimmed.charAt(0).toLowerCase() + trimmed.slice(1)
  return `${prefix}${body}.`
}

export function DesignMyWeekClient() {
  const [step, setStep] = useState(0)
  const [states, setStates] = useState<Record<string, InstallState>>(
    Object.fromEntries(SEGMENTS.map((s) => [s.id, { input: "", declaration: null, confirmed: false }]))
  )
  const cardRef = useRef<HTMLDivElement>(null)

  const current = SEGMENTS[step]
  const state = states[current.id]
  const allConfirmed = SEGMENTS.every((s) => states[s.id].confirmed)

  function scrollTop() {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleGenerate() {
    if (!state.input.trim()) return
    const declaration = generateDeclaration(current.intentionPrefix, state.input)
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id], declaration },
    }))
  }

  function handleConfirm() {
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id], confirmed: true },
    }))
    if (step < SEGMENTS.length - 1) {
      setStep((s) => s + 1)
      scrollTop()
    }
  }

  function handleEdit() {
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id], declaration: null, confirmed: false },
    }))
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Scene header */}
      <CherryBlossomScene variant="pond" minHeight="min-h-[55vh]">
        <CherryBlossomSceneCard title="Design My Week™" time="Approx. 10 mins">
          <p>
            Now we install the six <strong>Daily Non-Negotiables™</strong> that will structure every
            day of your <strong>Work-Life Balance Business Week™</strong>.
          </p>
          <p>
            For each segment, tell me what matters most to you — and I will transform it into an{" "}
            <em>Intention Declaration™</em> you can live from, starting today.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* Installation card */}
      <div className="w-full max-w-4xl mx-auto px-4 py-10" ref={cardRef}>
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green">
              Daily Non-Negotiables™
            </span>
            <span className="font-sans text-xs font-medium text-brand-ink-soft">
              {step + 1} of {SEGMENTS.length}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-brand-green/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-green transition-all duration-500"
              style={{ width: `${((step + 1) / SEGMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Completed segments */}
        {step > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {SEGMENTS.slice(0, step).map((s) => (
              <span
                key={s.id}
                className="flex items-center gap-1.5 rounded-full bg-brand-green/10 px-3 py-1 font-sans text-xs font-semibold text-brand-green"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                {s.title}
              </span>
            ))}
          </div>
        )}

        <div className="rounded-3xl bg-white border border-brand-blush shadow-lg overflow-hidden">
          <div className="px-8 py-10 sm:px-10">

            {/* Segment header */}
            <div className="mb-1">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-brand-green">
                Segment {step + 1}
              </span>
            </div>
            <h2 className="font-playfair text-3xl font-bold text-brand-ink mb-2 text-balance">
              {current.title}
            </h2>
            <p className="font-sans text-[15px] font-medium leading-relaxed text-brand-ink-soft text-pretty mb-8">
              {current.description}
            </p>

            {!state.declaration ? (
              /* Input state */
              <div className="space-y-5">
                <div>
                  <label className="block font-sans text-sm font-semibold text-brand-ink mb-2">
                    What is your Non-Negotiable™ for this segment?
                  </label>
                  <p className="font-sans text-xs text-brand-ink-soft mb-3">
                    Example: &ldquo;{current.example}&rdquo;
                  </p>
                  <textarea
                    value={state.input}
                    onChange={(e) =>
                      setStates((prev) => ({
                        ...prev,
                        [current.id]: { ...prev[current.id], input: e.target.value },
                      }))
                    }
                    placeholder="Describe what matters most to you here..."
                    rows={3}
                    className="w-full rounded-xl border border-brand-blush bg-brand-cream/40 px-4 py-3 font-sans text-[15px] text-brand-ink placeholder:text-brand-ink-soft/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 resize-none"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!state.input.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create My Intention Declaration™
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : (
              /* Declaration state */
              <div className="space-y-6">
                <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 px-6 py-5">
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green mb-3">
                    Your Intention Declaration™
                  </p>
                  <p className="font-sans text-lg font-semibold leading-relaxed text-brand-ink text-balance">
                    &ldquo;{state.declaration}&rdquo;
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleConfirm}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Install This Non-Negotiable™
                  </button>
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-transparent px-6 py-3.5 font-sans text-sm font-semibold text-brand-green transition-all hover:bg-brand-green/5"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completion */}
        {allConfirmed && (
          <div className="mt-8 rounded-2xl border border-brand-blush bg-white/70 backdrop-blur-sm shadow-ds overflow-hidden relative">
            <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-brand-green/70 rounded-l-2xl" />
            <div className="relative px-8 py-9 sm:px-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-brand-blush shadow-sm">
                  <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-brand-coral">
                  Cherry Blossom™
                </span>
              </div>
              <p className="font-sans font-bold text-xl text-brand-ink mb-4">
                Your week is installed.
              </p>
              <div className="font-sans font-medium text-[15px] leading-relaxed text-brand-ink-soft space-y-3 text-pretty mb-7">
                <p>
                  Your six <strong className="text-brand-ink">Daily Non-Negotiables™</strong> are now
                  installed as <strong className="text-brand-ink">Intention Declarations™</strong> you
                  will operate from every day.
                </p>
                <p>
                  Harmony Lane™ is now synchronizing you into today&apos;s operating segment. Let&apos;s
                  begin living the week you just designed.
                </p>
              </div>
              <Link
                href="/live-today"
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-4 font-sans text-sm font-bold text-white shadow-ds transition-colors hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30"
              >
                Begin Live Today™
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
