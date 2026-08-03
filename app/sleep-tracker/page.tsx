"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown, Copy, Check, RotateCcw, Calendar, Clock, TrendingUp, Trash2, Home, ArrowLeft, Moon } from "lucide-react"
import { CelebrationOverlay, type CompletionStatus } from "@/components/identity-installation/celebration-overlay"
import Link from "next/link"

// ── Types ────────────────────────────────────────────────────────────────────

type Step = "intention" | "declaration" | "completion" | "history"

interface SleepEntry {
  id: string
  date: string
  targetHours: number
  status: CompletionStatus
  actualHours?: number
  notes?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SLEEP_HOURS_OPTIONS = [6.5, 7, 7.5, 8, 8.5, 9]

const buildCommitment = (hours: number) =>
  `I am committed to protecting ${hours} hours of restorative sleep tonight.`

const buildDeclaration = (hours: number) =>
  `I declare that I am a person who honors their rest. Tonight I am protecting ${hours} hours of restorative sleep — not as a luxury, but as an act of self-leadership. My body and mind deserve this recovery. I am a Daily Non-Negotiable\u2122 leader, and I lead myself first.`

// ── HoursSpinner ──────────────────────────────────────────────────────────────

function HoursSpinner({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const idx = SLEEP_HOURS_OPTIONS.indexOf(value)
  const inc = () => { if (idx < SLEEP_HOURS_OPTIONS.length - 1) onChange(SLEEP_HOURS_OPTIONS[idx + 1]) }
  const dec = () => { if (idx > 0) onChange(SLEEP_HOURS_OPTIONS[idx - 1]) }

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={inc}
        disabled={idx >= SLEEP_HOURS_OPTIONS.length - 1}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#C13B6B]/30 bg-white text-[#C13B6B] transition hover:bg-[#C13B6B]/10 disabled:opacity-30"
        aria-label="Increase hours"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <span className="font-playfair text-[28px] font-semibold text-[#7A2040] leading-none">{value}</span>
      <span className="font-montserrat text-[10px] uppercase tracking-[0.18em] text-[#9B8B8B]">hours</span>
      <button
        type="button"
        onClick={dec}
        disabled={idx <= 0}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#C13B6B]/30 bg-white text-[#C13B6B] transition hover:bg-[#C13B6B]/10 disabled:opacity-30"
        aria-label="Decrease hours"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  )
}

// ── RepeatAfterMe ─────────────────────────────────────────────────────────────

function RepeatAfterMe({ declaration, accentColor }: { declaration: string; accentColor: string }) {
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
        background: "linear-gradient(135deg, rgba(193,59,107,0.06) 0%, rgba(253,250,245,1) 100%)",
        borderColor: "rgba(193,59,107,0.20)",
      }}
    >
      <p className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.20em]" style={{ color: accentColor }}>
        Repeat After Me\u2122
      </p>
      <p className="font-playfair text-[15px] italic leading-relaxed text-[#2D1F25]">
        &ldquo;{declaration}&rdquo;
      </p>
      <button
        type="button"
        onClick={copy}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-1.5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.14em] transition hover:opacity-80"
        style={{ borderColor: "rgba(193,59,107,0.25)", color: accentColor }}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy for Zoom"}
      </button>
    </div>
  )
}

// ── StepLabel ─────────────────────────────────────────────────────────────────

