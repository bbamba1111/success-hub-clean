"use client"

/**
 * FounderWinsWall — card grid of wins from the community store + seeded
 * static wins. Cherry Blossom auto-celebrates each one.
 */

import { useState } from "react"
import { useCommunity } from "./community-provider"
import { CommunityCelebrationCard } from "./community-celebration-card"
import type { FounderWin } from "@/lib/community/types"
import { Trophy, Plus } from "lucide-react"

// Seeded static wins to populate the wall before any user input
const SEEDED_WINS: FounderWin[] = [
  {
    id: "seeded-win-1",
    title: "First Full Time Freedom™ Weekend",
    description: "Protected the entire Thu 5 PM → Mon 7 AM window for the first time.",
    category: "time-freedom",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isCelebrated: true,
  },
  {
    id: "seeded-win-2",
    title: "21-Day Morning GIV-EN™ Streak",
    description: "Three consecutive weeks of Morning GIV-EN™ blocks without a skip.",
    category: "streak",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isCelebrated: true,
  },
  {
    id: "seeded-win-3",
    title: "Harmony Score™ Reached 70",
    description: "Score moved from 48 to 73 — six weeks of consistent practice.",
    category: "score-increase",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isCelebrated: true,
  },
]

// Win submission form state
interface WinFormState {
  title: string
  description: string
  category: FounderWin["category"]
}

const CATEGORY_OPTIONS: { value: FounderWin["category"]; label: string }[] = [
  { value: "harmony-week", label: "Harmony Week™" },
  { value: "streak", label: "Streak Milestone" },
  { value: "score-increase", label: "Harmony Score™ Increase" },
  { value: "time-freedom", label: "Time Freedom™" },
  { value: "co-working", label: "Co-Working Achievement" },
  { value: "milestone", label: "Major Milestone" },
]

export function FounderWinsWall() {
  const { wins, addWin } = useCommunity()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<WinFormState>({
    title: "",
    description: "",
    category: "milestone",
  })

  const allWins: FounderWin[] = [
    ...wins,
    ...SEEDED_WINS.filter((s) => !wins.some((w) => w.id === s.id)),
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    const today = new Date().toISOString().slice(0, 10)
    const win: FounderWin = {
      id: `win-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      date: today,
      timestamp: new Date().toISOString(),
      isCelebrated: true,
    }
    addWin(win)
    setForm({ title: "", description: "", category: "milestone" })
    setShowForm(false)
  }

  return (
    <section aria-labelledby="wins-heading">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#C6924A]" aria-hidden="true" />
          <h2
            id="wins-heading"
            className="font-playfair text-xl font-bold text-[#1C2B2B]"
          >
            Founder Wins Wall
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-xl border border-[#C6924A] px-3 py-1.5 font-montserrat text-xs font-semibold text-[#C6924A] transition-colors hover:bg-[#C6924A] hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          Share a Win
        </button>
      </div>

      {/* Win submission form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-5 rounded-2xl border border-[#C6924A]/30 bg-[#C6924A]/5 p-5"
        >
          <h3 className="mb-3 font-playfair text-sm font-semibold text-[#1C2B2B]">
            Share your win with the community
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Win title..."
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 font-montserrat text-[13px] text-[#1C2B2B] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C6924A]"
            />
            <textarea
              placeholder="Tell us more (optional)..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 font-montserrat text-[13px] text-[#1C2B2B] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C6924A]"
            />
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as FounderWin["category"] }))}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 font-montserrat text-[13px] text-[#1C2B2B] focus:outline-none focus:ring-1 focus:ring-[#C6924A]"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              className="rounded-xl bg-[#C6924A] px-4 py-2 font-montserrat text-xs font-semibold uppercase tracking-wider text-white hover:opacity-90"
            >
              Post Win
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 font-montserrat text-xs text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Wins grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allWins.map((win) => (
          <CommunityCelebrationCard key={win.id} win={win} />
        ))}
      </div>
    </section>
  )
}
