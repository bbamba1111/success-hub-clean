/**
 * Founder Digital Twin™ — Scenario Analyzer (Phase 11.0)
 * ---------------------------------------------------------------------------
 * Pure function. Produces a ScenarioAnalysis from a Scenario + FounderTwinProfile
 * + HarmonyContextAggregate. No I/O.
 *
 * All projections are clearly framed as "informed projections based on your
 * operating history" — never guarantees.
 */

import type {
  Scenario,
  ScenarioAnalysis,
  ScenarioConfidence,
  ScenarioEvidence,
  ImpactScore,
  ImpactDimensionId,
  ExecutivePerspective,
  AssetOpportunity,
  FounderTwinProfile,
} from "@/lib/digital-twin/types"
import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"

/* ===========================================================================
 * Impact scoring heuristics
 * ======================================================================== */

type ScenarioImpactMap = Record<
  string, // topicId
  Record<ImpactDimensionId, { a: number; b: number; rationale: string }>
>

const DIMENSION_LABELS: Record<ImpactDimensionId, string> = {
  "strategic-progress": "Strategic Progress",
  "revenue-growth": "Revenue Growth",
  "founder-capacity": "Founder Capacity",
  "time-freedom": "Time Freedom",
  "business-asset-growth": "Business Asset Growth",
  "executive-capability": "Executive Capability",
  "team-readiness": "Team Readiness",
  "financial-health": "Financial Health",
  "whole-life-harmony": "Whole-Life Harmony",
}

