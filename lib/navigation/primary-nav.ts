/**
 * Primary Information Architecture — Pass 1 (Navigation + IA)
 * ------------------------------------------------------------
 * Single source of truth for the four-section platform navigation.
 *
 *   🌸 Live Today  → /live-today          (daily operating experiences)
 *   💼 Lead        → /lead                (business execution workspaces)
 *   🌿 Share       → /share               (Time Freedom™ community)
 *   🌸 Grow        → /my-work-lifestyle   (profile, results, progress, growth)
 *
 * Nav labels stay short; URLs stay descriptive and brand-aligned.
 *
 * IMPORTANT (Pass 1 rule): this only REORGANIZES. Every workspace below points
 * at an EXISTING, still-operational route. No legacy route is deleted or
 * redirected in this pass. Later passes handle redesign, consolidation, and
 * legacy cleanup.
 */

import {
  Sunrise,
  Briefcase,
  Leaf,
  Sprout,
  type LucideIcon,
} from "lucide-react"

export type PrimarySectionId = "live-today" | "lead" | "share" | "grow"

export interface Workspace {
  /** Display name of the feature/workspace. */
  label: string
  /** Existing route this workspace currently lives at. */
  href: string
  /** One-line description for the hub landing card. */
  description: string
}

export interface PrimarySection {
  id: PrimarySectionId
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
  /** Existing workspaces grouped under this section. */
  workspaces: Workspace[]
}

export const PRIMARY_NAV: PrimarySection[] = [
  {
    id: "live-today",
    navLabel: "Live Today",
    title: "Live Today™",
    href: "/live-today",
    icon: Sunrise,
    tagline: "Your daily rhythm — what today looks like and your next best step.",
    workspaces: [
      {
        label: "Today's Business Day™",
        href: "/",
        description: "Your engine-driven daily rhythm of Operating Experiences™.",
      },
      {
        label: "Weekly Operating Center™",
        href: "/dashboard",
        description: "Reality Check score, Weekly Intention, and focus areas.",
      },
      {
        label: "Founder Command Center™",
        href: "/headquarters",
        description: "Today's next best step and your Cherry Blossom Executive Brief™.",
      },
      {
        label: "Make Time For More on Mondays™",
        href: "/make-time-for-more-mondays",
        description: "Start the week grounded and intentional.",
      },
      {
        label: "Sunday Design Day™",
        href: "/sunday-shift",
        description: "A 20-minute weekly design ritual for the week ahead.",
      },
      {
        label: "Focus Areas™",
        href: "/focus-areas",
        description: "Your selected priority life areas for the week.",
      },
      {
        label: "Wellness Dashboard™",
        href: "/wellness-dashboard",
        description: "Your recovery and well-being at a glance.",
      },
      {
        label: "Sleep Tracker™",
        href: "/sleep-tracker",
        description: "Measure rest, consistency, and recovery over time.",
      },
      {
        label: "Movement & Workouts™",
        href: "/workout-planner",
        description: "Plan movement that fits your day.",
      },
    ],
  },
  {
    id: "lead",
    navLabel: "Lead",
    title: "Lead",
    href: "/lead",
    icon: Briefcase,
    tagline: "Your business execution workspaces for the 4-Hour Focused CEO Workday™.",
    workspaces: [
      {
        label: "4-Hour Focused CEO Workday™",
        href: "/human-zone-of-genius-team",
        description: "Your Human Zone of Genius™ execution team and workday.",
      },
      {
        label: "AI Executive Team™",
        href: "/ai-executive-team",
        description: "Your AI-augmented executive support.",
      },
      {
        label: "Cherry Blossom Intentions™",
        href: "/cherry-blossom-intentions",
        description: "Set intentional business focus with Cherry Blossom.",
      },
      {
        label: "Business Audit™",
        href: "/audit",
        description: "Assess and strengthen your business foundation.",
      },
      {
        label: "Cherry Blossom Chat™",
        href: "/chat",
        description: "Talk with Cherry Blossom about your business.",
      },
    ],
  },
  {
    id: "share",
    navLabel: "Share",
    title: "Share",
    href: "/share",
    icon: Leaf,
    tagline: "The Time Freedom™ community — celebrate contained work and expanded life.",
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
    tagline: "Your profile, results, progress, memory, and long-term growth.",
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
export const PRIMARY_DESTINATIONS = PRIMARY_NAV.map(({ id, navLabel, title, href, icon, tagline }) => ({
  id,
  navLabel,
  title,
  href,
  icon,
  tagline,
}))

/** The post-login home for returning members. */
export const LIVE_TODAY_HREF = "/live-today"

export function getSection(id: PrimarySectionId): PrimarySection | undefined {
  return PRIMARY_NAV.find((s) => s.id === id)
}
