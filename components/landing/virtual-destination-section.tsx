"use client"

/**
 * 14 — The Virtual Destination. Makes the "where" tangible: a designed digital
 * environment you enter from your laptop, today — with the physical destination
 * held as the horizon. Study-sunrise background with a frosted-glass panel.
 */
import { motion } from "framer-motion"

const TODAY = [
  "Enter from your laptop, anywhere in the world",
  "Immerse in a deliberately designed environment",
  "Move through the day in real time",
  "Work on your actual business, not a hypothetical one",
]

export function VirtualDestinationSection() {
  return (
    <section id="virtual" className="relative w-full overflow-hidden py-20 sm:py-28">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/backgrounds/study-sunrise.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#2E2A3A]/55" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl rounded-[2rem] border border-white/40 bg-white/15 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
            14 — The Virtual Destination
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-white sm:text-4xl">
            A real destination you can enter today.
          </h2>
          <p className="font-poppins mt-5 text-pretty text-base leading-relaxed text-white/85">
            Harmony Lane™ is currently a virtual destination — a designed digital environment, not a metaphor. You
            don&apos;t travel to it. You enter it. And the experience is deliberately immersive, so the boundaries
            you practice there are the boundaries you carry back.
          </p>

          <ul className="mx-auto mt-8 grid max-w-xl gap-2.5 text-left sm:grid-cols-2">
            {TODAY.map((item) => (
              <li
                key={item}
                className="font-poppins flex items-start gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm leading-relaxed text-white/90"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[#E8A0AC]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <p className="font-playfair mt-8 text-balance text-lg font-bold italic leading-snug text-[#E8A0AC] sm:text-xl">
            The virtual destination is where it begins. The way you live and work is where it lasts.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
