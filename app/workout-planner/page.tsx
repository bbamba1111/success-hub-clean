"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, TrendingUp, Trash2, Home, Copy, Check } from "lucide-react"
import Link from "next/link"

// ── Types ─────────────────────────────────────────────────────────────────────

interface WorkoutEntry {
  id: string
  date: string
  type: string
  duration: number
  actualDuration?: number
  status: "honored" | "partial" | "not-completed"
  notes?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MOVEMENT_TYPES = [
  "Walk Away the Pounds\u2122",
  "Tai Chi",
  "Yoga",
  "Pilates",
  "Stretching & Mobility",
  "Dance",
  "Zumba",
  "Strength Training",
  "Walking",
  "Running",
  "Cycling",
  "Swimming",
  "Radio Taiso",
  "Other",
]

const CHERRY_MESSAGES: Record<WorkoutEntry["status"], string> = {
  honored: "You\u2019re on fire! \ud83c\udf38\ud83e\udd1c",
  partial: "Progress is progress. Keep going! \ud83c\udf38",
  "not-completed": "Tomorrow is a new window. \ud83c\udf38",
}

function buildDeclaration(type: string, duration: number) {
  return `I declare that I am a person who moves their body with intention. Today I am honoring my commitment to a ${duration}-minute ${type} practice. This is not a task \u2014 this is an expression of who I am becoming.`
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-")
  return `${m}/${d}/${y}`
}

function statusLabel(s: WorkoutEntry["status"]) {
  if (s === "honored") return "Completed"
  if (s === "partial") return "Partial"
  return "Not completed"
}

function statusColor(s: WorkoutEntry["status"]) {
  if (s === "honored") return "#3A6B47"
  if (s === "partial") return "#B87333"
  return "#9B8B8B"
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MovementPlannerPage() {
  // ── Form state ──
  const today = new Date().toISOString().split("T")[0]
  const [date, setDate] = useState(today)
  const [type, setType] = useState("")
  const [duration, setDuration] = useState(30)
  const [notes, setNotes] = useState("")

  // ── Declaration state ──
  const [showDeclaration, setShowDeclaration] = useState(false)
  const [copied, setCopied] = useState(false)

  // ── Completion state (shown after Add) ──
  const [pendingEntry, setPendingEntry] = useState<Omit<WorkoutEntry, "status" | "actualDuration"> | null>(null)
  const [completionStatus, setCompletionStatus] = useState<WorkoutEntry["status"] | "">("")
  const [actualDuration, setActualDuration] = useState(30)
  const [completionNotes, setCompletionNotes] = useState("")
  const [savedEntry, setSavedEntry] = useState<WorkoutEntry | null>(null)

  // ── History ──
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("workouts")
      if (saved) setWorkouts(JSON.parse(saved))
    } catch {}
  }, [])

  // Auto-show declaration when type is selected
  useEffect(() => {
    setShowDeclaration(!!type)
  }, [type])

  const commitment = type
    ? `I intend/commit to completing a ${duration}-minute ${type} practice today.`
    : ""

  const declaration = type ? buildDeclaration(type, duration) : ""

  const copyDeclaration = async () => {
    try {
      await navigator.clipboard.writeText(declaration)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const handleAdd = () => {
    if (!type) return
    const entry = {
      id: Date.now().toString(),
      date,
      type,
      duration,
      notes: notes || undefined,
    }
    setPendingEntry(entry)
    setCompletionStatus("")
    setActualDuration(duration)
    setCompletionNotes("")
    setSavedEntry(null)
  }

  const handleSaveCompletion = () => {
    if (!pendingEntry || !completionStatus) return
    const entry: WorkoutEntry = {
      ...pendingEntry,
      status: completionStatus,
      actualDuration: completionStatus === "partial" ? actualDuration : undefined,
      notes: completionNotes || pendingEntry.notes,
    }
    const updated = [entry, ...workouts]
    setWorkouts(updated)
    try { localStorage.setItem("workouts", JSON.stringify(updated)) } catch {}
    setSavedEntry(entry)
    setPendingEntry(null)
    // Reset form
    setType("")
    setDuration(30)
    setNotes("")
    setDate(today)
  }

  const deleteWorkout = (id: string) => {
    const updated = workouts.filter((w) => w.id !== id)
    setWorkouts(updated)
    try { localStorage.setItem("workouts", JSON.stringify(updated)) } catch {}
  }

  const weeklyWorkouts = workouts.filter((w) => {
    const d = new Date(w.date + "T00:00:00")
    return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000
  })
  const totalMinutes = weeklyWorkouts.filter((w) => w.status !== "not-completed").reduce((s, w) => s + (w.actualDuration ?? w.duration), 0)
  const avgDuration = weeklyWorkouts.length > 0 ? Math.round(totalMinutes / weeklyWorkouts.filter((w) => w.status !== "not-completed").length) || 0 : 0

  return (
    <div className="min-h-screen bg-[#F5F0E8] py-10 font-montserrat">
      <div className="mx-auto max-w-2xl px-5">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#78AD7D]/20">
            <span className="text-2xl">&#x1F3C3;</span>
          </div>
          <h1 className="font-playfair text-[30px] font-bold text-[#3A6B47]">Movement Window™</h1>
          <p className="mt-1 text-[13px] text-[#6B5C54]">Track your 30-minute workday movement sessions</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { icon: <span className="text-sm">&#x25CE;</span>, label: "Weekly Workouts", value: weeklyWorkouts.length, sub: "This week" },
            { icon: <Clock className="h-4 w-4" />, label: "Total Minutes", value: totalMinutes, sub: "This week" },
            { icon: <TrendingUp className="h-4 w-4" />, label: "Average Duration", value: avgDuration, sub: "Minutes per workout" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[#D4C9B8] bg-white p-4">
              <div className="mb-1 flex items-center gap-1.5 text-[#9B8B8B] text-[12px]">
                {s.icon} {s.label}
              </div>
              <p className="font-playfair text-[26px] font-bold text-[#3A6B47]">{s.value}</p>
              <p className="text-[11px] text-[#9B8B8B]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Completion check-in (shown after Add) ── */}
        {pendingEntry && !savedEntry && (
          <div className="mb-6 rounded-xl border border-[#78AD7D]/30 bg-white p-5">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#78AD7D]">Movement Check-In</p>
            <p className="mb-4 font-playfair text-[15px] italic text-[#3D2E32]">
              Did you complete your {pendingEntry.duration}-min {pendingEntry.type}?
            </p>
            <div className="mb-4 flex gap-2">
              {(["honored", "partial", "not-completed"] as WorkoutEntry["status"][]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCompletionStatus(s)}
                  className="flex-1 rounded-lg border py-2.5 text-[12px] font-semibold uppercase tracking-[0.10em] transition"
                  style={{
                    backgroundColor: completionStatus === s ? "#78AD7D" : "white",
                    borderColor: completionStatus === s ? "#78AD7D" : "#D4C9B8",
                    color: completionStatus === s ? "white" : "#5A4A52",
                  }}
                >
                  {s === "honored" ? "Yes" : s === "partial" ? "Partially" : "Not Today"}
                </button>
              ))}
            </div>
            {completionStatus === "partial" && (
              <div className="mb-3">
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">How many minutes did you complete?</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={actualDuration}
                  onChange={(e) => setActualDuration(Number(e.target.value))}
                  className="w-28 rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2 text-[13px] text-[#3D2E32] focus:outline-none focus:ring-2 focus:ring-[#78AD7D]/30"
                />
              </div>
            )}
            {completionStatus === "not-completed" && (
              <div className="mb-3">
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">What got in the way? (optional)</label>
                <textarea
                  rows={2}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="No judgment here..."
                  className="w-full rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2 text-[13px] text-[#3D2E32] placeholder:text-[#C8B89A] focus:outline-none focus:ring-2 focus:ring-[#78AD7D]/30 resize-none"
                />
              </div>
            )}
            <button
              type="button"
              disabled={!completionStatus}
              onClick={handleSaveCompletion}
              className="w-full rounded-lg bg-[#78AD7D] py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#6A9A6E] disabled:opacity-40"
            >
              Save &amp; Record
            </button>
          </div>
        )}

        {/* ── Post-session summary ── */}
        {savedEntry && (
          <div className="mb-6 rounded-xl border border-[#78AD7D]/30 bg-white p-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#78AD7D]">Session Summary</p>
            <div className="mb-3 grid grid-cols-2 gap-3 text-[13px]">
              <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-[#9B8B8B]">Date</p>
                <p className="font-semibold text-[#3D2E32]">{formatDate(savedEntry.date)}</p>
              </div>
              <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-[#9B8B8B]">Movement</p>
                <p className="font-semibold text-[#3D2E32]">{savedEntry.type}</p>
              </div>
              <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-[#9B8B8B]">Committed</p>
                <p className="font-semibold text-[#3D2E32]">{savedEntry.duration} min</p>
              </div>
              <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-[#9B8B8B]">Completed</p>
                <p className="font-semibold" style={{ color: statusColor(savedEntry.status) }}>
                  {savedEntry.status === "honored"
                    ? `${savedEntry.duration} min`
                    : savedEntry.status === "partial"
                    ? `${savedEntry.actualDuration ?? "?"} min`
                    : "Not completed"}
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-[#78AD7D]/08 px-3 py-2.5 text-center" style={{ background: "rgba(120,173,125,0.08)" }}>
              <span className="text-base">&#x1F338;</span>{" "}
              <span className="font-playfair text-[13px] italic text-[#C13B6B]">{CHERRY_MESSAGES[savedEntry.status]}</span>
            </div>
            <button
              type="button"
              onClick={() => setSavedEntry(null)}
              className="mt-3 w-full rounded-lg border border-[#D4C9B8] py-2 text-[12px] font-semibold text-[#5A4A52] transition hover:border-[#78AD7D] hover:text-[#3A6B47]"
            >
              + Log Another Session
            </button>
          </div>
        )}

        {/* ── Add New Workout form ── */}
        {!pendingEntry && !savedEntry && (
          <div className="mb-6 rounded-xl border border-[#D4C9B8] bg-white p-5">
            <p className="mb-4 text-[15px] font-bold text-[#3A6B47]">+ Add New Workout</p>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2.5 text-[13px] text-[#3D2E32] focus:outline-none focus:ring-2 focus:ring-[#78AD7D]/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">Workout Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2.5 text-[13px] text-[#3D2E32] focus:outline-none focus:ring-2 focus:ring-[#78AD7D]/30"
                >
                  <option value="">Select workout type</option>
                  {MOVEMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">Duration (minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  step={5}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2.5 text-[13px] text-[#3D2E32] focus:outline-none focus:ring-2 focus:ring-[#78AD7D]/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">Notes (optional)</label>
                <textarea
                  rows={1}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did you feel? Any observations?"
                  className="w-full resize-none rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2.5 text-[13px] text-[#3D2E32] placeholder:text-[#C8B89A] focus:outline-none focus:ring-2 focus:ring-[#78AD7D]/30"
                />
              </div>
            </div>

            {/* Commitment sentence — auto-populates from type + duration */}
            {type && (
              <div className="mb-4 rounded-lg border border-[#78AD7D]/25 bg-[#78AD7D]/05 px-4 py-3" style={{ background: "rgba(120,173,125,0.06)" }}>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#78AD7D]">My Commitment</p>
                <p className="font-playfair text-[13px] italic text-[#3D2E32]">&ldquo;{commitment}&rdquo;</p>
              </div>
            )}

            {/* Declaration box — no separate Repeat After Me */}
            {showDeclaration && type && (
              <div className="mb-4 rounded-lg border border-[#78AD7D]/25 bg-[#F5F0E8] px-4 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#78AD7D]">
                    My Intention Declaration&#x2122; &mdash; Read this aloud
                  </p>
                  <button
                    type="button"
                    onClick={copyDeclaration}
                    className="inline-flex items-center gap-1 rounded-full border border-[#78AD7D]/30 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#78AD7D] transition hover:bg-[#78AD7D]/10"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="font-montserrat text-[13px] italic leading-relaxed text-[#3D2E32]">
                  &ldquo;{declaration}&rdquo;
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={!type}
              onClick={handleAdd}
              className="w-full rounded-lg bg-[#78AD7D] py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#6A9A6E] disabled:opacity-40"
            >
              + Add Workout
            </button>
          </div>
        )}

        {/* ── Workout History ── */}
        <div className="rounded-xl border border-[#D4C9B8] bg-white p-5">
          <p className="mb-4 flex items-center gap-2 text-[15px] font-bold text-[#3A6B47]">
            <Calendar className="h-4 w-4" /> Workout History
          </p>
          {workouts.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-[#9B8B8B]">No workouts logged yet. Add your first session above.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {workouts.map((w) => (
                <div key={w.id} className="rounded-lg border border-[#E8DDD5] px-4 py-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                        style={{ backgroundColor: statusColor(w.status) }}
                      >
                        {w.type}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#9B8B8B]">
                        <Calendar className="h-3 w-3" /> {formatDate(w.date)}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#9B8B8B]">
                        <Clock className="h-3 w-3" />
                        {w.status === "partial" ? `${w.actualDuration ?? w.duration} min` : `${w.duration} min`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteWorkout(w.id)}
                      className="text-[#C8B89A] transition hover:text-[#C13B6B]"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {w.notes && <p className="text-[12px] text-[#5A4A52]">{w.notes}</p>}
                  <div className="mt-1.5">
                    <span className="text-sm">&#x1F338;</span>{" "}
                    <span className="font-playfair text-[12px] italic text-[#C13B6B]">{CHERRY_MESSAGES[w.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#D4C9B8] px-5 py-2 text-[12px] font-semibold text-[#5A4A52] transition hover:border-[#78AD7D] hover:text-[#3A6B47]"
          >
            <Home className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}
