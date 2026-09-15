"use client"

/**
 * Meet Your Founder Guide — Barbara Bamba / Thought Leader Barbara. Lives at the
 * END of the page, immediately before the final CTA. Positions Barbara as the
 * guide & facilitator of the experience, not a lecturer. Uses the existing
 * project portrait (/images/barbara-portrait.png). No fabricated speaking
 * history, client results, or outcomes.
 */
import Image from "next/image"
import { motion } from "framer-motion"

const CREDENTIALS = [
  "Founder Guide & Facilitator",
  "Architect & Founder of Harmony Lane™",
  "Creator & Facilitator of Make Time For More™",
  "Creator of the Work-Life Balance Business Day™ & Business Week™",
  "International Bestselling Co-Author of The Voyage to Your Vision — Chapter 9: “Learn Before You Launch”",
]

export function FounderAuthoritySection() {
  return (
    <section id="founder" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-[#F2E4E8] bg-[#FDF6F3]">
            <Image
              src="/images/barbara-portrait.png"
              alt="Barbara Bamba, Founder Guide & Facilitator of Harmony Lane, in front of a cherry blossom window"
              width={720}
              height={880}
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-poppins text-xs font-bold uppercase tracking-[0.22em] text-[#C13B6B]">
            Meet Your Founder Guide
          </span>
          <p className="font-playfair mt-4 text-4xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Barbara Bamba
          </p>
          <p className="font-poppins mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#5A7F46]">
            Founder Guide &amp; Facilitator
          </p>
          <p className="font-playfair mt-1 text-lg italic text-[#7FB069]">Thought Leader Barbara</p>

          <p className="font-poppins mt-6 text-pretty text-base leading-relaxed text-[#4A3A42]">
            You won&apos;t be handed another formula to follow. Barbara guides and facilitates the experience as you
            define your destination, examine your reality, make intentional decisions, and experience a redesigned
            relationship with work and time.
          </p>

          <div className="font-poppins mt-5 space-y-4 text-pretty text-sm leading-relaxed text-[#6B5860]">
            <p>
              Barbara is a lifelong entrepreneur and Work-Life Balance Thought Leader. She witnessed overwork up
              close, then carried that grind mentality into her own entrepreneurship — and experienced the
              consequences of building success on permanent urgency.
            </p>
            <p>
              So she began examining the operating conditions behind sustainable entrepreneurial success — evolving
              beyond productivity into founder capacity, workday design, workweek design, leadership, workplace
              culture, and the future of work. That work became Make Time For More™, and ultimately Harmony Lane™.
            </p>
          </div>

          <ul className="mt-8 grid gap-3 border-t border-[#F2E4E8] pt-6 sm:grid-cols-2">
            {CREDENTIALS.map((item) => (
              <li key={item} className="font-poppins flex items-start gap-3 text-sm leading-relaxed text-[#5A4A52]">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#C13B6B]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
