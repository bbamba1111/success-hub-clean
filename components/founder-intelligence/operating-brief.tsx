"use client"

/**
 * Operating Brief™ — the surface of Founder Intelligence™ (Phase 5.9).
 *
 * Cherry Blossom™ is the voice; Founder Intelligence™ is the mind. This
 * component renders the deterministic Operating Brief™ assembled from live
 * Harmony Context™ — a calm, private-Chief-of-Staff preparation for today's
 * work. It reads context, calls the pure `assembleOperatingBrief` orchestrator,
 * and presents the result. No AI, no network, no client state.
 */

import Link from "next/link"
import { Sparkles, Compass, Users, Shield, GraduationCap, FileText, ArrowRight, ListTree, Target } from "lucide-react"
import { useHarmonyContext } from "@/components/harmony-context/harmony-context-provider"
import { assembleOperatingBrief } from "@/lib/founder-intelligence/founder-intelligence"
import { loadReadinessContextFromSnapshot } from "@/lib/founder-intelligence/load-readiness-context"

export function OperatingBrief() {
  const ctx = useHarmonyContext()

  // Wait for the engine + session to be ready before assembling anything.
  if (!ctx.ready) return null

  // Phase 4 — optional Excellence Intelligence™ evidence (ESA + Work-Life
  // Balance Audit™). Phase 6.2: read straight off the canonical
  // `HarmonyContextSnapshot` this provider already assembles — no separate
  // client-side load, no flash of incorrect content, no duplicate source of
  // truth. `assembleOperatingBrief` treats an empty `extra` exactly like
  // Phase 3's stage/destination-only behavior when the snapshot has no data.
  const readinessExtra = loadReadinessContextFromSnapshot(ctx.snapshot)

  const brief = assembleOperatingBrief(ctx, readinessExtra)

  return (
    <section
      aria-labelledby="operating-brief-heading"
      className="w-full bg-gradient-to-br from-white to-[#F5F1E8] px-4 pt-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        {/* Header — Cherry Blossom™ presenting Founder Intelligence™. */}
        <div className="text-center">
          <p className="inline-flex items-center gap-2 font-montserrat text-xs font-medium uppercase tracking-[0.18em] text-[#5B835F]">
            <Sparkles className="h-4 w-4" aria-hidden />
            Founder Intelligence™
          </p>
          <h2
            id="operating-brief-heading"
            className="mt-2 text-pretty font-playfair text-3xl font-medium text-[#3A2E33] sm:text-4xl"
          >
            {brief.greeting}
          </h2>
          <p className="mx-auto mt-2 font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860]">
            {brief.headline} · {brief.dayName}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-pretty font-montserrat text-[15px] leading-relaxed text-[#6B5860]">
            {brief.explanation}
          </p>
        </div>

        {!brief.hasDesignedWeek ? (
          <EmptyBrief />
        ) : (
          <div className="mt-8 space-y-6">
            {/* Anchor: intention + current segment + the one commitment. */}
            <div className="rounded-2xl border border-[#5B835F]/20 bg-white/70 px-6 py-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#5B835F]" aria-hidden />
                <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#5B835F]">
                  Current Operating Segment™
                </p>
              </div>
              <p className="mt-1.5 font-playfair text-2xl font-medium text-[#3A2E33]">{brief.segmentTitle}</p>

              {brief.intention && (
                <div className="mt-5">
                  <FieldLabel>Today&apos;s Weekly Intention™</FieldLabel>
                  <p className="mt-1 font-montserrat text-[15px] leading-relaxed text-[#3A2E33]">{brief.intention}</p>
                </div>
              )}

              {brief.dailyNonNegotiable && (
                <div className="mt-4 rounded-xl border border-[#C13B6B]/15 bg-[#C13B6B]/[0.04] px-4 py-3">
                  <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#C13B6B]">
                    Today&apos;s Daily Non-Negotiable™
                  </p>
                  <p className="mt-1 font-montserrat text-[15px] leading-relaxed text-[#3A2E33]">
                    {brief.dailyNonNegotiable}
                  </p>
                </div>
              )}
            </div>

            {/* Today's Executive Leadership Team™ */}
            {brief.executives.length > 0 && (
              <BriefBlock icon={Users} title="Today's Executive Team">
                <div className="space-y-3">
                  {brief.executives.map((e) => (
                    <RecItem key={e.id} name={e.name} meta={e.title} reason={e.reason} />
                  ))}
                </div>
                <BlockLink href="/executive-leadership-team" label="Meet your Executive Leadership Team™" />
              </BriefBlock>
            )}

            {/* Professional Advisors™ that may become relevant */}
            {brief.advisors.length > 0 && (
              <BriefBlock icon={Shield} title="Advisors On Call">
                <div className="space-y-3">
                  {brief.advisors.map((a) => (
                    <RecItem key={a.id} name={a.name} meta={a.title} reason={a.reason} />
                  ))}
                </div>
                <BlockLink href="/professional-advisory-network" label="View your Professional Advisory Network™" />
              </BriefBlock>
            )}

            {/* One recommended Executive Insight™ */}
            {brief.insight && (
              <BriefBlock icon={GraduationCap} title="Today's Executive Insight™">
                <RecItem
                  name={brief.insight.title}
                  meta={brief.insight.estimatedDuration}
                  reason={brief.insight.reason}
                  description={brief.insight.description}
                />
                <BlockLink href="/harmony-business-academy" label="Open Harmony Business Academy™" />
              </BriefBlock>
            )}

            {/* Recommended Deliverables™ */}
            {brief.deliverables.length > 0 && (
              <BriefBlock icon={FileText} title="Recommended Deliverables™">
                <div className="space-y-3">
                  {brief.deliverables.map((d) => (
                    <RecItem
                      key={d.id}
                      name={d.name}
                      meta={d.estimatedTime}
                      reason={d.reason}
                      description={d.description}
                    />
                  ))}
                </div>
                <BlockLink href="/output-architecture" label="Explore your Deliverable Output Architecture™" />
              </BriefBlock>
            )}

            {/* Readiness Capabilities™ — Excellence Intelligence™, reasoned through Readiness Relevance™ (Phase 4) */}
            {brief.readinessCapabilities.length > 0 && (
              <BriefBlock icon={Target} title="Build Ahead Of Need">
                <div className="space-y-3">
                  {brief.readinessCapabilities.map((r) => (
                    <div key={r.id} className="rounded-xl bg-[#F5F1E8]/60 px-4 py-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-playfair text-lg font-medium text-[#3A2E33]">{r.title}</p>
                        {r.relevanceStatus === "priority" && (
                          <span className="shrink-0 rounded-full bg-[#C13B6B]/10 px-2.5 py-0.5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C13B6B]">
                            Priority
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 font-montserrat text-[13px] italic leading-relaxed text-[#5B835F]">
                        {r.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </BriefBlock>
            )}

            {/* How this brief was assembled — transparent, deterministic trace. */}
            <details className="group rounded-2xl border border-black/[0.06] bg-white/50 px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860]">
                  <ListTree className="h-4 w-4 text-[#5B835F]" aria-hidden />
                  How Cherry Blossom™ assembled this
                </span>
                <span className="font-montserrat text-xs text-[#6B5860] transition-transform group-open:rotate-90" aria-hidden>
                  ▸
                </span>
              </summary>
              <ol className="mt-4 space-y-2.5">
                {brief.reasoning.map((step, i) => (
                  <li key={step.system} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5B835F]/10 font-montserrat text-[11px] font-semibold text-[#4c6f50]">
                      {i + 1}
                    </span>
                    <p className="font-montserrat text-sm leading-relaxed text-[#3A2E33]">
                      <span className="font-semibold">{step.system}</span>
                      <span className="text-[#6B5860]"> — {step.note}</span>
                    </p>
                  </li>
                ))}
              </ol>
            </details>

            {/* Adaptation note — same principles, adapted communication. */}
            <p className="text-center font-montserrat text-xs leading-relaxed text-[#6B5860]">
              Written in your {brief.communicationStyleName} style, in {brief.languageName}.
              {brief.isEnglishFallback && " Shown in English until translation is activated."} The recommendation is the
              same for every founder — only how it&apos;s explained changes.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/* -- Presentational subcomponents ------------------------------------------ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860]">{children}</p>
  )
}

function BriefBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#5B835F]/15 bg-white/70 px-6 py-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#5B835F]" aria-hidden />
        <h3 className="font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#5B835F]">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function RecItem({
  name,
  meta,
  reason,
  description,
}: {
  name: string
  meta: string
  reason: string
  description?: string
}) {
  return (
    <div className="rounded-xl bg-[#F5F1E8]/60 px-4 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-playfair text-lg font-medium text-[#3A2E33]">{name}</p>
        <span className="shrink-0 font-montserrat text-xs font-medium text-[#6B5860]">{meta}</span>
      </div>
      {description && (
        <p className="mt-1 font-montserrat text-sm leading-relaxed text-[#6B5860]">{description}</p>
      )}
      <p className="mt-1.5 font-montserrat text-[13px] italic leading-relaxed text-[#5B835F]">{reason}</p>
    </div>
  )
}

function BlockLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group mt-4 inline-flex items-center gap-1.5 font-montserrat text-sm font-semibold text-[#5B835F] hover:text-[#4c6f50]"
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  )
}

function EmptyBrief() {
  return (
    <div className="glass-panel mt-8 rounded-2xl px-6 py-8 text-center">
      <p className="text-pretty font-playfair text-xl font-medium italic text-[#3A2E33]">
        Your brief begins with a designed week.
      </p>
      <p className="mx-auto mt-2 max-w-md font-montserrat text-sm leading-relaxed text-[#6B5860]">
        Once you design your week, Founder Intelligence™ will prepare a daily Operating Brief™ — your
        executive team, today&apos;s insight, and the deliverables that fit your stage.
      </p>
      <Link
        href="/begin"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#5B835F] px-5 py-2.5 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#4c6f50]"
      >
        Design My Week™
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  )
}
