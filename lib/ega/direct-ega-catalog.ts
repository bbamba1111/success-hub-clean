/**
 * Entrepreneur Gap Assessment™ — Direct EGA Catalog (Screen 1 + Screen 2)
 * ---------------------------------------------------------------------------
 * DATA-ONLY registry for the direct EGA question flow: "What is getting in
 * your way?" (Screen 1 — recognition) followed by "What's getting in the
 * way of [that]?" (Screen 2 — obstacle diagnosis), per the approved EGA
 * architecture:
 *
 *   Founder Profile™ → Business Context™ → EGA™ (Screen 1 → Screen 2) →
 *   Solution Resolution → CEO Workday™
 *
 * This is the `direct_ega` source already defined in ./types.ts
 * ("founder answered a direct EGA question") — no new EgaSource is
 * introduced here.
 *
 * Architecture rules (matching esa-registry.ts):
 *   - No rendering, no scoring, no solution-mapping logic. Data only.
 *   - Every id is stable — safe for routing, Supabase storage, and analytics.
 *   - `pillarId` is a loose cross-reference to OPERATING_PILLARS for grouping
 *     Screen 1 statements only — it is NOT a scoring input and NOT written
 *     to ega_entries.
 *   - Solution mapping for a captured (statement, obstacle) pair is
 *     intentionally deferred — this catalog only gets the founder to a
 *     diagnosed Gap (signal + obstacle). Mapping every combination to a
 *     specific Business Asset™/EDE template is future progressive
 *     enrichment, matching the nullable `solution`/`solutionRef` model
 *     already on EgaEntry.
 */

import type { OperatingPillarId } from "@/lib/entrepreneur-success/types"
import type { EgaActionType, EgaObstacleType } from "./types"

/* ===========================================================================
 * Screen 1 — Problem statements ("What is getting in your way?")
 * ======================================================================== */

export interface DirectEgaProblemStatement {
  id: string
  /** The founder-recognizable statement rendered on the clickable card. */
  statement: string
  /** Loose grouping only — never written to ega_entries. */
  pillarId: OperatingPillarId
}

export const DIRECT_EGA_PROBLEM_STATEMENTS: DirectEgaProblemStatement[] = [
  {
    id: "putting-out-fires",
    statement: "I keep putting out fires.",
    pillarId: "operations-systems",
  },
  {
    id: "everything-comes-back-to-me",
    statement: "Everything keeps coming back to me.",
    pillarId: "operations-systems",
  },
  {
    id: "need-onboarding-process",
    statement: "I know I need an onboarding process.",
    pillarId: "client-excellence",
  },
  {
    id: "no-time-for-money-work",
    statement: "I don't have time to work on the things that make money.",
    pillarId: "revenue-engine",
  },
  {
    id: "team-waits-on-me",
    statement: "My team waits for me to make every decision.",
    pillarId: "people-leadership",
  },
  {
    id: "cant-explain-offer",
    statement: "I don't know how to explain my offer clearly.",
    pillarId: "strategic-foundation",
  },
  {
    id: "no-consistent-leads",
    statement: "I don't know where my next client is coming from.",
    pillarId: "revenue-engine",
  },
  {
    id: "avoid-the-numbers",
    statement: "I avoid looking at my numbers.",
    pillarId: "financial-intelligence",
  },
  {
    id: "no-repeatable-process",
    statement: "I do things differently every time instead of following a process.",
    pillarId: "operations-systems",
  },
  {
    id: "no-time-for-self",
    statement: "I keep putting myself last.",
    pillarId: "human-sustainability",
  },
  {
    id: "cant-let-go",
    statement: "I can't seem to let go of things I know I should hand off.",
    pillarId: "people-leadership",
  },
  {
    id: "stopped-growing",
    statement: "I've stopped learning or growing my own skills.",
    pillarId: "growth-innovation",
  },
]

/* ===========================================================================
 * Screen 2 — Obstacle diagnosis ("What's getting in the way of that?")
 * ---------------------------------------------------------------------------
 * One card per EgaObstacleType, in the founder's language.
 * ======================================================================== */

export interface DirectEgaObstacleOption {
  type: EgaObstacleType
  label: string
  description: string
}

export const DIRECT_EGA_OBSTACLE_OPTIONS: DirectEgaObstacleOption[] = [
  {
    type: "knowledge",
    label: "I don't know how",
    description: "I haven't learned the skill or approach yet.",
  },
  {
    type: "time",
    label: "I don't have time",
    description: "The hours in my week are already spoken for.",
  },
  {
    type: "priority",
    label: "It hasn't been a priority",
    description: "I know it matters, but other things kept winning.",
  },
  {
    type: "confidence",
    label: "I'm not confident yet",
    description: "I'm unsure I'd do it well, so I keep avoiding it.",
  },
  {
    type: "system",
    label: "I don't have a system for it",
    description: "There's no repeatable process — I start from scratch each time.",
  },
  {
    type: "delegation",
    label: "I'm doing it myself when someone else could",
    description: "This doesn't need to be on my plate at all.",
  },
  {
    type: "decision",
    label: "I haven't decided how to approach it",
    description: "I'm stuck between options instead of committing to one.",
  },
  {
    type: "capacity",
    label: "I don't have the bandwidth right now",
    description: "I'm already at my limit — this would push me over it.",
  },
]

/** Human-readable label for an obstacle type, for use outside the picker (e.g. results screen). */
export function getObstacleLabel(type: EgaObstacleType): string {
  return DIRECT_EGA_OBSTACLE_OPTIONS.find((o) => o.type === type)?.label ?? type
}

/**
 * A defensible, generic actionType suggestion per obstacle type — not a
 * specific solution. Specific Business Asset™/EDE mapping per
 * (statement, obstacle) combination remains deferred, progressive
 * enrichment for a later phase.
 */
export const OBSTACLE_ACTION_TYPE: Record<EgaObstacleType, EgaActionType> = {
  knowledge: "augment",
  time: "restructure",
  priority: "restructure",
  confidence: "practice",
  system: "build",
  delegation: "delegate",
  decision: "design",
  capacity: "protect_non_negotiables",
}
