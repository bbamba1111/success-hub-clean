/**
 * CEO Workday™ Design Engine — GPS proposes, the founder decides.
 * ---------------------------------------------------------------------------
 * Deterministic business-intervention planner. It does NOT turn the weekly
 * priority into a task list. It:
 *
 *   1. anchors on the weekly Business Building Priority (the destination)
 *   2. reads the Bottleneck Priority (EGA entries) + BBA signals to name
 *      the DOMINANT constraint (the first move)
 *   3. asks "what is the business actually ready for?" → treatment ladder
 *      BUILD/CHANGE → IMPLEMENT/OPERATE → PRACTICE/DEVELOP →
 *      DELEGATE/TRANSFER → SYSTEMIZE/AUGMENT/AUTOMATE/AI
 *      (never jumping to AI when the underlying process is broken)
 *   4. respects what already exists: an installed Business Asset™ moves
 *      the treatment off BUILD toward implement/practice/delegate
 *   5. instantiates ONE primary card + only the supporting/validate cards
 *      the chain needs, each with a WHY and expected evidence
 *   6. carries forward unfinished work from the previous CEO Workday when
 *      the founder chose "continue later" (same intervention only)
 *   7. estimates time honestly — never pads toward 240
 *
 * Pure: no storage, no network. Input is assembled by the caller
 * (components/planners/ceo-workday-design-form.tsx). Fixtures:
 * scripts/dev/phase-ceo-workday-fixtures.ts
 */

import type { EgaEntry } from "@/lib/ega/types"
import type { BbaSignalSummary } from "@/lib/founder-gps/context/bba-context-aggregator"
import type { BusinessAssetInstallationStatus } from "@/lib/business-asset-inventory/types"
import { INTERVENTION_MATRIX, OBSTACLE_TO_TREATMENT, TREATMENT_REASON, type AreaIntervention } from "./intervention-matrix"
import type { CeoGpsOriginal, CeoPlanItem, CeoTreatment, CeoWorkdayEvidenceSummary } from "./plan-types"

export const CEO_WORKDAY_CONTAINER_MINUTES = 240

// ── Input ───────────────────────────────────────────────────────────────────

export interface DesignEngineInput {
  /** Weekly Business Building Priority (wlbb-week business area id). */
  businessAreaId: string | null
  /** Selected weekly outcomes' text, for context in the WHY copy. */
  outcomeTexts?: string[]
  /** Bottleneck Priority — the EGA entries the founder selected this week. */
  bottleneckEntries: EgaEntry[]
  bbaSignals?: BbaSignalSummary | null
  /** Installed status by Business Asset™ id (from the Asset Inventory). */
  assetStatusById?: Record<string, BusinessAssetInstallationStatus>
  /** Asset id → display name (registry), so cards can name the asset. */
  assetNameById?: Record<string, string>
  /** Current Business Building Assignment™, if one exists. */
  currentAssignment?: { ref: string; title: string; assetId?: string | null } | null
  /** Founder GPS™ Next Best Move headline, if available (context only). */
  nextBestMoveTitle?: string | null
  /** Yesterday's (or latest) CEO Workday evidence for carry-forward. */
  priorEvidence?: CeoWorkdayEvidenceSummary | null
  businessStage?: string | null
}

export interface DesignEngineOutput {
  ok: boolean
  /** Why nothing could be proposed (no weekly priority yet, etc.). */
  reason?: string
  areaName: string | null
  destination: string | null
  constraintSummary: string
  interventionSummary: string
  treatment: CeoTreatment | null
  relatedAssetId: string | null
  relatedAssetName: string | null
  items: CeoPlanItem[]
  plannedMinutes: number
}

// ── Constraint identification ───────────────────────────────────────────────

