/**
 * The Render Engine™ — Renderer Catalog (Phase 5.3)
 * ---------------------------------------------------------------------------
 * Part of the Deliverable Output Architecture™. The Render Engine™ transforms a
 * single piece of Structured Business Content™ into many presentation formats.
 *
 * CORE PRINCIPLE: a deliverable exists ONCE as structured content and is
 * rendered MANY ways. A renderer is therefore never tied to a deliverable — any
 * deliverable declares which renderers it supports, and the Render Engine™ knows
 * how to produce each format.
 *
 * This module is intentionally data-only. No format is actually generated this
 * phase — adding a new renderer later is a matter of appending to RENDERERS and
 * implementing its transform, WITHOUT touching any deliverable definition.
 */

/** Every presentation format the Render Engine™ can (eventually) produce. */
export type RendererType =
  | "pdf"
  | "editable-document"
  | "email"
  | "presentation"
  | "spreadsheet"
  | "dashboard-card"
  | "checklist"
  | "calendar"
  | "web-page"
  | "markdown"
  | "slack-message"
  | "teams-message"
  | "notion-page"

export interface RendererDefinition {
  id: RendererType
  /** Human label for UI. */
  label: string
  /** What this renderer produces and when it's the right choice. */
  description: string
  /** lucide-react icon name, mapped to a component at the presentation layer. */
  icon: string
  /**
   * Reserved transform endpoint/handler key for a future phase. Not wired now —
   * declared so the architecture is ready without a redesign.
   */
  futureTransform: string
}

/**
 * RENDERERS — the Render Engine™ catalog, ordered document → data → messaging.
 * Order is presentation-only; lookups use the id.
 */
export const RENDERERS: RendererDefinition[] = [
  {
    id: "pdf",
    label: "PDF",
    description: "Professional branded documents — handbooks, SOPs, strategic plans, playbooks.",
    icon: "FileText",
    futureTransform: "render/pdf",
  },
  {
    id: "editable-document",
    label: "Editable Document",
    description: "Google Docs / Word-style documents meant to be refined — job descriptions, proposals, press releases.",
    icon: "FilePenLine",
    futureTransform: "render/editable-document",
  },
  {
    id: "email",
    label: "Email",
    description: "Ready-to-send messages — welcome emails, follow-ups, pitches, outreach.",
    icon: "Mail",
    futureTransform: "render/email",
  },
  {
    id: "presentation",
    label: "Presentation",
    description: "Slide decks — investor decks, training, workshops, keynotes.",
    icon: "Presentation",
    futureTransform: "render/presentation",
  },
  {
    id: "spreadsheet",
    label: "Spreadsheet",
    description: "Structured tabular models — budgets, forecasts, pricing, KPI trackers.",
    icon: "Table",
    futureTransform: "render/spreadsheet",
  },
  {
    id: "dashboard-card",
    label: "Dashboard Card",
    description: "At-a-glance summaries surfaced inside the app — business health, weekly priorities, CEO summary.",
    icon: "LayoutDashboard",
    futureTransform: "render/dashboard-card",
  },
  {
    id: "checklist",
    label: "Checklist",
    description: "Actionable step lists — onboarding, hiring, compliance, launch, closing.",
    icon: "ListChecks",
    futureTransform: "render/checklist",
  },
  {
    id: "calendar",
    label: "Calendar",
    description: "Time-based sequences — launch timelines, hiring timelines, editorial calendars.",
    icon: "CalendarDays",
    futureTransform: "render/calendar",
  },
  {
    id: "web-page",
    label: "Web Page",
    description: "Published pages — landing pages, sales pages, policy pages, knowledge pages.",
    icon: "Globe",
    futureTransform: "render/web-page",
  },
  {
    id: "markdown",
    label: "Markdown",
    description: "Portable plain-text structure — documentation, prompt libraries, developer notes.",
    icon: "Hash",
    futureTransform: "render/markdown",
  },
  {
    id: "slack-message",
    label: "Slack Message",
    description: "Formatted Slack posts — meeting rules, team operating rules, daily priorities.",
    icon: "MessageSquare",
    futureTransform: "render/slack-message",
  },
  {
    id: "teams-message",
    label: "Microsoft Teams Message",
    description: "Formatted Teams posts — announcements, operating rules, daily priorities.",
    icon: "MessagesSquare",
    futureTransform: "render/teams-message",
  },
  {
    id: "notion-page",
    label: "Notion Page",
    description: "Structured Notion pages — living documents, internal wikis, knowledge bases.",
    icon: "BookOpen",
    futureTransform: "render/notion-page",
  },
]

/** Look up a renderer definition by id. */
export function getRenderer(id: RendererType): RendererDefinition | undefined {
  return RENDERERS.find((r) => r.id === id)
}
