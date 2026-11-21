"use client"

import { useState } from "react"

export const dynamic = "force-dynamic"

const inclusions = [
  {
    title: "Four guided Business Weeks every month",
    detail: "One Work-Life Balance Business Week™ each week, applying the experience to your actual business.",
  },
  {
    title: "A guided Monday Business Day",
    detail: "Work-Life Balance Business Day™ to reconnect with priorities and design your entry into the workweek.",
  },
  {
    title: "A protected workweek rhythm",
    detail: "Monday–Thursday workweek, the 4-Hour Focused CEO Workday™, and Friday–Sunday Time Freedom™.",
  },
  {
    title: "Structured coworking",
    detail: "Live coworking for shared focus, community, support, and accountability—included, not sold separately.",
  },
  {
    title: "A shared daily rhythm",
    detail: "Practice the built-in boundaries together and personalize your own priorities and choices as you move through the day.",
  },
  {
    title: "Human Sustainability Boundaries™",
    detail: "Practice the boundaries built into the experience and personalize them around your life and business.",
  },
  {
    title: "Ongoing founder community",
    detail: "Participate, connect, reflect, and learn alongside other founders.",
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function beginCheckout() {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/stripe/harmony-lane-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const result = await response.json()
      if (!response.ok || !result.url) {
        throw new Error(result.error || "Checkout could not be started. Please try again.")
      }
      window.location.assign(result.url)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF8F4] px-5 py-14 text-[#4A3A42] sm:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.22em] text-[#5A7F46]">
            Holiday Founding Member Offer
          </p>
          <h1 className="mt-4 font-playfair text-4xl font-bold leading-tight sm:text-6xl">
            Harmony Lane™ Basic Membership
          </h1>
          <p className="mt-5 font-poppins text-lg leading-relaxed text-[#5A4A52]">
            An ongoing premium Work-Life Balance Co-Working Destination. Bring your business,
            build boundaries in it, and practice a more sustainable way of living, working,
            and leading in the AI age.
          </p>
        </header>

        <section className="mt-12 rounded-3xl bg-[#123B2A] px-7 py-10 text-center shadow-xl sm:px-12 sm:py-14">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#C9DDB4]">
            Special founding-member monthly rate
          </p>
          <p className="mt-3 font-playfair text-6xl font-bold text-[#FFF8F4] sm:text-7xl">
            $1,997<span className="font-poppins text-xl font-medium">/month</span>
          </p>
          <p className="mx-auto mt-4 max-w-2xl font-poppins text-base leading-relaxed text-[#F6D6E1]">
            Enroll by December 31, 2026. Keep this special monthly rate for as long as your
            membership remains continuously active.
          </p>
          <button
            type="button"
            onClick={beginCheckout}
            disabled={loading}
            className="mt-8 inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#C13B6B] px-8 py-4 font-poppins text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-lg transition hover:bg-[#A8305B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Connecting to secure checkout…" : "Join Harmony Lane™ — $1,997/month"}
          </button>
          {error ? <p role="alert" className="mt-4 font-poppins text-sm text-red-100">{error}</p> : null}
          <p className="mt-4 font-poppins text-xs text-[#F6D6E1]">
            Secure payment is handled by Stripe. Membership billing and renewal are presented during checkout.
          </p>
        </section>

        <section className="mt-16">
          <header className="mx-auto max-w-3xl text-center">
            <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7F46]">
              Your membership includes
            </p>
            <h2 className="mt-3 font-playfair text-3xl font-bold sm:text-4xl">
              A shared destination. A rhythm you practice in your real business.
            </h2>
          </header>
          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            {inclusions.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[#E8D5DC] bg-white p-6 shadow-sm">
                <h3 className="font-playfair text-xl font-bold">{item.title}</h3>
                <p className="mt-3 font-poppins text-base leading-relaxed text-[#5A4A52]">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-[#DCE5D5] bg-[#EEF3E8] px-7 py-10 sm:px-12">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Begin with the free first step
          </p>
          <h2 className="mt-3 font-playfair text-3xl font-bold">Start with the Work-Life Balance Reality Check™.</h2>
          <p className="mt-4 font-poppins text-base leading-relaxed text-[#4A5A43]">
            The Reality Check is your first step—not a separate paid product or an automatic
            enrollment in the membership. Take it, review your results and My Boundary Report,
            and then decide whether Harmony Lane™ is right for you. There is no purchase obligation.
          </p>
          <a href="/landing#reality-check" className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#5A7F46] px-6 py-3 font-poppins text-sm font-semibold text-[#355B35] transition hover:bg-white">
            Take the FREE Work-Life Balance Reality Check™
          </a>
        </section>

        <p className="mt-10 text-center font-poppins text-sm text-[#806F77]">
          <a href="/landing" className="underline underline-offset-4 hover:text-[#4A3A42]">Return to the Harmony Lane™ destination page</a>
        </p>
      </div>
    </main>
  )
}
