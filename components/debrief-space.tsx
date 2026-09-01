"use client"

/**
 * DebriefSpace™ — Decide My Priority Focus Areas For The Week™. Renders
 * inside "Decide & Design My Work-Life Balance Business Day™" every day of
 * the week — Monday via the `monday-debrief` block, Tue–Sun via the
 * `daily-planning-gps` block (same title, same content, only the day-specific
 * hero background image and this section's own "Monday Ritual™"/"Daily
 * Ritual™" label + time differ).
 *
 * Builds this WLBB Week's Weekly WLBB Menu™:
 *  1. Life Priorities — real Work-Life Balance Audit™ Focus Areas (≤60%) +
 *     a custom entry, capped at 1–3
 *  2. Business Building Priorities (Area → 1–3 outcomes)
 *  3. Bottleneck Priorities (1–3, drawn from open Entrepreneur Gap Assessment™ entries)
 *  4. Operating Behaviors (scoped to the chosen area)
 *  5. Assigned AI Executive(s) — auto-derived, read-only
 *  6. Hand-off into the CEO Workspace™
 *
 * Also renders "Design My Work-Life Balance Business Day™" — a set of
 * collapsible tabs (varying sage-green shades) for planning the protected
 * time already built into the day: Movement, the 4-Hour Focused CEO
 * Workday™, Lunch, Time Freedom, and Power Down.
 *
 * All state persists through `lib/wlbb-week/storage.ts` on every change —
 * this is a real weekly record, not session-only reflection.
 */

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Plus, X, Clock } from "lucide-react"
import { SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"
import { FUNCTIONS, type FunctionArea } from "@/components/founder-os/ai-executive-leadership-team"
import { BUSINESS_AREAS, getAreaById } from "@/lib/wlbb-week/catalog"
import { CollapsibleSubSection } from "@/components/collapsible-sub-section"
import { MovementIntentionForm } from "@/components/planners/movement-intention-form"
import { CeoWorkdayActivitiesForm } from "@/components/planners/ceo-workday-activities-form"
import { LunchIntentionForm } from "@/components/planners/lunch-intention-form"
import { PowerDownIntentionForm } from "@/components/planners/power-down-intention-form"
import { CherryBlossomWorkstation } from "@/components/cherry-blossom-workstation"
import { TimeFreedomSocial } from "@/components/time-freedom-social"
import { UpcomingLifeEvents } from "@/components/cherry-blossom/upcoming-life-events"
import {
  getWeekKey,
  loadWeek,
  addLifeIntention,
  removeLifeIntention,
  setBusinessArea,
  setOutcomes,
  setBottlenecks,
} from "@/lib/wlbb-week/storage"
import type { BusinessOutcome, LifeIntention, LifeIntentionKind, WlbbWeekState } from "@/lib/wlbb-week/types"
import { getAuditResults } from "@/utils/audit-storage"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import { getEgaEntriesByStatus } from "@/lib/ega/ega-storage"
import type { EgaEntry } from "@/lib/ega/types"

/** Same threshold used on the Reality Check™ page — keeps "Focus Areas" consistent everywhere. */
const FOCUS_THRESHOLD = 60

interface FocusArea {
  /** Audit™ `category` for Life areas, ESA™ `pillarId` for Business areas — used to toggle selection. */
  id: string
  name: string
  score: number
}

/**
 * Best-effort mapping from an ESA™ Operating Pillar to the Business Area
 * it most closely corresponds to in `lib/wlbb-week/catalog.ts`. Pillars with
 * no clean match (Strategic Foundation™, People & Leadership™, Human
 * Sustainability™) are shown for awareness but aren't clickable — there's
 * no Business Area to select for them.
 */
const PILLAR_TO_BUSINESS_AREA: Record<string, string> = {
  "revenue-engine": "sales-revenue",
  "operations-systems": "operations",
  "financial-intelligence": "finance",
  "client-excellence": "client-experience",
  "growth-innovation": "growth-innovation",
}

const MAX_OUTCOMES = 3
/** Life Intentions are capped at 1–3 for the week — same cap discipline as Business Outcome. */
const MAX_LIFE = 3
/** Bottlenecks (drawn from open EGA entries) are capped at 1–3 for the week. */
const MAX_BOTTLENECKS = 3

/**
 * Best-effort mapping from a Life Intention's kind to the existing schedule
 * block (operating-engine/config/schedule.ts) that already protects that
 * kind of time — so choosing it here surfaces a "this is already protected"
 * hint instead of implying the founder needs to carve out new time for it.
 * Kinds with no clean single-block match (reconnect/forgive/ask-forgiveness/
 * other) are intentionally left unmapped — no hint renders for those.
 */
const LIFE_KIND_TO_BLOCK: Partial<Record<LifeIntentionKind, string>> = {
  movement: "movement-window",
  rest: "power-down",
  family: "time-freedom",
  nature: "lunch-break",
  recreation: "time-freedom",
}

/**
 * Best-effort mapping from a Work-Life Balance Audit™ `category` key to the
 * existing schedule block that already protects that category's kind of
 * time — used so a low-scoring Focus Area chip for Movement, Sleep
 * (Power Down), or Nourishment (Lunch) can be labeled "already built into
 * your day" instead of implying the founder needs to carve out new time.
 */
const FOCUS_AREA_TO_BLOCK: Record<string, string> = {
  physicalMovement: "movement-window",
  physicalSleep: "power-down",
  physicalNourishment: "lunch-break",
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function buildOutcomes(state: WlbbWeekState, areaId: string, outcomeIds: string[], behaviors: string[]): BusinessOutcome[] {
  const area = getAreaById(areaId)
  if (!area) return []
  return outcomeIds
    .map((outcomeId) => area.outcomes.find((o) => o.id === outcomeId))
    .filter((o): o is NonNullable<typeof o> => Boolean(o))
    .map((catalogOutcome) => {
      const existing = state.business.outcomes.find((o) => o.id === catalogOutcome.id)
      return {
        id: catalogOutcome.id,
        areaId: area.id,
        areaName: area.name,
        text: catalogOutcome.text,
        operatingBehaviors: behaviors,
        primaryExecutiveIds: catalogOutcome.primaryExecutiveIds,
        supportingExecutiveIds: catalogOutcome.supportingExecutiveIds,
        status: existing?.status ?? "not-started",
        addedOn: existing?.addedOn ?? new Date().toISOString(),
        completedOn: existing?.completedOn,
      } satisfies BusinessOutcome
    })
}

function ExecutiveMiniCard({ area }: { area: FunctionArea }) {
  const Icon = area.icon
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#5D9D61]/20 bg-[#F7FBF4] px-4 py-3">
      <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5D9D61]/10">
        <Icon className="h-4 w-4 text-[#5D9D61]" />
      </div>
      <div className="min-w-0">
        <p className="font-sans text-sm font-semibold text-[#2E1F27]">{area.name}</p>
        <p className="font-sans text-xs text-[#6B5860]">{area.members.map((m) => m.name).join(" · ")}</p>
      </div>
    </div>
  )
}

