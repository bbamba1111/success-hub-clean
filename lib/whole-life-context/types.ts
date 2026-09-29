/**
 * Whole-Life Context™ — Canonical Type Architecture (Phase 6.1)
 * ---------------------------------------------------------------------------
 * Harmony Lane™ recognizes that the founder's life and business cannot be
 * separated. The founder is the first operating system.
 *
 * This module defines the complete Whole-Life Context™ type surface:
 *   - FounderProfile™         — identity, preferences, goals
 *   - RelationshipIntelligence™ — the people who matter most
 *   - LifeEvent™              — meaningful dates and occasions
 *   - LifeCommitment™         — recurring, non-negotiable life commitments
 *   - PersonalGoal™           — what the founder is working toward outside work
 *
 * ARCHITECTURE ONLY — no persistence, no recommendation logic, no UI this phase.
 * Every type is designed for future Supabase persistence without refactoring.
 *
 * Architectural principle: Harmony Lane™ does not manage calendars.
 *   It protects what matters.
 */

/* ===========================================================================
 * Founder Profile™
 * ---------------------------------------------------------------------------
 * Canonical identity record. Extends the existing HarmonyContextValue signals
 * rather than replacing them. New signals added here are ADDITIVE.
 * ======================================================================== */

/** How the founder identifies their gender — architecture hook for future
 *  pronouns / Cherry Blossom voice adaptation. No logic reads this yet. */
export type FounderGenderIdentity =
  | "she-her"
  | "he-him"
  | "they-them"
  | "prefer-not-to-say"
  | string // open for future localization

/** Canonical Founder Profile™ — the identity layer. */
export interface FounderProfile {
  /** Supabase user id — foreign key for all future Supabase tables. */
  userId: string
  /** Preferred first name (may differ from auth display name). */
  preferredName: string
  /** Full legal name — architecture hook for contracts, documents. */
  fullName?: string
  /** IANA time zone identifier, e.g. "America/New_York". */
  timeZone: string
  /** ISO 639 language code, e.g. "en-US", "es". */
  preferredLanguage: string
  /** Founder's gender identity — architecture hook for future voice adaptation. */
  genderIdentity?: FounderGenderIdentity
  /** ISO date string, e.g. "2024-01-15". */
  memberSince: string
  /** Business Stage™ id. */
  businessStage: string
  /** Business Comprehension™ / Communication Style id. */
  communicationStyle: string
  /** What the founder hopes Harmony Lane™ helps them achieve — free text. */
  founderGoals?: string
  /** Short "working on" context — e.g. "Preparing to launch my first course". */
  currentFocus?: string
}

/* ===========================================================================
 * Relationship Intelligence™
 * ---------------------------------------------------------------------------
 * The people the founder cares about most. Cherry Blossom™ will eventually
 * use this to help founders strengthen the relationships that matter.
 * ======================================================================== */

/** The full taxonomy of relationship types in a founder's life. */
export type RelationshipType =
  | "spouse-partner"
  | "child"
  | "grandchild"
  | "parent"
  | "grandparent"
  | "sibling"
  | "close-friend"
  | "mentor"
  | "mentee"
  | "pet"
  | "other"

/**
 * How this person prefers to give and receive love — architecture hook for
 * Cherry Blossom™'s future relationship coaching voice.
 * Based on the widely recognized five-language framework.
 */
export type LoveLanguage =
  | "words-of-affirmation"
  | "acts-of-service"
  | "receiving-gifts"
  | "quality-time"
  | "physical-touch"

