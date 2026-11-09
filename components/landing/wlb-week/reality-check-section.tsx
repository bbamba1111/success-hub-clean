import { Body, BulletList, CtaLink, Emphasis, Eyebrow, REALITY_CHECK_HREF, SectionTitle } from "./section-primitives"

const DISCOVERIES = [
  "Where business demands are interfering with the life you want to live.",
  "Where your intended boundaries collide with the realities of your workweek.",
  "Where the business may depend on your constant involvement.",
  "What you may need to examine as you redesign your workweek for greater time freedom.",
]

export function RealityCheckSection() {
  return (
    <section id="reality-check" className="w-full scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-5 lg:gap-16">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Eyebrow>Start With the Reality Check</Eyebrow>
          <SectionTitle>The Work-Life Balance Reality Check&trade;</SectionTitle>
          <Body className="text-lg font-semibold text-[#4A3A42]">
            Before redesigning your workweek, understand the one you have.
          </Body>
          <Body>
            The Reality Check helps you examine your current experience of work-life balance and begin identifying the
            areas that need attention.
          </Body>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl border border-[#F2E4E8] bg-[#FDF6F3] p-7 sm:p-10 lg:col-span-3">
          <p className="font-playfair text-xl font-bold text-[#4A3A42]">Discover:</p>
          <BulletList items={DISCOVERIES} />
          <Body className="text-sm">
            Your results provide a starting point for reflection&mdash;not a judgment of your success or a demand to
            change everything at once.
          </Body>
          <Emphasis>First, see your reality. Then begin experiencing a different possibility.</Emphasis>
          <CtaLink href={REALITY_CHECK_HREF} label="Take the Reality Check" />
        </div>
      </div>
    </section>
  )
}
