import type { Metadata } from "next"
import {
  Activity,
  Award,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  Cpu,
  Flower2,
  GraduationCap,
  Heart,
  Layers,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"
import { ExecutivePerformanceDashboard } from "@/components/live-today/executive-performance-dashboard"
import { MyHarmonyContextSections } from "@/components/my-harmony/my-harmony-client"
import { ExecutiveOfficePanelClient } from "@/components/executive-office/executive-office-panel-client"
import { CapabilitySectionClient } from "@/components/executive-capability/capability-section-client"
import { FounderEvolutionDashboard } from "@/components/harmony-memory/founder-evolution-dashboard"

export const metadata: Metadata = {
  title: "My Work-Life Harmony™ | Harmony Lane™",
  description:
    "Your long-term growth center — audit history, operating maturity, milestones, and whole-life progress.",
}

/**
 * My Work-Life Harmony™ — the founder's long-term progress center.
 *
 * Architecture is fully installed. Intelligence (real data, trends, scores)
 * will populate each section as the platform matures. All sections are
 * future-ready with correct taxonomy and visual structure.
 */
export default function MyWorkLifeHarmonyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-white">
      {/* Page header */}
      <header className="bg-[#2C3E2D] px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/20 shrink-0">
              <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#E8C4A0]">
                Cherry Blossom™
              </p>
              <p className="font-montserrat text-[11px] text-white/50">Your Harmony Lane™ Operating Guide</p>
            </div>
          </div>
          <h1 className="font-playfair text-3xl font-medium text-white text-balance sm:text-4xl">
            My Work-Life Harmony™
          </h1>
          <p className="mt-3 font-montserrat text-[14px] leading-relaxed text-white/70 text-pretty max-w-xl">
            This is the story of your journey. Every assessment, every commitment honored, every
            milestone reached — all in one place.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 space-y-10">

        {/* Work-Life Balance™ */}
        <Section
          icon={Activity}
          color="green"
          title="Work-Life Balance™"
          description="Your audit history, harmony trends, and monthly comparisons."
        >
          <PlaceholderGrid items={[
            { label: "Audit History", icon: BookOpen },
            { label: "Harmony Trends", icon: TrendingUp },
            { label: "Monthly Comparisons", icon: Calendar },
          ]} />
        </Section>

        {/* Entrepreneur Success™ */}
        <Section
          icon={Brain}
          color="rose"
          title="Entrepreneur Success™"
          description="Your assessment history across the Eight Operating Pillars™ and progress over time."
        >
          <PlaceholderGrid items={[
            { label: "Assessment History", icon: BookOpen },
            { label: "Eight Operating Pillars™", icon: Layers },
            { label: "Progress Over Time", icon: TrendingUp },
          ]} />
        </Section>

        {/* Harmony Blueprint™ */}
        <Section
          icon={MapPin}
          color="gold"
          title="Harmony Blueprint™"
          description="Your current baseline, previous baselines, and the improvements you have made."
        >
          <PlaceholderGrid items={[
            { label: "Current Baseline", icon: Activity },
            { label: "Previous Baselines", icon: Calendar },
            { label: "Improvements", icon: TrendingUp },
          ]} />
        </Section>

        {/* Business Context™ + Executive Learning™ — Phase 10.1 */}
        <MyHarmonyContextSections />

        {/* Executive Performance Dashboard™ — Phase 9.0 / Part 6 */}
        {/* Replaces the placeholder grids for SOP + Business OS with live Progress Intelligence™ */}
        <Section
          icon={TrendingUp}
          color="green"
          title="Executive Performance Dashboard™"
          description="Your real operating behavior — Daily Non-Negotiables™ honored, Business Assets™ built, and Executive Outcomes™ completed. This data updates as you use Live Today™."
          badge="Progress Intelligence™"
        >
          <ExecutivePerformanceDashboard />
        </Section>

        {/* Executive Office™ — Phase 10.3 */}
        <Section
          icon={Building2}
          color="green"
          title="Executive Office™"
          description="Your full Executive Leadership Team™ at work — live status, today's highest-leverage recommendation, and the reasoning behind every finding."
          badge="Executive Intelligence™"
        >
          <ExecutiveOfficePanelClient />
        </Section>

        {/* Executive Capability Intelligence™ — Phase 10.4 */}
        <Section
          icon={GraduationCap}
          color="rose"
          title="Executive Capability Intelligence™"
          description="Track your mastery across 9 executive domains. Every GPS recommendation surfaces the right briefing at the right moment — so capability grows through action, not separate study sessions."
          badge="Learn Before You Launch™"
        >
          <CapabilitySectionClient />
        </Section>

        {/* Founder Evolution Dashboard™ — Phase 10.5 */}
        <Section
          icon={Award}
          color="gold"
          title="Founder Evolution Dashboard™"
          description="Your long-term memory layer. Milestones earned, patterns observed, what the system predicts next, and a living timeline of every step you have taken — all derived automatically from your activity."
          badge="Harmony Memory™"
        >
          <FounderEvolutionDashboard />
        </Section>

        {/* Whole-Life Context™ */}
        <Section
          icon={Calendar}
          color="green"
          title="Whole-Life Context™"
          description="The personal context that surrounds your operating system — preparing the architecture for future management of your whole life."
        >
          <PlaceholderGrid items={[
            { label: "Birthdays & Anniversaries", icon: Heart },
            { label: "Family", icon: Users },
            { label: "Health Goals", icon: Activity },
            { label: "Personal Goals", icon: MapPin },
            { label: "Travel", icon: Sparkles },
            { label: "Important Life Events", icon: Calendar },
          ]} />
        </Section>

      </div>
    </main>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────��──────

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

function PlaceholderGrid({
  items,
}: {
  items: { label: string; icon: React.ComponentType<{ className?: string }> }[]
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(({ label, icon: Icon }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-dashed border-black/[0.08] bg-white/50 px-4 py-3"
        >
          <Icon className="h-4 w-4 shrink-0 text-[#6B5860]/40" aria-hidden />
          <p className="font-montserrat text-[13px] text-[#6B5860]">{label}</p>
          <span className="ml-auto font-montserrat text-[10px] uppercase tracking-[0.1em] text-[#6B5860]/40">Soon</span>
        </div>
      ))}
    </div>
  )
}
