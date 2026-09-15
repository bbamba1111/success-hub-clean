import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { MondayHeroSection } from "@/components/landing/monday-hero-section"
import { HustleProblemSection } from "@/components/landing/hustle-problem-section"
import { MissingQuestionSection } from "@/components/landing/missing-question-section"
import { FounderDestinationSection } from "@/components/landing/founder-destination-section"
import { AiAgeSection } from "@/components/landing/ai-age-section"
import { JourneySection } from "@/components/landing/journey-section"
import { ExperienceSection } from "@/components/landing/experience-section"
import { MondayOffer } from "@/components/landing/monday-offer"
import { HroiSection } from "@/components/landing/hroi-section"
import { FounderAuthoritySection } from "@/components/landing/founder-authority-section"
import { BiggerPurposeSection } from "@/components/landing/bigger-purpose-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Harmony Lane™ — The Work-Life Balance Destination™",
  description:
    "You built the business. Now decide what you want it to make possible. Harmony Lane™ is a premium destination for successful entrepreneurs who want to redesign how they live, work, and lead — and experience the Work-Life Balance Business Day™ in real time.",
  openGraph: {
    title: "Harmony Lane™ — The Work-Life Balance Destination™",
    description:
      "A premium destination for successful entrepreneurs. Reconnect with your original intention, define your Founder Destination™, and experience Work-Life Balance in real time.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#FDF6F3",
}

/**
 * Public marketing site at /landing — Harmony Lane™ category positioning.
 *
 * Hierarchy (positioning first, proof of experience second, offer third):
 *   Hero → The Problem (did you leave the lane) → The Parallel Lane
 *   → Original Intention → Founder Destination → The AI Age → Cherry Blossom™
 *   → The Journey → The Experience → Depth of Entry → HROI™
 *   → Founder Authority → Bigger Purpose → Final CTA
 *
 * Kept separate from the Hub (/) so app functionality, auth, payments, and
 * routes are untouched. Paperbell links and $297/$497 pricing are spec-locked.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNav
        experiencesHref="#offer"
        links={[
          { label: "The Question", href: "#missing" },
          { label: "Founder Destination", href: "#destination" },
          { label: "The Experience", href: "#experience" },
          { label: "Depth of Entry", href: "#offer" },
          { label: "The Founder", href: "#founder" },
        ]}
      />
      <MondayHeroSection />
      <HustleProblemSection />
      <MissingQuestionSection />
      <FounderDestinationSection />
      <AiAgeSection />
      <JourneySection />
      <ExperienceSection />
      <MondayOffer />
      <HroiSection />
      <BiggerPurposeSection />
      <FounderAuthoritySection />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  )
}
