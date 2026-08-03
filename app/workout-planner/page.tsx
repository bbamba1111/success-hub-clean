"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Dumbbell, TrendingUp, Copy, Check, Trash2, Home, Minus, Plus } from "lucide-react"
import Link from "next/link"

// ── Types ──────────────────────────────────────────────────────────────────

type CompletionStatus = "yes" | "partially" | "no"

interface MovementRecord {
  id: string
  date: string
  type: string
  duration: number
  completionStatus: CompletionStatus
  completedDuration?: number
  reflection: string
  createdAt: string
}

interface MovementState {
  type: string
  customType: string
  duration: number
  commitment: string
  declaration: string
  completionStatus: CompletionStatus | null
  completedDuration: number
  reflection: string
  createdAt: string
}

// ── Constants ───────────────────────────────────────────────────────────────

const MOVEMENT_TYPES = [
  "Walk Away the Pounds™",
  "Walking",
  "Tai Chi",
  "Yoga",
  "Pilates",
  "Stretching",
  "Mobility",
  "Dance",
  "Strength Training",
  "Zumba",
  "Cycling",
  "Swimming",
  "Radio Taiso",
  "Qigong",
  "HIIT",
  "Barre",
  "Other",
]

const COMPLETION_MESSAGES: Record<CompletionStatus, string> = {
  yes: "Beautiful work. You honored the promise you made to yourself today.",
  partially: "Progress counts. Every promise you keep strengthens the person you're becoming.",
  no: "Tomorrow is another opportunity to honor yourself.",
}

function buildCommitment(type: string, custom: string, duration: number): string {
  const label = type === "Other" ? custom.trim() : type
  if (!label || !duration) return ""
  return `I am committed to completing a ${duration}-minute ${label} practice during today's Movement Window™.`
}

function buildDeclaration(type: string, custom: string, duration: number): string {
  const label = type === "Other" ? custom.trim() : type
  if (!label || !duration) return ""
  return `I honor my body by completing my ${duration}-minute ${label} practice today, building the strength, flexibility, energy, and consistency that support the life I am intentionally creating.`
}

function freshState(): MovementState {
  return {
    type: "",
    customType: "",
    duration: 20,
    commitment: "",
    declaration: "",
    completionStatus: null,
    completedDuration: 20,
    reflection: "",
    createdAt: new Date().toISOString(),
  }
}

// ── Component ───────────────────────────────────────────────────────────────

