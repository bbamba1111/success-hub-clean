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

import { ChevronRight, Pencil } from "lucide-react"
import {
  STAGE_OPTIONS,
  MODEL_OPTIONS,
  ROLE_OPTIONS,
  TEAM_OPTIONS,
  REVENUE_OPTIONS,
  SUPPORT_NETWORK_OPTIONS,
  GROWTH_OPTIONS,
  EXIT_OPTIONS,
  DELIVERY_MODEL_OPTIONS,
  CLIENT_CONNECTION_EXPERIENCE_OPTIONS,
  labelFor,
  labelsFor,
} from "@/lib/business-context/options"
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
  onContinue,
  continueLabel = "Continue",
}: {
  data: BusinessContextSummaryData
  onEditSection: (step: number) => void
  /**
   * Advances to the next required onboarding step. Landing back on this
   * page already-complete — via Back navigation, the Onboarding
   * Progress™ banner, or a direct visit — only ever offered per-section
   * "Edit" before this; there was no way to move forward again without
   * re-editing and re-saving the whole wizard. Omit this prop for any
   * non-onboarding usage of this summary (e.g. the Operating Planner™
   * modal) where "next step" doesn't apply.
   */
  onContinue?: () => void
  continueLabel?: string
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            Business Context Profile™
          </span>
          <p className="mt-1 font-playfair text-xl font-medium text-[#3A2E33]">Complete</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onEditSection(0)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E0D5] bg-white px-4 py-2.5 font-montserrat text-sm font-bold text-[#3A2E33] transition-colors hover:border-[#5B835F]/40"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit Full Profile
          </button>
          {onContinue && (
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#5B835F] px-5 py-2.5 font-montserrat text-sm font-bold text-white transition-colors hover:bg-[#4c6f50]"
            >
              {continueLabel}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* Only the approved, currently-presented questions appear here. Hidden
          questions remain in the wizard code + database but are intentionally
          left off this summary, and every "Edit" jumps to a visible step. */}
      <SummarySection title="Business Identity™" onEdit={() => onEditSection(0)}>
        <Field label="Business Name" value={data.businessName || undefined} />
        <Field label="Stage" value={labelFor(STAGE_OPTIONS, data.businessStage)} />
        <Field label="Revenue Model" value={labelsFor(MODEL_OPTIONS, data.businessModel)} />
        <Field label="Industry" value={data.industry || undefined} />
        <Field label="Founder Role" value={labelFor(ROLE_OPTIONS, data.founderRole)} />
        <Field label="Team Size" value={labelFor(TEAM_OPTIONS, data.teamSize)} />
      </SummarySection>

      <SummarySection title="Founder Support Network™" onEdit={() => onEditSection(6)}>
        <Field label="Annual Revenue" value={labelFor(REVENUE_OPTIONS, data.revenueStage)} />
        <Field label="Support Network" value={labelsFor(SUPPORT_NETWORK_OPTIONS, data.supportNetwork)} />
      </SummarySection>

      <SummarySection title="Your Vision™" onEdit={() => onEditSection(13)}>
        <Field label="Next 90 Days" value={data.biggestGoalText || undefined} />
        <Field label="#1 Thing in the Way" value={data.biggestChallengeText || undefined} />
        <Field label="Winning Looks Like" value={data.successVision || undefined} />
      </SummarySection>

      <SummarySection title="Growth & Capital™" onEdit={() => onEditSection(17)}>
        <Field label="Growth Vision" value={labelFor(GROWTH_OPTIONS, data.growthVision)} />
        <Field label="Exit Vision" value={labelFor(EXIT_OPTIONS, data.exitVision)} />
      </SummarySection>

      <SummarySection title="Business Reality™" onEdit={() => onEditSection(30)}>
        <Field label="Delivery Model" value={labelFor(DELIVERY_MODEL_OPTIONS, data.deliveryModel)} />
        <Field label="Current AI Tool Use" value={data.currentAiToolUse || undefined} />
        <Field
          label="Client Connection Experience™"
          value={labelFor(CLIENT_CONNECTION_EXPERIENCE_OPTIONS, data.clientConnectionExperienceStatus)}
        />
      </SummarySection>
    </div>
  )
}
