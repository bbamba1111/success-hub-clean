/**
 * Work-Life Balance Time-Leak Check™ — Question Registry
 * ---------------------------------------------------------------------------
 * The single source of truth for every question, option and grouping in the
 * Time-Leak Check. Content is verbatim from the approved spec. Q3 and Q4 share
 * the same option list (Q4 is the single-select "biggest source" drawn from
 * Q3). Q5 is grouped under the existing 8 Harmony Lane business categories.
 * Q6 mirrors the 15 Core Life Value Areas of the WBA (keys match
 * utils/life-value-categories.ts so downstream mapping stays aligned).
 */

import type { TimeLeakGroup, TimeLeakOption } from "./types"

/* ── Q1 · Where work spills into life ───────────────────────────────────── */
export const SPILLOVER_OPTIONS: TimeLeakOption[] = [
  { id: "before-workday", label: "Before my intended workday begins" },
  { id: "after-workday", label: "After my intended workday ends" },
  { id: "evenings", label: "Evenings" },
  { id: "fridays", label: "Fridays" },
  { id: "weekends", label: "Weekends" },
  { id: "meals", label: "During meals" },
  { id: "family-time", label: "During family/personal time" },
  { id: "vacations", label: "During vacations or days off" },
  { id: "check-constantly", label: "I check work constantly throughout the day" },
  { id: "mentally-connected", label: "I remain mentally connected to work when I'm not working" },
]

/* ── Q2 · What overworking looks like ───────────────────────────────────── */
export const OVERWORK_SHAPE_OPTIONS: TimeLeakOption[] = [
  { id: "longer-days", label: "Working longer days than I intend" },
  { id: "more-than-5-days", label: "Working more than 5 days a week" },
  { id: "through-lunch", label: "Working through lunch" },
  { id: "skip-movement", label: "Skipping movement or exercise" },
  { id: "sacrifice-sleep", label: "Sacrificing sleep" },
  { id: "postpone-self-care", label: "Postponing self-care" },
  { id: "postpone-recreation", label: "Postponing recreation and fun" },
  { id: "less-loved-ones", label: "Spending less time with loved ones" },
  { id: "little-personal-time", label: "Having little uninterrupted personal time" },
  { id: "constant-switching", label: "Constantly switching between work and life" },
  { id: "never-turn-off", label: "Feeling like I can never completely turn work off" },
]

/* ── Q3 · What keeps pulling you back (also the Q4 single-select source) ─── */
export const PULL_BACK_OPTIONS: TimeLeakOption[] = [
  { id: "decisions-to-me", label: "Too many decisions come back to me" },
  { id: "only-i-can-do", label: "Too much work only I can do" },
  { id: "dont-delegate", label: "I don't delegate enough" },
  { id: "no-operating-rules", label: "I don't have clear business operating rules" },
  { id: "no-systems-sops", label: "I don't have repeatable systems or SOPs" },
  { id: "team-depends", label: "My team depends on me too much" },
  { id: "clients-demand-access", label: "Clients/customers demand access outside my desired boundaries" },
  { id: "too-many-meetings", label: "Too many meetings" },
  { id: "too-many-interruptions", label: "Too many interruptions" },
  { id: "notifications", label: "Email/messages/notifications" },
  { id: "hard-to-say-no", label: "I have difficulty saying no" },
  { id: "no-boundaries", label: "I don't have clear work-life boundaries" },
  { id: "no-defined-workday", label: "I don't have a defined workday" },
  { id: "no-protected-days-off", label: "I don't have protected days off" },
  { id: "not-enough-time", label: "I don't have enough time for the amount of work I am carrying" },
  { id: "dont-know-prioritize", label: "I don't know what to prioritize" },
  { id: "keep-taking-more", label: "I keep taking on more work" },
  { id: "guilty-when-stop", label: "I feel guilty when I stop" },
  { id: "worry-falls-apart", label: "I worry things will fall apart if I stop" },
]

