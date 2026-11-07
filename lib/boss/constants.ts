import type {
  AuthLevel,
  BusinessFunction,
  PermissionStatus,
  Priority,
  ResourceCategory,
  WorkStatus,
} from "./types"

export const FUNCTIONS: { id: BusinessFunction; label: string; short: string; purpose: string; tone: string }[] = [
  {
    id: "attraction",
    label: "Client Attraction",
    short: "Attraction",
    purpose: "Help the right people find you.",
    tone: "bg-brand-blush text-brand-coral-dark border-brand-coral/30",
  },
  {
    id: "sales",
    label: "Sales & Conversion",
    short: "Sales",
    purpose: "Help people say yes and buy.",
    tone: "bg-brand-tan-light text-brand-tan-dark border-brand-tan/40",
  },
  {
    id: "delivery",
    label: "Service or Product Delivery",
    short: "Delivery",
    purpose: "Give people what you promised.",
    tone: "bg-brand-sage-light text-brand-green-dark border-brand-green/30",
  },
  {
    id: "operations",
    label: "Business Operations",
    short: "Operations",
    purpose: "Keep the business running each day.",
    tone: "bg-muted text-brand-ink-soft border-border",
  },
  {
    id: "design",
    label: "Business Operations Design & Redesign",
    short: "Design & Redesign",
    purpose: "Make the way you work better.",
    tone: "bg-card text-brand-green-dark border-brand-green/40",
  },
  {
    id: "experiences",
    label: "Workshops & Webinars",
    short: "Workshops & Webinars",
    purpose: "Build trust through live experiences.",
    tone: "bg-brand-blush text-brand-green-dark border-brand-tan/40",
  },
  {
    id: "own_work",
    label: "Other — Bring & Create Your Own Work",
    short: "Own Work",
    purpose: "Your projects and ideas, done your way.",
    tone: "bg-brand-sage-light text-brand-tan-dark border-brand-tan/40",
  },
]

export const fnMeta = (fn: BusinessFunction) => FUNCTIONS.find((f) => f.id === fn) ?? FUNCTIONS[0]

export const PRIORITIES: { id: Priority; label: string; weight: number }[] = [
  { id: "critical", label: "Must do", weight: 4 },
  { id: "high", label: "High", weight: 3 },
  { id: "medium", label: "Medium", weight: 2 },
  { id: "low", label: "Low", weight: 1 },
]

export const LIFECYCLE: WorkStatus[] = [
  "captured",
  "defined",
  "planned",
  "authorized",
  "assigned",
  "in_progress",
  "under_review",
  "completed",
]

export const EXCEPTIONS: WorkStatus[] = [
  "blocked",
  "awaiting_approval",
  "awaiting_external",
  "on_hold",
  "cancelled",
  "failed",
]

export const STATUS_LABEL: Record<WorkStatus, string> = {
  captured: "New",
  defined: "Written down",
  planned: "Planned",
  authorized: "Allowed",
  assigned: "Given out",
  in_progress: "Doing now",
  under_review: "Ready to check",
  completed: "Done",
  blocked: "Stuck",
  awaiting_approval: "Needs your OK",
  awaiting_external: "Waiting on someone",
  on_hold: "Paused",
  cancelled: "Stopped",
  failed: "Did not work",
}

export const OPEN_STATUSES: WorkStatus[] = [
  "captured",
  "defined",
  "planned",
  "authorized",
  "assigned",
  "in_progress",
  "under_review",
  "blocked",
  "awaiting_approval",
  "awaiting_external",
  "on_hold",
]

export const isClosed = (s: WorkStatus) => s === "completed" || s === "cancelled" || s === "failed"

export const CATEGORIES: { id: ResourceCategory; label: string; description: string }[] = [
  { id: "founder", label: "Founder", description: "You. You make the final call." },
  { id: "employee", label: "Team Members", description: "People who work for you." },
  {
    id: "contractor",
    label: "Contractors & Helpers",
    description: "People you hire for one kind of job.",
  },
  {
    id: "external",
    label: "Outside Partners",
    description: "People and groups outside your business. You can ask. They choose.",
  },
  {
    id: "ai",
    label: "AI Agents & AI Tools",
    description: "Computer helpers that do tasks you allow.",
  },
  {
    id: "automation",
    label: "Automatic Tools",
    description: "Tools that do the same steps each time.",
  },
]

export const AUTH_LEVELS: { id: AuthLevel; label: string; rank: number; description: string }[] = [
  { id: "research", label: "Look up", rank: 1, description: "Research. Find facts and sum them up. Nothing leaves your business." },
  { id: "prepare", label: "Get ready", rank: 2, description: "Prepare. Make a first try for you to check. It cannot send or post." },
  {
    id: "approved_execution",
    label: "Do after your OK",
    rank: 3,
    description: "Approved Execution. It does the job only after you say yes each time.",
  },
  {
    id: "preauthorized_execution",
    label: "Do within limits",
    rank: 4,
    description: "Pre-authorized Execution. It does the job on its own, inside the limits you set.",
  },
]

export const levelMeta = (l: AuthLevel) => AUTH_LEVELS.find((a) => a.id === l) ?? AUTH_LEVELS[0]

export const PERMISSION_STATUS_LABEL: Record<PermissionStatus, string> = {
  authorized: "Allowed",
  awaiting_approval: "Needs your OK",
  not_authorized: "Not allowed",
  suspended: "Paused",
  expired: "Ended",
}

export const WORKDAY_START = 13 * 60
export const WORKDAY_END = 17 * 60
export const FOUNDER_CAPACITY_MINS = 240

export const BUSINESS_DAY_SEQUENCE = [
  { name: "Flex-Time™", time: "7:00–9:00 AM · optional" },
  { name: "Work-Life Balance Reality Check™", time: "Monday only" },
  { name: "Decide & Design My Business Day™", time: "Monday–Thursday" },
  { name: "Morning GIV•EN™ Routine™", time: "9:45–10:30 AM" },
  { name: "30-Minute Movement Window™", time: "10:30–11:00 AM" },
  { name: "Extended Healthy Hybrid Lunch Break™", time: "11:00 AM–1:00 PM" },
  { name: "4-Hour Focused CEO Workday™", time: "1:00–5:00 PM ET" },
  { name: "Time Freedom™", time: "Begins 5:00 PM" },
  { name: "Power Down™", time: "Evening" },
  { name: "The Unplug Digital Detox™", time: "Disconnect & recover" },
]
