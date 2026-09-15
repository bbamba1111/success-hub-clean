import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OneDayCtaLink } from "@/components/one-day/one-day-cta-link"
import { ONE_DAY_CHECKOUT_URL, ONE_DAY_PRICE_LABEL } from "@/lib/one-day/config"

const FEATURES = [
  "A live, full-day guided group experience with Thought Leader Barbara",
  "Your Work-Life Balance Business Day™ designed and initially installed",
  "The Redesigned Entry Into the Workweek, lived in real time",
  "Business building on your real business alongside other entrepreneurs",
]

/**
 * Investment section for the /1day offer. This intentionally does NOT
 * embed a SamCart checkout (that mechanism belongs only to the separate
 * $497 /monday offer, product id 1122707). The preferred provider here is
 * Paperbell — see lib/one-day/config.ts for where the real checkout URL
 * must be inserted before launch.
 */
export function OneDayCheckout() {
  return (
    <section id="one-day-checkout" className="w-full bg-[#FDF6F3] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-[#E26C73]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            Reserve Your Monday
          </span>
          <h2 className="font-playfair mt-5 text-pretty text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Make Time For More on Mondays™
          </h2>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
            Design &amp; install your first (or next) Work-Life Balance Business Day™ — live, guided, in real time.
          </p>
        </div>

        <div className="mt-14 flex justify-center">
          <div className="relative flex w-full max-w-md flex-col rounded-3xl border border-[#E26C73] bg-white p-8 shadow-xl ring-1 ring-[#E26C73]/20">
            <span className="font-poppins absolute -top-3 left-8 rounded-full bg-[#E26C73] px-3 py-1 text-xs font-semibold text-white">
              Live Group Experience
            </span>

            <h3 className="font-playfair text-xl font-bold text-[#C13B6B]">Work-Life Balance Business Day™</h3>
            <p className="font-poppins mt-2 text-sm leading-relaxed text-[#6B5860]">
              A curated environment where you work alongside other entrepreneurs building more sustainable
              businesses.
            </p>

            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-playfair text-4xl font-bold text-[#4A3A42]">{ONE_DAY_PRICE_LABEL}</span>
              <span className="font-poppins text-sm text-[#8A7A82]">one-time</span>
            </div>

            <ul className="mt-6 flex-1 space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="font-poppins flex items-start gap-2.5 text-sm text-[#5A4A52]">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#7FB069]/15 text-xs text-[#5A7F46]">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <OneDayCtaLink>
              <Button
                size="lg"
                className="font-poppins mt-8 w-full rounded-full bg-[#E26C73] px-8 py-6 text-base font-semibold text-white shadow-lg shadow-[#E26C73]/30 transition-transform hover:scale-[1.02] hover:bg-[#d65a62]"
              >
                Reserve My Monday
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </OneDayCtaLink>

            {!ONE_DAY_CHECKOUT_URL && (
              <p className="font-poppins mt-3 text-center text-xs text-[#8A7A82]">
                Checkout opening soon — reservations aren&apos;t live yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
