"use client"

/**
 * Meet Your Guide — Barbara Bamba / Thought Leader Barbara. Placed AFTER "Your
 * Monday Starts Before Monday" and BEFORE the final offer. Establishes Barbara
 * as the person who created and guides the Harmony Lane™ experience — a guide,
 * not a lecturer.
 *
 * Premium editorial layout with the portrait flush LEFT and the copy RIGHT.
 * Uses the existing project portrait (/images/barbara-portrait.png). No
 * fabricated credentials, awards, media, statistics, or long biography.
 */
import Image from "next/image"
import { motion } from "framer-motion"

const CREDENTIALS = [
  "Architect, Harmony Lane\u2122",
  "Founder, Startup & Thrive, LLC",
  "Creator, Make Time For More\u2122",
  "Guide of The Work-Life Balance Business Day\u2122",
  "Guide of Work-Life Balance Business Week\u2122",
  "Guide of 30/60/90 Installation",
  "International Bestselling Co-Author, The Voyage to Your Vision",
  "Former Owner, Philadelphia Speakers Bureau",
]

export function FounderAuthoritySection() {
  return (
    <section id="guide" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Portrait — flush left */}
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
              alt="Barbara Bamba, Architect of Harmony Lane, in front of a cherry blossom window"
              width={720}
              height={880}
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </motion.div>

        {/* Copy — right */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-poppins text-sm font-semibold tracking-[0.14em] text-[#C13B6B]">Meet Your Guide</span>
          <p className="font-playfair mt-4 text-4xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Barbara Bamba
          </p>
          <p className="font-playfair mt-2 text-lg italic text-[#7FB069]">Thought Leader Barbara</p>

          <ul className="mt-8 grid gap-3 border-t border-[#F2E4E8] pt-6">
            {CREDENTIALS.map((item) => (
              <li key={item} className="font-poppins flex items-start gap-3 text-base leading-relaxed text-[#5A4A52]">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#C13B6B]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <div className="font-playfair mt-8 border-l-2 border-[#7FB069]/40 pl-6 text-pretty text-lg font-semibold leading-snug text-[#4A3A42]">
            <p>On Monday, Barbara isn&apos;t simply teaching the concept.</p>
            <p className="mt-1 text-[#5A7F46]">She&apos;s guiding you through the experience.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
