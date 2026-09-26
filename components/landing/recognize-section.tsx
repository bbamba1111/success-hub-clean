"use client"

/**
 * Self-Identification — "You may recognize yourself here." Large editorial
 * first-person statements (not cards, not pills) the founder reads and thinks
 * "that's me." Closes by reframing the symptoms as one deeper problem.
 */
import { motion } from "framer-motion"

const STATEMENTS = [
  "I\u2019m the bottleneck.",
  "The business owns my time.",
  "I can\u2019t really disconnect.",
  "Growth created more work for me.",
  "My team still depends on me for too much.",
  "Clients have too much access to me.",
  "Everything becomes urgent.",
  "My calendar dictates my life.",
  "I have more technology, but not more life.",
  "AI is making the business more capable \u2014 but I don\u2019t want that capability to simply create more work.",
  "I built this business for freedom \u2014 but I\u2019m not experiencing that freedom.",
]

export function RecognizeSection() {
  return (
    <section id="recognize" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="font-playfair text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl"
        >
          You may recognize yourself here.
        </motion.h2>

        <ul className="mt-12 divide-y divide-[#4A3A42]/10 border-y border-[#4A3A42]/10">
          {STATEMENTS.map((line, i) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
              className="font-playfair text-pretty py-4 text-xl font-medium italic leading-snug text-[#5A4A52] sm:text-2xl"
            >
              &ldquo;{line}&rdquo;
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <p className="font-poppins text-pretty text-lg leading-relaxed text-[#6B5860]">
            These may look like separate problems.
          </p>
          <p className="font-playfair mt-2 text-balance text-2xl font-bold leading-snug text-[#C13B6B] sm:text-3xl">
            They are often symptoms of something deeper.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
