/**
 * Cherry Blossom™ — Morning Executive Brief™ Engine (Phase 7.1)
 * ---------------------------------------------------------------------------
 * Pure deterministic function that reads HarmonyContextValue and produces a
 * MorningExecutiveBrief™ — the complete contextual briefing Cherry Blossom™
 * delivers at the start of each day.
 *
 * Architecture rules:
 *   - ZERO side effects. Same inputs → same output. Safe for SSR and testing.
 *   - Reads from HarmonyContextValue ONLY — never directly from registries.
 *   - Never returns null. A founder with zero data gets a warm, valid brief.
 *   - No AI, no chat, no streaming. This is deterministic executive logic.
 *   - Every brief MUST include an Explainability™ block so the founder
 *     always understands why today's focus was selected.
 *
 * DO NOT build here:
 *   - Open-ended chat or LLM calls
 *   - Dynamic assignments (Phase 7.3)
 *   - CEO Workday™ scheduling (Phase 7.4)
 *   - Notification or push logic
 *
 * Integration boundary (architecture reconciliation pass): for the
 * `ceo-workday` segment specifically, the assigned executive and highest-
 * leverage outcome are read from the canonical `GpsRecommendation`
 * (`lib/founder-gps/next-best-move-engine.ts` → `deriveNextBestMove()`) via
 * `ctx.snapshot` — the SAME engine call `FounderGpsWorkspace` uses. This is
 * a read of an already-computed recommendation, not a second recommendation
 * engine: Cherry Blossom never re-derives or overrides it, only narrates it
 * in her voice. All other segments (`morning-given`, `time-freedom`,
 * `power-down`, no-week-designed) keep their existing HarmonyContextValue-only
 * logic untouched — GPS has no recommendation for those moments.
 */

import type { HarmonyContextValue } from "@/lib/harmony-context/types"
import { EXECUTIVE_TEAM } from "@/lib/executive-team/executive-registry"
import { deriveProgressSummary, type ProgressSummary } from "@/lib/founder-gps/progress-intelligence"
import { buildGpsContextFromSnapshot, deriveNextBestMove } from "@/lib/founder-gps/next-best-move-engine"
import type { GpsRecommendation } from "@/lib/founder-gps/types"
import { OPERATING_PILLARS } from "@/lib/entrepreneur-success/esa-registry"

/* ===========================================================================
 * Output types
 * ======================================================================== */

/** The complete Morning Executive Brief™ produced for a single founder session. */
export interface MorningExecutiveBrief {
  /** The greeting line, e.g. "Good morning, Barbara." */
  greeting: string

  /** Cherry Blossom's opening briefing sentence — sets the tone for the day. */
  openingStatement: string

  /** The current Operating Segment™ title — what this moment is designed for. */
  currentSegmentTitle: string

  /** Whether the week has been designed (Sunday Design Day™ complete). */
  weekDesigned: boolean

  /** Today's executive focus — one sentence describing what this day builds toward. */
  executiveFocus: ExecutiveFocus

  /** The single highest-leverage outcome for today. */
  highestLeverageOutcome: HighestLeverageOutcome

  /** Today's assigned executive — one executive, one day, one mission. */
  assignedExecutive: AssignedExecutive | null

  /** Life protection notices — reminders that life comes first. */
  lifeProtection: LifeProtectionNotice[]

  /** Celebration of recent meaningful progress. Null if nothing to celebrate. */
  celebration: CelebrationNotice | null

  /** Gentle intervention — something important that needs quiet attention. */
  gentleIntervention: GentleIntervention | null

  /** The complete Explainability™ record — why this brief was assembled this way. */
  explainability: BriefExplainability
}

export interface ExecutiveFocus {
  /** One sentence. E.g. "Today we're strengthening your Strategic Foundation™." */
  statement: string
  /** The underlying GPS outcome this focus serves. */
  outcome: "honor-non-negotiables" | "build-compounding-assets" | "reduce-execution-friction"
}

export interface HighestLeverageOutcome {
  /** The single outcome to focus on today. */
  title: string
  /** One sentence explaining why this is the highest leverage right now. */
  rationale: string
  /** The operating pillar this outcome strengthens. */
  pillar: string
}

