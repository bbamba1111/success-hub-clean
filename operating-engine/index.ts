/**
 * Make Time For More™ — Shared Operating Engine (public API)
 *
 * The brain of the platform. Pure, framework-free business logic that every
 * application consumes. Import from "@/operating-engine".
 *
 * Phase 1: powers the Success Hub Home page (Hero + Work-Life Balance
 * Business Day™ timeline). Designed to be lifted into
 * `packages/operating-engine` later so Harmony Live, Cherry Blossom AI,
 * and future apps share the exact same source of truth.
 */
export * from "./types"
export { getMemberExperience } from "./engine"
export type { GetExperienceOptions } from "./engine"

// Configuration (single source of truth) — exported for apps that render
// the full schedule directly.
export { SCHEDULE, SCHEDULE_BY_ID, PLATFORM_TIMEZONE, COMMUNITY_OPEN_MINUTES, COMMUNITY_CLOSE_MINUTES } from "./config/schedule"

// Individual engines (exported for advanced/standalone use).
export { getTimeContext, buildCountdown, pickDaily } from "./engines/time"
export { getCircadianPhase, getCurrentBlock, getCurrentBlockIndex } from "./engines/circadian"
export { getBusinessDayState, getNextOperatingSegment } from "./engines/business-day"
export { getThemeState } from "./engines/theme"
export { getCommunityState } from "./engines/community"
export { getMemberState } from "./engines/member"
export { getMotivationState } from "./engines/motivation"
