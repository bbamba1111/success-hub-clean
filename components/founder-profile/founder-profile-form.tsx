"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Camera, ChevronRight, ChevronLeft, User } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  // About You
  profilePhoto: string | null
  fullName: string
  preferredName: string
  professionalTitle: string
  customTitle: string
  // Business Snapshot
  businessName: string
  industry: string
  businessStage: string
  revenueRange: string
  teamSize: string
  businessModel: string
  // Your Vision
  biggestGoal: string
  biggestChallenge: string
  successVision: string
}

const TITLE_OPTIONS = [
  "Founder & CEO",
  "Executive Director",
  "Consultant",
  "Coach",
  "Speaker",
  "Attorney",
  "Other",
]

const INDUSTRY_OPTIONS = [
  "Coaching & Personal Development",
  "Consulting",
  "Creative & Design",
  "Education & Training",
  "Finance & Wealth Management",
  "Health & Wellness",
  "Law & Legal Services",
  "Marketing & PR",
  "Real Estate",
  "Technology",
  "Other",
]

const STAGE_OPTIONS = [
  "Pre-launch (developing the idea)",
  "Launch (0–1 year, early customers)",
  "Growth (1–3 years, gaining traction)",
  "Scale (3–7 years, building systems)",
  "Established (7+ years, optimizing)",
]

const REVENUE_OPTIONS = [
  "Pre-revenue",
  "$1 – $50k",
  "$50k – $100k",
  "$100k – $250k",
  "$250k – $500k",
  "$500k – $1M",
  "$1M+",
]

const TEAM_OPTIONS = [
  "Solo (just me)",
  "1–2 contractors or part-time",
  "3–5 team members",
  "6–10 team members",
  "11–25 team members",
  "25+ team members",
]

const MODEL_OPTIONS = [
  "1:1 Services",
  "Group Programs",
  "Courses & Digital Products",
  "Membership / Community",
  "Agency / Done-For-You",
  "Speaking & Events",
  "Products (physical or digital)",
  "Hybrid / Multiple streams",
]

// ─── Section heading component ────────────────────────────────────────────────

function SectionHeading({ icon, label, title, description }: {
  icon: string
  label: string
  title: string
  description: string
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/25 bg-brand-green/8 px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green shrink-0" aria-hidden />
          {label}
        </span>
      </div>
      <h2 className="font-playfair text-2xl font-bold text-brand-ink mb-2">
        {title}
      </h2>
      <p className="font-sans text-[15px] leading-relaxed text-brand-ink/60">
        {description}
      </p>
    </div>
  )
}

// ─── Form field components ─────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block font-sans text-sm font-semibold text-brand-ink mb-1.5">
      {children}
      {required && <span className="ml-1 text-brand-coral" aria-hidden>*</span>}
    </label>
  )
}

const inputClass =
  "w-full rounded-xl border border-[#E8DDD8] bg-white px-4 py-3 font-sans text-[15px] text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/50 transition-colors"

const selectClass =
  "w-full rounded-xl border border-[#E8DDD8] bg-white px-4 py-3 font-sans text-[15px] text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/50 transition-colors appearance-none cursor-pointer"

