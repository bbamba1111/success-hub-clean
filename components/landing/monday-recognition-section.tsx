"use client"

/**
 * Section 2 — The Founder Problem. Names the trap: the habits that created
 * success can follow you into entrepreneurship, and AI now accelerates the
 * consumption of human capacity. Editorial, spacious, quietly powerful.
 */
import { motion } from "framer-motion"

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.6, delay },
})

export function MondayRecognitionSection() {
  return (
    <section id="recognize" className="w-full bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.h2
          {...reveal()}
          className="font-playfair text-balance text-3xl font-bold uppercase leading-tight text-[#4A3A42] sm:text-5xl"
        >
          You didn&apos;t start your business
          <span className="mt-1 block text-[#C13B6B]">to recreate the life you left.</span>
        </motion.h2>

        <motion.div
          {...reveal(0.08)}
          className="font-poppins mt-10 space-y-5 text-pretty text-lg leading-relaxed text-[#5A4A52]"
        >
          <p>
            You started your business for more freedom. More time. More life. Success on your terms.
          </p>
          <p>
            But the habits that created success in your previous environment can follow you into entrepreneurship.
          </p>
          <p className="font-playfair text-xl font-semibold text-[#4A3A42]">Now there is another acceleration layer: AI.</p>
          <p>
            AI can dramatically increase what a business can accomplish. But increased capability does not
            automatically create a better way of working.
          </p>
          <p>
            If every efficiency gain becomes more output, more clients, faster response times, greater availability
            and more work, the business simply learns to consume the capacity it just created.
          </p>
        </motion.div>

        <motion.p
          {...reveal(0.16)}
          className="font-playfair mt-12 text-balance text-2xl font-bold leading-snug text-[#5A7F46] sm:text-3xl"
        >
          You didn&apos;t leave hustle culture to automate it.
        </motion.p>
      </div>
    </section>
  )
}
