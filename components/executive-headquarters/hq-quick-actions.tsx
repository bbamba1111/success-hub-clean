"use client"

/**
 * HQQuickActions — Phase 15.2
 * Premium 7-card navigation grid giving instant access to all major workspaces.
 */

import Link from "next/link"
import { ArrowRight, LayoutDashboard, Brain, Zap, Calendar, BarChart2, CalendarCheck, Users } from "lucide-react"

interface ActionCard {
  label: string
  description: string
  href: string
  icon: React.ReactNode
  accentColor: string
}

const ACTIONS: ActionCard[] = [
  {
    label: "My Harmony™",
    description: "Your complete operating system — adaptive workspace, GPS, and executive office.",
    href: "/my-harmony",
    icon: <LayoutDashboard className="h-5 w-5" />,
    accentColor: "#5D9D61",
  },
  {
    label: "Decision Workspace™",
    description: "Run decisions through 7 executive perspectives and 9 impact dimensions.",
    href: "/decision-workspace",
    icon: <Brain className="h-5 w-5" />,
    accentColor: "#4A7FA5",
  },
  {
    label: "Adaptive Workspace™",
    description: "Your mode-aware operating environment that shifts with your rhythm.",
    href: "/my-harmony",
    icon: <Zap className="h-5 w-5" />,
    accentColor: "#C6924A",
  },
  {
    label: "Executive Reviews™",
    description: "Weekly, monthly, and quarterly Harmony Score™ and operating reviews.",
    href: "/executive-reviews",
    icon: <BarChart2 className="h-5 w-5" />,
    accentColor: "#E26C73",
  },
  {
    label: "Community Events™",
    description: "Live Co-Working, Monday Sync, Office Hours, Founder Circle, and more.",
    href: "/events",
    icon: <CalendarCheck className="h-5 w-5" />,
    accentColor: "#7C5C8A",
  },
  {
    label: "Live Today™",
    description: "Your daily operating schedule — blocks, intentions, and the daily rhythm.",
    href: "/",
    icon: <Calendar className="h-5 w-5" />,
    accentColor: "#8AAF8C",
  },
  {
    label: "Founder GPS™",
    description: "Your personalised next-best-step engine powered by your context.",
    href: "/my-harmony",
    icon: <Users className="h-5 w-5" />,
    accentColor: "#5D9D61",
  },
]

export function HQQuickActions() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-montserrat text-sm font-bold uppercase tracking-[0.14em] text-[#1C161A]">
        Quick Access
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {ACTIONS.map((action) => (
          <Link
            key={action.href + action.label}
            href={action.href}
            className="group flex flex-col gap-3 rounded-xl border border-black/[0.07] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Icon */}
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: action.accentColor + "15", color: action.accentColor }}
            >
              {action.icon}
            </span>

            {/* Label + description */}
            <div className="flex flex-col gap-0.5">
              <p className="font-montserrat text-sm font-semibold leading-tight text-[#1C161A]">
                {action.label}
              </p>
              <p className="font-montserrat text-xs leading-relaxed text-[#9CA3AF] line-clamp-2">
                {action.description}
              </p>
            </div>

            {/* Arrow */}
            <ArrowRight
              className="mt-auto h-3.5 w-3.5 self-end opacity-0 transition-opacity group-hover:opacity-100"
              style={{ color: action.accentColor }}
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
