"use client"

/**
 * 09 & 10 — Build It & Install It. The two moves that turn a felt experience
 * into a business that can actually hold it: build the boundary into the day,
 * then install it into how the business operates. Dark plum treatment to mark
 * the operational turn.
 */
import { motion } from "framer-motion"

const BUILD = [
  "Where does the business currently overrun this boundary?",
  "What has to be true for the boundary to hold?",
  "What does the day need to look like to protect it?",
]

const INSTALL = [
  "What decisions currently require me that shouldn't?",
  "What has to change so the business can honor this boundary without me enforcing it?",
  "What system, role, or rhythm makes the boundary structural?",
]

export function BuildInstallSection() {
  return (
    <section id="install" className="w-full bg-[#4A3A42] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#F7C6CE]">
            09 &amp; 10 — Build It &amp; Install It
          </span>
          <h2 className="font-playfair mt-6 text-balance text-3xl font-bold leading-tight text-white sm:text-5xl">
            Experiencing it is the beginning.
            <span className="mt-2 block text-[#E8A0AC]">Building and installing it is the point.</span>
          </h2>
          <p className="font-poppins mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/75">
            A boundary you only feel in a virtual space evaporates the moment the business asks for more. So Harmony
            Lane™ moves in two deliberate steps — first into your day, then into the business itself.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-white/12 bg-white/5 p-8 sm:p-10"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#F7C6CE]">09 — Build It</p>
            <h3 className="font-playfair mt-4 text-2xl font-bold leading-snug text-white sm:text-3xl">
              Build the boundary into your day.
            </h3>
            <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-white/75">
              Take what you experienced and make it real in your actual day — customized to your business, honored
              when the moment arrives, lived in real time.
            </p>
            <ul className="mt-6 space-y-3">
              {BUILD.map((q) => (
                <li key={q} className="font-poppins flex items-start gap-3 text-pretty text-sm leading-relaxed text-white/85">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#E8A0AC]" aria-hidden />
                  {q}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-[2rem] border border-[#7FB069]/30 bg-[#5A7F46]/20 p-8 shadow-xl sm:p-10"
          >
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#CDE6B8]">10 — Install It</p>
            <h3 className="font-playfair mt-4 text-2xl font-bold leading-snug text-white sm:text-3xl">
              Install the boundary into the business.
            </h3>
            <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-white/80">
              Translate what works into how the business operates — so the boundary becomes structural, not
              something you have to keep enforcing by willpower.
            </p>
            <ul className="mt-6 space-y-3">
              {INSTALL.map((q) => (
                <li key={q} className="font-poppins flex items-start gap-3 text-pretty text-sm leading-relaxed text-white/90">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#CDE6B8]" aria-hidden />
                  {q}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="font-playfair mx-auto mt-12 max-w-2xl text-balance text-center text-xl font-bold leading-snug text-white sm:text-2xl"
        >
          When the boundary lives in the business — not just in you — the freedom finally stops depending on you.
        </motion.p>
      </div>
    </section>
  )
}