const IMPACT_HEURISTICS: ScenarioImpactMap = {
  "hire-now-vs-later": {
    "strategic-progress":   { a: 1,  b: 0,  rationale: "Hiring now enables faster execution of strategic priorities." },
    "revenue-growth":       { a: 1,  b: 1,  rationale: "Both paths can grow revenue; timing depends on runway." },
    "founder-capacity":     { a: 2,  b: -1, rationale: "Hiring now offloads execution; delaying keeps load on founder." },
    "time-freedom":         { a: 1,  b: -1, rationale: "Bringing on help frees CEO Workday™ time." },
    "business-asset-growth":{ a: 0,  b: 1,  rationale: "Waiting allows system documentation before delegation." },
    "executive-capability": { a: 1,  b: 0,  rationale: "Managing a hire deepens leadership capability." },
    "team-readiness":       { a: 1,  b: -1, rationale: "Building the team now accelerates readiness over time." },
    "financial-health":     { a: -1, b: 1,  rationale: "Hiring now costs; waiting preserves runway." },
    "whole-life-harmony":   { a: 1,  b: -1, rationale: "Reducing overload protects personal capacity." },
  },
  "launch-now-vs-wait": {
    "strategic-progress":   { a: 1,  b: 1,  rationale: "Both paths advance strategy; timing affects momentum." },
    "revenue-growth":       { a: 1,  b: 1,  rationale: "Launching now generates earlier revenue; waiting may generate more per launch." },
    "founder-capacity":     { a: -1, b: 0,  rationale: "Launching now demands peak capacity; waiting allows preparation." },
    "time-freedom":         { a: -1, b: 0,  rationale: "A launch period compresses available time." },
    "business-asset-growth":{ a: 0,  b: 1,  rationale: "Waiting allows offer refinement that compounds as an asset." },
    "executive-capability": { a: 1,  b: 1,  rationale: "Both scenarios develop launch and marketing capability." },
    "team-readiness":       { a: 0,  b: 1,  rationale: "Preparation time improves team readiness for launch." },
    "financial-health":     { a: 1,  b: -1, rationale: "Earlier launch = earlier revenue; waiting delays cash flow." },
    "whole-life-harmony":   { a: -1, b: 0,  rationale: "Launch periods are intense; waiting allows for better timing." },
  },
  "build-new-offer-vs-improve-existing": {
    "strategic-progress":   { a: 1,  b: 1,  rationale: "Both advance the business; new offers expand scope, improvement deepens positioning." },
    "revenue-growth":       { a: 1,  b: 2,  rationale: "Improving an existing offer with proven demand typically returns faster." },
    "founder-capacity":     { a: -1, b: 0,  rationale: "New offer creation is high cognitive load; improvement is incremental." },
    "time-freedom":         { a: -1, b: 0,  rationale: "Building something new requires concentrated creative blocks." },
    "business-asset-growth":{ a: 2,  b: 1,  rationale: "A new offer is a new asset; improvement strengthens an existing one." },
    "executive-capability": { a: 2,  b: 1,  rationale: "Creating a new offer develops the most cross-executive capability." },
    "team-readiness":       { a: 0,  b: 1,  rationale: "Improving existing offers is easier to train and delegate." },
    "financial-health":     { a: 0,  b: 1,  rationale: "Improving a proven offer has lower financial risk." },
    "whole-life-harmony":   { a: -1, b: 1,  rationale: "New offer development is intensive; iteration is more sustainable." },
  },
  "delegate-vs-retain": {
    "strategic-progress":   { a: 2,  b: 0,  rationale: "Delegation frees the founder for strategic priorities." },
    "revenue-growth":       { a: 1,  b: 0,  rationale: "Freeing capacity allows revenue-generating focus." },
    "founder-capacity":     { a: 2,  b: -1, rationale: "Delegation is the primary lever for reclaiming capacity." },
    "time-freedom":         { a: 2,  b: -1, rationale: "Every delegated hour is a recovered hour." },
    "business-asset-growth":{ a: 1,  b: 0,  rationale: "Documentation required for delegation creates business assets." },
    "executive-capability": { a: 1,  b: 0,  rationale: "Delegation builds leadership and people management capability." },
    "team-readiness":       { a: 1,  b: -1, rationale: "Delegation develops team readiness; retaining slows it." },
    "financial-health":     { a: -1, b: 1,  rationale: "Delegation costs; retaining is cheaper short-term." },
    "whole-life-harmony":   { a: 2,  b: -1, rationale: "Reclaiming time is a direct investment in whole-life harmony." },
  },
  "invest-in-ai-vs-manual": {
    "strategic-progress":   { a: 1,  b: 0,  rationale: "AI tools can accelerate execution of strategic work." },
    "revenue-growth":       { a: 1,  b: 0,  rationale: "Automation can scale revenue-generating activities." },
    "founder-capacity":     { a: 2,  b: 0,  rationale: "AI adoption at its best significantly multiplies founder output." },
    "time-freedom":         { a: 2,  b: 0,  rationale: "Well-implemented AI tools reclaim recurring time blocks." },
    "business-asset-growth":{ a: 1,  b: 1,  rationale: "Both paths can produce documented processes as assets." },
    "executive-capability": { a: 2,  b: 0,  rationale: "AI capability is a modern executive skill worth building now." },
    "team-readiness":       { a: 0,  b: 1,  rationale: "Manual systems are easier to train humans on initially." },
    "financial-health":     { a: -1, b: 1,  rationale: "AI tools have upfront cost; manual systems are cheaper short-term." },
    "whole-life-harmony":   { a: 1,  b: 0,  rationale: "Automating repetitive work reduces cognitive load over time." },
  },
  "protect-ceo-workday-vs-add-meetings": {
    "strategic-progress":   { a: 2,  b: -1, rationale: "CEO Workday™ is when strategic work happens." },
    "revenue-growth":       { a: 1,  b: 1,  rationale: "Both paths can drive revenue depending on what meetings accomplish." },
    "founder-capacity":     { a: 2,  b: -2, rationale: "Meeting overload is the single largest capacity drain." },
    "time-freedom":         { a: 2,  b: -2, rationale: "Protected blocks are time freedom in practice." },
    "business-asset-growth":{ a: 2,  b: -1, rationale: "Deep work blocks are required to create business assets." },
    "executive-capability": { a: 1,  b: 0,  rationale: "CEO Workday™ develops strategic and operational capability." },
    "team-readiness":       { a: 0,  b: 1,  rationale: "Meetings can develop team alignment and readiness." },
    "financial-health":     { a: 0,  b: 0,  rationale: "Neither directly affects short-term financial health." },
    "whole-life-harmony":   { a: 2,  b: -2, rationale: "CEO Workday™ protection is a direct whole-life harmony lever." },
  },
  "create-asset-vs-one-time-work": {
    "strategic-progress":   { a: 2,  b: 0,  rationale: "Business assets compound — one-time work doesn't." },
    "revenue-growth":       { a: 2,  b: 1,  rationale: "Assets can be sold or licensed repeatedly." },
    "founder-capacity":     { a: -1, b: 1,  rationale: "Asset creation costs time now but reclaims it later." },
    "time-freedom":         { a: -1, b: 1,  rationale: "Short-term: one-time work is faster. Long-term: asset creation wins." },
    "business-asset-growth":{ a: 2,  b: 0,  rationale: "Creating an asset is the definition of business asset growth." },
    "executive-capability": { a: 1,  b: 0,  rationale: "Asset packaging develops executive thinking." },
    "team-readiness":       { a: 1,  b: 0,  rationale: "Assets are easier to replicate and delegate." },
    "financial-health":     { a: -1, b: 1,  rationale: "One-time work is more immediate cash; assets take time to recoup." },
    "whole-life-harmony":   { a: 0,  b: 0,  rationale: "Both depend on context; neither is inherently more harmonious." },
  },
  "increase-prices-vs-volume": {
    "strategic-progress":   { a: 2,  b: 1,  rationale: "Pricing is a strategic positioning lever; volume is an operational one." },
    "revenue-growth":       { a: 1,  b: 2,  rationale: "More volume can grow revenue faster initially; higher prices grow margin." },
    "founder-capacity":     { a: 2,  b: -1, rationale: "Fewer, higher-value clients demands less of the founder." },
    "time-freedom":         { a: 2,  b: -1, rationale: "Premium positioning enables fewer clients = more time." },
    "business-asset-growth":{ a: 1,  b: 0,  rationale: "Premium positioning requires stronger offer assets." },
    "executive-capability": { a: 1,  b: 0,  rationale: "Pricing requires strategic and sales executive skills." },
    "team-readiness":       { a: 0,  b: 1,  rationale: "Higher volume requires more team readiness." },
    "financial-health":     { a: 1,  b: 1,  rationale: "Both paths improve financial health when executed well." },
    "whole-life-harmony":   { a: 1,  b: -1, rationale: "Premium pricing with fewer clients enables better life integration." },
  },
  "expand-team-vs-improve-systems": {
    "strategic-progress":   { a: 1,  b: 1,  rationale: "Both address bottlenecks; nature of bottleneck determines which." },
    "revenue-growth":       { a: 1,  b: 1,  rationale: "Either can unlock revenue capacity depending on the constraint." },
    "founder-capacity":     { a: 1,  b: 2,  rationale: "Systems reduce founder load even without adding headcount." },
    "time-freedom":         { a: 1,  b: 2,  rationale: "Systematized work reclaims time structurally." },
    "business-asset-growth":{ a: 0,  b: 2,  rationale: "Every improved system is a business asset." },
    "executive-capability": { a: 1,  b: 1,  rationale: "Both develop different aspects of executive capability." },
    "team-readiness":       { a: 2,  b: 1,  rationale: "Expanding the team improves raw team readiness; systems improve performance." },
    "financial-health":     { a: -1, b: 1,  rationale: "Headcount costs; system improvements have lower ongoing cost." },
    "whole-life-harmony":   { a: 0,  b: 1,  rationale: "Systems reduce cognitive overhead; headcount can add management burden." },
  },
  "custom": {
    "strategic-progress":   { a: 0, b: 0, rationale: "Evaluate based on your specific situation." },
    "revenue-growth":       { a: 0, b: 0, rationale: "Evaluate based on your specific situation." },
    "founder-capacity":     { a: 0, b: 0, rationale: "Evaluate based on your specific situation." },
    "time-freedom":         { a: 0, b: 0, rationale: "Evaluate based on your specific situation." },
    "business-asset-growth":{ a: 0, b: 0, rationale: "Evaluate based on your specific situation." },
    "executive-capability": { a: 0, b: 0, rationale: "Evaluate based on your specific situation." },
    "team-readiness":       { a: 0, b: 0, rationale: "Evaluate based on your specific situation." },
    "financial-health":     { a: 0, b: 0, rationale: "Evaluate based on your specific situation." },
    "whole-life-harmony":   { a: 0, b: 0, rationale: "Evaluate based on your specific situation." },
  },
}

