/**
 * Make Time For More™ — Shared Operating Engine
 * ------------------------------------------------------------------
 * Pure, framework-free type definitions. No React, no Next.js, no DOM.
 * This module is the single source of truth for time-aware business
 * logic across the entire platform (Success Hub, Harmony Live,
 * Cherry Blossom AI, future apps). Each app renders what the engine
 * returns — it never re-implements scheduling or circadian logic.
 *
 * Structured so it can be lifted into `packages/operating-engine`
 * later with zero changes to the logic below.
 */

/** Identifier for each block of the Work-Life Balance Business Day™. */
export type BlockId =
  | "monday-flex"
  | "monday-reality-check"
  | "monday-debrief"
  | "early-access"
  | "morning-given"
  | "daily-planning-gps"
  | "movement-window"
  | "lunch-break"
  | "ceo-workday"
  | "time-freedom"
  | "power-down"
  | "digital-detox"

/** Coarse part-of-day used to group affirmations and coaching content. */
export type PartOfDay = "morning" | "ceo" | "evening"

/** Visual theme periods derived from local time. */
export type ThemePeriod = "morning" | "afternoon" | "evening" | "night"

/** Seasons (drive seasonal theming; spring = cherry blossom). */
export type Season = "spring" | "summer" | "fall" | "winter"

/** Hero/status badge state. */
export type SessionStatus = "LIVE" | "NEXT" | "NIGHT" | "OPEN"

/** Presentation state for a single timeline block. */
export type BlockState = "current" | "upcoming" | "completed"

/** Greeting period shown to the member. */
export type GreetingPeriod = "Morning" | "Afternoon" | "Evening" | "Night"

/** Live engagement style for a block. */
export type EngagementKind = "live-room" | "social" | "self-guided" | "closed"

/** Platform roles. `platform_admin` unlocks Developer Mode + 24/7 access. */
export type Role = "member" | "platform_admin"

/** Admin-only override of the live-session / community status (Developer Mode). */
export type LiveSessionOverride = "live" | "replay" | "closed" | "self-guided"

/**
 * Developer Mode override (admin only). Lets a Platform Administrator preview
 * any state of the Operating Environment without waiting for the real clock.
 * Time-travel reduces to a synthetic TimeContext, so every sub-engine runs
 * normally on the simulated moment. Ignored entirely for regular members.
 */
export interface EngineOverride {
  /** Preview a specific block; sets effective time to that block's midpoint. */
  blockId?: BlockId
  /** Simulate a specific minutes-since-midnight (alternative to blockId). */
  minutesSinceMidnight?: number
  /** Simulate a specific day of week (0 = Sunday … 6 = Saturday). */
  dayOfWeek?: number
  /** Override the season used by the Theme Engine. */
  season?: Season
  /** Override the live-session / community status. */
  liveSession?: LiveSessionOverride
  /** Simulated member preset (greeting, streak, installation week, etc.). */
  member?: MemberInput
}

/**
 * Access result — answers "should this user be locked out right now?".
 * Members are locked during Digital Detox (community closed). Platform admins
 * with Developer Mode enabled are never involuntarily locked out.
 */
export interface AccessState {
  role: Role
  isAdmin: boolean
  /** Admin + Developer Mode toggle enabled. */
  developerMode: boolean
  /** Whether a simulation override is currently applied. */
  overrideActive: boolean
  /** Whether the Community Closed lockout should be enforced for this user. */
  locked: boolean
}

/**
 * Static configuration for a single Work-Life Balance Business Day™ block.
 * Times are expressed in minutes-since-midnight in the platform timezone.
 */
export interface BlockConfig {
  id: BlockId
  /** DOM section id used by Success Hub for scroll/anchor targeting. */
  sectionId: string
  title: string
  /** Short label for compact UI (badges, nav). */
  shortTitle: string
  /** Human-readable time range, e.g. "9:00–10:30 AM". */
  timeLabel: string
  /** Inclusive start in minutes since midnight (platform tz). */
  startMinutes: number
  /** Exclusive end in minutes since midnight. May be < start when the block wraps midnight. */
  endMinutes: number
  /** Longer description rendered on the timeline card. */
  description: string
  emoji: string
  /** Space-separated RGB for the panel tint, e.g. "253 246 234". */
  tint: string
  /** Background image path served from /public. Pass an array (2+ paths) to
   *  slowly crossfade between them on the card (e.g. a laptop screen "changing"). */
  backgroundImage: string | string[]
  /** Primary CTA label. */
  cta: string
  /** External join/engagement link (optional). */
  href?: string
  /** Engagement style for this block. */
  engagement: EngagementKind
  /** Part-of-day grouping for content rotation. */
  part: PartOfDay
  greetingPeriod: GreetingPeriod
  greetingEmoji: string
  themePeriod: ThemePeriod
  /** Whether the community/hub is open during this block. */
  communityOpen: boolean
  /** Rotating motivational messages tied to this block. */
  messages: string[]
  /** If true, this block only appears on Mondays (dayOfWeek === 1). */
  mondayOnly?: boolean
  /**
   * If true, this block is hidden on Mondays (dayOfWeek === 1). Used for
   * the Tuesday–Thursday "Daily Planning + GPS™" block, which replaces
   * Monday's `monday-reality-check` in the same 9:45–10:30 AM slot.
   */
  excludeMonday?: boolean
  /** Override startMinutes used on Mondays (Make Time For More On Mondays™ resequences the morning). */
  mondayStartMinutes?: number
  /** Override endMinutes used on Mondays. */
  mondayEndMinutes?: number
  /** Override timeLabel shown on Mondays. */
  mondayTimeLabel?: string
  /** Override timeLabel shown on Fri/Sat/Sun (days 5, 6, 0). */
  weekendTimeLabel?: string
  /** Override startMinutes used on Fri/Sat/Sun. */
  weekendStartMinutes?: number
  /** Override timeLabel shown specifically on Sunday (closes one hour earlier than Fri/Sat). */
  sundayTimeLabel?: string
}