function StepLabel({ n, label, active, accentColor }: { n: number; label: string; active: boolean; accentColor: string }) {
  return (
    <div className={`flex items-center gap-2 font-montserrat text-[11px] font-semibold uppercase tracking-[0.16em] transition ${active ? "" : "text-[#C8B89A]"}`} style={active ? { color: accentColor } : {}}>
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px]"
        style={active ? { backgroundColor: accentColor, borderColor: accentColor, color: "white" } : { borderColor: "#C8B89A", color: "#C8B89A" }}
      >
        {n}
      </span>
      {label}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const ACCENT = "#C13B6B"

export default function SleepTrackerPage() {
  const [entries, setEntries] = useState<SleepEntry[]>([])
  const [step, setStep] = useState<Step>("intention")

  // Intention state
  const [targetHours, setTargetHours] = useState(8)
  const [commitment, setCommitment] = useState("")

  // Completion state
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | "">("")
  const [actualHours, setActualHours] = useState(8)
  const [completionNotes, setCompletionNotes] = useState("")

  // Celebration
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationStatus, setCelebrationStatus] = useState<CompletionStatus>("honored")

  useEffect(() => {
    localStorage.setItem("dashboardVisited", "true")
    const saved = localStorage.getItem("sleepEntries")
    if (saved) setEntries(JSON.parse(saved))
  }, [])

  // Auto-update commitment sentence when hours change
  useEffect(() => {
    setCommitment(buildCommitment(targetHours))
  }, [targetHours])

  const declaration = buildDeclaration(targetHours)

  const saveEntry = useCallback(() => {
    if (!completionStatus) return
    const entry: SleepEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      targetHours,
      status: completionStatus,
      actualHours: completionStatus === "partial" ? actualHours : undefined,
      notes: completionNotes || undefined,
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem("sleepEntries", JSON.stringify(updated))

    setCelebrationStatus(completionStatus)
    setShowCelebration(true)
  }, [completionStatus, targetHours, actualHours, completionNotes, entries])

  const handleCelebrationDone = () => {
    setShowCelebration(false)
    setStep("history")
    setCompletionStatus("")
    setCompletionNotes("")
    setActualHours(8)
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    localStorage.setItem("sleepEntries", JSON.stringify(updated))
  }

  const getWeeklyStats = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const weekly = entries.filter((e) => new Date(e.date) >= weekAgo)
    const honored = weekly.filter((e) => e.status === "honored")
    const totalHours = honored.reduce((s, e) => s + e.targetHours, 0)
    const avg = honored.length > 0 ? totalHours / honored.length : 0
    return { count: weekly.length, honored: honored.length, avgHours: avg }
  }

  const stats = getWeeklyStats()

  return (
    <>
      <CelebrationOverlay
        show={showCelebration}
        status={celebrationStatus}
        flow="sleep"
        onDone={handleCelebrationDone}
      />

      <div className="min-h-screen bg-[#FDFAF5] py-10">
        <div className="mx-auto max-w-2xl px-6">

          {/* Header */}
          <div className="mb-10 text-center">
            <p className="mb-1 font-montserrat text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
              Daily Non-Negotiable\u2122
            </p>
            <div className="flex items-center justify-center gap-2">
              <Moon className="h-5 w-5" style={{ color: ACCENT }} />
              <h1 className="font-playfair text-[34px] font-semibold text-[#2D1F25]">
                Unplug &amp; Restore\u2122
              </h1>
            </div>
            <p className="mt-1.5 font-montserrat text-[13px] text-[#9B8B8B]">
              Protecting your sleep is an act of self-leadership.
            </p>
          </div>

          {/* Weekly stats */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            {[
              { label: "This Week", value: stats.count, unit: "nights" },
              { label: "Honored", value: stats.honored, unit: "completed" },
              { label: "Avg Sleep", value: stats.avgHours > 0 ? `${stats.avgHours.toFixed(1)}h` : "—", unit: "per night" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border bg-white px-4 py-4 text-center shadow-sm" style={{ borderColor: "rgba(193,59,107,0.18)" }}>
                <p className="font-playfair text-[28px] font-semibold" style={{ color: "#7A2040" }}>{s.value}</p>
                <p className="mt-0.5 font-montserrat text-[10px] uppercase tracking-[0.16em] text-[#9B8B8B]">{s.unit}</p>
                <p className="font-montserrat text-[11px] text-[#C8B89A]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Step indicator */}
          {step !== "history" && (
            <div className="mb-6 flex items-center gap-4">
              <StepLabel n={1} label="Intention" active={step === "intention"} accentColor={ACCENT} />
              <div className="h-px flex-1 bg-[#E8DDD5]" />
              <StepLabel n={2} label="Declaration" active={step === "declaration"} accentColor={ACCENT} />
              <div className="h-px flex-1 bg-[#E8DDD5]" />
              <StepLabel n={3} label="Morning Check-In" active={step === "completion"} accentColor={ACCENT} />
            </div>
          )}

          <AnimatePresence mode="wait">

            {/* ── Step 1: Intention ── */}
            {step === "intention" && (
              <motion.div key="intention" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: "easeOut" }}>
                <div className="rounded-2xl border border-[#C13B6B]/18 bg-white p-7 shadow-sm">
                  <p className="mb-5 font-montserrat text-[11px] font-bold uppercase tracking-[0.20em]" style={{ color: ACCENT }}>
                    Set Your Sleep Intention
                  </p>

                  <div className="mb-6 flex items-center gap-6">
                    <div>
                      <p className="mb-2 font-montserrat text-[12px] font-semibold text-[#5A4A52]">Target Hours</p>
                      <HoursSpinner value={targetHours} onChange={setTargetHours} />
                    </div>
                    <motion.div
                      key={targetHours}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 rounded-xl p-4"
                      style={{ background: "rgba(193,59,107,0.06)" }}
                    >
                      <p className="mb-1.5 font-montserrat text-[10px] uppercase tracking-[0.16em]" style={{ color: ACCENT }}>Your Commitment</p>
                      <p className="font-playfair text-[13px] italic leading-relaxed text-[#3D2E32]">
                        &ldquo;{commitment}&rdquo;
                      </p>
                    </motion.div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("declaration")}
                    className="w-full rounded-xl py-3.5 font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-white transition"
                    style={{ backgroundColor: ACCENT }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Install My Sleep Declaration\u2122
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Declaration ── */}
            {step === "declaration" && (
              <motion.div key="declaration" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: "easeOut" }}>
                <div className="rounded-2xl border bg-white p-7 shadow-sm" style={{ borderColor: "rgba(193,59,107,0.18)" }}>
                  <p className="mb-1 font-montserrat text-[11px] font-bold uppercase tracking-[0.20em]" style={{ color: ACCENT }}>
                    Cherry Blossom\u2122 Sleep Declaration
                  </p>
                  <p className="mb-5 font-montserrat text-[11px] text-[#9B8B8B]">
                    Read this aloud before you wind down tonight.
                  </p>

                  <RepeatAfterMe declaration={declaration} accentColor={ACCENT} />

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
                      className="flex-1 rounded-xl py-3 font-montserrat text-[13px] font-bold uppercase tracking-[0.14em] text-white transition"
                      style={{ backgroundColor: ACCENT }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      Declaration Installed\u2122
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Morning Check-In ── */}
            {step === "completion" && (
              <motion.div key="completion" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: "easeOut" }}>
                <div className="rounded-2xl border bg-white p-7 shadow-sm" style={{ borderColor: "rgba(193,59,107,0.18)" }}>
                  <p className="mb-1 font-montserrat text-[11px] font-bold uppercase tracking-[0.20em]" style={{ color: ACCENT }}>
                    Morning Check-In
                  </p>
                  <p className="mb-5 font-playfair text-[15px] italic text-[#3D2E32]">
                    Did you honor your {targetHours}-hour sleep commitment?
                  </p>

                  <div className="mb-5 flex gap-3">
                    {(["honored", "partial", "not-completed"] as CompletionStatus[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCompletionStatus(s)}
                        className="flex-1 rounded-xl border py-3 font-montserrat text-[12px] font-semibold uppercase tracking-[0.12em] transition"
                        style={{
                          backgroundColor: completionStatus === s ? ACCENT : "white",
                          borderColor: completionStatus === s ? ACCENT : "rgba(200,184,154,0.5)",
                          color: completionStatus === s ? "white" : "#5A4A52",
                        }}
                      >
                        {s === "honored" ? "Yes" : s === "partial" ? "Partially" : "Not Tonight"}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {completionStatus === "partial" && (
                      <motion.div key="partial-detail" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                        <label className="mb-1.5 block font-montserrat text-[12px] font-semibold text-[#5A4A52]">
                          How many hours did you sleep?
                        </label>
                        <HoursSpinner value={actualHours} onChange={setActualHours} />
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
                          placeholder="No judgment — just noticing..."
                          className="w-full rounded-xl border border-[#C8B89A]/50 bg-[#FDFAF5] px-4 py-3 font-montserrat text-[13px] text-[#3D2E32] placeholder:text-[#C8B89A] focus:outline-none focus:ring-2"
                          style={{ "--tw-ring-color": `${ACCENT}30` } as React.CSSProperties}
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
                      onClick={saveEntry}
                      className="flex-1 rounded-xl py-3 font-montserrat text-[13px] font-bold uppercase tracking-[0.14em] text-white transition disabled:opacity-40"
                      style={{ backgroundColor: ACCENT }}
                      onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.opacity = "0.88" }}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
                  <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.20em]" style={{ color: ACCENT }}>
                    Sleep History\u2122
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("intention")
                      setCompletionStatus("")
                    }}
                    className="flex items-center gap-1.5 rounded-full border bg-white px-3.5 py-1.5 font-montserrat text-[11px] font-semibold transition"
                    style={{ borderColor: "rgba(193,59,107,0.25)", color: ACCENT }}
                  >
                    <RotateCcw className="h-3 w-3" /> New Intention
                  </button>
                </div>

                {entries.length === 0 ? (
                  <div className="rounded-2xl border border-[#C8B89A]/30 bg-white p-8 text-center">
                    <p className="font-playfair text-[16px] italic text-[#9B8B8B]">Your sleep history will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {entries
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((e) => (
                        <div
                          key={e.id}
                          className="flex items-start justify-between rounded-2xl border bg-white p-5 shadow-sm"
                          style={{ borderColor: "rgba(193,59,107,0.12)" }}
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="font-montserrat text-[12px] font-bold" style={{ color: "#7A2040" }}>
                                {e.targetHours}h target
                              </span>
                              <span className="flex items-center gap-1 font-montserrat text-[11px] text-[#9B8B8B]">
                                <Calendar className="h-3 w-3" /> {new Date(e.date).toLocaleDateString()}
                              </span>
                              {e.actualHours && (
                                <span className="flex items-center gap-1 font-montserrat text-[11px] text-[#9B8B8B]">
                                  <Clock className="h-3 w-3" /> {e.actualHours}h actual
                                </span>
                              )}
                              <span
                                className="rounded-full px-2.5 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.12em]"
                                style={{
                                  backgroundColor: e.status === "honored" ? "rgba(193,59,107,0.10)" : e.status === "partial" ? "rgba(200,155,60,0.10)" : "rgba(200,184,154,0.15)",
                                  color: e.status === "honored" ? ACCENT : e.status === "partial" ? "#8B6A20" : "#9B8B8B",
                                }}
                              >
                                {e.status === "honored" ? "Honored" : e.status === "partial" ? "Partial" : "Not completed"}
                              </span>
                            </div>
                            {e.notes && <p className="font-montserrat text-[12px] text-[#9B8B8B]">{e.notes}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteEntry(e.id)}
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
            {step !== "history" && entries.length > 0 && (
              <button
                type="button"
                onClick={() => setStep("history")}
                className="flex items-center gap-1.5 font-montserrat text-[12px] transition hover:underline"
                style={{ color: ACCENT }}
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
