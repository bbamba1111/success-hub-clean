"use client"

/**
 * Meet the Guide — placed immediately AFTER the destination hero and BEFORE the
 * problem. Hierarchy: Destination → Guide → Problem. Barbara is the architect
 * and guide of Harmony Lane™, not the destination itself.
 *
 * Layout: the two headers lead the section on separate lines, then Barbara's
 * portrait sits on the right — flush with the bottom of the section — beside
 * her bio on the left.
 */
import { motion } from "framer-motion"

export function GuideSection() {
  return (
    <section id="guide" className="w-full overflow-hidden bg-[#FDF6F3] pt-20 sm:pt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Two headers, stacked on separate lines */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B] shadow-sm">
            Meet the Guide
          </span>
          <h2 className="font-playfair mt-5 max-w-4xl text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            You became an entrepreneur for freedom.
          </h2>
          <h2 className="font-playfair mt-2 max-w-4xl text-balance text-3xl font-bold leading-tight text-[#C13B6B] sm:text-5xl">
            So why are you working like this?
          </h2>
          <p className="font-poppins mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#5A7F46]">
            A Virtual Full-Day Guided Destination™
          </p>
        </motion.div>

        {/* Bio on the left, portrait flush to the bottom of the section on the right */}
        <div className="mt-12 grid items-end gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="pb-20 sm:pb-28"
          >
            <p className="font-poppins text-pretty text-base leading-relaxed text-[#5A4A52]">
              You didn&apos;t leave a high-stress way of working just to recreate it. You became an entrepreneur
              because you wanted something different.
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {["More freedom", "More time", "More autonomy", "More meaningful work", "More life"].map((item) => (
                <li
                  key={item}
                  className="font-poppins rounded-full border border-[#7FB069]/25 bg-white px-3.5 py-1.5 text-sm font-medium text-[#5A7F46]"
                >
                  {item}
                </li>
              ))}
            </ul>

            <p className="font-poppins mt-6 text-pretty text-base leading-relaxed text-[#5A4A52]">
              But somewhere between starting, growing, and scaling, the business can begin demanding the very things
              you thought you were leaving behind.
            </p>

            <p className="font-playfair mt-6 text-pretty text-lg font-bold italic leading-snug text-[#4A3A42]">
              Barbara Bamba created Harmony Lane™ to explore what becomes possible when founders redesign how they
              enter, live, work, and lead their workweek — and build the business around the human who created it.
            </p>

            <a
              href="#offer"
              className="font-poppins mt-8 inline-flex items-center justify-center rounded-full bg-[#E26C73] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#E26C73]/25 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              Enter Harmony Lane™
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative self-end"
          >
            <img
              src="/images/barbara-portrait.png"
              alt="Thought Leader Barbara Bamba, founder of Harmony Lane™"
              className="h-auto w-full object-cover object-top"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#7FB069]/25 bg-white px-6 py-2.5 shadow-lg">
              <p className="font-poppins text-xs font-semibold uppercase tracking-[0.16em] text-[#5A7F46]">
                Thought Leader Barbara
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