/** A single person in the founder's Relationship Intelligence™ registry. */
export interface RelationshipPerson {
  /** Stable client-side id (uuid). Foreign key for future Supabase row. */
  id: string
  /** The person's first name as the founder calls them. */
  name: string
  /** Full name — architecture hook for formal documents, invitations. */
  fullName?: string
  /** How this person relates to the founder. */
  relationshipType: RelationshipType
  /** Custom label if `relationshipType` is "other" — e.g. "Business Partner". */
  customRelationship?: string
  /** ISO date string "MM-DD" (no year) — used for annual birthday reminders. */
  birthday?: string
  /** ISO date string "MM-DD" — used for annual anniversary reminders. */
  anniversary?: string
  /** Other meaningful annual dates, e.g. "first day of school". */
  importantDates: ImportantDate[]
  /** What this person is currently passionate about or working on. */
  interests: string[]
  /** Favorite restaurants — architecture hook for future gift / experience suggestions. */
  favoriteRestaurants: string[]
  /** Favorite foods. */
  favoriteFoods: string[]
  /** Favorite flowers — architecture hook for gift suggestions. */
  favoriteFlowers: string[]
  /** Gift ideas — architecture hook for Cherry Blossom™ gift coaching. */
  giftIdeas: string[]
  /** How this person prefers to give and receive love. */
  loveLanguage?: LoveLanguage
  /**
   * Preferred experience types — architecture hook for experience suggestions.
   * Examples: "concerts", "outdoor adventures", "cooking classes", "spa days"
   */
  preferredExperiences: string[]
  /** Meaningful notes Cherry Blossom™ should remember. */
  notes?: string
  /** ISO timestamp — when this record was last updated. */
  updatedAt?: string
}

/** A meaningful annual date attached to a person or a standalone life event. */
export interface ImportantDate {
  /** Stable id. */
  id: string
  /** Human label — e.g. "Kyle's first day of school" */
  label: string
  /** MM-DD (annual) or full ISO date (one-time). */
  date: string
  /** Whether this date recurs annually. */
  recurring: boolean
  /** Architecture hook: how far in advance Cherry Blossom™ should surface this. */
  leadTimeDays?: number
  /** Notes or gift/experience ideas for this occasion. */
  notes?: string
}

/* ===========================================================================
 * Life Events™
 * ---------------------------------------------------------------------------
 * First-class context objects. Not reminders. Not calendar entries.
 * These become signals Founder GPS™ reasons about.
 * ======================================================================== */

/** The full taxonomy of life event types. */
export type LifeEventType =
  | "birthday"
  | "anniversary"
  | "graduation"
  | "vacation"
  | "holiday"
  | "wedding"
  | "memorial"
  | "school-event"
  | "sporting-event"
  | "dance-recital"
  | "church-event"
  | "community-event"
  | "medical-appointment"
  | "personal-milestone"
  | "family-reunion"
  | "business-milestone"
  | "travel"
  | "other"

/** How significant this event is for Founder GPS™ routing decisions. */
export type LifeEventSignificance =
  | "life-defining" // e.g. wedding, graduation — GPS adjusts the entire week
  | "high"          // e.g. family vacation — GPS protects surrounding days
  | "medium"        // e.g. school recital — GPS protects the day
  | "normal"        // e.g. regular appointment — GPS notes it

/** A single Life Event™ — a first-class context object. */
export interface LifeEvent {
  /** Stable id. */
  id: string
  /** Human title — e.g. "Kyle Soccer Tournament", "Wedding Anniversary" */
  title: string
  /** Longer description or notes. */
  description?: string
  /** Category of event. */
  eventType: LifeEventType
  /** ISO date string — the day the event occurs. */
  date: string
  /** Whether this event recurs annually on the same date. */
  recurring: boolean
  /**
   * How long this event lasts. Used by Founder GPS™ to protect surrounding
   * time rather than just the single day.
   */
  durationDays?: number
  /** Time of day — for GPS to reason about same-day scheduling. */
  timeOfDay?: "morning" | "midday" | "afternoon" | "evening" | "all-day"
  /** People from RelationshipIntelligence™ involved in this event. */
  involvedPeopleIds: string[]
  /** Significance level — drives GPS routing decisions. */
  significance: LifeEventSignificance
  /**
   * How many days before the event Cherry Blossom™ should begin awareness.
   * Defaults: life-defining → 14, high → 7, medium → 3, normal → 1.
   */
  awarenessWindowDays?: number
  /**
   * Whether this event requires preparation (gift, planning, booking).
   * Architecture hook for Cherry Blossom™'s future proactive assistance.
   */
  requiresPreparation?: boolean
  /** Free-text preparation notes. */
  preparationNotes?: string
  /** ISO timestamp. */
  createdAt?: string
  updatedAt?: string
}

