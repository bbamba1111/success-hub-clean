"use client"

import type { FounderProfileAnswers } from "@/lib/installation/types"

interface StepFounderProfileProps {
  answers: Partial<FounderProfileAnswers>
  onChange: (answers: Partial<FounderProfileAnswers>) => void
  onContinue: () => void
  onBack: () => void
}

const STAGES: Array<{ id: FounderProfileAnswers["founderStage"]; label: string; tagline: string }> = [
  { id: "launch", label: "Launch™", tagline: "Validating the idea, building the foundation" },
  { id: "growth", label: "Growth™", tagline: "Consistent revenue, building systems" },
  { id: "scale", label: "Scale™", tagline: "Leading teams, managing complexity" },
  { id: "legacy", label: "Legacy™", tagline: "Expanding influence, creating lasting wealth" },
]

const TEAM_SIZES: Array<{ id: FounderProfileAnswers["teamSize"]; label: string }> = [
  { id: "solo", label: "Solo — just me" },
  { id: "1-3", label: "1–3 people" },
  { id: "4-10", label: "4–10 people" },
  { id: "11-25", label: "11–25 people" },
  { id: "26-50", label: "26–50 people" },
  { id: "50-plus", label: "50+ people" },
]

const BUSINESS_MODELS: Array<{ id: FounderProfileAnswers["businessModel"]; label: string }> = [
  { id: "service", label: "Service business" },
  { id: "coaching", label: "Coaching / mentoring" },
  { id: "consulting", label: "Consulting" },
  { id: "digital-products", label: "Digital products" },
  { id: "membership", label: "Membership / community" },
  { id: "saas", label: "SaaS / software" },
  { id: "agency", label: "Agency" },
  { id: "physical-products", label: "Physical products" },
  { id: "marketplace", label: "Marketplace" },
  { id: "other", label: "Other" },
]

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Africa/Lagos",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
]

const CALENDARS: Array<{ id: FounderProfileAnswers["calendarPreference"]; label: string }> = [
  { id: "google", label: "Google Calendar" },
  { id: "outlook", label: "Microsoft Outlook" },
  { id: "apple", label: "Apple Calendar" },
  { id: "notion", label: "Notion" },
  { id: "other", label: "Other" },
]

const isComplete = (a: Partial<FounderProfileAnswers>) =>
  !!a.firstName?.trim() && !!a.founderStage && !!a.teamSize && !!a.industry?.trim() && !!a.businessModel && !!a.timezone && !!a.calendarPreference

export function StepFounderProfile({ answers, onChange, onContinue, onBack }: StepFounderProfileProps) {
  const set = <K extends keyof FounderProfileAnswers>(key: K, value: FounderProfileAnswers[K]) =>
    onChange({ ...answers, [key]: value })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="ds-eyebrow">Step 3 of 4</p>
        <h2 className="ds-page-title">Your founder profile</h2>
        <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
          This tells your operating system who you are and what you are building — so every recommendation reflects your actual context.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* First name */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm font-semibold text-[#3A2E33]" htmlFor="firstName">
            What is your first name?
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="e.g. Barbara"
            value={answers.firstName ?? ""}
            onChange={(e) => set("firstName", e.target.value)}
            className="harmony-surface w-full rounded-lg px-4 py-3 font-sans text-sm text-[#3A2E33] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#5B835F]/50"
          />
        </div>

        {/* Business Stage */}
        <div className="flex flex-col gap-3">
          <p className="font-sans text-sm font-semibold text-[#3A2E33]">Where are you in your founder journey?</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {STAGES.map(({ id, label, tagline }) => {
              const isSelected = answers.founderStage === id
              return (
                <button
                  key={id}
                  onClick={() => set("founderStage", id)}
                  aria-pressed={isSelected}
                  className={[
                    "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all duration-150",
                    isSelected
                      ? "border-[#5B835F] bg-[#5B835F]/[0.05] ring-1 ring-[#5B835F]/20"
                      : "border-black/[0.07] bg-white hover:border-[#5B835F]/40",
                  ].join(" ")}
                >
                  <span className="font-sans text-sm font-bold text-[#3A2E33]">{label}</span>
                  <span className="font-sans text-xs text-[#6B5860]">{tagline}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Team Size */}
        <div className="flex flex-col gap-3">
          <p className="font-sans text-sm font-semibold text-[#3A2E33]">Team size</p>
          <div className="flex flex-wrap gap-2">
            {TEAM_SIZES.map(({ id, label }) => {
              const isSelected = answers.teamSize === id
              return (
                <button
                  key={id}
                  onClick={() => set("teamSize", id)}
                  aria-pressed={isSelected}
                  className={[
                    "rounded-full border px-4 py-2 font-sans text-xs font-medium transition-all duration-150",
                    isSelected
                      ? "border-[#5B835F] bg-[#5B835F] text-white"
                      : "border-black/[0.1] bg-white text-[#3A2E33] hover:border-[#5B835F]/60",
                  ].join(" ")}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Industry */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm font-semibold text-[#3A2E33]" htmlFor="industry">
            Industry or niche
          </label>
          <input
            id="industry"
            type="text"
            placeholder="e.g. Health & Wellness, Real Estate, Creative Services"
            value={answers.industry ?? ""}
            onChange={(e) => set("industry", e.target.value)}
            className="harmony-surface w-full rounded-lg px-4 py-3 font-sans text-sm text-[#3A2E33] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#5B835F]/50"
          />
        </div>

        {/* Business Model */}
        <div className="flex flex-col gap-3">
          <p className="font-sans text-sm font-semibold text-[#3A2E33]">Primary business model</p>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_MODELS.map(({ id, label }) => {
              const isSelected = answers.businessModel === id
              return (
                <button
                  key={id}
                  onClick={() => set("businessModel", id)}
                  aria-pressed={isSelected}
                  className={[
                    "rounded-full border px-4 py-2 font-sans text-xs font-medium transition-all duration-150",
                    isSelected
                      ? "border-[#5B835F] bg-[#5B835F] text-white"
                      : "border-black/[0.1] bg-white text-[#3A2E33] hover:border-[#5B835F]/60",
                  ].join(" ")}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Timezone */}
        <div className="flex flex-col gap-2">
          <label className="font-sans text-sm font-semibold text-[#3A2E33]" htmlFor="timezone">
            Your time zone
          </label>
          <select
            id="timezone"
            value={answers.timezone ?? ""}
            onChange={(e) => set("timezone", e.target.value)}
            className="harmony-surface w-full appearance-none rounded-lg px-4 py-3 font-sans text-sm text-[#3A2E33] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/50"
          >
            <option value="" disabled>Select your time zone</option>
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Calendar */}
        <div className="flex flex-col gap-3">
          <p className="font-sans text-sm font-semibold text-[#3A2E33]">Calendar preference</p>
          <div className="flex flex-wrap gap-2">
            {CALENDARS.map(({ id, label }) => {
              const isSelected = answers.calendarPreference === id
              return (
                <button
                  key={id}
                  onClick={() => set("calendarPreference", id)}
                  aria-pressed={isSelected}
                  className={[
                    "rounded-full border px-4 py-2 font-sans text-xs font-medium transition-all duration-150",
                    isSelected
                      ? "border-[#5B835F] bg-[#5B835F] text-white"
                      : "border-black/[0.1] bg-white text-[#3A2E33] hover:border-[#5B835F]/60",
                  ].join(" ")}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="ds-btn-ghost flex-none px-5">
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!isComplete(answers)}
          className="ds-btn-primary flex-1 py-3.5 disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
