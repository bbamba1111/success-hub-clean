/**
 * Business Leverage Framework™ — KEEP · DELEGATE · AUTOMATE · ELIMINATE (Phase 6.2)
 * ---------------------------------------------------------------------------
 * The canonical four-class leverage decision model.
 *
 * Every task, activity, and recommendation produced by Harmony Lane™ will
 * eventually carry a `LeverageClassId`. This registry defines what each class
 * means, when to apply it, and which delegation targets are available.
 *
 * Architecture rules:
 *   - The EDE assigns a leverage class to every recommendation before it
 *     reaches Cherry Blossom™. Cherry Blossom™ uses this to frame the ask.
 *   - "keep" does NOT mean "important" — it means only this founder can do it.
 *     High-importance tasks that can be delegated are still "delegate".
 *   - Classes are evaluated in order: ELIMINATE → AUTOMATE → DELEGATE → KEEP.
 *     The EDE asks "can we eliminate this?" first, not "should the founder do this?".
 *
 * Import pattern:
 *   import { LEVERAGE_FRAMEWORK, getLeverageClassById } from
 *     "@/lib/executive-decision-engine/leverage-framework"
 */

import type { LeverageClass } from "./types"

/* ===========================================================================
 * Business Leverage Framework™
 * ======================================================================== */

export const LEVERAGE_FRAMEWORK: readonly LeverageClass[] = [
  {
    id: "keep",
    label: "KEEP™",
    tagline: "Only you can do this.",
    description:
      "This work lives inside the founder's Human Zone of Genius™ — the irreplaceable decisions, relationships, and creative acts that only they can perform. KEEP™ work is protected, not eliminated or delegated. It is the reason the founder exists in this business.",
    upholdsConstitution: ["protect-zone-of-genius"],
    primaryOutcome: "build-compounding-assets",
    delegationTargets: [],
    qualifyingQuestions: [
      "Would a client or partner notice — and care — if someone else did this?",
      "Does this require the founder's specific judgment, relationships, or creative voice?",
      "Is this the work the founder would do even if everything else was handled?",
      "Does this directly exercise the founder's Zone of Genius™?",
    ],
    status: "active",
  },
  {
    id: "delegate",
    label: "DELEGATE™",
    tagline: "Someone else should own this.",
    description:
      "This work can be performed — often better — by a qualified human team member, AI Executive™, partner, contractor, or agency. DELEGATE™ is the first question after ELIMINATE and AUTOMATE. Most operational execution belongs here, not with the founder.",
    upholdsConstitution: [
      "prefer-delegate-automate-eliminate",
      "protect-zone-of-genius",
      "reduce-execution-friction-weekly",
    ],
    primaryOutcome: "reduce-execution-friction",
    delegationTargets: [
      {
        id: "human-team",
        label: "Human Team™",
        bestFor:
          "Recurring operational work, client-facing execution, and administrative tasks that require human judgment but not the founder's specific expertise.",
        status: "architecture",
      },
      {
        id: "ai-executive",
        label: "AI Executive™",
        bestFor:
          "Research, first-draft creation, data analysis, scheduling, communication drafting, and systematic decision support that follows clear rules.",
        status: "architecture",
      },
      {
        id: "contractor",
        label: "Contractor™",
        bestFor:
          "Specialized project work that requires expertise the founder doesn't have or maintain (design, development, legal, accounting, copywriting).",
        status: "architecture",
      },
      {
        id: "agency",
        label: "Agency™",
        bestFor:
          "Ongoing specialized services that require a team and infrastructure the founder doesn't maintain internally (PR, paid advertising, SEO, social media management).",
        status: "architecture",
      },
      {
        id: "partner",
        label: "Partner™",
        bestFor:
          "Strategic collaboration, co-creation, referral relationships, and joint ventures where shared ownership creates better outcomes than solo execution.",
        status: "architecture",
      },
      {
        id: "virtual-assistant",
        label: "Virtual Assistant™",
        bestFor:
          "High-volume, process-driven tasks — email management, scheduling, data entry, research, and administrative coordination.",
        status: "architecture",
      },
    ],
    qualifyingQuestions: [
      "Could a well-briefed team member, contractor, or AI do this at 80%+ quality?",
      "Is this work that trains or grows with repetition — or is it always the same?",
      "Would delegating this free the founder for KEEP™ work?",
      "Is there a clear process that could be documented and handed off?",
    ],
    status: "active",
  },
  {
    id: "automate",
    label: "AUTOMATE™",
    tagline: "Technology should do this.",
    description:
      "This work follows a predictable, rule-based pattern that technology can execute without ongoing human involvement. AUTOMATE™ creates the highest long-term leverage because it compounds forever — a system built once runs indefinitely.",
    upholdsConstitution: [
      "prefer-delegate-automate-eliminate",
      "reduce-execution-friction-weekly",
      "build-compounding-assets",
    ],
    primaryOutcome: "reduce-execution-friction",
    delegationTargets: [],
    qualifyingQuestions: [
      "Does this task follow the same steps every time it's performed?",
      "Could a clear set of rules describe how to do this perfectly?",
      "Is the cost of the human doing this higher than the cost of a tool?",
      "Would automating this free human time for higher-leverage work?",
    ],
    status: "active",
  },
  {
    id: "eliminate",
    label: "ELIMINATE™",
    tagline: "This should not be done at all.",
    description:
      "This activity no longer creates sufficient value to justify the time, energy, or resources it consumes. ELIMINATE™ is the highest-leverage classification — the work that disappears entirely. It is evaluated first, before delegation or automation, because the most efficient system is the one that doesn't need to run.",
    upholdsConstitution: [
      "prefer-delegate-automate-eliminate",
      "reduce-execution-friction-weekly",
      "long-term-sustainability-over-short-term-busyness",
    ],
    primaryOutcome: "reduce-execution-friction",
    delegationTargets: [],
    qualifyingQuestions: [
      "What would happen if this were simply not done?",
      "Is this activity producing measurable value for the business or its clients?",
      "Is this being done out of habit, obligation, or fear — rather than strategy?",
      "Is there a world where this activity no longer exists in the business?",
    ],
    status: "active",
  },
] as const

/* ===========================================================================
 * Evaluation order
 * ---------------------------------------------------------------------------
 * The EDE evaluates leverage classes in this order. The first class whose
 * qualifying conditions are met becomes the assigned class.
 * ======================================================================== */

export const LEVERAGE_EVALUATION_ORDER: readonly LeverageClass["id"][] = [
  "eliminate",
  "automate",
  "delegate",
  "keep",
] as const

/* ===========================================================================
 * Lookup helpers
 * ======================================================================== */

/** Retrieve a leverage class by its stable id. */
export function getLeverageClassById(
  id: LeverageClass["id"]
): LeverageClass | undefined {
  return LEVERAGE_FRAMEWORK.find((c) => c.id === id)
}

/** Retrieve all active leverage classes in evaluation order. */
export function getLeverageFrameworkOrdered(): readonly LeverageClass[] {
  return LEVERAGE_EVALUATION_ORDER.map(
    (id) => LEVERAGE_FRAMEWORK.find((c) => c.id === id)!
  )
}