/* ===========================================================================
 * Life Commitments™
 * ---------------------------------------------------------------------------
 * Recurring life commitments Founder GPS™ will eventually protect.
 * These are the non-negotiables of a life, not a work schedule.
 * ======================================================================== */

/** Day-of-week type for recurring commitment scheduling. */
export type DayOfWeek =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"

/** How often a life commitment recurs. */
export type CommitmentFrequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "annual"
  | "irregular"

/** The category of life commitment. */
export type LifeCommitmentCategory =
  | "faith"           // Church, Bible Study, prayer
  | "health"          // Gym, yoga, therapy, medical
  | "relationship"    // Date Night™, Family Dinner™, quality time
  | "community"       // Volunteer work, coaching, walking club
  | "learning"        // Book Club, courses, mentorship
  | "rest"            // Sabbath, recovery, digital detox
  | "personal"        // Personal milestone tracking, hobbies
  | "other"

/**
 * A single recurring Life Commitment™ — an architectural constant Founder
 * GPS™ treats as protected time in the founder's operating week.
 */
export interface LifeCommitment {
  /** Stable id. */
  id: string
  /** Human label — e.g. "Date Night™", "Bible Study", "Morning Yoga" */
  title: string
  /** Category — drives how Founder GPS™ protects and prioritizes this commitment. */
  category: LifeCommitmentCategory
  /** Custom category label when `category` is "other". */
  customCategory?: string
  /** How often this commitment recurs. */
  frequency: CommitmentFrequency
  /** Which days of the week this occurs (for weekly/biweekly frequency). */
  daysOfWeek: DayOfWeek[]
  /** Approximate time of day — helps GPS protect surrounding time. */
  timeOfDay?: "morning" | "midday" | "afternoon" | "evening"
  /** Approximate duration in minutes. */
  durationMinutes?: number
  /** Whether this is a Non-Negotiable™ — GPS treats these as inviolable. */
  isNonNegotiable: boolean
  /** Why this commitment matters — architecture hook for Cherry Blossom™ coaching voice. */
  why?: string
  /** People from RelationshipIntelligence™ involved in this commitment. */
  involvedPeopleIds: string[]
  /** Whether this commitment is currently active. */
  isActive: boolean
  /** ISO timestamp. */
  createdAt?: string
  updatedAt?: string
}

/* ===========================================================================
 * Personal Goals™
 * ---------------------------------------------------------------------------
 * What the founder is working toward outside the immediate business.
 * These become GPS signals — goals should influence recommendations.
 * ======================================================================== */

/** The taxonomy of personal goal domains. */
export type PersonalGoalDomain =
  | "health"
  | "relationships"
  | "financial"
  | "travel"
  | "learning"
  | "spiritual"
  | "community"
  | "home"
  | "lifestyle"
  | "legacy"
  | "other"

/** The current status of a personal goal. */
export type PersonalGoalStatus =
  | "active"       // currently pursuing
  | "achieved"     // completed — celebrate and archive
  | "paused"       // temporarily on hold
  | "deferred"     // intentionally moved to a future season

