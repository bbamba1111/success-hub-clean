/**
 * Relevant Considerations for Start™ — a personalized interpretation built only from
 * answers the founder actually saved. Nothing here is inferred from unasked questions.
 */

import { requirementById } from "@/lib/boundary-report/business-intelligence"
import { personalRealityById } from "@/lib/boundary-report/personal-reality"
import type { AlignmentChoice, BaselineArea, BusinessStage } from "@/lib/boundary-report/types"

export type EvidenceSource = "provided" | "audit"

export interface ConsiderationEvidence {
  source: EvidenceSource
  text: string
}

export interface StartConsideration {
  id: string
  title: string
  finding: string
  whyItMatters: string
  evidence: ConsiderationEvidence[]
  businessImplications?: string
  personalConsiderations?: string
  startingPoint: string
}

export interface ConsiderationInputs {
  intentionChoices: Record<string, string[]>
  requirements: string[]
  personalReality: string[]
  baselineAreas: BaselineArea[]
  priorityFocusAreas: string[]
  alignment: Record<string, AlignmentChoice>
  stage: BusinessStage | null
}

interface Theme {
  id: string
  title: string
  business: string[]
  personal: string[]
  auditPattern?: RegExp
  intentionGroups: string[]
  alignmentIds: string[]
  protects: string
  businessImplication: string
  personalNote: string
  startingPoint: Record<BusinessStage, string>
}