function dominantObstacle(entries: EgaEntry[]): { type: string | null; entry: EgaEntry | null } {
  if (!entries.length) return { type: null, entry: null }
  const counts: Record<string, number> = {}
  for (const e of entries) if (e.obstacleType) counts[e.obstacleType] = (counts[e.obstacleType] ?? 0) + 1
  let best: string | null = null
  let bestN = 0
  for (const t of Object.keys(counts)) {
    if (counts[t] > bestN) {
      best = t
      bestN = counts[t]
    }
  }
  const entry = entries.find((e) => e.obstacleType === best) ?? entries[0]
  return { type: best, entry }
}

/** Pick the asset the intervention is really about. */
function resolveAsset(
  area: AreaIntervention,
  input: DesignEngineInput,
): { id: string | null; name: string; status: BusinessAssetInstallationStatus | null } {
  const statuses = input.assetStatusById ?? {}
  const names = input.assetNameById ?? {}
  // 1. current assignment's asset wins
  const asgAsset = input.currentAssignment?.assetId
  if (asgAsset) return { id: asgAsset, name: names[asgAsset] ?? asgAsset, status: statuses[asgAsset] ?? null }
  // 2. bottleneck entry that points at an asset
  for (const e of input.bottleneckEntries) {
    const ref = e.solutionRef ?? (e.source === "asset_condition" ? e.sourceRef : undefined)
    if (ref && names[ref]) return { id: ref, name: names[ref], status: statuses[ref] ?? null }
  }
  // 3. first area asset the founder has any record of (prefer needs-update/in-progress/installed)
  const order: BusinessAssetInstallationStatus[] = ["needs-update", "in-progress", "installed"]
  for (const st of order) {
    const hit = area.assetIds.find((id) => statuses[id] === st)
    if (hit) return { id: hit, name: names[hit] ?? hit, status: st }
  }
  // 4. first known area asset (not installed)
  const first = area.assetIds.find((id) => names[id])
  if (first) return { id: first, name: names[first], status: statuses[first] ?? "not-installed" }
  return { id: null, name: area.assetFallbackName, status: null }
}

/** The treatment ladder — what is the business actually ready for? */
function chooseTreatment(
  obstacleType: string | null,
  assetStatus: BusinessAssetInstallationStatus | null,
  bba: BbaSignalSummary | null | undefined,
  area: AreaIntervention,
): { treatment: CeoTreatment; because: string } {
  const hinted = obstacleType ? OBSTACLE_TO_TREATMENT[obstacleType] : null

  // Asset reality gates the ladder.
  const installed = assetStatus === "installed"
  const partial = assetStatus === "in-progress" || assetStatus === "needs-update"

  let t: CeoTreatment
  let because: string

  if (!installed && !partial) {
    // Nothing durable exists yet → BUILD, unless the obstacle is purely confidence.
    t = hinted === "practice-develop" ? "practice-develop" : "build-change"
    because = t === "build-change" ? "no durable asset exists yet for this priority" : "the asset is not the gap — confidence is"
  } else if (partial) {
    // Exists but insufficient → revise (BUILD/CHANGE on the existing asset), never a new asset.
    t = "build-change"
    because = `the existing asset needs revision (${assetStatus}) before it can be relied on`
  } else {
    // Installed. Now the obstacle decides how far up the ladder we go.
    if (hinted === "delegate-transfer" || bba?.hasWidespreadOwnershipGap) {
      t = "delegate-transfer"
      because = bba?.hasWidespreadOwnershipGap
        ? "your BBA shows several functions with no clear owner — the asset is ready; ownership is the gap"
        : "the asset is proven but still depends on you"
    } else if (hinted === "systemize-augment-automate-ai") {
      t = "systemize-augment-automate-ai"
      because = "the asset is installed and repeatable — remaining friction is systemic"
    } else if (hinted === "practice-develop") {
      t = "practice-develop"
      because = "the asset exists — performing it consistently is the gap"
    } else {
      t = "implement-operate"
      because = "the asset exists but is not yet operating in the business"
    }
  }

  // Persistent execution friction (BBA) pulls automation back down to implement.
  if (t === "systemize-augment-automate-ai" && bba?.assignmentRepeatedlyBlocked) {
    t = "implement-operate"
    because = "recent assignments were repeatedly blocked — GPS is stabilizing execution before automating"
  }

  // Ensure the area actually has a chain for this treatment; fall back down the ladder.
  const ladder: CeoTreatment[] = [
    "systemize-augment-automate-ai",
    "delegate-transfer",
    "practice-develop",
    "implement-operate",
    "build-change",
  ]
  if (!area.chains[t]) {
    const idx = ladder.indexOf(t)
    for (let i = idx + 1; i < ladder.length; i++) {
      if (area.chains[ladder[i]]) {
        t = ladder[i]
        break
      }
    }
  }
  return { treatment: t, because }
}

