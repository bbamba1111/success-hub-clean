"use client"

/**
 * OperatingPlanner™ — the ONE reusable workspace every Operating Segment uses
 * (Phase 3B.1). It always opens BELOW the Dynamic Hero as a full-width
 * workspace; the hero stays orientation-only and never contains the planner.
 *
 * Every planner shares the same five-section structure so the platform feels
 * calm and consistent:
 *   1. Cherry Blossom Guidance™   — contextual orientation for the segment
 *   2. Today's Operating Rule™    — the one PERSISTED section (Supabase)
 *   3. Operating Planner™         — the practice checklist for the segment
 *   4. Harmony Soundscapes™       — placeholder (built later)
 *   5. Win the Segment™           — placeholder (reflection UI only, no save)
 *
 * The CEO Workday adds five placeholder execution blocks inside section 3.
 * No AI, scoring, soundscapes, or reflection persistence in this pass.
 */

import { useState } from "react"
import { CheckCircle2, ChevronDown, Circle, Music, Sparkles, Trophy } from "lucide-react"
import type { BlockId } from "@/operating-engine"
import { PLANNER_CONFIG } from "@/components/operating-planner/planner-config"
import { OperatingRuleCard } from "@/components/operating-planner/operating-rule-card"

interface OperatingPlannerProps {
  blockId: BlockId
}

/** Small section shell so every block reads with one calm rhythm. */
function PlannerSection({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: React.ElementType
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-ds-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/12">
          <Icon className="ds-icon-sm text-brand-green-dark" aria-hidden />
        </span>
        <div>
          <p className="ds-eyebrow">{eyebrow}</p>
          <h3 className="ds-section-title text-base">{title}</h3>
        </div>
      </div>
      <div className="mt-3.5">{children}</div>
    </section>
  )
}

/** A calm placeholder body for sections whose internals arrive in a later pass. */
function ComingSoon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
      <span className="ds-badge-neutral">Coming soon</span>
      <span>{children}</span>
    </div>
  )
}

/** Local-only checklist (planning aid). Not persisted this pass. */
function PlannerChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false))
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={item}>
          <button
            type="button"
            onClick={() => setChecked((prev) => prev.map((c, idx) => (idx === i ? !c : c)))}
            className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-brand-green/[0.06]"
          >
            {checked[i] ? (
              <CheckCircle2 className="mt-0.5 ds-icon-sm text-brand-green" aria-hidden />
            ) : (
              <Circle className="mt-0.5 ds-icon-sm text-muted-foreground/50" aria-hidden />
            )}
            <span className={checked[i] ? "text-muted-foreground line-through" : "text-brand-ink"}>{item}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/** CEO Workday's five placeholder execution blocks (collapsed accordions). */
function CeoBlocks({ blocks }: { blocks: NonNullable<ReturnType<() => typeof PLANNER_CONFIG["ceo-workday"]>>["ceoBlocks"] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  if (!blocks) return null
  return (
    <div className="mt-4 space-y-2">
      <p className="ds-eyebrow">CEO Workday Blocks</p>
      {blocks.map((block) => {
        const open = openId === block.id
        return (
          <div key={block.id} className="overflow-hidden rounded-xl border border-border bg-background">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : block.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-brand-green/[0.05]"
            >
              <span className="text-sm font-semibold text-brand-ink">{block.title}</span>
              <ChevronDown
                className={`ds-icon-sm text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {open && (
              <div className="border-t border-border px-4 py-3">
                <p className="text-sm text-muted-foreground">{block.description}</p>
                <div className="mt-2">
                  <span className="ds-badge-neutral">Coming soon</span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function OperatingPlanner({ blockId }: OperatingPlannerProps) {
  const config = PLANNER_CONFIG[blockId]
  const [open, setOpen] = useState(true)
  if (!config) return null

  const isCeo = blockId === "ceo-workday"

  return (
    // Same max width as the panoramic segment cards below (max-w-7xl). Sits
    // fully BELOW the hero inside the soft sage band — no overlap.
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-[4.5rem] pt-8 sm:px-6 lg:px-8">
      {/* Collapsible planner panel — an ultra-light soft sage card resting on
          the white band, so it never competes with the hero or nearby headings. */}
      <div className="overflow-hidden rounded-3xl border border-black/5 bg-[#F8FBF6] shadow-ds">
        {/* Header doubles as the collapse toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`operating-planner-body-${blockId}`}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left sm:px-7"
        >
          <span>
            <span className="ds-eyebrow">Operating Planner™</span>
            <span className="mt-0.5 block font-display text-2xl font-semibold tracking-tight text-brand-green sm:text-3xl">
              {config.title}
            </span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-brand-ink-soft">
            <ChevronDown className={`ds-icon transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
            <span className="sr-only">{open ? "Collapse planner" : "Expand planner"}</span>
          </span>
        </button>

        {open && (
          <div id={`operating-planner-body-${blockId}`} className="px-5 pb-9 sm:px-7">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* 1 · Cherry Blossom Guidance™ */}
              <PlannerSection icon={Sparkles} eyebrow="Cherry Blossom Guidance™" title="Your guidance for this segment">
                <p className="font-serif text-[15px] italic leading-relaxed text-brand-ink-soft">{config.guidance}</p>
              </PlannerSection>

              {/* 2 · Today's Operating Rule™ (persisted) — spans its own cell */}
              <div className="lg:row-span-2">
                <OperatingRuleCard segmentId={blockId} defaultRuleType={config.defaultRuleType} allowAllTypes={isCeo} />
              </div>

              {/* 3 · Operating Planner™ (checklist, + CEO blocks) */}
              <PlannerSection icon={CheckCircle2} eyebrow="Operating Planner™" title="Plan this segment">
                <PlannerChecklist items={config.checklist} />
                {isCeo && <CeoBlocks blocks={config.ceoBlocks} />}
              </PlannerSection>
            </div>

            {/* 4 & 5 · placeholders, full width below */}
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <PlannerSection icon={Music} eyebrow="Harmony Soundscapes™" title="Set the mood">
                <ComingSoon>Curated soundscapes to help you find focus and flow arrive in a later pass.</ComingSoon>
              </PlannerSection>

              <PlannerSection icon={Trophy} eyebrow="Win the Segment™" title="Close with a win">
                <ComingSoon>A short reflection to capture your win for this segment is coming soon.</ComingSoon>
              </PlannerSection>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OperatingPlanner
