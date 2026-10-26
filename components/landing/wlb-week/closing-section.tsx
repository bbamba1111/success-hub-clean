import { Body, CtaLink, REALITY_CHECK_HREF, SectionTitle } from "./section-primitives"

export function ClosingSection() {
  return (
    <section id="get-started" className="w-full scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-5 text-center sm:px-8">
        <SectionTitle className="sm:text-5xl">Your Business Should Make Room for Life</SectionTitle>
        <Body className="text-lg">
          The Work-Life Balance Business Week&trade; is a place to begin practicing that principle.
        </Body>
        <Body>
          Start by understanding your current reality. Experience work-life balance on Monday. Extend the practice
          across the four-day workweek. Continue with the monthly community as you learn what needs to change.
        </Body>
        <Body>You do not need to have every answer before you begin.</Body>
        <Body className="font-semibold text-[#4A3A42]">You need a place to start.</Body>

        <div className="mt-6 flex w-full flex-col items-center gap-4 rounded-3xl bg-[#FDF6F3] p-8 sm:p-12">
          <p className="font-playfair text-3xl font-bold text-[#4A3A42]">Make Time For More&trade;</p>
          <p className="font-poppins text-pretty text-base font-semibold leading-relaxed text-[#5A7F46]">
            Experience work-life balance in real time. Discover what needs to change. Build a business that makes room
            for life.
          </p>
          <p className="font-playfair text-lg italic text-[#C13B6B]">
            We Don&apos;t Hustle &mdash; We Harmonize Work &amp; Life.&trade;
          </p>
          <div className="pt-2">
            <CtaLink href={REALITY_CHECK_HREF} label="Get Started With the Work-Life Balance Reality Check" />
          </div>
        </div>
      </div>
    </section>
  )
}