// ── Card generation ─────────────────────────────────────────────────────────

let seq = 0
const newId = () => `cwp_${Date.now().toString(36)}_${(seq++).toString(36)}`

function fill(s: string, asset: string) {
  return s.replace(/\{asset\}/g, asset)
}

export function designCeoWorkday(input: DesignEngineInput): DesignEngineOutput {
  const empty = (reason: string): DesignEngineOutput => ({
    ok: false,
    reason,
    areaName: null,
    destination: null,
    constraintSummary: "",
    interventionSummary: "",
    treatment: null,
    relatedAssetId: null,
    relatedAssetName: null,
    items: [],
    plannedMinutes: 0,
  })

  const area = input.businessAreaId ? INTERVENTION_MATRIX[input.businessAreaId] : null
  if (!area) return empty("Select this week's Business Building Priority first — GPS designs today's work from it.")

  const { type: obstacleType, entry: dominantEntry } = dominantObstacle(input.bottleneckEntries)
  const asset = resolveAsset(area, input)
  const { treatment, because } = chooseTreatment(obstacleType, asset.status, input.bbaSignals, area)

  // Constraint summary — the first move.
  const constraintSummary = dominantEntry
    ? `Primary constraint: ${dominantEntry.gap ?? dominantEntry.signal}${
        obstacleType ? ` (${obstacleType} obstacle)` : ""
      }.`
    : input.bbaSignals?.hasWidespreadOwnershipGap
      ? "Primary constraint: several business functions have no clear owner (BBA)."
      : `Primary constraint: ${area.areaName} is not yet moving consistently.`

  const interventionSummary = `Highest-leverage move: ${TREATMENT_REASON[treatment]}. Destination: ${area.destination}.`

  // WHY copy shared across cards (each card also has its own purpose).
  const whyPrefix = [
    `Your weekly priority is ${area.areaName}.`,
    dominantEntry ? `Your Bottleneck Priority says: "${dominantEntry.signal}".` : null,
    input.bbaSignals?.hasWidespreadOwnershipGap ? "Your BBA shows a widespread ownership gap." : null,
    `GPS chose ${treatment.replace(/-/g, "/").toUpperCase()} because ${because}.`,
  ]
    .filter(Boolean)
    .join(" ")

  const chain = area.chains[treatment] ?? area.chains["build-change"] ?? []
  const items: CeoPlanItem[] = []

  // Carry-forward: unfinished work the founder chose to continue, if it is
  // part of the SAME area (never inject an unrelated priority).
  const carry = (input.priorEvidence?.carryForward ?? []).filter(
    () => input.priorEvidence?.businessAreaId === input.businessAreaId,
  )
  for (const c of carry.slice(0, 1)) {
    const original: CeoGpsOriginal = {
      title: c.title,
      purpose: `You left this in progress in your last CEO Workday™ and chose to continue it. Finishing it comes before starting new work in the same intervention.`,
      expectedEvidence: "The unfinished piece completed or explicitly re-decided.",
      treatment: "implement-operate",
      businessFunction: "own",
      role: "continue",
      estimatedMinutes: 30,
      relatedAssetId: asset.id,
    }
    items.push({
      id: newId(),
      position: items.length,
      ...original,
      relatedAssetTitle: asset.name,
      ceoWorkCategory: "DECIDE",
      gpsOriginal: original,
      founderDecision: "keep",
      status: "planned",
    })
  }

  for (const t of chain) {
    const original: CeoGpsOriginal = {
      title: fill(t.title, asset.name),
      purpose: `${t.purpose} ${t.role === "primary" ? whyPrefix : ""}`.trim(),
      expectedEvidence: fill(t.expectedEvidence, asset.name),
      treatment: t.treatment,
      businessFunction: t.businessFunction,
      role: t.role,
      estimatedMinutes: t.minutes,
      relatedAssetId: asset.id,
    }
    items.push({
      id: newId(),
      position: items.length,
      ...original,
      relatedAssetTitle: asset.id ? asset.name : null,
      relatedAssignmentRef: input.currentAssignment?.ref ?? null,
      ceoWorkCategory: t.ceoWorkCategory,
      gpsOriginal: original,
      founderDecision: "keep",
      status: "planned",
    })
  }

  // Honest time — never pad; trim from the tail if over the container.
  let total = items.reduce((s, i) => s + i.estimatedMinutes, 0)
  while (total > CEO_WORKDAY_CONTAINER_MINUTES && items.length > 1) {
    const dropped = items.pop()!
    total -= dropped.estimatedMinutes
  }

  return {
    ok: items.length > 0,
    reason: items.length ? undefined : "GPS could not derive an intervention chain for this priority.",
    areaName: area.areaName,
    destination: area.destination,
    constraintSummary,
    interventionSummary,
    treatment,
    relatedAssetId: asset.id,
    relatedAssetName: asset.id ? asset.name : null,
    items,
    plannedMinutes: total,
  }
}

