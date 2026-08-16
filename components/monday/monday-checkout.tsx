"use client"

import Script from "next/script"

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
export function MondayCheckout() {
  return (
    <section id="monday-checkout" className="py-20 md:py-28 bg-[#FFF6F8]">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-10 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#2F4F4F] mb-4 text-balance">
            Make Time For More™ on Mondays
          </h2>
          <p className="font-poppins mx-auto max-w-xl text-lg leading-relaxed text-gray-600">
            $497, one-time. Design &amp; live your first (or next) Work-Life Balance Business Day™ — in real time.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#7FB069]/20 bg-white p-2 shadow-xl">
          <div
            // sc-checkout is a custom element provided by SamCart's script below.
            // Rendered via dangerouslySetInnerHTML so TypeScript doesn't need a
            // JSX intrinsic declaration for a third-party custom element.
            dangerouslySetInnerHTML={{
              __html:
                '<sc-checkout product="1122707" subdomain="enrollnow" domain="mysamcart.com" style="width:100%"></sc-checkout>',
            }}
          />
        </div>
      </div>

      <Script src="https://static.samcart.com/checkouts/sc-checkout.js" strategy="afterInteractive" />
    </section>
  )
}
