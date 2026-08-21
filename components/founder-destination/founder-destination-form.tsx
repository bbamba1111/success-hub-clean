"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, ChevronRight, Compass } from "lucide-react"
import {
  getFounderDestination,
  getFounderDestinationSection,
  saveFounderDestination,
  saveFounderDestinationSection,
} from "@/lib/founder-destination/founder-destination-store"
import {
  getFounderDestinationFromDb,
  saveFounderDestinationToDb,
} from "@/utils/founder-destination-storage"
import { getBusinessContext } from "@/lib/business-context/business-context-store"
import {
  FOUNDER_RESPONSIBILITY_OPTIONS,
  LIFE_BOUNDARY_OPTIONS,
  type FounderDestinationProfile,
} from "@/lib/founder-destination/types"

/* ── Shared field styles (matches founder-profile-form.tsx) ────────────── */

const textareaClass =
  "w-full rounded-xl border border-[#E8DDD8] bg-white px-4 py-3 font-sans text-[15px] text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/50 transition-colors resize-none leading-relaxed"

/* ── Section definitions ────────────────────────────────────────────────── */

type SectionId = "business" | "founder" | "life" | "workplace"

const SECTIONS: { id: SectionId; label: string; title: string; description: string }[] = [
  {
    id: "business",
    label: "Business Destination™",
    title: "Where is the business headed?",
    description: "Not where it is today — where you intend it to end up.",
  },
  {
    id: "founder",
    label: "Founder Destination™",
    title: "What role do you want to play?",
    description: "Your own future role in the business you're building.",
  },
  {
    id: "life",
    label: "Life Destination™",
    title: "What life should this business support?",
    description: "The life your business is meant to make possible.",
  },
  {
    id: "workplace",
    label: "Future Workplace Destination™",
    title: "What workplace do you want to build?",
    description: "For the humans (and AI) who will work alongside you.",
  },
]

/* ── Sub-components ─────────────────────────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block font-sans text-sm font-semibold text-brand-ink mb-1.5">{children}</label>
}

function Hint({ text }: { text: string }) {
  return <p className="font-sans text-[13px] text-brand-ink/45 mb-2 leading-relaxed">{text}</p>
}

function PrefillHint({ text }: { text: string }) {
  return (
    <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-green/[0.08] px-3 py-1 font-sans text-[12px] font-medium text-brand-green-dark">
      {text}
    </p>
  )
}

function SingleChoice<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: readonly T[]
  value: T | undefined
  onChange: (v: T) => void
  labels: Record<T, string>
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-xl border px-4 py-2.5 font-sans text-sm font-semibold transition-all ${
            value === opt
              ? "border-brand-green bg-brand-green text-white"
              : "border-[#E8DDD8] bg-white text-brand-ink/60 hover:bg-brand-cream"
          }`}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  )
}

function MultiChoice({
  options,
  value,
  onChange,
}: {
  options: readonly string[]
  value: string[] | undefined
  onChange: (v: string[]) => void
}) {
  const selected = value ?? []
  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter((v) => v !== opt) : [...selected, opt])
  }
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const isSelected = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-sans text-sm font-semibold transition-all ${
              isSelected
                ? "border-brand-green bg-brand-green text-white"
                : "border-[#E8DDD8] bg-white text-brand-ink/60 hover:bg-brand-cream"
            }`}
          >
            {isSelected && <Check className="h-3.5 w-3.5" aria-hidden />}
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/* ── Option label maps ──────────────────────────────────────────────────── */

