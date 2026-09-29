import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OneDayHero } from "@/components/one-day/one-day-hero"
import { OneDayCtaLink } from "@/components/one-day/one-day-cta-link"
import { OneDayCheckout } from "@/components/one-day/one-day-checkout"
import { LandingNav } from "@/components/landing/landing-nav"
import { BusinessDayShowcase } from "@/components/landing/business-day-showcase"
import { RitualSection } from "@/components/landing/ritual-section"
import { CherryBlossomSection } from "@/components/landing/cherry-blossom-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export const metadata = {
  title: "Make Time For More on Mondays™ | Success Hub",
  description:
    "A live, full-day guided group experience. Design & install your first (or next) Work-Life Balance Business Day™ with Thought Leader Barbara.",
}

const WHO_THIS_IS_FOR = [
  "You started your business for freedom.",
  "You wanted more control over your time.",
  "You wanted flexibility and meaningful work.",
  "You wanted a life your business supported.",
]

const MAY_BE_HAPPENING = [
  "Working too many hours, at night, or on weekends",
  "Working through lunch, with too many meetings and interruptions",
  "Carrying too many responsibilities and decisions yourself",
  "Doing work someone else could own",
  "Struggling to disconnect from the business",
]

const DAY_CONTAINS = [
  {
    title: "Work-Life Balance Reality Check™",
    description: "Your existing Work-Life Balance Audit™ + ESA help you see what is happening in your business, your work, and your life.",
  },
  {
    title: "Design Your Work-Life Balance Business Day™",
    description: "Decide what needs to happen today and what needs to change so your work can fit inside your protected workday.",
  },
  {
    title: "Live the Model",
    description: "Experience the Harmony Lane Work-Life Balance Business Day™ in real time.",
  },
  {
    title: "Business Cleanup",
    description: "Identify what is making the work expand unnecessarily.",
  },
  {
    title: "Business Building",
    description: "Work on the real business priorities and Business Assets™ that matter now.",
  },
  {
    title: "Business Operating Rules™",
    description: "Create rules for how your business should work and for the workplace you want to create.",
  },
  {
    title: "Delegation",
    description: "Identify work that should move to someone else.",
  },
  {
    title: "AI Augmentation",
    description: "Identify appropriate opportunities where AI can help.",
  },
  {
    title: "Revenue",
    description: "Protect and execute the work that actually moves the business forward.",
  },
  {
    title: "Boundaries",
    description: "Create and practice boundaries that contain work.",
  },
  {
    title: "Time Freedom™",
    description: "Experience what it feels like when work has a container.",
  },
]

const LEAVE_WITH = [
  "Your Work-Life Balance Business Day™ design",
  "A clear picture of what is expanding your workday",
  "Your priority work identified",
  "Initial Business Operating Rules™",
  "Delegation opportunities",
  "AI augmentation opportunities",
  "Business Assets™ that need to be built or improved",
  "A clearer separation between work that requires you and work that does not",
  "A repeatable business day structure",
  "A lived experience of the Harmony Lane Work-Life Balance Business Model™",
]

const REVENUE_PATH_STEPS = [
  "Ideal Client",
  "Transformation",
  "Offer",
  "Client Connection Experience™",
  "Sales",
  "Onboarding",
  "Delivery",
  "Client Success",
  "Proof",
  "Repeat Business",
  "Referrals",
]

const CLIENT_CONNECTION_EXPERIENCES = ["Challenge", "Webinar", "Workshop", "Immersion Experience", "Mastermind"]

