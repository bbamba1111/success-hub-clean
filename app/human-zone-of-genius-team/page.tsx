"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { CollapsibleSection } from "@/components/founder-os/collapsible-section"
import { ExecutiveBriefing } from "@/components/founder-os/executive-briefing"
import { AIAugmentationHour } from "@/components/founder-os/ai-augmentation-hour"
import { HumanZoneOfGenius } from "@/components/founder-os/human-zone-of-genius"
import { AIExecutiveLeadershipTeam } from "@/components/founder-os/ai-executive-leadership-team"
import { ExecutionCenter } from "@/components/founder-os/execution-center"

/**
 * 4-Hour Focused CEO Dashboard™ — the Founder Operating System™ headquarters.
 *
 * A sequenced, collapsible executive command center that opens at 1:00 PM:
 * understand → prepare → prioritize → execute → review.
 *   1. 🌸 Executive Briefing (daily AI briefing)
 *   2. 🤖 AI Augmentation Hour™ (first visit: Business Foundation Assessment™;
 *      thereafter: Eliminate / Systemize / Automate / Delegate)
 *   3. 🎯 Human Zone of Genius™
 *   4. 👥 Your AI Executive Leadership Team™
 *   5. 🚀 Execution Center™
 *   6. ▼ Business Language University™ + CEO Reflection (placeholders)
 */
export default function CEODashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8]/40">
      <header className="border-b bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
            <Clock className="h-4 w-4 text-[#5D9D61]" />
            1:00–5:00 PM · Mon–Thu
          </span>
        </div>
      </header>

      {/* Dynamic Hero */}
      <section className="bg-gradient-to-b from-[#5D9D61]/10 to-transparent">
        <div className="mx-auto max-w-5xl px-6 py-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-[#E26C73]/10 px-4 py-1.5 text-sm font-semibold text-[#E26C73]">
            Founder Operating System™
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight text-[#5D9D61] md:text-5xl">
            4-Hour Focused CEO Dashboard™
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {
              "Your executive headquarters. Move through each workspace in order — understand, prepare, prioritize, execute, and review — so you spend your four focused hours on the 20% only you can do."
            }
          </p>
        </div>
      </section>

      {/* Ordered, collapsible workspaces */}
      <main className="mx-auto max-w-5xl space-y-4 px-4 pb-20 sm:px-6">
        <CollapsibleSection
          emoji="🌸"
          title="Executive Briefing"
          subtitle="Cherry Blossom's daily read on your business and your week"
          badge="Step 1 of 5"
          defaultOpen
        >
          <ExecutiveBriefing />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🤖"
          title="AI Augmentation Hour™"
          subtitle="Lighten your load before the workday: eliminate, systemize, automate, delegate"
          badge="Step 2 of 5"
          accent="#E26C73"
        >
          <AIAugmentationHour />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🎯"
          title="Human Zone of Genius™"
          subtitle="The irreplaceable 20% only you can do"
          badge="Step 3 of 5"
        >
          <HumanZoneOfGenius />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="👥"
          title="Your AI Executive Leadership Team™"
          subtitle="Functions that educate, recommend, and (soon) build deliverables for your approval"
          badge="Step 4 of 5"
          accent="#E26C73"
        >
          <AIExecutiveLeadershipTeam />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🚀"
          title="Execution Center™"
          subtitle="Where approved work flows from draft to published"
          badge="Step 5 of 5"
        >
          <ExecutionCenter />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🎓"
          title="Business Language University™"
          subtitle="Build fluency in the language of business, on your terms"
        >
          <div className="rounded-xl border border-[#5D9D61]/20 bg-white/70 p-5">
            <p className="text-[#3A2E33] leading-relaxed">
              {
                "Coming soon. Short, founder-friendly lessons tailored to the topics you chose in your Business Foundation™ — pricing, marketing, sales, operations, finance, leadership, and AI — so every recommendation makes more sense over time."
              }
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🪷"
          title="CEO Reflection"
          subtitle="Close your workday with a moment of intention"
        >
          <div className="rounded-xl border border-[#5D9D61]/20 bg-white/70 p-5">
            <p className="text-[#3A2E33] leading-relaxed">
              {
                "Coming soon. A gentle end-of-workday reflection to capture what moved forward, what you learned, and what matters most tomorrow — feeding directly into your next Executive Briefing."
              }
            </p>
          </div>
        </CollapsibleSection>
      </main>
    </div>
  )
}