const textareaClass =
  "w-full rounded-xl border border-[#E8DDD8] bg-white px-4 py-3 font-sans text-[15px] text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/50 transition-colors resize-none leading-relaxed"

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return <hr className="border-[#F0E8E4] my-10" />
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export function FounderProfileForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormData>({
    profilePhoto: null,
    fullName: "",
    preferredName: "",
    professionalTitle: "",
    customTitle: "",
    businessName: "",
    industry: "",
    businessStage: "",
    revenueRange: "",
    teamSize: "",
    businessModel: "",
    biggestGoal: "",
    biggestChallenge: "",
    successVision: "",
  })

  const [saving, setSaving] = useState(false)

  function set(key: keyof FormData, value: string | null) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    set("profilePhoto", url)
  }

  async function handleSaveAndContinue() {
    setSaving(true)
    // TODO: persist to Supabase
    await new Promise((r) => setTimeout(r, 600))
    router.push("/audit")
  }

  const resolvedTitle =
    form.professionalTitle === "Other" ? form.customTitle : form.professionalTitle

  return (
    <div className="w-full bg-[#FAF6F0] px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl">

        {/* ── Premium elevated card ──────────────────────────────────── */}
        <div className="rounded-3xl bg-white shadow-[0_4px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] overflow-hidden px-8 py-10 sm:px-12 sm:py-12">

          {/* ── Section 1: About You ──────────────────────────────────── */}
          <SectionHeading
            icon="👤"
            label="About You"
            title="Let's start with a few details about you."
            description="This helps Cherry Blossom™ greet you personally and personalize your entire Harmony Lane™ experience."
          />

          {/* Profile Photo */}
          <div className="mb-8 flex items-start gap-6">
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-brand-blush shadow-sm hover:border-brand-green/40 transition-colors group focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                aria-label="Upload profile photo"
              >
                {form.profilePhoto ? (
                  <img
                    src={form.profilePhoto}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-brand-cream gap-1">
                    <User className="h-8 w-8 text-brand-ink/25" aria-hidden />
                  </div>
                )}
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pb-2">
                  <Camera className="h-4 w-4 text-white" aria-hidden />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
                aria-label="Profile photo file input"
              />
            </div>
            <div className="pt-1">
              <p className="font-sans text-sm font-semibold text-brand-ink mb-0.5">
                Upload Profile Photo
              </p>
              <p className="font-sans text-[13px] text-brand-ink/50 leading-relaxed">
                Optional. JPG, PNG, or WebP.<br />Cherry Blossom™ will use this to personalize your experience.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label required>Full Name</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Your full name"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <Label>Preferred Name <span className="text-brand-ink/40 font-normal text-xs ml-1">(Optional)</span></Label>
              <input
                type="text"
                className={inputClass}
                placeholder="What should we call you?"
                value={form.preferredName}
                onChange={(e) => set("preferredName", e.target.value)}
              />
            </div>
            <div>
              <Label required>Professional Title</Label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.professionalTitle}
                  onChange={(e) => set("professionalTitle", e.target.value)}
                >
                  <option value="" disabled>Select your title</option>
                  {TITLE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-brand-ink/40" aria-hidden />
              </div>
            </div>
            {form.professionalTitle === "Other" && (
              <div className="sm:col-span-2">
                <Label>Custom Title</Label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Entrepreneur, Creative Director…"
                  value={form.customTitle}
                  onChange={(e) => set("customTitle", e.target.value)}
                />
              </div>
            )}
          </div>

          <Divider />

          {/* ── Section 2: Business Snapshot ─────────────────────────── */}
          <SectionHeading
            icon="🏢"
            label="Business Snapshot"
            title="Help us understand your business at a high level."
            description="This is a high-level snapshot — not a complete Business Context Profile™. We will go deeper inside your CEO Workday™ experience."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label required>Business Name</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Your business name"
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                autoComplete="organization"
              />
            </div>
            <div>
              <Label required>Industry</Label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.industry}
                  onChange={(e) => set("industry", e.target.value)}
                >
                  <option value="" disabled>Select your industry</option>
                  {INDUSTRY_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-brand-ink/40" aria-hidden />
              </div>
            </div>
            <div>
              <Label required>Business Stage</Label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.businessStage}
                  onChange={(e) => set("businessStage", e.target.value)}
                >
                  <option value="" disabled>Select your stage</option>
                  {STAGE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-brand-ink/40" aria-hidden />
              </div>
            </div>
            <div>
              <Label>Revenue Range</Label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.revenueRange}
                  onChange={(e) => set("revenueRange", e.target.value)}
                >
                  <option value="" disabled>Select range</option>
                  {REVENUE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-brand-ink/40" aria-hidden />
              </div>
            </div>
            <div>
              <Label>Team Size</Label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.teamSize}
                  onChange={(e) => set("teamSize", e.target.value)}
                >
                  <option value="" disabled>Select team size</option>
                  {TEAM_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-brand-ink/40" aria-hidden />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Business Model</Label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.businessModel}
                  onChange={(e) => set("businessModel", e.target.value)}
                >
                  <option value="" disabled>Select your primary model</option>
                  {MODEL_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-brand-ink/40" aria-hidden />
              </div>
            </div>
          </div>

          <Divider />

          {/* ── Section 3: Your Vision ────────────────────────────────── */}
          <SectionHeading
            icon="🎯"
            label="Your Vision"
            title="Tell us what you are working toward."
            description="Your honest answers here help Cherry Blossom™ personalize your Work-Life Harmony Blueprint™ and make every recommendation feel like it was written just for you."
          />

          <div className="space-y-5">
            <div>
              <Label required>Biggest Goal</Label>
              <p className="font-sans text-[13px] text-brand-ink/50 mb-2">
                What is the most important thing you want to achieve in the next 90 days?
              </p>
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="My biggest goal right now is…"
                value={form.biggestGoal}
                onChange={(e) => set("biggestGoal", e.target.value)}
              />
            </div>
            <div>
              <Label required>Biggest Challenge</Label>
              <p className="font-sans text-[13px] text-brand-ink/50 mb-2">
                What is the number one thing getting in the way of the life and business you want?
              </p>
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="My biggest challenge is…"
                value={form.biggestChallenge}
                onChange={(e) => set("biggestChallenge", e.target.value)}
              />
            </div>
            <div>
              <Label required>Success Vision</Label>
              <p className="font-sans text-[13px] text-brand-ink/50 mb-2">
                Describe what your life looks like when you are truly winning — in both business and life.
              </p>
              <textarea
                className={textareaClass}
                rows={4}
                placeholder="When I am truly succeeding, my life looks like…"
                value={form.successVision}
                onChange={(e) => set("successVision", e.target.value)}
              />
            </div>
          </div>

          {/* ── Navigation ───────────────────────────────────────────── */}
          <div className="mt-10 flex items-center justify-between gap-4 pt-6 border-t border-[#F0E8E4]">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E8DDD8] bg-white px-5 py-3 font-sans text-sm font-semibold text-brand-ink/70 hover:bg-brand-cream hover:text-brand-ink transition-colors"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Back
            </button>

            <button
              type="button"
              onClick={handleSaveAndContinue}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-7 py-3 font-sans text-sm font-bold text-white shadow-sm hover:bg-brand-green/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save & Continue"}
              {!saving && <ChevronRight className="h-4 w-4" aria-hidden />}
            </button>
          </div>

        </div>

        {/* Bottom note */}
        <p className="mt-6 text-center font-sans text-[13px] text-brand-ink/40 leading-relaxed">
          Your information is private and used only to personalize your Harmony Lane™ experience.
        </p>
      </div>
    </div>
  )
}
