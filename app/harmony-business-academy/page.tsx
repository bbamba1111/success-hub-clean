import type { Metadata } from "next"
import Link from "next/link"
import { BackLink } from "@/components/navigation/page-nav"
import { CollegeCard } from "@/components/harmony-academy/college-card"
import { ExecutiveInsightCard } from "@/components/harmony-academy/executive-insight-card"
import { LearningPathCard } from "@/components/harmony-academy/learning-path-card"
import { CompetencyCard } from "@/components/harmony-academy/competency-card"
import { LearningRecommendationPreview } from "@/components/harmony-academy/learning-recommendation-preview"
import { COLLEGES, EXECUTIVE_INSIGHTS, LEARNING_OBJECT_TYPES } from "@/lib/harmony-academy/academy-registry"
import { LEARNING_PATHS } from "@/lib/harmony-academy/learning-paths"
import { COMPETENCIES } from "@/lib/harmony-academy/competencies"
import { BUSINESS_CONCEPTS } from "@/lib/business-concepts/business-concepts-registry"

export const metadata: Metadata = {
  title: "Harmony Business Academy™ | Make Time For More",
  description:
    "The Executive Education Layer™ of the Harmony Lane™ Operating System — contextual learning that leads to execution, delivered in your communication style. Not an LMS.",
}

/**
 * Harmony Business Academy™ (Phase 5.7).
 *
 * The Executive Education Layer™ of the Harmony Lane™ Operating System — NOT a
 * Learning Management System, course catalog, or video library. This is the
 * premium, editorial presentation layer: the Five Colleges™, Learning Paths™,
 * Executive Insights™, Business Concepts™, and the Competency Framework™.
 *
 * Architecture only: no lessons, videos, quizzes, progress, or recommendation
 * logic. The registries (lib/harmony-academy/*) are the single source of truth
 * future phases plug into.
 */
