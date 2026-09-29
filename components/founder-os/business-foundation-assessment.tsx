"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Loader2, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { renderMarkdown } from "@/lib/utils/markdown-renderer"
import { saveBusinessFoundation, type BusinessFoundation } from "@/utils/business-foundation-storage"

/**
 * Business Foundation Assessment™ — shown inside the AI Augmentation Hour™ on a
 * member's first visit only. Captures the founder's Business Blueprint™, saves
 * it (best-effort, anonymous-safe), then renders Cherry Blossom's AI-generated
 * Executive Summary. After completion the parent stops rendering this component.
 */

interface BusinessFoundationAssessmentProps {
  /** Called once the member finishes (after the summary is shown and dismissed). */
  onComplete?: () => void
  /** Existing record values to prefill when re-opening to update the Blueprint™. */
  initial?: Partial<BusinessFoundation>
}

const STAGE_OPTIONS = ["Idea / Pre-launch", "Just launched", "Growing", "Established", "Scaling"]
const GROWTH_OPTIONS = ["Solo / Lifestyle", "Steady growth", "Aggressive scaling", "Preparing to exit"]
const FUNDING_OPTIONS = ["Bootstrapped", "Revenue-funded", "Investor-backed", "Grants / Other"]
const REVENUE_STAGE_OPTIONS = ["Pre-revenue", "Under $100k", "$100k–$500k", "$500k–$1M", "$1M+"]
const REVENUE_MODEL_OPTIONS = [
  "Services (1:1 or done-for-you)",
  "Products (physical or digital)",
  "Subscriptions / Memberships",
  "Programs / Cohorts",
  "Retail / E-commerce",
  "Licensing / Franchise / Royalties",
  "Advertising / Sponsorship",
  "Donations / Grants",
  "Multiple revenue streams",
]
const SIZE_OPTIONS = ["Just me", "Me + contractors", "Small team (2–5)", "Growing team (6–15)", "15+"]
const AI_READINESS_OPTIONS = [
  "Brand new to AI",
  "Curious / experimenting",
  "Using a few tools",
  "Confident with AI",
  "AI-first operator",
]
const CHALLENGE_OPTIONS = [
  "Not enough leads",
  "Inconsistent revenue",
  "Pricing confidence",
  "Too much admin",
  "No systems",
  "Working too many hours",
  "Delegation / hiring",
  "Marketing / visibility",
  "Sales conversion",
  "Client retention",
]
const KNOWLEDGE_OPTIONS = [
  "Offers & pricing",
  "Marketing & content",
  "Sales & revenue",
  "Operations & systems",
  "Finance & profit",
  "Leadership & delegation",
  "AI & automation",
]
const BOTTLENECK_OPTIONS = [
  "I'm the only one who can sell",
  "I'm the only one who delivers",
  "I make every decision",
  "Content depends entirely on me",
  "Admin lives in my head",
  "No documented processes",
]

