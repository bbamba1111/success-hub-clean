import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { LIVE_DAY, LIVE_WEEK } from "@/lib/monday-offer"

/**
 * Transition Space™ (Monday 10:00–10:15 AM) — the bridge between Part One
 * (Redesign Your Entry Into The Workweek™) and Part Two (living the Day/Week
 * in real time). It is NOT a separate program and NOT a live segment of the
 * Day itself.
 *
 * The founder has completed the $197 Redesign; that $197 entry investment is
 * now CREDITED toward either continuation, so the amounts shown are the
 * REMAINING $800 (Day) / $1,800 (Week) — not the full totals, and not
 * $900 / $1,900. Pricing comes from lib/monday-offer so it can never drift.
 *
 * No live checkout URL exists in the codebase yet (the platform deliberately
 * does not fabricate one), so both CTAs route to the real internal /pricing
 * page rather than an invented checkout link.
 */

type Invitation = {
  cta: string
  href: string
  featured?: boolean
  data: typeof LIVE_DAY | typeof LIVE_WEEK
  blurb: string
}

const INVITATIONS: Invitation[] = [
  {
    cta: "Join the Day",
    href: "/pricing",
    data: LIVE_DAY,
    blurb: "Experience the complete rhythm of Work-Life Balance™ in real time.",
  },
  {
    cta: "Join the Week",
    href: "/pricing",
    featured: true,
    data: LIVE_WEEK,
    blurb:
      "Live the rhythm Monday through Thursday and experience Work-Life Balance™ as your actual business-week environment.",
  },
]

export function TransitionSpaceInvitation() {
  return (
    <div className="px-7 py-8">
      {/* Invitation headline */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A7C59]">
          Transition Space™
        </p>
        <h2 className="font-playfair text-[28px] font-semibold leading-tight tracking-tight text-[#1C161A] sm:text-[34px] text-balance">
          Your Redesign Is Complete.
        </h2>
        <p className="mt-2 font-playfair text-[17px] italic leading-snug text-[#C13B6B] sm:text-[20px] text-pretty">
          Now You&apos;re Invited to Join Us.
        </p>

        <div className="mt-5 space-y-2 text-sm leading-relaxed text-[#5C4F55]">
          <p>You&apos;ve looked at your current reality.</p>
          <p>You&apos;ve redesigned your entry into the workweek.</p>
          <p className="pt-1">Now you have a choice — and the live experience begins at 10:15 AM.</p>
        </div>
      </div>

      {/* Two invitation cards */}
      <div className="mx-auto mt-7 grid max-w-3xl gap-4 sm:grid-cols-2">
        {INVITATIONS.map(({ cta, href, featured, data, blurb }) => (
          <div
            key={data.name}
            className={`flex flex-col rounded-2xl border p-5 ${
              featured ? "border-[#C13B6B]/30 bg-[#C13B6B]/[0.04]" : "border-[#4A7C59]/25 bg-[#4A7C59]/[0.04]"
            }`}
          >
            <h3 className="font-sans text-[15px] font-bold leading-snug text-[#1C161A] text-balance">
              {data.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5C4F55]">{blurb}</p>

            <dl className="mt-4 space-y-1.5 border-t border-black/[0.06] pt-4 text-sm">
              <div className="flex items-center justify-between text-[#5C4F55]">
                <dt>{data.total} total experience</dt>
              </div>
              <div className="flex items-center justify-between text-[#5C4F55]">
                <dt>Your {data.credit} entry investment applied</dt>
                <dd className="font-semibold text-[#4A7C59]">−{data.credit}</dd>
              </div>
              <div className="flex items-center justify-between pt-1">
                <dt className="font-semibold text-[#1C161A]">Remaining</dt>
                <dd className="font-playfair text-[24px] font-bold text-[#C13B6B]">{data.remaining}</dd>
              </div>
            </dl>

            <Link
              href={href}
              className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-sans text-sm font-bold text-white shadow-sm transition-colors ${
                featured ? "bg-[#C13B6B] hover:bg-[#a52f59]" : "bg-[#4A7C59] hover:bg-[#3c6449]"
              }`}
            >
              {cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        ))}
      </div>

      {/* Warm close — not punitive; exploring stays available */}
      <div className="mx-auto mt-7 max-w-2xl text-center">
        <p className="font-playfair text-[18px] italic leading-snug text-[#1C161A] text-pretty">
          You don&apos;t have to learn about Work-Life Balance from the sidelines.
        </p>
        <p className="mt-1 font-montserrat text-[13px] font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
          Come Live It.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#5C4F55] underline decoration-[#5C4F55]/30 underline-offset-4 transition-colors hover:text-[#1C161A]"
        >
          Continue exploring
        </Link>
      </div>
    </div>
  )
}
