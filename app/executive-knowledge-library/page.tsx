import type { Metadata } from "next"
import Link from "next/link"
import {
  Brain,
  Building2,
  Cpu,
  DollarSign,
  GraduationCap,
  Heart,
  Scale,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { BackLink } from "@/components/navigation/page-nav"
import { BRIEFING_TOPIC_META } from "@/lib/executive-capability/briefing-registry"
import { BUSINESS_CONCEPTS } from "@/lib/business-concepts/business-concepts-registry"
import type { ExecutiveBriefingTopicId } from "@/lib/executive-capability/types"

export const metadata: Metadata = {
  title: "Executive Knowledge Library™ | Harmony Lane™",
  description:
    "15 Executive Briefing™ topics organized across 9 capability domains — your private knowledge reference for building executive-level business capability.",
}

// ─── Domain Configuration ────────────────────────────────────────────────────

interface KnowledgeDomain {
  id: string
  label: string
  executiveOwner: string
  description: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; "aria-hidden"?: boolean | "true" | "false" }>
  accentColor: string
  briefingTopics: ExecutiveBriefingTopicId[]
}

const KNOWLEDGE_DOMAINS: KnowledgeDomain[] = [
  {
    id: "strategy",
    label: "Strategy & Growth",
    executiveOwner: "Strategy Executive™",
    description: "Long-term positioning, exit readiness, and capital allocation decisions that shape your business trajectory.",
    icon: Brain,
    accentColor: "#7C9A82",
    briefingTopics: ["pricing", "exit-planning", "capital-strategy"],
  },
  {
    id: "finance",
    label: "Finance & Capital",
    executiveOwner: "Finance Executive™",
    description: "The financial architecture layer — business credit, cash flow, profit margins, banking, and wealth building.",
    icon: DollarSign,
    accentColor: "#C9A96E",
    briefingTopics: ["business-credit", "cash-flow", "profit-margins", "business-banking", "wealth-building"],
  },
  {
    id: "revenue",
    label: "Revenue Architecture",
    executiveOwner: "Sales Executive™",
    description: "Building predictable, compounding income through pricing strategy and recurring revenue models.",
    icon: TrendingUp,
    accentColor: "#6B9BC4",
    briefingTopics: ["recurring-revenue", "customer-lifetime-value"],
  },
  {
    id: "operations",
    label: "Operations & Systems",
    executiveOwner: "Operations Executive™",
    description: "The systems layer — documented procedures, operating principles, and scalable infrastructure.",
    icon: Settings,
    accentColor: "#8B6B9E",
    briefingTopics: ["sops", "operating-rules", "delegation"],
  },
  {
    id: "people",
    label: "Leadership & Team",
    executiveOwner: "People Executive™",
    description: "Building, hiring, and leading the team that multiplies your effectiveness.",
    icon: Users,
    accentColor: "#D4845A",
    briefingTopics: ["hiring"],
  },
  {
    id: "technology",
    label: "Technology & AI",
    executiveOwner: "Innovation Executive™",
    description: "Leveraging artificial intelligence as a scalable team member — delegating intelligently to systems.",
    icon: Cpu,
    accentColor: "#4A9BA0",
    briefingTopics: ["ai-delegation"],
  },
  {
    id: "customer",
    label: "Customer Experience",
    executiveOwner: "Client Success Executive™",
    description: "Maximizing the long-term value of every client relationship through deliberate service design.",
    icon: Heart,
    accentColor: "#C4748A",
    briefingTopics: ["customer-lifetime-value"],
  },
  {
    id: "wealth",
    label: "Wealth & Exit",
    executiveOwner: "Finance Executive™",
    description: "Converting business income into lasting personal wealth and building a business with exit optionality.",
    icon: Building2,
    accentColor: "#7C9A82",
    briefingTopics: ["wealth-building", "exit-planning"],
  },
]

// ─── Topic Card ───────────────────────────────────────────────────────────────

