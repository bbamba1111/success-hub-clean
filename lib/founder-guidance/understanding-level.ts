/**
 * Founder Understanding Level™ (Phase 12)
 * ---------------------------------------------------------------------------
 * Business Comprehension™ (`lib/business-comprehension/`) is already a
 * 5-level, session-backed, "adapt the explanation, never the principle"
 * communication preference. Founder Understanding Level™ is the SAME
 * preference, renamed for the Business-Building Guidance™ surface — it is a
 * thin alias, NOT a second storage key, NOT a second preference system.
 *
 * The Understanding Level Rule: this module has zero imports from Founder
 * GPS™, the Executive Decision Engine™, or Build Strategy™ — it cannot
 * influence a recommendation, even by accident. It only changes how existing
 * guidance is explained.
 */

import {
  ALL_COMMUNICATION_STYLES,
  COMMUNICATION_STYLES,
  DEFAULT_COMMUNICATION_STYLE,
  getCommunicationStyle as getStyleDefinition,
  type CommunicationStyle,
} from "@/lib/business-comprehension/business-comprehension"
import {
  BUSINESS_COMPREHENSION_EVENT,
  getCommunicationStyle,
  setCommunicationStyle,
} from "@/lib/business-comprehension/business-comprehension-store"

/** The five Founder Understanding Level™ ids — a display renaming of `CommunicationStyle`, not a new vocabulary. */
export type UnderstandingLevelId = "simple" | "practical" | "founder" | "strategic" | "executive"

export const ALL_UNDERSTANDING_LEVELS: UnderstandingLevelId[] = ["simple", "practical", "founder", "strategic", "executive"]

/** Bidirectional map — `simple↔foundation`, `practical↔small_business`, `founder↔business_owner`, `strategic↔executive`, `executive↔boardroom`. */
const LEVEL_TO_STYLE: Record<UnderstandingLevelId, CommunicationStyle> = {
  simple: "foundation",
  practical: "small_business",
  founder: "business_owner",
  strategic: "executive",
  executive: "boardroom",
}

const STYLE_TO_LEVEL: Record<CommunicationStyle, UnderstandingLevelId> = {
  foundation: "simple",
  small_business: "practical",
  business_owner: "founder",
  executive: "strategic",
  boardroom: "executive",
}

export function levelToCommunicationStyle(level: UnderstandingLevelId): CommunicationStyle {
  return LEVEL_TO_STYLE[level]
}

export function communicationStyleToLevel(style: CommunicationStyle): UnderstandingLevelId {
  return STYLE_TO_LEVEL[style]
}

export interface UnderstandingLevelDefinition {
  id: UnderstandingLevelId
  /** Brand name, matching the underlying Communication Style™'s name. */
  name: string
  tagline: string
  description: string
  /** Plain guidance on who tends to reach for this level — display only, never a gate. */
  useWhen: string
}

/** UNDERSTANDING_LEVEL_DEFINITIONS — display-only copy, one per level, sourced from the underlying Communication Style™. */
export const UNDERSTANDING_LEVEL_DEFINITIONS: UnderstandingLevelDefinition[] = ALL_UNDERSTANDING_LEVELS.map((id) => {
  const style = getStyleDefinition(LEVEL_TO_STYLE[id])
  return {
    id,
    name: style.name,
    tagline: style.tagline,
    description: style.description,
    useWhen: `Choose this when you want guidance explained with: ${style.characteristics.join(", ").toLowerCase()}.`,
  }
})

/** The reassurance message for the Founder Understanding Level™ surface — mirrors `COMPREHENSION_REASSURANCE`. */
export const UNDERSTANDING_LEVEL_REASSURANCE =
  "This setting changes how Harmony Lane™ explains your Business-Building Guidance™. It does not measure your intelligence, education, or experience — and it never changes what's recommended, only how it's explained."

/** Re-exported so guidance components can listen for changes without importing Business Comprehension™ directly. */
export const UNDERSTANDING_LEVEL_EVENT = BUSINESS_COMPREHENSION_EVENT

/** Read the founder's current Understanding Level™ — a thin read of the existing Business Comprehension™ store. */
export function getUnderstandingLevel(): UnderstandingLevelId {
  return communicationStyleToLevel(getCommunicationStyle())
}

/** Persist the founder's Understanding Level™ choice — writes through to the SAME Business Comprehension™ store. */
export function setUnderstandingLevel(level: UnderstandingLevelId): void {
  setCommunicationStyle(levelToCommunicationStyle(level))
}

export function getUnderstandingLevelDefinition(level: UnderstandingLevelId): UnderstandingLevelDefinition {
  return UNDERSTANDING_LEVEL_DEFINITIONS.find((d) => d.id === level) ?? UNDERSTANDING_LEVEL_DEFINITIONS[2]
}

/** Type guard for a valid Understanding Level™ id. */
export function isUnderstandingLevel(value: unknown): value is UnderstandingLevelId {
  return typeof value === "string" && ALL_UNDERSTANDING_LEVELS.includes(value as UnderstandingLevelId)
}

// Re-exported only so callers don't need a second import for the underlying style list when building previews.
export { ALL_COMMUNICATION_STYLES, COMMUNICATION_STYLES, DEFAULT_COMMUNICATION_STYLE }