function buildImpactScores(topicId: string, twin: FounderTwinProfile): ImpactScore[] {
  const heuristics = IMPACT_HEURISTICS[topicId] ?? IMPACT_HEURISTICS["custom"]
  const dimensions: ImpactDimensionId[] = [
    "strategic-progress",
    "revenue-growth",
    "founder-capacity",
    "time-freedom",
    "business-asset-growth",
    "executive-capability",
    "team-readiness",
    "financial-health",
    "whole-life-harmony",
  ]

  return dimensions.map((dim) => {
    const h = heuristics[dim]
    let scoreA = h.a
    let scoreB = h.b

    // Personalize based on twin profile
    if (twin.inLifeProtectionMode) {
      if (dim === "whole-life-harmony") { scoreA = Math.min(2, scoreA + 1); scoreB = Math.min(2, scoreB + 1) }
      if (dim === "founder-capacity")  { scoreA = Math.min(2, scoreA + 1); scoreB = Math.min(2, scoreB + 1) }
    }
    if (twin.hasMomentum && dim === "strategic-progress") {
      scoreA = Math.min(2, scoreA + 1)
    }
    if (twin.skipRate90d > 40 && dim === "founder-capacity") {
      scoreA = Math.max(-2, scoreA - 1)
      scoreB = Math.max(-2, scoreB - 1)
    }

    return {
      dimensionId: dim,
      label: DIMENSION_LABELS[dim],
      scoreA,
      scoreB,
      rationale: h.rationale,
    }
  })
}

