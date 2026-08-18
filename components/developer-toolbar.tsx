"use client"

/**
 * Developer Toolbar — admin-only control surface for the Operating Engine.
 *
 * Visible ONLY to authenticated Platform Administrators. Lets an admin preview
 * any state of the Work-Life Balance Operating Environment™ (time-travel,
 * day, installation week, member state, season, live session) without waiting
 * for the real clock. All simulation is session-only and never touches member
 * data. Regular members never see or load this control.
 */

import { useState } from "react"
import { FlaskConical, X, RotateCcw, Clock } from "lucide-react"
import { SCHEDULE, type BlockId, type LiveSessionOverride, type Season } from "@/operating-engine"
import { useDeveloperMode, useOperatingEngine } from "@/components/operating-engine-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const SEASONS: Season[] = ["spring", "summer", "fall", "winter"]
const LIVE_SESSIONS: LiveSessionOverride[] = ["live", "replay", "self-guided", "closed"]

const WEEK_PRESETS: { label: string; weeksAgo: number }[] = [
  { label: "Week 1", weeksAgo: 0 },
  { label: "Week 2", weeksAgo: 1 },
  { label: "Week 3", weeksAgo: 2 },
  { label: "Week 4", weeksAgo: 3 },
  { label: "Integration", weeksAgo: 5 },
]

interface MemberPreset {
  label: string
  state: { streak: number; hoursReclaimed: number }
}
const MEMBER_PRESETS: MemberPreset[] = [
  { label: "New", state: { streak: 0, hoursReclaimed: 0 } },
  { label: "Returning", state: { streak: 3, hoursReclaimed: 12 } },
  { label: "On Streak", state: { streak: 14, hoursReclaimed: 40 } },
  { label: "Missed Yesterday", state: { streak: 0, hoursReclaimed: 18 } },
  { label: "Completed Today", state: { streak: 7, hoursReclaimed: 25 } },
  { label: "Champion", state: { streak: 30, hoursReclaimed: 120 } },
]

function joinedAtWeeksAgo(weeksAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - weeksAgo * 7)
  return d.toISOString()
}

/** Compact label for a row of options. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

/** A single toggleable pill. */
function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-2 py-1 text-xs font-medium transition-colors",
        active ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700",
      )}
    >
      {children}
    </button>
  )
}

export function DeveloperToolbar() {
  const dev = useDeveloperMode()
  const experience = useOperatingEngine()
  const [open, setOpen] = useState(false)

  // Hard gate: render nothing for non-admins.
  if (!dev?.isAdmin) return null

  const { enabled, setEnabled, override, setOverride, reset } = dev
  const firstName = experience?.member.firstName

  // Collapsed launcher.
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open Developer Mode"
        className={cn(
          "fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-lg transition-colors",
          enabled ? "bg-emerald-500 text-white" : "bg-slate-900 text-slate-200 hover:bg-slate-800",
        )}
      >
        <FlaskConical className="h-4 w-4" />
        {enabled ? "Dev Mode On" : "Dev Mode"}
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-[320px] max-w-[calc(100vw-2rem)] rounded-xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-semibold">Developer Mode</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            role="switch"
            aria-checked={enabled}
            aria-label="Toggle Developer Mode"
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              enabled ? "bg-emerald-500" : "bg-slate-600",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                enabled ? "translate-x-4" : "translate-x-0.5",
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Hide toolbar"
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Status line */}
      <div className="flex items-center gap-2 border-b border-slate-700 px-3 py-2 text-xs">
        <Clock className="h-3.5 w-3.5 text-slate-400" />
        {experience ? (
          <span className="text-slate-300">
            {override.blockId || override.minutesSinceMidnight != null ? "Simulating" : "Now"}:{" "}
            <span className="font-semibold text-emerald-400">{experience.businessDay.current.shortTitle}</span>
            {" · "}
            {String(experience.time.hour).padStart(2, "0")}:{String(experience.time.minute).padStart(2, "0")}
            {" · "}
            {experience.time.dayName}
          </span>
        ) : (
          <span className="text-slate-500">Loading…</span>
        )}
      </div>

      {!enabled ? (
        <div className="px-3 py-4 text-xs text-slate-400">
          Developer Mode is off. You see exactly what members see, including the Community Closed lockout at night.
          Turn it on to bypass business hours and preview any phase.
        </div>
      ) : (
        <div className="max-h-[60vh] space-y-3 overflow-y-auto px-3 py-3">
          <Field label="Time Block (Time Travel)">
            {SCHEDULE.map((b) => (
              <Pill
                key={b.id}
                active={override.blockId === b.id}
                onClick={() => setOverride({ blockId: b.id as BlockId, minutesSinceMidnight: undefined })}
              >
                {b.shortTitle}
              </Pill>
            ))}
          </Field>

          <Field label="Simulated Day">
            {DAYS.map((d, i) => (
              <Pill key={d} active={override.dayOfWeek === i} onClick={() => setOverride({ dayOfWeek: i })}>
                {d}
              </Pill>
            ))}
          </Field>

          <Field label="Installation Week">
            {WEEK_PRESETS.map((w) => (
              <Pill
                key={w.label}
                active={false}
                onClick={() =>
                  setOverride({
                    member: { ...override.member, firstName, joinedAt: joinedAtWeeksAgo(w.weeksAgo) },
                  })
                }
              >
                {w.label}
              </Pill>
            ))}
          </Field>

          <Field label="Member State">
            {MEMBER_PRESETS.map((m) => (
              <Pill
                key={m.label}
                active={false}
                onClick={() => setOverride({ member: { ...override.member, firstName, ...m.state } })}
              >
                {m.label}
              </Pill>
            ))}
          </Field>

          <Field label="Season">
            {SEASONS.map((s) => (
              <Pill key={s} active={override.season === s} onClick={() => setOverride({ season: s })}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Pill>
            ))}
          </Field>

          <Field label="Live Session">
            {LIVE_SESSIONS.map((s) => (
              <Pill
                key={s}
                active={override.liveSession === s}
                onClick={() => setOverride({ liveSession: override.liveSession === s ? undefined : s })}
              >
                {s === "self-guided" ? "Self-Guided" : s.charAt(0).toUpperCase() + s.slice(1)}
              </Pill>
            ))}
          </Field>

          <div className="flex items-center justify-between pt-1">
            <Badge variant="secondary" className="bg-slate-800 text-slate-300">
              Session-only · no member data touched
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={reset}
              className="h-7 gap-1 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