export interface AssignedExecutive {
  id: string
  name: string
  title: string
  /** One sentence explaining why this executive leads today. */
  assignmentReason: string
  /** The mission for today — what the executive is here to help accomplish. */
  todaysMission: string
}

export interface LifeProtectionNotice {
  /** Type of protection notice. */
  type: "non-negotiable" | "commitment" | "relationship" | "recovery"
  /** The notice text — calm, respectful, never alarming. */
  message: string
  /** Optional urgency level. */
  urgency?: "gentle" | "important"
}

export interface CelebrationNotice {
  /** What is being celebrated. */
  achievement: string
  /** Cherry Blossom's celebration message. Executive tone, never gamified. */
  message: string
}

export interface GentleIntervention {
  /** The concern being surfaced. */
  concern: string
  /** Cherry Blossom's gentle observation. No judgment. */
  message: string
  /** Optional suggested action. */
  suggestedAction?: string
}

export interface BriefExplainability {
  /** Why this executive focus was selected. */
  focusReason: string
  /** Which constitutional principle governs today's priority. */
  governingPrinciple: string
  /** The data signals that shaped this brief. */
  signals: string[]
  /** What will be different if the founder acts on this brief. */
  expectedOutcome: string
}

/* ===========================================================================
 * Executive Brief Engine™
 * ======================================================================== */

/**
 * Assemble the Morning Executive Brief™ from the current Harmony Context™.
 * Returns a complete, valid brief regardless of how much context is present.
 */
export function assembleMorningExecutiveBrief(ctx: HarmonyContextValue): MorningExecutiveBrief {
  const name = ctx.firstName?.trim() || null
  const greeting = name
    ? `${ctx.greeting}, ${name}.`
    : `${ctx.greeting}.`

  const seg = ctx.currentSegment
  const segTitle = seg?.title ?? ctx.currentBlockTitle ?? "Your Day"
  const weekDesigned = ctx.hasDesignedWeek

  // Progress Intelligence™ — read real operating behavior (Phase 9.0)
  // Safe on server: deriveProgressSummary returns an empty summary when
  // sessionStorage is unavailable (typeof window === "undefined" guard).
  const progress = deriveProgressSummary()

  // -------------------------------------------------------------------------
  // Founder GPS™ Next Best Move™ — the SAME canonical engine call
  // `FounderGpsWorkspace` makes, read here (never re-derived) so Cherry
  // Blossom's CEO Workday briefing narrates the real recommendation instead
  // of independently guessing an executive/outcome from business stage.
  // `ctx.snapshot.ready` is false during SSR/first paint, so this safely
  // no-ops on the server exactly like `FounderGpsWorkspace` does.
  // -------------------------------------------------------------------------
  const gpsRecommendation: GpsRecommendation | null =
    ctx.currentSegment?.id === "ceo-workday" && ctx.snapshot.ready
      ? deriveNextBestMove(buildGpsContextFromSnapshot(ctx.snapshot), {
          founderDestination: ctx.founderDestination,
          esaResults: ctx.snapshot.business.esaResults,
          operatingHistory: ctx.snapshot.intelligence.operatingHistory,
        })
      : null

  // -------------------------------------------------------------------------
  // Select the executive and focus based on business stage + context signals
  // -------------------------------------------------------------------------
  const executive = selectAssignedExecutive(ctx, gpsRecommendation)
  const focus = selectExecutiveFocus(ctx)
  const outcome = selectHighestLeverageOutcome(ctx, gpsRecommendation)

  // -------------------------------------------------------------------------
  // Opening statement — Cherry Blossom's voice. Proactive, contextual, calm.
  // -------------------------------------------------------------------------
  const openingStatement = buildOpeningStatement(ctx, name, focus, progress)

  // -------------------------------------------------------------------------
  // Life Protection™ notices
  // -------------------------------------------------------------------------
  const lifeProtection = buildLifeProtectionNotices(ctx, seg)

  // -------------------------------------------------------------------------
  // Celebration™ — meaningful progress recognized without gamification
  // -------------------------------------------------------------------------
  const celebration = buildCelebration(ctx, progress)

  // -------------------------------------------------------------------------
  // Gentle Intervention™ — quiet attention to what matters
  // -------------------------------------------------------------------------
  const gentleIntervention = buildGentleIntervention(ctx, progress)

  // -------------------------------------------------------------------------
  // Explainability™ — why this brief was assembled this way
  // -------------------------------------------------------------------------
  const explainability = buildExplainability(ctx, focus, executive, progress, gpsRecommendation)

  return {
    greeting,
    openingStatement,
    currentSegmentTitle: segTitle,
    weekDesigned,
    executiveFocus: focus,
    highestLeverageOutcome: outcome,
    assignedExecutive: executive,
    lifeProtection,
    celebration,
    gentleIntervention,
    explainability,
  }
}