/** A single Personal Goal™ — architecture hook for GPS routing and Cherry Blossom coaching. */
export interface PersonalGoal {
  /** Stable id. */
  id: string
  /** Human title — e.g. "Lose 20 pounds", "Read 24 books", "Travel to Italy" */
  title: string
  /** Richer description of what achieving this looks like. */
  description?: string
  /** The domain of life this goal belongs to. */
  domain: PersonalGoalDomain
  /** Custom domain label when `domain` is "other". */
  customDomain?: string
  /** Current pursuit status. */
  status: PersonalGoalStatus
  /** Target date — ISO date string — architecture hook for GPS time-awareness. */
  targetDate?: string
  /** Milestone markers — architecture hook for progress tracking. */
  milestones: GoalMilestone[]
  /**
   * Whether this goal is directly tied to a Life Commitment™.
   * E.g. "Lose 20 pounds" → tied to Gym commitment.
   */
  relatedCommitmentId?: string
  /** Why this goal matters — Cherry Blossom™ coaching hook. */
  why?: string
  /** How often the founder wants to be reminded of this goal. */
  reviewFrequency?: CommitmentFrequency
  /** ISO timestamp. */
  createdAt?: string
  updatedAt?: string
}

/** A single milestone within a Personal Goal™. */
export interface GoalMilestone {
  id: string
  label: string
  /** ISO date when this milestone was achieved, or null if not yet. */
  achievedAt?: string
  /** Whether this milestone is complete. */
  isComplete: boolean
}

/* ===========================================================================
 * Whole-Life Context™ — Aggregate
 * ---------------------------------------------------------------------------
 * The single object that the Harmony Context Engine™ will eventually load
 * and pass to Cherry Blossom™. All fields are optional — the platform
 * degrades gracefully when data is absent.
 * ======================================================================== */

/** The complete Whole-Life Context™ snapshot. */
export interface WholeLifeContext {
  /** The founder's canonical identity record. */
  profile: FounderProfile | null
  /**
   * The people who matter most to this founder. Ordered by relationship
   * closeness — the founder can reorder.
   */
  relationships: RelationshipPerson[]
  /**
   * Upcoming and recurring life events. Ordered by date ascending.
   * Cherry Blossom™ only surfaces events within the current awareness window.
   */
  lifeEvents: LifeEvent[]
  /** Recurring life commitments — the non-negotiables of the founder's life. */
  lifeCommitments: LifeCommitment[]
  /** What the founder is working toward personally. */
  personalGoals: PersonalGoal[]
}

/** An empty but type-safe Whole-Life Context™ — safe default before data loads. */
export const EMPTY_WHOLE_LIFE_CONTEXT: WholeLifeContext = {
  profile: null,
  relationships: [],
  lifeEvents: [],
  lifeCommitments: [],
  personalGoals: [],
}

/* ===========================================================================
 * Proactive Cherry Blossom™ — Signal Architecture
 * ---------------------------------------------------------------------------
 * Architecture-only. No notification engine. No scheduling. No AI calls.
 * These types define the SHAPE of proactive awareness signals so that a
 * future phase can implement them without redesigning this contract.
 * ======================================================================== */

/** What kind of proactive awareness this signal represents. */
export type ProactiveSignalType =
  | "upcoming-birthday"         // "Kyle's birthday is in 7 days"
  | "upcoming-anniversary"      // "Your anniversary is next Thursday"
  | "upcoming-life-event"       // "Kyle has soccer Saturday morning"
  | "upcoming-vacation"         // "You're traveling in 5 days"
  | "commitment-at-risk"        // "Your gym commitment has been skipped 3x"
  | "goal-milestone-due"        // "Your Italy trip target is in 30 days"
  | "quarterly-business-renewal"// "Time to renew your business license"
  | "annual-physical-reminder"  // "Your annual physical is approaching"
  | "celebration-opportunity"   // "Your daughter turns 16 next week"
  | "relationship-nudge"        // "It's been 6 weeks since you connected with Mom"

/** The urgency of a proactive signal. */
export type ProactiveSignalUrgency = "celebrate" | "prepare" | "protect" | "nurture"

/**
 * A proactive awareness signal — the shape of every future Cherry Blossom™
 * proactive message. Architecture only — no delivery mechanism this phase.
 */
