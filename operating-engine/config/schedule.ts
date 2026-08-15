/**
 * Canonical schedule for the Work-Life Balance Business Day™.
 *
 * This is THE single source of truth for block names, times, themes,
 * images, tints, and CTAs. Previously this data was duplicated (and had
 * drifted out of sync) across business-day-hero, work-life-balance-schedule,
 * business-day-schedule, and business-hours. Every app/component now derives
 * from this one array.
 *
 * Times are minutes-since-midnight in PLATFORM_TIMEZONE.
 */
import type { BlockConfig } from "../types"

/** The platform operates on US Eastern Time. */
export const PLATFORM_TIMEZONE = "America/New_York"

/** Community / hub open window (07:00–23:00 platform tz). */
export const COMMUNITY_OPEN_MINUTES = 7 * 60 // 07:00
export const COMMUNITY_CLOSE_MINUTES = 23 * 60 // 23:00

const h = (hours: number, minutes = 0) => hours * 60 + minutes

/**
 * Ordered blocks, beginning at the 7:00 AM open. The final block
 * (Unplug Digital Detox™) wraps past midnight (23:00 → 07:00).
 *
 * Monday resequencing — Make Time For More On Mondays™:
 * On every other weekday, Morning GIV•EN™ runs 9:00–10:30 AM and Movement /
 * Lunch follow immediately after. On Mondays the morning is resequenced so
 * members align first, then reflect, then debrief, before moving on:
 *   Flex Time (7:00–9:00) → Morning GIV•EN™ (9:00–9:45) →
 *   Reality Check™ (9:45–10:30) → Work-Life Balance Debrief™ (10:30–11:00) →
 *   Movement Window™ (11:00–11:30) → Lunch Break™ (11:30 AM–1:00 PM).
 * Each affected block carries its Monday-specific times via
 * `mondayStartMinutes` / `mondayEndMinutes` / `mondayTimeLabel`; the two
 * Monday-only blocks (`monday-reality-check`, `monday-debrief`) simply don't
 * exist on any other day (`mondayOnly: true`) and are hidden by the engine.
 */
