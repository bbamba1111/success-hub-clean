"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

const STEPS = [
  {
    verb: "Prepare",
    name: "Flex Time™",
    time: "7:00–9:00 AM",
    icon: "🌸",
    accent: "#78AD7D",
    copy: "Ease into your morning. Prepare your mind, workspace, and priorities before the community comes together.",
  },
  {
    verb: "Align",
    name: "Morning GIV•EN™",
    time: "9:00–10:30 AM",
    icon: "✨",
    accent: "#C13B6B",
    copy: "Tap into the spiritual side of success so your day begins from alignment — not reaction.",
  },
  {
    verb: "Move",
    name: "Movement Window™",
    time: "10:30–11:00 AM",
    icon: "💪",
    accent: "#78AD7D",
    copy: "Boost energy, reduce stress, and reset your body through intentional movement.",
  },
  {
    verb: "Nourish",
    name: "Healthy Hybrid Lunch™",
    time: "11:00 AM–1:00 PM",
    icon: "🥗",
    accent: "#B07D4A",
    copy: "Step away from the screen. Nourish your body, connect, and recharge before your focused CEO hours.",
  },
  {
    verb: "Execute",
    name: "CEO Workday™",
    time: "1:00–5:00 PM",
    icon: "💼",
    accent: "#3a5c3d",
    copy: "Complete your highest-value work using Deep Work™, AI Augmentation™, and intentional time boundaries.",
  },
  {
    verb: "Live",
    name: "Time Freedom™",
    time: "5:00–10:00 PM",
    icon: "🌿",
    accent: "#78AD7D",
    copy: "Step fully into the life your business was built to support.",
  },
  {
    verb: "Release",
    name: "Power Down™",
    time: "10:00–11:00 PM",
    icon: "🌅",
    accent: "#C13B6B",
    copy: "Celebrate today's progress, release unfinished work, and close your Business Day™ with peace of mind.",
  },
  {
    verb: "Restore",
    name: "Digital Detox™",
    time: "11:00 PM–7:00 AM",
    icon: "🌙",
    accent: "#4A3A52",
    copy: "Disconnect from technology and enjoy eight hours of restorative sleep so tomorrow begins with clarity.",
  },
]

export function HowItWorks() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section
      className="w-full overflow-hidden py-14"
      style={{ background: "linear-gradient(180deg, #FDF9F5 0%, #F7F2EA 100%)" }}
      aria-label="The Work-Life Balance Business Day™ — daily rhythm"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* Eyebrow only — no large heading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center font-montserrat text-[11px] font-bold uppercase tracking-[0.26em] text-[#78AD7D]"
        >
          The Work-Life Balance Business Day™
        </motion.p>

        {/* ── Horizontal scrolling timeline ── */}
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="relative flex min-w-max items-start gap-0">

            {STEPS.map((step, i) => (
              <div key={step.name} className="flex items-start">

                {/* Step node */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="group flex w-[168px] flex-col items-center px-2 lg:w-[190px]"
                >
                  {/* Icon circle */}
                  <div
                    className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${step.accent}14`,
                      border: `1.5px solid ${step.accent}40`,
                      boxShadow: `0 2px 16px ${step.accent}18`,
                    }}
                  >
                    <span className="text-2xl leading-none" aria-hidden>{step.icon}</span>
                    {/* Dot on timeline */}
                    <span
                      className="absolute -bottom-[29px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
                      style={{ background: step.accent }}
                      aria-hidden
                    />
                  </div>

                  {/* Copy block */}
                  <div className="mt-8 flex flex-col items-center text-center">
                    {/* Verb */}
                    <p
                      className="font-montserrat text-[11px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: step.accent }}
                    >
                      {step.verb}
                    </p>

                    {/* Experience name */}
                    <p className="mt-0.5 font-playfair text-base font-semibold leading-snug text-[#1C161A]">
                      {step.name}
                    </p>

                    {/* Time */}
                    <p className="mt-1 font-montserrat text-[10px] font-medium text-[#7A6A72]">
                      {step.time}
                    </p>

                    {/* Supporting sentence */}
                    <p className="mt-2.5 font-montserrat text-[11px] leading-relaxed text-[#5A4A52]">
                      {step.copy}
                    </p>
                  </div>
                </motion.div>

                {/* Connector line — between steps, not after last */}
                {i < STEPS.length - 1 && (
                  <div
                    className="mt-8 h-px w-8 shrink-0 self-start"
                    style={{
                      background: `linear-gradient(90deg, ${step.accent}50, ${STEPS[i + 1].accent}50)`,
                      marginTop: "31px", // aligns with center of icon (h-16/2 + mb-4 = 40px top, dot is 4px below)
                    }}
                    aria-hidden
                  />
                )}
              </div>
            ))}

          </div>

          {/* Full-width connector line sits under all dots */}
          <div className="pointer-events-none relative -mt-[1px] px-[84px] lg:px-[95px]">
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, #78AD7D40, #C13B6B30, #78AD7D40, #B07D4A30, #3a5c3d40, #78AD7D40, #C13B6B30, #4A3A5230)",
              }}
              aria-hidden
            />
          </div>
        </div>

        {/* Mobile scroll hint */}
        <p className="mt-4 text-center font-montserrat text-[10px] uppercase tracking-[0.18em] text-[#C8B89A] sm:hidden">
          Swipe to explore the full day
        </p>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center font-playfair text-base italic text-[#7A6A72]"
        >
          Every day is a new opportunity to live the life you designed your business to support.
        </motion.p>

      </div>
    </section>
  )
}
