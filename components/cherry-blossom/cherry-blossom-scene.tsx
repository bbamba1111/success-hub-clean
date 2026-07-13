"use client"

/**
 * CherryBlossomScene™
 *
 * A full-bleed illustrated scene that travels with Cherry Blossom™ as the
 * user advances through the onboarding journey. Each scene variant paints a
 * distinct environment — the setting changes, the presence of Cherry Blossom
 * in her frosted glass card remains constant.
 *
 * Scenes:
 *   garden    — Cherry blossom garden with torii gate (used on /begin)
 *   pond      — Koi pond with stone lanterns (used on /audit for WLB)
 *   executive — Japanese executive study with shoji screens (used on ESA)
 */

import React from "react"

// ---------------------------------------------------------------------------
// Floating petal animation
// ---------------------------------------------------------------------------

function Petal({ delay, left, duration }: { delay: number; left: number; duration: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0"
      style={{
        left: `${left}%`,
        animation: `petalFall ${duration}s ${delay}s linear infinite`,
        opacity: 0,
      }}
    >
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
        <ellipse cx="5" cy="6" rx="4" ry="5.5" fill="#F6C4CE" fillOpacity="0.72" transform="rotate(-20 5 6)" />
      </svg>
    </div>
  )
}

const PETALS = [
  { delay: 0,   left: 8,  duration: 7  },
  { delay: 1.2, left: 18, duration: 9  },
  { delay: 0.5, left: 30, duration: 8  },
  { delay: 2.1, left: 42, duration: 7.5},
  { delay: 0.8, left: 55, duration: 8.5},
  { delay: 1.7, left: 66, duration: 6.5},
  { delay: 0.3, left: 76, duration: 9.5},
  { delay: 2.4, left: 86, duration: 7  },
  { delay: 1.0, left: 93, duration: 8  },
]

// ---------------------------------------------------------------------------
// Scene backgrounds (pure CSS/SVG — no external images)
// ---------------------------------------------------------------------------

