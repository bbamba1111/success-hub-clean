import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { MondayHeroSection } from "@/components/landing/monday-hero-section"
import { GuideSection } from "@/components/landing/guide-section"
import { OriginalIntentionSection } from "@/components/landing/original-intention-section"
import { WhatCreatedSection } from "@/components/landing/what-created-section"
import { MethodSection } from "@/components/landing/method-section"
import { BusinessDaySection } from "@/components/landing/business-day-section"
import { DayToWeekSection } from "@/components/landing/day-to-week-section"
import { BuildInstallSection } from "@/components/landing/build-install-section"
import { AiAgeSection } from "@/components/landing/ai-age-section"
import { WhoItsForSection } from "@/components/landing/who-its-for-section"
import { MondayOffer } from "@/components/landing/monday-offer"
import { GuidedTourSection } from "@/components/landing/guided-tour-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Harmony Lane™ — The Work-Life Balance Business Day™",
  description:
    "A virtual immersive destination for founders who want to experience work-life balance in real time — then redesign how they enter, live, work, and lead their workweek, build the boundaries into the day, and install them into the business.",
  openGraph: {
    title: "Harmony Lane™ — The Work-Life Balance Business Day™",
    description:
      "Experience Work-Life Balance in real time. Redesign your workweek. Build the boundaries into your day. Install them into your business — and build a workplace of the future.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#FDF6F3",
}

/**
 * Public marketing site at /landing — Harmony Lane™ destination positioning.
 *
 * Editorial narrative — one question per section, then move forward:
 *   01 ENTER      → Hero (Harmony Lane™ presents The Work-Life Balance Business Day™)
 *   02 RECOGNIZE  → Meet the Guide + the pattern (Barbara + the problem)
 *   03 REMEMBER   → Original Entrepreneurial Intention™
 *   04 SEE        → What have you actually created? (the diagnostic)
 *   05 REDESIGN   → The Method (build boundaries into the day)
 *   06 EXPERIENCE → The Work-Life Balance Business Day™ (the star)
 *   07 EXTEND     → From Day to Week (Monday folded in as a compact callout)
 *   08 INSTALL    → Build it & install it into the business
 *   09 FUTURE     → The AI Age
 *   10 ENTER      → Who it's for → The Offers (choose your depth of entry)
 *   11 TOUR       → Free Sunday Guided Tour (secondary invitation)
 *   12 CLOSE      → Final CTA
 *
 * Kept separate from the Hub (/). Paperbell links and pricing are spec-locked
 * inside <MondayOffer /> — never change or replace the checkout URLs.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNav
        experiencesHref="#offer"
        links={[
          { label: "The Invitation", href: "#guide" },
          { label: "The Experience", href: "#experience" },
          { label: "The Week", href: "#week" },
          { label: "The Installation", href: "#install" },
          { label: "Enter Harmony Lane", href: "#offer" },
        ]}
      />
      <MondayHeroSection />
      <GuideSection />
      <OriginalIntentionSection />
      <WhatCreatedSection />
      <MethodSection />
      <BusinessDaySection />
      <DayToWeekSection />
      <BuildInstallSection />
      <AiAgeSection />
      <WhoItsForSection />
      <MondayOffer />
      <GuidedTourSection />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  )
}
