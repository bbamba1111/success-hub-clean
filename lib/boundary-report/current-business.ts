/** Your Current Business™ — what the founder's business actually looks like today. */

import type { BusinessStage } from "@/lib/boundary-report/types"

export interface CurrentBusiness {
  stage: BusinessStage | null
  services: string
  deliveryModel: string | null
  deliveryDetail: string
  dependencies: string[]
  dependencyOther: string
  daysPerWeek: string | null
  hoursPerDay: string | null
  extendsBeyondHours: string | null
  scheduleChanges: string | null
  workloadDetail: string
  clientExpectations: string[]
  expectationOther: string
  systems: string[]
  /** Tool names keyed by selected system category. */
  toolNames: Record<string, string>
  challenge: string
  desiredChange: string
  updatedAt?: string
}

export const EMPTY_CURRENT_BUSINESS: CurrentBusiness = {
  stage: null,
  services: "",
  deliveryModel: null,
  deliveryDetail: "",
  dependencies: [],
  dependencyOther: "",
  daysPerWeek: null,
  hoursPerDay: null,
  extendsBeyondHours: null,
  scheduleChanges: null,
  workloadDetail: "",
  clientExpectations: [],
  expectationOther: "",
  systems: [],
  toolNames: {},
  challenge: "",
  desiredChange: "",
}

export const OTHER = "Other"
export const NONE_CURRENTLY = "None currently"

export const DELIVERY_OPTIONS = [
  "Primarily me",
  "Me and independent contractors",
  "Me and employees",
  "A combination of employees and contractors",
  "My team operates most of the business",
  OTHER,
]

export const DEPENDENCY_OPTIONS = [
  "Client communication and service delivery",
  "Sales and business development",
  "Scheduling and appointments",
  "Project decisions and approvals",
  "Team management and supervision",
  "Financial decisions and administration",
  "Marketing and content",
  "Daily operations and problem-solving",
  "AI tools, automation, or technology oversight",
  "Most business activities depend on me",
  OTHER,
]

export const DAYS_OPTIONS = ["1–2", "3", "4", "5", "6", "7"]
export const HOURS_OPTIONS = ["Under 4", "4–6", "6–8", "8–10", "More than 10"]
export const FREQUENCY_OPTIONS = ["Rarely", "Sometimes", "Often", "Almost always"]

export const EXPECTATION_OPTIONS = [
  "Immediate or rapid responses",
  "Availability outside normal work hours",
  "Scheduled appointments or meetings",
  "Fixed deadlines or turnaround times",
  "Ongoing access to me personally",
  "Frequent revisions, requests, or follow-ups",
  "Recurring service or delivery commitments",
  OTHER,
]

export const SYSTEM_OPTIONS = [
  "Scheduling and calendars",
  "Email and communication",
  "Project and task management",
  "Client relationship management",
  "Payments and financial administration",
  "Standard operating procedures or documentation",
  "AI assistants or AI agents",
  "Workflow automation",
  OTHER,
  NONE_CURRENTLY,
]

export const CURRENT_BUSINESS_QUESTIONS = [
  { id: "stage", title: "Business Stage", question: "Which stage best describes your business today?" },
  { id: "services", title: "Business Model", question: "What services or expertise does your business provide?" },
  { id: "delivery", title: "Who Performs the Work?", question: "Who is responsible for delivering the work in your business?" },
  {
    id: "dependency",
    title: "Founder Dependency",
    question: "What currently depends on you personally being available or making decisions?",
  },
  { id: "workload", title: "Workload and Operating Hours", question: "How does your business currently use your time?" },
  {
    id: "expectations",
    title: "Client and Service Expectations",
    question: "What do your clients or customers expect from you or your business?",
  },
  {
    id: "systems",
    title: "Systems and Tools",
    question: "What tools, systems, automation, or AI do you currently use to run your business?",
  },
  {
    id: "challenge",
    title: "Current Operating Challenge",
    question: "What is the biggest thing about the way your business currently operates that you want to change?",
  },
  {
    id: "desired",
    title: "Desired Business Change",
    question: "If you could change one thing about how your business operates, what would make the greatest difference to your life?",
  },
] as const

const filled = (s: string) => s.trim().length > 0

/** Whether the question at `index` has a valid answer. */
export function isCurrentBusinessQuestionComplete(index: number, v: CurrentBusiness): boolean {
  switch (index) {
    case 0:
      return v.stage !== null
    case 1:
      return v.services.trim().length >= 3
    case 2:
      return v.deliveryModel !== null && (v.deliveryModel !== OTHER || filled(v.deliveryDetail))
    case 3:
      return v.dependencies.length > 0 && (!v.dependencies.includes(OTHER) || filled(v.dependencyOther))
    case 4:
      return !!(v.daysPerWeek && v.hoursPerDay && v.extendsBeyondHours && v.scheduleChanges)
    case 5:
      return v.clientExpectations.length > 0 && (!v.clientExpectations.includes(OTHER) || filled(v.expectationOther))
    case 6:
      return v.systems.length > 0
    case 7:
      return filled(v.challenge)
    case 8:
      return filled(v.desiredChange)
    default:
      return false
  }
}

export function isCurrentBusinessComplete(v: CurrentBusiness): boolean {
  return CURRENT_BUSINESS_QUESTIONS.every((_, i) => isCurrentBusinessQuestionComplete(i, v))
}

/** Merge a stored (possibly older-shaped) record onto the empty defaults. */
export function normalizeCurrentBusiness(raw: unknown): CurrentBusiness | null {
  if (!raw || typeof raw !== "object") return null
  return { ...EMPTY_CURRENT_BUSINESS, ...(raw as Partial<CurrentBusiness>) }
}
