"use client"

/**
 * DailyAccountability — 4 check-in buttons; marks today's completions;
 * optional reflection textarea.
 */

import { useState } from "react"
import { useCommunity } from "./community-provider"
import type { CheckIn, CheckInType } from "@/lib/community/types"
import { CheckCircle, Circle } from "lucide-react"

const CHECK_IN_CONFIG: {
  type: CheckInType
  label: string
  description: string
  accentColor: string
}[] = [
  {
    type: "morning-routine",
    label: "Morning GIV-EN™",
    description: "Gratitude, Intention, Visualisation, Exercise, Nourishment",
    accentColor: "#8AAF8C",
  },
  {
    type: "focus-block",
    label: "CEO Workday™",
    description: "Protected 4-Hour CEO Workday™ block completed",
    accentColor: "#5D9D61",
  },
  {
    type: "time-freedom",
    label: "Time Freedom™",
    description: "Devices off and weekend boundary honored",
    accentColor: "#7C5C8A",
  },
  {
    type: "executive-review",
    label: "Executive Review™",
    description: "Weekly operating review generated and reviewed",
    accentColor: "#C6924A",
  },
]

export function DailyAccountability() {
  const { checkIns, addCheckIn } = useCommunity()
  const [reflection, setReflection] = useState("")
  const [activeType, setActiveType] = useState<CheckInType | null>(null)
  const [saved, setSaved] = useState<CheckInType | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  function isCheckedToday(type: CheckInType): boolean {
    return checkIns.some((c) => c.type === type && c.date === today)
  }

  function handleCheckIn(type: CheckInType) {
    if (isCheckedToday(type)) return
    setActiveType(type)
  }

  function handleSave() {
    if (!activeType) return
    const checkIn: CheckIn = {
      id: `checkin-${activeType}-${today}`,
      type: activeType,
      date: today,
      reflectionNote: reflection.trim() || undefined,
      timestamp: new Date().toISOString(),
    }
    addCheckIn(checkIn)
    setSaved(activeType)
    setActiveType(null)
    setReflection("")
    setTimeout(() => setSaved(null), 3000)
  }

  return (
    <section aria-labelledby="accountability-heading">
      <div className="mb-4">
        <h2
          id="accountability-heading"
          className="font-playfair text-xl font-bold text-[#1C2B2B]"
        >
          Daily Accountability
        </h2>
        <p className="mt-1 font-montserrat text-[13px] text-gray-500">
          Mark what you completed today. Your community sees you showing up.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CHECK_IN_CONFIG.map((config) => {
          const done = isCheckedToday(config.type)
          const isActive = activeType === config.type

          return (
            <button
              key={config.type}
              type="button"
              onClick={() => handleCheckIn(config.type)}
              disabled={done}
              aria-pressed={done}
              className="flex items-start gap-3 rounded-2xl border bg-white p-4 text-left transition-all hover:shadow-sm disabled:cursor-default"
              style={{
                borderColor: done ? config.accentColor : "#e5e7eb",
                borderLeftWidth: "4px",
              }}
            >
              <span className="mt-0.5 flex-shrink-0">
                {done ? (
                  <CheckCircle
                    className="h-5 w-5"
                    style={{ color: config.accentColor }}
                  />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="font-montserrat text-sm font-semibold"
                  style={{ color: done ? config.accentColor : "#1C2B2B" }}
                >
                  {config.label}
                </p>
                <p className="mt-0.5 font-montserrat text-[12px] leading-snug text-gray-400">
                  {config.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Reflection textarea */}
      {activeType && (
        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
          <p className="font-montserrat text-sm font-semibold text-[#1C2B2B]">
            Add a reflection (optional)
          </p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What made this possible today?"
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-3 py-2 font-montserrat text-[13px] text-[#1C2B2B] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5D9D61]"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-[#1C2B2B] px-4 py-2 font-montserrat text-xs font-semibold uppercase tracking-wider text-white hover:opacity-90"
            >
              Save Check-In
            </button>
            <button
              type="button"
              onClick={() => setActiveType(null)}
              className="rounded-xl border border-gray-200 px-4 py-2 font-montserrat text-xs text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {saved && (
        <p className="mt-3 font-montserrat text-[13px] text-[#5D9D61]">
          Check-in saved. Cherry Blossom has noted your commitment.
        </p>
      )}
    </section>
  )
}
