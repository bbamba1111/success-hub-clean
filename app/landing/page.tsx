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
} from "@/components/landing/holiday/reality-check-sections"
import { formatSessionDate, nextSessionDate } from "@/lib/reality-check/session"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Don't Wait for the New Year — Free Weekly Work-Life Balance Reality Check™",
  description:
    "Start creating and celebrating the life you want now. Join the free, live Weekly Work-Life Balance Reality Check™, then practice real boundaries while doing your real work on Monday.",
  openGraph: {
    title: "Don't Wait for the New Year to Start Creating & Celebrating the Life You Want",
    description:
      "AI is creating capacity. Decide what you'll do with the time it gives you back. Save your free seat — no credit card required.",
    type: "website",
    images: ["/images/holiday/togetherness.png"],
  },
}

export const viewport = {
  themeColor: "#2E2228",
}

export default function LandingPage() {
  const sessionLabel = formatSessionDate(nextSessionDate())

  return (
    <main className="min-h-screen bg-[#FFF8F4]">
      <LandingNav
        experiencesHref="#register"
        ctaLabel="Save My Free Seat"
        links={[
          { label: "Reality Check", href: "#reality-check" },
          { label: "Monday", href: "#monday" },
          { label: "Questions", href: "#faq" },
        ]}
      />
      <HolidayHero sessionLabel={sessionLabel} />
      <FreedomSection />
      <RealityCheckSection sessionLabel={sessionLabel} />
      <MondaySection />
      <BusinessWeekSection />
      <NewYearSection />
      <AboutBarbaraSection />
      <FaqSection />
      <RegisterSection sessionLabel={sessionLabel} />
      <DisclaimerFooter />
      <LandingFooter />
    </main>
  )
}