/* ===========================================================================
 * Executive perspectives
 * ======================================================================== */

type ExecAnalysisMap = Record<
  string, // topicId
  Record<
    string, // executiveId
    {
      analysisA: string
      analysisB: string
      recommendation: "option-a" | "option-b" | "context-dependent"
      rationale: string
      considerations: string[]
    }
  >
>

// Abbreviated executive perspectives — one per relevant executive for each scenario
const EXEC_ANALYSIS: ExecAnalysisMap = {
  "hire-now-vs-later": {
    "strategy":        { analysisA: "Hiring now can accelerate strategic momentum if the hire is scoped to a specific bottleneck.", analysisB: "Waiting protects strategic focus during a stabilization phase.", recommendation: "context-dependent", rationale: "The right answer depends on whether the bottleneck is execution capacity or system readiness.", considerations: ["What specific work would the hire own?", "Is there a documented process to hand off?", "Does runway support 6 months of payroll?"] },
    "operations":      { analysisA: "Hiring without SOPs creates a training and quality-control burden.", analysisB: "Documenting processes first makes the hire significantly more effective.", recommendation: "option-b", rationale: "Systems before headcount reduces onboarding risk.", considerations: ["Document the role before hiring for it.", "Build a 30-day onboarding protocol.", "Define success metrics before the first day."] },
    "finance":         { analysisA: "Evaluate whether the hire generates more revenue than it costs within 90 days.", analysisB: "Maintaining a lower burn rate increases strategic options.", recommendation: "option-b", rationale: "Financial health should support the hire before it is made.", considerations: ["What is the fully-loaded cost of this hire?", "What revenue does it unlock?", "What is the break-even timeline?"] },
    "human-sustainability": { analysisA: "Offloading work now directly protects your capacity and sustainability.", analysisB: "Overloading the founder while waiting is the real risk to evaluate.", recommendation: "option-a", rationale: "Founder capacity is the primary constraint in most solo-led businesses.", considerations: ["What is the cost of NOT hiring to the founder?", "Is the founder at or near capacity ceiling?", "How does this affect CEO Workday™?"] },
    "marketing-brand": { analysisA: "A marketing or delivery hire can accelerate brand growth.", analysisB: "Premature hiring of marketing support without a clear message wastes budget.", recommendation: "context-dependent", rationale: "Depends on whether brand positioning is stable enough to hand off.", considerations: ["Is the brand message documented and consistent?", "Can the hire work from existing assets?", "What is the risk of diluting the brand voice?"] },
    "sales":           { analysisA: "If the hire relieves fulfillment, it frees the founder for more sales conversations.", analysisB: "Until a repeatable sales system exists, adding headcount can mask the real constraint.", recommendation: "option-b", rationale: "Sales bottlenecks are often process problems, not capacity problems.", considerations: ["Is the sales system documented?", "Can this work be systematized before being hired for?", "What is the current conversion rate?"] },
    "innovation":      { analysisA: "Bringing in outside capability now can unlock faster innovation cycles.", analysisB: "Waiting until the core model is stable is often the smarter sequencing.", recommendation: "option-b", rationale: "Innovation hires are most effective when the foundation is stable.", considerations: ["Is the current model generating stable returns?", "What specific innovation would this hire enable?", "Is there a clear brief for this role?"] },
  },
  "launch-now-vs-wait": {
    "strategy":        { analysisA: "Launching now tests assumptions faster and generates real market feedback.", analysisB: "Waiting until the foundation is stronger can result in a significantly better launch.", recommendation: "context-dependent", rationale: "Depends on how much preparation would materially change the outcome.", considerations: ["What is the cost of a low-conversion launch?", "What specifically would change if you waited?", "Is the audience warm enough?"] },
    "marketing-brand": { analysisA: "Early launches build audience relationship and brand learning.", analysisB: "A well-prepared launch with a warmer audience consistently outperforms a rushed one.", recommendation: "option-b", rationale: "Audience warmth and offer clarity are the top predictors of launch success.", considerations: ["How warm is the current audience?", "Is the offer messaging tested and clear?", "What does a 90-day preparation window accomplish?"] },
    "sales":           { analysisA: "The fastest path to revenue data is a live offer.", analysisB: "Premature launch can create a false negative about a potentially strong offer.", recommendation: "option-a", rationale: "Revenue feedback is more valuable than internal preparation time in most cases.", considerations: ["Is the offer positioned to convert?", "What is the minimum viable launch?", "How do you handle objections before they arise?"] },
    "operations":      { analysisA: "Launching now stresses the fulfillment system — revealing gaps quickly.", analysisB: "Fulfillment systems should be ready before demand arrives.", recommendation: "option-b", rationale: "An overwhelmed fulfillment system damages brand reputation more than a delayed launch.", considerations: ["Can the current system handle 3x clients?", "Are delivery SOPs documented?", "Is there a clear client onboarding process?"] },
    "finance":         { analysisA: "Earlier launch = earlier cash flow.", analysisB: "A failed launch can cost more than a delayed one.", recommendation: "context-dependent", rationale: "Depends on runway and the financial profile of the offer.", considerations: ["What is the cost of launching vs. not launching?", "What does cash flow look like over the next 90 days?", "Is the price point validated?"] },
    "human-sustainability": { analysisA: "Launches are high-intensity — timing them well is a sustainability decision.", analysisB: "Launching from a restored, prepared state produces more sustainable results.", recommendation: "option-b", rationale: "Launch energy must be planned for, not improvised.", considerations: ["Is the founder at full capacity for a launch window?", "Are life events accounted for in the launch timeline?", "What recovery time is built in?"] },
    "innovation":      { analysisA: "Market exposure now generates learning that improves future iterations.", analysisB: "One additional iteration cycle before launch can materially differentiate the offer.", recommendation: "context-dependent", rationale: "The value of one more iteration depends on how differentiated the current version is.", considerations: ["What is the one change that would most improve the offer?", "Is waiting adding innovation value or just delay?", "What would version 1.1 of this offer look like?"] },
  },
  "protect-ceo-workday-vs-add-meetings": {
    "strategy":        { analysisA: "CEO Workday™ is the primary environment where strategic work gets done.", analysisB: "Some relationships and opportunities only develop through meeting-based interaction.", recommendation: "option-a", rationale: "Unprotected time is the primary strategy execution risk.", considerations: ["What strategic work is blocked by the current schedule?", "Which meetings have the highest strategic ROI?", "Can strategic tasks be batched instead?"] },
    "operations":      { analysisA: "Protected operating time enables better workflow and decision quality.", analysisB: "Some meeting-based coordination reduces downstream operational friction.", recommendation: "option-a", rationale: "Systems are built in blocks of focused time, not fragments.", considerations: ["What operational work needs deep focus blocks?", "Can meeting agendas be tightened to reduce time?", "Are async alternatives available?"] },
    "human-sustainability": { analysisA: "CEO Workday™ protection is a direct human sustainability lever.", analysisB: "Meeting-heavy quarters without recovery planning lead to burnout.", recommendation: "option-a", rationale: "Protecting operating time is protecting the founder.", considerations: ["What is the founder's current energy level?", "Is the meeting load sustainable over 90 days?", "When is recovery time built in?"] },
    "sales":           { analysisA: "Deep work enables sales asset creation.", analysisB: "Some meeting-based conversations directly drive revenue.", recommendation: "context-dependent", rationale: "Depends on whether meetings are with clients/prospects or internal.", considerations: ["Are these meetings client-facing or internal?", "What is the revenue value of each meeting?", "Can relationship maintenance be batched?"] },
    "marketing-brand": { analysisA: "Long-form content, strategic positioning, and brand work require protected time.", analysisB: "Some visibility opportunities only come through real-time meetings.", recommendation: "option-a", rationale: "Brand assets that compound are built in focused blocks.", considerations: ["What brand work is waiting for a focused block?", "Which visibility opportunities genuinely require meetings?", "Can speaking engagements be batched?"] },
    "finance":         { analysisA: "CEO Workday™ time is the highest-ROI time block in the business.", analysisB: "Specific meetings (investor, partner, client) may have direct financial return.", recommendation: "context-dependent", rationale: "Meeting ROI varies significantly depending on meeting type.", considerations: ["What is the dollar value of the CEO Workday™ work being displaced?", "What is the revenue or financial potential of each meeting?", "Is the meeting replacing or supplementing strategic work?"] },
    "innovation":      { analysisA: "Innovation requires the focused thinking that only CEO Workday™ enables.", analysisB: "Cross-functional meetings can spark innovations that solo thinking misses.", recommendation: "option-a", rationale: "Innovation compounds in protected time.", considerations: ["What innovation project needs a focused block?", "Which collaborations are worth a meeting investment?", "Can innovation sessions be structured and batched?"] },
  },
}

