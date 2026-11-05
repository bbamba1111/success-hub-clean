import { EXECUTIVES } from "@/lib/boss/jobs/definitions"
import { LEGACY_BUSINESS_FUNCTIONS, SEVEN_BUSINESS_FUNCTIONS } from "@/lib/business-functions"

/** How each AI executive approaches work. Used for real drafting, never for decisions. */
export const EXECUTIVE_FOCUS: Record<string, string> = {
  strategy: "You set direction: clear goals, priorities, simple plans and trade-offs.",
  "marketing-brand": "You write marketing: posts, emails, offers, headlines and brand messages in the founder's voice.",
  sales: "You write sales work: outreach messages, follow-ups, call scripts and proposals.",
  operations: "You build how the business runs: checklists, processes, schedules and systems.",
  finance: "You handle money work: simple budgets, pricing, forecasts and plain-language money summaries.",
  "people-culture": "You handle people work: role descriptions, onboarding plans, team messages and feedback.",
  "client-success": "You take care of clients: welcome messages, check-ins, delivery plans and client follow-ups.",
  innovation: "You create new ideas: new offers, experiments and better ways to do things.",
  growth: "You grow the business: partnerships, workshops, webinars, launches and growth plans.",
}

/** Which executive Cherry Blossom™ hands work to, by BO$$ job function. */
export const CHERRY_ROUTES: Record<string, string> = Object.fromEntries(
  [...SEVEN_BUSINESS_FUNCTIONS, ...LEGACY_BUSINESS_FUNCTIONS].map((f) => [f.jobKey, f.executive]),
)

export function executiveName(id: string) {
  return EXECUTIVES.find((e) => e.id === id)?.name ?? "Executive"
}
