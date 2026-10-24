"use client"

/**
 * 01 — The Pattern. The quiet slide from "I built the business" to "the business
 * became my boss." Dark, dramatic treatment; the founder's own quote anchors it.
 */
import { motion } from "framer-motion"

const SYMPTOMS = [
  "working whenever the business needs you",
  "carrying decisions the business should be able to carry",
  "responding instead of intentionally operating",
  "measuring success by how much gets done",
  "letting work consume the time you created the business to reclaim",
  "becoming the person everything depends on",
]

export function PatternSection() {
  return (
    <section id="pattern" className="w-full bg-[#2E2A3A] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7C6CE]">
            01 — The Pattern
          </span>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-white sm:text-5xl">
            You built the business.
            <span className="mt-2 block text-[#E8A0AC]">Then the business became your boss.</span>
          </h2>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="my-12 border-l-2 border-[#E8A0AC] pl-6"
        >
          <p className="font-playfair text-balance text-2xl font-bold italic leading-snug text-white sm:text-3xl">
            &ldquo;I became the employee of my own company.&rdquo;
          </p>
          <cite className="font-poppins mt-3 block text-sm font-semibold uppercase not-italic tracking-[0.16em] text-[#F7C6CE]">
            — Barbara Bamba
          </cite>
        </motion.blockquote>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-poppins text-pretty text-base leading-relaxed text-white/75">
              It happens quietly. You leave the high-stress role. You build the business. You finally have autonomy.
              And then the business begins expanding into every available space. You find yourself:
            </p>
            <ul className="mt-5 space-y-2.5">
              {SYMPTOMS.map((item) => (
                <li key={item} className="font-poppins flex items-start gap-3 text-pretty text-base leading-relaxed text-white/85">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#E8A0AC]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-poppins mt-6 text-pretty text-base leading-relaxed text-white/75">
              The business was supposed to create freedom. Instead,{" "}
              <span className="font-semibold text-white">you became responsible for keeping everything moving.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center"
          >
            <div className="rounded-3xl border border-white/12 bg-white/5 p-8 sm:p-10">
              <p className="font-playfair text-balance text-2xl font-bold leading-snug text-white sm:text-[1.7rem]">
                The problem isn&apos;t that you wanted success.
              </p>
              <p className="font-playfair mt-4 text-balance text-2xl font-bold leading-snug text-[#E8A0AC] sm:text-[1.7rem]">
                The problem is that you entered entrepreneurship without another operating lane.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
