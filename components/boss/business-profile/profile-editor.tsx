"use client"

import { useMemo, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, ChevronDown, FileUp, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { addBusinessFact, addCustomCategory, addReferencedFact } from "@/app/actions/business-profile"
import { DOCUMENT_TYPES, type BusinessFact, type BusinessProfileData, type CategoryDefinition } from "@/lib/business-profile/definitions"
import { FactCard, StatusBadge, fieldClass, primaryButton, quietButton } from "./fact-card"

function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-xl border border-brand-coral/40 bg-brand-coral/10 px-4 py-3 text-base text-brand-coral-dark">
      {message}
    </p>
  )
}

function AddFactForm({ category, onError }: { category: CategoryDefinition; onError: (m: string | null) => void }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  if (!open) {
    return (
      <button type="button" className={cn(quietButton, "self-start")} onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden="true" />
        Add to {category.label}
      </button>
    )
  }
  return (
    <form
      ref={formRef}
      className="flex flex-col gap-3 rounded-2xl border border-dashed border-brand-green/40 bg-background p-5"
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(async () => {
          const result = await addBusinessFact({
            categoryKey: category.key,
            label: String(data.get("label") ?? ""),
            value: String(data.get("value") ?? ""),
          })
          if (!result.ok) return onError(result.error)
          onError(null)
          formRef.current?.reset()
          setOpen(false)
        })
      }}
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-base font-medium text-brand-ink">Name</span>
        <input
          name="label"
          className={fieldClass}
          required
          maxLength={120}
          placeholder={category.examples[0] ? `For example: ${category.examples[0]}` : "What is this?"}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-base font-medium text-brand-ink">Details</span>
        <textarea name="value" className={fieldClass} rows={3} maxLength={8000} placeholder="You can leave this for later." />
      </label>
      <p className="text-base text-brand-ink-soft">New items save as drafts. Nothing is used externally until you approve it.</p>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={primaryButton} disabled={pending}>
          Save draft
        </button>
        <button type="button" className={quietButton} onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function CategorySection({ category, facts, onError }: { category: CategoryDefinition; facts: BusinessFact[]; onError: (m: string | null) => void }) {
  const active = facts.filter((f) => f.status !== "retired")
  const retired = facts.filter((f) => f.status === "retired")
  const approved = active.filter((f) => f.status === "approved").length
  const needsReview = active.filter((f) => f.status === "needs_review").length
  const drafts = active.filter((f) => f.status === "draft").length

  return (
    <details className="group rounded-2xl border border-border bg-card open:bg-background" open={needsReview > 0}>
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 rounded-2xl p-5 hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-xl font-semibold text-brand-ink">{category.label}</h3>
          <p className="text-base leading-relaxed text-brand-ink-soft">{category.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {active.length === 0 ? (
            <span className="text-base text-brand-ink-soft">Not started</span>
          ) : (
            <span className="text-base text-brand-ink-soft">
              {approved} approved
              {drafts > 0 && ` · ${drafts} draft`}
              {needsReview > 0 && <span className="font-semibold text-brand-coral-dark">{` · ${needsReview} to review`}</span>}
            </span>
          )}
          <ChevronDown className="size-5 text-brand-ink-soft transition-transform group-open:rotate-180" aria-hidden="true" />
        </div>
      </summary>
      <div className="flex flex-col gap-4 px-5 pb-5">
        {active.length === 0 && (
          <p className="text-base leading-relaxed text-brand-ink-soft">
            Nothing here yet. Add what you have now; you can fill in the rest over time.
            {category.examples.length > 0 && ` Ideas: ${category.examples.join(", ")}.`}
          </p>
        )}
        {active.map((fact, index) => (
          <FactCard key={`${fact.id}-${fact.updatedAt}`} fact={fact} isFirst={index === 0} isLast={index === active.length - 1} onError={onError} />
        ))}
        <AddFactForm category={category} onError={onError} />
        {retired.length > 0 && (
          <details className="rounded-xl border border-border p-4">
            <summary className="cursor-pointer text-base font-medium text-brand-ink-soft">Retired items ({retired.length})</summary>
            <div className="mt-4 flex flex-col gap-4">
              {retired.map((fact) => (
                <FactCard key={`${fact.id}-${fact.updatedAt}`} fact={fact} isFirst isLast onError={onError} />
              ))}
            </div>
          </details>
        )}
      </div>
    </details>
  )
}

function ReviewPanel({ facts, categories }: { facts: BusinessFact[]; categories: CategoryDefinition[] }) {
  const pending = facts.filter((f) => f.status === "needs_review" || (f.status === "draft" && f.lastChangeActor !== "founder"))
  if (pending.length === 0) return null
  const label = new Map(categories.map((c) => [c.key, c.label]))
  const paused = pending.filter((f) => f.approvedValue !== null)
  return (
    <section aria-labelledby="review-heading" className="flex flex-col gap-4 rounded-2xl border border-brand-coral/40 bg-brand-blush/30 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-1 size-5 shrink-0 text-brand-coral-dark" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <h2 id="review-heading" className="text-xl font-semibold text-brand-ink">
            {pending.length} {pending.length === 1 ? "item needs" : "items need"} your review
          </h2>
          <p className="text-base leading-relaxed text-brand-ink-soft">
            {paused.length > 0
              ? `${paused.length} previously approved ${paused.length === 1 ? "item is" : "items are"} paused and will not be used by Cherry Blossom™ or your executives until you approve the new wording or keep the previous one.`
              : "Suggested items will not be used anywhere until you approve them."}
          </p>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {pending.map((f) => (
          <li key={f.id} className="flex flex-wrap items-center gap-2 text-base text-brand-ink">
            <StatusBadge status={f.status} />
            <span className="font-medium">{f.label}</span>
            <span className="text-brand-ink-soft">in {label.get(f.categoryKey) ?? f.categoryKey}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ExistingRecords({ data, onError }: { data: BusinessProfileData; onError: (m: string | null) => void }) {
  const [pending, startTransition] = useTransition()
  if (data.availableReferences.length === 0) return null
  return (
    <section aria-labelledby="records-heading" className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col gap-1">
        <h2 id="records-heading" className="text-xl font-semibold text-brand-ink">
          From your existing records
        </h2>
        <p className="text-base leading-relaxed text-brand-ink-soft">
          Link these instead of retyping them. If the original record changes, the linked item returns to review automatically.
        </p>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {data.availableReferences.map((ref) => (
          <li key={`${ref.sourceTable}.${ref.sourceColumn}`} className="flex flex-col gap-3 rounded-xl border border-border p-4">
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-brand-ink">{ref.label}</p>
              <p className="line-clamp-3 text-base leading-relaxed text-brand-ink-soft">{ref.currentValue}</p>
            </div>
            <button
              type="button"
              className={cn(quietButton, "self-start")}
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await addReferencedFact({ sourceTable: ref.sourceTable, sourceColumn: ref.sourceColumn })
                  onError(result.ok ? null : result.error)
                })
              }
            >
              <Plus className="size-4" aria-hidden="true" />
              Add as draft
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function AddCategoryForm({ onError }: { onError: (m: string | null) => void }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  if (!open) {
    return (
      <button type="button" className={cn(quietButton, "self-start")} onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden="true" />
        Add your own category
      </button>
    )
  }
  return (
    <form
      className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-card p-5"
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        startTransition(async () => {
          const result = await addCustomCategory({ label: String(data.get("label") ?? ""), description: String(data.get("description") ?? "") })
          if (!result.ok) return onError(result.error)
          onError(null)
          setOpen(false)
        })
      }}
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-base font-medium text-brand-ink">Category name</span>
        <input name="label" className={fieldClass} required maxLength={80} placeholder="For example: Licensing, Retreats, Books" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-base font-medium text-brand-ink">What belongs here (optional)</span>
        <input name="description" className={fieldClass} maxLength={300} />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={primaryButton} disabled={pending}>
          Add category
        </button>
        <button type="button" className={quietButton} onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function DocumentsPanel({ data, onError }: { data: BusinessProfileData; onError: (m: string | null) => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const typeLabel = new Map<string, string>(DOCUMENT_TYPES.map((t) => [t.value, t.label]))
  return (
    <section aria-labelledby="documents-heading" className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col gap-1">
        <h2 id="documents-heading" className="text-xl font-semibold text-brand-ink">
          Business documents
        </h2>
        <p className="text-base leading-relaxed text-brand-ink-soft">
          Upload one-sheets, biographies, pricing, and proposals. Anything found in them will arrive as drafts for you to review, never as approved information.
        </p>
      </div>
      <form
        ref={formRef}
        className="flex flex-col gap-3 md:flex-row md:items-end"
        onSubmit={(e) => {
          e.preventDefault()
          const body = new FormData(e.currentTarget)
          startTransition(async () => {
            const response = await fetch("/api/business-profile/documents", { method: "POST", body })
            const result = (await response.json().catch(() => ({}))) as { error?: string }
            if (!response.ok) return onError(result.error ?? "Upload failed. Please try again.")
            onError(null)
            formRef.current?.reset()
            router.refresh()
          })
        }}
      >
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-base font-medium text-brand-ink">Document type</span>
          <select name="documentType" className={fieldClass} required defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-base font-medium text-brand-ink">File (PDF, Word, or text, under 4MB)</span>
          <input name="file" type="file" required accept=".pdf,.doc,.docx,.txt,.md" className={cn(fieldClass, "py-2.5")} />
        </label>
        <button type="submit" className={primaryButton} disabled={pending}>
          <FileUp className="size-4" aria-hidden="true" />
          {pending ? "Uploading" : "Upload"}
        </button>
      </form>
      {data.documents.length > 0 && (
        <ul className="flex flex-col divide-y divide-border">
          {data.documents.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-base font-medium text-brand-ink">{d.fileName}</span>
                <span className="text-sm text-brand-ink-soft">
                  {typeLabel.get(d.documentType)} · {new Date(d.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className="text-sm text-brand-ink-soft">
                {d.extractionStatus === "awaiting_extraction" ? "Saved, waiting for extraction" : d.extractionStatus}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function BusinessProfileEditor({ data }: { data: BusinessProfileData }) {
  const [error, setError] = useState<string | null>(null)
  const factsByCategory = useMemo(() => {
    const map = new Map<string, BusinessFact[]>()
    for (const fact of data.facts) map.set(fact.categoryKey, [...(map.get(fact.categoryKey) ?? []), fact])
    return map
  }, [data.facts])

  const active = data.facts.filter((f) => f.status !== "retired")
  const counts = {
    approved: active.filter((f) => f.status === "approved").length,
    draft: active.filter((f) => f.status === "draft").length,
    review: active.filter((f) => f.status === "needs_review").length,
    empty: data.categories.filter((c) => !(factsByCategory.get(c.key) ?? []).some((f) => f.status !== "retired")).length,
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-base leading-relaxed text-brand-ink-soft">
        <span className="font-semibold text-brand-green-dark">{counts.approved} approved</span>
        {" · "}
        {counts.draft} draft
        {" · "}
        <span className={cn(counts.review > 0 && "font-semibold text-brand-coral-dark")}>{counts.review} needs review</span>
        {" · "}
        {counts.empty} {counts.empty === 1 ? "category" : "categories"} not started
      </p>
      <ErrorNote message={error} />
      <ReviewPanel facts={data.facts} categories={data.categories} />
      <div className="flex flex-col gap-3">
        {data.categories.map((category) => (
          <CategorySection key={category.key} category={category} facts={factsByCategory.get(category.key) ?? []} onError={setError} />
        ))}
        <AddCategoryForm onError={setError} />
      </div>
      <ExistingRecords data={data} onError={setError} />
      <DocumentsPanel data={data} onError={setError} />
    </div>
  )
}
