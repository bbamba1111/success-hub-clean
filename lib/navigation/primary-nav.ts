/**
 * Primary Information Architecture — Pass 4B (Live → Blueprint → Experiences)
 * ----------------------------------------------------------------------------
 * Single source of truth for the platform's authenticated navigation.
 *
 * The visible navigation contains exactly three permanent destinations:
 *
 *   Live, Lead & Love Today™     → /            (daily operating environment)
 *   My Harmony Blueprint™        → /my-harmony  (personal operating intelligence)
 *   More Experiences™ (Upgrade)  → /experiences (upgrade / continuation pathway)
 *
 * IMPORTANT (Pass 4B rules):
 *   - This pass only REORGANIZES. No functionality is built or deleted, and no
 *     Week/Month/Quarter pricing is hard-coded anywhere in this file.
 *   - The former "Measure Monthly" and "Design Weekly" top-level nav items are
 *     removed from PRIMARY_NAV (so they no longer render in the nav bar), but —
 *     same as the legacy Lead™ / Share™ / Grow™ groups — are preserved as
 *     developer-only INTERNAL_MODULES. Every route they point to (/founder-profile,
 *     /audit, /entrepreneur-success-assessment, /design-my-week, /sunday-shift)
 *     remains fully operational. Their individual workspaces are also folded
 *     into the Blueprint™ (assessments/profile) and Live™ (weekly rhythm)
 *     sections below, so members can still reach them from the new nav.
 */

