export type HolidayScene = { src: string; caption: string }

/** Shared, ordered holiday hero rotation used by both `/` and `/landing`. */
export const HOLIDAY_SCENES: HolidayScene[] = [
  { src: "/images/holiday/togetherness.webp", caption: "Time for the people you love" },
  { src: "/images/holiday/garden-meditation.webp", caption: "Time to be still" },
  { src: "/images/holiday/kwanzaa-rest.webp", caption: "Time to rest and renew" },
  { src: "/images/holiday/cafe-gathering.webp", caption: "Time to gather" },
  { src: "/images/holiday/hanukkah-tai-chi.webp", caption: "Time to move, together" },
  { src: "/images/holiday/team-celebration.webp", caption: "Time to celebrate the work" },
  { src: "/images/holiday/winter-stroll.webp", caption: "Time to wander" },
  { src: "/images/holiday/digital-detox-sign.webp", caption: "Time to unplug" },
]

export const HOLIDAY_SCENE_INTERVAL_MS = 5200
