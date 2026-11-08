import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { HolidayHero } from "@/components/landing/holiday/holiday-hero"
import {
  AboutBarbaraSection,
  BusinessWeekSection,
  DisclaimerFooter,
  FaqSection,
  FreedomSection,
  MondaySection,
  NewYearSection,
  RealityCheckSection,
  RegisterSection,
  WeMakeTimeForMoreSection,
} from "@/components/landing/holiday/reality-check-sections"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Harmony Lane™ — Make Time For More This Holiday Season",
  description:
    "Your premium work-life balance destination. Live within work-life balance boundaries while redesigning your business weeks. Start with the free Sunday Work-Life Balance Reality Check™.",
  openGraph: {
    title: "Harmony Lane™ — Your Work-Life Balance Destination",
    description:
      "Before you deploy AI, set boundaries—so AI doesn't automate your hustle. Start with the free Sunday Work-Life Balance Reality Check™.",
    type: "website",
    images: [{ url: "/images/holiday/togetherness-og.jpg", width: 1200, height: 630 }],
  },
}

export const viewport = {
  themeColor: "#2E2228",
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F4]">
      <LandingNav
        tone="dark"
        experiencesHref="#offers"
        ctaLabel="Join the Free Sunday Reality Check"
        links={[
          { label: "Reality Check", href: "#reality-check" },
          { label: "Monday Kickoff", href: "#monday" },
          { label: "Business Week", href: "#business-week" },
          { label: "Questions", href: "#faq" },
        ]}
      />
      <HolidayHero />
      <FreedomSection />
      <WeMakeTimeForMoreSection />
      <BusinessWeekSection />
      <RealityCheckSection />
      <MondaySection />
      <NewYearSection />
      <AboutBarbaraSection />
      <FaqSection />
      <RegisterSection />
      <DisclaimerFooter />
      <LandingFooter />
    </main>
  )
}
