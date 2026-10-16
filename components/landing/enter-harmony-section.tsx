"use client"

/**
 * 06 — Enter Harmony Lane™. Makes the virtual nature explicit and introduces the
 * built-in circadian rhythm: as time changes, the experience changes, and each
 * transition presents a new time-and-space boundary. Garden background with a
 * frosted-glass copy panel.
 */
import { motion } from "framer-motion"

const RITUAL = ["Customize it", "Personalize it", "Honor it", "Step into it"]

export function EnterHarmonySection() {
  return (
    <section id="enter-lane" className="relative w-full overflow-hidden py-20 sm:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/backgrounds/garden-scene.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#FDF6F3]/72" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl rounded-[2rem] border border-white/60 bg-white/45 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            06 — Enter Harmony Lane™
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
            You don&apos;t have to figure out the Lane before you arrive.
            <span className="mt-2 block text-[#C13B6B]">
              It&apos;s the Desired Work-Lifestyle Destination™ you come to experience.
            </span>
          </h2>
          <p className="font-poppins mt-6 text-pretty text-base leading-relaxed text-[#5A4A52]">
            Harmony Lane™ is currently a virtual destination. You enter from your laptop. You immerse yourself in a
            deliberately designed environment. You experience the day in real time — examining your actual
            business, working with your actual time, and encountering actual boundaries.
          </p>
          <p className="font-playfair mt-6 text-balance text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
            Experience Work-Life Balance — in real time.
          </p>
          <p className="font-poppins mt-3 text-pretty text-base leading-relaxed text-[#6B5860]">
            You don&apos;t simply learn about work-life balance. You experience it as the day unfolds.
          </p>
        </motion.div>

        {/* The built-in rhythm */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-[#7FB069]/25 bg-white/85 p-8 text-center shadow-xl backdrop-blur-md sm:p-10"
        >
          <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#5A7F46]">
            The built-in rhythm
          </p>
          <h3 className="font-playfair mt-4 text-balance text-2xl font-bold leading-snug text-[#4A3A42] sm:text-3xl">
            The Work-Life Balance Business Day™ has a built-in circadian rhythm.
          </h3>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#5A4A52]">
            As time changes throughout the day, the experience changes. Each transition presents a new
            time-and-space boundary. You don&apos;t simply follow a rigid schedule — you learn to ask:
          </p>
          <p className="font-playfair mt-5 text-balance text-lg font-bold italic leading-snug text-[#C13B6B] sm:text-xl">
            What does this boundary need to look like for me?
          </p>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {RITUAL.map((item) => (
              <li
                key={item}
                className="font-poppins rounded-full border border-[#7FB069]/30 bg-white px-4 py-2 text-sm font-semibold text-[#5A7F46]"
              >
                {item}
              </li>
            ))}
          </ul>

          <p className="font-poppins mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#8A7A82]">
            And decide whether you&apos;ll <span className="text-[#C13B6B]">Live · Work · or Lead</span> inside that
            boundary.
          </p>
          <p className="font-playfair mt-6 text-balance text-xl font-bold leading-snug text-[#4A3A42] sm:text-2xl">
            The day itself becomes the teacher.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
