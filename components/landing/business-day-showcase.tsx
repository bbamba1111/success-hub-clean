"use client"

/**
 * The signature differentiator: the full Work-Life Balance Business Day™ shown
 * as an editorial, image-led rhythm of eight phases. Content is pulled from the
 * engine's canonical SCHEDULE so the marketing site can never drift from the
 * real product.
 */
import { motion } from "framer-motion"
import { SCHEDULE } from "@/operating-engine/config/schedule"

export function BusinessDayShowcase() {
  return (
    <section id="business-day" className="relative w-full bg-[#FDF6F3] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center gap-2 rounded-full bg-[#7FB069]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            The Work-Life Balance Business Day™
          </span>
          <h2 className="font-playfair mt-5 text-pretty text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            One intentional day, designed end to end
          </h2>
          <p className="font-poppins mt-4 text-pretty text-base leading-relaxed text-[#6B5860] sm:text-lg">
            Most tools help you work more. This one helps you live well while you lead. Eight guided
            phases carry you from your first quiet moment to restorative sleep.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SCHEDULE.map((block, i) => (
            <motion.article
              key={block.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              className="group overflow-hidden rounded-3xl border border-white bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={block.backgroundImage || "/placeholder.svg"}
                  alt={block.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="font-poppins absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#4A3A42] backdrop-blur-sm">
                  <span aria-hidden>{block.emoji}</span>
                  {block.timeLabel}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-playfair text-lg font-bold leading-snug text-[#C13B6B]">
                  {block.shortTitle}
                </h3>
                <p className="font-poppins mt-2 text-sm leading-relaxed text-[#6B5860]">
                  {block.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
