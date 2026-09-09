/**
 * Business Asset Library™ — Category presentation metadata (Phase 12.1)
 * ---------------------------------------------------------------------------
 * Display-only metadata (icon + short framing line) for each of the seven
 * browsing categories. Kept separate from business-asset-registry.ts so the
 * registry stays pure data with no lucide-react/UI coupling.
 */

import type { BusinessAssetCategory } from "./business-asset-registry"

export interface CategoryMeta {
  icon: string
  tagline: string
}

export const CATEGORY_META: Record<BusinessAssetCategory, CategoryMeta> = {
  "Start Here": {
    icon: "Compass",
    tagline: "Get oriented before you build anything else.",
  },
  "Build the Business": {
    icon: "Hammer",
    tagline: "The core offers, pricing, and operating foundation.",
  },
  "Sell the Business": {
    icon: "Handshake",
    tagline: "Turn conversations into paying clients.",
  },
  "Market the Business": {
    icon: "Megaphone",
    tagline: "Get the right people to notice and trust you.",
  },
  "Operate the Business": {
    icon: "Settings2",
    tagline: "Keep delivery, tools, and money running smoothly.",
  },
  "Grow the Business": {
    icon: "TrendingUp",
    tagline: "Compound what's already working.",
  },
  "Build the Team": {
    icon: "Users",
    tagline: "Bring on help without losing clarity.",
  },
  // "Design the Business" and "Delegate the Business" are deliberately excluded from
  // ALL_BUSINESS_ASSET_CATEGORIES (reachable only via CEO Workday's DESIGN/DELEGATE
  // categories, never Library browse), but TypeScript still requires every
  // BusinessAssetCategory key here since CATEGORY_META is a full Record.
  "Design the Business": {
    icon: "PenSquare",
    tagline: "Set the operating rules that shape how the business runs.",
  },
  "Delegate the Business": {
    icon: "Users",
    tagline: "Hand off responsibility with a clear brief, not just a task.",
  },
}
