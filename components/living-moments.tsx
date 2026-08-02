"use client"

/**
 * LivingMoments™
 *
 * When an Operating Segment™ becomes active, this component brings the
 * panoramic hero image to life for ~5 seconds before settling into a
 * beautiful still. The effect is achieved through layered CSS transforms
 * applied via framer-motion — a slow Ken Burns drift + subtle brightness
 * breathe — so no video files are required.
 *
 * Respects prefers-reduced-motion. User preference is persisted to
 * localStorage under the key "living-moments-mode".
 */

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

// ── Types ────────────────────────────────────────────────────────────────────

export type LivingMomentsMode =
  | "motion+sound"
  | "motion"
  | "sound"
  | "still"

interface LivingMomentsProps {
  /** The block image src (e.g. /images/block-morning-given.png) */
  backgroundImage: string
  /** Current block ID — used to pick the matching ambient track */
  blockId: string
  /** Alt text for the image */
  alt?: string
  /** Extra className for the wrapper */
  className?: string
  /** Called when the 5-second awakening animation completes */
  onAwakeningComplete?: () => void
}

// ── Ambient audio map ────────────────────────────────────────────────────────
// One carefully matched ambient track per segment using free public CDN URLs.

const AMBIENT: Record<string, string> = {
  "morning-given":    "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3", // morning birds + gentle breeze
  "movement-window":  "https://cdn.pixabay.com/audio/2022/05/13/audio_8a86945ae5.mp3", // uplifting park ambience
  "lunch-break":      "https://cdn.pixabay.com/audio/2022/03/09/audio_c8a8a36e28.mp3", // café ambience
  "ceo-workday":      "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1c47.mp3", // library + keyboard
  "time-freedom":     "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3", // nature + birds
  "power-down":       "https://cdn.pixabay.com/audio/2022/03/15/audio_c4dc9f6f7b.mp3", // fireplace crackle + rain
  "digital-detox":    "https://cdn.pixabay.com/audio/2022/03/15/audio_c4dc9f6f7b.mp3", // rain + night ambience
  "monday-reality-check": "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3",
  "early-access":     "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3",
}

// ── Contextual overlay copy per segment ─────────────────────────────────────

const MOMENTS_COPY: Record<string, { headline: string; subline: string }> = {
  "morning-given":    { headline: "Begin with Presence",          subline: "Gratitude. Intention. New beginnings." },
  "movement-window":  { headline: "Move. Connect. Live.",         subline: "Movement is joyful. Movement is life." },
  "lunch-break":      { headline: "This is Living",               subline: "Not a break — a moment you chose." },
  "ceo-workday":      { headline: "Build with Purpose",           subline: "Focused. Calm. Intentional." },
  "time-freedom":     { headline: "This is What You Built For",   subline: "Protect the freedom you intentionally created." },
  "power-down":       { headline: "The Day is Complete",          subline: "Release. Rest. Restore." },
  "digital-detox":    { headline: "Rest Now",                     subline: "You have earned this stillness." },
  "monday-reality-check": { headline: "Redesign Your Week",       subline: "Make time for more. Begin here." },
}

// ── Ken Burns keyframe variants per block ────────────────────────────────────
// Each segment has a unique subtle drift direction to feel curated, not generic.

const KEN_BURNS: Record<string, { scale: number[]; x: number[]; y: number[] }> = {
  "morning-given":    { scale: [1, 1.04, 1.02], x: [0, -8, -4],  y: [0, -5, -2]  },
  "movement-window":  { scale: [1, 1.05, 1.02], x: [0, 8, 4],    y: [0, -4, -2]  },
  "lunch-break":      { scale: [1, 1.03, 1.01], x: [0, -6, -3],  y: [0, 4, 2]    },
  "ceo-workday":      { scale: [1, 1.04, 1.02], x: [0, 4, 2],    y: [0, -6, -3]  },
  "time-freedom":     { scale: [1, 1.06, 1.03], x: [0, -10, -5], y: [0, -4, -2]  },
  "power-down":       { scale: [1, 1.03, 1.01], x: [0, 3, 1],    y: [0, -3, -1]  },
  "digital-detox":    { scale: [1, 1.02, 1.01], x: [0, 2, 1],    y: [0, -2, -1]  },
}
const DEFAULT_KB = { scale: [1, 1.04, 1.02], x: [0, -6, -3], y: [0, -4, -2] }

// ── Storage key ──────────────────────────────────────────────────────────────
const PREF_KEY = "living-moments-mode"

function getStoredMode(): LivingMomentsMode {
  if (typeof window === "undefined") return "motion+sound"
  return (localStorage.getItem(PREF_KEY) as LivingMomentsMode) ?? "motion+sound"
}

// ── Component ────────────────────────────────────────────────────────────────

