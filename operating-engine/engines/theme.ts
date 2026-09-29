/**
 * Theme Engine
 * Returns the visual theme for the current moment: time-of-day period,
 * season, and the background image + tint to render (sourced from the
 * current block so visuals stay in lockstep with the timeline).
 */
import type { CircadianPhase, ThemePeriod, ThemeState, TimeContext } from "../types"

const PERIOD_LABEL: Record<ThemePeriod, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
}

/** Time-of-day theme period (independent of the block grouping). */
function resolveThemePeriod(minutes: number): ThemePeriod {
  if (minutes >= 7 * 60 && minutes < 12 * 60) return "morning"
  if (minutes >= 12 * 60 && minutes < 17 * 60) return "afternoon"
  if (minutes >= 17 * 60 && minutes < 22 * 60) return "evening"
  return "night"
}

export function getThemeState(time: TimeContext, phase: CircadianPhase): ThemeState {
  const period = resolveThemePeriod(time.minutesSinceMidnight)
  const season = time.season
  const seasonLabel = season.charAt(0).toUpperCase() + season.slice(1)

  // ThemeState always resolves to a single "current moment" image — if the
  // block defines a crossfading array (e.g. Monday Reality Check™), use the
  // first frame here.
  const blockBackgroundImage = Array.isArray(phase.block.backgroundImage)
    ? phase.block.backgroundImage[0]
    : phase.block.backgroundImage

  return {
    period,
    season,
    label: `${PERIOD_LABEL[period]} · ${seasonLabel}`,
    backgroundImage: blockBackgroundImage,
    tint: phase.block.tint,
  }
}
