import { getPlanByLevel } from "@/lib/payments/config"
import { OfferCta } from "./offer-cta"
import { FoundingPriceNote } from "./founding-price-note"

export function FinalOffersSection() {
  const monday = getPlanByLevel("business-day")
  const week = getPlanByLevel("business-week")

  return (
    <section id="reserve" className="w-full scroll-mt-20 bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Your Next Workweek Can Begin Differently.
          </h2>
          <p className="font-playfair mt-6 text-xl font-semibold text-[#C13B6B]">
            You became an entrepreneur for freedom.
          </p>
          <p className="font-poppins mt-4 text-pretty text-lg leading-relaxed text-[#5A4A52]">
            Reconnect with the life you intended to create. Personalize your human boundaries. Experience what becomes
            possible when your workday and workweek are designed with your life in mind.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="flex flex-col gap-4 rounded-3xl border border-[#F2E4E8] bg-white p-7 sm:p-9">
            <h3 className="font-playfair text-2xl font-bold leading-tight text-[#4A3A42]">
              <span className="whitespace-nowrap">Make Time For More&trade;</span> On Mondays
            </h3>
            <p className="font-poppins text-base font-semibold text-[#5A7F46]">Redesign Your Entry Into the Workweek.</p>
            <p className="font-playfair text-4xl font-bold text-[#4A3A42]">{monday?.priceLabel ?? "$997"}</p>
            <FoundingPriceNote level="business-day" />
            <div className="mt-auto pt-2">
              <OfferCta href={monday?.checkoutUrl} label="Reserve Monday" />
            </div>
          </article>

          <article className="flex flex-col gap-4 rounded-3xl border-2 border-[#8AA06A] bg-white p-7 sm:p-9">
            <h3 className="font-playfair text-2xl font-bold leading-tight text-[#4A3A42]">
              The Work-Life Balance Business Week&trade;
            </h3>
            <p className="font-poppins text-base font-semibold text-[#5A7F46]">
              Live The Work-Life Balance Business Week&trade; &mdash; In Real Time.
            </p>
            <p className="font-playfair text-4xl font-bold text-[#4A3A42]">
              {week?.priceLabel ?? "$1,997"}
              <span className="font-poppins ml-2 text-sm font-semibold text-[#5A7F46]">includes Monday</span>
            </p>
            <FoundingPriceNote level="business-week" />
            <div className="mt-auto pt-2">
              <OfferCta href={week?.checkoutUrl} label="Experience the Full Week" variant="secondary" />
            </div>
          </article>
        </div>

        <div className="mt-16 flex flex-col items-center gap-2 text-center">
          <p className="font-playfair text-2xl font-bold text-[#4A3A42]">Harmony Lane&trade;</p>
          <p className="font-playfair italic text-[#5A4A52]">Build Work-Life Balance Boundaries Into Business.</p>
          <p className="font-playfair italic text-[#5A4A52]">Make Time For More&trade; &mdash; In Real Time.</p>
          <p className="font-playfair italic text-[#C13B6B]">We don&apos;t hustle &mdash; we harmonize.&trade;</p>
          <p className="font-poppins mt-2 text-sm font-semibold text-[#5A7F46]">
            Human Sustainability&trade; in the Agentic AI Age.
          </p>
        </div>
      </div>
    </section>
  )
}
