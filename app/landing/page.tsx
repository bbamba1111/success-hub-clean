import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { MondayHeroSection } from "@/components/landing/monday-hero-section"
import { GuideSection } from "@/components/landing/guide-section"
import { PatternSection } from "@/components/landing/pattern-section"
import { TwoLanesSection } from "@/components/landing/two-lanes-section"
import { OriginalIntentionSection } from "@/components/landing/original-intention-section"
import { WhatCreatedSection } from "@/components/landing/what-created-section"
import { MethodSection } from "@/components/landing/method-section"
import { AiAgeSection } from "@/components/landing/ai-age-section"
import { EnterHarmonySection } from "@/components/landing/enter-harmony-section"
import { BusinessDaySection } from "@/components/landing/business-day-section"
import { DayToWeekSection } from "@/components/landing/day-to-week-section"
import { BuildInstallSection } from "@/components/landing/build-install-section"
import { MondaysSection } from "@/components/landing/mondays-section"
import { WhoItsForSection } from "@/components/landing/who-its-for-section"
import { MondayOffer } from "@/components/landing/monday-offer"
import { GuidedTourSection } from "@/components/landing/guided-tour-section"
import { BiggerQuestionSection } from "@/components/landing/bigger-question-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Harmony Lane™ — The Desired Work-Lifestyle Destination™",
  description:
    "A virtual immersive destination for founders who want to experience work-life balance in real time — then redesign how they enter, live, work, and lead their workweek, build the boundaries into the day, and install them into the business.",
  openGraph: {
    title: "Harmony Lane™ — The Desired Work-Lifestyle Destination™",
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
 * One continuous narrative (destination → guide → pattern → the way out →
 * experience → build → install → offer → close):
 *   Hero (destination) → Meet the Guide (Barbara) → 01 The Pattern →
 *   02 The Two Lanes → 03 Original Intention → 04 The Method → 05 The AI Age →
 *   06 Enter Harmony Lane → 07 The Business Day → 08 From Day to Week →
 *   09/10 Build It & Install It → 11 Mondays → 12 Before You Enter →
 *   13 Who It's For → 14 The Virtual Destination → 15 The Offers →
 *   16 The Sunday Guided Tour → 17 The Destination → 18 The Bigger Question →
 *   Final CTA → Footer
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
          { label: "The Pattern", href: "#pattern" },
          { label: "The Two Lanes", href: "#two-lanes" },
          { label: "The Method", href: "#method" },
          { label: "The Experience", href: "#experience" },
          { label: "The Installation", href: "#install" },
          { label: "Meet Barbara", href: "#guide" },
        ]}
      />
      <MondayHeroSection />
      <GuideSection />
      <PatternSection />
      <TwoLanesSection />
      <OriginalIntentionSection />
      <WhatCreatedSection />
      <MethodSection />
      <AiAgeSection />
      <EnterHarmonySection />
      <BusinessDaySection />
      <DayToWeekSection />
      <BuildInstallSection />
      <MondaysSection />
      <WhoItsForSection />
      <MondayOffer />
      <GuidedTourSection />
      <BiggerQuestionSection />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  )
}
