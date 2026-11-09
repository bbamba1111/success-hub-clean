/**
 * Business Asset Chain Engine™ — Phase 10.2
 * ---------------------------------------------------------------------------
 * Given a completed business asset id, recognizes the downstream compounding
 * opportunity chain — showing the founder exactly what this asset unlocks.
 *
 * This is the Compounding Business Asset™ intelligence layer:
 * every asset is a seed, not a task.
 *
 * PURE module — no React, no I/O.
 */

import type { BusinessAssetId } from "@/lib/executive-decision-engine"

/* ===========================================================================
 * Types
 * ======================================================================== */

export interface AssetChainNode {
  name: string
  assetId?: BusinessAssetId | string
  description: string
}

export interface BusinessAssetChain {
  /** The asset this chain starts from. */
  sourceAsset: string
  /** e.g. "Evergreen Webinar™ Compounding Chain" */
  chainLabel: string
  /** Ordered downstream assets that this unlocks. */
  downstreamAssets: AssetChainNode[]
  /** Cherry Blossom's one-sentence insight on why this chain matters. */
  cherryBlossomInsight: string
}

/* ===========================================================================
 * Chain definitions
 * ======================================================================== */

const ASSET_CHAINS: Partial<Record<string, BusinessAssetChain>> = {
  "evergreen-webinar": {
    sourceAsset: "Evergreen Webinar™",
    chainLabel: "Evergreen Webinar™ Compounding Chain",
    downstreamAssets: [
      {
        name: "Lead Magnet",
        description: "Your webinar opt-in becomes a high-converting lead capture asset.",
      },
      {
        name: "Podcast",
        description: "Each webinar module repurposed as a long-form audio asset that ranks over time.",
      },
      {
        name: "Email Nurture Sequence",
        description: "Automated follow-up built from webinar content — nurtures while you sleep.",
      },
      {
        name: "Mini Course",
        description: "Webinar modules restructured into a paid or free course product.",
      },
      {
        name: "Membership",
        description: "Webinar library becomes the anchor content of a recurring-revenue membership.",
      },
      {
        name: "Evergreen Funnel",
        description: "Webinar + Lead Magnet + Nurture Sequence combined into a fully automated revenue funnel.",
      },
    ],
    cherryBlossomInsight:
      "One recorded webinar can feed six downstream assets — all of which generate leads and revenue while you protect your Time Freedom\u2122.",
  },

  "signature-talk": {
    sourceAsset: "Signature Talk™",
    chainLabel: "Signature Talk™ Compounding Chain",
    downstreamAssets: [
      {
        name: "Content Library",
        description: "Every talk becomes repurposable short-form and long-form content across channels.",
      },
      {
        name: "Authority Platform",
        description: "Consistent talk delivery builds a speaking platform and a recognized expert brand.",
      },
      {
        name: "Book",
        description: "Your talk framework becomes the outline for your first or next book.",
      },
      {
        name: "Email Nurture Sequence",
        description: "Talk modules structured into an automated educational email series.",
      },
    ],
    cherryBlossomInsight:
      "Your Signature Talk\u2122 is the highest-leverage asset you can create — it builds authority, generates leads, and seeds your entire content library simultaneously.",
  },

  "standard-operating-procedure": {
    sourceAsset: "Standard Operating Procedure™",
    chainLabel: "SOP™ Compounding Chain",
    downstreamAssets: [
      {
        name: "AI Workflow",
        description: "Each SOP becomes a prompt-driven AI automation — reducing your execution time.",
      },
      {
        name: "Team Operating Handbook",
        description: "All SOPs combined form the onboarding and delegation guide for every future hire.",
      },
      {
        name: "Hiring Process",
        description: "SOPs define exactly what a role requires — enabling role-based hiring rather than personality-based hiring.",
      },
    ],
    cherryBlossomInsight:
      "Every SOP\u2122 you create is a future delegation — the more you document, the more your business can operate without requiring your personal time.",
  },

  "content-library": {
    sourceAsset: "Content Library™",
    chainLabel: "Content Library™ Compounding Chain",
    downstreamAssets: [
      {
        name: "Email Nurture Sequence",
        description: "Library content becomes a drip campaign that educates and nurtures at scale.",
      },
      {
        name: "Authority Platform",
        description: "Published content builds discoverability and SEO over time — compounding reach.",
      },
      {
        name: "Offer Suite",
        description: "Content reveals what your audience wants most — informing your product and service offers.",
      },
    ],
    cherryBlossomInsight:
      "A Content Library\u2122 is the most powerful passive trust-builder in business — it works for you around the clock without requiring your presence.",
  },

  "marketing-funnel": {
    sourceAsset: "Marketing Funnel™",
    chainLabel: "Marketing Funnel™ Compounding Chain",
    downstreamAssets: [
      {
        name: "Email Nurture Sequence",
        description: "Funnel subscribers enter an automated nurture sequence that converts over time.",
      },
      {
        name: "Offer Suite",
        description: "Funnel data reveals which offers convert best — enabling product line refinement.",
      },
      {
        name: "Sales Playbook",
        description: "Funnel learnings inform a repeatable sales process for you and future team members.",
      },
    ],
    cherryBlossomInsight:
      "A Marketing Funnel\u2122 is a 24-hour revenue engine — it qualifies, educates, and converts leads while you protect your Time Freedom\u2122.",
  },

  "referral-system": {
    sourceAsset: "Referral System™",
    chainLabel: "Referral System™ Compounding Chain",
    downstreamAssets: [
      {
        name: "Testimonial Library",
        description: "Each referral generates a story — compiled into your highest-converting social proof asset.",
      },
      {
        name: "Case Study Collection",
        description: "Referral client journeys become detailed case studies for sales and authority.",
      },
      {
        name: "Partner Network",
        description: "Top referrers become strategic partners — creating a channel revenue stream.",
      },
    ],
    cherryBlossomInsight:
      "Your Referral System\u2122 turns every satisfied client into a business development asset — the highest-trust, lowest-cost acquisition channel available.",
  },
}

/* ===========================================================================
 * Public API
 * ======================================================================== */

/**
 * Returns the Business Asset Chain for a given asset id, or null if no
 * predefined chain exists for this asset.
 */
export function deriveAssetChain(
  assetId: BusinessAssetId | string | null | undefined,
): BusinessAssetChain | null {
  if (!assetId) return null
  return ASSET_CHAINS[assetId] ?? null
}

/**
 * Returns true if a chain is defined for this asset id.
 */
export function hasAssetChain(
  assetId: BusinessAssetId | string | null | undefined,
): boolean {
  if (!assetId) return false
  return assetId in ASSET_CHAINS
}
