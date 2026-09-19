/**
 * Harmony Lane™ Community Data
 * ------------------------------
 * Static data for discussions, challenges, member profiles, and groups.
 * No localStorage reads — purely static.
 */

import type { Discussion, Challenge, MemberProfile, AccountabilityGroup } from "./types"

// ─── Discussions ──────────────────────────────────────────────────────────────

export const STATIC_DISCUSSIONS: Discussion[] = [
  {
    id: "disc-morning-given",
    space: "Morning GIV-EN™",
    title: "What is your single most important Morning GIV-EN™ practice?",
    pinnedResource: {
      label: "Morning GIV-EN™ Guide",
      href: "https://www.facebook.com/groups/maketimeformore",
    },
    replyCount: 47,
    lastActivityAt: "23 minutes ago",
    accentColor: "#8AAF8C",
  },
  {
    id: "disc-4hr-workday",
    space: "4-Hour CEO Workday™",
    title: "How do you protect your CEO Workday from scope creep?",
    pinnedResource: {
      label: "Operating Rules™ Framework",
      href: "https://www.facebook.com/groups/maketimeformore",
    },
    replyCount: 63,
    lastActivityAt: "1 hour ago",
    accentColor: "#5D9D61",
  },
  {
    id: "disc-time-freedom",
    space: "Time Freedom™",
    title: "Share your first genuine Time Freedom™ weekend — what changed?",
    replyCount: 89,
    lastActivityAt: "3 hours ago",
    accentColor: "#7C5C8A",
  },
  {
    id: "disc-harmony-score",
    space: "Harmony Score™",
    title: "What moved your score the most in the first 30 days?",
    replyCount: 54,
    lastActivityAt: "5 hours ago",
    accentColor: "#C6924A",
  },
  {
    id: "disc-operating-rules",
    space: "Operating Rules™",
    title: "Which Operating Rule™ was hardest to install — and why?",
    pinnedResource: {
      label: "Rules Library",
      href: "https://www.facebook.com/groups/maketimeformore",
    },
    replyCount: 38,
    lastActivityAt: "Yesterday",
    accentColor: "#4A7FA5",
  },
  {
    id: "disc-power-down",
    space: "Power Down™",
    title: "What does your Power Down™ ritual actually look like?",
    replyCount: 72,
    lastActivityAt: "Yesterday",
    accentColor: "#6B8CAE",
  },
  {
    id: "disc-monday-sync",
    space: "Monday Synchronization™",
    title: "What is the one thing you always declare at Monday Sync?",
    replyCount: 31,
    lastActivityAt: "2 days ago",
    accentColor: "#4A7FA5",
  },
]

// ─── Challenges ───────────────────────────────────────────────────────────────

export const STATIC_CHALLENGES: Challenge[] = [
  {
    id: "challenge-21day-morning",
    title: "21-Day Morning GIV-EN™ Challenge",
    description:
      "Complete 21 consecutive Morning GIV-EN™ blocks. No skipping, no partial credit. Done or not done.",
    progress: 62,
    participants: 143,
    daysRemaining: 8,
    isCompleted: false,
    accentColor: "#8AAF8C",
  },
  {
    id: "challenge-tf-streak",
    title: "4 Consecutive Time Freedom™ Weekends",
    description:
      "Protect four consecutive Thu 5 PM → Mon 7 AM windows. No laptop. No business messages.",
    progress: 75,
    participants: 89,
    daysRemaining: 6,
    isCompleted: false,
    accentColor: "#7C5C8A",
  },
  {
    id: "challenge-coworking-10",
    title: "10 Live Co-Working™ Sessions",
    description:
      "Attend 10 live co-working sessions in a single month. Each session must be a full block.",
    progress: 40,
    participants: 217,
    daysRemaining: 14,
    isCompleted: false,
    accentColor: "#5D9D61",
  },
  {
    id: "challenge-power-down",
    title: "14-Day Power Down™ at 10 PM",
    description:
      "Devices off and Power Down™ block started by 10 PM for 14 consecutive nights.",
    progress: 86,
    participants: 68,
    daysRemaining: 2,
    isCompleted: false,
    accentColor: "#6B8CAE",
  },
  {
    id: "challenge-first-review",
    title: "Generate Your First Executive Review",
    description:
      "Generate a Weekly Executive Review™ before this Friday and share one insight with the community.",
    progress: 53,
    participants: 112,
    daysRemaining: 4,
    isCompleted: false,
    accentColor: "#C6924A",
  },
]

// ─── Member Profiles ──────────────────────────────────────────────────────────

