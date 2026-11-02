/**
 * BO$$ Business Journey™ + Readiness — what is this business ready to do?
 * ---------------------------------------------------------------------------
 * Pure module (no storage, no network). The CEO Workday™ design engine uses
 * it to turn a weekly Business Building Priority into a SEQUENCED chain of
 * assignments that fits the founder's journey (starting / growing / scaling)
 * and only labels work "ready" when its prerequisites are actually present.
 *
 * Requirement status precedence (never invented):
 *   1. founder's own readiness answer
 *   2. an approved Business Profile™ fact
 *   3. an installed / approved Business Asset™
 *   4. otherwise UNKNOWN → BO$$ asks (Information Needed), never assumes a gap
 *
 * Fixtures: scripts/dev/boss-readiness-fixtures.ts
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { CeoBusinessFunction, CeoTreatment } from "@/lib/ceo-workday/plan-types"
import type { CeoWorkCategoryId } from "@/lib/ceo-workday/categories"

// ── Vocabulary ──────────────────────────────────────────────────────────────

export type BossJourney = "starting" | "growing" | "scaling"
export type AssignmentReadiness = "ready" | "ready_after_prep" | "blocked" | "info_needed"
export type AssetRequirement = "none" | "suggested" | "required"
export type ReadinessAnswerStatus = "have" | "missing" | "not_needed"
export type RequirementStatus = ReadinessAnswerStatus | "unknown"
export type RequirementKind = "asset" | "decision" | "resource" | "knowledge"

export const BOSS_JOURNEY_LABEL: Record<BossJourney, string> = {
  starting: "Starting",
  growing: "Growing",
  scaling: "Scaling",
}

export const BOSS_JOURNEY_DESCRIPTION: Record<BossJourney, string> = {
  starting: "Building the first offer, first clients and first proof.",
  growing: "Revenue exists — making it consistent and less dependent on you.",
  scaling: "Proven model — transferring, systemizing and multiplying it.",
}

export const READINESS_LABEL: Record<AssignmentReadiness, string> = {
  ready: "Ready to Execute",
  ready_after_prep: "Ready After Preparation",
  blocked: "Blocked",
  info_needed: "Information Needed",
}

/** Business Stage™ → suggested journey. Always shown as "suggested" until confirmed. */
export function suggestJourney(stage: BusinessStage | string | null | undefined): BossJourney {
  switch (stage) {
    case "growth":
      return "growing"
    case "scale":
    case "legacy":
      return "scaling"
    default:
      return "starting"
  }
}

export function isBossJourney(v: unknown): v is BossJourney {
  return v === "starting" || v === "growing" || v === "scaling"
}

// ── Registry types ──────────────────────────────────────────────────────────

export interface InitiativeRequirement {
  key: string
  label: string
  /** The readiness question, phrased to the founder. */
  question: string
  kind: RequirementKind
  /** Business Asset Library™ id that satisfies this requirement, if one exists. */
  assetId?: string
  /** Approved-fact label keywords that satisfy this requirement. */
  factKeywords?: string[]
  /** Hard = blocks execution. Soft = can be prepared first in the same day. */
  hard: boolean
  /** The preparation assignment created when this requirement is missing. */
  prep: { title: string; outcome: string; minutes: number; fn: CeoBusinessFunction; category: CeoWorkCategoryId }
}

export interface InitiativeStep {
  /** Stable suffix; full assignment key = `${initiative.id}.${key}`. */
  key: string
  title: string
  outcome: string
  fn: CeoBusinessFunction
  treatment: CeoTreatment
  category: CeoWorkCategoryId
  minutes: number
  /** Requirement keys this step needs. */
  requires?: string[]
  assetId?: string
  assetRequirement?: AssetRequirement
  assetReason?: string
  aiHint?: string
}

export interface StrategicInitiative {
  id: string
  areaId: string
  journey: BossJourney | "any"
  name: string
  objective: string
  requirements: InitiativeRequirement[]
  steps: InitiativeStep[]
}

// ── Registry helpers ────────────────────────────────────────────────────────

const prep = (
  title: string,
  outcome: string,
  fn: CeoBusinessFunction,
  category: CeoWorkCategoryId,
  minutes = 45,
): InitiativeRequirement["prep"] => ({ title, outcome, fn, category, minutes })

const req = (
  key: string,
  label: string,
  question: string,
  kind: RequirementKind,
  hard: boolean,
  p: InitiativeRequirement["prep"],
  extra: Partial<Pick<InitiativeRequirement, "assetId" | "factKeywords">> = {},
): InitiativeRequirement => ({ key, label, question, kind, hard, prep: p, ...extra })

// ── Initiative registry ─────────────────────────────────────────────────────

