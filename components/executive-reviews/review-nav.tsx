/**
 * ReviewNav™ — Phase 14.0
 * Tab bar for Weekly / Monthly / Quarterly / Archive.
 */

export type ReviewTab = "weekly" | "monthly" | "quarterly" | "archive"

const TABS: { id: ReviewTab; label: string }[] = [
  { id: "weekly",    label: "Weekly"    },
  { id: "monthly",   label: "Monthly"   },
  { id: "quarterly", label: "Quarterly" },
  { id: "archive",   label: "Archive"   },
]

export function ReviewNav({
  active,
  onChange,
}: {
  active: ReviewTab
  onChange: (tab: ReviewTab) => void
}) {
  return (
    <nav className="flex gap-1 rounded-xl bg-card border border-black/[0.07] p-1" aria-label="Review type">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          role="tab"
          aria-selected={active === id}
          className={`flex-1 rounded-lg px-3 py-2 font-montserrat text-xs font-semibold transition-all ${
            active === id
              ? "bg-brand-green text-white shadow-sm"
              : "text-brand-ink-soft hover:text-brand-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
