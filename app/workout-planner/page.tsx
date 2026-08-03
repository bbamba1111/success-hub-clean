"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown, Copy, Check, RotateCcw, Calendar, Clock, TrendingUp, Target, Trash2, Home, ArrowLeft } from "lucide-react"
import { CelebrationOverlay, type CompletionStatus } from "@/components/identity-installation/celebration-overlay"
import Link from "next/link"

// ── Types ────────────────────────────────────────────────────────────────────

type Step = "intention" | "declaration" | "completion" | "history"

interface WorkoutEntry {
  id: string
  date: string
  type: string
  duration: number
  status: CompletionStatus
  actualDuration?: number
  notes?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MOVEMENT_TYPES = [
  "Walk Away the Pounds\u2122",
  "Tai Chi",
  "Yoga",
  "Pilates",
  "Stretching",
  "Mobility",
  "Dance",
  "Zumba",
  "Strength Training",
  "Walking",
  "Running",
  "Cycling",
  "Swimming",
  "Other",
]

const buildCommitment = (type: string, duration: number) =>
  `I am committed to completing a ${duration}-minute ${type} practice during today's Movement Window\u2122.`

const buildDeclaration = (type: string, duration: number) =>
  `I declare that I am a person who moves their body with intention. Today I am honoring my commitment to a ${duration}-minute ${type} practice. This is not a task — this is an expression of who I am becoming. I am a Daily Non-Negotiable\u2122 leader, and I lead myself first.`

// ── DurationSpinner ───────────────────────────────────────────────────────────

function DurationSpinner({
  value,
  onChange,
  min = 5,
  max = 60,
  step = 5,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  const inc = () => onChange(Math.min(max, value + step))
  const dec = () => onChange(Math.max(min, value - step))

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#78AD7D]/40 bg-white text-[#78AD7D] transition hover:bg-[#78AD7D]/10 disabled:opacity-30"
        aria-label="Increase duration"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <span className="font-playfair text-[28px] font-semibold text-[#3A6B47] leading-none">{value}</span>
      <span className="font-montserrat text-[10px] uppercase tracking-[0.18em] text-[#9B8B8B]">min</span>
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#78AD7D]/40 bg-white text-[#78AD7D] transition hover:bg-[#78AD7D]/10 disabled:opacity-30"
        aria-label="Decrease duration"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  )
}

// ── RepeatAfterMe ─────────────────────────────────────────────────────────────

function RepeatAfterMe({ declaration }: { declaration: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(declaration)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        background: "linear-gradient(135deg, rgba(120,173,125,0.07) 0%, rgba(253,250,245,1) 100%)",
        borderColor: "rgba(120,173,125,0.25)",
      }}
    >
      <p className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.20em] text-[#78AD7D]">
        Repeat After Me\u2122
      </p>
      <p className="font-playfair text-[15px] italic leading-relaxed text-[#2D1F25]">
        &ldquo;{declaration}&rdquo;
      </p>
      <button
        type="button"
        onClick={copy}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#78AD7D]/30 bg-white px-4 py-1.5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78AD7D] transition hover:bg-[#78AD7D]/10"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy for Zoom"}
      </button>
    </div>
  )
}

// ── StepLabel ─────────────────────────────────────────────────────────────────

