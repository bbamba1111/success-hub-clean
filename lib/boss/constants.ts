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
    purpose: "Help the right people discover and connect with the business.",
    tone: "bg-brand-blush text-brand-coral-dark border-brand-coral/30",
  },
  {
    id: "sales",
    label: "Sales & Conversion",
    short: "Sales",
    purpose: "Help interested prospects decide to become customers or clients.",
    tone: "bg-brand-tan-light text-brand-tan-dark border-brand-tan/40",
  },
  {
    id: "delivery",
    label: "Service or Product Delivery",
    short: "Delivery",
    purpose: "Deliver what the business promised.",
    tone: "bg-brand-sage-light text-brand-green-dark border-brand-green/30",
  },
  {
    id: "operations",
    label: "Business Operations",
    short: "Operations",
    purpose: "Manage the ongoing activities that keep the business functioning.",
    tone: "bg-muted text-brand-ink-soft border-border",
  },
  {
    id: "design",
    label: "Business Operations Design & Redesign",
    short: "Design & Redesign",
    purpose: "Improve how the business operates.",
    tone: "bg-card text-brand-green-dark border-brand-green/40",
  },
]

export const fnMeta = (fn: BusinessFunction) => FUNCTIONS.find((f) => f.id === fn) ?? FUNCTIONS[0]

export const PRIORITIES: { id: Priority; label: string; weight: number }[] = [
  { id: "critical", label: "Critical", weight: 4 },
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
  captured: "Captured",
  defined: "Defined",
  planned: "Planned",
  authorized: "Authorized",
  assigned: "Assigned",
  in_progress: "In Progress",
  under_review: "Under Review",
  completed: "Completed",
  blocked: "Blocked",
  awaiting_approval: "Awaiting Approval",
  awaiting_external: "Awaiting External Response",
  on_hold: "On Hold",
  cancelled: "Cancelled",
  failed: "Failed",
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
  { id: "founder", label: "Founder", description: "The business owner and final authority." },
  { id: "employee", label: "Employees / Team Members", description: "People employed by the business." },
  {
    id: "contractor",
    label: "Contractors, VAs & Specialists",
    description: "Independent professionals engaged for defined scopes of work.",
  },
  {
    id: "external",
    label: "External Collaborators & Partners",
    description: "Independent organizations and people. Not under the founder's direct control.",
  },
  {
    id: "ai",
    label: "AI Agents & AI Tools",
    description: "AI capabilities coordinated by the Central AI Operations Coordinator.",
  },
  {
    id: "automation",
    label: "Automated Workflows & Systems",
    description: "Automations that execute predictable, pre-defined steps.",
  },
]

export const AUTH_LEVELS: { id: AuthLevel; label: string; rank: number; description: string }[] = [
  { id: "research", label: "Research", rank: 1, description: "Gather and summarize information. No outputs leave the business." },
  { id: "prepare", label: "Prepare", rank: 2, description: "Draft work for founder review. Cannot send, publish, or commit." },
  {
    id: "approved_execution",
    label: "Approved Execution",
    rank: 3,
    description: "Execute a specific action after the founder approves each instance.",
  },
  {
    id: "preauthorized_execution",
    label: "Pre-authorized Execution",
    rank: 4,
    description: "Execute a defined action within stated limits without per-instance approval.",
  },
]

export const levelMeta = (l: AuthLevel) => AUTH_LEVELS.find((a) => a.id === l) ?? AUTH_LEVELS[0]

export const PERMISSION_STATUS_LABEL: Record<PermissionStatus, string> = {
  authorized: "Authorized",
  awaiting_approval: "Awaiting Founder Approval",
  not_authorized: "Not Authorized",
  suspended: "Suspended",
  expired: "Expired",
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
