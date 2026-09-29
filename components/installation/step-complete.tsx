"use client"

import Image from "next/image"
import Link from "next/link"
import type { InstallationProfile } from "@/lib/installation/types"

interface StepCompleteProps {
  profile: InstallationProfile
}

export function StepComplete({ profile }: StepCompleteProps) {
  const firstName = profile.founderProfile.firstName?.trim() || "Founder"
  const stage = profile.founderProfile.founderStage ?? "launch"
  const STAGE_LABELS: Record<string, string> = {
    launch: "Launch™",
    growth: "Growth™",
    scale: "Scale™",
    legacy: "Legacy™",
  }

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      {/* Celebration visual */}
      <div className="relative">
        <div className="blossom-glow">
          <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-[#5B835F]/20 ring-offset-4">
            <Image
              src="/cherry-blossom-ai-logo.jpg"
              alt="Cherry Blossom™"
              fill
              className="object-cover"
            />
          </div>
        </div>
        {/* Green check ring */}
        <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#5B835F] ring-2 ring-white">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Headline */}
      <div className="flex flex-col gap-3">
        <p className="ds-eyebrow">Installation Complete</p>
        <h1 className="ds-page-title max-w-lg text-balance">
          Welcome to Harmony Lane™, {firstName}
        </h1>
        <p className="font-sans text-base leading-relaxed text-[#6B5860] max-w-md mx-auto">
          Your Founder Operating System™ has been installed. Cherry Blossom™ is ready, your {STAGE_LABELS[stage]} operating context is active, and your first recommendations are waiting.
        </p>
      </div>

      {/* What is now active */}
      <div className="w-full max-w-sm rounded-xl border border-[#5B835F]/20 bg-[#5B835F]/[0.04] px-6 py-5 text-left">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#5B835F] mb-3">
          Now active
        </p>
        <ul className="flex flex-col gap-2.5">
          {[
            "Founder GPS™ — daily personalized recommendations",
            "Cherry Blossom™ — your AI operating guide",
            `Business Stage: ${STAGE_LABELS[stage]}`,
            "Harmony Memory™ — your operating history begins",
            "Adaptive Workspace™ — calibrated to your profile",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B835F]" aria-hidden />
              <span className="font-sans text-sm text-[#3A2E33]">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTAs */}
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Link href="/" className="ds-btn-primary w-full py-3.5 text-base">
          Go to My Workspace
        </Link>
        <Link
          href="/?open=cherry-blossom"
          className="ds-btn-ghost w-full py-3.5 text-base border border-black/[0.08]"
        >
          Meet Cherry Blossom™
        </Link>
      </div>

      <p className="font-sans text-xs text-[#6B5860]/50 max-w-xs">
        Your installation is saved privately on this device. You can update your profile at any time from My Harmony.
      </p>
    </div>
  )
}
