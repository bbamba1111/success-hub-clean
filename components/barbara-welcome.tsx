"use client"

import { motion } from "framer-motion"

const VALUES = [
  "Spirit",
  "Mind",
  "Body",
  "Health",
  "Energy",
  "Relationships",
  "80/20 Leveraged High-Value Work",
  "Time Freedom",
  "Recovery",
  "Restorative Sleep",
]

export function BarbaraWelcome() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:gap-14">

          {/* ── Left column — 60% ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="flex flex-1 flex-col items-start"
          >
            {/* Eyebrow */}
            <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.22em] text-[#78AD7D]">
              Welcome To
            </p>

            {/* H2 */}
            <h2 className="mt-3 text-pretty font-playfair text-4xl font-semibold leading-tight text-[#1C161A] sm:text-5xl">
              Make Time For More™{" "}
              <span className="italic text-[#C13B6B]">— In Real Time</span>
            </h2>

            {/* Subheadline */}
            <p className="mt-3 font-montserrat text-[11px] font-bold uppercase tracking-[0.22em] text-[#78AD7D]">
              With Thought Leader Barbara
            </p>

            {/* Body copy */}
            <p className="mt-6 max-w-[580px] font-montserrat text-base leading-relaxed text-[#4A3A42]">
              Together, we move through an intentionally designed operating rhythm built around{" "}
              <strong className="font-semibold text-[#1C161A]">Your Identity Boundaries™</strong>
              —dedicated time frames designed to help you intentionally protect and honor your values and the things that matter most.
            </p>

            {/* Divider */}
            <div className="my-8 h-px w-16 bg-[#C8B89A]" />

            {/* Secondary headline */}
            <p className="font-playfair text-xl font-semibold text-[#1C161A] sm:text-2xl">
              Your New 9-to-5 &amp; Nighttime Non-Negotiables™
            </p>

            {/* Values row */}
            <div className="mt-5 flex max-w-[580px] flex-wrap items-center gap-x-2 gap-y-2">
              <span className="font-montserrat text-sm font-semibold text-[#1C161A]">Your</span>
              {VALUES.map((value, i) => (
                <span key={value} className="flex items-center gap-x-2">
                  <span className="font-montserrat text-sm font-medium text-[#4A3A42]">
                    {value}
                  </span>
                  {i < VALUES.length - 1 && (
                    <span className="text-[#C13B6B]" aria-hidden>•</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── Right column — 40% ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
            className="flex w-full shrink-0 justify-center lg:w-[38%]"
          >
            <div
              className="w-full max-w-[340px] overflow-hidden rounded-3xl sm:max-w-[380px]"
              style={{
                boxShadow:
                  "0 12px 48px rgba(193,59,107,0.12), 0 3px 14px rgba(0,0,0,0.07)",
              }}
            >
              <img
                src="/images/barbara-live-portrait.png"
                alt="Thought Leader Barbara — Founder of Harmony Lane™"
                className="h-full w-full object-cover object-top"
                style={{ aspectRatio: "3/4" }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
