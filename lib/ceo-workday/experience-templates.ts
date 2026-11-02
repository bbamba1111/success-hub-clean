import type { ExperienceOptionKey, ExperienceReadinessKey } from "./experience-options"

export type ExperienceTemplateKey = "monday-redesigned" | "reality-check" | "weekly-workshop" | "masterclass"

export interface ExperienceTemplate {
  key: ExperienceTemplateKey
  name: string
  role: string
  defaultDurationMinutes: number
  durationRangeMinutes: [number, number]
  /** Default conversion destination. `null` means the founder names one. */
  destination: string | null
  destinationConfigurable: boolean
  defaultCadence: "weekly" | "one-off"
  /** Proposed day offsets relative to the delivery date (founder still places each one). */
  setupOffsets: Partial<Record<ExperienceOptionKey, number>>
  occurrenceOffsets: Partial<Record<ExperienceOptionKey, number>>
  readiness: Record<ExperienceReadinessKey, "required" | "optional">
}

export const BUSINESS_WEEK_DESTINATION = "The Work-Life Balance Business Week™"

const SETUP_OFFSETS: ExperienceTemplate["setupOffsets"] = {
  "exp.strategy": -10,
  "exp.develop": -9,
  "exp.produce": -8,
  "exp.register": -7,
}

const OCCURRENCE_OFFSETS: ExperienceTemplate["occurrenceOffsets"] = {
  "exp.promote": -4,
  "exp.deliver": 0,
  "exp.followup": 0,
  "exp.convert": 1,
  "exp.optimize": 1,
}

const READINESS: ExperienceTemplate["readiness"] = {
  "has-delivery-platform": "required",
  "has-next-offer": "required",
  "has-registration-tool": "optional",
  "has-email-list": "optional",
}

export const EXPERIENCE_TEMPLATES: Record<ExperienceTemplateKey, ExperienceTemplate> = {
  "monday-redesigned": {
    key: "monday-redesigned",
    name: "Monday Redesigned™",
    role: "A recurring weekly trust-building experience that shows a different way to run a business and invites participants into The Work-Life Balance Business Week™.",
    defaultDurationMinutes: 60,
    durationRangeMinutes: [60, 60],
    destination: BUSINESS_WEEK_DESTINATION,
    destinationConfigurable: false,
    defaultCadence: "weekly",
    setupOffsets: SETUP_OFFSETS,
    occurrenceOffsets: OCCURRENCE_OFFSETS,
    readiness: READINESS,
  },
  "reality-check": {
    key: "reality-check",
    name: "Reality Check™ (live)",
    role: "A diagnostic experience that helps founders see what's happening in their current operations and why another approach may be needed.",
    defaultDurationMinutes: 60,
    durationRangeMinutes: [60, 90],
    destination: "Monday Redesigned™",
    destinationConfigurable: true,
    defaultCadence: "one-off",
    setupOffsets: SETUP_OFFSETS,
    occurrenceOffsets: OCCURRENCE_OFFSETS,
    readiness: READINESS,
  },
  "weekly-workshop": {
    key: "weekly-workshop",
    name: "Weekly workshop / webinar",
    role: "A reusable format for ongoing education, trust-building and audience development.",
    defaultDurationMinutes: 60,
    durationRangeMinutes: [45, 90],
    destination: null,
    destinationConfigurable: true,
    defaultCadence: "weekly",
    setupOffsets: SETUP_OFFSETS,
    occurrenceOffsets: OCCURRENCE_OFFSETS,
    readiness: READINESS,
  },
  masterclass: {
    key: "masterclass",
    name: "Masterclass",
    role: "A deeper educational experience with a defined learning outcome and a fitting next offer.",
    defaultDurationMinutes: 90,
    durationRangeMinutes: [90, 120],
    destination: null,
    destinationConfigurable: true,
    defaultCadence: "one-off",
    setupOffsets: SETUP_OFFSETS,
    occurrenceOffsets: OCCURRENCE_OFFSETS,
    readiness: READINESS,
  },
}

export function isExperienceTemplateKey(v: string): v is ExperienceTemplateKey {
  return v in EXPERIENCE_TEMPLATES
}

export type ReadinessAnswer = "have" | "missing" | "not_needed"
export type DerivedReadiness = "available" | "missing-required" | "missing-optional" | "unknown"

export const READINESS_ALTERNATIVES: Record<ExperienceReadinessKey, string> = {
  "has-delivery-platform": "Create a free video-meeting link yourself and paste it into the occurrence.",
  "has-next-offer": "Name the next offer you'll invite attendees into.",
  "has-registration-tool": "Use \"reply to register\", a calendar invite or a direct-message sign-up list.",
  "has-email-list": "Use personal invitations, partner shares, and community or social posts.",
}

export function deriveReadiness(
  template: ExperienceTemplate,
  key: ExperienceReadinessKey,
  answer: ReadinessAnswer | undefined,
  hasConversionOffer: boolean,
): DerivedReadiness {
  // Monday Redesigned™ always has a next offer: Business Week™.
  if (key === "has-next-offer" && (!template.destinationConfigurable || hasConversionOffer)) return "available"
  if (answer === "have") return "available"
  if (answer === undefined) return "unknown"
  if (template.readiness[key] === "required" && answer === "missing") return "missing-required"
  return "missing-optional"
}

/** Next date (YYYY-MM-DD, on or after `fromISO`) that falls on `weekday` (0 = Sunday). */
export function nextWeekdayOnOrAfter(fromISO: string, weekday: number): string {
  const d = new Date(`${fromISO}T12:00:00Z`)
  const delta = (weekday - d.getUTCDay() + 7) % 7
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

export function addDaysISO(dateISO: string, days: number): string {
  const d = new Date(`${dateISO}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}