export default function OneDayLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* /1day doesn't render the #experiences catalog section, so send
          "Experiences" and "Begin Your Journey" straight to this page's own
          investment section instead of a section that isn't here. */}
      <LandingNav experiencesHref="#one-day-checkout" />
      <OneDayHero />

      {/* The Big Idea */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#4A3A42] mb-6 text-balance">
            The Business Should Fit the Workday. Your Life Should Not Have to Fit Around the Business.
          </h2>
          <p className="font-poppins text-lg md:text-xl text-[#6B5860] leading-relaxed text-pretty">
            We don&apos;t simply tell you to work less. We look at the business itself. What is taking too much of
            your time? What keeps coming back to you? What can be eliminated? What should be delegated? What can AI
            help with? What Business Asset™ is missing? What Business Operating Rule™ needs to be created? What work
            truly requires you? Then we begin changing the way the business operates so the work can fit.
          </p>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-20 md:py-28 bg-[#FDF6F3]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#4A3A42] mb-6 text-balance">
              You May Be a Fit If
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {WHO_THIS_IS_FOR.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm border border-[#7FB069]/15">
                <Check className="w-5 h-5 text-[#7FB069] mt-0.5 shrink-0" />
                <span className="font-poppins text-[#5A4A52]">{item}</span>
              </div>
            ))}
          </div>
          <p className="font-poppins text-center text-[#6B5860] max-w-2xl mx-auto mb-6">
            But the business may now be taking more of your time than you intended. You may recognize:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {MAY_BE_HAPPENING.map((item) => (
              <li key={item} className="font-poppins text-sm text-[#6B5860] flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#E26C73] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="font-poppins text-center text-[#4A3A42] font-semibold mt-10 max-w-2xl mx-auto text-balance">
            Your business may be successful. The way it operates may simply no longer support the life you built it
            for.
          </p>
        </div>
      </section>

      {/* The Redesigned Entry Into the Workweek */}
      <section id="redesigned-entry" className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-[#7FB069]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46] mb-6">
            Make Time For More on Mondays™
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#4A3A42] mb-6 text-balance">
            The Redesigned Entry Into the Workweek
          </h2>
          <p className="font-poppins text-lg text-[#6B5860] leading-relaxed max-w-2xl mx-auto mb-4 text-pretty">
            Most people don&apos;t look forward to Monday. At Harmony Lane, Monday becomes the day you intentionally
            enter the workweek — instead of immediately reacting to everyone else&apos;s demands, you see what is
            actually happening, decide what matters, and enter a protected workday designed to move your business
            forward without giving your life back.
          </p>
          <p className="font-playfair text-xl md:text-2xl font-bold text-[#C13B6B] mt-8 text-balance">
            Featuring the New 9–5 + Night-Time Non-Negotiable™ Sustainable Operating Practices
          </p>
        </div>
      </section>

      {/* What your day contains */}
      <section id="one-day-contains" className="py-20 md:py-28 bg-[#FDF6F3]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#4A3A42] mb-6 text-balance">
              What Your Day Contains
            </h2>
            <p className="font-poppins text-lg text-[#6B5860] max-w-2xl mx-auto text-pretty">
              A live, guided, full-day experience — not a minute-by-minute agenda, but a container for what matters.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {DAY_CONTAINS.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-[#7FB069]/20 shadow-sm">
                <h3 className="font-playfair text-lg font-bold text-[#2F4F4F] mb-2">{item.title}</h3>
                <p className="font-poppins text-sm text-[#6B5860] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BusinessDayShowcase />
      <RitualSection />

      {/* What you leave with */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#4A3A42] mb-6 text-balance">
              Leave With Your Work-Life Balance Business Day™ Designed and Ready to Repeat
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-4">
            {LEAVE_WITH.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#7FB069] mt-0.5 shrink-0" />
                <span className="font-poppins text-[#5A4A52]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Business-building component */}
      <section className="py-20 md:py-28 bg-[#FDF6F3]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-2xl md:text-4xl font-bold text-[#4A3A42] mb-6 text-balance">
            You Don&apos;t Have to Build Your Business First and Fix Your Life Later.
          </h2>
          <p className="font-playfair text-2xl md:text-4xl font-bold text-[#7FB069] mb-8 text-balance">
            You Can Build the Business While Learning to Work Differently.
          </p>
          <p className="font-poppins text-lg text-[#6B5860] leading-relaxed max-w-2xl mx-auto mb-10 text-pretty">
            You bring your actual business into the experience. You may use the day to build a missing Business
            Asset™, solve a business bottleneck, create a Business Operating Rule™, identify work to delegate or
            augment with AI, protect revenue-producing work, improve client delivery or onboarding, and restructure
            work so it fits inside the workday.
          </p>

          {/* Client Connection Experience — supporting mention only, not the page's main focus */}
          <div className="rounded-3xl bg-white border border-[#7FB069]/20 p-8 max-w-2xl mx-auto text-left">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.14em] text-[#5A7F46] mb-4">
              When Appropriate, Your Workday Can Include Building Toward
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {REVENUE_PATH_STEPS.map((step) => (
                <span
                  key={step}
                  className="font-poppins text-xs rounded-full bg-[#7FB069]/10 text-[#5A7F46] px-3 py-1.5"
                >
                  {step}
                </span>
              ))}
            </div>
            <p className="font-poppins text-sm text-[#6B5860] mb-3">
              The primary Client Connection Experiences™:
            </p>
            <div className="flex flex-wrap gap-2">
              {CLIENT_CONNECTION_EXPERIENCES.map((exp) => (
                <span key={exp} className="font-poppins text-xs rounded-full bg-[#E26C73]/10 text-[#C13B6B] px-3 py-1.5">
                  {exp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reconnect with your original entrepreneurial intention */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#4A3A42] mb-6 text-balance">
            Reconnect With Your Original Entrepreneurial Intention™
          </h2>
          <p className="font-poppins text-lg text-[#6B5860] leading-relaxed max-w-2xl mx-auto mb-8 text-pretty">
            You started your business for something — freedom, family, flexibility, meaning, impact, creativity,
            wealth, time. You didn&apos;t start it to create another job that owns your life. This experience helps
            you reconnect with why you became an entrepreneur in the first place and begin building a business that
            can support that intention.
          </p>
          <p className="font-playfair text-xl md:text-2xl font-bold text-[#7FB069] text-balance">
            Build the Business You Want Without Building a Life You Don&apos;t Want.
          </p>
        </div>
      </section>

      <CherryBlossomSection />

      {/* Thought Leader Barbara — live group positioning */}
      <section className="py-20 md:py-28 bg-[#FDF6F3]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-[#4A3A42] mb-6 text-balance">
            Learn With Me. Work With Me. Experience the Model With Me.
          </h2>
          <p className="font-poppins text-lg text-[#6B5860] leading-relaxed max-w-2xl mx-auto mb-6 text-pretty">
            This is a live experience. Thought Leader Barbara guides the group, explains the model, answers
            questions, provides perspective, and offers spot coaching when you get stuck. You are not left alone
            with a workbook — you are working in real time, inside a curated environment alongside other
            entrepreneurs who are also building more sustainable businesses.
          </p>
          <p className="font-poppins text-sm text-[#8A7A82] max-w-xl mx-auto">
            The group creates shared momentum, accountability, perspective, community, and a normalized, sustainable
            way of working.
          </p>
        </div>
      </section>

      <TestimonialsSection />

      <OneDayCheckout />

      {/* What it's not */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="space-y-4 font-poppins text-lg md:text-xl text-[#6B5860] mb-10">
            <p>This is not software or an AI service.</p>
            <p>Not a coworking membership. Not private consulting.</p>
            <p>Not a recorded course or passive webinar.</p>
          </div>
          <p className="font-playfair text-2xl md:text-3xl font-bold text-[#4A3A42] mb-12 text-balance">
            It is a live, guided, full-day Work-Life Balance Business Day™ experience.
          </p>
          <OneDayCtaLink>
            <Button
              size="lg"
              className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-10 py-7 text-lg font-poppins font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Design &amp; Install My Work-Life Balance Business Day™
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </OneDayCtaLink>
        </div>
      </section>

      <LandingFooter />
    </main>
  )
}
