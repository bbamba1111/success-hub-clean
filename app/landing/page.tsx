import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { MondayHeroSection } from "@/components/landing/monday-hero-section"
import { MondayRecognitionSection } from "@/components/landing/monday-recognition-section"
import { MondayExperienceSection } from "@/components/landing/monday-experience-section"
import { BeforeMondaySection } from "@/components/landing/before-monday-section"
import { MondayOffer } from "@/components/landing/monday-offer"
import { HumanSustainabilitySection } from "@/components/landing/human-sustainability-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata: Metadata = {
  title: "Harmony Lane™ — Make Time For More™ On Mondays",
  description:
    "You built your business for more life. The Work-Life Balance Business Day™ is a live operating environment where you experience protected work and protected life in real time. Join Monday — $1,997.",
  openGraph: {
    title: "Harmony Lane™ — Make Time For More™ On Mondays",
    description:
      "Experience Work-Life Balance in real time. Contain the work, protect the rest, and let life have space to expand™. Your entry into Harmony Lane™ begins on Monday.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#FDF6F3",
}

/**
 * Public marketing site at /landing — Harmony Lane™, repositioned Monday-first.
 *
 * The page's job is NOT to explain the entire Harmony Lane™ operating model
 * before the visitor has bought Monday. It is to make the right founder
 * recognize herself, understand what Monday is, want to experience it, see what
 * she receives, and join ($1,997). The deeper methodology (Boundary Audit,
 * Operations Week detail, Founder OS, Human Sustainability™ methodology) lives
 * post-purchase and on deeper pages — not on this front door.
 *
 *   01 ENTER      → Hero: Make Time For More™ On Mondays (Join Monday — $1,997)
 *   02 RECOGNIZE  → You built your business for freedom / the boundaries didn't
 *   03 MONDAY     → The Work-Life Balance Business Day™ + the schedule
 *   04 JOURNEY    → Before Monday: Reality Check → Report → Tour → Monday
 *   05 OFFER      → Make Time For More On Mondays™ — $1,997 (+ Week / Install tiers)
 *   06 SUSTAIN    → Short Human Sustainability™ / AI Age framing
 *   07 CLOSE      → Final CTA
 *
 * The free Sunday Guided Tour has been removed as a competing front door — the
 * Tour is now part of the paid experience. Paperbell links and pricing are
 * spec-locked inside <MondayOffer /> — never change the checkout URLs.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNav
        experiencesHref="#offer"
        ctaLabel="Join Monday"
        links={[
          { label: "How It Works", href: "#how-it-works" },
          { label: "Monday", href: "#monday" },
          { label: "Business Week", href: "#offer" },
        ]}
      />
      <MondayHeroSection />
      <MondayRecognitionSection />
      <MondayExperienceSection />
      <BeforeMondaySection />
      <MondayOffer />
      <HumanSustainabilitySection />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  )
}
