/**
 * Sunday Design Day™ — content configuration (Phase 4B.1, functional engine).
 *
 * This drives the guided installation flow. Phase 4B.1 makes the flow
 * functional with SESSION-ONLY persistence (see sdd-state.tsx). Long-term
 * database persistence, the 28-day cycle, Cherry Blossom intelligence, AI
 * Executive recommendations, and Mon–Thu planning windows are Phase 4B.2+.
 */

export type PhaseId = "reality-check" | "download-delegate" | "design-tomorrow" | "commit-prepare"

export type PhaseStatus = "not-started" | "in-progress" | "complete"

export interface PhaseMeta {
  id: PhaseId
  /** Short label used in the progress spine. */
  label: string
  /** Full title shown at the top of the phase. */
  title: string
  /** Why this phase exists — one calm sentence. */
  purpose: string
  /** Cherry Blossom Guidance™ shown at the top of the phase body. */
  guidance: string
  /** Label for the button that advances to the next phase. */
  cta: string
}

/** Ordered phases — members progress through these one at a time. */
export const PHASES: PhaseMeta[] = [
  {
    id: "reality-check",
    label: "Reality Check™",
    title: "Reality Check™",
    purpose: "Understand where you are before designing next week.",
    guidance:
      "Before we design your week, let's tell the truth about this one — gently, without judgment. Clarity about where you are is what makes intentional design possible.",
    cta: "Continue to Download & Delegate™",
  },
  {
    id: "download-delegate",
    label: "Download & Delegate™",
    title: "Download & Delegate™",
    purpose: "Reduce overload before Monday begins.",
    guidance:
      "You don't have to carry all of it. Let's move everything out of your head and decide what only you should hold — and what can be delegated, automated, or released.",
    cta: "Continue to Design Tomorrow™",
  },
  {
    id: "design-tomorrow",
    label: "Design Tomorrow™",
    title: "Design Tomorrow™",
    purpose: "Design Monday before you live it.",
    guidance:
      "This is the heart of Sunday Design Day™. Walk through each segment of your Work-Life Balance Business Day™ and design it in advance — so tomorrow is lived, not survived.",
    cta: "Continue to Commit & Prepare™",
  },
  {
    id: "commit-prepare",
    label: "Commit & Prepare™",
    title: "Commit & Prepare™",
    purpose: "Prepare to live Monday.",
    guidance:
      "Everything you've designed comes together here. Review the week you've created, then consciously install it — activating the operating system you just designed.",
    cta: "Install My Week™",
  },
]

/* ------------------------------------------------------------------ *
 * Phase 1 — Reality Check™
 * ------------------------------------------------------------------ */

/** Weekly Review™ free-text reflection fields (active this pass). */
export type WeeklyReviewFieldId = "wins" | "lessons" | "gratitude" | "rulesReview" | "intention" | "declaration"

export interface WeeklyReviewField {
  id: WeeklyReviewFieldId
  label: string
  prompt: string
  placeholder: string
}

export const WEEKLY_REVIEW_FIELDS: WeeklyReviewField[] = [
  {
    id: "wins",
    label: "Weekly Wins™",
    prompt: "What went well this week — however small?",
    placeholder: "The moments, progress, and wins worth honoring…",
  },
  {
    id: "lessons",
    label: "Weekly Lessons™",
    prompt: "What did this week teach you?",
    placeholder: "What you learned, and what you'd do differently…",
  },
  {
    id: "gratitude",
    label: "Gratitude™",
    prompt: "What are you most grateful for right now?",
    placeholder: "The people, moments, and gifts you're thankful for…",
  },
  {
    id: "rulesReview",
    label: "Review Current Operating Rules™",
    prompt: "How are your current Operating Rules™ serving you? What needs to change?",
    placeholder: "What's working, what's slipping, what you'll adjust…",
  },
  {
    id: "intention",
    label: "Weekly Intention™",
    prompt: "How do you want to feel and operate across the week ahead?",
    placeholder: "The energy and posture you're choosing for the week…",
  },
  {
    id: "declaration",
    label: "Weekly Declaration™",
    prompt: "Put your intention into a clear, first-person statement you'll operate from.",
    placeholder: "This week, I…",
  },
]

/**
 * Priority Focus Areas™ — the canonical 15 Work-Life Balance areas.
 * Mirrors `categoryLabels` in components/work-life-balance-audit.tsx.
 * Members select 1–3.
 */
export const FOCUS_AREA_OPTIONS: { id: string; label: string }[] = [
  { id: "spiritual", label: "Spiritual Well-being" },
  { id: "mental", label: "Mental Health" },
  { id: "physicalMovement", label: "Physical Movement" },
  { id: "physicalNourishment", label: "Physical Nourishment" },
  { id: "physicalSleep", label: "Physical Sleep" },
  { id: "emotional", label: "Emotional Health" },
  { id: "personal", label: "Personal Growth" },
  { id: "intellectual", label: "Intellectual Development" },
  { id: "professional", label: "Professional Life" },
  { id: "financial", label: "Financial Health" },
  { id: "environmental", label: "Environmental Wellness" },
  { id: "relational", label: "Relationships" },
  { id: "social", label: "Social Connections" },
  { id: "recreational", label: "Recreation & Fun" },
  { id: "charitable", label: "Charitable Giving" },
]

export const MAX_FOCUS_AREAS = 3

/**
 * 28-Day Operating System Review™ items. Displayed as inactive "Every 4th
 * Sunday" placeholders this pass — the cycle logic that activates them is
 * Phase 4B.2 (anchored to the member's first completed Sunday Design Day™).
 */
