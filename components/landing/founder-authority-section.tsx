"use client"

/**
 * Founder Authority — Barbara Bamba / Thought Leader Barbara. Editorial founder
 * story that establishes category authorship. No fabricated speaking history,
 * client results, credentials, or outcomes. Motherhood is not the credential.
 */
import { motion } from "framer-motion"

const CREDENTIALS = [
  "Architect & Founder of Harmony Lane™",
  "Creator & Facilitator of Make Time For More™",
  "Creator of the Work-Life Balance Business Day™ & Business Week™",
  "International Bestselling Co-Author of The Voyage to Your Vision — Chapter 9: “Learn Before You Launch”",
]

export function FounderAuthoritySection() {
  return (
    <section id="founder" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-[#F2E4E8] bg-[#FDF6F3] p-10"
        >
          <span className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-[#C13B6B]">
            The Founder
          </span>
          <p className="font-playfair mt-4 text-4xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">Barbara Bamba</p>
          <p className="font-playfair mt-2 text-xl italic text-[#5A7F46]">Thought Leader Barbara</p>
          <ul className="mt-8 space-y-3">
            {CREDENTIALS.map((item) => (
              <li key={item} className="font-poppins flex items-start gap-3 text-sm leading-relaxed text-[#5A4A52]">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-[#C13B6B]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
            She architected the lane she needed.
          </h2>
          <div className="font-poppins mt-6 space-y-4 text-pretty text-base leading-relaxed text-[#6B5860]">
            <p>
              Barbara is a lifelong entrepreneur and Work-Life Balance Thought Leader. She witnessed overwork up
              close, then carried that grind mentality into her own entrepreneurship — and experienced the
              consequences of building success on permanent urgency.
            </p>
            <p>
              So she began examining the operating conditions behind sustainable entrepreneurial success —
              evolving beyond productivity into founder capacity, workday design, workweek design, leadership,
              workplace culture, and the future of work.
            </p>
            <p>
              That work became Make Time For More™, and ultimately Harmony Lane™ — the parallel lane she wished had
              existed when she left hustle for freedom.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
