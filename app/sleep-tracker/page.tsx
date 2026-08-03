"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Moon, TrendingUp, Copy, Check, Trash2, Home } from "lucide-react"
import Link from "next/link"

// ── Types ──────────────────────────────────────────────────────────────────

type CompletionStatus = "yes" | "partially" | "no"

interface SleepRecord {
  id: string
  date: string
  targetHours: number
  completionStatus: CompletionStatus
  actualHours?: number
  reflection: string
  createdAt: string
}

interface SleepState {
  targetHours: number
  commitment: string
  declaration: string
  completionStatus: CompletionStatus | null
  actualHours: number
  reflection: string
  createdAt: string
}

// ── Constants ───────────────────────────────────────────────────────────────

const SLEEP_OPTIONS = [6.5, 7, 7.5, 8, 8.5, 9]

const COMPLETION_MESSAGES: Record<CompletionStatus, string> = {
  yes: "Beautiful. You honored your commitment to rest. Your body and mind thank you.",
  partially: "Rest is not all-or-nothing. Every hour you protect is an investment in yourself.",
  no: "Tomorrow is another opportunity to honor yourself with the rest you deserve.",
}

function buildCommitment(hours: number): string {
  return `I am committed to protecting ${hours} hours of restorative sleep tonight to support my health, energy, and the life I am intentionally creating.`
}

function buildDeclaration(hours: number): string {
  return `I honor my body and mind by protecting ${hours} hours of restorative sleep tonight, knowing that deep rest is the foundation of my strength, clarity, and the extraordinary life I am building.`
}

function freshState(): SleepState {
  return {
    targetHours: 0,
    commitment: "",
    declaration: "",
    completionStatus: null,
    actualHours: 7,
    reflection: "",
    createdAt: "",
  }
}

// ── Component ───────────────────────────────────────────────────────────────

