"use client"

/**
 * The Experience — Make Time For More™, the signature live Work-Life Balance
 * Business Day™. Shows the actual Day experiences as proof this is a real
 * operating experience, not philosophy. Includes the Decide → Design →
 * Communicate → Live sequence (Communicate My Boundary™ is a differentiator)
 * and the key experience statement.
 */
import { motion } from "framer-motion"
import {
  Clock,
  ClipboardCheck,
  PenTool,
  MessageSquareHeart,
  Sunrise,
  Activity,
  Utensils,
  Target,
  Sparkles,
  Moon,
} from "lucide-react"

const EXPERIENCES = [
  { icon: Clock, name: "Flex Time™", body: "Make room for life without sacrificing the work that matters." },
  {
    icon: ClipboardCheck,
    name: "Weekly Work-Life Balance Reality Check™",
    body: "See what is actually happening before deciding what needs to change.",
  },
  { icon: PenTool, name: "Decide & Redesign™", body: "Redesign your entry into the workweek." },
  {
    icon: MessageSquareHeart,
    name: "Communicate My Boundary™",
    body: "Turn your choices into clear communication with the people around you.",
  },
  { icon: Sunrise, name: "Morning GIV•EN™", body: "Begin intentionally." },
  { icon: Activity, name: "Movement Window™", body: "Make movement part of the business day." },
  { icon: Utensils, name: "Extended Healthy Hybrid Lunch™", body: "Nourish. Connect. Step away." },
  { icon: Target, name: "4-Hour Focused CEO Workday™", body: "Contain high-value work inside protected time." },
  { icon: Sparkles, name: "Time Freedom™", body: "Experience what happens when work has a container." },
  { icon: Moon, name: "Power Down & Unplug™", body: "End the business day instead of carrying it into the night." },
]

const SEQUENCE = ["Decide", "Design", "Communicate", "Live"]

export function ExperienceSection() {
  return (
    <section id="experience" className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="font-poppins inline-flex items-center rounded-full bg-[#C13B6B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C13B6B]">
            The Experience
          </span>
          <h2 className="font-playfair mt-5 text-balance text-4xl font-bold leading-tight text-[#4A3A42] sm:text-6xl">
            Make Time For More™
          </h2>
          <p className="font-playfair mt-3 text-pretty text-3xl font-bold italic text-[#5A7F46] sm:text-5xl">
            The Work-Life Balance Business Day™
          </p>
          <p className="font-poppins mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-[#6B5860]">
            Don&apos;t just learn about Work-Life Balance™. Experience it in real time — personalized, facilitated,
            and designed around you, inside the Harmony Lane™ environment.
          </p>
        </motion.div>

        {/* Decide → Design → Communicate → Live */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-2"
        >
          {SEQUENCE.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <span className="font-poppins rounded-full bg-[#FDF6F3] px-4 py-1.5 text-sm font-semibold text-[#C13B6B]">
                {step}
              </span>
              {i < SEQUENCE.length - 1 && <span className="text-[#E4B6C2]" aria-hidden>&rarr;</span>}
            </div>
          ))}
        </motion.div>

        <p className="font-poppins mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-[#8A7A82]">
          A boundary you decide only becomes real once the people around you understand it. That&apos;s why
          Communicate My Boundary™ turns reflection into implementation.
        </p>

        <div className="mt-14">
          <h3 className="font-playfair text-center text-2xl font-bold text-[#4A3A42] sm:text-3xl">
            Your Work-Life Balance Business Day™
          </h3>
          <p className="font-poppins mx-auto mt-3 max-w-2xl text-center text-pretty text-sm leading-relaxed text-[#6B5860]">
            A day designed around the way you actually want to live, work, and lead.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EXPERIENCES.map(({ icon: Icon, name, body }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: (i % 3) * 0.05 }}
                className="flex flex-col rounded-3xl border border-[#F2E4E8] bg-[#FDF6F3] p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Icon className="h-5 w-5 text-[#7FB069]" aria-hidden />
                </span>
                <h4 className="font-playfair mt-4 text-base font-bold leading-snug text-[#4A3A42]">{name}</h4>
                <p className="font-poppins mt-2 text-pretty text-sm leading-relaxed text-[#6B5860]">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key experience statement */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-14 max-w-3xl rounded-[2rem] bg-[#C13B6B] p-10 text-center sm:p-14"
        >
          <p className="font-playfair text-balance text-3xl font-bold leading-snug text-white sm:text-5xl">
            This isn&apos;t a day you follow.
            <span className="mt-2 block text-[#FBE0E6]">It&apos;s a day you design — and then live — in real time.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