// Generic perspective factory for topics not in the detailed map
function genericPerspective(
  executiveId: string,
  executiveName: string,
  executiveTitle: string,
  department: string,
  optionALabel: string,
  optionBLabel: string,
): ExecutivePerspective {
  return {
    executiveId,
    executiveName,
    executiveTitle,
    department,
    analysisA: `From a ${department} perspective, ${optionALabel} offers immediate execution opportunity and tests assumptions in real market conditions.`,
    analysisB: `${optionBLabel} allows for additional preparation and risk mitigation before full commitment.`,
    recommendation: "context-dependent",
    recommendationRationale: `The optimal choice depends on your current ${department.toLowerCase()} capacity and which constraint is most limiting your progress.`,
    keyConsiderations: [
      `What is your current ${department.toLowerCase()} capacity?`,
      "Which option aligns best with your 90-day priorities?",
      "What does your operating history suggest about your readiness?",
    ],
  }
}

const EXEC_ROSTER = [
  { id: "strategy",          name: "Strategy Executive™",           title: "Chief Strategy Officer (CSO)",         dept: "Strategy & Vision" },
  { id: "marketing-brand",   name: "Marketing & Brand Executive™",  title: "Chief Marketing Officer (CMO)",        dept: "Marketing & Brand" },
  { id: "sales",             name: "Sales Executive™",              title: "Chief Revenue Officer (CRO)",          dept: "Revenue & Sales" },
  { id: "operations",        name: "Operations Executive™",         title: "Chief Operating Officer (COO)",        dept: "Operations & Systems" },
  { id: "finance",           name: "Finance Executive™",            title: "Chief Financial Officer (CFO)",        dept: "Finance & Wealth" },
  { id: "human-sustainability", name: "Human Sustainability Executive™", title: "Chief People Officer (CPO)", dept: "Human Sustainability" },
  { id: "innovation",        name: "Innovation Executive™",         title: "Chief Innovation Officer (CINO)",      dept: "Innovation & Growth" },
]

