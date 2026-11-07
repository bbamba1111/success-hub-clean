import type { ReactNode } from "react"

/**
 * BlossomMark — a small, clean cherry-blossom brand glyph.
 *
 * Rendered inline (not a raster asset) so it stays crisp on the white canvas
 * and inherits currentColor. This is Cherry Blossom's signature — it should
 * only ever appear where she is speaking.
 */
function BlossomMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden focusable="false">
      {/* five soft petals around a center — a stylized sakura blossom */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <path
          key={angle}
          d="M12 4.2c1.5 0 2.7 1.2 2.7 2.7 0 1.2-1.2 2.4-2.7 3.3-1.5-.9-2.7-2.1-2.7-3.3C9.3 5.4 10.5 4.2 12 4.2Z"
          fill="currentColor"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="1.6" fill="#E88FA2" />
    </svg>
  )
}

export interface CherryGuidanceProps {
  /** Short kicker above the message. Defaults to her name + role. */
  eyebrow?: string
  /** Optional bold headline for the guidance. */
  title?: string
  /** The guidance body — Cherry Blossom speaking to the founder. */
  children: ReactNode
  /**
   * "surface"  → white card with a blossom accent (in-flow guidance).
   * "spotlight" → elevated glass, for the focal moment of a workspace.
   */
  tone?: "surface" | "spotlight"
  className?: string
}

/**
 * CherryGuidance — the single, reusable way Cherry Blossom™ speaks to a member.
 *
 * Whenever Cherry Blossom communicates, she must immediately stand out as a
 * trusted executive mentor — never blending into surrounding content. This
 * component gives her one consistent, premium presentation across every
 * workspace: a blossom-marked avatar, a blossom accent line, strong type
 * hierarchy, and comfortable spacing on a clean white (or glass) surface.
 */
export function CherryGuidance({
  eyebrow = "Cherry Blossom™ · Your Guide",
  title,
  children,
  tone = "surface",
  className = "",
}: CherryGuidanceProps) {
  const shell =
    tone === "spotlight"
      ? "harmony-glass shadow-ds-lg"
      : "rounded-xl border border-black/[0.06] bg-card shadow-ds"

  return (
    <section
      className={`relative overflow-hidden ${shell} ${className}`}
      aria-label="Guidance from Cherry Blossom"
    >
      {/* Blossom accent line — her signature edge. */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-green via-brand-green-soft to-brand-coral"
      />

      <div className="flex items-start gap-4 p-6 pl-7 sm:gap-5 sm:p-8 sm:pl-9">
        {/* Avatar */}
        <span
          aria-hidden
          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green/10 ring-1 ring-brand-green/20"
        >
          <BlossomMark className="h-6 w-6 text-brand-green" />
        </span>

        {/* Message */}
        <div className="min-w-0 flex-1">
          <p className="ds-eyebrow">{eyebrow}</p>
          {title ? <h2 className="ds-section-title mt-2 text-balance">{title}</h2> : null}
          <div
            className={`${title ? "mt-3" : "mt-2"} text-pretty text-[15px] leading-relaxed text-brand-ink sm:text-base`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