export const STRATEGIC_INITIATIVES: StrategicInitiative[] = [
  // Sales & Revenue
  {
    id: "sales.first-offer",
    areaId: "sales-revenue",
    journey: "starting",
    name: "Define the first offer and price",
    objective: "Have one clear, priced offer you can explain and sell this month.",
    requirements: [
      req("ideal-client", "Ideal client", "Do you know exactly who your first offer is for?", "decision", true,
        prep("Name your ideal first client", "One paragraph describing who they are and the problem they pay to solve.", "client-attraction", "DECIDE", 30),
        { assetId: "ideal-client-compass", factKeywords: ["ideal client", "target audience", "who we serve"] }),
    ],
    steps: [
      { key: "offer", title: "Write your first offer and its price", outcome: "Offer statement, what's included, and the price, on one page.", fn: "sales-conversion", treatment: "build-change", category: "BUILD", minutes: 60, requires: ["ideal-client"], assetId: "offer-design-canvas", assetRequirement: "required", assetReason: "The Offer Design Canvas walks you through the offer, promise and price step by step.", aiHint: "Ask BO$$ to pressure-test the price and promise." },
      { key: "say-it", title: "Practice saying the offer out loud", outcome: "A 60-second spoken version you can repeat without notes.", fn: "sales-conversion", treatment: "practice-develop", category: "SELL", minutes: 30, requires: [], assetRequirement: "none", aiHint: "Practice the offer with BO$$." },
      { key: "first-ask", title: "Offer it to one real prospect", outcome: "One offer made; their response written down word-for-word.", fn: "sales-conversion", treatment: "implement-operate", category: "CONNECT", minutes: 30, requires: [], assetRequirement: "none" },
    ],
  },
  {
    id: "sales.conversion",
    areaId: "sales-revenue",
    journey: "growing",
    name: "Improve sales conversion",
    objective: "Convert more of the conversations you already have.",
    requirements: [
      req("sales-call-process", "Sales conversation process", "Do you have a repeatable way you run sales conversations?", "asset", false,
        prep("Outline your sales conversation", "The 5 stages of your call and the questions you ask in each.", "sales-conversion", "BUILD", 45),
        { assetId: "discovery-call-blueprint", factKeywords: ["sales process", "discovery call", "sales call"] }),
      req("lead-flow", "Active leads", "Do you have prospects you can talk to this week?", "resource", true,
        prep("List 10 people you can invite to a conversation", "A list of 10 names with how you know them and how you'll reach out.", "client-attraction", "CONNECT", 30)),
    ],
    steps: [
      { key: "review", title: "Review your last five sales conversations", outcome: "Where each one stalled, and the one pattern that repeats.", fn: "sales-conversion", treatment: "build-change", category: "DECIDE", minutes: 45, requires: [], assetRequirement: "none", aiHint: "Ask BO$$ to help find the pattern." },
      { key: "objections", title: "Prepare answers to your top objections", outcome: "Your three most common objections, each with a tested answer.", fn: "sales-conversion", treatment: "build-change", category: "SELL", minutes: 45, requires: ["sales-call-process"], assetId: "objection-map", assetRequirement: "suggested", assetReason: "The Objection Map gives each objection a structured answer you can reuse." },
      { key: "live", title: "Hold two sales conversations with the changes", outcome: "Two conversations logged with the outcome and one improvement note.", fn: "sales-conversion", treatment: "implement-operate", category: "CONNECT", minutes: 60, requires: ["lead-flow"], assetRequirement: "none" },
    ],
  },
  {
    id: "sales.handoff",
    areaId: "sales-revenue",
    journey: "scaling",
    name: "Hand the sales process to a team member",
    objective: "Sales keeps closing without you being in every conversation.",
    requirements: [
      req("sales-call-process", "Documented sales process", "Is your sales process written down step by step?", "asset", true,
        prep("Document your sales process", "Every stage of your sales process written so someone else could follow it.", "operations-design", "SYSTEMIZE", 60),
        { assetId: "sales-journey", factKeywords: ["sales process", "sales journey"] }),
      req("sales-owner", "Person to own sales", "Is there a person who can take over part of sales?", "resource", true,
        prep("Decide who will own the first sales step", "A named person (or role to hire) and the step they will own.", "operations", "DECIDE", 30)),
    ],
    steps: [
      { key: "brief", title: "Write the sales handoff brief", outcome: "One page: which step, the script, and how results are reported.", fn: "operations", treatment: "delegate-transfer", category: "DELEGATE", minutes: 60, requires: ["sales-call-process", "sales-owner"], assetId: "delegation-brief", assetRequirement: "suggested", assetReason: "The Delegation Brief makes the handoff complete enough to run without you." },
      { key: "brief-owner", title: "Brief the new sales owner", outcome: "Briefing held; first independent run date set.", fn: "operations", treatment: "implement-operate", category: "COMMUNICATE", minutes: 30, requires: ["sales-owner"], assetRequirement: "none" },
    ],
  },

  // Growth & Innovation
  {
    id: "growth.first-channel",
    areaId: "growth-innovation",
    journey: "starting",
    name: "Choose your first visibility channel",
    objective: "Be consistently visible in one place your ideal clients already are.",
    requirements: [
      req("ideal-client", "Ideal client", "Do you know exactly who you want to reach?", "decision", true,
        prep("Name your ideal client", "One paragraph describing who they are and where they spend time.", "client-attraction", "DECIDE", 30),
        { assetId: "ideal-client-compass", factKeywords: ["ideal client", "target audience"] }),
    ],
    steps: [
      { key: "channel", title: "Decide your one growth channel for 90 days", outcome: "Channel, audience and posting rhythm written in three lines.", fn: "client-attraction", treatment: "build-change", category: "DECIDE", minutes: 45, requires: ["ideal-client"], assetRequirement: "none", aiHint: "Ask BO$$ to compare two channels for your audience." },
      { key: "publish", title: "Publish your first piece on that channel", outcome: "One piece published.", fn: "client-attraction", treatment: "implement-operate", category: "MARKET", minutes: 45, requires: [], assetRequirement: "none", aiHint: "Draft the piece with BO$$." },
    ],
  },
  {
    id: "growth.consistent-pipeline",
    areaId: "growth-innovation",
    journey: "growing",
    name: "Build a consistent content and lead rhythm",
    objective: "Demand arrives every week, not only when you push.",
    requirements: [
      req("content-plan", "Content plan", "Do you have a content plan for the next four weeks?", "asset", false,
        prep("Draft a four-week content plan", "Four weeks of topics mapped to one offer.", "client-attraction", "BUILD", 45),
        { assetId: "content-planning-canvas", factKeywords: ["content plan", "content calendar"] }),
    ],
    steps: [
      { key: "batch", title: "Create this week's content batch", outcome: "This week's pieces drafted and scheduled.", fn: "client-attraction", treatment: "implement-operate", category: "MARKET", minutes: 75, requires: ["content-plan"], assetRequirement: "none", aiHint: "Draft with BO$$." },
      { key: "measure", title: "Review last cycle's results and change one thing", outcome: "One metric reviewed and one adjustment written down.", fn: "client-attraction", treatment: "practice-develop", category: "DECIDE", minutes: 30, requires: [], assetRequirement: "none" },
    ],
  },
  {
    id: "growth.system",
    areaId: "growth-innovation",
    journey: "scaling",
    name: "Turn content production into a system",
    objective: "Content keeps going out without you producing every piece.",
    requirements: [
      req("content-plan", "Content plan", "Is your content plan documented?", "asset", true,
        prep("Document your content plan", "Topics, rhythm and formats written down.", "client-attraction", "BUILD", 45),
        { assetId: "content-planning-canvas", factKeywords: ["content plan"] }),
      req("content-help", "Production support", "Do you have someone (or a tool) to produce content?", "resource", true,
        prep("Decide who or what will produce content", "A named person, contractor or tool and what they will produce.", "operations", "DECIDE", 30)),
    ],
    steps: [
      { key: "workflow", title: "Document the content production workflow", outcome: "Step-by-step workflow with owner and review point.", fn: "operations-design", treatment: "systemize-augment-automate-ai", category: "SYSTEMIZE", minutes: 60, requires: ["content-plan"], assetId: "sop-playbook-template", assetRequirement: "suggested", assetReason: "The SOP Playbook turns the workflow into a standard someone else can follow." },
      { key: "handoff", title: "Hand off this week's production", outcome: "This week's pieces produced by someone other than you.", fn: "operations", treatment: "delegate-transfer", category: "DELEGATE", minutes: 30, requires: ["content-help"], assetRequirement: "none" },
    ],
  },

  // Operations
  // Workshops & Webinars (sixth function) — selectable alternates under Growth & Innovation.
  // Listed after the original growth initiatives so journey defaults are unchanged.
  {
    id: "experiences.first-brief",
    areaId: "growth-innovation",
    journey: "starting",
    name: "Design your first workshop or webinar",
    objective: "One trust-building experience designed, with a clear audience, promise and next step.",
    requirements: [
      req("experience-audience", "Audience and promise", "Do you know who the experience is for and what they will leave with?", "decision", true,
        prep("Name the audience and promise for your experience", "One sentence: who it is for and the result they leave with.", "trust-experiences", "DECIDE", 30)),
      req("experience-offer", "Offer behind the experience", "Is there an offer for attendees who want more?", "asset", false,
        prep("Define the offer behind your experience", "The offer, its price and who it's for.", "sales-conversion", "BUILD", 45),
        { assetId: "offer-design-canvas", factKeywords: ["offer", "program", "package"] }),
    ],
    steps: [
      { key: "brief", title: "Write the experience brief", outcome: "Audience, promise, format, length, date and the offer it leads to, on one page.", fn: "trust-experiences", treatment: "build-change", category: "DESIGN", minutes: 45, requires: ["experience-audience"], assetRequirement: "none", aiHint: "Ask BO$$ to pressure-test the promise and format." },
      { key: "outline", title: "Outline the curriculum", outcome: "Three teaching points, one exercise and the invitation at the end.", fn: "trust-experiences", treatment: "build-change", category: "BUILD", minutes: 60, requires: ["experience-audience"], assetRequirement: "none", aiHint: "Draft the outline with BO$$." },
      { key: "invite", title: "Invite your first 10 people", outcome: "Ten personal invitations sent; registrations noted.", fn: "trust-experiences", treatment: "implement-operate", category: "MARKET", minutes: 30, requires: [], assetRequirement: "none" },
    ],
  },
  {
    id: "experiences.weekly-series",
    areaId: "growth-innovation",
    journey: "growing",
    name: "Run a weekly workshop or webinar series",
    objective: "A recurring experience that consistently builds trust and starts sales conversations.",
    requirements: [
      req("experience-curriculum", "Tested curriculum", "Have you delivered this experience at least once with a curriculum you can reuse?", "asset", true,
        prep("Turn your last session into a reusable curriculum", "Session outline, slides or notes, and the invitation, saved for reuse.", "trust-experiences", "BUILD", 60)),
      req("experience-registration", "Registration path", "Can people register on a page or form today?", "resource", false,
        prep("Set up the registration page", "A live registration page or form with confirmation and reminder.", "operations", "SYSTEMIZE", 45)),
    ],
    steps: [
      { key: "cadence", title: "Set the series cadence and next three dates", outcome: "Day, time and the next three occurrence dates decided.", fn: "trust-experiences", treatment: "build-change", category: "DECIDE", minutes: 20, requires: [], assetRequirement: "none" },
      { key: "promote", title: "Promote the next occurrence", outcome: "Promotion posts and emails scheduled for the next session.", fn: "trust-experiences", treatment: "implement-operate", category: "MARKET", minutes: 45, requires: ["experience-registration"], assetRequirement: "none", aiHint: "Draft the promotion with BO$$." },
      { key: "convert", title: "Follow up with attendees and invite them to the offer", outcome: "Follow-up sent to every attendee; conversations booked noted.", fn: "sales-conversion", treatment: "implement-operate", category: "SELL", minutes: 45, requires: [], assetRequirement: "none" },
      { key: "review", title: "Review results and choose one improvement", outcome: "Attendance, conversations and one change for next time recorded.", fn: "trust-experiences", treatment: "practice-develop", category: "DECIDE", minutes: 20, requires: [], assetRequirement: "none" },
    ],
  },
  {
    id: "experiences.delegate-production",
    areaId: "growth-innovation",
    journey: "scaling",
    name: "Delegate experience production and follow-up",
    objective: "You host; the team produces, promotes and follows up.",
    requirements: [
      req("experience-run-of-show", "Written run of show", "Is the production of your experience written down step by step?", "asset", true,
        prep("Document the run of show", "Every production step before, during and after the session, with timing.", "operations-design", "SYSTEMIZE", 60)),
      req("experience-owner", "Production owner", "Is there a person who can own production and follow-up?", "resource", true,
        prep("Decide who will own production and follow-up", "A named person (or role to hire) and what they own.", "operations", "DECIDE", 30)),
    ],
    steps: [
      { key: "handoff", title: "Write the production and follow-up handoff brief", outcome: "One page: what they own, the checklist and how results are reported.", fn: "trust-experiences", treatment: "delegate-transfer", category: "DELEGATE", minutes: 45, requires: ["experience-run-of-show", "experience-owner"], assetId: "delegation-brief", assetRequirement: "suggested", assetReason: "The Delegation Brief makes the handoff complete enough to run without you." },
      { key: "brief-owner", title: "Brief the production owner", outcome: "Briefing held; first independently produced session date set.", fn: "operations", treatment: "implement-operate", category: "COMMUNICATE", minutes: 30, requires: ["experience-owner"], assetRequirement: "none" },
    ],
  },

  {
    id: "ops.first-process",
    areaId: "operations",
    journey: "starting",
    name: "Write down how you deliver",
    objective: "Your delivery runs the same way every time.",
    requirements: [],
    steps: [
      { key: "map", title: "Map how you deliver for one client, start to finish", outcome: "Every step listed, with the two places it usually goes wrong.", fn: "operations-design", treatment: "build-change", category: "BUILD", minutes: 60, requires: [], assetRequirement: "none" },
      { key: "sop", title: "Turn the map into your first written process", outcome: "Process with trigger, steps and what done looks like.", fn: "operations-design", treatment: "build-change", category: "SYSTEMIZE", minutes: 45, requires: [], assetId: "sop-playbook-template", assetRequirement: "suggested", assetReason: "The SOP Playbook gives the process a standard format." },
    ],
  },
  {
    id: "ops.consistency",
    areaId: "operations",
    journey: "growing",
    name: "Make delivery consistent",
    objective: "Delivery quality no longer depends on your memory.",
    requirements: [
      req("delivery-process", "Written delivery process", "Is your delivery process written down?", "asset", false,
        prep("Write your delivery process", "Process with trigger, steps and done-criteria.", "operations-design", "SYSTEMIZE", 60),
        { assetId: "sop-playbook-template", factKeywords: ["delivery process", "sop"] }),
    ],
    steps: [
      { key: "run", title: "Run your process on this week's live work", outcome: "Process followed on one live client; deviations noted.", fn: "delivery", treatment: "implement-operate", category: "DELIVER", minutes: 60, requires: ["delivery-process"], assetRequirement: "none" },
      { key: "scorecard", title: "Choose three numbers that show delivery is healthy", outcome: "Three delivery metrics with this week's values.", fn: "operations", treatment: "build-change", category: "DECIDE", minutes: 30, requires: [], assetId: "business-scorecard", assetRequirement: "suggested", assetReason: "The Business Scorecard holds the numbers in one place." },
    ],
  },
  {
    id: "ops.ownership",
    areaId: "operations",
    journey: "scaling",
    name: "Transfer process ownership",
    objective: "Every core process has an owner who is not you.",
    requirements: [
      req("delivery-process", "Written delivery process", "Is the process documented well enough to hand off?", "asset", true,
        prep("Finish documenting the process", "Process complete enough for someone else to run.", "operations-design", "SYSTEMIZE", 60),
        { assetId: "sop-playbook-template", factKeywords: ["sop", "process"] }),
      req("process-owner", "Process owner", "Is there a person who can own this process?", "resource", true,
        prep("Decide who will own the process", "A named owner (or role to hire).", "operations", "DECIDE", 30)),
    ],
    steps: [
      { key: "transfer", title: "Transfer ownership of the process", outcome: "Owner named, briefed, and first independent run scheduled.", fn: "operations", treatment: "delegate-transfer", category: "DELEGATE", minutes: 60, requires: ["delivery-process", "process-owner"], assetId: "accountability-map", assetRequirement: "suggested", assetReason: "The Accountability Map records who owns what." },
      { key: "report", title: "Agree how the owner reports back", outcome: "One-line weekly report format agreed.", fn: "operations", treatment: "implement-operate", category: "COMMUNICATE", minutes: 20, requires: ["process-owner"], assetRequirement: "none" },
    ],
  },

  // Client Experience
  {
    id: "cx.first-clients",
    areaId: "client-experience",
    journey: "starting",
    name: "Turn first clients into proof",
    objective: "Your first clients get results and say so.",
    requirements: [
      req("active-clients", "Current clients", "Do you have at least one current or recent client?", "resource", true,
        prep("Find your first client", "One person who has agreed to work with you.", "sales-conversion", "CONNECT", 45)),
    ],
    steps: [
      { key: "checkin", title: "Check in with each current client", outcome: "Each client contacted; one win and one concern captured.", fn: "delivery", treatment: "implement-operate", category: "DELIVER", minutes: 45, requires: ["active-clients"], assetRequirement: "none" },
      { key: "testimonial", title: "Ask one happy client for a testimonial", outcome: "One ask made; response captured.", fn: "client-attraction", treatment: "implement-operate", category: "CONNECT", minutes: 20, requires: ["active-clients"], assetRequirement: "none", aiHint: "Ask BO$$ to draft the request." },
    ],
  },
  {
    id: "cx.retention",
    areaId: "client-experience",
    journey: "growing",
    name: "Raise retention and referrals",
    objective: "Clients stay, renew and refer.",
    requirements: [
      req("checkin-cadence", "Client check-in rhythm", "Do you have a regular check-in rhythm with clients?", "decision", false,
        prep("Design your client check-in rhythm", "When, who, what you ask and what you do with the answer.", "delivery", "DECIDE", 30)),
    ],
    steps: [
      { key: "run-checkins", title: "Run this week's client check-ins", outcome: "Check-ins completed; one risk and one opportunity captured.", fn: "delivery", treatment: "implement-operate", category: "DELIVER", minutes: 60, requires: ["checkin-cadence"], assetRequirement: "none" },
      { key: "referral", title: "Set up your referral ask", outcome: "Referral ask written and sent to two clients.", fn: "client-attraction", treatment: "build-change", category: "CONNECT", minutes: 30, requires: [], assetId: "referral-blueprint", assetRequirement: "suggested", assetReason: "The Referral Blueprint structures who to ask, when and how." },
    ],
  },
  {
    id: "cx.team-touchpoints",
    areaId: "client-experience",
    journey: "scaling",
    name: "Hand routine client touchpoints to the team",
    objective: "You own the relationship, not every message.",
    requirements: [
      req("cx-owner", "Team member for client touchpoints", "Is there a team member who can handle routine client touchpoints?", "resource", true,
        prep("Decide who will handle routine touchpoints", "A named person and which touchpoints they will own.", "operations", "DECIDE", 30)),
    ],
    steps: [
      { key: "list", title: "List routine touchpoints and the escalation rule", outcome: "Touchpoints listed with an escalation rule.", fn: "delivery", treatment: "delegate-transfer", category: "DELEGATE", minutes: 45, requires: [], assetRequirement: "none" },
      { key: "handoff", title: "Hand the touchpoints to their new owner", outcome: "Owner briefed; first handled touchpoint date set.", fn: "operations", treatment: "delegate-transfer", category: "DELEGATE", minutes: 30, requires: ["cx-owner"], assetId: "delegation-brief", assetRequirement: "suggested", assetReason: "The Delegation Brief makes the handoff complete." },
    ],
  },

  // Authority — default per journey
  {
    id: "authority.point-of-view",
    areaId: "authority",
    journey: "starting",
    name: "Define what you want to be known for",
    objective: "One clear idea people associate with you.",
    requirements: [],
    steps: [
      { key: "idea", title: "Write the one idea you want to be known for", outcome: "One-sentence point of view and three proofs behind it.", fn: "client-attraction", treatment: "build-change", category: "DECIDE", minutes: 45, requires: [], assetRequirement: "none", aiHint: "Ask BO$$ to sharpen your point of view." },
      { key: "publish", title: "Publish one piece that says it", outcome: "One piece published.", fn: "client-attraction", treatment: "implement-operate", category: "MARKET", minutes: 30, requires: [], assetRequirement: "none" },
    ],
  },
  {
    id: "authority.visibility",
    areaId: "authority",
    journey: "growing",
    name: "Grow your authority platform",
    objective: "Your expertise is visible where your clients look.",
    requirements: [
      req("positioning", "Clear positioning", "Is your positioning (who you help, how you're different) written down?", "asset", false,
        prep("Write your positioning statement", "Who you help, the result, and what makes you different.", "client-attraction", "BUILD", 45),
        { assetId: "positioning-canvas", factKeywords: ["positioning", "unique value"] }),
    ],
    steps: [
      { key: "pitch", title: "Pitch two guest opportunities", outcome: "Two pitches sent (podcast, article, or panel).", fn: "client-attraction", treatment: "implement-operate", category: "MARKET", minutes: 60, requires: ["positioning"], assetRequirement: "none", aiHint: "Draft the pitch with BO$$." },
    ],
  },
  {
    id: "authority.repurpose",
    areaId: "authority",
    journey: "scaling",
    name: "Multiply your authority with a repurposing system",
    objective: "Every core idea reaches more people without more of your time.",
    requirements: [
      req("core-content", "Core content", "Do you have core talks or articles to repurpose?", "resource", true,
        prep("Choose the one core piece to repurpose", "One core piece chosen with the three formats it will become.", "client-attraction", "DECIDE", 30)),
    ],
    steps: [
      { key: "system", title: "Document the repurposing workflow", outcome: "One core piece repurposed into three formats via a written workflow.", fn: "operations-design", treatment: "systemize-augment-automate-ai", category: "AUGMENT", minutes: 60, requires: ["core-content"], assetRequirement: "none", aiHint: "Ask BO$$ to draft the three formats." },
    ],
  },
  // Authority — Speaking strategy (selectable at any journey)
  {
    id: "authority.speaking",
    areaId: "authority",
    journey: "any",
    name: "Speaking strategy",
    objective: "Book speaking engagements that bring the right clients to your offer.",
    requirements: [
      req("speaker-bio", "Speaker bio", "Do you have a current speaker bio?", "asset", true,
        prep("Write your speaker bio", "A 100-word and a 50-word speaker bio.", "client-attraction", "BUILD", 30),
        { factKeywords: ["speaker bio", "bio"] }),
      req("headshot", "Professional headshot", "Do you have a professional headshot?", "resource", false,
        prep("Get a professional headshot", "A current headshot saved and ready to send.", "operations", "BUILD", 30),
        { factKeywords: ["headshot"] }),
      req("signature-talk", "Signature talk", "Do you have a signature talk (title, promise, outline)?", "asset", true,
        prep("Outline your signature talk", "Talk title, the promise to the audience, and a three-part outline.", "client-attraction", "BUILD", 60),
        { assetId: "messaging-map", factKeywords: ["signature talk", "keynote"] }),
      req("one-sheet", "Speaker one-sheet", "Do you have a speaker one-sheet?", "asset", false,
        prep("Create your speaker one-sheet", "One page: bio, headshot, talk topics, past stages, contact.", "client-attraction", "BUILD", 45),
        { factKeywords: ["one-sheet", "speaker sheet", "media kit"] }),
      req("topics-audience", "Topics and audiences", "Do you know which topics you speak on and for which audiences?", "decision", true,
        prep("Decide your talk topics and audiences", "Three talk topics, each matched to the audience who needs it.", "client-attraction", "DECIDE", 30)),
      req("proof", "Proof and results", "Do you have proof (testimonials, results, past talks) to share?", "asset", false,
        prep("Gather your speaking proof", "Three proof points: results, testimonials or past talks.", "client-attraction", "BUILD", 30),
        { assetId: "proof-capture-playbook", factKeywords: ["testimonial", "case study", "proof"] }),
      req("cta", "Call to action", "Do you know what you'll invite the audience to do?", "decision", false,
        prep("Decide your audience call to action", "One clear next step for the audience (and how you'll capture it).", "sales-conversion", "DECIDE", 20)),
      req("offer", "Offer behind the talk", "Is there an offer for audience members who want more?", "asset", true,
        prep("Define the offer behind your talk", "The offer, its price and who it's for.", "sales-conversion", "BUILD", 60),
        { assetId: "offer-design-canvas", factKeywords: ["offer", "program", "package"] }),
    ],
    steps: [
      { key: "assess", title: "Assess your speaking readiness", outcome: "Each speaking requirement marked as have / missing / not needed.", fn: "client-attraction", treatment: "build-change", category: "DECIDE", minutes: 20, requires: [], assetRequirement: "none" },
      { key: "materials", title: "Prepare your speaker materials", outcome: "Bio, headshot and one-sheet ready to send.", fn: "client-attraction", treatment: "build-change", category: "BUILD", minutes: 45, requires: ["speaker-bio", "headshot", "one-sheet"], assetRequirement: "none", aiHint: "Ask BO$$ to draft your bio and one-sheet." },
      { key: "strategy", title: "Define your speaking strategy and target audiences", outcome: "Topics, target audiences and the offer each talk leads to.", fn: "client-attraction", treatment: "build-change", category: "DECIDE", minutes: 45, requires: ["topics-audience", "offer"], assetRequirement: "none" },
      { key: "research", title: "Research 15 speaking opportunities", outcome: "15 events, podcasts or stages that match your audience.", fn: "client-attraction", treatment: "implement-operate", category: "MARKET", minutes: 45, requires: ["topics-audience"], assetRequirement: "none", aiHint: "Research opportunities with BO$$." },
      { key: "pipeline", title: "Build your speaking pipeline", outcome: "Opportunities tracked with contact, deadline and status.", fn: "operations", treatment: "implement-operate", category: "SYSTEMIZE", minutes: 30, requires: [], assetRequirement: "none" },
      { key: "pitch", title: "Send your first five speaking pitches", outcome: "Five personalized pitches sent.", fn: "client-attraction", treatment: "implement-operate", category: "MARKET", minutes: 60, requires: ["speaker-bio", "signature-talk", "cta"], assetRequirement: "none", aiHint: "Draft the pitches with BO$$." },
      { key: "evaluate", title: "Evaluate responses and refine the pitch", outcome: "Response rate noted and one change to the pitch.", fn: "client-attraction", treatment: "practice-develop", category: "DECIDE", minutes: 20, requires: [], assetRequirement: "none" },
    ],
  },

  // Finance
  {
    id: "finance.see-numbers",
    areaId: "finance",
    journey: "starting",
    name: "See your numbers",
    objective: "Know what comes in, what goes out, and your runway.",
    requirements: [],
    steps: [
      { key: "cash-view", title: "Build your one-page cash view", outcome: "Cash in, cash out and runway with this month's actuals.", fn: "operations", treatment: "build-change", category: "DECIDE", minutes: 60, requires: [], assetRequirement: "none" },
    ],
  },
  {
    id: "finance.profit",
    areaId: "finance",
    journey: "growing",
    name: "Improve profit",
    objective: "Keep more of what you earn.",
    requirements: [
      req("revenue-numbers", "Current revenue and costs", "Do you know this month's revenue and costs?", "knowledge", true,
        prep("Pull this month's revenue and costs", "This month's revenue, costs and margin in one place.", "operations", "DECIDE", 30)),
    ],
    steps: [
      { key: "decision", title: "Make one pricing or cost decision", outcome: "One decision written with the number it should move.", fn: "operations", treatment: "build-change", category: "DECIDE", minutes: 45, requires: ["revenue-numbers"], assetId: "revenue-model", assetRequirement: "suggested", assetReason: "The Revenue Model shows how the decision changes your numbers." },
    ],
  },
  {
    id: "finance.delegate",
    areaId: "finance",
    journey: "scaling",
    name: "Hand off financial reporting",
    objective: "You read the numbers; someone else compiles them.",
    requirements: [
      req("finance-help", "Bookkeeper or finance support", "Do you have a bookkeeper or finance support?", "resource", true,
        prep("Decide who will compile your numbers", "A bookkeeper, accountant or team member named.", "operations", "DECIDE", 30)),
    ],
    steps: [
      { key: "scope", title: "Define the monthly report you want to receive", outcome: "Report scope, cadence and due date agreed.", fn: "operations", treatment: "delegate-transfer", category: "DELEGATE", minutes: 45, requires: ["finance-help"], assetRequirement: "none" },
    ],
  },

  // AI & Automation
  {
    id: "ai.first-tool",
    areaId: "ai-automation",
    journey: "starting",
    name: "Use AI on one repeat task",
    objective: "Save time on one task you do every week.",
    requirements: [],
    steps: [
      { key: "pick", title: "Pick one weekly task to do with AI", outcome: "One task chosen and done once with AI; time saved noted.", fn: "operations", treatment: "systemize-augment-automate-ai", category: "AUGMENT", minutes: 45, requires: [], assetRequirement: "none", aiHint: "Do the task with BO$$." },
    ],
  },
  {
    id: "ai.audit",
    areaId: "ai-automation",
    journey: "growing",
    name: "Find your best automation candidates",
    objective: "Know which repeat work is worth automating.",
    requirements: [
      req("stable-process", "A stable, written process", "Is the process you want to automate written down and stable?", "asset", true,
        prep("Write down the process before automating it", "Process steps written; the repetitive step marked.", "operations-design", "SYSTEMIZE", 45),
        { assetId: "sop-playbook-template", factKeywords: ["sop", "process"] }),
    ],
    steps: [
      { key: "audit", title: "Audit your tools and repeat tasks", outcome: "Tools listed with the three best automation candidates.", fn: "operations-design", treatment: "systemize-augment-automate-ai", category: "SYSTEMIZE", minutes: 45, requires: [], assetId: "tool-stack-audit", assetRequirement: "suggested", assetReason: "The Tool Stack Audit lists tools, cost and overlap." },
      { key: "automate", title: "Automate the first repetitive step", outcome: "One step automated; time saved measured.", fn: "operations-design", treatment: "systemize-augment-automate-ai", category: "AUGMENT", minutes: 60, requires: ["stable-process"], assetRequirement: "none" },
    ],
  },
  {
    id: "ai.scale-systems",
    areaId: "ai-automation",
    journey: "scaling",
    name: "Systemize with AI across the team",
    objective: "The team uses the same AI-assisted workflows.",
    requirements: [
      req("stable-process", "Stable, written processes", "Are the processes you want to automate documented?", "asset", true,
        prep("Document the processes first", "Processes written with owners.", "operations-design", "SYSTEMIZE", 60),
        { assetId: "sop-playbook-template" }),
    ],
    steps: [
      { key: "rollout", title: "Roll out one AI-assisted workflow to the team", outcome: "Workflow documented, owner trained, first run done.", fn: "operations-design", treatment: "systemize-augment-automate-ai", category: "AUGMENT", minutes: 60, requires: ["stable-process"], assetRequirement: "none" },
    ],
  },
]

