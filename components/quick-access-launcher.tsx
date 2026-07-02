"use client"

/**
 * QuickAccessLauncher — a compact launcher that sits directly beneath the
 * Dynamic Hero so members can reach every segment planner and dashboard tool
 * without scrolling the full page.
 *
 * Planners open Cherry Blossom's chat (via the `onPlan` callback supplied by
 * the home page, which owns the chat modal state). Tools & resources link to
 * their dedicated pages or scroll to the on-page wellness dashboard.
 */

import Link from "next/link"
import { Sunrise, Dumbbell, Salad, Briefcase, Heart, Moon, Calendar, BedDouble, LayoutDashboard, ArrowRight } from "lucide-react"

type Tone = "sage" | "coral"

interface PlannerItem {
  context: string
  title: string
  label: string
  icon: React.ElementType
  tone: Tone
}

interface ToolItem {
  href: string
  label: string
  icon: React.ElementType
  tone: Tone
  external?: boolean
}

/** The six Work-Life Balance Business Day™ segment planners. */
const PLANNERS: PlannerItem[] = [
  { context: "morning-routine", title: "Morning GIV•EN™ Routine", label: "Morning Routine", icon: Sunrise, tone: "coral" },
  { context: "workout-window", title: "30-Minute Workday Workout Window", label: "Workout Window", icon: Dumbbell, tone: "sage" },
  { context: "lunch-break", title: "Extended Healthy Hybrid Lunch Break", label: "Lunch Break", icon: Salad, tone: "coral" },
  { context: "ceo-workday", title: "4-Hour Focused CEO Workday", label: "CEO Workday", icon: Briefcase, tone: "sage" },
  { context: "lifestyle-experiences", title: "Quality of Lifestyle Experiences", label: "Lifestyle Experiences", icon: Heart, tone: "coral" },
  { context: "digital-detox", title: "Power Down & Unplug Digital Detox", label: "Digital Detox", icon: Moon, tone: "sage" },
]

/** Dashboard tools & resources. */
const TOOLS: ToolItem[] = [
  { href: "/workout-planner", label: "Workout Planner", icon: Calendar, tone: "sage" },
  { href: "/sleep-tracker", label: "Sleep Tracker", icon: BedDouble, tone: "coral" },
  { href: "#wellness-dashboard", label: "Wellness Dashboard", icon: LayoutDashboard, tone: "sage" },
]

const TONE_CLASSES: Record<Tone, { ring: string; iconWrap: string; icon: string }> = {
  sage: {
    ring: "border-[#7FB069]/25 hover:border-[#7FB069]/60",
    iconWrap: "bg-[#7FB069]/12",
    icon: "text-[#5B835F]",
  },
  coral: {
    ring: "border-[#E26C73]/25 hover:border-[#E26C73]/60",
    iconWrap: "bg-[#E26C73]/12",
    icon: "text-[#C13B6B]",
  },
}

function TileShell({
  tone,
  icon: Icon,
  label,
}: {
  tone: Tone
  icon: React.ElementType
  label: string
}) {
  const t = TONE_CLASSES[tone]
  return (
    <span
      className={`flex h-full flex-col items-center justify-center gap-2 rounded-2xl border bg-white/85 p-4 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${t.ring}`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-full ${t.iconWrap}`}>
        <Icon className={`h-5 w-5 ${t.icon}`} aria-hidden />
      </span>
      <span className="font-montserrat text-sm font-semibold leading-tight text-[#3A2E33]">{label}</span>
    </span>
  )
}

export function QuickAccessLauncher({
  onPlan,
}: {
  onPlan: (context: string, title: string) => void
}) {
  return (
    <section aria-labelledby="quick-access-heading" className="w-full bg-[#FBF7F0] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2
            id="quick-access-heading"
            className="text-balance font-playfair text-2xl font-medium text-[#5B835F] sm:text-3xl"
          >
            Your Planners, Tools &amp; Resources
          </h2>
          <p className="mt-1 font-montserrat text-sm font-medium tracking-wide text-[#6B5860]">
            Jump straight into any segment — no scrolling required.
          </p>
        </div>

        {/* Segment planners — open Cherry Blossom's planning chat */}
        <div className="mt-6">
          <p className="mb-3 text-center font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#78AD7D]">
            Plan Each Segment
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PLANNERS.map((p) => (
              <button
                key={p.context}
                type="button"
                onClick={() => onPlan(p.context, p.title)}
                aria-label={`Plan your ${p.label} with Cherry Blossom`}
                className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB069]/60"
              >
                <TileShell tone={p.tone} icon={p.icon} label={p.label} />
              </button>
            ))}
          </div>
        </div>

        {/* Tools & resources — dedicated pages / on-page dashboard */}
        <div className="mt-6">
          <p className="mb-3 text-center font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
            Tools &amp; Resources
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                aria-label={`Open ${tool.label}`}
                className="rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB069]/60"
              >
                <TileShell tone={tool.tone} icon={tool.icon} label={tool.label} />
              </Link>
            ))}
          </div>
        </div>

        {/* Full experience anchor */}
        <div className="mt-6 text-center">
          <Link
            href="#todays-business-day"
            className="inline-flex items-center gap-1.5 font-montserrat text-sm font-semibold text-[#5B835F] transition-colors hover:text-[#4a6b4e]"
          >
            See today&apos;s full rhythm
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
