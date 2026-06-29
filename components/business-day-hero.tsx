"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

type StatusKey = "LIVE" | "NEXT" | "NIGHT" | "OPEN"

const STATUS_META: Record<StatusKey, { label: string; icon: string; className: string }> = {
  LIVE: { label: "LIVE NOW", icon: "🔴", className: "bg-[#E26C73] text-white" },
  NEXT: { label: "STARTING NEXT", icon: "🟢", className: "bg-[#7FB069] text-white" },
  NIGHT: { label: "CLOSED FOR THE NIGHT", icon: "🌙", className: "bg-[#2E2A3A] text-white" },
  OPEN: { label: "COMMUNITY OPEN", icon: "🌅", className: "bg-white/85 text-[#5A4A52]" },
}

type Block = { start: number; cta: string; status: StatusKey }

// Ordered schedule for the Work-Life Balance Business Day™
const SCHEDULE: Block[] = [
  { start: 7 * 60 + 30, cta: "Enter Early Access™", status: "OPEN" },
  { start: 9 * 60, cta: "Join Morning GIV•EN™", status: "LIVE" },
  { start: 10 * 60 + 45, cta: "Start Your Movement Window™", status: "LIVE" },
  { start: 11 * 60 + 30, cta: "Begin Lunch Break™", status: "OPEN" },
  { start: 13 * 60 + 15, cta: "Enter CEO Workday™", status: "LIVE" },
  { start: 18 * 60, cta: "Enjoy Time Freedom™", status: "OPEN" },
  { start: 22 * 60 + 15, cta: "Join Power Down™", status: "LIVE" },
  { start: 23 * 60 + 30, cta: "Community Closed", status: "NIGHT" },
]

function resolveStatus(now: Date) {
  const dayName = DAY_NAMES[now.getDay()]
  const minutes = now.getHours() * 60 + now.getMinutes()

  if (minutes < SCHEDULE[0].start) {
    const minutesUntilOpen = SCHEDULE[0].start - minutes
    if (minutesUntilOpen <= 30) return { dayName, status: "NEXT" as StatusKey }
    return { dayName, status: "NIGHT" as StatusKey }
  }

  let activeIndex = 0
  for (let i = 0; i < SCHEDULE.length; i++) {
    if (minutes >= SCHEDULE[i].start) activeIndex = i
  }
  const active = SCHEDULE[activeIndex]
  const next = SCHEDULE[activeIndex + 1]
  if (next && next.start - minutes <= 15) return { dayName, status: "NEXT" as StatusKey }
  return { dayName, status: active.status }
}

// ---- Personalized daily experience -------------------------------------------------

type PartOfDay = "morning" | "ceo" | "evening"

type Phase = {
  greetingPeriod: "Morning" | "Afternoon" | "Evening"
  greetingEmoji: string
  part: PartOfDay
  messages: string[]
}

