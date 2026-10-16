"use client"

/**
 * Today's Next Best Step™ — one recommendation, one reason, one button.
 *
 * The single highest-leverage action for this member, right now. Every step is
 * derived deterministically and is traceable to member data (shown discreetly
 * so members trust that Cherry Blossom is coaching from their operating system,
 * not guessing).
 */
import Link from "next/link"
import { Sparkles, ArrowRight, Clock3 } from "lucide-react"
import type { NextBestStep } from "@/lib/founder-intelligence/types"

export function NextBestStepCard({ step }: { step: NextBestStep }) {
  return (
    <section
      aria-label="Today's Next Best Step"
      className="rounded-3xl border border-[#E26C73]/25 bg-white p-6 sm:p-8 shadow-sm"
    >
      <div className="flex items-center gap-2 text-[#E26C73]">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        <span className="text-sm font-medium uppercase tracking-wide">Today&apos;s Next Best Step™</span>
      </div>

      <h2 className="mt-3 font-playfair text-2xl italic text-[#3A2E33] sm:text-3xl text-balance">{step.title}</h2>

      <p className="mt-3 max-w-xl leading-relaxed text-[#5C4F55] text-pretty">
        <span aria-hidden="true">🌸 </span>
        {step.reason}
      </p>

      {step.estimatedTime && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-[#5C4F55]">
          <Clock3 className="h-4 w-4" aria-hidden="true" />
          Estimated time: {step.estimatedTime}
        </p>
      )}

      <Link
        href={step.cta.href}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#E26C73] px-6 py-3 font-medium text-white transition hover:bg-[#cf5a61]"
      >
        {step.cta.label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>

      {step.traceableTo.length > 0 && (
        <p className="mt-4 text-xs text-[#5C4F55]/70">Based on: {step.traceableTo.join(" · ")}</p>
      )}
    </section>
  )
}
