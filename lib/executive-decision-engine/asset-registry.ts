/**
 * Business Asset Outcome Registry™ — Compounding Business Assets™ (Phase 6.2)
 * ---------------------------------------------------------------------------
 * The canonical registry connecting Operating Practice™ → Executive Assignment™
 * → Business Asset™ → Future ROI Tracking.
 *
 * Architecture rules:
 *   - Every Executive Assignment™ MUST produce at least one Business Asset™.
 *     An assignment that produces no asset is a task, not an investment.
 *   - Assets are listed once here and referenced by id everywhere else.
 *   - The `compoundingMechanism` field is the key — it explains HOW this
 *     asset pays back, not just WHAT it is. Cherry Blossom™ uses this.
 *   - `practiceAssetMappings` is the graph connecting Operating Practices™
 *     (from esa-registry.ts) to the assets they produce.
 *
 * Import pattern:
 *   import { BUSINESS_ASSET_REGISTRY, getAssetById } from
 *     "@/lib/executive-decision-engine/asset-registry"
 */

import type { BusinessAsset, PracticeAssetMapping } from "./types"

/* ===========================================================================
 * Business Asset Outcome Registry™
 * ======================================================================== */

export const BUSINESS_ASSET_REGISTRY: readonly BusinessAsset[] = [
  {
    id: "signature-talk",
    name: "Signature Talk™",
    description:
      "A refined, repeatable presentation that positions the founder as the leading authority in their space and converts audiences into clients.",
    compoundingMechanism:
      "Each delivery multiplies reach without additional creation effort. One talk can become a webinar, a book, a course, a podcast episode, and a sales presentation.",
    primaryPillars: ["strategic-foundation", "revenue-engine", "growth-innovation"],
    buildClass: "keep",
    roiHorizon: "90-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["launch", "growth"],
    status: "architecture",
  },
  {
    id: "evergreen-webinar",
    name: "Evergreen Webinar™",
    description:
      "A pre-recorded, always-on webinar that generates qualified leads and converts prospects into clients without the founder's live presence.",
    compoundingMechanism:
      "Runs 24/7 without founder time investment after the initial build. Each registration compounds the email list. Each conversion compounds revenue.",
    primaryPillars: ["revenue-engine", "operations-systems", "growth-innovation"],
    buildClass: "automate",
    roiHorizon: "90-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["growth", "scale"],
    status: "architecture",
  },
  {
    id: "standard-operating-procedure",
    name: "Standard Operating Procedure™ (SOP)",
    description:
      "A documented process that captures exactly how a repeating business activity should be performed — enabling delegation, training, and automation.",
    compoundingMechanism:
      "Each SOP makes delegation faster and cheaper. A business with complete SOPs can onboard team members in hours instead of months and be sold at a premium valuation.",
    primaryPillars: ["operations-systems", "people-leadership"],
    buildClass: "delegate",
    roiHorizon: "30-days",
    primaryOutcome: "reduce-execution-friction",
    primaryStages: ["growth", "scale", "legacy"],
    status: "architecture",
  },
  {
    id: "referral-engine",
    name: "Referral Engine™",
    description:
      "A systemized process for generating consistent client referrals through structured relationships, incentives, and touchpoints.",
    compoundingMechanism:
      "Each new client who enters the referral system becomes a potential source of future clients. The system's output grows with every satisfied client added.",
    primaryPillars: ["revenue-engine", "client-excellence"],
    buildClass: "automate",
    roiHorizon: "90-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["growth", "scale"],
    status: "architecture",
  },
  {
    id: "hiring-process",
    name: "Hiring Process™",
    description:
      "A structured, repeatable system for identifying, evaluating, and onboarding the right team members consistently.",
    compoundingMechanism:
      "Each great hire compounds exponentially — they execute, train others, and free the founder for higher-leverage work. A bad hire compounds in the opposite direction.",
    primaryPillars: ["people-leadership", "operations-systems"],
    buildClass: "delegate",
    roiHorizon: "6-months",
    primaryOutcome: "reduce-execution-friction",
    primaryStages: ["growth", "scale"],
    status: "architecture",
  },
  {
    id: "marketing-funnel",
    name: "Marketing Funnel™",
    description:
      "A structured path that moves ideal prospects from awareness to purchase — operating continuously without the founder's direct involvement at each step.",
    compoundingMechanism:
      "Each optimization of the funnel improves the conversion rate for every future prospect permanently. A 1% conversion improvement on 10,000 visitors per month means 100 additional prospects every month, forever.",
    primaryPillars: ["revenue-engine", "growth-innovation"],
    buildClass: "automate",
    roiHorizon: "90-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["growth", "scale"],
    status: "architecture",
  },
  {
    id: "ai-workflow",
    name: "AI Workflow™",
    description:
      "An AI-powered automation that eliminates recurring, rule-based tasks from the founder's or team's workload.",
    compoundingMechanism:
      "Each AI Workflow™ reduces the recurring time cost of a task to near zero. Five AI workflows built over six months can reclaim 10+ hours per week permanently.",
    primaryPillars: ["operations-systems", "growth-innovation"],
    buildClass: "automate",
    roiHorizon: "30-days",
    primaryOutcome: "reduce-execution-friction",
    primaryStages: ["launch", "growth", "scale"],
    status: "architecture",
  },
  {
    id: "decision-framework",
    name: "Decision Framework™",
    description:
      "A documented set of criteria and principles that allows the founder or their team to make consistent, high-quality decisions without escalating every choice.",
    compoundingMechanism:
      "Reduces decision fatigue, enables delegation of judgment (not just tasks), and ensures the business maintains its standards as it scales.",
    primaryPillars: ["strategic-foundation", "operations-systems", "people-leadership"],
    buildClass: "keep",
    roiHorizon: "30-days",
    primaryOutcome: "reduce-execution-friction",
    primaryStages: ["growth", "scale", "legacy"],
    status: "architecture",
  },
  {
    id: "client-onboarding-system",
    name: "Client Onboarding System™",
    description:
      "A structured, repeatable process for welcoming new clients in a way that sets expectations, builds trust, and reduces early churn.",
    compoundingMechanism:
      "Each percentage point improvement in retention is worth more than the equivalent in new client acquisition. A great onboarding system compounds through reduced churn and increased referrals.",
    primaryPillars: ["client-excellence", "operations-systems"],
    buildClass: "automate",
    roiHorizon: "30-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["launch", "growth", "scale"],
    status: "architecture",
  },
  {
    id: "partnership-system",
    name: "Partnership System™",
    description:
      "A structured approach to identifying, nurturing, and activating strategic partnerships that generate referrals, co-promotions, and shared opportunities.",
    compoundingMechanism:
      "Each active partnership is a channel that generates leads and opportunities without advertising spend. The system grows as partners refer each other's network.",
    primaryPillars: ["revenue-engine", "growth-innovation"],
    buildClass: "keep",
    roiHorizon: "6-months",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["growth", "scale"],
    status: "architecture",
  },
  {
    id: "email-nurture-sequence",
    name: "Email Nurture Sequence™",
    description:
      "A series of automated, value-driven emails that build trust with prospects over time and move them toward a purchasing decision.",
    compoundingMechanism:
      "Each email added to the sequence improves the conversion rate for every future subscriber. The sequence works 24/7 without ongoing effort.",
    primaryPillars: ["revenue-engine", "growth-innovation"],
    buildClass: "automate",
    roiHorizon: "30-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["launch", "growth"],
    status: "architecture",
  },
  {
    id: "content-library",
    name: "Content Library™",
    description:
      "A curated, organized collection of reusable content assets — frameworks, templates, scripts, and media — that accelerates future content creation.",
    compoundingMechanism:
      "Each piece of content added to the library reduces the time to create the next piece. A mature content library allows the founder to produce in hours what once took days.",
    primaryPillars: ["growth-innovation", "strategic-foundation"],
    buildClass: "delegate",
    roiHorizon: "90-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["growth", "scale"],
    status: "architecture",
  },
  {
    id: "offer-suite",
    name: "Offer Suite™",
    description:
      "A portfolio of complementary products and services at different price points, designed to serve clients at every stage of their journey with the founder's business.",
    compoundingMechanism:
      "Each additional offer increases the lifetime value of every existing client. An offer suite makes it possible to serve one client at $100, $1,000, and $10,000 — often all three.",
    primaryPillars: ["revenue-engine", "strategic-foundation"],
    buildClass: "keep",
    roiHorizon: "90-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["launch", "growth"],
    status: "architecture",
  },
  {
    id: "pricing-framework",
    name: "Pricing Framework™",
    description:
      "A principled, documented approach to pricing that communicates value, serves the right clients, and ensures the business is sustainably profitable.",
    compoundingMechanism:
      "A pricing framework prevents discounting, ensures consistency across the team, and allows confident price increases as the business grows its authority.",
    primaryPillars: ["revenue-engine", "financial-intelligence"],
    buildClass: "keep",
    roiHorizon: "immediate",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["launch", "growth", "scale"],
    status: "architecture",
  },
  {
    id: "team-operating-handbook",
    name: "Team Operating Handbook™",
    description:
      "A living document that captures the business's values, operating principles, standards, and expectations — enabling the team to operate consistently without the founder's constant presence.",
    compoundingMechanism:
      "Each section added to the handbook reduces the founder's involvement in day-to-day decisions. A mature handbook is what makes a business saleable.",
    primaryPillars: ["people-leadership", "operations-systems", "strategic-foundation"],
    buildClass: "delegate",
    roiHorizon: "6-months",
    primaryOutcome: "reduce-execution-friction",
    primaryStages: ["growth", "scale", "legacy"],
    status: "architecture",
  },
  {
    id: "financial-dashboard",
    name: "Financial Dashboard™",
    description:
      "A real-time view of the business's key financial metrics — revenue, expenses, cash flow, and profitability — that enables confident, data-driven decisions.",
    compoundingMechanism:
      "A financial dashboard reduces the time to make financial decisions from hours to minutes. Founders who see their numbers clearly make better decisions faster.",
    primaryPillars: ["financial-intelligence"],
    buildClass: "automate",
    roiHorizon: "immediate",
    primaryOutcome: "reduce-execution-friction",
    primaryStages: ["launch", "growth", "scale", "legacy"],
    status: "architecture",
  },
  {
    id: "strategic-plan",
    name: "Strategic Plan™",
    description:
      "A documented 90-day or annual strategic direction — with clear objectives, success metrics, and resource allocations — that aligns the founder and team toward the same destination.",
    compoundingMechanism:
      "A written strategic plan improves execution by 30–40% compared to an unwritten one. It also allows the team to make aligned decisions without founder involvement.",
    primaryPillars: ["strategic-foundation"],
    buildClass: "keep",
    roiHorizon: "90-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["growth", "scale", "legacy"],
    status: "architecture",
    relatedDeliverableIds: ["strategic-plan"],
  },
  {
    id: "brand-positioning-statement",
    name: "Brand Positioning Statement™",
    description:
      "A precise, differentiated description of who the business serves, what it delivers, and why it is the best choice — forming the foundation of all marketing and communication.",
    compoundingMechanism:
      "Every piece of content, proposal, and conversation built on a strong positioning statement is more effective. Positioning compounds through authority and referrals.",
    primaryPillars: ["strategic-foundation", "revenue-engine"],
    buildClass: "keep",
    roiHorizon: "90-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["launch", "growth"],
    status: "architecture",
  },
  {
    id: "sales-playbook",
    name: "Sales Playbook™",
    description:
      "A documented, repeatable sales process — from first contact to signed contract — that the founder or a team member can follow consistently.",
    compoundingMechanism:
      "A sales playbook makes revenue predictable and delegable. Each iteration improves the conversion rate for every future sales conversation.",
    primaryPillars: ["revenue-engine", "operations-systems"],
    buildClass: "delegate",
    roiHorizon: "30-days",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["launch", "growth", "scale"],
    status: "architecture",
  },
  {
    id: "authority-platform",
    name: "Authority Platform™",
    description:
      "A combination of owned media, community, and intellectual property that establishes the founder as the trusted authority in their space — independent of any single platform or algorithm.",
    compoundingMechanism:
      "Authority compounds exponentially. Each piece of published expertise makes the next piece more valuable. An authority platform eventually attracts inbound opportunities that require no outreach.",
    primaryPillars: ["growth-innovation", "strategic-foundation"],
    buildClass: "keep",
    roiHorizon: "12-months-plus",
    primaryOutcome: "build-compounding-assets",
    primaryStages: ["growth", "scale", "legacy"],
    status: "architecture",
  },
] as const

