"use client"

/**
 * My Work-Life Harmony™ — client sections (Phase 10.1)
 *
 * Renders the Business Context™ and Executive Learning™ sections which
 * require client-side localStorage access. Imported by the server-rendered
 * My Harmony page.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Brain,
  Briefcase,
  ChevronRight,
  Cpu,
  DollarSign,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { getBusinessContext, saveBusinessContext } from "@/lib/business-context/business-context-store"
import { getBusinessContextFromDb } from "@/utils/business-context-storage"
import { getFounderLearning } from "@/lib/founder-learning/founder-learning-store"
import type { BusinessContextProfile } from "@/lib/business-context/types"
import type { FounderLearningProfile } from "@/lib/founder-learning/types"

// ─── Shared sub-components ────────────────────────────────────────────────────

type SectionColor = "green" | "rose" | "gold"

function Section({
  icon: Icon,
  color,
  title,
  description,
  badge,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  color: SectionColor
  title: string
  description: string
  badge?: string
  children: React.ReactNode
}) {
  const accent = {
    green: { border: "border-[#5B835F]/20", bg: "bg-[#5B835F]/[0.04]", icon: "text-[#5B835F]", badge: "bg-[#5B835F]/10 text-[#5B835F]" },
    rose:  { border: "border-[#C13B6B]/20", bg: "bg-[#C13B6B]/[0.04]", icon: "text-[#C13B6B]", badge: "bg-[#C13B6B]/10 text-[#C13B6B]" },
    gold:  { border: "border-[#C9A96E]/20", bg: "bg-[#C9A96E]/[0.04]", icon: "text-[#C9A96E]", badge: "bg-[#C9A96E]/10 text-[#C9A96E]" },
  }[color]

  return (
    <section className={`rounded-2xl border ${accent.border} ${accent.bg} px-6 py-6`}>
      <div className="flex items-start gap-3 mb-1">
        <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${accent.icon}`} aria-hidden />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-montserrat text-base font-bold text-[#3A2E33]">{title}</h2>
            {badge && (
              <span className={`rounded-full px-2 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] ${accent.badge}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 font-montserrat text-[13px] leading-relaxed text-[#6B5860]">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function DataPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-[#E8E0D5] px-4 py-3">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9A96E] mb-0.5">
        {label}
      </p>
      <p className="font-montserrat text-sm font-semibold text-[#3A2E33] leading-snug">{value}</p>
    </div>
  )
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-[#5B835F]/10 px-3 py-1 font-montserrat text-[12px] font-semibold text-[#5B835F]">
      {children}
    </span>
  )
}

function LearnPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C13B6B]/10 px-3 py-1 font-montserrat text-[12px] font-semibold text-[#C13B6B]">
      <BookOpen className="h-3 w-3" aria-hidden />
      {children}
    </span>
  )
}

function prettify(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

// ─── Business Context™ section ────────────────────────────────────────────────

function BusinessContextSection({ data }: { data: BusinessContextProfile }) {
  return (
    <Section
      icon={Briefcase}
      color="gold"
      title="Business Context™"
      description="The business you are building — stage, model, goals, and financial architecture."
      badge="Business Context Profile™"
    >
      <div className="flex flex-col gap-4">
        {/* Business name + edit link */}
        <div className="flex items-center justify-between">
          <p className="font-playfair text-xl font-bold text-[#3A2E33]">{data.businessName}</p>
          <Link
            href="/business-context?from=/my-harmony"
            className="inline-flex items-center gap-1 font-montserrat text-xs font-semibold text-[#C9A96E] hover:underline"
          >
            Update <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Key identity fields */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DataPill label="Business Stage™" value={prettify(data.businessStage)} />
          <DataPill label="Founder Role™" value={prettify(data.founderRole)} />
          <DataPill label="Revenue Stage™" value={prettify(data.revenueStage)} />
          <DataPill label="Team Size™" value={prettify(data.teamSize)} />
          <DataPill label="Growth Vision™" value={prettify(data.growthVision)} />
          <DataPill label="Industry™" value={data.industry} />
        </div>

        {/* Goals */}
        {data.biggestGoals.length > 0 && (
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#3A2E33] mb-2">
              Biggest Goals™
            </p>
            <div className="flex flex-wrap gap-2">
              {data.biggestGoals.map((g) => (
                <TagPill key={g}>{prettify(g)}</TagPill>
              ))}
            </div>
          </div>
        )}

        {/* Challenges */}
        {data.biggestChallenges.length > 0 && (
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#3A2E33] mb-2">
              Biggest Challenges™
            </p>
            <div className="flex flex-wrap gap-2">
              {data.biggestChallenges.map((c) => (
                <TagPill key={c}>{prettify(c)}</TagPill>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}

// ─── Executive Learning™ section ─────────────────────────────────────────────

function ExecutiveLearningSection({ data }: { data: FounderLearningProfile }) {
  return (
    <Section
      icon={Brain}
      color="rose"
      title="Executive Learning™"
      description="Your communication level, learning interests, and Learn Before You Launch™ curriculum queue."
      badge="Learn Before You Launch™"
    >
      <div className="flex flex-col gap-4">
        {/* Communication level */}
        <div className="rounded-xl bg-white border border-[#E8E0D5] px-4 py-3">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#C13B6B] mb-0.5">
            Executive Communication Level™
          </p>
          <p className="font-montserrat text-sm font-semibold text-[#3A2E33]">
            {prettify(data.communicationLevel)}
          </p>
        </div>

        {/* Learning interests */}
        {data.learningInterests.length > 0 && (
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#3A2E33] mb-2">
              Learning Interests™
            </p>
            <div className="flex flex-wrap gap-2">
              {data.learningInterests.slice(0, 6).map((topic) => (
                <TagPill key={topic}>{topic}</TagPill>
              ))}
              {data.learningInterests.length > 6 && (
                <span className="font-montserrat text-[12px] text-[#6B5860]">
                  +{data.learningInterests.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Learn Before You Launch™ queue */}
        {data.learningQueue.length > 0 && (
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#C13B6B] mb-2">
              Learn Before You Launch™ Queue
            </p>
            <div className="flex flex-col gap-2">
              {data.learningQueue.map((item, i) => (
                <div
                  key={item}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                    i === 0
                      ? "border-[#C13B6B]/30 bg-[#FDF0F4]"
                      : "border-[#E8E0D5] bg-white/60"
                  }`}
                >
                  <BookOpen className={`h-4 w-4 shrink-0 ${i === 0 ? "text-[#C13B6B]" : "text-[#6B5860]/40"}`} aria-hidden />
                  <span className={`font-montserrat text-sm font-semibold ${i === 0 ? "text-[#C13B6B]" : "text-[#6B5860]"}`}>
                    {item}
                  </span>
                  {i === 0 && (
                    <span className="ml-auto font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#C13B6B]/70 bg-[#C13B6B]/10 px-2 py-0.5 rounded-full">
                      Next Up
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}

// ─── Not-yet-complete placeholder ────────────────────────────────────────────

function IncompletePrompt({
  title,
  href,
  label,
  color,
  icon: Icon,
  badge,
  description,
}: {
  title: string
  href: string
  label: string
  color: SectionColor
  icon: React.ComponentType<{ className?: string }>
  badge: string
  description: string
}) {
  const accent = {
    green: "text-[#5B835F] border-[#5B835F]/30 bg-[#F4F8F4]",
    rose: "text-[#C13B6B] border-[#C13B6B]/30 bg-[#FDF0F4]",
    gold: "text-[#C9A96E] border-[#C9A96E]/30 bg-[#FBF7EE]",
  }[color]

  return (
    <Section icon={Icon} color={color} title={title} description={description} badge={badge}>
      <Link
        href={href}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-montserrat text-sm font-bold transition-colors hover:opacity-80 ${accent}`}
      >
        {label}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </Section>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function MyHarmonyContextSections() {
  const [bc, setBc] = useState<BusinessContextProfile | null>(null)
  const [fl, setFl] = useState<FounderLearningProfile | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Instant paint from the local cache, then reconcile with the database —
    // the account's canonical Business Context Profile™ — once it resolves.
    setBc(getBusinessContext())
    setFl(getFounderLearning())
    setReady(true)
    getBusinessContextFromDb().then((record) => {
      if (!record) return
      const { updatedAt: _updatedAt, ...profile } = record
      setBc(profile)
      saveBusinessContext(profile)
    })
  }, [])

  if (!ready) return null

  return (
    <>
      {bc ? (
        <BusinessContextSection data={bc} />
      ) : (
        <IncompletePrompt
          icon={Briefcase}
          color="gold"
          title="Business Context™"
          description="Tell Harmony Lane™ about the business you are building for personalized recommendations."
          badge="Business Context Profile™"
          href="/business-context?from=/my-harmony"
          label="Build My Business Context Profile™"
        />
      )}

      {fl ? (
        <ExecutiveLearningSection data={fl} />
      ) : (
        <IncompletePrompt
          icon={Brain}
          color="rose"
          title="Executive Learning™"
          description="Set your communication level and choose the business topics you want to master."
          badge="Learn Before You Launch™"
          href="/business-context?from=/my-harmony"
          label="Complete My Learning Profile™"
        />
      )}
    </>
  )
}