export const STATIC_MEMBERS: MemberProfile[] = [
  {
    id: "member-1",
    firstName: "Sarah",
    business: "Brand Strategy Studio",
    industry: "Creative Services",
    harmonyPhase: "Week 6",
    joinedSince: "October 2024",
    favoriteActivity: "Live Co-Working™",
    inDirectory: true,
    accentColor: "#5D9D61",
  },
  {
    id: "member-2",
    firstName: "Marcus",
    business: "Operations Consulting",
    industry: "Business Services",
    harmonyPhase: "Month 3",
    joinedSince: "August 2024",
    favoriteActivity: "Monday Synchronization™",
    inDirectory: true,
    accentColor: "#4A7FA5",
  },
  {
    id: "member-3",
    firstName: "Priya",
    business: "Wellness Coaching",
    industry: "Health & Wellness",
    harmonyPhase: "Week 2",
    joinedSince: "January 2025",
    favoriteActivity: "Morning GIV-EN™",
    inDirectory: true,
    accentColor: "#8AAF8C",
  },
  {
    id: "member-4",
    firstName: "James",
    business: "E-commerce Brand",
    industry: "Retail",
    harmonyPhase: "Quarter 2",
    joinedSince: "June 2024",
    favoriteActivity: "Time Freedom™ Weekend",
    inDirectory: true,
    accentColor: "#7C5C8A",
  },
  {
    id: "member-5",
    firstName: "Amara",
    business: "Digital Marketing Agency",
    industry: "Marketing",
    harmonyPhase: "Month 2",
    joinedSince: "November 2024",
    favoriteActivity: "Live Co-Working™",
    inDirectory: true,
    accentColor: "#E26C73",
  },
  {
    id: "member-6",
    firstName: "Claire",
    business: "Executive Coaching",
    industry: "Professional Development",
    harmonyPhase: "Month 5",
    joinedSince: "July 2024",
    favoriteActivity: "Monday Synchronization™",
    inDirectory: true,
    accentColor: "#C6924A",
  },
  {
    id: "member-7",
    firstName: "David",
    business: "SaaS Startup",
    industry: "Technology",
    harmonyPhase: "Week 3",
    joinedSince: "February 2025",
    favoriteActivity: "Morning GIV-EN™",
    inDirectory: true,
    accentColor: "#4A7FA5",
  },
  {
    id: "member-8",
    firstName: "Natalie",
    business: "Photography Studio",
    industry: "Creative Services",
    harmonyPhase: "Month 4",
    joinedSince: "September 2024",
    favoriteActivity: "Power Down™",
    inDirectory: true,
    accentColor: "#6B8CAE",
  },
]

// ─── Accountability Groups ────────────────────────────────────────────────────

export const STATIC_GROUPS: AccountabilityGroup[] = [
  {
    id: "group-morning",
    name: "Morning Founders",
    description:
      "Early risers committed to the Morning GIV-EN™ block as the cornerstone of their operating day.",
    memberCount: 34,
    upcomingSession: "Monday · 7:00 AM ET",
    recentActivity: "21-day streak check-in",
    accentColor: "#8AAF8C",
  },
  {
    id: "group-ceo-workday",
    name: "CEO Workday Collective",
    description:
      "Founders protecting their 4-Hour CEO Workday™ and showing up for Live Co-Working™ sessions together.",
    memberCount: 58,
    upcomingSession: "Today · 1:00 PM ET",
    recentActivity: "Co-working session recap",
    accentColor: "#5D9D61",
  },
  {
    id: "group-time-freedom",
    name: "Time Freedom™ Circle",
    description:
      "Committed to protecting the Thu 5 PM → Mon 7 AM window — sharing wins, accountability, and Sunday prep notes.",
    memberCount: 41,
    upcomingSession: "Thursday · 4:30 PM ET",
    recentActivity: "Weekend intention-setting",
    accentColor: "#7C5C8A",
  },
  {
    id: "group-reviews",
    name: "Weekly Review Crew",
    description:
      "Generating and sharing Executive Reviews™ every week. This group treats the review as non-negotiable.",
    memberCount: 27,
    upcomingSession: "Friday · 4:00 PM ET",
    recentActivity: "Q1 review comparison",
    accentColor: "#C6924A",
  },
  {
    id: "group-new-members",
    name: "Installation Cohort",
    description:
      "New members in their first 30 days, installing the Operating System™ together with peer support.",
    memberCount: 19,
    upcomingSession: "Wednesday · 12:00 PM ET",
    recentActivity: "Week 1 onboarding debrief",
    accentColor: "#4A7FA5",
  },
]
