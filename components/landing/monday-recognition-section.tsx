"use client"

/**
 * Monday-first recognition beat. One tight emotional moment — the founder
 * recognizes herself — then names the gap in a single line. Deliberately short:
 * the page's job is to make her want to experience Monday, not to teach the
 * whole methodology before she has bought.
 */
import { motion } from "framer-motion"

export function MondayRecognitionSection() {
  return (
    <section id="recognize" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-poppins text-xs font-bold uppercase tracking-[0.24em] text-[#5A7F46]"
        >
          You built your business for freedom.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-playfair mt-6 text-balance text-2xl font-medium leading-snug text-[#5A4A52] sm:text-3xl"
        >
          But the business grew. The hours expanded. The decisions multiplied. And somehow, the business began
          consuming the life you built it for.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="font-playfair mt-10 text-balance text-3xl font-bold leading-tight text-[#C13B6B] sm:text-4xl"
        >
          The business grew.
          <span className="block text-[#4A3A42]">The boundaries didn&apos;t.</span>
        </motion.p>
      </div>
    </section>
  )
}
