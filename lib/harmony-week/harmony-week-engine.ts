/**
 * Harmony Week™ Engine
 * ---------------------------------------------------------------------------
 * Pure function. No React, no DOM, no Next.js. Safe to import anywhere.
 *
 * Maps each day-of-week (0 = Sunday … 6 = Saturday) to a fully-populated
 * HarmonyDayTheme — the canonical source of truth for all day-aware UI in
 * the platform. Components never hard-code day strings; they read this.
 */

import type { HarmonyDayTheme } from "./types"

const THEMES: Record<number, HarmonyDayTheme> = {
  // ── 1 · Monday · Synchronize™ ──────────────────────────────────────────
  1: {
    dayOfWeek: 1,
    harmonyDay: "synchronize",
    dayName: "Monday",
    themeName: "Synchronize™",
    tagline: "Begin with intention. Align before you accelerate.",
    philosophy:
      "Monday is not just a restart — it is a deliberate re-entry into your operating rhythm. Before the week can build momentum it must be aligned: your priorities, your energy, your team, and your intentions. Synchronize™ is the foundation every productive week is built on.",
    cherryBlossomGuidance: [
      "Open your week plan before opening your inbox.",
      "Align your top three priorities with your highest-energy window.",
      "Reconnect with your business stage goals — not just today's tasks.",
      "Schedule your CEO Workday™ blocks now, before the week claims your time.",
      "Send one short alignment message to your team or accountability partner.",
      "Drink a full glass of water before your first meeting.",
      "Set a clear intention for what this week will mean when it is over.",
    ],
    workspacePriorities: ["Week Alignment", "Priority Setting", "Team Sync", "Energy Mapping"],
    primaryCta: {
      label: "Start My Harmony Week™",
      action: "focus-mode",
      href: "/my-harmony",
    },
    accent: { color: "#5D9D61", label: "Harmony Green" },
    isBusinessDay: true,
    isTimeFreedom: false,
  },

  // ── 2 · Tuesday · Execute™ ─────────────────────────────────────────────
  2: {
    dayOfWeek: 2,
    harmonyDay: "execute",
    dayName: "Tuesday",
    themeName: "Execute™",
    tagline: "This is the day things get done. Move with purpose.",
    philosophy:
      "Tuesday is the engine room of the Harmony Week™. The alignment is set, the priorities are clear — now it is time to move. Execute™ is about deep, uninterrupted work on the things that matter most, protected from the noise that always wants to fill a workday.",
    cherryBlossomGuidance: [
      "Start with your hardest, most important task — before any meetings.",
      "Block distraction apps for your first CEO Workday™ block.",
      "Say no to one reactive request today so you can say yes to your priorities.",
      "Check email twice — not twenty times.",
      "Eat lunch away from your desk to protect your afternoon focus.",
      "End your CEO block with a one-sentence summary of what you completed.",
      "Celebrate small wins out loud — they add up.",
    ],
    workspacePriorities: ["Deep Work", "CEO Priority Execution", "Inbox Boundaries", "Progress Review"],
    primaryCta: {
      label: "Enter CEO Workday™",
      action: "focus-mode",
      href: "/my-harmony",
    },
    accent: { color: "#4A7C4E", label: "Deep Green" },
    isBusinessDay: true,
    isTimeFreedom: false,
  },

  // ── 3 · Wednesday · Optimize™ ──────────────────────────────────────────
  3: {
    dayOfWeek: 3,
    harmonyDay: "optimize",
    dayName: "Wednesday",
    themeName: "Optimize™",
    tagline: "Mid-week clarity. Remove friction, refine what works.",
    philosophy:
      "Wednesday is the pivot point of the week — the moment to pause, assess, and refine before the final push. Optimize™ is not about fixing everything; it is about removing the two or three friction points that are slowing your best work and doubling down on what is already working.",
    cherryBlossomGuidance: [
      "Audit one recurring task: can it be simplified, delegated, or eliminated?",
      "Review your week priorities — are you still on track, or does something need to shift?",
      "Clear your physical and digital workspace for an afternoon of deep focus.",
      "Identify one bottleneck in your business and take one action to remove it.",
      "Block 30 minutes for strategic thinking — no tasks, no emails.",
      "Reach out to one person in your network with a genuine, no-ask message.",
      "End the day by writing tomorrow's top three — not ten, three.",
    ],
    workspacePriorities: ["Mid-Week Review", "Friction Removal", "Systems Audit", "Strategic Thinking"],
    primaryCta: {
      label: "Run My Wednesday Optimize™",
      action: "optimize",
      href: "/my-harmony",
    },
    accent: { color: "#C8874A", label: "Amber" },
    isBusinessDay: true,
    isTimeFreedom: false,
  },

  // ── 4 · Thursday · Finish Strong™ ─────────────────────────────────────
  4: {
    dayOfWeek: 4,
    harmonyDay: "finish-strong",
    dayName: "Thursday",
    themeName: "Finish Strong™",
    tagline: "Close the loop. End the week with momentum.",
    philosophy:
      "Thursday is the last full business day of the Harmony Week™. What you complete today determines how clean your Time Freedom™ will feel. Finish Strong™ is about closing open loops, wrapping deliverables, and leaving tomorrow's version of yourself with nothing urgent hanging over the weekend.",
    cherryBlossomGuidance: [
      "Complete the most important open loop from this week — today.",
      "Send all replies and follow-ups before 4 PM so they do not spill into Friday.",
      "Review what you committed to at the start of the week — did you deliver?",
      "Do not start a new major project today — finish what matters most.",
      "Acknowledge one thing that went exceptionally well this week.",
      "Prepare a short handoff note if you work with a team.",
      "End the day with your desk clear and your digital workspace organized.",
    ],
    workspacePriorities: ["Deliverable Completion", "Open Loop Closure", "Weekly Wrap", "Momentum Capture"],
    primaryCta: {
      label: "Finish My Week Strong™",
      action: "finish",
      href: "/my-harmony",
    },
    accent: { color: "#4A8C8C", label: "Teal" },
    isBusinessDay: true,
    isTimeFreedom: false,
  },

  // ── 5 · Friday · Time Freedom™ ─────────────────────────────────────────
  5: {
    dayOfWeek: 5,
    harmonyDay: "time-freedom",
    dayName: "Friday",
    themeName: "Time Freedom™",
    tagline: "You earned this. Protect it.",
    philosophy:
      "Friday marks the beginning of your three-day Time Freedom™ weekend — the most protected asset in the Harmony operating rhythm. Time Freedom™ is not absence from work; it is presence in your real life. The business is still growing; it is simply growing without your constant attention, because you designed it that way.",
    cherryBlossomGuidance: [
      "Resist the urge to check work email after your Power Down ritual.",
      "Do one thing today that has nothing to do with your business.",
      "Tell someone you love that you are genuinely present this weekend.",
      "Reflect on one meaningful thing this week produced.",
      "Schedule a joy activity — not an errand — for Saturday morning.",
      "Turn off business notifications at your designated Power Down time.",
      "Notice what restoration feels like. It is the source of next week's output.",
    ],
    workspacePriorities: ["Power Down Ritual", "Presence Practice", "Rest & Restoration", "Weekend Intention"],
    primaryCta: {
      label: "Begin Time Freedom™",
      action: "celebrate",
      href: "/my-harmony",
    },
    accent: { color: "#E26C73", label: "Coral" },
    isBusinessDay: false,
    isTimeFreedom: true,
    reflectionPrompts: [
      "What was the single most meaningful thing I accomplished this week?",
      "Where did I protect my time well — and where did I let it slip?",
      "What would make next week feel like a genuine success?",
      "What am I most proud of right now in my business?",
      "What one thing would I do differently if I ran this week again?",
    ],
  },

  // ── 6 · Saturday · Recovery™ ───────────────────────────────────────────
  6: {
    dayOfWeek: 6,
    harmonyDay: "recovery",
    dayName: "Saturday",
    themeName: "Recovery™",
    tagline: "Rest is a strategy. Recover on purpose.",
    philosophy:
      "Recovery™ is not laziness — it is a high-performance business decision. The founders who operate at their best on Monday are the ones who genuinely rested on Saturday. This is not a suggestion; it is a system requirement. Your nervous system, your creativity, and your decision-making quality all depend on what you do today.",
    cherryBlossomGuidance: [
      "Sleep in — at least one hour past your workday wake time.",
      "Move your body in a way that feels like play, not exercise.",
      "Eat something you truly enjoy without any guilt.",
      "Spend time with someone who energizes you.",
      "Read something that has nothing to do with business.",
      "Go outside for at least 30 minutes.",
      "Do absolutely nothing purposeful for at least one hour.",
    ],
    workspacePriorities: ["Physical Rest", "Social Connection", "Creative Play", "Digital Detox"],
    primaryCta: {
      label: "Continue Time Freedom™",
      action: "recharge",
      href: "/my-harmony",
    },
    accent: { color: "#7B6FA0", label: "Lavender" },
    isBusinessDay: false,
    isTimeFreedom: true,
  },

  // ── 0 · Sunday · Prepare™ ──────────────────────────────────────────────
  0: {
    dayOfWeek: 0,
    harmonyDay: "prepare",
    dayName: "Sunday",
    themeName: "Prepare™",
    tagline: "Design the week before it designs you.",
    philosophy:
      "Sunday is still part of your Time Freedom™ weekend — do not let it become a stress day. Prepare™ is a 20-minute intentional ritual: you review the week ahead, set your three priorities, and lay your rhythm so Monday can begin with clarity instead of chaos. After that, your weekend continues.",
    cherryBlossomGuidance: [
      "Keep the Design My Week™ ritual to 20 minutes — not an hour.",
      "Identify your top three CEO priorities for the week ahead.",
      "Schedule at least two protected CEO Workday™ deep work blocks.",
      "Confirm your Power Down times for Monday through Thursday.",
      "Clear your inbox to zero before Sunday evening.",
      "Lay out anything you need for Monday morning — clothes, notebook, coffee setup.",
      "Go to bed at your optimal time so Monday begins from a full tank.",
    ],
    workspacePriorities: ["Week Design Ritual", "Priority Preview", "Schedule Protection", "Power Down Planning"],
    primaryCta: {
      label: "Design My Week™",
      action: "design-week",
      href: "/my-harmony",
    },
    accent: { color: "#C8A84B", label: "Warm Gold" },
    isBusinessDay: false,
    isTimeFreedom: true,
  },
}