/** Output of the Time Engine. */
export interface TimeContext {
  /** The raw instant this snapshot was computed for. */
  now: Date
  /** Platform timezone (IANA), e.g. "America/New_York". */
  timeZone: string
  /** Local hour (0–23) in the platform timezone. */
  hour: number
  /** Local minute (0–59) in the platform timezone. */
  minute: number
  /** Minutes since midnight in the platform timezone. */
  minutesSinceMidnight: number
  /** 0 = Sunday … 6 = Saturday (platform timezone). */
  dayOfWeek: number
  dayName: string
  isWeekend: boolean
  /** 1–366, stable per calendar day; used for daily content rotation. */
  dayOfYear: number
  season: Season
}

/** Output of the Circadian Rhythm Engine. */
export interface CircadianPhase {
  block: BlockConfig
  part: PartOfDay
  greetingPeriod: GreetingPeriod
  greetingEmoji: string
  /** A message for this phase, stable for the day but rotating daily. */
  message: string
}

/** Output of the Business Day Engine. */
export interface BusinessDayState {
  current: BlockConfig
  previous: BlockConfig
  next: BlockConfig
  /** Minutes remaining until the next block starts. */
  minutesUntilNext: number
  countdownToNext: Countdown
  status: SessionStatus
  /** 0–100, how far through the open business day (7AM–11PM) we are. */
  progress: number
  /** Per-block presentation state for the full timeline. */
  timeline: TimelineEntry[]
}

/** A block paired with its computed presentation state for the timeline. */
export interface TimelineEntry {
  block: BlockConfig
  state: BlockState
}

/** Reusable countdown shape. */
export interface Countdown {
  totalMinutes: number
  hours: number
  minutes: number
  /** Pre-formatted "Xh Ym" / "Ym" label. */
  label: string
}

/** Output of the Theme Engine. */
export interface ThemeState {
  period: ThemePeriod
  season: Season
  /** Convenience label, e.g. "Morning · Spring". */
  label: string
  /** Background image to render for the current moment (current block image). */
  backgroundImage: string
  /** Panel tint (space-separated RGB) for the current moment. */
  tint: string
}

/** Output of the Live Session + Community Engine. */
export interface CommunityState {
  /** Whether the hub/community is open (7AM–11PM platform tz). */
  isOpen: boolean
  status: SessionStatus
  message: string
  /** Countdown to the next open/close transition. */
  countdown: Countdown
  /** The live room active right now, if any. */
  liveRoom: LiveRoom | null
  /** Whether a replay is available for the most recent live block. */
  replayAvailable: boolean
}

export interface LiveRoom {
  blockId: BlockId
  title: string
  href?: string
}

/** Member-specific input (optional; sensible defaults applied). */
export interface MemberInput {
  firstName?: string
  /** ISO date the member installed/joined; drives installation week. */
  joinedAt?: string
  /** Consecutive-day streak. */
  streak?: number
  /** Total hours reclaimed to date. */
  hoursReclaimed?: number
}

/** Output of the Member Engine. */
export interface MemberState {
  firstName: string
  greeting: string
  greetingPeriod: GreetingPeriod
  greetingEmoji: string
  /** 1-based installation week, or null when unknown. */
  installationWeek: number | null
  dayName: string
  streak: number
  hoursReclaimed: number
  /** 0–100 progress through today's open business day. */
  progress: number
  /** Whether today's business day is complete (past close). */
  dayComplete: boolean
}

/** Output of the Motivation Engine. */
export interface MotivationState {
  /** "Repeat After Me™" affirmation lines for the current part of day. */
  affirmations: string[]
  /** Daily AI coaching message. */
  coachingMessage: string
  /** Daily reflection question. */
  reflectionQuestion: string
  /** Daily quote. */
  quote: { text: string; author: string }
}

/**
 * The complete member experience snapshot — the single object every
 * application reads to answer: "What should this member experience right now?"
 */
export interface MemberExperience {
  time: TimeContext
  phase: CircadianPhase
  businessDay: BusinessDayState
  theme: ThemeState
  community: CommunityState
  member: MemberState
  motivation: MotivationState
  /** Role-based access + Developer Mode state for the current user. */
  access: AccessState
}
