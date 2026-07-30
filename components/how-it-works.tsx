"use client"

import { motion } from "framer-motion"

const STEPS = [
  {
    number: "01",
    icon: "🌸",
    time: "7:00 – 9:00 AM",
    title: "Arrive & Prepare",
    subtitle: "Early Access Flex Time™",
    description:
      "Ease into your day on your own terms. Use this protected window to prepare your mind, your space, and your priorities before the community comes together.",
    visual: {
      label: "Flex Time™",
      detail: "Prepare & Settle In",
      accent: "#78AD7D",
    },
  },
  {
    number: "02",
    icon: "✨",
    time: "9:00 – 11:00 AM",
    title: "Set Your Intentions",
    subtitle: "Morning GIV•EN™ Routine",
    description:
      "Begin with a structured morning ritual — Gratitude, Intention, Vision, Exercise & Nourishment — to anchor your work-life values before the day's execution begins.",
    visual: {
      label: "GIV•EN™",
      detail: "Gratitude · Intention · Vision",
      accent: "#C13B6B",
    },
  },
  {
    number: "03",
    icon: "💼",
    time: "1:00 – 5:00 PM",
    title: "Do Your CEO Work",
    subtitle: "CEO Workday™",
    description:
      "Your protected four-hour execution block. Deep Work™, AI Augmentation™, strategic decisions, and delivery — in community with other founders working alongside you.",
    visual: {
      label: "CEO Workday™",
      detail: "Deep Work · Strategy · Delivery",
      accent: "#3a5c3d",
    },
  },
  {
    number: "04",
    icon: "🌿",
    time: "5:00 – 10:00 PM",
    title: "Live Your Time Freedom™",
    subtitle: "Time Freedom™",
    description:
      "Close your laptop and step fully into the life you built your business to support. Family, rest, creativity, and joy — not as a reward, but as a daily commitment.",
    visual: {
      label: "Time Freedom™",
      detail: "Life · Rest · Joy",
      accent: "#78AD7D",
    },
  },
  {
    number: "05",
    icon: "🌙",
    time: "10:00 PM – 7:00 AM",
    title: "Rest & Restore",
    subtitle: "Power Down™ & Digital Detox™",
    description:
      "End the day with intention. Power down your devices, protect your sleep, and trust that tomorrow's success is built on tonight's recovery.",
    visual: {
      label: "Power Down™",
      detail: "Unplug · Sleep · Restore",
      accent: "#4A3A52",
    },
  },
]

export function HowItWorks() {
  return (
    <section
      className="w-full py-16 sm:py-20"
      style={{ background: "linear-gradient(160deg, #FDF9F5 0%, #F5EFE4 50%, #EFF5EF 100%)" }}
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* Section header */}
        <div className="mb-14 text-center">
          <p className="mb-3 font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#78AD7D]">
            The Work-Life Balance Business Day™
          </p>
          <h2
            id="how-it-works-heading"
            className="text-balance font-playfair text-4xl font-semibold text-[#1C161A] sm:text-5xl"
          >
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-montserrat text-base leading-relaxed text-[#5A4A52]">
            A full-day co-working experience structured around work-life balance — not hustle culture. Every hour has a purpose, a boundary, and a place in the life you designed.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col"
            >
              {/* Visual card */}
              <div
                className="relative mb-4 flex min-h-[148px] flex-col items-center justify-center overflow-hidden rounded-2xl px-5 py-6 text-center"
                style={{
                  background: `linear-gradient(145deg, ${step.visual.accent}12 0%, ${step.visual.accent}22 100%)`,
                  border: `1px solid ${step.visual.accent}30`,
                }}
              >
                {/* Step number — top left */}
                <span
                  className="absolute left-3 top-3 font-montserrat text-[11px] font-bold leading-none"
                  style={{ color: step.visual.accent }}
                >
                  {step.number}
                </span>

                {/* Icon */}
                <span className="mb-2 text-3xl leading-none" aria-hidden>
                  {step.icon}
                </span>

                {/* Segment label pill */}
                <span
                  className="inline-block rounded-full px-3 py-1 font-montserrat text-[11px] font-semibold"
                  style={{
                    background: `${step.visual.accent}18`,
                    color: step.visual.accent,
                    border: `1px solid ${step.visual.accent}35`,
                  }}
                >
                  {step.visual.label}
                </span>

                {/* Detail line */}
                <p
                  className="mt-2 font-montserrat text-[10px] font-medium leading-tight"
                  style={{ color: step.visual.accent + "cc" }}
                >
                  {step.visual.detail}
                </p>

                {/* Time badge — bottom right */}
                <span className="absolute bottom-2.5 right-3 font-montserrat text-[9px] font-semibold text-[#7A6A72]/70">
                  {step.time}
                </span>
              </div>

              {/* Step copy */}
              <div className="flex flex-1 flex-col">
                <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.16em] text-[#78AD7D]">
                  {step.number} &mdash; {step.subtitle}
                </p>
                <h3 className="mt-1 font-playfair text-xl font-semibold text-[#1C161A]">
                  {step.title}
                </h3>
                <p className="mt-2 font-montserrat text-sm leading-relaxed text-[#5A4A52]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connector line (desktop only) */}
        <div className="mt-10 hidden items-center justify-center lg:flex">
          <div className="h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-[#78AD7D]/30 to-transparent" />
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="font-playfair text-lg italic text-[#5A4A52]">
            Every day is a new opportunity to live the life you designed your business to support.
          </p>
        </div>

      </div>
    </section>
  )
}
