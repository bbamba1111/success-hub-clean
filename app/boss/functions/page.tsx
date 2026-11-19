import { PageHeader } from "@/components/boss/primitives"
import { FUNCTIONS } from "@/lib/boss/constants"

export default function BusinessFunctionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="The BO$$ · Business Functions"
        title="The seven functions of your business"
        description="Use these business functions to organize the work your business needs. They belong to your overall business operating system—not inside the design of each four-hour workday."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {FUNCTIONS.map((fn, index) => (
          <section key={fn.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Function {index + 1}</p>
            <h2 className="font-display text-2xl font-semibold text-brand-ink">{fn.label}</h2>
            <p className="text-base leading-relaxed text-brand-ink-soft">{fn.purpose}</p>
          </section>
        ))}
      </div>
    </>
  )
}
