/**
 * Stage Transitions™ — Stage Exit Criteria (Phase 2A)
 * ---------------------------------------------------------------------------
 * Defines the capability thresholds between the four canonical Business
 * Stages™ (Launch™ → Growth™ → Scale™ → Legacy™). Per Part 14 of the
 * Business-Building Benchmark Standard™: "These are capability thresholds,
 * not arbitrary universal revenue requirements." A transition is a
 * reasonable claim once its exit criteria are sufficiently true — this file
 * does not compare any individual founder against them; that comparison is
 * explicit future scope (Adaptive ESA / Founder GPS™).
 *
 * Every `practiceId` referenced below MUST already exist in
 * `STAGE_BENCHMARKS` (verified by `fixtures.ts`). No criterion is invented
 * independently of the benchmark registry it reads from.
 */

import type { StageExitCriterion, StageTransition } from "./types"

function criterion(
  transitionId: string,
  practiceId: string,
  text: string,
  dimensions: StageExitCriterion["dimensions"],
  rationale: string,
): StageExitCriterion {
  return {
    id: `${transitionId}--${practiceId}`,
    practiceId,
    criterion: text,
    dimensions,
    rationale,
  }
}

/* ===========================================================================
 * Launch™ → Growth™
 * ---------------------------------------------------------------------------
 * Objective per the benchmark standard: prove the business model. The exit
 * question is not "did revenue happen" but "did the business demonstrate it
 * can produce that revenue on purpose, more than once."
 * ======================================================================== */

const LAUNCH_TO_GROWTH: StageTransition = {
  id: "launch-to-growth",
  fromStage: "launch",
  toStage: "growth",
  transitionSummary:
    "The business has moved from 'we think this works' to 'we have real evidence this works' — a validated offer, paying customers, and delivery that doesn't collapse under founder attention alone.",
  exitCriteria: [
    criterion(
      "launch-to-growth",
      "offer-clarity",
      "The offer's customer, problem, outcome, and pricing are demonstrated by real paying customers — not just clearly described.",
      ["prove", "build"],
      "Offer Clarity™ is the Launch must-have that everything else depends on. Growth cannot begin on an offer that is only theoretically validated.",
    ),
    criterion(
      "launch-to-growth",
      "sales-process",
      "A sales conversation or process exists and has converted more than one customer without being reinvented each time.",
      ["build", "prove"],
      "Repeatable revenue — not a single lucky sale — is the actual signal that a business model is proven, per the Launch objective.",
    ),
    criterion(
      "launch-to-growth",
      "cash-flow-awareness",
      "The founder can state, with real numbers, whether the business is making or losing money on a typical sale.",
      ["know", "measure"],
      "Growth without basic economic visibility just scales an unknown problem faster.",
    ),
  ],
  notRequiredForTransition: [
    "delegation-practice",
    "hiring-practice",
    "leadership-development",
    "thought-leadership",
  ],
  transitionCaution:
    "A revenue milestone alone does not confirm this transition. A founder can hit a number once and still be at Launch if it can't be repeated without reinventing the sale each time.",
}

/* ===========================================================================
 * Growth™ → Scale™
 * ---------------------------------------------------------------------------
 * Objective per the benchmark standard: make what works repeatable and
 * profitable without founder effort increasing at the same rate.
 * ======================================================================== */

const GROWTH_TO_SCALE: StageTransition = {
  id: "growth-to-scale",
  fromStage: "growth",
  toStage: "scale",
  transitionSummary:
    "Revenue growth no longer requires proportional founder hours — delivery, sales, and decisions are increasingly held by systems and people, not solely by the founder.",
  exitCriteria: [
    criterion(
      "growth-to-scale",
      "sop-documentation",
      "Core delivery and operating processes are documented well enough that someone other than the founder can follow them.",
      ["build", "own"],
      "Scale requires capacity to grow independent of the founder personally re-explaining how things work each time.",
    ),
    criterion(
      "growth-to-scale",
      "delegation-practice",
      "Meaningful responsibilities have moved off the founder's plate and are being executed reliably by someone else.",
      ["own", "prove"],
      "The Scale objective is explicitly reduced founder dependency, not just more revenue.",
    ),
    criterion(
      "growth-to-scale",
      "financial-review-rhythm",
      "The business reviews financial performance on a regular cadence, not only when something feels wrong.",
      ["measure"],
      "Scale multiplies whatever is already true about the business — including financial blind spots — so measurement must exist before multiplying.",
    ),
    criterion(
      "growth-to-scale",
      "hiring-practice",
      "There is a repeatable way new team members are brought on, rather than ad hoc hiring driven by immediate pressure.",
      ["build", "own"],
      "Organizational capacity — the Scale objective — cannot be improvised hire by hire.",
    ),
  ],
  notRequiredForTransition: [
    "thought-leadership",
    "retention-referral",
  ],
  transitionCaution:
    "Adding headcount or revenue while every decision still routes through the founder is not Scale — it is a larger version of Growth with more overhead.",
}

/* ===========================================================================
 * Scale™ → Legacy™
 * ---------------------------------------------------------------------------
 * Objective per the benchmark standard: make value transferable and create
 * optionality. Legacy does not mean "sell" — it means durable value that
 * does not require the founder's daily involvement to keep functioning.
 * ======================================================================== */

const SCALE_TO_LEGACY: StageTransition = {
  id: "scale-to-legacy",
  fromStage: "scale",
  toStage: "legacy",
  transitionSummary:
    "The business creates value that persists independent of the founder — knowledge, leadership, and financial performance no longer live inside one person.",
  exitCriteria: [
    criterion(
      "scale-to-legacy",
      "leadership-development",
      "Leadership capability exists beyond the founder, with real decisions being made by others and holding up under scrutiny.",
      ["own", "build"],
      "Legacy requires institutional leadership, not just an org chart with the founder still making every real decision.",
    ),
    criterion(
      "scale-to-legacy",
      "sop-documentation",
      "Institutional knowledge is captured well enough that the business's know-how does not leave if the founder steps back.",
      ["build", "prove"],
      "Transferable value — the Legacy objective — is impossible if the operating knowledge only exists in the founder's head.",
    ),
    criterion(
      "scale-to-legacy",
      "financial-review-rhythm",
      "Financial performance is durable and reviewed independent of founder involvement in daily operations.",
      ["measure", "own"],
      "Optionality (continue, step back, sell, succession, etc.) all require financial durability the founder isn't personally propping up day to day.",
    ),
  ],
  notRequiredForTransition: [
    "marketing-consistency",
    "ai-integration",
  ],
  transitionCaution:
    "Legacy is not a size threshold and does not require selling the business. A founder can be at Legacy while continuing to run the company, as long as the business's value no longer depends on them doing so.",
}

export const STAGE_TRANSITIONS: StageTransition[] = [LAUNCH_TO_GROWTH, GROWTH_TO_SCALE, SCALE_TO_LEGACY]
