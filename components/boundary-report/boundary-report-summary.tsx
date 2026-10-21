import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { StartConsiderationsBlock } from "@/components/boundary-report/start-considerations-block"
import { getLatestBoundaryReport } from "@/lib/boundary-report/actions"
import { WeeklyHistoryList } from "@/components/weekly-audit/weekly-history-list"

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

export async function BoundaryReportSummary() {
  const latest = await getLatestBoundaryReport()

  if (!latest) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-brand-blush px-6 py-9 text-center">
        <p className="max-w-sm font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">
          Your Work-Life Balance Boundary Report™ appears here once you complete the Reality Check™. Your first
          baseline is saved permanently and never overwritten.
        </p>
        <Link
          href="/boundary-report"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 font-sans text-xs font-bold text-white transition-colors hover:bg-brand-green-dark"
        >
          Begin the Reality Check™
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    )
  }

  const data = latest.data
  const willing = data.alignmentResponses?.filter((r) => r.choice === "willing").length ?? 0
  const totalAlignment = data.alignmentResponses?.length ?? 0

  return (
    <div className="flex flex-col">
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
          <ul className="flex flex-col gap-2">
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
            Willing to operate differently in <span className="font-bold text-brand-green">{willing}</span> of{" "}
            {totalAlignment} areas this week.
          </p>
          <div className="flex flex-col gap-1.5">
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

      {(data.personalReality?.length ?? 0) > 0 && (
        <Section label="Personal & Work-From-Home Reality™">
          <ul className="flex flex-col gap-2">
            {data.personalReality!.map((p) => (
              <li key={p.id} className="flex items-start gap-2 font-sans text-sm text-brand-ink">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden />
                {p.label}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(data.startConsiderations || (data.stageConsiderations?.length ?? 0) > 0) && (
        <Section label="Relevant Considerations for Start">
          <StartConsiderationsBlock considerations={data.startConsiderations} fallback={data.stageConsiderations} />
        </Section>
      )}

      <WeeklyHistoryList />
    </div>
  )
}
