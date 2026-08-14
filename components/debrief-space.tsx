"use client"

/**
 * DebriefSpace™ — the 30-Minute Work-Life Balance Debrief™ (Monday only).
 *
 * Builds this WLBB Week's Weekly WLBB Menu™:
 *  1. Life Intentions (incl. private relationship-repair entries)
 *  2. Business Outcome (Area → 1–3 outcomes)
 *  3. Operating Behaviors (scoped to the chosen area)
 *  4. Human Zone of Genius™ practice for the week
 *  5. Assigned AI Executive(s) — auto-derived, read-only
 *  6. This Week's Weekly WLBB Menu — summary + GPS next-best-move
 *  7. Hand-off into the CEO Workspace™
 *
 * All state persists through `lib/wlbb-week/storage.ts` on every change —
 * this is a real weekly record, not session-only reflection.
 */

import { useEffect, useMemo, useState } from "react"
import { Sparkles, Plus, X, Compass, Briefcase } from "lucide-react"
import { useActiveSpace } from "@/components/active-space-provider"
import { SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"
import { FUNCTIONS, type FunctionArea } from "@/components/founder-os/ai-executive-leadership-team"
import { humanSkills } from "@/components/founder-os/human-zone-of-genius"
import { BUSINESS_AREAS, getAreaById } from "@/lib/wlbb-week/catalog"
import { getWeekKey, loadWeek, addLifeIntention, removeLifeIntention, setBusinessArea, setOutcomes, setHumanZoneOfGeniusPractice, setGpsRecommendation, markDebriefComplete, getDailyEntry } from "@/lib/wlbb-week/storage"
import { getGpsRecommendation } from "@/lib/wlbb-week/gps"
import type { BusinessOutcome, LifeIntention, LifeIntentionKind, WlbbWeekState } from "@/lib/wlbb-week/types"
import { getAuditResults } from "@/utils/audit-storage"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"

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

const QUICK_INTENTIONS: { label: string; kind: LifeIntentionKind; isRelationshipRepair?: boolean }[] = [
  { label: "Family dinner", kind: "family" },
  { label: "Walk", kind: "movement" },
  { label: "Tai Chi", kind: "movement" },
  { label: "Time in nature", kind: "nature" },
  { label: "Rest", kind: "rest" },
  { label: "Reconnect with someone", kind: "reconnect", isRelationshipRepair: true },
  { label: "Forgive someone", kind: "forgive", isRelationshipRepair: true },
  { label: "Ask forgiveness", kind: "ask-forgiveness", isRelationshipRepair: true },
]

const MAX_OUTCOMES = 3

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

export function DebriefSpace() {
  const activeSpace = useActiveSpace()
  const movementWindow = SCHEDULE_BY_ID["movement-window"]
  const ceoWorkday = SCHEDULE_BY_ID["ceo-workday"]

  const [week, setWeek] = useState<WlbbWeekState | null>(null)
  const [customLabel, setCustomLabel] = useState("")
  const [customDay, setCustomDay] = useState("")
  const [customTime, setCustomTime] = useState("")
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([])
  const [lifeFocusAreas, setLifeFocusAreas] = useState<FocusArea[]>([])
  const [businessFocusAreas, setBusinessFocusAreas] = useState<FocusArea[]>([])

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

  const gpsRecommendation = useMemo(() => {
    if (!week) return null
    const today = getDailyEntry(week, "monday")
    return getGpsRecommendation(week.business.outcomes, today)
  }, [week])

  // Keep the stored GPS recommendation in sync whenever this week's outcomes change.
  useEffect(() => {
    if (!week || gpsRecommendation === null) return
    if (week.gpsRecommendation !== gpsRecommendation) {
      setWeek(setGpsRecommendation(week, gpsRecommendation))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gpsRecommendation])

  if (!week) {
    return <section className="w-full py-10 text-center text-sm text-[#6B5860]">Loading this week&apos;s Debrief™…</section>
  }

  // Capture a non-null local so the handlers below don't need to re-check `week`
  // on every reference (TypeScript can't narrow a hoisted function declaration's
  // closure over outer `week` state across the early return above).
  const currentWeek = week

  function addQuickIntention(item: (typeof QUICK_INTENTIONS)[number]) {
    const intention: LifeIntention = {
      id: makeId(),
      kind: item.kind,
      label: item.label,
      isRelationshipRepair: item.isRelationshipRepair,
      addedOn: new Date().toISOString(),
    }
    setWeek(addLifeIntention(currentWeek, intention))
  }

  function addCustomIntention() {
    if (!customLabel.trim()) return
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
    const intention: LifeIntention = {
      id: makeId(),
      kind: "other",
      label: area.name,
      addedOn: new Date().toISOString(),
    }
    setWeek(addLifeIntention(currentWeek, intention))
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

  function selectPractice(title: string) {
    const next = currentWeek.business.humanZoneOfGeniusPracticeTitle === title ? null : title
    setWeek(setHumanZoneOfGeniusPractice(currentWeek, next))
  }

  function handleEnterCeoWorkspace() {
    const withCompletion = markDebriefComplete(currentWeek)
    setWeek(withCompletion)
    if (ceoWorkday) {
      activeSpace?.enterSpace("ceo-workday", ceoWorkday.sectionId)
    }
  }

  return (
    <section className="w-full space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3 pb-2">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">
          Debrief Space™
        </p>
        <h2 className="font-serif text-3xl font-semibold text-[#2E1F27] text-balance leading-tight">
          Design your Work-Life Balance Blueprint™ for this WLBB Week.
        </h2>
      </div>

      {/* ── Cherry Blossom coaching ─────────────────────────────────────────── */}
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

      {/* ── 1. Life Intentions ───────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Step 1 · Life Intentions
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            What do you want to make time for this week? Relationship-repair entries stay private to you.
          </p>
        </div>

        {/* Real Audit™ categories at or below {FOCUS_THRESHOLD} — select any to add as a life intention. */}
        {lifeFocusAreas.length > 0 && (
          <div className="rounded-2xl border border-[#E26C73]/20 bg-[#FDF8F5] px-5 py-4 space-y-3">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
              Focus Areas · from your Work-Life Balance Audit™
            </p>
            <div className="flex flex-wrap gap-2">
              {lifeFocusAreas.map((area) => {
                const selected = week.life.intentions.some((i) => i.label === area.name)
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggleLifeFocusArea(area)}
                    aria-pressed={selected}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                      selected
                        ? "border-[#E26C73] bg-[#E26C73] text-white"
                        : "border-[#E26C73]/30 bg-white text-[#3A2E33] hover:bg-[#E26C73]/10"
                    }`}
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
                )
              })}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {QUICK_INTENTIONS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => addQuickIntention(item)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#7FB069]/30 bg-[#F7FBF4] px-4 py-2 font-sans text-sm text-[#3A2E33] transition-colors hover:bg-[#7FB069]/10"
            >
              <Plus className="h-3.5 w-3.5 text-[#7FB069]" aria-hidden />
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Something else…"
            className="min-w-[10rem] flex-1 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
          />
          <input
            type="text"
            value={customDay}
            onChange={(e) => setCustomDay(e.target.value)}
            placeholder="Day (optional)"
            className="w-32 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
          />
          <input
            type="text"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            placeholder="Time (optional)"
            className="w-32 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
          />
          <button
            type="button"
            onClick={addCustomIntention}
            disabled={!customLabel.trim()}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#7FB069] px-5 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#6FA058] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add
          </button>
        </div>
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
      </div>

      {/* ── 2. Business Outcome ──────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Step 2 · Business Outcome
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

      {/* ── 3. Operating Behaviors ───────────────────────────────────────────── */}
      {selectedArea && (
        <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
          <div>
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
              Step 3 · Operating Behaviors
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

      {/* ── 4. Human Zone of Genius™ practice ────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Step 4 · Human Zone of Genius™
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            Which practice matters most this week — the irreplaceable work only you can do?
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {humanSkills.map((skill) => {
            const active = week.business.humanZoneOfGeniusPracticeTitle === skill.title
            return (
              <button
                key={skill.title}
                type="button"
                onClick={() => selectPractice(skill.title)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-sm transition-colors ${
                  active
                    ? "bg-[#C0545A] text-white"
                    : "border border-[#C0545A]/25 bg-white text-[#3A2E33] hover:bg-[#C0545A]/10"
                }`}
              >
                <skill.icon className="h-3.5 w-3.5" aria-hidden />
                {skill.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 5. Assigned AI Executive(s) — read-only, auto-derived ───────────── */}
      {assignedExecutives.length > 0 && (
        <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
          <div>
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
              Step 5 · Assigned AI Executive(s)
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

      {/* ── 6. This Week's Weekly WLBB Menu™ — summary + GPS ─────────────────── */}
      <div className="rounded-3xl border border-[#7FB069]/25 bg-[#F7FBF4] px-8 py-7 space-y-5">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[#5B835F]" aria-hidden />
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            This Week&apos;s Weekly WLBB Menu™
          </p>
        </div>
        {week.business.outcomes.length === 0 ? (
          <p className="font-sans text-sm text-[#6B5860]">Choose a Business Area and outcome above to build your menu.</p>
        ) : (
          <ul className="space-y-2">
            {week.business.outcomes.map((outcome) => (
              <li key={outcome.id} className="font-sans text-sm text-[#2E1F27]">
                <span className="font-semibold">{outcome.text}</span>
                {outcome.operatingBehaviors.length > 0 && (
                  <span className="text-[#6B5860]"> — {outcome.operatingBehaviors.join(", ")}</span>
                )}
              </li>
            ))}
          </ul>
        )}
        {week.business.humanZoneOfGeniusPracticeTitle && (
          <p className="font-sans text-sm text-[#2E1F27]">
            <span className="font-semibold">Human Zone of Genius™ focus:</span>{" "}
            {week.business.humanZoneOfGeniusPracticeTitle}
          </p>
        )}
        {gpsRecommendation && (
          <div className="rounded-2xl border border-[#5D9D61]/20 bg-white px-5 py-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#5D9D61]">
              Weekly WLBB GPS™
            </p>
            <p className="mt-1.5 font-sans text-sm text-[#2E1F27] leading-relaxed">{gpsRecommendation}</p>
          </div>
        )}
      </div>

      {/* ── 7. Hand-off ───────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#7FB069]/20 bg-[#F7FBF4] px-6 py-5 text-center space-y-3">
        <p className="font-serif text-base font-semibold text-[#5B835F]">Ready when you are.</p>
        <p className="font-sans text-xs text-[#6B5860]">
          Carry this week&apos;s Menu straight into your CEO Workspace™ — or continue into today&apos;s Movement Window™.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {ceoWorkday && (
            <button
              type="button"
              onClick={handleEnterCeoWorkspace}
              className="inline-flex items-center gap-2 rounded-full bg-[#3A2E33] px-6 py-2.5 font-montserrat text-sm font-bold uppercase tracking-[0.08em] text-white shadow-sm transition-colors hover:bg-[#2E1F27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A2E33]/40 focus-visible:ring-offset-2"
            >
              <Briefcase className="h-4 w-4 shrink-0" aria-hidden />
              Enter CEO Workspace™
            </button>
          )}
          {movementWindow && (
            <button
              type="button"
              onClick={() => activeSpace?.enterSpace("movement-window", movementWindow.sectionId)}
              className="inline-flex items-center gap-2 rounded-full bg-[#7FB069] px-6 py-2.5 font-montserrat text-sm font-bold uppercase tracking-[0.08em] text-white shadow-sm transition-colors hover:bg-[#6FA058] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB069]/40 focus-visible:ring-offset-2"
            >
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
              Enter Movement Space™
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
