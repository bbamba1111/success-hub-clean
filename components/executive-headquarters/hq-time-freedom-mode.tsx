"use client"

/**
 * HQTimeFreedomMode — Phase 15.2
 * Full replacement layout rendered during the Time Freedom™ window (Thu 5PM → Mon 7AM).
 * Shows rest/recovery/reflection cards. Sunday gets a week-prep note.
 */

import Link from "next/link"
import { ArrowRight, Leaf, Heart, BookOpen, Sunset, Coffee, Moon } from "lucide-react"
import type { HarmonyWeekContextValue } from "@/components/harmony-week/harmony-week-provider"

interface RestCard {
  icon: React.ReactNode
  title: string
  body: string
  accentColor: string
}

function RestCard({ icon, title, body, accentColor }: RestCard) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-black/[0.07] bg-white p-5 shadow-sm"
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      <span
        className="flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundColor: accentColor + "15", color: accentColor }}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-montserrat text-sm font-semibold text-[#1C161A]">{title}</p>
        <p className="font-montserrat text-xs leading-relaxed text-[#5C4F55]">{body}</p>
      </div>
    </div>
  )
}

interface Props {
  harmonyWeek: HarmonyWeekContextValue | null
}

export function HQTimeFreedomMode({ harmonyWeek }: Props) {
  const accentColor = harmonyWeek?.accent.color ?? "#8AAF8C"
  const themeName = harmonyWeek?.themeName ?? "Time Freedom™"
  const tagline = harmonyWeek?.tagline ?? "Rest is productive."
  const dayOfWeek = harmonyWeek?.dayOfWeek ?? 6
  const isSunday = dayOfWeek === 0

  const restCards: RestCard[] = [
    {
      icon: <Leaf className="h-4 w-4" />,
      title: "Protect Your Rest",
      body: "Your Time Freedom™ window is a non-negotiable operating boundary. Resisting the pull to work is the most advanced leadership skill you can practise today.",
      accentColor: "#8AAF8C",
    },
    {
      icon: <Heart className="h-4 w-4" />,
      title: "Life-First Activities",
      body: "Schedule something today that feeds your soul — movement, creativity, family, nature, or simply stillness. This is not a reward; it is part of your operating system.",
      accentColor: "#E26C73",
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      title: "Reflection Practice",
      body: "What is one insight from this week that you want to carry into next week? You do not need to act on it now — just let it land.",
      accentColor: "#4A7FA5",
    },
    {
      icon: <Sunset className="h-4 w-4" />,
      title: "Savour the Moment",
      body: "Notice one thing that is good right now. Time Freedom™ is not about filling time — it is about being present in the life your business is designed to support.",
      accentColor: "#C6924A",
    },
    {
      icon: <Coffee className="h-4 w-4" />,
      title: "No Productivity Pressure",
      body: "The community room is closed. Your CEO Workday™ is paused. You are off the operating clock until Monday 7:00 AM. Breathe.",
      accentColor: "#7C5C8A",
    },
    {
      icon: <Moon className="h-4 w-4" />,
      title: "Protect Your Sleep",
      body: "A consistent sleep and wind-down routine is one of the highest-leverage operating practices available to you. Honour the Power Down™ tonight.",
      accentColor: "#5D9D61",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Time Freedom™ hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-7 shadow-sm"
        style={{ borderLeft: `4px solid ${accentColor}` }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 60%)` }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-3">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ backgroundColor: accentColor + "18", color: accentColor, border: `1px solid ${accentColor}30` }}
          >
            {themeName}
          </span>
          <h1 className="font-playfair text-3xl font-semibold leading-tight text-[#1C161A] sm:text-4xl text-balance">
            Your Time Freedom™ is Protected
          </h1>
          <p className="max-w-xl font-montserrat text-sm leading-relaxed text-[#5C4F55]">
            {tagline} The CEO Workday™ and operating schedule are paused until Monday 7:00 AM. This time belongs to your life.
          </p>
        </div>
      </div>

      {/* Rest cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {restCards.map((card) => (
          <RestCard key={card.title} {...card} />
        ))}
      </div>

      {/* Sunday prep note */}
      {isSunday && (
        <div
          className="flex flex-col gap-3 rounded-xl border border-black/[0.07] bg-white p-6 shadow-sm"
          style={{ borderTop: `3px solid ${accentColor}` }}
        >
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
            Sunday Evening Prep
          </p>
          <p className="font-playfair text-lg font-semibold text-[#1C161A]">
            A calm Sunday evening sets the tone for the week ahead.
          </p>
          <p className="font-montserrat text-sm leading-relaxed text-[#5C4F55]">
            If you choose to, spend 15 minutes before bed reviewing your intention for Monday. Set your one non-negotiable for the week. Then close your devices and rest — Monday Momentum™ begins tomorrow.
          </p>
          <Link
            href="/executive-reviews"
            className="inline-flex items-center gap-1.5 self-start font-montserrat text-sm font-semibold transition-colors hover:opacity-80"
            style={{ color: accentColor }}
          >
            Review last week
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  )
}