function TopicCard({
  topicId,
  accentColor,
}: {
  topicId: ExecutiveBriefingTopicId
  accentColor: string
}) {
  const meta = BRIEFING_TOPIC_META.find((m) => m.id === topicId)
  if (!meta) return null

  return (
    <div
      className="rounded-xl border border-black/[0.07] bg-white p-4 shadow-ds-sm transition-shadow hover:shadow-ds-md"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-montserrat text-sm font-semibold text-[#3A2E33]">{meta.title}</span>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.14em]"
          style={{ color: accentColor, background: `${accentColor}15` }}
        >
          Briefing
        </span>
      </div>
      <p className="text-xs leading-relaxed text-[#3A2E33]/55">{meta.capabilityUnlock}</p>
      <p className="mt-2 font-montserrat text-[10px] text-[#3A2E33]/40">Owned by {meta.executiveOwner}</p>
    </div>
  )
}

// ─── Domain Section ───────────────────────────────────────────────────────────

function DomainSection({ domain }: { domain: KnowledgeDomain }) {
  const Icon = domain.icon

  return (
    <section
      className="harmony-section pt-0"
      aria-labelledby={`domain-${domain.id}-heading`}
    >
      <div className="harmony-panel p-6 sm:p-8">
        {/* Domain header */}
        <div className="mb-6 flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `${domain.accentColor}15` }}
          >
            <Icon className="h-5 w-5" style={{ color: domain.accentColor }} aria-hidden />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id={`domain-${domain.id}-heading`}
                className="font-montserrat text-base font-semibold text-[#3A2E33]"
              >
                {domain.label}
              </h2>
              <span
                className="rounded-full px-2 py-0.5 font-montserrat text-[10px] font-semibold"
                style={{ color: domain.accentColor, background: `${domain.accentColor}15` }}
              >
                {domain.executiveOwner}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-[#3A2E33]/55">{domain.description}</p>
          </div>
        </div>

        {/* Topic cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {domain.briefingTopics.map((topicId) => (
            <TopicCard key={topicId} topicId={topicId} accentColor={domain.accentColor} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExecutiveKnowledgeLibraryPage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pt-8">
          <BackLink href="/harmony-business-academy" label="Back to Harmony Business Academy™" />
        </div>

        {/* Hero */}
        <header className="harmony-section text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <GraduationCap className="h-6 w-6 text-[#C9A96E]" aria-hidden />
            <p className="ds-eyebrow">Executive Capability Intelligence™</p>
          </div>
          <h1 className="mx-auto mt-2 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
            Executive Knowledge Library™
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-ink-soft sm:text-lg">
            15 Executive Briefing™ topics organized across 8 capability domains. This is your reference — the briefings themselves surface contextually in your GPS card, at the right moment, in your communication style.
          </p>
          <div className="mx-auto mt-6 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-white px-3 py-1.5 shadow-ds-sm">
              <span className="font-montserrat text-xs font-semibold text-[#3A2E33]">15 Briefing Topics</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-white px-3 py-1.5 shadow-ds-sm">
              <span className="font-montserrat text-xs font-semibold text-[#3A2E33]">8 Capability Domains</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-white px-3 py-1.5 shadow-ds-sm">
              <span className="font-montserrat text-xs font-semibold text-[#3A2E33]">5 Communication Levels™</span>
            </div>
          </div>
        </header>

        {/* How It Works */}
        <section className="harmony-section pt-0" aria-labelledby="how-it-works-heading">
          <div className="harmony-surface mx-auto max-w-3xl p-8 text-center sm:p-10">
            <p className="ds-eyebrow">How Briefings Reach You</p>
            <h2 id="how-it-works-heading" className="sr-only">How Executive Briefings work</h2>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-brand-ink">
              &ldquo;Cherry Blossom™ reads your business context and surfaces the most relevant briefing — not a list to search through, but the exact knowledge your GPS route needs right now.&rdquo;
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
              Briefings appear inline in your Founder GPS™ card when a knowledge gap is detected. Reading and completing a briefing advances your capability score in the relevant dimension. Every briefing is pre-authored at all five Communication Levels™ — the system selects the right one for how you learn.
            </p>
          </div>
        </section>

        {/* Domain sections */}
        {KNOWLEDGE_DOMAINS.map((domain) => (
          <DomainSection key={domain.id} domain={domain} />
        ))}

        {/* Business Concepts reference */}
        <section className="harmony-section pt-0" aria-labelledby="concepts-heading">
          <div className="harmony-panel mx-auto max-w-4xl p-8 sm:p-10">
            <div className="text-center">
              <p className="ds-eyebrow">Canonical Knowledge Layer™</p>
              <h2 id="concepts-heading" className="ds-page-title mt-3">Business Concepts™</h2>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">
                Every briefing draws on the{" "}
                <span className="font-semibold text-brand-ink">{BUSINESS_CONCEPTS.length}</span> core Business Concepts™ — each defined in all five Communication Styles™. The Library references these concepts; it does not duplicate them.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {BUSINESS_CONCEPTS.map((concept) => (
                <span
                  key={concept.id}
                  className="rounded-md border border-black/[0.07] bg-card px-3 py-1.5 text-sm text-brand-ink-soft shadow-ds-sm"
                >
                  {concept.term}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation links */}
        <section className="harmony-section pt-0">
          <div className="harmony-surface mx-auto max-w-3xl p-8 text-center sm:p-10">
            <p className="ds-eyebrow">Continue Learning</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/harmony-business-academy"
                className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-5 py-2.5 font-montserrat text-sm font-semibold text-brand-ink shadow-ds-sm transition-shadow hover:shadow-ds-md"
              >
                Harmony Business Academy™
              </Link>
              <Link
                href="/my-harmony"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 font-montserrat text-sm font-semibold text-white shadow-ds-sm transition-opacity hover:opacity-90"
              >
                View My Capability Progress
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
