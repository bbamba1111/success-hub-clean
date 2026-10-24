"use client"

import { useState, useEffect, useCallback } from "react"
import type { InstallationProfile } from "@/lib/installation/types"
import { EMPTY_INSTALLATION_PROFILE } from "@/lib/installation/types"
import {
  getInstallationProfile,
  saveInstallationProfile,
  completeInstallation,
} from "@/lib/installation/installation-store"

import { StepWelcome } from "@/components/installation/step-welcome"
import { StepCurrentReality } from "@/components/installation/step-current-reality"
import { StepDesiredOutcomes } from "@/components/installation/step-desired-outcomes"
import { StepFounderProfile } from "@/components/installation/step-founder-profile"
import { StepOperatingRhythm } from "@/components/installation/step-operating-rhythm"
import { StepComplete } from "@/components/installation/step-complete"

// 0 = Welcome (no progress bar), 1-4 = Steps, 5 = Complete
const TOTAL_STEPS = 4

const STEP_LABELS = [
  "Current Reality",
  "Desired Outcomes",
  "Founder Profile",
  "Operating Rhythm",
]

export function InstallationClient() {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<InstallationProfile>({ ...EMPTY_INSTALLATION_PROFILE })
  const [completing, setCompleting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load saved progress on mount
  useEffect(() => {
    const saved = getInstallationProfile()
    if (saved.lastSavedAt) {
      setProfile(saved)
      // Resume from last step only if not already complete
      if (!saved.completedAt && saved.lastStep > 0) {
        setStep(saved.lastStep)
      } else if (saved.completedAt) {
        setStep(5)
      }
    }
    setMounted(true)
  }, [])

  // Autosave whenever profile or step changes
  const autosave = useCallback(
    (updatedProfile: InstallationProfile, currentStep: number) => {
      saveInstallationProfile({ ...updatedProfile, lastStep: currentStep })
    },
    [],
  )

  const updateProfile = useCallback(
    (patch: Partial<InstallationProfile>) => {
      setProfile((prev) => {
        const next = { ...prev, ...patch }
        autosave(next, step)
        return next
      })
    },
    [step, autosave],
  )

  const goToStep = (next: number) => {
    setStep(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await completeInstallation(profile)
      goToStep(5)
    } finally {
      setCompleting(false)
    }
  }

  if (!mounted) return null

  // ── Step content ──────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepWelcome onContinue={() => goToStep(1)} />
      case 1:
        return (
          <StepCurrentReality
            answers={profile.currentReality}
            onChange={(currentReality) => updateProfile({ currentReality })}
            onContinue={() => goToStep(2)}
            onBack={() => goToStep(0)}
          />
        )
      case 2:
        return (
          <StepDesiredOutcomes
            selected={profile.desiredOutcomes}
            onChange={(desiredOutcomes) => updateProfile({ desiredOutcomes })}
            onContinue={() => goToStep(3)}
            onBack={() => goToStep(1)}
          />
        )
      case 3:
        return (
          <StepFounderProfile
            answers={profile.founderProfile}
            onChange={(founderProfile) => updateProfile({ founderProfile })}
            onContinue={() => goToStep(4)}
            onBack={() => goToStep(2)}
          />
        )
      case 4:
        return (
          <StepOperatingRhythm
            commitments={profile.commitments}
            onChange={(commitments) => updateProfile({ commitments })}
            onContinue={handleComplete}
            onBack={() => goToStep(3)}
          />
        )
      case 5:
        return <StepComplete profile={profile} />
      default:
        return null
    }
  }

  const progressStep = step >= 1 && step <= 4 ? step : null

  return (
    // Full-screen canvas with soft radial background
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white">
      {/* Radial background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(91,131,95,0.07) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(232,143,162,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Petal ambience — only on welcome and complete */}
      {(step === 0 || step === 5) && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="petal"
              style={{
                left: `${10 + i * 15}%`,
                animationDuration: `${7 + i * 1.3}s`,
                animationDelay: `${i * 1.1}s`,
                "--petal-drift-x": `${20 + i * 8}px`,
                "--petal-opacity": "0.5",
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <div className="relative mx-auto w-full max-w-2xl px-4 pb-20 pt-8 sm:px-6">
        {/* Progress bar — shown for steps 1–4 only */}
        {progressStep !== null && (
          <div className="mb-8 flex flex-col gap-3">
            {/* Step label */}
            <div className="flex items-center justify-between">
              <p className="font-sans text-xs font-medium text-[#6B5860]">
                Step {progressStep} of {TOTAL_STEPS} — {STEP_LABELS[progressStep - 1]}
              </p>
              <p className="font-sans text-xs text-[#6B5860]/50">
                {Math.round((progressStep / TOTAL_STEPS) * 100)}% complete
              </p>
            </div>
            {/* Thin bar */}
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[#5B835F] transition-all duration-500 ease-out"
                style={{ width: `${(progressStep / TOTAL_STEPS) * 100}%` }}
                role="progressbar"
                aria-valuenow={progressStep}
                aria-valuemin={1}
                aria-valuemax={TOTAL_STEPS}
                aria-label={`Installation progress: step ${progressStep} of ${TOTAL_STEPS}`}
              />
            </div>
            {/* Segment dots */}
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={[
                    "h-1 flex-1 rounded-full transition-colors duration-300",
                    i < progressStep ? "bg-[#5B835F]" : "bg-black/[0.08]",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        )}

        {/* Harmony Lane wordmark — top left, steps 0–4 */}
        {step < 5 && (
          <div className="mb-8 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cherry-blossom-ai-logo.jpg"
              alt=""
              className="h-6 w-6 rounded-full object-cover"
              aria-hidden
            />
            <span className="font-sans text-sm font-semibold text-[#3A2E33]">Harmony Lane™</span>
          </div>
        )}

        {/* Step card */}
        <div
          key={step}
          className="harmony-panel px-6 py-8 sm:px-10 sm:py-10"
          style={{
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          {completing ? (
            <div className="flex flex-col items-center gap-6 py-12 text-center">
              <div className="blossom-glow">
                <div className="h-16 w-16 overflow-hidden rounded-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/cherry-blossom-ai-logo.jpg" alt="" className="h-full w-full object-cover" aria-hidden />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="ds-eyebrow">Installing</p>
                <p className="font-display text-xl font-semibold text-[#3A2E33]">
                  Activating your operating system...
                </p>
                <p className="font-sans text-sm text-[#6B5860]">
                  Cherry Blossom™ is calibrating to your answers.
                </p>
              </div>
              <div className="loading-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : (
            renderStep()
          )}
        </div>
      </div>
    </div>
  )
}
