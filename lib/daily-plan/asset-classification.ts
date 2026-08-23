/**
 * Asset Classification™ — static keyword lookup (Daily Operating Experience rebuild)
 * ---------------------------------------------------------------------------
 * NOT a new intelligence engine. A small, static, override-able keyword
 * table that badges a CEO Workday™ activity as "Builds an Asset™" (or not)
 * and suggests a small set of "What Else Can This Become?" derivatives once
 * it's complete. Every suggestion is a plain nudge the founder can ignore —
 * never a block, never a score.
 */

export type AssetCategory = "ip" | "marketing" | "sales" | "delivery" | "infrastructure"

export interface AssetClassification {
  buildsAsset: boolean
  category: AssetCategory | null
  /** Plain-language reason for the badge, so it never feels like a mystery score. */
  reason: string
}

const ASSET_KEYWORDS: { category: AssetCategory; keywords: string[] }[] = [
  { category: "ip", keywords: ["course", "template", "framework", "guide", "playbook", "system", "workshop", "signature talk", "recipe", "process doc", "sop"] },
  { category: "marketing", keywords: ["content", "post", "video", "email", "newsletter", "landing page", "campaign", "podcast", "webinar", "lead magnet", "brand"] },
  { category: "sales", keywords: ["proposal", "pitch", "sales page", "offer", "pricing", "sales call script", "deck", "funnel"] },
  { category: "delivery", keywords: ["onboarding", "workflow", "checklist", "automation", "delivery process", "client portal", "fulfillment"] },
  { category: "infrastructure", keywords: ["hire", "tool", "software", "database", "dashboard", "integration", "reporting", "ops"] },
]

const TRANSIENT_KEYWORDS = ["email reply", "inbox", "one-off call", "single client", "admin", "scheduling", "meeting notes"]

/** Classifies a CEO activity title against the static asset keyword table. Always honest, never invents a category. */
export function classifyAssetBuilding(title: string): AssetClassification {
  const normalized = title.toLowerCase()

  for (const transient of TRANSIENT_KEYWORDS) {
    if (normalized.includes(transient)) {
      return { buildsAsset: false, category: null, reason: "This looks like a one-time task rather than something reusable." }
    }
  }

  for (const { category, keywords } of ASSET_KEYWORDS) {
    const match = keywords.find((keyword) => normalized.includes(keyword))
    if (match) {
      return {
        buildsAsset: true,
        category,
        reason: `This creates a reusable ${category === "ip" ? "intellectual property" : category} asset the business keeps using.`,
      }
    }
  }

  return { buildsAsset: false, category: null, reason: "Not yet clear whether this builds a reusable asset — that's okay." }
}

/** A small, static "what else can this become" derivative table — a nudge, never a plan the founder must follow. */
const DERIVATIVE_SUGGESTIONS: { keyword: string; derivatives: string[] }[] = [
  { keyword: "signature talk", derivatives: ["Workshop", "Webinar", "YouTube episode", "Lead magnet", "Blog series"] },
  { keyword: "workshop", derivatives: ["Recorded course module", "Webinar replay", "Lead magnet", "Email sequence"] },
  { keyword: "course", derivatives: ["Mini-course upsell", "YouTube teaser", "Email nurture sequence", "Affiliate offer"] },
  { keyword: "template", derivatives: ["Paid product", "Lead magnet", "Onboarding asset", "Newsletter feature"] },
  { keyword: "guide", derivatives: ["Lead magnet", "Blog post series", "Email course", "Social carousel"] },
  { keyword: "video", derivatives: ["Blog post transcript", "Social clips", "Podcast episode", "Email feature"] },
  { keyword: "podcast", derivatives: ["Blog post transcript", "Social clips", "Newsletter feature", "YouTube upload"] },
  { keyword: "proposal", derivatives: ["Case study", "Sales page section", "Template for future clients"] },
]

/** Returns plain-language "what else can this become" suggestions once an activity is marked complete. Empty when nothing honestly matches. */
export function suggestDerivatives(title: string): string[] {
  const normalized = title.toLowerCase()
  for (const { keyword, derivatives } of DERIVATIVE_SUGGESTIONS) {
    if (normalized.includes(keyword)) return derivatives
  }
  return []
}

/** The founder's own choice for "how should this actually get handled" — a nudge menu, never automatic reassignment. */
export const ALTERNATIVE_HANDLING_OPTIONS = [
  "Delegate",
  "AI",
  "Outsource",
  "Buy",
  "Hire",
  "Partner",
  "Defer",
  "Remove",
] as const

export type AlternativeHandlingOption = (typeof ALTERNATIVE_HANDLING_OPTIONS)[number]
