"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Bot,
  Sparkles,
  Loader2,
  RefreshCw,
  ChevronDown,
  Check,
  Clock,
  Gauge,
  Map,
  Lightbulb,
  ShieldCheck,
  Cpu,
  FileText,
  Trash2,
  Workflow,
  Zap,
  Wand2,
  UserCheck,
} from "lucide-react"
import { renderMarkdown } from "@/lib/utils/markdown-renderer"
import { getBusinessFoundation, type BusinessFoundationRecord } from "@/utils/business-foundation-storage"
import {
  buildOpportunities,
  buildAdoptionMetrics,
  buildRoadmap,
  type AIOpportunity,
  type Lever,
  type Level,
} from "@/lib/founder-os/ai-transformation"

/**
 * 🤖 AI Transformation Executive™ (Chief AI Officer) command center.
 *
 * A specialized, strategic member of the AI Executive Leadership Team™ that owns
 * the founder's AI transformation strategy — helping them increase Founder
 * Capacity™, reduce Founder Risk™, and adopt AI responsibly.
 *
 * Phase 1B: full ARCHITECTURE + personalized, informational content. It NEVER
 * pushes AI and NEVER performs actions — every recommendation is permission-
 * based and informational only. No real generation or installation yet.
 */

type Permission = "pending" | "yes" | "later" | "no"

const LEVER_ICON: Record<Lever, typeof Trash2> = {
  Eliminate: Trash2,
  Systemize: Workflow,
  Automate: Zap,
  Augment: Wand2,
  Delegate: UserCheck,
}

