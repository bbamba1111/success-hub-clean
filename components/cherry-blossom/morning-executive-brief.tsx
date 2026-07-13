"use client"

/**
 * Morning Executive Brief™ — Component Suite (Phase 7.1)
 * ---------------------------------------------------------------------------
 * Cherry Blossom™ as Executive Chief of Staff & Executive Conductor™.
 *
 * Design principles:
 *   - White canvas. Black Playfair Display headings. Montserrat body.
 *   - Stained-glass frosted panels — soft blush/coral tints on white.
 *   - No chat UI. No speech bubbles. No prompt boxes.
 *   - Conversation Without Chat™: guided interactions, context cards,
 *     decision confirmations, reflection moments.
 *   - Every panel is an editorial section — like a luxury executive dossier.
 *   - Coral left-spine accent signals Cherry Blossom's voice throughout.
 *
 * This component reads from HarmonyContextValue via the engine.
 * It never reaches into registries directly — always reads assembled brief.
 */

import { useState } from "react"
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import { useHarmonyContext } from "@/components/harmony-context/harmony-context-provider"
import { assembleMorningExecutiveBrief } from "@/lib/cherry-blossom/executive-brief"
import type { MorningExecutiveBrief } from "@/lib/cherry-blossom/executive-brief"

/* ===========================================================================
 * Main entry component
 * ======================================================================== */

export function MorningExecutiveBriefPanel() {
  const ctx = useHarmonyContext()

  if (!ctx.ready) return <BriefSkeleton />

  const brief = assembleMorningExecutiveBrief(ctx)

  return (
    <section
      aria-labelledby="executive-brief-heading"
      className="w-full bg-white px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header — Cherry Blossom's identity statement */}
        <BriefHeader brief={brief} />

        {/* The brief body — stained-glass panels */}
        <ExecutiveFocusPanel brief={brief} />
        <HighestLeveragePanel brief={brief} />
        {brief.assignedExecutive && <AssignedExecutivePanel brief={brief} />}
        {brief.lifeProtection.length > 0 && <LifeProtectionPanel brief={brief} />}
        {brief.celebration && <CelebrationPanel brief={brief} />}
        {brief.gentleIntervention && <GentleInterventionPanel brief={brief} />}

        {/* Explainability — always present, collapsed by default */}
        <ExplainabilityPanel brief={brief} />

        {/* Action confirmation — Shall we begin? */}
        <BriefConfirmation brief={brief} />
      </div>
    </section>
  )
}

/* ===========================================================================
 * Panel: Brief Header
 * ======================================================================== */