export function initiativesForArea(areaId: string | null | undefined): StrategicInitiative[] {
  if (!areaId) return []
  return STRATEGIC_INITIATIVES.filter((i) => i.areaId === areaId)
}

/** The default initiative for an area at a journey (journey-specific beats "any"). */
export function defaultInitiative(areaId: string | null | undefined, journey: BossJourney): StrategicInitiative | null {
  const list = initiativesForArea(areaId)
  return list.find((i) => i.journey === journey) ?? list.find((i) => i.journey === "any") ?? null
}

export function getInitiative(id: string | null | undefined): StrategicInitiative | null {
  return STRATEGIC_INITIATIVES.find((i) => i.id === id) ?? null
}

/** Harmony Lane™ transition: established founders shift toward delegation & systems, never back to "starting". */
export function effectiveJourney(journey: BossJourney, harmonyTransition: boolean): BossJourney {
  if (harmonyTransition && journey === "starting") return "growing"
  return journey
}

// ── Readiness assessment ────────────────────────────────────────────────────

export interface ReadinessContext {
  answers: Record<string, ReadinessAnswerStatus>
  /** Approved Business Profile™ fact labels (lower-cased is fine). */
  approvedFactLabels: string[]
  /** Installed or approved Business Asset™ ids. */
  approvedAssetIds: string[]
}