export function LivingMoments({
  backgroundImage,
  blockId,
  alt = "",
  className = "",
  onAwakeningComplete,
}: LivingMomentsProps) {
  const reducedMotion = useReducedMotion()
  const [mode, setMode] = useState<LivingMomentsMode>("motion+sound")
  const [awakening, setAwakening] = useState(false)
  const [showCopy, setShowCopy] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const awakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevBlockId = useRef<string>("")

  // Load saved mode once on mount
  useEffect(() => {
    setMode(getStoredMode())
  }, [])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current = null
    }
  }, [])

  const startAudio = useCallback((id: string, vol = 0.35) => {
    const url = AMBIENT[id]
    if (!url) return
    stopAudio()
    const audio = new Audio(url)
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio
    audio.play().catch(() => {/* autoplay blocked — silent fail */})
    // Fade in
    let v = 0
    const fadeIn = setInterval(() => {
      v = Math.min(v + 0.04, vol)
      if (audio) audio.volume = v
      if (v >= vol) clearInterval(fadeIn)
    }, 80)
    // Fade out after 5s
    setTimeout(() => {
      const fadeOut = setInterval(() => {
        if (!audio) { clearInterval(fadeOut); return }
        audio.volume = Math.max(0, audio.volume - 0.03)
        if (audio.volume <= 0) {
          audio.pause()
          clearInterval(fadeOut)
        }
      }, 80)
    }, 4800)
  }, [stopAudio])

  // Trigger awakening when blockId changes
  useEffect(() => {
    if (blockId === prevBlockId.current) return
    prevBlockId.current = blockId

    if (awakeTimerRef.current) clearTimeout(awakeTimerRef.current)

    const motionEnabled = !reducedMotion && (mode === "motion+sound" || mode === "motion")
    const soundEnabled = mode === "motion+sound" || mode === "sound"

    if (motionEnabled) {
      setAwakening(true)
      setShowCopy(true)
      awakeTimerRef.current = setTimeout(() => {
        setAwakening(false)
        setShowCopy(false)
        onAwakeningComplete?.()
      }, 5200)
    }

    if (soundEnabled) {
      startAudio(blockId)
    }

    return () => {
      if (awakeTimerRef.current) clearTimeout(awakeTimerRef.current)
    }
  }, [blockId, mode, reducedMotion, startAudio, onAwakeningComplete])

  // Cleanup on unmount
  useEffect(() => () => { stopAudio() }, [stopAudio])

  const kb = KEN_BURNS[blockId] ?? DEFAULT_KB
  const copy = MOMENTS_COPY[blockId]

  const saveMode = (m: LivingMomentsMode) => {
    setMode(m)
    localStorage.setItem(PREF_KEY, m)
    setSettingsOpen(false)
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Panoramic image with optional Ken Burns awakening */}
      <motion.img
        key={backgroundImage}
        src={backgroundImage || "/placeholder.svg"}
        alt={alt}
        aria-hidden="true"
        className="h-full w-full object-cover object-center"
        animate={
          awakening && !reducedMotion
            ? {
                scale: kb.scale,
                x: kb.x,
                y: kb.y,
                filter: ["brightness(1)", "brightness(1.06)", "brightness(1.02)", "brightness(1)"],
              }
            : { scale: 1, x: 0, y: 0, filter: "brightness(1)" }
        }
        transition={
          awakening
            ? { duration: 5.2, ease: [0.25, 0.1, 0.25, 1], times: [0, 0.4, 0.75, 1] }
            : { duration: 1.8, ease: "easeOut" }
        }
      />

      {/* Contextual copy overlay — fades in then out during awakening */}
      <AnimatePresence>
        {showCopy && copy && !reducedMotion && (
          <motion.div
            key="living-moments-copy"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="pointer-events-none absolute bottom-6 left-6 right-6 flex flex-col gap-1"
          >
            <span className="font-playfair text-[15px] font-semibold italic text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)] sm:text-[17px]">
              {copy.headline}
            </span>
            <span className="font-montserrat text-[11px] font-medium uppercase tracking-[0.16em] text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              {copy.subline}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings toggle — bottom right corner */}
      <div className="absolute bottom-3 right-3 z-10">
        <button
          onClick={() => setSettingsOpen(o => !o)}
          aria-label="Living Moments™ settings"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/35"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="8" cy="8" r="2.5" stroke="white" strokeWidth="1.5"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>

        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 4 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-9 right-0 w-[188px] rounded-xl bg-white/90 p-3 shadow-xl backdrop-blur-md ring-1 ring-black/[0.06]"
            >
              <p className="mb-2 font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-[#8A7880]">
                Living Moments™
              </p>
              {(
                [
                  ["motion+sound", "Motion + Ambient Sound™"],
                  ["motion",       "Motion Only™"],
                  ["sound",        "Ambient Sound Only™"],
                  ["still",        "Still Images Only™"],
                ] as [LivingMomentsMode, string][]
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => saveMode(val)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left font-montserrat text-[11px] transition ${
                    mode === val
                      ? "bg-[#7FB069]/15 font-semibold text-[#4A7C59]"
                      : "text-[#5A4A52] hover:bg-black/[0.04]"
                  }`}
                >
                  {mode === val && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7FB069]" />
                  )}
                  {mode !== val && <span className="h-1.5 w-1.5 shrink-0" />}
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