/* ===========================================================================
 * Internal helpers
 * ======================================================================== */

function buildOpeningStatement(
  ctx: HarmonyContextValue,
  name: string | null,
  focus: ExecutiveFocus,
  progress: ProgressSummary,
): string {
  const nameClause = name ? `${name}, ` : ""

  if (!ctx.hasDesignedWeek) {
    return `${nameClause}your week is ready to be designed. Sunday Design Day™ is how we install the operating rhythm that makes everything else possible.`
  }

  const seg = ctx.currentSegment
  if (!seg) {
    return `${nameClause}the day is complete. Tomorrow has already been designed — let the evening belong to you.`
  }

  // Segment-specific opening statements — context-aware with progress (Phase 9.0)
  switch (seg.id) {
    case "morning-given": {
      // Acknowledge yesterday's execution if we have data
      const winClause =
        progress.lastExecutiveOutcome
          ? ` You made progress on "${progress.lastExecutiveOutcome}" yesterday.`
          : ""
      return `${nameClause}before we lead the business, we lead ourselves. Your Morning GIV\u2022EN\u2122 is where the day begins on your terms.${winClause}`
    }
    case "ceo-workday": {
      // Surface the week's intention if set, otherwise use focus
      const anchorClause = ctx.weeklyIntention
        ? `This week's intention — "${ctx.weeklyIntention}" — guides your work today.`
        : focus.statement
      return `${nameClause}your CEO Workday™ is ready. ${anchorClause}`
    }
    case "time-freedom": {
      const streakClause =
        progress.nonNegotiableStreak >= 3
          ? ` You have protected your evening ${progress.nonNegotiableStreak} days in a row.`
          : ""
      return `${nameClause}you have earned this time. The business is designed. Be fully present with the life your work exists to support.${streakClause}`
    }
    case "power-down": {
      const streakClause =
        progress.nonNegotiableStreak >= 3
          ? ` ${progress.nonNegotiableStreak} consecutive evenings protected. Consistency creates sustainable success.`
          : ""
      return `${nameClause}the day is closing well. Honor your Power Down\u2122 commitment and let tomorrow begin strong.${streakClause}`
    }
    default:
      return `${nameClause}${focus.statement}`
  }
}

function selectExecutiveFocus(ctx: HarmonyContextValue): ExecutiveFocus {
  const stage = ctx.businessStage
  const focusAreas = ctx.focusAreas

  // Life protection takes first priority
  if (!ctx.hasDesignedWeek) {
    return {
      statement: "Today we're establishing your Work-Life Balance Operating System™.",
      outcome: "honor-non-negotiables",
    }
  }

  // CEO Workday™ — use weekly intention + business stage to drive focus
  if (ctx.currentSegment?.id === "ceo-workday") {
    if (focusAreas.length > 0) {
      const primaryArea = focusAreas[0]
      return {
        statement: `Today we're advancing your ${primaryArea} focus with your highest-leverage CEO investment.`,
        outcome: "build-compounding-assets",
      }
    }

    // Stage-based focus
    switch (stage) {
      case "launch":
        return {
          statement: "Today we're building the strategic foundation that makes growth possible.",
          outcome: "build-compounding-assets",
        }
      case "growth":
        return {
          statement: "Today we're strengthening the systems that will carry your business beyond you.",
          outcome: "reduce-execution-friction",
        }
      case "scale":
        return {
          statement: "Today we're expanding the leadership capacity your next chapter requires.",
          outcome: "build-compounding-assets",
        }
      default:
        return {
          statement: "Today we're protecting your highest-leverage executive time.",
          outcome: "build-compounding-assets",
        }
    }
  }

  // Default focus for other segments
  return {
    statement: ctx.weeklyIntention
      ? `This week's intention is guiding today: "${ctx.weeklyIntention}".`
      : "Today's design is already in place — trust the work you put in on Sunday.",
    outcome: "honor-non-negotiables",
  }
}

