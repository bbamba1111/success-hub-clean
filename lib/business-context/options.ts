/**
 * Business Context Profile™ — shared option/label lists.
 * ---------------------------------------------------------------------------
 * Extracted from components/business-context/business-context-profile.tsx so
 * both the wizard and its read-only summary
 * (components/business-context/business-context-summary.tsx) can look up
 * human-readable labels for stored option codes without importing from each
 * other (which would create a circular "use client" import between the two
 * components).
 */

import type {
  BusinessBankingOption,
  BusinessCreditOption,
  BusinessModelOption,
  BusinessStageOption,
  CapitalStrategyOption,
  ChallengeOption,
  ClientConnectionExperienceStatus,
  DeliveryModelOption,
  ExitVisionOption,
  FinancialFoundationOption,
  FounderRoleOption,
  GoalOption,
  GrowthVisionOption,
  OperatingEnvironmentOption,
  OpportunityOption,
  RevenueStagOption,
  SupportNetworkOption,
  TeamSizeOption,
  WealthBuildingOption,
} from "@/lib/business-context/types"

export const STAGE_OPTIONS: { value: BusinessStageOption; label: string; description: string }[] = [
  { value: "idea", label: "Idea Stage™", description: "I have an idea but have not launched yet." },
  { value: "pre-revenue", label: "Pre-Revenue™", description: "I have launched but have not yet made a sale." },
  { value: "early-revenue", label: "Early Revenue™", description: "I am making sales but still building consistency." },
  { value: "growth", label: "Growth Stage™", description: "I have consistent revenue and am actively growing." },
  { value: "scaling", label: "Scaling™", description: "I am systematizing and scaling beyond my own capacity." },
  { value: "established", label: "Established™", description: "I have a mature, profitable business." },
  { value: "pivoting", label: "Pivoting™", description: "I am transitioning to a new model, market, or offer." },
  { value: "multi-business", label: "Multi-Business™", description: "I own or operate more than one business." },
  { value: "acquisition", label: "Acquisition Stage™", description: "I am pursuing or preparing for acquisition." },
]

export const MODEL_OPTIONS: { value: BusinessModelOption; label: string }[] = [
  { value: "service", label: "Service Business" },
  { value: "digital-products", label: "Digital Products" },
  { value: "physical-products", label: "Physical Products" },
  { value: "saas", label: "SaaS / Software" },
  { value: "agency", label: "Agency" },
  { value: "consulting", label: "Consulting" },
  { value: "coaching", label: "Coaching / Training" },
  { value: "membership", label: "Membership / Community" },
  { value: "marketplace", label: "Marketplace" },
  { value: "franchise", label: "Franchise" },
  { value: "real-estate", label: "Real Estate" },
  { value: "other", label: "Other" },
]

export const INDUSTRY_OPTIONS: string[] = [
  "Health & Wellness",
  "Beauty & Personal Care",
  "Fashion & Apparel",
  "Food & Beverage",
  "Education & Training",
  "Finance & Wealth",
  "Real Estate",
  "Technology",
  "Marketing & Creative",
  "Legal & Compliance",
  "Media & Entertainment",
  "Retail & E-Commerce",
  "Nonprofit & Social Impact",
  "Travel & Hospitality",
  "Professional Services",
  "Home & Lifestyle",
  "Other",
]

export const ROLE_OPTIONS: { value: FounderRoleOption; label: string; description: string }[] = [
  { value: "solopreneur", label: "Solopreneur™", description: "I do everything myself — no team yet." },
  { value: "ceo-small-team", label: "CEO — Small Team™", description: "I lead a team of 1–5 people." },
  { value: "ceo-growing-team", label: "CEO — Growing Team™", description: "I lead a team of 6 or more people." },
  { value: "co-founder", label: "Co-Founder™", description: "I share leadership with one or more co-founders." },
  { value: "fractional", label: "Fractional Executive™", description: "I serve multiple businesses in a fractional capacity." },
  { value: "operator", label: "Operator™", description: "I run the business day-to-day but am not the owner." },
]

