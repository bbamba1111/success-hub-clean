"use client"

import Image from "next/image"

interface StepWelcomeProps {
  onContinue: () => void
}

export function StepWelcome({ onContinue }: StepWelcomeProps) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      {/* Cherry Blossom avatar with blossom-glow */}
      <div className="blossom-glow">
        <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-[#E88FA2]/30 ring-offset-4">
          <Image
            src="/cherry-blossom-ai-logo.jpg"
            alt="Cherry Blossom™ — your Harmony Lane operating guide"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Headline */}
      <div className="flex flex-col gap-3">
        <p className="ds-eyebrow">Harmony Lane™</p>
        <h1 className="ds-page-title max-w-lg text-balance">
          Your Founder Operating System™ is ready to install
        </h1>
        <p className="font-sans text-base leading-relaxed text-[#6B5860] max-w-md mx-auto">
          In the next 5–7 minutes, I will learn about your current reality, your desired
          outcomes, and how you want to operate — then your Harmony Lane™ environment will
          activate fully around your answers.
        </p>
      </div>

      {/* What to expect */}
      <div className="w-full max-w-sm rounded-xl border border-black/[0.06] bg-[#F9F6F2] px-6 py-5 text-left">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#5B835F] mb-3">
          What we will cover
        </p>
        <ol className="flex flex-col gap-2">
          {[
            "Your current work-life reality",
            "The outcomes that matter most to you",
            "Your business profile",
            "Your operating rhythm commitments",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5B835F]/10 font-sans text-[10px] font-bold text-[#5B835F]">
                {i + 1}
              </span>
              <span className="font-sans text-sm text-[#3A2E33]">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <button
        onClick={onContinue}
        className="ds-btn-primary w-full max-w-sm py-3.5 text-base"
      >
        Begin Installation
      </button>

      <p className="font-sans text-xs text-[#6B5860]/60">
        Your answers are saved privately on this device. Nothing is sent to a server.
      </p>
    </div>
  )
}