const LEVEL_STYLE: Record<Level, string> = {
  Low: "border-[#5D9D61]/40 text-[#5D9D61]",
  Medium: "border-[#E0A100]/50 text-[#B57E00]",
  High: "border-[#E26C73]/50 text-[#E26C73]",
}

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
/* AI Opportunity Assessment™                                          */
/* ------------------------------------------------------------------ */
function OpportunityRow({ o }: { o: AIOpportunity }) {
  const Icon = LEVER_ICON[o.lever]
  return (
    <div className="rounded-xl border-2 border-[#5D9D61]/20 bg-white/70 p-4">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5D9D61]/10">
          <Icon className="h-4 w-4 text-[#5D9D61]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-[#F5F1E8] font-semibold text-[#3A2E33]">
              {o.lever}
            </Badge>
            <Badge variant="outline" className="border-[#5D9D61]/30 font-normal text-muted-foreground">
              {o.status}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#3A2E33]">{o.opportunity}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-[#5D9D61]" />
              {o.timeSaved}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Difficulty:</span>
              <Badge variant="outline" className={`font-normal ${LEVEL_STYLE[o.difficulty]}`}>
                {o.difficulty}
              </Badge>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Impact:</span>
              <Badge variant="outline" className={`font-normal ${LEVEL_STYLE[o.impact]}`}>
                {o.impact}
              </Badge>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function OpportunityAssessment({ foundation }: { foundation?: BusinessFoundationRecord | null }) {
  const opportunities = buildOpportunities(foundation)
  return (
    <section>
      <SectionHeading
        icon={Sparkles}
        title="AI Opportunity Assessment™"
        subtitle="Continuously evaluated across eliminate, systemize, automate, augment, delegate"
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {opportunities.map((o) => (
          <OpportunityRow key={o.id} o={o} />
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* AI Roadmap™                                                         */
/* ------------------------------------------------------------------ */
function Roadmap({ foundation }: { foundation?: BusinessFoundationRecord | null }) {
  const [open, setOpen] = useState(true)
  const steps = buildRoadmap(foundation)
  return (
    <section>
      <SectionHeading icon={Map} title="AI Roadmap™" subtitle="Your personalized AI transformation journey" />
      <div className="rounded-xl border-2 border-[#5D9D61]/20 bg-white/70">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
          aria-expanded={open}
        >
          <span className="text-sm font-semibold text-[#3A2E33]">
            6-week roadmap · tailored to your Business Foundation™
          </span>
          <ChevronDown className={`h-4 w-4 text-[#5D9D61] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <ol className="border-t border-[#5D9D61]/15 px-4 py-3">
            {steps.map((s) => (
              <li key={s.week} className="flex items-center gap-3 py-2">
                <span
                  className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    s.done ? "border-[#5D9D61] bg-[#5D9D61] text-white" : "border-[#5D9D61]/40 text-[#5D9D61]"
                  }`}
                >
                  {s.done ? <Check className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-sm bg-transparent" />}
                </span>
                <span className="w-16 shrink-0 text-xs font-semibold text-muted-foreground">{s.week}</span>
                <span className="text-sm text-[#3A2E33]">{s.title}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* AI Tool Intelligence™ — category first, permission always           */
/* ------------------------------------------------------------------ */
const TOOL_CATEGORIES = [
  {
    id: "meeting",
    name: "AI Meeting Assistants",
    explanation:
      "There are AI meeting assistants designed to automatically summarize meetings and capture action items, so nothing important slips away.",
  },
  {
    id: "content",
    name: "AI Writing & Content Assistants",
    explanation:
      "There are AI writing assistants that draft first versions of content, emails, and documents — leaving your voice and judgment firmly in control.",
  },
  {
    id: "automation",
    name: "Workflow Automation Platforms",
    explanation:
      "There are automation platforms that connect your tools and handle rules-based, repetitive steps without your time.",
  },
] as const

function ToolIntelligence() {
  const [permission, setPermission] = useState<Permission>("pending")

  return (
    <section>
      <SectionHeading
        icon={Cpu}
        title="AI Tool Intelligence™"
        subtitle="I explain the category first — recommendations only appear if you ask"
      />
      <div className="space-y-3 rounded-xl border-2 border-[#5D9D61]/20 bg-white/70 p-4">
        <ul className="space-y-3">
          {TOOL_CATEGORIES.map((c) => (
            <li key={c.id}>
              <p className="text-sm font-semibold text-[#3A2E33]">{c.name}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.explanation}</p>
            </li>
          ))}
        </ul>

        {permission === "pending" && (
          <div className="rounded-lg border border-[#E26C73]/20 bg-[#E26C73]/5 p-3">
            <p className="text-sm leading-relaxed text-[#3A2E33]">
              Would you like to explore specific options in any of these categories?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                className="bg-[#5D9D61] text-white hover:bg-[#5D9D61]/90"
                onClick={() => setPermission("yes")}
              >
                Yes, Show Me
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#5D9D61]/40 bg-transparent text-[#3A2E33]"
                onClick={() => setPermission("later")}
              >
                Maybe Later
              </Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setPermission("no")}>
                No Thanks
              </Button>
            </div>
          </div>
        )}

        {permission === "yes" && (
          <div className="rounded-lg border border-[#5D9D61]/20 bg-[#5D9D61]/5 p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#3A2E33]">
              <Clock className="h-4 w-4 text-[#E26C73]" />
              Curated recommendations
              <Badge variant="outline" className="border-[#E26C73]/40 font-normal text-[#E26C73]">
                Coming soon
              </Badge>
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Thank you — with your permission, I&apos;ll bring you side-by-side comparisons and vetted options matched
              to your business, so you can decide with confidence.
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 text-[#5D9D61]"
              onClick={() => setPermission("pending")}
            >
              Back
            </Button>
          </div>
        )}

        {(permission === "later" || permission === "no") && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-[#F5F1E8]/70 p-3">
            <p className="text-sm text-[#3A2E33]">
              {permission === "later"
                ? "No rush — I'll keep these ready for whenever you're curious."
                : "Understood. I won't recommend tools unless you ask."}
            </p>
            <Button size="sm" variant="ghost" className="text-[#5D9D61]" onClick={() => setPermission("pending")}>
              Reconsider
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* AI Agent Strategy™ + Future Deliverables — architecture only        */
/* ------------------------------------------------------------------ */
const AGENT_STRATEGY = [
  "Custom GPTs",
  "AI Agents",
  "Automations",
  "Workflows",
  "Integrations",
  "APIs",
  "MCP Servers",
  "Knowledge Bases",
]

const FUTURE_DELIVERABLES = [
  "SOPs",
  "Automation Blueprints",
  "Workflow Maps",
  "AI Implementation Plans",
  "Delegation Plans",
  "Automation ROI Reports",
  "AI Adoption Roadmaps",
  "Business Process Maps",
]

function ComingSoonGrid({
  icon: Icon,
  title,
  subtitle,
  items,
}: {
  icon: typeof Cpu
  title: string
  subtitle: string
  items: string[]
}) {
  return (
    <section>
      <SectionHeading icon={Icon} title={title} subtitle={subtitle} badge="Coming soon" />
      <div className="grid grid-cols-2 gap-2 rounded-xl border-2 border-dashed border-[#5D9D61]/25 bg-white/50 p-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-3.5 w-3.5 shrink-0 text-[#5D9D61]/60" />
            {item}
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
  badge,
}: {
  icon: typeof Cpu
  title: string
  subtitle: string
  badge?: string
}) {
  return (
    <div className="mb-3 flex items-start gap-2.5">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#5D9D61]" />
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-[#3A2E33]">{title}</h3>
          {badge && (
            <Badge variant="outline" className="border-[#E26C73]/40 font-normal text-[#E26C73]">
              {badge}
            </Badge>
          )}
        </div>
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
      <OpportunityAssessment foundation={foundation} />
      <AdoptionDashboard foundation={foundation} />
      <Roadmap foundation={foundation} />
      <ToolIntelligence />

      {/* Where human judgment remains */}
      <div className="flex items-start gap-3 rounded-xl border border-[#5D9D61]/25 bg-[#5D9D61]/5 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#5D9D61]" />
        <p className="text-sm leading-relaxed text-[#3A2E33]">
          {
            "My role is to help you make better decisions — not to hand your business to AI. Relationships, vision, taste, and the judgment calls only you can make stay firmly in your Human Zone of Genius™."
          }
        </p>
      </div>

      <ComingSoonGrid
        icon={Cpu}
        title="AI Agent Strategy™"
        subtitle="Future-ready: I'll eventually recommend these, matched to your business"
        items={AGENT_STRATEGY}
      />
      <ComingSoonGrid
        icon={FileText}
        title="Future Deliverables"
        subtitle="Approved deliverables I'll be able to produce for you over time"
        items={FUTURE_DELIVERABLES}
      />
    </div>
  )
}