// Resolve the current phase of the Work-Life Balance Business Day™ from local time (in minutes).
function resolvePhase(minutes: number): Phase {
  // 7:00–9:00 — Early Access, Flex Time™ & Preparation
  if (minutes >= 7 * 60 && minutes < 9 * 60) {
    return {
      greetingPeriod: "Morning",
      greetingEmoji: "🌸",
      part: "morning",
      messages: [
        "Today is a fresh opportunity to intentionally design your day before the world begins making demands on your time.",
        "Before the noise begins, take this quiet space to prepare your mind, your priorities, and your presence.",
      ],
    }
  }
  // 9:00–10:30 — Morning GIV•EN™ Routine
  if (minutes >= 9 * 60 && minutes < 10 * 60 + 30) {
    return {
      greetingPeriod: "Morning",
      greetingEmoji: "🌸",
      part: "morning",
      messages: [
        "Today begins with gratitude, purpose, and intention. Before leading your business, lead yourself.",
        "Align your mind, body, and spirit first. Everything you build today flows from this alignment.",
      ],
    }
  }
  // 10:30–11:00 — Movement Window™
  if (minutes >= 10 * 60 + 30 && minutes < 11 * 60) {
    return {
      greetingPeriod: "Morning",
      greetingEmoji: "🌿",
      part: "morning",
      messages: [
        "Small moments of movement create lasting energy. Care for your body so it can support your vision.",
        "Move with intention. Your body is the vehicle for everything you're here to create.",
      ],
    }
  }
  // 11:00–13:00 — Extended Healthy Hybrid Lunch Break™
  if (minutes >= 11 * 60 && minutes < 13 * 60) {
    return {
      greetingPeriod: "Afternoon",
      greetingEmoji: "🌿",
      part: "morning",
      messages: [
        "Nourishment is productive. Step into nature, reconnect, and return refreshed for meaningful work.",
        "Rest is not a reward for finishing — it's the fuel that makes great work possible.",
      ],
    }
  }
  // 13:00–17:00 — 4-Hour Focused CEO Workday™
  if (minutes >= 13 * 60 && minutes < 17 * 60) {
    return {
      greetingPeriod: "Afternoon",
      greetingEmoji: "🌿",
      part: "ceo",
      messages: [
        "Protect your focus. Every intentional decision today moves your business closer to the future you're creating.",
        "This is your protected execution window. Do the deep work only you can do.",
      ],
    }
  }
  // 17:00–22:00 — Time Freedom™
  if (minutes >= 17 * 60 && minutes < 22 * 60) {
    return {
      greetingPeriod: "Evening",
      greetingEmoji: "🌙",
      part: "evening",
      messages: [
        "You earned this time. Be fully present with the people and experiences that matter most.",
        "Enjoy the life you built your business to support. Presence is the real success.",
      ],
    }
  }
  // 22:00–23:00 — Power Down™
  if (minutes >= 22 * 60 && minutes < 23 * 60) {
    return {
      greetingPeriod: "Evening",
      greetingEmoji: "🌙",
      part: "evening",
      messages: [
        "Success also means knowing when to stop. Rest is part of tomorrow's performance.",
        "Slow your mind, reflect on today, and prepare tomorrow with intention.",
      ],
    }
  }
  // 23:00–7:00 — Unplug Digital Detox™
  return {
    greetingPeriod: "Evening",
    greetingEmoji: "🌙",
    part: "evening",
    messages: [
      "Your devices are resting. Now let your mind and body do the same.",
      "Tomorrow's success begins tonight. Give yourself the gift of restorative sleep.",
    ],
  }
}

// "Repeat After Me™" affirmation library, grouped by part of day. Rotates daily.
const AFFIRMATIONS: Record<PartOfDay, string[][]> = {
  morning: [
    ["I choose intention over reaction.", "I protect my time.", "I lead with clarity.", "I make time for more."],
    ["I begin today aligned.", "I honor my non-negotiables.", "I design my day on purpose.", "I am present."],
    ["I lead myself before I lead others.", "I move with calm and clarity.", "I create from a full cup."],
  ],
  ceo: [
    ["I focus on what matters most.", "I create value with every decision.", "I work smarter.", "I finish well."],
    ["I protect my deep work.", "I make confident decisions.", "I execute with intention.", "I deliver excellence."],
    ["I do the work only I can do.", "I trust my focus.", "I build the future with each action."],
  ],
  evening: [
    ["I release today's work.", "I welcome rest.", "Tomorrow begins with the choices I make tonight."],
    ["I am present with the people I love.", "I let go of what's unfinished.", "I rest with gratitude."],
    ["I close today on purpose.", "I quiet my mind.", "I prepare tomorrow with peace."],
  ],
}

function dayOfYear(d: Date) {
  const start = new Date(d.getFullYear(), 0, 0)
  const diff = d.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}

