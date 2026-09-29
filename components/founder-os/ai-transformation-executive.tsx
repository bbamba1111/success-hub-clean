"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bot, Loader2, RefreshCw, Gauge, Lightbulb, ShieldCheck } from "lucide-react"
import { renderMarkdown } from "@/lib/utils/markdown-renderer"
import { getBusinessFoundation, type BusinessFoundationRecord } from "@/utils/business-foundation-storage"
import { buildAdoptionMetrics } from "@/lib/founder-os/ai-transformation"

/**
 * 🤖 AI Transformation Executive™ (Chief AI Officer) command center.
 *
 * A specialized, strategic member of the AI Executive Leadership Team™ that owns
 * the founder's AI transformation strategy — helping them increase Founder
 * Capacity™, reduce Founder Risk™, and adopt AI responsibly.
 *
 * The command center now focuses on Today's Highest-Leverage AI Opportunity™ and
 * the AI Adoption Dashboard™. It NEVER pushes AI and NEVER performs actions —
 * every recommendation is permission-based and informational only.
 */

async function fetchOpportunity(): Promise<string> {
  const res = await fetch("/api/founder-os/briefing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "ai-opportunity" }),
  })
  const data = await res.json()
  return (data?.message as string) ?? ""
}

/* ------------------------------------------------------------------ */
/* Today's Highest-Leverage AI Opportunity™                            */
/* ------------------------------------------------------------------ */
function HighestLeverageOpportunity() {
  const { data, isLoading, mutate, isValidating } = useSWR("ai-opportunity", fetchOpportunity, {
    revalidateOnFocus: false,
  })

  return (
    <Card className="border-2 border-[#E26C73]/30 bg-gradient-to-br from-[#E26C73]/5 to-transparent">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E26C73]/10">
              <Lightbulb className="h-5 w-5 text-[#E26C73]" />
            </div>
            <div>
              <CardTitle className="text-lg text-[#3A2E33]">Today&apos;s Highest-Leverage AI Opportunity™</CardTitle>
              <CardDescription className="leading-relaxed">
                One personalized, informational recommendation. Always your decision.
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-[#5D9D61]"
            onClick={() => mutate()}
            disabled={isValidating}
            aria-label="Refresh today's opportunity"
          >
            <RefreshCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-3 py-4 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-[#E26C73]" />
            <span>Your Chief AI Officer is reviewing your business…</span>
          </div>
        ) : (
          <div className="text-[#3A2E33]">{renderMarkdown(data || "")}</div>
        )}
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* AI Adoption Dashboard™                                              */
/* ------------------------------------------------------------------ */
function AdoptionDashboard({ foundation }: { foundation?: BusinessFoundationRecord | null }) {
  const metrics = buildAdoptionMetrics(foundation)
  return (
    <section>
      <SectionHeading icon={Gauge} title="AI Adoption Dashboard™" subtitle="Living metrics that grow as you adopt AI" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.id} className="rounded-xl border-2 border-[#5D9D61]/20 bg-white/70 p-4">
            <p className="text-2xl font-bold text-[#5D9D61]">{m.value}</p>
            <p className="mt-0.5 text-sm font-semibold text-[#3A2E33]">{m.label}</p>
            {m.progress !== null && <Progress value={m.progress} className="mt-2 h-1.5" />}
            <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{m.hint}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Shared section heading                                              */
/* ------------------------------------------------------------------ */
function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Gauge
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-3 flex items-start gap-2.5">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#5D9D61]" />
      <div>
        <h3 className="font-bold text-[#3A2E33]">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export function AITransformationExecutive() {
  const { data: foundation } = useSWR<BusinessFoundationRecord | null>("business-foundation", getBusinessFoundation, {
    revalidateOnFocus: false,
  })

  return (
    <div className="space-y-8">
      {/* Executive identity */}
      <div className="flex items-start gap-4 rounded-xl border-2 border-[#5D9D61]/25 bg-white/70 p-4">
        <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#5D9D61]/10">
          <Bot className="h-7 w-7 text-[#5D9D61]" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-[#3A2E33]">AI Transformation Executive™</h2>
            <Badge variant="secondary" className="bg-[#F5F1E8] font-medium text-[#3A2E33]">
              Chief AI Officer
            </Badge>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-[#3A2E33]">
            {
              "I own your AI transformation strategy — helping you increase Founder Capacity™, reduce Founder Risk™, and adopt AI responsibly. I'll show you where AI can save time and, just as importantly, where your human judgment should always remain. Nothing happens without your say-so."
            }
          </p>
        </div>
      </div>

      <HighestLeverageOpportunity />
      <AdoptionDashboard foundation={foundation} />

      {/* Where human judgment remains */}
      <div className="flex items-start gap-3 rounded-xl border border-[#5D9D61]/25 bg-[#5D9D61]/5 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#5D9D61]" />
        <p className="text-sm leading-relaxed text-[#3A2E33]">
          {
            "My role is to help you make better decisions — not to hand your business to AI. Relationships, vision, taste, and the judgment calls only you can make stay firmly in your Human Zone of Genius™."
          }
        </p>
      </div>
    </div>
  )
}
