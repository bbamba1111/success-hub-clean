import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { MondayHeroSection } from "@/components/landing/monday-hero-section"
import { CategoryThesisSection } from "@/components/landing/category-thesis-section"
import { FounderIdentifySection } from "@/components/landing/founder-identify-section"
import { RecognizeSection } from "@/components/landing/recognize-section"
import { RootProblemSection } from "@/components/landing/root-problem-section"
import { BoundaryFirstSection } from "@/components/landing/boundary-first-section"
import { BoundaryAuditSection } from "@/components/landing/boundary-audit-section"
import { OperationsWeekSection } from "@/components/landing/operations-week-section"
import { BoundaryMapSection } from "@/components/landing/boundary-map-section"
import { AiAgeSection } from "@/components/landing/ai-age-section"
import { HumanSustainabilitySection } from "@/components/landing/human-sustainability-section"
import { NotProductivitySection } from "@/components/landing/not-productivity-section"
import { MondayOffer } from "@/components/landing/monday-offer"
import { BuildInstallSection } from "@/components/landing/build-install-section"
import { GuidedTourSection } from "@/components/landing/guided-tour-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Harmony Lane™ — The Work-Life Balance Business Operations Week™",
  description:
    "Work-life balance is no longer merely a personal wellness goal — it is a business-design requirement for Human Sustainability™ in the AI Age. Find the boundaries, operate by them for a full week, and install them into how your business runs.",
  openGraph: {
    title: "Harmony Lane™ — The Work-Life Balance Business Operations Week™",
    description:
      "A 7-day real-business operating experience for founders. Always start with the boundary — then turn it into a Human Sustainability™ Operating Standard for the AI Age.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#FDF6F3",
}

/**
 * Public marketing site at /landing — Harmony Lane™ positioning.
 *
 * Narrative lock (boundary-first): the page argues that work-life balance is a
 * business-design requirement, then walks the founder from recognition →
 * boundary → audit → the Operations Week (the primary $3,997 experience, with
 * the Work-Life Balance Business Day™ living inside it) → the bigger idea →
 * the offer → installation → close.
 *
 *   01 ENTER      → Hero (Operations Week™)
 *   02 THESIS     → Work-life balance as a business-design requirement
 *   03 IDENTIFY   → You built your business for freedom
 *   04 RECOGNIZE  → You may recognize yourself here
 *   05 ROOT       → The business needs boundaries
 *   06 BOUNDARY   → Always start with the boundary (governing principle)
 *   07 AUDIT      → The Work-Life Balance Boundary Audit™ (3 + 3)
 *   08 WEEK       → The Operations Week™ (Business Day folded inside)
 *   09 MAP        → Why the 3 + 3 model
 *   10 AI AGE     → The future of work
 *   11 SUSTAIN    → Human Sustainability™
 *   12 REFRAME    → Not a productivity program
 *   13 OFFER      → Enter the Operations Week™ (+ Installation tier)
 *   14 INSTALL    → Build it & install it into the business
 *   15 TOUR       → Free Sunday Guided Tour
 *   16 CLOSE      → Final CTA
 *
 * Paperbell links and pricing are spec-locked inside <MondayOffer /> — never
 * change or replace the checkout URLs.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNav experiencesHref="#offer" />
      <MondayHeroSection />
      <CategoryThesisSection />
      <FounderIdentifySection />
      <RecognizeSection />
      <RootProblemSection />
      <BoundaryFirstSection />
      <BoundaryAuditSection />
      <OperationsWeekSection />
      <BoundaryMapSection />
      <AiAgeSection />
      <HumanSustainabilitySection />
      <NotProductivitySection />
      <MondayOffer />
      <BuildInstallSection />
      <GuidedTourSection />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  )
}