const THEMES: Theme[] = [
  {
    id: "availability",
    title: "Clear availability and response expectations",
    business: ["availability", "operating-hours", "client-expectations", "communication", "notifications"],
    personal: ["work-intrudes", "cant-disconnect", "no-separation", "assumed-available"],
    intentionGroups: ["time-freedom", "home-self"],
    alignmentIds: ["contain-work", "end-workday", "disconnect"],
    protects: "the hours that belong to your life rather than the business",
    businessImplication:
      "The business may need defined working hours, a stated response time, and notification settings that match them, so clients and the team know when you are and aren't reachable.",
    personalNote:
      "Working from home can make it harder to tell when the workday has ended, for you and for the people around you. Clear hours help, but the physical and mental separation at home may need its own attention.",
    startingPoint: {
      start: "Consider writing down the hours you intend to be available this week and one response-time expectation you could share with clients.",
      grow: "Consider agreeing on team-wide response-time standards so client requests don't default to you outside your hours.",
      scale: "Consider documenting operating hours and an after-hours coverage rule so availability no longer depends on you.",
    },
  },
  {
    id: "meetings",
    title: "Meeting boundaries and protected focus time",
    business: ["meetings", "interruptions", "deadlines"],
    personal: ["household-interruptions", "home-maintenance", "workspace-limits"],
    intentionGroups: ["time-freedom"],
    alignmentIds: ["start-intentionally", "redesign-workweek"],
    protects: "uninterrupted time to do your most important work within shorter hours",
    businessImplication:
      "The business may need set windows for when meetings can and can't happen, and a way to batch reactive requests instead of handling them as they arrive.",
    personalNote:
      "Interruptions at home, such as deliveries, household needs, and noise, can break focus just as much as business interruptions. Protecting focus time may involve both your calendar and your environment.",
    startingPoint: {
      start: "Consider choosing one recurring block each day that stays meeting-free and noting what usually interrupts it.",
      grow: "Consider setting team meeting windows and moving status updates to written check-ins.",
      scale: "Consider establishing organization-wide meeting standards that protect leadership focus time.",
    },
  },
  {
    id: "founder-load",
    title: "Founder dependency, delegation, and decision ownership",
    business: ["founder-dependency", "delegation", "decision-ownership", "team-capacity", "workload", "escalation"],
    personal: ["no-support", "household-mental-load", "entrepreneurial-loneliness"],
    intentionGroups: ["time-freedom", "financial"],
    alignmentIds: ["contain-work", "honor-boundaries"],
    protects: "a business that can keep moving without needing you for everything",
    businessImplication:
      "The business may need clearer ownership of decisions and tasks, a defined way to escalate issues, and a realistic look at whether the current workload fits the hours you want to work.",
    personalNote:
      "Carrying most of the responsibility at work and at home, often without adequate support, adds up. Delegating business work may relieve part of that load, but it may not address the support you need at home.",
    startingPoint: {
      start: "Consider listing the tasks only you currently do and marking one that could be documented or handed off.",
      grow: "Consider naming an owner for one category of decisions that currently routes through you.",
      scale: "Consider defining an escalation path so issues are resolved at the right level without reaching you.",
    },
  },
  {
    id: "workflows",
    title: "Basic workflows, systems, and appropriate AI support",
    business: ["workflows", "systems", "automation", "ai", "technology"],
    personal: ["tasks-unfinished"],
    intentionGroups: ["time-freedom"],
    alignmentIds: ["redesign-workweek"],
    protects: "work that runs the same way every time without depending on your memory and effort",
    businessImplication:
      "The business may need a few documented, repeatable workflows, and possibly automation or AI support for work that follows the same steps each time.",
    personalNote:
      "When work depends on memory, it tends to stay on your mind after hours. Writing down the steps can reduce how much you carry mentally.",
    startingPoint: {
      start: "Consider documenting the steps of the one workflow you repeat most often.",
      grow: "Consider choosing one repeatable process to standardize and testing whether automation or AI support could carry part of it.",
      scale: "Consider reviewing where AI and automation are already used and setting standards for how they carry work.",
    },
  },
  {
    id: "health",
    title: "Health appointments, routines, and recovery",
    business: [],
    personal: ["appointments-postponed", "health-competes", "routines-displaced"],
    auditPattern: /physical|sleep|nutrition|health|fitness|rest|movement|exercise/i,
    intentionGroups: ["health-rest"],
    alignmentIds: ["protect-body", "protect-nourishment"],
    protects: "time for appointments, meals, movement, sleep, and recovery",
    businessImplication:
      "The business calendar may need to treat health appointments and recovery time as fixed commitments instead of the first things to move.",
    personalNote:
      "This is about time and scheduling, not a medical assessment. If health needs are being postponed, consider treating those appointments as non-negotiable and talking with a qualified professional about any health concerns.",
    startingPoint: {
      start: "Consider scheduling one postponed appointment or routine into next week's calendar before business commitments fill it.",
      grow: "Consider blocking recurring time for meals and movement and letting the team know it's protected.",
      scale: "Consider setting a personal standard that health commitments aren't rescheduled for routine business requests.",
    },
  },
  {
    id: "family",
    title: "Family and caregiving responsibilities",
    business: [],
    personal: ["childcare", "elder-care", "assumed-available", "family-interrupts"],
    auditPattern: /family|parent/i,
    intentionGroups: ["relationships"],
    alignmentIds: ["let-life-have-space"],
    protects: "the time and attention your family and caregiving responsibilities require",
    businessImplication:
      "The business may need working hours and meeting windows designed around caregiving commitments rather than the other way around.",
    personalNote:
      "Caregiving responsibilities are real constraints, not scheduling problems to optimize away. A business change alone may not resolve them, and they may call for conversations about support at home.",
    startingPoint: {
      start: "Consider mapping this week's fixed caregiving commitments first, then placing work around them.",
      grow: "Consider sharing your caregiving-protected hours with the team so coverage is planned in advance.",
      scale: "Consider making caregiving-protected time part of how your leadership calendar is designed.",
    },
  },
  {
    id: "connection",
    title: "Connection, relationships, and entrepreneurial isolation",
    business: [],
    personal: [
      "relationships-interrupted",
      "friendships-postponed",
      "entrepreneurial-isolation",
      "entrepreneurial-loneliness",
      "wfh-limits-interaction",
      "limited-community",
    ],
    auditPattern: /relationship|social|romance|friend|community|connection|love/i,
    intentionGroups: ["relationships", "community", "play-travel"],
    alignmentIds: ["let-life-have-space"],
    protects: "relationships, friendships, community, and connection with people who understand what you're building",
    businessImplication:
      "The business may need defined end-of-day and weekend boundaries so relationship time isn't the first thing displaced.",
    personalNote:
      "Entrepreneurial isolation and loneliness are common when you work from home and carry decisions alone. Connection usually needs to be scheduled on purpose. It is not something a process change produces on its own.",
    startingPoint: {
      start: "Consider scheduling one conversation this week with someone who understands what it's like to build a business.",
      grow: "Consider protecting one recurring evening or weekend block for relationships and treating it as fixed.",
      scale: "Consider building a peer or advisory circle so business decisions aren't carried alone.",
    },
  },
  {
    id: "home",
    title: "Household load and the work-from-home environment",
    business: [],
    personal: ["household-chores", "household-into-workday", "household-mental-load", "always-productive", "guilt", "no-separation", "workspace-limits"],
    auditPattern: /environment|home/i,
    intentionGroups: ["home-self"],
    alignmentIds: ["end-workday", "disconnect"],
    protects: "a home that supports both focused work and real rest",
    businessImplication:
      "The business day may need a clear start and end so household tasks and business tasks stop competing for the same hours.",
    personalNote:
      "Feeling like you should always be productive at home, or guilty whichever way you choose, is part of the load. Household responsibilities may need their own plan or support, separate from business changes.",
    startingPoint: {
      start: "Consider defining where and when the workday happens at home, and one household task that won't intrude on it.",
      grow: "Consider whether household support could free time the business currently can't protect.",
      scale: "Consider whether your workspace setup still supports the way you now lead the business.",
    },
  },
]

