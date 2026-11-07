"use client"

/**
 * Category Thesis — the manifesto. Work-life balance reframed from a personal
 * wellness goal into a business-design requirement for Human Sustainability™ in
 * the AI Age. Editorial declaration, not a card. Governing methodology line:
 * ALWAYS START WITH THE BOUNDARY.
 */
import { motion } from "framer-motion"

export function CategoryThesisSection() {
  return (
    <section id="thesis" className="w-full bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#5A7F46]">
            A New Business-Design Requirement
          </p>

          <h2 className="font-playfair mt-8 text-balance text-3xl font-bold leading-[1.12] text-[#4A3A42] sm:text-5xl">
            Work-life balance is no longer merely a personal wellness goal.
          </h2>
          <p className="font-playfair mt-4 text-balance text-2xl font-bold italic leading-snug text-[#C13B6B] sm:text-4xl">
            It is a business-design requirement for Human Sustainability™ in the AI Age.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14 border-t border-[#4A3A42]/10 pt-10"
        >
          <p className="font-poppins text-pretty text-lg leading-relaxed text-[#6B5860]">
            The question is no longer simply:
          </p>
          <p className="font-playfair mt-2 text-pretty text-xl font-semibold italic leading-snug text-[#8A7A82]">
            &ldquo;How do I create better balance for myself?&rdquo;
          </p>

          <p className="font-poppins mt-8 text-pretty text-lg leading-relaxed text-[#6B5860]">
            The business-design question is:
          </p>
          <p className="font-playfair mt-2 text-pretty text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
            &ldquo;What does my business need to make human life possible?&rdquo;
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="font-poppins mt-14 text-balance text-sm font-bold uppercase tracking-[0.28em] text-[#C13B6B]"
        >
          Always start with the boundary.
        </motion.p>
      </div>
    </section>
  )
}
