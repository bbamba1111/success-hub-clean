/**
 * Founder Digital Twin™ — Scenario Registry (Phase 11.0)
 * ---------------------------------------------------------------------------
 * 9 predefined scenarios + custom scaffold.
 * Pure data — no logic.
 */

import type { Scenario, ScenarioTopicId } from "@/lib/digital-twin/types"

function makeScenario(
  topicId: ScenarioTopicId,
  title: string,
  question: string,
  labelA: string,
  descA: string,
  labelB: string,
  descB: string,
): Scenario {
  return {
    id: topicId,
    topicId,
    title,
    question,
    optionA: { id: "option-a", label: labelA, description: descA },
    optionB: { id: "option-b", label: labelB, description: descB },
    createdAt: new Date().toISOString(),
  }
}

export const SCENARIO_REGISTRY: Record<ScenarioTopicId, Scenario> = {
  "hire-now-vs-later": makeScenario(
    "hire-now-vs-later",
    "Hire Now vs. Hire Later",
    "Should I bring on a team member now or wait until my revenue and systems are more stable?",
    "Hire Now",
    "Bring on a contractor or employee in the next 30 days to offload specific work.",
    "Hire Later",
    "Hold the hiring plan until a clear revenue threshold and documented SOPs are in place.",
  ),
  "launch-now-vs-wait": makeScenario(
    "launch-now-vs-wait",
    "Launch Now vs. Wait",
    "Is this the right moment to launch, or would waiting result in a significantly better outcome?",
    "Launch Now",
    "Move forward with the launch in the next 2–4 weeks with the current offer and audience.",
    "Wait & Prepare",
    "Delay the launch by 6–10 weeks to build audience, refine the offer, and strengthen the runway.",
  ),
  "build-new-offer-vs-improve-existing": makeScenario(
    "build-new-offer-vs-improve-existing",
    "Build New Offer vs. Improve Existing",
    "Should I create a new offer or invest that energy in making my current offer stronger?",
    "Build New Offer",
    "Design and bring a new product or service to market that targets a different client need or segment.",
    "Improve Existing",
    "Deepen the results and experience of your current offer before introducing anything new.",
  ),
  "delegate-vs-retain": makeScenario(
    "delegate-vs-retain",
    "Delegate vs. Retain",
    "Should I hand this responsibility to someone else or keep it with me for now?",
    "Delegate",
    "Create a documented process and hand this responsibility to a contractor or team member.",
    "Retain",
    "Keep this responsibility in-house for now and revisit delegation once systems are documented.",
  ),
  "invest-in-ai-vs-manual": makeScenario(
    "invest-in-ai-vs-manual",
    "Invest in AI Tools vs. Manual Systems",
    "Should I adopt AI tools to accelerate this workflow, or build a reliable manual system first?",
    "Invest in AI",
    "Adopt AI tools to automate or accelerate this workflow in the next 30 days.",
    "Manual First",
    "Build a documented, human-run system first, then layer AI once the workflow is proven.",
  ),
  "protect-ceo-workday-vs-add-meetings": makeScenario(
    "protect-ceo-workday-vs-add-meetings",
    "Protect CEO Workday™ vs. Add Meetings",
    "Should I protect my CEO Workday™ time block this quarter, or open it up to meet a specific demand?",
    "Protect CEO Workday™",
    "Keep the CEO Workday™ block sacred this quarter and redirect meeting requests to other time slots.",
    "Open for Meetings",
    "Temporarily reduce CEO Workday™ blocks to accommodate a specific relationship or demand for 4–8 weeks.",
  ),
  "create-asset-vs-one-time-work": makeScenario(
    "create-asset-vs-one-time-work",
    "Create a Business Asset™ vs. One-Time Work",
    "Should I package this as a reusable asset or deliver it once and move on?",
    "Create Business Asset™",
    "Invest additional time now to turn this into a reusable, sellable, or compounding Business Asset™.",
    "One-Time Delivery",
    "Deliver this once efficiently, capture the revenue, and move to the next priority.",
  ),
  "increase-prices-vs-volume": makeScenario(
    "increase-prices-vs-volume",
    "Increase Prices vs. Increase Volume",
    "Should I raise my prices or focus on serving more clients at the current price point?",
    "Increase Prices",
    "Raise prices on new clients (or existing) to improve margin and reduce volume pressure.",
    "Increase Volume",
    "Keep prices stable and invest in marketing and sales to increase the number of clients served.",
  ),
  "expand-team-vs-improve-systems": makeScenario(
    "expand-team-vs-improve-systems",
    "Expand Team vs. Improve Systems",
    "Is the bottleneck in my business a people problem or a systems problem?",
    "Expand Team",
    "Bring in additional human capacity to handle the growing workload.",
    "Improve Systems",
    "Invest time in automating, documenting, and systematizing current workflows before adding headcount.",
  ),
  "custom": makeScenario(
    "custom",
    "Custom Scenario",
    "Define your own decision to evaluate.",
    "Option A",
    "Describe your first option.",
    "Option B",
    "Describe your second option.",
  ),
}

export const ALL_SCENARIO_TOPICS: ScenarioTopicId[] = [
  "hire-now-vs-later",
  "launch-now-vs-wait",
  "build-new-offer-vs-improve-existing",
  "delegate-vs-retain",
  "invest-in-ai-vs-manual",
  "protect-ceo-workday-vs-add-meetings",
  "create-asset-vs-one-time-work",
  "increase-prices-vs-volume",
  "expand-team-vs-improve-systems",
  "custom",
]

export function getScenario(topicId: ScenarioTopicId): Scenario {
  return SCENARIO_REGISTRY[topicId] ?? SCENARIO_REGISTRY["custom"]
}
