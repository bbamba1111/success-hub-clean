/**
 * Monthly Business Boundary Focus™ — the ONE business boundary a founder
 * chooses to build a Business Operating Rule™ around this cycle.
 *
 * Each option is an operational rule (not a lifestyle reminder) with the
 * collision tags that describe what most often breaks it.
 */

import type { BoundaryReportData } from "@/lib/boundary-report/types"

export interface BoundaryOption {
  id: string
  label: string
  /** The rule description shown under the option. */
  helper: string
  category: string
  collisionTags: string[]
}

export interface BoundaryCategory {
  label: string
  options: BoundaryOption[]
}

function opt(category: string, id: string, label: string, helper: string, collisionTags: string[]): BoundaryOption {
  return { id, label, helper, category, collisionTags }
}

export const BOUNDARY_CATEGORIES: BoundaryCategory[] = [
  {
    label: "Flex Time™",
    options: [
      opt("Flex Time™", "work-after-flex", "Work Starts After Flex Time™.", "Nothing is scheduled, promised, or expected of me before my workday begins.", ["Availability", "Client expectations", "Operating hours"]),
      opt("Flex Time™", "quiet-mornings", "Mornings Stay Quiet.", "Alerts, automations, and routine messages wait until work hours.", ["Notifications", "Interruptions"]),
    ],
  },
  {
    label: "Decide & Design™",
    options: [
      opt("Decide & Design™", "decide-design-workday", "Decide & Design My Workday.", "I set my priorities and design my workday before I accept new requests.", ["Workload", "Deadlines", "Decision ownership"]),
    ],
  },
  {
    label: "Morning GIV•EN™ Routine",
    options: [
      opt("Morning GIV•EN™ Routine", "routine-first", "Nothing Reaches Me Before My Routine.", "Requests wait until my morning routine is done.", ["Interruptions", "Notifications", "Founder dependency"]),
    ],
  },
  {
    label: "Workout & Movement Window™",
    options: [
      opt("Workout & Movement Window™", "movement-window", "No Meetings or Deadlines in My Movement Window.", "When work overruns, the work moves and the movement stays.", ["Meetings", "Deadlines"]),
    ],
  },
  {
    label: "Extended Healthy Hybrid Lunch Break™",
    options: [
      opt("Extended Healthy Hybrid Lunch Break™", "lunch-not-meeting", "Lunch Is Not a Meeting Slot.", "No calls or routine meetings, and routine requests wait.", ["Meetings", "Client expectations", "Communication"]),
    ],
  },
  {
    label: "4-Hour Focused CEO Workday™",
    options: [
      opt("4-Hour Focused CEO Workday™", "work-fits-four", "Work Fits the Four Hours.", "A new request means deciding what moves, gets delegated, or waits.", ["Workload", "Deadlines", "Delegation"]),
      opt("4-Hour Focused CEO Workday™", "no-interruptions", "No Interruptions During My Focused Workday.", "Interruptions wait for set check-in points, and true emergencies follow a defined path.", ["Interruptions", "Notifications", "Availability"]),
      opt("4-Hour Focused CEO Workday™", "meetings-windows", "Meetings Live in Defined Windows.", "Meetings stay away from focused work.", ["Meetings", "Interruptions"]),
      opt("4-Hour Focused CEO Workday™", "clear-ownership", "Decisions and Ownership Are Clear.", "Work doesn't default back to one person, and I know what I own.", ["Founder dependency", "Decision ownership", "Delegation", "Team capacity"]),
      opt("4-Hour Focused CEO Workday™", "ai-augmentation-hour", "AI Augmentation Hour Decides Where Capacity Goes.", "I use an AI Augmentation Hour inside my four hours to decide how AI augments my work and where the freed time goes before I take on new work.", ["AI support", "Automation", "Workload"]),
    ],
  },
  {
    label: "Time Freedom™",
    options: [
      opt("Time Freedom™", "closing-time", "A Defined Closing Time.", "At 5 PM, work, routine messages, email, and requests stop until the next work period.", ["Availability", "Operating hours", "Communication"]),
      opt("Time Freedom™", "promises-respect-calendar", "Promises Respect My Calendar.", "Client and team deadlines are designed around closed hours and days.", ["Client expectations", "Deadlines"]),
      opt("Time Freedom™", "three-day-weekend", "My Three-Day Weekend Is Protected.", "From Thursday at 5 PM through Sunday, routine work doesn't happen, and exceptions are defined.", ["Operating hours", "Escalation"]),
    ],
  },
  {
    label: "Power Down™",
    options: [
      opt("Power Down™", "no-late-night", "No Late-Night Messages or Assignments.", "Routine items queue for the next work period.", ["Notifications", "Communication"]),
    ],
  },
  {
    label: "Unplug™",
    options: [
      opt("Unplug™", "not-overnight-monitor", "I'm Not the Overnight Monitor.", "No routine work or alerts overnight, and true emergencies follow a documented path.", ["Escalation", "Notifications", "Founder dependency"]),
      opt("Unplug™", "overnight-automation-limits", "Automation Stays Within Approved Limits Overnight.", "Anything running overnight, including AI, has approved tasks and limits.", ["AI support", "Automation", "Systems"]),
    ],
  },
  {
    label: "Working From Home & Personal Life",
    options: [
      opt("Working From Home & Personal Life", "household-knows-hours", "Family & Household Know My Work Hours.", "Partners, children, and housemates know when I'm working, what counts as urgent, and what can wait.", ["Family interruptions"]),
      opt("Working From Home & Personal Life", "caregiving-plan", "Caregiving Has a Plan.", "Caring for children, parents, or others has defined coverage and check-in times, and urgent needs have a clear path.", ["Caregiving demands"]),
      opt("Working From Home & Personal Life", "friends-wait", "Friends Wait Until My Breaks.", "Calls and texts from friends get answered at breaks or after work.", ["Friends & social contact"]),
      opt("Working From Home & Personal Life", "household-windows", "Household Tasks & Errands Have Windows.", "Chores, deliveries, and personal appointments happen in set windows.", ["Household demands"]),
      opt("Working From Home & Personal Life", "workspace-ritual", "My Work Has a Place and a Closing Ritual.", "A defined workspace, a way to start the day, and a way to close it.", ["Workspace"]),
      opt("Working From Home & Personal Life", "real-connection", "My Week Includes Real Connection.", "Scheduled time with other people, such as co-working, peers, colleagues, or friends.", ["Isolation & loneliness"]),
    ],
  },
]

