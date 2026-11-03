import type { Metadata } from "next"
import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { HolidayHero } from "@/components/landing/holiday/holiday-hero"
import {
  BoundariesSection,
  DisclaimerFooter,
  ExperiencesSection,
  FaqSection,
  FitSection,
  FreedomSection,
  RealityCheckSection,
  RegisterSection,
} from "@/components/landing/holiday/reality-check-sections"
import { formatSessionDate, nextSessionDate } from "@/lib/reality-check/session"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Make Time For More This Holiday Season — Free Weekly Work-Life Balance Reality Check™",
  description:
    "Join the free, live Work-Life Balance Reality Check™ every Sunday. See where your business collides with the life you want, and leave with a clear starting point for your first Monday.",
  openGraph: {
    title: "Make Time For More This Holiday Season",
    description:
      "AI is about to give founders back a lot of time. This season, decide what you'll do with it. Save your free seat.",
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
          { label: "How It Works", href: "#reality-check" },
          { label: "Questions", href: "#faq" },
        ]}
      />
      <HolidayHero sessionLabel={sessionLabel} />
      <FreedomSection />
      <BoundariesSection />
      <ExperiencesSection />
      <RealityCheckSection />
      <FitSection />
      <FaqSection />
      <RegisterSection sessionLabel={sessionLabel} />
      <DisclaimerFooter />
      <LandingFooter />
    </main>
  )
}
