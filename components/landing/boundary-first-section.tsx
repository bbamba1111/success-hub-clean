"use client"

/**
 * Always Start With The Boundary — the signature methodology moment. Before the
 * schedule, the workflow, delegation, automation, or AI: ask what human life
 * requires the business to make possible. Then the translation chain:
 * BOUNDARY → OPERATING STANDARD → PRACTICE → ADOPTION → INSTALLATION.
 */
import { motion } from "framer-motion"

const BEFORE = [
  "Before redesigning the schedule.",
  "Before changing the workflow.",
  "Before delegating.",
  "Before automating.",
  "Before adding technology.",
  "Before asking AI to make the business faster.",
]

const CHAIN = ["Boundary", "Operating Standard", "Practice", "Adoption", "Installation"]

export function BoundaryFirstSection() {
  return (
    <section id="boundary-first" className="w-full bg-[#4A3A42] py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.28em] text-[#E8A0AC]">
            The Governing Principle
          </p>
          <h2 className="font-playfair mt-6 text-balance text-4xl font-bold leading-tight text-white sm:text-6xl">
            Always start with the boundary.
          </h2>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mx-auto mt-12 max-w-xl space-y-2 font-poppins text-pretty text-base leading-relaxed text-white/70"
        >
          {BEFORE.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.14 }}
          className="mt-10"
        >
          <p className="font-poppins text-base leading-relaxed text-white/70">Ask:</p>
          <p className="font-playfair mx-auto mt-3 max-w-2xl text-balance text-2xl font-bold italic leading-snug text-white sm:text-3xl">
            &ldquo;What does human life require this business to make possible?&rdquo;
          </p>
        </motion.div>

        <motion.ol
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-16 flex max-w-xl flex-col items-center gap-3"
        >
          {CHAIN.map((node, i) => (
            <li key={node} className="flex w-full flex-col items-center gap-3">
              <span className="font-poppins w-full max-w-xs rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white">
                {node}
              </span>
              {i < CHAIN.length - 1 && (
                <span className="text-lg text-[#E8A0AC]" aria-hidden>
                  &darr;
                </span>
              )}
            </li>
          ))}
        </motion.ol>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.26 }}
          className="font-poppins mx-auto mt-14 max-w-xl text-pretty text-base leading-relaxed text-white/70"
        >
          The boundary tells us what the business must make possible.
        </motion.p>
      </div>
    </section>
  )
}