export interface ProactiveSignal {
  id: string
  type: ProactiveSignalType
  urgency: ProactiveSignalUrgency
  /**
   * Cherry Blossom™'s voice — a short, warm, first-person message.
   * Example: "Your anniversary is next Thursday, Barbara."
   */
  message: string
  /**
   * What Cherry Blossom™ is offering to help with — optional.
   * Example: "Would you like me to help you plan something special?"
   */
  offerMessage?: string
  /** The related person id, if this signal is about a relationship. */
  relatedPersonId?: string
  /** The related life event id, if this signal is about an event. */
  relatedEventId?: string
  /** The related commitment id, if this signal is about a commitment. */
  relatedCommitmentId?: string
  /** The related goal id, if this signal is about a personal goal. */
  relatedGoalId?: string
  /** ISO date when this signal becomes relevant. */
  relevantDate: string
  /** ISO date when this signal expires and should no longer be shown. */
  expiresAt: string
  /**
   * Architecture hook: the action Cherry Blossom™ will suggest.
   * Not rendered this phase.
   */
  suggestedAction?: { label: string; href?: string }
  /** Status — architecture hook for future "dismissed / acted on" tracking. */
  status: "pending" | "surfaced" | "acted" | "dismissed" | "expired"
}

/* ===========================================================================
 * Relationship Intelligence Constants
 * ---------------------------------------------------------------------------
 * Human-readable labels for every enum — no magic strings in the UI.
 * ======================================================================== */

export const RELATIONSHIP_TYPE_LABELS: Record<RelationshipType, string> = {
  "spouse-partner": "Spouse / Partner",
  child: "Child",
  grandchild: "Grandchild",
  parent: "Parent",
  grandparent: "Grandparent",
  sibling: "Sibling",
  "close-friend": "Close Friend",
  mentor: "Mentor",
  mentee: "Mentee",
  pet: "Pet",
  other: "Other",
}

export const LOVE_LANGUAGE_LABELS: Record<LoveLanguage, string> = {
  "words-of-affirmation": "Words of Affirmation",
  "acts-of-service": "Acts of Service",
  "receiving-gifts": "Receiving Gifts",
  "quality-time": "Quality Time",
  "physical-touch": "Physical Touch",
}

export const LIFE_COMMITMENT_CATEGORY_LABELS: Record<LifeCommitmentCategory, string> = {
  faith: "Faith",
  health: "Health & Wellness",
  relationship: "Relationships",
  community: "Community",
  learning: "Learning",
  rest: "Rest & Recovery",
  personal: "Personal",
  other: "Other",
}

export const PERSONAL_GOAL_DOMAIN_LABELS: Record<PersonalGoalDomain, string> = {
  health: "Health",
  relationships: "Relationships",
  financial: "Financial",
  travel: "Travel",
  learning: "Learning",
  spiritual: "Spiritual",
  community: "Community",
  home: "Home",
  lifestyle: "Lifestyle",
  legacy: "Legacy",
  other: "Other",
}

export const LIFE_EVENT_TYPE_LABELS: Record<LifeEventType, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  graduation: "Graduation",
  vacation: "Vacation",
  holiday: "Holiday",
  wedding: "Wedding",
  memorial: "Memorial",
  "school-event": "School Event",
  "sporting-event": "Sporting Event",
  "dance-recital": "Dance Recital",
  "church-event": "Church Event",
  "community-event": "Community Event",
  "medical-appointment": "Medical Appointment",
  "personal-milestone": "Personal Milestone",
  "family-reunion": "Family Reunion",
  "business-milestone": "Business Milestone",
  travel: "Travel",
  other: "Other",
}

export const LIFE_EVENT_SIGNIFICANCE_LABELS: Record<LifeEventSignificance, string> = {
  "life-defining": "Life-Defining",
  high: "High",
  medium: "Medium",
  normal: "Normal",
}

/** Default awareness windows by significance — how many days ahead Cherry Blossom™ starts. */
export const DEFAULT_AWARENESS_WINDOWS: Record<LifeEventSignificance, number> = {
  "life-defining": 14,
  high: 7,
  medium: 3,
  normal: 1,
}
