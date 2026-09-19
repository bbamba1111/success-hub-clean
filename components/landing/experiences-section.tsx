"use client"

/**
 * Experiences / pricing. Each CTA calls the provider-agnostic `startCheckout`,
 * which routes through /api/checkout to whichever gateway is live (SamCart now,
 * Stripe later). This component has no knowledge of the payment provider.
 */
import { useState } from "react"
import { motion } from "framer-motion"
import { PLANS } from "@/lib/payments/config"
import { startCheckout } from "@/lib/payments/checkout-client"

export function ExperiencesSection() {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleChoose(planId: string) {
    setError(null)
    setLoadingId(planId)
    try {
      await startCheckout(planId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setLoadingId(null)
    }
  }

  return (
    <section id="experiences" className="w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-[#E26C73]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            Choose Your Experience
          </span>
          <h2 className="font-playfair mt-5 text-pretty text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Join Make Time For More
          </h2>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860]">
            Start today. Your first week opens with a Weekly Reality Check™ and a personalized plan.
          </p>
        </div>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-3xl border p-8 shadow-sm ${
                plan.highlighted
                  ? "border-[#E26C73] bg-white shadow-xl ring-1 ring-[#E26C73]/20 lg:-translate-y-3"
                  : "border-white bg-white"
              }`}
            >
              {plan.badge && (
                <span
                  className={`font-poppins absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold ${
                    plan.highlighted ? "bg-[#E26C73] text-white" : "bg-[#7FB069] text-white"
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              <h3 className="font-playfair text-xl font-bold text-[#C13B6B]">{plan.name}</h3>
              <p className="font-poppins mt-2 text-sm leading-relaxed text-[#6B5860]">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-playfair text-4xl font-bold text-[#4A3A42]">{plan.priceLabel}</span>
                <span className="font-poppins text-sm text-[#8A7A82]">{plan.billingLabel}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="font-poppins flex items-start gap-2.5 text-sm text-[#5A4A52]">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#7FB069]/15 text-xs text-[#5A7F46]">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleChoose(plan.id)}
                disabled={loadingId !== null}
                className={`font-poppins mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-base font-semibold transition-transform hover:scale-[1.02] disabled:opacity-60 ${
                  plan.highlighted
                    ? "bg-[#E26C73] text-white shadow-lg shadow-[#E26C73]/25 hover:bg-[#d65a62]"
                    : "border border-[#7FB069]/40 bg-white text-[#5A7F46] hover:bg-[#7FB069]/5"
                }`}
              >
                {loadingId === plan.id ? "Opening checkout…" : "Begin Your Journey"}
              </button>
            </motion.div>
          ))}
        </div>

        {error && (
          <p className="font-poppins mt-6 text-center text-sm text-[#C13B6B]" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
