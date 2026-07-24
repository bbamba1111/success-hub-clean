/**
 * Business Context Profile™ — types (Phase 10.1)
 * ---------------------------------------------------------------------------
 * The Business Context Profile™ is NOT an assessment — it does not score the
 * founder. It personalizes Harmony Lane™ to the business they are building,
 * so every recommendation, declaration, and operating rule reflects their
 * actual context rather than a generic template.
 *
 * Fields are grouped into four intelligence layers:
 *   1. Business Identity™ — who they are and what they are building
 *   2. Growth & Capital™  — where they are going and how they plan to get there
 *   3. Financial Architecture™ — the financial infrastructure they have built
 *   4. Executive Learning Profile™ — how they learn and what they want to master
 */

// ─── Business Identity™ ───────────────────────────────────────────────────────

export type BusinessStageOption =
  | "idea"
  | "pre-revenue"
  | "early-revenue"
  | "growth"
  | "scaling"
  | "established"
  | "pivoting"
  | "multi-business"
  | "acquisition"

export type BusinessModelOption =
  | "service"
  | "digital-products"
  | "physical-products"
  | "saas"
  | "agency"
  | "consulting"
  | "coaching"
  | "membership"
  | "marketplace"
  | "franchise"
  | "real-estate"
  | "other"

export type FounderRoleOption =
  | "solopreneur"
  | "ceo-small-team"
  | "ceo-growing-team"
  | "co-founder"
  | "fractional"
  | "operator"

export type TeamSizeOption =
  | "solo"
  | "1-3"
  | "4-10"
  | "11-25"
  | "26-50"
  | "50-plus"

export type RevenueStagOption =
  | "pre-revenue"
  | "under-50k"
  | "50k-100k"
  | "100k-250k"
  | "250k-500k"
  | "500k-1m"
  | "1m-5m"
  | "5m-plus"

// ─── Founder Operating Environment™ (Phase 10.1.1) ───────────────────────────

export type OperatingEnvironmentOption =
  | "home-office"
  | "dedicated-office"
  | "coworking"
  | "retail-storefront"
  | "studio"
  | "client-locations"
  | "multiple-locations"
  | "fully-remote-team"
  | "traveling-nomad"
  | "other"

// ─── Founder Support Network™ (Phase 10.1.1) ─────────────────────────────────

export type SupportNetworkOption =
  | "just-me"
  | "spouse-partner"
  | "family-members"
  | "virtual-assistant"
  | "contractors-freelancers"
  | "employees"
  | "fractional-executives"
  | "coach"
  | "mentor"
  | "mastermind-community"
  | "board-of-advisors"
  | "investors"
  | "other"

// ─── Biggest Opportunity™ (Phase 10.1.1) ─────────────────────────────────────

export type OpportunityOption =
  | "clarifying-idea"
  | "finding-ideal-customer"
  | "creating-offer"
  | "increasing-sales"
  | "marketing"
  | "pricing"
  | "recurring-revenue"
  | "hiring"
  | "delegation"
  | "ai-implementation"
  | "systems-sops"
  | "leadership"
  | "business-credit"
  | "raising-capital"
  | "strategic-partnerships"
  | "scaling"
  | "wealth-building"
  | "work-life-harmony"
  | "time-freedom"
  | "other"

// ─── Growth & Capital™ ────────────────────────────────────────────────────────

export type GoalOption =
  | "replace-income"
  | "scale-revenue"
  | "build-team"
  | "launch-product"
  | "exit"
  | "raise-capital"
  | "build-brand"
  | "achieve-time-freedom"
  | "build-passive-income"
  | "impact"

export type ChallengeOption =
  | "cash-flow"
  | "lead-generation"
  | "operations"
  | "team"
  | "time"
  | "mindset"
  | "pricing"
  | "marketing"
  | "tech-systems"
  | "capital"
  | "clarity"

export type LongTermVision = {
  oneYear: string
  threeYear: string
  fiveYear: string
  tenYear: string
  description: string
}

export type CapitalStrategyOption =
  | "bootstrapped"
  | "friends-family"
  | "angel"
  | "venture"
  | "sba-loan"
  | "grants"
  | "revenue-based"
  | "crowdfunding"
  | "learn"

export type GrowthVisionOption =
  | "lifestyle-business"
  | "scale-then-exit"
  | "build-to-keep"
  | "franchise"
  | "ipo"
  | "social-enterprise"
  | "undecided"

export type ExitVisionOption =
  | "no-exit"
  | "acquisition"
  | "ipo"
  | "management-buyout"
  | "family-succession"
  | "wind-down"
  | "undecided"

// ─── Financial Architecture™ ─────────────────────────────────────────────────

export type BusinessCreditOption =
  | "established"
  | "building"
  | "no-credit"
  | "not-sure"
  | "learn"

export type BusinessBankingOption =
  | "dedicated-business-account"
  | "personal-account"
  | "multiple-accounts"
  | "not-sure"
  | "learn"

export type FinancialFoundationOption =
  | "business-entity"
  | "ein"
  | "business-bank-account"
  | "bookkeeping"
  | "business-credit-card"
  | "payroll"
  | "retirement-plan"
  | "insurance"
  | "none"

export type WealthBuildingOption =
  | "real-estate"
  | "stocks-etfs"
  | "business-equity"
  | "retirement-accounts"
  | "angel-investing"
  | "royalties"
  | "crypto"
  | "learn"

// ─── Executive Communication™ ────────────────────────────────────────────────

export type CommunicationLevelOption =
  | "foundation"
  | "developing"
  | "professional"
  | "executive"
  | "executive-mba"

// ─── Master profile type ─────────────────────────────────────────────────────

export interface BusinessContextProfile {
  /** ISO timestamp when saved. */
  completedAt: string

  // Business Identity™
  businessName: string
  businessStage: BusinessStageOption
  businessModel: BusinessModelOption[]
  industry: string
  founderRole: FounderRoleOption
  teamSize: TeamSizeOption
  revenueStage: RevenueStagOption

  // Goals, Challenges & Opportunities (Phase 10.1.1: operatingEnvironment, supportNetwork, biggestOpportunities added)
  biggestGoals: GoalOption[]
  biggestChallenges: ChallengeOption[]

  // Your Vision™ (open-text, moved from Founder Profile)
  /** What is the most important thing you want to achieve in the next 90 days? */
  biggestGoalText?: string
  /** What is the number one thing getting in the way of the life and business you want? */
  biggestChallengeText?: string
  /** Describe what your life looks like when you are truly winning. */
  successVision?: string
  /** Phase 10.1.1 — Founder Operating Environment™ */
  operatingEnvironment?: OperatingEnvironmentOption
  /** Phase 10.1.1 — Founder Support Network™ (multi-select) */
  supportNetwork?: SupportNetworkOption[]
  /** Phase 10.1.1 — Biggest Opportunity™ (multi-select, up to 3) */
  biggestOpportunities?: OpportunityOption[]

  // Long-Term Vision™
  longTermVision: LongTermVision

  // Growth & Capital™
  capitalStrategy: CapitalStrategyOption[]
  growthVision: GrowthVisionOption
  exitVision: ExitVisionOption

  // Financial Architecture™
  businessCredit: BusinessCreditOption
  businessBanking: BusinessBankingOption
  financialFoundation: FinancialFoundationOption[]
  wealthBuildingInterests: WealthBuildingOption[]

  // Executive Communication™ (ties to Founder Learning Profile™)
  communicationLevel: CommunicationLevelOption
  learningInterests: string[]
}
