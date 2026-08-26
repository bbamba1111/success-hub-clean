"use client"

/**
 * CeoWorkdayWorkspace™ — Phase 8.1
 * ---------------------------------------------------------------------------
 * ⚠️ ORPHANED — only imported by the also-orphaned `TodaysOperatingSystem`
 * (see that file's header). Not mounted by any live page. The live CEO
 * Workday™ segment is `TodaysCeoWorkdayCard` → `FounderGpsWorkspace`, which
 * uses the canonical `deriveNextBestMove()` engine, not `deriveGpsRecommendation()`
 * from `lib/founder-gps/engine.ts`. Do not build new work on this component.
 *
 * The Executive Operating Environment™ for the 4-Hour CEO Workday™.
 *
 * Phase 8.1 upgrades:
 *   - Founder GPS™ is now LIVE in all three phases (no more placeholders)
 *   - Executive Intelligence Hour™ shows the GPS strategic recommendation
 *   - Human Zone of Genius™ shows the GPS outcome recommendation
 *   - Business Optimization Hour™ shows the GPS friction recommendation
 *   - Executive AI Team™ architecture cards replace generic placeholders
 *   - Decision Explainability™ is accessible in every GPS recommendation
 *   - Business Asset Intelligence™ appears in every applicable recommendation
 *   - Whole-Life Context™ awareness hook is declared
 *
 * Architecture:
 *   deriveGpsRecommendation() → GpsRecommendationCard → visible in each phase
 *   getExecutiveTeamCards()   → ExecutiveTeamCard row at the bottom
 */

