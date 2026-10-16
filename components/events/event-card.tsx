"use client"

/**
 * EventCard — Phase 15.1
 * -------------------------
 * Premium editorial card for a single HarmonyEvent. Features a per-category
 * accent left-border, metadata chips, Cherry Blossom™ pre-session strip on
 * Live Co-Working cards, and Join Live + Add to Calendar CTAs.
 */

import { Clock, Users, Calendar, ExternalLink } from "lucide-react"
import type { HarmonyEvent } from "@/lib/events/types"
import { CATEGORY_LABELS } from "@/lib/events/events-data"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: HarmonyEvent
  isSelected?: boolean
  onSelect: (id: string) => void
}

export function EventCard({ event, isSelected, onSelect }: EventCardProps) {
  const {
    id,
    title,
    tagline,
    schedule,
    duration,
    host,
    seats,
    joinHref,
    calendarHref,
    accentColor,
    tintRgb,
    cherryBlossomMessage,
    isLiveNow,
    requiresRegistration,
    category,
  } = event

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        isSelected
          ? "ring-2 shadow-md -translate-y-0.5"
          : "border-black/[0.07]",
      )}
      style={
        isSelected
          ? { ringColor: accentColor, borderColor: accentColor + "40" }
          : undefined
      }
      aria-current={isSelected ? "true" : undefined}
    >
      {/* Accent left border */}
      <div
        className="absolute inset-y-0 left-0 w-1 rounded-l-xl"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />

      {/* Very-light category tint header */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-3 pl-6"
        style={{ backgroundColor: `rgb(${tintRgb} / 0.55)` }}
      >
        <div className="flex items-center gap-2">
          {/* Category chip */}
          <span
            className="rounded-full px-2.5 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{
              backgroundColor: accentColor + "18",
              color: accentColor,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {CATEGORY_LABELS[category] ?? category}
          </span>

          {/* Live now badge */}
          {isLiveNow && (
            <span className="flex items-center gap-1 rounded-full bg-[#E26C73]/10 px-2.5 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#E26C73]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E26C73] animate-pulse" aria-hidden />
              Live Now
            </span>
          )}
        </div>

        {requiresRegistration && (
          <span className="font-montserrat text-[10px] text-muted-foreground">
            Registration required
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5 pl-6">
        <div>
          <h3 className="font-playfair text-lg font-semibold leading-snug text-foreground">
            {title}
          </h3>
          <p className="mt-1 font-montserrat text-sm leading-relaxed text-muted-foreground">
            {tagline}
          </p>
        </div>

        {/* Metadata chips row */}
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 font-montserrat text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" aria-hidden />
            {duration}
          </span>
          <span className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 font-montserrat text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" aria-hidden />
            {schedule.nextSessionLabel}
          </span>
          <span className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 font-montserrat text-xs text-muted-foreground">
            <Users className="h-3 w-3 shrink-0" aria-hidden />
            {typeof seats === "number" ? `${seats} seats` : seats}
          </span>
        </div>

        {/* Host */}
        <p className="font-montserrat text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">{host.name}</span>
          {" · "}
          {host.role}
        </p>

        {/* Cherry Blossom pre-session message — Live Co-Working only */}
        {cherryBlossomMessage && (
          <blockquote
            className="rounded-lg border-l-2 py-2 pl-3 pr-2 font-montserrat text-xs italic leading-relaxed"
            style={{
              borderColor: accentColor + "60",
              backgroundColor: `rgb(${tintRgb} / 0.4)`,
              color: accentColor,
            }}
          >
            <span className="not-italic font-semibold text-[10px] uppercase tracking-widest block mb-1 opacity-70">
              Cherry Blossom™
            </span>
            {cherryBlossomMessage}
          </blockquote>
        )}

        {/* CTAs */}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <a
            href={joinHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 font-montserrat text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor }}
            aria-label={`Join ${title}`}
          >
            {isLiveNow ? "Join Live" : "Join Session"}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>

          {calendarHref && (
            <a
              href={calendarHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-4 py-2 font-montserrat text-xs font-medium text-foreground/70 transition-colors hover:bg-muted"
              aria-label={`Add ${title} to calendar`}
            >
              <Calendar className="h-3 w-3" aria-hidden />
              Add to Calendar
            </a>
          )}

          <button
            type="button"
            onClick={() => onSelect(isSelected ? "" : id)}
            className="ml-auto font-montserrat text-xs text-muted-foreground underline-offset-2 hover:underline"
            aria-expanded={isSelected}
            aria-controls={`event-detail-${id}`}
          >
            {isSelected ? "Hide details" : "View details"}
          </button>
        </div>
      </div>
    </article>
  )
}
