import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { ExperiencesSection } from "@/components/landing/experiences-section"

export const metadata: Metadata = {
  title: "Make Time For More Experiences™ | Harmony Lane™",
  description:
    "Your pathway to continue or deepen your Harmony Lane™ experience — from Make Time For More™ on Mondays to the full Harmony Lane™ Membership.",
}

/**
 * /experiences — "More Experiences™" (Upgrade)
 *
 * The member's upgrade / continuation pathway. Reuses the exact same
 * <ExperiencesSection> card design shown publicly at /landing#experiences —
 * same PLANS catalog (lib/payments/config.ts), same provider-agnostic
 * `startCheckout` (SamCart today, Stripe later with no code change here) —
 * so members see one consistent pricing experience everywhere it appears.
 */
export default function ExperiencesPage() {
  return (
    <main className="min-h-screen bg-[#FDF6F3]">
      <div className="mx-auto max-w-3xl px-6 pt-16 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5D9D61]/10">
          <Sparkles className="h-7 w-7 text-[#5D9D61]" aria-hidden />
        </div>
        <h1 className="font-playfair text-3xl font-medium italic text-[#3A2E33] sm:text-4xl text-balance">
          Make Time For More Experiences™
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[#5C4F55] leading-relaxed text-pretty">
          Your pathway to continue or deepen your Harmony Lane™ experience.
        </p>

        {/* Monday is the confirmed, already-purchasable single-day entry
            point — kept as a callout above the membership tiers below rather
            than folded into the same card grid, since it's a different kind
            of offer (one-time day vs. ongoing membership). */}
        <Link
          href="/monday"
          className="font-poppins mt-8 inline-flex items-center gap-2 rounded-full border border-[#5D9D61]/40 bg-white px-5 py-2.5 text-sm font-semibold text-[#5A7F46] transition-colors hover:bg-[#5D9D61]/5"
        >
          Start with Make Time For More™ on Mondays
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <ExperiencesSection />
    </main>
  )
}
