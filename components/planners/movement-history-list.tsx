"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trash2 } from "lucide-react"
import type { WorkoutEntry } from "@/lib/daily-plan/movement-history"

/**
 * Movement History™ — the running log of past sessions. Always present in
 * the 30-Minute Movement Window™ so progress stays visible whether or not
 * today's session has been logged yet.
 */
export function MovementHistoryList({
  history,
  onDelete,
}: {
  history: WorkoutEntry[]
  onDelete: (id: string) => void
}) {
  if (history.length === 0) return null

  return (
    <Card className="border-2 border-[#7FB069]/20">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-[#7FB069]" aria-hidden />
          <h4 className="font-semibold text-gray-700">Movement History</h4>
        </div>
        <div className="space-y-3">
          {history.map((w) => (
            <div
              key={w.id}
              className="flex items-start justify-between p-3 rounded-lg bg-[#7FB069]/5 border border-[#7FB069]/15"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-[#7FB069] text-white text-xs">{w.type}</Badge>
                  <span className="text-xs text-gray-500">{w.duration} min</span>
                  <span className="text-xs text-gray-400" suppressHydrationWarning>
                    {new Date(w.date).toLocaleDateString()}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      w.completionStatus === "yes"
                        ? "bg-green-100 text-green-700"
                        : w.completionStatus === "partially"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-50 text-red-500"
                    }`}
                  >
                    {w.completionStatus === "yes" ? "Completed" : w.completionStatus === "partially" ? "Partial" : "Missed"}
                  </span>
                </div>
                {w.reflection && <p className="text-xs text-gray-500 mt-1 truncate">{w.reflection}</p>}
              </div>
              <button
                type="button"
                onClick={() => onDelete(w.id)}
                aria-label={`Delete ${w.type} entry`}
                className="ml-3 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