/* ===========================================================================
 * Practice → Asset Mapping
 * ---------------------------------------------------------------------------
 * A representative subset of the Operating Practice™ → Business Asset™ graph.
 * The full graph is completed when Executive Assignment™ templates are built
 * in a future phase. This establishes the connection pattern.
 * ======================================================================== */

export const PRACTICE_ASSET_MAPPINGS: readonly PracticeAssetMapping[] = [
  // Strategic Foundation™ pillar
  { practiceId: "vision-clarity", producedAsset: "strategic-plan", connectionStrength: "direct", status: "architecture" },
  { practiceId: "offer-positioning", producedAsset: "brand-positioning-statement", connectionStrength: "direct", status: "architecture" },
  { practiceId: "offer-positioning", producedAsset: "offer-suite", connectionStrength: "contributing", status: "architecture" },
  // Revenue Engine™ pillar
  { practiceId: "sales-process", producedAsset: "sales-playbook", connectionStrength: "direct", status: "architecture" },
  { practiceId: "referral-system", producedAsset: "referral-engine", connectionStrength: "direct", status: "architecture" },
  { practiceId: "pipeline-management", producedAsset: "marketing-funnel", connectionStrength: "contributing", status: "architecture" },
  { practiceId: "pricing-strategy", producedAsset: "pricing-framework", connectionStrength: "direct", status: "architecture" },
  // Operations & Systems™ pillar
  { practiceId: "process-documentation", producedAsset: "standard-operating-procedure", connectionStrength: "direct", status: "architecture" },
  { practiceId: "ai-leverage", producedAsset: "ai-workflow", connectionStrength: "direct", status: "architecture" },
  { practiceId: "client-delivery", producedAsset: "client-onboarding-system", connectionStrength: "direct", status: "architecture" },
  // People & Leadership™ pillar
  { practiceId: "delegation-mastery", producedAsset: "standard-operating-procedure", connectionStrength: "foundational", status: "architecture" },
  { practiceId: "team-development", producedAsset: "team-operating-handbook", connectionStrength: "direct", status: "architecture" },
  { practiceId: "hiring-excellence", producedAsset: "hiring-process", connectionStrength: "direct", status: "architecture" },
  // Growth & Innovation™ pillar
  { practiceId: "content-authority", producedAsset: "signature-talk", connectionStrength: "direct", status: "architecture" },
  { practiceId: "content-authority", producedAsset: "authority-platform", connectionStrength: "contributing", status: "architecture" },
  { practiceId: "digital-marketing", producedAsset: "evergreen-webinar", connectionStrength: "direct", status: "architecture" },
  { practiceId: "digital-marketing", producedAsset: "email-nurture-sequence", connectionStrength: "direct", status: "architecture" },
  // Financial Intelligence™ pillar
  { practiceId: "financial-visibility", producedAsset: "financial-dashboard", connectionStrength: "direct", status: "architecture" },
] as const

