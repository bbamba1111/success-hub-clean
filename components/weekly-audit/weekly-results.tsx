import type { WeeklyAuditReport, WeeklyComparison } from "@/lib/boundary-report/weekly-types"

const FOCUS_THRESHOLD = 60
const SCORE_RED_PINK = "#A8875A"
const SCORE_PINK = "#C9A87C"
const SCORE_GREEN = "#5B835F"

function scoreColor(score: number): string {
  if (score > FOCUS_THRESHOLD) return SCORE_GREEN
  if (score >= 40) return SCORE_PINK
  return SCORE_RED_PINK
}

export function formatAuditDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatPeriod(start: string | null | undefined, end: string | null | undefined): string {
  if (!start || !end) return "—"
  return `${formatAuditDate(start)} – ${formatAuditDate(end)}`
}

function Delta({ value, label }: { value: number | undefined; label: string }) {
  if (typeof value !== "number") return null
  const text = value === 0 ? "No change" : `${value > 0 ? "+" : ""}${value}`
  const tone = value > 0 ? "text-brand-green" : value < 0 ? "text-brand-tan-dark" : "text-brand-ink-soft"
  return (
    <span className="font-sans text-xs text-brand-ink-soft">
      <span className={`font-bold tabular-nums ${tone}`}>{text}</span> {label}
    </span>
  )
}

function ComparisonCard({ title, note, comparison }: { title: string; note: string; comparison: WeeklyComparison }) {
  const d = comparison.overallDelta
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-brand-sage-light bg-white px-5 py-4">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">{title}</p>
      <p className="font-sans text-sm text-brand-ink">
        <span className="font-bold tabular-nums">{comparison.overall}</span> on{" "}
        {formatAuditDate(comparison.completedAt)} ·{" "}
        <span className={`font-bold tabular-nums ${d > 0 ? "text-brand-green" : d < 0 ? "text-brand-tan-dark" : ""}`}>
          {d === 0 ? "no change" : `${d > 0 ? "+" : ""}${d} points`}
        </span>
      </p>
      <p className="font-sans text-xs leading-relaxed text-brand-ink-soft text-pretty">{note}</p>
    </div>
  )
}

export function WeeklyResults({ report }: { report: WeeklyAuditReport }) {
  const { previousWeekly, initialBaseline } = report.comparisons
  const priorityKeys = new Set(report.priorityAreas.map((a) => a.key))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-tan-dark">
          Weekly 7-Day Work-Life Balance Audit™
        </p>
        <h2 className="font-playfair text-3xl font-bold text-brand-ink text-balance">
          Your 7-Day Work-Life Balance Results™
        </h2>
        <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-sans text-sm text-brand-ink-soft">
          <div className="flex gap-1.5">
            <dt>Completed</dt>
            <dd className="font-semibold text-brand-ink">{formatAuditDate(report.completedAt)}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt>Period measured</dt>
            <dd className="font-semibold text-brand-ink">{formatPeriod(report.periodStart, report.periodEnd)}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center gap-5 rounded-3xl border border-brand-sage-light bg-white px-6 py-6">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4"
          style={{ borderColor: scoreColor(report.overall) }}
        >
          <span className="font-sans text-2xl font-bold tabular-nums" style={{ color: scoreColor(report.overall) }}>
            {report.overall}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-tan-dark">
            Overall Work-Life Balance Score™
          </p>
          <p className="font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">
            Each score shows how often you had time for that area over the past seven days, from 20 (never) to 100
            (always). The overall score is the average of all 15 Core Life Value Areas™. Areas at 60 or below may
            need more protected time this week.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {previousWeekly ? (
          <ComparisonCard
            title="Compared with last weekly audit"
            note={`Same 7-day measure, period ${formatPeriod(previousWeekly.periodStart, previousWeekly.periodEnd)}.`}
            comparison={previousWeekly}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-brand-sage-light bg-white px-5 py-4">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">
              Compared with last weekly audit
            </p>
            <p className="mt-1 font-sans text-sm text-brand-ink-soft text-pretty">
              This is your first weekly audit. Your week-to-week trend begins next Monday.
            </p>
          </div>
        )}
        {initialBaseline ? (
          <ComparisonCard
            title="Compared with your 30-day baseline"
            note="Different assessment period: your baseline measured 30 days; this audit measures 7."
            comparison={initialBaseline}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-brand-sage-light bg-white px-5 py-4">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">
              Compared with your 30-day baseline
            </p>
            <p className="mt-1 font-sans text-sm text-brand-ink-soft text-pretty">
              No 30-day baseline on file yet. It&apos;s created by the full Work-Life Balance Reality Check™.
            </p>
          </div>
        )}
      </div>

      <ul className="flex flex-col gap-2.5" aria-label="Scores for all 15 Core Life Value Areas">
        {report.areas.map((a) => (
          <li key={a.key} className="rounded-2xl border border-brand-sage-light bg-white px-5 py-3.5">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-sans text-sm font-semibold text-brand-ink">
                {a.label}
                {priorityKeys.has(a.key) && (
                  <span className="rounded-full bg-brand-tan-dark/10 px-2 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-wider text-brand-tan-dark">
                    Priority
                  </span>
                )}
              </span>
              <span className="font-sans text-sm font-bold tabular-nums" style={{ color: scoreColor(a.score) }}>
                {a.score}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-cream">
              <div className="h-full rounded-full" style={{ width: `${a.score}%`, backgroundColor: scoreColor(a.score) }} />
            </div>
            {(previousWeekly || initialBaseline) && (
              <div className="mt-1.5 flex flex-wrap gap-x-4">
                <Delta value={previousWeekly?.areaDeltas[a.key]} label="vs last week" />
                <Delta value={initialBaseline?.areaDeltas[a.key]} label="vs 30-day baseline" />
              </div>
            )}
          </li>
        ))}
      </ul>

      {report.priorityAreas.length > 0 && (
        <div className="rounded-2xl border border-brand-tan-dark/25 bg-white px-5 py-4">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-tan-dark">
            My Priority Focus Areas™ this week
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {report.priorityAreas.map((a) => (
              <li
                key={a.key}
                className="rounded-full border border-brand-tan-dark/25 bg-brand-cream px-4 py-1.5 font-sans text-sm font-semibold text-brand-ink"
              >
                {a.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