function selectHighestLeverageOutcome(
  ctx: HarmonyContextValue,
  gpsRecommendation: GpsRecommendation | null,
): HighestLeverageOutcome {
  const stage = ctx.businessStage
  const focusAreas = ctx.focusAreas
  const seg = ctx.currentSegment

  if (!ctx.hasDesignedWeek) {
    return {
      title: "Install Your Work-Life Balance Operating System™",
      rationale: "Everything else depends on this foundation. Sunday Design Day™ is your highest-leverage next step.",
      pillar: "Strategic Foundation™",
    }
  }

  if (seg?.id === "morning-given") {
    return {
      title: "Honor Your Morning GIV•EN™",
      rationale: "The founder who leads themselves first leads their business best. This is non-negotiable.",
      pillar: "Human Sustainability™",
    }
  }

  if (seg?.id === "ceo-workday") {
    // Canonical Founder GPS™ Next Best Move™ — the same recommendation
    // `FounderGpsWorkspace` shows. Preferred over the heuristics below,
    // which only apply once GPS has no computed move yet (e.g. context
    // still loading).
    if (gpsRecommendation) {
      const pillarName =
        OPERATING_PILLARS.find((p) => p.id === gpsRecommendation.targetPillar)?.name ??
        "Execution Architecture™"
      return {
        title: gpsRecommendation.nextTurn,
        rationale: gpsRecommendation.reason,
        pillar: pillarName,
      }
    }

    if (focusAreas.length > 0) {
      return {
        title: `Advance Your ${focusAreas[0]} Priority`,
        rationale: `You identified this as a Priority Focus Area™. Your CEO time is the highest-leverage investment you can make against it.`,
        pillar: focusAreas[0],
      }
    }

    switch (stage) {
      case "launch":
        return {
          title: "Clarify Your Offer and Ideal Client",
          rationale: "A launch-stage business grows fastest when the founder achieves crystal clarity on who they serve and what they offer.",
          pillar: "Strategic Foundation™",
        }
      case "growth":
        return {
          title: "Build One Delegation-Ready System",
          rationale: "Growth-stage founders create leverage by removing themselves from execution through documented, delegatable systems.",
          pillar: "Execution Architecture™",
        }
      case "scale":
        return {
          title: "Develop One Key Leadership Relationship",
          rationale: "Scaled businesses grow through leadership density — investing in the people around you multiplies your impact.",
          pillar: "Team & Leadership Intelligence™",
        }
      default:
        return {
          title: "Protect Your CEO Workday™",
          rationale: "Deep, protected CEO time is your single highest-leverage business asset. Guard it with an Operating Rule™.",
          pillar: "Execution Architecture™",
        }
    }
  }

  if (seg?.id === "time-freedom") {
    return {
      title: "Be Fully Present in Your Time Freedom™",
      rationale: "Time Freedom™ is not a reward — it is a performance indicator. Protecting it fuels tomorrow's executive clarity.",
      pillar: "Human Sustainability™",
    }
  }

  return {
    title: "Honor This Moment's Design",
    rationale: "You designed this time on Sunday for a reason. Honoring the design compounds over time.",
    pillar: "Strategic Foundation™",
  }
}

