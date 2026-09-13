import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ENTRY, LIVE_DAY, LIVE_WEEK } from "@/lib/monday-offer"

/**
 * MondayOffer — the pricing hierarchy on /landing.
 *
 * Presents the $197 entry as the way to START Monday, then the Day and Week as
 * INVITATIONS to continue into the live experience (never framed as cheap
 * "upgrades"). The $197 entry is credited toward either continuation, so the
 * Day and Week show their remaining $800 / $1,800 alongside the full totals.
 * Amounts come from lib/monday-offer so this can never drift from the
 * Transition Space™ invitation.
 */

const CONTINUATIONS = [
  { data: LIVE_DAY, cta: "Join the Day", featured: false },
  { data: LIVE_WEEK, cta: "Join the Week", featured: true },
] as const

export function MondayOffer() {
  return (
    <section id="entry-offer" className="w-full bg-[#FDF6F3] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {/* $197 entry */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Start Your Monday Here
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            {ENTRY.name}
          </h2>
          <p className="font-playfair mt-4 text-5xl font-bold text-[#C13B6B]">{ENTRY.price}</p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[#E26C73]/25 bg-white p-8 shadow-xl">
          <p className="font-poppins text-pretty text-base leading-relaxed text-[#5A4A52]">
            This is your entry into Monday. You&apos;ll begin inside Harmony Lane™, complete your onboarding,
            understand your current work-life pattern, participate in your Weekly Work-Life Balance Reality
            Check™, and intentionally redesign how you&apos;re entering the week. Then, after your redesign, you
            receive your invitation to continue into the live Work-Life Balance experience.
          </p>
          <Link
            href="/pricing"
            className="font-poppins mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E26C73] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#E26C73]/30 transition-transform hover:scale-[1.02] hover:bg-[#d65a62]"
          >
            Begin My $197 Experience™
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="font-poppins mt-4 text-center text-sm text-[#8A7A82]">
            Your $197 investment is applied toward your first Live Work-Life Balance Business Day™ or Week™.
          </p>
        </div>

        {/* Day + Week continuation */}
        <div className="mx-auto mt-16 max-w-3xl text-center">
          <h3 className="font-playfair text-2xl font-bold text-[#4A3A42] sm:text-3xl">
            Then, Continue Into The Live Experience
          </h3>
          <p className="font-poppins mt-3 text-pretty text-base leading-relaxed text-[#6B5860]">
            Redesign how you enter your workweek — then experience what Work-Life Balance feels like when you
            actually live it.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {CONTINUATIONS.map(({ data, cta, featured }) => (
            <div
              key={data.name}
              className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-lg ${
                featured ? "border-[#C13B6B]/40 ring-1 ring-[#C13B6B]/15" : "border-[#7FB069]/25"
              }`}
            >
              {featured && (
                <span className="font-poppins absolute -top-3 left-8 rounded-full bg-[#C13B6B] px-3 py-1 text-xs font-semibold text-white">
                  The Full Week
                </span>
              )}
              <h4 className="font-playfair text-xl font-bold text-[#4A3A42] text-balance">{data.name}</h4>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-playfair text-3xl font-bold text-[#4A3A42]">{data.total}</span>
                <span className="font-poppins text-sm text-[#8A7A82]">total experience</span>
              </div>

              <dl className="mt-4 space-y-1.5 border-t border-black/[0.06] pt-4 text-sm">
                <div className="font-poppins flex items-center justify-between text-[#6B5860]">
                  <dt>Your {data.credit} entry investment credited</dt>
                  <dd className="font-semibold text-[#5A7F46]">−{data.credit}</dd>
                </div>
                <div className="font-poppins flex items-center justify-between pt-1">
                  <dt className="font-semibold text-[#4A3A42]">Remaining</dt>
                  <dd className="font-playfair text-2xl font-bold text-[#C13B6B]">{data.remaining}</dd>
                </div>
              </dl>

              <Link
                href="/pricing"
                className={`font-poppins mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors ${
                  featured ? "bg-[#C13B6B] hover:bg-[#a52f59]" : "bg-[#7FB069] hover:bg-[#6a9857]"
                }`}
              >
                {cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ))}
        </div>

        {/* Positioning close */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="font-playfair text-pretty text-2xl italic leading-snug text-[#4A3A42] sm:text-3xl">
            You don&apos;t have to learn about Work-Life Balance from the sidelines.
          </p>
          <p className="font-poppins mt-2 text-sm font-bold uppercase tracking-[0.2em] text-[#C13B6B]">
            Come Live It.
          </p>
        </div>
      </div>
    </section>
  )
}