export const SCHEDULE: BlockConfig[] = [
  {
    id: "early-access",
    sectionId: "block-early-access",
    title: "Flex Time",
    shortTitle: "Flex Time",
    timeLabel: "7:00–9:00 AM",
    startMinutes: h(7),
    endMinutes: h(9),
    description:
      "Open before the official day begins—flexible time to prepare, collaborate, manage life, and enter your workday with clarity instead of chaos.",
    emoji: "🌅",
    tint: "253 246 234",
    backgroundImage: "/images/block-early-access.png",
    cta: "Enter Flex Time™",
    engagement: "self-guided",
    part: "morning",
    greetingPeriod: "Morning",
    greetingEmoji: "🌸",
    themePeriod: "morning",
    communityOpen: true,
    messages: [
      "Today is a fresh opportunity to intentionally design your day before the world begins making demands on your time.",
      "Before the noise begins, take this quiet space to prepare your mind, your priorities, and your presence.",
    ],
  },
  {
    id: "morning-given",
    sectionId: "block-morning-given",
    title: "Morning GIV•EN™ Routine™",
    shortTitle: "Morning GIV•EN™",
    timeLabel: "9:00–9:45 AM",
    startMinutes: h(9),
    endMinutes: h(9, 45),
    description:
      "Align mind, body, spirit, and priorities before work—Gratitude, Invitation, Vision, Emotional Embodiment, and Nurture Non-Negotiables™.",
    emoji: "🌸",
    tint: "252 240 238",
    backgroundImage: "/images/block-morning-given.png",
    cta: "Join Morning GIV•EN™",
    href: "https://join.butter.us/make-time-for-more/morning-routine",
    engagement: "live-room",
    part: "morning",
    greetingPeriod: "Morning",
    greetingEmoji: "🌸",
    themePeriod: "morning",
    communityOpen: true,
    messages: [
      "Today begins with gratitude, purpose, and intention. Before leading your business, lead yourself.",
      "Align your mind, body, and spirit first. Everything you build today flows from this alignment.",
    ],
  },
  // ── Monday-only block ─────────────────────────────────────────────────────
  // Appears after Morning GIV•EN™ on Mondays only (9:45–10:30 AM).
  {
    id: "monday-reality-check",
    sectionId: "block-monday-reality-check",
    title: "Take My Work-Life Balance Reality Check™",
    shortTitle: "Make Time For More On Mondays™",
    timeLabel: "9:45–10:30 AM",
    startMinutes: h(9, 45),
    endMinutes: h(10, 30),
    description:
      "Before you manage your business, manage your life. Take 45 minutes to honestly examine where you are — boundaries, energy, and commitments — and redesign your entry into the workweek.",
    emoji: "🌸",
    tint: "252 240 238",
    backgroundImage: [
      "/images/block-monday-reality-check.png",
      "/images/block-monday-reality-check-2.png",
    ],
    cta: "Take My Reality Check™",
    engagement: "live-room",
    part: "morning",
    greetingPeriod: "Morning",
    greetingEmoji: "🌸",
    themePeriod: "morning",
    communityOpen: true,
    mondayOnly: true,
    messages: [
      "Before you manage your business, manage your life. Redesign your entry into the workweek.",
    ],
  },
  // ── Monday-only block ─────────────────────────────────────────────────────
  // Appears after the Reality Check™ on Mondays only (10:30–11:00 AM).
  {
    id: "monday-debrief",
    sectionId: "block-monday-debrief",
    title: "Design My Work-Life Balance Business Week™",
    shortTitle: "Design My Work-Life Balance Business Week™",
    timeLabel: "10:30–11:00 AM",
    startMinutes: h(10, 30),
    endMinutes: h(11),
    description:
      "A protected time and space to sit with what surfaced in your Reality Check™ — before you move into today's Movement Window™.",
    emoji: "🌸",
    tint: "252 240 238",
    backgroundImage: "/images/reality-check-zen-bg.png",
    cta: "Design My Business Week™",
    engagement: "self-guided",
    part: "morning",
    greetingPeriod: "Morning",
    greetingEmoji: "🌸",
    themePeriod: "morning",
    communityOpen: true,
    mondayOnly: true,
    messages: [
      "Sit with what surfaced. Awareness without a pause to process it rarely becomes lasting change.",
    ],
  },
  // ── Tuesday–Thursday-only block ───────────────────────────────────────────
  // Occupies the same 9:45–10:30 AM slot Monday gives to Reality Check™.
  // This is where Monday's measurement becomes daily operating intelligence:
  // Weekly Data Review → Founder GPS™ → Daily Planning → Design Today's
  // Workday. The founder does NOT retake the Audit or ESA here — those stay
  // locked until the next Monday.
  {
    id: "daily-planning-gps",
    sectionId: "block-daily-planning-gps",
    title: "Daily Planning + Founder GPS™",
    shortTitle: "Daily Planning + GPS™",
    timeLabel: "9:45–10:30 AM",
    startMinutes: h(9, 45),
    endMinutes: h(10, 30),
    description:
      "Review this week's data, consult your Founder GPS™, and design today's workday — built on Monday's Reality Check™, without retaking the Audit or ESA.",
    emoji: "🧭",
    tint: "237 242 247",
    backgroundImage: "/images/block-ceo-workday.png",
    cta: "Open Daily Planning + GPS™",
    engagement: "self-guided",
    part: "morning",
    greetingPeriod: "Morning",
    greetingEmoji: "🌸",
    themePeriod: "morning",
    communityOpen: true,
    excludeMonday: true,
    messages: [
      "This week's data is already yours. Let it guide today's focus instead of starting from zero.",
      "Your Founder GPS™ turns this week's numbers into today's next right step.",
    ],
  },
  {
    id: "movement-window",
    sectionId: "block-movement-window",
    title: "30-Minute Workday Movement Window™",
    shortTitle: "Movement Window™",
    timeLabel: "10:30–11:00 AM",
    startMinutes: h(10, 30),
    endMinutes: h(11),
    // Mondays: shifts 30 minutes later to make room for the Reality Check™ + Debrief™.
    mondayTimeLabel: "11:00–11:30 AM",
    mondayStartMinutes: h(11),
    mondayEndMinutes: h(11, 30),
    description:
      "Increase energy, improve circulation, and support cognitive performance—preparing your body for focused work.",
    emoji: "💪",
    tint: "240 245 236",
    backgroundImage: "/images/block-movement-window.png",
    cta: "Start Movement Window™",
    href: "https://join.butter.us/make-time-for-more/workout-window",
    engagement: "live-room",
    part: "morning",
    greetingPeriod: "Morning",
    greetingEmoji: "🌿",
    themePeriod: "morning",
    communityOpen: true,
    messages: [
      "Small moments of movement create lasting energy. Care for your body so it can support your vision.",
      "Move with intention. Your body is the vehicle for everything you're here to create.",
    ],
  },
  {
    id: "lunch-break",
    sectionId: "block-lunch-break",
    title: "Extended Healthy Hybrid Lunch Break™",
    shortTitle: "Lunch Break™",
    timeLabel: "11:00 AM–1:00 PM",
    startMinutes: h(11),
    endMinutes: h(13),
    // Mondays: shifts 30 minutes later to follow the resequenced morning.
    mondayTimeLabel: "11:30 AM–1:00 PM",
    mondayStartMinutes: h(11, 30),
    mondayEndMinutes: h(13),
    description:
      "Nourish your body, spend time in nature, and connect with the people who matter—restoring your energy for the afternoon.",
    emoji: "🥗",
    tint: "238 244 234",
    backgroundImage: "/images/block-lunch-break.png",
    cta: "Begin Lunch Break™",
    href: "https://www.facebook.com/groups/maketimeformore",
    engagement: "social",
    part: "morning",
    greetingPeriod: "Afternoon",
    greetingEmoji: "🌿",
    themePeriod: "afternoon",
    communityOpen: true,
    messages: [
      "Nourishment is productive. Step into nature, reconnect, and return refreshed for meaningful work.",
      "Rest is not a reward for finishing — it's the fuel that makes great work possible.",
    ],
  },
  {
    id: "ceo-workday",
    sectionId: "block-ceo-workday",
    title: "4-Hour Focused CEO Workday™",
    shortTitle: "CEO Workday™",
    timeLabel: "1:00–5:00 PM",
    startMinutes: h(13),
    endMinutes: h(17),
    description:
      "Your protected execution period for AI Augmentation™, Deep Work™, strategic thinking, decisions, and delivery.",
    emoji: "💼",
    tint: "237 242 247",
    backgroundImage: "/images/block-ceo-workday.png",
    cta: "Enter CEO Workday™",
    href: "https://join.butter.us/make-time-for-more/4-hour-workday",
    engagement: "live-room",
    part: "ceo",
    greetingPeriod: "Afternoon",
    greetingEmoji: "🌿",
    themePeriod: "afternoon",
    communityOpen: true,
    messages: [
      "Protect your focus. Every intentional decision today moves your business closer to the future you're creating.",
      "This is your protected execution window. Do the deep work only you can do.",
    ],
  },
  {
    id: "time-freedom",
    sectionId: "block-time-freedom",
    title: "Time Freedom™",
    shortTitle: "Time Freedom™",
    // Weekdays: 5–10 PM. On Fri/Sat the engine overrides to all-day (7 AM–11 PM).
    // Sunday closes one hour earlier (7 AM–10 PM) to prepare members for
    // Make Time For More On Mondays™.
    timeLabel: "5:00–10:00 PM",
    weekendTimeLabel: "7:00 AM–11:00 PM",
    sundayTimeLabel: "7:00 AM–10:00 PM",
    startMinutes: h(17),
    weekendStartMinutes: h(7),
    endMinutes: h(22),
    description:
      "Enjoy the life you built your business to support—family, health, relationships, recreation, creativity, faith, and growth.",
    emoji: "🌸",
    tint: "252 241 239",
    backgroundImage: "/images/block-time-freedom.png",
    cta: "Enjoy Time Freedom™",
    href: "https://www.facebook.com/groups/maketimeformore",
    engagement: "social",
    part: "evening",
    greetingPeriod: "Evening",
    greetingEmoji: "🌙",
    themePeriod: "evening",
    communityOpen: true,
    messages: [
      "You earned this time. Be fully present with the people and experiences that matter most.",
      "Enjoy the life you built your business to support. Presence is the real success.",
    ],
  },
  {
    id: "power-down",
    sectionId: "block-power-down",
    title: "Power Down™",
    shortTitle: "Power Down™",
    timeLabel: "10:00–11:00 PM",
    startMinutes: h(22),
    endMinutes: h(23),
    description:
      "Transition intentionally from productivity to restoration—reflect, prepare tomorrow, slow your mind, and reduce stimulation.",
    emoji: "🌙",
    tint: "238 240 247",
    backgroundImage: "/images/block-power-down.png",
    cta: "Join Power Down™",
    href: "https://join.butter.us/make-time-for-more/power-down",
    engagement: "live-room",
    part: "evening",
    greetingPeriod: "Night",
    greetingEmoji: "🌙",
    themePeriod: "night",
    communityOpen: true,
    messages: [
      "Success also means knowing when to stop. Rest is part of tomorrow's performance.",
      "Slow your mind, reflect on today, and prepare tomorrow with intention.",
    ],
  },
  {
    id: "digital-detox",
    sectionId: "block-digital-detox",
    title: "Unplug Digital Detox™",
    shortTitle: "Digital Detox™",
    timeLabel: "11:00 PM–7:00 AM",
    startMinutes: h(23),
    endMinutes: h(7), // wraps past midnight
    description:
      "Devices off. Community closes. Prioritize restorative sleep—tomorrow's success begins tonight.",
    emoji: "🌙",
    tint: "239 240 244",
    backgroundImage: "/images/block-digital-detox.png",
    cta: "Community Closed",
    engagement: "closed",
    part: "evening",
    greetingPeriod: "Night",
    greetingEmoji: "🌙",
    themePeriod: "night",
    communityOpen: false,
    messages: [
      "Your devices are resting. Now let your mind and body do the same.",
      "Tomorrow's success begins tonight. Give yourself the gift of restorative sleep.",
    ],
  },
]

