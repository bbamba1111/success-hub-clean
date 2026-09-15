"use client"

/**
 * Reconnect With Your Original Entrepreneurial Intention™ — contrasts the life
 * founders didn't set out to build against the "more" they actually wanted,
 * then lands the central question. Emotionally resonant, not burnout marketing.
 */
import { motion } from "framer-motion"

const NOT_THIS = [
  "being permanently available",
  "working nights",
  "working weekends",
  "becoming the bottleneck",
  "managing everything",
  "sacrificing relationships",
  "creating another high-pressure job",
]

const BUT_MORE = [
  "More autonomy",
  "More time",
  "More freedom",
  "More creativity",
  "More family",
  "More impact",
  "More financial independence",
  "More meaningful work",
  "More life",
]

export function IntentionSection() {
  return (
    <section id="intention" className="w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Reconnect
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-[2.9rem]">
            Reconnect With Your Original Entrepreneurial Intention™
          </h2>
          <p className="font-poppins mt-5 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Most founders didn&apos;t start a business because they dreamed of&nbsp;—
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-[#F2E4E8] bg-white p-8"
          >
            <ul className="space-y-3">
              {NOT_THIS.map((item) => (
                <li key={item} className="font-poppins flex items-center gap-3 text-base text-[#8A7A82]">
                  <span className="text-[#C13B6B]" aria-hidden>
                    &times;
                  </span>
                  <span className="line-through decoration-[#C13B6B]/40">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-[#7FB069]/25 bg-[#7FB069]/8 p-8"
          >
            <p className="font-playfair text-xl font-bold text-[#4A3A42]">They started because they wanted more.</p>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {BUT_MORE.map((item) => (
                <li
                  key={item}
                  className="font-poppins rounded-full border border-[#7FB069]/30 bg-white px-4 py-2 text-sm font-medium text-[#5A7F46]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-12 max-w-3xl text-center"
        >
          <p className="font-playfair text-balance text-2xl font-bold italic leading-snug text-[#C13B6B] sm:text-4xl">
            &ldquo;Is the business I&apos;m building still aligned with the reason I built it?&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  )
}
