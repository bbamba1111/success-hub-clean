/**
 * Operating Engine — composition root.
 *
 * `getMemberExperience(now, member)` is the single entry point every
 * application calls to answer: "What should this member experience right now?"
 * It composes every sub-engine into one immutable snapshot. Pure and
 * deterministic: same inputs always produce the same output.
 */
import type { MemberExperience, MemberInput } from "./types"
import { getTimeContext } from "./engines/time"
import { getCircadianPhase } from "./engines/circadian"
import { getBusinessDayState } from "./engines/business-day"
import { getThemeState } from "./engines/theme"
import { getCommunityState } from "./engines/community"
import { getMemberState } from "./engines/member"
import { getMotivationState } from "./engines/motivation"
import { PLATFORM_TIMEZONE } from "./config/schedule"

export interface GetExperienceOptions {
  member?: MemberInput
  timeZone?: string
}

export function getMemberExperience(
  now: Date = new Date(),
  options: GetExperienceOptions = {},
): MemberExperience {
  const time = getTimeContext(now, options.timeZone ?? PLATFORM_TIMEZONE)
  const phase = getCircadianPhase(time)
  const businessDay = getBusinessDayState(time)
  const theme = getThemeState(time, phase)
  const community = getCommunityState(time, businessDay)
  const member = getMemberState(time, phase, businessDay, options.member)
  const motivation = getMotivationState(time, phase)

  return { time, phase, businessDay, theme, community, member, motivation }
}
