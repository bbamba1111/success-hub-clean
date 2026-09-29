import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Copy,
  Download,
  FilePenLine,
  FileText,
  Globe,
  Hash,
  Handshake,
  LayoutDashboard,
  Library,
  ListChecks,
  Mail,
  MessageSquare,
  MessagesSquare,
  PackageCheck,
  Plug,
  Presentation,
  Printer,
  Sparkles,
  Table,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"
import type { Deliverable } from "@/lib/output-architecture/deliverable-registry"
import { getRenderer } from "@/lib/output-architecture/render-engine"
import { getDistribution } from "@/lib/output-architecture/distribution-engine"
import { getExecutionPath } from "@/lib/output-architecture/execution-engine"
import { getExecutive } from "@/lib/executive-team/executive-registry"
import { getAdvisor } from "@/lib/advisory-network/advisor-registry"

/** Maps the catalog icon-name strings to lucide components (presentation layer). */
const ICONS: Record<string, LucideIcon> = {
  FileText,
  FilePenLine,
  Mail,
  Presentation,
  Table,
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  Globe,
  Hash,
  MessageSquare,
  MessagesSquare,
  BookOpen,
  Download,
  Printer,
  Copy,
  Library,
  Users,
  Plug,
  User,
  Sparkles,
  Handshake,
  PackageCheck,
  BadgeCheck,
}

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? FileText
  return <Cmp className={className} aria-hidden />
}

/** Resolve the owning executive/advisor's display name. */
function ownerName(deliverable: Deliverable): string {
  if (deliverable.ownerType === "advisor") return getAdvisor(deliverable.ownerId)?.name ?? "Advisor"
  return getExecutive(deliverable.ownerId)?.name ?? "Executive"
}

/**
 * DeliverablePreview — the reusable window into a single deliverable.
 *
 * Presentation only: it shows the Output Architecture™ (how the deliverable CAN
 * be rendered and distributed) — NOT the generated output. No download buttons,
 * no generation. It is intentionally calm: the recommended renderer leads, and
 * everything else is quiet supporting detail.
 */
export function DeliverablePreview({ deliverable }: { deliverable: Deliverable }) {
  const {
    name,
    category,
    description,
    deliveryLevel,
    recommendedRenderer,
    supportedRenderers,
    distributionOptions,
    requiresProfessionalReview,
    professionalNotice,
  } = deliverable

  const recommended = getRenderer(recommendedRenderer)
  const deliveryPath = getExecutionPath(deliveryLevel)
  const alsoAvailable = supportedRenderers.filter((r) => r !== recommendedRenderer)

  return (
    <article className="harmony-panel flex h-full flex-col p-6 ds-transition hover:-translate-y-0.5 hover:shadow-ds-md sm:p-7">
      {/* Category + owner */}
      <div className="flex items-center justify-between gap-3">
        <p className="ds-eyebrow">{category}</p>
        {requiresProfessionalReview && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/25 bg-brand-green/[0.08] px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-brand-green">
            <BadgeCheck className="h-3 w-3" aria-hidden />
            Professional Review
          </span>
        )}
      </div>

      {/* Name + owner */}
      <div className="mt-4">
        <h3 className="font-display text-xl font-semibold tracking-tight text-brand-ink">{name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-green">{ownerName(deliverable)}</p>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{description}</p>

      <hr className="harmony-divider my-6" />

      {/* Delivery level + recommended renderer — the two things that lead */}
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Delivery Level</dt>
          <dd className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-ink">
            {deliveryPath && <Icon name={deliveryPath.icon} className="h-4 w-4 text-brand-green" />}
            {deliveryPath?.label ?? deliveryLevel}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Recommended</dt>
          <dd className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink">
            {recommended && <Icon name={recommended.icon} className="h-4 w-4 text-brand-green" />}
            {recommended?.label ?? recommendedRenderer}
          </dd>
        </div>
      </dl>

      {/* Also available renderers — quiet pills */}
      {alsoAvailable.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Also Available</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {alsoAvailable.map((r) => {
              const def = getRenderer(r)
              return (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 rounded-md border border-black/[0.07] bg-brand-cream px-2.5 py-1 text-xs text-brand-ink-soft"
                >
                  {def && <Icon name={def.icon} className="h-3.5 w-3.5 text-brand-green/70" />}
                  {def?.label ?? r}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Distribution — quiet supporting detail, pushed toward the base */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Distribution</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
          {distributionOptions.map((d) => {
            const def = getDistribution(d)
            return (
              <span key={d} className="inline-flex items-center gap-1.5 text-xs text-brand-ink-soft">
                {def && <Icon name={def.icon} className="h-3.5 w-3.5 text-brand-green/70" />}
                {def?.label ?? d}
              </span>
            )
          })}
        </div>
      </div>

      {/* Professional review notice — only when applicable */}
      {requiresProfessionalReview && professionalNotice && (
        <div className="mt-auto pt-6">
          <p className="rounded-lg border border-brand-green/20 bg-brand-green/[0.06] px-4 py-3 text-xs leading-relaxed text-brand-ink-soft">
            <span className="font-semibold text-brand-ink">Professional Review Notice.</span> {professionalNotice}
          </p>
        </div>
      )}
    </article>
  )
}
