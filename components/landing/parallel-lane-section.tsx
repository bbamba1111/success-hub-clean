"use client"

/**
 * ParallelLaneSection — the brand story and the three core ideas.
 *
 * Answers "why does this exist?" and "who is it for?" before any product
 * detail: the founder who changed the career but not the conditions. Then it
 * plants the three proprietary ideas the rest of the page builds on. No
 * pricing, no schedule, no clock times.
 */
import { motion } from "framer-motion"

const CORE_IDEAS = [
  {
    tag: "The Parallel Lane",
    title: "Harmony Lane™",
    line: "The parallel lane to hustle entrepreneurship™.",
    body:
      "For people who left — or are leaving — hustle entrepreneurship in search of Work-Life Balance™, Time Freedom™, and sustainable success. Still ambitious. Just no longer at the cost of the life the business was meant to make possible.",
  },
  {
    tag: "The Reconnection",
    title: "Reconnect To Your Original Entrepreneurial Intentions™",
    line: "Remember why you started.",
    body:
      "Reconnect with the reason you built the business in the first place — and the life you intended it to create. Not a smaller business. A truer one.",
  },
  {
    tag: "The Principle",
    title: "Contain Work So Life Has Space To Expand™",
    line: "Structure work around human capacity.",
    body:
      "Work organized around sustainability instead of exhaustion. In the AI Age, leverage can grow without the workday growing with it — which makes the human capacity question matter more, not less.",
  },
]

export function ParallelLaneSection() {
  return (
    <section id="parallel-lane" className="w-full bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Brand story */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#7FB069]/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A7F46]">
            Why Harmony Lane™ Exists
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            You changed the career.
            <span className="block text-[#C13B6B]">You may not have changed the conditions.</span>
          </h2>
          <p className="font-poppins mt-5 text-pretty text-lg leading-relaxed text-[#6B5860]">
            Most founders left something stressful to build something freer — then quietly rebuilt the same
            overwork inside their own business. Harmony Lane™ is the parallel lane: a place to pursue real
            ambition inside boundaries designed to protect your capacity, your relationships, your health, and
            your life.
          </p>
        </div>

        {/* Three core ideas */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {CORE_IDEAS.map((idea, i) => (
            <motion.article
              key={idea.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-3xl border border-[#F2E4E8] bg-[#FDF6F3] p-8"
            >
              <span className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#E26C73]">
                {idea.tag}
              </span>
              <h3 className="font-playfair mt-3 text-xl font-bold leading-snug text-[#4A3A42] text-balance">
                {idea.title}
              </h3>
              <p className="font-playfair mt-2 text-base italic text-[#5A7F46]">{idea.line}</p>
              <p className="font-poppins mt-4 text-sm leading-relaxed text-[#6B5860]">{idea.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
