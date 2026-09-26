/**
 * Member Engine
 * Returns the personalized greeting plus member-progress fields. Member data
 * is optional; sensible defaults are applied so the Home page works for
 * anonymous visitors while staying ready for real member records.
 */
import type { BusinessDayState, CircadianPhase, MemberInput, MemberState, TimeContext } from "../types"
import { COMMUNITY_CLOSE_MINUTES } from "../config/schedule"
import { getGreetingByTime } from "@/lib/cherry-blossom/greeting"

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

/** 1-based installation week from a join date, or null if unknown/invalid. */
function resolveInstallationWeek(joinedAt?: string, now?: Date): number | null {
  if (!joinedAt) return null
  const joined = new Date(joinedAt)
  if (Number.isNaN(joined.getTime())) return null
  const reference = now ?? new Date()
  const weeks = Math.floor((reference.getTime() - joined.getTime()) / MS_PER_WEEK)
  return Math.max(1, weeks + 1)
}

export function getMemberState(
  time: TimeContext,
  phase: CircadianPhase,
  businessDay: BusinessDayState,
  member: MemberInput = {},
): MemberState {
  const firstName = member.firstName?.trim() || "Friend"

  // Derive greeting from clock time so "Good Night" appears at 10 PM+
  // regardless of which schedule block is active.
  const greetingResult = getGreetingByTime(time.minutesSinceMidnight, firstName)

  return {
    firstName,
    greeting: greetingResult.greeting,
    greetingPeriod: greetingResult.period,
    greetingEmoji: greetingResult.emoji,
    installationWeek: resolveInstallationWeek(member.joinedAt, time.now),
    dayName: time.dayName,
    streak: member.streak ?? 0,
    hoursReclaimed: member.hoursReclaimed ?? 0,
    progress: businessDay.progress,
    dayComplete: time.minutesSinceMidnight >= COMMUNITY_CLOSE_MINUTES,
  }
}
