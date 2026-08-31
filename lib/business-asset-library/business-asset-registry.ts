/**
 * Business Asset Library™ — Registry (Phase 12.1)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for the Harmony Lane™ Operating System's
 * Business Asset Library™ — the toolbox of concrete, buildable business tools
 * (canvases, blueprints, scorecards, playbooks) that sit alongside the guided
 * founder journey (MEASURE™ → DESIGN™ → OPERATE™). The library is NOT the
 * journey; it is the toolbox founders reach into, either by browsing or
 * because Cherry Blossom™ recommended a specific asset as their next step.
 *
 * ONE canonical asset, adaptive presentation. Every asset is defined exactly
 * once and carries a full explanation + instruction set for each of the five
 * existing Communication Styles™ (lib/business-comprehension). This mirrors
 * the pattern already proven in lib/business-concepts/business-concepts-registry:
 *
 *   Adapt the EXPLANATION, never the PRINCIPLE.
 *   Same framework → different language → different examples → same outcome.
 *
 * This module is intentionally data-only. No PDF generation and no live AI
 * generation happen this phase — see build-modes.ts for how the two guided
 * build paths are represented, and printAvailable/recommendedRenderer below for
 * how a future Render Engine™ pass plugs in without a redesign.
 */

import { ALL_BUSINESS_STAGES, type BusinessStage } from "@/lib/business-stage/business-stage"
import { ALL_COMMUNICATION_STYLES, type CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"
import type { RendererType } from "@/lib/output-architecture/render-engine"
import type { BuildModeId } from "@/lib/business-asset-library/build-modes"

/** The seven browsing categories of the Business Asset Library™, in build order. */
export type BusinessAssetCategory =
  | "Start Here"
  | "Build the Business"
  | "Sell the Business"
  | "Market the Business"
  | "Operate the Business"
  | "Grow the Business"
  | "Build the Team"
  | "Design the Business" // Phase 1 Common Creation Engine: DESIGN category items only. Deliberately excluded
  // from ALL_BUSINESS_ASSET_CATEGORIES below so these entries never surface in Library browse,
  // BUILD's menu, or "Recommended For You" — reachable only via CEO Workday's DESIGN category.
  | "Delegate the Business" // Phase 2 Common Creation Engine: DELEGATE category items only. Deliberately excluded
  // from ALL_BUSINESS_ASSET_CATEGORIES below, same reasoning as "Design the Business" above —
  // reachable only via CEO Workday's DELEGATE category.

export const ALL_BUSINESS_ASSET_CATEGORIES: BusinessAssetCategory[] = [
  "Start Here",
  "Build the Business",
  "Sell the Business",
  "Market the Business",
  "Operate the Business",
  "Grow the Business",
  "Build the Team",
]

/**
 * Common Creation Engine: which registry this entry belongs to conceptually.
 * Omit entirely on existing Business Assets — treated as "business-asset" by
 * default. "operating-rule" was added in Phase 1 (e.g. Meeting Rule™).
 * "delegation-artifact" was added in Phase 2 (e.g. Delegation Brief™) —
 * WHAT is being handed off, never the WHO/WHEN of the handoff itself. The
 * handoff's own state (assignee, briefed, accepted) lives separately on
 * `DelegateExecution` (lib/build-record/types.ts) and is never duplicated
 * here.
 */
export type ArtifactKind = "business-asset" | "operating-rule" | "delegation-artifact"

/** Lifecycle of an asset within the architecture — mirrors Deliverable/Executive status conventions. */
export type BusinessAssetStatus = "architecture"

/** One explanation for a single Communication Style™: a short headline plus the adapted body copy. */
export interface BusinessAssetExplanation {
  headline: string
  body: string
}

export interface BusinessAsset {
  /** Stable identifier — safe for routing, storage, and future AI/render hooks. */
  id: string
  /** Brand name (e.g. "Ideal Client Compass™"). */
  name: string
  category: BusinessAssetCategory
  /** One line for library cards. */
  shortDescription: string
  /** "What is this?" — canonical, style-independent framing used as a fallback. */
  whatIsThis: string
  /** "Why does it matter?" — canonical, style-independent framing used as a fallback. */
  whyItMatters: string
  /** "Who helps me build it?" — one or more executive ids from executive-team/executive-registry. */
  ownerExecutiveIds: string[]
  /** Other BusinessAsset ids a founder should complete first, if any. */
  prerequisites?: string[]
  /** "What Business Stage is it for?" — every asset is available everywhere; this is emphasis, not a gate. */
  recommendedBusinessStages: BusinessStage[]
  /** Always the full set — every asset supports every Communication Style™. */
  supportedCommunicationStyles: CommunicationStyle[]
  /** ONE canonical asset — explanation adapts per style, content is never duplicated per level. */
  explanations: Record<CommunicationStyle, BusinessAssetExplanation>
  /** Ordered guided steps, adapted per style (vocabulary/examples change, the steps' intent does not). */
  instructions: Record<CommunicationStyle, string[]>
  /** A short worked example, adapted per style. */
  examples: Record<CommunicationStyle, string>
  /** Whether a guided digital build (Build With AI / Do It Myself) exists for this asset. */
  digitalBuildAvailable: boolean
  /** Declares PDF-readiness. Generation is NOT implemented this phase — see build-modes.ts. */
  printAvailable: boolean
  /** Reuses the Render Engine™ catalog — no duplicate renderer enum. */
  recommendedRenderer: RendererType
  /** Reserved generator endpoint for a future phase. Not wired now. */
  futureGenerator: string
  status: BusinessAssetStatus
  /**
   * Restricts which of the 6 build-mode ids `BuildModePicker` offers for this
   * asset. Omit to offer all modes (the default, and current behavior for
   * every existing asset). Only set this when an asset's nature genuinely
   * doesn't fit a mode — e.g. a meta/template asset with no "Delegation
   * Brief" or "Buy vs. Build" framing.
   */
  availableBuildModeIds?: BuildModeId[]
  /**
   * Phase 1 Common Creation Engine discriminant. Omitted on all existing
   * assets — defaults to "business-asset".
   */
  artifactKind?: ArtifactKind
}

/** Shorthand so every seed asset declares the full style set without repeating the literal array. */
const ALL_STYLES = ALL_COMMUNICATION_STYLES

/**
 * BUSINESS_ASSETS — the Business Asset Library™ catalog. ~36 assets across the
 * seven categories requested. Order within each category reflects the natural
 * build sequence.
 */
export const BUSINESS_ASSETS: BusinessAsset[] = [
  // ---------------------------------------------------------------------
  // START HERE
  // ---------------------------------------------------------------------
  {
    id: "founder-destination",
    name: "Founder Destination™",
    category: "Start Here",
    shortDescription: "Name the life and business you're actually building toward.",
    whatIsThis:
      "A one-page statement of the destination your business is meant to serve — the life, income, and impact you're building toward, not just the next task.",
    whyItMatters:
      "Every other asset in this library exists to move you toward this destination. Without it, effort has no direction to aim at.",
    ownerExecutiveIds: ["strategy"],
    recommendedBusinessStages: ["launch"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Where are you headed?",
        body: "Let's write down, in plain words, what you want your life and business to look like. Not a business plan — just the real picture of what you're working toward.",
      },
      small_business: {
        headline: "Define your destination",
        body: "A short, practical statement of the income, lifestyle, and impact you want this business to produce, so your day-to-day choices have somewhere to point.",
      },
      business_owner: {
        headline: "Define your Founder Destination™",
        body: "A clear destination statement — target income, lifestyle design, and impact — that becomes the filter every future decision runs through.",
      },
      executive: {
        headline: "Codify your strategic destination",
        body: "A concise destination statement that functions as your personal north star metric — the outcome every strategic decision is measured against.",
      },
      boardroom: {
        headline: "Establish the enterprise destination",
        body: "A governing statement of long-term outcome — wealth, influence, and lifestyle design — against which capital allocation and strategic bets are evaluated.",
      },
    },
    instructions: {
      foundation: [
        "Describe your ideal ordinary day, a few years from now.",
        "Write down the money you want the business to bring in.",
        "Name one way you want to help people through this business.",
      ],
      small_business: [
        "Describe the lifestyle you want your business to fund.",
        "Set a target revenue and profit range.",
        "Name the impact you want your business known for.",
      ],
      business_owner: [
        "Draft your target lifestyle design and time commitment.",
        "Set target revenue, margin, and growth trajectory.",
        "Define the market impact and reputation you're building.",
      ],
      executive: [
        "Articulate the strategic outcome you're building toward.",
        "Set financial targets tied to enterprise value, not just revenue.",
        "Define your leadership and market-position destination.",
      ],
      boardroom: [
        "Articulate the enterprise's long-term destination and time horizon.",
        "Define wealth-creation and capital-allocation targets.",
        "Define the governance and legacy outcomes you're stewarding toward.",
      ],
    },
    examples: {
      foundation: "\"In three years I want to work four days a week, bring home $8,000 a month, and help fifty families feel less stressed about money.\"",
      small_business: "\"Grow to $250K in annual revenue while working a 30-hour week, known locally as the go-to shop for reliable, honest repairs.\"",
      business_owner: "\"Reach $1M ARR with 35% margin, a team of three, and recognition as the category leader in my region.\"",
      executive: "\"Build a defensible $5M revenue business with 20% EBITDA margin and a leadership position that supports a future acquisition.\"",
      boardroom: "\"Build enterprise value toward a $25M+ exit within seven years, with governance structures ready for institutional capital.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/founder-destination",
    status: "architecture",
  },
  {
    id: "founder-onboarding-template",
    name: "Founder Onboarding Template™",
    category: "Start Here",
    shortDescription: "A template for designing your own Founder Onboarding Asset™ — not the onboarding itself.",
    whatIsThis:
      "A guided template for DESIGNING a Founder Onboarding Asset™ for your business — the sequence of questions and moments that would properly welcome a new founder or client into what you've built. This produces a template you can reuse, not a one-time onboarding record.",
    whyItMatters:
      "Most onboarding is assembled ad hoc and forgets half of what actually matters. Designing it deliberately — once, as a reusable template — means every future founder or client gets the same thoughtful welcome, and nothing critical gets left to memory.",
    ownerExecutiveIds: ["cherry-blossom", "strategy"],
    recommendedBusinessStages: ALL_BUSINESS_STAGES,
    supportedCommunicationStyles: ALL_STYLES,
    availableBuildModeIds: ["build-with-ai", "let-ai-do-it", "guided-diy"],
    explanations: {
      foundation: {
        headline: "Design how you'll welcome someone in",
        body: "This walks you through building a simple template for welcoming a new founder or client into your world — what to ask them, what to tell them, and what should happen in what order. You're building the checklist, not filling it out for one person.",
      },
      small_business: {
        headline: "Build your onboarding template",
        body: "A reusable template for how you bring a new client or team member into your business — the questions you'll ask, the info you'll share, and the order it happens in, so it's consistent every time.",
      },
      business_owner: {
        headline: "Design your Founder Onboarding Template™",
        body: "A structured, reusable onboarding template covering what you need to know about each new founder or client, what they need to know about you, and the sequence that turns both into a smooth first experience.",
      },
      executive: {
        headline: "Architect the onboarding system template",
        body: "A structured onboarding template that formalizes intake requirements, information transfer, and sequencing — designed once as a system, not re-improvised per new relationship.",
      },
      boardroom: {
        headline: "Codify the enterprise onboarding template",
        body: "A governance-grade onboarding template defining intake standards, disclosure sequencing, and systemic touchpoints — built for consistent execution across every future onboarding, not a single instance.",
      },
    },
    instructions: {
      foundation: [
        "Reminder: you're designing a reusable template here, not onboarding one specific person. Keep everything general enough to reuse.",
        "List what you need to learn about a new founder or client right away — their name, situation, and what they're hoping for.",
        "Describe the destination or goal you'd want to understand about them early on.",
        "List the basics of their business or situation you'd need to know to help them well.",
        "Note anything about their life outside work — schedule, energy, other commitments — that would shape how you support them.",
        "Describe where they actually stand right now, in plain terms, versus where they want to be.",
        "Write down how you'd check whether they're ready for what comes next.",
        "Describe how you'd explain things differently to different people — some want detail, some want the short version.",
        "Note what your guide, helper, or team would need to know about this person to help them well.",
        "Note anything a specialist helper would need flagged early, if one gets involved later.",
        "Note what would need to be true before recommending your other tools or next steps to them.",
        "Put it all in order: what happens first, second, third — and that's your onboarding flow template.",
      ],
      small_business: [
        "Note: this builds a template you'll reuse for every new client, not a record of one specific onboarding.",
        "Define the essential intake info you need from any new client on day one.",
        "Define what you need to understand about their goal or desired outcome.",
        "Define the business/situation basics you need on file to serve them.",
        "Define the lifestyle or scheduling factors that affect how you'll work together.",
        "Define how you'll assess where they currently stand.",
        "Define your readiness check before moving them to the next stage.",
        "Define how your communication approach should adjust person to person.",
        "Define what any team member helping them needs to know upfront.",
        "Define what a specialist or contractor would need flagged if brought in later.",
        "Define the criteria for when it's appropriate to recommend your other services.",
        "Sequence all of the above into a single, repeatable onboarding flow.",
      ],
      business_owner: [
        "Frame this as a reusable Founder Onboarding Template™ — a system, not a one-off intake form.",
        "Define the required intake fields for any new founder or client relationship.",
        "Define the destination/outcome-clarification questions to ask early.",
        "Define the business-context data points required for effective support.",
        "Define the work-life design factors that inform delivery cadence and boundaries.",
        "Define the current-state assessment method used to establish baseline.",
        "Define the readiness gates that determine progression to deeper engagement.",
        "Define the personalization logic — how tone/detail adapts by profile.",
        "Define the handoff brief your team or delegates need to operate independently.",
        "Define the escalation criteria for bringing in a specialist resource.",
        "Define the qualification criteria for cross-selling or recommending other offers.",
        "Sequence every step above into one ordered, repeatable onboarding flow.",
      ],
      executive: [
        "This is a systems-design exercise: you are architecting a reusable onboarding template, not documenting a single case.",
        "Specify the mandatory intake schema for every new principal relationship.",
        "Specify the destination-clarification protocol used during intake.",
        "Specify the business-context data required to calibrate strategic support.",
        "Specify the capacity/lifestyle constraints that inform engagement design.",
        "Specify the current-state diagnostic used to establish the baseline.",
        "Specify the readiness criteria gating progression through the engagement.",
        "Specify the adaptive-communication logic governing tone and depth by profile.",
        "Specify the delegation brief required for a team member to operate the relationship independently.",
        "Specify the escalation protocol for specialist engagement.",
        "Specify the qualification logic for expanding scope or cross-selling.",
        "Sequence the full protocol into one governed, repeatable onboarding flow.",
      ],
      boardroom: [
        "This produces a governance artifact: a reusable onboarding template applied to every future relationship, not a single record.",
        "Codify the mandatory intake standard for every new principal or portfolio relationship.",
        "Codify the destination/outcome disclosure required during intake.",
        "Codify the business-context disclosure standard required for oversight.",
        "Codify the capacity and lifestyle disclosures relevant to engagement structuring.",
        "Codify the current-state baseline methodology.",
        "Codify the readiness gates required before progression to material engagement.",
        "Codify the adaptive-communication standard governing disclosure by stakeholder profile.",
        "Codify the delegation/handoff standard for team continuity.",
        "Codify the escalation standard for specialist or advisory involvement.",
        "Codify the qualification standard for scope expansion.",
        "Sequence the full standard into one governed, repeatable onboarding flow suitable for institutional consistency.",
      ],
    },
    examples: {
      foundation:
        "\"Step 1: get their name and biggest goal. Step 2: ask about their day-to-day life. Step 3: figure out where they're stuck. Step 4: explain things at their pace. Step 5: hand off to my helper with a short note.\"",
      small_business:
        "\"Intake form → goal-clarification call → current-state checklist → readiness check → tailored welcome packet by client type → handoff brief for my assistant.\"",
      business_owner:
        "\"Structured intake → destination interview → business-context questionnaire → readiness scoring → profile-based communication track → team handoff brief → cross-sell qualification gate.\"",
      executive:
        "\"Standardized intake schema → destination protocol → context calibration → capacity assessment → readiness gate → adaptive-communication routing → delegation brief → escalation protocol → expansion qualification.\"",
      boardroom:
        "\"Governed intake standard → outcome disclosure protocol → context disclosure → capacity disclosure → readiness gate → stakeholder-adaptive disclosure → continuity handoff standard → advisory escalation standard → scope-expansion standard.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "editable-document",
    futureGenerator: "generate/founder-onboarding-template",
    status: "architecture",
  },
  {
    id: "business-stage-snapshot",
    name: "Business Stage™ Snapshot",
    category: "Start Here",
    shortDescription: "A one-page picture of where your business stands right now.",
    whatIsThis:
      "A short snapshot of your current Business Stage™ signals — revenue, team size, and situation — so every recommendation you receive starts from where you actually are.",
    whyItMatters:
      "Guidance that ignores your real stage wastes your time. This snapshot keeps every asset, executive, and recommendation calibrated to your reality.",
    ownerExecutiveIds: ["strategy"],
    recommendedBusinessStages: ALL_BUSINESS_STAGES,
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Where is your business today?",
        body: "A quick, honest look at where things stand right now — how much money is coming in, who's helping you, and what's actually happening day to day.",
      },
      small_business: {
        headline: "Snapshot your current stage",
        body: "A short check-in on your revenue, team, and day-to-day reality, so the guidance you get actually fits where your business is right now.",
      },
      business_owner: {
        headline: "Capture your Business Stage™ signals",
        body: "A structured snapshot of revenue stage, team size, and operating reality, used to calibrate every recommendation to your current stage.",
      },
      executive: {
        headline: "Assess current-state business positioning",
        body: "A structured assessment of revenue, headcount, and operational maturity signals that determines how strategic guidance is calibrated.",
      },
      boardroom: {
        headline: "Establish the current-state operating baseline",
        body: "A structured baseline of revenue, organizational scale, and operational maturity used to calibrate governance and strategic guidance to the enterprise's real position.",
      },
    },
    instructions: {
      foundation: [
        "Write down roughly how much money the business made last month.",
        "Write down who helps you run it — just you, or others too.",
        "Describe what's going well and what feels hardest right now.",
      ],
      small_business: [
        "Note your current monthly or annual revenue range.",
        "List your team size and any regular help.",
        "Name your top priority and top challenge right now.",
      ],
      business_owner: [
        "Record revenue stage and trailing growth trend.",
        "Record team size and delegation structure.",
        "Identify the operational constraint limiting your next move.",
      ],
      executive: [
        "Record revenue stage, margin trend, and growth trajectory.",
        "Record organizational structure and leadership depth.",
        "Identify the strategic constraint limiting growth.",
      ],
      boardroom: [
        "Record enterprise revenue, margin, and capital position.",
        "Record organizational and governance structure.",
        "Identify the structural constraint limiting the next stage of scale.",
      ],
    },
    examples: {
      foundation: "\"I made about $2,000 last month, it's just me, and the hardest part is finding time to find new clients.\"",
      small_business: "\"$8K/month, one part-time helper, priority is steadier lead flow.\"",
      business_owner: "\"$40K MRR, team of 3, constraint is founder-dependent sales.\"",
      executive: "\"$3M ARR, 12% MoM growth, constraint is management bench depth.\"",
      boardroom: "\"$18M revenue, 22% EBITDA margin, constraint is governance readiness for institutional capital.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "dashboard-card",
    futureGenerator: "generate/business-stage-snapshot",
    status: "architecture",
  },
  {
    id: "business-idea-canvas",
    name: "Business Idea Canvas",
    category: "Start Here",
    shortDescription: "Turn a rough idea into a testable business concept.",
    whatIsThis:
      "A one-page canvas that turns a rough business idea into a clear, testable concept: the problem, the offer, and the first way you'll know it's working.",
    whyItMatters:
      "Ideas stay stuck in your head until they're written down and testable. This canvas is the first concrete step from \"I have an idea\" to \"I have a business.\"",
    ownerExecutiveIds: ["strategy"],
    recommendedBusinessStages: ["launch"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Get your idea out of your head",
        body: "Let's write your business idea down in a simple way: who it helps, what you'd offer them, and how you'd know people actually want it.",
      },
      small_business: {
        headline: "Shape your idea into a testable offer",
        body: "A one-pager that turns your idea into something you can actually test — the problem, the offer, and a simple way to check demand.",
      },
      business_owner: {
        headline: "Structure your Business Idea Canvas",
        body: "A concise canvas covering problem, offer, target market, and a validation signal — the fastest path from concept to a testable hypothesis.",
      },
      executive: {
        headline: "Frame the strategic concept",
        body: "A structured concept brief capturing the problem thesis, offer hypothesis, market sizing signal, and the validation criteria that will confirm or kill it.",
      },
      boardroom: {
        headline: "Frame the venture thesis",
        body: "A structured venture thesis — problem, offer, market opportunity, and validation criteria — suitable for early governance review or investment framing.",
      },
    },
    instructions: {
      foundation: [
        "Write one sentence about the problem people have.",
        "Write one sentence about what you'd offer to fix it.",
        "Write down one small way you could test if people want it.",
      ],
      small_business: [
        "Define the specific problem and who has it.",
        "Define your offer and rough price point.",
        "Define one low-cost way to test demand this month.",
      ],
      business_owner: [
        "Define the problem thesis and target segment.",
        "Define the offer hypothesis and pricing logic.",
        "Define a validation metric and a target threshold.",
      ],
      executive: [
        "Articulate the problem thesis and market signal supporting it.",
        "Articulate the offer hypothesis and competitive angle.",
        "Define validation criteria and a go/no-go threshold.",
      ],
      boardroom: [
        "Articulate the venture thesis and total addressable market signal.",
        "Articulate the offer hypothesis and defensibility angle.",
        "Define validation criteria suitable for a governance checkpoint.",
      ],
    },
    examples: {
      foundation: "\"Busy parents don't have time to meal plan. I could sell a weekly meal plan. I'll test it by offering it free to 10 friends first.\"",
      small_business: "\"Local gyms lack recovery services. Offer mobile recovery sessions at $60/visit. Test with a 5-client pilot this month.\"",
      business_owner: "\"SMB owners overpay for bookkeeping. Offer flat-fee bookkeeping at $400/mo. Validate with 5 paid pilots at 80% retention.\"",
      executive: "\"Mid-market firms lack embedded AI ops support. Offer a retained AI-ops advisory. Validate via 3 signed pilots at target ACV.\"",
      boardroom: "\"Fragmented regional service market ripe for roll-up. Offer a platform acquisition thesis. Validate via LOIs on first two targets.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/business-idea-canvas",
    status: "architecture",
  },
  {
    id: "desired-work-lifestyle-design",
    name: "Desired Work-Lifestyle Design",
    category: "Start Here",
    shortDescription: "Design the working rhythm you actually want, before the business dictates it.",
    whatIsThis:
      "A short design document for the working rhythm you want — hours, days, and energy — before the business's demands design it for you.",
    whyItMatters:
      "Without a deliberate design, most founders default to \"whatever the business needs,\" which quietly becomes unsustainable. This asset puts the founder's life back in the design.",
    ownerExecutiveIds: ["strategy", "people-culture"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Design the life you want to work inside of",
        body: "Before you build the business, let's decide how you actually want your days and weeks to feel — so the business gets built around your life, not the other way around.",
      },
      small_business: {
        headline: "Design your ideal working rhythm",
        body: "A short plan for the hours, days, and pace you want to work, used to shape decisions like hiring and scheduling from the start.",
      },
      business_owner: {
        headline: "Design your Desired Work-Lifestyle™",
        body: "A structured working-rhythm design — hours, boundaries, and energy allocation — that becomes an input into staffing, offer design, and delegation decisions.",
      },
      executive: {
        headline: "Design the executive operating rhythm",
        body: "A deliberate design of your executive operating rhythm and capacity boundaries, used as a constraint that shapes organizational design decisions.",
      },
      boardroom: {
        headline: "Design the founder's sustainable operating cadence",
        body: "A governance-relevant design of the founder's sustainable operating cadence, informing succession planning and long-term leadership capacity decisions.",
      },
    },
    instructions: {
      foundation: [
        "Write down the hours and days you'd love to work.",
        "Write down what you never want to give up in your personal life.",
        "Name one boundary you'll hold, even when business gets busy.",
      ],
      small_business: [
        "Set your target weekly working hours and days off.",
        "List the non-negotiables in your personal schedule.",
        "Name one operating boundary you'll enforce.",
      ],
      business_owner: [
        "Define target working hours and energy allocation by day.",
        "Define non-negotiable personal commitments.",
        "Define an operating boundary and how it will be enforced.",
      ],
      executive: [
        "Define your executive operating rhythm and capacity ceiling.",
        "Define protected time and its strategic rationale.",
        "Define the boundary-enforcement mechanism and who owns it.",
      ],
      boardroom: [
        "Define the sustainable operating cadence for the founder role.",
        "Define protected capacity and its governance rationale.",
        "Define the succession-relevant boundary-enforcement structure.",
      ],
    },
    examples: {
      foundation: "\"I want to work 9-3, Monday through Thursday, and never miss my kids' dinner.\"",
      small_business: "\"32-hour week, no client calls after 4pm, one full weekday off for family.\"",
      business_owner: "\"35 hours/week, deep work mornings, delegation covers Friday client ops.\"",
      executive: "\"30-hour executive week, protected strategy block, ops delegated to a COO hire.\"",
      boardroom: "\"Founder capacity capped at 25 strategic hours/week, with a leadership bench absorbing the rest.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/desired-work-lifestyle-design",
    status: "architecture",
  },
  {
    id: "daily-intention",
    name: "Daily Intention™",
    category: "Start Here",
    shortDescription: "Set one clear intention that anchors today's work.",
    whatIsThis:
      "A one-line statement of the single most important thing today's work is in service of — separate from the to-do list.",
    whyItMatters:
      "A full task list without an intention leaves you busy but unanchored. One clear intention keeps the day pointed at what actually matters.",
    ownerExecutiveIds: ["strategy"],
    recommendedBusinessStages: ALL_BUSINESS_STAGES,
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "What matters most today?",
        body: "Before your to-do list, let's name the one thing that would make today feel like a win.",
      },
      small_business: {
        headline: "Set today's intention",
        body: "One clear sentence naming today's most important outcome, so your task list serves a purpose instead of just filling time.",
      },
      business_owner: {
        headline: "Set your Daily Intention™",
        body: "A single, prioritized intention statement that anchors today's execution to the outcome that matters most this week.",
      },
      executive: {
        headline: "Set the day's strategic focus",
        body: "A concise statement of today's highest-leverage strategic focus, used to filter competing demands on executive time.",
      },
      boardroom: {
        headline: "Set the day's governing priority",
        body: "A single governing priority statement for the day, used to align competing demands against the enterprise's current strategic focus.",
      },
    },
    instructions: {
      foundation: [
        "Ask yourself: what would make today feel worth it?",
        "Write that as one short sentence.",
        "Keep it visible while you work today.",
      ],
      small_business: [
        "Identify today's single most valuable outcome.",
        "Write it as one clear sentence.",
        "Check your task list against it before you start.",
      ],
      business_owner: [
        "Identify the outcome most tied to this week's priority.",
        "State it as a single intention.",
        "Filter today's tasks against that intention.",
      ],
      executive: [
        "Identify today's highest-leverage strategic focus.",
        "State it as a single, decision-worthy sentence.",
        "Use it to triage competing demands on your time.",
      ],
      boardroom: [
        "Identify the priority most material to enterprise outcomes today.",
        "State it as a single governing sentence.",
        "Use it to arbitrate competing strategic demands.",
      ],
    },
    examples: {
      foundation: "\"Today I want to finish and send that proposal, no matter what else comes up.\"",
      small_business: "\"Today's win: close the follow-up call with the lead from Tuesday.\"",
      business_owner: "\"Today's intention: finalize Q3 pricing changes before the team meeting.\"",
      executive: "\"Today's focus: resolve the hiring decision blocking the ops build-out.\"",
      boardroom: "\"Today's priority: finalize the board memo on the acquisition timeline.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "checklist",
    futureGenerator: "generate/daily-intention",
    status: "architecture",
  },

  // ---------------------------------------------------------------------
  // BUILD THE BUSINESS
  // ---------------------------------------------------------------------
  {
    id: "ideal-client-compass",
    name: "Ideal Client Asset",
    category: "Build the Business",
    shortDescription: "Get clear on exactly who you're building this business for.",
    whatIsThis:
      "A clear profile of the client your business is built for: who they are, what they struggle with, what they want, and who is NOT a fit.",
    whyItMatters:
      "Every marketing, sales, and offer decision downstream depends on knowing exactly who you're serving. Without this, messaging and offers stay generic and underperform.",
    ownerExecutiveIds: ["marketing-brand"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Who do you want to help?",
        body: "Let's get clear about the person your business is for — who they are, what they're struggling with, and what they wish were different.",
      },
      small_business: {
        headline: "Define your ideal client",
        body: "A practical profile of the client you serve best — their problem, what they want, and the type of client that's actually NOT a good fit.",
      },
      business_owner: {
        headline: "Define your Ideal Client Profile",
        body: "Clarify your target client's needs, buying motivations, problems, desired outcomes, and qualification criteria — including a clear non-ICP list.",
      },
      executive: {
        headline: "Define the target buyer profile",
        body: "A structured target-buyer profile including firmographic/psychographic signals, purchase drivers, and explicit disqualification criteria to sharpen go-to-market focus.",
      },
      boardroom: {
        headline: "Define the enterprise target-market profile",
        body: "A structured target-market and buyer profile, including purchase drivers and disqualification criteria, used to focus enterprise go-to-market investment.",
      },
    },
    instructions: {
      foundation: [
        "Describe the kind of person you most want to help.",
        "Write down the biggest problem they have.",
        "Write down what would make their life easier.",
        "Describe someone who is NOT a good fit for you.",
      ],
      small_business: [
        "Describe your ideal client's situation and role.",
        "Identify their main pain point and desired outcome.",
        "Identify what makes them decide to buy.",
        "List 2-3 traits of clients who are not a fit.",
      ],
      business_owner: [
        "Define ICP demographics/firmographics and situation.",
        "Define the core problem and desired outcome.",
        "Define purchase drivers and qualification criteria.",
        "Define explicit non-ICP disqualifiers.",
      ],
      executive: [
        "Define the target buyer's profile and strategic context.",
        "Define the problem thesis and desired business outcome.",
        "Define purchase drivers, budget signals, and buying process.",
        "Define disqualification criteria to protect sales capacity.",
      ],
      boardroom: [
        "Define the target market segment and its strategic value.",
        "Define the core problem and enterprise-level outcome sought.",
        "Define purchase drivers, procurement dynamics, and deal signals.",
        "Define disqualification criteria to protect enterprise focus and margin.",
      ],
    },
    examples: {
      foundation: "\"I help women business owners who are successful but exhausted and want their evenings back.\"",
      small_business: "\"Local shop owners doing $200-500K/yr who are drowning in admin and want more free time.\"",
      business_owner: "\"Service-business owners at $1-3M ARR who need systems to scale past founder-dependence.\"",
      executive: "\"VP-level buyers at mid-market firms needing embedded AI-ops capability without a full hire.\"",
      boardroom: "\"Regional operators in fragmented markets suited for roll-up, with clean books and willing sellers.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/ideal-client-compass",
    status: "architecture",
  },
  {
    id: "problem-solution-canvas",
    name: "Problem & Solution Canvas",
    category: "Build the Business",
    shortDescription: "Map the exact problem your offer solves and how.",
    whatIsThis:
      "A one-page map connecting your client's real problem to exactly how your offer solves it — so the value is obvious, not implied.",
    whyItMatters:
      "If the connection between problem and solution isn't crystal clear to you, it won't be clear to your prospects either.",
    ownerExecutiveIds: ["strategy", "marketing-brand"],
    prerequisites: ["ideal-client-compass"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "What problem are you solving, and how?",
        body: "Let's connect the dots between the problem your client has and exactly how your offer fixes it, in plain language.",
      },
      small_business: {
        headline: "Map problem to solution",
        body: "A clear map from your client's problem to your specific solution, so you can explain your value in one breath.",
      },
      business_owner: {
        headline: "Build your Problem-Solution Grid",
        body: "A structured grid connecting each core client problem to the specific mechanism of your solution and the outcome it produces.",
      },
      executive: {
        headline: "Structure the value proposition logic",
        body: "A structured problem-solution-outcome chain that forms the backbone of your value proposition and sales narrative.",
      },
      boardroom: {
        headline: "Codify the enterprise value thesis",
        body: "A structured problem-solution-outcome chain used to validate the enterprise's value thesis for strategic and investment communication.",
      },
    },
    instructions: {
      foundation: [
        "Write down the problem in your client's own words.",
        "Write down what you actually do to solve it.",
        "Write down the result they get afterward.",
      ],
      small_business: [
        "List the top 3 problems your clients bring you.",
        "Match each to the specific part of your offer that solves it.",
        "Name the outcome each solution produces.",
      ],
      business_owner: [
        "Define the core problem set with supporting evidence.",
        "Map each problem to your solution mechanism.",
        "Define the measurable outcome per problem-solution pair.",
      ],
      executive: [
        "Define the strategic problem thesis with market evidence.",
        "Map the solution mechanism and competitive differentiation.",
        "Define the business outcome and its financial impact.",
      ],
      boardroom: [
        "Define the enterprise problem thesis with market sizing.",
        "Map the solution mechanism and defensibility argument.",
        "Define the enterprise outcome and its value-creation impact.",
      ],
    },
    examples: {
      foundation: "\"Problem: no time to cook healthy meals. Solution: pre-made meal plans delivered weekly. Result: dinner solved in 10 minutes.\"",
      small_business: "\"Problem: inconsistent lead flow. Solution: done-for-you weekly outreach. Result: 5 new qualified leads/month.\"",
      business_owner: "\"Problem: founder-dependent sales. Solution: documented sales system + hired closer. Result: 30% less founder time in sales.\"",
      executive: "\"Problem: no AI operating capability. Solution: embedded AI-ops advisory. Result: 15% cost reduction in 90 days.\"",
      boardroom: "\"Problem: fragmented regional supply. Solution: platform consolidation. Result: margin expansion via shared services.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/problem-solution-canvas",
    status: "architecture",
  },
  {
    id: "offer-design-canvas",
    name: "Offer Design Canvas",
    category: "Build the Business",
    shortDescription: "Design an offer people actually want to buy.",
    whatIsThis:
      "A structured canvas for designing your offer: what's included, at what price, delivered how, so the whole package is coherent and compelling.",
    whyItMatters:
      "A vague offer is hard to sell and hard to deliver. A designed offer is easy to explain, price with confidence, and deliver consistently.",
    ownerExecutiveIds: ["strategy", "sales"],
    prerequisites: ["problem-solution-canvas"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Design what you're actually selling",
        body: "Let's decide exactly what's included in your offer, what it costs, and how someone would receive it — so it's easy to explain and easy to buy.",
      },
      small_business: {
        headline: "Design your core offer",
        body: "A practical breakdown of what's included, the price, and how it's delivered, so your offer is simple to sell and simple to deliver.",
      },
      business_owner: {
        headline: "Build your Offer Design Canvas",
        body: "A structured design of offer components, pricing logic, delivery model, and guarantee — the package that becomes your primary revenue driver.",
      },
      executive: {
        headline: "Structure the offer architecture",
        body: "A structured offer architecture covering packaging, pricing strategy, delivery model, and margin implications.",
      },
      boardroom: {
        headline: "Codify the enterprise offer portfolio",
        body: "A structured design of the offer's packaging, pricing strategy, and margin profile, evaluated for its contribution to enterprise value.",
      },
    },
    instructions: {
      foundation: [
        "List exactly what's included in the offer.",
        "Decide on a price that feels fair for the value.",
        "Decide how you'll actually deliver it (in person, online, etc.).",
      ],
      small_business: [
        "Define offer components and any tiers.",
        "Set pricing based on value and market comparison.",
        "Define delivery format and timeline.",
      ],
      business_owner: [
        "Define offer components, tiers, and add-ons.",
        "Define pricing strategy and margin target.",
        "Define delivery model, timeline, and guarantee.",
      ],
      executive: [
        "Define the offer architecture and packaging strategy.",
        "Define pricing strategy against market positioning and margin targets.",
        "Define the delivery model's scalability and cost structure.",
      ],
      boardroom: [
        "Define the offer portfolio and its strategic packaging.",
        "Define pricing strategy against enterprise margin and positioning goals.",
        "Define the delivery model's scalability and capital requirements.",
      ],
    },
    examples: {
      foundation: "\"12-week 1:1 coaching, $1,200, delivered weekly over video calls.\"",
      small_business: "\"Monthly bookkeeping package, $450/mo, delivered via shared portal with a monthly call.\"",
      business_owner: "\"Tiered SaaS + services bundle, $2K-$8K/mo, delivered via onboarding + quarterly reviews.\"",
      executive: "\"Retained advisory engagement, $25K/quarter, delivered via embedded weekly cadence.\"",
      boardroom: "\"Platform licensing + services, tiered enterprise pricing, delivered via multi-year contracts.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/offer-design-canvas",
    status: "architecture",
  },
  {
    id: "business-model-canvas",
    name: "Business Model Canvas",
    category: "Build the Business",
    shortDescription: "See your whole business on one page.",
    whatIsThis:
      "A one-page map of how your business actually works: what you offer, to whom, how you reach them, and how money moves through it.",
    whyItMatters:
      "Seeing the whole business at once reveals gaps and dependencies that are invisible when you're heads-down in daily tasks.",
    ownerExecutiveIds: ["strategy"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "See your whole business on one page",
        body: "Let's map out, in simple terms, what you sell, who buys it, how they find you, and how the money works.",
      },
      small_business: {
        headline: "Map your business model",
        body: "A one-page picture of your offer, your customers, how you reach them, and where your revenue and costs actually come from.",
      },
      business_owner: {
        headline: "Build your Business Model Canvas",
        body: "A structured, one-page view of value proposition, channels, revenue streams, cost structure, and key resources.",
      },
      executive: {
        headline: "Model the business system",
        body: "A structured business-model view covering value proposition, channels, revenue architecture, cost structure, and key partnerships.",
      },
      boardroom: {
        headline: "Model the enterprise operating system",
        body: "A structured enterprise-level model of value proposition, channel strategy, revenue architecture, and cost structure for governance review.",
      },
    },
    instructions: {
      foundation: [
        "Write what you sell and who buys it.",
        "Write how people find out about you.",
        "Write where your money comes in and where it goes out.",
      ],
      small_business: [
        "Define your offer and customer segments.",
        "Define your main marketing/sales channels.",
        "Define revenue streams and major cost categories.",
      ],
      business_owner: [
        "Define value proposition and customer segments.",
        "Define channels, partnerships, and key resources.",
        "Define revenue streams, cost structure, and margin drivers.",
      ],
      executive: [
        "Define the value proposition and strategic segments.",
        "Define channel strategy, partnerships, and resource dependencies.",
        "Define revenue architecture, cost structure, and unit economics.",
      ],
      boardroom: [
        "Define the enterprise value proposition and market segments.",
        "Define channel and partnership strategy at scale.",
        "Define revenue architecture, cost structure, and capital efficiency.",
      ],
    },
    examples: {
      foundation: "\"I sell haircuts to busy professionals who find me through Instagram and referrals; money comes in per visit, goes out on rent and supplies.\"",
      small_business: "\"We sell subscription lawn care to homeowners via local ads and referrals; revenue is recurring, costs are labor and equipment.\"",
      business_owner: "\"SaaS + services to SMBs via inbound content and partnerships; ARR-based revenue, cost driven by support headcount.\"",
      executive: "\"Enterprise advisory via outbound + channel partners; retainer revenue, cost driven by senior talent and delivery capacity.\"",
      boardroom: "\"Platform + licensing to multiple verticals via strategic alliances; multi-stream revenue, capital-efficient cost structure.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/business-model-canvas",
    status: "architecture",
  },
  {
    id: "positioning-canvas",
    name: "Positioning Canvas",
    category: "Build the Business",
    shortDescription: "Define what makes you the obvious choice.",
    whatIsThis:
      "A short canvas defining how you want to be seen in the market relative to alternatives — what makes you the obvious choice for your ideal client.",
    whyItMatters:
      "Without clear positioning, prospects compare you on price alone. Clear positioning gives them a reason to choose you for reasons other than being cheapest.",
    ownerExecutiveIds: ["marketing-brand"],
    prerequisites: ["ideal-client-compass"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Why should someone pick you?",
        body: "Let's figure out, in simple terms, what makes you different from other options your ideal client might consider.",
      },
      small_business: {
        headline: "Define your positioning",
        body: "A short statement of how you stand out from competitors and alternatives, in a way your ideal client actually cares about.",
      },
      business_owner: {
        headline: "Build your Positioning Canvas",
        body: "A structured positioning statement — category, differentiation, and proof — that shapes how your brand competes for attention and trust.",
      },
      executive: {
        headline: "Structure the market positioning strategy",
        body: "A structured positioning strategy defining category framing, competitive differentiation, and supporting proof points.",
      },
      boardroom: {
        headline: "Codify the enterprise competitive positioning",
        body: "A structured competitive-positioning framework used to align messaging, category strategy, and enterprise differentiation.",
      },
    },
    instructions: {
      foundation: [
        "Name your closest alternatives (including \"do nothing\").",
        "Write down one thing you do differently or better.",
        "Write down proof that backs it up.",
      ],
      small_business: [
        "List your top 2-3 competitors or alternatives.",
        "Define your key differentiator.",
        "Define proof points that support the differentiator.",
      ],
      business_owner: [
        "Define the competitive set and category framing.",
        "Define your differentiation thesis.",
        "Define proof points and how they'll be communicated.",
      ],
      executive: [
        "Define the competitive landscape and category strategy.",
        "Define the differentiation thesis and defensibility.",
        "Define proof points suitable for executive-level buyers.",
      ],
      boardroom: [
        "Define the competitive landscape at an enterprise/market level.",
        "Define the differentiation thesis and its strategic moat.",
        "Define proof points suitable for board and investor communication.",
      ],
    },
    examples: {
      foundation: "\"Unlike big-box gyms, I give real 1:1 attention at a price that doesn't feel like a luxury.\"",
      small_business: "\"Unlike DIY software, we handle setup and support so nothing falls through the cracks.\"",
      business_owner: "\"Unlike generalist agencies, we specialize exclusively in this vertical, with case studies to prove it.\"",
      executive: "\"Unlike point-solution vendors, we offer an integrated platform backed by enterprise-grade SLAs.\"",
      boardroom: "\"Unlike fragmented regional players, we offer scale, governance, and consistency across markets.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/positioning-canvas",
    status: "architecture",
  },
  {
    id: "revenue-model",
    name: "Revenue Model",
    category: "Build the Business",
    shortDescription: "Map out exactly how your business makes money.",
    whatIsThis:
      "A structured breakdown of exactly how revenue flows into the business — pricing, volume, and frequency — so growth targets are grounded in real numbers.",
    whyItMatters:
      "Revenue goals without a model behind them are just wishes. This turns a target into a plan you can actually execute against.",
    ownerExecutiveIds: ["finance", "strategy"],
    recommendedBusinessStages: ["launch", "growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "How does your business actually make money?",
        body: "Let's write out, simply, what you sell, for how much, and how often, so you can see how the numbers add up to your goal.",
      },
      small_business: {
        headline: "Map your revenue model",
        body: "A breakdown of price, volume, and frequency for each offer, so you know exactly what it takes to hit your revenue target.",
      },
      business_owner: {
        headline: "Build your Revenue Model",
        body: "A structured revenue model — pricing, volume assumptions, and frequency — that translates your revenue target into required activity.",
      },
      executive: {
        headline: "Structure the revenue architecture",
        body: "A structured revenue architecture modeling pricing, volume, and retention assumptions against strategic growth targets.",
      },
      boardroom: {
        headline: "Model the enterprise revenue architecture",
        body: "A structured enterprise revenue model — pricing, volume, retention, and expansion assumptions — suitable for board-level forecasting.",
      },
    },
    instructions: {
      foundation: [
        "List each thing you sell and its price.",
        "Estimate how many you could sell each month.",
        "Multiply price by quantity to see monthly revenue.",
      ],
      small_business: [
        "List offers, prices, and expected monthly volume.",
        "Note any recurring vs. one-time revenue.",
        "Calculate the monthly revenue total and gap to target.",
      ],
      business_owner: [
        "Define offers, pricing tiers, and volume assumptions.",
        "Define recurring vs. one-time revenue mix.",
        "Model monthly/annual revenue and identify the growth gap.",
      ],
      executive: [
        "Define pricing architecture and volume assumptions by segment.",
        "Define retention and expansion revenue assumptions.",
        "Model revenue against strategic targets and identify the growth gap.",
      ],
      boardroom: [
        "Define enterprise pricing architecture and segment-level volume.",
        "Define retention, expansion, and churn assumptions.",
        "Model revenue against board targets and identify structural gaps.",
      ],
    },
    examples: {
      foundation: "\"$50/session x 40 sessions/month = $2,000/month.\"",
      small_business: "\"$450/mo x 20 recurring clients = $9,000 MRR, plus $2,000 in one-time setup fees.\"",
      business_owner: "\"$2K avg MRR x 45 accounts x 92% retention = $90K MRR steady-state.\"",
      executive: "\"$25K/quarter retainers x 18 accounts, 95% retention, 20% expansion = $1.9M ARR run rate.\"",
      boardroom: "\"Blended enterprise ARR model across 3 segments with 90% gross retention and 15% net expansion.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "spreadsheet",
    futureGenerator: "generate/revenue-model",
    status: "architecture",
  },

  // ---------------------------------------------------------------------
  // SELL THE BUSINESS
  // ---------------------------------------------------------------------
  {
    id: "discovery-call-blueprint",
    name: "Discovery Call Blueprint™",
    category: "Sell the Business",
    shortDescription: "Run a sales call that actually converts, without feeling pushy.",
    whatIsThis:
      "A structured outline for a discovery/sales call: the questions to ask, the problem to uncover, and how to present your offer as the natural next step.",
    whyItMatters:
      "Winging sales calls leads to inconsistent results. A blueprint means every call moves through the same proven structure, whether you're confident that day or not.",
    ownerExecutiveIds: ["sales"],
    prerequisites: ["ideal-client-compass"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Have a plan for your sales calls",
        body: "Let's map out a simple flow for your calls: questions to ask, what to listen for, and how to naturally offer your help at the end.",
      },
      small_business: {
        headline: "Build your discovery call plan",
        body: "A repeatable call structure — questions, problem discovery, and a natural offer — so every sales call follows a proven path.",
      },
      business_owner: {
        headline: "Build your Discovery Call Blueprint™",
        body: "A structured call framework covering rapport, problem discovery, qualification, and offer presentation, built for consistent conversion.",
      },
      executive: {
        headline: "Structure the sales discovery framework",
        body: "A structured discovery framework covering qualification, problem articulation, and value-based offer positioning for consistent close rates.",
      },
      boardroom: {
        headline: "Codify the enterprise sales discovery process",
        body: "A structured, repeatable enterprise sales discovery process designed for consistency across a sales team and scalable close rates.",
      },
    },
    instructions: {
      foundation: [
        "List 3-4 questions to understand their situation.",
        "Plan how you'll summarize their problem back to them.",
        "Plan how you'll naturally introduce your offer.",
      ],
      small_business: [
        "Draft opening rapport questions.",
        "Draft problem-discovery and pain questions.",
        "Draft your offer transition and close.",
      ],
      business_owner: [
        "Draft rapport and context-setting questions.",
        "Draft problem-discovery and qualification questions.",
        "Draft the offer presentation and objection-handling transition.",
      ],
      executive: [
        "Draft context-setting and strategic-fit questions.",
        "Draft qualification questions tied to budget/authority/need/timeline.",
        "Draft the value-based offer presentation and next-steps close.",
      ],
      boardroom: [
        "Draft the standardized opening and strategic-fit framing.",
        "Draft qualification questions suitable for enterprise buying committees.",
        "Draft the value-based close and multi-stakeholder next steps.",
      ],
    },
    examples: {
      foundation: "\"What's making this hard right now?\" → summarize → \"Here's how I could help with that.\"",
      small_business: "\"What have you tried before?\" → \"Here's the specific gap I see\" → \"Here's how our package fixes it.\"",
      business_owner: "\"What's the cost of this problem staying unsolved?\" → qualify budget/timeline → present tiered offer.",
      executive: "\"What's the strategic priority this maps to?\" → qualify BANT → present ROI-framed proposal.",
      boardroom: "\"Who else is involved in this decision?\" → qualify committee → present enterprise business case.",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "checklist",
    futureGenerator: "generate/discovery-call-blueprint",
    status: "architecture",
  },
  {
    id: "problem-solution-grid",
    name: "Problem-Solution Grid",
    category: "Sell the Business",
    shortDescription: "A quick-reference grid for talking through common client problems.",
    whatIsThis:
      "A reference grid mapping the most common problems prospects mention to the exact language you use to connect them to your offer.",
    whyItMatters:
      "Having this ready means you're never caught improvising an answer to a common objection or problem — you already know your best response.",
    ownerExecutiveIds: ["sales"],
    prerequisites: ["problem-solution-canvas"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Have your answers ready",
        body: "Let's write down the problems people usually mention, and exactly what you'll say back to connect it to how you help.",
      },
      small_business: {
        headline: "Build your problem-solution reference",
        body: "A quick-reference sheet connecting common client problems to your best response, so you're never caught off guard on a call.",
      },
      business_owner: {
        headline: "Build your Problem-Solution Grid",
        body: "A structured reference grid pairing recurring client problems with validated response language, used to standardize sales conversations.",
      },
      executive: {
        headline: "Standardize the sales response framework",
        body: "A structured, standardized set of problem-response pairs used to improve consistency and close rates across the sales function.",
      },
      boardroom: {
        headline: "Codify the enterprise sales response playbook",
        body: "A standardized problem-response reference used across the sales organization to improve consistency, ramp time, and win rates.",
      },
    },
    instructions: {
      foundation: [
        "List the top 5 problems people bring up.",
        "Write a simple response for each.",
        "Keep it handy during calls.",
      ],
      small_business: [
        "List common objections and problems by frequency.",
        "Draft a proven response for each.",
        "Review and refine responses after each call.",
      ],
      business_owner: [
        "Catalog recurring problems and objections with frequency data.",
        "Draft validated response language for each.",
        "Track which responses convert best and refine quarterly.",
      ],
      executive: [
        "Catalog problems/objections across the sales team with win-rate data.",
        "Draft standardized response language tied to value framing.",
        "Establish a review cadence to refine responses by outcome.",
      ],
      boardroom: [
        "Catalog enterprise-level objections with committee-level context.",
        "Draft standardized, board-approved response language.",
        "Establish an enterprise review cadence tied to win-rate analytics.",
      ],
    },
    examples: {
      foundation: "\"It's too expensive\" → \"Here's what it costs you to keep doing it the current way.\"",
      small_business: "\"We already have someone for this\" → \"Here's what we catch that gets missed.\"",
      business_owner: "\"Not the right time\" → \"Here's the cost of waiting, quantified.\"",
      executive: "\"We need to check with leadership\" → \"Here's the ROI summary to bring to that conversation.\"",
      boardroom: "\"This needs procurement review\" → \"Here's the enterprise business case pre-formatted for that process.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/problem-solution-grid",
    status: "architecture",
  },
  {
    id: "objection-map",
    name: "Objection Map",
    category: "Sell the Business",
    shortDescription: "Prepare calm, confident responses to the objections you hear most.",
    whatIsThis:
      "A map of the objections you hear most often, paired with a calm, honest response for each — so hesitation doesn't end the conversation.",
    whyItMatters:
      "Objections are usually predictable. Preparing for them in advance means you respond with confidence instead of getting flustered in the moment.",
    ownerExecutiveIds: ["sales"],
    prerequisites: ["discovery-call-blueprint"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Get ready for the \"buts\"",
        body: "Let's write down the reasons people hesitate, and a calm, honest way to respond to each one.",
      },
      small_business: {
        headline: "Map your common objections",
        body: "A short list of the hesitations you hear most, with a prepared, honest response for each.",
      },
      business_owner: {
        headline: "Build your Objection Map",
        body: "A structured map of recurring objections and validated responses, used to reduce lost deals from unaddressed hesitation.",
      },
      executive: {
        headline: "Structure the objection-handling framework",
        body: "A structured objection-handling framework mapping recurring buyer hesitations to strategically framed responses.",
      },
      boardroom: {
        headline: "Codify the enterprise objection-handling framework",
        body: "A standardized objection-handling framework used across the sales organization to reduce deal attrition at the committee level.",
      },
    },
    instructions: {
      foundation: [
        "List the top 3-5 reasons people say no or hesitate.",
        "Write an honest response for each.",
        "Practice saying each response out loud.",
      ],
      small_business: [
        "List common objections by how often you hear them.",
        "Draft a response that addresses the real concern.",
        "Test responses on real calls and refine.",
      ],
      business_owner: [
        "Catalog objections with frequency and deal-stage data.",
        "Draft evidence-based responses for each.",
        "Track objection-to-close conversion and refine.",
      ],
      executive: [
        "Catalog objections by stakeholder type and deal stage.",
        "Draft strategically framed, ROI-backed responses.",
        "Track resolution rates and refine team-wide messaging.",
      ],
      boardroom: [
        "Catalog committee-level objections across major accounts.",
        "Draft governance-appropriate, evidence-backed responses.",
        "Track resolution rates at the enterprise level and refine annually.",
      ],
    },
    examples: {
      foundation: "\"I need to think about it\" → \"Totally fair — what's the biggest question still on your mind?\"",
      small_business: "\"We can't afford it right now\" → \"Let's look at what a smaller starting package could look like.\"",
      business_owner: "\"We tried something like this before\" → \"What specifically didn't work, so I can show how this differs?\"",
      executive: "\"This isn't a budget priority this quarter\" → \"Here's the cost of delay, quantified for your next budget cycle.\"",
      boardroom: "\"The board will need to review this\" → \"Here's a pre-built summary designed for that review.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/objection-map",
    status: "architecture",
  },
  {
    id: "sales-journey",
    name: "Sales Journey",
    category: "Sell the Business",
    shortDescription: "Map every step from first contact to signed client.",
    whatIsThis:
      "A step-by-step map of everything that happens between someone first hearing about you and becoming a paying client.",
    whyItMatters:
      "If you can't see every step of the journey, you can't see where prospects are dropping off — or fix it.",
    ownerExecutiveIds: ["sales"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Map the path from stranger to client",
        body: "Let's walk through every step someone takes from first hearing about you to becoming a client, so you can see where people might get stuck.",
      },
      small_business: {
        headline: "Map your sales journey",
        body: "A step-by-step path from first contact to signed client, so you can spot where prospects drop off and fix it.",
      },
      business_owner: {
        headline: "Build your Sales Journey map",
        body: "A structured map of every stage from lead to client, including conversion points and drop-off risk, used to diagnose pipeline health.",
      },
      executive: {
        headline: "Structure the buyer journey and funnel",
        body: "A structured buyer journey and funnel model identifying conversion rates and drop-off points at each stage.",
      },
      boardroom: {
        headline: "Model the enterprise sales funnel",
        body: "A structured enterprise sales funnel model with stage-level conversion data, used for pipeline forecasting and governance review.",
      },
    },
    instructions: {
      foundation: [
        "List every step from \"never heard of you\" to \"signed client.\"",
        "Note where people usually get stuck.",
        "Pick one step to improve first.",
      ],
      small_business: [
        "Map awareness, interest, decision, and close stages.",
        "Note approximate conversion rate at each stage.",
        "Identify the weakest stage and a fix.",
      ],
      business_owner: [
        "Map full funnel stages with defined entry/exit criteria.",
        "Attach conversion-rate data to each stage.",
        "Diagnose the highest-leverage stage to improve.",
      ],
      executive: [
        "Map the funnel with stage-level ownership and metrics.",
        "Attach conversion and velocity data by stage.",
        "Prioritize the stage with the highest revenue impact if fixed.",
      ],
      boardroom: [
        "Map the enterprise funnel across segments and channels.",
        "Attach conversion, velocity, and forecast data by stage.",
        "Prioritize structural fixes with board-level revenue impact.",
      ],
    },
    examples: {
      foundation: "\"Instagram post → DM conversation → free call → signed client — most people get stuck after the free call.\"",
      small_business: "\"Ad → landing page → booked call → proposal → close — biggest drop-off is at proposal follow-up.\"",
      business_owner: "\"Inbound lead → discovery call → proposal → negotiation → close — 40% drop-off at proposal stage.\"",
      executive: "\"MQL → SQL → demo → proposal → close — velocity bottleneck is the demo-to-proposal gap.\"",
      boardroom: "\"Enterprise lead → qualification → pilot → procurement → contract — procurement stage drives 60% of cycle time.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "dashboard-card",
    futureGenerator: "generate/sales-journey",
    status: "architecture",
  },
  {
    id: "referral-blueprint",
    name: "Referral Blueprint",
    category: "Sell the Business",
    shortDescription: "Turn happy clients into a steady source of new business.",
    whatIsThis:
      "A simple system for asking happy clients for referrals, consistently, instead of hoping it happens on its own.",
    whyItMatters:
      "Referrals are some of the highest-trust leads you can get, but they rarely happen without a deliberate, repeatable ask.",
    ownerExecutiveIds: ["sales", "client-success"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Turn happy clients into new clients",
        body: "Let's build a simple, repeatable way to ask happy clients if they know anyone else who could use your help.",
      },
      small_business: {
        headline: "Build your referral system",
        body: "A repeatable process for asking for referrals at the right moment, so word-of-mouth becomes a reliable lead source, not luck.",
      },
      business_owner: {
        headline: "Build your Referral Blueprint",
        body: "A structured referral system defining the trigger moment, the ask, and any incentive, used to make referrals a predictable channel.",
      },
      executive: {
        headline: "Structure the referral acquisition channel",
        body: "A structured referral channel with defined trigger points, incentive design, and tracking, treated as a formal acquisition channel.",
      },
      boardroom: {
        headline: "Institutionalize the enterprise referral program",
        body: "A formalized referral program with incentive structure and tracking, treated as a governed acquisition channel with reportable metrics.",
      },
    },
    instructions: {
      foundation: [
        "Decide the best moment to ask (right after a win, usually).",
        "Write a simple, comfortable way to ask.",
        "Decide if you'll offer a small thank-you for referrals.",
      ],
      small_business: [
        "Identify the trigger moment for asking.",
        "Draft your referral request script.",
        "Decide on an incentive, if any.",
      ],
      business_owner: [
        "Define trigger points across the client journey.",
        "Draft the ask and supporting collateral.",
        "Define incentive structure and tracking method.",
      ],
      executive: [
        "Define trigger points tied to satisfaction/NPS signals.",
        "Draft the ask, integrated into the client success process.",
        "Define incentive structure, tracking, and attribution.",
      ],
      boardroom: [
        "Define trigger points across the enterprise client lifecycle.",
        "Formalize the referral program with governance sign-off.",
        "Define incentive structure, tracking, and reportable KPIs.",
      ],
    },
    examples: {
      foundation: "\"After a client thanks you, ask: 'Who else do you know who's dealing with the same thing?'\"",
      small_business: "\"After a 5-star review, send: 'Know anyone else who'd love this? Refer them and get $50 off.'\"",
      business_owner: "\"After a QBR win, trigger a referral ask tied to a partner-credit incentive.\"",
      executive: "\"After a renewal, trigger a formal referral request tied to account expansion goals.\"",
      boardroom: "\"After annual contract renewal, trigger a formal partner-referral program with tracked attribution.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/referral-blueprint",
    status: "architecture",
  },

  // ---------------------------------------------------------------------
  // MARKET THE BUSINESS
  // ---------------------------------------------------------------------
  {
    id: "brand-foundation",
    name: "Brand Foundation",
    category: "Market the Business",
    shortDescription: "Define the story and voice behind your business.",
    whatIsThis:
      "A short document defining your brand's voice, story, and visual feel — the foundation every piece of marketing should be built on.",
    whyItMatters:
      "Without a defined foundation, marketing feels inconsistent from post to post. A clear foundation makes everything you create feel recognizably \"you.\"",
    ownerExecutiveIds: ["marketing-brand"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Define how your brand sounds and feels",
        body: "Let's write down your story, how you want to sound, and the look you want your brand to have, so everything you make feels consistent.",
      },
      small_business: {
        headline: "Build your brand foundation",
        body: "A short definition of your brand voice, story, and visual direction, used to keep your marketing consistent as you create more of it.",
      },
      business_owner: {
        headline: "Build your Brand Foundation",
        body: "A structured brand foundation — story, voice, and visual identity guardrails — that keeps marketing execution consistent at scale.",
      },
      executive: {
        headline: "Structure the brand strategy foundation",
        body: "A structured brand strategy foundation covering narrative, voice, and visual identity guardrails to support consistent brand equity building.",
      },
      boardroom: {
        headline: "Codify the enterprise brand platform",
        body: "A formalized enterprise brand platform — narrative, voice, and identity system — used to protect brand equity across teams and markets.",
      },
    },
    instructions: {
      foundation: [
        "Write your business's story in a few sentences.",
        "Describe how you want to sound (friendly, bold, calm, etc.).",
        "Note a few colors or images that feel like \"you.\"",
      ],
      small_business: [
        "Draft your brand story and founding reason.",
        "Define your voice with a few descriptive words.",
        "Define a basic visual direction (colors, style).",
      ],
      business_owner: [
        "Draft the brand narrative and positioning tie-in.",
        "Define voice guidelines with examples.",
        "Define visual identity guardrails.",
      ],
      executive: [
        "Draft the brand narrative tied to strategic positioning.",
        "Define voice guidelines suitable for a team to apply consistently.",
        "Define visual identity system and usage guardrails.",
      ],
      boardroom: [
        "Draft the enterprise brand narrative and equity thesis.",
        "Define governed voice guidelines across markets/teams.",
        "Define the visual identity system and governance process.",
      ],
    },
    examples: {
      foundation: "\"Started this because I couldn't find anyone who explained finances simply — so my voice is warm, clear, no jargon.\"",
      small_business: "\"Voice: friendly expert. Colors: warm neutrals. Story: built from personal frustration with bad service.\"",
      business_owner: "\"Voice: confident, plain-spoken authority. Visual: clean, modern, consistent across all channels.\"",
      executive: "\"Narrative: category challenger built on operator experience. Voice: direct, credible, data-backed.\"",
      boardroom: "\"Enterprise narrative: trusted category leader with governance-grade consistency across all markets.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/brand-foundation",
    status: "architecture",
  },
  {
    id: "messaging-map",
    name: "Messaging Map",
    category: "Market the Business",
    shortDescription: "Have your core talking points ready everywhere.",
    whatIsThis:
      "A map of your core messages — the headline, supporting points, and proof — ready to reuse across your website, social, and sales conversations.",
    whyItMatters:
      "Writing new messaging from scratch every time is slow and inconsistent. A messaging map means you always have your best language ready.",
    ownerExecutiveIds: ["marketing-brand"],
    prerequisites: ["positioning-canvas"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Have your key phrases ready to go",
        body: "Let's write down the main things you want people to know about your business, so you're not starting from scratch every time you post or talk to someone.",
      },
      small_business: {
        headline: "Build your messaging map",
        body: "A reusable set of key messages and proof points, so your website, posts, and conversations stay consistent.",
      },
      business_owner: {
        headline: "Build your Messaging Map",
        body: "A structured messaging map — headline, supporting points, and proof — used consistently across every marketing and sales channel.",
      },
      executive: {
        headline: "Structure the messaging architecture",
        body: "A structured messaging architecture with a primary value proposition, supporting proof, and channel-specific variants.",
      },
      boardroom: {
        headline: "Codify the enterprise messaging framework",
        body: "A governed enterprise messaging framework ensuring consistent value-proposition communication across teams and markets.",
      },
    },
    instructions: {
      foundation: [
        "Write one main sentence about what you do and for whom.",
        "Write 2-3 supporting points people should know.",
        "Write one piece of proof (result, review, or story).",
      ],
      small_business: [
        "Draft your headline message.",
        "Draft 2-3 supporting messages.",
        "Draft proof points (testimonials, results).",
      ],
      business_owner: [
        "Draft the primary value proposition statement.",
        "Draft supporting message pillars.",
        "Draft proof points and channel-specific variants.",
      ],
      executive: [
        "Draft the strategic value proposition.",
        "Draft message pillars tied to buyer priorities.",
        "Draft proof points suitable for executive buyers.",
      ],
      boardroom: [
        "Draft the enterprise value proposition and category claim.",
        "Draft governed message pillars for cross-team use.",
        "Draft proof points suitable for board/investor communication.",
      ],
    },
    examples: {
      foundation: "\"I help busy parents get dinner on the table without the stress. No prep, no planning, just eat.\"",
      small_business: "\"We handle your books so you never worry about tax season again — trusted by 80+ local businesses.\"",
      business_owner: "\"We turn founder-dependent sales into a repeatable system — proven across 40+ client engagements.\"",
      executive: "\"We give mid-market teams enterprise-grade AI ops without the enterprise headcount — 15% avg cost reduction.\"",
      boardroom: "\"The trusted platform for regional consolidation — proven governance and margin expansion across markets.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/messaging-map",
    status: "architecture",
  },
  {
    id: "content-planning-canvas",
    name: "Content Planning Canvas",
    category: "Market the Business",
    shortDescription: "Plan content that actually supports your goals.",
    whatIsThis:
      "A simple planning canvas connecting each piece of content to a purpose — awareness, trust, or sales — instead of posting without a plan.",
    whyItMatters:
      "Content without a plan becomes a guessing game. Planned content compounds toward a goal instead of just filling a calendar.",
    ownerExecutiveIds: ["marketing-brand"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Plan content with a purpose",
        body: "Let's decide what you want each post or piece of content to do — help people find you, trust you, or buy from you — before you make it.",
      },
      small_business: {
        headline: "Build your content plan",
        body: "A simple plan connecting each content piece to a purpose (reach, trust, or sales), so your content works toward a goal.",
      },
      business_owner: {
        headline: "Build your Content Planning Canvas",
        body: "A structured content plan mapping topics, formats, and cadence to funnel stage, used to keep content output strategic.",
      },
      executive: {
        headline: "Structure the content strategy",
        body: "A structured content strategy mapping topics and formats to funnel stage and strategic priorities, with a defined cadence.",
      },
      boardroom: {
        headline: "Codify the enterprise content strategy",
        body: "A governed enterprise content strategy aligning topics, formats, and cadence to brand and pipeline objectives across teams.",
      },
    },
    instructions: {
      foundation: [
        "Decide what you want people to feel or do after seeing your content.",
        "List a few topics that support that goal.",
        "Decide how often you'll realistically post.",
      ],
      small_business: [
        "Define content goals by funnel stage.",
        "List topics/formats mapped to each goal.",
        "Set a realistic posting cadence.",
      ],
      business_owner: [
        "Define content pillars mapped to funnel stages.",
        "Define formats and cadence by pillar.",
        "Define success metrics per content pillar.",
      ],
      executive: [
        "Define content pillars mapped to strategic priorities.",
        "Define formats, channels, and cadence by pillar.",
        "Define success metrics tied to pipeline impact.",
      ],
      boardroom: [
        "Define enterprise content pillars tied to brand strategy.",
        "Define governed formats, channels, and cadence.",
        "Define success metrics tied to brand and revenue impact.",
      ],
    },
    examples: {
      foundation: "\"I want people to trust me, so I'll share one client story a week.\"",
      small_business: "\"Awareness posts 2x/week, trust-building case study 1x/week, offer post 1x/month.\"",
      business_owner: "\"Top-of-funnel education weekly, mid-funnel case studies biweekly, bottom-funnel offers monthly.\"",
      executive: "\"Thought-leadership content biweekly, tied to pipeline stages and quarterly campaign themes.\"",
      boardroom: "\"Enterprise content calendar aligned to brand pillars and quarterly investor/market narrative.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "calendar",
    futureGenerator: "generate/content-planning-canvas",
    status: "architecture",
  },
  {
    id: "campaign-brief",
    name: "Campaign Brief",
    category: "Market the Business",
    shortDescription: "Plan a launch or promotion before you run it.",
    whatIsThis:
      "A short brief that plans out a launch or promotion in advance: the goal, the timeline, and the message — so it doesn't come together at the last minute.",
    whyItMatters:
      "Launches that are planned in advance convert better and feel less chaotic than ones assembled the week they go live.",
    ownerExecutiveIds: ["marketing-brand"],
    prerequisites: ["messaging-map"],
    recommendedBusinessStages: ["growth"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Plan your launch ahead of time",
        body: "Let's plan out your promotion or launch before it happens — what you want to happen, when, and what you'll say.",
      },
      small_business: {
        headline: "Build your campaign brief",
        body: "A short plan for your promotion — goal, timeline, and key message — so the launch feels organized instead of last-minute.",
      },
      business_owner: {
        headline: "Build your Campaign Brief",
        body: "A structured campaign brief covering objective, timeline, messaging, and channels, used to plan launches in advance.",
      },
      executive: {
        headline: "Structure the campaign strategy brief",
        body: "A structured campaign brief with defined objectives, KPIs, timeline, and channel strategy for a coordinated launch.",
      },
      boardroom: {
        headline: "Codify the enterprise campaign brief",
        body: "A formalized enterprise campaign brief with objectives, KPIs, budget, and multi-channel strategy suitable for governance sign-off.",
      },
    },
    instructions: {
      foundation: [
        "Write down what you want this launch to achieve.",
        "Pick a start and end date.",
        "Write down the main thing you'll say to promote it.",
      ],
      small_business: [
        "Define the campaign goal and target number.",
        "Set the timeline and key milestones.",
        "Draft the core promotional message.",
      ],
      business_owner: [
        "Define the campaign objective and success metrics.",
        "Define timeline, milestones, and channel plan.",
        "Draft messaging and creative direction.",
      ],
      executive: [
        "Define the campaign objective, KPIs, and budget.",
        "Define timeline, milestones, and multi-channel plan.",
        "Draft strategic messaging and measurement plan.",
      ],
      boardroom: [
        "Define the enterprise campaign objective, KPIs, and budget approval path.",
        "Define timeline, milestones, and cross-market channel plan.",
        "Draft governed messaging and a board-level measurement plan.",
      ],
    },
    examples: {
      foundation: "\"Goal: sell 20 spots in my new program. Dates: June 1-15. Message: 'Doors open for two weeks only.'\"",
      small_business: "\"Goal: 30 new signups. Timeline: 3-week promo. Message: 'Founding member pricing, limited time.'\"",
      business_owner: "\"Goal: $50K in new MRR. Timeline: 4-week launch. Channels: email, paid, partner promo.\"",
      executive: "\"Goal: 100 qualified pipeline opportunities. KPIs: CPL, MQL-to-SQL rate. Budget: $40K.\"",
      boardroom: "\"Goal: category-defining launch across 3 markets. Budget: board-approved. KPIs: share-of-voice, pipeline value.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/campaign-brief",
    status: "architecture",
  },
  {
    id: "conversion-test-canvas",
    name: "Conversion Test Canvas",
    category: "Market the Business",
    shortDescription: "Test small changes before betting big on them.",
    whatIsThis:
      "A simple framework for testing one change at a time — a headline, a price, an image — so you learn what actually works instead of guessing.",
    whyItMatters:
      "Guessing what will convert better wastes time and money. A structured test tells you, with real data, what to keep and what to drop.",
    ownerExecutiveIds: ["marketing-brand", "growth"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Test before you commit",
        body: "Let's pick one small thing to try two ways, see which works better, and use that to decide instead of guessing.",
      },
      small_business: {
        headline: "Build your conversion test",
        body: "A simple test comparing one change (a headline, price, or image) against your current version, to see what actually performs better.",
      },
      business_owner: {
        headline: "Build your Conversion Test Canvas",
        body: "A structured test framework: hypothesis, variable, and success metric, prioritized by likely Impact, Confidence, and Ease.",
      },
      executive: {
        headline: "Structure the experimentation framework",
        body: "A structured experimentation framework with hypothesis, control/variant design, and a prioritization model (Impact/Confidence/Ease).",
      },
      boardroom: {
        headline: "Institutionalize the enterprise experimentation program",
        body: "A governed experimentation program with hypothesis-driven testing and a formal prioritization model for enterprise-level decisions.",
      },
    },
    instructions: {
      foundation: [
        "Pick one thing to test (like a headline or a price).",
        "Guess why you think the new version will work better.",
        "Decide how you'll know which one wins.",
      ],
      small_business: [
        "Choose the variable to test.",
        "Write your hypothesis for why it will improve results.",
        "Define the metric and sample size needed to decide.",
      ],
      business_owner: [
        "Define the test variable and hypothesis.",
        "Score the test's likely Impact, Confidence, and Ease.",
        "Define the success metric and decision threshold.",
      ],
      executive: [
        "Define the hypothesis and experimental design.",
        "Score and prioritize against other candidate tests.",
        "Define statistical significance and decision criteria.",
      ],
      boardroom: [
        "Define the hypothesis and enterprise-level experimental design.",
        "Score and prioritize within a governed testing roadmap.",
        "Define significance thresholds and enterprise decision criteria.",
      ],
    },
    examples: {
      foundation: "\"Testing two headlines on my landing page — the one people click more, I keep.\"",
      small_business: "\"Testing $97 vs $127 pricing on the same offer, tracked over 50 visitors each.\"",
      business_owner: "\"Testing a new value-prop headline: high impact, medium confidence, low effort — top of the queue.\"",
      executive: "\"Testing a new pricing page layout across the funnel, statistically powered for a 2-week run.\"",
      boardroom: "\"Testing a new enterprise pricing model in one market before a company-wide rollout decision.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "dashboard-card",
    futureGenerator: "generate/conversion-test-canvas",
    status: "architecture",
  },
  {
    id: "proof-capture-playbook",
    name: "Proof Capture Playbook™",
    category: "Market the Business",
    shortDescription: "A repeatable habit for turning client results into reusable proof.",
    whatIsThis:
      "A guided protocol for capturing a client result — a testimonial, case study, results snapshot, or Proof Library™ entry — close to the moment it happens, instead of trying to remember the details months later when you actually need proof for a sales page or pitch.",
    whyItMatters:
      "Real results happen in this business all the time, but if nothing captures them, they disappear. Without a repeatable habit, every sales page and pitch starts from zero. With one, proof compounds — a growing library you can pull from instead of scrambling to find an old client to ask.",
    ownerExecutiveIds: ["marketing-brand", "growth"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    availableBuildModeIds: ["build-with-ai", "let-ai-do-it", "guided-diy"],
    explanations: {
      foundation: {
        headline: "Don't let your wins disappear",
        body: "Every time you help someone get a real result, let's capture it right then — in their words if you can — so you have real stories ready when you need them, instead of trying to remember later.",
      },
      small_business: {
        headline: "Build your proof-capture habit",
        body: "A simple, repeatable habit for writing down client results as they happen — turning them into testimonials, case studies, or quick stats you can actually use later.",
      },
      business_owner: {
        headline: "Install your Proof Capture Playbook™",
        body: "A repeatable protocol for capturing client outcomes at the moment they happen and converting them into testimonials, case studies, results snapshots, and a running Proof Library™ you can draw from anytime.",
      },
      executive: {
        headline: "Systematize outcome capture and evidence generation",
        body: "A standardized protocol for capturing client outcomes as they occur and converting them into structured proof formats — feeding a compounding evidence library instead of ad hoc, memory-based collection.",
      },
      boardroom: {
        headline: "Codify the enterprise client-outcome evidence protocol",
        body: "A governed protocol for capturing, disclosing, and cataloging client-outcome evidence — producing a compounding, audit-ready proof library that supports sales, capital, and market-positioning claims.",
      },
    },
    instructions: {
      foundation: [
        "Notice when a client gets a real result — a win, a change, a milestone.",
        "Write down what happened while it's fresh: what changed, any numbers, and their own words if you have them.",
        "Ask the client if you can share their story — keep the ask short and easy to say yes to.",
        "Turn what you captured into one form: a short quote, a before/after story, or a single stat.",
        "Save it somewhere you'll actually find it again — your own running list of proof.",
        "Next time you need proof for a sales page or a talk, pull from that list instead of starting over.",
      ],
      small_business: [
        "Watch for the moment a client hits a result worth capturing.",
        "Write it down immediately: the before/after, any numbers, their own words.",
        "Send a short, low-friction request asking permission to share it.",
        "Convert the raw capture into a testimonial, case study, or results snapshot.",
        "File it into one running Proof Library instead of a scattered folder.",
        "Reuse entries from the library whenever you're building sales or marketing material.",
      ],
      business_owner: [
        "Define the trigger moment: what counts as a 'result worth capturing' in your business.",
        "Capture the raw outcome immediately — specifics, numbers, direct client language.",
        "Send a standardized, low-friction testimonial/permission request.",
        "Convert each capture into one of: testimonial, case study, results snapshot.",
        "File every output into a single running Proof Library™, indexed and findable.",
        "Build a habit of pulling from the Proof Library first, before ever asking a client for something new.",
      ],
      executive: [
        "Define the outcome-capture trigger criteria across your delivery pipeline.",
        "Standardize immediate-capture documentation: outcome, metrics, verbatim client language.",
        "Deploy a standardized, low-friction consent/testimonial-request protocol.",
        "Route each capture into a defined output format: testimonial, case study, or results snapshot.",
        "Maintain a centralized, indexed Proof Library™ as the single source of evidence.",
        "Require sales and marketing to source proof from the library before requesting new client input.",
      ],
      boardroom: [
        "Establish enterprise-wide criteria for what constitutes a capturable client outcome.",
        "Mandate immediate, standardized outcome documentation at the point of delivery.",
        "Govern a standardized disclosure/consent protocol for testimonial and case-study use.",
        "Codify the output taxonomy: testimonial, case study, results snapshot, library entry.",
        "Maintain a centralized, audit-ready Proof Library™ as enterprise evidentiary infrastructure.",
        "Require every sales, marketing, and investor-facing claim to be sourced from the governed library.",
      ],
    },
    examples: {
      foundation:
        "\"My client hit her income goal — I wrote down her exact words that night and asked if I could share her story. Now it's saved in my proof folder.\"",
      small_business:
        "\"Client closed 3 new deals using our template. Captured the number and a quote same week, turned it into a one-line results snapshot for the website.\"",
      business_owner:
        "\"Standardized 48-hour capture window after every milestone delivery → testimonial request → filed into the Proof Library™ → pulled for the next sales page rewrite.\"",
      executive:
        "\"Capture protocol triggers at every delivery milestone, feeding a centralized Proof Library™ that sales now sources from instead of cold-requesting new testimonials per deal.\"",
      boardroom:
        "\"Enterprise-wide outcome-capture protocol feeding an audit-ready evidence library, used to substantiate marketing claims and support investor-facing proof of traction.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "editable-document",
    futureGenerator: "generate/proof-capture-playbook",
    status: "architecture",
  },

  // ---------------------------------------------------------------------
  // OPERATE THE BUSINESS
  // ---------------------------------------------------------------------
  {
    id: "business-scorecard",
    name: "Business Scorecard",
    category: "Operate the Business",
    shortDescription: "See your key business numbers in one place.",
    whatIsThis:
      "A one-page scorecard tracking the handful of numbers that actually tell you if the business is healthy — revenue, margin, and a few key operating metrics.",
    whyItMatters:
      "Without a scorecard, you're running on gut feeling. A scorecard tells you, in seconds, whether things are on track or need attention.",
    ownerExecutiveIds: ["finance", "growth"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "See your numbers at a glance",
        body: "Let's pick a few simple numbers — like money in, money kept, and new clients — and check them regularly so you always know how things are going.",
      },
      small_business: {
        headline: "Build your business scorecard",
        body: "A simple, regularly-updated list of key numbers — revenue, profit, and a couple of operating metrics — so you can spot problems early.",
      },
      business_owner: {
        headline: "Build your Business Scorecard",
        body: "A structured scorecard tracking revenue, margin, and operating KPIs on a consistent cadence, giving an at-a-glance health check.",
      },
      executive: {
        headline: "Structure the executive KPI scorecard",
        body: "A structured executive scorecard tracking revenue, margin, growth rate, and leading operational indicators on a recurring cadence.",
      },
      boardroom: {
        headline: "Codify the enterprise performance scorecard",
        body: "A governed board-level scorecard tracking revenue, margin, growth, and strategic KPIs for recurring performance review.",
      },
    },
    instructions: {
      foundation: [
        "Pick 3-5 numbers that matter most to you.",
        "Write down where they stand today.",
        "Check them again on the same day each week or month.",
      ],
      small_business: [
        "Select 4-6 key metrics (revenue, margin, leads, retention).",
        "Record current values.",
        "Review on a fixed weekly or monthly cadence.",
      ],
      business_owner: [
        "Select KPIs across revenue, margin, and operations.",
        "Set targets and record actuals.",
        "Review on a fixed cadence and flag variances.",
      ],
      executive: [
        "Select executive-level KPIs tied to strategic priorities.",
        "Set targets, record actuals, and calculate variance.",
        "Review on a fixed executive cadence and escalate risks.",
      ],
      boardroom: [
        "Select board-level KPIs tied to enterprise strategy.",
        "Set targets, record actuals, and calculate variance.",
        "Review at board cadence with formal risk escalation.",
      ],
    },
    examples: {
      foundation: "\"Revenue: $4,200. Money kept: $2,800. New clients: 3. Checked every Monday.\"",
      small_business: "\"MRR: $9K. Margin: 55%. New leads: 12. Retention: 90%. Reviewed monthly.\"",
      business_owner: "\"ARR: $480K. Gross margin: 62%. CAC: $340. Churn: 4%. Reviewed biweekly.\"",
      executive: "\"ARR: $3.2M. EBITDA margin: 18%. Growth: 14% QoQ. NRR: 108%. Reviewed weekly.\"",
      boardroom: "\"Revenue: $18M. EBITDA margin: 22%. YoY growth: 30%. NRR: 115%. Reviewed at each board meeting.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "dashboard-card",
    futureGenerator: "generate/business-scorecard",
    status: "architecture",
  },
  {
    id: "initiative-brief",
    name: "Initiative Brief",
    category: "Operate the Business",
    shortDescription: "Give any project a clear goal, owner, and finish line.",
    whatIsThis:
      "A short brief for any project or initiative: what it's for, who owns it, and what \"done\" looks like — so nothing drifts without direction.",
    whyItMatters:
      "Projects without a brief tend to sprawl, stall, or quietly get abandoned. A brief keeps everyone aligned on the same finish line.",
    ownerExecutiveIds: ["operations"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Give your project a clear finish line",
        body: "Let's write down what this project is for, who's in charge of it, and what it looks like when it's done.",
      },
      small_business: {
        headline: "Write your initiative brief",
        body: "A quick one-pager for any project — the goal, the owner, and what \"finished\" looks like — so it doesn't stall out.",
      },
      business_owner: {
        headline: "Build your Initiative Brief",
        body: "A structured brief defining the initiative's goal, owner, scope, and definition of done, used to keep cross-team work aligned.",
      },
      executive: {
        headline: "Structure the strategic initiative brief",
        body: "A structured initiative brief with objective, owner, resourcing, and success criteria, used to govern strategic project execution.",
      },
      boardroom: {
        headline: "Codify the enterprise initiative charter",
        body: "A formalized initiative charter with objective, ownership, resourcing, and success criteria suitable for governance-level tracking.",
      },
    },
    instructions: {
      foundation: [
        "Write what this project is trying to accomplish.",
        "Write down who's responsible for it.",
        "Write what \"done\" looks like.",
      ],
      small_business: [
        "Define the project goal and why it matters.",
        "Assign a clear owner.",
        "Define the completion criteria.",
      ],
      business_owner: [
        "Define objective, scope, and stakeholders.",
        "Assign owner and supporting roles.",
        "Define success criteria and timeline.",
      ],
      executive: [
        "Define strategic objective and resourcing requirements.",
        "Assign accountable owner and escalation path.",
        "Define success criteria, timeline, and risk factors.",
      ],
      boardroom: [
        "Define the enterprise objective and strategic rationale.",
        "Assign governance-level ownership and reporting cadence.",
        "Define success criteria, milestones, and risk oversight.",
      ],
    },
    examples: {
      foundation: "\"Goal: launch new website. Owner: me. Done when: live and clients can book online.\"",
      small_business: "\"Goal: onboard new CRM. Owner: office manager. Done when: all clients migrated and staff trained.\"",
      business_owner: "\"Goal: launch tier-2 offer. Owner: sales lead. Done when: 5 sales closed at new price point.\"",
      executive: "\"Goal: implement new ops platform. Owner: COO. Done when: 100% of workflows migrated, error rate <1%.\"",
      boardroom: "\"Goal: enter new market segment. Owner: CEO + exec sponsor. Done when: revenue target hit within 2 quarters.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/initiative-brief",
    status: "architecture",
  },
  {
    id: "accountability-map",
    name: "Accountability Map",
    category: "Operate the Business",
    shortDescription: "Make it clear who owns what.",
    whatIsThis:
      "A simple map showing who leads, who's core to the work, who supports, and who just needs to stay informed — for any project or team effort.",
    whyItMatters:
      "Unclear ownership is one of the most common reasons work stalls. This makes accountability visible instead of assumed.",
    ownerExecutiveIds: ["people-culture", "operations"],
    recommendedBusinessStages: ["scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Make it clear who's doing what",
        body: "Let's list who's leading this, who's actually doing the work, who's helping out, and who just needs updates.",
      },
      small_business: {
        headline: "Build your accountability map",
        body: "A short list of roles — lead, core team, support, and who to keep updated — so nobody's confused about who owns what.",
      },
      business_owner: {
        headline: "Build your Accountability Map",
        body: "A structured map assigning lead, core, support, and stakeholder roles for any initiative, removing ambiguity about ownership.",
      },
      executive: {
        headline: "Structure the RACI-style accountability model",
        body: "A structured accountability model (Lead/Core/Support/Stakeholder) used to remove ambiguity on cross-functional initiatives.",
      },
      boardroom: {
        headline: "Formalize the enterprise accountability framework",
        body: "A governed accountability framework used across the organization to ensure clear ownership on all cross-functional initiatives.",
      },
    },
    instructions: {
      foundation: [
        "Name who's leading this effort.",
        "Name who's doing most of the hands-on work.",
        "Name who just needs to be kept in the loop.",
      ],
      small_business: [
        "Assign a lead for the initiative.",
        "List core contributors and support roles.",
        "List who needs to stay informed.",
      ],
      business_owner: [
        "Assign lead and core team roles.",
        "Assign support roles and their scope.",
        "Define the stakeholder communication plan.",
      ],
      executive: [
        "Assign lead accountability with decision rights.",
        "Assign core/support roles across functions.",
        "Define stakeholder reporting cadence and escalation path.",
      ],
      boardroom: [
        "Assign governance-level lead accountability.",
        "Assign core/support roles across the organization.",
        "Define board/stakeholder reporting cadence and oversight.",
      ],
    },
    examples: {
      foundation: "\"Lead: me. Core: my assistant. Support: my web designer. Keep informed: my mastermind group.\"",
      small_business: "\"Lead: ops manager. Core: 2 staff. Support: outside bookkeeper. Informed: owner.\"",
      business_owner: "\"Lead: VP Ops. Core: ops team. Support: finance. Stakeholders: leadership team.\"",
      executive: "\"Lead: COO. Core: cross-functional squad. Support: legal/finance. Stakeholders: exec team.\"",
      boardroom: "\"Lead: CEO with board sponsor. Core: executive team. Support: advisors. Stakeholders: full board.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/accountability-map",
    status: "architecture",
  },
  {
    id: "sop-playbook-template",
    name: "SOP / Playbook Template",
    category: "Operate the Business",
    shortDescription: "Write down how a task gets done, so anyone can do it.",
    whatIsThis:
      "A repeatable template for documenting how a task or process is done, step by step, so it doesn't live only in your head.",
    whyItMatters:
      "If a process only exists in your head, the business can't run without you. Written SOPs make delegation and consistency possible.",
    ownerExecutiveIds: ["operations"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Write down how you do a task",
        body: "Let's write out, step by step, how you do a task you repeat often — so someone else could follow it too.",
      },
      small_business: {
        headline: "Build your SOP template",
        body: "A simple, repeatable format for documenting a process step by step, so it can be handed off instead of staying stuck with you.",
      },
      business_owner: {
        headline: "Build your SOP / Playbook Template",
        body: "A structured SOP template — purpose, steps, tools, and exceptions — used to make any process delegable and consistent.",
      },
      executive: {
        headline: "Structure the operational playbook format",
        body: "A structured operational playbook format covering purpose, procedure, systems, and exception handling for consistent execution at scale.",
      },
      boardroom: {
        headline: "Codify the enterprise SOP framework",
        body: "A governed enterprise SOP framework used to standardize critical processes across teams and support audit/compliance needs.",
      },
    },
    instructions: {
      foundation: [
        "Write down the task's purpose in one sentence.",
        "List each step in the exact order you do it.",
        "Note any tools or logins needed.",
      ],
      small_business: [
        "State the process purpose and who owns it.",
        "List the steps in order, with enough detail to follow.",
        "Note tools, templates, or exceptions.",
      ],
      business_owner: [
        "Define purpose, owner, and frequency.",
        "Document steps with enough detail for a new hire.",
        "Document tools, exceptions, and quality checks.",
      ],
      executive: [
        "Define purpose, owner, and strategic importance.",
        "Document the procedure with role-based responsibilities.",
        "Document systems, exception handling, and quality controls.",
      ],
      boardroom: [
        "Define purpose, ownership, and compliance relevance.",
        "Document the governed procedure across teams.",
        "Document systems, controls, and audit trail requirements.",
      ],
    },
    examples: {
      foundation: "\"How I onboard a new client: send welcome email, book kickoff call, add to project tracker.\"",
      small_business: "\"How we process refunds: verify request, check policy, issue refund in system, log in spreadsheet.\"",
      business_owner: "\"How we onboard a new hire: IT setup, role training checklist, 30/60/90 check-ins, tool access audit.\"",
      executive: "\"How we run a monthly ops review: pull KPI dashboard, flag variances, assign owners, track to resolution.\"",
      boardroom: "\"How we run quarterly board reporting: compile financials, risk review, governance sign-off, distribute.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "checklist",
    futureGenerator: "generate/sop-playbook-template",
    status: "architecture",
  },
  {
    id: "tool-stack-audit",
    name: "Tool Stack Audit",
    category: "Operate the Business",
    shortDescription: "See every tool you pay for, and whether it's earning its keep.",
    whatIsThis:
      "A simple audit of every software tool and subscription you're paying for, what it's used for, and whether it's actually worth keeping.",
    whyItMatters:
      "Unused or overlapping subscriptions quietly drain cash every month. An audit turns invisible spend into a visible, decidable list.",
    ownerExecutiveIds: ["finance", "operations"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "See what you're actually paying for",
        body: "Let's list every tool or app you pay for each month, what it's for, and whether you'd miss it if it disappeared.",
      },
      small_business: {
        headline: "Audit your tool stack",
        body: "A simple list of your paid tools, their cost, and their usage, so you can spot the ones that aren't earning their keep.",
      },
      business_owner: {
        headline: "Build your Tool Stack Audit",
        body: "A structured audit of every tool/subscription — cost, usage, and overlap — used to identify consolidation and savings opportunities.",
      },
      executive: {
        headline: "Structure the technology spend audit",
        body: "A structured technology spend audit identifying redundant tools, underutilized licenses, and consolidation opportunities.",
      },
      boardroom: {
        headline: "Institutionalize the enterprise technology audit",
        body: "A governed enterprise technology spend audit used to inform budget planning, vendor consolidation, and cost-efficiency initiatives.",
      },
    },
    instructions: {
      foundation: [
        "List every app or tool you pay for monthly.",
        "Write down what each one is actually used for.",
        "Circle any you barely use or could replace with something free.",
      ],
      small_business: [
        "List all tools, monthly cost, and primary use.",
        "Note usage frequency for each.",
        "Flag redundant or underused tools for cancellation.",
      ],
      business_owner: [
        "List tools, cost, owner, and usage data.",
        "Identify overlapping functionality across tools.",
        "Flag consolidation or cancellation candidates with savings estimate.",
      ],
      executive: [
        "Inventory tools, cost, owner, and utilization data.",
        "Identify redundancy and integration gaps across the stack.",
        "Build a consolidation plan with projected savings.",
      ],
      boardroom: [
        "Inventory enterprise technology spend by department.",
        "Identify redundancy, risk, and integration gaps enterprise-wide.",
        "Build a governed consolidation plan with board-level savings targets.",
      ],
    },
    examples: {
      foundation: "\"Paying for 2 scheduling apps but only using one — cancel the other, save $30/month.\"",
      small_business: "\"Two overlapping email tools costing $80/mo combined — consolidate to one, save $40/mo.\"",
      business_owner: "\"Three project tools across teams, 40% overlap — consolidate to one platform, save $600/mo.\"",
      executive: "\"Five disconnected analytics tools — consolidate into one stack, save $4K/mo and improve data quality.\"",
      boardroom: "\"Enterprise-wide tool sprawl across 12 departments — consolidation plan projects $250K annual savings.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "spreadsheet",
    futureGenerator: "generate/tool-stack-audit",
    status: "architecture",
  },

  // ---------------------------------------------------------------------
  // GROW THE BUSINESS
  // ---------------------------------------------------------------------
  {
    id: "28-day-focus-plan",
    name: "28-Day Focus Plan",
    category: "Grow the Business",
    shortDescription: "Plan the next 28 days around one clear priority.",
    whatIsThis:
      "A focused plan for the next 28 days, built around one clear priority instead of a scattered list of everything you could possibly do.",
    whyItMatters:
      "Trying to do everything at once usually means nothing gets finished. A focused 28-day window creates real momentum on what matters most.",
    ownerExecutiveIds: ["growth", "strategy"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Focus the next 28 days on one thing",
        body: "Let's pick the one priority that matters most right now, and map out what you'll do each week for the next 28 days to make progress on it.",
      },
      small_business: {
        headline: "Build your 28-day focus plan",
        body: "A simple plan for the next 28 days centered on one priority, broken into weekly actions so it actually gets done.",
      },
      business_owner: {
        headline: "Build your 28-Day Focus Plan",
        body: "A structured 28-day plan built around a single priority, with weekly milestones and a defined success metric.",
      },
      executive: {
        headline: "Structure the 28-day execution sprint",
        body: "A structured execution sprint focused on a single strategic priority, with weekly milestones and leading indicators.",
      },
      boardroom: {
        headline: "Codify the enterprise focus sprint",
        body: "A governed 28-day execution sprint aligned to a single enterprise priority, with milestone reporting suitable for leadership review.",
      },
    },
    instructions: {
      foundation: [
        "Pick the one thing that matters most this month.",
        "Break it into 4 weekly steps.",
        "Decide how you'll know it worked.",
      ],
      small_business: [
        "Select the single priority for the next 28 days.",
        "Define weekly milestones toward it.",
        "Define the success metric.",
      ],
      business_owner: [
        "Select the priority tied to your current growth bottleneck.",
        "Define weekly milestones and owners.",
        "Define the success metric and review cadence.",
      ],
      executive: [
        "Select the priority tied to the most material strategic constraint.",
        "Define weekly milestones, owners, and dependencies.",
        "Define leading indicators and a review cadence.",
      ],
      boardroom: [
        "Select the enterprise priority tied to the highest-value constraint.",
        "Define weekly milestones and cross-functional dependencies.",
        "Define leading indicators suitable for leadership reporting.",
      ],
    },
    examples: {
      foundation: "\"Priority: get 5 new clients. Week 1: reach out to 20 past leads. Week 2-4: follow up and close.\"",
      small_business: "\"Priority: launch referral program. Week 1: build script. Week 2: launch. Weeks 3-4: track results.\"",
      business_owner: "\"Priority: reduce founder-dependent sales. Weeks 1-4: hire, train, and hand off first 5 deals.\"",
      executive: "\"Priority: close the ops bottleneck. Weeks 1-4: audit, redesign, pilot, and measure the new workflow.\"",
      boardroom: "\"Priority: validate new-market entry. Weeks 1-4: pilot, gather data, present go/no-go to the board.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "calendar",
    futureGenerator: "generate/28-day-focus-plan",
    status: "architecture",
  },
  {
    id: "good-better-best-outcome-ladder",
    name: "Good/Better/Best Outcome Ladder™",
    category: "Grow the Business",
    shortDescription: "Define what success looks like at three different levels.",
    whatIsThis:
      "A simple ladder defining three levels of success for any goal — a solid \"good\" outcome, a strong \"better\" outcome, and an ambitious \"best\" outcome.",
    whyItMatters:
      "Aiming for only one fixed outcome can feel like failure if you fall short, even when real progress happened. This reframes success as a range, not a single bar.",
    ownerExecutiveIds: ["growth"],
    recommendedBusinessStages: ALL_BUSINESS_STAGES,
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Give yourself three ways to win",
        body: "Instead of one pass/fail goal, let's define a \"good,\" \"better,\" and \"best\" version of success — so any real progress still counts as a win.",
      },
      small_business: {
        headline: "Build your outcome ladder",
        body: "Three tiers of success for your goal — good, better, best — so you have a realistic target and a stretch target, not just one number.",
      },
      business_owner: {
        headline: "Build your Good/Better/Best Outcome Ladder™",
        body: "A structured outcome range with defined good/better/best thresholds, used to plan and communicate realistic vs. stretch targets.",
      },
      executive: {
        headline: "Structure the outcome-range framework",
        body: "A structured outcome-range framework (good/better/best) used for scenario planning and setting realistic vs. stretch KPIs.",
      },
      boardroom: {
        headline: "Codify the enterprise outcome-range model",
        body: "A governed outcome-range model (good/better/best) used for board-level scenario planning and forecast communication.",
      },
    },
    instructions: {
      foundation: [
        "Write down a \"good\" outcome you'd be genuinely happy with.",
        "Write down a \"better\" outcome that would feel great.",
        "Write down a \"best\" outcome that would be amazing.",
      ],
      small_business: [
        "Define the good-outcome threshold and why it counts as a win.",
        "Define the better-outcome threshold.",
        "Define the best-outcome (stretch) threshold.",
      ],
      business_owner: [
        "Define good/better/best thresholds with supporting metrics.",
        "Define what changes operationally at each tier.",
        "Define which tier you'll actually plan resources around.",
      ],
      executive: [
        "Define good/better/best thresholds tied to strategic scenarios.",
        "Define resourcing and risk implications at each tier.",
        "Define the base-case tier used for forecasting.",
      ],
      boardroom: [
        "Define good/better/best thresholds tied to enterprise scenarios.",
        "Define capital and resourcing implications at each tier.",
        "Define the base-case tier used for board forecasting.",
      ],
    },
    examples: {
      foundation: "\"Good: 2 new clients. Better: 4 new clients. Best: 6 new clients and a waitlist.\"",
      small_business: "\"Good: $8K MRR. Better: $10K MRR. Best: $12K MRR plus one new referral partner.\"",
      business_owner: "\"Good: 10% growth. Better: 18% growth. Best: 25% growth with margin intact.\"",
      executive: "\"Good: hit forecast. Better: beat forecast by 10%. Best: beat forecast by 20% with NRR gain.\"",
      boardroom: "\"Good: meet guidance. Better: beat guidance 10%. Best: beat guidance 20% and re-rate valuation.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/good-better-best-outcome-ladder",
    status: "architecture",
  },
  {
    id: "priority-clarity-score",
    name: "Priority Clarity Score™",
    category: "Grow the Business",
    shortDescription: "Score your options so the right one is obvious.",
    whatIsThis:
      "A simple scoring method (Impact, Confidence, Ease) for comparing competing priorities, so the choice is based on more than gut feeling alone.",
    whyItMatters:
      "When everything feels important, nothing gets prioritized. A quick score turns a foggy decision into an obvious one.",
    ownerExecutiveIds: ["strategy", "growth"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Figure out what to do first",
        body: "Let's score each option on how much it would help, how sure you are it will work, and how easy it is — then the best next step becomes obvious.",
      },
      small_business: {
        headline: "Score your priorities",
        body: "A quick way to compare options on impact, confidence, and ease, so you can pick the highest-leverage one to do first.",
      },
      business_owner: {
        headline: "Build your Priority Clarity Score™",
        body: "A structured Impact/Confidence/Ease scoring method used to rank competing priorities and remove decision paralysis.",
      },
      executive: {
        headline: "Structure the prioritization scoring model",
        body: "A structured I.C.E. (Impact/Confidence/Ease) prioritization model used to rank strategic initiatives objectively.",
      },
      boardroom: {
        headline: "Codify the enterprise prioritization framework",
        body: "A governed prioritization scoring framework used to rank enterprise initiatives and allocate capital and attention.",
      },
    },
    instructions: {
      foundation: [
        "List the options you're considering.",
        "Score each 1-10 on impact, confidence, and ease.",
        "Add the scores and pick the highest.",
      ],
      small_business: [
        "List your competing priorities.",
        "Score each on Impact, Confidence, and Ease (1-10).",
        "Rank by total score and commit to the top one.",
      ],
      business_owner: [
        "List candidate initiatives with brief context.",
        "Score each on I.C.E. with supporting rationale.",
        "Rank and select based on total score and capacity.",
      ],
      executive: [
        "List strategic initiatives with business case context.",
        "Score each on I.C.E. with data-backed rationale.",
        "Rank and allocate resources to the top-scoring initiatives.",
      ],
      boardroom: [
        "List enterprise initiatives with strategic rationale.",
        "Score each on I.C.E. with board-level evidence.",
        "Rank and allocate capital to the top-scoring initiatives.",
      ],
    },
    examples: {
      foundation: "\"New website: Impact 7, Confidence 6, Ease 4 = 17. Referral ask: Impact 8, Confidence 8, Ease 9 = 25. Do the referral ask first.\"",
      small_business: "\"Paid ads: 6+5+5=16. Partner outreach: 8+7+8=23. Partner outreach wins.\"",
      business_owner: "\"New hire: 9+6+3=18. Process fix: 7+8+8=23. Fix the process first, hire second.\"",
      executive: "\"New market entry: 9+5+3=17. Pricing optimization: 8+8+7=23. Optimize pricing before expanding.\"",
      boardroom: "\"Acquisition: 9+5+2=16. Operational efficiency program: 8+8+7=23. Prioritize efficiency before M&A.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "spreadsheet",
    futureGenerator: "generate/priority-clarity-score",
    status: "architecture",
  },
  {
    id: "growth-plan",
    name: "Growth Plan",
    category: "Grow the Business",
    shortDescription: "Chart the path from where you are to where you want to be.",
    whatIsThis:
      "A structured plan connecting your current numbers to your target numbers, with the specific levers you'll pull to close the gap.",
    whyItMatters:
      "A revenue goal without a plan for how to get there is just a hope. This connects the target to specific, ownable actions.",
    ownerExecutiveIds: ["growth", "strategy"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Plan your path to growth",
        body: "Let's connect where you are today to where you want to be, with a few specific things you'll do to close that gap.",
      },
      small_business: {
        headline: "Build your growth plan",
        body: "A plan linking your current numbers to your target numbers, with the specific actions that will close the gap.",
      },
      business_owner: {
        headline: "Build your Growth Plan",
        body: "A structured plan connecting current-state metrics to target metrics via specific growth levers and owners.",
      },
      executive: {
        headline: "Structure the strategic growth plan",
        body: "A structured growth plan identifying the levers, resourcing, and timeline required to close the gap between current and target performance.",
      },
      boardroom: {
        headline: "Codify the enterprise growth strategy",
        body: "A governed enterprise growth strategy identifying levers, capital requirements, and timeline to close the gap to board-approved targets.",
      },
    },
    instructions: {
      foundation: [
        "Write down where your numbers are today.",
        "Write down where you want them to be.",
        "List 2-3 things you'll do to close that gap.",
      ],
      small_business: [
        "Define current revenue/client numbers.",
        "Define target numbers and timeframe.",
        "List the specific growth levers you'll pull.",
      ],
      business_owner: [
        "Define current-state metrics with context.",
        "Define target metrics and timeframe.",
        "Define growth levers, owners, and resourcing needs.",
      ],
      executive: [
        "Define current-state performance with trend data.",
        "Define target performance tied to strategic goals.",
        "Define levers, resourcing, timeline, and risk factors.",
      ],
      boardroom: [
        "Define current enterprise performance with trend data.",
        "Define board-approved target performance.",
        "Define levers, capital requirements, timeline, and risk factors.",
      ],
    },
    examples: {
      foundation: "\"Today: $3K/mo. Goal: $6K/mo. Plan: raise prices, ask for referrals, post twice a week.\"",
      small_business: "\"Today: $9K MRR. Goal: $15K MRR. Plan: launch referral program, add upsell tier.\"",
      business_owner: "\"Today: $480K ARR. Goal: $750K ARR. Plan: hire a closer, raise prices 10%, launch partner channel.\"",
      executive: "\"Today: $3.2M ARR. Goal: $5M ARR. Plan: expand into 1 new segment, improve NRR via CS investment.\"",
      boardroom: "\"Today: $18M revenue. Goal: $30M. Plan: 2 tuck-in acquisitions, margin expansion, new-market entry.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/growth-plan",
    status: "architecture",
  },
  {
    id: "long-term-horizon-map",
    name: "Long-Term Horizon Map",
    category: "Grow the Business",
    shortDescription: "Zoom out and map where this business is headed over years, not weeks.",
    whatIsThis:
      "A zoomed-out map of your business over the next several years — key milestones, transitions, and the eventual destination.",
    whyItMatters:
      "Staying heads-down in daily tasks can mean years pass without deliberate direction. This creates space to zoom out and steer intentionally.",
    ownerExecutiveIds: ["growth", "strategy"],
    recommendedBusinessStages: ["scale", "legacy"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Zoom out on the next few years",
        body: "Let's step back from the day-to-day and map out where you want your business to be in one year, three years, and five years.",
      },
      small_business: {
        headline: "Map your long-term horizon",
        body: "A simple map of key milestones over the next several years, so you're steering toward something intentional, not just reacting week to week.",
      },
      business_owner: {
        headline: "Build your Long-Term Horizon Map",
        body: "A structured multi-year map of milestones and transitions, used to keep near-term decisions aligned with long-term direction.",
      },
      executive: {
        headline: "Structure the multi-year strategic roadmap",
        body: "A structured multi-year roadmap identifying strategic milestones, transitions, and inflection points across the horizon.",
      },
      boardroom: {
        headline: "Codify the enterprise long-range plan",
        body: "A governed long-range enterprise roadmap identifying strategic milestones, transitions, and capital events across the horizon.",
      },
    },
    instructions: {
      foundation: [
        "Write what you want true in 1 year.",
        "Write what you want true in 3 years.",
        "Write what you want true in 5 years.",
      ],
      small_business: [
        "Define 1-year, 3-year, and 5-year milestones.",
        "Note any major transitions expected (team, offer, market).",
        "Identify the first step toward the nearest milestone.",
      ],
      business_owner: [
        "Define milestone targets across 1/3/5-year horizons.",
        "Define expected transitions (team, systems, ownership).",
        "Define near-term actions tied to the first milestone.",
      ],
      executive: [
        "Define strategic milestones across the multi-year horizon.",
        "Define expected inflection points and transitions.",
        "Define near-term strategic actions tied to the roadmap.",
      ],
      boardroom: [
        "Define enterprise milestones across the long-range horizon.",
        "Define expected capital events and strategic transitions.",
        "Define near-term board-level actions tied to the roadmap.",
      ],
    },
    examples: {
      foundation: "\"Year 1: steady $5K/mo. Year 3: small team, $15K/mo. Year 5: own a studio space.\"",
      small_business: "\"Year 1: $150K rev. Year 3: $400K rev, 2 hires. Year 5: second location.\"",
      business_owner: "\"Year 1: $750K ARR. Year 3: $2M ARR, leadership team in place. Year 5: exit-ready.\"",
      executive: "\"Year 1: $5M ARR. Year 3: $15M ARR via 2 new segments. Year 5: platform positioning for acquisition interest.\"",
      boardroom: "\"Year 1: $25M revenue. Year 3: $60M via M&A. Year 5: IPO-readiness or strategic exit evaluation.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/long-term-horizon-map",
    status: "architecture",
  },

  // ---------------------------------------------------------------------
  // BUILD THE TEAM
  // ---------------------------------------------------------------------
  {
    id: "role-scorecard",
    name: "Role Scorecard",
    category: "Build the Team",
    shortDescription: "Define what success looks like in a role before you hire for it.",
    whatIsThis:
      "A one-page definition of what a role is actually accountable for and what success looks like in it, before you ever post the job.",
    whyItMatters:
      "Hiring against a vague job description leads to mismatched hires. A scorecard defines success clearly, for you and the candidate.",
    ownerExecutiveIds: ["people-culture"],
    recommendedBusinessStages: ["scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Know what success looks like before you hire",
        body: "Let's write down what this role is really responsible for and what \"doing a great job\" would actually look like.",
      },
      small_business: {
        headline: "Build your role scorecard",
        body: "A short definition of the role's key responsibilities and what success looks like, so hiring and reviewing are based on something concrete.",
      },
      business_owner: {
        headline: "Build your Role Scorecard",
        body: "A structured scorecard defining mission, outcomes, and competencies for a role — the foundation for hiring and performance review.",
      },
      executive: {
        headline: "Structure the role accountability scorecard",
        body: "A structured role scorecard defining mission, measurable outcomes, and competencies, used to align hiring and performance management.",
      },
      boardroom: {
        headline: "Codify the enterprise role-accountability framework",
        body: "A governed role-accountability framework defining mission, outcomes, and competencies used consistently across leadership hiring.",
      },
    },
    instructions: {
      foundation: [
        "Write the role's main purpose in one sentence.",
        "List 3 things this person needs to accomplish.",
        "List 2-3 qualities that would make someone great at it.",
      ],
      small_business: [
        "Define the role's mission and reporting line.",
        "Define 3-5 measurable outcomes.",
        "Define key competencies needed to succeed.",
      ],
      business_owner: [
        "Define role mission, scope, and reporting structure.",
        "Define measurable outcomes with target metrics.",
        "Define competencies and cultural fit criteria.",
      ],
      executive: [
        "Define role mission tied to organizational strategy.",
        "Define measurable outcomes with KPI targets.",
        "Define leadership competencies and success indicators.",
      ],
      boardroom: [
        "Define role mission tied to enterprise strategy.",
        "Define measurable outcomes with board-relevant KPIs.",
        "Define executive competencies and governance fit criteria.",
      ],
    },
    examples: {
      foundation: "\"Purpose: keep clients happy. Must do: respond within a day, resolve issues, get 5-star reviews.\"",
      small_business: "\"Purpose: run daily ops. Outcomes: on-time deliveries, <2% error rate, weekly reporting.\"",
      business_owner: "\"Purpose: own client retention. Outcomes: 90%+ retention, NPS 8+, quarterly QBRs delivered.\"",
      executive: "\"Purpose: own P&L for the division. Outcomes: 15% YoY growth, margin targets hit, team retention 90%+.\"",
      boardroom: "\"Purpose: own enterprise growth strategy. Outcomes: board-approved targets hit, governance standards met.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "pdf",
    futureGenerator: "generate/role-scorecard",
    status: "architecture",
  },
  {
    id: "hiring-plan",
    name: "Hiring Plan",
    category: "Build the Team",
    shortDescription: "Plan who you need to hire and when.",
    whatIsThis:
      "A short plan mapping out which roles you need to fill, in what order, and roughly when — instead of hiring reactively under pressure.",
    whyItMatters:
      "Reactive hiring (only hiring once you're desperate) tends to produce rushed, mismatched decisions. A plan lets you hire ahead of the need.",
    ownerExecutiveIds: ["people-culture"],
    recommendedBusinessStages: ["scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Plan your next hires ahead of time",
        body: "Let's figure out which roles you'll need to fill next, in what order, so you're not scrambling to hire when things get overwhelming.",
      },
      small_business: {
        headline: "Build your hiring plan",
        body: "A simple sequence of upcoming roles to fill, prioritized by need, so hiring happens on purpose instead of in a panic.",
      },
      business_owner: {
        headline: "Build your Hiring Plan",
        body: "A structured hiring plan sequencing roles by priority, budget, and timeline, tied to your growth trajectory.",
      },
      executive: {
        headline: "Structure the workforce hiring plan",
        body: "A structured workforce plan sequencing roles by strategic priority, budget, and organizational design implications.",
      },
      boardroom: {
        headline: "Codify the enterprise workforce plan",
        body: "A governed enterprise workforce plan sequencing roles by strategic priority, budget approval, and organizational design.",
      },
    },
    instructions: {
      foundation: [
        "List the roles you think you'll need next.",
        "Put them in order of urgency.",
        "Estimate roughly when and what you could pay.",
      ],
      small_business: [
        "List needed roles with rationale.",
        "Prioritize by business impact.",
        "Estimate timeline and budget per role.",
      ],
      business_owner: [
        "List needed roles tied to growth bottlenecks.",
        "Prioritize by ROI and urgency.",
        "Define timeline, budget, and sourcing approach.",
      ],
      executive: [
        "List roles tied to strategic capacity gaps.",
        "Prioritize by organizational design impact.",
        "Define timeline, budget, and executive sourcing strategy.",
      ],
      boardroom: [
        "List roles tied to enterprise strategic gaps.",
        "Prioritize by board-approved organizational design.",
        "Define timeline, budget approval path, and sourcing strategy.",
      ],
    },
    examples: {
      foundation: "\"Next hire: part-time assistant, within 2 months, around $20/hr.\"",
      small_business: "\"1) Office manager (Q2). 2) Second technician (Q3). Budget: $45K + $38K.\"",
      business_owner: "\"1) Sales closer (next 60 days). 2) Ops lead (Q3). Combined budget: $140K.\"",
      executive: "\"1) VP Sales (Q1). 2) Head of Ops (Q2). 3) Finance lead (Q3). Total budget: $420K.\"",
      boardroom: "\"1) CFO (board-approved, Q1). 2) Regional GM x2 (Q2-Q3). Total budget: $1.1M, approved in the annual plan.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "calendar",
    futureGenerator: "generate/hiring-plan",
    status: "architecture",
  },
  {
    id: "interview-scorecard",
    name: "Interview Scorecard",
    category: "Build the Team",
    shortDescription: "Evaluate candidates consistently, not on gut feeling alone.",
    whatIsThis:
      "A structured scorecard for evaluating candidates against the specific outcomes and competencies defined in the Role Scorecard.",
    whyItMatters:
      "Gut-feeling hiring is inconsistent and prone to bias. A scorecard keeps every interview measuring the same, relevant things.",
    ownerExecutiveIds: ["people-culture"],
    prerequisites: ["role-scorecard"],
    recommendedBusinessStages: ["scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Score candidates the same way, every time",
        body: "Let's build a simple scorecard so every candidate gets judged on the same things — not just a gut feeling in the moment.",
      },
      small_business: {
        headline: "Build your interview scorecard",
        body: "A short scorecard rating candidates on the same key skills and traits, so hiring decisions are consistent and fair.",
      },
      business_owner: {
        headline: "Build your Interview Scorecard",
        body: "A structured scorecard scoring each candidate against the role's defined outcomes and competencies, reducing hiring bias.",
      },
      executive: {
        headline: "Structure the candidate evaluation framework",
        body: "A structured candidate evaluation framework scoring against defined competencies and outcomes to standardize hiring decisions.",
      },
      boardroom: {
        headline: "Codify the enterprise candidate evaluation standard",
        body: "A governed candidate evaluation standard used consistently across leadership hiring to reduce bias and support governance review.",
      },
    },
    instructions: {
      foundation: [
        "List the 3-4 things you most need to see in a candidate.",
        "Score each candidate 1-5 on each of those things.",
        "Compare scores side by side before deciding.",
      ],
      small_business: [
        "List key skills/traits from the role scorecard.",
        "Score each candidate consistently after every interview.",
        "Compare candidates using the same scorecard.",
      ],
      business_owner: [
        "Pull competencies directly from the Role Scorecard.",
        "Score each candidate with supporting notes per competency.",
        "Compare scores across all interviewers before deciding.",
      ],
      executive: [
        "Align competencies to the Role Scorecard's outcomes.",
        "Score candidates with structured, evidence-based notes.",
        "Aggregate interviewer scores to remove individual bias.",
      ],
      boardroom: [
        "Align competencies to governance-approved role requirements.",
        "Score candidates with structured, documented evidence.",
        "Aggregate and review scores at the appropriate governance level.",
      ],
    },
    examples: {
      foundation: "\"Communication: 4/5. Reliability: 5/5. Attitude: 4/5. Total: 13/15 — strong candidate.\"",
      small_business: "\"Skills: 4/5. Culture fit: 5/5. Experience: 3/5. Total: 12/15.\"",
      business_owner: "\"Strategic thinking: 4/5. Execution track record: 5/5. Team fit: 4/5. Total: 13/15.\"",
      executive: "\"Leadership: 5/5. Domain expertise: 4/5. Strategic alignment: 4/5. Total: 13/15.\"",
      boardroom: "\"Governance readiness: 4/5. Strategic vision: 5/5. Track record: 5/5. Total: 14/15.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "checklist",
    futureGenerator: "generate/interview-scorecard",
    status: "architecture",
  },
  {
    id: "new-hire-onboarding",
    name: "New-Hire Onboarding",
    category: "Build the Team",
    shortDescription: "Give a new hire a clear, confident first 30/60/90 days.",
    whatIsThis:
      "A structured plan for a new hire's first 30, 60, and 90 days — what they'll learn, do, and be measured on, so they ramp up with confidence.",
    whyItMatters:
      "A confusing first few weeks costs you productivity and can cost you the hire entirely. A clear onboarding plan sets them up to succeed.",
    ownerExecutiveIds: ["people-culture"],
    prerequisites: ["role-scorecard"],
    recommendedBusinessStages: ["scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Set your new hire up to succeed",
        body: "Let's plan out what a new person should learn and do in their first month, second month, and third month, so they're not left guessing.",
      },
      small_business: {
        headline: "Build your onboarding plan",
        body: "A simple 30/60/90-day plan for new hires, so they ramp up quickly and feel confident instead of lost.",
      },
      business_owner: {
        headline: "Build your New-Hire Onboarding plan",
        body: "A structured 30/60/90-day onboarding plan with learning milestones and check-in points, tied to the role's success outcomes.",
      },
      executive: {
        headline: "Structure the onboarding and ramp framework",
        body: "A structured onboarding framework with 30/60/90-day milestones tied to role outcomes, designed to accelerate time-to-productivity.",
      },
      boardroom: {
        headline: "Codify the enterprise onboarding standard",
        body: "A governed onboarding standard with 30/60/90-day milestones used consistently to accelerate ramp time across the organization.",
      },
    },
    instructions: {
      foundation: [
        "Decide what they should learn in the first 30 days.",
        "Decide what they should be doing independently by day 60.",
        "Decide what full success looks like by day 90.",
      ],
      small_business: [
        "Define 30-day learning and shadowing goals.",
        "Define 60-day independent-work goals.",
        "Define 90-day success criteria and first check-in.",
      ],
      business_owner: [
        "Define 30-day ramp milestones with owner check-ins.",
        "Define 60-day performance milestones.",
        "Define 90-day success criteria tied to the Role Scorecard.",
      ],
      executive: [
        "Define 30-day onboarding milestones with structured check-ins.",
        "Define 60-day performance and integration milestones.",
        "Define 90-day success criteria tied to strategic outcomes.",
      ],
      boardroom: [
        "Define 30-day onboarding milestones aligned to governance standards.",
        "Define 60-day performance and leadership integration milestones.",
        "Define 90-day success criteria tied to enterprise outcomes.",
      ],
    },
    examples: {
      foundation: "\"Days 1-30: shadow me on calls. Days 31-60: run a call solo with feedback. Days 61-90: own the process.\"",
      small_business: "\"30 days: learn systems. 60 days: handle routine tickets. 90 days: full caseload independently.\"",
      business_owner: "\"30 days: onboarding + pipeline shadow. 60 days: own 50% of pipeline. 90 days: hit quota independently.\"",
      executive: "\"30 days: strategic immersion. 60 days: lead first initiative. 90 days: deliver measurable P&L impact.\"",
      boardroom: "\"30 days: governance immersion. 60 days: lead a board-visible initiative. 90 days: deliver on KPI commitments.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "checklist",
    futureGenerator: "generate/new-hire-onboarding",
    status: "architecture",
  },
  {
    id: "team-accountability-map",
    name: "Team Accountability Map",
    category: "Build the Team",
    shortDescription: "See who owns what across your whole team.",
    whatIsThis:
      "A team-wide map showing which person or role owns each major area of the business, so nothing important is left unowned.",
    whyItMatters:
      "As a team grows, ownership can quietly become unclear or duplicated. This map keeps everyone's lane visible to everyone else.",
    ownerExecutiveIds: ["people-culture", "operations"],
    prerequisites: ["accountability-map"],
    recommendedBusinessStages: ["scale"],
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "See who owns what across the team",
        body: "Let's map out, area by area, who's responsible for what across your whole team, so nothing important falls through the cracks.",
      },
      small_business: {
        headline: "Build your team accountability map",
        body: "A team-wide list of who owns each major area, so ownership stays clear as your team grows.",
      },
      business_owner: {
        headline: "Build your Team Accountability Map",
        body: "A structured map assigning ownership of each functional area across the team, used to prevent overlap and gaps as headcount grows.",
      },
      executive: {
        headline: "Structure the organizational accountability model",
        body: "A structured organizational accountability model mapping ownership across functions, used to inform organizational design decisions.",
      },
      boardroom: {
        headline: "Codify the enterprise accountability structure",
        body: "A governed enterprise accountability structure mapping functional ownership, used for organizational design and governance reporting.",
      },
    },
    instructions: {
      foundation: [
        "List the major areas of your business (sales, delivery, admin, etc.).",
        "Write down who owns each area.",
        "Check for anything nobody clearly owns.",
      ],
      small_business: [
        "List functional areas across the team.",
        "Assign an owner to each area.",
        "Identify and resolve any ownership gaps.",
      ],
      business_owner: [
        "List all functional areas with current owners.",
        "Identify overlaps or gaps in ownership.",
        "Reassign or clarify ownership as needed.",
      ],
      executive: [
        "Map functional areas against the org chart.",
        "Identify structural overlaps or gaps in accountability.",
        "Redesign accountability structure where needed.",
      ],
      boardroom: [
        "Map enterprise functions against governance structure.",
        "Identify structural overlaps or gaps at the leadership level.",
        "Redesign accountability structure with board visibility.",
      ],
    },
    examples: {
      foundation: "\"Sales: me. Delivery: my assistant. Admin: nobody yet — that's a gap to fix.\"",
      small_business: "\"Sales: owner. Ops: office manager. Delivery: 2 techs. Marketing: unowned — needs an owner.\"",
      business_owner: "\"Sales: VP Sales. Ops: COO. Product: Head of Product. Finance: fractional CFO.\"",
      executive: "\"Revenue: CRO. Operations: COO. People: CPCO. Finance: CFO. Innovation: CIO.\"",
      boardroom: "\"Revenue, Ops, People, Finance, and Strategy each map to a named executive with board-level reporting.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "dashboard-card",
    futureGenerator: "generate/team-accountability-map",
    status: "architecture",
  },
  {
    id: "meeting-rule",
    name: "Meeting Rule™",
    artifactKind: "operating-rule",
    category: "Design the Business",
    shortDescription: "Set the standing rule for how a recurring meeting actually runs.",
    whatIsThis:
      "A short, written operating rule that defines the purpose, cadence, attendees, and standard structure of a recurring meeting — so it runs the same disciplined way every time, not however it happens to go.",
    whyItMatters:
      "Meetings without a rule drift — they run long, wander off-topic, or quietly stop being worth the time. A written Meeting Rule turns a recurring meeting into a designed part of how the business operates, not an open-ended calendar block.",
    ownerExecutiveIds: ["operations"],
    recommendedBusinessStages: [], // Deliberately empty — never surfaces in "Recommended For You"; reached only via DESIGN.
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Set the rule for a repeating meeting",
        body: "Let's write one simple rule for a meeting you have again and again — why it happens, who's in it, and how long it runs.",
      },
      small_business: {
        headline: "Design your Meeting Rule",
        body: "A short written rule for a recurring meeting — purpose, cadence, attendees, and structure — so it stays useful instead of drifting.",
      },
      business_owner: {
        headline: "Build your Meeting Rule™",
        body: "A standing operating rule for a recurring meeting: purpose, cadence, required attendees, agenda structure, and decision rights.",
      },
      executive: {
        headline: "Codify the meeting's operating rule",
        body: "A governing rule for a recurring meeting — purpose, cadence, attendees, structure, and decision authority — applied consistently across the team.",
      },
      boardroom: {
        headline: "Formalize the meeting governance rule",
        body: "A formal governance rule for a recurring meeting, specifying cadence, mandatory attendance, structure, and decision authority for organizational consistency.",
      },
    },
    instructions: {
      foundation: [
        "Name the meeting and what it's for, in one sentence.",
        "Say how often it happens and how long it runs.",
        "List who has to be there.",
      ],
      small_business: [
        "State the meeting's purpose and how often it happens.",
        "Set a standard structure (e.g. same 3 agenda items every time).",
        "Name who must attend and who's optional.",
      ],
      business_owner: [
        "Define the meeting's purpose, cadence, and maximum length.",
        "Set the standard agenda structure every occurrence follows.",
        "Name required attendees and who has final decision rights.",
      ],
      executive: [
        "Define purpose, cadence, and time-box for the meeting.",
        "Standardize the agenda structure and pre-read expectations.",
        "Define attendee roles and decision-rights within the meeting.",
      ],
      boardroom: [
        "Define the meeting's governance purpose, cadence, and time-box.",
        "Codify the standard agenda and documentation requirements.",
        "Define mandatory attendance and decision authority.",
      ],
    },
    examples: {
      foundation: "\"Monday Check-In: every Monday, 15 minutes, just me and my one contractor — what shipped, what's stuck, what's next.\"",
      small_business: "\"Weekly Ops Huddle: every Friday, 30 min, whole team — wins, blockers, next week's priorities. No laptops open.\"",
      business_owner: "\"Leadership Sync: every Tuesday, 45 min, department leads only — metrics review, blockers, one decision made before close.\"",
      executive: "\"Monthly Ops Review: first Monday, 60 min, function heads — KPI review, variance flags, owners assigned, tracked to resolution.\"",
      boardroom: "\"Quarterly Governance Review: 90 min, board + executive team — financials, risk register, compliance sign-off, minutes filed.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "checklist",
    futureGenerator: "generate/meeting-rule",
    status: "architecture",
    availableBuildModeIds: ["build-with-ai", "let-ai-do-it", "guided-diy"],
  },
  {
    id: "delegation-brief",
    name: "Delegation Brief™",
    artifactKind: "delegation-artifact",
    category: "Delegate the Business",
    shortDescription: "Define exactly what's being handed off — responsibility, authority, and what done looks like.",
    whatIsThis:
      "A short, written brief that defines WHAT is being handed off to someone else: the responsibility, its purpose, the expected outcome, the authority and boundaries that come with it, the resources available, the standard it must meet, and when to escalate back to you. It does not track WHO it's assigned to or WHEN the handoff happened — that lives with the actual delegation once you assign it.",
    whyItMatters:
      "Delegation fails most often not because the wrong person was chosen, but because the handoff itself was vague — responsibility without authority, or an outcome without a defined standard. A written Delegation Brief means the person taking this on knows exactly what they own, what they can decide without asking, and where the line is — so ownership actually leaves your hands instead of quietly staying with you.",
    ownerExecutiveIds: ["operations"],
    recommendedBusinessStages: [], // Deliberately empty — never surfaces in "Recommended For You"; reached only via DELEGATE.
    supportedCommunicationStyles: ALL_STYLES,
    explanations: {
      foundation: {
        headline: "Write down what you're handing off",
        body: "Let's write one simple page about a job you want someone else to take over — what it is, why it matters, and how they'll know they did it right.",
      },
      small_business: {
        headline: "Build your Delegation Brief",
        body: "A short written brief for handing off a responsibility — what it is, what they can decide on their own, and what 'done well' looks like — so you don't have to keep explaining it.",
      },
      business_owner: {
        headline: "Build your Delegation Brief™",
        body: "A brief that defines a responsibility you're handing off: its purpose, the outcome you expect, the authority and boundaries that come with it, and when to escalate back to you.",
      },
      executive: {
        headline: "Formalize the delegation brief",
        body: "A structured brief defining a delegated responsibility — purpose, expected outcome, authority and boundaries, available resources, performance standard, and escalation conditions.",
      },
      boardroom: {
        headline: "Codify the delegation of authority",
        body: "A formal delegation-of-authority brief: responsibility, purpose, expected outcome, scope of authority and boundaries, resources, governing standard, and defined escalation path.",
      },
    },
    instructions: {
      foundation: [
        "Name the job and why it matters, in one sentence.",
        "Say what they get to decide on their own, and what they don't.",
        "Describe what it looks like when it's done well.",
      ],
      small_business: [
        "State the responsibility and its purpose.",
        "Set the authority and boundaries — what's theirs to decide, what isn't.",
        "Define what resources they have and what 'done well' looks like.",
        "Name when they should come back to you instead of deciding alone.",
      ],
      business_owner: [
        "Define the responsibility, its purpose, and the expected outcome.",
        "Set the scope of authority and the boundaries around it.",
        "List the resources available to them.",
        "Define the standard the work must meet.",
        "Define the conditions under which they escalate back to you.",
      ],
      executive: [
        "Define the responsibility, purpose, and expected business outcome.",
        "Define scope of authority, boundaries, and decision rights.",
        "Confirm resources allocated to the responsibility.",
        "Define the performance standard and how it's measured.",
        "Define escalation conditions and the escalation path.",
      ],
      boardroom: [
        "Define the delegated responsibility and its organizational purpose.",
        "Codify scope of authority, boundaries, and decision rights.",
        "Confirm resource allocation.",
        "Codify the governing performance standard.",
        "Codify escalation conditions and reporting path.",
      ],
    },
    examples: {
      foundation:
        "\"Answering client emails: you own replying within a day. You can answer normal questions yourself. If someone's upset or asking for a refund, come find me first.\"",
      small_business:
        "\"Client onboarding follow-up: you own every new client's first 30 days. You can adjust the schedule and send standard materials on your own. Escalate if a client asks for a discount or contract change.\"",
      business_owner:
        "\"Client Success Lead owns onboarding: every new client is fully onboarded within 2 weeks. Full authority over scheduling, materials, and standard troubleshooting. Escalate pricing exceptions and any client threatening to cancel.\"",
      executive:
        "\"Head of Client Success owns the onboarding function: 95% of clients onboarded within 14 days, measured monthly. Full authority within approved playbook and budget. Escalate contract deviations and churn-risk accounts above $10K ARR.\"",
      boardroom:
        "\"VP Client Success holds delegated authority over onboarding operations: SLA of 14-day onboarding at 95%+ compliance, reviewed quarterly. Authority per governance manual §4. Escalation: contract exceptions, enterprise churn risk, budget variance >10%.\"",
    },
    digitalBuildAvailable: true,
    printAvailable: true,
    recommendedRenderer: "checklist",
    futureGenerator: "generate/delegation-brief",
    status: "architecture",
    availableBuildModeIds: ["build-with-ai", "let-ai-do-it", "guided-diy", "give-to-team"],
  },
]

/** Look up a single asset by id. */
export function getBusinessAsset(id: string): BusinessAsset | undefined {
  return BUSINESS_ASSETS.find((a) => a.id === id)
}

/** All assets within a single category, in catalog order. */
export function getAssetsByCategory(category: BusinessAssetCategory): BusinessAsset[] {
  return BUSINESS_ASSETS.filter((a) => a.category === category)
}

/** All assets owned (in whole or in part) by a given executive id. */
export function getAssetsByExecutive(executiveId: string): BusinessAsset[] {
  return BUSINESS_ASSETS.filter((a) => a.ownerExecutiveIds.includes(executiveId))
}

/**
 * Assets emphasized for a given Business Stage™. Every asset is available to
 * every founder — this only orders/filters for the "Recommended For You" rail,
 * mirroring the emphasis-not-gate convention used throughout the platform.
 */
export function getRecommendedAssetsForStage(stage: BusinessStage): BusinessAsset[] {
  return BUSINESS_ASSETS.filter((a) => a.recommendedBusinessStages.includes(stage))
}
