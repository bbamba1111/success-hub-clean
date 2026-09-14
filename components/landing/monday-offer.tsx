import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BUSINESS_DAY, BUSINESS_WEEK } from "@/lib/monday-offer"

/**
 * MondayOffer — the public pricing hierarchy.
 *
 * Two clean offers with no entry product, no credit, and no mid-day upgrade:
 *   $297 — the COMPLETE Work-Life Balance Business Day™
 *   $497 — the Work-Life Balance Business Week™ (Monday–Thursday)
 * Amounts come from lib/monday-offer. Installation is introduced as a deeper
 * pathway only (no price), and the community option is presented as the same
 * Business Day hosted for a group — never a separate product.
 *
 * No live $297 / $497 checkout URL exists in the codebase yet, so the CTAs
 * route to the internal /pricing route rather than an invented link.
 */

type Offer = {
  data: typeof BUSINESS_DAY | typeof BUSINESS_WEEK
  cta: string
  href: string
  featured: boolean
  badge?: string
}

const OFFERS: Offer[] = [
  {
    data: BUSINESS_DAY,
    cta: "Experience the Day",
    href: "https://app.paperbell.com/checkout/packages/234456",
    featured: false,
  },
  {
    data: BUSINESS_WEEK,
    cta: "Live the Week",
    href: "https://app.paperbell.com/checkout/packages/234458",
    featured: true,
    badge: "Live the rhythm",
  },
]

export function MondayOffer() {
  return (
    <section id="offer" className="w-full bg-[#FDF6F3] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Enter The Experience
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            One day lets you experience it.
            <span className="block text-[#C13B6B]">Four days lets you live the rhythm.</span>
          </h2>
          <p className="font-poppins mt-4 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Begin with a complete Work-Life Balance Business Day™, or stay for the full week and let the rhythm
            become familiar. Each includes your Harmony Lane™ On-Ramp before Monday.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {OFFERS.map(({ data, cta, href, featured, badge }) => (
            <div
              key={data.name}
              className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-lg ${
                featured ? "border-[#C13B6B]/40 ring-1 ring-[#C13B6B]/15" : "border-[#7FB069]/25"
              }`}
            >
              {featured && badge && (
                <span className="font-poppins absolute -top-3 left-8 rounded-full bg-[#C13B6B] px-3 py-1 text-xs font-semibold text-white">
                  {badge}
                </span>
              )}
              <h3 className="font-playfair text-xl font-bold leading-snug text-[#4A3A42] text-balance">
                {data.name}
              </h3>
              <p className="font-poppins mt-1 text-sm text-[#8A7A82]">{data.cadence}</p>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-playfair text-5xl font-bold text-[#C13B6B]">{data.price}</span>
              </div>
              <p className="font-poppins mt-3 text-pretty text-sm leading-relaxed text-[#6B5860]">{data.promise}</p>

              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-poppins mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors ${
                  featured ? "bg-[#C13B6B] hover:bg-[#a52f59]" : "bg-[#7FB069] hover:bg-[#6a9857]"
                }`}
              >
                {cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          ))}
        </div>

        {/* Deeper pathway — installation (no pricing) */}
        <div className="mt-10 rounded-3xl border border-[#4A3A42]/15 bg-white p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="max-w-xl">
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
              The Deeper Pathway
            </p>
            <h3 className="font-playfair mt-2 text-2xl font-bold text-[#4A3A42]">
              Ready to install the model into your business?
            </h3>
            <p className="font-poppins mt-2 text-sm leading-relaxed text-[#6B5860]">
              For founders and organizations ready for lasting change, the full Work-Life Balance Business
              Model™ can be installed through repetition over an extended engagement.
            </p>
          </div>
          <Link
            href="/pricing"
            className="font-poppins mt-5 inline-flex flex-none items-center justify-center gap-2 rounded-full border border-[#4A3A42]/25 px-6 py-3 text-sm font-semibold text-[#4A3A42] transition-colors hover:bg-[#4A3A42]/5 sm:mt-0"
          >
            Explore Business Installation
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {/* Community collaboration — same Day, hosted for a group */}
        <div className="mt-6 rounded-3xl bg-[#4A3A42] p-8 text-center sm:p-10">
          <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#E8A0AC]">
            For Communities &amp; Teams
          </p>
          <h3 className="font-playfair mt-3 text-balance text-2xl font-bold text-white sm:text-3xl">
            Bring Make Time For More™ to your community
          </h3>
          <p className="font-poppins mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-white/75">
            Founder communities, entrepreneur networks, coworking communities, leadership groups, remote teams,
            and organizations can bring the Work-Life Balance Business Day™ to their people as a hosted live
            experience inside Harmony Lane™ — the same Day, experienced together.
          </p>
          <Link
            href="/pricing"
            className="font-poppins mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#4A3A42] transition-transform hover:scale-[1.02]"
          >
            Bring It to Your Community
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