function scrollToRhythm() {
  const el = document.getElementById("todays-business-day")
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

function getFirstName(user: { user_metadata?: Record<string, unknown>; email?: string } | null): string {
  if (!user) return "Friend"
  const meta = user.user_metadata ?? {}
  const candidate =
    (meta.first_name as string) ||
    (meta.firstName as string) ||
    (meta.full_name as string) ||
    (meta.name as string) ||
    ""
  if (candidate.trim()) return candidate.trim().split(/\s+/)[0]
  if (user.email) return user.email.split("@")[0]
  return "Friend"
}

export function BusinessDayHero() {
  const [now, setNow] = useState<Date | null>(null)
  const [firstName, setFirstName] = useState("Friend")

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) return

    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setFirstName(getFirstName(user))
    })
  }, [])

  const resolved = useMemo(() => (now ? resolveStatus(now) : null), [now])
  const status = resolved ? STATUS_META[resolved.status] : null

  const phase = useMemo(() => (now ? resolvePhase(now.getHours() * 60 + now.getMinutes()) : null), [now])

  // Pick a message + affirmation set that stays stable for the day but rotates daily.
  const message = useMemo(() => {
    if (!now || !phase) return null
    return phase.messages[dayOfYear(now) % phase.messages.length]
  }, [now, phase])

  const affirmations = useMemo(() => {
    if (!now || !phase) return null
    const sets = AFFIRMATIONS[phase.part]
    return sets[dayOfYear(now) % sets.length]
  }, [now, phase])

  return (
    <section className="relative w-full overflow-hidden">
      {/* Static reusable hero background */}
      <div className="absolute inset-0">
        <img
          src="/images/business-day-hero-bg.png"
          alt="Serene cherry blossom lakeside workspace at sunrise"
          className="h-full w-full object-cover"
        />
        {/* Soft left-weighted wash so the glass panel reads clearly */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,241,245,0.6) 0%, rgba(255,241,245,0.22) 40%, rgba(255,241,245,0) 62%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl items-center px-6 py-16 sm:min-h-[600px] lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-2xl rounded-3xl border border-white/40 bg-white/25 p-8 shadow-xl backdrop-blur-md sm:p-10"
        >
          {/* Dynamic day + status row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-[#5A4A52]">
              <span aria-hidden>🌸</span>
              {resolved ? `Today is ${resolved.dayName}` : "Today"}
            </span>
            {status && (
              <motion.span
                key={status.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] shadow-sm ${status.className}`}
              >
                <span aria-hidden>{status.icon}</span>
                {status.label}
              </motion.span>
            )}
          </div>

          <h1 className="text-pretty text-4xl font-bold leading-tight text-[#C13B6B] sm:text-5xl">
            Join Today&apos;s{" "}
            <span className="text-[#7FB069]">Work-Life Balance Business Day™</span>
          </h1>

          <p className="mt-4 text-lg font-semibold text-[#5A4A52]">
            Live Intentionally. Work Smarter. Lead Successfully.
          </p>

          {/* Personalized greeting + dynamic motivational message */}
          {phase && (
            <motion.div
              key={`${phase.greetingPeriod}-${message}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5"
            >
              <p className="text-xl font-bold text-[#C13B6B] sm:text-2xl">
                Good {phase.greetingPeriod}, {firstName} <span aria-hidden>{phase.greetingEmoji}</span>
              </p>
              <p className="mt-2 text-base leading-relaxed text-[#6B5860]">{message}</p>
            </motion.div>
          )}

          {/* Repeat After Me™ affirmation card — rotates daily */}
          {affirmations && (
            <motion.div
              key={affirmations.join("|")}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 rounded-2xl border border-[#7FB069]/30 bg-white/55 p-5 backdrop-blur-sm"
            >
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#5A7F46]">
                <span aria-hidden>🌸</span>
                Repeat After Me™
              </p>
              <ul className="mt-3 space-y-1.5">
                {affirmations.map((line) => (
                  <li key={line} className="text-pretty text-base font-medium italic leading-relaxed text-[#4A3A42]">
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* One primary CTA */}
          <div className="mt-8">
            <Button
              size="lg"
              onClick={scrollToRhythm}
              className="bg-[#E26C73] px-8 text-base font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
            >
              Enter Today&apos;s Business Day™
            </Button>
          </div>

          {/* Scroll indicator */}
          <motion.button
            type="button"
            onClick={scrollToRhythm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{ delay: 0.4, y: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#5A7F46] hover:text-[#4A6B38]"
          >
            <span aria-hidden>↓</span>
            Continue Into Today&apos;s Rhythm
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
