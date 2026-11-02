"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTION_LABEL = exports.ACTOR_LABEL = exports.STATUS_LABEL = exports.DOCUMENT_TYPES = exports.REFERENCE_FIELDS = exports.STANDARD_CATEGORIES = void 0;
exports.referenceKey = referenceKey;
exports.STANDARD_CATEGORIES = [
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
];
/**
 * Existing records the profile may reference. Personal and family fields in
 * founder_profiles are intentionally excluded and must never be added here.
 */
exports.REFERENCE_FIELDS = [
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
];
function referenceKey(table, column) {
    return `${table}.${column}`;
}
exports.DOCUMENT_TYPES = [
    { value: "business_plan", label: "Business plan" },
    { value: "service_description", label: "Service description" },
    { value: "speaker_one_sheet", label: "Speaker one-sheet" },
    { value: "biography", label: "Professional biography" },
    { value: "media_kit", label: "Media kit" },
    { value: "pricing", label: "Pricing document" },
    { value: "proposal", label: "Proposal" },
    { value: "brand_messaging", label: "Brand messaging" },
    { value: "other", label: "Other" },
];
exports.STATUS_LABEL = {
    draft: "Draft",
    approved: "Approved",
    needs_review: "Needs review",
    retired: "Retired",
};
exports.ACTOR_LABEL = {
    founder: "You",
    cherry_blossom: "Cherry Blossom™",
    document_extraction: "Document extraction",
    system: "Source record update",
};
exports.ACTION_LABEL = {
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
};