import {
  CalendarCheck,
  Calendar,
  Sunrise,
  Leaf,
  Flower2,
  Briefcase,
  Sprout,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

/** The three permanent, user-facing destinations. */
export type PrimarySectionId = "live-today" | "my-harmony" | "experiences"

/** Developer-only module groups (not shown in navigation). */
export type InternalModuleId = "lead" | "share" | "grow" | "measure-monthly" | "design-weekly"

/** Any addressable section — primary destination or internal module. */
export type SectionId = PrimarySectionId | InternalModuleId

export interface Workspace {
  /** Display name of the feature/workspace. */
  label: string
  /** Existing route this workspace currently lives at. */
  href: string
  /** One-line description for the hub landing card. */
  description: string
  /**
   * Roadmap item with no page or pricing yet (e.g. Week/Month/Quarter tiers
   * still being finalized). Rendered as a disabled "Coming Soon" card instead
   * of a link — never hard-code a price here.
   */
  comingSoon?: boolean
}

export interface PrimarySection {
  id: SectionId
  /** Short navigation label. */
  navLabel: string
  /** Optional sub-label shown under the nav label (e.g. "Upgrade"). */
  navBadge?: string
  /** Full brand name for hub headers. */
  title: string
  /** Brand-aligned destination URL for the hub page. */
  href: string
  /** Nav icon. */
  icon: LucideIcon
  /** One-line orientation for the hub header. */
  tagline: string
  /** Whether this destination is built yet (false → "Coming Soon" placeholder). */
  built: boolean
  /** Existing workspaces grouped under this section. */
  workspaces: Workspace[]
}

/**
 * PRIMARY_NAV — the three permanent destinations that appear in the
 * navigation, in their intended order: Live™ → Blueprint™ → Experiences™.
 */
export const PRIMARY_NAV: PrimarySection[] = [
  {
    id: "live-today",
    navLabel: "Live, Lead & Love Today™",
    title: "Live, Lead & Love Today™",
    href: "/",
    icon: Sunrise,
    tagline: "Experience your current Harmony Lane™ rhythm in real time — Daily Non-Negotiables™ and the 4-Hour CEO Workday™.",
    built: true,
    workspaces: [
      {
        label: "Executive Headquarters™",
        href: "/headquarters",
        description: "Your real-time operating dashboard — Harmony Score™, daily focus, rhythm, events, and journey.",
      },
      {
        label: "Live, Lead & Love Today™",
        href: "/",
        description: "Your daily operating workspace — Daily Non-Negotiables™ and the 4-Hour CEO Workday™.",
      },
      {
        label: "Design My Week™",
        href: "/design-my-week",
        description: "Install your Daily Non-Negotiables™, Intention Declarations™, and weekly operating rhythm.",
      },
      {
        label: "Sunday Design Day™",
        href: "/sunday-shift",
        description: "Your full Sunday reset ritual — audit, intentions, prep sheet, and weekly design.",
      },
      {
        label: "Community Events™",
        href: "/events",
        description: "Live Co-Working™, Monday Sync™, Office Hours™, Founder Circle™, and more — the full community calendar.",
      },
      {
        label: "Community™",
        href: "/community",
        description: "Daily accountability, founder wins, discussions, challenges, and your community calendar — all in one place.",
      },
    ],
  },
  {
    id: "my-harmony",
    navLabel: "My Harmony Blueprint™",
    title: "My Work-Life Harmony Blueprint™",
    href: "/my-harmony",
    icon: Flower2,
    tagline: "Your personal operating intelligence — profile, assessments, memory, and whole-life progress.",
    built: true,
    workspaces: [
      {
        label: "Founder & Business Profile™",
        href: "/founder-profile",
        description: "Update your personal and business profile — the foundation of your Harmony Blueprint™.",
      },
      {
        label: "Work-Life Balance Reality Check™",
        href: "/audit",
        description: "Measure how your life has been operating over the past 30 days.",
      },
      {
        label: "Entrepreneur Success Assessment™",
        href: "/entrepreneur-success-assessment",
        description: "Measure how your business has been operating over the past 30 days.",
      },
      {
        label: "Founder Memory™",
        href: "/founder-memory",
        description: "Every milestone, win, reflection, and decision — remembered by Cherry Blossom and synthesised into pattern insights.",
      },
      {
        label: "My Results™",
        href: "/my-results",
        description: "Your Reality Check™ results and trends over time.",
      },
      {
        label: "Cherry Blossom Memory Vault™",
        href: "/cherry-blossom",
        description: "What Cherry Blossom remembers about your journey.",
      },
      {
        label: "Preview Results™",
        href: "/preview-results",
        description: "A preview of your assessment outcomes.",
      },
      {
        label: "Welcome & Onboarding™",
        href: "/welcome",
        description: "Revisit your onboarding journey and getting-started steps.",
      },
      {
        label: "Executive Review Engine™",
        href: "/executive-reviews",
        description: "Weekly, monthly, and quarterly operating reviews synthesised from your Harmony data.",
      },
    ],
  },
  {
    id: "experiences",
    navLabel: "More Experiences™",
    navBadge: "Upgrade",
    title: "Make Time For More Experiences™",
    href: "/experiences",
    icon: Sparkles,
    tagline: "Your pathway to continue or deepen your Harmony Lane™ experience.",
    built: true,
    workspaces: [
      {
        label: "Make Time For More™ on Mondays",
        href: "/monday",
        description: "The confirmed front-door Work-Life Balance Business Day™ experience.",
      },
      {
        label: "Work-Life Balance Business Week™",
        href: "/experiences",
        description: "Deepen your Harmony Lane™ rhythm across a full business week. Pricing not yet finalized.",
        comingSoon: true,
      },
      {
        label: "Work-Life Balance Business Month™",
        href: "/experiences",
        description: "Extend your Harmony Lane™ operating rhythm across a full business month. Pricing not yet finalized.",
        comingSoon: true,
      },
      {
        label: "Work-Life Balance Business Quarter™",
        href: "/experiences",
        description: "Install your Harmony Lane™ rhythm across a full business quarter. Pricing not yet finalized.",
        comingSoon: true,
      },
      {
        label: "Harmony Lane™ Membership",
        href: "/experiences",
        description: "Ongoing membership inside Harmony Lane™. Pricing not yet finalized.",
        comingSoon: true,
      },
    ],
  },
]

/**
 * INTERNAL_MODULES — the legacy Lead™ / Share™ / Grow™ groupings. These are no
 * longer user-facing destinations and do NOT appear in the navigation. They are
 * preserved so nothing is lost: every route and component still works, and each
 * module will be embedded into its proper workspace in a later pass.
 *
 * Eventual homes:
 *   - CEO modules      → Live Today™ ▸ 4-Hour Focused CEO Workday™
 *   - Progress modules → My Harmony™
 *   - Community module → Time Freedom™
 */
export const INTERNAL_MODULES: PrimarySection[] = [
  {
    id: "lead",
    navLabel: "Lead",
    title: "Lead",
    href: "/lead",
    icon: Briefcase,
    tagline: "Business execution modules — destined for the 4-Hour Focused CEO Workday™.",
    built: true,
    workspaces: [
      {
        label: "4-Hour Focused CEO Workday™",
        href: "/human-zone-of-genius-team",
        description: "Your Human Zone of Genius™ execution team and workday.",
      },
      {
        label: "AI Executive Team™",
        href: "/ai-executive-team",
        description: "Your AI-augmented executive support (→ AI Executive Leadership Team™).",
      },
      {
        label: "Cherry Blossom Intentions™",
        href: "/cherry-blossom-intentions",
        description: "Set intentional business focus with Cherry Blossom.",
      },
      {
        label: "Business Foundation Assessment™",
        href: "/audit",
        description: "Assess your business foundation (→ Sunday Design Day™ ▸ Reality Check™, new members).",
      },
      {
        label: "Cherry Blossom Business Chat™",
        href: "/chat",
        description: "Talk with Cherry Blossom (→ embedded contextually in every workspace).",
      },
    ],
  },
  {
    id: "share",
    navLabel: "Share",
    title: "Share",
    href: "/share",
    icon: Leaf,
    tagline: "The Time Freedom™ community — destined for the Time Freedom™ workspace.",
    built: true,
    workspaces: [
      {
        label: "Time Freedom Moments™",
        href: "/time-freedom-moments",
        description: "Share and celebrate the life you're reclaiming with the community.",
      },
    ],
  },
  {
    id: "grow",
    navLabel: "Grow",
    title: "Grow",
    href: "/my-work-lifestyle",
    icon: Sprout,
    tagline: "Profile, results, progress, and memory — destined for My Harmony™.",
    built: true,
    workspaces: [
      {
        label: "My Results™",
        href: "/my-results",
        description: "Your Reality Check results and trends over time.",
      },
      {
        label: "Cherry Blossom Memory Vault™",
        href: "/cherry-blossom",
        description: "What Cherry Blossom remembers about your journey.",
      },
      {
        label: "Preview Results™",
        href: "/preview-results",
        description: "A preview of your assessment outcomes.",
      },
      {
        label: "Welcome & Onboarding™",
        href: "/welcome",
        description: "Revisit your onboarding journey and getting-started steps.",
      },
    ],
  },
  {
    // Demoted from PRIMARY_NAV in Pass 4B. Workspaces are now also reachable
    // from "My Work-Life Harmony Blueprint™" — this entry stays only so the
    // route/lookup is preserved, same as Lead/Share/Grow above.
    id: "measure-monthly",
    navLabel: "Measure Monthly",
    title: "Measure Monthly™",
    href: "/founder-profile",
    icon: CalendarCheck,
    tagline: "Complete your monthly Work-Life Balance Reality Check™ and Entrepreneur Success Assessment™.",
    built: true,
    workspaces: [
      {
        label: "Founder & Business Profile™",
        href: "/founder-profile",
        description: "Update your personal and business profile — the foundation of your Harmony Blueprint™.",
      },
      {
        label: "Work-Life Balance Reality Check™",
        href: "/audit",
        description: "Measure how your life has been operating over the past 30 days.",
      },
      {
        label: "Entrepreneur Success Assessment™",
        href: "/entrepreneur-success-assessment",
        description: "Measure how your business has been operating over the past 30 days.",
      },
    ],
  },
  {
    // Demoted from PRIMARY_NAV in Pass 4B. Workspaces are now also reachable
    // from "Live, Lead & Love Today™" — this entry stays only so the
    // route/lookup is preserved, same as Lead/Share/Grow above.
    id: "design-weekly",
    navLabel: "Design Weekly",
    title: "Design Weekly™",
    href: "/design-my-week",
    icon: Calendar,
    tagline: "Design and install your Work-Life Balance Business Week™ every Sunday.",
    built: true,
    workspaces: [
      {
        label: "Design My Week™",
        href: "/design-my-week",
        description: "Install your Daily Non-Negotiables™, Intention Declarations™, and weekly operating rhythm.",
      },
      {
        label: "Sunday Design Day™",
        href: "/sunday-shift",
        description: "Your full Sunday reset ritual — audit, intentions, prep sheet, and weekly design.",
      },
    ],
  },
]

/** Convenience lookup for the three top-nav-visible destinations (for nav rendering). */
export const PRIMARY_DESTINATIONS = PRIMARY_NAV.map(
  ({ id, navLabel, navBadge, title, href, icon, tagline, built }) => ({
    id,
    navLabel,
    navBadge,
    title,
    href,
    icon,
    tagline,
    built,
  }),
)

/** The post-login home for returning members. */
export const LIVE_TODAY_HREF = "/"

/** Look up a section by id across both primary destinations and internal modules. */
export function getSection(id: SectionId): PrimarySection | undefined {
  return [...PRIMARY_NAV, ...INTERNAL_MODULES].find((s) => s.id === id)
}
