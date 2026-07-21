"use client"

/**
 * OperatingPlanner™ — reframed as the Design Space™ for each operating segment.
 *
 * Phase: Live & Lead Today™ Design Space Migration
 *
 * The expanded dropdown now contains:
 *   1. Cherry Blossom™ Hero — a segment-specific panoramic welcome
 *   2. Design Space™ placeholder — lists the features coming to this space
 *
 * The dropdown toggle, animations, expand/collapse behaviour, glassmorphism,
 * border-radius, shadows, and spacing are all preserved from the previous version.
 * Only the body content has been replaced.
 *
 * The standalone Design My Week™ page (/design-my-week) is NOT modified here.
 */

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { BlockId } from "@/operating-engine"
import { PLANNER_CONFIG } from "@/components/operating-planner/planner-config"

interface OperatingPlannerProps {
  blockId: BlockId
}

// ---------------------------------------------------------------------------
// Cherry Blossom™ Hero — segment-specific panoramic welcome
// ---------------------------------------------------------------------------

interface SegmentHeroProps {
  title: string
  backgroundImage: string
  message: string
  atmosphere: string
}

function SegmentHero({ title, backgroundImage, message, atmosphere }: SegmentHeroProps) {
  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "420px" }}>
      {/* Panoramic background — full width of the Design Space */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />

      {/* Warm brand-tone overlay for readability */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(250,212,220,0.55) 0%, rgba(255,248,245,0.18) 45%, rgba(250,240,230,0.58) 100%)",
        }}
      />

      {/* Soft vignette so glass card pops */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.14) 100%)",
        }}
      />

      {/* Centered glass card — same premium treatment as Design My Week™ */}
      <div className="relative z-10 flex min-h-[420px] flex-col items-center justify-center px-4 py-16 sm:py-20">
        <div className="flex w-full max-w-2xl flex-col items-center gap-6">
          <div
            className="w-full rounded-3xl border border-white/60 px-8 py-10 text-center shadow-[0_8px_40px_rgba(0,0,0,0.13)] sm:px-12 sm:py-12"
            style={{ backgroundColor: "rgba(255,255,255,0.87)", backdropFilter: "blur(14px)" }}
          >
            {/* Avatar */}
            <div className="mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-[#F2A2B5] shadow-sm mx-auto shrink-0">
              <img
                src="/images/logo.png"
                alt="Cherry Blossom"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Eyebrow */}
            <p className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#C13B6B]">
              Cherry Blossom&trade;
            </p>

            {/* Title */}
            <h2 className="mb-5 font-playfair text-3xl font-bold leading-tight text-balance text-[#1C161A] sm:text-4xl">
              {title}
            </h2>

            {/* Body — rendered as clean flowing paragraphs */}
            <p className="w-full font-sans font-medium text-[15px] sm:text-[17px] leading-relaxed text-[#1C161A]/80 text-pretty text-left">
              {message}
            </p>

            {/* Atmosphere tag */}
            <p className="mt-6 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#78AD7D]">
              {atmosphere}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Design Space™ Placeholder
// ---------------------------------------------------------------------------

const DESIGN_SPACE_FEATURES = [
  "My Commitments",
  "Intention Declaration™",
  "Cherry Blossom™ Coaching",
  "Repeat After Me™",
  "Join Live™",
  "Harmony Soundscapes™",
  "Reflection",
  "Reflection Notes",
  "AI Coaching",
  "Resources",
  "Downloads",
  "Community",
  "Progress Tracking",
]

function DesignSpacePlaceholder() {
  return (
    <div className="px-6 pb-12 pt-8 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-3xl">
        {/* Section header */}
        <div className="mb-8 text-center">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#78AD7D] mb-2">
            Design Space™
          </p>
          <p className="font-serif text-base leading-relaxed text-[#4A3A42]/80 text-pretty max-w-xl mx-auto">
            This Design Space will soon become your personalized workspace for designing, installing, and
            continuously improving this part of your Work-Life Balance Business Week™.
          </p>
        </div>

        {/* Coming Soon divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#7FB069]/20" />
          <span className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#6B5860]/70 px-2">
            Coming Soon
          </span>
          <div className="flex-1 h-px bg-[#7FB069]/20" />
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {DESIGN_SPACE_FEATURES.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 rounded-xl border border-[#7FB069]/15 bg-white/60 px-4 py-3"
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0 bg-[#7FB069]/60"
                aria-hidden
              />
              <span className="font-sans text-sm font-medium text-[#4A3A42]/80">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// OperatingPlanner — main export
// ---------------------------------------------------------------------------

export function OperatingPlanner({ blockId }: OperatingPlannerProps) {
  const config = PLANNER_CONFIG[blockId]
  const [open, setOpen] = useState(true)

  if (!config) return null

  return (
    // Full-width wrapper — matches the panoramic hero image width
    <div className="relative z-10 w-full px-4 pb-[4.5rem] pt-8 sm:px-6 lg:px-8">
      <div
        className="overflow-hidden rounded-2xl shadow-ds w-full"
        style={{ backgroundColor: config.surface }}
      >
        {/* Dropdown toggle — preserved from previous version */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`operating-planner-body-${blockId}`}
          className="flex w-full items-start justify-between gap-4 px-6 pt-8 pb-6 text-left sm:px-10 sm:pt-10"
        >
          <span>
            <span className="ds-eyebrow text-brand-green-dark/70">{config.workspaceLabel}</span>
            <span className="mt-1.5 block font-display text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
              {config.title}
            </span>
            <span className="mt-2 block font-serif text-sm italic text-brand-ink-soft">
              {config.atmosphere}
            </span>
          </span>
          <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-brand-ink-soft">
            <ChevronDown
              className={`ds-icon transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
            <span className="sr-only">{open ? "Collapse workspace" : "Expand workspace"}</span>
          </span>
        </button>

        {/* Collapsible body */}
        {open && (
          <div id={`operating-planner-body-${blockId}`}>
            {/* 1. Cherry Blossom™ Hero — segment-specific panoramic welcome */}
            <SegmentHero
              title={config.title}
              backgroundImage={config.backgroundImage}
              message={config.cherryBlossomMessage}
              atmosphere={config.atmosphere}
            />

            {/* 2. Design Space™ placeholder */}
            <DesignSpacePlaceholder />
          </div>
        )}
      </div>
    </div>
  )
}

export default OperatingPlanner