function BriefHeader({ brief }: { brief: MorningExecutiveBrief }) {
  return (
    <div className="border-b border-black/[0.08] pb-8">
      {/* Cherry Blossom identity */}
      <div className="flex items-center gap-3">
        <div className="relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#E26C73]/30 shadow-sm">
          <img
            src="/images/logo.png"
            alt="Cherry Blossom"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-[#E26C73]">
            Cherry Blossom™
          </p>
          <p className="font-montserrat text-xs tracking-wide text-[#6B5860]/70">
            Chief of Staff &amp; Executive Conductor™
          </p>
        </div>
      </div>

      {/* Greeting */}
      <h1
        id="executive-brief-heading"
        className="mt-5 font-playfair text-3xl font-medium leading-tight text-[#1A1A1A] text-balance sm:text-4xl"
      >
        {brief.greeting}
      </h1>

      {/* Opening statement */}
      <p className="mt-3 font-montserrat text-[16px] leading-relaxed text-[#3A2E33] text-pretty sm:text-[17px]">
        {brief.openingStatement}
      </p>

      {/* Current Operating Segment™ tag */}
      {brief.currentSegmentTitle && (
        <div className="mt-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#5B835F]/25 bg-[#5B835F]/[0.06] px-4 py-1.5 font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#5B835F]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[#5B835F]"
            />
            {brief.currentSegmentTitle}
          </span>
        </div>
      )}
    </div>
  )
}

/* ===========================================================================
 * Panel: Executive Focus
 * ======================================================================== */

function ExecutiveFocusPanel({ brief }: { brief: MorningExecutiveBrief }) {
  return (
    <StainedGlassPanel accent="coral" label="Today's Executive Focus™">
      <p className="font-playfair text-xl font-medium leading-snug text-[#1A1A1A] text-balance sm:text-2xl">
        {brief.executiveFocus.statement}
      </p>
    </StainedGlassPanel>
  )
}

/* ===========================================================================
 * Panel: Highest-Leverage Outcome
 * ======================================================================== */

function HighestLeveragePanel({ brief }: { brief: MorningExecutiveBrief }) {
  const { highestLeverageOutcome: outcome } = brief
  return (
    <StainedGlassPanel accent="green" label="Today's Highest-Leverage Outcome™">
      <div className="space-y-3">
        <p className="font-playfair text-xl font-semibold leading-snug text-[#1A1A1A] text-balance">
          {outcome.title}
        </p>
        <p className="font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
          {outcome.rationale}
        </p>
        <div className="pt-1">
          <span className="inline-block rounded-full border border-[#5B835F]/25 bg-[#5B835F]/[0.06] px-3 py-1 font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#5B835F]">
            {outcome.pillar}
          </span>
        </div>
      </div>
    </StainedGlassPanel>
  )
}

/* ===========================================================================
 * Panel: Assigned Executive
 * ======================================================================== */

function AssignedExecutivePanel({ brief }: { brief: MorningExecutiveBrief }) {
  const exec = brief.assignedExecutive!
  return (
    <StainedGlassPanel accent="coral" label="Today's Executive™">
      <div className="flex items-start gap-4">
        {/* Executive identity block */}
        <div className="flex-1 space-y-2">
          <div>
            <p className="font-playfair text-xl font-semibold text-[#1A1A1A]">
              {exec.name}
            </p>
            <p className="font-montserrat text-xs font-medium uppercase tracking-[0.12em] text-[#E26C73]">
              {exec.title}
            </p>
          </div>
          <p className="font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
            {exec.todaysMission}
          </p>
        </div>
      </div>
    </StainedGlassPanel>
  )
}

/* ===========================================================================
 * Panel: Life Protection™
 * ======================================================================== */

function LifeProtectionPanel({ brief }: { brief: MorningExecutiveBrief }) {
  return (
    <StainedGlassPanel accent="rose" label="Life Protection™">
      <div className="space-y-3">
        {brief.lifeProtection.map((notice, i) => (
          <div
            key={i}
            className="flex items-start gap-3"
          >
            <span
              aria-hidden
              className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#C13B6B]"
            />
            <p className="font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
              {notice.message}
            </p>
          </div>
        ))}
      </div>
    </StainedGlassPanel>
  )
}

/* ===========================================================================
 * Panel: Celebration™
 * ======================================================================== */

function CelebrationPanel({ brief }: { brief: MorningExecutiveBrief }) {
  if (!brief.celebration) return null
  const cel = brief.celebration
  return (
    <StainedGlassPanel accent="green" label="Recognized Progress™">
      <div className="space-y-2">
        <p className="font-playfair text-lg font-semibold text-[#1A1A1A]">
          {cel.achievement}
        </p>
        <p className="font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
          {cel.message}
        </p>
      </div>
    </StainedGlassPanel>
  )
}

/* ===========================================================================
 * Panel: Gentle Intervention™
 * ======================================================================== */

function GentleInterventionPanel({ brief }: { brief: MorningExecutiveBrief }) {
  if (!brief.gentleIntervention) return null
  const gi = brief.gentleIntervention
  return (
    <StainedGlassPanel accent="amber" label="A Quiet Observation™">
      <div className="space-y-3">
        <p className="font-playfair text-lg font-semibold text-[#1A1A1A]">
          {gi.concern}
        </p>
        <p className="font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
          {gi.message}
        </p>
        {gi.suggestedAction && (
          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#C9A24B]">
            Suggested: {gi.suggestedAction}
          </p>
        )}
      </div>
    </StainedGlassPanel>
  )
}

/* ===========================================================================
 * Panel: Explainability™ (collapsed by default — executive-grade transparency)
 * ======================================================================== */

function ExplainabilityPanel({ brief }: { brief: MorningExecutiveBrief }) {
  const [open, setOpen] = useState(false)
  const ex = brief.explainability

  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="explainability-content"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-black/[0.02]"
      >
        <div className="flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#5B835F]" aria-hidden />
          <span className="font-montserrat text-xs font-semibold uppercase tracking-[0.16em] text-[#5B835F]">
            Why This Brief™
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[#6B5860]" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#6B5860]" aria-hidden />
        )}
      </button>

      {open && (
        <div
          id="explainability-content"
          className="border-t border-black/[0.06] px-6 pb-6 pt-5 space-y-5"
        >
          <ExplainSection label="This recommendation exists because">
            <p className="font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
              {ex.focusReason}
            </p>
          </ExplainSection>

          <ExplainSection label="Governing Constitutional Principle™">
            <p className="font-montserrat text-[14px] leading-relaxed text-[#3A2E33]">
              {ex.governingPrinciple}
            </p>
          </ExplainSection>

          {ex.signals.length > 0 && (
            <ExplainSection label="Context Signals Detected™">
              <ul className="space-y-2">
                {ex.signals.map((signal, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B835F]"
                    />
                    <span className="font-montserrat text-[14px] leading-relaxed text-[#3A2E33]">
                      {signal}
                    </span>
                  </li>
                ))}
              </ul>
            </ExplainSection>
          )}

          <ExplainSection label="Expected Outcome™">
            <p className="font-montserrat text-[14px] leading-relaxed text-[#3A2E33] text-pretty">
              {ex.expectedOutcome}
            </p>
          </ExplainSection>
        </div>
      )}
    </div>
  )
}

