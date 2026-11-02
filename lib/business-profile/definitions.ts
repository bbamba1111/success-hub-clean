export type FactStatus = "draft" | "approved" | "needs_review" | "retired"
export type FactActor = "founder" | "cherry_blossom" | "document_extraction" | "system"
export type FactSourceType = "manual" | "conversation" | "document" | "reference"

export type CategoryDefinition = {
  key: string
  label: string
  description: string
  examples: string[]
  isCustom: boolean
}

export const STANDARD_CATEGORIES: CategoryDefinition[] = [
  {
    key: "positioning",
    label: "Business Identity & Positioning",
    description: "Who you serve, what you are known for, and how you describe the business.",
    examples: ["One-line description", "Ideal client", "What makes the business different"],
    isCustom: false,
  },
  {
    key: "services",
    label: "Services & Offers",
    description: "Each service, program, or product you offer.",
    examples: ["Signature program", "Advisory retainer", "Online course"],
    isCustom: false,
  },
  {
    key: "fees",
    label: "Fees & Pricing",
    description: "Prices that may be quoted. Never used externally until approved.",
    examples: ["Keynote fee", "Workshop fee", "Program investment"],
    isCustom: false,
  },
  {
    key: "speaking_topics",
    label: "Speaking Topics",
    description: "Talks, keynotes, and interview topics you offer.",
    examples: ["Signature keynote", "Workshop topic", "Podcast angle"],
    isCustom: false,
  },
  {
    key: "media",
    label: "Biography & Media",
    description: "Biographies, headshots, one-sheets, and sample interview questions.",
    examples: ["Short biography", "Long biography", "Sample interview questions"],
    isCustom: false,
  },
  {
    key: "approved_claims",
    label: "Approved Claims & Results",
    description: "Results, credentials, and statements that may be made publicly.",
    examples: ["Client result", "Award", "Credential"],
    isCustom: false,
  },
  {
    key: "terms",
    label: "Terms & Policies",
    description: "Booking, cancellation, travel, and payment terms.",
    examples: ["Travel requirements", "Cancellation policy", "Deposit terms"],
    isCustom: false,
  },
  {
    key: "operating_restrictions",
    label: "Operating Restrictions",
    description: "What must never be said, offered, or agreed to on your behalf.",
    examples: ["No weekend events", "No unpaid speaking", "Do not discuss pricing in pitches"],
    isCustom: false,
  },
  {
    key: "links",
    label: "Links",
    description: "Website, booking page, social profiles, and media links.",
    examples: ["Website", "Booking page", "Speaker reel"],
    isCustom: false,
  },
]

export type ReferenceField = {
  sourceTable: "business_context_profiles" | "business_foundations" | "founder_profiles"
  sourceColumn: string
  label: string
  categoryKey: string
}

/**
 * Existing records the profile may reference. Personal and family fields in
 * founder_profiles are intentionally excluded and must never be added here.
 */
export const REFERENCE_FIELDS: ReferenceField[] = [
  { sourceTable: "business_context_profiles", sourceColumn: "offer_statement", label: "Offer statement", categoryKey: "positioning" },
  { sourceTable: "business_context_profiles", sourceColumn: "ideal_client_definition", label: "Ideal client", categoryKey: "positioning" },
  { sourceTable: "business_context_profiles", sourceColumn: "delivery_model", label: "Delivery model", categoryKey: "services" },
  { sourceTable: "business_context_profiles", sourceColumn: "acquisition_channel", label: "Main acquisition channel", categoryKey: "positioning" },
  { sourceTable: "business_foundations", sourceColumn: "business_identity", label: "Business identity", categoryKey: "positioning" },
  { sourceTable: "business_foundations", sourceColumn: "revenue_model", label: "Revenue model", categoryKey: "services" },
  { sourceTable: "business_foundations", sourceColumn: "growth_model", label: "Growth model", categoryKey: "positioning" },
  { sourceTable: "business_foundations", sourceColumn: "country", label: "Country of operation", categoryKey: "positioning" },
  { sourceTable: "business_foundations", sourceColumn: "time_zone", label: "Time zone", categoryKey: "terms" },
  { sourceTable: "business_foundations", sourceColumn: "preferred_currency", label: "Currency", categoryKey: "fees" },
  { sourceTable: "founder_profiles", sourceColumn: "full_name", label: "Founder name", categoryKey: "media" },
  { sourceTable: "founder_profiles", sourceColumn: "professional_title", label: "Professional title", categoryKey: "media" },
  { sourceTable: "founder_profiles", sourceColumn: "city", label: "City", categoryKey: "media" },
]

export function referenceKey(table: string, column: string) {
  return `${table}.${column}`
}

export const DOCUMENT_TYPES = [
  { value: "business_plan", label: "Business plan" },
  { value: "service_description", label: "Service description" },
  { value: "speaker_one_sheet", label: "Speaker one-sheet" },
  { value: "biography", label: "Professional biography" },
  { value: "media_kit", label: "Media kit" },
  { value: "pricing", label: "Pricing document" },
  { value: "proposal", label: "Proposal" },
  { value: "brand_messaging", label: "Brand messaging" },
  { value: "other", label: "Other" },
] as const

export type DocumentType = (typeof DOCUMENT_TYPES)[number]["value"]

export const STATUS_LABEL: Record<FactStatus, string> = {
  draft: "Draft",
  approved: "Approved",
  needs_review: "Needs review",
  retired: "Retired",
}

export const ACTOR_LABEL: Record<FactActor, string> = {
  founder: "You",
  cherry_blossom: "Cherry Blossom™",
  document_extraction: "Document extraction",
  system: "Source record update",
}

export const ACTION_LABEL: Record<string, string> = {
  created: "Created",
  edited: "Edited",
  approved: "Approved",
  rejected: "Change rejected",
  retired: "Retired",
  reactivated: "Reactivated",
  restored: "Restored earlier version",
  proposed: "Proposed change",
  source_changed: "Source record changed",
  moved: "Moved",
}

export type BusinessFact = {
  id: string
  categoryKey: string
  label: string
  value: string | null
  status: FactStatus
  approvedLabel: string | null
  approvedValue: string | null
  approvedAt: string | null
  sourceType: FactSourceType
  sourceTable: string | null
  sourceColumn: string | null
  sortOrder: number
  lastChangeActor: FactActor
  lastChangeAction: string
  updatedAt: string
}

export type FactHistoryEntry = {
  id: string
  factId: string | null
  action: string
  actor: FactActor
  previousLabel: string | null
  newLabel: string | null
  previousValue: string | null
  newValue: string | null
  previousStatus: FactStatus | null
  newStatus: FactStatus | null
  previousApprovedValue: string | null
  newApprovedValue: string | null
  note: string | null
  createdAt: string
}

export type ProfileDocument = {
  id: string
  fileName: string
  documentType: DocumentType
  extractionStatus: "awaiting_extraction" | "extracting" | "extracted" | "failed"
  sizeBytes: number | null
  createdAt: string
}

export type AvailableReference = ReferenceField & { currentValue: string }

export type BusinessProfileData = {
  categories: CategoryDefinition[]
  facts: BusinessFact[]
  documents: ProfileDocument[]
  availableReferences: AvailableReference[]
}

export type ApprovedBusinessFact = {
  id: string
  categoryKey: string
  categoryLabel: string
  label: string
  value: string
  approvedAt: string | null
}
