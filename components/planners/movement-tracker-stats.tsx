"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Target, Clock, TrendingUp } from "lucide-react"
import type { WeeklyMovementStats } from "@/lib/daily-plan/movement-history"

/**
 * Movement Tracker™ — the 3-up weekly stat row (sessions, minutes, avg per
 * session). Always present in the 30-Minute Movement Window™, regardless of
 * whether today's declaration or wrap-up has happened yet.
 */
export function MovementTrackerStats({ stats }: { stats: WeeklyMovementStats }) {
  const cards = [
    { icon: Target, label: "Sessions this week", value: stats.weeklySessions.length },
    { icon: Clock, label: "Minutes this week", value: stats.weeklyMinutes },
    { icon: TrendingUp, label: "Avg per session", value: stats.avgPerSession },
  ] as const

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map(({ icon: Icon, label, value }) => (
        <Card key={label} className="border-2 border-[#7FB069]/20">
          <CardContent className="pt-4 pb-3">
            <Icon className="h-4 w-4 text-[#7FB069] mb-2" aria-hidden />
            <div className="text-2xl font-bold text-[#7FB069]">{value}</div>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