function buildExecutivePerspectives(
  scenario: Scenario,
  _twin: FounderTwinProfile,
): ExecutivePerspective[] {
  const topicMap = EXEC_ANALYSIS[scenario.topicId]

  return EXEC_ROSTER.map((exec) => {
    if (topicMap?.[exec.id]) {
      const e = topicMap[exec.id]
      return {
        executiveId: exec.id,
        executiveName: exec.name,
        executiveTitle: exec.title,
        department: exec.dept,
        analysisA: e.analysisA,
        analysisB: e.analysisB,
        recommendation: e.recommendation,
        recommendationRationale: e.rationale,
        keyConsiderations: e.considerations,
      }
    }
    return genericPerspective(exec.id, exec.name, exec.title, exec.dept, scenario.optionA.label, scenario.optionB.label)
  })
}

/* ===========================================================================
 * Advantages, risks, tradeoffs
 * ======================================================================== */

function deriveAdvantagesRisks(
  scores: ImpactScore[],
  option: "A" | "B",
): { advantages: string[]; risks: string[] } {
  const key = option === "A" ? "scoreA" : "scoreB"
  const advantages = scores
    .filter((s) => s[key] > 0)
    .sort((a, b) => b[key] - a[key])
    .slice(0, 3)
    .map((s) => `${s.label}: ${s.rationale}`)

  const risks = scores
    .filter((s) => s[key] < 0)
    .sort((a, b) => a[key] - b[key])
    .slice(0, 2)
    .map((s) => `${s.label}: ${s.rationale}`)

  return { advantages, risks }
}

function deriveTradeoffs(scenario: Scenario, scores: ImpactScore[]): string[] {
  const tradeoffs: string[] = []
  for (const s of scores) {
    const diff = Math.abs(s.scoreA - s.scoreB)
    if (diff >= 2) {
      const leader = s.scoreA > s.scoreB ? scenario.optionA.label : scenario.optionB.label
      const lagger = s.scoreA > s.scoreB ? scenario.optionB.label : scenario.optionA.label
      tradeoffs.push(`${s.label}: ${leader} significantly outperforms ${lagger}. ${s.rationale}`)
    }
  }
  return tradeoffs.slice(0, 3)
}

/* ===========================================================================
 * Asset opportunities
 * ======================================================================== */

