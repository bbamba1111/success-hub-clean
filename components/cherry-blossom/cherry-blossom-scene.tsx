"use client"

/**
 * CherryBlossomScene™
 *
 * Full-bleed photographic scene backdrops that travel with Cherry Blossom™
 * as the founder advances through onboarding. All images are local assets —
 * no external dependencies.
 *
 * Scenes:
 *   garden     — Cherry blossom garden at golden hour (/begin)
 *   pond       — Women with tea under cherry blossoms (/audit WLB)
 *   executive  — CEO at desk with cherry blossoms (/audit ESA)
 *   business-bottleneck — Golden-hour garden, koi pond & pavilion (BBA onboarding)
 */

import React from "react"
import { ChevronDown } from "lucide-react"

// ---------------------------------------------------------------------------
// Scene config — local public images
// ---------------------------------------------------------------------------

const SCENE_CONFIG = {
  garden: {
    src: "/images/business-day-hero-bg.png",
    overlay: "bg-gradient-to-b from-[#FAD4DC]/50 via-[#FFF8F5]/20 to-[#FAF0E6]/55",
    ariaLabel: "Cherry blossom garden at golden hour with bridge and reflection",
  },
  pond: {
    src: "/images/reality-check-zen-bg.png",
    overlay: "bg-gradient-to-b from-[#FAD4DC]/35 via-white/5 to-[#FFF0F2]/40",
    ariaLabel: "Zen stones and cherry blossom branch with golden light",
  },
  executive: {
    src: "/images/entrepreneur-success-assessment-bg.png",
    overlay: "bg-gradient-to-b from-[#3D2B1F]/10 via-transparent to-[#2C3E2D]/15",
    ariaLabel: "Japanese garden with cherry blossoms, pagoda, zen stones, and a wooden deck with tea and books",
  },
  "business-bottleneck": {
    src: "/images/business-bottleneck-assessment-bg.png",
    overlay: "bg-gradient-to-b from-[#3D2B1F]/10 via-transparent to-[#2C3E2D]/15",
    ariaLabel:
      "Japanese garden at golden hour with cherry blossoms, a koi pond, stone bridge, waterfall, wooden pavilion, and a deck with lounge chairs",
  },
  "ceo-office": {
    src: "/images/ceo-workday-hero-bg.png",
    overlay: "bg-gradient-to-b from-[#2C3E2D]/20 via-transparent to-[#1A2B1B]/30",
    ariaLabel: "Luxury Founder CEO office with cherry blossom view and Japanese garden",
  },
  workspace: {
    src: "/images/business-context-bg.png",
    overlay: "bg-gradient-to-b from-[#4A3728]/8 via-transparent to-[#2C3E2D]/12",
    ariaLabel: "Japanese-inspired executive workspace with panoramic zen garden view, cherry blossoms, desk with laptop, bonsai, and founder nameplate",
  },
  "design-my-week": {
    src: "/images/design-my-week-bg.png",
    overlay: "bg-gradient-to-b from-[#F5E6E0]/20 via-transparent to-[#2C3E2D]/10",
    ariaLabel: "Design My Week planner spread with cherry blossoms, candle, Harmony journal, and work-life balance weekly grid",
  },
} as const

export type SceneVariant =
  | "garden"
  | "pond"
  | "executive"
  | "business-bottleneck"
  | "ceo-office"
  | "workspace"
  | "design-my-week"

interface CherryBlossomSceneProps {
  variant: SceneVariant
  children: React.ReactNode
  minHeight?: string
  /** When true, suppresses the photographic background and overlays — renders
   *  a plain bg-brand-cream surface so the glass card floats on a clean field. */
  noBackground?: boolean
}

export function CherryBlossomScene({
  variant,
  children,
  minHeight = "min-h-[70vh]",
  noBackground = false,
}: CherryBlossomSceneProps) {
  const scene = SCENE_CONFIG[variant]

  return (
    <section
      className={`relative isolate overflow-hidden w-full ${minHeight} ${noBackground ? "bg-brand-cream" : ""}`}
      aria-label={scene.ariaLabel}
    >
      {!noBackground && (
        <>
          {/* Photographic background */}
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${scene.src}')` }}
          />

          {/* Brand-tone overlay — softens photo, ensures readability */}
          <div aria-hidden className={`absolute inset-0 ${scene.overlay}`} />

          {/* Soft vignette so glass card pops */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.15)_100%)]"
          />
        </>
      )}

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 sm:py-10 min-h-[inherit]">
        {children}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// CherryBlossomSceneCard — canonical frosted glass card.
// Fixed max-w-2xl. Same size everywhere, regardless of page position.
// ---------------------------------------------------------------------------

interface SceneCardProps {
  avatarSrc?: string
  title: string
  children: React.ReactNode
  time?: string
  /** Optional onboarding step marker (e.g. "Step 1 of 3") shown under the timing. */
  step?: string
  /** Optional animated scroll prompt displayed beneath the card. */
  scrollPrompt?: string
  /** Tailwind max-width class override. Defaults to max-w-2xl. */
  maxWidth?: string
}

export function CherryBlossomSceneCard({
  avatarSrc = "/images/logo.png",
  title,
  children,
  time,
  step,
  scrollPrompt,
  maxWidth = "max-w-2xl",
}: SceneCardProps) {
  return (
    <div className={`flex flex-col items-center gap-6 w-full ${maxWidth}`}>
    <div
      className="
        w-full
        rounded-3xl
        bg-white/70
        backdrop-blur-md
        border border-white/50
        shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        px-8 py-10 sm:px-12 sm:py-12
        flex flex-col items-center text-center
      "
    >
      {/* Avatar — clean circle, no petal ring */}
      <div className="mb-5 h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full border-2 border-brand-blush shadow-sm">
        <img src={avatarSrc} alt="Cherry Blossom" className="h-full w-full object-cover" />
      </div>

      {/* Eyebrow — always brand pink/coral */}
      <p className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.22em] text-brand-coral">
        Cherry Blossom&trade;
      </p>

      {/* Title — Playfair Display, large */}
      <h1 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight text-balance text-brand-ink mb-5">
        {title}
      </h1>

      {/* Body — Montserrat medium, upright */}
      <div className="font-sans font-medium text-[15px] sm:text-[17px] leading-relaxed text-brand-ink/80 text-pretty space-y-3 text-left w-full">
        {children}
      </div>

      {/* Time indicator */}
      {time && (
        <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-brand-coral font-sans">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {time}
        </div>
      )}

      {/* Onboarding step marker — sits directly beneath the timing */}
      {step && (
        <div className="mt-2.5 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-coral/25 bg-white/40 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-brand-ink/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-coral shrink-0" aria-hidden />
            {step}
          </span>
        </div>
      )}
    </div>

    {/* Animated scroll prompt — invites the founder to scroll into the experience */}
    {scrollPrompt && (
      <div className="flex flex-col items-center gap-2 text-white/90 select-none pointer-events-none" aria-hidden>
        <span className="font-sans text-sm font-semibold tracking-wide drop-shadow-sm">
          {scrollPrompt}
        </span>
        <ChevronDown
          className="h-6 w-6 animate-bounce opacity-80"
          strokeWidth={2.5}
        />
      </div>
    )}
    </div>
  )
}
