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

  // Goals & Challenges
  biggestGoals: GoalOption[]
  biggestChallenges: ChallengeOption[]

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
