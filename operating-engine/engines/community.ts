/**
 * Live Session + Community Engine
 * Resolves whether the hub/community is open, the current live room (if any),
 * replay availability, and the countdown to the next open/close transition.
 */
import type { BusinessDayState, CommunityState, LiveRoom, TimeContext } from "../types"
import { COMMUNITY_CLOSE_MINUTES, COMMUNITY_OPEN_MINUTES } from "../config/schedule"
import { buildCountdown } from "./time"

/** Minutes until a target time of day, wrapping forward across midnight. */
function minutesUntil(fromMinutes: number, targetMinutes: number): number {
  let diff = targetMinutes - fromMinutes
  if (diff <= 0) diff += 24 * 60
  return diff
}

export function getCommunityState(time: TimeContext, businessDay: BusinessDayState): CommunityState {
  const minutes = time.minutesSinceMidnight
  const isOpen = minutes >= COMMUNITY_OPEN_MINUTES && minutes < COMMUNITY_CLOSE_MINUTES

  const current = businessDay.current
  const liveRoom: LiveRoom | null =
    isOpen && current.engagement === "live-room"
      ? { blockId: current.id, title: current.title, href: current.href }
      : null

  // A replay is available once a live block has occurred earlier today.
  const replayAvailable =
    isOpen && businessDay.previous.engagement === "live-room" && current.engagement !== "live-room"

  const countdown = isOpen
    ? buildCountdown(minutesUntil(minutes, COMMUNITY_CLOSE_MINUTES))
    : buildCountdown(minutesUntil(minutes, COMMUNITY_OPEN_MINUTES))

  const message = isOpen
    ? "The Success Hub is open. Community Business Hours: 7 AM – 11 PM ET."
    : "The Success Hub is closed for the night. We'll see you tomorrow at 7 AM ET."

  return {
    isOpen,
    status: businessDay.status,
    message,
    countdown,
    liveRoom,
    replayAvailable,
  }
}
