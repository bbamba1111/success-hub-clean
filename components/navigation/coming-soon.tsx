import Link from "next/link"
import { ArrowLeft, type LucideIcon } from "lucide-react"

/**
 * ComingSoon — a calm placeholder for a permanent destination that exists in
 * the navigation but hasn't been built yet (Pass 4A.1 IA reset).
 *
 * Uses the established Harmony Lane™ visual language so the placeholder feels
 * like a quiet, intentional room rather than an error state. The "planned home"
 * list previews the modules that will eventually live here.
 */
export function ComingSoon({
  eyebrow,
  title,
  tagline,
  icon: Icon,
  planned,
}: {
  eyebrow: string
  title: string
  tagline: string
  icon: LucideIcon
  planned: string[]
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="mx-auto flex max-w-3xl flex-col px-6 py-16 sm:py-24">
        <section className="harmony-workspace p-8 sm:p-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-green/10">
            <Icon className="h-7 w-7 text-brand-green" aria-hidden />
          </div>

          <p className="ds-eyebrow mt-6 text-brand-green-dark/80">{eyebrow}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-brand-ink text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl font-serif text-lg leading-relaxed text-brand-ink-soft text-pretty">
            {tagline}
          </p>

          <hr className="harmony-divider my-8" />

          <p className="ds-eyebrow text-brand-ink-soft/70">Arriving soon in this space</p>
          <ul className="mt-4 space-y-3">
            {planned.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden />
                <span className="text-[15px] leading-relaxed text-brand-ink">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 self-start text-sm font-medium text-brand-ink-soft transition-colors hover:text-brand-green"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Live Today™
        </Link>
      </div>
    </main>
  )
}
