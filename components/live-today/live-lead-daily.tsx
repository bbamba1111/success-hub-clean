"use client"

/**
 * LiveLeadDaily™ — The execution layer of the Founder Operating System™.
 *
 * Organizes the day into its natural rhythm:
 *   Morning GIV•EN™ Routine → Workout Window™ → Healthy Hybrid Lunch™ →
 *   4-Hour CEO Workday™ → Daily Time Freedom™ → Nighttime Non-Negotiable SOPs™
 *
 * Then closes with a Weekly Rhythm Reminder™.
 *
 * MVP: Each expanded SOP shows only:
 *   1. Join Us Live™ CTA
 *   2. Music section
 *   3. About This Segment dropdown
 */

import Link from "next/link"
import { ArrowRight, Sun, Dumbbell, Salad, Briefcase, Sunset, Moon, Calendar, BarChart3, ChevronDown, Radio, Music2, VolumeX } from "lucide-react"
import { useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface RhythmBlock {
  id: string
  time: string
  days: string
  icon: React.ReactNode
  eyebrow: string
  title: string
  subtitle?: string
  description: string
  items?: { label: string; body: string }[]
  cta?: { label: string; href: string }
  accent: "green" | "coral" | "ink" | "gold"
}

// ─── Accent palette map ───────────────────────────────────────────────────────

const ACCENT: Record<RhythmBlock["accent"], {
  border: string
  bg: string
  badge: string
  badgeText: string
  icon: string
  cta: string
  ctaHover: string
  eyebrow: string
  itemDot: string
}> = {
  green: {
    border: "border-[#5B835F]/20",
    bg: "bg-gradient-to-br from-[#F4F9F4] to-white",
    badge: "bg-[#5B835F]/10 border-[#5B835F]/20",
    badgeText: "text-[#3a5c3d]",
    icon: "text-[#5B835F]",
    cta: "bg-[#5B835F] text-white",
    ctaHover: "hover:bg-[#3a5c3d]",
    eyebrow: "text-[#5B835F]",
    itemDot: "bg-[#5B835F]",
  },
  coral: {
    border: "border-[#E26C73]/20",
    bg: "bg-gradient-to-br from-[#FEF5F5] to-white",
    badge: "bg-[#E26C73]/10 border-[#E26C73]/20",
    badgeText: "text-[#c04d54]",
    icon: "text-[#E26C73]",
    cta: "bg-[#E26C73] text-white",
    ctaHover: "hover:bg-[#c04d54]",
    eyebrow: "text-[#E26C73]",
    itemDot: "bg-[#E26C73]",
  },
  ink: {
    border: "border-[#1A1A2E]/15",
    bg: "bg-gradient-to-br from-[#F7F7FA] to-white",
    badge: "bg-[#1A1A2E]/8 border-[#1A1A2E]/15",
    badgeText: "text-[#1A1A2E]",
    icon: "text-[#1A1A2E]",
    cta: "bg-[#1A1A2E] text-white",
    ctaHover: "hover:bg-[#2d2d45]",
    eyebrow: "text-[#1A1A2E]/60",
    itemDot: "bg-[#1A1A2E]",
  },
  gold: {
    border: "border-[#C9A84C]/25",
    bg: "bg-gradient-to-br from-[#FDF8EC] to-white",
    badge: "bg-[#C9A84C]/12 border-[#C9A84C]/25",
    badgeText: "text-[#8B6914]",
    icon: "text-[#C9A84C]",
    cta: "bg-[#C9A84C] text-white",
    ctaHover: "hover:bg-[#8B6914]",
    eyebrow: "text-[#C9A84C]",
    itemDot: "bg-[#C9A84C]",
  },
}

// ─── Rhythm data ──────────────────────────────────────────────────────────────

const GIVEN_STEPS = [
  {
    letter: "G",
    word: "Gratitude",
    body: "Begin your day with gratitude. Acknowledge what is good, what is working, and what you are grateful for before you lead anything else.",
  },
  {
    letter: "I",
    word: "Invite Your Creator",
    body: "Invite God into your day. Seek wisdom, guidance, peace, clarity, and direction before beginning work.",
  },
  {
    letter: "V",
    word: "Visualization",
    body: "See your desired work-life and business outcomes before they happen. Your mind leads your day.",
  },
  {
    letter: "E",
    word: "Emotional Embodiment",
    body: "Feel today as if your desired outcomes have already been achieved. Lead from confidence, peace, joy, and purpose.",
  },
  {
    letter: "N",
    word: "Nurture",
    body: "Honor your Daily Non-Negotiables™ by caring for your mind, body, spirit, energy, and relationships.",
  },
]

const BLOCKS: RhythmBlock[] = [
  {
    id: "workout",
    time: "Before 9 AM",
    days: "Monday – Thursday",
    icon: <Dumbbell className="h-6 w-6" />,
    eyebrow: "Workout Window™",
    title: "Move Your Body",
    subtitle: "Increase Energy. Support Executive Performance.",
    description:
      "Physical movement is not a luxury — it is a non-negotiable executive practice. Your workout window prepares your mind and body for high-level CEO work.",
    items: [
      { label: "Energy", body: "Physical movement elevates energy for the entire business day." },
      { label: "Executive Performance", body: "Regular movement improves focus, decision quality, and stress resilience." },
      { label: "Non-Negotiable", body: "Protect your workout window as fiercely as you protect a CEO meeting." },
    ],
    cta: { label: "Open Workout Planner™", href: "/workout-planner" },
    accent: "green",
  },
  {
    id: "lunch",
    time: "Midday",
    days: "Monday – Thursday",
    icon: <Salad className="h-6 w-6" />,
    eyebrow: "Healthy Hybrid Lunch™",
    title: "Recharge. Nourish. Connect.",
    subtitle: "Step Away From Work.",
    description:
      "The Healthy Hybrid Lunch™ is a protected midday break. You are not eating at your desk. You are honoring the rhythm that sustains executive performance.",
    items: [
      { label: "Nourish", body: "Fuel your body with a real meal. Performance requires proper nutrition." },
      { label: "Step Away", body: "Physically disconnect from screens and work for this window." },
      { label: "Connect", body: "Use this time to connect with family, friends, or your own stillness." },
    ],
    accent: "coral",
  },
  {
    id: "ceo-workday",
    time: "9:00 AM – 1:00 PM",
    days: "Monday – Thursday",
    icon: <Briefcase className="h-6 w-6" />,
    eyebrow: "4-Hour CEO Workday™",
    title: "Operate Like a Successful CEO.",
    subtitle: "Four focused hours. Maximum executive impact.",
    description:
      "This is your 4-Hour CEO Workday™ — the protected window where you lead your business at the highest level. Stay in your Zone of Genius. Create Business Assets™. Make strategic decisions.",
    items: [
      { label: "Executive Outcomes™", body: "Focus exclusively on work that moves the business forward strategically." },
      { label: "Business Asset™ Creation", body: "Build scalable systems, content, and frameworks that compound in value." },
      { label: "Strategic Priorities", body: "Your three most important priorities drive your entire four-hour window." },
      { label: "High-Value Decisions", body: "Make decisions that only the CEO can make. Delegate everything else." },
    ],
    cta: { label: "Open CEO Workspace™", href: "/design-my-week" },
    accent: "ink",
  },
  {
    id: "time-freedom",
    time: "5:00 PM – 10:00 PM",
    days: "Monday – Thursday",
    icon: <Sunset className="h-6 w-6" />,
    eyebrow: "Daily Time Freedom™",
    title: "Business is Finished. Now Live.",
    subtitle: "Intentionally invest in your life.",
    description:
      "At 5:00 PM every business day, the CEO Workday™ closes. This is your protected Daily Time Freedom™ window. You do not check email. You do not work. You live.",
    items: [
      { label: "Family & Relationships", body: "Be fully present with the people who matter most." },
      { label: "Health & Recreation", body: "Exercise, rest, hobbies, and activities that restore you." },
      { label: "Learning & Growth", body: "Personal development, reading, reflection, and spiritual life." },
      { label: "Community", body: "Give back, connect, and invest in the community you are building." },
      { label: "Rest", body: "Rest is not laziness. It is preparation for tomorrow's leadership." },
    ],
    cta: { label: "View Time Freedom™ Dashboard", href: "/time-freedom" },
    accent: "green",
  },
  {
    id: "nighttime",
    time: "Before 10:00 PM",
    days: "Monday – Thursday",
    icon: <Moon className="h-6 w-6" />,
    eyebrow: "Nighttime Non-Negotiable SOPs™",
    title: "Prepare Tomorrow by Honoring Tonight.",
    subtitle: "The next business day begins the night before.",
    description:
      "Your nighttime practices protect your recovery, prepare your mind, and set the stage for tomorrow's excellence. These are not optional.",
    items: [
      { label: "Power Down™", body: "Close all business and executive thinking before 10 PM." },
      { label: "Digital Detox", body: "Screens off. Notifications silenced. Protect your sleep architecture." },
      { label: "Evening Reflection", body: "Review what you accomplished, what you are grateful for, and what you intend for tomorrow." },
      { label: "Sleep Preparation", body: "Create the environment that supports deep recovery sleep." },
    ],
    cta: { label: "Open Sleep Tracker™", href: "/sleep-tracker" },
    accent: "coral",
  },
]

const WEEKLY_RHYTHM = [
  {
    icon: <BarChart3 className="h-5 w-5" />,
    eyebrow: "Measure Monthly™",
    title: "Every 30 Days",
    body: "Complete your Work-Life Balance Reality Check™ and Entrepreneur Success Assessment™ to measure how your life and business are operating.",
    links: [
      { label: "Work-Life Balance Audit™", href: "/business-context" },
      { label: "ESA™", href: "/entrepreneur-success-assessment" },
    ],
    accent: "coral" as const,
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    eyebrow: "Design Weekly™",
    title: "Every Sunday",
    body: "Design and install your upcoming Work-Life Balance Business Week™. Sunday closes with Design My Week™, preparing you to begin Monday with clarity and intention.",
    links: [{ label: "Design My Week™", href: "/design-my-week" }],
    accent: "green" as const,
  },
  {
    icon: <Sunset className="h-5 w-5" />,
    eyebrow: "3-Day Time Freedom™ Weekend",
    title: "Friday – Sunday",
    body: "Recover. Reconnect. Renew. Three full days to rest, explore, and invest in the life your business was designed to support.",
    links: [{ label: "Time Freedom™", href: "/time-freedom" }],
    accent: "gold" as const,
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

type MusicChoice = "barbara" | "my-playlist" | "silent"

function ExpandableBlock({ block }: { block: RhythmBlock }) {
  const [open, setOpen] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [music, setMusic] = useState<MusicChoice | null>(null)
  const a = ACCENT[block.accent]

  return (
    <div className={`rounded-2xl border ${a.border} ${a.bg} overflow-hidden transition-shadow duration-200 hover:shadow-md`}>

      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-5 px-7 py-6 text-left"
      >
        {/* Time column */}
        <div className="hidden sm:flex flex-col items-center gap-1 pt-0.5 w-28 shrink-0">
          <span className={`font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] ${a.eyebrow}`}>
            {block.time}
          </span>
          <span className="font-montserrat text-[10px] text-brand-ink/40 uppercase tracking-wide">
            {block.days}
          </span>
        </div>

        {/* Icon */}
        <div className={`mt-0.5 shrink-0 ${a.icon}`} aria-hidden>
          {block.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] mb-1 ${a.eyebrow}`}>
            {block.eyebrow}
          </p>
          <h3 className="font-playfair text-xl font-semibold text-brand-ink leading-snug">
            {block.title}
          </h3>
          {block.subtitle && (
            <p className="font-sans text-sm text-brand-ink/55 mt-0.5">{block.subtitle}</p>
          )}
          {/* Mobile time */}
          <p className={`sm:hidden font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] mt-2 ${a.eyebrow}`}>
            {block.time} · {block.days}
          </p>
        </div>

        {/* Chevron */}
        <div className={`mt-1 shrink-0 ${a.icon} transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>

      {/* ── Expandable body ─────────────────────────────────────────────────── */}
      {open && (
        <div className="border-t border-black/[0.06] divide-y divide-black/[0.05]">

          {/* 1. Join Us Live™ */}
          <div className="px-7 py-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#E26C73] animate-pulse shrink-0" aria-hidden />
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.20em] text-[#E26C73]">
                Join Us Live™
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#E26C73] px-6 py-3.5 font-sans text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#c04d54] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E26C73]/40"
            >
              <Radio className="h-4 w-4" aria-hidden />
              Join Us Live™
            </a>
          </div>

          {/* 2. Music */}
          <div className="px-7 py-6">
            <div className="flex items-center gap-2 mb-3">
              <Music2 className={`h-4 w-4 shrink-0 ${a.icon}`} aria-hidden />
              <p className={`font-montserrat text-[10px] font-bold uppercase tracking-[0.20em] ${a.eyebrow}`}>
                Music
              </p>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Music options">
              {(
                [
                  { value: "barbara" as const, label: "Barbara's Recommended Playlist", icon: Music2 },
                  { value: "my-playlist" as const, label: "My Playlist",               icon: Music2 },
                  { value: "silent" as const,    label: "Silent",                       icon: VolumeX },
                ] as const
              ).map(({ value, label, icon: Icon }) => {
                const selected = music === value
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setMusic(selected ? null : value)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-sm font-medium transition-colors ${
                      selected
                        ? `${a.cta} border-transparent shadow-sm`
                        : `border-black/[0.10] bg-white/70 text-brand-ink/70 hover:bg-white`
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {label}
                  </button>
                )
              })}
            </div>
            {music === "barbara" && (
              <p className="mt-3 font-sans text-sm text-brand-ink/60 italic">
                Barbara&apos;s curated playlist for this segment is coming soon.
              </p>
            )}
            {music === "my-playlist" && (
              <p className="mt-3 font-sans text-sm text-brand-ink/60 italic">
                Connect your preferred music service to play your own playlist here.
              </p>
            )}
          </div>

          {/* 3. About This Segment */}
          <div className="overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAbout((v) => !v)}
              className="flex w-full items-center justify-between px-7 py-4 text-left transition-colors hover:bg-black/[0.02]"
              aria-expanded={showAbout}
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  className={`h-4 w-4 text-brand-ink/40 transition-transform duration-200 ${showAbout ? "rotate-180" : ""}`}
                  aria-hidden
                />
                <p className="font-montserrat text-xs font-semibold text-brand-ink/60">
                  About This Segment
                </p>
              </div>
            </button>

            {showAbout && (
              <div className="px-7 pb-6 space-y-3">
                <p className="font-sans text-[15px] leading-relaxed text-brand-ink/70 max-w-2xl">
                  {block.description}
                </p>

                {block.items && block.items.length > 0 && (
                  <ul className="space-y-2.5 pt-1">
                    {block.items.map((item) => (
                      <li key={item.label} className="flex items-start gap-3">
                        <span className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${a.itemDot}`} aria-hidden />
                        <div>
                          <span className="font-sans text-sm font-semibold text-brand-ink">{item.label} — </span>
                          <span className="font-sans text-sm text-brand-ink/65">{item.body}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

function WeeklyCard({ item }: { item: typeof WEEKLY_RHYTHM[number] }) {
  const a = ACCENT[item.accent]
  return (
    <div className={`rounded-2xl border ${a.border} ${a.bg} p-6`}>
      <div className={`mb-3 ${a.icon}`} aria-hidden>{item.icon}</div>
      <p className={`font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] mb-1 ${a.eyebrow}`}>
        {item.eyebrow}
      </p>
      <h3 className="font-playfair text-lg font-semibold text-brand-ink mb-2">{item.title}</h3>
      <p className="font-sans text-sm leading-relaxed text-brand-ink/65 mb-4">{item.body}</p>
      <div className="flex flex-wrap gap-2">
        {item.links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className={`inline-flex items-center gap-1.5 rounded-lg border ${a.border} px-3 py-1.5 font-sans text-xs font-semibold ${a.badgeText} transition-opacity hover:opacity-70`}
          >
            {l.label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function LiveLeadDaily() {
  return (
    <div className="w-full bg-white">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-5 pt-16 pb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5B835F]/25 bg-[#5B835F]/8 px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.20em] text-[#3a5c3d]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5B835F] shrink-0" aria-hidden />
          Sustainable Operating Practices™
        </span>
        <h1 className="font-playfair mt-4 text-4xl font-semibold text-brand-ink sm:text-5xl">
          Live &amp; Lead Daily™
        </h1>
        <p className="font-playfair mt-2 text-lg italic text-brand-ink/55 sm:text-xl">
          Your New 9–5 &amp; Nighttime Non-Negotiable SOPs™
        </p>
        <p className="font-sans mt-4 text-base leading-relaxed text-brand-ink/65 max-w-2xl mx-auto">
          Live your Work-Life Balance Business Day™ through the daily operating practices that
          protect your health, increase executive effectiveness, and create lasting Time Freedom™.
        </p>
      </div>

      {/* ── SECTION: Morning GIV•EN™ Routine ────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 pb-6" aria-labelledby="given-heading">
        <div className="rounded-2xl border border-[#C9A84C]/25 bg-gradient-to-br from-[#FDF8EC] to-white overflow-hidden">

          {/* Section header */}
          <div className="px-7 py-7 border-b border-[#C9A84C]/15">
            <div className="flex items-start gap-4">
              <Sun className="h-6 w-6 text-[#C9A84C] mt-0.5 shrink-0" aria-hidden />
              <div>
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A84C] mb-1">
                  Before 9:00 AM · Monday – Thursday
                </p>
                <h2 id="given-heading" className="font-playfair text-2xl font-semibold text-brand-ink">
                  Morning GIV&bull;EN™ Routine
                </h2>
                <p className="font-sans text-sm text-brand-ink/55 mt-1">
                  Start every day by aligning before leading.
                </p>
                <p className="font-sans text-sm leading-relaxed text-brand-ink/65 mt-3 max-w-xl">
                  This is not just a morning routine. It is the foundation of the founder&apos;s
                  operating system. Before you lead your business, you lead yourself.
                </p>
              </div>
            </div>
          </div>

          {/* GIV•EN steps */}
          <div className="divide-y divide-[#C9A84C]/10">
            {GIVEN_STEPS.map((step) => (
              <div key={step.letter} className="flex items-start gap-5 px-7 py-5">
                {/* Letter mark */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A84C]/30 bg-[#C9A84C]/10">
                  <span className="font-playfair text-lg font-bold text-[#8B6914]">{step.letter}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-sm font-bold text-brand-ink">{step.word}</p>
                  <p className="font-sans text-sm leading-relaxed text-brand-ink/60 mt-0.5">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION: Daily Rhythm Blocks ────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 pb-6 space-y-4" aria-label="Daily rhythm blocks">
        {BLOCKS.map((block) => (
          <ExpandableBlock key={block.id} block={block} />
        ))}
      </section>

      {/* ── Divider ──────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="h-px bg-gradient-to-r from-transparent via-[#5B835F]/20 to-transparent" />
      </div>

      {/* ── SECTION: Weekly Rhythm Reminder™ ────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-5 pb-16" aria-labelledby="weekly-rhythm-heading">
        <div className="mb-6 text-center">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.20em] text-[#5B835F]">
            Weekly Rhythm Reminder™
          </p>
          <h2 id="weekly-rhythm-heading" className="font-playfair mt-2 text-2xl font-semibold text-brand-ink">
            The Harmony Lane™ Operating Cadence
          </h2>
          <p className="font-sans mt-2 text-sm text-brand-ink/55 max-w-lg mx-auto">
            Live &amp; Lead Daily™ is one layer of a complete operating system. Here is the full weekly rhythm.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WEEKLY_RHYTHM.map((item) => (
            <WeeklyCard key={item.eyebrow} item={item} />
          ))}
        </div>

        {/* Live & Lead Daily reminder */}
        <div className="mt-4 rounded-2xl border border-[#5B835F]/15 bg-[#5B835F]/[0.03] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5B835F]/10">
              <Sun className="h-4 w-4 text-[#5B835F]" aria-hidden />
            </div>
            <div>
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F] mb-1">
                Live &amp; Lead Daily™ · Monday – Thursday
              </p>
              <p className="font-sans text-sm leading-relaxed text-brand-ink/65">
                Live your Work-Life Balance Business Day™ by following your Sustainable Operating
                Practices™ and protecting your daily Time Freedom™ from{" "}
                <strong className="text-brand-ink">5:00 PM – 10:00 PM</strong>.
                Every completed practice updates your{" "}
                <Link href="/harmony-blueprint" className="text-[#5B835F] underline underline-offset-2 hover:text-[#3a5c3d]">
                  My Work-Life Harmony Blueprint™
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