/**
 * Returns the full HarmonyDayTheme for the given day-of-week.
 * `dayOfWeek` uses the JS convention: 0 = Sunday … 6 = Saturday.
 * Never throws — invalid values fall back to Monday.
 */
export function getHarmonyDayTheme(dayOfWeek: number): HarmonyDayTheme {
  return THEMES[dayOfWeek] ?? THEMES[1]
}

/**
 * Returns the HarmonyDayTheme for the current system clock day.
 * Client-side only — do not call during SSR.
 */
export function getCurrentHarmonyDayTheme(): HarmonyDayTheme {
  return getHarmonyDayTheme(new Date().getDay())
}

/**
 * Time Freedom™ window: Thu 17:00 → Mon 07:00 (exclusive).
 *
 * Returns `true` when the founder is inside their protected Time Freedom™
 * weekend — meaning the operating schedule should show no CEO Workday blocks.
 *
 * The exact boundary is:
 *   • Thursday   17:00+ (≥ 1020 minutesSinceMidnight)
 *   • Friday     all day
 *   • Saturday   all day
 *   • Sunday     all day
 *   • Monday     00:00–06:59 (< 420 minutesSinceMidnight)
 *
 * @param dayOfWeek           JS day index: 0 = Sunday … 6 = Saturday
 * @param minutesSinceMidnight Current minutes since midnight (0–1439)
 */
export function isTimeFreedomNow(dayOfWeek: number, minutesSinceMidnight: number): boolean {
  switch (dayOfWeek) {
    case 4: // Thursday — Time Freedom starts at 5:00 PM (minute 1020)
      return minutesSinceMidnight >= 17 * 60
    case 5: // Friday   — always Time Freedom
    case 6: // Saturday — always Time Freedom
    case 0: // Sunday   — always Time Freedom
      return true
    case 1: // Monday   — Time Freedom ends at 7:00 AM (minute 420)
      return minutesSinceMidnight < 7 * 60
    default: // Tuesday, Wednesday — always business day
      return false
  }
}
