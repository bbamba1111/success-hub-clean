import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { getPostLoginDestination } from "@/utils/reality-check-storage"
import { MondayCtaLink } from "@/components/monday/monday-cta-link"
import { MondayHero } from "@/components/monday/monday-hero"
import { LandingNav } from "@/components/landing/landing-nav"
import { BusinessDayShowcase } from "@/components/landing/business-day-showcase"
import { RitualSection } from "@/components/landing/ritual-section"
import { CherryBlossomSection } from "@/components/landing/cherry-blossom-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { MondayCheckout } from "@/components/monday/monday-checkout"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata = {
  title: "Make Time For More Monday™ | Success Hub",
  description:
    "Redesign your entry into the workweek. Experience your first (or next) Work-Life Balance Business Day™.",
}

const WEEK_RHYTHM = [
  { day: "Monday", role: "Measure + Design + Begin" },
  { day: "Tuesday–Thursday", role: "Build + Operate" },
  { day: "Friday–Saturday", role: "Time Freedom™" },
  { day: "Sunday", role: "Transition + Recovery" },
]

export default async function MondayLandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Authenticated members: reuse the existing onboarding/assessment state
  // check so the CTA takes them straight into their correct current
  // destination — never re-running checkout or onboarding they've already
  // completed. getPostLoginDestination() covers every server-checkable gate
  // (Supabase-backed Reality Check); MondayCtaLink below layers in the one
  // gate that only lives in localStorage (Business Context™) on the client.
  //
  // Unauthenticated visitors scroll to the embedded SamCart checkout further
  // down this same page — /pricing is a separate legacy catalog and is not
  // part of this offer.
  const primaryHref = user ? await getPostLoginDestination() : "#monday-checkout"

  return (
    <main className="min-h-screen bg-white">
      {/* /monday doesn't render the #experiences showcase section, so send
          "Experiences" and "Begin Your Journey" straight to the embedded
          $497 checkout below instead of a section that isn't on this page. */}
      <LandingNav experiencesHref="#monday-checkout" />
      <MondayHero primaryHref={primaryHref} />

      {/* Monday explainer */}
      <section id="monday-rhythm" className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#2F4F4F] mb-6 text-balance">
              Monday Is Your Weekly Anchor
            </h2>
            <p className="font-poppins text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
              Not the whole product — the beginning of it. Every Monday you take stock of the past week, design the
              week ahead, and step into a fully guided Work-Life Balance Business Day™.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-20">
            {WEEK_RHYTHM.map((item) => (
              <div
                key={item.day}
                className="bg-white rounded-2xl p-6 border border-[#7FB069]/20 text-center shadow-sm"
              >
                <p className="font-poppins text-sm font-semibold tracking-wide text-[#7FB069] uppercase mb-2">
                  {item.day}
                </p>
                <p className="font-playfair text-lg font-bold text-[#2F4F4F]">{item.role}</p>
              </div>
            ))}
          </div>

          <p className="font-poppins text-sm text-gray-500 text-center max-w-2xl mx-auto">
            New members begin with a one-time 30-day baseline Audit + Entrepreneur Success Assessment™. Returning
            members reflect on the past 7 days — once measured, it&apos;s locked until next Monday, so you can spend
            the week living it rather than re-measuring it.
          </p>
        </div>
      </section>

      {/* Cards of the day — the same editorial, image-led rhythm shown on /landing,
          pulled live from the canonical SCHEDULE so it can never drift. */}
      <BusinessDayShowcase />

      {/* The rest of the /landing story, reused as-is so Monday visitors see
          the full picture: the weekly ritual, Cherry Blossom™, social proof,
          and pricing — not just the Monday-specific framing above. */}
      <RitualSection />
      <CherryBlossomSection />
      <TestimonialsSection />

      {/* The live $497 one-time offer — embedded SamCart checkout, not a
          link out to /pricing (that page is a separate legacy catalog). */}
      <MondayCheckout />

      {/* What it's not */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="space-y-4 font-poppins text-lg md:text-xl text-gray-600 mb-10">
            <p>This is not a course.</p>
            <p>Not traditional coworking.</p>
            <p>Not another productivity hack.</p>
          </div>
          <p className="font-playfair text-2xl md:text-3xl font-bold text-[#2F4F4F] mb-12 text-balance">
            It is your Work-Life Balance Business Week™, installed.
          </p>
          <ul className="grid sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto mb-12">
            {[
              "A guided Reality Check™ every Monday",
              "A designed week, not a guessed one",
              "Built-in Time Freedom™ every Friday and Saturday",
              "One weekly measurement — never re-asked mid-week",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7FB069] mt-0.5 shrink-0" />
                <span className="font-poppins text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
          <MondayCtaLink serverHref={primaryHref}>
            <Button
              size="lg"
              className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-10 py-7 text-lg font-poppins font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Experience Your First Work-Life Balance Business Day™
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </MondayCtaLink>
        </div>
      </section>

      <LandingFooter />
    </main>
  )
}
