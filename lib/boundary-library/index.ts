/**
 * Work-Life Balance Boundary Library™ — public read API.
 *
 * A thin, dependency-free selector layer over the static catalog. This is the
 * surface the future Boundary Builder™, Recommendation Engine, Human SOS™
 * generator, and weekly Reality Check follow-up read from — so relationship
 * traversal lives in one place instead of being re-implemented per consumer.
 *
 * NOTE: this module is pure content lookup (no user data, no Supabase). Custom
 * boundaries live in ./server + ./use-custom-boundaries.
 */

import {
  BOUNDARY_FAMILIES,
  BOUNDARY_PATTERNS,
  BUSINESS_REQUIREMENTS,
  ESCALATION_PATTERNS,
  EXCEPTION_PATTERNS,
  IMPLEMENTATION_REQUIREMENTS,
  OPERATING_RULE_PATTERNS,
  STAKEHOLDER_REQUIREMENTS,
  STAKEHOLDER_TYPES,
  TRAINING_REQUIREMENTS,
} from "./catalog"
import type {
  BoundaryFamilyId,
  BoundaryPattern,
  BusinessRealitySignal,
  BusinessRequirement,
  BusinessRequirementId,
  EscalationPattern,
  ExceptionPattern,
  OperatingRulePattern,
  RealityCheckSignal,
  StakeholderTypeId,
} from "./types"

export * from "./types"
export {
  BOUNDARY_FAMILIES,
  BOUNDARY_PATTERNS,
  BUSINESS_REQUIREMENTS,
  ESCALATION_PATTERNS,
  EXCEPTION_PATTERNS,
  IMPLEMENTATION_REQUIREMENTS,
  OPERATING_RULE_PATTERNS,
  STAKEHOLDER_REQUIREMENTS,
  STAKEHOLDER_TYPES,
  TRAINING_REQUIREMENTS,
}

/* ------------------------------------------------------------------ */
/* Basic lookups                                                       */
/* ------------------------------------------------------------------ */

const activePatterns = () => BOUNDARY_PATTERNS.filter((p) => p.active).sort((a, b) => a.sortOrder - b.sortOrder)

export function getBoundaryPattern(id: string): BoundaryPattern | undefined {
  return BOUNDARY_PATTERNS.find((p) => p.id === id)
}

export function getPatternsByFamily(family: BoundaryFamilyId): BoundaryPattern[] {
  return activePatterns().filter((p) => p.family === family)
}

export function getBusinessRequirement(id: BusinessRequirementId): BusinessRequirement | undefined {
  return BUSINESS_REQUIREMENTS.find((r) => r.id === id)
}

export function getOperatingRule(id: string): OperatingRulePattern | undefined {
  return OPERATING_RULE_PATTERNS.find((r) => r.id === id)
}

export function getEscalationPattern(id: string): EscalationPattern | undefined {
  return ESCALATION_PATTERNS.find((e) => e.id === id)
}

/* ------------------------------------------------------------------ */
/* Relationship traversal (boundary → downstream design objects)       */
/* ------------------------------------------------------------------ */

export interface BoundaryBlueprint {
  pattern: BoundaryPattern
  businessRequirements: BusinessRequirement[]
  operatingRules: OperatingRulePattern[]
  escalationPatterns: EscalationPattern[]
  exceptionPatterns: ExceptionPattern[]
  /** Explicit non-exceptions, so "everything is urgent" cannot erode the boundary. */
  notExceptions: ExceptionPattern[]
}

/**
 * Expand a boundary pattern into the full downstream design surface the
 * Builder needs (requirements → rules → escalation/exceptions). Rules are the
 * union of those declared on the pattern and those implied by its business
 * requirements, so the two stay consistent.
 */
export function buildBoundaryBlueprint(patternId: string): BoundaryBlueprint | undefined {
  const pattern = getBoundaryPattern(patternId)
  if (!pattern) return undefined

  const businessRequirements = pattern.businessRequirements
    .map(getBusinessRequirement)
    .filter((r): r is BusinessRequirement => Boolean(r))

  const ruleIds = new Set<string>(pattern.operatingRules)
  for (const req of businessRequirements) req.operatingRules.forEach((id) => ruleIds.add(id))
  const operatingRules = OPERATING_RULE_PATTERNS.filter((r) => ruleIds.has(r.id)).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )

  const escalationPatterns = pattern.escalationPatterns
    .map(getEscalationPattern)
    .filter((e): e is EscalationPattern => Boolean(e))

  const exceptions = pattern.exceptionPatterns
    .map((id) => EXCEPTION_PATTERNS.find((e) => e.id === id))
    .filter((e): e is ExceptionPattern => Boolean(e))

  return {
    pattern,
    businessRequirements,
    operatingRules,
    escalationPatterns,
    exceptionPatterns: exceptions.filter((e) => e.isException),
    notExceptions: exceptions.filter((e) => !e.isException),
  }
}

/* ------------------------------------------------------------------ */
/* Recommendation inputs (data relationships for future scoring)       */
/* ------------------------------------------------------------------ */

export interface BoundaryMatchInput {
  lifePriorityIds?: string[]
  realityCheckSignals?: RealityCheckSignal[]
  businessRealitySignals?: BusinessRealitySignal[]
  stakeholderTypes?: StakeholderTypeId[]
}

export interface BoundaryMatch {
  pattern: BoundaryPattern
  score: number
  reasons: string[]
}

/**
 * Score boundary patterns against contextual signals. This is intentionally a
 * transparent, additive relevance pass (NOT the final recommendation
 * algorithm) — it exists so the future Builder has the relationships wired and
 * can surface a small, relevant set instead of the whole catalog.
 */
export function matchBoundaries(input: BoundaryMatchInput, limit = 5): BoundaryMatch[] {
  const life = new Set(input.lifePriorityIds ?? [])
  const rc = new Set(input.realityCheckSignals ?? [])
  const br = new Set(input.businessRealitySignals ?? [])
  const stk = new Set(input.stakeholderTypes ?? [])

  const matches: BoundaryMatch[] = activePatterns()
    .map((pattern) => {
      const reasons: string[] = []
      let score = 0
      for (const id of pattern.possibleLifePriorities) if (life.has(id)) { score += 2; reasons.push(`Supports life priority: ${id}`) }
      for (const s of pattern.relatedRealityCheckSignals) if (rc.has(s)) { score += 3; reasons.push(`Matches Reality Check signal: ${s}`) }
      for (const s of pattern.relatedBusinessRealitySignals) if (br.has(s)) { score += 2; reasons.push(`Matches business reality: ${s}`) }
      for (const s of pattern.stakeholderTypes) if (stk.has(s)) { score += 1 }
      return { pattern, score, reasons }
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)

  return matches.slice(0, limit)
}

/** Which seeded boundaries commonly support a given Life Priority™. */
export function boundariesForLifePriority(lifePriorityId: string): BoundaryPattern[] {
  return activePatterns().filter((p) => p.possibleLifePriorities.includes(lifePriorityId))
}
