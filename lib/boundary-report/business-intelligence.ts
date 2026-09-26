import type { BusinessStage } from "@/lib/boundary-report/types"

/**
 * Business Requirement Discovery — the adaptive inventory of things that may
 * need to be in place inside the business for a Life Boundary™ to hold. This is
 * diagnostic surfacing, NOT certainty: every item is framed as "may need
 * attention." Reuses the existing Time-Leak intelligence vocabulary.
 */
export interface RequirementOption {
  id: string
  label: string
  /** Short description of the boundary risk this addresses. */
  hint: string
}

export const REQUIREMENT_OPTIONS: RequirementOption[] = [
  { id: "founder-dependency", label: "Founder dependency", hint: "The business currently needs you personally to keep moving." },
  { id: "meetings", label: "Meetings", hint: "Meeting volume or timing crowds out protected time." },
  { id: "interruptions", label: "Interruptions", hint: "Work is reactive; focus gets broken throughout the day." },
  { id: "client-expectations", label: "Client expectations", hint: "Clients expect access that collides with your boundary." },
  { id: "availability", label: "Availability", hint: "There are no clear hours when you are off." },
  { id: "decision-ownership", label: "Decision ownership", hint: "Too many decisions still route through you." },
  { id: "delegation", label: "Delegation", hint: "Work that could be handed off still sits with you." },
  { id: "team-capacity", label: "Team capacity", hint: "There isn't enough capacity to protect the boundary." },
  { id: "workload", label: "Workload", hint: "The total load exceeds the hours you want to work." },
  { id: "deadlines", label: "Deadlines", hint: "Deadline pressure repeatedly overrides the boundary." },
  { id: "communication", label: "Communication", hint: "Expectations around response time aren't defined." },
  { id: "technology", label: "Technology & tools", hint: "Tooling gaps force manual, time-consuming work." },
  { id: "notifications", label: "Notifications", hint: "Always-on alerts keep you tethered to the business." },
  { id: "systems", label: "Systems", hint: "Missing systems mean work depends on memory and effort." },
  { id: "workflows", label: "Workflows", hint: "Undefined workflows create rework and delay." },
  { id: "automation", label: "Automation", hint: "Repeatable work isn't automated yet." },
  { id: "ai", label: "AI support", hint: "AI could carry work that currently consumes your time." },
  { id: "operating-hours", label: "Operating hours", hint: "The business has no defined operating hours." },
  { id: "escalation", label: "Escalation", hint: "There's no path for issues to be handled without you." },
]

export function requirementById(id: string): RequirementOption | undefined {
  return REQUIREMENT_OPTIONS.find((r) => r.id === id)
}

/** START → GROW → SCALE considerations. Only the founder's stage is shown. */
export const STAGE_CONSIDERATIONS: Record<BusinessStage, { title: string; considerations: string[] }> = {
  start: {
    title: "Start",
    considerations: [
      "Clear availability — the hours you are and aren't working",
      "Meeting boundaries — when meetings can and can't happen",
      "Communication expectations — how fast you actually reply",
      "Basic workflows — the few repeatable steps that carry the work",
    ],
  },
  grow: {
    title: "Grow",
    considerations: [
      "Delegation — moving work off your plate",
      "Decision ownership — who decides what without you",
      "Team roles — clear responsibility for outcomes",
      "Repeatable processes — work that runs the same way every time",
      "Client boundaries — expectations set and held",
      "Automation & AI-supported workflows — capacity without more hours",
    ],
  },
  scale: {
    title: "Scale",
    considerations: [
      "Management systems — the business runs through structure, not you",
      "Organizational accountability — outcomes owned across the team",
      "Capacity planning — matching load to real capacity ahead of time",
      "Escalation frameworks — issues handled without reaching you",
      "Operating standards — a consistent way the business operates",
      "AI governance — where and how AI carries the work",
    ],
  },
}

export const STAGE_LABELS: Record<BusinessStage, string> = {
  start: "Start",
  grow: "Grow",
  scale: "Scale",
}
