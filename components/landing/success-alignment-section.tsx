"use client"

/**
 * Success Alignment (spec §5) — "What have you actually created?" Six areas
 * that look at what success produced beyond revenue, closing on an alignment
 * question. This is an alignment exercise, never a score or judgment.
 */
import { motion } from "framer-motion"

const AREAS = [
  { name: "Business", question: "What have you built?" },
  { name: "Founder Role", question: "What has the business required from you?" },
  { name: "Time", question: "What does your business currently demand?" },
  { name: "Life", question: "What has success made possible — or made harder?" },
  { name: "Workplace", question: "What kind of environment have you created for other people?" },
  {
    name: "Future of Work",
    question: "What direction is the business taking as technology and AI transform work?",
  },
]

export function SuccessAlignmentSection() {
  return (
    <section id="alignment" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Success Alignment
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            What have you actually created?
          </h2>
          <p className="font-poppins mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            Success is measured in more than revenue. Look honestly at what your business has produced — across
            every part of your work and your life.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-[#F2E4E8] bg-[#F2E4E8] sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map(({ name, question }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.05 }}
              className="bg-white p-7"
            >
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.16em] text-[#C13B6B]">{name}</p>
              <p className="font-playfair mt-3 text-pretty text-lg font-semibold leading-snug text-[#4A3A42]">
                {question}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 max-w-3xl text-center"
        >
          <p className="font-playfair text-balance text-2xl font-bold italic leading-snug text-[#5A7F46] sm:text-3xl">
            Is what you built aligned with what you intended?
          </p>
          <p className="font-poppins mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-[#8A7A82]">
            This isn&apos;t a verdict on whether you&apos;ve succeeded. It&apos;s a chance to see, clearly, where
            your business and your original intention still meet — and where they&apos;ve drifted.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