/** A single-choice pill group. */
function PillGroup({
  options,
  value,
  onChange,
}: {
  options: string[]
  value?: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              active
                ? "border-[#5D9D61] bg-[#5D9D61] text-white"
                : "border-[#5D9D61]/30 bg-white text-[#3A2E33] hover:border-[#5D9D61]"
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/** A multi-choice pill group. */
function MultiPillGroup({
  options,
  values,
  onChange,
}: {
  options: string[]
  values: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) =>
    values.includes(opt) ? onChange(values.filter((v) => v !== opt)) : onChange([...values, opt])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = values.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              active
                ? "border-[#E26C73] bg-[#E26C73] text-white"
                : "border-[#E26C73]/30 bg-white text-[#3A2E33] hover:border-[#E26C73]"
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

const TOTAL_STEPS = 5

export function BusinessFoundationAssessment({ onComplete, initial }: BusinessFoundationAssessmentProps) {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)

  const [form, setForm] = useState<BusinessFoundation>({
    businessIdentity: initial?.businessIdentity ?? "",
    businessStage: initial?.businessStage,
    growthModel: initial?.growthModel,
    funding: initial?.funding,
    revenueStage: initial?.revenueStage,
    revenueModel: initial?.revenueModel,
    businessSize: initial?.businessSize,
    businessChallenges: initial?.businessChallenges ?? [],
    businessKnowledgeInterests: initial?.businessKnowledgeInterests ?? [],
    founderBottlenecks: initial?.founderBottlenecks ?? [],
    aiReadiness: initial?.aiReadiness,
    founderSuccessVision: initial?.founderSuccessVision ?? "",
    preferredLanguage: initial?.preferredLanguage ?? "English",
    preferredCurrency: initial?.preferredCurrency ?? "USD",
    country: initial?.country ?? "",
    timeZone: initial?.timeZone ?? "",
  })

  const set = <K extends keyof BusinessFoundation>(key: K, val: BusinessFoundation[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  const back = () => setStep((s) => Math.max(1, s - 1))

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await saveBusinessFoundation(form)
      // Generate the one-time Executive Summary from the live context package.
      const res = await fetch("/api/founder-os/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "executive-summary" }),
      })
      const data = await res.json().catch(() => ({}))
      setSummary(
        data?.message ||
          "**Welcome** — Your Business Foundation™ is saved. I'll keep learning about your business and personalize everything from here.",
      )
    } catch {
      setSummary(
        "**Welcome** — Your Business Foundation™ is saved. I'll keep learning about your business and personalize everything from here.",
      )
    } finally {
      setSaving(false)
    }
  }

  // ---- Executive Summary view (after completion) ----
  if (summary) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-[#5D9D61]" />
          <h3 className="text-lg font-bold text-[#5D9D61]">Your Executive Summary</h3>
        </div>
        <div className="rounded-xl border border-[#5D9D61]/20 bg-[#F5F1E8]/60 p-5 text-[#3A2E33]">
          {renderMarkdown(summary)}
        </div>
        <Button
          className="bg-[#E26C73] text-white hover:bg-[#E26C73]/90"
          onClick={() => onComplete?.()}
        >
          Enter My AI Augmentation Hour
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    )
  }

  // ---- Assessment steps ----
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#E26C73]/20 bg-[#E26C73]/5 p-4">
        <p className="flex items-start gap-2 text-sm text-[#3A2E33] leading-relaxed">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#E26C73]" />
          <span>
            {"I'm Cherry Blossom. This is your "}
            <strong>Business Foundation Assessment™</strong>
            {
              " — the Blueprint that connects your Human Operating System to your Business Operating System. It only takes a few minutes, and you'll never have to do it again. There are no wrong answers."
            }
          </span>
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Step {step} of {TOTAL_STEPS}
          </span>
          <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
        </div>
        <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="identity">Who are you, and what does your business do? (one sentence)</Label>
            <Input
              id="identity"
              placeholder="e.g. We're a 6-person design agency, or I run a family HVAC company, or I'm a SaaS founder…"
              value={form.businessIdentity ?? ""}
              onChange={(e) => set("businessIdentity", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>What stage is your business in?</Label>
            <PillGroup options={STAGE_OPTIONS} value={form.businessStage} onChange={(v) => set("businessStage", v)} />
          </div>
          <div className="space-y-2">
            <Label>Which growth model feels most like you?</Label>
            <PillGroup options={GROWTH_OPTIONS} value={form.growthModel} onChange={(v) => set("growthModel", v)} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>How is your business funded?</Label>
            <PillGroup options={FUNDING_OPTIONS} value={form.funding} onChange={(v) => set("funding", v)} />
          </div>
          <div className="space-y-2">
            <Label>Where is your revenue today?</Label>
            <PillGroup
              options={REVENUE_STAGE_OPTIONS}
              value={form.revenueStage}
              onChange={(v) => set("revenueStage", v)}
            />
          </div>
          <div className="space-y-2">
            <Label>What is your primary revenue model?</Label>
            <PillGroup
              options={REVENUE_MODEL_OPTIONS}
              value={form.revenueModel}
              onChange={(v) => set("revenueModel", v)}
            />
          </div>
          <div className="space-y-2">
            <Label>How big is your team?</Label>
            <PillGroup options={SIZE_OPTIONS} value={form.businessSize} onChange={(v) => set("businessSize", v)} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Which challenges are most present right now? (Choose any)</Label>
            <MultiPillGroup
              options={CHALLENGE_OPTIONS}
              values={form.businessChallenges ?? []}
              onChange={(v) => set("businessChallenges", v)}
            />
          </div>
          <div className="space-y-2">
            <Label>Where do you personally feel like the bottleneck? (Choose any)</Label>
            <MultiPillGroup
              options={BOTTLENECK_OPTIONS}
              values={form.founderBottlenecks ?? []}
              onChange={(v) => set("founderBottlenecks", v)}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>What would you love to learn more about? (Choose any)</Label>
            <MultiPillGroup
              options={KNOWLEDGE_OPTIONS}
              values={form.businessKnowledgeInterests ?? []}
              onChange={(v) => set("businessKnowledgeInterests", v)}
            />
          </div>
          <div className="space-y-2">
            <Label>How ready do you feel with AI today?</Label>
            <PillGroup
              options={AI_READINESS_OPTIONS}
              value={form.aiReadiness}
              onChange={(v) => set("aiReadiness", v)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vision">What does success look like for you as a founder?</Label>
            <Textarea
              id="vision"
              rows={3}
              placeholder="e.g. A calm, profitable business that runs in 4 focused hours a day so I have time freedom."
              value={form.founderSuccessVision ?? ""}
              onChange={(e) => set("founderSuccessVision", e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="language">Preferred language</Label>
              <Input
                id="language"
                value={form.preferredLanguage ?? ""}
                onChange={(e) => set("preferredLanguage", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Preferred currency</Label>
              <Input
                id="currency"
                value={form.preferredCurrency ?? ""}
                onChange={(e) => set("preferredCurrency", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={form.country ?? ""} onChange={(e) => set("country", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tz">Time zone</Label>
              <Input
                id="tz"
                placeholder="e.g. America/New_York"
                value={form.timeZone ?? ""}
                onChange={(e) => set("timeZone", e.target.value)}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {"When you're ready, I'll turn this into your personalized Executive Summary."}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={back} disabled={step === 1 || saving} className="text-[#3A2E33]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {step < TOTAL_STEPS ? (
          <Button onClick={next} className="bg-[#5D9D61] text-white hover:bg-[#5D9D61]/90">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={saving} className="bg-[#E26C73] text-white hover:bg-[#E26C73]/90">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating your summary…
              </>
            ) : (
              <>
                Generate My Executive Summary
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
