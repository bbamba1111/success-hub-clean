"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Camera, ChevronRight, ChevronLeft, User, Plus, X } from "lucide-react"
import { hasCompletedFounderProfile, saveFounderProfile, getFounderProfile } from "@/lib/founder-profile/founder-profile-store"
import {
  getFounderProfileFromDb,
  saveFounderProfileToDb,
  uploadFounderProfilePhoto,
  type FounderProfileData,
} from "@/utils/founder-profile-storage"
import { FounderProfileSummary } from "@/components/founder-profile/founder-profile-summary"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Child {
  name: string
  birthday: string
}

interface Pet {
  name: string
  type: string
}

interface FormData {
  // About You
  profilePhoto: string | null
  fullName: string
  preferredName: string
  professionalTitle: string
  customTitle: string
  birthdate: string
  city: string
  stateProvince: string
  country: string
  // Relationships
  maritalStatus: string
  partnerName: string
  anniversary: string
  // Family
  children: Child[]
  parentNames: string
  numberOfSiblings: string
  siblingNames: string
  grandchildren: string
  // Pets
  hasPets: string
  pets: Pet[]
  // About You (lifestyle)
  hobbies: string
  favoriteRelax: string
  // Support System
  bestFriend: string
  mentor: string
  accountabilityPartner: string
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

const MARITAL_OPTIONS = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "In a Relationship",
  "Prefer Not to Say",
]

// ─── Shared field styles ──────────────────────────────────────────────────────

const inputClass =
  "w-full rounded-xl border border-[#E8DDD8] bg-white px-4 py-3 font-sans text-[15px] text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/50 transition-colors"

const selectClass =
  "w-full rounded-xl border border-[#E8DDD8] bg-white px-4 py-3 font-sans text-[15px] text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/50 transition-colors appearance-none cursor-pointer"

const textareaClass =
  "w-full rounded-xl border border-[#E8DDD8] bg-white px-4 py-3 font-sans text-[15px] text-brand-ink placeholder:text-brand-ink/30 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green/50 transition-colors resize-none leading-relaxed"

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-7">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/25 bg-brand-green/[0.07] px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green shrink-0" aria-hidden />
          {label}
        </span>
        <span className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-ink/35">
          All Optional
        </span>
      </div>
      <h2 className="font-playfair text-2xl font-bold text-brand-ink mb-1.5">{title}</h2>
      {description && (
        <p className="font-sans text-[15px] leading-relaxed text-brand-ink/55">{description}</p>
      )}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-sans text-sm font-semibold text-brand-ink mb-1.5">
      {children}
    </label>
  )
}

function OptionalHint({ text }: { text: string }) {
  return (
    <p className="font-sans text-[13px] text-brand-ink/45 mb-2 leading-relaxed">{text}</p>
  )
}