export const TEAM_OPTIONS: { value: TeamSizeOption; label: string }[] = [
  { value: "solo", label: "Just me" },
  { value: "1-3", label: "1–3 people" },
  { value: "4-10", label: "4–10 people" },
  { value: "11-25", label: "11–25 people" },
  { value: "26-50", label: "26–50 people" },
  { value: "50-plus", label: "50+ people" },
]

export const REVENUE_OPTIONS: { value: RevenueStagOption; label: string }[] = [
  { value: "pre-revenue", label: "Pre-Revenue (no sales yet)" },
  { value: "under-50k", label: "Under $50K / year" },
  { value: "50k-100k", label: "$50K – $100K / year" },
  { value: "100k-250k", label: "$100K – $250K / year" },
  { value: "250k-500k", label: "$250K – $500K / year" },
  { value: "500k-1m", label: "$500K – $1M / year" },
  { value: "1m-5m", label: "$1M – $5M / year" },
  { value: "5m-plus", label: "$5M+ / year" },
]

export const GOAL_OPTIONS: { value: GoalOption; label: string }[] = [
  { value: "replace-income", label: "Replace my full-time income" },
  { value: "scale-revenue", label: "Scale to my next revenue milestone" },
  { value: "build-team", label: "Build and lead a high-performing team" },
  { value: "launch-product", label: "Launch a new product or offer" },
  { value: "exit", label: "Build toward an exit" },
  { value: "raise-capital", label: "Raise capital or funding" },
  { value: "build-brand", label: "Build a recognized brand" },
  { value: "achieve-time-freedom", label: "Achieve Time Freedom™" },
  { value: "build-passive-income", label: "Build passive or recurring income" },
  { value: "impact", label: "Create meaningful impact" },
]

export const CHALLENGE_OPTIONS: { value: ChallengeOption; label: string }[] = [
  { value: "cash-flow", label: "Cash flow and financial consistency" },
  { value: "lead-generation", label: "Generating consistent leads and clients" },
  { value: "operations", label: "Systemizing and streamlining operations" },
  { value: "team", label: "Building and managing a team" },
  { value: "time", label: "Time — too much to do, not enough hours" },
  { value: "mindset", label: "Mindset and staying motivated" },
  { value: "pricing", label: "Pricing my products or services" },
  { value: "marketing", label: "Marketing and visibility" },
  { value: "tech-systems", label: "Technology and software systems" },
  { value: "capital", label: "Access to capital or funding" },
  { value: "clarity", label: "Clarity on direction and strategy" },
]

export const OPERATING_ENV_OPTIONS: { value: OperatingEnvironmentOption; label: string }[] = [
  { value: "home-office", label: "Home Office" },
  { value: "dedicated-office", label: "Dedicated Office" },
  { value: "coworking", label: "Coworking Space" },
  { value: "retail-storefront", label: "Retail / Storefront" },
  { value: "studio", label: "Studio" },
  { value: "client-locations", label: "Client Locations" },
  { value: "multiple-locations", label: "Multiple Locations" },
  { value: "fully-remote-team", label: "Fully Remote Team" },
  { value: "traveling-nomad", label: "Traveling / Digital Nomad" },
  { value: "other", label: "Other" },
]

export const SUPPORT_NETWORK_OPTIONS: { value: SupportNetworkOption; label: string }[] = [
  { value: "just-me", label: "Just Me" },
  { value: "spouse-partner", label: "Spouse / Partner" },
  { value: "family-members", label: "Family Members" },
  { value: "virtual-assistant", label: "Virtual Assistant" },
  { value: "contractors-freelancers", label: "Contractors / Freelancers" },
  { value: "employees", label: "Employees" },
  { value: "fractional-executives", label: "Fractional Executives" },
  { value: "coach", label: "Coach" },
  { value: "mentor", label: "Mentor" },
  { value: "mastermind-community", label: "Mastermind Community" },
  { value: "board-of-advisors", label: "Board of Advisors" },
  { value: "investors", label: "Investors" },
  { value: "other", label: "Other" },
]

