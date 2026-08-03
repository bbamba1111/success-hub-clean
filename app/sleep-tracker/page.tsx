"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, TrendingUp, Trash2, Home, Copy, Check, Moon } from "lucide-react"
import Link from "next/link"

// ── Types ─────────────────────────────────────────────────────────────────────

interface SleepEntry {
  id: string
  date: string
  bedtime: string
  wakeTime: string
  quality: string
  targetHours: number
  actualHours: number
  status: "honored" | "partial" | "not-completed"
  notes?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCENT = "#C13B6B"
const QUALITY_OPTIONS = ["Excellent", "Good", "Fair", "Poor"]

const CHERRY_MESSAGES: Record<SleepEntry["status"], string> = {
  honored: "Awesome YOU! \ud83c\udf38",
  partial: "Rest is progress too. \ud83c\udf38",
  "not-completed": "Tomorrow is a fresh start. \ud83c\udf38",
}

function buildDeclaration(hours: number) {
  return `I declare that I am a person who honors their rest. Tonight I am protecting ${hours} hours of restorative sleep \u2014 not as a luxury, but as an act of self-leadership. My body and mind deserve this recovery.`
}

function calcHours(bedtime: string, wakeTime: string): number {
  if (!bedtime || !wakeTime) return 0
  const [bh, bm] = bedtime.split(":").map(Number)
  const [wh, wm] = wakeTime.split(":").map(Number)
  let mins = (wh * 60 + wm) - (bh * 60 + bm)
  if (mins < 0) mins += 24 * 60
  return Math.round((mins / 60) * 10) / 10
}

function formatHours(h: number) {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h 0m`
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-")
  return `${m}/${d}/${y}`
}

function statusColor(s: SleepEntry["status"]) {
  if (s === "honored") return "#3A6B47"
  if (s === "partial") return "#B87333"
  return "#9B8B8B"
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SleepTrackerPage() {
  const today = new Date().toISOString().split("T")[0]

  // ── Form state ──
  const [date, setDate] = useState(today)
  const [bedtime, setBedtime] = useState("22:00")
  const [wakeTime, setWakeTime] = useState("06:00")
  const [quality, setQuality] = useState("Good")
  const [targetHours, setTargetHours] = useState(8)
  const [notes, setNotes] = useState("")

  // ── Declaration state ──
  const [copied, setCopied] = useState(false)

  // ── Completion state ──
  const [pendingEntry, setPendingEntry] = useState<Omit<SleepEntry, "status"> | null>(null)
  const [completionStatus, setCompletionStatus] = useState<SleepEntry["status"] | "">("")
  const [completionNotes, setCompletionNotes] = useState("")
  const [savedEntry, setSavedEntry] = useState<SleepEntry | null>(null)

  // ── History ──
  const [entries, setEntries] = useState<SleepEntry[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sleepEntries")
      if (saved) setEntries(JSON.parse(saved))
    } catch {}
  }, [])

  const estimatedHours = calcHours(bedtime, wakeTime)

  // Commitment sentence auto-populates from targetHours
  const commitment = `I intend/commit to sleeping ${targetHours} hours tonight.`
  const declaration = buildDeclaration(targetHours)

  const copyDeclaration = async () => {
    try {
      await navigator.clipboard.writeText(declaration)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const handleAdd = () => {
    const entry: Omit<SleepEntry, "status"> = {
      id: Date.now().toString(),
      date,
      bedtime,
      wakeTime,
      quality,
      targetHours,
      actualHours: estimatedHours,
      notes: notes || undefined,
    }
    setPendingEntry(entry)
    setCompletionStatus("")
    setCompletionNotes("")
    setSavedEntry(null)
  }

  const handleSaveCompletion = () => {
    if (!pendingEntry || !completionStatus) return
    const entry: SleepEntry = {
      ...pendingEntry,
      status: completionStatus,
      notes: completionNotes || pendingEntry.notes,
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    try { localStorage.setItem("sleepEntries", JSON.stringify(updated)) } catch {}
    setSavedEntry(entry)
    setPendingEntry(null)
    // Reset form
    setDate(today)
    setBedtime("22:00")
    setWakeTime("06:00")
    setQuality("Good")
    setTargetHours(8)
    setNotes("")
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    try { localStorage.setItem("sleepEntries", JSON.stringify(updated)) } catch {}
  }

  const weeklyEntries = entries.filter((e) => {
    const d = new Date(e.date + "T00:00:00")
    return Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000
  })
  const avgSleep = weeklyEntries.length > 0
    ? Math.round((weeklyEntries.reduce((s, e) => s + e.actualHours, 0) / weeklyEntries.length) * 10) / 10
    : 0

  return (
    <div className="min-h-screen bg-[#F5F0E8] py-10 font-montserrat">
      <div className="mx-auto max-w-2xl px-5">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "rgba(193,59,107,0.12)" }}>
            <Moon className="h-6 w-6" style={{ color: ACCENT }} />
          </div>
          <h1 className="font-playfair text-[30px] font-bold" style={{ color: ACCENT }}>Sleep Tracker</h1>
          <p className="mt-1 text-[13px] text-[#6B5C54]">Monitor your sleep patterns and quality</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { icon: <span className="text-sm">&#x25CE;</span>, label: "Nights Tracked", value: weeklyEntries.length, sub: "This week" },
            { icon: <Clock className="h-4 w-4" />, label: "Average Sleep", value: avgSleep > 0 ? `${avgSleep}h` : "0.0h", sub: "Per night" },
            { icon: <TrendingUp className="h-4 w-4" />, label: "Sleep Goal", value: "7-9h", sub: "Recommended" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-white p-4" style={{ borderColor: "rgba(193,59,107,0.20)" }}>
              <div className="mb-1 flex items-center gap-1.5 text-[#9B8B8B] text-[12px]">
                {s.icon} {s.label}
              </div>
              <p className="font-playfair text-[26px] font-bold" style={{ color: ACCENT }}>{s.value}</p>
              <p className="text-[11px] text-[#9B8B8B]">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Completion check-in (shown after Add) ── */}
        {pendingEntry && !savedEntry && (
          <div className="mb-6 rounded-xl border bg-white p-5" style={{ borderColor: "rgba(193,59,107,0.25)" }}>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>Morning Check-In</p>
            <p className="mb-4 font-playfair text-[15px] italic text-[#3D2E32]">
              Did you honor your {pendingEntry.targetHours}-hour sleep commitment?
            </p>
            <div className="mb-4 flex gap-2">
              {(["honored", "partial", "not-completed"] as SleepEntry["status"][]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCompletionStatus(s)}
                  className="flex-1 rounded-lg border py-2.5 text-[12px] font-semibold uppercase tracking-[0.10em] transition"
                  style={{
                    backgroundColor: completionStatus === s ? ACCENT : "white",
                    borderColor: completionStatus === s ? ACCENT : "#D4C9B8",
                    color: completionStatus === s ? "white" : "#5A4A52",
                  }}
                >
                  {s === "honored" ? "Yes" : s === "partial" ? "Partially" : "Not Tonight"}
                </button>
              ))}
            </div>
            {(completionStatus === "partial" || completionStatus === "not-completed") && (
              <div className="mb-3">
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">
                  {completionStatus === "partial" ? "Any notes?" : "What got in the way? (optional)"}
                </label>
                <textarea
                  rows={2}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="No judgment here..."
                  className="w-full resize-none rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2 text-[13px] text-[#3D2E32] placeholder:text-[#C8B89A] focus:outline-none"
                />
              </div>
            )}
            <button
              type="button"
              disabled={!completionStatus}
              onClick={handleSaveCompletion}
              className="w-full rounded-lg py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition disabled:opacity-40"
              style={{ backgroundColor: ACCENT }}
            >
              Save &amp; Record
            </button>
          </div>
        )}

        {/* ── Post-session summary ── */}
        {savedEntry && (
          <div className="mb-6 rounded-xl border bg-white p-5" style={{ borderColor: "rgba(193,59,107,0.25)" }}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>Sleep Summary</p>
            <div className="mb-3 grid grid-cols-2 gap-3 text-[13px]">
              <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-[#9B8B8B]">Date</p>
                <p className="font-semibold text-[#3D2E32]">{formatDate(savedEntry.date)}</p>
              </div>
              <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-[#9B8B8B]">Quality</p>
                <p className="font-semibold text-[#3D2E32]">{savedEntry.quality}</p>
              </div>
              <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-[#9B8B8B]">Committed</p>
                <p className="font-semibold text-[#3D2E32]">{savedEntry.targetHours}h</p>
              </div>
              <div className="rounded-lg bg-[#F5F0E8] px-3 py-2.5">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-[#9B8B8B]">Actual Sleep</p>
                <p className="font-semibold" style={{ color: statusColor(savedEntry.status) }}>
                  {formatHours(savedEntry.actualHours)}
                </p>
              </div>
              <div className="col-span-2 rounded-lg bg-[#F5F0E8] px-3 py-2.5">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.14em] text-[#9B8B8B]">Bedtime &rarr; Wake</p>
                <p className="font-semibold text-[#3D2E32]">{savedEntry.bedtime} &rarr; {savedEntry.wakeTime}</p>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5 text-center" style={{ background: "rgba(193,59,107,0.06)" }}>
              <span className="text-base">&#x1F338;</span>{" "}
              <span className="font-playfair text-[13px] italic" style={{ color: ACCENT }}>{CHERRY_MESSAGES[savedEntry.status]}</span>
            </div>
            <button
              type="button"
              onClick={() => setSavedEntry(null)}
              className="mt-3 w-full rounded-lg border border-[#D4C9B8] py-2 text-[12px] font-semibold text-[#5A4A52] transition hover:text-[#3D2E32]"
            >
              + Log Another Night
            </button>
          </div>
        )}

        {/* ── Log Sleep Entry form ── */}
        {!pendingEntry && !savedEntry && (
          <div className="mb-6 rounded-xl border bg-white p-5" style={{ borderColor: "rgba(193,59,107,0.20)" }}>
            <p className="mb-4 text-[15px] font-bold" style={{ color: ACCENT }}>+ Log Sleep Entry</p>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2.5 text-[13px] text-[#3D2E32] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">Sleep Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2.5 text-[13px] text-[#3D2E32] focus:outline-none"
                >
                  {QUALITY_OPTIONS.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">Bedtime</label>
                <input
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2.5 text-[13px] text-[#3D2E32] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">Wake Time</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2.5 text-[13px] text-[#3D2E32] focus:outline-none"
                />
              </div>
            </div>

            {/* Target hours + commitment sentence */}
            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">Target Hours</label>
              <select
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-full rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2.5 text-[13px] text-[#3D2E32] focus:outline-none"
              >
                {[6.5, 7, 7.5, 8, 8.5, 9].map((h) => (
                  <option key={h} value={h}>{h} hours</option>
                ))}
              </select>
            </div>

            {/* Commitment sentence — auto-populates */}
            <div className="mb-4 rounded-lg border px-4 py-3" style={{ borderColor: "rgba(193,59,107,0.20)", background: "rgba(193,59,107,0.04)" }}>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>My Commitment</p>
              <p className="font-playfair text-[13px] italic text-[#3D2E32]">&ldquo;{commitment}&rdquo;</p>
            </div>

            {/* Declaration box — Read this aloud + Copy, no separate Repeat After Me */}
            <div className="mb-4 rounded-lg border px-4 py-4" style={{ borderColor: "rgba(193,59,107,0.20)", background: "#F5F0E8" }}>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>
                  My Intention Declaration&#x2122; &mdash; Read this aloud
                </p>
                <button
                  type="button"
                  onClick={copyDeclaration}
                  className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition hover:opacity-80"
                  style={{ borderColor: "rgba(193,59,107,0.25)", color: ACCENT }}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="font-montserrat text-[13px] italic leading-relaxed text-[#3D2E32]">
                &ldquo;{declaration}&rdquo;
              </p>
            </div>

            {/* Estimated duration */}
            {estimatedHours > 0 && (
              <div className="mb-4 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#3D2E32]" style={{ background: "rgba(193,59,107,0.05)" }}>
                <span className="text-[#9B8B8B]">Estimated Sleep Duration: </span>
                {formatHours(estimatedHours)}
              </div>
            )}

            <div>
              <label className="mb-1 block text-[12px] font-semibold text-[#5A4A52]">Notes (optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did you sleep? Any observations?"
                className="mb-4 w-full resize-none rounded-lg border border-[#D4C9B8] bg-[#FDFAF5] px-3 py-2.5 text-[13px] text-[#3D2E32] placeholder:text-[#C8B89A] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="w-full rounded-lg py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition"
              style={{ backgroundColor: ACCENT }}
            >
              + Add Sleep Entry
            </button>
          </div>
        )}

        {/* ── Sleep History ── */}
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(193,59,107,0.20)" }}>
          <p className="mb-4 flex items-center gap-2 text-[15px] font-bold" style={{ color: ACCENT }}>
            <Calendar className="h-4 w-4" /> Sleep History
          </p>
          {entries.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-[#9B8B8B]">No sleep entries yet. Log your first night above.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {entries.map((e) => (
                <div key={e.id} className="rounded-lg border border-[#E8DDD5] px-4 py-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                        style={{ backgroundColor: statusColor(e.status) }}
                      >
                        {e.quality}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#9B8B8B]">
                        <Calendar className="h-3 w-3" /> {formatDate(e.date)}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#9B8B8B]">
                        <Clock className="h-3 w-3" /> {formatHours(e.actualHours)}
                      </span>
                      <span className="text-[11px]" style={{ color: ACCENT }}>
                        &#x1F338; {CHERRY_MESSAGES[e.status]}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteEntry(e.id)}
                      className="text-[#C8B89A] transition hover:text-[#C13B6B]"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[12px] text-[#5A4A52]">
                    {e.bedtime} &rarr; {e.wakeTime}
                  </p>
                  {e.notes && <p className="mt-0.5 text-[12px] text-[#9B8B8B]">{e.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#D4C9B8] px-5 py-2 text-[12px] font-semibold text-[#5A4A52] transition hover:border-[#C13B6B] hover:text-[#C13B6B]"
          >
            <Home className="h-3.5 w-3.5" /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}
