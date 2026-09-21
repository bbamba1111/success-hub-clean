"use client"

/**
 * Why The 3 + 3 Model — the six boundaries aren't six more projects; they are
 * the weekly boundary map. Three action lenses translate the map into the week.
 */
import { motion } from "framer-motion"

const LENSES = [
  { name: "Life Priority\u2122", q: "What am I making time for?" },
  { name: "Delegation Priority\u2122", q: "What am I no longer personally carrying?" },
  { name: "Operating Rule\u2122 Priority", q: "What rule, boundary, or way of working am I establishing or reinforcing?" },
]

export function BoundaryMapSection() {
  return (
    <section id="boundary-map" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="font-playfair text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
            Not six more projects.
            <span className="mt-2 block text-[#C13B6B]">Your six boundaries are your weekly boundary map.</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-[#7FB069]/25 bg-[#F1F6EC] p-8"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
              3 Life Boundaries
            </p>
            <p className="font-playfair mt-3 text-pretty text-lg font-bold leading-snug text-[#4A3A42]">
              What must human life have room for?
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-[2rem] border border-[#C13B6B]/25 bg-[#FBEBF0] p-8"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
              3 Business Boundaries
            </p>
            <p className="font-playfair mt-3 text-pretty text-lg font-bold leading-snug text-[#4A3A42]">
              What must the business do differently?
            </p>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {LENSES.map((lens, i) => (
            <motion.div
              key={lens.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-[2rem] border border-[#4A3A42]/10 p-8"
            >
              <p className="font-playfair text-xl font-bold leading-snug text-[#4A3A42]">{lens.name}</p>
              <p className="font-poppins mt-3 text-pretty text-sm leading-relaxed text-[#6B5860]">{lens.q}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="font-poppins mx-auto mt-12 max-w-2xl text-pretty text-center text-base leading-relaxed text-[#6B5860]"
        >
          The six boundaries are not six separate business projects. They are the boundary map. The priorities are
          the action lenses that translate the map into the week.
        </motion.p>
      </div>
    </section>
  )
}
