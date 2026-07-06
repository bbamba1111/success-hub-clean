"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { CollapsibleSection } from "@/components/founder-os/collapsible-section"
import { ExecutiveBriefing } from "@/components/founder-os/executive-briefing"
import { BusinessFoundationWorkspace } from "@/components/founder-os/business-foundation-workspace"
import { AIAugmentationHour } from "@/components/founder-os/ai-augmentation-hour"
import { AIExecutiveLeadershipTeam } from "@/components/founder-os/ai-executive-leadership-team"
import { HumanZoneOfGenius } from "@/components/founder-os/human-zone-of-genius"
import { ExecutionCenter } from "@/components/founder-os/execution-center"

/**
 * 4-Hour Focused CEO Dashboard™ — the Founder Operating System™ headquarters.
 *
 * A sequenced, collapsible executive command center that opens at 1:00 PM:
 * understand → prepare → prioritize → execute → review.
 *   1. 🌸 Executive Briefing (daily AI briefing)
 *   2. 🌱 Business Foundation Assessment™ (the Blueprint — set once, refine anytime)
 *   3. 🤖 AI Augmentation Hour™ (AI Augmentation™ intro → Choose One Lever →
 *      the AI Transformation Executive™ / Chief AI Officer command center)
 *   4. 👥 Your AI Executive Leadership Team™ (Cherry Blossom + 8 executives)
 *   5. 🎯 Human Zone of Genius™
 *   6. 🚀 Execution Center™
 *   7. ▼ Business Language University™ + CEO Reflection (placeholders)
 *
 * Each workspace is a tab in a descending shade of sage green, with white
 * content backgrounds for readable text.
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
          <span className="mb-4 inline-block rounded-full bg-[#5D9D61]/10 px-4 py-1.5 text-sm font-semibold text-[#5D9D61]">
            Founder Operating System™
          </span>
          <h1 className="text-balance text-4xl font-bold leading-tight text-[#2F5A3A] md:text-5xl">
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
          badge="Step 1 of 6"
          accent="#2F5A3A"
          defaultOpen
        >
          <ExecutiveBriefing />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🌱"
          title="Business Foundation Assessment™"
          subtitle="The Blueprint™ that personalizes everything — set once, refine anytime"
          badge="Step 2 of 6"
          accent="#38623F"
        >
          <BusinessFoundationWorkspace />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🤖"
          title="AI Augmentation Hour™"
          subtitle="Eliminate, systemize, automate, delegate — with your AI Transformation Executive™ (Chief AI Officer)"
          badge="Step 3 of 6"
          accent="#427049"
        >
          <AIAugmentationHour />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="👥"
          title="Your AI Executive Leadership Team™"
          subtitle="Cherry Blossom coordinates eight executives who educate, recommend, and — soon — build for your approval"
          badge="Step 4 of 6"
          accent="#4C7E54"
        >
          <AIExecutiveLeadershipTeam />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🎯"
          title="Human Zone of Genius™"
          subtitle="The irreplaceable 20% only you can do"
          badge="Step 5 of 6"
          accent="#568C5D"
        >
          <HumanZoneOfGenius />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🚀"
          title="Execution Center™"
          subtitle="Where approved work flows from draft to published"
          badge="Step 6 of 6"
          accent="#5D9D61"
        >
          <ExecutionCenter />
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🎓"
          title="Business Language University™"
          subtitle="Build fluency in the language of business, on your terms"
          accent="#74B079"
        >
          <div className="rounded-xl border border-[#74B079]/25 bg-white p-5">
            <p className="text-[#3A2E33] leading-relaxed">
              {
                "Coming soon. Short, founder-friendly lessons tailored to the topics that matter most to your business — pricing, marketing, sales, operations, finance, leadership, and AI — so every recommendation makes more sense over time."
              }
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          emoji="🪷"
          title="CEO Reflection"
          subtitle="Close your workday with a moment of intention"
          accent="#8AC28E"
        >
          <div className="rounded-xl border border-[#8AC28E]/25 bg-white p-5">
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