// CollapsibleSubSection™ now lives in "@/components/collapsible-sub-section"
// (imported above) so it can be shared with the real segment cards
// (TodaysMovementCard, TodaysLunchCard, PowerDownReleaseCard) that host their
// own inline "Change My Intention™" editors.

export function DebriefSpace() {
  // Renders identically on Monday (`monday-debrief`) and Tue–Sun
  // (`daily-planning-gps`) — only the schedule lookup (and therefore the
  // ritual label + time shown just below) differs by day.
  const [isMonday, setIsMonday] = useState(true)
  useEffect(() => {
    setIsMonday(new Date().getDay() === 1)
  }, [])
  const debriefSchedule = SCHEDULE_BY_ID[isMonday ? "monday-debrief" : "daily-planning-gps"]
  const [week, setWeek] = useState<WlbbWeekState | null>(null)
  const [customLabel, setCustomLabel] = useState("")
  const [customDay, setCustomDay] = useState("")
  const [customTime, setCustomTime] = useState("")
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([])
  const [lifeFocusAreas, setLifeFocusAreas] = useState<FocusArea[]>([])
  const [businessFocusAreas, setBusinessFocusAreas] = useState<FocusArea[]>([])
  // Open Entrepreneur Gap Assessment™ entries — the pool the Bottlenecks step
  // picks from, so Bottlenecks reuses EGA's existing data instead of
  // introducing a second, parallel bottleneck-tracking system.
  const [openEgaEntries, setOpenEgaEntries] = useState<EgaEntry[]>([])
  // Seeded from the Time Freedom collapsible's Life Events™ list — bumping this
  // with a new prompt string auto-sends it into the adjacent Cherry Blossom chat.
  const [timeFreedomPrompt, setTimeFreedomPrompt] = useState<string | undefined>(undefined)

  useEffect(() => {
    const loaded = loadWeek(getWeekKey())
    setWeek(loaded)
    // Seed the behaviors picker from whatever's already saved on this week's outcomes.
    const existingBehaviors = loaded.business.outcomes[0]?.operatingBehaviors ?? []
    setSelectedBehaviors(existingBehaviors)

    // Pull this week's Audit™ + ESA™ results straight from storage so anything
    // that scored at or below the focus threshold on the Reality Check™ shows
    // up as real, selectable focus areas under Step 1 / Step 2 below — no
    // data needs to be passed through a link/query.
    const auditData = getAuditResults()
    const esaData = getEsaResults()
    setLifeFocusAreas(
      (auditData?.results ?? [])
        .filter((r) => r.percentage <= FOCUS_THRESHOLD)
        .map((r) => ({ id: r.category, name: r.label, score: r.percentage }))
        .sort((a, b) => a.score - b.score),
    )
    setBusinessFocusAreas(
      (esaData?.pillarScores ?? [])
        .filter((p) => p.percentage <= FOCUS_THRESHOLD)
        .map((p) => ({ id: p.pillarId, name: p.pillarName, score: p.percentage }))
        .sort((a, b) => a.score - b.score),
    )
    getEgaEntriesByStatus("open").then(setOpenEgaEntries)
  }, [])

  const selectedArea = week?.business.businessAreaId ? getAreaById(week.business.businessAreaId) : undefined
  const selectedOutcomeIds = useMemo(() => week?.business.outcomes.map((o) => o.id) ?? [], [week])

  const assignedExecutiveIds = useMemo(() => {
    if (!week) return []
    const ids = new Set<string>()
    week.business.outcomes.forEach((o) => {
      o.primaryExecutiveIds.forEach((id) => ids.add(id))
      o.supportingExecutiveIds.forEach((id) => ids.add(id))
    })
    return Array.from(ids)
  }, [week])

  const assignedExecutives = useMemo(
    () => FUNCTIONS.filter((f) => assignedExecutiveIds.includes(f.id)),
    [assignedExecutiveIds],
  )

  if (!week) {
    return <section className="w-full py-10 text-center text-sm text-[#6B5860]">Loading this week&apos;s Debrief™…</section>
  }

  // Capture a non-null local so the handlers below don't need to re-check `week`
  // on every reference (TypeScript can't narrow a hoisted function declaration's
  // closure over outer `week` state across the early return above).
  const currentWeek = week

  const lifeAtCap = currentWeek.life.intentions.length >= MAX_LIFE

  function addCustomIntention() {
    if (!customLabel.trim() || lifeAtCap) return
    const intention: LifeIntention = {
      id: makeId(),
      kind: "other",
      label: customLabel.trim(),
      day: customDay.trim() || undefined,
      time: customTime.trim() || undefined,
      addedOn: new Date().toISOString(),
    }
    setWeek(addLifeIntention(currentWeek, intention))
    setCustomLabel("")
    setCustomDay("")
    setCustomTime("")
  }

  function removeIntention(id: string) {
    setWeek(removeLifeIntention(currentWeek, id))
  }

  /** Toggles a real Audit™ focus area in/out of this week's Life Intentions — matched by label since the area's real category name doubles as the intention text. */
  function toggleLifeFocusArea(area: FocusArea) {
    const existing = currentWeek.life.intentions.find((i) => i.label === area.name)
    if (existing) {
      removeIntention(existing.id)
      return
    }
    if (lifeAtCap) return
    const intention: LifeIntention = {
      id: makeId(),
      kind: "other",
      label: area.name,
      addedOn: new Date().toISOString(),
    }
    setWeek(addLifeIntention(currentWeek, intention))
  }

  const bottleneckIds = currentWeek.business.bottleneckEgaEntryIds

  /** Toggles an open EGA entry in/out of this week's Bottlenecks — capped at MAX_BOTTLENECKS. */
  function toggleBottleneck(entryId: string) {
    const already = bottleneckIds.includes(entryId)
    let nextIds: string[]
    if (already) {
      nextIds = bottleneckIds.filter((id) => id !== entryId)
    } else {
      if (bottleneckIds.length >= MAX_BOTTLENECKS) return
      nextIds = [...bottleneckIds, entryId]
    }
    setWeek(setBottlenecks(currentWeek, nextIds))
  }

  function selectArea(areaId: string) {
    if (currentWeek.business.businessAreaId === areaId) return
    // Switching areas resets outcomes + behaviors — they're scoped to the area.
    let next = setBusinessArea(currentWeek, areaId)
    next = setOutcomes(next, [])
    setSelectedBehaviors([])
    setWeek(next)
  }

  /** Selects the Business Area a low-scoring ESA™ pillar maps to (a no-op for pillars with no clean Business Area match — those render as non-interactive badges). */
  function selectBusinessFocusArea(area: FocusArea) {
    const mappedAreaId = PILLAR_TO_BUSINESS_AREA[area.id]
    if (mappedAreaId) selectArea(mappedAreaId)
  }

  function toggleOutcome(outcomeId: string) {
    if (!selectedArea) return
    const already = selectedOutcomeIds.includes(outcomeId)
    let nextIds: string[]
    if (already) {
      nextIds = selectedOutcomeIds.filter((id) => id !== outcomeId)
    } else {
      if (selectedOutcomeIds.length >= MAX_OUTCOMES) return
      nextIds = [...selectedOutcomeIds, outcomeId]
    }
    const outcomes = buildOutcomes(currentWeek, selectedArea.id, nextIds, selectedBehaviors)
    setWeek(setOutcomes(currentWeek, outcomes))
  }

  function toggleBehavior(behavior: string) {
    const next = selectedBehaviors.includes(behavior)
      ? selectedBehaviors.filter((b) => b !== behavior)
      : [...selectedBehaviors, behavior]
    setSelectedBehaviors(next)
    if (selectedArea && selectedOutcomeIds.length > 0) {
      const outcomes = buildOutcomes(currentWeek, selectedArea.id, selectedOutcomeIds, next)
      setWeek(setOutcomes(currentWeek, outcomes))
    }
  }

  
  return (
    <section className="w-full space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3 pb-2">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">
          Priority Focus™
        </p>
        <h2 className="font-serif text-3xl font-semibold text-[#2E1F27] text-balance leading-tight">
          Decide My Priority Focus Areas For The Week™
        </h2>
      </div>

      {/* ── Repeated title card ───────���────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-[#5B835F]" aria-hidden />
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            {isMonday ? "Monday Ritual™" : "Daily Ritual™"} · {debriefSchedule?.timeLabel ?? "10:30–11:00 AM"}
          </p>
        </div>
        <p className="font-serif text-2xl font-semibold text-[#2E1F27] leading-snug">
          Decide My Priority Focus Areas For The Week™
        </p>

        {/* ── Permission-giving intro ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#7FB069]/25 bg-[#F7FBF4] px-5 py-4">
          <p className="font-sans text-sm text-[#3A2E33] leading-relaxed">
            You have permission to design intentionally, not react. There&apos;s nowhere to rush to — build this week
            one section at a time.
          </p>
        </div>

        {/* ── Cherry Blossom coaching ───────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#E26C73]/20 bg-[#FDF8F5] px-6 py-5 flex gap-4 items-start">
          <div className="shrink-0 mt-0.5">
            <span className="text-xl select-none" role="img" aria-label="Cherry blossom">
              🌸
            </span>
          </div>
          <div className="space-y-2">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#E26C73]">Cherry Blossom™</p>
            <p className="font-serif text-base font-semibold text-[#2E1F27] leading-snug">
              Sit with what surfaced — then choose deliberately.
            </p>
            <p className="font-sans text-sm text-[#3A2E33] leading-relaxed">
              Awareness without a pause to process it rarely becomes lasting change. Take a few quiet minutes, then
              build this week&apos;s Weekly WLBB Menu™ below — what you choose here carries you through Tuesday–Thursday.
            </p>
          </div>
        </div>
      </div>

      {/* ── 1. Life Intentions ───────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Step 1 · Life Priorities
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            Where do I need to focus my time and attention this week? Pick 1–{MAX_LIFE} Areas.
          </p>
          <p className="mt-1 font-sans text-xs text-[#6B5860]">
            {currentWeek.life.intentions.length}/{MAX_LIFE} selected
          </p>
        </div>

        {/* Real Audit™ categories at or below {FOCUS_THRESHOLD} — select any to add as a life intention.
            Any area that maps to Movement, Power Down, or Lunch (FOCUS_AREA_TO_BLOCK) already has
            protected time on the schedule, so it's labeled as such instead of implying new time is needed. */}
        {lifeFocusAreas.length > 0 && (
          <div className="rounded-2xl border border-[#E26C73]/20 bg-[#FDF8F5] px-5 py-4 space-y-3">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
              Focus Areas · from your Work-Life Balance Audit™
            </p>
            <div className="flex flex-wrap gap-2">
              {lifeFocusAreas.map((area) => {
                const selected = week.life.intentions.some((i) => i.label === area.name)
                const disabled = !selected && lifeAtCap
                const blockId = FOCUS_AREA_TO_BLOCK[area.id]
                const block = blockId ? SCHEDULE_BY_ID[blockId] : undefined
                return (
                  <div key={area.id} className="flex flex-col items-start gap-1">
                    <button
                      type="button"
                      onClick={() => toggleLifeFocusArea(area)}
                      disabled={disabled}
                      aria-pressed={selected}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                        selected
                          ? "border-[#E26C73] bg-[#E26C73] text-white"
                          : block
                            ? "border-[#5D9D61]/40 bg-[#5D9D61]/10 text-[#2E1F27] hover:bg-[#5D9D61]/20"
                            : "border-[#E26C73]/30 bg-white text-[#3A2E33] hover:bg-[#E26C73]/10"
                      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      {area.name}
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                          selected ? "bg-white/20 text-white" : "bg-[#E26C73]/10 text-[#C0545A]"
                        }`}
                      >
                        {area.score}/100
                      </span>
                    </button>
                    {block && (
                      <p className="px-1 font-sans text-[11px] text-[#5B835F]">
                        Already built into your day — {block.shortTitle}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Something else…"
            disabled={lifeAtCap}
            className="min-w-[10rem] flex-1 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30 disabled:cursor-not-allowed disabled:opacity-40"
          />
          <input
            type="text"
            value={customDay}
            onChange={(e) => setCustomDay(e.target.value)}
            placeholder="Day (optional)"
            disabled={lifeAtCap}
            className="w-32 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30 disabled:cursor-not-allowed disabled:opacity-40"
          />
          <input
            type="text"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            placeholder="Time (optional)"
            disabled={lifeAtCap}
            className="w-32 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30 disabled:cursor-not-allowed disabled:opacity-40"
          />
          <button
            type="button"
            onClick={addCustomIntention}
            disabled={!customLabel.trim() || lifeAtCap}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#7FB069] px-5 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#6FA058] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add
          </button>
        </div>
        {lifeAtCap && (
          <p className="font-sans text-xs text-[#6B5860]">
            You&apos;ve selected {MAX_LIFE} Life Intentions for this week — remove one to add another.
          </p>
        )}
        {week.life.intentions.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {week.life.intentions.map((intention) => (
              <li
                key={intention.id}
                className="inline-flex items-center gap-2 rounded-full bg-[#F5F1E8] px-4 py-1.5 font-sans text-sm text-[#3A2E33]"
              >
                <span>
                  {intention.label}
                  {(intention.day || intention.time) && (
                    <span className="text-[#6B5860]">
                      {" — "}
                      {[intention.day, intention.time].filter(Boolean).join(" ")}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => removeIntention(intention.id)}
                  aria-label={`Remove ${intention.label}`}
                  className="text-[#6B5860]/60 transition-colors hover:text-[#C0545A]"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Protected-boundary hints — surfaced for any selected Life Intention whose kind
            already has a dedicated schedule block, so the founder decides *what* to do
            with time that's already protected instead of thinking they need to carve out new time. */}
        {week.life.intentions.some((i) => LIFE_KIND_TO_BLOCK[i.kind]) && (
          <div className="space-y-2 pt-1">
            {week.life.intentions
              .filter((i) => LIFE_KIND_TO_BLOCK[i.kind])
              .map((intention) => {
                const blockId = LIFE_KIND_TO_BLOCK[intention.kind] as string
                const block = SCHEDULE_BY_ID[blockId]
                if (!block) return null
                return (
                  <p key={intention.id} className="font-sans text-xs text-[#5B835F] leading-relaxed">
                    Your {block.shortTitle} is already protected. Decide what &quot;{intention.label}&quot; looks
                    like during it.
                  </p>
                )
              })}
          </div>
        )}
      </div>

      {/* ── 2. Business Outcome ──────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Step 2 · Business Building Priorities
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            Choose one Business Area, then 1–3 outcomes you want to move this week.
          </p>
        </div>

        {/* Real ESA™ pillars at or below {FOCUS_THRESHOLD} — select a mapped one to jump straight to its Business Area below. */}
        {businessFocusAreas.length > 0 && (
          <div className="rounded-2xl border border-[#5D9D61]/20 bg-[#F7FBF4] px-5 py-4 space-y-3">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#4A7D4D]">
              Focus Areas · from your Entrepreneur Success Assessment™
            </p>
            <div className="flex flex-wrap gap-2">
              {businessFocusAreas.map((area) => {
                const mappedAreaId = PILLAR_TO_BUSINESS_AREA[area.id]
                const selected = Boolean(mappedAreaId) && selectedArea?.id === mappedAreaId
                if (!mappedAreaId) {
                  return (
                    <span
                      key={area.id}
                      className="inline-flex items-center gap-2 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#6B5860]"
                      title="No matching Business Area yet — noted for awareness."
                    >
                      {area.name}
                      <span className="rounded-full bg-[#E8DFE2] px-2 py-0.5 text-xs font-bold tabular-nums text-[#6B5860]">
                        {area.score}/100
                      </span>
                    </span>
                  )
                }
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => selectBusinessFocusArea(area)}
                    aria-pressed={selected}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                      selected
                        ? "border-[#5D9D61] bg-[#5D9D61] text-white"
                        : "border-[#5D9D61]/30 bg-white text-[#3A2E33] hover:bg-[#5D9D61]/10"
                    }`}
                  >
                    {area.name}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
                        selected ? "bg-white/20 text-white" : "bg-[#5D9D61]/10 text-[#4A7D4D]"
                      }`}
                    >
                      {area.score}/100
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {BUSINESS_AREAS.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => selectArea(area.id)}
              aria-pressed={selectedArea?.id === area.id}
              className={`rounded-full px-4 py-2 font-sans text-sm transition-colors ${
                selectedArea?.id === area.id
                  ? "bg-[#5D9D61] text-white"
                  : "border border-[#5D9D61]/25 bg-[#F7FBF4] text-[#3A2E33] hover:bg-[#5D9D61]/10"
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
        {selectedArea && (
          <div className="space-y-2 pt-1">
            <p className="font-sans text-xs text-[#6B5860]">
              Pick up to {MAX_OUTCOMES} ({selectedOutcomeIds.length}/{MAX_OUTCOMES} selected)
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {selectedArea.outcomes.map((outcome) => {
                const checked = selectedOutcomeIds.includes(outcome.id)
                const disabled = !checked && selectedOutcomeIds.length >= MAX_OUTCOMES
                return (
                  <button
                    key={outcome.id}
                    type="button"
                    onClick={() => toggleOutcome(outcome.id)}
                    disabled={disabled}
                    aria-pressed={checked}
                    className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-left font-sans text-sm transition-colors ${
                      checked
                        ? "border-[#5D9D61] bg-[#5D9D61]/10 text-[#2E1F27]"
                        : "border-[#E8DFE2] bg-white text-[#3A2E33] hover:border-[#5D9D61]/40"
                    } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    <span
                      className={`mt-0.5 h-4 w-4 shrink-0 rounded border ${
                        checked ? "border-[#5D9D61] bg-[#5D9D61]" : "border-[#C8A4A7]/50"
                      }`}
                      aria-hidden
                    />
                    {outcome.text}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Bottlenecks ────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Step 3 · Bottleneck Priorities
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            Pick 1–{MAX_BOTTLENECKS} open gaps from your Entrepreneur Gap Assessment™ that are actually in the way
            this week.
          </p>
        </div>

        {openEgaEntries.length === 0 ? (
          <p className="font-sans text-sm text-[#6B5860]">
            No open gaps right now — nothing to name here this week.
          </p>
        ) : (
          <>
            <p className="font-sans text-xs text-[#6B5860]">
              Pick 1–{MAX_BOTTLENECKS} ({bottleneckIds.length}/{MAX_BOTTLENECKS} selected)
            </p>
            <div className="flex flex-wrap gap-2">
              {openEgaEntries.map((entry) => {
                const selected = bottleneckIds.includes(entry.id)
                const disabled = !selected && bottleneckIds.length >= MAX_BOTTLENECKS
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => toggleBottleneck(entry.id)}
                    disabled={disabled}
                    aria-pressed={selected}
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-left font-sans text-sm transition-colors ${
                      selected
                        ? "border-[#C0545A] bg-[#C0545A] text-white"
                        : "border-[#C0545A]/25 bg-[#FDF8F5] text-[#3A2E33] hover:bg-[#C0545A]/10"
                    } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                  >
                    {entry.gap || entry.signal}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Design My Work-Life Balance Business Day™ ────────────────────────── */}
      <div className="rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] shadow-sm px-8 py-7 space-y-4">
        <div>
          <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            Design My Work-Life Balance Business Day™
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            Open any section below to plan the protected time already built into your day.
          </p>
        </div>

        <CollapsibleSubSection
          title="30-Minute Movement Window"
          containerClassName="border-[#BFDDA8] bg-[#F1F7EC]"
        >
          <MovementIntentionForm />
        </CollapsibleSubSection>

        <CollapsibleSubSection
          title="4-Hour Focused CEO Workday"
          containerClassName="border-[#A9CE8A] bg-[#E8F1DD]"
        >
          <CeoWorkdayActivitiesForm />
        </CollapsibleSubSection>

        <CollapsibleSubSection
          title="Extended Healthy Hybrid Lunch Break"
          containerClassName="border-[#93BE6C] bg-[#DEEBCE]"
        >
          <LunchIntentionForm />
        </CollapsibleSubSection>

        <CollapsibleSubSection
          title="Time Freedom"
          containerClassName="border-[#7FB069] bg-[#D3E4BE]"
        >
          {(open) => (
            <div className="space-y-5">
              <UpcomingLifeEvents onPlan={setTimeFreedomPrompt} />
              <CherryBlossomWorkstation
                context="lifestyle-experiences"
                active={open}
                pendingPrompt={timeFreedomPrompt}
              />
              <TimeFreedomSocial active={open} />
            </div>
          )}
        </CollapsibleSubSection>

        <CollapsibleSubSection
          title="Power Down"
          containerClassName="border-[#6B9A55] bg-[#C5D9AC]"
        >
          <PowerDownIntentionForm />
        </CollapsibleSubSection>
      </div>

      {/* ── 4. Operating Behaviors ───────────────────────────────────────────── */}
      {selectedArea && (
        <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
          <div>
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
              Step 4 · Operating Behaviors
            </p>
            <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
              Which behaviors, done consistently, will move {selectedArea.name.toLowerCase()} forward this week?
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedArea.operatingBehaviors.map((behavior) => {
              const active = selectedBehaviors.includes(behavior)
              return (
                <button
                  key={behavior}
                  type="button"
                  onClick={() => toggleBehavior(behavior)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-2 font-sans text-sm transition-colors ${
                    active
                      ? "bg-[#E26C73] text-white"
                      : "border border-[#E26C73]/30 bg-[#FDF8F5] text-[#3A2E33] hover:bg-[#E26C73]/10"
                  }`}
                >
                  {behavior}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 4. Human Zone of Genius��� practice ────────────────────────────────── */}
      {/* ── 5. Assigned AI Executive(s) — read-only, auto-derived ───────────── */}
      {assignedExecutives.length > 0 && (
        <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
          <div>
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
              Step 6 · Assigned AI Executive(s)
            </p>
            <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
              Auto-assigned from your chosen outcomes — coordinated by Cherry Blossom™.
            </p>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {assignedExecutives.map((area) => (
              <ExecutiveMiniCard key={area.id} area={area} />
            ))}
          </div>
        </div>
      )}

    </section>
  )
}