function ExplainSection({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-2 font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860]">
        {label}
      </p>
      {children}
    </div>
  )
}

/* ===========================================================================
 * Brief Confirmation — "Shall we begin?"
 * ======================================================================== */

function BriefConfirmation({ brief }: { brief: MorningExecutiveBrief }) {
  const isCeoWorkday = brief.currentSegmentTitle
    .toLowerCase()
    .includes("ceo")

  const primaryHref = isCeoWorkday
    ? "/executive-leadership-team"
    : brief.weekDesigned
      ? "/sunday-design-day"
      : "/sunday-design-day"

  const primaryLabel = isCeoWorkday
    ? "Begin CEO Workday™"
    : brief.weekDesigned
      ? "Continue Sunday Design Day™"
      : "Design Your Week™"

  return (
    <div className="border-t border-black/[0.08] pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          href={primaryHref}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5B835F] px-7 py-3.5 font-montserrat text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4c6f50]"
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
        <a
          href="/live-today"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E26C73]/40 px-7 py-3.5 font-montserrat text-sm font-semibold text-[#C13B6B] transition-colors hover:bg-[#F6E4E7]/50"
        >
          View Today&apos;s Full Design
        </a>
      </div>
    </div>
  )
}

/* ===========================================================================
 * Shared: StainedGlassPanel — the editorial accent card
 * Accent variants:
 *   coral  → Cherry Blossom's voice (coral/blush)
 *   green  → Growth, progress, action (#5B835F)
 *   rose   → Life Protection™ (deep rose)
 *   amber  → Gentle Intervention™ (warm amber)
 * ======================================================================== */

type AccentVariant = "coral" | "green" | "rose" | "amber"

const ACCENT_STYLES: Record<
  AccentVariant,
  { spine: string; label: string; bg: string; border: string }
> = {
  coral: {
    spine: "bg-[#E26C73]",
    label: "text-[#E26C73]",
    bg: "bg-[#FDF6F6]",
    border: "border-[#E26C73]/20",
  },
  green: {
    spine: "bg-[#5B835F]",
    label: "text-[#5B835F]",
    bg: "bg-[#F4F8F4]",
    border: "border-[#5B835F]/20",
  },
  rose: {
    spine: "bg-[#C13B6B]",
    label: "text-[#C13B6B]",
    bg: "bg-[#FDF4F7]",
    border: "border-[#C13B6B]/20",
  },
  amber: {
    spine: "bg-[#C9A24B]",
    label: "text-[#C9A24B]",
    bg: "bg-[#FDFAF3]",
    border: "border-[#C9A24B]/25",
  },
}

function StainedGlassPanel({
  accent,
  label,
  children,
}: {
  accent: AccentVariant
  label: string
  children: React.ReactNode
}) {
  const styles = ACCENT_STYLES[accent]
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} shadow-sm`}
    >
      {/* Coral/accent left spine */}
      <div
        aria-hidden
        className={`absolute inset-y-0 left-0 w-[3px] ${styles.spine}`}
      />

      <div className="px-7 py-6">
        {/* Panel label */}
        <p
          className={`mb-3 font-montserrat text-xs font-semibold uppercase tracking-[0.18em] ${styles.label}`}
        >
          {label}
        </p>
        {children}
      </div>
    </div>
  )
}

/* ===========================================================================
 * Skeleton loader — renders while context assembles
 * ======================================================================== */

function BriefSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading executive brief"
      className="w-full bg-white px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-black/[0.06]" />
        <div className="h-10 w-3/4 animate-pulse rounded-lg bg-black/[0.06]" />
        <div className="h-6 w-full animate-pulse rounded-lg bg-black/[0.04]" />
        <div className="mt-6 h-32 w-full animate-pulse rounded-2xl bg-black/[0.04]" />
        <div className="h-28 w-full animate-pulse rounded-2xl bg-black/[0.04]" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-black/[0.04]" />
      </div>
    </section>
  )
}
