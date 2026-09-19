"use client"

/**
 * Meet the Guide — placed immediately AFTER the destination hero and BEFORE the
 * problem. Hierarchy: Destination → Guide → Problem.
 *
 * Layout: "You became an entrepreneur for freedom." leads as a single line,
 * then "So why are you working like this?". Barbara's portrait sits on the
 * right, its top aligned with the opening bio line ("You didn't leave a
 * high-stress way of working just to recreate it.") and its bottom ending level
 * with the CTA button, so the bio column and the image resolve together.
 */
import { motion } from "framer-motion"

export function GuideSection() {
  return (
    <section id="guide" className="w-full overflow-hidden bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Two headers — first on a single line */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B] shadow-sm">
            Meet the Guide
          </span>
          <h2 className="font-playfair mt-5 whitespace-nowrap text-balance text-2xl font-bold leading-tight text-[#4A3A42] sm:text-4xl lg:text-5xl">
            You became an entrepreneur for freedom.
          </h2>
          <h2 className="font-playfair mt-2 text-balance text-2xl font-bold leading-tight text-[#C13B6B] sm:text-4xl lg:text-5xl">
            So why are you working like this?
          </h2>
          <p className="font-poppins mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#5A7F46]">
            A Virtual Full-Day Guided Destination™
          </p>
        </motion.div>

        {/* Bio left; portrait right, top aligned to the bio's opening line, bottom ending with the button */}
        <div className="mt-12 grid items-stretch gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <p className="font-poppins text-pretty text-base leading-relaxed text-[#5A4A52]">
              You didn&apos;t leave a high-stress way of working just to recreate it. You became an entrepreneur
              because you wanted something different:
            </p>

            <ul className="mt-5 space-y-2.5">
              {["More freedom", "More time", "More autonomy", "More meaningful work", "More life"].map((item) => (
                <li
                  key={item}
                  className="font-poppins flex items-start gap-3 text-pretty text-base leading-relaxed text-[#5A4A52]"
                >
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#7FB069]" aria-hidden />
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
              enter, live, work, and lead their workweek — and Build Work-Life Balance Boundaries in Business — and
              Workplaces — as They Start, Grow &amp; Scale to Make Time For More Life &amp; Human Sustainability in the
              AI Age.
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
            className="relative min-h-[420px] overflow-hidden rounded-[2rem]"
          >
            <img
              src="/images/barbara-portrait.png"
              alt="Thought Leader Barbara Bamba, founder of Harmony Lane™"
              className="absolute inset-0 h-full w-full object-cover object-top"
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
