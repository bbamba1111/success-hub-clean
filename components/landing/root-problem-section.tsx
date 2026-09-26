"use client"

/**
 * The Root Problem — the business was designed to operate, but was it designed
 * to operate within the boundaries human life requires? A personal boundary
 * isn't enough; the business has to be able to answer for it.
 */
import { motion } from "framer-motion"

const QUESTIONS = [
  "Who handles the issue?",
  "Who owns the decision?",
  "What counts as an emergency?",
  "When can clients expect a response?",
  "Who gets contacted?",
  "What does the team do?",
  "What does the founder no longer do?",
]

export function RootProblemSection() {
  return (
    <section id="root-problem" className="w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#5A7F46]">
            The Root Problem
          </p>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
            The business was designed to operate.
            <span className="mt-2 block text-[#C13B6B]">
              But was it designed to operate within the boundaries human life requires?
            </span>
          </h2>
          <p className="font-poppins mt-8 text-pretty text-lg leading-relaxed text-[#6B5860]">
            The problem isn&apos;t that the founder needs another productivity hack.{" "}
            <span className="font-semibold text-[#4A3A42]">The business needs boundaries.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 rounded-[2rem] border border-[#4A3A42]/10 bg-white p-8 sm:p-10"
        >
          <p className="font-poppins text-base leading-relaxed text-[#6B5860]">A personal boundary says:</p>
          <p className="font-playfair mt-2 text-pretty text-2xl font-bold italic leading-snug text-[#4A3A42] sm:text-3xl">
            &ldquo;I won&apos;t work after 5 PM.&rdquo;
          </p>
          <p className="font-poppins mt-8 text-base leading-relaxed text-[#6B5860]">
            But the business has to answer:
          </p>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {QUESTIONS.map((q) => (
              <li key={q} className="font-poppins flex items-start gap-3 text-pretty text-base leading-snug text-[#5A4A52]">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#7FB069]" aria-hidden />
                {q}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="font-playfair mx-auto mt-14 max-w-3xl text-balance text-center text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl"
        >
          A boundary only becomes sustainable when the business can operate within it.
        </motion.p>
      </div>
    </section>
  )
}
