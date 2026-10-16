"use client"

/**
 * The Missing Question — the emotional and strategic pivot of the page.
 * Successful founders are asked where they're taking the company; they are
 * rarely asked what they want that success to make possible. This section
 * names the white space, then hands off to Founder Destination™.
 */
import { motion } from "framer-motion"

const DIMENSIONS = [
  "Not just for the business.",
  "For the founder.",
  "For your time.",
  "For your life.",
  "For the people you lead.",
  "For the workplace you're creating.",
  "For the future of work.",
]

export function MissingQuestionSection() {
  return (
    <section id="missing" className="w-full bg-[#4A3A42] py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-poppins text-xs font-bold uppercase tracking-[0.24em] text-[#E4B6C2]">
            The Missing Question
          </span>
          <p className="font-poppins mx-auto mt-8 max-w-xl text-pretty text-base leading-relaxed text-[#D8C7CE] sm:text-lg">
            You&apos;ve learned how to build. You&apos;ve learned how to lead. You&apos;ve learned how to make money.
          </p>
          <h2 className="font-playfair mt-6 text-balance text-4xl font-bold leading-[1.1] text-white sm:text-6xl">
            But what do you want your success to{" "}
            <span className="italic text-[#F0A9BE]">make possible?</span>
          </h2>
        </motion.div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-1"
        >
          {DIMENSIONS.map((line, i) => (
            <motion.li
              key={line}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className={`font-playfair text-pretty leading-snug ${
                i === 0
                  ? "text-lg text-[#B7A6AE] sm:text-xl"
                  : "text-2xl font-semibold text-[#FBE0E6] sm:text-3xl"
              }`}
            >
              {line}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
