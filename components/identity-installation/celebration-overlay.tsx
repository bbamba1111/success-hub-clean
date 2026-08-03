"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Heart } from "lucide-react"

export type CompletionStatus = "honored" | "partial" | "not-completed"
export type CelebrationFlow = "movement" | "sleep"

interface CelebrationOverlayProps {
  show: boolean
  status: CompletionStatus
  flow: CelebrationFlow
  onDone: () => void
  durationMs?: number
}

// Petal config — positions spread across the top
const PETALS = [
  { x: "8%",  delay: 0.0,  duration: 2.2, rotate: 15,  size: 14 },
  { x: "18%", delay: 0.15, duration: 2.5, rotate: -22, size: 12 },
  { x: "30%", delay: 0.05, duration: 2.1, rotate: 8,   size: 16 },
  { x: "42%", delay: 0.25, duration: 2.4, rotate: -10, size: 13 },
  { x: "55%", delay: 0.10, duration: 2.3, rotate: 20,  size: 15 },
  { x: "66%", delay: 0.30, duration: 2.0, rotate: -18, size: 12 },
  { x: "75%", delay: 0.08, duration: 2.6, rotate: 12,  size: 14 },
  { x: "85%", delay: 0.20, duration: 2.2, rotate: -8,  size: 13 },
  { x: "22%", delay: 0.35, duration: 2.7, rotate: 25,  size: 11 },
  { x: "60%", delay: 0.18, duration: 2.3, rotate: -15, size: 15 },
  { x: "48%", delay: 0.40, duration: 2.5, rotate: 5,   size: 12 },
  { x: "38%", delay: 0.12, duration: 2.1, rotate: -28, size: 14 },
]

const PARTIAL_PETALS = PETALS.slice(0, 5)

const MESSAGES: Record<CelebrationFlow, Record<CompletionStatus, { headline: string; body: string; badge: string }>> = {
  movement: {
    "honored": {
      headline: "Beautiful work.",
      body: "You honored the promise you made to yourself today. That is who you are becoming.",
      badge: "Daily Non-Negotiable\u2122 Honored",
    },
    "partial": {
      headline: "You showed up.",
      body: "Partial progress is still progress. Every step builds the identity you are installing.",
      badge: "Progress Counts\u2122",
    },
    "not-completed": {
      headline: "Today didn\u2019t go as planned.",
      body: "And that is okay. Compassion is part of the practice. Tomorrow is another opportunity to honor yourself.",
      badge: "",
    },
  },
  sleep: {
    "honored": {
      headline: "Rest received.",
      body: "You protected your sleep and your future self is grateful. That is powerful self-leadership.",
      badge: "Restorative Sleep\u2122 Honored",
    },
    "partial": {
      headline: "You prioritized rest.",
      body: "Even partial rest is a step toward the sleep identity you are building. It counts.",
      badge: "Progress Counts\u2122",
    },
    "not-completed": {
      headline: "Sleep is a practice.",
      body: "Tonight didn\u2019t align with the intention. That is information, not failure. Tomorrow you begin again.",
      badge: "",
    },
  },
}

// Petal SVG path — a simple 5-petal blossom shape
function BlossomPetal({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <ellipse cx="12" cy="7"  rx="3.5" ry="6" transform="rotate(0   12 12)" opacity="0.9" />
      <ellipse cx="12" cy="7"  rx="3.5" ry="6" transform="rotate(72  12 12)" opacity="0.85" />
      <ellipse cx="12" cy="7"  rx="3.5" ry="6" transform="rotate(144 12 12)" opacity="0.9" />
      <ellipse cx="12" cy="7"  rx="3.5" ry="6" transform="rotate(216 12 12)" opacity="0.85" />
      <ellipse cx="12" cy="7"  rx="3.5" ry="6" transform="rotate(288 12 12)" opacity="0.9" />
      <circle cx="12" cy="12" r="2.5" fill="#FFF0F5" />
    </svg>
  )
}

export function CelebrationOverlay({
  show,
  status,
  flow,
  onDone,
  durationMs = 2800,
}: CelebrationOverlayProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!show) return
    timerRef.current = setTimeout(() => {
      onDone()
    }, durationMs)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [show, durationMs, onDone])

  const msg = MESSAGES[flow][status]
  const petals = status === "honored" ? PETALS : status === "partial" ? PARTIAL_PETALS : []
  const petalColor = flow === "movement" ? "#E8A4B4" : "#B4C8E8"
  const accentColor = flow === "movement" ? "#78AD7D" : "#C13B6B"

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="celebration-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "rgba(253,250,245,0.92)", backdropFilter: "blur(8px)" }}
          role="dialog"
          aria-live="assertive"
          aria-label="Celebration"
        >
          {/* Petals — drift from top */}
          {petals.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: ["0vh", "55vh"],
                rotate: [0, p.rotate * 2, p.rotate * -1, p.rotate],
                x: [0, 12, -8, 4],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeIn",
                opacity: { times: [0, 0.1, 0.8, 1] },
              }}
              style={{ position: "absolute", left: p.x, top: 0, pointerEvents: "none" }}
            >
              <BlossomPetal size={p.size} color={petalColor} />
            </motion.div>
          ))}

          {/* Message card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-6 max-w-sm rounded-2xl px-8 py-8 text-center shadow-xl"
            style={{
              background: "white",
              border: `1.5px solid ${accentColor}33`,
              boxShadow: `0 8px 40px ${accentColor}18, 0 2px 8px rgba(0,0,0,0.06)`,
            }}
          >
            {/* Icon */}
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accentColor}18` }}
            >
              {status === "not-completed" ? (
                <Heart className="h-6 w-6" style={{ color: accentColor }} />
              ) : (
                <Check className="h-6 w-6" style={{ color: accentColor }} />
              )}
            </div>

            {/* Headline */}
            <p className="font-playfair text-[22px] font-semibold italic leading-tight text-[#1C161A]">
              {msg.headline}
            </p>

            {/* Body */}
            <p className="mt-3 font-montserrat text-[13px] leading-relaxed text-[#5A4A52]">
              {msg.body}
            </p>

            {/* Badge */}
            {msg.badge && (
              <div
                className="mx-auto mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5"
                style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
              >
                <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: accentColor }}>
                  {msg.badge}
                </span>
              </div>
            )}

            {/* Auto-dismiss progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-[3px] rounded-b-2xl"
              style={{ backgroundColor: accentColor }}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: durationMs / 1000, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
