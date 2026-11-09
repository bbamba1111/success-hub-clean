import type { CeoWorkCategoryId } from "./categories"
import type { CeoCompletionBasis } from "./plan-types"

/**
 * The nine Workshops & Webinars work options. A work option only describes
 * work — it never grants authority to act outside BO$$ (Phase 4 rules apply).
 */
export type ExperienceOptionKey =
  | "exp.strategy"
  | "exp.develop"
  | "exp.produce"
  | "exp.register"
  | "exp.promote"
  | "exp.deliver"
  | "exp.followup"
  | "exp.convert"
  | "exp.optimize"

export type ExperienceReadinessKey =
  | "has-delivery-platform"
  | "has-next-offer"
  | "has-registration-tool"
  | "has-email-list"

export interface ExperienceOption {
  key: ExperienceOptionKey
  area: string
  work: string
  outcome: string
  minutes: number
  category: CeoWorkCategoryId
  executive: string
  alternateExecutives?: string[]
  workflow: string
  /** Setup work is proposed for a series' first occurrence only. */
  scope: "setup" | "per-occurrence"
  /** Highest basis the work itself can reach without an authorized capability. */
  defaultBasis: CeoCompletionBasis
  /** What stays with the founder when no authorized capability exists. */
  leftForFounder?: string
  readiness?: ExperienceReadinessKey[]
}

export const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  {
    key: "exp.strategy",
    area: "Strategy",
    work: "Define the audience, topic, promise and conversion goal for my experience.",
    outcome: "One-page brief with audience, outcomes and next offer is approved.",
    minutes: 45,
    category: "DECIDE",
    executive: "Strategy Executive™",
    workflow: "Experience brief",
    scope: "setup",
    defaultBasis: "internal",
  },
  {
    key: "exp.develop",
    area: "Development",
    work: "Develop the curriculum, slide outline and participant exercise.",
    outcome: "Teaching outline, slide notes and one exercise are approved.",
    minutes: 55,
    category: "BUILD",
    executive: "Growth Executive™",
    workflow: "Curriculum build",
    scope: "setup",
    defaultBasis: "internal",
    leftForFounder: "Building the actual slides in your presentation tool.",
  },
  {
    key: "exp.produce",
    area: "Production",
    work: "Plan the run of show, platform and tech check.",
    outcome: "Run of show and tech checklist are approved.",
    minutes: 40,
    category: "BUILD",
    executive: "Operations Executive™",
    workflow: "Run of show",
    scope: "setup",
    defaultBasis: "internal",
    leftForFounder: "Creating the meeting link and running the tech test.",
  },
  {
    key: "exp.register",
    area: "Registration",
    work: "Prepare the registration page, confirmation and reminder copy.",
    outcome: "Page draft and messages are approved. \"Live\" is recorded separately.",
    minutes: 45,
    category: "BUILD",
    executive: "Operations Executive™",
    workflow: "Page build",
    scope: "setup",
    defaultBasis: "internal",
    leftForFounder: "Publishing the page and scheduling the reminders.",
    readiness: ["has-registration-tool"],
  },
  {
    key: "exp.promote",
    area: "Promotion",
    work: "Prepare promotion and personal invitations for this occurrence.",
    outcome: "Promotion and invitation drafts are approved. Sends are recorded separately.",
    minutes: 40,
    category: "MARKET",
    executive: "Marketing & Brand Executive™",
    workflow: "Content piece + Outreach",
    scope: "per-occurrence",
    defaultBasis: "internal",
    leftForFounder: "Publishing posts and sending invitations.",
    readiness: ["has-email-list"],
  },
  {
    key: "exp.deliver",
    area: "Live delivery",
    work: "Final host prep and go-live check for today's experience.",
    outcome: "Host checklist is complete. Attendance is entered on the occurrence after the event.",
    minutes: 30,
    category: "DELIVER",
    executive: "Client Success Executive™",
    workflow: "Session delivery",
    scope: "per-occurrence",
    defaultBasis: "internal",
    leftForFounder: "Hosting the session and entering attendance.",
    readiness: ["has-delivery-platform"],
  },
  {
    key: "exp.followup",
    area: "Follow-up",
    work: "Prepare attendee and no-show follow-up with resources and next steps.",
    outcome: "Follow-up drafts for both groups are approved. Sends are recorded separately.",
    minutes: 30,
    category: "DELIVER",
    executive: "Client Success Executive™",
    workflow: "Email & sequence",
    scope: "per-occurrence",
    defaultBasis: "internal",
    leftForFounder: "Sending the follow-ups.",
    readiness: ["has-email-list"],
  },
  {
    key: "exp.convert",
    area: "Conversion",
    work: "Prepare the invitation into the next offer and reply drafts.",
    outcome: "Invitation draft is approved, and interested attendees have a recorded next step.",
    minutes: 40,
    category: "SELL",
    executive: "Sales Executive™",
    workflow: "Outreach & follow-up",
    scope: "per-occurrence",
    defaultBasis: "internal",
    leftForFounder: "Sending invitations and replying to people.",
    readiness: ["has-next-offer"],
  },
  {
    key: "exp.optimize",
    area: "Performance",
    work: "Review this occurrence's results and choose one improvement.",
    outcome: "Numbers are entered and one improvement is saved to the series.",
    minutes: 30,
    category: "DECIDE",
    executive: "Finance Executive™",
    alternateExecutives: ["Innovation Executive™", "Growth Executive™"],
    workflow: "Review & improve",
    scope: "per-occurrence",
    defaultBasis: "internal",
    leftForFounder: "Entering numbers that aren't available in BO$$.",
  },
]

export const EXPERIENCE_OPTION_BY_KEY: Record<ExperienceOptionKey, ExperienceOption> = Object.fromEntries(
  EXPERIENCE_OPTIONS.map((o) => [o.key, o]),
) as Record<ExperienceOptionKey, ExperienceOption>

/** Host prep must fit inside one 55-minute block. */
export const HOST_PREP_MINUTES = 30

export function isExperienceOptionKey(v: string): v is ExperienceOptionKey {
  return v in EXPERIENCE_OPTION_BY_KEY
}

/** Stable per-occurrence assignment key, backed by the (user_id, assignment_key) index. */
export function occurrenceAssignmentKey(occurrenceId: string, optionKey: ExperienceOptionKey) {
  return `${occurrenceId}:${optionKey}`
}