export default function MovementIntentionPage() {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<MovementState>(freshState)
  const [history, setHistory] = useState<MovementRecord[]>([])
  const [copiedCommitment, setCopiedCommitment] = useState(false)
  const [copiedDeclaration, setCopiedDeclaration] = useState(false)
  const [saved, setSaved] = useState(false)
  const celebrationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("movementHistory")
      if (saved) setHistory(JSON.parse(saved))
    } catch {}
    setMounted(true)
  }, [])

  // Regenerate text whenever type / duration changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      commitment: buildCommitment(prev.type, prev.customType, prev.duration),
      declaration: buildDeclaration(prev.type, prev.customType, prev.duration),
    }))
  }, [state.type, state.customType, state.duration])

  if (!mounted) return null

  // ── Helpers ───────────────────────────────────────────────────────────────

  const typeReady = state.type !== "" && (state.type !== "Other" || state.customType.trim() !== "")

  const displayType = state.type === "Other"
    ? (state.customType.trim() || "movement")
    : state.type

  const weeklyStats = (() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weekly = history.filter(r => new Date(r.date + "T12:00:00") >= weekAgo)
    const done = weekly.filter(r => r.completionStatus === "yes" || r.completionStatus === "partially")
    return {
      sessions: weekly.length,
      completed: done.length,
      minutes: done.reduce((s, r) =>
        s + (r.completionStatus === "partially" ? (r.completedDuration ?? r.duration) : r.duration), 0),
    }
  })()

  // ── Actions ───────────────────────────────────────────────────────────────

  const setType = (type: string) =>
    setState(prev => ({ ...prev, type, customType: type === "Other" ? prev.customType : "" }))

  const adjustDuration = (delta: number) =>
    setState(prev => ({ ...prev, duration: Math.min(30, Math.max(5, prev.duration + delta)) }))

  const setCompletion = (status: CompletionStatus) =>
    setState(prev => ({ ...prev, completionStatus: status }))

  const handleSave = () => {
    const record: MovementRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      type: displayType,
      duration: state.duration,
      completionStatus: state.completionStatus!,
      completedDuration: state.completionStatus === "partially" ? state.completedDuration : undefined,
      reflection: state.reflection,
      createdAt: state.createdAt,
    }
    const updated = [record, ...history]
    setHistory(updated)
    try { localStorage.setItem("movementHistory", JSON.stringify(updated)) } catch {}
    setSaved(true)
    setTimeout(() => celebrationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100)
  }

  const handleReset = () => {
    setState(freshState())
    setSaved(false)
  }

  const deleteRecord = (id: string) => {
    const updated = history.filter(r => r.id !== id)
    setHistory(updated)
    try { localStorage.setItem("movementHistory", JSON.stringify(updated)) } catch {}
  }

  const copyText = (text: string, which: "commitment" | "declaration") => {
    navigator.clipboard.writeText(text).then(() => {
      if (which === "commitment") {
        setCopiedCommitment(true)
        setTimeout(() => setCopiedCommitment(false), 2000)
      } else {
        setCopiedDeclaration(true)
        setTimeout(() => setCopiedDeclaration(false), 2000)
      }
    })
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white py-12">
      <div className="max-w-3xl mx-auto px-6 space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#4A7C59] flex items-center justify-center shadow-sm">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#2D2D2D]">Movement Intention™</h1>
          </div>
          <p className="text-sm text-gray-500">Movement Window™ · Identity Installation System™</p>
          <Link
            href="/hub"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#4A7C59] transition-colors mt-1"
          >
            <Home className="h-3 w-3" /> Back to Hub
          </Link>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Sessions", value: weeklyStats.sessions },
            { label: "Completed", value: weeklyStats.completed },
            { label: "Total Minutes", value: weeklyStats.minutes },
          ].map(s => (
            <Card key={s.label} className="border-0 shadow-sm bg-white/80 text-center">
              <CardContent className="py-4">
                <div className="text-2xl font-bold text-[#4A7C59]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label} · this week</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Main workflow — hidden after save ── */}
        {!saved && (
          <>
            {/* Step 1 — Choose movement + duration */}
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg text-[#2D2D2D]">
                  What movement are you committing to today?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-6">

                {/* Movement type buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MOVEMENT_TYPES.map(t => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={[
                        "px-3 py-2.5 rounded-lg text-sm font-medium border transition-all text-left leading-snug",
                        state.type === t
                          ? "bg-[#4A7C59] text-white border-[#4A7C59] shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#4A7C59] hover:text-[#4A7C59]",
                      ].join(" ")}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Custom field */}
                {state.type === "Other" && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Custom Movement</label>
                    <input
                      type="text"
                      placeholder="e.g. Aqua aerobics"
                      value={state.customType}
                      onChange={e => setState(prev => ({ ...prev, customType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/25 focus:border-[#4A7C59]"
                    />
                  </div>
                )}

                {/* Duration — only appears once a valid type is chosen */}
                {typeReady && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => adjustDuration(-5)}
                        disabled={state.duration <= 5}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#4A7C59] hover:text-[#4A7C59] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-4xl font-bold text-[#4A7C59] w-16 text-center tabular-nums">
                        {state.duration}
                      </span>
                      <button
                        onClick={() => adjustDuration(5)}
                        disabled={state.duration >= 30}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#4A7C59] hover:text-[#4A7C59] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="text-xs text-gray-400">5 – 30 min</span>
                    </div>
                  </div>
                )}

                {/* Auto-generated commitment */}
                {state.commitment && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="text-sm font-medium text-gray-700">My Movement Commitment™</label>
                    <Textarea
                      value={state.commitment}
                      onChange={e => setState(prev => ({ ...prev, commitment: e.target.value }))}
                      rows={2}
                      className="text-sm resize-none border-gray-200 focus:ring-[#4A7C59]/25 focus:border-[#4A7C59]"
                    />
                    <button
                      onClick={() => copyText(state.commitment, "commitment")}
                      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#4A7C59] transition-colors"
                    >
                      {copiedCommitment
                        ? <><Check className="h-3 w-3" /> Copied to clipboard</>
                        : <><Copy className="h-3 w-3" /> Copy to Zoom Chat</>}
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Declaration card — appears once commitment is ready */}
            {state.declaration && (
              <Card className="border-0 shadow-md bg-gradient-to-br from-[#4A7C59]/8 to-[#F5F1E8]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-[#4A7C59] uppercase tracking-widest text-xs">
                    My Daily Non-Negotiable™
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Read this aloud before you begin.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <blockquote className="text-[#2D2D2D] text-base leading-relaxed italic border-l-4 border-[#4A7C59]/60 pl-4">
                    &ldquo;{state.declaration}&rdquo;
                  </blockquote>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copyText(state.declaration, "declaration")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4A7C59] text-white text-xs font-semibold hover:bg-[#3d6b4a] transition-colors"
                    >
                      {copiedDeclaration ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedDeclaration ? "Copied!" : "Copy to Zoom Chat"}
                    </button>
                    <button
                      onClick={() => copyText(state.declaration, "declaration")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#4A7C59] text-[#4A7C59] text-xs font-semibold hover:bg-[#4A7C59]/10 transition-colors"
                    >
                      Repeat After Me™
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2 — Completion question (only after type is set) */}
            {typeReady && (
              <Card className="border-0 shadow-md bg-white">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <CardTitle className="text-lg text-[#2D2D2D]">
                    Did you complete today&apos;s Movement Intention?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-5">
                  <div className="flex flex-wrap gap-3">
                    {(["yes", "partially", "no"] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setCompletion(s)}
                        className={[
                          "px-6 py-2.5 rounded-full text-sm font-semibold border transition-all",
                          state.completionStatus === s
                            ? "bg-[#4A7C59] text-white border-[#4A7C59] shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#4A7C59] hover:text-[#4A7C59]",
                        ].join(" ")}
                      >
                        {s === "yes" ? "Yes" : s === "partially" ? "Partially" : "No"}
                      </button>
                    ))}
                  </div>

                  {/* Partial duration */}
                  {state.completionStatus === "partially" && (
                    <div className="space-y-2 p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <label className="text-sm font-medium text-gray-700">
                        How many minutes did you complete?
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setState(prev => ({ ...prev, completedDuration: Math.max(1, prev.completedDuration - 1) }))}
                          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#4A7C59] hover:text-[#4A7C59] transition-colors bg-white"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-3xl font-bold text-[#4A7C59] w-12 text-center tabular-nums">
                          {state.completedDuration}
                        </span>
                        <button
                          onClick={() => setState(prev => ({ ...prev, completedDuration: Math.min(prev.duration, prev.completedDuration + 1) }))}
                          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#4A7C59] hover:text-[#4A7C59] transition-colors bg-white"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs text-gray-400">of {state.duration} min</span>
                      </div>
                    </div>
                  )}

                  {/* Reflection */}
                  {state.completionStatus !== null && (
                    <Textarea
                      placeholder={
                        state.completionStatus === "yes"
                          ? "How did you feel? (optional)"
                          : state.completionStatus === "no"
                          ? "What got in the way? (optional)"
                          : "Any notes? (optional)"
                      }
                      value={state.reflection}
                      onChange={e => setState(prev => ({ ...prev, reflection: e.target.value }))}
                      rows={2}
                      className="text-sm resize-none border-gray-200 focus:ring-[#4A7C59]/25 focus:border-[#4A7C59]"
                    />
                  )}

                  {state.completionStatus !== null && (
                    <Button
                      onClick={handleSave}
                      className="w-full bg-[#4A7C59] hover:bg-[#3d6b4a] text-white rounded-full py-5 text-sm font-semibold shadow-sm"
                    >
                      Save My Movement Record
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* ── Celebration ── */}
        {saved && (
          <div ref={celebrationRef}>
            <Card className="border-0 shadow-md bg-gradient-to-br from-[#4A7C59]/10 to-[#F5F1E8] text-center">
              <CardContent className="py-10 space-y-4">
                <div className="text-5xl select-none">🌸</div>
                <p className="text-lg font-semibold text-[#2D2D2D] max-w-sm mx-auto leading-snug">
                  {COMPLETION_MESSAGES[state.completionStatus!]}
                </p>
                <Badge className="bg-[#4A7C59]/12 text-[#4A7C59] border-0 px-4 py-1.5 text-xs font-medium">
                  {displayType} &nbsp;·&nbsp;{" "}
                  {state.completionStatus === "partially"
                    ? `${state.completedDuration} of ${state.duration} min`
                    : `${state.duration} min`}
                  &nbsp;·&nbsp;{" "}
                  {state.completionStatus === "yes"
                    ? "Completed"
                    : state.completionStatus === "partially"
                    ? "Partial"
                    : "Not completed"}
                </Badge>
                <div className="pt-2">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-[#4A7C59] text-[#4A7C59] hover:bg-[#4A7C59]/10 rounded-full px-8"
                  >
                    Start a New Intention
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Movement History™ ── */}
        {history.length > 0 && (
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg text-[#2D2D2D] flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#4A7C59]" />
                Movement History™
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              {history.map(record => (
                <div
                  key={record.id}
                  className="flex items-start justify-between p-3 rounded-xl bg-[#F5F1E8]/60 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-[#2D2D2D]">{record.type}</span>
                      <Badge className={[
                        "text-xs border-0 px-2 py-0.5 font-medium",
                        record.completionStatus === "yes"
                          ? "bg-[#4A7C59]/15 text-[#4A7C59]"
                          : record.completionStatus === "partially"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-50 text-red-500",
                      ].join(" ")}>
                        {record.completionStatus === "yes"
                          ? "Completed"
                          : record.completionStatus === "partially"
                          ? "Partial"
                          : "Not completed"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(record.date + "T12:00:00").toLocaleDateString()}
                      </span>
                      <span>
                        {record.completionStatus === "partially"
                          ? `${record.completedDuration ?? record.duration} min`
                          : `${record.duration} min`}
                      </span>
                    </div>
                    {record.reflection && (
                      <p className="text-xs text-gray-400 mt-0.5 italic truncate">{record.reflection}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="ml-3 opacity-0 group-hover:opacity-100 p-1.5 rounded text-gray-300 hover:text-red-400 transition-all"
                    aria-label="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
