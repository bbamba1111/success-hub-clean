/**
 * Cherry Blossom™ Identity Section (Phase 7.1)
 * ---------------------------------------------------------------------------
 * The masthead that opens the cherry-blossom page. Establishes who Cherry
 * Blossom™ is — not a chatbot, not an assistant, but the Chief of Staff &
 * Executive Conductor™ of the Harmony Lane™ Operating System.
 *
 * Visual identity:
 *   - White canvas. Thin editorial rule. Generous whitespace.
 *   - Playfair Display for the headline — large, authoritative, warm.
 *   - Coral accent spine + blush left border on the quote panel.
 *   - Her responsibilities listed as a clean, editorial left-aligned grid.
 *   - No chat UI, no speech bubbles, no prompt boxes.
 */

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function CherryBlossomIdentitySection() {
  return (
    <header className="border-b border-black/[0.08] bg-white px-4 pt-10 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.16em] text-[#5B835F] transition-colors hover:text-[#4c6f50]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Live Today™
        </Link>

        {/* Identity block */}
        <div className="mt-8 flex items-start gap-5">
          <div className="relative shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-[#E26C73]/25 shadow-md">
              <img
                src="/images/logo.png"
                alt="Cherry Blossom"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Active indicator */}
            <span
              aria-label="Cherry Blossom is active"
              className="absolute bottom-1 right-1 inline-block h-3.5 w-3.5 rounded-full border-2 border-white bg-[#5B835F]"
            />
          </div>

          <div className="flex-1">
            <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-[#E26C73]">
              Cherry Blossom™
            </p>
            <h1 className="mt-1 font-playfair text-2xl font-medium leading-tight text-[#1A1A1A] text-balance sm:text-3xl">
              Chief of Staff &amp; Executive Conductor™
            </h1>
            <p className="mt-2 font-montserrat text-sm leading-relaxed text-[#6B5860]">
              Harmony Lane™ Operating System
            </p>
          </div>
        </div>

        {/* Philosophy statement */}
        <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#E26C73]/20 bg-[#FDF6F6] px-7 py-6">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px] bg-[#E26C73]"
          />
          <p className="font-playfair text-[17px] font-medium italic leading-relaxed text-[#3A2E33] text-pretty sm:text-[18px]">
            &ldquo;I already understand your business, remember what matters in your life, have
            thoughtfully prioritized today for you, and have quietly prepared everything you
            need — so you can focus on doing your best work within your 4-Hour CEO
            Workday™, and then fully enjoy your Time Freedom™.&rdquo;
          </p>
        </div>

        {/* Role responsibilities — editorial grid */}
        <div className="mt-8">
          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-[#6B5860]">
            My Responsibilities™
          </p>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {RESPONSIBILITIES.map((r) => (
              <div key={r} className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="inline-block h-1 w-4 shrink-0 bg-[#E26C73]"
                />
                <span className="font-montserrat text-sm text-[#3A2E33]">{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture diagram — Conversation Without Chat™ */}
        <div className="mt-8 rounded-2xl border border-black/[0.07] bg-white px-6 py-5">
          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.16em] text-[#5B835F]">
            How I Orchestrate Your Operating System™
          </p>
          <div className="mt-4 space-y-2">
            {ORCHESTRATION_LAYERS.map((layer, i) => (
              <div key={layer.name} className="flex items-center gap-3">
                <span className="font-montserrat text-xs font-semibold tabular-nums text-[#6B5860]/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 rounded-lg border border-black/[0.06] bg-[#FAFAFA] px-4 py-2">
                  <span className="font-montserrat text-xs font-semibold text-[#3A2E33]">
                    {layer.name}
                  </span>
                  <span className="ml-2 font-montserrat text-xs text-[#6B5860]">
                    {layer.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

const RESPONSIBILITIES: string[] = [
  "Briefing",
  "Prioritizing",
  "Coordinating",
  "Explaining",
  "Anticipating",
  "Encouraging",
  "Protecting",
  "Celebrating",
  "Escalating",
  "Remembering",
]

const ORCHESTRATION_LAYERS = [
  { name: "Harmony Context Engine™", role: "— who the founder is" },
  { name: "Executive Decision Engine™", role: "— how decisions get made" },
  { name: "Founder GPS™", role: "— what to do next" },
  { name: "Executive Leadership Team™", role: "— who executes it" },
  { name: "Harmony Business Academy™", role: "— what to learn" },
  { name: "Explainability™", role: "— why every recommendation exists" },
]
