"use client"

/**
 * The Parallel Lane — the core category position. Harmony Lane™ is NOT
 * anti-hustle; it is the parallel lane to hustle entrepreneurship. Two lanes
 * presented as both/and, never moral opposites. Communicated through copy and
 * typographic structure — no literal highway/road imagery.
 */
import { motion } from "framer-motion"

const DIFFERENCES = [
  "A different way to build",
  "A different way to work",
  "A different way to lead",
  "A different relationship with time",
  "A different definition of entrepreneurial success",
]

export function HarmonyParallelSection() {
  return (
    <section id="parallel" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            The Parallel Lane
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Harmony Lane™
          </h2>
          <p className="font-playfair mt-3 text-pretty text-xl italic leading-snug text-[#C13B6B] sm:text-2xl">
            The Parallel Lane to Hustle Entrepreneurship™
          </p>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            Hustle is one way to build. Harmony is another. Harmony Lane™ doesn&apos;t ask you to abandon ambition,
            growth, speed, or achievement — it gives you another way to design the conditions around success.
          </p>
        </motion.div>

        {/* Two lanes, side by side — both/and, not opposites */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl border border-[#4A3A42]/12 bg-[#FBF6F8] p-8"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#8A7A82]">The Hustle Lane</p>
            <p className="font-playfair mt-3 text-2xl font-bold text-[#4A3A42]">Build faster.</p>
            <p className="font-poppins mt-3 text-pretty text-sm leading-relaxed text-[#6B5860]">
              Speed, scale, and relentless output. A proven lane — one many entrepreneurs know well, and one you
              can still choose to accelerate into whenever the moment calls for it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl border border-[#7FB069]/30 bg-[#7FB069]/8 p-8"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
              The Harmony Lane
            </p>
            <p className="font-playfair mt-3 text-2xl font-bold text-[#4A3A42]">Build intentionally.</p>
            <p className="font-poppins mt-3 text-pretty text-sm leading-relaxed text-[#5A7F46]">
              Spaciousness, capacity, and sustainable success. A parallel lane where you design your operating
              rhythm on purpose — and adjust it as the business, and your life, require.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 max-w-3xl rounded-3xl bg-[#4A3A42] p-10 text-center sm:p-12"
        >
          <p className="font-playfair text-balance text-3xl font-bold leading-snug text-white sm:text-4xl">
            Not either/or.
            <span className="ml-2 text-[#E8A0AC]">It&apos;s both/and.</span>
          </p>
          <p className="font-poppins mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/75">
            Accelerate when it serves you. Create space when it matters. Harmony Lane™ lets you decide the
            operating model on purpose — instead of inheriting one by default.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
            {DIFFERENCES.map((item) => (
              <li
                key={item}
                className="font-poppins rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