const BUSINESS_SIZE_LABELS = {
  solo: "Just Me",
  "small-team": "Small Team",
  "mid-size": "Mid-Size",
  "large-team": "Large Team",
  enterprise: "Enterprise",
  undecided: "Not Sure Yet",
}
const TEAM_SIZE_LABELS = {
  solo: "Solo",
  "1-3": "1–3",
  "4-10": "4–10",
  "11-25": "11–25",
  "26-50": "26–50",
  "50-plus": "50+",
  undecided: "Not Sure Yet",
}
const GEO_REACH_LABELS = {
  local: "Local",
  regional: "Regional",
  national: "National",
  international: "International",
  global: "Global",
  undecided: "Not Sure Yet",
}
const MARKET_POSITION_LABELS = {
  "boutique-premium": "Boutique / Premium",
  "mid-market": "Mid-Market",
  "mass-market": "Mass Market",
  "category-leader": "Category Leader",
  "niche-authority": "Niche Authority",
  undecided: "Not Sure Yet",
}
const REVENUE_AMBITION_LABELS = {
  "lifestyle-sufficient": "Lifestyle-Sufficient",
  "six-figure": "Six-Figure",
  "seven-figure": "Seven-Figure",
  "eight-figure-plus": "Eight-Figure+",
  undecided: "Not Sure Yet",
}
const FOUNDER_ROLE_LABELS = {
  "visionary-ceo": "Visionary CEO",
  "hands-on-operator": "Hands-On Operator",
  "creative-director": "Creative Director",
  "advisor-board-member": "Advisor / Board Member",
  "fully-exited": "Fully Exited",
  undecided: "Not Sure Yet",
}
const WORKING_HOURS_LABELS = {
  "under-10": "Under 10 hrs/week",
  "10-20": "10–20 hrs/week",
  "20-30": "20–30 hrs/week",
  "30-40": "30–40 hrs/week",
  "40-plus": "40+ hrs/week",
  undecided: "Not Sure Yet",
}
const FOUNDER_INVOLVEMENT_LABELS = {
  "essential-daily": "Essential, Daily",
  "important-weekly": "Important, Weekly",
  "occasional-monthly": "Occasional, Monthly",
  "minimal-quarterly": "Minimal, Quarterly",
  undecided: "Not Sure Yet",
}
const FOUNDER_INDEPENDENCE_LABELS = {
  "business-needs-me-fully": "Needs Me Fully",
  "business-needs-me-mostly": "Needs Me Mostly",
  "business-runs-without-me-some": "Runs Without Me — Some",
  "business-runs-without-me-fully": "Runs Without Me — Fully",
  undecided: "Not Sure Yet",
}
const WORK_LIFE_MODEL_LABELS = {
  "integrated-blend": "Integrated Blend",
  "strict-separation": "Strict Separation",
  "seasonal-flex": "Seasonal Flex",
  "family-first-always": "Family-First, Always",
  undecided: "Not Sure Yet",
}
const TIME_FREEDOM_LABELS = {
  "always-on": "Always On",
  "flexible-but-available": "Flexible But Available",
  "protected-time-off": "Protected Time Off",
  "fully-time-free": "Fully Time-Free",
  undecided: "Not Sure Yet",
}
const WORKPLACE_TYPE_LABELS = {
  "fully-remote": "Fully Remote",
  hybrid: "Hybrid",
  "in-person": "In-Person",
  "flexible-choice": "Flexible Choice",
  undecided: "Not Sure Yet",
}
const EMPLOYEE_EXPERIENCE_LABELS = {
  "high-autonomy": "High Autonomy",
  "structured-supportive": "Structured & Supportive",
  "high-performance-driven": "High-Performance-Driven",
  "family-like-close-knit": "Family-Like, Close-Knit",
  undecided: "Not Sure Yet",
}
const WORK_DESIGN_LABELS = {
  "async-first": "Async-First",
  "collaborative-real-time": "Collaborative, Real-Time",
  "results-only": "Results-Only",
  "structured-hours": "Structured Hours",
  undecided: "Not Sure Yet",
}
const AI_HUMAN_LABELS = {
  "ai-augmented-humans-lead": "AI-Augmented, Humans Lead",
  "ai-first-humans-oversee": "AI-First, Humans Oversee",
  "human-only-no-ai": "Human-Only, No AI",
  undecided: "Not Sure Yet",
}
const LEADERSHIP_CULTURE_LABELS = {
  "servant-leadership": "Servant Leadership",
  "high-accountability": "High Accountability",
  "consensus-driven": "Consensus-Driven",
  "founder-led-directive": "Founder-Led, Directive",
  undecided: "Not Sure Yet",
}
const HUMAN_SUSTAINABILITY_LABELS = {
  "wellbeing-first": "Wellbeing-First",
  "performance-with-balance": "Performance With Balance",
  "high-intensity-high-reward": "High-Intensity, High-Reward",
  undecided: "Not Sure Yet",
}

/* ── Main component ─────────────────────────────────────────────────────── */

