"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Dumbbell, Clock, TrendingUp, Target, Trash2, Home, Copy, Check, ChevronRight } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface WorkoutEntry {
  id: string
  date: string
  type: string
  duration: number
  declaration: string
  completionStatus: "yes" | "partially" | "no"
  completedDuration?: number
  reflection: string
}

type Step = "intention" | "declare" | "complete" | "celebrate"

interface PageState {
  type: string
  duration: number
  declaration: string
  completionStatus: "yes" | "partially" | "no" | null
  completedDuration: number
  reflection: string
  step: Step
}

// ─── Constants ───────────────────────────────────────────────────────────────

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

function freshState(): PageState {
  return {
    type: "",
    duration: 30,
    declaration: "",
    completionStatus: null,
    completedDuration: 30,
    reflection: "",
    step: "intention",
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function WorkoutPlannerPage() {
  const [mounted, setMounted] = useState(false)
  const [history, setHistory] = useState<WorkoutEntry[]>([])
  const [state, setState] = useState<PageState>(freshState())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("workouts_v2")
    if (saved) setHistory(JSON.parse(saved))
    localStorage.setItem("dashboardVisited", "true")
    setMounted(true)
  }, [])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleTypeSelect = (type: string) =>
    setState((p) => ({ ...p, type, declaration: buildDeclaration(type, p.duration) }))

  const handleDurationSelect = (duration: number) =>
    setState((p) => ({ ...p, duration, completedDuration: duration, declaration: buildDeclaration(p.type, duration) }))

  const handleGoToDeclare = () => {
    if (!state.type) return
    setState((p) => ({ ...p, step: "declare" }))
  }

  const handleGoToComplete = () => setState((p) => ({ ...p, step: "complete" }))

  const handleSave = () => {
    const now = new Date().toISOString()
    const record: WorkoutEntry = {
      id: Date.now().toString(),
      date: now.split("T")[0],
      type: state.type,
      duration: state.completionStatus === "partially" ? state.completedDuration : state.duration,
      declaration: state.declaration,
      completionStatus: state.completionStatus!,
      completedDuration: state.completionStatus === "partially" ? state.completedDuration : undefined,
      reflection: state.reflection,
    }
    const updated = [record, ...history]
    setHistory(updated)
    localStorage.setItem("workouts_v2", JSON.stringify(updated))
    setState((p) => ({ ...p, step: "celebrate" }))
  }

  const handleReset = () => {
    setState(freshState())
    setCopied(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(state.declaration)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {}
  }

  const deleteEntry = (id: string) => {
    const updated = history.filter((w) => w.id !== id)
    setHistory(updated)
    localStorage.setItem("workouts_v2", JSON.stringify(updated))
  }

  if (!mounted) return null

  // ── Derived (client-only — safe after mounted guard) ─────────────────────

  const weeklySessions = history.filter((w) => {
    const d = new Date(w.date)
    const now = new Date()
    return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  })
  const weeklyMinutes = weeklySessions.reduce((s, w) => s + w.duration, 0)

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white py-12">
      <div className="max-w-3xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#7FB069] mb-2">Movement Intention™</h1>
          <p className="text-gray-500 text-lg">Set your intention, then live it.</p>
        </div>

        {/* Weekly stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {([
            { icon: Target, label: "Sessions this week", value: weeklySessions.length },
            { icon: Clock, label: "Minutes this week", value: weeklyMinutes },
            { icon: TrendingUp, label: "Avg per session", value: weeklySessions.length > 0 ? Math.round(weeklyMinutes / weeklySessions.length) : 0 },
          ] as const).map(({ icon: Icon, label, value }) => (
            <Card key={label} className="border-2 border-[#7FB069]/20">
              <CardContent className="pt-5 pb-4">
                <Icon className="h-4 w-4 text-[#7FB069] mb-2" />
                <div className="text-3xl font-bold text-[#7FB069]">{value}</div>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── STEP 1: Intention ── */}
        {state.step === "intention" && (
          <Card className="border-2 border-[#7FB069]/30 mb-8">
            <CardContent className="pt-6 pb-6 space-y-6">
              <div>
                <p className="text-xs font-semibold text-[#7FB069] uppercase tracking-widest mb-1">Step 1 of 3</p>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Set My Movement Intention™</h2>
                <p className="text-sm text-gray-500">
                  I will transform your intention into an Intention Declaration™ you will live from, in this segment.
                </p>
              </div>

              {/* Activity chips */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Choose an activity below … or create your own
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {WORKOUT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTypeSelect(t)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        state.type === t
                          ? "bg-[#7FB069] border-[#7FB069] text-white font-semibold"
                          : "bg-white border-gray-200 text-gray-700 hover:border-[#7FB069] hover:text-[#7FB069]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or type your own activity…"
                  value={WORKOUT_TYPES.includes(state.type) ? "" : state.type}
                  onChange={(e) => handleTypeSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
                />
              </div>

              {/* Duration chips */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Duration</p>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => handleDurationSelect(d)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${
                        state.duration === d
                          ? "bg-[#7FB069] border-[#7FB069] text-white font-semibold"
                          : "bg-white border-gray-200 text-gray-700 hover:border-[#7FB069] hover:text-[#7FB069]"
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleGoToDeclare}
                disabled={!state.type}
                className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white py-6 text-base font-semibold disabled:opacity-40"
              >
                Build My Declaration <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 2: Declaration ── */}
        {state.step === "declare" && (
          <Card className="border-2 border-[#7FB069]/30 mb-8">
            <CardContent className="pt-6 pb-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-[#7FB069] uppercase tracking-widest mb-1">Step 2 of 3</p>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">My Intention Declaration™</h2>
                <p className="text-sm text-gray-500">Read this aloud before you begin. Edit it until it feels true.</p>
              </div>

              <Textarea
                value={state.declaration}
                onChange={(e) => setState((p) => ({ ...p, declaration: e.target.value }))}
                rows={5}
                className="text-base leading-relaxed border-[#7FB069]/40 focus:ring-[#7FB069]/30 resize-none"
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-1 border-[#7FB069]/40 text-[#7FB069] hover:bg-[#7FB069]/5"
                >
                  {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Copied!" : "Copy to Zoom Chat"}
                </Button>
                <Button
                  onClick={handleGoToComplete}
                  className="flex-1 bg-[#7FB069] hover:bg-[#6FA055] text-white font-semibold"
                >
                  {"I've read it — let's go"} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <button
                onClick={() => setState((p) => ({ ...p, step: "intention" }))}
                className="text-xs text-gray-400 hover:text-gray-600 underline w-full text-center"
              >
                Go back
              </button>
            </CardContent>
          </Card>
        )}

        {/* ── STEP 3: Completion ── */}
        {state.step === "complete" && (
          <Card className="border-2 border-[#7FB069]/30 mb-8">
            <CardContent className="pt-6 pb-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-[#7FB069] uppercase tracking-widest mb-1">Step 3 of 3</p>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">How did it go?</h2>
                <p className="text-sm text-gray-500">
                  Your intention was{" "}
                  <span className="font-semibold text-gray-700">
                    {state.duration} min of {state.type}
                  </span>
                  .
                </p>
              </div>

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
                      onClick={() => setState((p) => ({ ...p, completionStatus: status }))}
                      className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        state.completionStatus === status
                          ? active[status]
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {labels[status]}
                    </button>
                  )
                })}
              </div>

              {state.completionStatus === "partially" && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">How many minutes did you complete?</p>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={state.duration}
                      value={state.completedDuration}
                      onChange={(e) => setState((p) => ({ ...p, completedDuration: Number(e.target.value) }))}
                      className="flex-1 accent-[#7FB069]"
                    />
                    <span className="text-lg font-bold text-[#7FB069] w-16 text-right">
                      {state.completedDuration} min
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Reflection (optional)</p>
                <Textarea
                  placeholder="How did you feel? What did you notice?"
                  value={state.reflection}
                  onChange={(e) => setState((p) => ({ ...p, reflection: e.target.value }))}
                  rows={3}
                  className="resize-none border-gray-200 text-sm"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={!state.completionStatus}
                className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white py-6 text-base font-semibold disabled:opacity-40"
              >
                Save &amp; Celebrate
              </Button>

              <button
                onClick={() => setState((p) => ({ ...p, step: "declare" }))}
                className="text-xs text-gray-400 hover:text-gray-600 underline w-full text-center"
              >
                Go back
              </button>
            </CardContent>
          </Card>
        )}

        {/* ── CELEBRATE ── */}
        {state.step === "celebrate" && (
          <Card className="border-2 border-[#7FB069]/30 mb-8 text-center">
            <CardContent className="pt-10 pb-10 space-y-4">
              <div className="text-5xl mb-2">🌸</div>
              <h2 className="text-2xl font-bold text-[#7FB069]">
                {state.completionStatus === "yes"
                  ? "You showed up fully. That's everything."
                  : state.completionStatus === "partially"
                  ? "Partial is powerful. You still moved."
                  : "You were honest with yourself. That matters."}
              </h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                {state.completionStatus === "yes"
                  ? `${state.duration} minutes of ${state.type} — logged and celebrated.`
                  : state.completionStatus === "partially"
                  ? `${state.completedDuration} of ${state.duration} minutes of ${state.type} — every minute counts.`
                  : "Your intention was set. Tomorrow you get another chance."}
              </p>
              <Button
                onClick={handleReset}
                className="mt-4 bg-[#7FB069] hover:bg-[#6FA055] text-white px-8 py-5 font-semibold"
              >
                Set a New Intention
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── History ── */}
        {history.length > 0 && (
          <Card className="border-2 border-[#7FB069]/20 mb-8">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-[#7FB069]" />
                <h3 className="font-semibold text-gray-700">Movement History</h3>
              </div>
              <div className="space-y-3">
                {history.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-[#7FB069]/5 border border-[#7FB069]/15"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-[#7FB069] text-white text-xs">{w.type}</Badge>
                        <span className="text-xs text-gray-500">{w.duration} min</span>
                        <span className="text-xs text-gray-400" suppressHydrationWarning>
                          {new Date(w.date).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            w.completionStatus === "yes"
                              ? "bg-green-100 text-green-700"
                              : w.completionStatus === "partially"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {w.completionStatus === "yes"
                            ? "Completed"
                            : w.completionStatus === "partially"
                            ? "Partial"
                            : "Missed"}
                        </span>
                      </div>
                      {w.reflection && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{w.reflection}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteEntry(w.id)}
                      className="ml-3 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to home */}
        <div className="flex justify-center">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white px-8 py-5"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

      </div>
    </div>
  )
}
