import Link from "next/link"
import { ArrowRight } from "lucide-react"

/**
 * Transition Space™ (Monday 10:00–10:15 AM) — the invitation & decision moment.
 *
 * This is NOT a separate program and NOT a live segment of the Day itself. The
 * founder has completed the Weekly Work-Life Balance Reality Check™ and the
 * $97 "Redesign Your Entry Into The Workweek™". Now they're invited to LIVE the
 * Work-Life Balance Business Day™ or Week™ in real time — the $997 / $1,997
 * upgrade, with the $97 already paid applied as a credit. At 10:15 AM the live
 * experience begins with Morning GIV•EN™.
 *
 * No live checkout URL exists in the codebase yet (the platform deliberately
 * does not fabricate one), so both CTAs route to the real internal /pricing
 * page rather than an invented checkout link.
 */

type UpgradeOption = {
  name: string
  total: string
  credit: string
  remaining: string
  blurb: string
  featured?: boolean
}

const OPTIONS: UpgradeOption[] = [
  {
    name: "Live The Work-Life Balance Business Day™",
    total: "$997",
    credit: "$97",
    remaining: "$900",
    blurb: "Experience one full Work-Life Balance Business Day™ with us — in real time.",
  },
  {
    name: "Live The Work-Life Balance Business Week™",
    total: "$1,997",
    credit: "$97",
    remaining: "$1,900",
    blurb: "Live the full Work-Life Balance Business Week™ with us — Monday through the week's rhythm.",
    featured: true,
  },
]

export function TransitionSpaceInvitation() {
  return (
    <div className="px-7 py-8">
      {/* Invitation headline */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A7C59]">
          Transition Space™ · The Invitation
        </p>
        <h2 className="font-playfair text-[28px] font-semibold leading-tight tracking-tight text-[#1C161A] sm:text-[34px] text-balance">
          You&apos;re Invited to Join Us NOW!
        </h2>
        <p className="mt-2 font-playfair text-[17px] italic leading-snug text-[#C13B6B] sm:text-[20px] text-pretty">
          Live The Work-Life Balance Day or Week — In Real Time.
        </p>

        <div className="mt-5 space-y-2 text-sm leading-relaxed text-[#5C4F55]">
          <p>Your Reality Check is complete.</p>
          <p>Your entry into the workweek has been redesigned.</p>
          <p className="pt-1">Now you have a choice — and the experience begins live at 10:15 AM.</p>
        </div>
      </div>

      {/* Two upgrade options */}
      <div className="mx-auto mt-7 grid max-w-3xl gap-4 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <div
            key={opt.name}
            className={`flex flex-col rounded-2xl border p-5 ${
              opt.featured
                ? "border-[#C13B6B]/30 bg-[#C13B6B]/[0.04]"
                : "border-[#4A7C59]/25 bg-[#4A7C59]/[0.04]"
            }`}
          >
            <h3 className="font-sans text-[15px] font-bold leading-snug text-[#1C161A] text-balance">
              {opt.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5C4F55]">{opt.blurb}</p>

            <dl className="mt-4 space-y-1.5 border-t border-black/[0.06] pt-4 text-sm">
              <div className="flex items-center justify-between text-[#5C4F55]">
                <dt>Total</dt>
                <dd className="font-semibold text-[#1C161A]">{opt.total}</dd>
              </div>
              <div className="flex items-center justify-between text-[#5C4F55]">
                <dt>Your $97 credit</dt>
                <dd className="font-semibold text-[#4A7C59]">−{opt.credit}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-semibold text-[#1C161A]">Remaining</dt>
                <dd className="font-playfair text-[22px] font-bold text-[#C13B6B]">{opt.remaining}</dd>
              </div>
            </dl>

            <Link
              href="/pricing"
              className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-sans text-sm font-bold text-white shadow-sm transition-colors ${
                opt.featured
                  ? "bg-[#C13B6B] hover:bg-[#a52f59]"
                  : "bg-[#4A7C59] hover:bg-[#3c6449]"
              }`}
            >
              Join Us NOW
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-[#5C4F55]/70">
        This is not a separate program — it&apos;s the transition from your $97 Redesign Your Entry™
        experience into living the Day or Week with us in real time.
      </p>
    </div>
  )
}
