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
import { ArrowRight, Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import { saveBusinessContext, getBusinessContext, hasCompletedBusinessContext } from "@/lib/business-context/business-context-store"
import { saveFounderLearning } from "@/lib/founder-learning/founder-learning-store"
import { saveBusinessContextToDb, getBusinessContextFromDb } from "@/utils/business-context-storage"
import { hasCompletedEgaOnboardingSignal } from "@/lib/ega/ega-signal-store"
import {
  COMMUNICATION_LEVELS,
  LEARNING_TOPIC_OPTIONS,
} from "@/lib/founder-learning/types"
import {
  STAGE_OPTIONS,
  MODEL_OPTIONS,
  INDUSTRY_OPTIONS,
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
} from "@/lib/business-context/options"
import { BusinessContextSummary } from "@/components/business-context/business-context-summary"
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

const TOTAL_STEPS = 35

export function BusinessContextProfile({
  onDone,
  onHydrated,
}: { onDone?: () => void; onHydrated?: (completedInDb: boolean) => void } = {}) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const hasAdvancedRef = useRef(false)

  // /business-context is reached both for first-time completion and by a
  // returning member revisiting an already-complete profile (via My
  // Harmony™, My Blueprint™, or the Onboarding Progress™ banner). A
  // completed profile opens straight to a read-only summary instead of the
  // raw 35-question form; "Edit" (or jumping into a specific section) drops
  // back into the wizard. `wasAlreadyComplete` mirrors the pattern in
  // founder-profile-form.tsx / business-context-onboarding-flow.tsx.
  const wasAlreadyComplete = useRef(hasCompletedBusinessContext())
  const userRequestedEdit = useRef(false)
  const [mode, setMode] = useState<"summary" | "wizard">(() =>
    wasAlreadyComplete.current ? "summary" : "wizard",
  )

  const [step, setStep] = useState(0)
  // Highest step the member has actually reached with a saved answer — lets
  // Forward re-advance after using Back without ever skipping ahead of a
  // question that hasn't been answered yet on a first-time pass through the
  // wizard. Once the whole profile is complete this is raised to the last
  // step so summary → Edit can freely page anywhere.
  const [maxStepReached, setMaxStepReached] = useState(0)

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

  // Your Vision™ (open-text, formerly in Founder Profile)
  const [biggestGoalText, setBiggestGoalText] = useState("")
  const [biggestChallengeText, setBiggestChallengeText] = useState("")
  const [successVision, setSuccessVision] = useState("")

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

  // Business Reality™ (Phase 1 — EGA Foundation; facts only, no diagnosis)
  const [offerStatement, setOfferStatement] = useState("")
  const [idealClientDefinition, setIdealClientDefinition] = useState("")
  const [acquisitionChannel, setAcquisitionChannel] = useState("")
  const [conversionMechanism, setConversionMechanism] = useState("")
  const [hasOnboarding, setHasOnboarding] = useState<"yes" | "no" | null>(null)
  const [deliveryModel, setDeliveryModel] = useState<DeliveryModelOption | null>(null)
  const [hasProofTestimonials, setHasProofTestimonials] = useState<"yes" | "no" | null>(null)
  const [referralMechanism, setReferralMechanism] = useState("")
  const [currentAiToolUse, setCurrentAiToolUse] = useState("")
  const [clientConnectionExperienceStatus, setClientConnectionExperienceStatus] =
    useState<ClientConnectionExperienceStatus | null>(null)

  // Auto-scroll on step changes (not on initial load)
  useEffect(() => {
    if (!hasAdvancedRef.current) return
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 60)
  }, [step])

  // Track the furthest step reached so Back/Forward can freely re-traverse
  // ground already covered without ever exposing a step ahead of what's
  // actually been answered on a first-time pass.
  useEffect(() => {
    setMaxStepReached((m) => Math.max(m, step))
  }, [step])

  // Reconcile the local cache with the database — the account's canonical
  // Business Context Profile™ — so a founder editing this on a new device or
  // after clearing local storage picks up right where they left off.
  useEffect(() => {
    getBusinessContextFromDb().then((record) => {
      if (!record) return

      // Tell the caller whether the database already has a completed
      // record, regardless of whether the local cache needs updating below.
      // Callers use this to correct a "wasAlreadyComplete" check that was
      // captured synchronously on mount from the (possibly empty) local
      // cache alone — e.g. a returning member on a new device/session.
      onHydrated?.(Boolean(record.completedAt))

      // Same reconciliation for this component's own "show summary instead
      // of the form" decision — a fresh session's local cache may be empty
      // even though the database already has a completed profile.
      if (record.completedAt) {
        wasAlreadyComplete.current = true
        if (!userRequestedEdit.current) {
          setMode("summary")
          setMaxStepReached(TOTAL_STEPS - 1)
        }
      }

      const cached = getBusinessContext()
      // Local cache already reflects the DB (or is newer); don't clobber
      // in-progress edits with a stale fetch.
      if (cached && cached.completedAt === record.completedAt) return

      setBusinessName(record.businessName)
      setBusinessStage(record.businessStage)
      setBusinessModel(record.businessModel)
      setIndustry(record.industry)
      setFounderRole(record.founderRole)
      setTeamSize(record.teamSize)
      setRevenueStage(record.revenueStage)
      setBiggestGoals(record.biggestGoals)
      setBiggestChallenges(record.biggestChallenges)
      setOperatingEnvironment(record.operatingEnvironment ?? null)
      setSupportNetwork(record.supportNetwork ?? [])
      setBiggestOpportunities(record.biggestOpportunities ?? [])
      setBiggestGoalText(record.biggestGoalText ?? "")
      setBiggestChallengeText(record.biggestChallengeText ?? "")
      setSuccessVision(record.successVision ?? "")
      setVision(record.longTermVision)
      setCapitalStrategy(record.capitalStrategy)
      setGrowthVision(record.growthVision)
      setExitVision(record.exitVision)
      setBusinessCredit(record.businessCredit)
      setBusinessBanking(record.businessBanking)
      setFinancialFoundation(record.financialFoundation)
      setWealthBuilding(record.wealthBuildingInterests)
      setCommLevel(record.communicationLevel)
      setLearningInterests(record.learningInterests)
      setOfferStatement(record.offerStatement ?? "")
      setIdealClientDefinition(record.idealClientDefinition ?? "")
      setAcquisitionChannel(record.acquisitionChannel ?? "")
      setConversionMechanism(record.conversionMechanism ?? "")
      setHasOnboarding(record.hasOnboarding === undefined ? null : record.hasOnboarding ? "yes" : "no")
      setDeliveryModel(record.deliveryModel ?? null)
      setHasProofTestimonials(
        record.hasProofTestimonials === undefined ? null : record.hasProofTestimonials ? "yes" : "no",
      )
      setReferralMechanism(record.referralMechanism ?? "")
      setCurrentAiToolUse(record.currentAiToolUse ?? "")
      setClientConnectionExperienceStatus(record.clientConnectionExperienceStatus ?? null)

      const { updatedAt: _updatedAt, ...profileData } = record
      saveBusinessContext(profileData)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

    const profile = {
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
      biggestGoalText: biggestGoalText || undefined,
      biggestChallengeText: biggestChallengeText || undefined,
      successVision: successVision || undefined,
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
      offerStatement: offerStatement || undefined,
      idealClientDefinition: idealClientDefinition || undefined,
      acquisitionChannel: acquisitionChannel || undefined,
      conversionMechanism: conversionMechanism || undefined,
      hasOnboarding: hasOnboarding === null ? undefined : hasOnboarding === "yes",
      deliveryModel: deliveryModel ?? undefined,
      hasProofTestimonials: hasProofTestimonials === null ? undefined : hasProofTestimonials === "yes",
      referralMechanism: referralMechanism || undefined,
      currentAiToolUse: currentAiToolUse || undefined,
      clientConnectionExperienceStatus: clientConnectionExperienceStatus ?? undefined,
    }

    // Local cache for instant loads, then the database — the account's
    // canonical Business Context Profile™ — so every engine reading it can
    // see this the moment it's saved, from any device.
    saveBusinessContext(profile)
    void saveBusinessContextToDb(profile)

    saveFounderLearning({
      completedAt: new Date().toISOString(),
      communicationLevel: commLevel!,
      learningInterests,
      learningQueue,
      completedLessons: [],
    })

    if (wasAlreadyComplete.current) {
      // Editing an already-complete profile — including via a section jump
      // from the summary below — stays on this page and shows the
      // freshly-updated summary instead of redirecting away.
      setMode("summary")
      userRequestedEdit.current = false
      return
    }

    // First-time completion.
    if (onDone) {
      onDone()
    } else {
      router.push("/audit")
    }
  }

  const jumpToStep = useCallback((targetStep: number) => {
    userRequestedEdit.current = true
    setMode("wizard")
    setMaxStepReached((m) => Math.max(m, targetStep))
    hasAdvancedRef.current = true
    setStep(targetStep)
  }, [])

  // Landing on an already-complete profile only ever offered per-section
  // "Edit" — there was no way to move forward again (e.g. to the required
  // EGA Screen 1 onboarding step) without re-editing and re-saving the
  // whole wizard. This mirrors handleFinish's "already complete" branch,
  // except it routes to whatever the founder actually still needs rather
  // than assuming nothing does: EGA's own signal capture is checked
  // directly (not `onDone`'s caller-side "was already complete" flag,
  // which only reflects THIS profile) so Back-navigating here mid-onboarding
  // and then Continuing always keeps moving forward instead of stalling.
  const handleContinue = onDone
    ? () => {
        if (!hasCompletedEgaOnboardingSignal()) {
          router.push("/entrepreneur-gap-assessment?onboarding=1")
          return
        }
        onDone()
      }
    : undefined

  if (mode === "summary") {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-10">
        <BusinessContextSummary
          onContinue={handleContinue}
          data={{
            businessName,
            businessStage,
            businessModel,
            industry,
            founderRole,
            teamSize,
            revenueStage,
            biggestGoals,
            biggestChallenges,
            operatingEnvironment,
            supportNetwork,
            biggestOpportunities,
            vision,
            biggestGoalText,
            biggestChallengeText,
            successVision,
            capitalStrategy,
            growthVision,
            exitVision,
            businessCredit,
            businessBanking,
            financialFoundation,
            wealthBuilding,
            commLevel,
            learningInterests,
            offerStatement,
            idealClientDefinition,
            acquisitionChannel,
            conversionMechanism,
            hasOnboarding,
            deliveryModel,
            hasProofTestimonials,
            referralMechanism,
            currentAiToolUse,
            clientConnectionExperienceStatus,
          }}
          onEditSection={jumpToStep}
        />
      </div>
    )
  }

  const completedSteps = step

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10" ref={cardRef}>
      <ProgressBar step={completedSteps} total={TOTAL_STEPS} />

      {/* ── Back / Forward — present on every step so a member can revisit
           an earlier answer or return to where they left off. Forward only
           ever reveals a step already reached, so a first-time pass through
           the wizard can never be skipped ahead. ─────────────────────── */}
      <div className="mb-4 flex items-center justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => {
              hasAdvancedRef.current = true
              setStep((s) => Math.max(0, s - 1))
            }}
            className="inline-flex items-center gap-1.5 font-montserrat text-sm font-medium text-[#6B5860] transition-colors hover:text-[#3A2E33]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        ) : (
          <span />
        )}
        {step < maxStepReached ? (
          <button
            type="button"
            onClick={() => {
              hasAdvancedRef.current = true
              setStep((s) => Math.min(maxStepReached, s + 1))
            }}
            className="inline-flex items-center gap-1.5 font-montserrat text-sm font-medium text-[#5B835F] transition-colors hover:text-[#4c6f50]"
          >
            Forward
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <span />
        )}
      </div>

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

      {/* ── Step 2: Business Model™ ──���────────────────────────────────────── */}
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

      {/* ── Step 13: Biggest Goal™ (open-text) ───────────────────────────── */}
      {step === 13 && (
        <StepCard innerRef={cardRef}>
          <StepLabel label="Your Vision™" step={14} total={TOTAL_STEPS} />
          <StepQuestion>What is the most important thing you want to achieve in the next 90 days?</StepQuestion>
          <StepHint>In business and in life. Be as specific as you like.</StepHint>
          <textarea
            value={biggestGoalText}
            onChange={(e) => setBiggestGoalText(e.target.value)}
            rows={4}
            placeholder="My biggest goal right now is…"
            className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20 resize-none leading-relaxed"
          />
          <ContinueButton onClick={advance} />
        </StepCard>
      )}

      {/* ── Step 14: Biggest Challenge™ (open-text) ──────────────────────── */}
      {step === 14 && (
        <StepCard innerRef={cardRef}>
          <StepLabel label="Your Vision™" step={15} total={TOTAL_STEPS} />
          <StepQuestion>What is the number one thing getting in the way of the life and business you want?</StepQuestion>
          <StepHint>There is no wrong answer — honesty here makes every recommendation sharper.</StepHint>
          <textarea
            value={biggestChallengeText}
            onChange={(e) => setBiggestChallengeText(e.target.value)}
            rows={4}
            placeholder="My biggest challenge is…"
            className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20 resize-none leading-relaxed"
          />
          <ContinueButton onClick={advance} />
        </StepCard>
      )}

      {/* ── Step 15: Success Vision™ (open-text) ──────────────────────────── */}
      {step === 15 && (
        <StepCard innerRef={cardRef}>
          <StepLabel label="Your Vision™" step={16} total={TOTAL_STEPS} />
          <StepQuestion>Describe what your life looks like when you are truly winning — in both business and life.</StepQuestion>
          <StepHint>Paint the picture. This becomes the north star for your entire operating system.</StepHint>
          <textarea
            value={successVision}
            onChange={(e) => setSuccessVision(e.target.value)}
            rows={5}
            placeholder="When I am truly winning, my life looks like…"
            className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20 resize-none leading-relaxed"
          />
          <ContinueButton onClick={advance} label="Save My Vision™" />
        </StepCard>
      )}

      {/* ── Step 16: Capital Strategy™ ────────────────────────────────────── */}
      {step === 16 && (
        <StepCard>
          <StepLabel label="Growth & Capital™" step={17} total={TOTAL_STEPS} />
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

      {/* ── Step 17: Growth Vision™ ───────────────────────────────────────── */}
      {step === 17 && (
        <StepCard>
          <StepLabel label="Growth & Capital™" step={18} total={TOTAL_STEPS} />
          <StepQuestion>What is your overall growth vision for this business?</StepQuestion>
          <SingleChoice
            options={GROWTH_OPTIONS}
            value={growthVision}
            onChange={(v) => autoAdvanceSingle(setGrowthVision, v)}
          />
        </StepCard>
      )}

      {/* ── Step 18: Exit Vision™ ─────────────────────────────────────────── */}
      {step === 18 && (
        <StepCard>
          <StepLabel label="Growth & Capital™" step={19} total={TOTAL_STEPS} />
          <StepQuestion>What is your long-term exit vision?</StepQuestion>
          <SingleChoice
            options={EXIT_OPTIONS}
            value={exitVision}
            onChange={(v) => autoAdvanceSingle(setExitVision, v)}
          />
        </StepCard>
      )}

      {/* ── Step 19: Business Credit™ ─────────────────────────────────────── */}
      {step === 19 && (
        <StepCard>
          <StepLabel label="Financial Architecture™" step={20} total={TOTAL_STEPS} />
          <StepQuestion>Do you have established business credit?</StepQuestion>
          <SingleChoice
            options={CREDIT_OPTIONS}
            value={businessCredit}
            onChange={(v) => autoAdvanceSingle(setBusinessCredit, v)}
          />
        </StepCard>
      )}

      {/* ── Step 20: Business Banking™ ────────────────────���───────────────── */}
      {step === 20 && (
        <StepCard>
          <StepLabel label="Financial Architecture™" step={21} total={TOTAL_STEPS} />
          <StepQuestion>Do you have a dedicated business bank account?</StepQuestion>
          <SingleChoice
            options={BANKING_OPTIONS}
            value={businessBanking}
            onChange={(v) => autoAdvanceSingle(setBusinessBanking, v)}
          />
        </StepCard>
      )}

      {/* ── Step 21: Financial Foundation™ ───────────────────────────────── */}
      {step === 21 && (
        <StepCard>
          <StepLabel label="Financial Architecture™" step={22} total={TOTAL_STEPS} />
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

      {/* ── Step 22: Wealth Building™ ─────────────────────────────────────── */}
      {step === 22 && (
        <StepCard>
          <StepLabel label="Financial Architecture™" step={23} total={TOTAL_STEPS} />
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

      {/* ── Step 23: Executive Communication Level™ ───────────────────────── */}
      {step === 23 && (
        <StepCard>
          <StepLabel label="Executive Communication™" step={24} total={TOTAL_STEPS} />
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

      {/* ── Step 24: Learning Interests™ ─────────────────────────────────── */}
      {step === 24 && (
        <StepCard>
          <StepLabel label="Learn Before You Launch™" step={25} total={TOTAL_STEPS} />
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
          <ContinueButton onClick={advance} disabled={learningInterests.length === 0} />
        </StepCard>
      )}

      {/* ── Step 25: Offer Statement — Business Reality™ ─────────────────── */}
      {step === 25 && (
        <StepCard>
          <StepLabel label="Business Reality™" step={26} total={TOTAL_STEPS} />
          <StepQuestion>In one sentence, what does your business offer?</StepQuestion>
          <StepHint>Describe it the way you would to a new prospect — no need to make it perfect.</StepHint>
          <textarea
            value={offerStatement}
            onChange={(e) => setOfferStatement(e.target.value)}
            placeholder="e.g. We help busy founders reclaim their time through done-for-you operations support."
            rows={3}
            className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20"
          />
          <ContinueButton onClick={advance} disabled={!offerStatement.trim()} />
        </StepCard>
      )}

      {/* ── Step 26: Ideal Client Definition — Business Reality™ ─────────── */}
      {step === 26 && (
        <StepCard>
          <StepLabel label="Business Reality™" step={27} total={TOTAL_STEPS} />
          <StepQuestion>Who is your ideal client, in your own words?</StepQuestion>
          <textarea
            value={idealClientDefinition}
            onChange={(e) => setIdealClientDefinition(e.target.value)}
            placeholder="Describe who they are, what they're struggling with, or what they want."
            rows={3}
            className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20"
          />
          <ContinueButton onClick={advance} disabled={!idealClientDefinition.trim()} />
        </StepCard>
      )}

      {/* ── Step 27: Acquisition Channel — Business Reality™ ─────────────── */}
      {step === 27 && (
        <StepCard>
          <StepLabel label="Business Reality™" step={28} total={TOTAL_STEPS} />
          <StepQuestion>Where do most of your new clients come from right now?</StepQuestion>
          <StepHint>e.g. referrals, social media, an existing list, paid ads, cold outreach.</StepHint>
          <input
            type="text"
            value={acquisitionChannel}
            onChange={(e) => setAcquisitionChannel(e.target.value)}
            placeholder="Describe your main source of new clients"
            className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20"
          />
          <ContinueButton onClick={advance} disabled={!acquisitionChannel.trim()} />
        </StepCard>
      )}

      {/* ── Step 28: Conversion Mechanism — Business Reality™ ─────────────── */}
      {step === 28 && (
        <StepCard>
          <StepLabel label="Business Reality™" step={29} total={TOTAL_STEPS} />
          <StepQuestion>What is the primary way a prospect becomes a paying client?</StepQuestion>
          <StepHint>e.g. a sales call, a checkout page, a proposal, a DM conversation.</StepHint>
          <input
            type="text"
            value={conversionMechanism}
            onChange={(e) => setConversionMechanism(e.target.value)}
            placeholder="Describe how someone actually becomes a client"
            className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20"
          />
          <ContinueButton onClick={advance} disabled={!conversionMechanism.trim()} />
        </StepCard>
      )}

      {/* ── Step 29: Onboarding Existence — Business Reality™ ─────────────── */}
      {step === 29 && (
        <StepCard>
          <StepLabel label="Business Reality™" step={30} total={TOTAL_STEPS} />
          <StepQuestion>Do you have a defined onboarding process for new clients?</StepQuestion>
          <StepHint>Just whether one exists today — not whether it's a good one.</StepHint>
          <SingleChoice
            options={YES_NO_OPTIONS}
            value={hasOnboarding}
            onChange={(v) => autoAdvanceSingle(setHasOnboarding, v)}
          />
        </StepCard>
      )}

      {/* ── Step 30: Delivery Model — Business Reality™ ───────────────────── */}
      {step === 30 && (
        <StepCard>
          <StepLabel label="Business Reality™" step={31} total={TOTAL_STEPS} />
          <StepQuestion>How do you primarily deliver your product or service?</StepQuestion>
          <SingleChoice
            options={DELIVERY_MODEL_OPTIONS}
            value={deliveryModel}
            onChange={(v) => autoAdvanceSingle(setDeliveryModel, v)}
          />
        </StepCard>
      )}

      {/* ── Step 31: Proof & Testimonials — Business Reality™ ─────────────── */}
      {step === 31 && (
        <StepCard>
          <StepLabel label="Business Reality™" step={32} total={TOTAL_STEPS} />
          <StepQuestion>Do you have client testimonials or proof of results?</StepQuestion>
          <SingleChoice
            options={YES_NO_OPTIONS}
            value={hasProofTestimonials}
            onChange={(v) => autoAdvanceSingle(setHasProofTestimonials, v)}
          />
        </StepCard>
      )}

      {/* ── Step 32: Referral Mechanism — Business Reality™ ───────────────── */}
      {step === 32 && (
        <StepCard>
          <StepLabel label="Business Reality™" step={33} total={TOTAL_STEPS} />
          <StepQuestion>How do referrals or repeat business currently happen, if at all?</StepQuestion>
          <StepHint>It's okay to say "they don't yet" — that's useful information too.</StepHint>
          <input
            type="text"
            value={referralMechanism}
            onChange={(e) => setReferralMechanism(e.target.value)}
            placeholder="Describe how referrals or repeat clients happen today"
            className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20"
          />
          <ContinueButton onClick={advance} disabled={!referralMechanism.trim()} />
        </StepCard>
      )}

      {/* ── Step 33: Current AI Tool Use — Business Reality™ ──────────────── */}
      {step === 33 && (
        <StepCard>
          <StepLabel label="Business Reality™" step={34} total={TOTAL_STEPS} />
          <StepQuestion>Which AI tools, if any, are you currently using in your business?</StepQuestion>
          <StepHint>It's okay to say "none yet."</StepHint>
          <input
            type="text"
            value={currentAiToolUse}
            onChange={(e) => setCurrentAiToolUse(e.target.value)}
            placeholder="e.g. ChatGPT for content, none yet, a scheduling assistant"
            className="w-full rounded-2xl border border-[#E8E0D5] bg-white px-4 py-3 font-montserrat text-sm text-[#3A2E33] placeholder:text-[#6B5860]/40 focus:border-[#5B835F] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/20"
          />
          <ContinueButton onClick={advance} disabled={!currentAiToolUse.trim()} />
        </StepCard>
      )}

      {/* ── Step 34: Client Connection Experience™ — Business Reality™ ────── */}
      {step === 34 && (
        <StepCard>
          <StepLabel label="Business Reality™" step={35} total={TOTAL_STEPS} />
          <StepQuestion>Do you currently run a Client Connection Experience™?</StepQuestion>
          <StepHint>Challenge, webinar, workshop, immersion, or mastermind — pick the one that applies today.</StepHint>
          <SingleChoice
            options={CLIENT_CONNECTION_EXPERIENCE_OPTIONS}
            value={clientConnectionExperienceStatus}
            onChange={setClientConnectionExperienceStatus}
          />
          <ContinueButton
            onClick={handleFinish}
            disabled={!clientConnectionExperienceStatus}
            label="Complete My Business Context Profile™"
          />
        </StepCard>
      )}
    </div>
  )
}
