/**
 * CEO Workday™ Intervention Matrix
 * ---------------------------------------------------------------------------
 * The explainable rule table behind design-engine.ts. For each weekly
 * Business Building Priority (wlbb-week business area) we define:
 *
 *   - the ECONOMIC destination that area serves (why the work matters)
 *   - the durable Business Asset™ ids most likely to be the object of work
 *   - a template chain per treatment: PRIMARY → SUPPORTING → VALIDATE
 *
 * The engine picks the treatment from the constraint (bottleneck EGA
 * obstacle types + BBA + asset status), then instantiates the chain for
 * that treatment. Templates are deliberately short and reuse asset names
 * so nothing here duplicates the Business Asset Library.
 */

import type { CeoBusinessFunction, CeoPlanItemRole, CeoTreatment } from "./plan-types"
import type { CeoWorkCategoryId } from "./categories"

export interface ChainStepTemplate {
  role: Exclude<CeoPlanItemRole, "founder-added" | "continue">
  /** `{asset}` is replaced with the related asset name when present. */
  title: string
  purpose: string
  expectedEvidence: string
  treatment: CeoTreatment
  businessFunction: CeoBusinessFunction
  minutes: number
  ceoWorkCategory: CeoWorkCategoryId
}

export interface AreaIntervention {
  areaId: string
  areaName: string
  /** Economic orientation — every card must trace to this. */
  destination: string
  /** Business Asset™ ids (registry) that are the natural object of work in this area, most-specific first. */
  assetIds: string[]
  /** Fallback asset label when none is installed/known. */
  assetFallbackName: string
  chains: Partial<Record<CeoTreatment, ChainStepTemplate[]>>
}

const build = (
  title: string,
  purpose: string,
  evidence: string,
  fn: CeoBusinessFunction,
  minutes: number,
  cat: CeoWorkCategoryId,
  role: ChainStepTemplate["role"] = "primary",
): ChainStepTemplate => ({
  role,
  title,
  purpose,
  expectedEvidence: evidence,
  treatment: "build-change",
  businessFunction: fn,
  minutes,
  ceoWorkCategory: cat,
})

const step = (
  treatment: CeoTreatment,
  role: ChainStepTemplate["role"],
  title: string,
  purpose: string,
  evidence: string,
  fn: CeoBusinessFunction,
  minutes: number,
  cat: CeoWorkCategoryId,
): ChainStepTemplate => ({
  role,
  title,
  purpose,
  expectedEvidence: evidence,
  treatment,
  businessFunction: fn,
  minutes,
  ceoWorkCategory: cat,
})

