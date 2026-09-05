/**
 * Harmony Lane™ Community Highlights
 * ------------------------------------
 * 12 curated static highlight entries shown in the Community Highlights section.
 * These are hand-crafted to represent the spirit of the community.
 * No localStorage reads — purely static.
 */

import type { ActivityEntry } from "./types"

export const COMMUNITY_HIGHLIGHTS: ActivityEntry[] = [
  // ── Co-Working Wins ──────────────────────────────────────────────────────
  {
    id: "highlight-cowork-1",
    category: "highlight",
    title: "4-Hour CEO Workday™ — Day 14",
    summary:
      "Completed a full uninterrupted co-working block. Shipped the proposal, closed the discovery call, and still had time for lunch away from the desk.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#5D9D61", phase: "CEO Workday™" },
  },
  {
    id: "highlight-cowork-2",
    category: "highlight",
    title: "First Live Co-Working Session",
    summary:
      "Showed up for the first time today. The accountability of working alongside other founders made the difference — best focus block in months.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#5D9D61", phase: "CEO Workday™" },
  },

  // ── Time Freedom Celebrations ─────────────────────────────────────────────
  {
    id: "highlight-tf-1",
    category: "win",
    title: "First Full Time Freedom™ Weekend",
    summary:
      "Did not open the laptop once from Thursday 5 PM to Monday 7 AM. Woke up Monday feeling genuinely excited to work — that has not happened in two years.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#7C5C8A", phase: "Time Freedom™" },
  },
  {
    id: "highlight-tf-2",
    category: "win",
    title: "Consecutive Time Freedom™ Weekends: 4",
    summary:
      "Four consecutive protected weekends. My family noticed before I did. My youngest asked if I was on holiday every week now.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#7C5C8A", phase: "Time Freedom™" },
  },

  // ── Monday Synchronization Highlights ────────────────────────────────────
  {
    id: "highlight-monday-1",
    category: "highlight",
    title: "Monday Sync Changed My Whole Week",
    summary:
      "Came in with six priorities, left with one. The clarity from the synchronization call shaped the entire week's output. Everything else can wait.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#4A7FA5", phase: "Monday Synchronization™" },
  },
  {
    id: "highlight-monday-2",
    category: "highlight",
    title: "Week 3 Sync — Non-Negotiable Locked",
    summary:
      "Declared my weekly non-negotiable publicly for the first time. Having witnesses made it real. I actually did it by Wednesday.",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#4A7FA5", phase: "Monday Synchronization™" },
  },

  // ── Harmony Score Milestones ──────────────────────────────────────────────
  {
    id: "highlight-score-1",
    category: "win",
    title: "Harmony Score™ Crossed 70",
    summary:
      "Six weeks in. Score moved from 48 to 73. The score did not change when I worked harder — it moved when I stopped overriding my own boundaries.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#C6924A", phase: "Executive Review™" },
  },
  {
    id: "highlight-score-2",
    category: "win",
    title: "First Positive Weekly Review",
    summary:
      "Generated my first Weekly Executive Review. Seeing the numbers written down made the progress undeniable. I stopped second-guessing the process.",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#C6924A", phase: "Executive Review™" },
  },

  // ── Morning Routine ───────────────────────────────────────────────────────
  {
    id: "highlight-morning-1",
    category: "checkin",
    title: "Morning GIV-EN™ Streak: 21 Days",
    summary:
      "Three weeks of consistent Morning GIV-EN™ blocks. The morning structure is now automatic — I am not deciding to do it anymore, I just do it.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#8AAF8C", phase: "Morning GIV-EN™" },
  },
  {
    id: "highlight-morning-2",
    category: "checkin",
    title: "Early Access™ at 7 AM on a Monday",
    summary:
      "I used to dread Monday mornings. Today I was online at 7:02 AM, calendar clear, coffee ready. The structure removed the dread entirely.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#8AAF8C", phase: "Early Access™" },
  },

  // ── Power Down Highlights ─────────────────────────────────────────────────
  {
    id: "highlight-pd-1",
    category: "highlight",
    title: "Power Down™ Changed My Sleep",
    summary:
      "Two weeks of consistent Power Down™ blocks. I fell asleep before midnight for the first time in a year. The quality of morning focus the next day was different.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#6B8CAE", phase: "Power Down™" },
  },
  {
    id: "highlight-pd-2",
    category: "highlight",
    title: "Community Accountability Made It Real",
    summary:
      "I told the community I would be offline by 10 PM. That public commitment was the only thing that worked after months of trying alone.",
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { accent: "#6B8CAE", phase: "Power Down™" },
  },
]