export default function HarmonyBusinessAcademyPage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pt-8">
          <BackLink href="/" label="Back to Live Today" />
        </div>

        {/* Hero */}
        <header className="harmony-section text-center">
          <p className="ds-eyebrow">The Harmony Lane™ Operating System</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
            Harmony Business Academy™
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-ink-soft sm:text-lg">
            Your private executive education institute — integrated into your workday. Not a course library to search
            through, but the right knowledge at the right moment, in the way you understand best, so you can act on it
            today.
          </p>
        </header>

        {/* Philosophy — "learning finds the founder" */}
        <section className="harmony-section pt-0" aria-labelledby="philosophy-heading">
          <div className="harmony-surface mx-auto max-w-3xl p-8 text-center sm:p-10">
            <p className="ds-eyebrow">The Executive Education Layer™</p>
            <h2 id="philosophy-heading" className="sr-only">
              The Academy Philosophy
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-brand-ink">
              &ldquo;Learning should never require you to search through hundreds of courses. Learning finds you.&rdquo;
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
              Every experience answers three questions: what should you understand, what should you be able to do
              afterward, and what real business outcome should result. If learning does not lead to execution, it does
              not belong here.
            </p>
          </div>
        </section>

        {/* Cherry Blossom recommendation preview — the focal moment */}
        <section className="harmony-section pt-0" aria-labelledby="recommendation-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="recommendation-heading" className="ds-page-title">
              How Learning Finds You
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              In your day-to-day work, Cherry Blossom™ will recommend exactly what prepares you for the task in front of
              you — never a catalog to browse.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <LearningRecommendationPreview />
          </div>
        </section>

        {/* The Five Colleges */}
        <section className="harmony-section pt-0" aria-labelledby="colleges-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="colleges-heading" className="ds-page-title">
              The Five Colleges™
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              The Academy is organized into five Colleges, each owned by an executive from your Executive Leadership
              Team™ — so learning always connects to the function that guides it.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {COLLEGES.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </section>

        {/* Featured Learning Paths */}
        <section className="harmony-section pt-0" aria-labelledby="paths-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="paths-heading" className="ds-page-title">
              Featured Learning Paths™
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Outcome-based journeys — named for the result you want, not the topics they cover. Each path ends in
              execution.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {LEARNING_PATHS.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        </section>

        {/* Executive Insights */}
        <section className="harmony-section pt-0" aria-labelledby="insights-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="insights-heading" className="ds-page-title">
              Executive Insights™
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Short-form learning — three to twelve minutes — designed to prepare you to execute today&apos;s work, in
              the communication style you prefer.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {EXECUTIVE_INSIGHTS.map((item) => (
              <ExecutiveInsightCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Business Concepts — referenced from the canonical registry */}
        <section className="harmony-section pt-0" aria-labelledby="concepts-heading">
          <div className="harmony-panel mx-auto max-w-4xl p-8 sm:p-10">
            <div className="text-center">
              <p className="ds-eyebrow">Business Concepts™</p>
              <h2 id="concepts-heading" className="ds-page-title mt-3">
                One Business Language
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">
                Every lesson draws on the canonical Business Concepts™ registry — {BUSINESS_CONCEPTS.length} core
                concepts, each explained in all five Communication Styles™. Definitions are never duplicated, so you
                learn the same language everywhere in Harmony Lane™.
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
                The Academy is the Executive Education Layer™ — it{" "}
                <span className="font-semibold text-brand-ink">consumes</span> knowledge rather than owning it. All
                enduring principles live in the{" "}
                <Link
                  href="/excellence-intelligence-engine"
                  className="font-semibold text-brand-green underline-offset-4 hover:underline"
                >
                  Excellence Intelligence Engine™
                </Link>
                , the Canonical Knowledge Layer™ from which every lesson learns.
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

        {/* Competency Framework */}
        <section className="harmony-section pt-0" aria-labelledby="competencies-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="competencies-heading" className="ds-page-title">
              The Competency Framework™
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Competencies represent demonstrated capability — what you can actually do. Not grades, scores, or badges.
              Recognition arrives in a future phase.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COMPETENCIES.map((competency) => (
              <CompetencyCard key={competency.competencyId} competency={competency} />
            ))}
          </div>
        </section>

        {/* Learning Object Types — the vocabulary */}
        <section className="harmony-section pt-0" aria-labelledby="types-heading">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="types-heading" className="ds-section-title">
              Learning Object Types™
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">
              The forms future learning will take — reserved now so the Academy grows without a redesign.
            </p>
          </div>
          <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
            {LEARNING_OBJECT_TYPES.map((type) => (
              <span
                key={type.id}
                className="rounded-full border border-black/[0.07] bg-card px-3 py-1 text-xs font-medium text-brand-ink-soft"
                title={type.description}
              >
                {type.name}
              </span>
            ))}
          </div>
        </section>

        {/* Executive Knowledge Library™ — Phase 10.4 entry point */}
        <section className="harmony-section pt-0" aria-labelledby="ekl-heading">
          <div className="harmony-panel mx-auto max-w-4xl p-8 sm:p-10">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
              <div className="flex-1 text-center sm:text-left">
                <p className="ds-eyebrow">Executive Capability Intelligence™</p>
                <h2 id="ekl-heading" className="ds-page-title mt-3">
                  Executive Knowledge Library™
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft sm:mx-0">
                  Browse all 15 executive briefing topics across 9 capability dimensions. Each briefing is available in
                  all five Communication Styles™ — so you learn in the way you actually understand. These same briefings
                  surface automatically inside your GPS recommendations when a capability gap is detected.
                </p>
                <Link
                  href="/executive-knowledge-library"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-ink px-6 py-3 font-montserrat text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Open the Library
                </Link>
              </div>
              <div className="grid w-full shrink-0 grid-cols-3 gap-2 sm:w-64">
                {[
                  "Strategy", "Marketing", "Sales",
                  "Finance", "Operations", "Technology",
                  "Leadership", "Investment", "Mindset",
                ].map((domain) => (
                  <div
                    key={domain}
                    className="rounded-lg border border-black/[0.07] bg-card px-2 py-2 text-center text-xs font-medium text-brand-ink-soft"
                  >
                    {domain}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Closing note */}
        <section className="harmony-section pt-0">
          <div className="harmony-surface mx-auto max-w-3xl p-8 text-center sm:p-10">
            <p className="ds-eyebrow">Understanding → Execution</p>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-brand-ink">
              &ldquo;Every lesson moves you from understanding to execution — reinforcing success and Human
              Sustainability™ together.&rdquo;
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
              The Academy connects to your{" "}
              <Link
                href="/executive-leadership-team"
                className="font-semibold text-brand-green underline-offset-4 hover:underline"
              >
                Executive Leadership Team™
              </Link>{" "}
              and{" "}
              <Link
                href="/professional-advisory-network"
                className="font-semibold text-brand-green underline-offset-4 hover:underline"
              >
                Professional Advisory Network™
              </Link>
              . Cherry Blossom™ brings the right lesson to the right moment — you never have to search.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
