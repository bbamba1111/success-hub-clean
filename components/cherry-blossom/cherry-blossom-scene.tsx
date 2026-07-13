"use client"

/**
 * CherryBlossomScene™
 *
 * Full-bleed photographic scene backdrops that travel with Cherry Blossom™
 * as the founder advances through onboarding. Each scene is a distinct
 * real-world environment — the setting changes, Cherry Blossom's glass
 * card remains a consistent, beautiful presence.
 *
 * Scenes:
 *   garden      — Cherry blossom garden with torii gate at dawn (used on /begin)
 *   pond        — Serene Japanese koi pond with lanterns (used on /audit WLB)
 *   executive   — Japanese executive study / shoji screens (used on /audit ESA)
 */

import React from "react"

// ---------------------------------------------------------------------------
// Photo backgrounds — high-quality Unsplash images, each with brand overlay
// ---------------------------------------------------------------------------

const SCENE_CONFIG = {
  garden: {
    // Cherry blossom / torii gate at Fushimi Inari
    url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&q=85&auto=format&fit=crop",
    // Warm pink-to-green overlay matching brand palette
    overlay: "bg-gradient-to-b from-[#FAD4DC]/60 via-[#FAF3EE]/30 to-[#EEF5EE]/50",
    ariaLabel: "Cherry blossom garden with torii gate at dawn",
  },
  pond: {
    // Japanese garden with stone lanterns and water
    url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=85&auto=format&fit=crop",
    // Soft green-teal overlay
    overlay: "bg-gradient-to-b from-[#D4EAE0]/55 via-[#EEF5EE]/25 to-[#D4E8D4]/45",
    ariaLabel: "Serene Japanese koi pond garden with stone lanterns",
  },
  executive: {
    // Japanese interior / tea house or executive study
    url: "https://images.unsplash.com/photo-1540587659271-5a67e8db4ce4?w=1920&q=85&auto=format&fit=crop",
    // Warm parchment overlay
    overlay: "bg-gradient-to-b from-[#FAF0E6]/65 via-[#F5EDE4]/30 to-[#EDE4D8]/50",
    ariaLabel: "Japanese executive study with shoji screens and cherry blossom view",
  },
} as const

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export type SceneVariant = "garden" | "pond" | "executive"

interface CherryBlossomSceneProps {
  variant: SceneVariant
  children: React.ReactNode
  /** Minimum height of the scene panel — defaults to 70vh */
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
        style={{ backgroundImage: `url('${scene.url}')` }}
      />

      {/* Brand-tone colour overlay — softens the photo, ensures legibility */}
      <div aria-hidden className={`absolute inset-0 ${scene.overlay}`} />

      {/* Subtle vignette so glass card always stands out */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.18)_100%)]"
      />

      {/* Content layer — always centered, consistent padding */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 sm:py-20 min-h-[inherit]">
        {children}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// CherryBlossomSceneCard — the frosted glass card Cherry Blossom appears in.
// This is the single canonical glass panel used inside every scene.
// Fixed width so she always looks the same regardless of page position.
// ---------------------------------------------------------------------------

interface SceneCardProps {
  /** Avatar image src — defaults to the brand logo */
  avatarSrc?: string
  /** Card title (large) */
  title: string
  /** Cherry Blossom's message — can include <strong> and <em> for emphasis */
  children: React.ReactNode
  /** Optional time indicator, e.g. "5 mins" */
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
        bg-white/82 backdrop-blur-md
        border border-white/60
        shadow-[0_8px_40px_rgba(0,0,0,0.14)]
        px-8 py-10 sm:px-12 sm:py-12
        flex flex-col items-center text-center
      "
    >
      {/* Avatar */}
      <div className="mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-brand-blush shadow-sm">
        <img src={avatarSrc} alt="Cherry Blossom" className="h-full w-full object-cover" />
      </div>

      {/* Eyebrow — always brand pink */}
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-brand-coral">
        Cherry Blossom&trade;
      </p>

      {/* Title — Playfair Display */}
      <h1 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight text-balance text-brand-ink mb-5">
        {title}
      </h1>

      {/* Body — Montserrat Medium, upright, selectively emboldened/italicised */}
      <div className="font-sans font-medium text-base sm:text-[17px] leading-relaxed text-brand-ink/80 text-pretty space-y-3 text-left w-full">
        {children}
      </div>

      {/* Time indicator */}
      {time && (
        <div className="mt-7 flex items-center gap-2 text-sm font-medium text-brand-coral">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {time}
        </div>
      )}
    </div>
  )
}
