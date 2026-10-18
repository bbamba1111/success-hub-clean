import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { MondayHeroSection } from "@/components/landing/monday-hero-section"
import { FreedomGapSection } from "@/components/landing/freedom-gap-section"
import { FounderPathwaysSection } from "@/components/landing/founder-pathways-section"
import { WorkplaceDesignSection } from "@/components/landing/workplace-design-section"
import { WhyHarmonyLaneSection } from "@/components/landing/why-harmony-lane-section"
import { MondayOfferSection } from "@/components/landing/monday-offer-section"
import { BusinessWeekSection } from "@/components/landing/business-week-section"
import { WhyNowSection } from "@/components/landing/why-now-section"
import { FounderAuthoritySection } from "@/components/landing/founder-authority-section"
import { FinalOffersSection } from "@/components/landing/final-offers-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Harmony Lane™ — Human Sustainability™ in the Agentic AI Age",
  description:
    "Make Time For More™ On Mondays ($997) and The Work-Life Balance Business Week™ ($1,997, includes Monday). Reconnect with your entrepreneurial intention and personalize your human boundaries before AI accelerates the way you work.",
  openGraph: {
    title: "Harmony Lane™ — Make Time For More™ On Mondays",
    description:
      "Redesign your entry into the workweek, then live The Work-Life Balance Business Week™ in real time. Human Sustainability™ in the Agentic AI Age.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#FDF6F3",
}

/**
 * Public marketing site at /landing — two public offers:
 *   Make Time For More™ On Mondays (business-day, $997) — the entry experience
 *   The Work-Life Balance Business Week™ (business-week, $1,997, includes Monday)
 * The Monthly Business Boundary Builder™ is member-only and intentionally absent.
 * Prices and checkout URLs come from lib/payments/config.ts.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNav
        experiencesHref="#monday"
        ctaLabel="Reserve Monday"
        links={[
          { label: "The Monday Experience", href: "#monday" },
          { label: "The Business Week", href: "#business-week" },
          { label: "Why Harmony Lane", href: "#why-harmony-lane" },
          { label: "Meet Barbara", href: "#meet-barbara" },
        ]}
      />
      <MondayHeroSection />
      <FreedomGapSection />
      <FounderPathwaysSection />
      <WhyHarmonyLaneSection />
      <MondayOfferSection />
      <BusinessWeekSection />
      <WhyNowSection />
      <WorkplaceDesignSection />
      <FounderAuthoritySection />
      <FinalOffersSection />
      <LandingFooter />
    </main>
  )
}
