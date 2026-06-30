/**
 * Operating Engine — composition root.
 *
 * `getMemberExperience(now, options)` is the single entry point every
 * application calls to answer: "What should this member experience right now?"
 * It composes every sub-engine into one immutable snapshot. Pure and
 * deterministic: same inputs always produce the same output.
 *
 * Developer Mode (admin only): an optional `override` lets a Platform
 * Administrator preview any state of the Work-Life Balance Operating
 * Environment™. Time-travel is implemented by synthesizing a TimeContext, so
 * every sub-engine runs normally on the simulated moment — the engine itself
 * stays pure and the circadian logic genuinely "runs" on the simulated time.
 */
import type {
  AccessState,
  CommunityState,
  EngineOverride,
  LiveSessionOverride,
  MemberExperience,
  MemberInput,
  Role,
  TimeContext,
} from "./types"
import { getTimeContext } from "./engines/time"
import { getCircadianPhase } from "./engines/circadian"
import { getBusinessDayState } from "./engines/business-day"
import { getThemeState } from "./engines/theme"
import { getCommunityState } from "./engines/community"
import { getMemberState } from "./engines/member"
import { getMotivationState } from "./engines/motivation"
import { PLATFORM_TIMEZONE, SCHEDULE_BY_ID } from "./config/schedule"

export interface GetExperienceOptions {
  member?: MemberInput
  timeZone?: string
  /** The current user's role. Defaults to "member". */
  role?: Role
  /** Whether the admin has Developer Mode enabled (no effect for members). */
  developerMode?: boolean
  /** Developer Mode simulation override (applied only for admins with dev mode on). */
  override?: EngineOverride
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

/** Midpoint (minutes since midnight) of a block, handling midnight-wrapping blocks. */
function blockMidpointMinutes(startMinutes: number, endMinutes: number): number {
  const end = endMinutes <= startMinutes ? endMinutes + 24 * 60 : endMinutes
  return Math.floor((startMinutes + end) / 2) % (24 * 60)
}

/**
 * Produce a synthetic TimeContext from a real one plus a Developer Mode
 * override. Only the requested fields change; everything else stays real.
 */
function applyTimeOverride(time: TimeContext, override: EngineOverride): TimeContext {
  let minutes = time.minutesSinceMidnight

  if (override.blockId) {
    const block = SCHEDULE_BY_ID[override.blockId]
    if (block) minutes = blockMidpointMinutes(block.startMinutes, block.endMinutes)
  }
  if (typeof override.minutesSinceMidnight === "number") {
    minutes = Math.max(0, Math.min(24 * 60 - 1, Math.round(override.minutesSinceMidnight)))
  }

  const dayOfWeek = typeof override.dayOfWeek === "number" ? override.dayOfWeek : time.dayOfWeek

  return {
    ...time,
    hour: Math.floor(minutes / 60),
    minute: minutes % 60,
    minutesSinceMidnight: minutes,
    dayOfWeek,
    dayName: DAY_NAMES[dayOfWeek],
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    season: override.season ?? time.season,
  }
}

/** Apply a live-session override to the resolved community state. */
function applyLiveSessionOverride(community: CommunityState, kind: LiveSessionOverride): CommunityState {
  switch (kind) {
    case "live":
      return { ...community, isOpen: true, status: "LIVE" }
    case "replay":
      return { ...community, isOpen: true, status: "OPEN", replayAvailable: true, liveRoom: null }
    case "self-guided":
      return { ...community, isOpen: true, status: "OPEN", liveRoom: null }
    case "closed":
      return { ...community, isOpen: false, status: "NIGHT", liveRoom: null }
    default:
      return community
  }
}

export function getMemberExperience(
  now: Date = new Date(),
  options: GetExperienceOptions = {},
): MemberExperience {
  const role: Role = options.role ?? "member"
  const isAdmin = role === "platform_admin"
  const developerMode = isAdmin && options.developerMode === true
  // Overrides apply only to admins who have Developer Mode enabled.
  const override = developerMode ? options.override : undefined
  const overrideActive = Boolean(
    override &&
      (override.blockId ||
        typeof override.minutesSinceMidnight === "number" ||
        typeof override.dayOfWeek === "number" ||
        override.season ||
        override.liveSession ||
        override.member),
  )

  const realTime = getTimeContext(now, options.timeZone ?? PLATFORM_TIMEZONE)
  const time = override ? applyTimeOverride(realTime, override) : realTime

  const phase = getCircadianPhase(time)
  const businessDay = getBusinessDayState(time)
  const theme = getThemeState(time, phase)
  let community = getCommunityState(time, businessDay)
  if (override?.liveSession) community = applyLiveSessionOverride(community, override.liveSession)

  const memberInput = override?.member ?? options.member
  const member = getMemberState(time, phase, businessDay, memberInput)
  const motivation = getMotivationState(time, phase)

  // Members are locked out while the community is closed (Digital Detox).
  // Admins with Developer Mode enabled are never involuntarily locked out.
  const locked = !community.isOpen && !developerMode

  const access: AccessState = { role, isAdmin, developerMode, overrideActive, locked }

  return { time, phase, businessDay, theme, community, member, motivation, access }
}
