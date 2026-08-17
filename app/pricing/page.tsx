"use client"

import Link from "next/link"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft, Sparkles } from "lucide-react"
import { ExperiencesSection } from "@/components/landing/experiences-section"

function UpgradeBanner() {
  const searchParams = useSearchParams()
  const isUpgradeRedirect = searchParams.get("upgrade") === "true"

  if (!isUpgradeRedirect) return null

  return (
    <div className="mx-auto mt-8 flex max-w-3xl items-center gap-3 rounded-2xl border border-[#E26C73]/30 bg-white p-4 shadow-sm">
      <AlertCircle className="h-5 w-5 shrink-0 text-[#C13B6B]" aria-hidden />
      <div>
        <p className="font-poppins text-sm font-semibold text-[#4A3A42]">Membership Required</p>
        <p className="font-poppins text-sm text-[#6B5860]">
          The page you tried to access requires a paid membership. Choose a plan below to unlock full access to the
          Success Hub.
        </p>
      </div>
    </div>
  )
}

/**
 * /pricing — legacy catalog route, now sharing the exact same
 * <ExperiencesSection> card design used at /landing#experiences and
 * /experiences, so pricing looks identical everywhere it's shown instead of
 * three visually different pages. Same PLANS catalog, same provider-agnostic
 * `startCheckout` — no separate pricing data to keep in sync.
 */
function PricingContent() {
  return (
    <main className="min-h-screen bg-[#FDF6F3]">
      <div className="mx-auto max-w-3xl px-6 pt-16 text-center">
        <Link
          href="/"
          className="font-poppins inline-flex items-center text-sm text-[#5A7F46] hover:text-[#4a6a39] mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
          Back to Home
        </Link>

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E26C73]/10">
          <Sparkles className="h-7 w-7 text-[#E26C73]" aria-hidden />
        </div>
        <h1 className="font-playfair text-3xl font-medium italic text-[#3A2E33] sm:text-4xl text-balance">
          Choose Your Transformation Path
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[#5C4F55] leading-relaxed text-pretty">
          Invest in yourself with a plan designed to create lasting change in your work-life balance.
        </p>

        <UpgradeBanner />
      </div>

      <ExperiencesSection />
    </main>
  )
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FDF6F3] font-poppins text-[#6B5860]">
          Loading...
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  )
}
