import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { WlbHeroSection } from "@/components/landing/wlb-week/wlb-hero-section"
import { FreedomRealitySection } from "@/components/landing/wlb-week/freedom-reality-section"
import { IntroducingSection } from "@/components/landing/wlb-week/introducing-section"
import { RealityCheckSection } from "@/components/landing/wlb-week/reality-check-section"
import { MondayExperienceSection } from "@/components/landing/wlb-week/monday-experience-section"
import { FourDaySection } from "@/components/landing/wlb-week/four-day-section"
import { CommunitySection } from "@/components/landing/wlb-week/community-section"
import { AiCapacitySection } from "@/components/landing/wlb-week/ai-capacity-section"
import { ClosingSection } from "@/components/landing/wlb-week/closing-section"

export const metadata: Metadata = {
  title: "Make Time For More™ — The Work-Life Balance Business Week™",
  description:
    "Workweek redesign for human sustainability in the accelerated age of AI. Take the Work-Life Balance Reality Check™, experience Monday, extend across the four-day week, and practice inside the coworking community.",
  openGraph: {
    title: "Make Time For More™ — The Work-Life Balance Business Week™",
    description:
      "AI is creating capacity. What will you do with the time it gives you back? Experience work-life balance in real time.",
    type: "website",
  },
}

export const viewport = {
  themeColor: "#FDF6F3",
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <LandingNav
        experiencesHref="/reality-check"
        ctaLabel="Take the Reality Check"
        links={[
          { label: "Reality Check", href: "#reality-check" },
          { label: "Monday", href: "#monday" },
          { label: "Four-Day Week", href: "#four-day" },
          { label: "Community", href: "#community" },
        ]}
      />
      <WlbHeroSection />
      <FreedomRealitySection />
      <IntroducingSection />
      <RealityCheckSection />
      <MondayExperienceSection />
      <FourDaySection />
      <CommunitySection />
      <AiCapacitySection />
      <ClosingSection />
      <LandingFooter />
    </main>
  )
}