/** Fast lookup by block id. */
export const SCHEDULE_BY_ID: Record<string, BlockConfig> = Object.fromEntries(
  SCHEDULE.map((block) => [block.id, block]),
)

/**
 * Resolves a block's effective start/end minutes and timeLabel for the given
 * day of week. Mondays apply each block's `mondayStartMinutes` /
 * `mondayEndMinutes` / `mondayTimeLabel` overrides (Make Time For More On
 * Mondays™ resequences the morning); every other day returns the block
 * unchanged. This is the single place that reconciles a block's default
 * weekday timing with its Monday-specific timing.
 */
export function resolveEffectiveBlock(block: BlockConfig, dayOfWeek: number): BlockConfig {
  if (dayOfWeek !== 1) return block
  if (
    block.mondayStartMinutes === undefined &&
    block.mondayEndMinutes === undefined &&
    block.mondayTimeLabel === undefined
  ) {
    return block
  }
  return {
    ...block,
    startMinutes: block.mondayStartMinutes ?? block.startMinutes,
    endMinutes: block.mondayEndMinutes ?? block.endMinutes,
    timeLabel: block.mondayTimeLabel ?? block.timeLabel,
  }
}

/** True if `block` doesn't exist on `dayOfWeek` (0=Sun … 6=Sat). */
function isHiddenOnDay(block: BlockConfig, dayOfWeek: number): boolean {
  const isMonday = dayOfWeek === 1
  if (block.mondayOnly && !isMonday) return true
  if (block.excludeMonday && isMonday) return true
  return false
}

/**
 * Index of the next block reachable from `fromIndex`, skipping blocks that
 * don't exist on `dayOfWeek` (`mondayOnly` on every day except Monday,
 * `excludeMonday` on Monday). Wraps around the end of SCHEDULE.
 */
export function nextReachableIndex(fromIndex: number, dayOfWeek: number): number {
  const len = SCHEDULE.length
  let idx = (fromIndex + 1) % len
  while (isHiddenOnDay(SCHEDULE[idx], dayOfWeek)) {
    idx = (idx + 1) % len
  }
  return idx
}

/**
 * Index of the previous block reachable from `fromIndex`, skipping blocks
 * that don't exist on `dayOfWeek`. Wraps around the start of SCHEDULE.
 */
export function previousReachableIndex(fromIndex: number, dayOfWeek: number): number {
  const len = SCHEDULE.length
  let idx = (fromIndex - 1 + len) % len
  while (isHiddenOnDay(SCHEDULE[idx], dayOfWeek)) {
    idx = (idx - 1 + len) % len
  }
  return idx
}
