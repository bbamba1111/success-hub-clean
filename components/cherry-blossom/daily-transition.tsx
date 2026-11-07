"use client"

/**
 * DailyTransition™ — Passage of Time™
 * ---------------------------------------------------------------------------
 * Full-screen cinematic overlay that fires between Operating Segments™.
 *
 * Flow:
 *  1. Current content drifts forward + blurs out (700ms)
 *  2. Full-screen transition displays: cherry blossoms, quote, segment labels
 *  3. After 2.8s the overlay dissolves and the next segment is visible
 *
 * Design: calm, elegant, Apple Vision Pro–inspired.
 * Never flashy. Never a slide deck.
 */

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

// ── Contextual quotes per destination segment ────────────────────────────────

const SEGMENT_QUOTES: Record<string, string[]> = {
  "morning-given": [
    "The way you begin your morning becomes the life you remember.",
    "Before you lead your business, lead yourself.",
    "Gratitude is the foundation every great day is built upon.",
    "How you start is how you proceed. Begin with intention.",
  ],
  "movement-window": [
    "Small promises kept become extraordinary lives.",
    "Your body is the vehicle for everything you are here to create.",
    "Move with intention. Energy is not found — it is generated.",
    "A founder who honors their body honors their vision.",
  ],
  "lunch-break": [
    "Rest is not a reward for finishing. It is the fuel that makes great work possible.",
    "Nourishment is productive. Presence is the real success.",
    "Protect what matters before the world decides for you.",
    "The best ideas arrive when you allow your mind to breathe.",
  ],
  "ceo-workday": [
    "Protect what matters before the world decides for you.",
    "Deep work is the superpower of the intentional founder.",
    "Focus is a decision. Make it daily.",
    "Your most important work deserves your most protected time.",
  ],
  "time-freedom": [
    "You built this business to support your life — now live it.",
    "Presence with the people you love is the real measure of success.",
    "The best investment you will ever make is in the moments you are fully there.",
    "You earned this time. Be completely present in it.",
  ],
  "power-down": [
    "Success also means knowing when to stop.",
    "Tomorrow begins tonight. Rest is preparation.",
    "Slow your mind. You did good work today.",
    "Recovery is not weakness. It is wisdom.",
  ],
  "digital-detox": [
    "Your devices are resting. Now let your mind do the same.",
    "Tomorrow's success begins tonight.",
    "Great founders protect their sleep as fiercely as their strategy.",
    "In stillness, tomorrow is born.",
  ],
  "monday-reality-check": [
    "Before you manage your business, manage your life.",
    "Every Monday is a fresh opportunity to redesign your week.",
    "How you enter your week shapes everything that follows.",
  ],
  "early-access": [
    "Before the noise begins, this quiet space belongs entirely to you.",
    "Clarity before chaos. Intention before action.",
    "Prepare your mind, your priorities, and your presence.",
  ],
}

function getQuote(segmentId: string): string {
  const pool = SEGMENT_QUOTES[segmentId] ?? [
    "Every Operating Segment™ is a unique opportunity to intentionally create your day.",
    "Time is your most valuable asset. Honor it.",
  ]
  // Progressive: pick based on day-of-week (0–6) so quote rotates through the week
  const idx = new Date().getDay() % pool.length
  return pool[idx]
}

// ── Cherry blossom petal SVG path ────────────────────────────────────────────

function Petal({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={style}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, Math.random() > 0.5 ? 60 : -60],
        rotate: [0, 360 + Math.random() * 360],
        opacity: [0, 0.85, 0.85, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        ease: "easeIn",
        delay: Math.random() * 1.8,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
    >
      <svg width="18" height="22" viewBox="0 0 18 22" fill="none" aria-hidden>
        <ellipse cx="9" cy="11" rx="7" ry="10" fill="#E8A0B4" fillOpacity="0.75" />
        <ellipse cx="9" cy="11" rx="4" ry="7" fill="#F2C4D0" fillOpacity="0.5" />
      </svg>
    </motion.div>
  )
}

// Generate stable petal configs outside the component (no re-randomise on each render)
const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 5.3) % 90}%`,
  top: `${-8 + (i * 3.7) % 15}%`,
}))

// ── Props ────────────────────────────────────────────────────────────────────

export interface DailyTransitionProps {
  /** The segment the member just completed. */
  fromSegment: { id: string; shortTitle: string }
  /** The segment they are entering. */
  toSegment: { id: string; shortTitle: string }
  /** Called when the transition finishes and the next segment should appear. */
  onComplete: () => void
}

// ── Component ────────────────────────────────────────────────────────────────

export function DailyTransition({ fromSegment, toSegment, onComplete }: DailyTransitionProps) {
  const quote = getQuote(toSegment.id)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  // Auto-dismiss after the hold period
  useEffect(() => {
    const timer = setTimeout(() => onCompleteRef.current(), 3400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      key="daily-transition"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #FDF6F0 0%, #FBF0F4 35%, #EFF5EE 65%, #F5EFF8 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      aria-live="polite"
      aria-label="Transitioning to next segment"
    >
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, #F2C4D0 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #C8DEC4 0%, transparent 70%)" }}
      />

      {/* Cherry blossom petals */}
      {PETALS.map((p) => (
        <Petal key={p.id} style={{ left: p.left, top: p.top }} />
      ))}

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-lg">

        {/* Cherry Blossom avatar + name */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
        >
          <span className="relative inline-flex h-12 w-12 overflow-hidden rounded-full border border-[#E8A0B4]/40 shadow-md">
            <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
          </span>
          <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-[#C06080]">
            Cherry Blossom™
          </span>
        </motion.div>

        {/* Inspirational quote */}
        <motion.blockquote
          className="font-playfair text-[22px] sm:text-[26px] font-medium leading-snug text-[#2E2028] text-balance"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>

        {/* Segment progression label */}
        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center gap-0.5 font-montserrat">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A7880]">
              You&apos;ve completed
            </span>
            <span className="text-[15px] font-bold text-[#5A4A52]">
              {fromSegment.shortTitle}
            </span>
          </div>

          {/* Arrow */}
          <motion.div
            className="my-1 h-6 w-px bg-gradient-to-b from-[#E8A0B4] to-[#7FB069]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />

          <div className="flex flex-col items-center gap-0.5 font-montserrat">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A7880]">
              Now entering
            </span>
            <span className="text-[16px] font-bold text-[#4A7C59]">
              {toSegment.shortTitle}
            </span>
          </div>
        </motion.div>

        {/* Tap-to-skip */}
        <motion.button
          type="button"
          onClick={() => onCompleteRef.current()}
          className="mt-2 font-montserrat text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A7880]/70 transition-opacity hover:opacity-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          aria-label="Skip transition"
        >
          tap to continue
        </motion.button>
      </div>
    </motion.div>
  )
}
