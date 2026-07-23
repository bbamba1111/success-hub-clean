/**
 * Primary Information Architecture — Pass 4A.1 (Operating System IA Reset)
 * ------------------------------------------------------------------------
 * Single source of truth for the platform's authenticated navigation.
 *
 * The app is now organized around the Work-Life Balance Operating System™.
 * The visible navigation contains only four permanent destinations:
 *
 *   Design My Week™        → /begin         (weekly installation experience)
 *   Live & Lead Today™     → /live-today    (primary daily operating workspace)
 *   Time Freedom™          → /time-freedom  (the life your business supports)
 *   My Work-Life Harmony™  → /my-harmony    (results, memory, profile, growth)
 *
 * IMPORTANT (Pass 4A.1 rules):
 *   - This pass only REORGANIZES. No functionality is built or deleted.
 *   - The legacy Lead™ / Share™ / Grow™ sections are removed from the nav but
 *     preserved as developer-only INTERNAL_MODULES. Their routes and components
 *     remain fully operational and will be embedded into the four workspaces
 *     above in later passes.
 */

import {
  CalendarCheck,
  Calendar,
  Sunrise,
  Leaf,
  Flower2,
  Briefcase,
  Sprout,
  BarChart2,
  type LucideIcon,
} from "lucide-react"

/** The four permanent, user-facing destinations. */
export type PrimarySectionId = "sunday-design-day" | "live-today" | "design-weekly" | "time-freedom" | "my-harmony"

/** Developer-only module groups (not shown in navigation). */
export type InternalModuleId = "lead" | "share" | "grow"

/** Any addressable section — primary destination or internal module. */
export type SectionId = PrimarySectionId | InternalModuleId

export interface Workspace {
  /** Display name of the feature/workspace. */
  label: string
  /** Existing route this workspace currently lives at. */
  href: string
  /** One-line description for the hub landing card. */
  description: string
}

export interface PrimarySection {
  id: SectionId
  /** Short navigation label. */
  navLabel: string
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
 * PRIMARY_NAV — the four permanent destinations that appear in the navigation,
 * in their intended order: Sunday Design Day™ → Live Today™ → Time Freedom™ →
 * My Harmony™.
 */
export const PRIMARY_NAV: PrimarySection[] = [
  {
    id: "sunday-design-day",
    navLabel: "Measure Monthly™",
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
    id: "design-weekly",
    navLabel: "Design Weekly™",
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
      {
        label: "My Work-Life Harmony Blueprint™",
        href: "/harmony-blueprint",
        description: "Your permanent executive record — the foundation every recommendation is built from.",
      },
    ],
  },
  {
    id: "live-today",
    navLabel: "Live & Lead Daily™",
    title: "Live & Lead Daily™",
    href: "/",
    icon: Sunrise,
    tagline: "Live your Daily Non-Negotiables™ and lead your 4-Hour CEO Workday™ — every day.",
    built: true,
    workspaces: [
      {
        label: "Executive Headquarters™",
        href: "/headquarters",
        description: "Your real-time operating dashboard — Harmony Score™, daily focus, rhythm, events, and journey.",
      },
      {
        label: "Live & Lead Today™",
        href: "/",
        description: "Your daily operating workspace — Daily Non-Negotiables™ and the 4-Hour CEO Workday™.",
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
        built: true,
      },
    ],
  },
  {
    id: "time-freedom",
    navLabel: "Time Freedom™",
    title: "Time Freedom™",
    href: "/time-freedom",
    icon: Leaf,
    tagline: "The life your business exists to support — celebrate contained work and expanded life.",
    built: false,
    workspaces: [
      {
        label: "Time Freedom Moments™",
        href: "/time-freedom-moments",
        description: "Share and celebrate the life you're reclaiming with the community.",
      },
    ],
  },
  {
    id: "my-harmony",
    navLabel: "My Work-Life Harmony™",
    title: "My Work-Life Harmony™",
    href: "/harmony-blueprint",
    icon: Flower2,
    tagline: "Your long-term growth center — audit history, operating maturity, milestones, and whole-life progress.",
    built: false,
    workspaces: [
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
]

/** Convenience lookup for the four primary destinations (for nav rendering). */
export const PRIMARY_DESTINATIONS = PRIMARY_NAV.map(({ id, navLabel, title, href, icon, tagline, built }) => ({
  id,
  navLabel,
  title,
  href,
  icon,
  tagline,
  built,
}))

/** The post-login home for returning members. */
export const LIVE_TODAY_HREF = "/"

/** Look up a section by id across both primary destinations and internal modules. */
export function getSection(id: SectionId): PrimarySection | undefined {
  return [...PRIMARY_NAV, ...INTERNAL_MODULES].find((s) => s.id === id)
}
