import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { LandingHero } from "@/components/landing/landing-hero"
import { BusinessDayShowcase } from "@/components/landing/business-day-showcase"
import { RitualSection } from "@/components/landing/ritual-section"
import { CherryBlossomSection } from "@/components/landing/cherry-blossom-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { ExperiencesSection } from "@/components/landing/experiences-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Make Time For More — Build a business that gives you more life",
  description:
    "A guided daily operating system for founders and leaders. Live the Work-Life Balance Business Day™ with AI coaching from Cherry Blossom™ and a community that keeps you present.",
  openGraph: {
    title: "Make Time For More — Build a business that gives you more life",
    description:
      "Live the Work-Life Balance Business Day™ — eight guided phases, a weekly ritual, and an AI coach who remembers you.",
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
      <LandingNav />
      <LandingHero />
      <BusinessDayShowcase />
      <RitualSection />
      <CherryBlossomSection />
      <TestimonialsSection />
      <ExperiencesSection />
      <LandingFooter />
    </main>
  )
}
