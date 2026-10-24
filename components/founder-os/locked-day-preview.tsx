"use client"

/**
 * LockedDayPreview — the "inspirationally locked" experience for Monday
 * Installation members viewing Tuesday–Thursday.
 *
 * Product principle: never hide these days and never use paywall language
 * ("Access Denied", "Premium Required"). Instead present each day as a beautiful
 * destination that is *Included in the Work-Life Balance Business Week™*, with a
 * progress indicator that reinforces how far the member has already come.
 *
 * Pure presentation: it renders from the access logic in `@/lib/membership/access`.
 */

import { motion } from "framer-motion"
import { Lock, Check, Leaf, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BUSINESS_WORKSPACES, type DayDefinition, type WeekProgressStep } from "@/lib/membership/access"

interface LockedDayPreviewProps {
  day: DayDefinition
  progress: WeekProgressStep[]
  /** Called when the member chooses to continue installing the full week. */
  onUpgrade?: () => void
  /** Called when the member wants to talk it through with Cherry Blossom. */
  onAskCherryBlossom?: () => void
}

function ProgressRow({ step }: { step: WeekProgressStep }) {
  const icon =
    step.state === "open" ? (
      <Check className="h-4 w-4 text-[#78AD7D]" aria-hidden />
    ) : step.state === "freedom" ? (
      <Leaf className="h-4 w-4 text-[#78AD7D]" aria-hidden />
    ) : (
      <Lock className="h-4 w-4 text-[#C13B6B]" aria-hidden />
    )

  return (
    <li
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
        step.isToday ? "bg-[#C13B6B]/8 ring-1 ring-[#C13B6B]/20" : ""
      }`}
    >
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center">{icon}</span>
      <span className="flex-1 text-sm text-[#3A2E33]">
        <span className="font-semibold">{step.weekday}</span>
        <span className="text-muted-foreground"> · {step.title}</span>
      </span>
      {step.isToday && (
        <span className="shrink-0 rounded-full bg-[#C13B6B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Today
        </span>
      )}
    </li>
  )
}

export function LockedDayPreview({ day, progress, onUpgrade, onAskCherryBlossom }: LockedDayPreviewProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Preview hero — keeps the day title, tagline, and purpose visible */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl border border-[#78AD7D]/25 bg-[#FBF7F0]"
      >
        <div className="px-6 py-8 text-center sm:px-10 sm:py-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#78AD7D]">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            {day.weekday} Preview
          </span>
          <h2 className="mt-4 text-balance font-playfair text-3xl font-semibold leading-tight text-[#1C161A] sm:text-4xl">
            {day.title}
          </h2>
          <p className="mt-2 font-montserrat text-base font-medium text-[#78AD7D]">{day.tagline}</p>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-[#4A3A42]">{day.description}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#78AD7D]/30 bg-white/70 px-4 py-1.5 text-sm font-medium text-[#3A6845]">
            <Leaf className="h-4 w-4" aria-hidden />
            Included in the Work-Life Balance Business Week™
          </p>
        </div>
      </motion.div>

      {/* Blurred workspaces — "that's where I'm headed", not "I can't see anything" */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {BUSINESS_WORKSPACES.map((name) => (
          <div
            key={name}
            className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-[#78AD7D]/20 bg-white/70 px-5 py-4"
          >
            <span className="select-none font-medium text-[#3A2E33] blur-[3px]" aria-hidden>
              {name}
            </span>
            <Lock className="h-4 w-4 shrink-0 text-[#78AD7D]" aria-hidden />
            <span className="sr-only">{name} — included in the Work-Life Balance Business Week™</span>
          </div>
        ))}
      </div>

      {/* Progress indicator — reinforces the journey already underway */}
      <div className="mt-6 rounded-2xl border border-[#78AD7D]/20 bg-white/70 p-5">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#78AD7D]">Your Current Experience</h3>
        <ul className="space-y-1">
          {progress.map((step) => (
            <ProgressRow key={step.weekday} step={step} />
          ))}
        </ul>
      </div>

      {/* Cherry Blossom invitation + transformation-focused upgrade */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-6 rounded-2xl border border-[#C13B6B]/20 bg-[#C13B6B]/5 p-6"
      >
        <p className="flex items-start gap-2 text-pretty leading-relaxed text-[#3A2E33]">
          <span aria-hidden className="text-lg">
            🌸
          </span>
          <span>
            You&apos;re currently participating in <strong>Make Time For More On Mondays™</strong>. {day.weekday}
            &apos;s experience continues the installation by helping you build momentum throughout the week. Whenever
            you&apos;re ready, I&apos;d love to continue the journey with you inside the full{" "}
            <strong>Work-Life Balance Business Week™</strong>.
          </span>
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            onClick={onUpgrade}
            className="bg-[#78AD7D] px-6 font-semibold text-white hover:bg-[#6a9c6f]"
          >
            Continue Installing Your Business Week™
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden />
          </Button>
          <Button
            variant="outline"
            onClick={onAskCherryBlossom}
            className="border-[#78AD7D]/40 bg-transparent font-semibold text-[#3A6845] hover:bg-[#78AD7D]/10"
          >
            Ask Cherry Blossom
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
