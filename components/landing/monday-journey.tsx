"use client"

/**
 * MondayJourney — "Why Monday" plus the On-Ramp / Monday distinction.
 *
 * Positions Monday as the signature reset point (designed to interrupt
 * Sunday-Night Attrition™) and clarifies the sequence WITHOUT clock times and
 * WITHOUT a sales transition: you complete your On-Ramp onboarding first, and
 * then — on Monday — the live Business Day begins. The On-Ramp is never framed
 * as a separate product to buy.
 */
import { motion } from "framer-motion"

const OLD_CYCLE = ["Last week ends", "Sunday anxiety", "Monday reaction", "Overload", "Repeat"]
const NEW_CYCLE = ["Awareness", "Redesign", "Intentional entry", "Lived experience"]

export function MondayJourney() {
  return (
    <section id="monday" className="w-full bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-poppins inline-flex items-center rounded-full bg-[#E26C73]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            Why Monday
          </span>
          <h2 className="font-playfair mt-5 text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-5xl">
            Monday is the reset point.
          </h2>
          <p className="font-poppins mt-4 text-pretty text-lg leading-relaxed text-[#6B5860]">
            The Work-Life Balance Business Day™ begins on Monday because Monday is where the week is either
            reclaimed or surrendered. Make Time For More™ is designed to interrupt Sunday-Night Attrition™ — the
            quiet tendency to abandon your intended boundaries before the workweek even begins.
          </p>
        </div>

        {/* Old cycle vs new cycle */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col rounded-3xl border border-[#E2D6DA] bg-[#F7F1F3] p-8">
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-[#8A7A82]">The old loop</p>
            <ol className="mt-5 flex-1 space-y-3">
              {OLD_CYCLE.map((step) => (
                <li key={step} className="font-poppins flex items-center gap-3 text-sm text-[#6B5860]">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#B9A6AD]" aria-hidden />
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col rounded-3xl border border-[#7FB069]/30 bg-[#F6FAF2] p-8">
            <p className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-[#5A7F46]">
              The Monday reset
            </p>
            <ol className="mt-5 flex-1 space-y-3">
              {NEW_CYCLE.map((step) => (
                <li key={step} className="font-poppins flex items-center gap-3 text-sm font-medium text-[#3F5E30]">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#7FB069]" aria-hidden />
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* On-Ramp vs Monday */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h3 className="font-playfair text-center text-2xl font-bold text-[#4A3A42]">
            Before the Day — and the Day itself
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-[#F2E4E8] bg-[#FDF6F3] p-7"
            >
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#E26C73]">
                Before the Day
              </p>
              <h4 className="font-playfair mt-2 text-xl font-bold text-[#4A3A42]">Your Harmony Lane™ On-Ramp</h4>
              <p className="font-poppins mt-3 text-sm leading-relaxed text-[#6B5860]">
                After you join, you settle into Harmony Lane™ and complete your On-Ramp — your Founder Profile™,
                Business Context Profile™, and Work-Life Balance Time-Leak Check™. It prepares you for the
                experience and is included, never a separate purchase.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl border border-[#C13B6B]/25 bg-white p-7 shadow-sm"
            >
              <p className="font-poppins text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">Monday</p>
              <h4 className="font-playfair mt-2 text-xl font-bold text-[#4A3A42]">The Business Day begins</h4>
              <p className="font-poppins mt-3 text-sm leading-relaxed text-[#6B5860]">
                On Monday the live experience opens with Flex Time™, moves into your Weekly Work-Life Balance
                Reality Check™, then Redesign Your Entry Into The Workweek™, then Morning GIV•EN™ — and carries
                you through the full rhythm of the day.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
