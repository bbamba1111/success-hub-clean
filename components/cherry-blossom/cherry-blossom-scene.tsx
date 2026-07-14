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
 */

import React from "react"

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
    src: "/images/coming-soon-retreat-simple.png",
    overlay: "bg-gradient-to-b from-[#F5EDE8]/40 via-white/10 to-[#EDE8E0]/45",
    ariaLabel: "Women meditating in a cherry blossom garden with Japanese pagoda",
  },
} as const

export type SceneVariant = "garden" | "pond" | "executive"

interface CherryBlossomSceneProps {
  variant: SceneVariant
  children: React.ReactNode
  minHeight?: string
}

export function CherryBlossomScene({
  variant,
  children,
  minHeight = "min-h-[70vh]",
}: CherryBlossomSceneProps) {
  const scene = SCENE_CONFIG[variant]

  return (
    <section
      className={`relative isolate overflow-hidden w-full ${minHeight}`}
      aria-label={scene.ariaLabel}
    >
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

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 sm:py-20 min-h-[inherit]">
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
}

export function CherryBlossomSceneCard({
  avatarSrc = "/images/logo.png",
  title,
  children,
  time,
}: SceneCardProps) {
  return (
    <div
      className="
        w-full max-w-2xl
        rounded-3xl
        bg-white/85 backdrop-blur-md
        border border-white/60
        shadow-[0_8px_40px_rgba(0,0,0,0.13)]
        px-8 py-10 sm:px-12 sm:py-12
        flex flex-col items-center text-center
      "
    >
      {/* Avatar */}
      <div className="mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-brand-blush shadow-sm shrink-0">
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
    </div>
  )
}
