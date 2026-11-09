"use client"

/**
 * Scheduled Experiences™ — Workshops & Webinars inside daily planning.
 * Shows upcoming occurrences and the work each one needs. Nothing is placed
 * into a CEO Workday™ until the founder chooses it here.
 */

import { useState, type FormEvent } from "react"
import useSWR from "swr"
import { CalendarDays, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  acceptProposedAssignment,
  createExperienceSeries,
  dismissOccurrenceOption,
  ensureUpcomingOccurrences,
  proposeOccurrenceAssignments,
  type PlaceResult,
  type UpcomingExperience,
} from "@/lib/ceo-workday/experience-server"
import { EXPERIENCE_OPTION_BY_KEY } from "@/lib/ceo-workday/experience-options"
import { EXPERIENCE_TEMPLATES, type ExperienceTemplateKey } from "@/lib/ceo-workday/experience-templates"

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const PLACE_MESSAGE: Record<Exclude<PlaceResult, { ok: true }>["reason"], string> = {
  "not-signed-in": "Sign in to place this work.",
  "not-proposed": "This work is no longer proposed for this experience.",
  "already-placed": "Already in your plan.",
  "no-plan": "That day has no CEO Workday™ yet. Save it for later and place it when you plan that day.",
  full: "Those four hours are full. Save it for later or choose another day.",
  error: "Something went wrong. Please try again.",
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
}

