import type { Metadata } from "next"
import { FileStack, Layers, Send, Archive } from "lucide-react"
import { DeliverablePreview } from "@/components/output-architecture/deliverable-preview"
import { DELIVERABLES } from "@/lib/output-architecture/deliverable-registry"
import { RENDERERS } from "@/lib/output-architecture/render-engine"
import { DISTRIBUTION_METHODS } from "@/lib/output-architecture/distribution-engine"

export const metadata: Metadata = {
  title: "Deliverable Output Architecture™ | Make Time For More",
  description:
    "The universal Output Architecture™ behind Harmony Lane™ — structured business content rendered and distributed many ways, never tied to a single file type.",
}

const ENGINES = [
  {
    icon: FileStack,
    name: "Deliverable Engine™",
    role: "Creates structured business content",
    detail: "Every deliverable is authored once as structured fields — Structured Business Content™ — not as a file.",
  },
  {
    icon: Layers,
    name: "Render Engine™",
    role: "Transforms content into any format",
    detail: `One content model, ${RENDERERS.length} renderers — from PDF and presentation to Slack, spreadsheet, and Notion.`,
  },
  {
    icon: Send,
    name: "Distribution Engine™",
    role: "Delivers to the right destination",
    detail: "Download, email, Harmony Library™, team sharing, Slack, Teams, Notion — decoupled from how it was rendered.",
  },
  {
    icon: Archive,
    name: "Storage Engine™",
    role: "Manages drafts, versions & templates",
    detail: "Templates, drafts, revisions, and final versions — with version history arriving in a future phase.",
  },
]

/**
 * The Deliverable Output Architecture™ (Phase 5.3) — reference page.
 *
 * Infrastructure, not a document feature. It presents the four-engine model and
 * a representative set of Deliverable Previews. Every deliverable exists ONCE as
 * structured content and can be rendered and distributed many ways. Architecture
 * only: no generation, no download buttons.
 */
export default function OutputArchitecturePage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <header className="harmony-section text-center">
          <p className="ds-eyebrow">The Harmony Lane™ Operating System</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
            The Deliverable Output Architecture™
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-ink-soft sm:text-lg">
            Every plan, playbook, budget, and policy your Executive Leadership Team™ and Professional Advisory Network™
            produce exists once as structured business content — then renders and distributes in whatever format best
            serves you, your team, or your workflow.
          </p>
        </header>

        {/* Core principle */}
        <section className="harmony-glass p-8 text-center sm:p-10" aria-labelledby="principle-heading">
          <p className="ds-eyebrow">The Core Principle</p>
          <h2
            id="principle-heading"
            className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl"
          >
            A deliverable exists once. It renders many ways.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-serif text-base italic leading-relaxed text-brand-ink-soft">
            A PDF is simply one possible output. Nothing is ever tied to a single file type — so the same content can
            become a document, a deck, a checklist, or a Slack message without being rebuilt.
          </p>
        </section>

        {/* The four engines */}
        <section className="harmony-section" aria-labelledby="engines-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="engines-heading" className="ds-page-title">
              Four Engines, One Flow
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Content flows from creation to delivery through four independent engines. Each can evolve — and new
              formats and destinations can be added — without redesigning how deliverables are made.
            </p>
          </div>

          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ENGINES.map((engine, i) => (
              <li key={engine.name} className="harmony-panel flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-green/10">
                    <engine.icon className="h-5 w-5 text-brand-green" aria-hidden />
                  </span>
                  <span className="font-display text-sm font-semibold text-brand-ink-soft/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-brand-ink">{engine.name}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-green">{engine.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{engine.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Deliverable previews */}
        <section className="harmony-section pt-0" aria-labelledby="previews-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="previews-heading" className="ds-page-title">
              Deliverables as Structured Content
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              A representative set of deliverables — each showing its recommended format, the other formats it supports,
              and where it can be delivered. This is the architecture; generation arrives in a later phase.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((deliverable) => (
              <DeliverablePreview key={deliverable.id} deliverable={deliverable} />
            ))}
          </div>
        </section>

        {/* Closing note */}
        <section className="harmony-section pt-0">
          <div className="harmony-surface mx-auto max-w-3xl p-8 text-center sm:p-10">
            <p className="ds-eyebrow">Built as Infrastructure</p>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-brand-ink">
              &ldquo;Every piece of business knowledge produced inside Harmony Lane™ exists once — and can be rendered,
              shared, and distributed in whatever form serves you best.&rdquo;
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
              This Output Architecture™ lets Harmony Lane™ scale from solo entrepreneurs to mature organizations without
              ever redesigning how deliverables are created or shared. Future renderers and integrations — Google Docs,
              Word, Slack, Teams, Notion, and the Harmony Library™ — plug in here.
            </p>
            <p className="mx-auto mt-4 text-xs uppercase tracking-[0.14em] text-brand-ink-soft/70">
              {DISTRIBUTION_METHODS.length} distribution methods · {RENDERERS.length} renderers · one content model
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
