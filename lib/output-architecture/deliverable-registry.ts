/**
 * The Deliverable Engine™ — Registry & Structured Business Content™ (Phase 5.3)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for the Deliverable Output Architecture™.
 *
 * CORE PRINCIPLE: a deliverable exists ONCE as Structured Business Content™ and
 * is rendered MANY ways. A PDF is just one possible output. No deliverable is
 * ever tied to a single file type.
 *
 *   Executive / Advisor
 *        ↓
 *   Deliverable Engine™        ← this file: structured content + definitions
 *        ↓
 *   Structured Business Content™
 *        ↓
 *   Render Engine™             ← render-engine.ts (format)
 *        ↓
 *   Distribution Engine™       ← distribution-engine.ts (destination)
 *
 * This module is intentionally data-only. NO AI generation, rendering, or
 * distribution is implemented this phase. Every future Executive™, Advisor™, and
 * Specialist™ publishes THROUGH this architecture without a redesign.
 */

import type { RendererType } from "./render-engine"
import type { DistributionMethod } from "./distribution-engine"
import type { ExecutionPath } from "./execution-engine"
import type { BusinessStage } from "@/lib/business-stage/business-stage"
import {
  ALL_COMMUNICATION_STYLES,
  type CommunicationStyle,
} from "@/lib/business-comprehension/business-comprehension"

/** Who owns a deliverable. Specialists arrive in a future phase. */
export type OwnerType = "executive" | "advisor" | "specialist"

/** The business domain a deliverable belongs to (grouping + filtering). */
export type DeliverableCategory =
  | "Strategy"
  | "Marketing & Brand"
  | "Sales"
  | "Operations"
  | "Finance"
  | "People & Culture"
  | "Legal"
  | "Compliance"

/** Lifecycle of a deliverable within the architecture. */
export type DeliverableStatus = "architecture"

/**
 * A block of Structured Business Content™. Deliverables are structured FIELDS,
 * not static text — this is what lets one deliverable render as a PDF, a Slack
 * message, or a checklist. Content is authored by a future AI/Deliverable phase;
 * the shape is defined now so renderers can be built against it.
 */
export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "checklist"; items: string[] }
  | { type: "table"; columns: string[]; rows: string[][] }
  | { type: "keyValue"; pairs: { label: string; value: string }[] }

/** A section of Structured Business Content™ — a titled group of blocks. */
export interface ContentSection {
  id: string
  heading: string
  blocks: ContentBlock[]
}

/**
 * Structured Business Content™ — the format-independent representation of a
 * deliverable. Rendered many ways by the Render Engine™. Populated by a future
 * generation phase; optional on definitions today.
 */
export interface StructuredBusinessContent {
  title: string
  summary: string
  sections: ContentSection[]
}

/**
 * A Deliverable definition. Describes WHAT the deliverable is and HOW it can be
 * rendered, distributed, and executed — never the file itself.
 */
export interface Deliverable {
  /** Stable identifier — safe for routing, storage, and future generators. */
  id: string
  /** Deliverable name (e.g. "Job Description"). */
  name: string
  /** Business domain for grouping and filtering. */
  category: DeliverableCategory
  /** Which kind of owner produces this. */
  ownerType: OwnerType
  /** The owning executive/advisor id (references those registries). */
  ownerId: string
  /** One-line description for previews and summaries. */
  description: string
  /** The default execution level this deliverable is delivered at. */
  deliveryLevel: ExecutionPath
  /** Rough time-to-produce estimate, for planning UIs. */
  estimatedTime: string
  /** Whether outputs must carry a professional-review disclaimer. */
  requiresProfessionalReview: boolean
  /** The disclaimer text, when review is required. */
  professionalNotice?: string
  /** Every renderer this deliverable supports (Render Engine™). */
  supportedRenderers: RendererType[]
  /** The default/recommended renderer. Must be in supportedRenderers. */
  recommendedRenderer: RendererType
  /** Supported delivery destinations (Distribution Engine™). */
  distributionOptions: DistributionMethod[]
  /** Supported execution paths (who does the work). */
  executionOptions: ExecutionPath[]
  /**
   * Business Stages™ where this deliverable is MOST relevant. It remains
   * available at every stage — this only declares emphasis for a future phase.
   * See lib/business-stage.
   */
  recommendedBusinessStages: BusinessStage[]
  /**
   * Business Comprehension™ Communication Styles™ this deliverable can adapt to.
   * EVERY deliverable supports EVERY style — the business content stays the
   * same; only the INSTRUCTIONAL text (how it's explained) adapts. A future
   * phase will render the same Structured Business Content™ with wording tuned
   * to the founder's chosen style. See lib/business-comprehension.
   */
  supportedCommunicationStyles: CommunicationStyle[]
  /** The Structured Business Content™, when authored (future). */
  content?: StructuredBusinessContent
  /** Reserved generator endpoint for a future AI phase. Not wired now. */
  futureGenerator: string
  /** Lifecycle status within the architecture. */
  status: DeliverableStatus
}

