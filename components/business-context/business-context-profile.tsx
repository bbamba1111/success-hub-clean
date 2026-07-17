"use client"

/**
 * Business Context Profile™ — multi-step onboarding wizard (Phase 10.1)
 *
 * 21-step wizard that collects the founder's Business Context Profile™ and
 * Founder Learning Profile™. Hero-first UX: the CherryBlossomScene is rendered
 * by the parent page; this component begins at the first question.
 *
 * UX rules (matching Design My Week™):
 *   - Single-select questions auto-advance on tap
 *   - Multi-select questions require an explicit "Continue" button
 *   - Text inputs require an explicit "Continue" button
 *   - scrollIntoView fires on every step change after step 0
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, ChevronRight, Plus, X } from "lucide-react"
import { saveBusinessContext } from "@/lib/business-context/business-context-store"
import { saveFounderLearning } from "@/lib/founder-learning/founder-learning-store"
import {
  COMMUNICATION_LEVELS,
  LEARNING_TOPIC_OPTIONS,
} from "@/lib/founder-learning/types"
import type {
  BusinessBankingOption,
  BusinessCreditOption,
  BusinessModelOption,
  BusinessStageOption,
  CapitalStrategyOption,
  ChallengeOption,
  CommunicationLevelOption,
  ExitVisionOption,
  FinancialFoundationOption,
  FounderRoleOption,
  GoalOption,
  GrowthVisionOption,
  LongTermVision,
  OperatingEnvironmentOption,
  OpportunityOption,
  RevenueStagOption,
  SupportNetworkOption,
  TeamSizeOption,
  WealthBuildingOption,
} from "@/lib/business-context/types"

// ─── Option data ─────────────────────────────────────────────────────────────

const STAGE_OPTIONS: { value: BusinessStageOption; label: string; description: string }[] = [
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

const MODEL_OPTIONS: { value: BusinessModelOption; label: string }[] = [
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

const INDUSTRY_OPTIONS: string[] = [
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

const ROLE_OPTIONS: { value: FounderRoleOption; label: string; description: string }[] = [
  { value: "solopreneur", label: "Solopreneur™", description: "I do everything myself — no team yet." },
  { value: "ceo-small-team", label: "CEO — Small Team™", description: "I lead a team of 1–5 people." },
  { value: "ceo-growing-team", label: "CEO — Growing Team™", description: "I lead a team of 6 or more people." },
  { value: "co-founder", label: "Co-Founder™", description: "I share leadership with one or more co-founders." },
  { value: "fractional", label: "Fractional Executive™", description: "I serve multiple businesses in a fractional capacity." },
  { value: "operator", label: "Operator™", description: "I run the business day-to-day but am not the owner." },
]

const TEAM_OPTIONS: { value: TeamSizeOption; label: string }[] = [
  { value: "solo", label: "Just me" },
  { value: "1-3", label: "1–3 people" },
  { value: "4-10", label: "4–10 people" },
  { value: "11-25", label: "11–25 people" },
  { value: "26-50", label: "26–50 people" },
  { value: "50-plus", label: "50+ people" },
]

const REVENUE_OPTIONS: { value: RevenueStagOption; label: string }[] = [
  { value: "pre-revenue", label: "Pre-Revenue (no sales yet)" },
  { value: "under-50k", label: "Under $50K / year" },
  { value: "50k-100k", label: "$50K – $100K / year" },
  { value: "100k-250k", label: "$100K – $250K / year" },
  { value: "250k-500k", label: "$250K – $500K / year" },
  { value: "500k-1m", label: "$500K – $1M / year" },
  { value: "1m-5m", label: "$1M – $5M / year" },
  { value: "5m-plus", label: "$5M+ / year" },
]

const GOAL_OPTIONS: { value: GoalOption; label: string }[] = [
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

const CHALLENGE_OPTIONS: { value: ChallengeOption; label: string }[] = [
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

const OPERATING_ENV_OPTIONS: { value: OperatingEnvironmentOption; label: string }[] = [
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

const SUPPORT_NETWORK_OPTIONS: { value: SupportNetworkOption; label: string }[] = [
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

const OPPORTUNITY_OPTIONS: { value: OpportunityOption; label: string }[] = [
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

const CAPITAL_OPTIONS: { value: CapitalStrategyOption; label: string; isLearn?: boolean }[] = [
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

const GROWTH_OPTIONS: { value: GrowthVisionOption; label: string; description: string }[] = [
  { value: "lifestyle-business", label: "Lifestyle Business™", description: "I want a profitable business that funds my ideal life." },
  { value: "scale-then-exit", label: "Scale, Then Exit™", description: "I want to build, scale, and sell." },
  { value: "build-to-keep", label: "Build to Keep™", description: "I want to build a lasting company I own long-term." },
  { value: "franchise", label: "Franchise™", description: "I want to franchise or license my model." },
  { value: "ipo", label: "IPO™", description: "I want to take my company public." },
  { value: "social-enterprise", label: "Social Enterprise™", description: "I want to build a business that creates social impact." },
  { value: "undecided", label: "Still Deciding™", description: "I have not decided yet." },
]

const EXIT_OPTIONS: { value: ExitVisionOption; label: string }[] = [
  { value: "no-exit", label: "I plan to run this business indefinitely" },
  { value: "acquisition", label: "Acquisition by a larger company" },
  { value: "ipo", label: "Initial Public Offering (IPO)" },
  { value: "management-buyout", label: "Management or employee buyout" },
  { value: "family-succession", label: "Family succession" },
  { value: "wind-down", label: "Wind down when I retire" },
  { value: "undecided", label: "I have not decided yet" },
]

const CREDIT_OPTIONS: { value: BusinessCreditOption; label: string; isLearn?: boolean }[] = [
  { value: "established", label: "Yes — I have established business credit" },
  { value: "building", label: "I am actively building my business credit" },
  { value: "no-credit", label: "No — I have not built business credit yet" },
  { value: "not-sure", label: "I am not sure what business credit is" },
  { value: "learn", label: "Learn Before I Launch™ — Business Credit", isLearn: true },
]

const BANKING_OPTIONS: { value: BusinessBankingOption; label: string; isLearn?: boolean }[] = [
  { value: "dedicated-business-account", label: "Yes — I have a dedicated business bank account" },
  { value: "personal-account", label: "I use a personal account for business" },
  { value: "multiple-accounts", label: "I have multiple business accounts" },
  { value: "not-sure", label: "I am not sure I need a separate account" },
  { value: "learn", label: "Learn Before I Launch™ — Business Banking", isLearn: true },
]

const FIN_FOUNDATION_OPTIONS: { value: FinancialFoundationOption; label: string }[] = [
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

const WEALTH_OPTIONS: { value: WealthBuildingOption; label: string; isLearn?: boolean }[] = [
  { value: "real-estate", label: "Real estate" },
  { value: "stocks-etfs", label: "Stocks & ETFs" },
  { value: "business-equity", label: "Business equity & ownership" },
  { value: "retirement-accounts", label: "Retirement accounts (401k, IRA, etc.)" },
  { value: "angel-investing", label: "Angel investing" },
  { value: "royalties", label: "Royalties & licensing" },
  { value: "crypto", label: "Cryptocurrency & digital assets" },
  { value: "learn", label: "Learn Before I Launch™ — Wealth Building", isLearn: true },
]

// ─── Shared UI sub-components ─────────────────────────────────────────────────

function StepCard({ children, innerRef }: { children: React.ReactNode; innerRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={innerRef}
      className="rounded-3xl border border-[#E8E0D5] bg-white shadow-sm px-6 py-8 sm:px-8 sm:py-10"
    >
      {children}
    </div>
  )
}

function StepLabel({ label, step, total }: { label: string; step: number; total: number }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5B835F]">
        {label}
      </span>
      <span className="font-montserrat text-xs text-[#6B5860]/60">
        {step} of {total}
      </span>
    </div>
  )
}

function StepQuestion({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-playfair text-xl font-medium text-[#3A2E33] mb-5 text-balance leading-snug">
      {children}
    </h2>
  )
}

function StepHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-montserrat text-sm text-[#6B5860] mb-5 leading-relaxed">{children}</p>
  )
}

function SingleChoice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; description?: string; isLearn?: boolean }[]
  value: T | null
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={selected}
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all ${
              selected
                ? opt.isLearn
                  ? "border-[#C13B6B]/50 bg-[#FDF0F4]"
                  : "border-[#5B835F] bg-[#F4F8F4]"
                : "border-[#E8E0D5] bg-white hover:border-[#5B835F]/30 hover:bg-[#FAFAF8]"
            }`}
          >
            <span
              className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                selected ? (opt.isLearn ? "border-[#C13B6B] bg-[#C13B6B]" : "border-[#5B835F] bg-[#5B835F]") : "border-[#C9C0B5]"
              }`}
              aria-hidden
            >
              {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span className="flex-1">
              <span className={`font-montserrat text-sm font-semibold block ${selected ? (opt.isLearn ? "text-[#C13B6B]" : "text-[#3A2E33]") : "text-[#3A2E33]"}`}>
                {opt.label}
              </span>
              {opt.description && (
                <span className="font-montserrat text-[12px] text-[#6B5860] mt-0.5 block leading-relaxed">
                  {opt.description}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function MultiChoice<T extends string>({
  options,
  values,
  onChange,
  max,
}: {
  options: { value: T; label: string; description?: string; isLearn?: boolean }[]
  values: T[]
  onChange: (v: T[]) => void
  max?: number
}) {
  const toggle = (v: T) => {
    if (values.includes(v)) {
      onChange(values.filter((x) => x !== v))
    } else {
      if (max && values.length >= max) return
      onChange([...values, v])
    }
  }
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => {
        const selected = values.includes(opt.value)
        const disabled = !selected && !!max && values.length >= max
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            aria-pressed={selected}
            disabled={disabled}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
              disabled
                ? "border-[#E8E0D5] bg-white opacity-40 cursor-not-allowed"
                : selected
                ? opt.isLearn
                  ? "border-[#C13B6B]/50 bg-[#FDF0F4]"
                  : "border-[#5B835F] bg-[#F4F8F4]"
                : "border-[#E8E0D5] bg-white hover:border-[#5B835F]/30 hover:bg-[#FAFAF8]"
            }`}
          >
            <span
              className={`h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center ${
                selected ? (opt.isLearn ? "border-[#C13B6B] bg-[#C13B6B]" : "border-[#5B835F] bg-[#5B835F]") : "border-[#C9C0B5]"
              }`}
              aria-hidden
            >
              {selected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
            </span>
            <span className="flex-1">
              <span className={`font-montserrat text-sm font-semibold ${selected ? (opt.isLearn ? "text-[#C13B6B]" : "text-[#3A2E33]") : "text-[#3A2E33]"}`}>
                {opt.label}
              </span>
              {opt.description && (
                <span className="font-montserrat text-[12px] text-[#6B5860] mt-0.5 block leading-relaxed">
                  {opt.description}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function ContinueButton({ onClick, disabled, label = "Continue" }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#5B835F] px-7 py-3 font-montserrat text-sm font-bold text-white transition-colors hover:bg-[#4c6f50] disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {label}
      <ChevronRight className="h-4 w-4" aria-hidden />
    </button>
  )
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5B835F]">
          Business Context Profile™
        </span>
        <span className="font-montserrat text-xs text-[#6B5860]/60">
          {step} of {total} complete
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#5B835F]/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#5B835F] transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  )
}

// ─── Main wizard ─────────────────────────────────────────────────────────────

const TOTAL_STEPS = 22

export function BusinessContextProfile() {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const hasAdvancedRef = useRef(false)

  const [step, setStep] = useState(0)

  // Business Identity™
  const [businessName, setBusinessName] = useState("")
  const [businessStage, setBusinessStage] = useState<BusinessStageOption | null>(null)
  const [businessModel, setBusinessModel] = useState<BusinessModelOption[]>([])
  const [industry, setIndustry] = useState<string | null>(null)
  const [customIndustry, setCustomIndustry] = useState("")
  const [founderRole, setFounderRole] = useState<FounderRoleOption | null>(null)
  const [teamSize, setTeamSize] = useState<TeamSizeOption | null>(null)
  const [revenueStage, setRevenueStage] = useState<RevenueStagOption | null>(null)

  // Goals, Challenges, Operating Environment, Support Network & Opportunities
  const [biggestGoals, setBiggestGoals] = useState<GoalOption[]>([])
  const [biggestChallenges, setBiggestChallenges] = useState<ChallengeOption[]>([])
  const [operatingEnvironment, setOperatingEnvironment] = useState<OperatingEnvironmentOption | null>(null)
  const [supportNetwork, setSupportNetwork] = useState<SupportNetworkOption[]>([])
  const [biggestOpportunities, setBiggestOpportunities] = useState<OpportunityOption[]>([])

  // Long-Term Vision™
  const [vision, setVision] = useState<LongTermVision>({
    oneYear: "",
    threeYear: "",
    fiveYear: "",
    tenYear: "",
    description: "",
  })

  // Growth & Capital™
  const [capitalStrategy, setCapitalStrategy] = useState<CapitalStrategyOption[]>([])
  const [growthVision, setGrowthVision] = useState<GrowthVisionOption | null>(null)
  const [exitVision, setExitVision] = useState<ExitVisionOption | null>(null)

  // Financial Architecture™
  const [businessCredit, setBusinessCredit] = useState<BusinessCreditOption | null>(null)
  const [businessBanking, setBusinessBanking] = useState<BusinessBankingOption | null>(null)
  const [financialFoundation, setFinancialFoundation] = useState<FinancialFoundationOption[]>([])
  const [wealthBuilding, setWealthBuilding] = useState<WealthBuildingOption[]>([])

  // Executive Communication™ + Learning Profile™
  const [commLevel, setCommLevel] = useState<CommunicationLevelOption | null>(null)
  const [learningInterests, setLearningInterests] = useState<string[]>([])

  // Auto-scroll on step changes (not on initial load)
  useEffect(() => {
    if (!hasAdvancedRef.current) return
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 60)
  }, [step])

  const advance = useCallback(() => {
    hasAdvancedRef.current = true
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }, [])

  const autoAdvanceSingle = useCallback(<T extends string>(setter: (v: T) => void, value: T) => {
    setter(value)
    hasAdvancedRef.current = true
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }, [])

  // Collect all "learn" items for the Founder Learning Profile™
  const collectLearningQueue = () => {
    const queue: string[] = []
    if (capitalStrategy.includes("learn")) queue.push("Capital Strategy & Raising Funds")
    if (businessCredit === "learn") queue.push("Business Credit & Funding")
    if (businessBanking === "learn") queue.push("Business Banking & Financial Systems")
    if (wealthBuilding.includes("learn")) queue.push("Wealth Building & Investing")
    return queue
  }

  const handleFinish = () => {
    const resolvedIndustry = industry === "Other" ? (customIndustry || "Other") : (industry ?? "")
    const learningQueue = collectLearningQueue()

    saveBusinessContext({
      completedAt: new Date().toISOString(),
      businessName,
      businessStage: businessStage!,
      businessModel,
      industry: resolvedIndustry,
      founderRole: founderRole!,
      teamSize: teamSize!,
      revenueStage: revenueStage!,
      biggestGoals,
      biggestChallenges,
      operatingEnvironment: operatingEnvironment ?? undefined,
      supportNetwork: supportNetwork.length > 0 ? supportNetwork : undefined,
      biggestOpportunities: biggestOpportunities.length > 0 ? biggestOpportunities : undefined,
      longTermVision: vision,
      capitalStrategy,
      growthVision: growthVision!,
      exitVision: exitVision!,
      businessCredit: businessCredit!,
      businessBanking: businessBanking!,
      financialFoundation,
      wealthBuildingInterests: wealthBuilding,
      communicationLevel: commLevel!,
      learningInterests,
    })

    saveFounderLearning({
      completedAt: new Date().toISOString(),
      communicationLevel: commLevel!,
      learningInterests,
      learningQueue,
      completedLessons: [],
    })

    router.push("/harmony-blueprint")
  }

  const completedSteps = step

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10" ref={cardRef}>
      <ProgressBar step={completedSteps} total={TOTAL_STEPS} />

      {/* ── Step 0: Business Name ─────────────────────────────────────────── */}
      {step === 0 && (
        <StepCard>
          <StepLabel label="Business Identity™" step={1} total={TOTAL_STEPS} />
          <StepQuestion>What is the name of your business?</StepQuestion>
          <StepHint>
            If you have not named it yet, use your working name or your own name.
          </StepHint>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter your business name"
            className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20"
          />
          <ContinueButton onClick={advance} disabled={!businessName.trim()} />
        </StepCard>
      )}

      {/* ── Step 1: Business Stage™ ───────────────────────────────────────── */}
      {step === 1 && (
        <StepCard>
          <StepLabel label="Business Identity™" step={2} total={TOTAL_STEPS} />
          <StepQuestion>Which stage best describes where your business is right now?</StepQuestion>
          <SingleChoice
            options={STAGE_OPTIONS}
            value={businessStage}
            onChange={(v) => autoAdvanceSingle(setBusinessStage, v)}
          />
        </StepCard>
      )}

      {/* ── Step 2: Business Model™ ───────────────────────────────────────── */}
      {step === 2 && (
        <StepCard>
          <StepLabel label="Business Identity™" step={3} total={TOTAL_STEPS} />
          <StepQuestion>How does your business generate revenue?</StepQuestion>
          <StepHint>Select all that apply.</StepHint>
          <MultiChoice
            options={MODEL_OPTIONS}
            values={businessModel}
            onChange={setBusinessModel}
          />
          <ContinueButton onClick={advance} disabled={businessModel.length === 0} />
        </StepCard>
      )}

      {/* ── Step 3: Industry™ ─────────────────────────────────────────────── */}
      {step === 3 && (
        <StepCard>
          <StepLabel label="Business Identity™" step={4} total={TOTAL_STEPS} />
          <StepQuestion>What industry does your business operate in?</StepQuestion>
          <div className="flex flex-col gap-2">
            {INDUSTRY_OPTIONS.map((opt) => {
              const selected = industry === opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setIndustry(opt)
                    if (opt !== "Other") {
                      autoAdvanceSingle(() => {}, opt as never)
                      hasAdvancedRef.current = true
                      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
                    }
                  }}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left font-montserrat text-sm font-semibold transition-all ${
                    selected
                      ? "border-[#5B835F] bg-[#F4F8F4] text-[#3A2E33]"
                      : "border-[#E8E0D5] bg-white text-[#3A2E33] hover:border-[#5B835F]/30"
                  }`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {industry === "Other" && (
            <div className="mt-4">
              <input
                type="text"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                placeholder="Describe your industry"
                className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20"
              />
              <ContinueButton onClick={advance} disabled={!customIndustry.trim()} />
            </div>
          )}
        </StepCard>
      )}

      {/* ── Step 4: Founder Role™ ─────────────────────────────────────────── */}
      {step === 4 && (
        <StepCard>
          <StepLabel label="Business Identity™" step={5} total={TOTAL_STEPS} />
          <StepQuestion>How would you describe your role in the business?</StepQuestion>
          <SingleChoice
            options={ROLE_OPTIONS}
            value={founderRole}
            onChange={(v) => autoAdvanceSingle(setFounderRole, v)}
          />
        </StepCard>
      )}

      {/* ── Step 5: Team Size™ ────────────────────────────────────────────── */}
      {step === 5 && (
        <StepCard>
          <StepLabel label="Business Identity™" step={6} total={TOTAL_STEPS} />
          <StepQuestion>How many people work in your business, including contractors?</StepQuestion>
          <SingleChoice
            options={TEAM_OPTIONS}
            value={teamSize}
            onChange={(v) => autoAdvanceSingle(setTeamSize, v)}
          />
        </StepCard>
      )}

      {/* ── Step 6: Revenue Stage™ ────────────────────────────────────────── */}
      {step === 6 && (
        <StepCard>
          <StepLabel label="Business Identity™" step={7} total={TOTAL_STEPS} />
          <StepQuestion>Which best describes your current annual revenue?</StepQuestion>
          <StepHint>This is kept private and only used to personalize your experience.</StepHint>
          <SingleChoice
            options={REVENUE_OPTIONS}
            value={revenueStage}
            onChange={(v) => autoAdvanceSingle(setRevenueStage, v)}
          />
        </StepCard>
      )}

      {/* ── Step 7: Biggest Goals™ ────────────────────────────────────────── */}
      {step === 7 && (
        <StepCard>
          <StepLabel label="Growth Intelligence™" step={8} total={TOTAL_STEPS} />
          <StepQuestion>What are your top goals for your business right now?</StepQuestion>
          <StepHint>Select up to 3.</StepHint>
          <MultiChoice
            options={GOAL_OPTIONS}
            values={biggestGoals}
            onChange={setBiggestGoals}
            max={3}
          />
          <ContinueButton onClick={advance} disabled={biggestGoals.length === 0} />
        </StepCard>
      )}

      {/* ── Step 8: Biggest Challenges™ ──────────────────────────────────── */}
      {step === 8 && (
        <StepCard>
          <StepLabel label="Growth Intelligence™" step={9} total={TOTAL_STEPS} />
          <StepQuestion>What are the biggest challenges you are facing right now?</StepQuestion>
          <StepHint>Select up to 3.</StepHint>
          <MultiChoice
            options={CHALLENGE_OPTIONS}
            values={biggestChallenges}
            onChange={setBiggestChallenges}
            max={3}
          />
          <ContinueButton onClick={advance} disabled={biggestChallenges.length === 0} />
        </StepCard>
      )}

      {/* ── Step 9: Founder Operating Environment™ ───────────────────────── */}
      {step === 9 && (
        <StepCard>
          <StepLabel label="Founder Operating Environment™" step={10} total={TOTAL_STEPS} />
          <StepQuestion>Where do you primarily operate your business today?</StepQuestion>
          <SingleChoice
            options={OPERATING_ENV_OPTIONS}
            value={operatingEnvironment}
            onChange={(v) => autoAdvanceSingle(setOperatingEnvironment, v)}
          />
        </StepCard>
      )}

      {/* ── Step 10: Founder Support Network™ ────────────────────────────── */}
      {step === 10 && (
        <StepCard>
          <StepLabel label="Founder Support Network™" step={11} total={TOTAL_STEPS} />
          <StepQuestion>Who currently supports your business?</StepQuestion>
          <StepHint>Select all that apply.</StepHint>
          <MultiChoice
            options={SUPPORT_NETWORK_OPTIONS}
            values={supportNetwork}
            onChange={setSupportNetwork}
          />
          <ContinueButton onClick={advance} disabled={supportNetwork.length === 0} />
        </StepCard>
      )}

      {/* ── Step 11: Biggest Opportunity™ ────────────────────────────────── */}
      {step === 11 && (
        <StepCard>
          <StepLabel label="Growth Intelligence™" step={12} total={TOTAL_STEPS} />
          <StepQuestion>
            Where do you believe your greatest opportunity for growth is right now?
          </StepQuestion>
          <StepHint>Select up to 3.</StepHint>
          <MultiChoice
            options={OPPORTUNITY_OPTIONS}
            values={biggestOpportunities}
            onChange={setBiggestOpportunities}
            max={3}
          />
          <ContinueButton onClick={advance} disabled={biggestOpportunities.length === 0} />
        </StepCard>
      )}

      {/* ── Step 12: Long-Term Vision™ ─────────────────────────────────────── */}
      {step === 12 && (
        <StepCard>
          <StepLabel label="Long-Term Vision™" step={13} total={TOTAL_STEPS} />
          <StepQuestion>Where do you see your business going?</StepQuestion>
          <StepHint>
            These vision milestones help personalize your long-term operating strategy. Answer what
            you can — these can be refined over time.
          </StepHint>
          <div className="flex flex-col gap-4">
            {(
              [
                { key: "oneYear", label: "1-Year Vision™" },
                { key: "threeYear", label: "3-Year Vision™" },
                { key: "fiveYear", label: "5-Year Vision™" },
                { key: "tenYear", label: "10-Year Vision™" },
              ] as const
            ).map(({ key, label }) => (
              <div key={key}>
                <label className="block font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#5B835F] mb-1.5">
                  {label}
                </label>
                <input
                  type="text"
                  value={vision[key]}
                  onChange={(e) => setVision((v) => ({ ...v, [key]: e.target.value }))}
                  placeholder={`Where will your business be in ${key === "oneYear" ? "1" : key === "threeYear" ? "3" : key === "fiveYear" ? "5" : "10"} year${key === "oneYear" ? "" : "s"}?`}
                  className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20"
                />
              </div>
            ))}
          </div>
          <ContinueButton onClick={advance} disabled={!vision.oneYear.trim()} label="Save My Vision™" />
        </StepCard>
      )}

      {/* ── Step 13: Capital Strategy™ ────────────────────────────────────── */}
      {step === 13 && (
        <StepCard>
          <StepLabel label="Growth & Capital™" step={14} total={TOTAL_STEPS} />
          <StepQuestion>How are you funding or planning to fund your business?</StepQuestion>
          <StepHint>Select all that apply.</StepHint>
          <MultiChoice
            options={CAPITAL_OPTIONS}
            values={capitalStrategy}
            onChange={setCapitalStrategy}
          />
          <ContinueButton onClick={advance} disabled={capitalStrategy.length === 0} />
        </StepCard>
      )}

      {/* ── Step 14: Growth Vision™ ───────────────────────────────────────── */}
      {step === 14 && (
        <StepCard>
          <StepLabel label="Growth & Capital™" step={15} total={TOTAL_STEPS} />
          <StepQuestion>What is your overall growth vision for this business?</StepQuestion>
          <SingleChoice
            options={GROWTH_OPTIONS}
            value={growthVision}
            onChange={(v) => autoAdvanceSingle(setGrowthVision, v)}
          />
        </StepCard>
      )}

      {/* ── Step 15: Exit Vision™ ─────────────────────────────────────────── */}
      {step === 15 && (
        <StepCard>
          <StepLabel label="Growth & Capital™" step={16} total={TOTAL_STEPS} />
          <StepQuestion>What is your long-term exit vision?</StepQuestion>
          <SingleChoice
            options={EXIT_OPTIONS}
            value={exitVision}
            onChange={(v) => autoAdvanceSingle(setExitVision, v)}
          />
        </StepCard>
      )}

      {/* ── Step 16: Business Credit™ ─────────────────────────────────────── */}
      {step === 16 && (
        <StepCard>
          <StepLabel label="Financial Architecture™" step={17} total={TOTAL_STEPS} />
          <StepQuestion>Do you have established business credit?</StepQuestion>
          <SingleChoice
            options={CREDIT_OPTIONS}
            value={businessCredit}
            onChange={(v) => autoAdvanceSingle(setBusinessCredit, v)}
          />
        </StepCard>
      )}

      {/* ── Step 17: Business Banking™ ────────────────────────────────────── */}
      {step === 17 && (
        <StepCard>
          <StepLabel label="Financial Architecture™" step={18} total={TOTAL_STEPS} />
          <StepQuestion>Do you have a dedicated business bank account?</StepQuestion>
          <SingleChoice
            options={BANKING_OPTIONS}
            value={businessBanking}
            onChange={(v) => autoAdvanceSingle(setBusinessBanking, v)}
          />
        </StepCard>
      )}

      {/* ── Step 18: Financial Foundation™ ───────────────────────────────── */}
      {step === 18 && (
        <StepCard>
          <StepLabel label="Financial Architecture™" step={19} total={TOTAL_STEPS} />
          <StepQuestion>Which financial foundations have you built for your business?</StepQuestion>
          <StepHint>Select all that apply.</StepHint>
          <MultiChoice
            options={FIN_FOUNDATION_OPTIONS}
            values={financialFoundation}
            onChange={setFinancialFoundation}
          />
          <ContinueButton onClick={advance} disabled={financialFoundation.length === 0} />
        </StepCard>
      )}

      {/* ── Step 19: Wealth Building™ ─────────────────────────────────────── */}
      {step === 19 && (
        <StepCard>
          <StepLabel label="Financial Architecture™" step={20} total={TOTAL_STEPS} />
          <StepQuestion>Where are you currently building or interested in building wealth?</StepQuestion>
          <StepHint>Select all that apply.</StepHint>
          <MultiChoice
            options={WEALTH_OPTIONS}
            values={wealthBuilding}
            onChange={setWealthBuilding}
          />
          <ContinueButton onClick={advance} disabled={wealthBuilding.length === 0} />
        </StepCard>
      )}

      {/* ── Step 20: Executive Communication Level™ ───────────────────────── */}
      {step === 20 && (
        <StepCard>
          <StepLabel label="Executive Communication™" step={21} total={TOTAL_STEPS} />
          <StepQuestion>
            How would you like Harmony Lane™ to communicate business concepts with you?
          </StepQuestion>
          <StepHint>
            This is a communication preference — not a measure of intelligence or capability. You can
            change it any time.
          </StepHint>
          <SingleChoice
            options={COMMUNICATION_LEVELS.map((l) => ({
              value: l.id,
              label: l.label,
              description: l.description,
            }))}
            value={commLevel}
            onChange={(v) => autoAdvanceSingle(setCommLevel, v as CommunicationLevelOption)}
          />
        </StepCard>
      )}

      {/* ── Step 21: Learning Interests™ ─────────────────────────────────── */}
      {step === 21 && (
        <StepCard>
          <StepLabel label="Learn Before You Launch™" step={22} total={TOTAL_STEPS} />
          <StepQuestion>
            What topics are you most interested in learning more about?
          </StepQuestion>
          <StepHint>
            Select all that interest you. These will be prioritized in your Learn Before You
            Launch™ curriculum.
          </StepHint>
          <div className="flex flex-wrap gap-2">
            {LEARNING_TOPIC_OPTIONS.map((topic) => {
              const selected = learningInterests.includes(topic)
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() =>
                    setLearningInterests((prev) =>
                      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
                    )
                  }
                  aria-pressed={selected}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-montserrat text-[13px] font-semibold transition-all ${
                    selected
                      ? "bg-[#5B835F] text-white"
                      : "border border-[#E8E0D5] bg-white text-[#3A2E33] hover:border-[#5B835F]/40"
                  }`}
                >
                  {selected ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden /> : <Plus className="h-3 w-3" aria-hidden />}
                  {topic}
                </button>
              )
            })}
          </div>
          <ContinueButton
            onClick={handleFinish}
            disabled={learningInterests.length === 0}
            label="Complete My Business Context Profile™"
          />
        </StepCard>
      )}
    </div>
  )
}
