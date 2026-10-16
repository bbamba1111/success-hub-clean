"use client"

/**
 * 03 — The Original Intention. Reconnects the founder to the human intention
 * underneath the business plan, then makes the internal shift: stop looking only
 * outward at competitors; look inward at what the business was built to make
 * possible. Blush base with a cream "internal shift" panel.
 */
import { motion } from "framer-motion"

const DIDNT_WANT = [
  "constant urgency",
  "lack of autonomy",
  "a rigid schedule",
  "inability to control your time",
  "work consuming your life",
  "success defined only by productivity",
  "someone else deciding what your life had to look like",
]

const DID_WANT = [
  "More freedom",
  "More time",
  "More autonomy",
  "More creativity",
  "More family",
  "More meaningful work",
  "More financial independence",
  "More impact",
]

export function OriginalIntentionSection() {
  return (
    <section id="intention" className="w-full bg-[#FFF1F5] py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B] shadow-sm">
            03 — The Original Intention
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            You knew what you didn&apos;t want.
            <span className="mt-2 block text-[#C13B6B]">Do you still remember what you wanted?</span>
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
              You didn&apos;t want
            </p>
            <ul className="mt-5 space-y-2.5">
              {DIDNT_WANT.map((item) => (
                <li key={item} className="font-poppins flex items-start gap-3 text-pretty text-base leading-relaxed text-[#6B5860]">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#8A7A82]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-3xl border border-[#C13B6B]/25 bg-white p-8 shadow-lg"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
              And underneath, you did want
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {DID_WANT.map((item) => (
                <li
                  key={item}
                  className="font-poppins rounded-full border border-[#C13B6B]/20 bg-[#FFF1F5] px-3.5 py-1.5 text-sm font-semibold text-[#C13B6B]"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-playfair mt-6 text-pretty text-lg font-bold italic leading-snug text-[#4A3A42]">
              A different way to live and work.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-14 max-w-3xl text-center"
        >
          <h3 className="font-playfair text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-4xl">
            That was your Original Entrepreneurial Intention™.
          </h3>
          <p className="font-poppins mt-5 text-pretty text-base leading-relaxed text-[#5A4A52]">
            It was the human intention underneath the business plan — before the revenue model, before the growth
            strategy, before the team, before the systems. There was a human being who wanted entrepreneurship to
            make something different possible. But somewhere between starting, growing, and scaling, the business
            can begin operating according to what <span className="italic">it needs</span> rather than what you
            originally intended it to make possible.
          </p>
        </motion.div>

        {/* The internal shift */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-14 max-w-4xl rounded-[2rem] border border-[#7FB069]/20 bg-[#FDF6F3] p-8 sm:p-12"
        >
          <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
            The internal shift
          </p>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <p className="font-playfair text-xl font-bold leading-snug text-[#6B5860]">Stop looking only outward.</p>
              <p className="font-poppins mt-3 text-pretty text-sm leading-relaxed text-[#6B5860]">
                Stop measuring the business primarily against competitors. Stop asking only: What are they doing?
                How fast are they growing? What should I be doing next?
              </p>
            </div>
            <div>
              <p className="font-playfair text-xl font-bold leading-snug text-[#5A7F46]">Begin looking inward.</p>
              <p className="font-poppins mt-3 text-pretty text-sm leading-relaxed text-[#5A4A52]">
                What did I build this business to make possible? What do I value? What does success mean here? What
                does this business need to become so it can support the human who created it?
              </p>
            </div>
          </div>

          <p className="font-playfair mt-10 text-balance text-2xl font-bold leading-snug text-[#C13B6B] sm:text-3xl">
            Harmony Lane™ reconnects the business to the human intention that created it.
          </p>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#5A4A52]">
            Because if the business is going to create the life you built it for, your values and Original
            Entrepreneurial Intentions™ cannot remain outside the business.{" "}
            <span className="font-semibold text-[#4A3A42]">They have to become part of how the business operates.</span>
          </p>
          <p className="font-playfair mt-8 text-balance text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
            You are not merely a founder. You are a human being who built a business to make something possible —
            and the business should be designed with that human being in mind.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
