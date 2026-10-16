"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Salad, Clock, TrendingUp, Target, Trash2, Copy, Check, ChevronRight } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface LunchEntry {
  id: string
  date: string
  activity: string
  duration: number
  declaration: string
  completionStatus: "yes" | "partially" | "no"
  completedDuration?: number
  reflection: string
}

type Step = "intention" | "declare" | "complete" | "celebrate"

interface PageState {
  activity: string
  duration: number
  declaration: string
  completionStatus: "yes" | "partially" | "no" | null
  completedDuration: number
  reflection: string
  step: Step
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LUNCH_ACTIVITIES = [
  "Nourishing meal, away from my desk", "Walk outside", "Meal with a friend or colleague",
  "Cook something fresh", "Rest on the couch", "Read for pleasure", "Sit in the sun",
  "Stretch or light movement", "Journal", "Meditate", "Prep tomorrow's meals",
  "Call someone I love", "Nap", "Other",
]

const DURATION_OPTIONS = [30, 45, 60, 75, 90]

function buildDeclaration(activity: string, duration: number): string {
  if (!activity) return ""
  return `I am someone who protects my Extended Healthy Hybrid Lunch Break™. Today I commit to ${duration} minutes of ${activity.toLowerCase()} — because a nourished body and an unrushed mind build a sustainable business.`
}

function freshState(): PageState {
  return {
    activity: "",
    duration: 60,
    declaration: "",
    completionStatus: null,
    completedDuration: 60,
    reflection: "",
    step: "intention",
  }
}

/**
 * LunchPlannerWidget — the intention → declare → complete → celebrate →
 * history flow for the Extended Healthy Hybrid Lunch Break™. Mirrors
 * WorkoutPlannerWidget / SleepTrackerWidget so all three protected windows
 * share one consistent planning ritual. Persists to `lunch_breaks_v1`.
 */
export function LunchPlannerWidget() {
  const [mounted, setMounted] = useState(false)
  const [history, setHistory] = useState<LunchEntry[]>([])
  const [state, setState] = useState<PageState>(freshState())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("lunch_breaks_v1")
    if (saved) setHistory(JSON.parse(saved))
    localStorage.setItem("dashboardVisited", "true")
    setMounted(true)
  }, [])

  const handleActivitySelect = (activity: string) =>
    setState((p) => ({ ...p, activity, declaration: buildDeclaration(activity, p.duration) }))

  const handleDurationSelect = (duration: number) =>
    setState((p) => ({ ...p, duration, completedDuration: duration, declaration: buildDeclaration(p.activity, duration) }))

  const handleGoToDeclare = () => {
    if (!state.activity) return
    setState((p) => ({ ...p, step: "declare" }))
  }

  const handleGoToComplete = () => setState((p) => ({ ...p, step: "complete" }))

  const handleSave = () => {
    const now = new Date().toISOString()
    const record: LunchEntry = {
      id: Date.now().toString(),
      date: now.split("T")[0],
      activity: state.activity,
      duration: state.completionStatus === "partially" ? state.completedDuration : state.duration,
      declaration: state.declaration,
      completionStatus: state.completionStatus!,
      completedDuration: state.completionStatus === "partially" ? state.completedDuration : undefined,
      reflection: state.reflection,
    }
    const updated = [record, ...history]
    setHistory(updated)
    localStorage.setItem("lunch_breaks_v1", JSON.stringify(updated))
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
    localStorage.setItem("lunch_breaks_v1", JSON.stringify(updated))
  }

  if (!mounted) return null

  const weeklySessions = history.filter((w) => {
    const d = new Date(w.date)
    const now = new Date()
    return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  })
  const weeklyMinutes = weeklySessions.reduce((s, w) => s + w.duration, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-[#E26C73] to-[#F4C6A8] rounded-full flex items-center justify-center mx-auto mb-3">
          <Salad className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-[#E26C73] mb-1">Lunch Break Intention™</h3>
        <p className="text-gray-500 text-sm">Set your intention, then protect it.</p>
      </div>

      {/* Weekly stats */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { icon: Target, label: "Breaks this week", value: weeklySessions.length },
          { icon: Clock, label: "Minutes this week", value: weeklyMinutes },
          { icon: TrendingUp, label: "Avg per break", value: weeklySessions.length > 0 ? Math.round(weeklyMinutes / weeklySessions.length) : 0 },
        ] as const).map(({ icon: Icon, label, value }) => (
          <Card key={label} className="border-2 border-[#E26C73]/20">
            <CardContent className="pt-4 pb-3">
              <Icon className="h-4 w-4 text-[#E26C73] mb-2" />
              <div className="text-2xl font-bold text-[#E26C73]">{value}</div>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── STEP 1: Intention ── */}
      {state.step === "intention" && (
        <Card className="border-2 border-[#E26C73]/30">
          <CardContent className="pt-6 pb-6 space-y-6">
            <div>
              <p className="text-xs font-semibold text-[#E26C73] uppercase tracking-widest mb-1">Step 1 of 3</p>
              <h4 className="text-xl font-bold text-gray-800 mb-1">Set My Lunch Break Intention™</h4>
              <p className="text-sm text-gray-500">
                I will transform your intention into an Intention Declaration™ you will live from, in this break.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Choose an activity below … or create your own
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {LUNCH_ACTIVITIES.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleActivitySelect(t)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      state.activity === t
                        ? "bg-[#E26C73] border-[#E26C73] text-white font-semibold"
                        : "bg-white border-gray-200 text-gray-700 hover:border-[#E26C73] hover:text-[#E26C73]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or type your own plan…"
                value={LUNCH_ACTIVITIES.includes(state.activity) ? "" : state.activity}
                onChange={(e) => handleActivitySelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E26C73]/40"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Duration</p>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => handleDurationSelect(d)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${
                      state.duration === d
                        ? "bg-[#E26C73] border-[#E26C73] text-white font-semibold"
                        : "bg-white border-gray-200 text-gray-700 hover:border-[#E26C73] hover:text-[#E26C73]"
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGoToDeclare}
              disabled={!state.activity}
              className="w-full bg-[#E26C73] hover:bg-[#D05A60] text-white py-6 text-base font-semibold disabled:opacity-40"
            >
              Build My Declaration <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── STEP 2: Declaration ── */}
      {state.step === "declare" && (
        <Card className="border-2 border-[#E26C73]/30">
          <CardContent className="pt-6 pb-6 space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#E26C73] uppercase tracking-widest mb-1">Step 2 of 3</p>
              <h4 className="text-xl font-bold text-gray-800 mb-1">My Intention Declaration™</h4>
              <p className="text-sm text-gray-500">Read this aloud before you step away. Edit it until it feels true.</p>
            </div>

            <Textarea
              value={state.declaration}
              onChange={(e) => setState((p) => ({ ...p, declaration: e.target.value }))}
              rows={5}
              className="text-base leading-relaxed border-[#E26C73]/40 focus:ring-[#E26C73]/30 resize-none"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex-1 border-[#E26C73]/40 text-[#E26C73] hover:bg-[#E26C73]/5"
              >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied!" : "Copy to Zoom Chat"}
              </Button>
              <Button
                onClick={handleGoToComplete}
                className="flex-1 bg-[#E26C73] hover:bg-[#D05A60] text-white font-semibold"
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
        <Card className="border-2 border-[#E26C73]/30">
          <CardContent className="pt-6 pb-6 space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#E26C73] uppercase tracking-widest mb-1">Step 3 of 3</p>
              <h4 className="text-xl font-bold text-gray-800 mb-1">How did your break go?</h4>
              <p className="text-sm text-gray-500">
                Your intention was{" "}
                <span className="font-semibold text-gray-700">
                  {state.duration} min of {state.activity.toLowerCase()}
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
                <p className="text-sm font-semibold text-gray-700">How many minutes did you actually take?</p>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={state.duration}
                    value={state.completedDuration}
                    onChange={(e) => setState((p) => ({ ...p, completedDuration: Number(e.target.value) }))}
                    className="flex-1 accent-[#E26C73]"
                  />
                  <span className="text-lg font-bold text-[#E26C73] w-16 text-right">
                    {state.completedDuration} min
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Reflection (optional)</p>
              <Textarea
                placeholder="How did you feel afterward? What nourished you?"
                value={state.reflection}
                onChange={(e) => setState((p) => ({ ...p, reflection: e.target.value }))}
                rows={3}
                className="resize-none border-gray-200 text-sm"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={!state.completionStatus}
              className="w-full bg-[#E26C73] hover:bg-[#D05A60] text-white py-6 text-base font-semibold disabled:opacity-40"
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
        <Card className="border-2 border-[#E26C73]/30 text-center">
          <CardContent className="pt-10 pb-10 space-y-4">
            <div className="text-5xl mb-2">🌸</div>
            <h4 className="text-xl font-bold text-[#E26C73]">
              {state.completionStatus === "yes"
                ? "You protected your break fully. That's everything."
                : state.completionStatus === "partially"
                ? "Partial rest is still rest. You still stepped away."
                : "You were honest with yourself. That matters."}
            </h4>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              {state.completionStatus === "yes"
                ? `${state.duration} minutes of ${state.activity.toLowerCase()} — logged and celebrated.`
                : state.completionStatus === "partially"
                ? `${state.completedDuration} of ${state.duration} minutes — every minute nourished you.`
                : "Your intention was set. Tomorrow you get another chance."}
            </p>
            <Button
              onClick={handleReset}
              className="mt-4 bg-[#E26C73] hover:bg-[#D05A60] text-white px-8 py-5 font-semibold"
            >
              Set a New Intention
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── History ── */}
      {history.length > 0 && (
        <Card className="border-2 border-[#E26C73]/20">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-[#E26C73]" />
              <h4 className="font-semibold text-gray-700">Lunch Break History</h4>
            </div>
            <div className="space-y-3">
              {history.map((w) => (
                <div
                  key={w.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-[#E26C73]/5 border border-[#E26C73]/15"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-[#E26C73] text-white text-xs">{w.activity}</Badge>
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
                    {w.reflection && <p className="text-xs text-gray-500 mt-1 truncate">{w.reflection}</p>}
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
    </div>
  )
}
