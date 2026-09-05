/**
 * Entrepreneur Gap Assessment™ — Known Gap → Solution Resolution (Phase 2B)
 * ---------------------------------------------------------------------------
 * Phase 1 (types.ts) and Phase 4 (ega-trigger-detection.ts) deliberately left
 * `gap` and `solution` nullable on every EgaEntry — diagnosis and
 * solution-mapping are progressive enrichment, filled in over time.
 *
 * This module is the first (and, for now, only) piece of that enrichment.
 * It encodes exactly three approved Phase 2A/2A.2/2A.3 audit decisions as a
 * static, read-only lookup — nothing more. It does NOT attempt general
 * gap/solution resolution for every possible EGA signal; every other
 * source/sourceRef combination correctly resolves to `null` here and stays
 * nullable on the EgaEntry, exactly as Phase 1 intended, until a future
 * phase decides its own resolution.
 *
 * The three encoded decisions:
 *
 *   1. esa / "continuous-learning"
 *        → COMBINE_EXISTING_NATIVE_ENHANCEMENT
 *        The behavioral half of this gap (learning without application) is
 *        already solved natively by the "Learning Not Connected → Add
 *        Implementation CTA" reasoning rule. The remaining tangible-outcome
 *        half is NOT a new library item — it should be absorbed as a
 *        capability of the existing Business Asset™ / Operating Rule™
 *        execution flow. No standalone intervention.
 *
 *   2. business_context / "hasProofTestimonials"
 *        → COMBINE_EXISTING_NATIVE_ENHANCEMENT
 *        Was a genuine gap through Phase 2A/2A.2 ("no adequate match").
 *        Phase 3 designed and built the "Proof Capture Playbook™" BAL asset
 *        (lib/business-asset-library/business-asset-registry.ts, id
 *        "proof-capture-playbook") to close it: a repeatable protocol for
 *        capturing a client result and converting it into a testimonial,
 *        case study, results snapshot, or Proof Library™ entry.
 *        `solutionRef` now points at the real, resolvable BAL asset id — no
 *        longer a `proposed-intervention:` placeholder.
 *
 *   3. business_context / "clientConnectionExperienceStatus"
 *        → CONDITIONAL_NATIVE_MECHANISM_MATCH
 *        Stays a Business Context™ fact, not a standalone intervention gap.
 *        "None yet" only triggers a follow-up EGA diagnostic question
 *        ("what is getting in the way?"). Only Evergreen Webinar™ (the
 *        "webinar" format) has a direct existing-asset match today; the
 *        Challenge, Workshop, Immersion, and Mastermind formats have none.
 *        `obstacleType`/`actionType` are intentionally left undefined here
 *        — the real obstacle is not yet known until the founder answers the
 *        follow-up question, and asserting one would misrepresent an open
 *        diagnostic as a closed one.
 */

import type { EgaActionType, EgaEntry, EgaObstacleType } from "./types"

/**
 * Sentinel prefix for a solution that is a proposed intervention concept,
 * not yet designed or built. No BAL/EDE/native lookup function should ever
 * resolve a `solutionRef` with this prefix to a real asset — its presence
 * signals "design work is pending," not "here is the asset."
 */
export const PROPOSED_INTERVENTION_PREFIX = "proposed-intervention:"

export type EgaResolutionClassification =
  /** The gap is real, but no new library item is warranted — an existing
   *  native mechanism and/or the existing Business Asset™/Operating Rule™
   *  execution flow already absorbs it. */
  | "combine_existing_native_enhancement"
  /** The gap is real and no existing mechanism adequately covers it — a new
   *  intervention concept has been named and scoped, but not yet designed
   *  in detail or built. */
  | "new_intervention_required"
  /** The signal stays a descriptive Business Context™ fact. Only a specific
   *  value (e.g. "none") should trigger a follow-up EGA diagnostic
   *  question; existing native mechanisms must be evaluated against the
   *  founder's answer before any new intervention is even considered. */
  | "conditional_native_mechanism_match"

export interface KnownGapSolutionResolution {
  classification: EgaResolutionClassification
  gap: string
  obstacleType?: EgaObstacleType
  solution: string
  solutionRef?: string
  actionType?: EgaActionType
  successIndicator?: string
}