/** Scene 1 — Cherry blossom garden, torii gate */
function GardenScene() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Sky gradient — soft dawn pink → pale jade */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDEEF2] via-[#FAF3EE] to-[#EEF5EE]" />

      {/* Distant mountains */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0,320 L0,200 Q180,100 360,180 Q540,260 720,140 Q900,20 1080,120 Q1260,220 1440,160 L1440,320Z"
          fill="#D4E8D4" fillOpacity="0.45" />
        <path d="M0,320 L0,240 Q240,160 480,210 Q720,260 960,190 Q1200,120 1440,200 L1440,320Z"
          fill="#5B835F" fillOpacity="0.18" />
      </svg>

      {/* Ground / garden floor */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#C8DFC8]/50 to-transparent" />

      {/* Torii gate — left center */}
      <svg className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 sm:w-64 md:w-80"
        viewBox="0 0 200 220" fill="none">
        {/* Columns */}
        <rect x="28" y="60" width="14" height="160" rx="3" fill="#E26C73" fillOpacity="0.82" />
        <rect x="158" y="60" width="14" height="160" rx="3" fill="#E26C73" fillOpacity="0.82" />
        {/* Top crossbeam (kasagi) — curved */}
        <path d="M10,52 Q100,20 190,52" stroke="#E26C73" strokeWidth="13" strokeLinecap="round" strokeOpacity="0.82" fill="none"/>
        {/* Second beam (nuki) */}
        <rect x="24" y="80" width="152" height="10" rx="3" fill="#E26C73" fillOpacity="0.70" />
        {/* Accent caps */}
        <rect x="22" y="55" width="20" height="8" rx="2" fill="#C13B6B" fillOpacity="0.70" />
        <rect x="158" y="55" width="20" height="8" rx="2" fill="#C13B6B" fillOpacity="0.70" />
      </svg>

      {/* Cherry blossom trees */}
      {/* Left tree */}
      <svg className="absolute bottom-16 left-4 sm:left-12 w-40 sm:w-56 opacity-80" viewBox="0 0 160 260" fill="none">
        <rect x="72" y="140" width="16" height="120" rx="4" fill="#8B6355" />
        {/* Branches */}
        <line x1="80" y1="160" x2="30" y2="100" stroke="#8B6355" strokeWidth="5" strokeLinecap="round"/>
        <line x1="80" y1="140" x2="130" y2="80" stroke="#8B6355" strokeWidth="5" strokeLinecap="round"/>
        <line x1="80" y1="150" x2="60" y2="70" stroke="#8B6355" strokeWidth="4" strokeLinecap="round"/>
        {/* Blossom clouds */}
        <ellipse cx="30"  cy="88"  rx="32" ry="24" fill="#F6C4CE" fillOpacity="0.75"/>
        <ellipse cx="60"  cy="60"  rx="28" ry="20" fill="#F6B4C4" fillOpacity="0.70"/>
        <ellipse cx="130" cy="68"  rx="30" ry="22" fill="#F6C4CE" fillOpacity="0.72"/>
        <ellipse cx="90"  cy="45"  rx="24" ry="18" fill="#FADADD" fillOpacity="0.65"/>
        {/* Mini blossoms */}
        <ellipse cx="20"  cy="76"  rx="10" ry="8"  fill="#F9D0DB" fillOpacity="0.8"/>
        <ellipse cx="140" cy="55"  rx="10" ry="8"  fill="#F9D0DB" fillOpacity="0.8"/>
        <ellipse cx="50"  cy="40"  rx="10" ry="8"  fill="#F9D0DB" fillOpacity="0.8"/>
      </svg>

      {/* Right tree */}
      <svg className="absolute bottom-16 right-4 sm:right-12 w-40 sm:w-56 opacity-80" viewBox="0 0 160 260" fill="none">
        <rect x="72" y="150" width="16" height="110" rx="4" fill="#8B6355" />
        <line x1="80" y1="170" x2="25" y2="110" stroke="#8B6355" strokeWidth="5" strokeLinecap="round"/>
        <line x1="80" y1="155" x2="135" y2="90" stroke="#8B6355" strokeWidth="5" strokeLinecap="round"/>
        <ellipse cx="25"  cy="98"  rx="30" ry="22" fill="#F6C4CE" fillOpacity="0.73"/>
        <ellipse cx="135" cy="78"  rx="28" ry="20" fill="#F6B4C4" fillOpacity="0.70"/>
        <ellipse cx="80"  cy="60"  rx="32" ry="24" fill="#F6C4CE" fillOpacity="0.72"/>
        <ellipse cx="110" cy="44"  rx="22" ry="16" fill="#FADADD" fillOpacity="0.65"/>
      </svg>

      {/* Stepping stones path */}
      <svg className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64" viewBox="0 0 200 60" fill="none">
        <ellipse cx="100" cy="50" rx="28" ry="8" fill="#C8DFC8" fillOpacity="0.6"/>
        <ellipse cx="72"  cy="36" rx="22" ry="6" fill="#C8DFC8" fillOpacity="0.5"/>
        <ellipse cx="128" cy="28" rx="22" ry="6" fill="#C8DFC8" fillOpacity="0.5"/>
      </svg>
    </div>
  )
}

/** Scene 2 — Koi pond with stone lanterns */
function PondScene() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Sky — misty morning green-blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E8F4F0] via-[#EEF5F2] to-[#D4E8D8]" />

      {/* Distant forest line */}
      <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,120 Q180,40 360,80 Q540,120 720,50 Q900,0 1080,60 Q1260,120 1440,70 L1440,0 L0,0Z"
          fill="#5B835F" fillOpacity="0.22"/>
      </svg>

      {/* Koi pond — ellipse water */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-4/5 max-w-lg">
        <svg viewBox="0 0 400 140" fill="none" className="w-full">
          {/* Water body */}
          <ellipse cx="200" cy="80" rx="195" ry="55" fill="#5B835F" fillOpacity="0.18"/>
          <ellipse cx="200" cy="80" rx="195" ry="55" fill="none" stroke="#5B835F" strokeWidth="1.5" strokeOpacity="0.30"/>
          {/* Water shimmer lines */}
          <line x1="80" y1="75" x2="140" y2="80" stroke="white" strokeWidth="1" strokeOpacity="0.35"/>
          <line x1="200" y1="65" x2="280" y2="72" stroke="white" strokeWidth="1" strokeOpacity="0.28"/>
          <line x1="120" y1="90" x2="180" y2="88" stroke="white" strokeWidth="0.8" strokeOpacity="0.25"/>
          {/* Koi fish */}
          <ellipse cx="140" cy="80" rx="22" ry="8" fill="#E26C73" fillOpacity="0.70" transform="rotate(-15 140 80)"/>
          <ellipse cx="260" cy="85" rx="18" ry="7" fill="#F9D0A0" fillOpacity="0.65" transform="rotate(10 260 85)"/>
          <ellipse cx="200" cy="72" rx="16" ry="6" fill="#E26C73" fillOpacity="0.55" transform="rotate(5 200 72)"/>
          {/* Lily pads */}
          <ellipse cx="100" cy="88" rx="14" ry="7" fill="#5B835F" fillOpacity="0.45"/>
          <ellipse cx="310" cy="82" rx="12" ry="6" fill="#5B835F" fillOpacity="0.40"/>
          <ellipse cx="220" cy="100" rx="10" ry="5" fill="#5B835F" fillOpacity="0.38"/>
          {/* Small lotus */}
          <ellipse cx="100" cy="86" rx="5" ry="3" fill="#F6C4CE" fillOpacity="0.85"/>
        </svg>
      </div>

      {/* Stone lanterns */}
      {/* Left lantern */}
      <svg className="absolute bottom-14 left-[12%] sm:left-[18%] w-12 sm:w-16 opacity-75" viewBox="0 0 50 100" fill="none">
        <rect x="18" y="0"  width="14" height="6"  rx="2" fill="#888"/>
        <rect x="14" y="6"  width="22" height="3"  rx="1" fill="#999"/>
        <rect x="12" y="9"  width="26" height="36" rx="3" fill="#AAA"/>
        {/* Light glow */}
        <rect x="14" y="11" width="22" height="32" rx="2" fill="#FFF8E7" fillOpacity="0.55"/>
        <rect x="10" y="45" width="30" height="4"  rx="1" fill="#999"/>
        <rect x="20" y="49" width="10" height="28" rx="2" fill="#888"/>
        <rect x="14" y="77" width="22" height="6"  rx="2" fill="#888"/>
      </svg>

      {/* Right lantern */}
      <svg className="absolute bottom-14 right-[12%] sm:right-[18%] w-12 sm:w-16 opacity-75" viewBox="0 0 50 100" fill="none">
        <rect x="18" y="0"  width="14" height="6"  rx="2" fill="#888"/>
        <rect x="14" y="6"  width="22" height="3"  rx="1" fill="#999"/>
        <rect x="12" y="9"  width="26" height="36" rx="3" fill="#AAA"/>
        <rect x="14" y="11" width="22" height="32" rx="2" fill="#FFF8E7" fillOpacity="0.55"/>
        <rect x="10" y="45" width="30" height="4"  rx="1" fill="#999"/>
        <rect x="20" y="49" width="10" height="28" rx="2" fill="#888"/>
        <rect x="14" y="77" width="22" height="6"  rx="2" fill="#888"/>
      </svg>

      {/* Cherry blossom tree — right */}
      <svg className="absolute bottom-20 right-0 w-48 sm:w-64 opacity-70" viewBox="0 0 160 260" fill="none">
        <rect x="72" y="160" width="14" height="100" rx="4" fill="#8B6355" />
        <line x1="79" y1="175" x2="20" y2="100" stroke="#8B6355" strokeWidth="4" strokeLinecap="round"/>
        <line x1="79" y1="160" x2="140" y2="85" stroke="#8B6355" strokeWidth="4" strokeLinecap="round"/>
        <ellipse cx="22"  cy="90"  rx="28" ry="20" fill="#F6C4CE" fillOpacity="0.72"/>
        <ellipse cx="140" cy="75"  rx="26" ry="19" fill="#F6B4C4" fillOpacity="0.68"/>
        <ellipse cx="80"  cy="55"  rx="30" ry="22" fill="#F6C4CE" fillOpacity="0.70"/>
        <ellipse cx="50"  cy="68"  rx="22" ry="16" fill="#FADADD" fillOpacity="0.62"/>
      </svg>

      {/* Ground strip */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#C8DFC8]/40 to-transparent" />
    </div>
  )
}

/** Scene 3 — Japanese executive study / shoji screens */
function ExecutiveScene() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Interior warm wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FAF3EE] via-[#F5EDE4] to-[#EDE4D8]" />

      {/* Shoji screen — far wall (grid of rectangles) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* Shoji frame */}
        <rect x="0" y="0" width="1440" height="600" fill="#FAF3EE" fillOpacity="0.0"/>
        {/* Left shoji panel */}
        {[0,1,2,3].map(col => [0,1,2,3,4].map(row => (
          <rect key={`l${col}${row}`}
            x={60 + col * 90} y={20 + row * 114}
            width={82} height={106}
            rx="2"
            stroke="#C8B89A" strokeWidth="1.2" strokeOpacity="0.55"
            fill="#FFF8F0" fillOpacity="0.28"
          />
        )))}
        {/* Right shoji panel */}
        {[0,1,2,3].map(col => [0,1,2,3,4].map(row => (
          <rect key={`r${col}${row}`}
            x={1080 + col * 90} y={20 + row * 114}
            width={82} height={106}
            rx="2"
            stroke="#C8B89A" strokeWidth="1.2" strokeOpacity="0.55"
            fill="#FFF8F0" fillOpacity="0.28"
          />
        )))}
        {/* Center window — cherry blossom view through glass */}
        <rect x="480" y="0" width="480" height="600" fill="#EEF5EE" fillOpacity="0.22"/>
        {/* Cherry blossom branch through window */}
        <path d="M480,400 Q600,280 700,180 Q750,130 820,80" stroke="#8B6355" strokeWidth="6" strokeLinecap="round" fill="none" strokeOpacity="0.55"/>
        <path d="M700,180 Q740,140 780,130" stroke="#8B6355" strokeWidth="4" strokeLinecap="round" fill="none" strokeOpacity="0.45"/>
        <path d="M600,280 Q560,250 550,210" stroke="#8B6355" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.40"/>
        {/* Blossoms on branch */}
        {[
          [580,270,18],[620,245,14],[660,215,16],[700,182,18],[730,160,14],[760,140,16],[790,120,12],
          [558,215,10],[545,198,10],[580,250,10],[650,232,10]
        ].map(([cx,cy,r],i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r as number * 0.85}
            fill="#F6C4CE" fillOpacity="0.70"/>
        ))}
        {/* Lacquered desk silhouette at bottom center */}
        <rect x="560" y="520" width="320" height="80" rx="8" fill="#5B3A2A" fillOpacity="0.22"/>
        <rect x="580" y="510" width="280" height="14" rx="4" fill="#7A4B30" fillOpacity="0.20"/>
        {/* Tea cup on desk */}
        <ellipse cx="760" cy="522" rx="16" ry="8" fill="#8B6355" fillOpacity="0.30"/>
        <rect x="748" y="510" width="24" height="14" rx="3" fill="#8B6355" fillOpacity="0.25"/>
      </svg>

      {/* Floor shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#C8A878]/25 to-transparent"/>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export type SceneVariant = "garden" | "pond" | "executive"

interface CherryBlossomSceneProps {
  variant: SceneVariant
  children: React.ReactNode
  /** Minimum height of the scene panel — defaults to "min-h-[72vh]" */
  minHeight?: string
}

export function CherryBlossomScene({ variant, children, minHeight = "min-h-[72vh]" }: CherryBlossomSceneProps) {
  const SceneBg = variant === "garden" ? GardenScene : variant === "pond" ? PondScene : ExecutiveScene

  return (
    <>
      {/* Keyframe injection — only once via CSS-in-JS pattern */}
      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0;    }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0;    }
        }
      `}</style>

      <section
        className={`relative isolate overflow-hidden w-full ${minHeight}`}
        aria-label={
          variant === "garden" ? "Cherry blossom garden scene"
          : variant === "pond"  ? "Koi pond garden scene"
          : "Japanese executive study scene"
        }
      >
        {/* Illustrated scene background */}
        <SceneBg />

        {/* Falling petals overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PETALS.map((p, i) => <Petal key={i} {...p} />)}
        </div>

        {/* Content layer — CB glass card + whatever content is passed */}
        <div className="relative z-10 flex flex-col items-center justify-start px-4 py-16 sm:py-20">
          {children}
        </div>
      </section>
    </>
  )
}
