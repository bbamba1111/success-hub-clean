import { Check } from "lucide-react"
import type { StartConsideration } from "@/lib/boundary-report/start-considerations"

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">{label}</p>
      <div className="font-sans text-sm leading-relaxed text-brand-ink text-pretty">{children}</div>
    </div>
  )
}

/** Personalized considerations; older reports without them fall back to the stage checklist. */
export function StartConsiderationsBlock({
  considerations,
  fallback,
}: {
  considerations?: StartConsideration[]
  fallback?: string[]
}) {
  if (!considerations) {
    return (
      <ul className="flex flex-col gap-2">
        {(fallback ?? []).map((c) => (
          <li key={c} className="flex items-start gap-2 font-sans text-sm text-brand-ink">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden />
            {c}
          </li>
        ))}
      </ul>
    )
  }

  if (considerations.length === 0) {
    return (
      <p className="font-sans text-sm leading-relaxed text-brand-ink-soft">
        Your answers didn&apos;t point to a specific starting consideration. Review your Priority Focus Areas™ above as your
        starting place.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">
        These are drawn from your own answers, ordered by how strongly your diagnostic points to them. Each is something
        to review, not a commitment.
      </p>
      {considerations.map((c) => (
        <article key={c.id} className="flex flex-col gap-4 rounded-2xl border border-brand-blush bg-brand-cream/40 px-5 py-5">
          <h3 className="font-playfair text-lg font-bold text-brand-ink text-balance">{c.title}</h3>
          <Row label="Finding">{c.finding}</Row>
          <Row label="Why it matters">{c.whyItMatters}</Row>
          <Row label="Supporting evidence">
            <ul className="flex flex-col gap-1.5">
              {c.evidence.map((e) => (
                <li key={e.text} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 font-montserrat text-[8px] font-bold uppercase tracking-wider ${
                      e.source === "provided" ? "bg-brand-coral/10 text-brand-coral" : "bg-brand-green/15 text-brand-green"
                    }`}
                  >
                    {e.source === "provided" ? "You told us" : "Audit result"}
                  </span>
                  <span>{e.text}</span>
                </li>
              ))}
            </ul>
          </Row>
          {c.businessImplications && <Row label="Business implications">{c.businessImplications}</Row>}
          {c.personalConsiderations && <Row label="Personal considerations">{c.personalConsiderations}</Row>}
          <div className="rounded-xl border border-brand-green/30 bg-brand-green/5 px-4 py-3">
            <Row label="Suggested starting point">{c.startingPoint}</Row>
          </div>
        </article>
      ))}
    </div>
  )
}
