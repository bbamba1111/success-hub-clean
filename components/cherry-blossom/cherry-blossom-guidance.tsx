import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"

/**
 * Cherry Blossom Guidance™ — the standard coaching pattern for Harmony Lane™.
 *
 * Phase 6.0 principle: the software presents the structure; Cherry Blossom
 * presents the experience. Everywhere a page would otherwise explain itself
 * with a block of instructional copy, it instead speaks in Cherry Blossom's
 * voice through this component. She always speaks from context — never a
 * generic "How can I help?".
 *
 * This is presentation only. It renders whatever contextual message the page
 * passes in; the calling page owns the context (Reality Check™, Focus Areas™,
 * weekly intention, Business Stage™, current segment, day of week, etc.).
 */

interface GuidanceAction {
  label: string
  /** Render as a link when provided. */
  href?: string
  /** Render as a button when provided (ignored if href is set). */
  onClick?: () => void
  disabled?: boolean
}

export function CherryBlossomGuidance({
  greeting,
  children,
  avatarSrc = "/images/logo.png",
  size = "default",
  primaryAction,
  secondaryAction,
  footnote,
}: {
  /** Optional bold opening line, e.g. "Welcome back, Barbara." */
  greeting?: string
  /** Cherry Blossom's contextual coaching message. */
  children: ReactNode
  avatarSrc?: string
  size?: "default" | "lg"
  /** Optional "Continue" style call to action. */
  primaryAction?: GuidanceAction
  /** Optional secondary "Next Step" / alternative action. */
  secondaryAction?: GuidanceAction
  /** Optional small helper line beneath the message. */
  footnote?: string
}) {
  const hasActions = Boolean(primaryAction || secondaryAction)

  return (
    <section
      aria-label="Cherry Blossom guidance"
      className="relative overflow-hidden rounded-2xl border border-brand-blush bg-card shadow-ds"
    >
      {/* Subtle cherry blossom accent — a soft blush wash anchored top-right. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-blush/60 blur-2xl"
      />
      {/* Coral spine to signal Cherry Blossom's voice. */}
      <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-brand-coral/70" />

      <div className={`relative ${size === "lg" ? "p-7 sm:p-9" : "p-6 sm:p-7"}`}>
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-brand-blush shadow-sm">
            <img src={avatarSrc || "/placeholder.svg"} alt="Cherry Blossom" className="h-full w-full object-cover" />
          </span>
          <span className="ds-eyebrow text-brand-coral-dark">Cherry Blossom&trade;</span>
        </div>

        {greeting && (
          <p
            className={`mt-4 font-display font-semibold tracking-tight text-brand-ink text-balance ${
              size === "lg" ? "text-2xl" : "text-xl"
            }`}
          >
            {greeting}
          </p>
        )}

        <div
          className={`${greeting ? "mt-2" : "mt-4"} space-y-3 font-serif italic leading-relaxed text-brand-ink-soft text-pretty ${
            size === "lg" ? "text-lg" : "text-base"
          }`}
        >
          {children}
        </div>

        {footnote && <p className="mt-3 text-sm not-italic leading-relaxed text-brand-ink-soft/80">{footnote}</p>}

        {hasActions && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {primaryAction && <GuidanceCta action={primaryAction} variant="primary" />}
            {secondaryAction && <GuidanceCta action={secondaryAction} variant="secondary" />}
          </div>
        )}
      </div>
    </section>
  )
}

function GuidanceCta({ action, variant }: { action: GuidanceAction; variant: "primary" | "secondary" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 disabled:cursor-not-allowed disabled:opacity-50"
  const styles =
    variant === "primary"
      ? "bg-brand-green text-white shadow-ds hover:bg-brand-green-dark"
      : "border border-brand-coral/40 bg-transparent text-brand-coral-dark hover:bg-brand-blush/50"

  const content = (
    <>
      {action.label}
      {variant === "primary" && <ArrowRight className="ds-icon-sm" aria-hidden />}
    </>
  )

  if (action.href) {
    return (
      <Link href={action.href} className={`${base} ${styles}`}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={action.onClick} disabled={action.disabled} className={`${base} ${styles}`}>
      {content}
    </button>
  )
}

export default CherryBlossomGuidance
