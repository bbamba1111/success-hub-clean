/**
 * Intention Builders — first-person declarations for the three weekly priorities.
 *
 * Rules (from the Decide & Design™ spec):
 *  - ALWAYS first person: I / me / my. Never "You are…", "Barbara is…", "The founder will…".
 *  - Several sentence patterns per priority; NEVER one hard-coded template.
 *  - Endings vary — no shared closing phrase across variants.
 *  - Concise, meaningful, not overly poetic. Editable by the founder.
 *
 * `variant` is stored so "Build a Different Intention" cycles deterministically
 * and the same record renders the same words every day of the week.
 */

import { LIFE_WINDOW_LABEL, type BoundaryAudience, type LifeWindow } from "./types"

type Pattern = (p: string) => string

/* ── Weekly Life Priority™ ─────────────────────────────────────────────────── */

const LIFE_PATTERNS: Pattern[] = [
  (p) => `I am a founder who makes room for what matters most to me. This week, I am protecting time for ${p} so I can be fully present for it.`,
  (p) => `I am choosing to make room for ${p} this week. My life is part of what I am building for.`,
  (p) => `I protect what matters to me. This week, that means making space for ${p}.`,
  (p) => `I am a founder who honors what matters outside my business. This week, I am making room for ${p}.`,
  (p) => `My business supports my life, not the other way around. This week, I am protecting time for ${p}.`,
  (p) => `This week, ${p} gets real, protected time on my calendar, and I am keeping that promise to myself.`,
  (p) => `I decide where my life expands. This week, I am giving ${p} the space it deserves.`,
]

/* ── Weekly Delegation Priority™ ───────────────────────────────────────────── */

const DELEGATION_PATTERNS: Pattern[] = [
  (p) => `I am a founder who does not need to carry work that someone else can own. This week, I am moving ${p} off my plate.`,
  (p) => `I lead by creating ownership, not by holding everything myself. This week, I am transferring responsibility for ${p}.`,
  (p) => `I am choosing to release ${p} so I can focus my attention where it creates the greatest value.`,
  (p) => `I trust my business to grow through shared ownership. This week, I am handing ${p} to the right person.`,
  (p) => `I do not have to be the one who does ${p}. This week, I am making sure someone else owns it.`,
  (p) => `This week, I am letting go of ${p}. My role is to lead the business, not to hold every piece of it.`,
  (p) => `I am building a business that runs on ownership. This week, ${p} finds a new owner.`,
]

/* ── Weekly Operating Rule Priority™ ───────────────────────────────────────── */

const RULE_PATTERNS: Pattern[] = [
  (p) => `I am a founder who protects the way I work. This week, I am establishing ${p} so my business can operate with greater clarity and less interruption.`,
  (p) => `I decide how my business operates. This week, I am putting ${p} in place to protect my time and energy.`,
  (p) => `I am creating a business that does not depend on constant access to me. This week, I am establishing ${p}.`,
  (p) => `This week, I am changing the conditions around my work by putting ${p} into practice.`,
  (p) => `I set the rules my business runs by. Starting this week: ${p}.`,
  (p) => `I am choosing ${p} this week because how work happens matters as much as what gets done.`,
  (p) => `One rule changes a whole week. This week, mine is ${p}.`,
]

function pick(patterns: Pattern[], variant: number, phrase: string): string {
  const i = ((variant % patterns.length) + patterns.length) % patterns.length
  return patterns[i](phrase)
}

/** Variant chosen from the phrase so different priorities start on different patterns. */
export function seedVariant(phrase: string): number {
  let h = 0
  for (const ch of phrase) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h % 7
}

export function buildLifeIntention(phrase: string, variant: number): string {
  return pick(LIFE_PATTERNS, variant, phrase)
}
export function buildDelegationIntention(phrase: string, variant: number): string {
  return pick(DELEGATION_PATTERNS, variant, phrase)
}
export function buildOperatingRuleIntention(phrase: string, variant: number): string {
  return pick(RULE_PATTERNS, variant, phrase)
}

export const INTENTION_VARIANT_COUNT = 7

/* ── Communicate My Boundary™ ──────────────────────────────────────────────── */

function describeWindows(windows: LifeWindow[]): string {
  if (windows.length === 0) return "protected time"
  const labels = windows.map((w) => {
    switch (w) {
      case "after-5":
        return "my evenings after 5 PM"
      case "friday":
        return "Friday"
      case "saturday":
        return "Saturday"
      case "sunday":
        return "Sunday"
      case "time-freedom":
        return "my Time Freedom™ window"
      default:
        return LIFE_WINDOW_LABEL[w]
    }
  })
  if (labels.length === 1) return labels[0]
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`
}

/**
 * A short, practical, editable draft. Tone shifts slightly by audience —
 * warmer for family/partner, clearer on availability for team/clients.
 */
export function buildBoundaryDraft(phrase: string, windows: LifeWindow[], audiences: BoundaryAudience[]): string {
  const when = describeWindows(windows)
  const personal = audiences.every((a) => a === "family" || a === "partner") && audiences.length > 0
  if (personal) {
    return `I am protecting ${when} for ${phrase} this week. I am setting work aside during that time so I can be fully present with you.`
  }
  const unavailable = windows.includes("after-5")
    ? "I will be unavailable after 5 PM"
    : `I will be unavailable during ${when}`
  return `I am protecting ${when} for ${phrase} this week. ${unavailable} except for a genuine emergency, and I will respond promptly when I am back.`
}