import { useState } from "react"
import {
  ArrowRight,
  BookOpen,
  Brain,
  Building2,
  ChevronDown,
  Layers,
  Settings2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import type { HarmonySegment } from "@/lib/harmony-context/types"
import {
  HONOR_OPTIONS,
  getTodayResponses,
  setTodayResponse,
  type HonorResponse,
} from "@/lib/sunday-design-day/non-negotiable-log"
import { useHarmonyContext } from "@/components/harmony-context/harmony-context-provider"
import { GpsRecommendationCard } from "@/components/live-today/gps-recommendation-card"
import {
  deriveGpsRecommendation,
  getExecutiveTeamCards,
} from "@/lib/founder-gps/engine"

// ─── Types ──────────────────────────────────────────────────────────────────

type ExecutiveOutcomeStatus = "completed" | "progress" | "blocked" | null

type WorkspaceState = {
  executiveOutcome: string
  businessAsset: string
  outcomeStatus: ExecutiveOutcomeStatus
  phase1Open: boolean
  phase2Open: boolean
  phase3Open: boolean
}

// ─── Constants ───────────────────────────────────────────────────────────────

const OUTCOME_EXAMPLES = [
  "Secure one strategic partnership",
  "Record a Signature Talk™",
  "Create an Evergreen Webinar™",
  "Build a client onboarding system",
  "Hire an Executive Assistant",
  "Finalize a keynote presentation",
  "Launch a referral campaign",
]

const ASSET_EXAMPLES: Record<string, string> = {
  "Record a Signature Talk™": "Evergreen Speaking Asset™",
  "Create an Evergreen Webinar™": "Evergreen Webinar™",
  "Build a client onboarding system": "Business Process™",
  "Launch a referral campaign": "Marketing Asset™",
  "Secure one strategic partnership": "Strategic Alliance™",
  "Finalize a keynote presentation": "Sales Asset™",
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CeoWorkdayWorkspace({
  segment,
  isCurrent,
}: {
  segment: HarmonySegment
  isCurrent: boolean
}) {
  const ctx = useHarmonyContext()
  const savedResponse = getTodayResponses()[segment.id] ?? null

  const [state, setState] = useState<WorkspaceState>({
    executiveOutcome: "",
    businessAsset: "",
    outcomeStatus: savedResponse as ExecutiveOutcomeStatus | null,
    phase1Open: true,
    phase2Open: isCurrent,
    phase3Open: false,
  })

  const [outcomeStatus, setOutcomeStatus] = useState<ExecutiveOutcomeStatus>(
    savedResponse as ExecutiveOutcomeStatus | null
  )

  function togglePhase(phase: "phase1Open" | "phase2Open" | "phase3Open") {
    setState((s) => ({ ...s, [phase]: !s[phase] }))
  }

  function chooseOutcome(value: "completed" | "progress" | "blocked") {
    setOutcomeStatus(value)
    setTodayResponse(segment.id, value as HonorResponse)
  }

  // Live GPS recommendations for all three phases
  const gpsPhase1 = deriveGpsRecommendation("executive-intelligence", ctx)
  const gpsPhase2 = deriveGpsRecommendation("human-zone-of-genius", ctx)
  const gpsPhase3 = deriveGpsRecommendation("business-optimization", ctx)

  // Executive AI Team™ architecture cards
  const execTeamCards = getExecutiveTeamCards()

  return (
    <article className="overflow-hidden rounded-3xl shadow-lg">

      {/* ── Hero: Cherry Blossom Executive Suite™ ─────────────────────────── */}
      <div
        className="relative min-h-[320px] overflow-hidden"
        style={{
          backgroundImage: "url('/images/executive-suite.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        {/* Layered overlay for legibility while preserving the suite atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

        {/* NOW badge — top right */}
        {isCurrent && (
          <div className="absolute top-5 right-5 z-20">
            <span className="rounded-full bg-[#E26C73] px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-md">
              Now Active
            </span>
          </div>
        )}

        {/* Cherry Blossom stained-glass card floating over the suite */}
        <div className="relative z-10 flex flex-col items-start justify-end h-full min-h-[320px] px-6 pb-7 pt-8 sm:px-8">
          <div className="w-full max-w-lg">
            <div
              className="rounded-2xl border border-white/20 px-6 py-5 backdrop-blur-md shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.07) 100%)",
              }}
            >
              {/* CB identity */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/30 shadow-sm">
                  <img
                    src="/images/logo.png"
                    alt="Cherry Blossom"
                    className="h-full w-full object-cover"
                  />
                </span>
                <div>
                  <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#f9a8b8]">
                    Cherry Blossom™
                  </p>
                  <p className="font-montserrat text-[10px] text-white/60">
                    Chief of Staff &amp; Executive Conductor™
                  </p>
                </div>
              </div>

              <p className="font-montserrat text-base font-bold text-white leading-snug text-balance mb-2">
                Welcome to your CEO Workday™.
              </p>
              <p className="font-montserrat text-[13px] leading-relaxed text-white/80 text-pretty">
                You are entering your Executive Suite™. Everything you have installed in your
                Operating System™ has led to this moment. Four hours. One outcome. Full focus.
              </p>
            </div>

            {/* Suite label */}
            <div className="mt-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-white/20" />
              <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
                4-Hour CEO Workday™ · Executive Operating Environment™
              </p>
              <div className="h-px flex-1 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Three-Phase Workspace ─────────────────────────────────────────── */}
      <div className="bg-[#F9F5EE] divide-y divide-black/[0.06]">

        {/* ─ Phase 1: Executive Intelligence Hour™ ─────────────────────── */}
        <ExecutivePhase
          number="01"
          title="Executive Intelligence Hour™"
          time="1:00 PM – 2:00 PM"
          accent="#5B835F"
          accentLight="rgba(91,131,95,0.08)"
          icon={Brain}
          open={state.phase1Open}
          onToggle={() => togglePhase("phase1Open")}
          executiveQuestion="What is today's highest-leverage opportunity?"
          cherryBlossomQuote="Before we begin executing, let's make sure we're working on the opportunity that creates the greatest long-term value."
        >
          {/* Founder GPS™ — Live Recommendation (Phase 8.1) */}
          <GpsRecommendationCard card={gpsPhase1} />

          {/* Practice — Intention Declaration */}
          {segment.declaration && (
            <DeclarationPanel declaration={segment.declaration} />
          )}
        </ExecutivePhase>

        {/* ─ Phase 2: Human Zone of Genius™ ────────────────────────────── */}
        <ExecutivePhase
          number="02"
          title="Human Zone of Genius™"
          time="2:00 PM – 4:00 PM"
          accent="#C13B6B"
          accentLight="rgba(193,59,107,0.06)"
          icon={Target}
          open={state.phase2Open}
          onToggle={() => togglePhase("phase2Open")}
          executiveQuestion="What is the one meaningful outcome only I can create today?"
          cherryBlossomQuote="This is your Human Zone of Genius™. Protect it. Everything else can wait."
        >
          {/* Founder GPS™ — Live Recommendation (Phase 8.1) */}
          <GpsRecommendationCard card={gpsPhase2} />

          {/* Today's One Executive Outcome™ */}
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#6B5860] mb-2">
              Today&apos;s One Executive Outcome™
            </p>
            <input
              type="text"
              value={state.executiveOutcome}
              onChange={(e) => setState((s) => ({ ...s, executiveOutcome: e.target.value }))}
              placeholder="What is the single most important outcome you will create today?"
              className="w-full rounded-xl border border-black/[0.1] bg-white/80 px-4 py-3 font-montserrat text-[14px] text-[#1A1A1A] placeholder:text-[#6B5860]/50 focus:border-[#C13B6B]/40 focus:outline-none focus:ring-2 focus:ring-[#C13B6B]/15"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {OUTCOME_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => {
                    setState((s) => ({
                      ...s,
                      executiveOutcome: ex,
                      businessAsset: ASSET_EXAMPLES[ex] ?? "",
                    }))
                  }}
                  className="rounded-full border border-[#C13B6B]/20 bg-white/60 px-3 py-1 font-montserrat text-[11px] font-medium text-[#C13B6B] transition-colors hover:bg-[#C13B6B]/10"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Business Asset™ — horizontal progression */}
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#6B5860] mb-2">
              Business Asset™ Being Created
            </p>
            <input
              type="text"
              value={state.businessAsset}
              onChange={(e) => setState((s) => ({ ...s, businessAsset: e.target.value }))}
              placeholder="What compounding asset does this outcome create?"
              className="w-full rounded-xl border border-black/[0.1] bg-white/80 px-4 py-3 font-montserrat text-[14px] text-[#1A1A1A] placeholder:text-[#6B5860]/50 focus:border-[#C13B6B]/40 focus:outline-none focus:ring-2 focus:ring-[#C13B6B]/15"
            />
            {/* Horizontal Outcome → Asset progression */}
            {state.executiveOutcome && state.businessAsset && (
              <div className="mt-4 flex items-stretch gap-0 overflow-hidden rounded-xl border border-[#C13B6B]/20 bg-white/60">
                <div className="flex-1 px-4 py-3">
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B5860]/60 mb-1">
                    Today&apos;s Executive Outcome™
                  </p>
                  <p className="font-montserrat text-[13px] font-semibold text-[#1A1A1A] leading-snug">
                    {state.executiveOutcome}
                  </p>
                </div>
                <div className="flex items-center justify-center px-2 bg-[#C13B6B]/[0.06]">
                  <ArrowRight className="h-4 w-4 text-[#C13B6B]" aria-hidden />
                </div>
                <div className="flex-1 px-4 py-3 bg-[#C13B6B]/[0.04]">
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#C13B6B]/70 mb-1">
                    Tomorrow&apos;s Business Asset™
                  </p>
                  <p className="font-montserrat text-[13px] font-semibold text-[#C13B6B] leading-snug">
                    {state.businessAsset}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Deep Work Rules */}
          <div className="rounded-xl border border-[#C13B6B]/15 bg-[#C13B6B]/[0.04] px-5 py-4">
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#C13B6B] mb-3">
              Protect the Human Zone of Genius™
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
              {[
                "No multitasking",
                "No meetings",
                "No notifications",
                "No email",
                "No context switching",
                "Full presence only",
              ].map((rule) => (
                <div key={rule} className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#C13B6B]/60 shrink-0" />
                  <span className="font-montserrat text-[12px] text-[#6B5860]">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Tracking™ — Phase 7 architecture, Phase 9 data */}
          <ArchitectureCard
            icon={TrendingUp}
            label="Progress Tracking™"
            description="Founder GPS™ will track execution momentum across CEO Workdays here — streaks, completion rates, and asset velocity."
            accent="#C13B6B"
          />
        </ExecutivePhase>

        {/* ─ Phase 3: Business Optimization Hour™ ──────────────────────── */}
        <ExecutivePhase
          number="03"
          title="Business Optimization Hour™"
          time="4:00 PM – 5:00 PM"
          accent="#C9A24B"
          accentLight="rgba(201,162,75,0.07)"
          icon={Settings2}
          open={state.phase3Open}
          onToggle={() => togglePhase("phase3Open")}
          executiveQuestion="What can I improve today so tomorrow becomes easier?"
          cherryBlossomQuote="Today's work becomes tomorrow's advantage when you improve the way your business operates."
        >
          {/* Founder GPS™ — Live Recommendation (Phase 8.1) */}
          <GpsRecommendationCard card={gpsPhase3} />

          {/* Business Optimization architecture cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <ArchitectureCard
              icon={Users}
              label="Delegation Opportunities™"
              description="Identify work that belongs in your team's hands, not yours."
              accent="#C9A24B"
            />
            <ArchitectureCard
              icon={Layers}
              label="AI Opportunities™"
              description="Recurring tasks ready to be delegated to AI."
              accent="#C9A24B"
            />
            <ArchitectureCard
              icon={BookOpen}
              label="SOP Opportunities™"
              description="Third-repetition processes ready to be documented."
              accent="#C9A24B"
            />
            <ArchitectureCard
              icon={Building2}
              label="Business Operating Manual™"
              description="Your growing library of installed Business Operating Rules™."
              accent="#C9A24B"
            />
          </div>

          {/* Reflection — Did today's Executive Outcome™ move forward? */}
          <div className="rounded-2xl border border-black/[0.08] bg-white/70 px-5 py-5">
            <p className="font-montserrat text-sm font-bold text-[#1A1A1A] mb-1">
              Did today&apos;s Executive Outcome™ move forward?
            </p>
            <p className="font-montserrat text-[12px] text-[#6B5860] mb-4">
              Cherry Blossom™ records this to build your Founder GPS™ pattern intelligence.
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Executive Outcome reflection">
              {(
                [
                  { value: "completed", label: "Completed", color: "#5B835F" },
                  { value: "progress", label: "Meaningful Progress", color: "#C9A24B" },
                  { value: "blocked", label: "Blocked", color: "#C13B6B" },
                ] as const
              ).map((opt) => {
                const selected = outcomeStatus === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseOutcome(opt.value)}
                    className="rounded-full px-5 py-2 font-montserrat text-sm font-semibold transition-colors"
                    style={
                      selected
                        ? { background: opt.color, color: "#fff" }
                        : {
                            background: "rgba(255,255,255,0.7)",
                            color: "#6B5860",
                            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                          }
                    }
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {outcomeStatus && (
              <p className="mt-3 font-montserrat text-[12px] leading-relaxed text-[#6B5860]/80 text-pretty">
                {outcomeStatus === "completed"
                  ? "Outstanding. Cherry Blossom\u2122 has recorded a completed Executive Outcome\u2122. This pattern builds CEO confidence and business momentum."
                  : outcomeStatus === "progress"
                  ? "Meaningful progress is a success. Cherry Blossom\u2122 has recorded this. Consistent forward movement compounds over time."
                  : "Cherry Blossom\u2122 has recorded this without judgment. Understanding what blocked you is the first step to removing the obstacle. Founder GPS\u2122 will learn from this."}
              </p>
            )}
          </div>
        </ExecutivePhase>

      </div>

      {/* ── Executive AI Team™ Architecture Cards ─────────────────────────── */}
      <div className="bg-[#F3EDE3] border-t border-black/[0.06] px-6 py-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <img
              src="/images/logo.png"
              alt=""
              className="h-5 w-5 rounded-full object-cover border border-white/50"
              aria-hidden
            />
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#5B835F]">
              Cherry Blossom™
            </p>
          </div>
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#3A2E33] mb-1">
            Your Executive AI Team™
          </p>
          <p className="font-montserrat text-[12px] leading-relaxed text-[#6B5860] text-pretty">
            Your full Executive Leadership Team™ is active in the architecture. Each executive&apos;s intelligence
            will come online progressively as Harmony Lane™ evolves.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {execTeamCards.map((card) => (
            <ExecutiveTeamCard key={card.executiveId} card={card} />
          ))}
        </div>
      </div>

      {/* ── Closed For Business™ footer ───────────────────────────────────── */}
      <div className="bg-[#2C3E2D] px-6 py-5 text-center">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-white/40 mb-1">
          End of Day Protocol™
        </p>
        <p className="font-playfair text-lg font-medium italic text-white/90 text-balance">
          Today&apos;s business is officially Closed For Business™.
        </p>
        <p className="mt-1 font-montserrat text-[12px] text-white/50">
          Tomorrow deserves a fully restored CEO.
        </p>
      </div>
    </article>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ExecutivePhase({
  number,
  title,
  time,
  accent,
  accentLight,
  icon: Icon,
  open,
  onToggle,
  executiveQuestion,
  cherryBlossomQuote,
  children,
}: {
  number: string
  title: string
  time: string
  accent: string
  accentLight: string
  icon: React.ElementType
  open: boolean
  onToggle: () => void
  executiveQuestion: string
  cherryBlossomQuote: string
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Phase header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-6 py-5 text-left transition-colors hover:bg-black/[0.02]"
        aria-expanded={open}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: accentLight }}
          >
            <Icon className="h-4 w-4" style={{ color: accent }} aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: accent }}
              >
                Phase {number}
              </span>
              <span className="font-montserrat text-[10px] text-[#6B5860]/50">·</span>
              <span className="font-montserrat text-[10px] text-[#6B5860]/60">{time}</span>
            </div>
            <h3 className="font-montserrat text-base font-bold text-[#1A1A1A] leading-tight">
              {title}
            </h3>
          </div>
        </div>
        <ChevronDown
          className="shrink-0 h-4 w-4 text-[#6B5860]/50 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        />
      </button>

      {/* Phase workspace */}
      {open && (
        <div
          className="px-6 pb-7 space-y-5 border-t border-black/[0.05]"
          style={{ background: accentLight }}
        >
          {/* Executive Question™ */}
          <div className="mt-5">
            <p
              className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
              style={{ color: `${accent}99` }}
            >
              Executive Question™
            </p>
            <p className="font-playfair text-xl font-medium italic leading-snug text-[#1A1A1A] text-balance">
              {executiveQuestion}
            </p>
          </div>

          {/* Cherry Blossom™ phase guidance */}
          <div
            className="rounded-xl border px-5 py-3"
            style={{ borderColor: `${accent}25`, background: `${accent}08` }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <img
                src="/images/logo.png"
                alt=""
                className="h-5 w-5 rounded-full object-cover border border-white/50"
                aria-hidden
              />
              <p
                className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: accent }}
              >
                Cherry Blossom™
              </p>
            </div>
            <p className="font-montserrat text-[13px] italic leading-relaxed text-[#3A2E33] text-pretty">
              &ldquo;{cherryBlossomQuote}&rdquo;
            </p>
          </div>

          {children}
        </div>
      )}
    </div>
  )
}

function DeclarationPanel({ declaration }: { declaration: string }) {
  return (
    <div className="rounded-xl border border-[#5B835F]/25 bg-[#5B835F]/[0.05] px-5 py-4">
      <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.16em] text-[#5B835F] mb-2">
        Practice™ — Your Intention Declaration™
      </p>
      <p className="font-montserrat text-[14px] font-medium italic leading-relaxed text-[#3A2E33] text-pretty">
        &ldquo;{declaration}&rdquo;
      </p>
      <p className="mt-2 font-montserrat text-[11px] leading-relaxed text-[#6B5860]/70">
        This is the operating standard you committed to. It defines how you show up during your CEO Workday™ today.
      </p>
    </div>
  )
}

/** Architecture card — replaces dashed placeholder blocks. */
function ArchitectureCard({
  icon: Icon,
  label,
  description,
  accent,
}: {
  icon: React.ElementType
  label: string
  description: string
  accent: string
}) {
  return (
    <div
      className="rounded-xl border bg-white/40 px-4 py-3"
      style={{ borderColor: `${accent}25` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3.5 w-3.5" style={{ color: `${accent}90` }} aria-hidden />
        <p
          className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ color: `${accent}CC` }}
        >
          {label}
        </p>
      </div>
      <p className="font-montserrat text-[11px] text-[#6B5860]/70 leading-relaxed">{description}</p>
    </div>
  )
}

/** Executive AI Team™ card — signals readiness without claiming live AI. */
function ExecutiveTeamCard({
  card,
}: {
  card: ReturnType<typeof getExecutiveTeamCards>[number]
}) {
  return (
    <div className="rounded-xl border border-[#5B835F]/15 bg-white/50 px-4 py-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-montserrat text-[11px] font-bold text-[#3A2E33] leading-tight">
            {card.executiveName}
          </p>
          <p className="font-montserrat text-[9px] text-[#6B5860]/70 mt-0.5">{card.executiveTitle}</p>
        </div>
        <span className="shrink-0 rounded-full border border-[#5B835F]/25 px-2 py-0.5 font-montserrat text-[8px] font-bold uppercase tracking-[0.1em] text-[#5B835F]/70">
          Architecture
        </span>
      </div>
      <p className="font-montserrat text-[11px] leading-relaxed text-[#6B5860] text-pretty">
        {card.preparing}
      </p>
    </div>
  )
}
