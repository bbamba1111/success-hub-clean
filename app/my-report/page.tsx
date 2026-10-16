import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { getLatestBoundaryReport } from "@/lib/boundary-report/actions"

export const metadata = {
  title: "My Report | Harmony Lane",
  description:
    "Your completed Weekly Work-Life Balance Reality Check™ — original intention, 30-Day Baseline™, Priority Focus Areas™, Business & Workplace Reality™, and Work-Life Balance Alignment™, synthesized.",
}

function scoreColor(score: number): string {
  if (score > 60) return "#5B835F"
  if (score >= 40) return "#E8A84E"
  return "#E26C73"
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-brand-blush py-6 first:border-t-0 first:pt-0">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-brand-coral mb-3">{label}</p>
      {children}
    </div>
  )
}

export default async function MyReportPage() {
  const latest = await getLatestBoundaryReport()

  if (!latest) {
    return (
      <main className="min-h-screen bg-brand-cream">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-4 py-24 text-center">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-coral">My Report</p>
          <h1 className="font-playfair text-3xl font-bold text-brand-ink text-balance">
            You haven&apos;t completed your Reality Check™ yet.
          </h1>
          <p className="font-sans text-sm text-brand-ink-soft text-pretty">
            Your report appears here once you complete the Weekly Work-Life Balance Reality Check™. Your first baseline
            is saved permanently and never overwritten.
          </p>
          <Link
            href="/boundary-report"
            className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-6 py-3 font-sans text-sm font-bold text-white shadow-md transition-all hover:brightness-105"
          >
            Begin the Reality Check™
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </main>
    )
  }

  const data = latest.data
  const willing = data.alignmentResponses?.filter((r) => r.choice === "willing").length ?? 0
  const totalAlignment = data.alignmentResponses?.length ?? 0

  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-coral mb-2">
            My Report
          </p>
          <h1 className="font-playfair text-4xl font-bold text-brand-ink text-balance">
            Your Work-Life Balance Boundary Report™
          </h1>
        </div>

        <div className="rounded-3xl border border-brand-blush bg-white px-7 py-8 shadow-lg">
          <Section label="Original Entrepreneurial Intention™">
            <p className="font-sans text-sm leading-relaxed text-brand-ink italic">
              {data.originalIntention?.summary || "—"}
            </p>
          </Section>

          <Section label="30-Day Work-Life Balance Baseline™">
            <p className="font-sans text-sm text-brand-ink">
              Overall Work-Life Balance Score™:{" "}
              <span className="font-bold" style={{ color: scoreColor(data.baseline?.overall ?? 0) }}>
                {data.baseline?.overall ?? 0}
              </span>
            </p>
          </Section>

          {(data.priorityAreas?.length ?? 0) > 0 && (
            <Section label="Priority Focus Areas™">
              <div className="flex flex-wrap gap-2">
                {data.priorityAreas.map((a) => (
                  <span
                    key={a.key}
                    className="rounded-full bg-brand-coral/10 px-3 py-1 font-sans text-xs font-semibold text-brand-coral"
                  >
                    {a.label}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {(data.businessRequirements?.length ?? 0) > 0 && (
            <Section label="Business & Workplace Reality™">
              <ul className="space-y-2">
                {data.businessRequirements.map((r) => (
                  <li key={r.id} className="flex items-start gap-2 font-sans text-sm text-brand-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-coral" aria-hidden />
                    <span>
                      <span className="font-semibold">{r.label}.</span>{" "}
                      <span className="text-brand-ink-soft">Your diagnostic suggests this may need attention.</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {totalAlignment > 0 && (
            <Section label="Work-Life Balance Alignment™">
              <p className="font-sans text-sm text-brand-ink mb-3">
                Willing to operate differently in{" "}
                <span className="font-bold text-brand-green">{willing}</span> of {totalAlignment} areas this week.
              </p>
              <div className="space-y-1.5">
                {data.alignmentResponses.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-brand-cream/60 px-4 py-2.5"
                  >
                    <span className="font-sans text-sm font-medium text-brand-ink">{r.title}</span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-wider ${
                        r.choice === "willing" ? "bg-brand-green/15 text-brand-green" : "bg-brand-coral/10 text-brand-coral"
                      }`}
                    >
                      {r.choice === "willing" ? "Willing" : "Not sure yet"}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {(data.stageConsiderations?.length ?? 0) > 0 && (
            <Section label="Start → Grow → Scale Considerations">
              <ul className="space-y-2">
                {data.stageConsiderations.map((c) => (
                  <li key={c} className="flex items-start gap-2 font-sans text-sm text-brand-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-6 py-3 font-sans text-sm font-bold text-white shadow-md transition-all hover:brightness-105"
          >
            Join the Work-Life Balance Business Week™
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/harmony-blueprint"
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 px-6 py-3 font-sans text-sm font-bold text-brand-green transition-colors hover:bg-brand-green/5"
          >
            Harmony Blueprint™
          </Link>
        </div>
      </div>
    </main>
  )
}
