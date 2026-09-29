"use client"

/**
 * CherryBlossomDayBrief™ — Phase 13.0
 * ---------------------------------------------------------------------------
 * Day-adaptive Cherry Blossom guidance panel. Reads the current HarmonyDay
 * theme and renders Cherry Blossom's day-specific guidance as an animated
 * list. On Time Freedom™ days (Fri–Sun) the panel shifts to a warmer,
 * rest-oriented visual treatment.
 */

import { motion } from "framer-motion"
import { useHarmonyWeek } from "./harmony-week-provider"

export function CherryBlossomDayBrief() {
  const theme = useHarmonyWeek()

  if (!theme) return null

  const isTimeFreedom = theme.isTimeFreedom

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="rounded-2xl border border-black/[0.07] bg-white p-7 shadow-sm"
      style={{ borderTopColor: theme.accent.color, borderTopWidth: 3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: theme.accent.color + "22" }}
          aria-hidden
        >
          <span style={{ color: theme.accent.color }}>
            {isTimeFreedom ? "🌿" : "🌸"}
          </span>
        </div>
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]">
            Cherry Blossom™ · {theme.themeName}
          </p>
          <p className="mt-0.5 font-playfair text-lg font-semibold leading-snug text-[#1C161A]">
            {theme.tagline}
          </p>
        </div>
      </div>

      {/* Guidance list */}
      <ul className="space-y-2.5">
        {theme.cherryBlossomGuidance.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.08 + i * 0.05, ease: "easeOut" }}
            className="flex items-start gap-2.5"
          >
            <span
              className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: theme.accent.color }}
              aria-hidden
            />
            <span className="font-montserrat text-sm leading-relaxed text-[#3A2E33]">
              {item}
            </span>
          </motion.li>
        ))}
      </ul>

      {/* Time Freedom reflection prompts (Friday only) */}
      {isTimeFreedom && theme.reflectionPrompts && (
        <div className="mt-6 rounded-xl border border-black/[0.06] bg-[#FBF7F0] p-5">
          <p
            className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
            style={{ color: theme.accent.color }}
          >
            Time Freedom™ Reflection
          </p>
          <ul className="space-y-2">
            {theme.reflectionPrompts.map((prompt, i) => (
              <li key={i} className="font-playfair text-sm font-medium italic leading-relaxed text-[#4A3A42]">
                {prompt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Philosophy footer */}
      <p className="mt-5 font-montserrat text-xs leading-relaxed text-[#6B5860] border-t border-black/[0.05] pt-4">
        {theme.philosophy}
      </p>
    </motion.div>
  )
}