/** Minutes that actually occupy today's container. Removed, deferred and delegated work leaves today. */
export function plannedMinutes(items: CeoPlanItem[]): number {
  return items
    .filter((i) => i.founderDecision !== "remove" && i.status !== "deferred" && i.status !== "delegated")
    .reduce((s, i) => s + Math.max(0, Math.round(i.estimatedMinutes || 0)), 0)
}

// ── Declaration ─────────────────────────────────────────────────────────────

/**
 * Builds the CEO Workday Declaration™ from identity + work + purpose.
 * Mirrors the tone of the Movement/Lunch declarations; deterministic.
 */
export function buildCeoWorkdayDeclaration(input: {
  identityStatement: string | null
  items: CeoPlanItem[]
  areaName: string | null
  destination: string | null
  variant?: number
}): string {
  const kept = input.items.filter((i) => i.founderDecision !== "remove" && i.status !== "deferred" && i.status !== "delegated")
  const primary = kept.find((i) => i.role === "primary") ?? kept[0]
  const supporting = kept.filter((i) => i !== primary).slice(0, 1)

  const identity = (input.identityStatement ?? "").trim().replace(/\.$/, "")
  const iAm = identity
    ? /^(i am|i'm|i’m)\b/i.test(identity)
      ? identity
      : `I am ${identity.charAt(0).toLowerCase() + identity.slice(1)}`
    : "I am a focused CEO"

  const work = primary
    ? [primary.title, ...supporting.map((s) => s.title)]
        .map((t) => t.charAt(0).toLowerCase() + t.slice(1))
        .join(" and ")
    : "the work that moves this week forward"

  const purpose = input.destination
    ? `because I build a business with ${input.destination.split(" — ")[0].split(",")[0]}`
    : "because I build a business that creates revenue without consuming my life"

  const v = (input.variant ?? 0) % 3
  if (v === 1) {
    return `${iAm}. In my protected 4-Hour CEO Workday™ I will ${work} — ${purpose}.`
  }
  if (v === 2) {
    return `${iAm}. Today ${input.areaName ?? "my business"} moves forward as I ${work}, ${purpose}.`
  }
  return `${iAm}. Today I commit to ${work} — ${purpose}.`
}
