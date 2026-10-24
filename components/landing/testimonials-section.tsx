"use client"

/** Social proof. Placeholder testimonials for Phase 1. */
import { motion } from "framer-motion"

const TESTIMONIALS = [
  {
    quote:
      "For the first time, my business runs on a rhythm that protects my family time instead of stealing it. I end the day full, not empty.",
    name: "Placeholder Member",
    role: "Founder & CEO",
  },
  {
    quote:
      "The Weekly Reality Check changed how I lead. I stopped chasing everything and started winning at the few things that matter.",
    name: "Placeholder Member",
    role: "Agency Owner",
  },
  {
    quote:
      "Cherry Blossom feels like a coach who's been with me for years. She remembers what I said last week and holds me to it.",
    name: "Placeholder Member",
    role: "Consultant",
  },
]

export function TestimonialsSection() {
  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-[#7FB069]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Loved by intentional leaders
          </span>
          <h2 className="font-playfair mt-5 text-pretty text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            More success. More life. More you.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-3xl border border-[#F2E4E8] bg-[#FDF6F3] p-8 shadow-sm"
            >
              <div className="font-playfair text-4xl leading-none text-[#E26C73]/40" aria-hidden>
                &ldquo;
              </div>
              <blockquote className="font-poppins mt-2 flex-1 text-pretty text-sm leading-relaxed text-[#5A4A52]">
                {t.quote}
              </blockquote>
              <figcaption className="font-poppins mt-6 border-t border-[#F2E4E8] pt-4">
                <span className="block text-sm font-semibold text-[#4A3A42]">{t.name}</span>
                <span className="block text-xs text-[#8A7A82]">{t.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
