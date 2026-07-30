"use client"

import { motion } from "framer-motion"

export function BarbaraWelcome() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">

          {/* Left — 65% copy */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
          >
            <p className="mb-3 font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] text-[#78AD7D]">
              The Work-Life Balance Business Day™
            </p>
            <h2 className="text-balance font-playfair text-3xl font-semibold leading-tight text-[#1C161A] sm:text-4xl">
              Experience Work-Life Balance —{" "}
              <span className="italic text-[#C13B6B]">Live in Real Time™</span>
            </h2>
            <p className="mt-2 font-montserrat text-sm font-semibold uppercase tracking-[0.14em] text-[#78AD7D]">
              with Thought Leader Barbara
            </p>
            <p className="mt-5 max-w-xl font-montserrat text-base leading-relaxed text-[#5A4A52]">
              Reconnect with your original entrepreneurial intentions through intentional time frames designed to help you honor, create, and live your desired work-lifestyle today.
            </p>
            <p className="mt-3 max-w-xl font-montserrat text-sm leading-relaxed text-[#7A6A72]">
              {"You chose entrepreneurship for freedom. The Work-Life Balance Business Day™ helps you live that freedom — not someday, but today."}
            </p>
          </motion.div>

          {/* Right — 35% portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
            className="shrink-0"
          >
            <div
              className="h-[240px] w-[240px] overflow-hidden rounded-[2rem] sm:h-[280px] sm:w-[280px]"
              style={{
                boxShadow:
                  "0 8px 40px rgba(193,59,107,0.14), 0 2px 12px rgba(0,0,0,0.08)",
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
