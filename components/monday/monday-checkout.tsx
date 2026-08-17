"use client"

import Script from "next/script"
import { Check } from "lucide-react"

/**
 * Embedded SamCart checkout for "Make Time For More™ on Mondays" — $497
 * one-time. Uses SamCart's own `sc-checkout` web component (the same
 * mechanism powering the live external checkout at
 * maketimeformore.com/onmondays/), loaded via SamCart's hosted script so the
 * checkout, pricing, and payment fields are always the source of truth from
 * SamCart itself — nothing about price or product name is hardcoded here
 * beyond the product id.
 *
 * product="1122707" is the live product id for "Make Time For More™ on
 * Mondays" (confirmed via SamCart's own hosted checkout page,
 * https://enrollnow.samcart.com/products/make-time-for-more-on-mondays-1luax,
 * sandbox: 0 — i.e. live, not test mode).
 */
const FEATURES = [
  "The full guided Work-Life Balance Business Day™",
  "Your Weekly Reality Check™ + Results Dashboard",
  "Cherry Blossom™ AI coaching throughout the day",
  "Live community rooms & replays",
]

export function MondayCheckout() {
  return (
    <section id="monday-checkout" className="w-full bg-[#FDF6F3] py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-[#E26C73]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            Your Live Offer
          </span>
          <h2 className="font-playfair mt-5 text-pretty text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Make Time For More™ on Mondays
          </h2>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
            Design &amp; live your first (or next) Work-Life Balance Business Day™ — in real time.
          </p>
        </div>

        {/* Price + features card, styled to match the Experience cards on
            /landing#experiences, paired with the live SamCart checkout. */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="relative flex flex-col rounded-3xl border border-[#E26C73] bg-white p-8 shadow-xl ring-1 ring-[#E26C73]/20">
            <span className="font-poppins absolute -top-3 left-8 rounded-full bg-[#E26C73] px-3 py-1 text-xs font-semibold text-white">
              One-Time
            </span>

            <h3 className="font-playfair text-xl font-bold text-[#C13B6B]">Work-Life Balance Business Day™</h3>
            <p className="font-poppins mt-2 text-sm leading-relaxed text-[#6B5860]">
              Your entry point into the Harmony Lane™ rhythm — no subscription required.
            </p>

            <div className="mt-6 flex items-baseline gap-1.5">
              <span className="font-playfair text-4xl font-bold text-[#4A3A42]">$497</span>
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
          </div>

          {/* Live SamCart checkout — the source of truth for price/payment. */}
          <div className="overflow-hidden rounded-3xl border border-[#7FB069]/20 bg-white p-2 shadow-xl">
            <div
              // sc-checkout is a custom element provided by SamCart's script below.
              // Rendered via dangerouslySetInnerHTML so TypeScript doesn't need a
              // JSX intrinsic declaration for a third-party custom element.
              dangerouslySetInnerHTML={{
                __html:
                  '<sc-checkout product="1122707" subdomain="enrollnow" domain="samcart.com" style="width:100%"></sc-checkout>',
              }}
            />
          </div>
        </div>
      </div>

      <Script src="https://static.samcart.com/checkouts/sc-checkout.js" strategy="afterInteractive" />
    </section>
  )
}