function selectAssignedExecutive(
  ctx: HarmonyContextValue,
  gpsRecommendation: GpsRecommendation | null,
): AssignedExecutive | null {
  if (!ctx.hasDesignedWeek) return null
  if (ctx.currentSegment?.id !== "ceo-workday") return null

  const stage = ctx.businessStage
  const focusAreas = ctx.focusAreas

  // Canonical Founder GPS™ Next Best Move™ already names the owning
  // executive (`readiness-relevance.ts`'s owningExecutiveId crosswalk) —
  // prefer it over the heuristics below, which only apply once GPS has no
  // computed move yet.
  if (gpsRecommendation?.executiveDomain) {
    const gpsExec = EXECUTIVE_TEAM.find((e) => e.id === gpsRecommendation.executiveDomain)
    if (gpsExec) {
      return {
        id: gpsExec.id,
        name: gpsExec.name,
        title: gpsExec.executiveTitle,
        assignmentReason: gpsRecommendation.reason,
        todaysMission: gpsRecommendation.nextTurn,
      }
    }
  }

  // Determine which executive to assign based on context
  let executiveId = "strategy" // default
  let missionStatement = "Build the strategic foundation that makes growth inevitable."
  let reason = "Your business stage and current focus point toward strategic clarity as the highest-leverage investment."

  // Focus-area driven assignment
  if (focusAreas.length > 0) {
    const primaryFocus = focusAreas[0].toLowerCase()
    if (primaryFocus.includes("marketing") || primaryFocus.includes("brand") || primaryFocus.includes("content")) {
      executiveId = "marketing-brand"
      missionStatement = "Strengthen your market presence and lead generation systems."
      reason = `Your Priority Focus Area™ on ${focusAreas[0]} activates your Marketing & Brand Executive™.`
    } else if (primaryFocus.includes("operation") || primaryFocus.includes("system") || primaryFocus.includes("delegation")) {
      executiveId = "operations"
      missionStatement = "Build the operational systems that free your executive time."
      reason = `Your Priority Focus Area™ on ${focusAreas[0]} activates your Operations & Systems Executive™.`
    } else if (primaryFocus.includes("financial") || primaryFocus.includes("revenue") || primaryFocus.includes("profit")) {
      executiveId = "finance"
      missionStatement = "Strengthen your financial intelligence and revenue architecture."
      reason = `Your Priority Focus Area™ on ${focusAreas[0]} activates your Financial Intelligence Executive™.`
    } else if (primaryFocus.includes("team") || primaryFocus.includes("leadership") || primaryFocus.includes("hire")) {
      executiveId = "people-culture"
      missionStatement = "Develop the leadership capacity your next chapter requires."
      reason = `Your Priority Focus Area™ on ${focusAreas[0]} activates your People & Culture Executive™.`
    }
  } else {
    // Stage-based assignment
    switch (stage) {
      case "launch":
        executiveId = "strategy"
        missionStatement = "Clarify your vision, offer, and ideal client to accelerate your first consistent revenue."
        reason = "Launch-stage founders benefit most from strategic clarity before marketing investment."
        break
      case "growth":
        executiveId = "operations"
        missionStatement = "Build the delegation-ready systems that remove you from day-to-day execution."
        reason = "Growth-stage businesses scale through operational systems, not founder hours."
        break
      case "scale":
        executiveId = "people-culture"
        missionStatement = "Develop the senior leadership team that will carry the business beyond you."
        reason = "Scaling businesses require leadership density — investing in people multiplies impact."
        break
    }
  }

  // Look up the actual executive definition
  const exec = EXECUTIVE_TEAM.find((e) => e.id === executiveId)

  if (!exec) return null

  return {
    id: exec.id,
    name: exec.name,
    title: exec.executiveTitle,
    assignmentReason: reason,
    todaysMission: missionStatement,
  }
}

function buildLifeProtectionNotices(
  ctx: HarmonyContextValue,
  seg: HarmonyContextValue["currentSegment"]
): LifeProtectionNotice[] {
  const notices: LifeProtectionNotice[] = []

  // Non-Negotiable™ from the current segment
  if (seg?.nonNegotiable) {
    notices.push({
      type: "non-negotiable",
      message: `Protect today's Non-Negotiable™: ${seg.nonNegotiable}`,
      urgency: "gentle",
    })
  }

  // Weekly intention as a life anchor
  if (ctx.weeklyIntention && ctx.currentSegment?.id === "ceo-workday") {
    notices.push({
      type: "commitment",
      message: `This week's intention guides every decision: "${ctx.weeklyIntention}"`,
      urgency: "gentle",
    })
  }

  return notices
}

