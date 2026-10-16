import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { MondayHeroSection } from "@/components/landing/monday-hero-section"
import { MondayRecognitionSection } from "@/components/landing/monday-recognition-section"
import { CapacityQuestionSection } from "@/components/landing/capacity-question-section"
import { ProactiveSustainabilitySection } from "@/components/landing/proactive-sustainability-section"
import { WhyMondaySection } from "@/components/landing/why-monday-section"
import { ExperienceBoundariesSection } from "@/components/landing/experience-boundaries-section"
import { MondayExperienceSection } from "@/components/landing/monday-experience-section"
import { BeforeMondaySection } from "@/components/landing/before-monday-section"
import { FounderAuthoritySection } from "@/components/landing/founder-authority-section"
import { WhatsIncludedSection } from "@/components/landing/whats-included-section"
import { HumanSustainabilitySection } from "@/components/landing/human-sustainability-section"
import { MondayOffer } from "@/components/landing/monday-offer"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Harmony Lane™ — Make Time For More™ On Mondays",
  description:
    "Reserve one Monday to experience a different way to enter the workweek. The Work-Life Balance Business Day™ is a live operating experience for founders building for Human Sustainability™ in the Accelerated AI Age. $1,997.",
  openGraph: {
    title: "Harmony Lane™ — Make Time For More™ On Mondays",
    description:
      "The Work-Life Balance Business Day™ — one guided Monday, lived in real time. Reserve your day. $1,997.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#FDF6F3",
}

/**
 * Public marketing site at /landing — Harmony Lane™, Monday-first.
 *
 * The page has ONE job: sell the $1,997 Make Time For More On Mondays™
 * experience (The Work-Life Balance Business Day™). It does NOT publicly
 * explain or sell the broader Harmony Lane™ ecosystem — Business Week,
 * Installation, and the full methodology are discovered AFTER entering the
 * experience, through internal navigation. The page answers five questions:
 * why this matters, why Monday, what the Business Day is, what happens when you
 * reserve, and what you receive for $1,997.
 *
 *   HERO       → Make Time For More™ On Mondays (Reserve Your Day Now™ · $1,997)
 *   PROBLEM    → You didn't start your business to recreate the life you left
 *   WHY NOW    → What happens when capacity isn't the problem?
 *   WHY MONDAY → Start with the day you actually have to live
 *   THE DAY    → One business day. Designed differently. (the schedule)
 *   RESERVE    → Your Monday starts before Monday (5-step journey)
 *   INCLUDED   → Your $1,997 reservation includes
 *   BIGGER     → Build the business. Don't consume the human.
 *   OFFER      → Make Time For More™ On Mondays — $1,997
 *   CLOSE      → What if Monday didn't have to take your life with it?
 *
 * The single conversion is Reserve Your Day Now™. Pricing/checkout are read
 * from the product ladder in lib/payments/config.ts (business-day level).
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNav
        experiencesHref="#offer"
        ctaLabel="Reserve Monday"
        links={[
          { label: "The Day", href: "#monday" },
          { label: "How It Works", href: "#how-it-works" },
          { label: "Why Now", href: "#why-now" },
        ]}
      />
      <MondayHeroSection />
      <MondayRecognitionSection />
      <CapacityQuestionSection />
      <ProactiveSustainabilitySection />
      <WhyMondaySection />
      <ExperienceBoundariesSection />
      <MondayExperienceSection />
      <BeforeMondaySection />
      <FounderAuthoritySection />
      <WhatsIncludedSection />
      <HumanSustainabilitySection />
      <MondayOffer />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  )
}
