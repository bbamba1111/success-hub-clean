import { getPlanByLevel } from "@/lib/payments/config"
import { OfferCta } from "./offer-cta"
import { FoundingPriceNote } from "./founding-price-note"

const JOURNEY = [
  {
    day: "Monday",
    title: "Redesign Your Entry",
    body: "Reconnect with your entrepreneurial intention, assess your current reality, personalize your boundaries, and design your intended rhythm.",
  },
  {
    day: "Tuesday & Wednesday",
    title: "Practice Your Rhythm",
    body: "Bring actual business priorities into the four-hour Focused CEO Workday\u2122. Practice your boundaries and notice where real-world demands intersect with the rhythm you intended.",
  },
  {
    day: "Thursday",
    title: "Close Your Workweek",
    body: "Complete the final scheduled workday and intentionally transition out of the work container.",
  },
  {
    day: "Friday \u2013 Sunday",
    title: "Experience Time Freedom\u2122",
    body: "Make room for relationships, personal interests, rest, recreation, and other parts of life your business was meant to support.",
  },
]

const BOUNDARIES = [
  { name: "Flex Time\u2122", body: "Personal flexibility and a more intentional start to the day." },
  {
    name: "Morning GIV\u2022EN\u2122 Routine",
    body: "Gratitude, Intention, Vision, Emotional Embodiment, and Nurture.",
  },
  { name: "Workout & Movement Window\u2122", body: "Protected time for movement and physical well-being." },
  { name: "Extended Healthy Hybrid Lunch Break\u2122", body: "Nourishment, recovery, and personal time." },
  { name: "4-Hour Focused CEO Workday\u2122", body: "A defined container for focused business execution." },
  { name: "Time Freedom\u2122", body: "Relationships, recreation, personal priorities, and life beyond work." },
  { name: "Power Down\u2122", body: "An intentional transition away from work and digital demands." },
  { name: "Unplug\u2122", body: "Overnight disconnection and the opportunity for rest and recovery." },
]

export function BusinessWeekSection() {
  const plan = getPlanByLevel("business-week")
  const price = plan?.priceLabel ?? "$1,997"
  const mondayPrice = getPlanByLevel("business-day")?.priceLabel ?? "$997"

  return (
    <section id="business-week" className="w-full scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-poppins text-sm font-semibold tracking-[0.14em] text-[#C13B6B]">
              Offer Two &middot; The Complete Lived Experience
            </p>
            <h2 className="font-playfair mt-4 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
              The Work-Life Balance Business Week&trade;
            </h2>
            <p className="font-playfair mt-3 text-xl font-semibold text-[#5A7F46]">
              Live The Work-Life Balance Business Week&trade; &mdash; In Real Time.
            </p>
          </div>
          <div className="flex flex-col md:items-end">
            <p className="font-playfair text-4xl font-bold text-[#4A3A42] sm:text-5xl">{price}</p>
            <p className="font-poppins mt-1 text-sm font-semibold text-[#5A7F46]">Includes the Monday experience</p>
          </div>
        </div>

        <div className="font-poppins mt-8 flex max-w-3xl flex-col gap-4 text-pretty text-lg leading-relaxed text-[#5A4A52]">
          <p>
            A redesigned day gives you a starting point. A redesigned week lets you experience what happens when you
            practice that rhythm in real life.
          </p>
          <p>
            The Work-Life Balance Business Week&trade; extends the Monday experience across a full week, allowing you to
            practice your personal boundaries while bringing your actual business responsibilities and personal
            priorities into the experience.
          </p>
          <p>
            Practice your intended rhythm in real conditions. New founders can explore how they want their business to
            operate; established founders can notice where current business demands collide with the boundaries they
            want to protect.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {JOURNEY.map((stop, i) => {
            const isFreedom = i === JOURNEY.length - 1
            return (
              <li
                key={stop.day}
                className={`flex flex-col gap-2 rounded-2xl p-6 ${
                  isFreedom ? "bg-[#5A7F46] text-white" : "bg-[#FDF6F3]"
                }`}
              >
                <span
                  className={`font-poppins text-xs font-semibold tracking-[0.14em] ${
                    isFreedom ? "text-white/80" : "text-[#C13B6B]"
                  }`}
                >
                  {stop.day}
                </span>
                <h3 className={`font-playfair text-xl font-bold ${isFreedom ? "text-white" : "text-[#4A3A42]"}`}>
                  {stop.title}
                </h3>
                <p className={`font-poppins text-sm leading-relaxed ${isFreedom ? "text-white/90" : "text-[#5A4A52]"}`}>
                  {stop.body}
                </p>
              </li>
            )
          })}
        </ol>

        <div className="mt-20">
          <h3 className="font-playfair max-w-3xl text-balance text-2xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
            Eight Non-Negotiable Human Work-Life Balance Time &amp; Space Boundaries&trade;
          </h3>
          <p className="font-poppins mt-4 max-w-3xl text-pretty text-base leading-relaxed text-[#5A4A52] sm:text-lg">
            The eight boundaries provide the structure. Each founder personalizes the experience around their own
            intentions, priorities, and business responsibilities.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BOUNDARIES.map((b) => (
              <li key={b.name} className="flex flex-col gap-2 rounded-2xl border border-[#F2E4E8] bg-white p-5">
                <h4 className="font-playfair text-lg font-bold leading-snug text-[#4A3A42]">{b.name}</h4>
                <p className="font-poppins text-sm leading-relaxed text-[#5A4A52]">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-col gap-6 rounded-2xl bg-[#FDF6F3] p-6 sm:p-8">
          <p className="font-poppins text-pretty text-base leading-relaxed text-[#5A4A52]">
            <span className="font-semibold text-[#4A3A42]">Outcome:</span> Experience a four-day workweek, a defined
            four-hour Focused CEO Workday&trade;, protected personal time, and a three-day weekend as an intentional
            operating rhythm&mdash;not simply an idea.
          </p>
          <p className="font-poppins text-pretty text-sm leading-relaxed text-[#5A4A52]">
            <span className="font-semibold text-[#4A3A42]">Already reserved Monday?</span> The full Week includes
            Monday, so you never pay for it twice. Your {mondayPrice} Monday payment is intended to be credited toward
            the full Week, leaving a $1,000 balance, within the upgrade window communicated at enrollment.
          </p>
          <FoundingPriceNote level="business-week" />
          <OfferCta href={plan?.checkoutUrl} label={`Live the Full Week \u2014 ${price}`} variant="secondary" />
        </div>
      </div>
    </section>
  )
}
