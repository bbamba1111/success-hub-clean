"use client"

/**
 * Identify the Founder — the recognition beat before any methodology. "You
 * built your business for freedom." → the business grew, the boundaries didn't.
 * Image-led (real human life), not a coaching funnel.
 */
import { motion } from "framer-motion"

export function FounderIdentifySection() {
  return (
    <section id="founder" className="w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#5A7F46]">
            You Built It For A Reason
          </p>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            You built your business for freedom.
          </h2>

          <div className="mt-8 space-y-2 font-poppins text-pretty text-lg leading-relaxed text-[#6B5860]">
            <p>You wanted more control over your time.</p>
            <p>More room for family.</p>
            <p>More space for health.</p>
            <p>More freedom to live.</p>
          </div>

          <p className="font-poppins mt-8 text-pretty text-base leading-relaxed text-[#6B5860]">
            Then the business grew. The hours expanded. The decisions multiplied. The team needed you. Clients
            needed you. Technology made everything faster. And somehow, the business you built to create more
            freedom began consuming more of your life.
          </p>

          <p className="font-playfair mt-10 text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
            The business grew.
            <span className="mt-1 block text-[#C13B6B]">The boundaries didn&apos;t.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2rem] shadow-xl"
        >
          <img
            src="/images/family-lifestyle-experiences.png"
            alt="A founder present with family, living the life the business was built to make possible"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}
