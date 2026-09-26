"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trash2 } from "lucide-react"
import type { PowerDownLogEntry } from "@/lib/daily-plan/power-down-history"

/**
 * Power Down History™ — the running log of past wind-downs. Always present
 * in the Power Down™ segment so the record stays visible whether or not
 * tonight's wind-down has been logged yet. Deliberately no duration column
 * — this protected window is honoured, not timed.
 */
export function PowerDownHistoryList({
  history,
  onDelete,
}: {
  history: PowerDownLogEntry[]
  onDelete: (id: string) => void
}) {
  if (history.length === 0) return null

  return (
    <Card className="border-2 border-[#5B6EA8]/20">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-[#5B6EA8]" aria-hidden />
          <h4 className="font-semibold text-gray-700">Power Down History</h4>
        </div>
        <div className="space-y-3">
          {history.map((w) => (
            <div
              key={w.id}
              className="flex items-start justify-between p-3 rounded-lg bg-[#5B6EA8]/5 border border-[#5B6EA8]/15"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-[#5B6EA8] text-white text-xs">{w.activity}</Badge>
                  {w.sleepHours > 0 && (
                    <Badge variant="outline" className="border-[#5B6EA8]/40 text-[#5B6EA8] text-xs">
                      {w.sleepHours}h sleep planned
                    </Badge>
                  )}
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
                    {w.completionStatus === "yes" ? "Released fully" : w.completionStatus === "partially" ? "Partial" : "Skipped"}
                  </span>
                </div>
                {w.reflection && <p className="text-xs text-gray-500 mt-1 truncate">{w.reflection}</p>}
              </div>
              <button
                type="button"
                onClick={() => onDelete(w.id)}
                aria-label={`Delete ${w.activity} entry`}
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
