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
 */
export const SCHEDULE: BlockConfig[] = [
  // ── Monday-only blocks ────────────────────────────────────────────────────
  // These blocks carry mondayOnly: true so the schedule renderer and engine
  // can show/hide them based on the current day of week.
  {
    id: "monday-flex",
    sectionId: "block-monday-flex",
    title: "Make Time For More™ On Mondays™",
    shortTitle: "Make Time For More™ On Mondays™",
    timeLabel: "7:00–9:00 AM",
    startMinutes: h(7),
    endMinutes: h(9),
    description:
      "Begin your redesigned workweek with clarity, purpose, and balance. Flex time to prepare, reflect, and enter your week with intention.",
    emoji: "🌸",
    tint: "253 246 234",
    backgroundImage: "/images/block-early-access.png",
    cta: "Begin Make Time For More Mondays™",
    engagement: "self-guided",
    part: "morning",
    greetingPeriod: "Morning",
    greetingEmoji: "🌸",
    themePeriod: "morning",
    communityOpen: true,
    mondayOnly: true,
    messages: [
      "A new week begins with your redesigned entry. Start with clarity, not chaos.",
    ],
  },
  {
    id: "monday-reality-check",
    sectionId: "block-monday-reality-check",
    title: "Work-Life Balance Reality Check™",
    shortTitle: "Work-Life Balance Reality Check™",
    timeLabel: "9:00–9:30 AM",
    startMinutes: h(9),
    endMinutes: h(9, 30),
    description:
      "Redesign your entry into the workweek. Set your intentions, review your boundaries, and align your commitments before the day begins.",
    emoji: "🌸",
    tint: "252 240 238",
    backgroundImage: "/images/block-morning-given.png",
    cta: "Take Your Reality Check™",
    engagement: "live-room",
    part: "morning",
    greetingPeriod: "Morning",
    greetingEmoji: "🌸",
    themePeriod: "morning",
    communityOpen: true,
    mondayOnly: true,
    messages: [
      "Redesign your entry into the workweek. Every Monday is a fresh opportunity to realign.",
    ],
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "early-access",
    sectionId: "block-early-access",
    title: "Early Access, Flex Time™ & Preparation",
    shortTitle: "Early Access™",
    timeLabel: "7:00–9:00 AM",
    startMinutes: h(7),
    endMinutes: h(9),
    description:
      "Open before the official day begins—flexible time to prepare, collaborate, manage life, and enter your workday with clarity instead of chaos.",
    emoji: "🌅",
    tint: "253 246 234",
    backgroundImage: "/images/block-early-access.png",
    cta: "Enter Early Access™",
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
    timeLabel: "9:00–10:30 AM",
    startMinutes: h(9),
    endMinutes: h(10, 30),
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
  {
    id: "movement-window",
    sectionId: "block-movement-window",
    title: "30-Minute Workday Movement Window™",
    shortTitle: "Movement Window™",
    timeLabel: "10:30–11:00 AM",
    startMinutes: h(10, 30),
    endMinutes: h(11),
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
    // Weekdays: 5–10 PM. On Fri/Sat/Sun the engine overrides to all-day (7 AM–11 PM).
    timeLabel: "5:00–10:00 PM",
    weekendTimeLabel: "7:00 AM–11:00 PM",
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