export function ScheduledExperiencesStrip({ dateKey, onPlaced }: { dateKey: string; onPlaced?: () => void }) {
  const { data, isLoading, mutate } = useSWR(["experiences-upcoming", dateKey], () => ensureUpcomingOccurrences(dateKey))
  const [setupOpen, setSetupOpen] = useState(false)

  if (isLoading && !data) return null
  const upcoming = data ?? []

  return (
    <section aria-labelledby="scheduled-experiences-heading" className="space-y-3 rounded-3xl border border-[#E8DFE2] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#5A7A45]" aria-hidden />
          <h2
            id="scheduled-experiences-heading"
            className="font-montserrat text-base font-bold uppercase tracking-[0.16em] text-[#5A7A45]"
          >
            Scheduled Experiences™
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSetupOpen((v) => !v)}
          className="border-[#7FB069]/40 bg-transparent text-[#3A6B3E] hover:bg-[#7FB069]/10"
        >
          <Plus className="mr-1.5 h-4 w-4" aria-hidden />
          Set up an experience
        </Button>
      </div>

      {setupOpen && (
        <SeriesSetupForm
          onCreated={() => {
            setSetupOpen(false)
            void mutate()
          }}
        />
      )}

      {upcoming.length === 0 ? (
        !setupOpen && (
          <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
            No workshops or webinars scheduled. Set one up and its preparation work will be proposed here for you to place.
          </p>
        )
      ) : (
        <ul className="flex flex-col gap-2">
          {upcoming.map((u) => (
            <ExperienceRow
              key={u.occurrence.id}
              upcoming={u}
              onChanged={() => {
                void mutate()
                onPlaced?.()
              }}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function ExperienceRow({ upcoming, onChanged }: { upcoming: UpcomingExperience; onChanged: () => void }) {
  const { occurrence, title, pendingCount } = upcoming
  const [open, setOpen] = useState(false)
  const { data: proposals, mutate } = useSWR(open ? ["experience-proposals", occurrence.id] : null, () =>
    proposeOccurrenceAssignments(occurrence.id),
  )
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, string>>({})

  async function place(optionKey: string, date: string, saveForLater: boolean) {
    setBusyKey(optionKey)
    const result = await acceptProposedAssignment(occurrence.id, optionKey, date, { saveForLater })
    setBusyKey(null)
    setMessages((m) => ({
      ...m,
      [optionKey]: result.ok ? (saveForLater ? "Saved for later." : `Placed on ${formatDate(date)}.`) : PLACE_MESSAGE[result.reason],
    }))
    await mutate()
    if (result.ok) onChanged()
  }

  async function dismiss(optionKey: string) {
    setBusyKey(optionKey)
    await dismissOccurrenceOption(occurrence.id, optionKey)
    setBusyKey(null)
    await mutate()
    onChanged()
  }

  return (
    <li className="rounded-2xl border border-[#E8DFE2] bg-white/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex flex-col">
          <span className="font-sans text-base font-bold text-[#2E1F27]">{title}</span>
          <span className="font-sans text-sm text-[#6B5860]">
            {formatDate(occurrence.occurrenceDate)} · {occurrence.durationMinutes} min
            {pendingCount > 0 ? ` · ${pendingCount} to place` : " · all work placed"}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#6B5860] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open && (
        <ul className="flex flex-col gap-2 border-t border-[#E8DFE2] px-4 py-3">
          {!proposals && <li className="font-sans text-sm text-[#6B5860]">Loading proposed work…</li>}
          {proposals?.length === 0 && <li className="font-sans text-sm text-[#6B5860]">No work proposed for this occurrence.</li>}
          {proposals?.map((p) => {
            const option = EXPERIENCE_OPTION_BY_KEY[p.optionKey]
            const busy = busyKey === p.optionKey
            return (
              <li key={p.optionKey} className="flex flex-col gap-2 rounded-xl bg-[#7FB069]/5 px-3 py-2.5">
                <div className="flex flex-col gap-0.5">
                  <span className="font-sans text-sm font-semibold leading-relaxed text-[#2E1F27]">{option.work}</span>
                  <span className="font-sans text-sm text-[#6B5860]">
                    {p.minutes} min · suggested {formatDate(p.proposedDate)}
                    {p.scope === "setup" ? " · one-time setup" : ""}
                  </span>
                </div>
                {p.placed ? (
                  <span className="font-sans text-sm font-semibold text-[#3A6B3E]">In your plan</span>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      disabled={busy}
                      onClick={() => place(p.optionKey, p.proposedDate, false)}
                      className="bg-[#5A7A45] text-white hover:opacity-90"
                    >
                      Place on {formatDate(p.proposedDate)}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => place(p.optionKey, p.proposedDate, true)}
                      className="border-[#7FB069]/40 bg-transparent text-[#3A6B3E] hover:bg-[#7FB069]/10"
                    >
                      Save for later
                    </Button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => dismiss(p.optionKey)}
                      className="font-sans text-sm font-semibold text-[#6B5860] underline underline-offset-2 disabled:opacity-50"
                    >
                      Not this time
                    </button>
                  </div>
                )}
                {messages[p.optionKey] && (
                  <p role="status" className="font-sans text-sm text-[#C0545A]">
                    {messages[p.optionKey]}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

function SeriesSetupForm({ onCreated }: { onCreated: () => void }) {
  const [templateKey, setTemplateKey] = useState<ExperienceTemplateKey>("monday-redesigned")
  const template = EXPERIENCE_TEMPLATES[templateKey]
  const [name, setName] = useState("")
  const [weekday, setWeekday] = useState(1)
  const [time, setTime] = useState("10:00")
  const [offer, setOffer] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const created = await createExperienceSeries({
      templateKey,
      name: name || undefined,
      weekday,
      localStartTime: time,
      conversionOffer: template.destinationConfigurable ? offer || null : undefined,
    })
    setSaving(false)
    if (created) onCreated()
    else setError("Could not save this experience. Check the details and try again.")
  }

  const fieldClass =
    "w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/50"
  const labelClass = "flex flex-col gap-1 font-sans text-sm font-semibold text-[#2E1F27]"

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-[#7FB069]/5 p-4 sm:grid-cols-2">
      <label className={labelClass}>
        Experience
        <select
          value={templateKey}
          onChange={(e) => setTemplateKey(e.target.value as ExperienceTemplateKey)}
          className={fieldClass}
        >
          {Object.values(EXPERIENCE_TEMPLATES).map((t) => (
            <option key={t.key} value={t.key}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Name (optional)
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={template.name} maxLength={200} className={fieldClass} />
      </label>
      <label className={labelClass}>
        {template.defaultCadence === "weekly" ? "Every" : "Day"}
        <select value={weekday} onChange={(e) => setWeekday(Number(e.target.value))} className={fieldClass}>
          {WEEKDAYS.map((d, i) => (
            <option key={d} value={i}>
              {d}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Start time
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={fieldClass} />
      </label>
      {template.destinationConfigurable ? (
        <label className={`${labelClass} sm:col-span-2`}>
          Invite participants into
          <input
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            placeholder="Your next offer"
            maxLength={300}
            className={fieldClass}
          />
        </label>
      ) : (
        <p className="font-sans text-sm leading-relaxed text-[#6B5860] sm:col-span-2">
          Invites participants into {template.destination}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={saving} className="bg-[#5A7A45] text-white hover:opacity-90">
          {saving ? "Saving…" : "Save experience"}
        </Button>
        {error && (
          <p role="alert" className="font-sans text-sm text-[#C0545A]">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}
