"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trash2 } from "lucide-react"
import type { LunchLogEntry } from "@/lib/daily-plan/lunch-history"

/**
 * Lunch Break History™ — the running log of past breaks. Always present in
 * the Extended Healthy Hybrid Lunch Break™ so the record stays visible
 * whether or not today's break has been logged yet. Deliberately no
 * duration column — this protected window is honoured, not timed.
 */
export function LunchHistoryList({
  history,
  onDelete,
}: {
  history: LunchLogEntry[]
  onDelete: (id: string) => void
}) {
  if (history.length === 0) return null

  return (
    <Card className="border-2 border-[#E26C73]/20">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-[#E26C73]" aria-hidden />
          <h4 className="font-semibold text-gray-700">Lunch Break History</h4>
        </div>
        <div className="space-y-3">
          {history.map((w) => (
            <div
              key={w.id}
              className="flex items-start justify-between p-3 rounded-lg bg-[#E26C73]/5 border border-[#E26C73]/15"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-[#E26C73] text-white text-xs">{w.activity}</Badge>
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
                    {w.completionStatus === "yes" ? "Took lunch" : w.completionStatus === "partially" ? "Partial" : "Skipped"}
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
