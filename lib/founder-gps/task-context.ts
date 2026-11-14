/**
 * Founder GPS Task Context — shared business context + task-specific readiness.
 *
 * This is an adapter over existing sources of truth. It does not create a
 * competing profile, score the founder, or write back to source records.
 * ERA here is a task-readiness check: it identifies evidence available and
 * missing for this task, not a permanent founder rating.
 */
import { getBusinessContext } from "@/lib/business-context/business-context-store"
import { getFounderProfile } from "@/lib/founder-profile/founder-profile-store"
import { getEsaHistory } from "@/lib/entrepreneur-success/esa-storage"
import { getBusinessFoundation } from "@/utils/business-foundation-storage"

export type FounderTaskContext = {
  businessName: string | null
  businessDescription: string | null
  idealAudience: string | null
  offers: string[]
  expertise: string[]
  goals: string[]
  stage: string | null
  founderProfileAvailable: boolean
  businessContextAvailable: boolean
  businessFoundationAvailable: boolean
  era: {
    status: "ready" | "needs-input" | "limited-context"
    available: string[]
    missing: string[]
    latestAssessmentDate: string | null
  }
}

function asText(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim()
  return null
}
function asList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string" && !!v.trim()).map(v => v.trim())
  const text = asText(value)
  return text ? [text] : []
}

/** Loads the founder's existing approved business records for a single task. */
export async function loadFounderTaskContext(taskTitle: string): Promise<FounderTaskContext> {
  const profile = getFounderProfile()
  const business = getBusinessContext()
  const foundation = await getBusinessFoundation().catch(() => null)
  const latestEsa = getEsaHistory()[0] ?? null

  const businessName = asText(business?.businessName) ?? asText(foundation?.businessIdentity) ??
    asText(profile?.businessName) ?? asText(profile?.business_name)
  const businessDescription = asText(business?.offerStatement) ?? asText(foundation?.businessIdentity) ??
    asText(profile?.businessDescription) ?? asText(profile?.business_description)
  const idealAudience = asText(business?.idealClientDefinition) ?? asText(profile?.idealAudience) ??
    asText(profile?.ideal_audience)
  const offers = [
    ...asList(profile?.offers), ...asList(profile?.services), ...asList(profile?.products),
    ...asList(business?.offerStatement),
  ]
  const expertise = [
    ...asList(profile?.expertise), ...asList(profile?.topics), ...asList(profile?.speakingTopics),
    ...asList(profile?.speaking_topics), ...asList(business?.learningInterests),
  ]
  const goals = [
    ...asList(business?.biggestGoalText), ...asList(business?.biggestOpportunities),
    ...asList(foundation?.businessChallenges), ...asList(foundation?.founderSuccessVision),
  ]
  const stage = asText(business?.businessStage) ?? asText(foundation?.businessStage)

  const isVisibilityTask = /podcast|speak|speaker|stage|event|media|press|interview/i.test(taskTitle)
  const available: string[] = []
  const missing: string[] = []
  const checks = isVisibilityTask
    ? [
        ["Business identity", businessName],
        ["What the business offers", businessDescription],
        ["Intended audience", idealAudience],
        ["Expertise or speaking topics", expertise.length ? expertise.join(", ") : null],
      ] as const
    : [
        ["Business identity", businessName],
        ["What the business offers", businessDescription],
        ["Intended audience", idealAudience],
      ] as const
  for (const [label, value] of checks) (value ? available : missing).push(label)

  const hasAnyBusinessSource = Boolean(profile || business || foundation)
  const status = missing.length === 0 ? "ready" : hasAnyBusinessSource ? "needs-input" : "limited-context"

  return {
    businessName, businessDescription, idealAudience,
    offers: [...new Set(offers)], expertise: [...new Set(expertise)],
    goals: [...new Set(goals)], stage,
    founderProfileAvailable: Boolean(profile),
    businessContextAvailable: Boolean(business),
    businessFoundationAvailable: Boolean(foundation),
    era: {
      status, available, missing,
      latestAssessmentDate: latestEsa?.completedAt ?? null,
    },
  }
}
