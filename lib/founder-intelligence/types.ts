/**
 * Founder Intelligence Engine™ — shared type surface.
 *
 * The engine assembles ONE structured context object from every system the
 * platform already owns (Operating Engine, membership access, Reality Check™,
 * Business Foundation™, progressive memory), then derives every Command Center
 * card from it. Both "Today's Next Best Step™" and the "Cherry Blossom
 * Executive Brief™" consume the same context so they can never contradict each
 * other.
 *
 * Design rule: Cherry Blossom NEVER invents a recommendation. Every derived
 * card carries a `traceableTo` list naming the member data that justifies it.
 * If a recommendation cannot be justified by member data, it does not appear.
 */
import type { MemberExperience } from "@/operating-engine/types"
import type { AccessLevel, DayAccess } from "@/lib/membership/access"
import type { MembershipRecord } from "@/utils/membership-storage"
import type { OperatingCenterData } from "@/utils/reality-check-storage"
import type { BusinessFoundationRecord } from "@/utils/business-foundation-storage"

/** A single durable fact Cherry Blossom has learned (trimmed for the client). */
export interface MemorySummaryItem {
  type: string
  content: string
  /** ISO date for time-anchored memories (birthdays, anniversaries, trips). */
  date?: string | null
}

/**
 * The complete, structured context the engine reasons over. Everything is
 * optional-friendly: anonymous visitors still get a valid context with nulls,
 * so the Command Center always renders something warm and useful.
 */
export interface FounderIntelligenceContext {
  /** Live Operating Engine snapshot (day, time, current block, rhythm). */
  experience: MemberExperience
  /** Authorization layer — what the member can access. */
  accessLevel: AccessLevel
  /** Today's resolved day access (unlocked / locked / resting). */
  today: DayAccess
  /** Experience layer — what the member purchased (may be null / legacy). */
  membership: MembershipRecord | null
  /** Human Operating System™ inputs. */
  realityCheck: OperatingCenterData | null
  /** Business Operating System™ inputs. */
  foundation: BusinessFoundationRecord | null
  /** Progressive memory highlights (favorite activities, people, dates). */
  memories: MemorySummaryItem[]
  /** The member's first name when known. */
  firstName: string | null
}

/** "Today's Next Best Step™" — one recommendation, one reason, one button. */
export interface NextBestStep {
  /** Stable id for the rule that fired (useful for analytics / testing). */
  id: string
  /** The single highest-leverage action, e.g. "Enter CEO Workday™". */
  title: string
  /** One sentence explaining WHY this is the next step. */
  reason: string
  /** The single call to action. */
  cta: { label: string; href: string }
  /** Optional estimated time, e.g. "10–15 minutes". */
  estimatedTime?: string
  /** The member data this recommendation is traceable to (never empty). */
  traceableTo: string[]
}

export type BriefCardKind = "focus" | "opportunity" | "risk" | "celebration" | "reminder" | "insight"

/** One card in the Cherry Blossom Executive Brief™ — one or two sentences max. */
export interface BriefCard {
  kind: BriefCardKind
  title: string
  body: string
  traceableTo: string[]
}

export interface ExecutiveBrief {
  greeting: string
  cards: BriefCard[]
}

/** Which face the Time Freedom Time™ card is showing right now. */
export type TimeFreedomPhase =
  | "before" // business day, before 5:00 PM — counting toward the transition
  | "living_evening" // business day, after 5:00 PM — living tonight's Time Freedom
  | "living_weekend" // Friday / Saturday — living the 3-day Time Freedom Weekend™
  | "sunday_design" // Sunday, Design Day™ ritual not yet complete
  | "sunday_after" // Sunday, Design Day™ done — enjoy the rest, preview Monday
  | "night" // Digital Detox hours — rest

/**
 * Time Freedom Time™ — the signature card that counts down to LIFE, not work.
 * It celebrates and reinforces the life the member is intentionally creating.
 */
export interface TimeFreedomTimeState {
  phase: TimeFreedomPhase
  emoji: string
  /** Large headline, e.g. "Today's Time Freedom Begins". */
  headline: string
  /** Supporting line beneath the headline. */
  subline: string
  /** "5:00 PM" when there's a defined transition, else null. */
  beginsAtLabel: string | null
  /** "7h 18m" remaining until the transition, else null. */
  remainingLabel: string | null
  /** Activities Cherry Blossom remembers the member planned (may be empty). */
  plannedActivities: string[]
  /** Gentle suggestions used when no planned activities are known. */
  suggestions: string[]
  /** The single call to action for this moment. */
  cta: { label: string; href: string }
}