export interface RequirementAssessment {
  requirement: InitiativeRequirement
  status: RequirementStatus
  source: "answer" | "fact" | "asset" | "none"
}

export function assessRequirement(r: InitiativeRequirement, ctx: ReadinessContext): RequirementAssessment {
  const answer = ctx.answers[r.key]
  if (answer) return { requirement: r, status: answer, source: "answer" }
  const labels = ctx.approvedFactLabels.map((l) => l.toLowerCase())
  if (r.factKeywords?.some((k) => labels.some((l) => l.includes(k.toLowerCase())))) {
    return { requirement: r, status: "have", source: "fact" }
  }
  if (r.assetId && ctx.approvedAssetIds.includes(r.assetId)) return { requirement: r, status: "have", source: "asset" }
  return { requirement: r, status: "unknown", source: "none" }
}

export function assessReadiness(initiative: StrategicInitiative, ctx: ReadinessContext): RequirementAssessment[] {
  return initiative.requirements.map((r) => assessRequirement(r, ctx))
}

/** Classify a step given its requirements' statuses. */
export function classifyStep(step: InitiativeStep, byKey: Record<string, RequirementAssessment>): AssignmentReadiness {
  const needs = (step.requires ?? []).map((k) => byKey[k]).filter(Boolean)
  if (needs.some((a) => a.requirement.hard && a.status === "missing")) return "blocked"
  if (needs.some((a) => a.requirement.hard && a.status === "unknown")) return "info_needed"
  if (needs.some((a) => !a.requirement.hard && (a.status === "missing" || a.status === "unknown"))) return "ready_after_prep"
  return "ready"
}

