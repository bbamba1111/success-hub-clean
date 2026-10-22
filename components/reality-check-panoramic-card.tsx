import Link from "next/link"
import { ArrowRight } from "lucide-react"

/**
 * Monday-only panoramic card shown directly beneath Flex Time™.
 * Links to the full Work-Life Balance Reality Check™ instead of embedding it,
 * so it never shares a mounted draft with the Decide & Design™ weekly audit.
 */
export function RealityCheckPanoramicCard() {
  return (
    <section aria-labelledby="reality-check-panoramic-title" className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 overflow-hidden rounded-3xl border border-[#E8DFE2] bg-white px-6 py-8 shadow-sm sm:px-10 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 max-w-3xl">
          <p className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B835F]">
            Monday · Work-Life Balance Reality Check™
          </p>
          <h2
            id="reality-check-panoramic-title"
            className="font-serif text-2xl font-semibold leading-tight text-[#2E1F27] text-balance sm:text-3xl"
          >
            Take the Work-Life Balance Reality Check™
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#5C4F55] text-pretty sm:text-base">
            Measure where your business and life stand today, set your 30-Day Work-Life Balance Baseline™, and receive
            Your Boundary Report.
          </p>
        </div>

        <Link
          href="/welcome/cherry-blossom"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#5B835F] px-6 py-3 text-center font-montserrat text-[12px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#4A6E4E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B835F] focus-visible:ring-offset-2 md:self-center"
        >
          Take the Reality Check™
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