function buildCelebration(ctx: HarmonyContextValue, progress: ProgressSummary): CelebrationNotice | null {
  // Phase 9.0: celebrate real operating behavior from Progress Intelligence™

  // Meaningful Non-Negotiable streak
  if (progress.nonNegotiableStreak >= 7) {
    return {
      achievement: `${progress.nonNegotiableStreak} consecutive days of honoring your commitments.`,
      message: "Seven or more days of consistent Daily Non-Negotiables™ is not a streak — it is the beginning of an identity. You are becoming the executive you designed yourself to be.",
    }
  }
  if (progress.nonNegotiableStreak >= 3) {
    return {
      achievement: `${progress.nonNegotiableStreak} consecutive days of commitment.`,
      message: "Consistency is how Sustainable Operating Practices™ become permanent. You are building real executive discipline.",
    }
  }

  // Workout streak
  if (progress.workoutStreak >= 5) {
    return {
      achievement: `Workout Window™ honored ${progress.workoutStreak} days in a row.`,
      message: "Physical consistency is the foundation of executive energy. Every session compounds into the capacity that drives your business.",
    }
  }

  // Business Asset creation
  if (progress.totalAssetsIdentified >= 3) {
    return {
      achievement: `${progress.totalAssetsIdentified} Business Assets™ identified.`,
      message: "Each Business Asset™ you create continues producing value after your CEO Workday™ ends. You are building compounding equity in your business.",
    }
  }

  // Executive Outcomes completed this week
  if (progress.executiveOutcomesCompletedThisWeek >= 3) {
    return {
      achievement: `${progress.executiveOutcomesCompletedThisWeek} Executive Outcomes™ completed this week.`,
      message: "Three or more completed executive outcomes in a week reflects real business momentum. This is how Work-Life Balance Business™ works.",
    }
  }

  // SOPs created
  if (progress.totalSopsCreated >= 2) {
    return {
      achievement: `${progress.totalSopsCreated} SOPs created.`,
      message: "Every SOP you build reduces execution friction permanently and moves your business closer to true delegation.",
    }
  }

  // Fallback: celebrate a designed week (first real milestone)
  if (ctx.hasDesignedWeek && ctx.segments.length >= 3) {
    return {
      achievement: "Your week has been designed.",
      message: "You have defined Operating Rules™, Non-Negotiables™, and Priority Focus Areas™. That is an act of executive leadership.",
    }
  }

  return null
}

function buildGentleIntervention(ctx: HarmonyContextValue, progress: ProgressSummary): GentleIntervention | null {
  // No week designed — the most important intervention
  if (!ctx.hasDesignedWeek) {
    return {
      concern: "Your week has not been designed.",
      message: "Without Sunday Design Day™, the week defaults to reactive. Everything in Harmony Lane™ compounds from this one practice.",
      suggestedAction: "Begin Sunday Design Day™",
    }
  }

  // CEO Workday™ evidence — real persisted history, never a random reminder.
  // If the founder left work in progress in a previous CEO Workday™ and chose
  // to continue it later, name it — this is the context-aware follow-through
  // the hourly 5-Minute Check-In™ exists to make possible.
  const ceoEvidence = ctx.snapshot.intelligence.gpsContext.ceoWorkdayEvidence
  if (ceoEvidence && ceoEvidence.planStatus === "closed" && ceoEvidence.carryForward.length > 0) {
    const first = ceoEvidence.carryForward[0]
    const verb =
      first.nextAction === "later"
        ? "chose to continue it later"
        : first.nextAction === "need-help"
          ? "asked for help with it"
          : first.nextAction === "move-segment"
            ? "chose to move it to another segment"
            : "chose to continue it"
    return {
      concern: `"${first.title}" was still in progress when you left your last CEO Workday™.`,
      message: `You ${verb}. Unfinished work in the same intervention comes before anything new — would you like to handle that today?`,
      suggestedAction: "Design today's CEO Workday™ in Decide & Design",
    }
  }

  // CEO priorities empty during CEO Workday™
  if (ctx.currentSegment?.id === "ceo-workday" && !ctx.ceo.priorities?.trim()) {
    return {
      concern: "No CEO priorities have been defined for this week.",
      message: "Undefined priorities invite the day to define itself. A single clear CEO priority protects your most valuable time.",
      suggestedAction: "Add your CEO priorities in Sunday Design Day™",
    }
  }

  // Phase 9.0: Pattern-based gentle interventions from Progress Intelligence™

  // Skipped Morning GIV•EN™ repeatedly (tracked via nonNegotiablesHonored)
  // Architecture hook — will read the specific segment key once GPS pattern
  // tracking is connected to the detail-level honoring data.

  // No business assets created yet — gentle nudge during CEO Workday
  if (
    ctx.currentSegment?.id === "ceo-workday" &&
    progress.totalAssetsIdentified === 0 &&
    progress.executiveOutcomesCompletedThisWeek === 0 &&
    progress.todayBusinessEntryExists === false
  ) {
    return {
      concern: "No Business Assets™ have been identified yet.",
      message: "Every CEO Workday™ should either build a Business Asset™ or advance one. Assets are the difference between a busy day and a compounding business.",
      suggestedAction: "Identify today's Business Asset™ before beginning execution.",
    }
  }

  return null
}

