import { CHERRY_BLOSSOM_REASONING_HIERARCHY } from "@/lib/excellence-intelligence/excellence-intelligence-registry"

/**
 * ReasoningHierarchy — the documented order in which Cherry Blossom™ will
 * EVENTUALLY reason across the Operating System.
 *
 * Architecture only: no reasoning is implemented. This is a calm, editorial
 * ladder that makes the future reasoning sequence legible today.
 */
export function ReasoningHierarchy() {
  return (
    <ol className="relative space-y-3">
      {CHERRY_BLOSSOM_REASONING_HIERARCHY.map((layer) => {
        const isEngine = layer.system === "Excellence Intelligence Engine™"
        const isFinal = layer.system === "Founder Recommendation"
        return (
          <li
            key={layer.order}
            className={`flex items-start gap-4 rounded-lg border p-4 ds-transition sm:p-5 ${
              isEngine
                ? "border-brand-green/30 bg-card shadow-ds-sm"
                : isFinal
                  ? "border-brand-green/40 bg-brand-green/[0.06]"
                  : "border-black/[0.07] bg-card"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                isFinal ? "bg-brand-green text-white" : "bg-muted text-brand-ink"
              }`}
              aria-hidden
            >
              {layer.order}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-brand-ink">
                {layer.system}
                {isEngine ? (
                  <span className="ml-2 rounded-full border border-brand-green/30 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-brand-green">
                    This Engine
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-brand-ink-soft">{layer.role}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
