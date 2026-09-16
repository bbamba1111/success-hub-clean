import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { MondayHeroSection } from "@/components/landing/monday-hero-section"
import { HustleProblemSection } from "@/components/landing/hustle-problem-section"
import { OriginalIntentionSection } from "@/components/landing/original-intention-section"
import { SuccessAlignmentSection } from "@/components/landing/success-alignment-section"
import { FounderDestinationSection } from "@/components/landing/founder-destination-section"
import { AiAgeSection } from "@/components/landing/ai-age-section"
import { ExperienceSection } from "@/components/landing/experience-section"
import { FourHourWorkdaySection } from "@/components/landing/four-hour-workday-section"
import { WeeklyLoopSection } from "@/components/landing/weekly-loop-section"
import { MondayOffer } from "@/components/landing/monday-offer"
import { WhoItsForSection } from "@/components/landing/who-its-for-section"
import { HroiSection } from "@/components/landing/hroi-section"
import { FounderAuthoritySection } from "@/components/landing/founder-authority-section"
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
 * Narrative hierarchy (recognition → destination → experience → offer → proof):
 *   Hero → The Recognition → Original Intention → Success Alignment
 *   → Founder Destination™ → The AI Age → The Experience (Business Day)
 *   → The 4-Hour Workday → The Weekly Loop → Depth of Entry → Who It's For
 *   → HROI™ → The Founder → Final CTA
 *
 * Kept separate from the Hub (/) so app functionality, auth, payments, and
 * routes are untouched. Paperbell links and pricing are spec-locked.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNav
        experiencesHref="#offer"
        links={[
          { label: "The Question", href: "#problem" },
          { label: "Founder Destination", href: "#destination" },
          { label: "The Future of Work", href: "#ai-age" },
          { label: "The Experience", href: "#experience" },
          { label: "Depth of Entry", href: "#offer" },
          { label: "The Founder", href: "#founder" },
        ]}
      />
      <MondayHeroSection />
      <HustleProblemSection />
      <OriginalIntentionSection />
      <SuccessAlignmentSection />
      <FounderDestinationSection />
      <AiAgeSection />
      <ExperienceSection />
      <FourHourWorkdaySection />
      <WeeklyLoopSection />
      <MondayOffer />
      <WhoItsForSection />
      <HroiSection />
      <FounderAuthoritySection />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  )
}
