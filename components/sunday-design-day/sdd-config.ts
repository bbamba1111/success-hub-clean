/**
 * Sunday Design Day™ — static content configuration (Phase 4A, architecture only).
 *
 * This drives the guided installation flow. Everything here is placeholder
 * copy: no persistence, no scoring, no AI. Each item becomes a real feature in
 * a later sprint (Reality Check™ → Audit, Download & Delegate™ → interactive,
 * Design Tomorrow™ → planners, Commit & Prepare™ → saves the week).
 */

export type PhaseId = "reality-check" | "download-delegate" | "design-tomorrow" | "commit-prepare"

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

export interface PlaceholderItem {
  title: string
  description: string
  /** Optional tag, e.g. "First Sunday Only". */
  tag?: string
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
      "Everything you've designed comes together here. Review the week you've created, then step away knowing tomorrow is already handled.",
    cta: "Finish Sunday Design Day™",
  },
]

/** Phase 1 — Reality Check™ items. */
export const REALITY_CHECK_ITEMS: PlaceholderItem[] = [
  {
    title: "Work-Life Balance Audit™",
    description: "Score the 15 areas of your life and business to see where harmony is thriving — and where it's asking for attention.",
  },
  {
    title: "Business Foundation Assessment™",
    description: "Establish the baseline of your business systems, offers, and operations.",
    tag: "First Sunday Only",
  },
  {
    title: "Cherry Blossom Review™",
    description: "A gentle reflection on the week that's ending — your wins, your lessons, and what you're ready to release.",
  },
  {
    title: "Select 1–3 Priority Focus Areas™",
    description: "Choose the few areas that deserve your focused energy this coming week.",
  },
  {
    title: "Weekly Intention™",
    description: "Name how you want to feel and operate across the week ahead.",
  },
  {
    title: "Weekly Declaration™",
    description: "Put your intention into a clear, first-person statement you'll operate from.",
  },
]

/** Phase 2 — Download & Delegate™ categories. */
export const DELEGATION_CATEGORIES: PlaceholderItem[] = [
  {
    title: "Delegate to AI",
    description: "Tasks your AI tools and augmented workflows can accelerate or handle end to end.",
  },
  {
    title: "Delegate to Team",
    description: "Work best owned by employees or team members inside your business.",
  },
  {
    title: "Delegate to Contractors",
    description: "Specialized or one-off work suited to trusted contractors and freelancers.",
  },
  {
    title: "Delegate to Clients",
    description: "Steps and responsibilities that are genuinely the client's to carry.",
  },
  {
    title: "Delegate to Family",
    description: "Home and life responsibilities that can be shared with the people around you.",
  },
  {
    title: "Eliminate / Delay",
    description: "What doesn't need to happen at all — or doesn't need to happen now.",
  },
]

/** Phase 3 — Design Tomorrow™ operating segments. */
export interface SegmentCard {
  title: string
  /** The four placeholder workspace modules inside each segment. */
  modules: string[]
  /** CEO Workday only — the five planning blocks as a vertical sequence. */
  ceoBlocks?: PlaceholderItem[]
}

const SEGMENT_MODULES = [
  "Cherry Blossom Guidance™",
  "Operating Rule™",
  "Planner Preview™",
  "Harmony Soundscapes™",
]

export const DESIGN_SEGMENTS: SegmentCard[] = [
  { title: "Early Access & Flex Time™", modules: SEGMENT_MODULES },
  { title: "Morning GIV•EN™", modules: SEGMENT_MODULES },
  { title: "30-Minute Workday Movement™", modules: SEGMENT_MODULES },
  { title: "Extended Healthy Hybrid Lunch™", modules: SEGMENT_MODULES },
  {
    title: "4-Hour Focused CEO Workday™",
    modules: SEGMENT_MODULES,
    ceoBlocks: [
      { title: "AI Augmentation Hour™", description: "Partner with AI to accelerate your highest-leverage work." },
      { title: "AI Executive Leadership Team™", description: "Consult your AI executive advisors for strategy and decisions." },
      { title: "Business Operating Rule™", description: "Set today's rule for meetings, delegation, and decisions." },
      { title: "Human Zone of Genius™", description: "Focus your human energy where only you can create value." },
      { title: "Execution Friction™", description: "Identify and remove what's slowing your execution." },
    ],
  },
  { title: "Time Freedom™", modules: SEGMENT_MODULES },
  { title: "Power Down & Unplug™", modules: SEGMENT_MODULES },
]

/** Phase 4 — Commit & Prepare™ summary placeholders. */
export const COMMIT_SUMMARY: PlaceholderItem[] = [
  { title: "Priority Focus Areas™", description: "The 1–3 areas you chose to focus on this week." },
  { title: "Weekly Intention™", description: "How you intend to feel and operate." },
  { title: "Weekly Declaration™", description: "Your first-person statement for the week." },
  { title: "Operating Rules™", description: "The rules you set across your daily segments." },
  { title: "CEO Priorities™", description: "The high-leverage work only you can do." },
  { title: "Time Freedom Commitment™", description: "The life moments you're protecting this week." },
]

/** Cherry Blossom's closing guidance on the final phase. */
export const CLOSING_GUIDANCE =
  "Tomorrow has already been designed. Your only remaining commitment is to honor tonight's Power Down & Unplug™ and arrive Monday ready to live what you've intentionally created."
