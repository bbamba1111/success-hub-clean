/**
 * CherryBlossomTransitionCard™ — Phase 7.2
 * ---------------------------------------------------------------------------
 * Standard end-of-section transition card per the Phase 7.2 design spec.
 *
 * Rules:
 * - Stained-glass frosted panel (white/70, coral left spine, blush wash)
 * - Montserrat typography — no Playfair Italic
 * - Maximum 3–5 short sentences
 * - Exactly one primary CTA
 * - Cherry Blossom always: acknowledges progress, explains what happened,
 *   explains why it matters, introduces the next step, and presents one CTA
 */

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"

interface CherryBlossomTransitionCardProps {
  /** First line — bold acknowledgment. E.g. "Thank you." */
  greeting: string
  /** 2–4 short sentences of Cherry Blossom's guidance. */
  children: ReactNode
  /** The single primary CTA label. */
  ctaLabel: string
  /** Where the CTA links to. */
  ctaHref: string
  /** Avatar image src — defaults to the logo. */
  avatarSrc?: string
}

export function CherryBlossomTransitionCard({
  greeting,
  children,
  ctaLabel,
  ctaHref,
  avatarSrc = "/images/logo.png",
}: CherryBlossomTransitionCardProps) {
  return (
    <section
      aria-label="Cherry Blossom guidance"
      className="relative overflow-hidden rounded-2xl border border-brand-blush bg-white/70 backdrop-blur-sm shadow-ds w-full"
    >
      {/* Stained-glass coral left spine */}
      <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-brand-coral/70 rounded-l-2xl" />

      {/* Soft blush ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-blush/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-brand-green/10 blur-2xl"
      />

      <div className="relative px-7 py-8 sm:px-9 sm:py-10">
        {/* Masthead */}
        <div className="flex items-center gap-3 mb-5">
          <span className="relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-brand-blush shadow-sm">
            <img src={avatarSrc || "/placeholder.svg"} alt="Cherry Blossom" className="h-full w-full object-cover" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-coral-dark">
            Cherry Blossom&trade;
          </span>
        </div>

        {/* Greeting — Montserrat Bold */}
        <p className="font-sans font-bold text-xl text-brand-ink mb-3 text-balance">
          {greeting}
        </p>

        {/* Body copy — Montserrat Medium, not italic */}
        <div className="font-sans font-medium text-[15px] leading-relaxed text-brand-ink-soft space-y-2 text-pretty">
          {children}
        </div>

        {/* Single primary CTA */}
        <div className="mt-7">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-white shadow-ds transition-colors hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CherryBlossomTransitionCard
