"use client"

/**
 * Identity Installation System™
 *
 * An 8-step behavioral workflow that lives above the Join Us Live™ button
 * inside each Operating Segment™ card. It guides the member through:
 *
 *   idle → intention → generating → declaration → installed
 *     → completing → reflecting → done
 *
 * Supported segments (7):
 *   early-access, morning-given, movement-window, lunch-break,
 *   ceo-workday, time-freedom, power-down
 *
 * digital-detox, monday-flex, and monday-reality-check are intentionally excluded.
 */

import { useState, useRef, useCallback } from "react"
import { Check, Copy, RotateCcw, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ─── Types ────────────────────────────────────────────────────────────────────

type Step =
  | "idle"
  | "intention"
  | "generating"
  | "declaration"
  | "installed"
  | "completing"
  | "reflecting"
  | "done"

type CompletionStatus = "honored" | "modified" | "not-completed"

export interface SegmentIntentionConfig {
  /** Display label for the intention CTA, e.g. "Set My Movement Intention™" */
  intentionLabel: string
  /** Short description of this segment shown above the intention form */
  segmentDescription: string
  /** Whether to show the movement-specific type+duration pickers */
  isMovement?: boolean
  /** Whether to show the Power Down / sleep fields in the completion step */
  isSleepSegment?: boolean
  /** Accent color for the declaration card border (hex) */
  accentColor: string
  /** Soft surface background for the panel cards (hex) */
  surface: string
  /** Completion verb for the button, e.g. "I Completed My Movement" */
  completionLabel: string
}

export const SEGMENT_CONFIGS: Record<string, SegmentIntentionConfig> = {
  "early-access": {
    intentionLabel: "Set My Flex Time Intention™",
    segmentDescription:
      "Your protected 2-hour buffer at the start of every day, designed to absorb life's unavoidable demands without ever touching your CEO Workday™.",
    accentColor: "#C8A96B",
    surface: "#FBF4EC",
    completionLabel: "I Completed My Flex Time™",
  },
  "morning-given": {
    intentionLabel: "Set My Morning GIV\u2022EN\u2122 Intention\u2122",
    segmentDescription:
      "Your 90-minute intentional morning operating ritual — Gratitude, Invitation, Vision, Emotional Embodiment, and Nurture — where you lead yourself before you lead your business.",
    accentColor: "#C13B6B",
    surface: "#FBF1F3",
    completionLabel: "I Completed My Morning GIV\u2022EN\u2122",
  },
  "movement-window": {
    intentionLabel: "Set My Movement Intention\u2122",
    segmentDescription:
      "Your protected 30-minute Movement Window\u2122 is intentionally designed to restore energy, improve health, and prepare you for the remainder of your Work-Life Balance Business Day\u2122.",
    isMovement: true,
    accentColor: "#78AD7D",
    surface: "#EFF5EC",
    completionLabel: "I Completed My Movement\u2122",
  },
  "lunch-break": {
    intentionLabel: "Set My Lunch Intention\u2122",
    segmentDescription:
      "A nourishing midday pause that refuels your body, creates a natural rhythm break, and prepares you for your most important work. Nourishment is productive.",
    accentColor: "#C8A96B",
    surface: "#F5F1E7",
    completionLabel: "I Completed My Lunch Break\u2122",
  },
  "ceo-workday": {
    intentionLabel: "Set My CEO Workday Intention\u2122",
    segmentDescription:
      "The most protected and powerful four hours in your Work-Life Balance Business Week\u2122. Deep, uninterrupted work produces 4\u20135\u00d7 more output than scattered, reactive hours.",
    accentColor: "#4A7C59",
    surface: "#E7F0E3",
    completionLabel: "I Completed My CEO Workday\u2122",
  },
  "time-freedom": {
    intentionLabel: "Set My Time Freedom Intention\u2122",
    segmentDescription:
      "The protected life your business exists to support. Work is finished. You kept your commitment. Now receive the reward you built your operating system to protect.",
    accentColor: "#C8A96B",
    surface: "#F7EDDD",
    completionLabel: "I Completed My Time Freedom\u2122",
  },
  "power-down": {
    intentionLabel: "Set My Power Down Intention\u2122",
    segmentDescription:
      "Your intentional evening transition from productivity to restoration. Quality rest is not a reward for good performance — it is the foundation of tomorrow\u2019s excellence.",
    isSleepSegment: true,
    accentColor: "#5B6B8A",
    surface: "#EEEFF3",
    completionLabel: "I Completed My Power Down\u2122",
  },
}

// Movement types reused from the Movement Planner™
const MOVEMENT_TYPES = [
  "Walking",
  "Running",
  "Cycling",
  "Yoga",
  "Stretching",
  "Strength Training",
  "Swimming",
  "HIIT",
  "Pilates",
  "Dancing",
  "Hiking",
  "Other (Create My Own)",
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function PanelCard({
  surface,
  accentColor,
  children,
  className = "",
}: {
  surface: string
  accentColor: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${className}`}
      style={{ backgroundColor: surface, borderColor: `${accentColor}33` }}
    >
      {children}
    </div>
  )
}

function BlossomBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#78AD7D]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#78AD7D]">
      <span className="relative flex h-[10px] w-[10px] items-center justify-center">
        <span
          className="absolute inset-[-2px] animate-ping rounded-full"
          style={{ backgroundColor: "rgba(120,173,125,0.25)", animationDuration: "2.2s" }}
        />
        <span className="relative text-[9px] leading-none">&#x1F338;</span>
      </span>
      {label}
    </span>
  )
}

function SectionHeading({
  accentColor,
  children,
}: {
  accentColor: string
  children: React.ReactNode
}) {
  return (
    <p
      className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em]"
      style={{ color: accentColor }}
    >
      {children}
    </p>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface IdentityInstallationPanelProps {
  segmentId: string
  /** Whether the segment is currently live (isCurrent). */
  isCurrent?: boolean
  /** Whether the segment has already passed today (isPast). */
  isPast?: boolean
}

export function IdentityInstallationPanel({
  segmentId,
  isCurrent = false,
  isPast = false,
}: IdentityInstallationPanelProps) {
  const config = SEGMENT_CONFIGS[segmentId]
  if (!config) return null

  const { accentColor, surface } = config

  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>(isPast ? "done" : "idle")
  const [intentionId, setIntentionId] = useState<string | null>(null)

  // Intention form
  const [intentionNotes, setIntentionNotes] = useState("")
  const [movementType, setMovementType] = useState("")
  const [customMovement, setCustomMovement] = useState("")
  const [durationMinutes, setDurationMinutes] = useState(30)

  // Declaration
  const [declaration, setDeclaration] = useState("")
  const [declarationCopied, setDeclarationCopied] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)

  // Completion
  const [completionStatus, setCompletionStatus] = useState<CompletionStatus | "">("")
  const [actualMovementType, setActualMovementType] = useState("")
  const [actualDuration, setActualDuration] = useState(30)
  const [completionNotes, setCompletionNotes] = useState("")
  const [bedtime, setBedtime] = useState("")
  const [wakeTime, setWakeTime] = useState("")
  const [sleepQuality, setSleepQuality] = useState<number | null>(null)

  // Intention sleep planning (power-down only)
  const [plannedBedtime, setPlannedBedtime] = useState("")

  // Reflection
  const [reflection, setReflection] = useState("")

  const declarationRef = useRef<HTMLDivElement>(null)

  // ── Helpers ────────────────────────────────────────────────────────────────

  const effectiveMovementType =
    movementType === "Other (Create My Own)" ? customMovement : movementType

  // ── Step handlers ──────────────────────────────────────────────────────────

  const handleSaveIntention = useCallback(async () => {
    setStep("generating")
    setIsStreaming(true)
    setDeclaration("")

    try {
      // 1. Upsert intention
      const intentionRes = await fetch("/api/identity/intention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segment_id: segmentId,
          movement_type: config.isMovement ? effectiveMovementType : null,
          duration_minutes: config.isMovement ? durationMinutes : null,
          intention_notes: intentionNotes || null,
          bedtime: config.isSleepSegment ? (plannedBedtime || null) : null,
        }),
      })

      if (!intentionRes.ok) throw new Error("Failed to save intention")
      const { intention } = await intentionRes.json()
      setIntentionId(intention.id)

      // 2. Stream the declaration
      const declRes = await fetch("/api/identity/declaration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intention_id: intention.id,
          segment_id: segmentId,
          movement_type: effectiveMovementType,
          duration_minutes: durationMinutes,
          intention_notes: intentionNotes,
        }),
      })

      if (!declRes.ok || !declRes.body) throw new Error("Failed to generate declaration")

      const reader = declRes.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setDeclaration(accumulated)
      }

      setStep("declaration")
    } catch (err) {
      console.error("[IdentityInstallationPanel] declaration error:", err)
      setStep("intention")
    } finally {
      setIsStreaming(false)
    }
  }, [
    segmentId,
    config.isMovement,
    effectiveMovementType,
    durationMinutes,
    intentionNotes,
  ])

  const handleCopyDeclaration = useCallback(() => {
    navigator.clipboard.writeText(declaration).then(() => {
      setDeclarationCopied(true)
      setTimeout(() => setDeclarationCopied(false), 3000)
    })
  }, [declaration])

  const handleInstalled = useCallback(() => {
    setStep("installed")
  }, [])

  const handleStartCompletion = useCallback(() => {
    if (config.isMovement) {
      setActualMovementType(effectiveMovementType)
      setActualDuration(durationMinutes)
    }
    setStep("completing")
  }, [config.isMovement, effectiveMovementType, durationMinutes])

  const handleSaveCompletion = useCallback(async () => {
    if (!completionStatus) return
    setStep("reflecting")
    setReflection("")

    try {
      const res = await fetch("/api/identity/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intention_id: intentionId,
          segment_id: segmentId,
          completion_status: completionStatus,
          actual_movement_type: config.isMovement ? actualMovementType : null,
          actual_duration_mins: config.isMovement ? actualDuration : null,
          notes: completionNotes || null,
          bedtime: config.isSleepSegment ? bedtime : null,
          wake_time: config.isSleepSegment ? wakeTime : null,
          sleep_quality: config.isSleepSegment ? sleepQuality : null,
          intended_type: effectiveMovementType,
          intended_duration: durationMinutes,
        }),
      })

      if (!res.ok || !res.body) throw new Error("Failed to save completion")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setReflection(accumulated)
      }

      setStep("done")
    } catch (err) {
      console.error("[IdentityInstallationPanel] completion error:", err)
      setStep("completing")
    }
  }, [
    intentionId,
    segmentId,
    config.isMovement,
    config.isSleepSegment,
    completionStatus,
    actualMovementType,
    actualDuration,
    completionNotes,
    bedtime,
    wakeTime,
    sleepQuality,
    effectiveMovementType,
    durationMinutes,
  ])

  // ── Render ─────────────────────────────────────────────────────────────────

  // ── IDLE: CTA to start setting intention
  if (step === "idle") {
    return (
      <div className="mb-5">
        <PanelCard surface={surface} accentColor={accentColor}>
          <BlossomBadge label="Identity Installation System\u2122" />
          <p className="mt-3 text-sm leading-relaxed text-[#3D2E32]">
            {config.segmentDescription}
          </p>
          <Button
            className="mt-4 w-full text-white"
            style={{ backgroundColor: accentColor }}
            onClick={() => setStep("intention")}
          >
            {config.intentionLabel}
          </Button>
        </PanelCard>
      </div>
    )
  }

  // ── INTENTION: Set today's intention form
  if (step === "intention") {
    return (
      <div className="mb-5">
        <PanelCard surface={surface} accentColor={accentColor}>
          <BlossomBadge label="Step 1 of 3 \u2014 Today\u2019s Intention\u2122" />

          {config.isMovement ? (
            <div className="mt-4 space-y-4">
              <div>
                <SectionHeading accentColor={accentColor}>
                  Movement Type\u2122
                </SectionHeading>
                <Select value={movementType} onValueChange={setMovementType}>
                  <SelectTrigger className="mt-1 border-[#C8B89A]/50 bg-white/70">
                    <SelectValue placeholder="Choose your movement..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOVEMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {movementType === "Other (Create My Own)" && (
                  <input
                    type="text"
                    className="mt-2 w-full rounded-md border border-[#C8B89A]/50 bg-white/70 px-3 py-2 text-sm text-[#3D2E32] placeholder:text-[#9B8B8B] focus:outline-none focus:ring-1 focus:ring-[#78AD7D]"
                    placeholder="Describe your movement..."
                    value={customMovement}
                    onChange={(e) => setCustomMovement(e.target.value)}
                  />
                )}
              </div>

              <div>
                <SectionHeading accentColor={accentColor}>
                  Duration
                </SectionHeading>
                <div className="mt-1 flex items-center gap-3">
                  <button
                    onClick={() => setDurationMinutes((v) => Math.max(1, v - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C8B89A]/50 bg-white/70 text-sm text-[#3D2E32] hover:bg-white"
                    aria-label="Decrease duration"
                  >
                    &minus;
                  </button>
                  <span className="w-28 text-center text-sm font-semibold text-[#3D2E32]">
                    {durationMinutes} {durationMinutes === 1 ? "minute" : "minutes"}
                  </span>
                  <button
                    onClick={() => setDurationMinutes((v) => Math.min(30, v + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C8B89A]/50 bg-white/70 text-sm text-[#3D2E32] hover:bg-white"
                    aria-label="Increase duration"
                  >
                    +
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-[#9B8B8B]">
                  Maximum 30 minutes. The Movement Window\u2122 is intentionally protected.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div>
                <SectionHeading accentColor={accentColor}>
                  How do you intend to approach this segment today?
                </SectionHeading>
                <Textarea
                  className="mt-1 border-[#C8B89A]/50 bg-white/70 text-sm text-[#3D2E32] placeholder:text-[#9B8B8B] focus-visible:ring-[#78AD7D]"
                  placeholder="Optional — Cherry Blossom\u2122 will personalize your declaration either way..."
                  rows={3}
                  value={intentionNotes}
                  onChange={(e) => setIntentionNotes(e.target.value)}
                />
              </div>

              {/* Power Down — planned bedtime */}
              {config.isSleepSegment && (
                <div>
                  <SectionHeading accentColor={accentColor}>
                    Planned bedtime (optional)
                  </SectionHeading>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-md border border-[#C8B89A]/50 bg-white/70 px-3 py-2 text-sm text-[#3D2E32] focus:outline-none focus:ring-1"
                    style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                    value={plannedBedtime}
                    onChange={(e) => setPlannedBedtime(e.target.value)}
                  />
                  <p className="mt-1 text-[11px] text-[#9B8B8B]">
                    Cherry Blossom\u2122 will include this in your declaration and check in after.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#C8B89A]/50"
              onClick={() => setStep("idle")}
            >
              Back
            </Button>
            <Button
              className="flex-1 text-white"
              style={{ backgroundColor: accentColor }}
              disabled={
                config.isMovement
                  ? !movementType || (movementType === "Other (Create My Own)" && !customMovement.trim())
                  : false
              }
              onClick={handleSaveIntention}
            >
              Generate My Declaration\u2122
            </Button>
          </div>
        </PanelCard>
      </div>
    )
  }

  // ── GENERATING: streaming declaration
  if (step === "generating") {
    return (
      <div className="mb-5">
        <PanelCard surface={surface} accentColor={accentColor}>
          <BlossomBadge label="Cherry Blossom\u2122 is Writing Your Declaration\u2122" />
          <div className="mt-4 min-h-[80px]">
            {declaration ? (
              <p className="font-playfair text-[15px] italic leading-relaxed text-[#3D2E32]">
                {declaration}
                {isStreaming && (
                  <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-current align-text-bottom" />
                )}
              </p>
            ) : (
              <div className="flex items-center gap-2 text-sm text-[#9B8B8B]">
                <span
                  className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
                Preparing your personalized declaration...
              </div>
            )}
          </div>
        </PanelCard>
      </div>
    )
  }

  // ── DECLARATION: show full declaration + copy + Repeat After Me™
  if (step === "declaration") {
    const intentionSummary = config.isMovement
      ? `${effectiveMovementType} \u2014 ${durationMinutes} ${durationMinutes === 1 ? "minute" : "minutes"}`
      : intentionNotes || null

    return (
      <div className="mb-5 space-y-3">
        {/* Today's Intention summary */}
        {intentionSummary && (
          <div
            className="rounded-lg border px-4 py-2.5"
            style={{ backgroundColor: `${accentColor}0D`, borderColor: `${accentColor}33` }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: accentColor }}>
              Today\u2019s {config.isMovement ? "Movement Intention\u2122" : "Intention\u2122"}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[#3D2E32]">{intentionSummary}</p>
          </div>
        )}

        {/* Declaration card */}
        <PanelCard surface={surface} accentColor={accentColor} className="relative" ref={declarationRef as any}>
          <SectionHeading accentColor={accentColor}>
            &#x1F338; My {config.isMovement ? "Movement " : ""}Declaration\u2122
          </SectionHeading>
          <p className="mt-2 font-playfair text-[15px] italic leading-relaxed text-[#3D2E32]">
            {declaration}
          </p>

          {/* Copy button */}
          <button
            onClick={handleCopyDeclaration}
            className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
            style={{ color: declarationCopied ? "#78AD7D" : accentColor }}
          >
            {declarationCopied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Ready to share. Paste your declaration into today&apos;s Zoom chat.
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy My {config.isMovement ? "Movement " : ""}Declaration\u2122
              </>
            )}
          </button>
        </PanelCard>

        {/* Repeat After Me card */}
        <div
          className="rounded-xl border p-5"
          style={{
            background: `linear-gradient(135deg, ${surface} 0%, white 100%)`,
            borderColor: `${accentColor}44`,
          }}
        >
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: accentColor }}
          >
            &#x1F338; Repeat After Me\u2122
          </p>
          <p className="font-playfair text-[15px] italic leading-relaxed text-[#3D2E32]">
            {declaration}
          </p>
          <p className="mt-3 text-[12px] leading-relaxed text-[#6B5B63]">
            Repeat your declaration throughout today&apos;s{" "}
            {config.isMovement ? "Movement Window\u2122" : "segment"}. Every
            repetition reinforces the identity you are intentionally building.
          </p>
        </div>

        <Button
          className="w-full text-white"
          style={{ backgroundColor: accentColor }}
          onClick={handleInstalled}
        >
          I&apos;m Ready \u2014 Declaration Installed\u2122
        </Button>
      </div>
    )
  }

  // ── INSTALLED: declaration saved, show compact reminder + completion CTA
  if (step === "installed") {
    return (
      <div className="mb-5">
        <div
          className="rounded-xl border px-4 py-3.5"
          style={{ backgroundColor: surface, borderColor: `${accentColor}33` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: accentColor }}
              >
                &#x1F338; Declaration Installed\u2122
              </p>
              <p className="mt-1 line-clamp-2 font-playfair text-[13px] italic leading-relaxed text-[#3D2E32]">
                {declaration}
              </p>
            </div>
            <button
              onClick={() => setStep("declaration")}
              className="mt-0.5 shrink-0 text-[#9B8B8B] hover:text-[#3D2E32]"
              aria-label="Review declaration"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {isPast && (
            <Button
              className="mt-3 w-full text-white"
              style={{ backgroundColor: accentColor }}
              onClick={handleStartCompletion}
            >
              {config.completionLabel}
            </Button>
          )}
        </div>
      </div>
    )
  }

  // ── COMPLETING: record what actually happened
  if (step === "completing") {
    return (
      <div className="mb-5">
        <PanelCard surface={surface} accentColor={accentColor}>
          <BlossomBadge label="Step 3 of 3 \u2014 Record What Happened" />

          <div className="mt-4 space-y-4">
            {/* Completion status */}
            <div>
              <SectionHeading accentColor={accentColor}>
                Did you honor today&apos;s{" "}
                {config.isMovement ? "Movement Intention\u2122" : "intention"}?
              </SectionHeading>
              <div className="mt-2 flex flex-col gap-2">
                {(
                  [
                    { value: "honored", label: "Yes \u2014 I honored my intention" },
                    { value: "modified", label: "I adapted \u2014 different but still showed up" },
                    { value: "not-completed", label: "Not this time \u2014 I&apos;ll begin again tomorrow" },
                  ] as { value: CompletionStatus; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCompletionStatus(opt.value)}
                    className="rounded-lg border px-4 py-2.5 text-left text-sm transition-all"
                    style={{
                      backgroundColor:
                        completionStatus === opt.value ? `${accentColor}18` : "white",
                      borderColor:
                        completionStatus === opt.value ? accentColor : "#E8D5DE",
                      color: "#3D2E32",
                      fontWeight: completionStatus === opt.value ? 600 : 400,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Movement-specific actual fields */}
            {config.isMovement && completionStatus && completionStatus !== "not-completed" && (
              <>
                <div>
                  <SectionHeading accentColor={accentColor}>
                    What did you actually do?
                  </SectionHeading>
                  <Select value={actualMovementType} onValueChange={setActualMovementType}>
                    <SelectTrigger className="mt-1 border-[#C8B89A]/50 bg-white/70">
                      <SelectValue placeholder="Movement type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOVEMENT_TYPES.filter((t) => t !== "Other (Create My Own)").map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <SectionHeading accentColor={accentColor}>Actual duration</SectionHeading>
                  <div className="mt-1 flex items-center gap-3">
                    <button
                      onClick={() => setActualDuration((v) => Math.max(1, v - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C8B89A]/50 bg-white/70 text-sm hover:bg-white"
                      aria-label="Decrease duration"
                    >
                      &minus;
                    </button>
                    <span className="w-24 text-center text-sm font-semibold text-[#3D2E32]">
                      {actualDuration} min
                    </span>
                    <button
                      onClick={() => setActualDuration((v) => v + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C8B89A]/50 bg-white/70 text-sm hover:bg-white"
                      aria-label="Increase duration"
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Power Down sleep fields */}
            {config.isSleepSegment && (
              <>
                <div>
                  <SectionHeading accentColor={accentColor}>
                    Actual bedtime
                  </SectionHeading>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-md border border-[#C8B89A]/50 bg-white/70 px-3 py-2 text-sm text-[#3D2E32] focus:outline-none focus:ring-1"
                    style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                  />
                </div>

                <div>
                  <SectionHeading accentColor={accentColor}>
                    Wake time
                  </SectionHeading>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-md border border-[#C8B89A]/50 bg-white/70 px-3 py-2 text-sm text-[#3D2E32] focus:outline-none focus:ring-1"
                    style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                  />
                </div>

                <div>
                  <SectionHeading accentColor={accentColor}>
                    Sleep quality (1 = poor, 5 = excellent)
                  </SectionHeading>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setSleepQuality(n)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all"
                        style={{
                          backgroundColor: sleepQuality === n ? accentColor : "white",
                          borderColor: sleepQuality === n ? accentColor : "#C8B89A",
                          color: sleepQuality === n ? "white" : "#3D2E32",
                        }}
                        aria-label={`Sleep quality ${n}`}
                        aria-pressed={sleepQuality === n}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            <div>
              <SectionHeading accentColor={accentColor}>Notes (optional)</SectionHeading>
              <Textarea
                className="mt-1 border-[#C8B89A]/50 bg-white/70 text-sm text-[#3D2E32] placeholder:text-[#9B8B8B]"
                placeholder="Anything worth remembering from today..."
                rows={2}
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#C8B89A]/50"
              onClick={() => setStep("installed")}
            >
              Back
            </Button>
            <Button
              className="flex-1 text-white"
              style={{ backgroundColor: accentColor }}
              disabled={!completionStatus}
              onClick={handleSaveCompletion}
            >
              Save & Get Reflection
            </Button>
          </div>
        </PanelCard>
      </div>
    )
  }

  // ── REFLECTING: streaming Cherry Blossom™ reflection
  if (step === "reflecting") {
    return (
      <div className="mb-5">
        <PanelCard surface={surface} accentColor={accentColor}>
          <BlossomBadge label="Cherry Blossom\u2122 Reflection" />
          <div className="mt-3 min-h-[60px]">
            {reflection ? (
              <p className="font-playfair text-[14px] italic leading-relaxed text-[#3D2E32]">
                {reflection}
                <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-current align-text-bottom" />
              </p>
            ) : (
              <div className="flex items-center gap-2 text-sm text-[#9B8B8B]">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating your reflection...
              </div>
            )}
          </div>
        </PanelCard>
      </div>
    )
  }

  // ── DONE: show final reflection + reset option
  if (step === "done") {
    return (
      <div className="mb-5 space-y-3">
        {/* Compact installed declaration */}
        <div
          className="rounded-xl border px-4 py-3"
          style={{ backgroundColor: surface, borderColor: `${accentColor}33` }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: accentColor }}
          >
            &#x1F338; Declaration Installed\u2122
          </p>
          <p className="mt-1 font-playfair text-[13px] italic leading-relaxed text-[#3D2E32]">
            {declaration}
          </p>
        </div>

        {/* Cherry Blossom™ reflection */}
        {reflection && (
          <div
            className="rounded-xl border p-4"
            style={{
              background: `linear-gradient(135deg, ${surface} 0%, white 100%)`,
              borderColor: `${accentColor}44`,
            }}
          >
            <p
              className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: accentColor }}
            >
              &#x1F338; Cherry Blossom\u2122 Reflection
            </p>
            <p className="font-playfair text-[14px] italic leading-relaxed text-[#3D2E32]">
              {reflection}
            </p>
          </div>
        )}

        {/* Completed badge */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78AD7D]">
            <Check className="h-3.5 w-3.5" />
            Segment completed
          </span>
          <button
            onClick={() => {
              setStep("idle")
              setIntentionId(null)
              setDeclaration("")
              setCompletionStatus("")
              setCompletionNotes("")
              setReflection("")
              setMovementType("")
              setCustomMovement("")
              setDurationMinutes(30)
              setIntentionNotes("")
              setBedtime("")
              setWakeTime("")
              setSleepQuality(null)
              setPlannedBedtime("")
            }}
            className="flex items-center gap-1 text-[11px] text-[#9B8B8B] hover:text-[#3D2E32]"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>
    )
  }

  return null
}