function buildExplainability(
  ctx: HarmonyContextValue,
  focus: ExecutiveFocus,
  executive: AssignedExecutive | null,
  progress: ProgressSummary,
  gpsRecommendation: GpsRecommendation | null,
  ): BriefExplainability {
  const signals: string[] = []

  if (gpsRecommendation) {
  signals.push(`Founder GPS™ Next Best Move™: ${gpsRecommendation.nextTurn}`)
  }

  if (ctx.businessStage) {
    signals.push(`Business Stage™: ${ctx.businessStage}`)
  }
  if (ctx.focusAreas.length > 0) {
    signals.push(`Priority Focus Areas™: ${ctx.focusAreas.slice(0, 3).join(", ")}`)
  }
  if (ctx.weeklyIntention) {
    signals.push(`Weekly Intention Declaration™: "${ctx.weeklyIntention.slice(0, 60)}${ctx.weeklyIntention.length > 60 ? "\u2026" : ""}"`)
  }
  if (ctx.currentSegment) {
    signals.push(`Current Segment™: ${ctx.currentSegment.title}`)
  }
  if (ctx.hasDesignedWeek) {
    signals.push("Sunday Design Day™ complete")
  }
  if (ctx.communicationStyle) {
    signals.push(`Communication Style™: ${ctx.communicationStyleName}`)
  }
  // Progress Intelligence™ signals (Phase 9.0)
  if (progress.nonNegotiableStreak > 0) {
    signals.push(`Non-Negotiable Streak™: ${progress.nonNegotiableStreak} consecutive days`)
  }
  if (progress.workoutStreak > 0) {
    signals.push(`Workout Streak™: ${progress.workoutStreak} consecutive days`)
  }
  if (progress.executiveOutcomesCompletedThisWeek > 0) {
    signals.push(`Executive Outcomes™ this week: ${progress.executiveOutcomesCompletedThisWeek}`)
  }
  if (progress.totalAssetsIdentified > 0) {
    signals.push(`Business Assets™ identified: ${progress.totalAssetsIdentified}`)
  }

  const governingPrinciple =
    focus.outcome === "honor-non-negotiables"
      ? "Honor Life's Non-Negotiables™ — life is never sacrificed for work."
      : focus.outcome === "build-compounding-assets"
        ? "Build Compounding Business Assets™ — every action should build something that compounds."
        : "Reduce Execution Friction™ — every system installed should reduce what the founder has to do manually."

  const expectedOutcome = executive
    ? `With your ${executive.title} leading today's focus, you will make meaningful progress on ${focus.statement.toLowerCase().replace(/^today we're /, "")}`
    : ctx.hasDesignedWeek
      ? "Honoring today's design will compound into a week that advances both your business and your life."
      : "Completing Sunday Design Day™ will install the operating rhythm that makes every other Harmony Lane™ feature meaningful."

  return {
    focusReason: executive?.assignmentReason ?? "This focus was selected based on your current business stage, focus areas, and this week's design.",
    governingPrinciple,
    signals,
    expectedOutcome,
  }
}
