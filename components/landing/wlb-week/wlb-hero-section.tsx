"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { SCHEDULE } from "@/operating-engine/config/schedule"
import { REALITY_CHECK_HREF } from "./section-primitives"

export function WlbHeroSection() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % SCHEDULE.length), 4600)
    return () => clearInterval(timer)
  }, [])

  const block = SCHEDULE[index]
  const bg =
    (Array.isArray(block.backgroundImage) ? block.backgroundImage[0] : block.backgroundImage) || "/placeholder.svg"

  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={bg}
            src={bg}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: 6, ease: "easeOut" } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,241,245,0.78) 0%, rgba(255,241,245,0.45) 50%, rgba(255,241,245,0.08) 85%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-12 pt-28 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex max-w-2xl flex-col gap-4 rounded-2xl border border-white/40 bg-white/55 p-6 shadow-sm backdrop-blur-md sm:p-9"
        >
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.28em] text-[#5A7F46]">
            Make Time For More&trade;
          </p>
          <h1 className="font-playfair text-balance text-4xl font-bold leading-[1.05] tracking-tight text-[#4A3A42] sm:text-5xl">
            The Work-Life Balance <span className="text-[#C13B6B]">Business Week&trade;</span>
          </h1>
          <p className="font-poppins text-pretty text-sm font-semibold tracking-wide text-[#5A7F46] sm:text-base">
            Workweek Redesign for Human Sustainability in the Accelerated Age of AI
          </p>
          <p className="font-playfair text-pretty text-xl font-semibold leading-snug text-[#4A3A42]">
            AI is creating capacity. What will you do with the time it gives you back?
          </p>

          <div className="font-poppins flex flex-col gap-3 text-pretty text-sm leading-relaxed text-[#5A4A52] sm:text-base">
            <p>
              You started your business for freedom. But somewhere along the way, the business may have become another
              place where you work harder, carry more responsibility, and struggle to make room for the life you
              intended to create.
            </p>
            <p>Now AI is changing what one person or a small team can accomplish.</p>
            <p>
              Before you use it to do more, consider this: have you redesigned the way your business operates to support
              the freedom you wanted in the first place?
            </p>
            <p className="font-semibold text-[#4A3A42]">Welcome to a different way to approach the workweek.</p>
          </div>

          <p className="font-playfair text-pretty text-lg font-semibold italic text-[#C13B6B]">
            Experience work-life balance in real time. Discover what needs to change. Make time for more life.
          </p>

          <Link
            href={REALITY_CHECK_HREF}
            className="font-poppins mt-1 inline-flex w-fit items-center justify-center rounded-full bg-[#8AA06A] px-7 py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-xl shadow-[#8AA06A]/30 transition-transform hover:scale-[1.03] hover:bg-[#788e5a]"
          >
            Take the Work-Life Balance Reality Check
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
