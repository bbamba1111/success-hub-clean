/**
 * The Seven Business Functions — the ONE shared definition for The BO$$.
 * ---------------------------------------------------------------------------
 * Jobs, team members, workday items, task assignment, reporting and every
 * related screen read from this file. Stored database values are NOT renamed:
 * each function lists the exact key each table already saves (`jobKey` for
 * boss_jobs / boss_team_members / boss_preauthorizations, `planKey` for
 * ceo_workday_plan_items), so existing records keep displaying correctly.
 *
 * Legacy values (Own Work, and the older workday work modes) stay readable
 * for history but are never offered for new work.
 */

export type StandardFunction = {
  /** 1–7, the order the founder sees. */
  number: number
  label: string
  short: string
  purpose: string
  /** Value stored in boss_jobs.business_function and team-member arrays. */
  jobKey: string
  /** Value stored in ceo_workday_plan_items.business_function. */
  planKey: string
  /** CEO Workday category id. */
  categoryId: string
  /** Executive Cherry Blossom™ routes this function's work to by default. */
  executive: string
}

export const SEVEN_BUSINESS_FUNCTIONS = [
  {
    number: 1,
    label: "Client Attraction",
    short: "Attraction",
    purpose: "Help the right people find you.",
    jobKey: "attraction",
    planKey: "client-attraction",
    categoryId: "CLIENT_ATTRACTION",
    executive: "marketing-brand",
  },
  {
    number: 2,
    label: "Sales & Conversion",
    short: "Sales",
    purpose: "Help people say yes and buy.",
    jobKey: "sales",
    planKey: "sales-conversion",
    categoryId: "SALES_CONVERSION",
    executive: "sales",
  },
  {
    number: 3,
    label: "Service or Product Delivery",
    short: "Delivery",
    purpose: "Give people what you promised.",
    jobKey: "delivery",
    planKey: "delivery",
    categoryId: "DELIVERY",
    executive: "client-success",
  },
  {
    number: 4,
    label: "Business Operations",
    short: "Operations",
    purpose: "Keep the business running each day.",
    jobKey: "operations",
    planKey: "operations",
    categoryId: "OPERATIONS",
    executive: "operations",
  },
  {
    number: 5,
    label: "Business Operations Design & Redesign",
    short: "Design & Redesign",
    purpose: "Make the way you work better.",
    jobKey: "design",
    planKey: "operations-design",
    categoryId: "OPERATIONS_DESIGN",
    executive: "operations",
  },
  {
    number: 6,
    label: "Programs, Events & Experiences",
    short: "Programs & Events",
    purpose: "Design, host and follow up on programs, events and live experiences.",
    jobKey: "experiences",
    planKey: "trust-experiences",
    categoryId: "TRUST_EXPERIENCES",
    executive: "growth",
  },
  {
    number: 7,
    label: "Thought Leadership & Intellectual Property",
    short: "Thought Leadership & IP",
    purpose: "Share your ideas and build the intellectual property you own.",
    jobKey: "thought_leadership",
    planKey: "thought-leadership",
    categoryId: "THOUGHT_LEADERSHIP",
    executive: "marketing-brand",
  },
] as const satisfies readonly StandardFunction[]

/** Earlier categories kept only so saved records still display. Never offered for new work. */
export const LEGACY_BUSINESS_FUNCTIONS = [
  {
    label: "Own Work",
    short: "Own Work",
    purpose: "Your projects and ideas, done your way.",
    jobKey: "own_work",
    planKey: "own-work",
    categoryId: "OWN_WORK",
    executive: "strategy",
  },
] as const

export type StandardJobKey = (typeof SEVEN_BUSINESS_FUNCTIONS)[number]["jobKey"]
export type LegacyJobKey = (typeof LEGACY_BUSINESS_FUNCTIONS)[number]["jobKey"]
export type StandardPlanKey = (typeof SEVEN_BUSINESS_FUNCTIONS)[number]["planKey"]
export type LegacyPlanKey = (typeof LEGACY_BUSINESS_FUNCTIONS)[number]["planKey"]

type AnyFunction = (typeof SEVEN_BUSINESS_FUNCTIONS)[number] | (typeof LEGACY_BUSINESS_FUNCTIONS)[number]
const ALL: readonly AnyFunction[] = [...SEVEN_BUSINESS_FUNCTIONS, ...LEGACY_BUSINESS_FUNCTIONS]

export function functionByJobKey(key: string | null | undefined): AnyFunction | undefined {
  return ALL.find((f) => f.jobKey === key)
}

export function functionByPlanKey(key: string | null | undefined): AnyFunction | undefined {
  return ALL.find((f) => f.planKey === key)
}

export function isStandardJobKey(key: unknown): key is StandardJobKey {
  return typeof key === "string" && SEVEN_BUSINESS_FUNCTIONS.some((f) => f.jobKey === key)
}

export function isKnownJobKey(key: unknown): key is StandardJobKey | LegacyJobKey {
  return typeof key === "string" && ALL.some((f) => f.jobKey === key)
}

export function isLegacyJobKey(key: unknown): key is LegacyJobKey {
  return typeof key === "string" && LEGACY_BUSINESS_FUNCTIONS.some((f) => f.jobKey === key)
}

export function jobKeyToPlanKey(key: string): string | undefined {
  return functionByJobKey(key)?.planKey
}

export function planKeyToJobKey(key: string): string | undefined {
  return functionByPlanKey(key)?.jobKey
}

/** Executive id Cherry Blossom™ routes work to, keyed by job key. */
export function routedExecutiveForJobKey(key: string): string | undefined {
  return functionByJobKey(key)?.executive
}