function key(source: EgaEntry["source"], sourceRef: string): string {
  return `${source}:${sourceRef}`
}

const KNOWN_GAP_SOLUTIONS: Record<string, KnownGapSolutionResolution> = {
  [key("esa", "continuous-learning")]: {
    classification: "combine_existing_native_enhancement",
    gap: "Learning is being acquired but not consistently converted into a tangible, reusable business outcome.",
    obstacleType: "system",
    solution:
      "Do not build a standalone new asset. The behavioral half of this gap — learning without application — is " +
      "already covered natively by the \"Learning Not Connected → Add Implementation CTA\" reasoning rule, which " +
      "pairs every Academy™ learning recommendation with a concrete implementation action. The remaining " +
      "tangible-outcome half should be absorbed as a capability of the existing Business Asset™ / Operating " +
      "Rule™ execution flow — Learn → Identify what applies → Decide what should change → Build/design the " +
      "resulting asset or rule → Save the result — rather than a new library item created solely for this " +
      "practice.",
    solutionRef: "learning-not-connected--add-implementation-cta",
    actionType: "augment",
    successIndicator:
      "The founder can point to at least one specific asset, rule, or process change directly produced by " +
      "something they learned in the last 30 days.",
  },

  [key("business_context", "hasProofTestimonials")]: {
    classification: "combine_existing_native_enhancement",
    gap:
      "No repeatable system exists for turning successful client outcomes into usable business proof " +
      "(testimonials, case studies, results snapshots).",
    obstacleType: "system",
    solution:
      "Resolved via the Proof Capture Playbook™ (Business Asset Library™, id \"proof-capture-playbook\", " +
      "category \"Market the Business\"). It walks the founder through Notice → Capture → Request → Document " +
      "→ File → Reuse, producing one of four outputs — Testimonial, Case Study, Results Snapshot, or Proof " +
      "Library™ entry — as guided sub-steps within a single reusable asset, rather than as four separate " +
      "library items.",
    solutionRef: "proof-capture-playbook",
    actionType: "build",
    successIndicator:
      "The founder can point to at least one specific testimonial, case study, results snapshot, or " +
      "proof-library entry captured in the last 30 days, tied to an actual client result.",
  },

  [key("business_context", "clientConnectionExperienceStatus")]: {
    classification: "conditional_native_mechanism_match",
    gap:
      "No recurring Client Connection Experience™ (challenge, webinar, workshop, immersion, or mastermind) " +
      "exists yet, and it is not yet known what is preventing the founder from creating one.",
    // obstacleType intentionally left undefined — genuinely unknown until the founder answers the follow-up
    // EGA diagnostic question below. Asserting one here would misrepresent an open diagnostic as closed.
    solution:
      "Do not classify as a standalone new intervention yet. This requires a follow-up EGA diagnostic question " +
      '— "What is getting in the way of creating or strengthening your Client Connection Experience™?" — before ' +
      "a solution can be mapped. Evaluate the founder's answer against existing native Harmony Lane™ mechanisms " +
      "first: Evergreen Webinar™ is a direct match for the \"webinar\" format; the Challenge, Workshop, " +
      "Immersion, and Mastermind formats currently have no dedicated BAL/EDE asset. Only propose a new " +
      "intervention if none of the existing mechanisms are adequate for the founder's specific format and " +
      "obstacle.",
    solutionRef: "evergreen-webinar",
    // actionType intentionally left undefined for the same reason as obstacleType above.
  },
}

/**
 * Looks up the known, approved gap/solution resolution for a given detected
 * signal's source + sourceRef. Returns null for anything not one of the
 * three explicitly-decided cases above — every other signal remains
 * unresolved (gap/solution stay nullable) exactly as Phase 1 intended.
 */
export function resolveKnownGapAndSolution(
  source: EgaEntry["source"],
  sourceRef: string | undefined,
): KnownGapSolutionResolution | null {
  if (!sourceRef) return null
  return KNOWN_GAP_SOLUTIONS[key(source, sourceRef)] ?? null
}

/** True if a solutionRef is a placeholder for a not-yet-designed/built intervention concept. */
export function isProposedInterventionRef(solutionRef: string | undefined): boolean {
  return !!solutionRef && solutionRef.startsWith(PROPOSED_INTERVENTION_PREFIX)
}