export default function SleepIntentionPage() {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<SleepState>(freshState)
  const [history, setHistory] = useState<SleepRecord[]>([])
  const [copiedCommitment, setCopiedCommitment] = useState(false)
  const [copiedDeclaration, setCopiedDeclaration] = useState(false)
  const [saved, setSaved] = useState(false)
  const celebrationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sleepHistory")
      if (saved) setHistory(JSON.parse(saved))
    } catch {}
    setMounted(true)
  }, [])

  // Regenerate text whenever targetHours changes
  useEffect(() => {
    if (!state.targetHours) return
    setState(prev => ({
      ...prev,
      commitment: buildCommitment(prev.targetHours),
      declaration: buildDeclaration(prev.targetHours),
    }))
  }, [state.targetHours])

  if (!mounted) return null

  // ── Helpers ───────────────────────────────────────────────────────────────

  const weeklyStats = (() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weekly = history.filter(r => new Date(r.date + "T12:00:00") >= weekAgo)
    const honored = weekly.filter(r => r.completionStatus === "yes" || r.completionStatus === "partially")
    const totalHours = honored.reduce((s, r) =>
      s + (r.completionStatus === "partially" ? (r.actualHours ?? r.targetHours) : r.targetHours), 0)
    return {
      nights: weekly.length,
      honored: honored.length,
      avgHours: honored.length > 0 ? (totalHours / honored.length).toFixed(1) : "—",
    }
  })()

  // ── Actions ───────────────────────────────────────────────────────────────

  const setTarget = (hours: number) =>
    setState(prev => ({ ...prev, targetHours: hours }))

  const setCompletion = (status: CompletionStatus) =>
    setState(prev => ({
      ...prev,
      completionStatus: status,
      actualHours: status === "partially" ? Math.max(4, prev.targetHours - 1) : prev.targetHours,
    }))

  const handleSave = () => {
    const now = new Date().toISOString()
    const record: SleepRecord = {
      id: Date.now().toString(),
      date: now.split("T")[0],
      targetHours: state.targetHours,
      completionStatus: state.completionStatus!,
      actualHours: state.completionStatus === "partially" ? state.actualHours : undefined,
      reflection: state.reflection,
      createdAt: now,
    }
    const updated = [record, ...history]
    setHistory(updated)
    try { localStorage.setItem("sleepHistory", JSON.stringify(updated)) } catch {}
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
    try { localStorage.setItem("sleepHistory", JSON.stringify(updated)) } catch {}
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
            <div className="w-12 h-12 rounded-full bg-[#E26C73] flex items-center justify-center shadow-sm">
              <Moon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#2D2D2D]">Sleep Intention™</h1>
          </div>
          <p className="text-sm text-gray-500">Sleep Segment · Identity Installation System™</p>
          <Link
            href="/hub"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#E26C73] transition-colors mt-1"
          >
            <Home className="h-3 w-3" /> Back to Hub
          </Link>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Nights", value: weeklyStats.nights },
            { label: "Honored", value: weeklyStats.honored },
            { label: "Avg Hours", value: weeklyStats.avgHours },
          ].map(s => (
            <Card key={s.label} className="border-0 shadow-sm bg-white/80 text-center">
              <CardContent className="py-4">
                <div className="text-2xl font-bold text-[#E26C73]">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label} · this week</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Main workflow — hidden after save ── */}
        {!saved && (
          <>
            {/* Step 1 — Choose target hours */}
            <Card className="border-0 shadow-md bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg text-[#2D2D2D]">
                  How many hours of restorative sleep will you protect tonight?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-6">

                {/* Hours buttons */}
                <div className="flex flex-wrap gap-3">
                  {SLEEP_OPTIONS.map(h => (
                    <button
                      key={h}
                      onClick={() => setTarget(h)}
                      className={[
                        "w-16 py-3 rounded-xl text-base font-bold border transition-all",
                        state.targetHours === h
                          ? "bg-[#E26C73] text-white border-[#E26C73] shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#E26C73] hover:text-[#E26C73]",
                      ].join(" ")}
                    >
                      {h}h
                    </button>
                  ))}
                </div>

                {/* Auto-generated commitment */}
                {state.commitment && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="text-sm font-medium text-gray-700">My Sleep Commitment™</label>
                    <Textarea
                      value={state.commitment}
                      onChange={e => setState(prev => ({ ...prev, commitment: e.target.value }))}
                      rows={2}
                      className="text-sm resize-none border-gray-200 focus:ring-[#E26C73]/25 focus:border-[#E26C73]"
                    />
                    <button
                      onClick={() => copyText(state.commitment, "commitment")}
                      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#E26C73] transition-colors"
                    >
                      {copiedCommitment
                        ? <><Check className="h-3 w-3" /> Copied to clipboard</>
                        : <><Copy className="h-3 w-3" /> Copy to Zoom Chat</>}
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Declaration card */}
            {state.declaration && (
              <Card className="border-0 shadow-md bg-gradient-to-br from-[#E26C73]/8 to-[#F5F1E8]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-[#E26C73] uppercase tracking-widest">
                    My Daily Non-Negotiable™
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">Read this aloud before you wind down.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <blockquote className="text-[#2D2D2D] text-base leading-relaxed italic border-l-4 border-[#E26C73]/60 pl-4">
                    &ldquo;{state.declaration}&rdquo;
                  </blockquote>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copyText(state.declaration, "declaration")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E26C73] text-white text-xs font-semibold hover:bg-[#d55a60] transition-colors"
                    >
                      {copiedDeclaration ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedDeclaration ? "Copied!" : "Copy to Zoom Chat"}
                    </button>
                    <button
                      onClick={() => copyText(state.declaration, "declaration")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E26C73] text-[#E26C73] text-xs font-semibold hover:bg-[#E26C73]/10 transition-colors"
                    >
                      Repeat After Me™
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2 — Did you honor your commitment? */}
            {state.targetHours > 0 && (
              <Card className="border-0 shadow-md bg-white">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <CardTitle className="text-lg text-[#2D2D2D]">
                    Did you honor your sleep commitment?
                  </CardTitle>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Answer this the following morning.
                  </p>
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
                            ? "bg-[#E26C73] text-white border-[#E26C73] shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#E26C73] hover:text-[#E26C73]",
                        ].join(" ")}
                      >
                        {s === "yes" ? "Yes" : s === "partially" ? "Partially" : "No"}
                      </button>
                    ))}
                  </div>

                  {/* Actual hours for partial */}
                  {state.completionStatus === "partially" && (
                    <div className="space-y-2 p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <label className="text-sm font-medium text-gray-700">
                        How many hours did you actually sleep?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SLEEP_OPTIONS.filter(h => h <= state.targetHours).map(h => (
                          <button
                            key={h}
                            onClick={() => setState(prev => ({ ...prev, actualHours: h }))}
                            className={[
                              "w-14 py-2.5 rounded-xl text-sm font-bold border transition-all",
                              state.actualHours === h
                                ? "bg-amber-500 text-white border-amber-500"
                                : "bg-white text-gray-700 border-gray-200 hover:border-amber-400",
                            ].join(" ")}
                          >
                            {h}h
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reflection */}
                  {state.completionStatus !== null && (
                    <Textarea
                      placeholder={
                        state.completionStatus === "yes"
                          ? "How do you feel this morning? (optional)"
                          : state.completionStatus === "no"
                          ? "What got in the way? (optional)"
                          : "Any notes? (optional)"
                      }
                      value={state.reflection}
                      onChange={e => setState(prev => ({ ...prev, reflection: e.target.value }))}
                      rows={2}
                      className="text-sm resize-none border-gray-200 focus:ring-[#E26C73]/25 focus:border-[#E26C73]"
                    />
                  )}

                  {state.completionStatus !== null && (
                    <Button
                      onClick={handleSave}
                      className="w-full bg-[#E26C73] hover:bg-[#d55a60] text-white rounded-full py-5 text-sm font-semibold shadow-sm"
                    >
                      Save My Sleep Record
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
            <Card className="border-0 shadow-md bg-gradient-to-br from-[#E26C73]/10 to-[#F5F1E8] text-center">
              <CardContent className="py-10 space-y-4">
                <div className="text-5xl select-none">🌙</div>
                <p className="text-lg font-semibold text-[#2D2D2D] max-w-sm mx-auto leading-snug">
                  {COMPLETION_MESSAGES[state.completionStatus!]}
                </p>
                <Badge className="bg-[#E26C73]/12 text-[#E26C73] border-0 px-4 py-1.5 text-xs font-medium">
                  {state.targetHours}h target &nbsp;·&nbsp;{" "}
                  {state.completionStatus === "partially"
                    ? `${state.actualHours}h actual`
                    : state.completionStatus === "yes"
                    ? "Honored"
                    : "Not honored"}
                </Badge>
                <div className="pt-2">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-[#E26C73] text-[#E26C73] hover:bg-[#E26C73]/10 rounded-full px-8"
                  >
                    Start a New Intention
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Sleep History™ ── */}
        {history.length > 0 && (
          <Card className="border-0 shadow-md bg-white">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg text-[#2D2D2D] flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#E26C73]" />
                Sleep History™
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
                      <span className="font-semibold text-sm text-[#2D2D2D]">
                        {record.targetHours}h target
                      </span>
                      <Badge className={[
                        "text-xs border-0 px-2 py-0.5 font-medium",
                        record.completionStatus === "yes"
                          ? "bg-[#E26C73]/15 text-[#E26C73]"
                          : record.completionStatus === "partially"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-50 text-red-500",
                      ].join(" ")}>
                        {record.completionStatus === "yes"
                          ? "Honored"
                          : record.completionStatus === "partially"
                          ? `Partial · ${record.actualHours}h`
                          : "Not honored"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(record.date + "T12:00:00").toLocaleDateString()}
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
