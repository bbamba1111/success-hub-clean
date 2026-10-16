import type { BusinessFoundationRecord } from "@/utils/business-foundation-storage"

/**
 * AI Transformation Executive™ (Chief AI Officer) — derivation helpers.
 *
 * These functions turn a member's Business Foundation™ into the *personalized*
 * (but informational-only) content that powers the CAIO command center: the
 * AI Opportunity Assessment™, AI Adoption Dashboard™, and AI Roadmap™.
 *
 * This is Phase 1B ARCHITECTURE: nothing here performs actions or installs
 * anything. Metrics start at a personalized baseline and are framed as living
 * numbers that grow as the founder adopts AI over time.
 */

export type Lever = "Eliminate" | "Systemize" | "Automate" | "Augment" | "Delegate"
export type Level = "Low" | "Medium" | "High"
export type OpportunityStatus = "Identified" | "Exploring" | "In Progress" | "Installed"

export interface AIOpportunity {
  id: string
  lever: Lever
  opportunity: string
  timeSaved: string
  difficulty: Level
  impact: Level
  status: OpportunityStatus
}

export interface AdoptionMetric {
  id: string
  label: string
  value: string
  hint: string
  /** 0-100 progress where meaningful (else null → shown as a stat tile). */
  progress: number | null
}

export interface RoadmapStep {
  week: string
  title: string
  done: boolean
}

/** Maps the AI-readiness answer to a starting AI Adoption Score™ (0-100). */
export function aiAdoptionBaseline(readiness?: string): number {
  switch (readiness) {
    case "Brand new to AI":
      return 8
    case "Curious / experimenting":
      return 22
    case "Using a few tools":
      return 44
    case "Confident with AI":
      return 66
    case "AI-first operator":
      return 82
    default:
      return 15
  }
}

/**
 * Builds a personalized AI Opportunity Assessment™ across the five levers.
 * Titles adapt to the founder's stated bottlenecks and challenges where
 * possible, but always stay industry-agnostic.
 */
export function buildOpportunities(f?: BusinessFoundationRecord | null): AIOpportunity[] {
  const bottlenecks = f?.founderBottlenecks ?? []
  const challenges = f?.businessChallenges ?? []
  const has = (list: string[], needle: string) =>
    list.some((x) => x.toLowerCase().includes(needle.toLowerCase()))

  const adminHeavy = has(bottlenecks, "admin") || has(challenges, "admin")
  const noSystems = has(bottlenecks, "process") || has(challenges, "no systems")
  const soleSeller = has(bottlenecks, "sell")
  const soleDeliverer = has(bottlenecks, "deliver")
  const contentDependent = has(bottlenecks, "content")
  const marketing = has(challenges, "marketing") || has(challenges, "visibility")

  return [
    {
      id: "eliminate",
      lever: "Eliminate",
      opportunity: adminHeavy
        ? "Retire low-value admin tasks that quietly fill your calendar"
        : "Stop recurring low-value work that no longer serves the business",
      timeSaved: "~1-2 hrs/week",
      difficulty: "Low",
      impact: "Medium",
      status: "Identified",
    },
    {
      id: "systemize",
      lever: "Systemize",
      opportunity: noSystems
        ? "Document your most-repeated workflow into a simple, repeatable SOP"
        : "Turn a repeatable process into a documented, teachable system",
      timeSaved: "~2-3 hrs/week",
      difficulty: "Medium",
      impact: "High",
      status: "Identified",
    },
    {
      id: "automate",
      lever: "Automate",
      opportunity: marketing
        ? "Automate content repurposing and scheduling so visibility runs itself"
        : "Automate a manual, rules-based task with AI or a simple workflow",
      timeSaved: "~2-4 hrs/week",
      difficulty: "Medium",
      impact: "High",
      status: "Identified",
    },
    {
      id: "augment",
      lever: "Augment",
      opportunity: contentDependent
        ? "Use AI to draft first versions so creation starts at 70%, not zero"
        : "Add an AI assistant to accelerate work you still want to own",
      timeSaved: "~2-3 hrs/week",
      difficulty: "Low",
      impact: "High",
      status: "Identified",
    },
    {
      id: "delegate",
      lever: "Delegate",
      opportunity:
        soleSeller || soleDeliverer
          ? "Hand a founder-dependent task to your AI Executive Leadership Team™ or a teammate"
          : "Delegate a task outside your Human Zone of Genius™ with a clear brief",
      timeSaved: "~3-5 hrs/week",
      difficulty: "High",
      impact: "High",
      status: "Identified",
    },
  ]
}

/** Living AI Adoption Dashboard™ metrics, seeded from the founder's readiness. */
export function buildAdoptionMetrics(f?: BusinessFoundationRecord | null): AdoptionMetric[] {
  const score = aiAdoptionBaseline(f?.aiReadiness)
  return [
    {
      id: "score",
      label: "AI Adoption Score™",
      value: `${score}`,
      hint: "Grows as you adopt AI responsibly",
      progress: score,
    },
    { id: "hours-saved", label: "Hours Saved", value: "0", hint: "Recovered once workflows are live", progress: null },
    {
      id: "capacity",
      label: "Founder Capacity Gained™",
      value: "0 hrs",
      hint: "Time returned to your Zone of Genius™",
      progress: null,
    },
    { id: "automation", label: "Automation Progress", value: "0%", hint: "Rules-based work handled by AI", progress: 0 },
    {
      id: "systemization",
      label: "Systemization Progress",
      value: "0%",
      hint: "Processes documented into SOPs",
      progress: 0,
    },
    { id: "delegation", label: "Delegation Progress", value: "0%", hint: "Work handed off with clear briefs", progress: 0 },
    {
      id: "workflows",
      label: "AI Workflows Installed",
      value: "0",
      hint: "Approved workflows in production",
      progress: null,
    },
    {
      id: "recovered",
      label: "Founder Hours Recovered",
      value: "0",
      hint: "Lifetime hours returned to you",
      progress: null,
    },
  ]
}

/**
 * A personalized six-week AI Roadmap™. The first step is tuned to the founder's
 * biggest bottleneck; the rest follow a sensible crawl-walk-run sequence. All
 * steps start incomplete — the roadmap becomes living as work is installed.
 */
export function buildRoadmap(f?: BusinessFoundationRecord | null): RoadmapStep[] {
  const bottlenecks = f?.founderBottlenecks ?? []
  const has = (needle: string) => bottlenecks.some((x) => x.toLowerCase().includes(needle.toLowerCase()))

  const firstStep = has("admin")
    ? "AI Meeting Notes & Admin Assist"
    : has("content")
      ? "AI Content Drafting Assistant"
      : has("sell")
        ? "AI Proposal & Follow-up Assistant"
        : "AI Meeting Notes & Action Items"

  return [
    { week: "Week 1", title: firstStep, done: false },
    { week: "Week 2", title: "Proposal / Document Generator", done: false },
    { week: "Week 3", title: "Client / Customer Onboarding Flow", done: false },
    { week: "Week 4", title: "Content & Marketing Workflow", done: false },
    { week: "Week 5", title: "Knowledge Base & FAQ Assistant", done: false },
    { week: "Week 6", title: "CRM / Pipeline Automation", done: false },
  ]
}