export function FounderDestinationForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [sectionIndex, setSectionIndex] = useState(0)
  const [showSaved, setShowSaved] = useState(false)
  const [form, setForm] = useState<FounderDestinationProfile>({})

  // Hints pulled from Business Context™ — never copied into the destination
  // fields automatically, since "where I'm going" is a distinct question
  // from "how I'm growing today." Shown only as light context.
  const businessContext = useMemo(() => getBusinessContext(), [])

  useEffect(() => {
    const cached = getFounderDestination()
    if (cached) setForm((prev) => ({ ...prev, ...cached }))
    setSectionIndex(getFounderDestinationSection())

    getFounderDestinationFromDb().then((record) => {
      if (!record) return
      const { completedAt: _completedAt, ...destination } = record
      setForm((prev) => ({ ...prev, ...destination }))
      saveFounderDestination(destination)
    })
  }, [])

  function set<K extends keyof FounderDestinationProfile>(key: K, value: FounderDestinationProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function isSectionStarted(id: SectionId): boolean {
    if (id === "business") {
      return Boolean(
        form.desiredBusinessSize ||
          form.desiredTeamSize ||
          form.desiredGeographicReach ||
          form.desiredMarketPosition ||
          form.revenueAmbition,
      )
    }
    if (id === "founder") {
      return Boolean(
        form.desiredFounderRole ||
          form.remainResponsibleFor?.length ||
          form.notResponsibleFor?.length ||
          form.desiredWorkingHoursPerWeek ||
          form.desiredFounderInvolvement ||
          form.desiredZoneOfGenius ||
          form.desiredFounderIndependence,
      )
    }
    if (id === "life") {
      return Boolean(
        form.desiredWorkLifeBalanceModel ||
          form.desiredTimeFreedomLevel ||
          form.desiredLifestyle ||
          form.nonNegotiableLifeBoundaries?.length ||
          form.businessLifePurpose,
      )
    }
    return Boolean(
      form.desiredWorkplaceType ||
        form.desiredEmployeeExperience ||
        form.desiredWorkDesign ||
        form.desiredAiHumanRelationship ||
        form.desiredLeadershipCulture ||
        form.desiredHumanSustainabilityStandard,
    )
  }

  const completedCount = SECTIONS.filter((s) => isSectionStarted(s.id)).length

  async function persist(nextForm: FounderDestinationProfile) {
    saveFounderDestination(nextForm)
    await saveFounderDestinationToDb(nextForm)
  }

  async function handleContinue() {
    setSaving(true)
    await persist(form)
    setSaving(false)

    if (sectionIndex < SECTIONS.length - 1) {
      const next = sectionIndex + 1
      setSectionIndex(next)
      saveFounderDestinationSection(next)
    } else {
      setShowSaved(true)
    }
  }

  function handleBack() {
    if (sectionIndex === 0) {
      router.push("/my-blueprint")
      return
    }
    const prev = sectionIndex - 1
    setSectionIndex(prev)
    saveFounderDestinationSection(prev)
  }

  async function handleSaveAndExit() {
    setSaving(true)
    await persist(form)
    setSaving(false)
    router.push("/my-blueprint")
  }

  function jumpToSection(i: number) {
    setSectionIndex(i)
    saveFounderDestinationSection(i)
  }

  if (showSaved) {
    return (
      <div className="w-full bg-[#FAF6F0] px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
            <Compass className="h-8 w-8 text-brand-green" aria-hidden />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-brand-ink mb-3 text-balance">
            Your destination is set.
          </h1>
          <p className="font-sans text-[16px] leading-relaxed text-brand-ink/60 mb-8">
            Cherry Blossom™ will use your Founder Destination™ alongside your Business Context™ and
            Work-Life Balance data to help determine what matters next.
          </p>
          <button
            type="button"
            onClick={() => router.push("/my-blueprint")}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3 font-sans text-sm font-bold text-white shadow-sm hover:bg-brand-green/90 active:scale-[0.98] transition-all"
          >
            Go to My Blueprint™
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    )
  }

  const section = SECTIONS[sectionIndex]

  return (
    <div className="w-full bg-[#FAF6F0] px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Intro context */}
        <div className="mb-8 text-center">
          <p className="font-playfair text-3xl font-bold text-brand-ink mb-3 text-balance">
            Where are you going?
          </p>
          <p className="font-sans text-[16px] leading-relaxed text-brand-ink/60 max-w-xl mx-auto">
            Your Founder Destination™ is where you intend your business, your own role, your life, and
            your future workplace to end up — not where they are today.
          </p>
          <p className="mt-3 font-sans text-sm font-semibold text-brand-green">
            Every field is optional. {completedCount} of {SECTIONS.length} sections started.
          </p>
        </div>

        {/* Section navigator */}
        <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {SECTIONS.map((s, i) => {
            const started = isSectionStarted(s.id)
            const active = i === sectionIndex
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => jumpToSection(i)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left font-sans text-[13px] font-semibold transition-all ${
                  active
                    ? "border-brand-green bg-white shadow-sm text-brand-ink"
                    : "border-[#E8DDD8] bg-white/60 text-brand-ink/50 hover:bg-white"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    started ? "bg-brand-green text-white" : "border border-brand-ink/20 text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                <span className="truncate">{s.label}</span>
              </button>
            )
          })}
        </div>

        {/* Premium elevated card */}
        <div className="rounded-3xl bg-white shadow-[0_4px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] overflow-hidden px-8 py-10 sm:px-12 sm:py-12">
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/25 bg-brand-green/[0.07] px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green-dark">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green shrink-0" aria-hidden />
                {section.label}
              </span>
              <span className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-ink/35">
                All Optional
              </span>
            </div>
            <h2 className="font-playfair text-2xl font-bold text-brand-ink mb-1.5">{section.title}</h2>
            <p className="font-sans text-[15px] leading-relaxed text-brand-ink/55">{section.description}</p>
          </div>

          {section.id === "business" && (
            <div className="space-y-6">
              {businessContext?.growthVision && (
                <PrefillHint text={`From your Business Context™: growth path is "${businessContext.growthVision}"`} />
              )}
              <div>
                <Label>Desired Business Size</Label>
                <SingleChoice
                  options={Object.keys(BUSINESS_SIZE_LABELS) as (keyof typeof BUSINESS_SIZE_LABELS)[]}
                  value={form.desiredBusinessSize}
                  onChange={(v) => set("desiredBusinessSize", v)}
                  labels={BUSINESS_SIZE_LABELS}
                />
              </div>
              <div>
                <Label>Desired Team Size</Label>
                <SingleChoice
                  options={Object.keys(TEAM_SIZE_LABELS) as (keyof typeof TEAM_SIZE_LABELS)[]}
                  value={form.desiredTeamSize}
                  onChange={(v) => set("desiredTeamSize", v)}
                  labels={TEAM_SIZE_LABELS}
                />
              </div>
              <div>
                <Label>Desired Geographic Reach</Label>
                <SingleChoice
                  options={Object.keys(GEO_REACH_LABELS) as (keyof typeof GEO_REACH_LABELS)[]}
                  value={form.desiredGeographicReach}
                  onChange={(v) => set("desiredGeographicReach", v)}
                  labels={GEO_REACH_LABELS}
                />
              </div>
              <div>
                <Label>Desired Market Position</Label>
                <SingleChoice
                  options={Object.keys(MARKET_POSITION_LABELS) as (keyof typeof MARKET_POSITION_LABELS)[]}
                  value={form.desiredMarketPosition}
                  onChange={(v) => set("desiredMarketPosition", v)}
                  labels={MARKET_POSITION_LABELS}
                />
              </div>
              <div>
                <Label>Revenue Ambition</Label>
                <SingleChoice
                  options={Object.keys(REVENUE_AMBITION_LABELS) as (keyof typeof REVENUE_AMBITION_LABELS)[]}
                  value={form.revenueAmbition}
                  onChange={(v) => set("revenueAmbition", v)}
                  labels={REVENUE_AMBITION_LABELS}
                />
              </div>
            </div>
          )}

          {section.id === "founder" && (
            <div className="space-y-6">
              <div>
                <Label>Desired Founder Role</Label>
                <SingleChoice
                  options={Object.keys(FOUNDER_ROLE_LABELS) as (keyof typeof FOUNDER_ROLE_LABELS)[]}
                  value={form.desiredFounderRole}
                  onChange={(v) => set("desiredFounderRole", v)}
                  labels={FOUNDER_ROLE_LABELS}
                />
              </div>
              <div>
                <Label>What You Want to Remain Responsible For</Label>
                <Hint text="Select everything you intend to keep ownership of." />
                <MultiChoice
                  options={FOUNDER_RESPONSIBILITY_OPTIONS}
                  value={form.remainResponsibleFor}
                  onChange={(v) => set("remainResponsibleFor", v as FounderDestinationProfile["remainResponsibleFor"])}
                />
              </div>
              <div>
                <Label>What You Want to Hand Off (AI or Team)</Label>
                <Hint text="Select everything you intend to no longer be responsible for." />
                <MultiChoice
                  options={FOUNDER_RESPONSIBILITY_OPTIONS}
                  value={form.notResponsibleFor}
                  onChange={(v) => set("notResponsibleFor", v as FounderDestinationProfile["notResponsibleFor"])}
                />
              </div>
              <div>
                <Label>Desired Working Hours Per Week</Label>
                <SingleChoice
                  options={Object.keys(WORKING_HOURS_LABELS) as (keyof typeof WORKING_HOURS_LABELS)[]}
                  value={form.desiredWorkingHoursPerWeek}
                  onChange={(v) => set("desiredWorkingHoursPerWeek", v)}
                  labels={WORKING_HOURS_LABELS}
                />
              </div>
              <div>
                <Label>Desired Founder Involvement</Label>
                <SingleChoice
                  options={Object.keys(FOUNDER_INVOLVEMENT_LABELS) as (keyof typeof FOUNDER_INVOLVEMENT_LABELS)[]}
                  value={form.desiredFounderInvolvement}
                  onChange={(v) => set("desiredFounderInvolvement", v)}
                  labels={FOUNDER_INVOLVEMENT_LABELS}
                />
              </div>
              <div>
                <Label>Desired Founder Independence</Label>
                <SingleChoice
                  options={Object.keys(FOUNDER_INDEPENDENCE_LABELS) as (keyof typeof FOUNDER_INDEPENDENCE_LABELS)[]}
                  value={form.desiredFounderIndependence}
                  onChange={(v) => set("desiredFounderIndependence", v)}
                  labels={FOUNDER_INDEPENDENCE_LABELS}
                />
              </div>
              <div>
                <Label>Your Zone of Genius</Label>
                <Hint text="The work that only you can do — where you want to spend your time." />
                <textarea
                  className={textareaClass}
                  rows={3}
                  placeholder="e.g. Vision-setting, key client relationships, the creative direction…"
                  value={form.desiredZoneOfGenius ?? ""}
                  onChange={(e) => set("desiredZoneOfGenius", e.target.value)}
                />
              </div>
            </div>
          )}

          {section.id === "life" && (
            <div className="space-y-6">
              <div>
                <Label>Desired Work-Life Balance Model</Label>
                <SingleChoice
                  options={Object.keys(WORK_LIFE_MODEL_LABELS) as (keyof typeof WORK_LIFE_MODEL_LABELS)[]}
                  value={form.desiredWorkLifeBalanceModel}
                  onChange={(v) => set("desiredWorkLifeBalanceModel", v)}
                  labels={WORK_LIFE_MODEL_LABELS}
                />
              </div>
              <div>
                <Label>Desired Time Freedom™ Level</Label>
                <SingleChoice
                  options={Object.keys(TIME_FREEDOM_LABELS) as (keyof typeof TIME_FREEDOM_LABELS)[]}
                  value={form.desiredTimeFreedomLevel}
                  onChange={(v) => set("desiredTimeFreedomLevel", v)}
                  labels={TIME_FREEDOM_LABELS}
                />
              </div>
              <div>
                <Label>Non-Negotiable Life Boundaries</Label>
                <Hint text="Select everything that should never be compromised." />
                <MultiChoice
                  options={LIFE_BOUNDARY_OPTIONS}
                  value={form.nonNegotiableLifeBoundaries}
                  onChange={(v) => set("nonNegotiableLifeBoundaries", v as FounderDestinationProfile["nonNegotiableLifeBoundaries"])}
                />
              </div>
              <div>
                <Label>Desired Lifestyle</Label>
                <Hint text="Describe the day-to-day life this business should make possible." />
                <textarea
                  className={textareaClass}
                  rows={3}
                  placeholder="e.g. Home by 5pm, summers off, travel two months a year…"
                  value={form.desiredLifestyle ?? ""}
                  onChange={(e) => set("desiredLifestyle", e.target.value)}
                />
              </div>
              <div>
                <Label>What This Business Is Meant to Make Possible</Label>
                <textarea
                  className={textareaClass}
                  rows={3}
                  placeholder="e.g. Financial independence, being present for my kids, creative freedom…"
                  value={form.businessLifePurpose ?? ""}
                  onChange={(e) => set("businessLifePurpose", e.target.value)}
                />
              </div>
            </div>
          )}

          {section.id === "workplace" && (
            <div className="space-y-6">
              <div>
                <Label>Desired Workplace Type</Label>
                <SingleChoice
                  options={Object.keys(WORKPLACE_TYPE_LABELS) as (keyof typeof WORKPLACE_TYPE_LABELS)[]}
                  value={form.desiredWorkplaceType}
                  onChange={(v) => set("desiredWorkplaceType", v)}
                  labels={WORKPLACE_TYPE_LABELS}
                />
              </div>
              <div>
                <Label>Desired Employee Experience</Label>
                <SingleChoice
                  options={Object.keys(EMPLOYEE_EXPERIENCE_LABELS) as (keyof typeof EMPLOYEE_EXPERIENCE_LABELS)[]}
                  value={form.desiredEmployeeExperience}
                  onChange={(v) => set("desiredEmployeeExperience", v)}
                  labels={EMPLOYEE_EXPERIENCE_LABELS}
                />
              </div>
              <div>
                <Label>Desired Work Design</Label>
                <SingleChoice
                  options={Object.keys(WORK_DESIGN_LABELS) as (keyof typeof WORK_DESIGN_LABELS)[]}
                  value={form.desiredWorkDesign}
                  onChange={(v) => set("desiredWorkDesign", v)}
                  labels={WORK_DESIGN_LABELS}
                />
              </div>
              <div>
                <Label>Desired AI + Human Relationship</Label>
                <SingleChoice
                  options={Object.keys(AI_HUMAN_LABELS) as (keyof typeof AI_HUMAN_LABELS)[]}
                  value={form.desiredAiHumanRelationship}
                  onChange={(v) => set("desiredAiHumanRelationship", v)}
                  labels={AI_HUMAN_LABELS}
                />
              </div>
              <div>
                <Label>Desired Leadership Culture</Label>
                <SingleChoice
                  options={Object.keys(LEADERSHIP_CULTURE_LABELS) as (keyof typeof LEADERSHIP_CULTURE_LABELS)[]}
                  value={form.desiredLeadershipCulture}
                  onChange={(v) => set("desiredLeadershipCulture", v)}
                  labels={LEADERSHIP_CULTURE_LABELS}
                />
              </div>
              <div>
                <Label>Desired Human Sustainability™ Standard</Label>
                <SingleChoice
                  options={Object.keys(HUMAN_SUSTAINABILITY_LABELS) as (keyof typeof HUMAN_SUSTAINABILITY_LABELS)[]}
                  value={form.desiredHumanSustainabilityStandard}
                  onChange={(v) => set("desiredHumanSustainabilityStandard", v)}
                  labels={HUMAN_SUSTAINABILITY_LABELS}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between gap-4 pt-6 border-t border-[#F0E8E4]">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E8DDD8] bg-white px-5 py-3 font-sans text-sm font-semibold text-brand-ink/70 hover:bg-brand-cream hover:text-brand-ink transition-colors"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              {sectionIndex === 0 ? "Exit" : "Back"}
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveAndExit}
                disabled={saving}
                className="rounded-xl border border-[#E8DDD8] bg-white px-5 py-3 font-sans text-sm font-semibold text-brand-ink/60 hover:bg-brand-cream transition-colors disabled:opacity-60"
              >
                Save &amp; Exit
              </button>
              <button
                type="button"
                onClick={handleContinue}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3 font-sans text-sm font-bold text-white shadow-sm hover:bg-brand-green/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving…" : sectionIndex === SECTIONS.length - 1 ? "Finish" : "Save & Continue"}
                {!saving && <ChevronRight className="h-4 w-4" aria-hidden />}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-sans text-[13px] text-brand-ink/40 leading-relaxed">
          Every field is optional. You can leave at any time — your progress is saved automatically, and
          you'll resume exactly where you left off.
        </p>
      </div>
    </div>
  )
}
