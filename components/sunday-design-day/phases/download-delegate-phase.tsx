"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSdd } from "@/components/sunday-design-day/sdd-state"
import { PhaseHeading } from "@/components/sunday-design-day/sdd-ui"
import { DELEGATION_CATEGORIES } from "@/components/sunday-design-day/sdd-config"

export function DownloadDelegatePhase({ readOnly = false }: { readOnly?: boolean }) {
  const { state, dispatch } = useSdd()
  const [draft, setDraft] = useState("")
  const items = state.data.delegationItems

  function addItem() {
    const text = draft.trim()
    if (!text) return
    dispatch({ type: "ADD_ITEM", text })
    setDraft("")
  }

  const unclassified = items.filter((i) => i.category === null).length

  return (
    <div className="space-y-8">
      {/* The brain dump */}
      <section className="space-y-4">
        <PhaseHeading note="Empty your head first. Add everything on your plate — one line at a time.">
          Download Everything™
        </PhaseHeading>

        {!readOnly && (
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  addItem()
                }
              }}
              placeholder="e.g. Follow up with the new client…"
              className="flex-1 rounded-lg border border-black/[0.08] bg-card px-3.5 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink-soft/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            />
            <Button onClick={addItem} className="ds-btn-primary shrink-0" disabled={!draft.trim()}>
              <Plus className="ds-icon-sm" aria-hidden />
              Add
            </Button>
          </div>
        )}

        {items.length === 0 ? (
          <p className="rounded-lg bg-muted px-4 py-3 text-sm text-brand-ink-soft">
            Nothing captured yet. Add what&apos;s been weighing on you.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {items.map((item) => (
              <li key={item.id} className="harmony-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <span className="flex-1 text-sm text-brand-ink">{item.text}</span>
                <div className="flex items-center gap-2">
                  <select
                    value={item.category ?? ""}
                    onChange={(e) =>
                      dispatch({ type: "SET_ITEM_CATEGORY", id: item.id, category: e.target.value || null })
                    }
                    disabled={readOnly}
                    aria-label={`Where does "${item.text}" go?`}
                    className={`rounded-lg border px-3 py-2 text-sm text-brand-ink focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                      item.category ? "border-brand-green/40 bg-brand-green/[0.06]" : "border-black/[0.08] bg-card"
                    }`}
                  >
                    <option value="">Where does this go?</option>
                    {DELEGATION_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
                      aria-label="Remove item"
                      className="inline-flex items-center rounded-md p-2 text-brand-ink-soft hover:bg-brand-coral/10 hover:text-brand-coral-dark"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && unclassified > 0 && (
          <p className="text-sm font-medium text-brand-coral-dark">
            {unclassified} {unclassified === 1 ? "item still needs" : "items still need"} a destination.
          </p>
        )}
      </section>

      {/* The seven destinations reference */}
      <section className="border-t border-black/[0.06] pt-7">
        <PhaseHeading note="Every item belongs somewhere other than only on your shoulders.">
          The Seven Destinations™
        </PhaseHeading>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DELEGATION_CATEGORIES.map((c) => {
            const count = items.filter((i) => i.category === c.id).length
            return (
              <div key={c.id} className="harmony-surface flex flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display text-base font-semibold text-brand-ink">{c.title}</h4>
                  {count > 0 && <span className="ds-badge-green shrink-0">{count}</span>}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{c.description}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
