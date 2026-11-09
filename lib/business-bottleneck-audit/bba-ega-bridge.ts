"use client"

/**
 * Business Bottleneck Audit™ → Entrepreneur Gap Assessment™ bridge
 * ---------------------------------------------------------------------------
 * The Decide & Design "Bottleneck Priorities" step (and every downstream
 * consumer — the CEO Workday™ design engine, Founder GPS™) reads OPEN EGA
 * entries. A founder who has taken the BBA but never produced EGA entries
 * therefore saw "No open gaps right now" even though their audit is full of
 * named bottlenecks. This bridge derives each concrete bottleneck the founder
 * flagged in the BBA baseline and materializes it as an open EGA entry —
 * idempotently, keyed by `sourceRef = "bba:<questionId>"` — so it is
 * selectable as a Bottleneck Priority and flows into the workday design.
 *
 * Source is `gps_context` ("founder previously flagged as a bottleneck"),
 * which is exactly what a BBA answer is; the ega_entries.source CHECK
 * constraint does not include a dedicated bba value.
 */

import { BBA_CATEGORIES, BBA_QUESTIONS } from "./bba-registry"
import { getCurrentBbaBaseline } from "./bba-storage"
import type { BbaBaselineRecord, BbaCategoryId } from "./types"
import { createEgaEntry, findEgaEntryBySourceRef } from "@/lib/ega/ega-storage"
import type { EgaEntry, EgaObstacleType } from "@/lib/ega/types"

export interface BbaBottleneckSignal {
  /** Stable key: "bba:<questionId>" */
  sourceRef: string
  categoryId: BbaCategoryId
  categoryName: string
  /** Short founder-facing label for the bottleneck. */
  gap: string
  /** Longer signal text (the BBA question + the founder's selected answers). */
  signal: string
  obstacleType: EgaObstacleType
}

/** Questions whose selected options are, by definition, named bottlenecks. */
const PROBLEM_QUESTIONS: Record<string, { obstacle: EgaObstacleType; lead: string }> = {
  "offer.problem": { obstacle: "decision", lead: "Offer" },
  "marketing.noMarketingBlocker": { obstacle: "priority", lead: "Marketing" },
  "sales.stuckWhere": { obstacle: "system", lead: "Sales" },
  "sales.problem": { obstacle: "system", lead: "Sales" },
  "delivery.whatHappening": { obstacle: "capacity", lead: "Client delivery" },
  "team.problem": { obstacle: "delegation", lead: "Team" },
  "systems.problem": { obstacle: "system", lead: "Systems" },
  "ai.gap": { obstacle: "knowledge", lead: "AI" },
  "communication.whatHappening": { obstacle: "decision", lead: "Communication" },
  "financial.concern": { obstacle: "decision", lead: "Finance" },
  "businessModel.problem": { obstacle: "system", lead: "Business structure" },
  "stakeholders.reportingProblem": { obstacle: "time", lead: "Stakeholder reporting" },
}

/** Single-select answers that flag a bottleneck on their own (option ids per bba-registry). */
const FLAG_ANSWERS: Array<{ questionId: string; equalsAny: string[]; gap: string; obstacle: EgaObstacleType }> = [
  { questionId: "sales.dependsOnFounder", equalsAny: ["yes", "partly"], gap: "Sales depends on the founder", obstacle: "delegation" },
  { questionId: "founder.wearsTooManyHats", equalsAny: ["yes", "sometimes"], gap: "Founder wears too many hats", obstacle: "delegation" },
  { questionId: "systems.hasRepeatable", equalsAny: ["no", "some"], gap: "No repeatable systems for recurring work", obstacle: "system" },
  { questionId: "persistent.hasRecurringProblem", equalsAny: ["yes"], gap: "A business problem keeps recurring", obstacle: "system" },
]

function labelFor(questionId: string, optionIds: string[], otherText: Record<string, string>): string[] {
  const q = BBA_QUESTIONS.find((x) => x.id === questionId)
  return optionIds
    .filter((id) => id !== "none" && id !== "no-problem" && id !== "nothing")
    .map((id) => {
      const opt = q?.options?.find((o) => o.id === id)
      if (opt?.allowOtherText && otherText[questionId]) return otherText[questionId]
      return opt?.label ?? id
    })
}

/** Pure: derives bottleneck signals from a BBA baseline. */
export function deriveBbaBottleneckSignals(baseline: BbaBaselineRecord): BbaBottleneckSignal[] {
  const out: BbaBottleneckSignal[] = []
  const catName = (id: BbaCategoryId) => BBA_CATEGORIES.find((c) => c.id === id)?.name ?? id

  for (const [questionId, meta] of Object.entries(PROBLEM_QUESTIONS)) {
    const q = BBA_QUESTIONS.find((x) => x.id === questionId)
    if (!q) continue
    const raw = baseline.responses[questionId]
    const ids = Array.isArray(raw) ? raw : typeof raw === "string" && raw ? [raw] : []
    const labels = labelFor(questionId, ids, baseline.otherText)
    if (labels.length === 0) continue
    out.push({
      sourceRef: `bba:${questionId}`,
      categoryId: q.categoryId,
      categoryName: catName(q.categoryId),
      gap: `${meta.lead}: ${labels.slice(0, 2).join(", ")}${labels.length > 2 ? ` +${labels.length - 2}` : ""}`,
      signal: `${q.prompt} — ${labels.join("; ")}`,
      obstacleType: meta.obstacle,
    })
  }

  for (const f of FLAG_ANSWERS) {
    const q = BBA_QUESTIONS.find((x) => x.id === f.questionId)
    const raw = baseline.responses[f.questionId]
    if (!q || typeof raw !== "string" || !f.equalsAny.includes(raw)) continue
    out.push({
      sourceRef: `bba:${f.questionId}`,
      categoryId: q.categoryId,
      categoryName: catName(q.categoryId),
      gap: f.gap,
      signal: `${q.prompt} — ${q.options?.find((o) => o.id === raw)?.label ?? raw}`,
      obstacleType: f.obstacle,
    })
  }

  // Ownership gaps: "No one clearly owns it" is a bottleneck in its own right.
  for (const q of BBA_QUESTIONS) {
    if (!q.id.endsWith(".ownership")) continue
    if (baseline.responses[q.id] !== "no-one-owns-it") continue
    out.push({
      sourceRef: `bba:${q.id}`,
      categoryId: q.categoryId,
      categoryName: catName(q.categoryId),
      gap: `${catName(q.categoryId)}: no clear owner`,
      signal: `${q.prompt} — No one clearly owns it`,
      obstacleType: "delegation",
    })
  }

  return out
}

/**
 * Ensures every BBA bottleneck exists as an open EGA entry. Safe to call on
 * every load — existing entries (any status, including dismissed/resolved) are
 * left untouched so a founder's decisions stick. Returns entries created.
 */
export async function syncBbaBottlenecksToEga(): Promise<EgaEntry[]> {
  const baseline = await getCurrentBbaBaseline().catch(() => null)
  if (!baseline) return []
  const signals = deriveBbaBottleneckSignals(baseline)
  const created: EgaEntry[] = []
  for (const s of signals) {
    const existing = await findEgaEntryBySourceRef("gps_context", s.sourceRef).catch(() => null)
    if (existing) continue
    const entry = await createEgaEntry({
      source: "gps_context",
      sourceRef: s.sourceRef,
      signal: s.signal,
      gap: s.gap,
      obstacleType: s.obstacleType,
      status: "open",
      timeHorizon: "this_week",
    }).catch(() => null)
    if (entry) created.push(entry)
  }
  return created
}
