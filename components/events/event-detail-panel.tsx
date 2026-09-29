"use client"

/**
 * EventDetailPanel — Phase 15.1
 * --------------------------------
 * Expanded detail panel shown below an EventCard when the founder clicks
 * "View details". Displays full description, host info, full schedule,
 * prep recommendations, and join/calendar CTAs.
 */

import { motion, AnimatePresence } from "framer-motion"
import { CalendarDays, Clock, MapPin, ExternalLink, CheckCircle2, X } from "lucide-react"
import type { HarmonyEvent } from "@/lib/events/types"

interface EventDetailPanelProps {
  event: HarmonyEvent | null
  onClose: () => void
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  return (
    <AnimatePresence>
      {event && (
        <motion.aside
          id={`event-detail-${event.id}`}
          key={event.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="col-span-full overflow-hidden rounded-xl border border-black/[0.07] bg-card shadow-sm"
          role="region"
          aria-label={`Details for ${event.title}`}
        >
          {/* Accent top stripe */}
          <div className="h-1 w-full" style={{ backgroundColor: event.accentColor }} aria-hidden />

          <div className="p-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-playfair text-xl font-semibold leading-snug text-foreground">
                  {event.title}
                </h2>
                <p className="mt-0.5 font-montserrat text-sm text-muted-foreground">
                  {event.tagline}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close details panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body grid */}
            <div className="mt-5 grid gap-6 md:grid-cols-[1fr_280px]">
              {/* Left — description + prep */}
              <div className="space-y-5">
                <p className="font-montserrat text-sm leading-relaxed text-foreground/80">
                  {event.description}
                </p>

                {/* Recommended preparation */}
                {event.prepItems.length > 0 && (
                  <div>
                    <h3 className="mb-3 font-montserrat text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Recommended Preparation
                    </h3>
                    <ul className="space-y-3" role="list">
                      {event.prepItems.map((item) => (
                        <li key={item.label} className="flex gap-3">
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: event.accentColor }}
                            aria-hidden
                          />
                          <div>
                            <p className="font-montserrat text-sm font-medium text-foreground">
                              {item.label}
                            </p>
                            <p className="font-montserrat text-xs leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right — schedule + host + CTA */}
              <div className="space-y-4 rounded-xl bg-muted/40 p-4">
                {/* Schedule */}
                <div>
                  <h3 className="mb-2 font-montserrat text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Schedule
                  </h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 font-montserrat text-sm text-foreground/80">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                      {event.schedule.days}
                    </div>
                    <div className="flex items-center gap-2 font-montserrat text-sm text-foreground/80">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                      {event.schedule.timeRange}
                    </div>
                    <div className="flex items-center gap-2 font-montserrat text-sm text-foreground/80">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                      Virtual — Harmony Lane™ Platform
                    </div>
                  </div>
                </div>

                {/* Host */}
                <div>
                  <h3 className="mb-2 font-montserrat text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Hosted by
                  </h3>
                  <p className="font-montserrat text-sm font-medium text-foreground">
                    {event.host.name}
                  </p>
                  <p className="font-montserrat text-xs text-muted-foreground">
                    {event.host.role}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href={event.joinHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 font-montserrat text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: event.accentColor }}
                    aria-label={`Join ${event.title}`}
                  >
                    Join Session
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>

                  {event.calendarHref && (
                    <a
                      href={event.calendarHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-black/10 bg-white py-2.5 font-montserrat text-sm font-medium text-foreground/70 transition-colors hover:bg-muted"
                      aria-label={`Add ${event.title} to calendar`}
                    >
                      Add to Calendar
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