/**
 * DELIVERABLES — a representative seed set spanning owners, categories, and
 * renderers. This is NOT the full catalog; it establishes the architecture and
 * demonstrates that one content model serves every format and destination.
 */
export const DELIVERABLES: Deliverable[] = [
  {
    id: "job-description",
    name: "Job Description",
    category: "People & Culture",
    ownerType: "executive",
    ownerId: "people-culture",
    description: "A clear, structured role definition ready to refine and post.",
    deliveryLevel: "ai-assisted",
    estimatedTime: "~10 min",
    requiresProfessionalReview: false,
    supportedRenderers: ["editable-document", "pdf", "web-page"],
    recommendedRenderer: "editable-document",
    distributionOptions: ["download", "print", "email", "copy", "save-to-library", "share-with-team"],
    executionOptions: ["diy", "ai-assisted", "done-for-you"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_COMMUNICATION_STYLES,
    futureGenerator: "generate/job-description",
    status: "architecture",
  },
  {
    id: "meeting-rules",
    name: "Meeting Rules™",
    category: "Operations",
    ownerType: "executive",
    ownerId: "operations",
    description: "The operating standards that make every meeting focused and worth attending.",
    deliveryLevel: "ai-assisted",
    estimatedTime: "~5 min",
    requiresProfessionalReview: false,
    supportedRenderers: ["slack-message", "teams-message", "pdf", "dashboard-card"],
    recommendedRenderer: "slack-message",
    distributionOptions: ["slack", "teams", "share-with-team", "save-to-library", "download", "print"],
    executionOptions: ["diy", "ai-assisted"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_COMMUNICATION_STYLES,
    futureGenerator: "generate/meeting-rules",
    status: "architecture",
  },
  {
    id: "press-release",
    name: "Press Release",
    category: "Marketing & Brand",
    ownerType: "executive",
    ownerId: "marketing-brand",
    description: "A newsworthy announcement structured for editors and outreach.",
    deliveryLevel: "ai-assisted",
    estimatedTime: "~15 min",
    requiresProfessionalReview: false,
    supportedRenderers: ["editable-document", "pdf", "email"],
    recommendedRenderer: "editable-document",
    distributionOptions: ["download", "email", "copy", "save-to-library", "share-with-team"],
    executionOptions: ["diy", "ai-assisted", "done-with-you", "done-for-you"],
    recommendedBusinessStages: ["growth", "scale", "legacy"],
    supportedCommunicationStyles: ALL_COMMUNICATION_STYLES,
    futureGenerator: "generate/press-release",
    status: "architecture",
  },
  {
    id: "annual-budget",
    name: "Annual Budget",
    category: "Finance",
    ownerType: "executive",
    ownerId: "finance",
    description: "A structured operating budget with categories, assumptions, and totals.",
    deliveryLevel: "ai-assisted",
    estimatedTime: "~20 min",
    requiresProfessionalReview: false,
    supportedRenderers: ["spreadsheet", "pdf", "dashboard-card"],
    recommendedRenderer: "spreadsheet",
    distributionOptions: ["download", "email", "save-to-library", "share-with-team"],
    executionOptions: ["diy", "ai-assisted", "done-with-you"],
    recommendedBusinessStages: ["growth", "scale", "legacy"],
    supportedCommunicationStyles: ALL_COMMUNICATION_STYLES,
    futureGenerator: "generate/annual-budget",
    status: "architecture",
  },
  {
    id: "strategic-plan",
    name: "Strategic Plan",
    category: "Strategy",
    ownerType: "executive",
    ownerId: "strategy",
    description: "A structured plan connecting vision, priorities, and measurable outcomes.",
    deliveryLevel: "ai-assisted",
    estimatedTime: "~30 min",
    requiresProfessionalReview: false,
    supportedRenderers: ["pdf", "presentation", "editable-document", "notion-page"],
    recommendedRenderer: "pdf",
    distributionOptions: ["download", "print", "email", "save-to-library", "share-with-team", "notion"],
    executionOptions: ["diy", "ai-assisted", "done-with-you", "done-for-you"],
    recommendedBusinessStages: ["launch", "growth", "scale", "legacy"],
    supportedCommunicationStyles: ALL_COMMUNICATION_STYLES,
    futureGenerator: "generate/strategic-plan",
    status: "architecture",
  },
  {
    id: "launch-timeline",
    name: "Launch Timeline",
    category: "Marketing & Brand",
    ownerType: "executive",
    ownerId: "growth",
    description: "A sequenced set of milestones leading up to and through a launch.",
    deliveryLevel: "ai-assisted",
    estimatedTime: "~15 min",
    requiresProfessionalReview: false,
    supportedRenderers: ["calendar", "checklist", "pdf", "dashboard-card"],
    recommendedRenderer: "calendar",
    distributionOptions: ["download", "save-to-library", "share-with-team", "email"],
    executionOptions: ["diy", "ai-assisted"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_COMMUNICATION_STYLES,
    futureGenerator: "generate/launch-timeline",
    status: "architecture",
  },
  {
    id: "onboarding-checklist",
    name: "Onboarding Checklist",
    category: "People & Culture",
    ownerType: "executive",
    ownerId: "people-culture",
    description: "Everything a new hire needs, in the order they need it.",
    deliveryLevel: "ai-assisted",
    estimatedTime: "~10 min",
    requiresProfessionalReview: false,
    supportedRenderers: ["checklist", "pdf", "notion-page", "web-page"],
    recommendedRenderer: "checklist",
    distributionOptions: ["download", "print", "share-with-team", "save-to-library", "notion"],
    executionOptions: ["diy", "ai-assisted"],
    recommendedBusinessStages: ["growth", "scale"],
    supportedCommunicationStyles: ALL_COMMUNICATION_STYLES,
    futureGenerator: "generate/onboarding-checklist",
    status: "architecture",
  },
  {
    id: "service-agreement",
    name: "Service Agreement (Draft)",
    category: "Legal",
    ownerType: "advisor",
    ownerId: "legal",
    description: "A draft client service agreement prepared for professional legal review.",
    deliveryLevel: "ai-assisted",
    estimatedTime: "~15 min",
    requiresProfessionalReview: true,
    professionalNotice:
      "This is educational drafting assistance and should be reviewed by a licensed attorney before use.",
    supportedRenderers: ["editable-document", "pdf"],
    recommendedRenderer: "editable-document",
    distributionOptions: ["download", "email", "save-to-library"],
    executionOptions: ["diy", "ai-assisted", "done-with-you"],
    recommendedBusinessStages: ["launch", "growth"],
    supportedCommunicationStyles: ALL_COMMUNICATION_STYLES,
    futureGenerator: "generate/service-agreement",
    status: "architecture",
  },
  {
    id: "tax-prep-checklist",
    name: "Tax Preparation Checklist",
    category: "Finance",
    ownerType: "advisor",
    ownerId: "tax",
    description: "Everything to gather and organize before meeting your tax professional.",
    deliveryLevel: "ai-assisted",
    estimatedTime: "~8 min",
    requiresProfessionalReview: true,
    professionalNotice: "This is educational and should be reviewed by a qualified tax professional.",
    supportedRenderers: ["checklist", "pdf", "spreadsheet"],
    recommendedRenderer: "checklist",
    distributionOptions: ["download", "print", "email", "save-to-library"],
    executionOptions: ["diy", "ai-assisted"],
    recommendedBusinessStages: ["growth", "scale", "legacy"],
    supportedCommunicationStyles: ALL_COMMUNICATION_STYLES,
    futureGenerator: "generate/tax-prep-checklist",
    status: "architecture",
  },
  {
    id: "compliance-checklist",
    name: "Compliance Checklist",
    category: "Compliance",
    ownerType: "advisor",
    ownerId: "compliance",
    description: "A readiness checklist across HR, privacy, accessibility, and AI governance.",
    deliveryLevel: "ai-assisted",
    estimatedTime: "~10 min",
    requiresProfessionalReview: true,
    professionalNotice:
      "Compliance requirements vary by jurisdiction and industry and should be verified before implementation.",
    supportedRenderers: ["checklist", "pdf", "notion-page"],
    recommendedRenderer: "checklist",
    distributionOptions: ["download", "print", "save-to-library", "share-with-team", "notion"],
    executionOptions: ["diy", "ai-assisted", "done-with-you"],
    recommendedBusinessStages: ["scale", "legacy"],
    supportedCommunicationStyles: ALL_COMMUNICATION_STYLES,
    futureGenerator: "generate/compliance-checklist",
    status: "architecture",
  },
]

/** Look up a deliverable by id. */
export function getDeliverable(id: string): Deliverable | undefined {
  return DELIVERABLES.find((d) => d.id === id)
}

/** All deliverables owned by a given executive/advisor id. */
export function getDeliverablesByOwner(ownerId: string): Deliverable[] {
  return DELIVERABLES.filter((d) => d.ownerId === ownerId)
}
