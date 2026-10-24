import { getPlanByLevel } from "@/lib/payments/config"
import { OfferCta } from "./offer-cta"
import { FoundingPriceNote } from "./founding-price-note"

const STEPS = [
  {
    title: "Reconnect",
    body: "Revisit why you became an entrepreneur and what freedom, success, and a fulfilling life mean to you now.",
  },
  {
    title: "Assess",
    body: "Complete the Work-Life Balance Audit\u2122 and Reality Check\u2122 to examine your current experience and identify where it may be out of alignment with your intentions.",
  },
  {
    title: "Personalize",
    body: "Identify the human boundaries and personal non-negotiables you want your business rhythm to respect.",
  },
  {
    title: "Decide & Design\u2122",
    body: "Choose your Work-Life Balance Priority Focus Areas\u2122 and design your Work-Life Balance Business Day\u2122 around your intentions and real business priorities.",
  },
  {
    title: "Experience & Reflect",
    body: "Practice your redesigned Monday. Bring actual business priorities into a defined work container and observe what supports or interrupts the rhythm you intended to create.",
  },
]

export function MondayOfferSection() {
  const plan = getPlanByLevel("business-day")
  const price = plan?.priceLabel ?? "$997"

  return (
    <section id="monday" className="w-full scroll-mt-20 bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-poppins text-sm font-semibold tracking-[0.14em] text-[#C13B6B]">
              Offer One &middot; The Entry Experience
            </p>
            <h2 className="font-playfair mt-4 text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
              <span className="whitespace-nowrap">Make Time For More&trade;</span>{" "}
              <span className="text-[#C13B6B]">On Mondays</span>
            </h2>
            <p className="font-playfair mt-3 text-xl font-semibold text-[#5A7F46]">
              Redesign Your Entry Into the Workweek.
            </p>
          </div>
          <p className="font-playfair text-4xl font-bold text-[#4A3A42] sm:text-5xl">{price}</p>
        </div>

        <div className="font-poppins mt-8 flex max-w-3xl flex-col gap-4 text-pretty text-lg leading-relaxed text-[#5A4A52]">
          <p>
            Your workweek does not have to begin with a rush of requests, unfinished tasks, and competing demands.
          </p>
          <p>
            Make Time For More&trade; On Mondays gives you a deliberate opportunity to assess your current reality,
            reconnect with what matters, personalize your boundaries, and experience a different way to begin the week.
          </p>
          <p>
            Whether you&apos;re designing your first business or redesigning an established one, Monday gives you a
            place to reconnect with your intention, assess your current reality, personalize your boundaries, and design
            your next working rhythm.
          </p>
        </div>

        <ol className="mt-12 flex flex-col gap-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-2 rounded-2xl border border-[#F2E4E8] bg-white p-5 sm:flex-row sm:gap-6 sm:p-6"
            >
              <span className="font-poppins w-20 flex-none text-xs font-semibold tracking-[0.14em] text-[#C13B6B] sm:pt-1.5">
                Step {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-playfair text-xl font-bold text-[#4A3A42]">{step.title}</h3>
                <p className="font-poppins text-base leading-relaxed text-[#5A4A52]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-6 rounded-2xl bg-white p-6 sm:p-8">
          <p className="font-poppins text-pretty text-base leading-relaxed text-[#5A4A52]">
            <span className="font-semibold text-[#4A3A42]">Outcome:</span> Leave with a clearer understanding of your
            Entrepreneurial Freedom Gap&trade;, your personal priorities, the boundaries you want to practice, and the
            work-life balance rhythm you want to create.
          </p>
          <FoundingPriceNote level="business-day" />
          <OfferCta href={plan?.checkoutUrl} label={`Reserve My Monday \u2014 ${price}`} />
        </div>
      </div>
    </section>
  )
}