export const BOUNDARY_OPTIONS: BoundaryOption[] = BOUNDARY_CATEGORIES.flatMap((c) => c.options)

const TEAM_TAGS = new Set([
  "Client expectations",
  "Deadlines",
  "Team capacity",
  "Delegation",
  "Decision ownership",
  "Availability",
  "Meetings",
  "Escalation",
  "Founder dependency",
])

/** True when the rule affects clients, teammates, deadlines, or shared schedules. */
export function boundaryAffectsOthers(tags: string[]): boolean {
  return tags.some((t) => TEAM_TAGS.has(t))
}

export interface BoundaryRecommendation {
  option: BoundaryOption
  /** Plain-language context sentence explaining why this was recommended. */
  context: string
}

/**
 * Recommend one boundary using Reality Check data. Never asserts certainty;
 * it offers a starting point the founder can accept or replace.
 */
export function recommendBoundary(
  report: BoundaryReportData | null,
  selectedLifeLabels: string[],
): BoundaryRecommendation | null {
  if (!report) return null

  const focus = (report.priorityAreas ?? []).map((a) => a.label.toLowerCase()).join(" ")
  const requirements = (report.businessRequirements ?? []).map((r) => r.label.toLowerCase()).join(" ")
  const life = selectedLifeLabels.map((l) => l.toLowerCase()).join(" ")
  const hay = `${focus} ${requirements} ${life}`

  const byId = (id: string) => BOUNDARY_OPTIONS.find((o) => o.id === id)!

  const lifeList = selectedLifeLabels.length
    ? selectedLifeLabels.slice(0, 3).join(", ")
    : "the parts of life that matter most to you"

  if (/(evening|after hours|family|partner|relationship|dinner)/.test(hay)) {
    return {
      option: byId("closing-time"),
      context: `You identified ${lifeList} as important to you, and your Reality Check pointed to business activity spilling into your personal time. A defined closing time is a strong first boundary.`,
    }
  }
  if (/(sleep|rest|recovery|night)/.test(hay)) {
    return {
      option: byId("no-late-night"),
      context: `Your Reality Check flagged rest or recovery as a focus area. Stopping late-night messages and assignments protects your evenings and sleep.`,
    }
  }
  if (/(health|movement|exercise|physical)/.test(hay)) {
    return {
      option: byId("movement-window"),
      context: `Your Reality Check flagged health or movement as a focus area. Protecting your Movement Window™ from meetings and deadlines makes that time real.`,
    }
  }
  if (/(weekend|saturday|sunday|friends|recreation|travel)/.test(hay)) {
    return {
      option: byId("three-day-weekend"),
      context: `You want more room for ${lifeList}. Protecting your three-day weekend is a clear way to make that space real.`,
    }
  }
  if (/(meeting|interrupt|focus|deep work|calendar)/.test(hay)) {
    return {
      option: byId("meetings-windows"),
      context: `Your Reality Check suggested interruptions and meetings compete with focused work. Keeping meetings in defined windows protects your CEO Workday.`,
    }
  }

  return {
    option: byId("closing-time"),
    context: `Based on your Reality Check and what you chose to make room for (${lifeList}), a defined closing time is a strong first boundary.`,
  }
}
