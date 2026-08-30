"use client"

/**
 * Founder Profile™ — read-only completed summary.
 * ---------------------------------------------------------------------------
 * Shown instead of the raw form once a Founder Profile™ is complete.
 * Mirrors the form's own SectionHeading groupings; "Edit" drops back into
 * the full editable form. Every field is optional, so empty fields (and
 * empty sections) are simply omitted.
 */

import { ChevronRight, Pencil, User } from "lucide-react"

interface Child {
  name: string
  birthday: string
}

interface Pet {
  name: string
  type: string
}

export interface FounderProfileSummaryData {
  profilePhoto: string | null
  fullName: string
  preferredName: string
  professionalTitle: string
  customTitle: string
  birthdate: string
  city: string
  stateProvince: string
  country: string
  maritalStatus: string
  partnerName: string
  anniversary: string
  children: Child[]
  parentNames: string
  numberOfSiblings: string
  siblingNames: string
  grandchildren: string
  hasPets: string
  pets: Pet[]
  hobbies: string
  favoriteRelax: string
  bestFriend: string
  mentor: string
  accountabilityPartner: string
}

function formatDate(value: string): string | undefined {
  if (!value) return undefined
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
}

function Field({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null
  return (
    <div>
      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-green mb-0.5">
        {label}
      </p>
      <p className="font-sans text-sm text-brand-ink leading-relaxed">{value}</p>
    </div>
  )
}

function SummarySection({
  title,
  hasContent,
  children,
}: {
  title: string
  /** Whether any field in this section has a value — hides the whole
      section (rather than showing an empty header) when false. */
  hasContent: boolean
  children: React.ReactNode
}) {
  if (!hasContent) return null
  return (
    <div className="mb-8">
      <h3 className="font-playfair text-lg font-bold text-brand-ink mb-4">{title}</h3>
      <div className="grid gap-3.5 sm:grid-cols-2">{children}</div>
    </div>
  )
}

export function FounderProfileSummary({
  data,
  onEdit,
  onContinue,
}: {
  data: FounderProfileSummaryData
  onEdit: () => void
  /**
   * Advances to the next required onboarding step (Business Context™).
   * Landing back on this page already-complete — via Back navigation, the
   * Onboarding Progress™ banner, or a direct visit — only ever offered
   * "Edit" before this; there was no way to move forward again without
   * re-editing and re-saving the whole form. Omit this prop for any
   * non-onboarding usage of this summary where "next step" doesn't apply.
   */
  onContinue?: () => void
}) {
  const title = data.professionalTitle === "Other" ? data.customTitle : data.professionalTitle
  const location = [data.city, data.stateProvince, data.country].filter(Boolean).join(", ")
  const childrenSummary =
    data.children.length > 0
      ? data.children
          .map((c) => (c.birthday ? `${c.name} (${formatDate(c.birthday)})` : c.name))
          .filter(Boolean)
          .join(", ")
      : undefined
  const petsSummary =
    data.hasPets === "Yes" && data.pets.length > 0
      ? data.pets.map((p) => (p.type ? `${p.name} (${p.type})` : p.name)).filter(Boolean).join(", ")
      : undefined

  const hasAnyContent = Boolean(
    data.fullName ||
      data.preferredName ||
      title ||
      data.birthdate ||
      location ||
      data.maritalStatus ||
      data.partnerName ||
      data.anniversary ||
      childrenSummary ||
      data.parentNames ||
      data.numberOfSiblings ||
      data.siblingNames ||
      data.grandchildren ||
      petsSummary ||
      data.hobbies ||
      data.favoriteRelax ||
      data.bestFriend ||
      data.mentor ||
      data.accountabilityPartner,
  )

  return (
    <div className="w-full bg-[#FAF6F0] px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl bg-white shadow-[0_4px_40px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] overflow-hidden px-8 py-10 sm:px-12 sm:py-12">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-brand-blush bg-brand-cream">
                {data.profilePhoto ? (
                  <img src={data.profilePhoto} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-7 w-7 text-brand-ink/20" aria-hidden />
                  </div>
                )}
              </div>
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
                  Founder Profile™
                </span>
                <p className="mt-1 font-playfair text-xl font-bold text-brand-ink">
                  {data.preferredName || data.fullName || "Complete"}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-xl border border-brand-blush bg-white px-4 py-2.5 font-sans text-sm font-bold text-brand-ink shadow-sm hover:border-brand-green/40 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Edit
              </button>
              {onContinue && (
                <button
                  type="button"
                  onClick={onContinue}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-green px-5 py-2.5 font-sans text-sm font-bold text-white shadow-sm hover:bg-brand-green/90 transition-colors"
                >
                  Continue to Business Context™
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              )}
            </div>
          </div>

          {!hasAnyContent && (
            <p className="mb-8 font-sans text-sm text-brand-ink/50 italic">
              You marked your Founder Profile™ complete without adding any details yet — every
              field is optional. Click Edit above any time you would like to add some.
            </p>
          )}

          <SummarySection
            title="About You"
            hasContent={Boolean(
              data.fullName || data.preferredName || title || data.birthdate || location,
            )}
          >
            <Field label="Full Name" value={data.fullName || undefined} />
            <Field label="Preferred Name" value={data.preferredName || undefined} />
            <Field label="Professional Title" value={title || undefined} />
            <Field label="Birthdate" value={formatDate(data.birthdate)} />
            <Field label="Location" value={location || undefined} />
          </SummarySection>

          <SummarySection
            title="Relationships"
            hasContent={Boolean(data.maritalStatus || data.partnerName || data.anniversary)}
          >
            <Field label="Marital Status" value={data.maritalStatus || undefined} />
            <Field label="Spouse / Partner" value={data.partnerName || undefined} />
            <Field label="Anniversary" value={formatDate(data.anniversary)} />
          </SummarySection>

          <SummarySection
            title="Family"
            hasContent={Boolean(
              childrenSummary ||
                data.parentNames ||
                data.numberOfSiblings ||
                data.siblingNames ||
                data.grandchildren,
            )}
          >
            <Field label="Children" value={childrenSummary} />
            <Field label="Parent Names" value={data.parentNames || undefined} />
            <Field label="Number of Siblings" value={data.numberOfSiblings || undefined} />
            <Field label="Sibling Names" value={data.siblingNames || undefined} />
            <Field label="Grandchildren" value={data.grandchildren || undefined} />
          </SummarySection>

          <SummarySection title="Pets" hasContent={Boolean(petsSummary)}>
            <Field label="Pets" value={petsSummary} />
          </SummarySection>

          <SummarySection
            title="Hobbies & Lifestyle"
            hasContent={Boolean(data.hobbies || data.favoriteRelax)}
          >
            <Field label="Hobbies & Interests" value={data.hobbies || undefined} />
            <Field label="Favorite Ways to Relax" value={data.favoriteRelax || undefined} />
          </SummarySection>

          <SummarySection
            title="Your Support System"
            hasContent={Boolean(data.bestFriend || data.mentor || data.accountabilityPartner)}
          >
            <Field label="Best Friend" value={data.bestFriend || undefined} />
            <Field label="Mentor" value={data.mentor || undefined} />
            <Field label="Accountability Partner" value={data.accountabilityPartner || undefined} />
          </SummarySection>
        </div>
      </div>
    </div>
  )
}