export const OPPORTUNITY_OPTIONS: { value: OpportunityOption; label: string }[] = [
  { value: "clarifying-idea", label: "Clarifying My Business Idea" },
  { value: "finding-ideal-customer", label: "Finding My Ideal Customer" },
  { value: "creating-offer", label: "Creating My Offer" },
  { value: "increasing-sales", label: "Increasing Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "pricing", label: "Pricing" },
  { value: "recurring-revenue", label: "Building Recurring Revenue" },
  { value: "hiring", label: "Hiring" },
  { value: "delegation", label: "Delegation" },
  { value: "ai-implementation", label: "AI Implementation" },
  { value: "systems-sops", label: "Systems & SOPs" },
  { value: "leadership", label: "Leadership" },
  { value: "business-credit", label: "Business Credit" },
  { value: "raising-capital", label: "Raising Capital" },
  { value: "strategic-partnerships", label: "Strategic Partnerships" },
  { value: "scaling", label: "Scaling" },
  { value: "wealth-building", label: "Wealth Building" },
  { value: "work-life-harmony", label: "Work-Life Harmony™" },
  { value: "time-freedom", label: "Time Freedom™" },
  { value: "other", label: "Other" },
]

export const CAPITAL_OPTIONS: { value: CapitalStrategyOption; label: string; isLearn?: boolean }[] = [
  { value: "bootstrapped", label: "Bootstrapped — self-funded" },
  { value: "friends-family", label: "Friends & family" },
  { value: "angel", label: "Angel investors" },
  { value: "venture", label: "Venture capital" },
  { value: "sba-loan", label: "SBA loan or bank financing" },
  { value: "grants", label: "Grants" },
  { value: "revenue-based", label: "Revenue-based financing" },
  { value: "crowdfunding", label: "Crowdfunding" },
  { value: "learn", label: "Learn Before I Launch™ — Capital Strategy", isLearn: true },
]

export const GROWTH_OPTIONS: { value: GrowthVisionOption; label: string; description: string }[] = [
  { value: "lifestyle-business", label: "Lifestyle Business™", description: "I want a profitable business that funds my ideal life." },
  { value: "scale-then-exit", label: "Scale, Then Exit™", description: "I want to build, scale, and sell." },
  { value: "build-to-keep", label: "Build to Keep™", description: "I want to build a lasting company I own long-term." },
  { value: "franchise", label: "Franchise™", description: "I want to franchise or license my model." },
  { value: "ipo", label: "IPO™", description: "I want to take my company public." },
  { value: "social-enterprise", label: "Social Enterprise™", description: "I want to build a business that creates social impact." },
  { value: "undecided", label: "Still Deciding™", description: "I have not decided yet." },
]

export const EXIT_OPTIONS: { value: ExitVisionOption; label: string }[] = [
  { value: "no-exit", label: "I plan to run this business indefinitely" },
  { value: "acquisition", label: "Acquisition by a larger company" },
  { value: "ipo", label: "Initial Public Offering (IPO)" },
  { value: "management-buyout", label: "Management or employee buyout" },
  { value: "family-succession", label: "Family succession" },
  { value: "wind-down", label: "Wind down when I retire" },
  { value: "undecided", label: "I have not decided yet" },
]

export const CREDIT_OPTIONS: { value: BusinessCreditOption; label: string; isLearn?: boolean }[] = [
  { value: "established", label: "Yes — I have established business credit" },
  { value: "building", label: "I am actively building my business credit" },
  { value: "no-credit", label: "No — I have not built business credit yet" },
  { value: "not-sure", label: "I am not sure what business credit is" },
  { value: "learn", label: "Learn Before I Launch™ — Business Credit", isLearn: true },
]

export const BANKING_OPTIONS: { value: BusinessBankingOption; label: string; isLearn?: boolean }[] = [
  { value: "dedicated-business-account", label: "Yes — I have a dedicated business bank account" },
  { value: "personal-account", label: "I use a personal account for business" },
  { value: "multiple-accounts", label: "I have multiple business accounts" },
  { value: "not-sure", label: "I am not sure I need a separate account" },
  { value: "learn", label: "Learn Before I Launch™ — Business Banking", isLearn: true },
]

export const FIN_FOUNDATION_OPTIONS: { value: FinancialFoundationOption; label: string }[] = [
  { value: "business-entity", label: "Registered business entity (LLC, Corp, etc.)" },
  { value: "ein", label: "EIN (Employer Identification Number)" },
  { value: "business-bank-account", label: "Dedicated business bank account" },
  { value: "bookkeeping", label: "Bookkeeping system in place" },
  { value: "business-credit-card", label: "Business credit card" },
  { value: "payroll", label: "Payroll system" },
  { value: "retirement-plan", label: "Business retirement plan (SEP, SIMPLE, etc.)" },
  { value: "insurance", label: "Business insurance" },
  { value: "none", label: "None of the above — I am building this" },
]

export const WEALTH_OPTIONS: { value: WealthBuildingOption; label: string; isLearn?: boolean }[] = [
  { value: "real-estate", label: "Real estate" },
  { value: "stocks-etfs", label: "Stocks & ETFs" },
  { value: "business-equity", label: "Business equity & ownership" },
  { value: "retirement-accounts", label: "Retirement accounts (401k, IRA, etc.)" },
  { value: "angel-investing", label: "Angel investing" },
  { value: "royalties", label: "Royalties & licensing" },
  { value: "crypto", label: "Cryptocurrency & digital assets" },
  { value: "learn", label: "Learn Before I Launch™ — Wealth Building", isLearn: true },
]

export const DELIVERY_MODEL_OPTIONS: { value: DeliveryModelOption; label: string }[] = [
  { value: "one-to-one", label: "One-to-one (individual clients)" },
  { value: "one-to-many-group", label: "One-to-many / group" },
  { value: "self-serve-digital", label: "Self-serve digital (course, download, software)" },
  { value: "productized-service", label: "Productized service (fixed-scope deliverable)" },
  { value: "physical-fulfillment", label: "Physical product fulfillment" },
  { value: "hybrid", label: "Hybrid of multiple models" },
  { value: "other", label: "Other" },
]

export const CLIENT_CONNECTION_EXPERIENCE_OPTIONS: { value: ClientConnectionExperienceStatus; label: string }[] = [
  { value: "challenge", label: "Yes — I run a Challenge" },
  { value: "webinar", label: "Yes — I run a Webinar" },
  { value: "workshop", label: "Yes — I run a Workshop" },
  { value: "immersion", label: "Yes — I run an Immersion" },
  { value: "mastermind", label: "Yes — I run a Mastermind" },
  { value: "none", label: "No — I don't currently run one" },
]

export const YES_NO_OPTIONS: { value: "yes" | "no"; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "Not yet" },
]

/** Looks up a single option's label, falling back to the raw value if unknown. */
export function labelFor<T extends string>(
  options: { value: T; label: string }[],
  value: T | null | undefined,
): string | undefined {
  if (!value) return undefined
  return options.find((o) => o.value === value)?.label ?? value
}

/** Looks up labels for a list of option values, joined into one string. */
export function labelsFor<T extends string>(
  options: { value: T; label: string }[],
  values: T[] | null | undefined,
): string | undefined {
  if (!values || values.length === 0) return undefined
  return values.map((v) => options.find((o) => o.value === v)?.label ?? v).join(", ")
}
