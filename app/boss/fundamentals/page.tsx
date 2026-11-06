import Link from "next/link"
import { ArrowRight, Sprout } from "lucide-react"
import { PageHeader } from "@/components/boss/primitives"
import { SEVEN_BUSINESS_FUNCTIONS } from "@/lib/business-functions"
import { STARTUP_BUSINESS_FUNDAMENTALS } from "@/lib/startup-business-fundamentals/registry"
import { EXECUTIVE_TEAM } from "@/lib/executive-team/executive-registry"

const EXECUTIVE_NAMES = new Map(EXECUTIVE_TEAM.map((executive) => [executive.id, executive.name]))
const FUNCTION_NAMES = new Map(SEVEN_BUSINESS_FUNCTIONS.map((fn) => [fn.jobKey, fn.label]))

const WORK_MODES = [
  ["Build", "Create a foundation that is not in place yet."],
  ["Improve", "Strengthen something that already exists."],
  ["Validate", "Test assumptions and gather real-world evidence."],
  ["Redesign", "Change an approach that no longer serves the business."],
] as const

export default function StartupBusinessFundamentalsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Build My Business · Available to Every Founder"
        title="Startup Business Fundamentals™"
        description="Build the foundations. Strengthen the business. Reduce unnecessary work. Whether you are starting, established, growing, scaling, or pivoting, these fundamentals are here for you."
        actions={
          <Link href="/boss" className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-green px-5 text-base font-medium text-primary-foreground hover:bg-brand-green-dark">
            Go to My Business Day <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        }
      />

      <section className="rounded-2xl border border-brand-sage bg-brand-sage-light p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card text-brand-green-dark">
            <Sprout className="h-6 w-6" aria-hidden />
          </span>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-brand-ink">You do not have to start from the beginning.</h2>
            <p className="text-base leading-relaxed text-brand-ink-soft">
              You may already have strong foundations in some areas and need help in others. Choose any area to explore. The goal is not to complete every topic; it is to strengthen the parts of your business that will make the greatest difference.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-brand-ink">Eight fundamentals every founder can use</h2>
          <p className="mt-1 text-base text-brand-ink-soft">Explore the area that matters to your business right now.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {STARTUP_BUSINESS_FUNDAMENTALS.map((fundamental, index) => (
            <article id={fundamental.id} key={fundamental.id} className="flex scroll-mt-24 flex-col gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-sage-light text-base font-semibold text-brand-green-dark">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-brand-ink">{fundamental.title}</h3>
                  <p className="text-base leading-relaxed text-brand-ink-soft">{fundamental.summary}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What you can work toward</p>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-base text-brand-ink">
                  {fundamental.outcomes.slice(0, 4).map((outcome) => <li key={outcome}>{outcome}</li>)}
                </ul>
              </div>
              <div className="flex flex-col gap-2 border-t border-border pt-3">
                <p className="text-sm font-semibold text-brand-ink">Related business functions</p>
                <div className="flex flex-wrap gap-2">
                  {fundamental.businessFunctionKeys.map((key) => (
                    <span key={key} className="rounded-full bg-muted px-3 py-1 text-sm text-brand-ink-soft">{FUNCTION_NAMES.get(key) ?? key}</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Executive support: {fundamental.leadExecutiveIds.map((id) => EXECUTIVE_NAMES.get(id) ?? id).join(", ")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {fundamental.workModes.map((mode) => (
                  <span key={mode} className="rounded-full border border-border px-3 py-1 text-sm capitalize text-brand-ink-soft">{mode}</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Guided assessment, progress saving, and AI Executive work routing are being connected in subsequent implementation phases.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <h2 className="text-xl font-semibold text-brand-ink">Choose how you want to work on a fundamental</h2>
          <p className="mt-1 text-base text-brand-ink-soft">The right starting point depends on what is already in place—not how long you have been in business.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {WORK_MODES.map(([title, description]) => (
            <div key={title} className="rounded-xl bg-muted/60 p-4">
              <h3 className="font-semibold text-brand-ink">{title}</h3>
              <p className="mt-1 text-base text-brand-ink-soft">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-brand-ink">Make the work part of your business day</h2>
        <p className="mt-2 text-base leading-relaxed text-brand-ink-soft">
          Use Decide & Design My Business Day™ to choose the outcomes that matter now. Cherry Blossom™ is intended to coordinate the appropriate AI Executives and help prepare approved work for your 4-Hour Focused CEO Workday™. The founder remains in control of decisions, approvals, and commitments.
        </p>
        <Link href="/boss" className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-brand-green-dark hover:underline">
          Plan My Business Day <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
    </>
  )
}
