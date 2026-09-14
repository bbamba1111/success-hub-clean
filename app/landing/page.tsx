import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { MondayHeroSection } from "@/components/landing/monday-hero-section"
import { ParallelLaneSection } from "@/components/landing/parallel-lane-section"
import { BusinessDayFlow } from "@/components/landing/business-day-flow"
import { MondayJourney } from "@/components/landing/monday-journey"
import { DestinationSection } from "@/components/landing/destination-section"
import { MondayOffer } from "@/components/landing/monday-offer"
import { CherryBlossomSection } from "@/components/landing/cherry-blossom-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Harmony Lane™ — The Work-Life Balance Destination™",
  description:
    "Make Time For More™: experience the Work-Life Balance Business Day™ in real time. Harmony Lane™ is the parallel lane to hustle entrepreneurship for founders who want to live, work, and lead in balance.",
  openGraph: {
    title: "Harmony Lane™ — The Work-Life Balance Destination™",
    description:
      "Experience the Work-Life Balance Business Day™ in real time. A destination for founders who want sustainable success, not more hustle.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#FDF6F3",
}

/**
 * Premium public marketing site (Phase 1) at /landing.
 *
 * Built with the Success Hub design system (Playfair/Poppins/Great Vibes,
 * cherry palette, glassmorphism, immersive imagery, framer-motion). Kept as a
 * separate route so the existing Hub (/) and legacy /marketing page are
 * untouched; this can later be promoted to the production homepage with
 * minimal refactoring.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNav
        experiencesHref="#offer"
        links={[
          { label: "The Parallel Lane", href: "#parallel-lane" },
          { label: "The Business Day", href: "#business-day" },
          { label: "Why Monday", href: "#monday" },
          { label: "The Destination", href: "#destination" },
          { label: "The Experience", href: "#offer" },
        ]}
      />
      <MondayHeroSection />
      <ParallelLaneSection />
      <BusinessDayFlow />
      <MondayJourney />
      <DestinationSection />
      <MondayOffer />
      <CherryBlossomSection />
      <TestimonialsSection />
      <LandingFooter />
    </main>
  )
}
