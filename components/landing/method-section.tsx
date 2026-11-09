"use client"

/**
 * 04 — The Method. Build Work-Life Balance Boundaries Into Your Day. The key
 * distinction: a personal boundary vs. a business boundary. Then the 5-step
 * progression from personal boundary to business operation.
 */
import { motion } from "framer-motion"

const STEPS = [
  { label: "Build", body: "Build the boundary into your day." },
  { label: "Customize", body: "Make it fit your actual life and business." },
  { label: "Honor", body: "Respect the boundary when the moment arrives." },
  { label: "Live It", body: "Step into the boundary in real time." },
  { label: "Install", body: "Translate what works into the business." },
]

export function MethodSection() {
  return (
    <section id="method" className="w-full bg-[#F1F6EC] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46] shadow-sm">
            04 — The Method
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Build Work-Life Balance boundaries into your day.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-[#4A3A42]/10 bg-white/70 p-8"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#8A7A82]">
              Personal boundary
            </p>
            <p className="font-playfair mt-4 text-pretty text-xl font-bold leading-snug text-[#6B5860]">
              What do I need to stop doing?
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-3xl border border-[#7FB069]/30 bg-white p-8 shadow-lg"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
              Business boundary
            </p>
            <p className="font-playfair mt-4 text-pretty text-xl font-bold leading-snug text-[#5A7F46]">
              What needs to change in the way this business operates so I don&apos;t have to keep violating that
              boundary?
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 max-w-3xl text-center"
        >
          <p className="font-poppins text-pretty text-base leading-relaxed text-[#5A4A52]">
            If the business requires constant availability, telling yourself to &ldquo;disconnect more&rdquo;
            doesn&apos;t solve the operating problem. If every decision requires you, telling yourself to
            &ldquo;take more time off&rdquo; doesn&apos;t solve the dependency problem.
          </p>
          <p className="font-playfair mt-6 text-balance text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
            The business has to be capable of operating within the boundaries.
          </p>
        </motion.div>

        <ol className="mx-auto mt-14 grid max-w-4xl gap-3 sm:grid-cols-5">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex flex-col rounded-2xl border border-[#7FB069]/25 bg-white p-5 text-center shadow-sm"
            >
              <span className="font-playfair mx-auto text-lg font-bold text-[#7FB069]">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-poppins mt-1 text-sm font-bold uppercase tracking-[0.12em] text-[#4A3A42]">
                {step.label}
              </span>
              <span className="font-poppins mt-2 text-xs leading-relaxed text-[#6B5860]">{step.body}</span>
            </motion.li>
          ))}
        </ol>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="font-playfair mx-auto mt-12 max-w-2xl text-balance text-center text-lg font-bold leading-snug text-[#4A3A42] sm:text-xl"
        >
          From personal boundary to business boundary. From intention to operation. From founder dependency to
          intentional design.
        </motion.p>
      </div>
    </section>
  )
}
