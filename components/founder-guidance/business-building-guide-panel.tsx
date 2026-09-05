"use client"

/**
 * Business-Building Guide™ panel (Phase 12)
 * ---------------------------------------------------------------------------
 * Renders the level-filtered `GuideSection[]`, plus "Show Me an Example" /
 * "Go Deeper" expanders and the conditional Co-Build™ division / AI Build™
 * boundaries / Founder Ownership Guidance™ sub-blocks — only the ones
 * applicable to the record's chosen Build Path™.
 */

import { useState } from "react"
import { GraduationCap, ChevronDown, Lightbulb, Compass } from "lucide-react"

import type {
  AiBuildBoundaries,
  BusinessBuildingGuide,
  CoBuildDivision,
  FounderOwnershipGuidance,
  KnowledgeStatus,
} from "@/lib/founder-guidance/types"

function StatusBadge({ status }: { status: KnowledgeStatus }) {
  if (status === "known") return null
  return (
    <span
      className={`ml-2 rounded-full px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider ${
        status === "inferred" ? "bg-brand-coral/15 text-brand-coral-dark" : "bg-black/[0.06] text-brand-ink-soft/70"
      }`}
    >
      {status === "inferred" ? "Best Guess" : "Not Yet Known"}
    </span>
  )
}

function SectionBlock({ title, body, items, status }: { title: string; body: string; items: string[]; status: KnowledgeStatus }) {
  if (status === "unknown" && !body && items.length === 0) {
    return (
      <div className="border-b border-brand-blush/50 pb-3 last:border-0 last:pb-0">
        <p className="font-sans text-xs font-bold text-brand-ink">
          {title}
          <StatusBadge status={status} />
        </p>
        <p className="mt-1 font-sans text-sm italic leading-relaxed text-brand-ink-soft/70">
          Not yet known for this move — nothing invented here.
        </p>
      </div>
    )
  }
  return (
    <div className="border-b border-brand-blush/50 pb-3 last:border-0 last:pb-0">
      <p className="font-sans text-xs font-bold text-brand-ink">
        {title}
        <StatusBadge status={status} />
      </p>
      {body && <p className="mt-1 font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">{body}</p>}
      {items.length > 0 && (
        <ul className="mt-1 space-y-1">
          {items.map((item, i) => (
            <li key={i} className="font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">
              • {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className="rounded-xl border border-brand-blush/60 bg-brand-cream/40 px-4 py-3">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft/80 mb-1.5">{title}</p>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="font-sans text-sm text-brand-ink">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CoBuildBlock({ division }: { division: CoBuildDivision }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <ListBlock title="You Do" items={division.founderSteps.map((s) => s.title)} />
      <ListBlock title="AI Does" items={division.aiSteps.map((s) => s.title)} />
      <ListBlock title="Together" items={division.togetherSteps.map((s) => s.title)} />
    </div>
  )
}

function AiBoundariesBlock({ boundaries }: { boundaries: AiBuildBoundaries }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <ListBlock title="AI Can Do" items={boundaries.aiCanDo} />
      <ListBlock title="Founder Must Approve" items={boundaries.founderMustApprove} />
    </div>
  )
}

function OwnershipBlock({ ownership }: { ownership: FounderOwnershipGuidance }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      <div className="rounded-xl border border-brand-blush/60 bg-brand-cream/40 px-4 py-3">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft/80 mb-1">What To Understand</p>
        <p className="font-sans text-sm text-brand-ink">{ownership.whatToUnderstand.text}</p>
      </div>
      <div className="rounded-xl border border-brand-blush/60 bg-brand-cream/40 px-4 py-3">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft/80 mb-1">What To Own</p>
        <p className="font-sans text-sm text-brand-ink">{ownership.whatToOwn.text}</p>
      </div>
      <ListBlock title="What Not To Do" items={ownership.whatNotToDo.items} />
      <ListBlock title="What To Hand Off" items={ownership.whatToHandOff.items} />
    </div>
  )
}

export function BusinessBuildingGuidePanel({
  guide,
  coBuildDivision,
  aiBuildBoundaries,
  ownershipGuidance,
  exampleText,
  exampleStatus,
  goDeeperItems,
}: {
  guide: BusinessBuildingGuide
  coBuildDivision?: CoBuildDivision | null
  aiBuildBoundaries?: AiBuildBoundaries | null
  ownershipGuidance?: FounderOwnershipGuidance
  exampleText?: string
  exampleStatus?: KnowledgeStatus
  goDeeperItems?: string[]
}) {
  const [exampleOpen, setExampleOpen] = useState(false)
  const [deeperOpen, setDeeperOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-brand-blush/60 bg-white px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-center gap-2.5 mb-4">
        <GraduationCap className="h-4 w-4 text-[#C13B6B]" aria-hidden />
        <h3 className="font-sans text-sm font-semibold text-brand-ink">Business-Building Guide™</h3>
      </div>

      <div className="space-y-3 mb-4">
        {guide.sections.map((s) => (
          <SectionBlock key={s.id} title={s.title} body={s.body} items={s.items} status={s.status} />
        ))}
      </div>

      {coBuildDivision && (
        <div className="mb-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">
            Co-Build™ Division Of Labor
          </p>
          <CoBuildBlock division={coBuildDivision} />
        </div>
      )}

      {aiBuildBoundaries && (
        <div className="mb-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">AI Build™ Boundaries</p>
          <AiBoundariesBlock boundaries={aiBuildBoundaries} />
        </div>
      )}

      {ownershipGuidance && (
        <div className="mb-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">
            Founder Ownership Guidance™
          </p>
          <OwnershipBlock ownership={ownershipGuidance} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {exampleText !== undefined && (
          <div className="rounded-xl border border-brand-blush/60 overflow-hidden">
            <button
              type="button"
              onClick={() => setExampleOpen((v) => !v)}
              aria-expanded={exampleOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
            >
              <span className="flex items-center gap-2 font-sans text-xs font-semibold text-brand-ink">
                <Lightbulb className="h-3.5 w-3.5 text-[#C13B6B]" aria-hidden />
                Show Me An Example
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-brand-ink-soft transition-transform ${exampleOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {exampleOpen && (
              <div className="border-t border-brand-blush/50 bg-brand-cream/40 px-4 py-3">
                {exampleText ? (
                  <p className="font-sans text-sm italic leading-relaxed text-brand-ink text-pretty">
                    {exampleText}
                    {exampleStatus === "inferred" && <StatusBadge status="inferred" />}
                  </p>
                ) : (
                  <p className="font-sans text-sm italic leading-relaxed text-brand-ink-soft/70">
                    No example available yet for this move.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {goDeeperItems !== undefined && (
          <div className="rounded-xl border border-brand-blush/60 overflow-hidden">
            <button
              type="button"
              onClick={() => setDeeperOpen((v) => !v)}
              aria-expanded={deeperOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
            >
              <span className="flex items-center gap-2 font-sans text-xs font-semibold text-brand-ink">
                <Compass className="h-3.5 w-3.5 text-[#C13B6B]" aria-hidden />
                Go Deeper
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-brand-ink-soft transition-transform ${deeperOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {deeperOpen && (
              <div className="border-t border-brand-blush/50 bg-brand-cream/40 px-4 py-3">
                {goDeeperItems.length > 0 ? (
                  <ul className="space-y-1">
                    {goDeeperItems.map((item, i) => (
                      <li key={i} className="font-sans text-sm leading-relaxed text-brand-ink text-pretty">
                        • {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-sans text-sm italic leading-relaxed text-brand-ink-soft/70">
                    Nothing further to add yet for this move.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
