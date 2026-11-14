export type HolidayScene = { src: string; caption: string }

/**
 * Shared, ordered holiday hero rotation used by both `/` and `/landing`.
 * Keep this sequence aligned with the Work-Life Balance Business Day™:
 * Flex Time → Decide & Design → Morning GIV•EN → Movement → Lunch →
 * CEO Workday → Time Freedom → Power Down → Unplug.
 */
export const HOLIDAY_SCENES: HolidayScene[] = [
  { src: "/images/holiday/winter-stroll.webp", caption: "Time to prepare for the day" },
  { src: "/images/holiday/holiday-decide-design.webp", caption: "Time to decide and design" },
  { src: "/images/holiday/holiday-morning-given.webp", caption: "Time to align and set intention" },
  { src: "/images/holiday/hanukkah-tai-chi.webp", caption: "Time to move, together" },
  { src: "/images/holiday/cafe-gathering.webp", caption: "Time to nourish and connect" },
  { src: "/images/holiday/team-celebration.webp", caption: "Time to focus and create" },
  { src: "/images/holiday/togetherness.webp", caption: "Time for the people you love" },
  { src: "/images/holiday/kwanzaa-rest.webp", caption: "Time to rest and renew" },
  { src: "/images/holiday/digital-detox-sign.webp", caption: "Time to unplug" },
]

export const HOLIDAY_SCENE_INTERVAL_MS = 5200
