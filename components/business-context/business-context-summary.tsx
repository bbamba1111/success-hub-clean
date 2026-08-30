"use client"

/**
 * Business Context Profile™ — read-only completed summary.
 * ---------------------------------------------------------------------------
 * Shown instead of the raw 35-question wizard once a Business Context
 * Profile™ is complete. Grouped into the same sections the wizard itself
 * uses; each section's "Edit" jumps straight into the wizard at that
 * section's first step (see BusinessContextProfile.jumpToStep), where the
 * member can then page freely through every other step with Back/Forward.
 */

import { Pencil } from "lucide-react"
import {
  STAGE_OPTIONS,
  MODEL_OPTIONS,
  ROLE_OPTIONS,
  TEAM_OPTIONS,
  REVENUE_OPTIONS,
  GOAL_OPTIONS,
  CHALLENGE_OPTIONS,
  OPERATING_ENV_OPTIONS,
  SUPPORT_NETWORK_OPTIONS,
  OPPORTUNITY_OPTIONS,
  CAPITAL_OPTIONS,
  GROWTH_OPTIONS,
  EXIT_OPTIONS,
  CREDIT_OPTIONS,
  BANKING_OPTIONS,
  FIN_FOUNDATION_OPTIONS,
  WEALTH_OPTIONS,
  DELIVERY_MODEL_OPTIONS,
  CLIENT_CONNECTION_EXPERIENCE_OPTIONS,
  YES_NO_OPTIONS,
  labelFor,
  labelsFor,
} from "@/lib/business-context/options"
import { COMMUNICATION_LEVELS } from "@/lib/founder-learning/types"
import type {
  BusinessBankingOption,
  BusinessCreditOption,
  BusinessModelOption,
  BusinessStageOption,
  CapitalStrategyOption,
  ChallengeOption,
  ClientConnectionExperienceStatus,
  CommunicationLevelOption,
  DeliveryModelOption,
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

export interface BusinessContextSummaryData {
  businessName: string
  businessStage: BusinessStageOption | null
  businessModel: BusinessModelOption[]
  industry: string | null
  founderRole: FounderRoleOption | null
  teamSize: TeamSizeOption | null
  revenueStage: RevenueStagOption | null
  biggestGoals: GoalOption[]
  biggestChallenges: ChallengeOption[]
  operatingEnvironment: OperatingEnvironmentOption | null
  supportNetwork: SupportNetworkOption[]
  biggestOpportunities: OpportunityOption[]
  vision: LongTermVision
  biggestGoalText: string
  biggestChallengeText: string
  successVision: string
  capitalStrategy: CapitalStrategyOption[]
  growthVision: GrowthVisionOption | null
  exitVision: ExitVisionOption | null
  businessCredit: BusinessCreditOption | null
  businessBanking: BusinessBankingOption | null
  financialFoundation: FinancialFoundationOption[]
  wealthBuilding: WealthBuildingOption[]
  commLevel: CommunicationLevelOption | null
  learningInterests: string[]
  offerStatement: string
  idealClientDefinition: string
  acquisitionChannel: string
  conversionMechanism: string
  hasOnboarding: "yes" | "no" | null
  deliveryModel: DeliveryModelOption | null
  hasProofTestimonials: "yes" | "no" | null
  referralMechanism: string
  currentAiToolUse: string
  clientConnectionExperienceStatus: ClientConnectionExperienceStatus | null
}

function Field({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null
  return (
    <div>
      <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.14em] text-[#5B835F] mb-0.5">
        {label}
      </p>
      <p className="font-montserrat text-sm text-[#3A2E33] leading-relaxed">{value}</p>
    </div>
  )
}

function SummarySection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-[#E8E0D5] bg-white shadow-sm px-6 py-6 sm:px-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-playfair text-base font-semibold text-[#3A2E33]">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E0D5] bg-white px-3.5 py-1.5 font-montserrat text-xs font-semibold text-[#6B5860] transition-colors hover:border-[#5B835F]/40 hover:text-[#3A2E33]"
        >
          <Pencil className="h-3 w-3" aria-hidden />
          Edit
        </button>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">{children}</div>
    </div>
  )
}

export function BusinessContextSummary({
  data,
  onEditSection,
}: {
  data: BusinessContextSummaryData
  onEditSection: (step: number) => void
}) {
  const commLabel = data.commLevel
    ? COMMUNICATION_LEVELS.find((l) => l.id === data.commLevel)?.label ?? data.commLevel
    : undefined

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            Business Context Profile™
          </span>
          <p className="mt-1 font-playfair text-xl font-medium text-[#3A2E33]">Complete</p>
        </div>
        <button
          type="button"
          onClick={() => onEditSection(0)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#5B835F] px-5 py-2.5 font-montserrat text-sm font-bold text-white transition-colors hover:bg-[#4c6f50]"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Edit Full Profile
        </button>
      </div>

      <SummarySection title="Business Identity™" onEdit={() => onEditSection(0)}>
        <Field label="Business Name" value={data.businessName || undefined} />
        <Field label="Stage" value={labelFor(STAGE_OPTIONS, data.businessStage)} />
        <Field label="Revenue Model" value={labelsFor(MODEL_OPTIONS, data.businessModel)} />
        <Field label="Industry" value={data.industry || undefined} />
        <Field label="Founder Role" value={labelFor(ROLE_OPTIONS, data.founderRole)} />
        <Field label="Team Size" value={labelFor(TEAM_OPTIONS, data.teamSize)} />
        <Field label="Revenue Stage" value={labelFor(REVENUE_OPTIONS, data.revenueStage)} />
      </SummarySection>

      <SummarySection title="Goals & Operating Environment™" onEdit={() => onEditSection(7)}>
        <Field label="Biggest Goals" value={labelsFor(GOAL_OPTIONS, data.biggestGoals)} />
        <Field label="Biggest Challenges" value={labelsFor(CHALLENGE_OPTIONS, data.biggestChallenges)} />
        <Field label="Operating Environment" value={labelFor(OPERATING_ENV_OPTIONS, data.operatingEnvironment)} />
        <Field label="Support Network" value={labelsFor(SUPPORT_NETWORK_OPTIONS, data.supportNetwork)} />
        <Field label="Biggest Opportunities" value={labelsFor(OPPORTUNITY_OPTIONS, data.biggestOpportunities)} />
      </SummarySection>

      <SummarySection title="Your Vision™" onEdit={() => onEditSection(12)}>
        <Field label="1-Year Vision" value={data.vision.oneYear || undefined} />
        <Field label="3-Year Vision" value={data.vision.threeYear || undefined} />
        <Field label="5-Year Vision" value={data.vision.fiveYear || undefined} />
        <Field label="10-Year Vision" value={data.vision.tenYear || undefined} />
        <Field label="Next 90 Days" value={data.biggestGoalText || undefined} />
        <Field label="Biggest Challenge" value={data.biggestChallengeText || undefined} />
        <Field label="Success Vision" value={data.successVision || undefined} />
      </SummarySection>

      <SummarySection title="Growth & Capital™" onEdit={() => onEditSection(16)}>
        <Field label="Capital Strategy" value={labelsFor(CAPITAL_OPTIONS, data.capitalStrategy)} />
        <Field label="Growth Vision" value={labelFor(GROWTH_OPTIONS, data.growthVision)} />
        <Field label="Exit Vision" value={labelFor(EXIT_OPTIONS, data.exitVision)} />
      </SummarySection>

      <SummarySection title="Financial Architecture™" onEdit={() => onEditSection(19)}>
        <Field label="Business Credit" value={labelFor(CREDIT_OPTIONS, data.businessCredit)} />
        <Field label="Business Banking" value={labelFor(BANKING_OPTIONS, data.businessBanking)} />
        <Field label="Financial Foundation" value={labelsFor(FIN_FOUNDATION_OPTIONS, data.financialFoundation)} />
        <Field label="Wealth Building" value={labelsFor(WEALTH_OPTIONS, data.wealthBuilding)} />
      </SummarySection>

      <SummarySection title="Executive Communication & Learning™" onEdit={() => onEditSection(23)}>
        <Field label="Communication Level" value={commLabel} />
        <Field label="Learning Interests" value={data.learningInterests.join(", ") || undefined} />
      </SummarySection>

      <SummarySection title="Business Reality™" onEdit={() => onEditSection(25)}>
        <Field label="Offer Statement" value={data.offerStatement || undefined} />
        <Field label="Ideal Client" value={data.idealClientDefinition || undefined} />
        <Field label="Acquisition Channel" value={data.acquisitionChannel || undefined} />
        <Field label="Conversion Mechanism" value={data.conversionMechanism || undefined} />
        <Field label="Has Onboarding Process" value={labelFor(YES_NO_OPTIONS, data.hasOnboarding)} />
        <Field label="Delivery Model" value={labelFor(DELIVERY_MODEL_OPTIONS, data.deliveryModel)} />
        <Field label="Has Testimonials" value={labelFor(YES_NO_OPTIONS, data.hasProofTestimonials)} />
        <Field label="Referral Mechanism" value={data.referralMechanism || undefined} />
        <Field label="Current AI Tool Use" value={data.currentAiToolUse || undefined} />
        <Field
          label="Client Connection Experience™"
          value={labelFor(CLIENT_CONNECTION_EXPERIENCE_OPTIONS, data.clientConnectionExperienceStatus)}
        />
      </SummarySection>
    </div>
  )
}