/* ===========================================================================
 * Lookup helpers
 * ======================================================================== */

/** Retrieve a Business Asset™ by its stable id. */
export function getAssetById(
  id: BusinessAsset["id"]
): BusinessAsset | undefined {
  return BUSINESS_ASSET_REGISTRY.find((a) => a.id === id)
}

/** Retrieve all assets that primarily serve a given GPS Outcome™. */
export function getAssetsByOutcome(
  outcome: BusinessAsset["primaryOutcome"]
): readonly BusinessAsset[] {
  return BUSINESS_ASSET_REGISTRY.filter(
    (a) => a.primaryOutcome === outcome && a.status === "architecture"
  )
}

/** Retrieve all assets that are highest-leverage for a given Business Stage™. */
export function getAssetsByStage(
  stage: BusinessAsset["primaryStages"][number]
): readonly BusinessAsset[] {
  return BUSINESS_ASSET_REGISTRY.filter(
    (a) => a.primaryStages.includes(stage) && a.status === "architecture"
  )
}

/** Retrieve the Business Assets™ produced by a given Operating Practice™ id. */
export function getAssetsForPractice(
  practiceId: string
): readonly BusinessAsset[] {
  const assetIds = PRACTICE_ASSET_MAPPINGS
    .filter((m) => m.practiceId === practiceId)
    .map((m) => m.producedAsset)
  return BUSINESS_ASSET_REGISTRY.filter((a) => assetIds.includes(a.id))
}
