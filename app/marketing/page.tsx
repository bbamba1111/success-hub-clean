import { MarketingNav } from "@/components/marketing/marketing-nav"
import { HeroSection } from "@/components/marketing/hero-section"
import { ProblemSection } from "@/components/marketing/problem-section"
import { HarmonyLaneSection } from "@/components/marketing/harmony-lane-section"
import { SundayShiftSection } from "@/components/marketing/sunday-shift-section"
import { MondayPreviewSection } from "@/components/marketing/monday-preview-section"
import { OfferCardsSection } from "@/components/marketing/offer-cards-section"
import { PremiumSection } from "@/components/marketing/premium-section"
import { GardenClosingSection } from "@/components/marketing/garden-closing-section"
import { Footer } from "@/components/marketing/footer"

// Skip static generation - countdown timer uses client-side only APIs
export const dynamic = 'force-dynamic'

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen">
      <MarketingNav />
      <HeroSection />
      <ProblemSection />
      <HarmonyLaneSection />
      <SundayShiftSection />
      <MondayPreviewSection />
      <OfferCardsSection />
      <PremiumSection />
      <GardenClosingSection />
      <Footer />
    </main>
  )
}