// ── Assignment development ──────────────────────────────────────────────────

export interface DevelopedAssignment {
  assignmentKey: string
  title: string
  outcome: string
  objective: string
  fn: CeoBusinessFunction
  treatment: CeoTreatment
  category: CeoWorkCategoryId
  minutes: number
  readiness: AssignmentReadiness
  /** Assignment keys that must be finished first. */
  prerequisiteKeys: string[]
  assetId: string | null
  assetRequirement: AssetRequirement
  assetReason: string | null
  aiHint: string | null
  /** Requirements still unknown / missing for this assignment (for the "what's needed" disclosure). */
  gaps: string[]
  isPreparation: boolean
}

export interface DevelopAssignmentsInput {
  initiative: StrategicInitiative
  ctx: ReadinessContext
  /** Assignment keys already finished (completed plan item or done job). */
  doneKeys?: string[]
  harmonyTransition?: boolean
}

export interface DevelopAssignmentsOutput {
  assessments: RequirementAssessment[]
  /** Hard requirements BO$$ needs to ask about (Information Needed). */
  questions: InitiativeRequirement[]
  assignments: DevelopedAssignment[]
}

export function prepKey(initiativeId: string, reqKey: string) {
  return `${initiativeId}.prep.${reqKey}`
}

export function developAssignments(input: DevelopAssignmentsInput): DevelopAssignmentsOutput {
  const { initiative, ctx } = input
  const done = new Set(input.doneKeys ?? [])
  const assessments = assessReadiness(initiative, ctx)
  const byKey = Object.fromEntries(assessments.map((a) => [a.requirement.key, a])) as Record<string, RequirementAssessment>
  const questions = assessments.filter((a) => a.status === "unknown").map((a) => a.requirement)

  const out: DevelopedAssignment[] = []
  const prepEmitted = new Set<string>()

  const emitPrep = (a: RequirementAssessment): string | null => {
    const key = prepKey(initiative.id, a.requirement.key)
    if (done.has(key)) return null
    if (!prepEmitted.has(key)) {
      prepEmitted.add(key)
      const p = a.requirement.prep
      out.push({
        assignmentKey: key,
        title: p.title,
        outcome: p.outcome,
        objective: `${a.requirement.label} is needed before "${initiative.name}" can move forward.`,
        fn: p.fn,
        treatment: "build-change",
        category: p.category,
        minutes: p.minutes,
        readiness: "ready",
        prerequisiteKeys: [],
        assetId: a.requirement.assetId ?? null,
        assetRequirement: a.requirement.assetId ? "suggested" : "none",
        assetReason: a.requirement.assetId ? `This Business Asset™ is the structured way to create your ${a.requirement.label.toLowerCase()}.` : null,
        aiHint: null,
        gaps: [],
        isPreparation: true,
      })
    }
    return key
  }

  for (const step of initiative.steps) {
    const key = `${initiative.id}.${step.key}`
    if (done.has(key)) continue
    const readiness = classifyStep(step, byKey)
    const needs = (step.requires ?? []).map((k) => byKey[k]).filter(Boolean)

    // Missing hard requirements → a separate preparation assignment comes first.
    const prerequisiteKeys: string[] = []
    for (const a of needs) {
      if (a.status === "missing") {
        const k = emitPrep(a)
        if (k && a.requirement.hard) prerequisiteKeys.push(k)
      }
    }

    // Asset reuse: an asset the founder already has is never rebuilt.
    const hasAsset = step.assetId ? ctx.approvedAssetIds.includes(step.assetId) : false
    const assetRequirement: AssetRequirement = step.assetId ? (hasAsset ? "suggested" : (step.assetRequirement ?? "suggested")) : "none"

    out.push({
      assignmentKey: key,
      title: step.title,
      outcome: step.outcome,
      objective: initiative.objective,
      fn: step.fn,
      treatment: step.treatment,
      category: step.category,
      minutes: step.minutes,
      readiness,
      prerequisiteKeys,
      assetId: step.assetId ?? null,
      assetRequirement,
      assetReason: step.assetId
        ? hasAsset
          ? "You already have this Business Asset™ — use it rather than rebuilding it."
          : (step.assetReason ?? null)
        : null,
      aiHint: step.aiHint ?? null,
      gaps: needs.filter((a) => a.status === "missing" || a.status === "unknown").map((a) => a.requirement.label),
      isPreparation: false,
    })
  }

  // Preparation first, then steps in their designed sequence.
  out.sort((a, b) => Number(b.isPreparation) - Number(a.isPreparation))

  // Harmony Lane™ transition favors delegate/systemize steps (stable within groups).
  if (input.harmonyTransition) {
    const weight = (t: CeoTreatment) => (t === "delegate-transfer" || t === "systemize-augment-automate-ai" ? 0 : 1)
    const preps = out.filter((a) => a.isPreparation)
    const rest = out.filter((a) => !a.isPreparation).map((a, i) => ({ a, i }))
    rest.sort((x, y) => weight(x.a.treatment) - weight(y.a.treatment) || x.i - y.i)
    return { assessments, questions, assignments: [...preps, ...rest.map((r) => r.a)] }
  }

  return { assessments, questions, assignments: out }
}