export const TWENTY_EIGHT_DAY_REVIEW_ITEMS: { title: string; description: string }[] = [
  {
    title: "Work-Life Balance Audit™",
    description: "Re-score the 15 areas of your life and business to see how harmony has shifted over the cycle.",
  },
  {
    title: "Business Foundation Assessment™",
    description: "Revisit the baseline of your business systems, offers, and operations.",
  },
]

/* ------------------------------------------------------------------ *
 * Phase 2 — Download & Delegate™
 * ------------------------------------------------------------------ */

export interface DelegationCategory {
  id: string
  title: string
  description: string
}

/** Seven distinct destinations for everything on the member's plate. */
export const DELEGATION_CATEGORIES: DelegationCategory[] = [
  { id: "ai", title: "Delegate to AI", description: "Tasks your AI tools and augmented workflows can accelerate or handle end to end." },
  { id: "team", title: "Delegate to Team", description: "Work best owned by employees or team members inside your business." },
  { id: "contractors", title: "Delegate to Contractors", description: "Specialized or one-off work suited to trusted contractors and freelancers." },
  { id: "clients", title: "Delegate to Clients", description: "Steps and responsibilities that are genuinely the client's to carry." },
  { id: "family", title: "Delegate to Family", description: "Home and life responsibilities that can be shared with the people around you." },
  { id: "eliminate", title: "Eliminate", description: "What doesn't need to happen at all. Release it completely." },
  { id: "delay", title: "Delay", description: "What's real, but doesn't need to happen now. Park it for later." },
]

/* ------------------------------------------------------------------ *
 * Phase 3 — Design Tomorrow™
 * ------------------------------------------------------------------ */

export interface CeoSection {
  id: string
  title: string
  description: string
  /** Informational only this pass (no input captured). */
  informational?: boolean
}

export interface SegmentCard {
  id: string
  title: string
  /** Cherry Blossom Guidance™ for this segment. */
  guidance: string
  /** Prompt for the segment's single Operating Rule™. */
  rulePrompt: string
  /** Prompt for the segment's planner note. */
  plannerPrompt: string
  /** CEO Workday only — the five planning sections. */
  ceoSections?: CeoSection[]
}

export const DESIGN_SEGMENTS: SegmentCard[] = [
  {
    id: "early-access",
    title: "Early Access & Flex Time™",
    guidance: "The day hasn't asked anything of you yet. Set the tone before it does.",
    rulePrompt: "Your Operating Rule™ for easing in with clarity.",
    plannerPrompt: "How will you spend these first unhurried minutes?",
  },
  {
    id: "morning-given",
    title: "Morning GIV•EN™",
    guidance: "Lead yourself before you lead your business — Gratitude, Invitation, Vision, Emotion, Nurture.",
    rulePrompt: "Your Operating Rule™ for grounding yourself each morning.",
    plannerPrompt: "What will your GIV•EN™ routine include tomorrow?",
  },
  {
    id: "movement",
    title: "30-Minute Workday Movement™",
    guidance: "Care for the body that carries your vision. Thirty intentional minutes.",
    rulePrompt: "Your Operating Rule™ for moving your body.",
    plannerPrompt: "How will you move tomorrow?",
  },
  {
    id: "lunch",
    title: "Extended Healthy Hybrid Lunch™",
    guidance: "Nourishment is productive. Step fully away and return restored.",
    rulePrompt: "Your Operating Rule™ for a genuine midday break.",
    plannerPrompt: "How will you nourish and reconnect at midday?",
  },
  {
    id: "ceo-workday",
    title: "4-Hour Focused CEO Workday™",
    guidance:
      "Your protected execution window. The priority isn't doing more — it's protecting uninterrupted thinking.",
    rulePrompt: "Your Business Operating Rule™ for protecting deep work.",
    plannerPrompt: "What is the ONE outcome that would make tomorrow a win?",
    ceoSections: [
      { id: "ai-augmentation-hour", title: "AI Augmentation Hour™", description: "Partner with AI to accelerate your highest-leverage work." },
      {
        id: "ai-executive-team",
        title: "AI Executive Leadership Team™",
        description: "Your AI executive advisors for strategy and decisions. Recommendations arrive in a later release.",
        informational: true,
      },
      { id: "business-operating-rule", title: "Business Operating Rule™", description: "Set tomorrow's rule for meetings, delegation, and decisions." },
      { id: "human-zone-of-genius", title: "Human Zone of Genius™", description: "Focus your human energy where only you can create value." },
      { id: "execution-friction", title: "Execution Friction™", description: "Identify and remove what's slowing your execution." },
    ],
  },
  {
    id: "time-freedom",
    title: "Time Freedom™",
    guidance: "The life your business exists to support. Protect it with the same intention as your work.",
    rulePrompt: "Your Operating Rule™ for protecting your Time Freedom™.",
    plannerPrompt: "What life moments are you protecting tomorrow?",
  },
  {
    id: "power-down",
    title: "Power Down & Unplug™",
    guidance: "Let the day come to a gentle close so your mind can finally slow.",
    rulePrompt: "Your Operating Rule™ for powering down.",
    plannerPrompt: "How will you transition from productivity to rest?",
  },
]

/* ------------------------------------------------------------------ *
 * Phase 4 — Commit & Prepare™
 * ------------------------------------------------------------------ */

/** Cherry Blossom's closing guidance on the final phase. */
export const CLOSING_GUIDANCE =
  "Tomorrow has already been designed. Your only remaining commitment is to honor tonight's Power Down & Unplug™ and arrive Monday ready to live what you've intentionally created."