/* ── Q5 · Founder Hat Load™ — grouped under the 8 business categories ────── */
export const HAT_LOAD_GROUPS: TimeLeakGroup[] = [
  {
    id: "strategic-foundation",
    label: "Strategic Foundation",
    options: [
      { id: "vision-direction", label: "Vision / Direction" },
      { id: "business-strategy", label: "Business Strategy" },
      { id: "offer-design", label: "Offer Design" },
      { id: "decision-making", label: "Decision Making" },
      { id: "business-model", label: "Business Model" },
      { id: "operating-rules", label: "Business Operating Rules" },
      { id: "prioritization", label: "Prioritization" },
    ],
  },
  {
    id: "marketing-visibility",
    label: "Marketing & Visibility",
    options: [
      { id: "marketing", label: "Marketing" },
      { id: "content-creation", label: "Content Creation" },
      { id: "social-media", label: "Social Media" },
      { id: "brand", label: "Brand" },
      { id: "public-relations", label: "Public Relations" },
      { id: "media-outreach", label: "Media / Podcast Outreach" },
      { id: "thought-leadership-mkt", label: "Thought Leadership" },
      { id: "visibility-audience", label: "Visibility / Audience Building" },
    ],
  },
  {
    id: "sales-revenue",
    label: "Sales & Revenue",
    options: [
      { id: "sales", label: "Sales" },
      { id: "discovery-consult", label: "Discovery / Consultation" },
      { id: "proposals", label: "Proposals" },
      { id: "pricing-sales", label: "Pricing" },
      { id: "follow-up", label: "Follow-Up" },
      { id: "business-development", label: "Business Development" },
      { id: "revenue-generation", label: "Revenue Generation" },
    ],
  },
  {
    id: "operations-systems",
    label: "Operations & Systems",
    options: [
      { id: "operations", label: "Operations" },
      { id: "project-management", label: "Project Management" },
      { id: "process-design", label: "Process Design" },
      { id: "sops", label: "SOPs" },
      { id: "workflow-management", label: "Workflow Management" },
      { id: "quality-control", label: "Quality Control" },
      { id: "problem-solving", label: "Problem Solving" },
      { id: "technology-systems", label: "Technology / Systems" },
      { id: "ai-workflows", label: "AI Workflows" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    options: [
      { id: "financial-management", label: "Financial Management" },
      { id: "bookkeeping-oversight", label: "Bookkeeping Oversight" },
      { id: "cash-flow", label: "Cash Flow" },
      { id: "financial-review", label: "Financial Review" },
      { id: "pricing-profitability", label: "Pricing / Profitability" },
      { id: "tax-admin", label: "Tax / Financial Administration" },
    ],
  },
  {
    id: "people-leadership",
    label: "People & Leadership",
    options: [
      { id: "team-leadership", label: "Team Leadership" },
      { id: "hiring", label: "Hiring" },
      { id: "people-management", label: "People Management" },
      { id: "training", label: "Training" },
      { id: "delegation", label: "Delegation" },
      { id: "performance-management", label: "Performance Management" },
      { id: "culture", label: "Culture" },
      { id: "conflict-resolution", label: "Conflict Resolution" },
    ],
  },
  {
    id: "client-experience",
    label: "Client Experience & Delivery",
    options: [
      { id: "client-onboarding", label: "Client Onboarding" },
      { id: "client-communication", label: "Client Communication" },
      { id: "client-service", label: "Client Service" },
      { id: "client-success", label: "Client Success" },
      { id: "service-delivery", label: "Service Delivery" },
      { id: "delivery-management", label: "Delivery Management" },
      { id: "retention", label: "Retention" },
      { id: "referrals", label: "Referrals" },
    ],
  },
  {
    id: "growth-innovation",
    label: "Growth & Innovation",
    options: [
      { id: "research", label: "Research" },
      { id: "learning", label: "Learning" },
      { id: "innovation", label: "Innovation" },
      { id: "partnerships", label: "Partnerships" },
      { id: "product-development", label: "Product / Service Development" },
      { id: "growth-strategy", label: "Growth Strategy" },
      { id: "thought-leadership-growth", label: "Thought Leadership" },
      { id: "ai-innovation", label: "AI / Innovation" },
    ],
  },
]

/** Founder Dependency — surfaced prominently, outside the 8 category grid. */
export const FOUNDER_DEPENDENCY_OPTION: TimeLeakOption = {
  id: "everything-comes-back-to-me",
  label: "Everything ultimately comes back to me.",
}

/* ── Q6 · Life Impact Map™ — mirrors the WBA 15 Core Life Value Areas ────── */
/** ids match utils/life-value-categories.ts keys so the map aligns with WBA. */
export const LIFE_IMPACT_OPTIONS: { id: string; label: string; description: string }[] = [
  {
    id: "spiritual",
    label: "Spiritual Well-being",
    description: "Less time for spiritual practices, prayer, reflection, fellowship, meditation, nature, etc.",
  },
  {
    id: "mental",
    label: "Mental Health",
    description: "Less mental space, more stress, difficulty thinking clearly.",
  },
  {
    id: "physicalMovement",
    label: "Physical Movement",
    description: "Not enough time for exercise or intentional movement.",
  },
  {
    id: "physicalNourishment",
    label: "Physical Nourishment",
    description: "Skipping meals, poor food choices, inadequate hydration.",
  },
  {
    id: "physicalSleep",
    label: "Physical Sleep",
    description: "Going to bed too late, not getting enough sleep, or working during wind-down time.",
  },
  {
    id: "emotional",
    label: "Emotional Health",
    description: "Less peace, joy, emotional balance, or restoration.",
  },
  {
    id: "personal",
    label: "Personal Growth",
    description: "Less time for self-care, personal development, or activities that support me as a person.",
  },
  {
    id: "intellectual",
    label: "Intellectual Development",
    description: "Less time to learn, read, study, or develop new skills.",
  },
  {
    id: "professional",
    label: "Professional Life",
    description:
      "My professional life is becoming dominated by work demands rather than intentional professional growth and visibility.",
  },
  {
    id: "financial",
    label: "Financial Health",
    description:
      "I am spending too much time working without enough intentional focus on the financial outcomes I want.",
  },
  {
    id: "environmental",
    label: "Environmental Wellness",
    description: "My home or workspace becomes disorganized or neglected because work takes over.",
  },
  {
    id: "relational",
    label: "Relationships",
    description: "Less attention, presence, or quality time with loved ones.",
  },
  {
    id: "social",
    label: "Social Connections",
    description: "Less time with friends, community, peers, or supportive people.",
  },
  {
    id: "recreational",
    label: "Recreation & Fun",
    description: "Little or no time for joy, creativity, travel, play, hobbies, or fun.",
  },
  {
    id: "charitable",
    label: "Charitable Giving",
    description: "Less time available to volunteer, give, serve, or contribute.",
  },
]

/* ── Q7 · Solution Match — grouped, choose up to 3 ──────────────────────── */
export const SOLUTION_MATCH_MAX = 3

export const SOLUTION_MATCH_GROUPS: TimeLeakGroup[] = [
  {
    id: "work-structure",
    label: "Work Structure",
    options: [
      { id: "four-day-workweek", label: "4-Day Workweek™" },
      { id: "four-hour-ceo-workday", label: "4-Hour Focused CEO Workday™" },
      { id: "wlb-boundaries", label: "Clear Work-Life Balance Boundaries™" },
      { id: "defined-start-stop", label: "Defined Workday Start/Stop" },
      { id: "protected-3-day-weekend", label: "Protected 3-Day Weekend™" },
    ],
  },
  {
    id: "business-operating-structure",
    label: "Business Operating Structure",
    options: [
      { id: "operating-rules", label: "Business Operating Rules™" },
      { id: "delegation", label: "Delegation" },
      { id: "sops-systems", label: "SOPs / Repeatable Systems" },
      { id: "ai-augmentation", label: "AI Augmentation" },
      { id: "team-ownership", label: "Clearer Team Ownership" },
      { id: "fewer-meetings", label: "Fewer Meetings" },
      { id: "fewer-interruptions", label: "Fewer Interruptions" },
      { id: "time-containers", label: "Better Time Containers™" },
    ],
  },
  {
    id: "life-protection",
    label: "Life Protection",
    options: [
      { id: "time-freedom", label: "More Time Freedom™" },
      { id: "protected-self-care", label: "Protected Self-Care" },
      { id: "protected-movement", label: "Protected Movement" },
      { id: "hybrid-lunch", label: "Extended Healthy Hybrid Lunch Break™" },
      { id: "protected-sleep", label: "Protected Sleep" },
      { id: "power-down-unplug", label: "Power Down & Unplug™" },
      { id: "relationship-time", label: "More Relationship Time" },
      { id: "recreation-fun", label: "More Recreation & Fun" },
      { id: "protected-personal-time", label: "Protected Personal Time" },
    ],
  },
  {
    id: "founder-role",
    label: "Founder Role",
    options: [
      { id: "stop-everything-comes-back", label: "Stop being the person everything comes back to" },
      { id: "more-strategic", label: "Become more strategic and less reactive" },
      { id: "clearer-ceo-personal-boundaries", label: "Create clearer boundaries between CEO work and personal life" },
      { id: "reduce-work-carried", label: "Reduce the amount of work I personally carry" },
    ],
  },
]

/* ── Lookup helpers ─────────────────────────────────────────────────────── */

/** All Q5 Hat Load options flattened (including Founder Dependency). */
export const ALL_HAT_LOAD_OPTIONS: TimeLeakOption[] = [
  ...HAT_LOAD_GROUPS.flatMap((g) => g.options),
  FOUNDER_DEPENDENCY_OPTION,
]

/** All Q7 solution options flattened. */
export const ALL_SOLUTION_OPTIONS: TimeLeakOption[] = SOLUTION_MATCH_GROUPS.flatMap((g) => g.options)

/** Resolve a Q3/Q4 driver id to its label (used by the Primary Driver result). */
export function pullBackLabel(id: string | null | undefined): string {
  if (!id) return ""
  return PULL_BACK_OPTIONS.find((o) => o.id === id)?.label ?? id
}

/** Resolve a solution id to its label. */
export function solutionLabel(id: string): string {
  return ALL_SOLUTION_OPTIONS.find((o) => o.id === id)?.label ?? id
}
