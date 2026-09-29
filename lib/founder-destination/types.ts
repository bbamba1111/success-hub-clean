/**
 * Founder Destination™ — types (Phase 2)
 * ---------------------------------------------------------------------------
 * Founder Destination™ is NOT an assessment and NOT the founder's current
 * state — it captures where the founder wants their business, their own
 * role, their life, and their future workplace to end up. Distinct from:
 *   - Business Context™ (`lib/business-context/types.ts`) — the business's
 *     CURRENT stage, model, and goals.
 *   - Founder Profile™ (`utils/founder-profile-storage.ts`) — who the
 *     founder is today (identity, family, lifestyle).
 *
 * Every field is optional — progressive disclosure, nothing required.
 * Enum-like fields include an "undecided" escape hatch, matching the
 * convention in `lib/business-context/types.ts`.
 *
 * Fields are grouped into four destination layers:
 *   1. Business Destination™          — where the business itself is headed
 *   2. Founder Destination™           — the founder's own future role
 *   3. Life Destination™              — the life the business should support
 *   4. Future Workplace Destination™  — the workplace they want to build
 */

// ─── Business Destination™ ─────────────────────────────────────────────────

export type DesiredBusinessSizeOption =
  | "solo"
  | "small-team"
  | "mid-size"
  | "large-team"
  | "enterprise"
  | "undecided"

export type DesiredTeamSizeOption = "solo" | "1-3" | "4-10" | "11-25" | "26-50" | "50-plus" | "undecided"

export type DesiredGeographicReachOption = "local" | "regional" | "national" | "international" | "global" | "undecided"

export type DesiredMarketPositionOption =
  | "boutique-premium"
  | "mid-market"
  | "mass-market"
  | "category-leader"
  | "niche-authority"
  | "undecided"

export type RevenueAmbitionOption =
  | "lifestyle-sufficient"
  | "six-figure"
  | "seven-figure"
  | "eight-figure-plus"
  | "undecided"

// ─── Founder Destination™ ──────────────────────────────────────────────────

export type DesiredFounderRoleOption =
  | "visionary-ceo"
  | "hands-on-operator"
  | "creative-director"
  | "advisor-board-member"
  | "fully-exited"
  | "undecided"

/** Shared checklist for both "remain responsible for" and "hand off" questions. */
export const FOUNDER_RESPONSIBILITY_OPTIONS = [
  "Vision & Strategy",
  "Culture & Values",
  "Key Relationships",
  "Product / Offer Direction",
  "Financial Oversight",
  "Sales & Growth",
  "Team Leadership",
  "Day-to-Day Operations",
] as const

export type FounderResponsibilityOption = (typeof FOUNDER_RESPONSIBILITY_OPTIONS)[number]

export type DesiredWorkingHoursOption = "under-10" | "10-20" | "20-30" | "30-40" | "40-plus" | "undecided"

export type DesiredFounderInvolvementOption =
  | "essential-daily"
  | "important-weekly"
  | "occasional-monthly"
  | "minimal-quarterly"
  | "undecided"

export type DesiredFounderIndependenceOption =
  | "business-needs-me-fully"
  | "business-needs-me-mostly"
  | "business-runs-without-me-some"
  | "business-runs-without-me-fully"
  | "undecided"

// ─── Life Destination™ ─────────────────────────────────────────────────────

export type DesiredWorkLifeBalanceModelOption =
  | "integrated-blend"
  | "strict-separation"
  | "seasonal-flex"
  | "family-first-always"
  | "undecided"

export type DesiredTimeFreedomLevelOption =
  | "always-on"
  | "flexible-but-available"
  | "protected-time-off"
  | "fully-time-free"
  | "undecided"

export const LIFE_BOUNDARY_OPTIONS = [
  "Evenings with family",
  "Weekends off",
  "No work travel",
  "Daily exercise time",
  "Uninterrupted vacations",
  "Protected sleep",
  "Date nights",
  "School pickups / drop-offs",
] as const

export type LifeBoundaryOption = (typeof LIFE_BOUNDARY_OPTIONS)[number]

// ─── Future Workplace Destination™ ─────────────────────────────────────────

export type DesiredWorkplaceTypeOption = "fully-remote" | "hybrid" | "in-person" | "flexible-choice" | "undecided"

export type DesiredEmployeeExperienceOption =
  | "high-autonomy"
  | "structured-supportive"
  | "high-performance-driven"
  | "family-like-close-knit"
  | "undecided"

export type DesiredWorkDesignOption = "async-first" | "collaborative-real-time" | "results-only" | "structured-hours" | "undecided"

export type DesiredAiHumanRelationshipOption =
  | "ai-augmented-humans-lead"
  | "ai-first-humans-oversee"
  | "human-only-no-ai"
  | "undecided"

export type DesiredLeadershipCultureOption =
  | "servant-leadership"
  | "high-accountability"
  | "consensus-driven"
  | "founder-led-directive"
  | "undecided"

export type DesiredHumanSustainabilityStandardOption =
  | "wellbeing-first"
  | "performance-with-balance"
  | "high-intensity-high-reward"
  | "undecided"

// ─── Composite profile ─────────────────────────────────────────────────────

export interface FounderDestinationProfile {
  // Business Destination™
  desiredBusinessSize?: DesiredBusinessSizeOption
  desiredTeamSize?: DesiredTeamSizeOption
  desiredGeographicReach?: DesiredGeographicReachOption
  desiredMarketPosition?: DesiredMarketPositionOption
  revenueAmbition?: RevenueAmbitionOption

  // Founder Destination™
  desiredFounderRole?: DesiredFounderRoleOption
  remainResponsibleFor?: FounderResponsibilityOption[]
  notResponsibleFor?: FounderResponsibilityOption[]
  desiredWorkingHoursPerWeek?: DesiredWorkingHoursOption
  desiredFounderInvolvement?: DesiredFounderInvolvementOption
  desiredZoneOfGenius?: string
  desiredFounderIndependence?: DesiredFounderIndependenceOption

  // Life Destination™
  desiredWorkLifeBalanceModel?: DesiredWorkLifeBalanceModelOption
  desiredTimeFreedomLevel?: DesiredTimeFreedomLevelOption
  desiredLifestyle?: string
  nonNegotiableLifeBoundaries?: LifeBoundaryOption[]
  businessLifePurpose?: string

  // Future Workplace Destination™
  desiredWorkplaceType?: DesiredWorkplaceTypeOption
  desiredEmployeeExperience?: DesiredEmployeeExperienceOption
  desiredWorkDesign?: DesiredWorkDesignOption
  desiredAiHumanRelationship?: DesiredAiHumanRelationshipOption
  desiredLeadershipCulture?: DesiredLeadershipCultureOption
  desiredHumanSustainabilityStandard?: DesiredHumanSustainabilityStandardOption
}