function Divider() {
  return <hr className="border-[#F0E8E4] my-10" />
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export function FounderProfileForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null)

  // /founder-profile is reached two ways: first-time on-ramp (routes on to
  // /business-context) or a returning member editing from My Work-Life
  // Harmony Blueprint™ (should return home, not replay onboarding). Captured
  // on mount, before this session's save can change completion state.
  const wasAlreadyComplete = useRef(hasCompletedFounderProfile())

  // A completed Founder Profile™ opens straight to a read-only summary
  // instead of the raw form; "Edit Founder Profile™" drops back into the
  // full form. `userRequestedEdit` prevents the DB-hydration effect below
  // from bouncing the member back to the summary while they're mid-edit.
  const userRequestedEdit = useRef(false)
  const [mode, setMode] = useState<"summary" | "form">(() =>
    wasAlreadyComplete.current ? "summary" : "form",
  )

  // Demo/test-only bypass for the demo account to exercise the incomplete
  // Founder Profile state end-to-end. Never rendered for real members — no
  // production UI links to this query param, and it never marks the
  // profile as complete, so it can never satisfy the production on-ramp gate.
  const isDemoBypass = searchParams.get("demo") === "skip-founder-profile"

  const [form, setForm] = useState<FormData>({
    profilePhoto: null,
    fullName: "",
    preferredName: "",
    professionalTitle: "",
    customTitle: "",
    birthdate: "",
    city: "",
    stateProvince: "",
    country: "",
    maritalStatus: "",
    partnerName: "",
    anniversary: "",
    children: [],
    parentNames: "",
    numberOfSiblings: "",
    siblingNames: "",
    grandchildren: "",
    hasPets: "",
    pets: [],
    hobbies: "",
    favoriteRelax: "",
    bestFriend: "",
    mentor: "",
    accountabilityPartner: "",
  })

  // Hydrate from the local cache first (instant), then reconcile with the
  // database — the account's canonical Founder Profile™ — so this page and
  // every other engine reading it (Cherry Blossom, Harmony Context, etc.)
  // stay in sync across devices and browser sessions.
  useEffect(() => {
    const cached = getFounderProfile()
    if (cached) {
      setForm((prev) => ({ ...prev, ...(cached as Partial<FormData>) }))
    }

    getFounderProfileFromDb().then((record) => {
      if (!record) return
      const { completedAt, updatedAt: _updatedAt, ...profileData } = record
      setForm((prev) => ({ ...prev, ...profileData }))
      saveFounderProfile(profileData as unknown as Record<string, unknown>)

      // `wasAlreadyComplete` was captured synchronously on mount from the
      // local cache alone, which is empty on a first visit from a new
      // device/browser/session even though the database already has a
      // completed record. Reconcile it here so a returning member editing
      // from a fresh session is treated the same as one whose local cache
      // already reflected completion — see handleSaveAndContinue below.
      if (completedAt) {
        wasAlreadyComplete.current = true
        if (!userRequestedEdit.current) {
          setMode("summary")
        }
      }
    })
  }, [])

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Show the picked photo instantly via a local object URL preview, then
    // upload it to private storage in the background and swap in the
    // durable URL once ready so refresh/other devices see the same photo.
    set("profilePhoto", URL.createObjectURL(file))
    setPendingPhotoFile(file)
  }

  // Children helpers
  function addChild() {
    set("children", [...form.children, { name: "", birthday: "" }])
  }
  function updateChild(i: number, field: keyof Child, value: string) {
    const updated = form.children.map((c, idx) =>
      idx === i ? { ...c, [field]: value } : c
    )
    set("children", updated)
  }
  function removeChild(i: number) {
    set("children", form.children.filter((_, idx) => idx !== i))
  }

  // Pet helpers
  function addPet() {
    set("pets", [...form.pets, { name: "", type: "" }])
  }
  function updatePet(i: number, field: keyof Pet, value: string) {
    const updated = form.pets.map((p, idx) =>
      idx === i ? { ...p, [field]: value } : p
    )
    set("pets", updated)
  }
  function removePet(i: number) {
    set("pets", form.pets.filter((_, idx) => idx !== i))
  }

  async function handleSaveAndContinue() {
    setSaving(true)

    // If a new photo was picked, upload it to private storage first so we
    // save a durable URL rather than the temporary local object URL.
    let finalForm = form
    if (pendingPhotoFile) {
      setUploadingPhoto(true)
      const uploadedUrl = await uploadFounderProfilePhoto(pendingPhotoFile)
      setUploadingPhoto(false)
      if (uploadedUrl) {
        finalForm = { ...form, profilePhoto: uploadedUrl }
        setForm(finalForm)
      }
    }

    // Local cache for instant loads, then the database — the account's
    // canonical Founder Profile™ — so Cherry Blossom and every other engine
    // reading it can see this the moment it's saved, from any device.
    saveFounderProfile(finalForm as unknown as Record<string, unknown>)
    await saveFounderProfileToDb(finalForm as FounderProfileData)

    setSaving(false)

    if (wasAlreadyComplete.current) {
      // Editing an already-complete profile — stay on this page and show
      // the freshly-updated summary instead of redirecting away.
      setMode("summary")
      userRequestedEdit.current = false
      return
    }

    // First-time completion: Business Context™ is the required onboarding
    // gate between Founder Profile and the Cherry Blossom Thank-You™
    // transition, before the founder's first Work-Life Balance Business Day™.
    router.push("/business-context")
  }

  if (mode === "summary") {
    return (
      <div className="w-full bg-[#FAF6F0] px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <FounderProfileSummary
            data={form}
            onEdit={() => {
              userRequestedEdit.current = true
              setMode("form")
            }}
            onContinue={() => router.push("/business-context")}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#FAF6F0] px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Intro context */}
        <div className="mb-8 text-center">
          <p className="font-playfair text-3xl font-bold text-brand-ink mb-3 text-balance">
            {"Let's get to know you before we get to know your business."}
          </p>
          <p className="font-sans text-[16px] leading-relaxed text-brand-ink/60 max-w-xl mx-auto">
            Your Founder Profile™ helps personalize your Harmony Lane™ experience and allows us to better understand the life you are building your business to support.
          </p>
          <p className="mt-3 font-sans text-sm font-semibold text-brand-green">
            Every field on this page is optional.
          </p>
        </div>

        {/* ── Premium elevated card ──────────────────────────────────── */}
        <div className="rounded-3xl bg-white shadow-[0_4px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] overflow-hidden px-8 py-10 sm:px-12 sm:py-12">

          {/* ── SECTION: About You ────────────────────────────────────── */}
          <SectionHeading
            label="About You"
            title="Tell us about yourself."
            description="This helps Cherry Blossom™ greet you personally and personalize your entire Harmony Lane™ experience."
          />

          {/* Profile Photo — enlarged ~30% */}
          <div className="mb-9 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-7">
            <div className="shrink-0 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative h-[120px] w-[120px] rounded-2xl overflow-hidden border-2 border-brand-blush shadow-[0_4px_20px_rgba(0,0,0,0.10)] hover:border-brand-green/40 transition-all group focus:outline-none focus:ring-2 focus:ring-brand-green/30 sm:h-[136px] sm:w-[136px]"
                aria-label="Upload profile photo"
              >
                {form.profilePhoto ? (
                  <img
                    src={form.profilePhoto}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-brand-cream gap-2">
                    <User className="h-10 w-10 text-brand-ink/20" aria-hidden />
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-ink/30">
                      Add Photo
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pb-3">
                  <Camera className="h-5 w-5 text-white" aria-hidden />
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
            <div className="pt-1 text-center sm:text-left">
              <p className="font-sans text-sm font-bold text-brand-ink mb-1">
                Profile Photo
              </p>
              <p className="font-sans text-[13px] text-brand-ink/50 leading-relaxed max-w-xs">
                Adding a photo helps personalize your Harmony Lane™ experience and community interactions. You can always add or change it later.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#E8DDD8] bg-white px-4 py-2 font-sans text-xs font-semibold text-brand-ink/70 hover:bg-brand-cream hover:text-brand-ink transition-colors"
              >
                <Camera className="h-3.5 w-3.5" aria-hidden />
                {form.profilePhoto ? "Change Photo" : "Upload Photo"}
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Full Name</Label>
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
              <Label>Preferred Name</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="What should we call you?"
                value={form.preferredName}
                onChange={(e) => set("preferredName", e.target.value)}
              />
            </div>
            <div>
              <Label>Professional Title</Label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.professionalTitle}
                  onChange={(e) => set("professionalTitle", e.target.value)}
                >
                  <option value="">Select your title</option>
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
            <div>
              <Label>Birthdate</Label>
              <input
                type="date"
                className={inputClass}
                value={form.birthdate}
                onChange={(e) => set("birthdate", e.target.value)}
              />
            </div>
            <div>
              <Label>City</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Your city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                autoComplete="address-level2"
              />
            </div>
            <div>
              <Label>State / Province</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="State or province"
                value={form.stateProvince}
                onChange={(e) => set("stateProvince", e.target.value)}
                autoComplete="address-level1"
              />
            </div>
            <div>
              <Label>Country</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Country"
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
                autoComplete="country-name"
              />
            </div>
          </div>

          <Divider />

          {/* ── SECTION: Relationships ────────────────────────────────── */}
          <SectionHeading
            label="Relationships"
            title="Your closest relationships."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Marital Status</Label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.maritalStatus}
                  onChange={(e) => set("maritalStatus", e.target.value)}
                >
                  <option value="">Select status</option>
                  {MARITAL_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-brand-ink/40" aria-hidden />
              </div>
            </div>
            <div>
              <Label>Spouse / Partner / Significant Other</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Their name"
                value={form.partnerName}
                onChange={(e) => set("partnerName", e.target.value)}
              />
            </div>
            <div>
              <Label>Anniversary</Label>
              <input
                type="date"
                className={inputClass}
                value={form.anniversary}
                onChange={(e) => set("anniversary", e.target.value)}
              />
            </div>
          </div>

          <Divider />

          {/* ── SECTION: Family ───────────────────────────────────────── */}
          <SectionHeading
            label="Family"
            title="Your family."
          />

          {/* Children */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <Label>Children</Label>
              <button
                type="button"
                onClick={addChild}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8DDD8] bg-white px-3 py-1.5 font-sans text-xs font-semibold text-brand-ink/60 hover:bg-brand-cream hover:text-brand-ink transition-colors"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Add Child
              </button>
            </div>
            {form.children.length === 0 && (
              <p className="font-sans text-[13px] text-brand-ink/40 italic">No children added yet.</p>
            )}
            <div className="space-y-3">
              {form.children.map((child, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <input
                    type="text"
                    className={`${inputClass} flex-1 min-w-0`}
                    placeholder="Name"
                    value={child.name}
                    onChange={(e) => updateChild(i, "name", e.target.value)}
                  />
                  <input
                    type="date"
                    className={`${inputClass} w-full sm:w-[13.5rem] sm:shrink-0`}
                    value={child.birthday}
                    onChange={(e) => updateChild(i, "birthday", e.target.value)}
                    aria-label="Birthday"
                  />
                  <button
                    type="button"
                    onClick={() => removeChild(i)}
                    className="shrink-0 rounded-lg p-2 text-brand-ink/30 hover:bg-brand-coral/10 hover:text-brand-coral transition-colors"
                    aria-label="Remove child"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Parent Names</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Mom, Dad, Mary, Robert"
                value={form.parentNames}
                onChange={(e) => set("parentNames", e.target.value)}
              />
            </div>
            <div>
              <Label>Number of Siblings</Label>
              <input
                type="number"
                min="0"
                className={inputClass}
                placeholder="0"
                value={form.numberOfSiblings}
                onChange={(e) => set("numberOfSiblings", e.target.value)}
              />
            </div>
            <div>
              <Label>Sibling Names</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Marcus, Tamara"
                value={form.siblingNames}
                onChange={(e) => set("siblingNames", e.target.value)}
              />
            </div>
            <div>
              <Label>Grandchildren</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Names or number"
                value={form.grandchildren}
                onChange={(e) => set("grandchildren", e.target.value)}
              />
            </div>
          </div>

          <Divider />

          {/* ── SECTION: Pets ─────────────────────────────────────────── */}
          <SectionHeading
            label="Pets"
            title="Your pets."
          />

          <div className="mb-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Do you have pets?</Label>
              <div className="flex gap-3">
                {["Yes", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set("hasPets", opt)}
                    className={`rounded-xl border px-5 py-2.5 font-sans text-sm font-semibold transition-all ${
                      form.hasPets === opt
                        ? "border-brand-green bg-brand-green text-white"
                        : "border-[#E8DDD8] bg-white text-brand-ink/60 hover:bg-brand-cream"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {form.hasPets === "Yes" && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Pets</Label>
                <button
                  type="button"
                  onClick={addPet}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E8DDD8] bg-white px-3 py-1.5 font-sans text-xs font-semibold text-brand-ink/60 hover:bg-brand-cream hover:text-brand-ink transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                  Add Pet
                </button>
              </div>
              <div className="space-y-3">
                {form.pets.map((pet, i) => (
                  <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <input
                      type="text"
                      className={`${inputClass} flex-1 min-w-0`}
                      placeholder="Pet name"
                      value={pet.name}
                      onChange={(e) => updatePet(i, "name", e.target.value)}
                    />
                    <input
                      type="text"
                      className={`${inputClass} w-full sm:w-[8.5rem] sm:shrink-0`}
                      placeholder="Type (e.g. Dog)"
                      value={pet.type}
                      onChange={(e) => updatePet(i, "type", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removePet(i)}
                      className="shrink-0 rounded-lg p-2 text-brand-ink/30 hover:bg-brand-coral/10 hover:text-brand-coral transition-colors"
                      aria-label="Remove pet"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Divider />

          {/* ── SECTION: About You (lifestyle) ───────────────────────── */}
          <SectionHeading
            label="About You"
            title="Your hobbies and interests."
          />

          <div className="space-y-5">
            <div>
              <Label>Hobbies &amp; Interests</Label>
              <OptionalHint text="What do you enjoy doing outside of work?" />
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="e.g. Reading, hiking, cooking, travel, painting…"
                value={form.hobbies}
                onChange={(e) => set("hobbies", e.target.value)}
              />
            </div>
            <div>
              <Label>Favorite Ways to Relax</Label>
              <OptionalHint text="How do you restore your energy and unwind?" />
              <textarea
                className={textareaClass}
                rows={3}
                placeholder="e.g. Long walks, spa days, journaling, music…"
                value={form.favoriteRelax}
                onChange={(e) => set("favoriteRelax", e.target.value)}
              />
            </div>
          </div>

          <Divider />

          {/* ── SECTION: Support System ───────────────────────────────── */}
          <SectionHeading
            label="Your Support System"
            title="The people in your corner."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Best Friend</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Their name"
                value={form.bestFriend}
                onChange={(e) => set("bestFriend", e.target.value)}
              />
            </div>
            <div>
              <Label>Mentor</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Their name"
                value={form.mentor}
                onChange={(e) => set("mentor", e.target.value)}
              />
            </div>
            <div>
              <Label>Accountability Partner</Label>
              <input
                type="text"
                className={inputClass}
                placeholder="Their name"
                value={form.accountabilityPartner}
                onChange={(e) => set("accountabilityPartner", e.target.value)}
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

            <div className="flex items-center gap-3">
              {/* Founder Profile™ is a REQUIRED onboarding gate for every real
                  member — there is no production "Skip for Now" path. This
                  bypass only renders when ?demo=skip-founder-profile is
                  explicitly present, and it navigates without calling
                  saveFounderProfile(), so it can never satisfy the production
                  on-ramp completion check. */}
              {isDemoBypass && (
                <button
                  type="button"
                  onClick={() => router.push("/business-context")}
                  className="rounded-xl border border-dashed border-brand-coral/40 bg-brand-coral/5 px-5 py-3 font-sans text-sm font-semibold text-brand-coral hover:bg-brand-coral/10 transition-colors"
                >
                  Skip (Demo Only)
                </button>
              )}
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

        </div>

        {/* Bottom note */}
        <p className="mt-6 text-center font-sans text-[13px] text-brand-ink/40 leading-relaxed">
          Every field is optional. Your information is private and used only to personalize your Harmony Lane™ experience. You can return at any time to complete or update your profile.
        </p>
      </div>
    </div>
  )
}
