/**
 * Harmony Lane™ Events Catalog
 * --------------------------------
 * Static catalog of all 6 community event categories.
 * Accent colors are chosen from the brand palette:
 *   Green  #5D9D61  — work / productivity sessions
 *   Coral  #E26C73  — community / circle sessions
 *   Blue   #4A7FA5  — Monday sync / strategy
 *   Amber  #C6924A  — workshops / masterclasses
 *   Plum   #7C5C8A  — special events
 *   Sage   #8AAF8C  — office hours
 */
import type { HarmonyEvent } from "./types"

export const EVENTS_CATALOG: HarmonyEvent[] = [
  {
    id: "live-co-working",
    category: "live-co-working",
    title: "Live Co-Working™",
    tagline: "Work alongside fellow founders inside your protected 4-Hour CEO Workday™.",
    description:
      "Every weekday from 1:00–5:00 PM ET, the virtual co-working room opens so you can do your deepest work in community. No agenda, no presentations — just focused execution alongside other founders who are doing the same. Cherry Blossom™ is available throughout to offer real-time support, clarity, and momentum nudges.",
    schedule: {
      label: "Mon–Thu, 1:00–5:00 PM ET",
      pattern: "weekdays",
      days: "Monday–Thursday",
      timeRange: "1:00–5:00 PM ET",
      nextSessionLabel: "Today · 1:00 PM ET",
    },
    duration: "4 Hours",
    host: {
      name: "Barbara Turley",
      role: "Founder, Harmony Lane™",
    },
    seats: "Open",
    joinHref: "https://us05web.zoom.us/j/2648726290?pwd=ubrd71NpIvu9tEkwDbvxQ9uaiuIIpS.1",
    accentColor: "#5D9D61",
    tintRgb: "238 247 239",
    cherryBlossomMessage:
      "Before you enter the room, take one breath. Set your one non-negotiable outcome for this session. I am here with you.",
    requiresRegistration: false,
    prepItems: [
      {
        label: "Set your session intention",
        description: "Identify the single most important outcome you will achieve in this block.",
      },
      {
        label: "Clear your environment",
        description: "Close unrelated tabs, silence notifications, and prepare your physical workspace.",
      },
      {
        label: "Hydrate and move",
        description: "A two-minute walk before sitting down significantly improves focus quality.",
      },
    ],
  },
  {
    id: "monday-sync",
    category: "monday-sync",
    title: "Monday Synchronization™",
    tagline: "Open your week with intention, alignment, and your Harmony Week™ operating plan.",
    description:
      "Every Monday morning during Early Access™, founders gather to synchronize their week — reviewing priorities, declaring their weekly non-negotiables, and aligning with the Harmony Week™ rhythm. This is the weekly install moment: walk in with scattered to-dos, leave with a clean operating plan.",
    schedule: {
      label: "Every Monday, 7:00–9:00 AM ET",
      pattern: "weekly",
      days: "Monday",
      timeRange: "7:00–9:00 AM ET",
      nextSessionLabel: "Mon · 7:00 AM ET",
    },
    duration: "Up to 2 Hours",
    host: {
      name: "Barbara Turley",
      role: "Founder, Harmony Lane™",
    },
    seats: "Open",
    joinHref: "https://us05web.zoom.us/j/2648726290?pwd=ubrd71NpIvu9tEkwDbvxQ9uaiuIIpS.1",
    accentColor: "#4A7FA5",
    tintRgb: "236 244 251",
    requiresRegistration: false,
    prepItems: [
      {
        label: "Review last week",
        description: "Spend five minutes reviewing what you completed, what shifted, and what carries forward.",
      },
      {
        label: "Identify your weekly non-negotiables",
        description: "Three things that must happen this week for you to call it a success.",
      },
      {
        label: "Block your CEO Workday™ sessions",
        description: "Protect your 1–5 PM Monday–Thursday windows before the week fills in.",
      },
    ],
  },
  {
    id: "office-hours",
    category: "office-hours",
    title: "Founder Office Hours™",
    tagline: "Live Q&A with Barbara — bring your real challenges, leave with real clarity.",
    description:
      "Twice a week, Barbara opens the room to answer founder questions in real time. No pre-screening, no topic limits — bring the thing that is slowing you down, costing you time, or keeping you stuck. Office Hours are structured as hot-seat coaching: one founder at a time, everyone learns.",
    schedule: {
      label: "Tue & Thu, 9:00–10:30 AM ET",
      pattern: "weekly",
      days: "Tuesday & Thursday",
      timeRange: "9:00–10:30 AM ET",
      nextSessionLabel: "Tue · 9:00 AM ET",
    },
    duration: "90 Minutes",
    host: {
      name: "Barbara Turley",
      role: "Founder, Harmony Lane™",
    },
    seats: "Open",
    joinHref: "https://us05web.zoom.us/j/2648726290?pwd=ubrd71NpIvu9tEkwDbvxQ9uaiuIIpS.1",
    accentColor: "#8AAF8C",
    tintRgb: "239 246 240",
    requiresRegistration: false,
    prepItems: [
      {
        label: "Write your question before joining",
        description: "The clearer your question, the more useful the answer. Write one sentence.",
      },
      {
        label: "Include context",
        description: "Share what you have already tried or what is making the situation difficult.",
      },
    ],
  },
  {
    id: "founder-circle",
    category: "founder-circle",
    title: "Founder Circle™",
    tagline: "Small-group peer accountability for founders building inside the Operating System™.",
    description:
      "Founder Circle™ is a curated peer cohort experience — groups of six to eight founders meet bi-weekly to share progress, hold each other accountable, and provide perspective on business challenges. Circles are matched by stage and industry for maximum relevance. Facilitated by a Circle Lead.",
    schedule: {
      label: "Bi-weekly (cohort-assigned day)",
      pattern: "bi-weekly",
      days: "Cohort assigned",
      timeRange: "60 Minutes",
      nextSessionLabel: "See your cohort schedule",
    },
    duration: "60 Minutes",
    host: {
      name: "Circle Lead",
      role: "Peer Facilitation",
    },
    seats: "6–8 per circle",
    joinHref: "https://us05web.zoom.us/j/2648726290?pwd=ubrd71NpIvu9tEkwDbvxQ9uaiuIIpS.1",
    accentColor: "#E26C73",
    tintRgb: "252 241 239",
    requiresRegistration: true,
    prepItems: [
      {
        label: "Prepare a two-minute update",
        description: "Progress since last meeting, biggest win, current challenge.",
      },
      {
        label: "Bring your ask",
        description: "What specific input, perspective, or accountability would help you most right now?",
      },
      {
        label: "Show up consistently",
        description: "Circles only work when all members are present. If you cannot attend, notify your Lead in advance.",
      },
    ],
  },
  {
    id: "workshop",
    category: "workshop",
    title: "Workshops & Masterclasses™",
    tagline: "Deep-dive skills sessions on the tools, systems, and decisions that drive sustainable growth.",
    description:
      "Monthly live workshops and quarterly masterclasses cover the practical skills behind the Operating System™ — AI augmentation workflows, financial clarity, team leadership, marketing with boundaries, and more. Each session includes a workbook, live Q&A, and a replay in the member library.",
    schedule: {
      label: "Monthly (see events calendar)",
      pattern: "monthly",
      days: "Varies",
      timeRange: "2 Hours",
      nextSessionLabel: "See calendar for next session",
    },
    duration: "2 Hours",
    host: {
      name: "Barbara Turley + Guests",
      role: "Expert Facilitation",
    },
    seats: "Open",
    joinHref: "https://us05web.zoom.us/j/2648726290?pwd=ubrd71NpIvu9tEkwDbvxQ9uaiuIIpS.1",
    accentColor: "#C6924A",
    tintRgb: "252 244 234",
    requiresRegistration: true,
    prepItems: [
      {
        label: "Download the workbook",
        description: "Available 24 hours before the session in the member resources folder.",
      },
      {
        label: "Prepare one specific goal",
        description: "Identify the one change you want to implement immediately after the session.",
      },
    ],
  },
  {
    id: "special",
    category: "special",
    title: "Special Events™",
    tagline: "Retreats, intensives, and seasonal celebrations for the Harmony Lane™ community.",
    description:
      "Throughout the year, Harmony Lane™ hosts immersive special events — virtual retreats, quarterly review intensives, seasonal celebrations, and milestone recognition ceremonies. These are community-defining moments designed to deepen your commitment to the Operating System™ and celebrate how far you have come.",
    schedule: {
      label: "Quarterly + seasonal",
      pattern: "one-time",
      days: "Varies",
      timeRange: "Half-day to Full-day",
      nextSessionLabel: "See events calendar",
    },
    duration: "Varies",
    host: {
      name: "Barbara Turley",
      role: "Founder, Harmony Lane™",
    },
    seats: "Limited",
    joinHref: "https://us05web.zoom.us/j/2648726290?pwd=ubrd71NpIvu9tEkwDbvxQ9uaiuIIpS.1",
    accentColor: "#7C5C8A",
    tintRgb: "245 240 250",
    requiresRegistration: true,
    prepItems: [
      {
        label: "Register early",
        description: "Special Events™ have limited capacity and historically sell out.",
      },
      {
        label: "Block your calendar",
        description: "Protect the full session window — these events are designed to be experienced without interruption.",
      },
    ],
  },
]

/** Fast lookup by event id. */
export const EVENTS_BY_ID: Record<string, HarmonyEvent> = Object.fromEntries(
  EVENTS_CATALOG.map((e) => [e.id, e]),
)

/** Get all events for a specific category. */
export function getEventsByCategory(category: string): HarmonyEvent[] {
  return EVENTS_CATALOG.filter((e) => e.category === category)
}

/** Category display labels. */
export const CATEGORY_LABELS: Record<string, string> = {
  all: "All Events",
  "live-co-working": "Live Co-Working™",
  "monday-sync": "Monday Sync™",
  "office-hours": "Office Hours™",
  "founder-circle": "Founder Circle™",
  workshop: "Workshops™",
  special: "Special Events™",
}
