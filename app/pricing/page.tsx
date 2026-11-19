"use client"

import { useState } from "react"

export const dynamic = "force-dynamic"

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
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#5A7F46]">
            Your next step after the Reality Check
          </p>
          <h1 className="mt-4 font-playfair text-4xl font-bold leading-tight sm:text-5xl">
            Enter Harmony Lane™
          </h1>
          <p className="mt-5 font-poppins text-lg leading-relaxed text-[#5A4A52]">
            A premium, live-guided work-life balance destination where you practice
            living, working, leading, and operating your business within a structure
            designed to make room for your life.
          </p>
        </header>

        <section className="mt-12 rounded-3xl border border-[#E8D5DC] bg-white p-7 shadow-sm sm:p-10">
          <div className="text-center">
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#5A7F46]">
              Black Friday special · Founding-member offer
            </p>
            <div className="mt-4 flex flex-wrap items-baseline justify-center gap-x-2">
              <span className="font-playfair text-5xl font-bold sm:text-6xl">$1,997</span>
              <span className="font-poppins text-lg text-[#6E5D65]">every 30 days</span>
            </div>
            <p className="mt-3 font-poppins text-sm text-[#6E5D65]">
              Enroll by December 31, 2026. Your $1,997 rate remains protected
              for as long as your membership stays continuously active.
            </p>
          </div>

          <div className="mt-9 grid gap-4 rounded-2xl bg-[#F4F7F0] p-6 sm:grid-cols-2">
            <div>
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#5A7F46]">
                Original monthly value
              </p>
              <p className="mt-2 font-playfair text-3xl font-bold">$7,988</p>
              <p className="mt-1 font-poppins text-sm text-[#5A4A52]">
                Four guided Business Weeks™ valued at $1,997 each.
              </p>
            </div>
            <div>
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#5A7F46]">
                Your founding-member investment
              </p>
              <p className="mt-2 font-playfair text-3xl font-bold">$1,997</p>
              <p className="mt-1 font-poppins text-sm text-[#5A4A52]">
                One membership payment every 30 days, including all four weeks.
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-[#E8D5DC] p-6">
            <h2 className="font-playfair text-2xl font-bold">
              Four guided weeks. One membership.
            </h2>
            <div className="mt-5 space-y-3 font-poppins text-sm text-[#5A4A52]">
              {["Week 1 — $1,997 original value", "Week 2 — $1,997 original value", "Week 3 — $1,997 original value", "Week 4 — $1,997 original value"].map((item) => (
                <div key={item} className="flex items-center justify-between gap-4">
                  <span>{item}</span>
                  <strong className="whitespace-nowrap">$1,997</strong>
                </div>
              ))}
              <div className="border-t border-[#E8D5DC] pt-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#4A3A42]">Four-week original value</span>
                  <strong className="whitespace-nowrap text-lg">$7,988</strong>
                </div>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#4A3A42]">Founding-member price</span>
                  <strong className="whitespace-nowrap text-lg">$1,997 / 30 days</strong>
                </div>
              </div>
            </div>
            <p className="mt-4 font-poppins text-xs leading-relaxed text-[#806F77]">
              The $1,997 weekly amount is the original value of each guided Business Week™,
              not a separate weekly charge. Your founding membership includes all four
              guided weeks for one recurring payment every 30 days.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#5A7F46]">
              What your membership includes
            </p>
            <h2 className="mt-3 font-playfair text-3xl font-bold sm:text-4xl">
              Four guided Work-Life Balance Business Weeks™ every month.
            </h2>
            <p className="mt-4 font-poppins leading-relaxed text-[#5A4A52]">
              This is a premium destination you enter and experience in real time,
              with live guidance from Barbara as you put the weekly structure into practice.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Four guided Work-Life Balance Business Weeks™", "One guided week each week, with live guidance as you practice the experience in your actual business and life."],
              ["Monday Work-Life Balance Business Day™", "Begin each week with guided intention, priorities, and a deliberate entry into your workweek."],
              ["Built-in Human Sustainability Boundaries™", "A four-day workweek, a focused four-hour CEO workday, protected time freedom, and a three-day weekend."],
              ["Five-minute boundary check-ins", "Record work-related collisions that arise as you protect and honor the non-negotiable boundaries built into the experience."],
              ["Structured coworking", "Work alongside other founders within the Business Week rhythm. Coworking is an included feature—not the product itself."],
              ["7-Day Work-Life Balance Audit retakes", "Included retakes help you review your experience and notice changes in your work-life balance."],
              ["Founder community and accountability", "Stay connected through shared participation, encouragement, and accountability."],
              ["Practice in your real business", "Learn to live, work, lead, and operate within and around the boundaries—not simply discuss work-life balance in theory."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-[#E8D5DC] bg-white p-6">
                <h3 className="font-playfair text-xl font-bold">{title}</h3>
                <p className="mt-2 font-poppins text-sm leading-relaxed text-[#5A4A52]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-[#EAF1E4] px-7 py-10 text-center sm:px-12">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#5A7F46]">
            The Harmony Lane principle
          </p>
          <h2 className="mt-4 font-playfair text-3xl font-bold sm:text-4xl">
            Human Sustainability Boundaries™ contain work so life has space to expand.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-poppins leading-relaxed text-[#4F5D49]">
            The boundaries are built into the Work-Life Balance Business Week™.
            You learn to live, work, lead, and operate your business within and around
            them—and record the work-related collisions that arise as you protect and honor them.
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl text-center">
          <h2 className="font-playfair text-2xl font-bold">Join Harmony Lane™</h2>
          <p className="mt-4 font-poppins leading-relaxed text-[#5A4A52]">
            Enroll by December 31, 2026 to secure the $1,997 founding-member rate
            every 30 days for as long as your membership remains continuously active.
          </p>
          <button
            type="button"
            onClick={beginCheckout}
            disabled={loading}
            className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-[#5A7F46] px-9 py-4 font-montserrat text-sm font-bold text-white shadow-sm transition hover:bg-[#49683A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Connecting to secure checkout…" : "Join Harmony Lane™ — $1,997 every 30 days"}
          </button>
          {error ? <p role="alert" className="mt-4 font-poppins text-sm text-red-700">{error}</p> : null}
          <p className="mt-4 font-poppins text-xs text-[#806F77]">
            Secure payment is handled by Stripe. Your membership renews every 30 days.
          </p>
        </section>
      </div>
    </main>
  )
}