function StepLabel({ n, label, active }: { n: number; label: string; active: boolean }) {
  return (
    <div className={`flex items-center gap-2 font-montserrat text-[11px] font-semibold uppercase tracking-[0.16em] transition ${active ? "text-[#78AD7D]" : "text-[#C8B89A]"}`}>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${active ? "border-[#78AD7D] bg-[#78AD7D] text-white" : "border-[#C8B89A] text-[#C8B89A]"}`}>{n}</span>
      {label}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MovementPlannerPage() {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([])
  const [step, setStep] = useState<Step>("intention")

  // Intention state
  const [movementType, setMovementType] = useState("")
  const [duration, setDuration] = useState(30)
  const [commitment, setCommitment] = useState("")

  // Completion state
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | "">("")
  const [actualDuration, setActualDuration] = useState(30)
  const [completionNotes, setCompletionNotes] = useState("")

  // Celebration
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationStatus, setCelebrationStatus] = useState<CompletionStatus>("honored")

  useEffect(() => {
    localStorage.setItem("dashboardVisited", "true")
    const saved = localStorage.getItem("workouts")
    if (saved) setWorkouts(JSON.parse(saved))
  }, [])

  // Auto-update commitment sentence when type or duration changes
  useEffect(() => {
    if (movementType) setCommitment(buildCommitment(movementType, duration))
  }, [movementType, duration])

  const declaration = movementType ? buildDeclaration(movementType, duration) : ""

  const saveCompletion = useCallback(() => {
    if (!completionStatus || !movementType) return
    const entry: WorkoutEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      type: movementType,
      duration,
      status: completionStatus,
      actualDuration: completionStatus === "partial" ? actualDuration : undefined,
      notes: completionNotes || undefined,
    }
    const updated = [entry, ...workouts]
    setWorkouts(updated)
    localStorage.setItem("workouts", JSON.stringify(updated))

    setCelebrationStatus(completionStatus)
    setShowCelebration(true)
  }, [completionStatus, movementType, duration, actualDuration, completionNotes, workouts])

  const handleCelebrationDone = () => {
    setShowCelebration(false)
    setStep("history")
    // Reset form
    setMovementType("")
    setDuration(30)
    setCommitment("")
    setCompletionStatus("")
    setActualDuration(30)
    setCompletionNotes("")
  }

  const deleteWorkout = (id: string) => {
    const updated = workouts.filter((w) => w.id !== id)
    setWorkouts(updated)
    localStorage.setItem("workouts", JSON.stringify(updated))
  }

  const getWeeklyStats = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const weekly = workouts.filter((w) => new Date(w.date) >= weekAgo)
    const honored = weekly.filter((w) => w.status === "honored")
    const totalMin = honored.reduce((s, w) => s + w.duration, 0)
    return { count: weekly.length, honored: honored.length, totalMinutes: totalMin }
  }

  const stats = getWeeklyStats()

  return (
    <>
      <CelebrationOverlay
        show={showCelebration}
        status={celebrationStatus}
        flow="movement"
        onDone={handleCelebrationDone}
      />

      <div className="min-h-screen bg-[#FDFAF5] py-10">
        <div className="mx-auto max-w-2xl px-6">

          {/* Header */}
          <div className="mb-10 text-center">
            <p className="mb-1 font-montserrat text-[11px] font-bold uppercase tracking-[0.22em] text-[#78AD7D]">
              Daily Non-Negotiable\u2122
            </p>
            <h1 className="font-playfair text-[34px] font-semibold text-[#2D1F25]">
              Movement Window\u2122
            </h1>
            <p className="mt-1.5 font-montserrat text-[13px] text-[#9B8B8B]">
              30 minutes that build the identity of a person who moves.
            </p>
          </div>

          {/* Weekly stats */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            {[
              { label: "This Week", value: stats.count, unit: "sessions" },
              { label: "Honored", value: stats.honored, unit: "completed" },
              { label: "Total Time", value: stats.totalMinutes, unit: "minutes" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-[#78AD7D]/20 bg-white px-4 py-4 text-center shadow-sm">
                <p className="font-playfair text-[28px] font-semibold text-[#3A6B47]">{s.value}</p>
                <p className="mt-0.5 font-montserrat text-[10px] uppercase tracking-[0.16em] text-[#9B8B8B]">{s.unit}</p>
                <p className="font-montserrat text-[11px] text-[#C8B89A]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Step indicator */}
          {step !== "history" && (
            <div className="mb-6 flex items-center gap-4">
              <StepLabel n={1} label="Intention" active={step === "intention"} />
              <div className="h-px flex-1 bg-[#E8DDD5]" />
              <StepLabel n={2} label="Declaration" active={step === "declaration"} />
              <div className="h-px flex-1 bg-[#E8DDD5]" />
              <StepLabel n={3} label="Completion" active={step === "completion"} />
            </div>
          )}

          <AnimatePresence mode="wait">

            {/* ── Step 1: Intention ── */}
            {step === "intention" && (
              <motion.div key="intention" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: "easeOut" }}>
                <div className="rounded-2xl border border-[#78AD7D]/20 bg-white p-7 shadow-sm">
                  <p className="mb-5 font-montserrat text-[11px] font-bold uppercase tracking-[0.20em] text-[#78AD7D]">
                    Set Your Movement Intention
                  </p>

                  {/* Movement type */}
                  <div className="mb-5">
                    <label className="mb-1.5 block font-montserrat text-[12px] font-semibold text-[#5A4A52]">
                      Movement Type
                    </label>
                    <select
                      value={movementType}
                      onChange={(e) => setMovementType(e.target.value)}
                      className="w-full rounded-xl border border-[#C8B89A]/50 bg-[#FDFAF5] px-4 py-3 font-montserrat text-[13px] text-[#3D2E32] focus:outline-none focus:ring-2 focus:ring-[#78AD7D]/30"
                    >
                      <option value="">Choose your movement...</option>
                      {MOVEMENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Duration spinner */}
                  <div className="mb-6 flex items-center gap-6">
                    <div>
                      <p className="mb-2 font-montserrat text-[12px] font-semibold text-[#5A4A52]">Duration</p>
                      <DurationSpinner value={duration} onChange={setDuration} min={5} max={60} step={5} />
                    </div>
                    {movementType && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 rounded-xl bg-[#78AD7D]/08 p-4"
                        style={{ background: "rgba(120,173,125,0.07)" }}
                      >
                        <p className="font-montserrat text-[10px] uppercase tracking-[0.16em] text-[#78AD7D] mb-1.5">Your Commitment</p>
                        <p className="font-playfair text-[13px] italic leading-relaxed text-[#3D2E32]">
                          &ldquo;{commitment}&rdquo;
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!movementType}
                    onClick={() => setStep("declaration")}
                    className="w-full rounded-xl bg-[#78AD7D] py-3.5 font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#6A9A6E] disabled:opacity-40"
                  >
                    Install My Declaration\u2122
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Declaration ── */}
            {step === "declaration" && (
              <motion.div key="declaration" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: "easeOut" }}>
                <div className="rounded-2xl border border-[#78AD7D]/20 bg-white p-7 shadow-sm">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.20em] text-[#78AD7D]">
                      Cherry Blossom\u2122 Declaration
                    </span>
                    <span className="rounded-full bg-[#78AD7D]/12 px-2 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.14em] text-[#78AD7D]" style={{ background: "rgba(120,173,125,0.12)" }}>
                      {movementType}
                    </span>
                  </div>
                  <p className="mb-5 font-montserrat text-[11px] text-[#9B8B8B]">
                    Read this aloud. Let it land.
                  </p>

                  <RepeatAfterMe declaration={declaration} />

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("intention")}
                      className="flex items-center gap-1.5 rounded-xl border border-[#C8B89A]/50 px-4 py-2.5 font-montserrat text-[12px] text-[#9B8B8B] transition hover:border-[#C8B89A] hover:text-[#5A4A52]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("completion")}
                      className="flex-1 rounded-xl bg-[#78AD7D] py-3 font-montserrat text-[13px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#6A9A6E]"
                    >
                      Declaration Installed\u2122
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Completion ── */}
            {step === "completion" && (
              <motion.div key="completion" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: "easeOut" }}>
                <div className="rounded-2xl border border-[#78AD7D]/20 bg-white p-7 shadow-sm">
                  <p className="mb-1 font-montserrat text-[11px] font-bold uppercase tracking-[0.20em] text-[#78AD7D]">
                    Movement Check-In
                  </p>
                  <p className="mb-5 font-playfair text-[15px] italic text-[#3D2E32]">
                    Did you complete your {duration}-minute {movementType}?
                  </p>

                  <div className="mb-5 flex gap-3">
                    {(["honored", "partial", "not-completed"] as CompletionStatus[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCompletionStatus(s)}
                        className="flex-1 rounded-xl border py-3 font-montserrat text-[12px] font-semibold uppercase tracking-[0.12em] transition"
                        style={{
                          backgroundColor: completionStatus === s ? "#78AD7D" : "white",
                          borderColor: completionStatus === s ? "#78AD7D" : "rgba(200,184,154,0.5)",
                          color: completionStatus === s ? "white" : "#5A4A52",
                        }}
                      >
                        {s === "honored" ? "Yes" : s === "partial" ? "Partially" : "Not Today"}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {completionStatus === "partial" && (
                      <motion.div key="partial-detail" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                        <label className="mb-1.5 block font-montserrat text-[12px] font-semibold text-[#5A4A52]">
                          How many minutes did you complete?
                        </label>
                        <DurationSpinner value={actualDuration} onChange={setActualDuration} min={5} max={60} step={5} />
                      </motion.div>
                    )}
                    {completionStatus === "not-completed" && (
                      <motion.div key="nc-detail" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                        <label className="mb-1.5 block font-montserrat text-[12px] font-semibold text-[#5A4A52]">
                          What got in the way? (optional)
                        </label>
                        <textarea
                          rows={2}
                          value={completionNotes}
                          onChange={(e) => setCompletionNotes(e.target.value)}
                          placeholder="No judgment here — just noticing..."
                          className="w-full rounded-xl border border-[#C8B89A]/50 bg-[#FDFAF5] px-4 py-3 font-montserrat text-[13px] text-[#3D2E32] placeholder:text-[#C8B89A] focus:outline-none focus:ring-2 focus:ring-[#78AD7D]/30"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("declaration")}
                      className="flex items-center gap-1.5 rounded-xl border border-[#C8B89A]/50 px-4 py-2.5 font-montserrat text-[12px] text-[#9B8B8B] transition hover:border-[#C8B89A] hover:text-[#5A4A52]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Back
                    </button>
                    <button
                      type="button"
                      disabled={!completionStatus}
                      onClick={saveCompletion}
                      className="flex-1 rounded-xl bg-[#78AD7D] py-3 font-montserrat text-[13px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#6A9A6E] disabled:opacity-40"
                    >
                      Record & Celebrate
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── History ── */}
            {step === "history" && (
              <motion.div key="history" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.20em] text-[#78AD7D]">
                    Movement History\u2122
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("intention")
                      setMovementType("")
                      setDuration(30)
                      setCompletionStatus("")
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-[#78AD7D]/30 bg-white px-3.5 py-1.5 font-montserrat text-[11px] font-semibold text-[#78AD7D] transition hover:bg-[#78AD7D]/10"
                  >
                    <RotateCcw className="h-3 w-3" /> New Movement
                  </button>
                </div>

                {workouts.length === 0 ? (
                  <div className="rounded-2xl border border-[#C8B89A]/30 bg-white p-8 text-center">
                    <p className="font-playfair text-[16px] italic text-[#9B8B8B]">Your movement history will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workouts
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((w) => (
                        <div
                          key={w.id}
                          className="flex items-start justify-between rounded-2xl border border-[#78AD7D]/15 bg-white p-5 shadow-sm"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="font-montserrat text-[12px] font-bold text-[#3A6B47]">{w.type}</span>
                              <span className="flex items-center gap-1 font-montserrat text-[11px] text-[#9B8B8B]">
                                <Clock className="h-3 w-3" /> {w.duration} min
                              </span>
                              <span className="flex items-center gap-1 font-montserrat text-[11px] text-[#9B8B8B]">
                                <Calendar className="h-3 w-3" /> {new Date(w.date).toLocaleDateString()}
                              </span>
                              <span
                                className="rounded-full px-2.5 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.12em]"
                                style={{
                                  backgroundColor: w.status === "honored" ? "rgba(120,173,125,0.15)" : w.status === "partial" ? "rgba(200,155,60,0.12)" : "rgba(200,184,154,0.15)",
                                  color: w.status === "honored" ? "#3A6B47" : w.status === "partial" ? "#8B6A20" : "#9B8B8B",
                                }}
                              >
                                {w.status === "honored" ? "Honored" : w.status === "partial" ? "Partial" : "Not completed"}
                              </span>
                            </div>
                            {w.notes && <p className="font-montserrat text-[12px] text-[#9B8B8B]">{w.notes}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteWorkout(w.id)}
                            className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#C8B89A] transition hover:bg-red-50 hover:text-red-400"
                            aria-label="Delete entry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

          {/* Footer nav */}
          <div className="mt-10 flex items-center justify-between border-t border-[#E8DDD5] pt-6">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-montserrat text-[12px] text-[#9B8B8B] transition hover:text-[#5A4A52]"
            >
              <Home className="h-3.5 w-3.5" /> Back to Home
            </Link>
            {step !== "history" && workouts.length > 0 && (
              <button
                type="button"
                onClick={() => setStep("history")}
                className="flex items-center gap-1.5 font-montserrat text-[12px] text-[#78AD7D] transition hover:underline"
              >
                <TrendingUp className="h-3.5 w-3.5" /> View History
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
