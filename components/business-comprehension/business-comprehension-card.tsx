"use client"

/**
 * Business Comprehension™ Card (Phase 5.6).
 *
 * The member-facing surface for Business Comprehension™. It lets the founder
 * VIEW their current Communication Style™ and CHANGE it manually — the founder
 * is always in control. It reads/writes the session store directly
 * (lib/business-comprehension/business-comprehension-store), which dispatches
 * BUSINESS_COMPREHENSION_EVENT so the Harmony Context Engine™ and any other live
 * view stay in sync.
 *
 * A live preview shows the SAME business concept re-explained in the selected
 * style — making the guiding principle tangible: adapt the EXPLANATION, never
 * the PRINCIPLE. No scores, no rankings, no gamification: styles are
 * preferences, never "better" or "worse."
 */

import { useEffect, useState } from "react"
import { MessageCircle, Check } from "lucide-react"
import {
  COMMUNICATION_STYLES,
  COMPREHENSION_REASSURANCE,
  getCommunicationStyle as getStyleDef,
  type CommunicationStyle,
} from "@/lib/business-comprehension/business-comprehension"
import {
  BUSINESS_COMPREHENSION_EVENT,
  getCommunicationStyle,
  setCommunicationStyle,
} from "@/lib/business-comprehension/business-comprehension-store"
import { getBusinessConcept } from "@/lib/business-concepts/business-concepts-registry"

// The concept used for the live preview. "Margin" is universally relevant and
// reads clearly across all five styles.
const PREVIEW_CONCEPT_ID = "margin"

export function BusinessComprehensionCard() {
  // Default until mounted, then hydrate from the session store (avoids SSR mismatch).
  const [style, setStyle] = useState<CommunicationStyle>("business_owner")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setStyle(getCommunicationStyle())
    setMounted(true)
    const onChange = () => setStyle(getCommunicationStyle())
    window.addEventListener(BUSINESS_COMPREHENSION_EVENT, onChange)
    return () => window.removeEventListener(BUSINESS_COMPREHENSION_EVENT, onChange)
  }, [])

  const def = getStyleDef(style)
  const previewConcept = getBusinessConcept(PREVIEW_CONCEPT_ID)
  const previewText = previewConcept?.explanations[style]

  function choose(next: CommunicationStyle) {
    setStyle(next)
    setCommunicationStyle(next)
  }

  return (
    <div className="harmony-panel p-6 sm:p-8" aria-labelledby="business-comprehension-heading">
      {/* Current style */}
      <div className="flex items-start gap-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
          <MessageCircle className="h-6 w-6 text-brand-green" aria-hidden />
        </span>
        <div>
          <p className="ds-eyebrow">Your Communication Style™</p>
          <h3
            id="business-comprehension-heading"
            className="mt-1 font-display text-2xl font-semibold tracking-tight text-brand-ink"
            suppressHydrationWarning
          >
            {def.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-brand-green" suppressHydrationWarning>
            {def.tagline}
          </p>
        </div>
      </div>

      <p className="mt-5 text-pretty text-sm leading-relaxed text-brand-ink-soft" suppressHydrationWarning>
        {def.description}
      </p>

      {/* Style selector — the founder is always in control */}
      <fieldset className="mt-6">
        <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">
          Change how concepts are explained
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNICATION_STYLES.map((s) => {
            const active = mounted && s.id === style
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => choose(s.id)}
                aria-pressed={active}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                  active
                    ? "border-brand-green bg-brand-green/5"
                    : "border-black/[0.08] bg-white/60 hover:border-brand-green/40 hover:bg-brand-green/5"
                }`}
              >
                <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-green/40">
                  {active ? (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-green">
                      <Check className="h-3 w-3 text-white" aria-hidden />
                    </span>
                  ) : null}
                </span>
                <span>
                  <span className="block font-display text-sm font-semibold text-brand-ink">{s.name}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-brand-ink-soft">{s.tagline}</span>
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Live preview: same concept, adapted explanation */}
      {previewConcept && previewText ? (
        <div className="mt-8 rounded-2xl border border-brand-green/20 bg-brand-green/[0.04] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">
              Same concept, your style
            </p>
            <span className="rounded-full border border-brand-green/30 bg-white/70 px-3 py-1 text-xs font-semibold text-brand-ink">
              {previewConcept.term}
            </span>
          </div>
          <p
            className="mt-3 text-pretty text-sm leading-relaxed text-brand-ink"
            suppressHydrationWarning
          >
            {previewText}
          </p>
          <p className="mt-3 text-xs italic leading-relaxed text-brand-ink-soft">
            The recommendation never changes — only how it&apos;s explained.
          </p>
        </div>
      ) : null}

      {/* Style characteristics */}
      <div className="mt-6 border-t border-black/[0.06] pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">
          What this style sounds like
        </p>
        <ul className="mt-3 flex flex-wrap gap-2" suppressHydrationWarning>
          {def.characteristics.map((c) => (
            <li
              key={c}
              className="rounded-full border border-brand-green/20 bg-brand-green/5 px-3 py-1 text-xs font-medium text-brand-ink"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Required reassurance — this is a preference, not an assessment */}
      <p className="mt-6 rounded-xl bg-brand-blush/40 px-4 py-3 text-xs leading-relaxed text-brand-ink-soft">
        {COMPREHENSION_REASSURANCE}
      </p>
    </div>
  )
}
