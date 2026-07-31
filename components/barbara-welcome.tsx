"use client"

import { motion } from "framer-motion"

const CREDENTIALS = [
  {
    title: "Architect of Harmony™",
    subtitle: "The Parallel Lane™ & Counterpart to Hustle Entrepreneurship",
  },
  {
    title: "International Bestselling Co-Author",
    subtitle: "The Voyage to Your Vision \u2014 Chapter 9, \u201cLearn Before You Launch.\u201d",
  },
  {
    title: "Creator & Host — Make Time For More™ Mondays™",
    subtitle: "The Redesigned Entry Into the Workweek.",
  },
  {
    title: "Creator & Host — Make Time For More™ In Real Time™",
    subtitle: "The live experience of the Work-Life Balance Business Day™, Week™, Month™, and Quarter™.",
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
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">

        {/* ── Two-column layout ── */}
        <div className="flex flex-col items-start gap-14 lg:flex-row lg:items-start lg:gap-16">

          {/* ── Left column — 62% ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="flex min-w-0 flex-1 flex-col"
          >
            {/* Eyebrow */}
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.28em] text-[#78AD7D]">
              Welcome To
            </p>

            {/* Headline — must stay one line on desktop */}
            <h2 className="mt-3 whitespace-nowrap font-playfair text-[2.15rem] font-semibold leading-tight tracking-[-0.01em] text-[#1C161A] lg:text-[2.6rem]">
              Make Time For More™{" "}
              <span className="italic text-[#C13B6B]">— In Real Time</span>
            </h2>

            {/* With Thought Leader Barbara */}
            <p className="mt-3 font-montserrat text-[10px] font-bold uppercase tracking-[0.24em] text-[#78AD7D]">
              With Thought Leader Barbara
            </p>

            {/* Credentials */}
            <div className="mt-7 flex flex-col gap-5">
              {CREDENTIALS.map((c, i) => (
                <div key={i}>
                  <p className="font-montserrat text-[13px] font-semibold text-[#1C161A]">
                    {c.title}
                  </p>
                  <p className="mt-0.5 font-montserrat text-[12px] italic leading-relaxed text-[#7A6A72]">
                    {c.subtitle}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="my-8 h-px w-12 bg-[#C8B89A]" />

            {/* Body copy */}
            <p className="max-w-[600px] font-montserrat text-[15px] leading-[1.75] text-[#4A3A42]">
              Together, we move through an intentionally designed operating rhythm built around{" "}
              <strong className="font-semibold text-[#1C161A]">Your Identity Boundaries™</strong>
              —dedicated time frames intentionally designed to help you protect and honor your values,
              your well-being, and the things that matter most.
            </p>



          </motion.div>

          {/* ── Right column — 38% portrait ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="flex w-full shrink-0 justify-center lg:w-[38%] lg:justify-end"
          >
            <div
              className="w-full max-w-[320px] overflow-hidden rounded-[2rem] sm:max-w-[360px] lg:max-w-[400px]"
              style={{
                boxShadow:
                  "0 16px 56px rgba(193,59,107,0.13), 0 4px 16px rgba(0,0,0,0.07)",
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
    </section>
  )
}
