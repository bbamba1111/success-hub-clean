export type HolidayScene = { src: string; caption: string }

/** Shared, ordered holiday hero rotation used by both `/` and `/landing`. */
export const HOLIDAY_SCENES: HolidayScene[] = [
  { src: "/images/holiday/togetherness.png", caption: "Time for the people you love" },
  { src: "/images/holiday/garden-meditation.png", caption: "Time to be still" },
  { src: "/images/holiday/kwanzaa-rest.png", caption: "Time to rest and renew" },
  { src: "/images/holiday/cafe-gathering.png", caption: "Time to gather" },
  { src: "/images/holiday/hanukkah-tai-chi.png", caption: "Time to move, together" },
  { src: "/images/holiday/team-celebration.png", caption: "Time to celebrate the work" },
  { src: "/images/holiday/winter-stroll.png", caption: "Time to wander" },
  { src: "/images/holiday/digital-detox-sign.png", caption: "Time to unplug" },
]

export const HOLIDAY_SCENE_INTERVAL_MS = 5200