const MAX_CONSIDERATIONS = 4

function listLabels(labels: string[]): string {
  if (labels.length <= 1) return labels[0] ?? ""
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`
}

export function buildStartConsiderations(input: ConsiderationInputs): StartConsideration[] {
  const stage = input.stage ?? "start"

  const scored = THEMES.map((theme) => {
    const business = theme.business
      .filter((id) => input.requirements.includes(id))
      .map((id) => requirementById(id)?.label ?? id)
    const personal = theme.personal
      .filter((id) => input.personalReality.includes(id))
      .map((id) => personalRealityById(id)?.label ?? id)
    const lowAreas = theme.auditPattern
      ? input.baselineAreas.filter((a) => a.isCandidate && theme.auditPattern!.test(`${a.key} ${a.label}`))
      : []
    const priorityAreas = lowAreas.filter((a) => input.priorityFocusAreas.includes(a.key))
    const intentionItems = theme.intentionGroups.flatMap((g) => input.intentionChoices[g] ?? [])
    const unsureAlignment = theme.alignmentIds.filter((id) => input.alignment[id] === "unsure")
    const willingAlignment = theme.alignmentIds.filter((id) => input.alignment[id] === "willing")

    const directSignals = business.length + personal.length + lowAreas.length
    const score = directSignals === 0 ? 0 : directSignals + priorityAreas.length * 2 + (intentionItems.length > 0 ? 1 : 0)
    return { theme, business, personal, lowAreas, priorityAreas, intentionItems, unsureAlignment, willingAlignment, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONSIDERATIONS)
    .map(({ theme, business, personal, lowAreas, priorityAreas, intentionItems, willingAlignment, unsureAlignment }) => {
      const evidence: ConsiderationEvidence[] = []
      if (business.length) evidence.push({ source: "provided", text: `Business Reality™: you selected ${listLabels(business)}.` })
      if (personal.length) evidence.push({ source: "provided", text: `Personal & Work-From-Home Reality™: ${listLabels(personal.map((p) => `"${p}"`))}.` })
      lowAreas.forEach((a) =>
        evidence.push({
          source: "audit",
          text: `${a.label} scored ${a.score} on your 30-Day Audit${priorityAreas.includes(a) ? " and is one of your Priority Focus Areas™" : ""}.`,
        }),
      )
      if (intentionItems.length)
        evidence.push({ source: "provided", text: `Original Entrepreneurial Intention™: ${listLabels(intentionItems.slice(0, 3))}.` })
      if (willingAlignment.length)
        evidence.push({ source: "provided", text: "In Work-Life Balance Alignment™ you said you're willing to operate differently here." })
      if (unsureAlignment.length)
        evidence.push({ source: "provided", text: "In Work-Life Balance Alignment™ you said you're not sure yet about changing this." })

      const findingParts: string[] = []
      if (business.length) findingParts.push(`your business operating environment includes ${listLabels(business).toLowerCase()}`)
      if (personal.length) findingParts.push(`you identified ${personal.length} related personal or work-from-home circumstance${personal.length > 1 ? "s" : ""}`)
      if (lowAreas.length) findingParts.push(`${listLabels(lowAreas.map((a) => a.label))} scored in the attention range`)
      const finding = `Your diagnostic suggests this may need attention: ${listLabels(findingParts)}.`

      const intentionClause = intentionItems.length
        ? ` You said you built your business to make possible ${listLabels(intentionItems.slice(0, 2).map((i) => i.toLowerCase()))}, and this area may be standing between you and that.`
        : ""
      const whyItMatters = `When this goes unaddressed, it can crowd out ${theme.protects}.${intentionClause}`

      return {
        id: theme.id,
        title: theme.title,
        finding,
        whyItMatters,
        evidence,
        businessImplications: business.length || theme.business.length === 0 ? theme.businessImplication : undefined,
        personalConsiderations: personal.length || lowAreas.length ? theme.personalNote : undefined,
        startingPoint: theme.startingPoint[stage],
      }
    })
}