function deriveAssetOpportunities(topicId: string): AssetOpportunity[] {
  const map: Record<string, AssetOpportunity[]> = {
    "delegate-vs-retain":           [{ assetName: "Delegation SOP", relevantOption: "option-a", description: "Documenting this role creates a reusable onboarding asset." }],
    "create-asset-vs-one-time-work":[ { assetName: "Packaged Deliverable", relevantOption: "option-a", description: "Packaging this work unlocks recurring revenue and passive delivery." }],
    "build-new-offer-vs-improve-existing": [{ assetName: "Offer Framework™", relevantOption: "both", description: "Both paths generate offer documentation that becomes a business asset." }],
    "expand-team-vs-improve-systems": [{ assetName: "Process Documentation", relevantOption: "option-b", description: "System improvements produce documented SOPs that scale beyond any one person." }],
    "invest-in-ai-vs-manual":       [{ assetName: "AI Workflow System", relevantOption: "option-a", description: "A documented AI workflow becomes a repeatable business acceleration asset." }],
    "protect-ceo-workday-vs-add-meetings": [{ assetName: "CEO Operating Rules™", relevantOption: "option-a", description: "A written CEO Workday™ policy is a business asset that protects future capacity." }],
    "launch-now-vs-wait":           [{ assetName: "Launch Playbook", relevantOption: "option-b", description: "A prepared launch includes documentation that makes future launches faster." }],
  }
  return map[topicId] ?? []
}

/* ===========================================================================
 * Confidence & evidence
 * ======================================================================== */

function buildConfidence(twin: FounderTwinProfile, _agg: HarmonyContextAggregate): ScenarioConfidence {
  const evidence: ScenarioEvidence[] = []

  if (twin.confirmedPatterns.length > 0) {
    evidence.push({ type: "historical-pattern", description: `${twin.confirmedPatterns.length} confirmed operating patterns from your GPS history.`, relevance: "primary" })
  }
  if (twin.completionRate90d > 0) {
    evidence.push({ type: "historical-pattern", description: `${twin.completionRate90d}% 90-day completion rate from recommendation history.`, relevance: "supporting" })
  }
  if (twin.masteredTopics.length > 0) {
    evidence.push({ type: "capability", description: `${twin.masteredTopics.length} mastered executive capability topics.`, relevance: "supporting" })
  }
  if (twin.businessStage) {
    evidence.push({ type: "business-context", description: `Business stage: ${twin.businessStage}.`, relevance: "supporting" })
  }
  if (twin.revenueStage) {
    evidence.push({ type: "business-context", description: `Revenue stage: ${twin.revenueStage}.`, relevance: "contextual" })
  }

  const overallConfidence = Math.min(90, Math.round(twin.dataCompleteness * 0.7 + evidence.length * 5))

  const evidenceStrength: ScenarioConfidence["evidenceStrength"] =
    overallConfidence >= 70 ? "strong" :
    overallConfidence >= 50 ? "moderate" :
    overallConfidence >= 30 ? "limited" : "insufficient"

  return {
    overallConfidence,
    evidenceStrength,
    supportingEvidence: evidence,
    keyAssumptions: [
      "Your operating context has not materially changed since your last activity.",
      "Your stated business stage accurately reflects your current operating reality.",
      "The patterns in your history will continue into the near term.",
    ],
    unknownVariables: [
      "Market conditions not captured in your operating context.",
      "Relationship dynamics between yourself and potential team members.",
      "Timing of external opportunities or disruptions.",
    ],
    transparencyNote:
      "These are informed projections based on your operating history and the intelligence patterns Harmony Lane has observed. They are not guarantees. Use them as one input among several, alongside your own judgment and trusted advisors.",
  }
}

/* ===========================================================================
 * Executive summary (Cherry Blossom tone)
 * ======================================================================== */

function buildExecutiveSummary(
  scenario: Scenario,
  scores: ImpactScore[],
  twin: FounderTwinProfile,
): string {
  const aTotal = scores.reduce((s, d) => s + d.scoreA, 0)
  const bTotal = scores.reduce((s, d) => s + d.scoreB, 0)
  const leader = aTotal >= bTotal ? scenario.optionA.label : scenario.optionB.label
  const context = twin.inLifeProtectionMode
    ? "You are currently in Life Protection Mode™, which means whole-life harmony and founder capacity carry additional weight in this analysis."
    : twin.hasMomentum
    ? "Your operating history shows active momentum, which is a favorable signal for execution-intensive decisions."
    : "Your operating history provides a useful baseline for projecting likely outcomes."

  return `Based on your operating history and current business context, ${leader} shows a stronger projected impact across the nine dimensions evaluated — though the right answer ultimately depends on variables only you can assess in real time. ${context} This analysis reflects your Digital Twin™ snapshot at the time of generation; re-evaluate if your context changes materially. The confidence and evidence panel below details exactly what is known and what remains uncertain.`
}

/* ===========================================================================
 * Main analyzer
 * ======================================================================== */