export const INTERVENTION_MATRIX: Record<string, AreaIntervention> = {
  "sales-revenue": {
    areaId: "sales-revenue",
    areaName: "Sales & Revenue",
    destination: "consistent revenue from a sales process that does not depend on you being in every conversation",
    assetIds: ["irresistible-offer", "sales-conversation-guide", "follow-up-sequence", "pricing-strategy"],
    assetFallbackName: "your offer and sales message",
    chains: {
      "build-change": [
        build(
          "Strengthen {asset}",
          "Selling is inconsistent because the offer and message are not yet clear enough to repeat. Clarity comes before follow-up or automation.",
          "One-paragraph offer statement a stranger could repeat back accurately.",
          "communicate",
          60,
          "COMMUNICATE",
        ),
        step(
          "build-change",
          "supporting",
          "Create the sales-conversation version",
          "The written offer must become something you can say out loud in a real conversation — Business Articulation™.",
          "A 90-second spoken version and the three questions you will ask.",
          "sell",
          45,
          "SELL",
        ),
        step(
          "practice-develop",
          "validate",
          "Test the message with one real prospect or client",
          "Evidence beats opinion. One live reaction tells you whether the message lands.",
          "One conversation held; what they repeated back and where they hesitated.",
          "connect",
          45,
          "CONNECT",
        ),
      ],
      "implement-operate": [
        step(
          "implement-operate",
          "primary",
          "Put {asset} to work this week",
          "The asset exists but is not yet operating in your sales motion. Implementation, not rebuilding, is the lever.",
          "Asset used in at least one live sales touchpoint today (call, email, page).",
          "sell",
          60,
          "SELL",
        ),
        step(
          "practice-develop",
          "validate",
          "Hold two sales conversations using it",
          "Reps create the evidence GPS needs to decide whether to refine or systemize next.",
          "Two conversations logged with outcome and one improvement note.",
          "connect",
          60,
          "CONNECT",
        ),
      ],
      "practice-develop": [
        step(
          "practice-develop",
          "primary",
          "Rehearse the sales conversation end-to-end",
          "You know the process but it does not yet feel natural. Practice — not another rewrite — closes that gap.",
          "One full rehearsal recorded or role-played; the one moment you will change.",
          "sell",
          45,
          "SELL",
        ),
        step(
          "practice-develop",
          "validate",
          "Ask for the sale in one real conversation",
          "Confidence is built by doing the hard part once, on purpose.",
          "One ask made; the response captured word-for-word.",
          "connect",
          45,
          "CONNECT",
        ),
      ],
      "delegate-transfer": [
        step(
          "delegate-transfer",
          "primary",
          "Package the sales process so someone else can run the first step",
          "The process works but still depends on you. Transfer the earliest, most repeatable step first.",
          "A one-page handoff: who, which step, the script, and how success is reported.",
          "delegate",
          60,
          "DELEGATE",
        ),
        step(
          "implement-operate",
          "supporting",
          "Brief the person who will own it",
          "A handoff is not delegated until the owner has heard it from you and asked their questions.",
          "Briefing held; first hand-off date set.",
          "communicate",
          30,
          "COMMUNICATE",
        ),
      ],
      "systemize-augment-automate-ai": [
        step(
          "systemize-augment-automate-ai",
          "primary",
          "Systemize follow-up for {asset}",
          "The sales motion is proven and repeatable; friction now is manual follow-up. This is where a system or AI assist earns its place.",
          "Follow-up sequence documented with triggers and timing; first automation step live.",
          "systemize",
          75,
          "SYSTEMIZE",
        ),
        step(
          "systemize-augment-automate-ai",
          "validate",
          "Run the system on this week's live leads",
          "A system is only real once it has processed real work.",
          "Live leads moved through the new follow-up; one measurable result.",
          "augment-automate-ai",
          45,
          "AUGMENT",
        ),
      ],
    },
  },

  "growth-innovation": {
    areaId: "growth-innovation",
    areaName: "Growth & Innovation",
    destination: "a visible, repeatable growth engine that creates demand ahead of your calendar",
    assetIds: ["visibility-strategy", "content-strategy", "signature-keynote", "ideal-client-compass"],
    assetFallbackName: "your visibility strategy",
    chains: {
      "build-change": [
        build(
          "Decide the one growth channel for the next 90 days",
          "Scattered visibility does not compound. One channel, chosen deliberately, does.",
          "Channel, audience, and cadence written in three lines.",
          "decide",
          45,
          "DECIDE",
        ),
        step(
          "build-change",
          "supporting",
          "Draft {asset}",
          "The strategy needs a durable artifact so it survives busy weeks.",
          "First full draft saved to the Asset Library.",
          "build",
          60,
          "BUILD",
        ),
        step(
          "practice-develop",
          "validate",
          "Publish or pitch one piece today",
          "Momentum is evidence. One real output tests the plan against reality.",
          "One piece published or one pitch sent.",
          "market",
          30,
          "MARKET",
        ),
      ],
      "implement-operate": [
        step(
          "implement-operate",
          "primary",
          "Execute this week's slice of {asset}",
          "The strategy exists — the constraint is execution. Work the plan, do not rewrite it.",
          "This week's planned outputs produced and scheduled.",
          "market",
          75,
          "MARKET",
        ),
        step(
          "practice-develop",
          "validate",
          "Review last cycle's results and adjust one variable",
          "Growth is iterative. Change one thing based on evidence, not mood.",
          "One metric reviewed; one adjustment written down.",
          "decide",
          30,
          "DECIDE",
        ),
      ],
      "delegate-transfer": [
        step(
          "delegate-transfer",
          "primary",
          "Hand off production of {asset} outputs",
          "You should decide the message, not produce every piece. Transfer production first.",
          "Handoff brief with examples, cadence, and review point.",
          "delegate",
          60,
          "DELEGATE",
        ),
      ],
      "systemize-augment-automate-ai": [
        step(
          "systemize-augment-automate-ai",
          "primary",
          "Build the content production system around {asset}",
          "The message is proven; the constraint is volume and consistency. Systems and AI assist now make sense.",
          "Repeatable workflow documented; one AI-assisted draft produced and reviewed.",
          "augment-automate-ai",
          75,
          "AUGMENT",
        ),
      ],
    },
  },

  operations: {
    areaId: "operations",
    areaName: "Operations",
    destination: "delivery that runs on process instead of memory, protecting your margin and your time",
    assetIds: ["client-onboarding-sop", "workflow-map", "weekly-ops-checklist"],
    assetFallbackName: "your core operating process",
    chains: {
      "build-change": [
        build(
          "Map the one workflow causing the most friction",
          "You cannot fix, delegate, or automate a process you have not seen end-to-end.",
          "Workflow mapped step-by-step with the three failure points marked.",
          "build",
          60,
          "BUILD",
        ),
        step(
          "build-change",
          "supporting",
          "Write the first version of {asset}",
          "A written standard turns your judgement into something repeatable.",
          "SOP draft with owner, trigger, steps, and done-criteria.",
          "systemize",
          60,
          "SYSTEMIZE",
        ),
      ],
      "implement-operate": [
        step(
          "implement-operate",
          "primary",
          "Run {asset} on this week's live work",
          "The process is written; the constraint is that it is not yet operating. Use it on real work today.",
          "Process followed on one live client/job; deviations noted.",
          "deliver",
          60,
          "DELIVER",
        ),
      ],
      "delegate-transfer": [
        step(
          "delegate-transfer",
          "primary",
          "Transfer ownership of {asset}",
          "A proven process still owned by you is a bottleneck with a name. Name the new owner.",
          "Owner named, briefed, and first independent run scheduled.",
          "delegate",
          60,
          "DELEGATE",
        ),
        step(
          "implement-operate",
          "supporting",
          "Define how the owner reports back",
          "Delegation without a reporting loop becomes abdication.",
          "One-line weekly report format agreed.",
          "communicate",
          20,
          "COMMUNICATE",
        ),
      ],
      "systemize-augment-automate-ai": [
        step(
          "systemize-augment-automate-ai",
          "primary",
          "Automate the repetitive step in {asset}",
          "The process is stable and owned; the remaining friction is repetitive handling. Automate that step only.",
          "One step automated or AI-assisted; time saved measured.",
          "augment-automate-ai",
          75,
          "AUGMENT",
        ),
      ],
    },
  },

  "client-experience": {
    areaId: "client-experience",
    areaName: "Client Experience",
    destination: "clients who stay, renew, and refer — the most profitable revenue you have",
    assetIds: ["client-retention-playbook", "client-onboarding-sop", "testimonial-system"],
    assetFallbackName: "your client experience",
    chains: {
      "build-change": [
        build(
          "Design the client check-in cadence",
          "Retention problems are usually attention problems. A cadence makes attention systematic.",
          "Cadence written: when, who, what we ask, what we do with the answer.",
          "decide",
          45,
          "DECIDE",
        ),
        step(
          "build-change",
          "supporting",
          "Draft {asset}",
          "Turn the cadence into a durable playbook so it survives your busiest week.",
          "Playbook v1 saved to the Asset Library.",
          "build",
          60,
          "BUILD",
        ),
      ],
      "implement-operate": [
        step(
          "implement-operate",
          "primary",
          "Run this week's client check-ins from {asset}",
          "The playbook exists; the constraint is consistency. Execute it today.",
          "Check-ins completed; one risk and one opportunity captured.",
          "deliver",
          60,
          "DELIVER",
        ),
        step(
          "practice-develop",
          "validate",
          "Ask one happy client for a testimonial or referral",
          "Retention work compounds when it turns into proof and pipeline.",
          "One ask made; response captured.",
          "connect",
          20,
          "CONNECT",
        ),
      ],
      "delegate-transfer": [
        step(
          "delegate-transfer",
          "primary",
          "Hand routine client touchpoints to a team member",
          "You should own the relationship, not every message. Transfer routine touchpoints first.",
          "Touchpoints listed, owner named, escalation rule written.",
          "delegate",
          60,
          "DELEGATE",
        ),
      ],
      "systemize-augment-automate-ai": [
        step(
          "systemize-augment-automate-ai",
          "primary",
          "Systemize onboarding and check-in reminders",
          "The experience is defined and owned; the friction is remembering. Let a system remember.",
          "Reminder/automation live for onboarding and cadence.",
          "systemize",
          60,
          "SYSTEMIZE",
        ),
      ],
    },
  },

  authority: {
    areaId: "authority",
    areaName: "Authority",
    destination: "recognized expertise that pulls the right clients toward you and shortens every sale",
    assetIds: ["signature-keynote", "thought-leadership-platform", "podcast-pitch-list", "book-outline"],
    assetFallbackName: "your authority platform",
    chains: {
      "build-change": [
        build(
          "Define the one idea you want to be known for",
          "Authority scatters when the message does. One idea, said many ways, compounds.",
          "One-sentence point of view and the three proofs behind it.",
          "decide",
          45,
          "DECIDE",
        ),
        step(
          "build-change",
          "supporting",
          "Draft {asset}",
          "Give the idea a durable vehicle.",
          "Outline or draft saved to the Asset Library.",
          "build",
          60,
          "BUILD",
        ),
        step(
          "practice-develop",
          "validate",
          "Send one pitch or publish one piece",
          "Authority is earned in public. Ship one thing.",
          "One pitch sent or one piece published.",
          "market",
          30,
          "MARKET",
        ),
      ],
      "implement-operate": [
        step(
          "implement-operate",
          "primary",
          "Work {asset} this week",
          "The platform exists; the constraint is cadence. Execute the planned outreach.",
          "This week's pitches/publications completed.",
          "market",
          75,
          "MARKET",
        ),
      ],
      "practice-develop": [
        step(
          "practice-develop",
          "primary",
          "Rehearse your keynote or core talk aloud",
          "Authority on paper is not authority in the room. Practice the delivery.",
          "One full run-through; the one section you will tighten.",
          "communicate",
          60,
          "COMMUNICATE",
        ),
      ],
      "delegate-transfer": [
        step(
          "delegate-transfer",
          "primary",
          "Delegate pitch research and outreach admin",
          "You should own the ideas and the conversations, not the spreadsheet.",
          "Research brief handed off with criteria and weekly target.",
          "delegate",
          45,
          "DELEGATE",
        ),
      ],
      "systemize-augment-automate-ai": [
        step(
          "systemize-augment-automate-ai",
          "primary",
          "Build the repurposing system around {asset}",
          "The message is proven; the constraint is reach. Systemize repurposing with AI assist.",
          "One core piece repurposed into three formats via a documented workflow.",
          "augment-automate-ai",
          60,
          "AUGMENT",
        ),
      ],
    },
  },

  finance: {
    areaId: "finance",
    areaName: "Finance",
    destination: "profit and healthy cash flow you can see, predict, and decide from",
    assetIds: ["pricing-strategy", "cash-flow-forecast", "profit-plan"],
    assetFallbackName: "your numbers",
    chains: {
      "build-change": [
        build(
          "Build the one-page cash view",
          "You cannot lead what you cannot see. One page: cash in, cash out, runway.",
          "One-page cash view completed with this month's actuals.",
          "own",
          60,
          "DECIDE",
        ),
        step(
          "build-change",
          "supporting",
          "Decide one pricing or cost change",
          "Finance work only matters when it changes a decision.",
          "One decision written with the number it should move.",
          "decide",
          30,
          "DECIDE",
        ),
      ],
      "implement-operate": [
        step(
          "implement-operate",
          "primary",
          "Run your weekly finance review from {asset}",
          "The view exists; the constraint is the habit. Review it today and decide one thing.",
          "Review completed; one decision recorded.",
          "own",
          45,
          "DECIDE",
        ),
      ],
      "delegate-transfer": [
        step(
          "delegate-transfer",
          "primary",
          "Hand bookkeeping and reporting prep to a specialist",
          "You should read the numbers, not compile them.",
          "Scope, cadence, and report format agreed with the owner.",
          "delegate",
          45,
          "DELEGATE",
        ),
      ],
      "systemize-augment-automate-ai": [
        step(
          "systemize-augment-automate-ai",
          "primary",
          "Automate invoicing and cash reporting",
          "Finance is stable and owned; the friction is manual reporting. Automate the report, keep the decision.",
          "Automated report live; first run reviewed.",
          "systemize",
          60,
          "SYSTEMIZE",
        ),
      ],
    },
  },

  "ai-automation": {
    areaId: "ai-automation",
    areaName: "AI & Automation",
    destination: "capacity you did not have to hire — applied only where the process is already proven",
    assetIds: ["ai-workflow-map", "automation-inventory"],
    assetFallbackName: "your automation candidates",
    chains: {
      "build-change": [
        build(
          "Inventory what is actually repeatable",
          "AI applied to a broken process automates the breakage. Start by finding what is truly repeatable.",
          "List of repeatable tasks with frequency, owner, and readiness score.",
          "decide",
          45,
          "DECIDE",
        ),
        step(
          "build-change",
          "supporting",
          "Document the top candidate end-to-end",
          "Automation needs a written process to follow.",
          "Process documented with inputs, steps, outputs, exceptions.",
          "systemize",
          45,
          "SYSTEMIZE",
        ),
      ],
      "implement-operate": [
        step(
          "implement-operate",
          "primary",
          "Stand up the first automation from {asset}",
          "The candidate is proven and documented — build the first working version today.",
          "Automation live on one real task; result checked by you.",
          "augment-automate-ai",
          75,
          "AUGMENT",
        ),
        step(
          "practice-develop",
          "validate",
          "Review outputs and set the quality rule",
          "AI needs a human standard. Define what 'good enough' means before scaling.",
          "Quality rule written; one output accepted, one corrected.",
          "own",
          30,
          "DECIDE",
        ),
      ],
      "systemize-augment-automate-ai": [
        step(
          "systemize-augment-automate-ai",
          "primary",
          "Extend automation to the next proven process",
          "First automation is working; scale deliberately to the next repeatable candidate.",
          "Second process automated or AI-assisted; time saved logged.",
          "augment-automate-ai",
          75,
          "AUGMENT",
        ),
      ],
    },
  },
}

/** Map an EGA obstacle type to the treatment it most naturally points at. */
export const OBSTACLE_TO_TREATMENT: Record<string, CeoTreatment> = {
  knowledge: "build-change",
  decision: "build-change",
  system: "systemize-augment-automate-ai",
  delegation: "delegate-transfer",
  capacity: "delegate-transfer",
  confidence: "practice-develop",
  time: "implement-operate",
  priority: "implement-operate",
}

/** Human-readable treatment reasoning shown in WHY THIS WORK. */
export const TREATMENT_REASON: Record<CeoTreatment, string> = {
  "build-change": "the underlying asset or decision is not yet clear enough to implement, so GPS is starting with building/changing it",
  "implement-operate": "the asset exists but is not yet operating in the business, so GPS is starting with implementation rather than rebuilding",
  "practice-develop": "you know the process but it is not yet natural to perform, so GPS is prioritizing practice over another rewrite",
  "delegate-transfer": "the process is proven but still depends on you, so GPS is moving it toward someone else",
  "systemize-augment-automate-ai": "the process is repeatable and owned, so remaining friction is worth systemizing or automating",
}
