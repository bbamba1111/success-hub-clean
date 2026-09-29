/**
 * Weekly Work-Life Balance Boundary Focus™ — the ONE boundary a founder
 * chooses to build into the business and live during the current week.
 *
 * The full delegation / operating-rule / stakeholder machinery does NOT live
 * here — that becomes the Boundary Builder™ in a later milestone. This module
 * only offers a small, guided set of boundary choices plus a recommendation
 * derived from the founder's most recent Reality Check™.
 */

import type { BoundaryReportData } from "@/lib/boundary-report/types"

export interface BoundaryOption {
  id: string
  label: string
  /** One-line rationale shown under the option. */
  helper: string
}

export const BOUNDARY_OPTIONS: BoundaryOption[] = [
  {
    id: "protect-evenings",
    label: "Protect My Evenings From Routine Business Activity",
    helper: "Business communication and routine work stop in the evening.",
  },
  {
    id: "end-comms-5",
    label: "End Business Communication At 5 PM",
    helper: "A clear daily stop time for messages, email, and requests.",
  },
  {
    id: "protect-mornings",
    label: "Protect My Mornings For Focused CEO Work",
    helper: "No meetings or interruptions during my protected CEO Workday™.",
  },
  {
    id: "one-day-off",
    label: "Protect One Full Day Off Each Week",
    helper: "One day that belongs to life, not the business.",
  },
  {
    id: "protect-weekends",
    label: "Protect My Weekends From Work",
    helper: "Weekends stay clear of routine business activity.",
  },
  {
    id: "meetings-windows",
    label: "Limit Meetings To Defined Windows",
    helper: "Meetings happen only inside set windows, protecting focus time.",
  },
]

export interface BoundaryRecommendation {
  option: BoundaryOption
  /** Plain-language context sentence explaining why this was recommended. */
  context: string
}

/**
 * Recommend one boundary using Reality Check data — priority focus areas,
 * business & workplace reality, and alignment. Never asserts certainty; it
 * offers a starting point the founder can accept or replace.
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

  // Prefer a boundary that matches the strongest signal in the Reality Check.
  if (/(evening|after hours|night|family|partner|relationship|dinner)/.test(hay)) {
    return {
      option: byId("protect-evenings"),
      context: `You identified ${lifeList} as important to you, and your Reality Check pointed to business activity spilling into your personal time. Protecting your evenings is a strong first boundary.`,
    }
  }
  if (/(sleep|rest|recovery|energy|health|movement)/.test(hay)) {
    return {
      option: byId("end-comms-5"),
      context: `Your Reality Check flagged rest, energy, or health as a focus area. Ending business communication at 5 PM gives your evenings and recovery a clear edge.`,
    }
  }
  if (/(weekend|saturday|sunday|friends|recreation|travel)/.test(hay)) {
    return {
      option: byId("protect-weekends"),
      context: `You want more room for ${lifeList}. Protecting your weekends from work is a clear way to make that space real this week.`,
    }
  }
  if (/(meeting|interrupt|focus|deep work|calendar)/.test(hay)) {
    return {
      option: byId("meetings-windows"),
      context: `Your Reality Check suggested interruptions and meetings compete with focused work. Limiting meetings to defined windows protects your CEO Workday™.`,
    }
  }

  // Sensible default.
  return {
    option: byId("protect-evenings"),
    context: `Based on your Reality Check and what you chose to make room for (${lifeList}), protecting your evenings from routine business activity is a strong first boundary.`,
  }
}