export function analyzeScenario(
  scenario: Scenario,
  twin: FounderTwinProfile,
  agg: HarmonyContextAggregate,
): ScenarioAnalysis {
  const scores = buildImpactScores(scenario.topicId, twin)
  const perspectives = buildExecutivePerspectives(scenario, twin)
  const { advantages: advantagesA, risks: risksA } = deriveAdvantagesRisks(scores, "A")
  const { advantages: advantagesB, risks: risksB } = deriveAdvantagesRisks(scores, "B")
  const tradeoffs = deriveTradeoffs(scenario, scores)
  const assetOpportunities = deriveAssetOpportunities(scenario.topicId)
  const confidence = buildConfidence(twin, agg)
  const executiveSummary = buildExecutiveSummary(scenario, scores, twin)

  const capacityScores = scores.filter((s) => s.dimensionId === "founder-capacity" || s.dimensionId === "time-freedom")
  const capacityImpactA = capacityScores.reduce((s, d) => s + d.scoreA, 0) >= 0
    ? `${scenario.optionA.label} is projected to maintain or improve your capacity.`
    : `${scenario.optionA.label} will likely reduce your available capacity in the short term.`
  const capacityImpactB = capacityScores.reduce((s, d) => s + d.scoreB, 0) >= 0
    ? `${scenario.optionB.label} is projected to maintain or improve your capacity.`
    : `${scenario.optionB.label} will likely reduce your available capacity in the short term.`

  const lifeScore = scores.find((s) => s.dimensionId === "whole-life-harmony")
  const wholeLifeImplicationsA = lifeScore
    ? lifeScore.scoreA > 0
      ? `${scenario.optionA.label} is projected to support your whole-life harmony.`
      : lifeScore.scoreA < 0
      ? `${scenario.optionA.label} may create temporary tension with your life context.`
      : `${scenario.optionA.label} has a neutral projected impact on whole-life harmony.`
    : "Whole-life impact is context-dependent."
  const wholeLifeImplicationsB = lifeScore
    ? lifeScore.scoreB > 0
      ? `${scenario.optionB.label} is projected to support your whole-life harmony.`
      : lifeScore.scoreB < 0
      ? `${scenario.optionB.label} may create temporary tension with your life context.`
      : `${scenario.optionB.label} has a neutral projected impact on whole-life harmony.`
    : "Whole-life impact is context-dependent."

  const execCapScore = scores.find((s) => s.dimensionId === "executive-capability")
  const capabilityImpactA = execCapScore
    ? execCapScore.scoreA > 0
      ? `${scenario.optionA.label} is projected to develop your executive capabilities.`
      : "Capability impact is neutral for this option."
    : "Capability impact is context-dependent."
  const capabilityImpactB = execCapScore
    ? execCapScore.scoreB > 0
      ? `${scenario.optionB.label} is projected to develop your executive capabilities.`
      : "Capability impact is neutral for this option."
    : "Capability impact is context-dependent."

  const horizonMap: Record<string, [string, string]> = {
    "hire-now-vs-later":    ["2–4 weeks to onboard", "6–10 weeks preparation then hire"],
    "launch-now-vs-wait":   ["2–4 week launch window", "8–12 week preparation + launch"],
    "delegate-vs-retain":   ["1–2 weeks to document and hand off", "Revisit in next quarterly plan"],
    "invest-in-ai-vs-manual": ["4–6 weeks to adopt and integrate", "2–3 weeks to document manual system"],
    "protect-ceo-workday-vs-add-meetings": ["Effective immediately", "4–8 week temporary adjustment"],
    "create-asset-vs-one-time-work": ["4–8 additional hours to package", "Immediate delivery"],
    "increase-prices-vs-volume": ["Effective next client or renewal", "Next 30–60 day marketing push"],
    "expand-team-vs-improve-systems": ["6–8 weeks to hire and onboard", "4–6 weeks of system work"],
    "build-new-offer-vs-improve-existing": ["8–16 weeks to build and launch", "2–4 weeks to iterate"],
    "launch-now-vs-wait":   ["2–4 weeks", "8–12 weeks"],
    "custom":               ["Context-dependent", "Context-dependent"],
  }
  const [horizonA, horizonB] = horizonMap[scenario.topicId] ?? ["Context-dependent", "Context-dependent"]

  return {
    scenarioId: scenario.id,
    generatedAt: new Date().toISOString(),
    twinProfile: twin,
    executivePerspectives: perspectives,
    impactScores: scores,
    advantagesA,
    advantagesB,
    risksA,
    risksB,
    tradeoffs,
    assetOpportunities,
    wholeLifeImplicationsA,
    wholeLifeImplicationsB,
    capabilityImpactA,
    capabilityImpactB,
    estimatedTimeHorizonA: horizonA,
    estimatedTimeHorizonB: horizonB,
    confidence,
    executiveSummary,
  }
}
