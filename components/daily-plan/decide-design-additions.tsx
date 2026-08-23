"use client"

/**
 * Decide & Design Additions™ — Decide → Populate → Execute (Daily Operating
 * Experience rebuild)
 * ---------------------------------------------------------------------------
 * Renders below the existing Decide & Design™ content (Founder GPS™ Next
 * Best Move, This Week's Menu, identity/boundary pickers, CEO outcome
 * picker — all untouched). This is the ONE place the founder decides
 * Movement, Lunch, CEO Workday activities, Time Freedom, and Power Down for
 * today — every downstream segment (Movement Window™, Lunch Break™, CEO
 * Workday™, Time Freedom™, Power Down™) reads this same `TodaysPlanRecord`
 * back. No re-entry required later.
 *
 * Plain record-keeping only — no new planner, GPS, or recommendation engine.
 */

import { useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import {
  getDateKey,
  loadTodaysPlan,
  updateTodaysPlan,
} from "@/lib/daily-plan/storage"
import type { CeoActivity, LunchCategory, LunchSelection, TodaysPlanRecord } from "@/lib/daily-plan/types"
import { CEO_WORKDAY_CAP_MINUTES, TIME_FREEDOM_CAP_MINUTES } from "@/lib/daily-plan/types"
import { BUILD_PATH_DEFINITIONS } from "@/lib/build-strategy/build-path-registry"
import type { BuildPathId } from "@/lib/build-strategy/types"

const MOVEMENT_QUICK_PICKS = ["Walk", "Mobility", "Stretch", "Dance", "Workout", "Other"]

const LUNCH_OPTIONS: { category: LunchCategory; label: string }[] = [
  { category: "nourish", label: "Nourish — a real, unhurried meal" },
  { category: "connect", label: "Connect — with a person, not a screen" },
  { category: "move", label: "Move — a short walk outside" },
  { category: "reset", label: "Reset — quiet, no input" },
  { category: "disconnect", label: "Disconnect — phone away, notifications off" },
]

const TIME_FREEDOM_QUICK_CATEGORIES = ["Family", "Nature", "Creativity", "Personal", "Rest", "Other"]

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function DecideDesignAdditions() {
  const [plan, setPlan] = useState<TodaysPlanRecord | null>(null)
  const [movementNote, setMovementNote] = useState("")
  const [movementOther, setMovementOther] = useState("")

  useEffect(() => {
    setPlan(loadTodaysPlan(getDateKey()))
  }, [])

  if (!plan) {
    return <div className="px-1 py-2 font-sans text-sm text-[#6B5860]">Loading…</div>
  }

  // Narrowed, stable reference — `plan` (useState) isn't narrowed inside the
  // nested function declarations below, but this `const` is.
  const data = plan

  function patch(update: Partial<Omit<TodaysPlanRecord, "dateKey">>) {
    setPlan(updateTodaysPlan(update, data.dateKey))
  }

  // ── Movement ──────────────────────────────────────────────────────────
  function setMovement(label: string) {
    patch({ movement: { label, note: movementNote.trim() || undefined } })
  }

  // ── Lunch ─────────────────────────────────────────────────────────────
  function toggleLunch(option: LunchSelection) {
    const exists = data.lunch.some((l) => l.category === option.category)
    const next = exists ? data.lunch.filter((l) => l.category !== option.category) : [...data.lunch, option]
    patch({ lunch: next })
  }

  // ── CEO Workday activities ───────────────────────────────────────────
  const ceoTotalMinutes = data.ceoActivities.reduce((sum, a) => sum + a.minutes, 0)
  const ceoOverCap = ceoTotalMinutes > CEO_WORKDAY_CAP_MINUTES

  function addCeoActivity() {
    const activity: CeoActivity = {
      id: newId(),
      title: "",
      minutes: 30,
      definitionOfDone: "",
      status: "not-started",
    }
    patch({ ceoActivities: [...data.ceoActivities, activity] })
  }

  function updateCeoActivity(id: string, updates: Partial<CeoActivity>) {
    patch({ ceoActivities: data.ceoActivities.map((a) => (a.id === id ? { ...a, ...updates } : a)) })
  }

  function removeCeoActivity(id: string) {
    patch({ ceoActivities: data.ceoActivities.filter((a) => a.id !== id) })
  }

  // ── Time Freedom ─────────────────────────────────────────────────────
  const timeFreedomTotal = data.timeFreedom.reduce((sum, a) => sum + a.minutes, 0)
  const timeFreedomRemaining = TIME_FREEDOM_CAP_MINUTES - timeFreedomTotal

  function addTimeFreedomAllocation() {
    patch({
      timeFreedom: [...data.timeFreedom, { id: newId(), category: "Family", label: "", minutes: 30 }],
    })
  }

  function updateTimeFreedomAllocation(id: string, updates: Partial<TodaysPlanRecord["timeFreedom"][number]>) {
    patch({ timeFreedom: data.timeFreedom.map((a) => (a.id === id ? { ...a, ...updates } : a)) })
  }

  function removeTimeFreedomAllocation(id: string) {
    patch({ timeFreedom: data.timeFreedom.filter((a) => a.id !== id) })
  }

  // ── Power Down ────────────────────────────────────────────────────────
  function setPowerDown(updates: Partial<TodaysPlanRecord["powerDown"]>) {
    patch({ powerDown: { ...data.powerDown, ...updates } })
  }

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
          Decide → Populate → Execute
        </p>
        <p className="mt-1 font-sans text-sm text-[#6B5860]">
          Decide the rest of today right here — Movement, Lunch, your CEO Workday™, Time Freedom™, and Power
          Down™ will all be ready and waiting for you when you get there.
        </p>
      </div>

      {/* ── Movement ──────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-6 py-5 sm:px-7 sm:py-6 space-y-3">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
          Decide Today&apos;s Movement
        </p>
        <div className="flex flex-wrap gap-2">
          {MOVEMENT_QUICK_PICKS.map((label) => {
            const selected = plan.movement?.label === label
            return (
              <button
                key={label}
                type="button"
                aria-pressed={selected}
                onClick={() => setMovement(label)}
                className={`inline-flex items-center rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                  selected
                    ? "border-[#7FB069] bg-[#7FB069] text-white"
                    : "border-[#7FB069]/30 bg-[#F7FBF4] text-[#3A2E33] hover:bg-[#7FB069]/10"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        {plan.movement?.label === "Other" && (
          <input
            type="text"
            value={movementOther}
            onChange={(e) => setMovementOther(e.target.value)}
            onBlur={() => movementOther.trim() && setMovement(movementOther.trim())}
            placeholder="What movement will you do today?"
            className="w-full rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
          />
        )}
        <input
          type="text"
          value={movementNote}
          onChange={(e) => setMovementNote(e.target.value)}
          onBlur={() => plan.movement && patch({ movement: { ...plan.movement, note: movementNote.trim() || undefined } })}
          placeholder="Why this movement today? (optional)"
          className="w-full rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
        />
      </div>

      {/* ── Healthy Hybrid Lunch ──────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-6 py-5 sm:px-7 sm:py-6 space-y-3">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
          Decide Today&apos;s Healthy Hybrid Lunch™
        </p>
        <div className="flex flex-wrap gap-2">
          {LUNCH_OPTIONS.map((option) => {
            const selected = plan.lunch.some((l) => l.category === option.category)
            return (
              <button
                key={option.category}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleLunch(option)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                  selected
                    ? "border-[#7FB069] bg-[#7FB069] text-white"
                    : "border-[#7FB069]/30 bg-[#F7FBF4] text-[#3A2E33] hover:bg-[#7FB069]/10"
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── CEO Workday activities ───────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-6 py-5 sm:px-7 sm:py-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Decide Today&apos;s CEO Workday™ Activities
          </p>
          <span
            className={`font-sans text-xs font-semibold ${ceoOverCap ? "text-[#C13B6B]" : "text-[#6B5860]"}`}
          >
            {ceoTotalMinutes} / {CEO_WORKDAY_CAP_MINUTES} min
          </span>
        </div>
        {ceoOverCap && (
          <p className="font-sans text-xs text-[#C13B6B]">
            That&apos;s over your 4-hour CEO Workday™ window — consider trimming, delegating, or deferring something.
          </p>
        )}
        <div className="space-y-3">
          {plan.ceoActivities.map((activity) => (
            <div key={activity.id} className="rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={activity.title}
                  onChange={(e) => updateCeoActivity(activity.id, { title: e.target.value })}
                  placeholder="What are you building or doing today?"
                  className="flex-1 rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
                />
                <input
                  type="number"
                  min={0}
                  value={activity.minutes}
                  onChange={(e) => updateCeoActivity(activity.id, { minutes: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-20 rounded-lg border border-[#E8DFE2] bg-white px-2 py-2 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
                  aria-label="Minutes"
                />
                <button
                  type="button"
                  onClick={() => removeCeoActivity(activity.id)}
                  aria-label="Remove activity"
                  className="rounded-full p-1.5 text-[#6B5860]/50 hover:bg-black/[0.04]"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <input
                type="text"
                value={activity.definitionOfDone}
                onChange={(e) => updateCeoActivity(activity.id, { definitionOfDone: e.target.value })}
                placeholder="What does 'done' look like for this?"
                className="w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
              />
              <div className="flex flex-wrap gap-1.5">
                {BUILD_PATH_DEFINITIONS.map((path) => {
                  const selected = activity.buildPathId === path.id
                  return (
                    <button
                      key={path.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        updateCeoActivity(activity.id, {
                          buildPathId: selected ? undefined : (path.id as BuildPathId),
                        })
                      }
                      className={`rounded-full border px-3 py-1 font-sans text-xs transition-colors ${
                        selected
                          ? "border-[#3A2E33] bg-[#3A2E33] text-white"
                          : "border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-black/[0.03]"
                      }`}
                    >
                      {path.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCeoActivity}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#7FB069]/40 bg-[#F7FBF4] px-4 py-2 font-sans text-sm text-[#5A7A45] hover:bg-[#7FB069]/10"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add an activity
        </button>
      </div>

      {/* ── Time Freedom ──────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-6 py-5 sm:px-7 sm:py-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Decide What You&apos;ll Make Time For (Time Freedom™)
          </p>
          <span className="font-sans text-xs font-semibold text-[#6B5860]">
            {timeFreedomRemaining >= 0 ? `${timeFreedomRemaining} min remaining` : `${Math.abs(timeFreedomRemaining)} min over`}
          </span>
        </div>
        <div className="space-y-3">
          {plan.timeFreedom.map((allocation) => (
            <div key={allocation.id} className="flex items-center gap-2">
              <select
                value={allocation.category}
                onChange={(e) => updateTimeFreedomAllocation(allocation.id, { category: e.target.value })}
                className="rounded-lg border border-[#E8DFE2] bg-white px-2 py-2 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
              >
                {TIME_FREEDOM_QUICK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={allocation.label}
                onChange={(e) => updateTimeFreedomAllocation(allocation.id, { label: e.target.value })}
                placeholder="What will you make time for?"
                className="flex-1 rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
              />
              <input
                type="number"
                min={0}
                value={allocation.minutes}
                onChange={(e) =>
                  updateTimeFreedomAllocation(allocation.id, { minutes: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-20 rounded-lg border border-[#E8DFE2] bg-white px-2 py-2 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
                aria-label="Minutes"
              />
              <button
                type="button"
                onClick={() => removeTimeFreedomAllocation(allocation.id)}
                aria-label="Remove allocation"
                className="rounded-full p-1.5 text-[#6B5860]/50 hover:bg-black/[0.04]"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTimeFreedomAllocation}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#7FB069]/40 bg-[#F7FBF4] px-4 py-2 font-sans text-sm text-[#5A7A45] hover:bg-[#7FB069]/10"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add what you&apos;ll make time for
        </button>
      </div>

      {/* ── Power Down ────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-6 py-5 sm:px-7 sm:py-6 space-y-3">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
          Decide Tonight&apos;s Power Down™
        </p>
        <textarea
          value={plan.powerDown.release}
          onChange={(e) => setPowerDown({ release: e.target.value })}
          placeholder="What will you release from today?"
          rows={2}
          className="w-full rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
        />
        <textarea
          value={plan.powerDown.tomorrowNote}
          onChange={(e) => setPowerDown({ tomorrowNote: e.target.value })}
          placeholder="What's tomorrow's single priority?"
          rows={2}
          className="w-full rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
        />
        <input
          type="text"
          value={plan.powerDown.windDownActivity}
          onChange={(e) => setPowerDown({ windDownActivity: e.target.value })}
          placeholder="What will help your mind begin to slow tonight?"
          className="w-full rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
        />
      </div>
    </div>
  )
}
