"use client"

/**
 * TimeFreedomDashboard™ — Phase 13.0
 * ---------------------------------------------------------------------------
 * Shown on Friday, Saturday, and Sunday in place of productivity panels.
 * Each day gets a distinct message and visual treatment while sharing the
 * same component shell:
 *   Friday  — Time Freedom begins. Reflection prompts + celebration.
 *   Saturday — Recovery™. Rest-forward encouragement.
 *   Sunday  — Prepare™. Week preview nudge + Design My Week™ CTA.
 */

import { motion } from "framer-motion"
import Link from "next/link"
import { useHarmonyWeek } from "./harmony-week-provider"
import { CherryBlossomDayBrief } from "./cherry-blossom-day-brief"

const DAY_HERO: Record<string, { headline: string; sub: string }> = {
  "time-freedom": {
    headline: "Time Freedom™ Has Begun.",
    sub: "You built the business so the business does not consume you. Today is proof it is working.",
  },
  recovery: {
    headline: "Recovery™ Day.",
    sub: "Rest is a strategy. What you restore today powers everything you build next week.",
  },
  prepare: {
    headline: "Design My Week™.",
    sub: "20 intentional minutes now means 5 days of clarity. The week belongs to those who design it.",
  },
}

export function TimeFreedomDashboard() {
  const theme = useHarmonyWeek()

  if (!theme || !theme.isTimeFreedom) return null

  const hero = DAY_HERO[theme.harmonyDay] ?? DAY_HERO["time-freedom"]

  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-2xl p-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${theme.accent.color}18 0%, ${theme.accent.color}08 100%)`,
            border: `1.5px solid ${theme.accent.color}30`,
          }}
        >
          <p
            className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: theme.accent.color }}
          >
            {theme.themeName} · Time Freedom™ Weekend
          </p>
          <h2 className="text-balance font-playfair text-3xl font-semibold leading-tight text-[#1C161A] sm:text-4xl">
            {hero.headline}
          </h2>
          <p className="mt-3 font-montserrat text-sm leading-relaxed text-[#6B5860] max-w-xl mx-auto">
            {hero.sub}
          </p>

          {/* Sunday CTA */}
          {theme.harmonyDay === "prepare" && (
            <div className="mt-6">
              <Link
                href="/my-harmony"
                className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-montserrat text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: theme.accent.color }}
              >
                Design My Week™
              </Link>
            </div>
          )}

          {/* Friday CTA */}
          {theme.harmonyDay === "time-freedom" && (
            <div className="mt-6">
              <p
                className="font-playfair text-lg font-medium italic"
                style={{ color: theme.accent.color }}
              >
                &ldquo;The work will be there Monday. Today, you won&apos;t be.&rdquo;
              </p>
            </div>
          )}

          {/* Saturday CTA */}
          {theme.harmonyDay === "recovery" && (
            <div className="mt-6">
              <p
                className="font-playfair text-lg font-medium italic"
                style={{ color: theme.accent.color }}
              >
                &ldquo;You cannot pour from an empty cup. Fill yours first.&rdquo;
              </p>
            </div>
          )}
        </motion.div>

        {/* Cherry Blossom guidance — day-specific */}
        <CherryBlossomDayBrief />
      </div>
    </section>
  )
}
