"use client"

/**
 * HQFounderJourney — Phase 15.2
 * 5-stage milestone trail showing the founder's Harmony Lane™ journey.
 * Current stage is highlighted; completed stages show a check mark.
 */

import Link from "next/link"
import { ArrowRight, CheckCircle2, Circle, MapPin } from "lucide-react"
import type { InstallationProfile } from "@/lib/installation/types"

const JOURNEY_STAGES = [
  { id: "installed",    label: "System Installed™",          description: "Harmony Lane™ activated" },
  { id: "context-set",  label: "Context Calibrated™",        description: "Business context personalised" },
  { id: "first-gps",   label: "First GPS Session™",         description: "Founder GPS™ activated" },
  { id: "first-week",  label: "First Full Week™",           description: "7 days of intentional operation" },
  { id: "first-review",label: "First Executive Review™",    description: "Harmony Score™ unlocked" },
] as const

type StageId = typeof JOURNEY_STAGES[number]["id"]

function deriveCurrentStage(
  profile: InstallationProfile | null,
  hasGpsHistory: boolean,
  hasReview: boolean,
): StageId {
  if (hasReview) return "first-review"
  if (hasGpsHistory) return "first-gps"
  if (profile?.completedAt) return "context-set"
  if (profile) return "installed"
  return "installed"
}

interface Props {
  profile: InstallationProfile | null
  hasGpsHistory: boolean
  hasReview: boolean
  accentColor: string
}

export function HQFounderJourney({ profile, hasGpsHistory, hasReview, accentColor }: Props) {
  const currentStageId = deriveCurrentStage(profile, hasGpsHistory, hasReview)
  const currentIdx = JOURNEY_STAGES.findIndex((s) => s.id === currentStageId)

  return (
    <div
      className="flex flex-col gap-4 rounded-xl border border-black/[0.07] bg-white p-6 shadow-sm h-full"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
          style={{ backgroundColor: accentColor + "15" }}
        >
          <MapPin className="h-4 w-4" style={{ color: accentColor }} aria-hidden />
        </span>
        <h2 className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
          Founder Journey™
        </h2>
      </div>

      {/* Stage trail */}
      <ol className="flex flex-col gap-0">
        {JOURNEY_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIdx
          const isCurrent = idx === currentIdx
          const isUpcoming = idx > currentIdx

          return (
            <li key={stage.id} className="flex items-start gap-3">
              {/* Connector line */}
              <div className="flex flex-col items-center">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" style={{ color: accentColor }} aria-hidden />
                  ) : isCurrent ? (
                    <div
                      className="h-5 w-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: accentColor }}
                    >
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 text-[#D1D5DB]" aria-hidden />
                  )}
                </div>
                {idx < JOURNEY_STAGES.length - 1 && (
                  <div
                    className="mt-0.5 mb-0.5 w-px flex-1 min-h-[20px]"
                    style={{ backgroundColor: isCompleted ? accentColor + "40" : "#E5E7EB" }}
                  />
                )}
              </div>

              {/* Stage content */}
              <div className="pb-4">
                <p
                  className={`font-montserrat text-sm font-semibold leading-tight ${
                    isUpcoming ? "text-[#D1D5DB]" : "text-[#1C161A]"
                  }`}
                >
                  {stage.label}
                </p>
                <p
                  className={`font-montserrat text-xs mt-0.5 ${
                    isUpcoming ? "text-[#E5E7EB]" : "text-[#9CA3AF]"
                  }`}
                >
                  {stage.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <Link
        href="/welcome"
        className="mt-auto inline-flex items-center gap-1.5 self-start font-montserrat text-sm font-semibold transition-colors hover:opacity-80"
        style={{ color: accentColor }}
      >
        View onboarding
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </div>
  )
}
