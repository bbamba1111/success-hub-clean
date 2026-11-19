import { PageHeader } from "@/components/boss/primitives"

const STAGES = [
  {
    name: "Starting",
    description: "Building the first offer, finding the first clients, and establishing proof that the business works.",
  },
  {
    name: "Growing",
    description: "Revenue exists. The focus is making it consistent and less dependent on the founder.",
  },
  {
    name: "Scaling",
    description: "A proven model is ready for transferring, systemizing, and multiplying.",
  },
]

export default function BusinessJourneyPage() {
  return (
    <>
      <PageHeader
        eyebrow="The BO$$ · Business Journey"
        title="Where is your business on its journey?"
        description="Your business stage gives The BO$$ context for the kind of work, systems, and support that may be most useful. It is business context—not a daily workday requirement."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {STAGES.map((stage, index) => (
          <section key={stage.name} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stage {index + 1}</p>
            <h2 className="font-display text-2xl font-semibold text-brand-ink">{stage.name}</h2>
            <p className="text-base leading-relaxed text-brand-ink-soft">{stage.description}</p>
          </section>
        ))}
      </div>
      <section className="mt-2 rounded-2xl border border-brand-green/30 bg-brand-sage-light/40 p-6">
        <h2 className="font-display text-2xl font-semibold text-brand-ink">Established founder redesigning the business</h2>
        <p className="mt-2 text-base leading-relaxed text-brand-ink-soft">
          If you are an established founder moving into the Harmony Lane™ approach, your work is not to start over. It is to redesign how your business runs so it respects your human values and sustainability boundaries.
        </p>
      </section>
    </>
  )
}
