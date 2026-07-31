"use client"

import { motion } from "framer-motion"

const CREDENTIALS = [
  {
    title: "Architect of Harmony™",
    subtitle: "The Parallel Lane\u2122 & Counterpart to Hustle Entrepreneurship",
  },
  {
    title: "International Bestselling Co-Author",
    subtitle: "The Voyage to Your Vision \u2014 Chapter 9, \u201cLearn Before You Launch.\u201d",
  },
  {
    title: "Creator & Host \u2014 Make Time For More\u2122 On Mondays\u2122",
    subtitle: "The Redesigned Entry Into the Workweek.",
  },
  {
    title: "Creator & Guide \u2014 Make Time For More\u2122 \u2014 In Real Time\u2122",
    subtitle: "The live experience of the Work-Life Balance Business Day\u2122, Week\u2122, Month\u2122, and Quarter\u2122.",
  },
]

const VALUES = [
  "Your Spirit",
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
    <section className="w-full bg-[#FDFAF5]">
      {/* ── Two-column intro ── */}
      <div className="mx-auto max-w-[1320px] px-6 pb-0 pt-20 sm:px-10 sm:pt-24 lg:px-16 lg:pt-28">
        <div className="flex flex-col items-start gap-14 lg:flex-row lg:items-start lg:gap-20">

          {/* ── Left column — 60% ── */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="flex min-w-0 flex-1 flex-col"
          >
            {/* Eyebrow */}
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.3em] text-[#78AD7D]">
              Welcome To
            </p>

            {/* Headline — single line on desktop */}
            <h2 className="mt-3 whitespace-nowrap font-playfair text-[2rem] font-semibold leading-tight tracking-[-0.01em] text-[#1C161A] lg:text-[2.55rem]">
              Make Time For More™{" "}
              <span className="italic text-[#C13B6B]">— In Real Time</span>
            </h2>

            {/* With Thought Leader Barbara */}
            <p className="mt-3 font-montserrat text-[10px] font-bold uppercase tracking-[0.26em] text-[#78AD7D]">
              With Thought Leader Barbara
            </p>

            {/* Credentials */}
            <div className="flex flex-col gap-6 mb-5">
              {CREDENTIALS.map((c, i) => (
                <div key={i}>
                  <p className="font-montserrat text-[13px] font-semibold leading-snug text-[#1C161A]">
                    {c.title}
                  </p>
                  <p className="mt-1 font-montserrat text-[12px] italic leading-relaxed text-[#7A6A72]">
                    {c.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* Philosophy */}
            <p className="max-w-[580px] font-montserrat text-[15px] leading-[1.8] text-[#4A3A42]">
              Together, we move through the{" "}
              <strong className="font-semibold text-[#1C161A]">Work-Life Balance Business Day™</strong>
              —an intentionally designed operating rhythm built around{" "}
              <strong className="font-semibold text-[#1C161A]">Identity Development Boundaries™</strong>.
              These dedicated time frames create the time and space for a{" "}
              <strong className="font-semibold text-[#1C161A]">daily identity practice</strong>, created to help
              you intentionally become the founder, leader, and person you aspire to be while protecting and
              honoring your values, your well-being, and the things that matter most.
            </p>
          </motion.div>

          {/* ── Right column — 40% portrait ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="flex w-full shrink-0 justify-center lg:w-[40%] lg:justify-end"
          >
            <div
              className="w-full max-w-[300px] overflow-hidden rounded-[2rem] sm:max-w-[340px] lg:max-w-[380px]"
              style={{
                boxShadow: "0 20px 60px rgba(193,59,107,0.13), 0 4px 18px rgba(0,0,0,0.07)",
                aspectRatio: "3/4",
              }}
            >
              <img
                src="/images/barbara-live-portrait.png"
                alt="Thought Leader Barbara — Founder of Harmony Lane™"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Non-Negotiables — full-width centered manifesto ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto max-w-[1320px] px-6 pb-0 pt-20 text-center sm:px-10 sm:pt-24 lg:px-16 lg:pt-28"
      >
        <h2 className="text-balance font-playfair text-3xl font-semibold text-[#1C161A] sm:text-4xl lg:text-5xl">
          Your New 9-to-5 &amp; Nighttime Non-Negotiables™
        </h2>
        <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {VALUES.map((value, i) => (
            <span key={value} className="flex items-center gap-x-3">
              <span className="font-montserrat text-[13px] font-semibold tracking-wide text-[#1C161A]">
                {value}
              </span>
              {i < VALUES.length - 1 && (
                <span className="text-[#C13B6B] opacity-60" aria-hidden>•</span>
              )}
            </span>
          ))}
        </div>
      </motion.div>


    </section>
  )
}
