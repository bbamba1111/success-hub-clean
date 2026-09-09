"use client"

/**
 * EventsGrid — Phase 15.1
 * -------------------------
 * Responsive 2-column card grid with category filter chips.
 * Renders EventCard for each filtered event and EventDetailPanel
 * inline below the selected card's row.
 */

import { useState } from "react"
import { EventCard } from "@/components/events/event-card"
import { EventDetailPanel } from "@/components/events/event-detail-panel"
import { EVENTS_CATALOG, CATEGORY_LABELS, EVENTS_BY_ID } from "@/lib/events/events-data"
import type { HarmonyEvent } from "@/lib/events/types"

const FILTER_CATEGORIES = [
  "all",
  "live-co-working",
  "monday-sync",
  "office-hours",
  "founder-circle",
  "workshop",
  "special",
] as const

export function EventsGrid() {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const filtered: HarmonyEvent[] =
    activeFilter === "all"
      ? EVENTS_CATALOG
      : EVENTS_CATALOG.filter((e) => e.category === activeFilter)

  const selectedEvent = selectedEventId ? (EVENTS_BY_ID[selectedEventId] ?? null) : null

  function handleSelect(id: string) {
    setSelectedEventId((prev) => (prev === id ? null : id))
  }

  return (
    <section aria-label="Community Events">
      {/* Filter chips */}
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter events by category">
        {FILTER_CATEGORIES.map((cat) => {
          const isActive = activeFilter === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveFilter(cat)
                setSelectedEventId(null)
              }}
              className={[
                "rounded-full px-3.5 py-1.5 font-montserrat text-xs font-medium transition-all",
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-black/10 bg-white text-foreground/70 hover:border-black/20 hover:bg-muted",
              ].join(" ")}
              aria-pressed={isActive}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          )
        })}
      </div>

      {/* Grid + inline detail panel */}
      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isSelected={selectedEventId === event.id}
            onSelect={handleSelect}
          />
        ))}

        {/* Inline detail panel spans full row */}
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEventId(null)}
        />
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center font-montserrat text-sm text-muted-foreground">
          No events found for this category.
        </p>
      )}
    </section>
  )
}
