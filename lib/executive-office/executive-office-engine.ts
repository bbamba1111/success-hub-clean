/**
 * Executive Office Engine™ — Phase 10.3
 * ---------------------------------------------------------------------------
 * Evaluates each of the 9 executives against the HarmonyContextAggregate and
 * produces ExecutiveFindings, an ExecutiveBrief, and ExecutiveStatusRows.
 *
 * PURE MODULE — no React, no I/O, no side effects.
 * Every function is deterministic given the same aggregate.
 *
 * Selection logic (mirrors the EDE constitution):
 *   1. Critical findings win immediately
 *   2. Among high/medium, highest confidence wins
 *   3. Tie-break: build-compounding-assets > reduce-execution-friction > honor-non-negotiables
 */

import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type {
  ExecutiveFinding,
  ExecutiveBrief,
  ExecutiveStatusRow,
  ExecutiveOperatingStatus,
} from "@/lib/executive-office/types"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function priorityRank(p: ExecutiveFinding["priority"]): number {
  return { critical: 5, high: 4, medium: 3, low: 2, none: 1 }[p]
}

function statusFromPriority(p: ExecutiveFinding["priority"]): ExecutiveOperatingStatus {
  if (p === "critical" || p === "high") return "opportunity-found"
  if (p === "medium") return "reviewing"
  if (p === "low") return "monitoring"
  return "stable"
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)))
}

// ─── Per-executive evaluation functions ──────────────────────────────────────

function evaluateStrategy(agg: HarmonyContextAggregate | null): ExecutiveFinding {
  const base: Omit<ExecutiveFinding, "priority" | "confidence" | "status" | "title" | "summary" | "recommendation" | "expectedOutcome" | "supportingSignals" | "whatINoticed" | "whyItMatters" | "whySelectedOrDeferred" | "currentFocus"> = {
    executiveId: "strategy",
    executiveName: "Strategy Executive™",
    executiveTitle: "Chief Strategy Officer (CSO)",
    department: "Strategy & Vision",
    category: "Business Strategy",
    estimatedBusinessImpact: "high",
    estimatedFounderEffort: "medium",
    businessAssets: ["offer", "positioning"],
    expiresAt: null,
  }

  if (!agg) {
    return { ...base, priority: "low", confidence: 30, status: "monitoring", currentFocus: "Waiting for business context to begin evaluation.", title: "Context Needed", summary: "Complete your Business Context Profile™ to unlock strategic recommendations.", recommendation: "Complete the Business Context Profile™ to allow strategic evaluation.", expectedOutcome: "Personalized strategy recommendations.", supportingSignals: [], whatINoticed: "No business context available.", whyItMatters: "Strategy without context produces generic advice.", whySelectedOrDeferred: null }
  }

  const hasOffer = !agg.biggestOpportunities?.includes("creating-offer")
  const isPreRevenue = agg.revenueStage === "pre-revenue"
  const hasNoVision = !agg.growthVision && !agg.longTermVision
  const weekNotDesigned = !agg.weekDesigned

  if (isPreRevenue && !hasOffer) {
    return { ...base, priority: "critical", confidence: 88, status: "opportunity-found", currentFocus: "Offer clarity and first revenue strategy.", title: "Define Your First Offer™", summary: "Pre-revenue stage: your most critical priority is defining a clear, sellable offer.", recommendation: "Define your core offer — who it serves, what it delivers, and what it costs. This single decision unlocks every other revenue action.", expectedOutcome: "A clear, sellable offer that enables your first revenue conversation.", supportingSignals: ["Revenue stage: " + (agg.revenueStage ?? "pre-revenue"), "No offer asset identified"], whatINoticed: "Your business is in a pre-revenue or idea stage with no offer asset on record.", whyItMatters: "Every other business action — marketing, sales, operations — depends on having a defined offer.", whySelectedOrDeferred: null }
  }

  if (hasNoVision && agg.weekDesigned) {
    return { ...base, priority: "high", confidence: 75, status: "opportunity-found", currentFocus: "Establishing a clear growth vision and long-term direction.", title: "Establish Your Growth Vision™", summary: "Your operating week is designed but your vision is undefined — strategy operates without a compass.", recommendation: "Complete the Growth Vision™ and Long-Term Vision™ sections of your Business Context Profile™. A defined vision transforms daily decisions.", expectedOutcome: "Every strategic decision filters through a clear north star.", supportingSignals: ["Week designed: yes", "Growth vision: not set", "Long-term vision: not set"], whatINoticed: "Your week is structured but no Growth Vision™ has been declared.", whyItMatters: "Strategy without direction prioritizes activity over trajectory.", whySelectedOrDeferred: null }
  }

  if (weekNotDesigned) {
    return { ...base, priority: "medium", confidence: 65, status: "reviewing", currentFocus: "Evaluating readiness to design your operating week.", title: "Design Your Operating Week™", summary: "Your operating week is not yet designed — strategic clarity starts with a structured week.", recommendation: "Complete Design My Week™ to install the Daily Non-Negotiables™ that protect both your life and your business.", expectedOutcome: "A structured week that creates the conditions for strategic execution.", supportingSignals: ["Week designed: no"], whatINoticed: "No Work-Life Balance Business Week™ has been installed.", whyItMatters: "Without a designed week, strategy remains theoretical — it has no time allocated to execute.", whySelectedOrDeferred: null }
  }

  return { ...base, priority: "low", confidence: 60, status: "monitoring", currentFocus: "Monitoring strategic alignment — no critical gaps detected.", title: "Strategy Nominal™", summary: "Your strategic foundations are in place. Continuing to monitor for high-leverage opportunities.", recommendation: "Review your top business goal this week and confirm it aligns with your declared Growth Vision™.", expectedOutcome: "Strategic alignment confirmed and maintained.", supportingSignals: ["Week designed: yes", "Goals and vision: set"], whatINoticed: "Your strategic signals are nominal.", whyItMatters: "Consistent review of strategic alignment prevents drift.", whySelectedOrDeferred: null }
}

function evaluateMarketing(agg: HarmonyContextAggregate | null): ExecutiveFinding {
  const base = { executiveId: "marketing-brand", executiveName: "Marketing & Brand Executive™", executiveTitle: "Chief Marketing Officer (CMO)", department: "Marketing & Brand", category: "Marketing & Visibility", estimatedBusinessImpact: "high" as const, estimatedFounderEffort: "medium" as const, businessAssets: ["personal-brand", "content-library"], expiresAt: null }

  if (!agg) return { ...base, priority: "low", confidence: 25, status: "monitoring" as const, currentFocus: "Awaiting context.", title: "Context Needed", summary: "Complete your Business Context Profile™ to unlock marketing recommendations.", recommendation: "Complete your Business Context Profile™.", expectedOutcome: "Personalized marketing strategy.", supportingSignals: [], whatINoticed: "No context available.", whyItMatters: "Marketing without context is unfocused.", whySelectedOrDeferred: null }

  const hasMarketingOpportunity = agg.biggestOpportunities?.includes("marketing") || agg.biggestOpportunities?.includes("finding-ideal-customer")
  const hasVisibilityGoal = agg.biggestGoals?.includes("build-brand") || agg.biggestOpportunities?.includes("finding-ideal-customer")
  const isEarlyStage = agg.businessStage === "launch" || agg.revenueStage === "pre-revenue"

  if (hasMarketingOpportunity) {
    return { ...base, priority: "high", confidence: 82, status: "opportunity-found" as const, currentFocus: "Converting declared marketing opportunity into a first content asset.", title: "Your Marketing Priority™ Identified", summary: "Marketing is your declared biggest opportunity — the highest-leverage move is consistency with one channel.", recommendation: "Choose ONE marketing channel and create your first 5 pieces of content this week. Consistency in one channel outperforms scattered effort across many.", expectedOutcome: "A repeatable marketing rhythm that builds visibility without adding overwhelm.", supportingSignals: ["Declared opportunity: marketing"], whatINoticed: "You identified marketing as your biggest growth opportunity.", whyItMatters: "Founders who pick one channel and commit to it for 90 days see compounding visibility returns.", whySelectedOrDeferred: null }
  }

  if (hasVisibilityGoal || isEarlyStage) {
    return { ...base, priority: "medium", confidence: 68, status: "reviewing" as const, currentFocus: "Building visibility foundations for early-stage business.", title: "Build Your Visibility Foundation™", summary: "Early-stage businesses need a personal brand foundation before investing in campaigns.", recommendation: "Define your Personal Brand Statement™ — who you help, how, and what makes you different. This becomes the center of all marketing.", expectedOutcome: "A clear brand message you can use consistently across every channel.", supportingSignals: ["Business stage: " + (agg.businessStage ?? "early"), "Revenue stage: " + (agg.revenueStage ?? "pre-revenue")], whatINoticed: "Your business is in an early stage where brand clarity is the highest-leverage marketing investment.", whyItMatters: "Unclear messaging is the number one reason marketing doesn't convert.", whySelectedOrDeferred: null }
  }

  return { ...base, priority: "low", confidence: 55, status: "monitoring" as const, currentFocus: "Monitoring marketing signals — no critical gaps detected.", title: "Marketing Monitoring™", summary: "No critical marketing gaps detected. Your visibility foundations appear stable.", recommendation: "Review your last 30 days of content and identify your highest-performing post. Double down on that format next week.", expectedOutcome: "Optimized content strategy based on what already works.", supportingSignals: [], whatINoticed: "Marketing signals are nominal.", whyItMatters: "Doubling down on what works amplifies results without additional effort.", whySelectedOrDeferred: null }
}

function evaluateSales(agg: HarmonyContextAggregate | null): ExecutiveFinding {
  const base = { executiveId: "sales", executiveName: "Sales Executive™", executiveTitle: "Chief Revenue Officer (CRO)", department: "Revenue & Sales", category: "Revenue Strategy", estimatedBusinessImpact: "high" as const, estimatedFounderEffort: "medium" as const, businessAssets: ["sales-system", "discovery-framework"], expiresAt: null }

  if (!agg) return { ...base, priority: "low", confidence: 25, status: "monitoring" as const, currentFocus: "Awaiting context.", title: "Context Needed", summary: "Complete your Business Context Profile™.", recommendation: "Complete your Business Context Profile™.", expectedOutcome: "Personalized revenue strategy.", supportingSignals: [], whatINoticed: "No context.", whyItMatters: "Revenue strategy requires business context.", whySelectedOrDeferred: null }

  const hasSalesOpportunity = agg.biggestOpportunities?.includes("increasing-sales") || agg.biggestOpportunities?.includes("pricing")
  const isPreRevenue = agg.revenueStage === "pre-revenue"
  const hasRecurringRevenueGoal = agg.biggestOpportunities?.includes("recurring-revenue")

  if (hasRecurringRevenueGoal) {
    return { ...base, priority: "high", confidence: 84, status: "opportunity-found" as const, currentFocus: "Converting one-time buyers into recurring revenue streams.", title: "Recurring Revenue Architecture™", summary: "Building recurring revenue is your declared opportunity — this is the highest-ROI structural change in your business.", recommendation: "Design a Recurring Revenue offer — a subscription, retainer, or membership that delivers ongoing value. Even one recurring client changes your cash flow trajectory.", expectedOutcome: "Predictable monthly revenue that reduces feast-or-famine cycles.", supportingSignals: ["Declared opportunity: recurring-revenue"], whatINoticed: "You identified recurring revenue as your biggest opportunity.", whyItMatters: "Recurring revenue is the single most powerful financial structure for a founder-led business.", whySelectedOrDeferred: null }
  }

  if (isPreRevenue) {
    return { ...base, priority: "high", confidence: 80, status: "opportunity-found" as const, currentFocus: "Defining the first revenue conversation path.", title: "Your First Revenue Conversation™", summary: "Pre-revenue stage: the highest priority is creating the path to your first paying client.", recommendation: "Identify 5 people who have the problem your offer solves. Invite them to a 30-minute conversation. Do not pitch — listen, then offer to help.", expectedOutcome: "First-hand validation of your offer and the beginning of your sales process.", supportingSignals: ["Revenue stage: " + (agg.revenueStage ?? "pre-revenue")], whatINoticed: "Your business is pre-revenue.", whyItMatters: "The fastest path from pre-revenue to revenue is a direct conversation, not a funnel.", whySelectedOrDeferred: null }
  }

  if (hasSalesOpportunity) {
    return { ...base, priority: "high", confidence: 78, status: "opportunity-found" as const, currentFocus: "Optimizing revenue conversion and pricing.", title: "Revenue Optimization™", summary: "Increasing sales is your declared priority — the fastest lever is pricing and conversion clarity.", recommendation: "Review your current pricing against the value you deliver. Most founders who feel like they are underperforming on sales are actually underpriced.", expectedOutcome: "Pricing and positioning that converts at a higher rate with less friction.", supportingSignals: ["Declared opportunity: increasing-sales or pricing"], whatINoticed: "You declared sales and/or pricing as a growth opportunity.", whyItMatters: "Pricing affects every revenue outcome — a clear, confident price communicates value.", whySelectedOrDeferred: null }
  }

  return { ...base, priority: "low", confidence: 58, status: "monitoring" as const, currentFocus: "Monitoring revenue signals.", title: "Revenue Monitoring™", summary: "Revenue signals are nominal. No critical gaps detected.", recommendation: "This week, follow up with one previous client or prospect. One touch point per week compounds into significant revenue over a quarter.", expectedOutcome: "Maintained pipeline momentum with minimal effort.", supportingSignals: [], whatINoticed: "Revenue signals are stable.", whyItMatters: "Follow-up is the most underutilized revenue activity for founder-led businesses.", whySelectedOrDeferred: null }
}

function evaluateOperations(agg: HarmonyContextAggregate | null): ExecutiveFinding {
  const base = { executiveId: "operations", executiveName: "Operations Executive™", executiveTitle: "Chief Operating Officer (COO)", department: "Operations & Systems", category: "Operations & Efficiency", estimatedBusinessImpact: "high" as const, estimatedFounderEffort: "medium" as const, businessAssets: ["sop-library", "delegation-system"], expiresAt: null }

  if (!agg) return { ...base, priority: "low", confidence: 25, status: "monitoring" as const, currentFocus: "Awaiting context.", title: "Context Needed", summary: "Complete your Business Context Profile™.", recommendation: "Complete your Business Context Profile™.", expectedOutcome: "Personalized operations recommendations.", supportingSignals: [], whatINoticed: "No context.", whyItMatters: "Operations strategy requires context.", whySelectedOrDeferred: null }

  const hasSystemsOpportunity = agg.biggestOpportunities?.includes("systems-sops") || agg.biggestOpportunities?.includes("delegation")
  const hasAIOpportunity = agg.biggestOpportunities?.includes("ai-implementation")
  const hasFriction = !!agg.executionFriction

  if (hasFriction && hasSystemsOpportunity) {
    return { ...base, priority: "critical", confidence: 90, status: "opportunity-found" as const, currentFocus: "Eliminating declared execution friction through systems.", title: "Eliminate Execution Friction™", summary: "You have identified execution friction AND systems as an opportunity — this is the highest-leverage operations action.", recommendation: `Create one SOP for the task that causes the most friction in your week: "${agg.executionFriction}". Document the process, then decide: automate, delegate, or eliminate.`, expectedOutcome: "One repeatable, documented process that frees 2–5 hours per week.", supportingSignals: ["Declared friction: " + agg.executionFriction, "Declared opportunity: systems-sops"], whatINoticed: "You have both identified friction and declared systems as your growth opportunity.", whyItMatters: "Documented processes are the difference between a business that scales and one that depends entirely on the founder.", whySelectedOrDeferred: null }
  }

  if (hasAIOpportunity) {
    return { ...base, priority: "high", confidence: 78, status: "opportunity-found" as const, currentFocus: "Identifying first AI implementation opportunities.", title: "AI Implementation Roadmap™", summary: "AI implementation is your declared opportunity — the highest-ROI starting point is automating one repetitive writing or research task.", recommendation: "Identify the one task you do most repetitively that involves writing, research, or data. That is your first AI implementation target. Build a prompt that replaces 80% of your manual work.", expectedOutcome: "2–5 hours per week reclaimed through AI-assisted work.", supportingSignals: ["Declared opportunity: ai-implementation"], whatINoticed: "You identified AI implementation as a growth opportunity.", whyItMatters: "AI adoption in founder-led businesses creates compounding efficiency gains when started with one focused use case.", whySelectedOrDeferred: null }
  }

  if (hasSystemsOpportunity) {
    return { ...base, priority: "high", confidence: 74, status: "opportunity-found" as const, currentFocus: "Installing the first high-leverage SOP.", title: "Install Your First SOP™", summary: "Systems and SOPs are your declared opportunity — every documented process frees founder bandwidth.", recommendation: "Choose the task you repeat most this week and document the exact steps. A 5-minute SOP today can save hours per month and enable your first delegation.", expectedOutcome: "One documented, transferable process ready for delegation or automation.", supportingSignals: ["Declared opportunity: systems-sops"], whatINoticed: "You declared systems and SOPs as your growth opportunity.", whyItMatters: "SOPs are the foundation of every scalable business — they move knowledge out of the founder's head.", whySelectedOrDeferred: null }
  }

  return { ...base, priority: "low", confidence: 55, status: "monitoring" as const, currentFocus: "Monitoring operations load.", title: "Operations Monitoring™", summary: "No critical operations gaps detected.", recommendation: "Do a 10-minute time audit: list every task you completed yesterday. Identify the one you should stop doing entirely.", expectedOutcome: "One task eliminated or delegated, freeing founder bandwidth.", supportingSignals: [], whatINoticed: "Operations signals are nominal.", whyItMatters: "Regular time audits prevent accumulated operational drag.", whySelectedOrDeferred: null }
}

function evaluateFinance(agg: HarmonyContextAggregate | null): ExecutiveFinding {
  const base = { executiveId: "finance", executiveName: "Finance Executive™", executiveTitle: "Chief Financial Officer (CFO)", department: "Finance & Profitability", category: "Financial Architecture™", estimatedBusinessImpact: "high" as const, estimatedFounderEffort: "low" as const, businessAssets: ["financial-foundation", "business-credit-profile"], expiresAt: null }

  if (!agg) return { ...base, priority: "low", confidence: 25, status: "monitoring" as const, currentFocus: "Awaiting context.", title: "Context Needed", summary: "Complete your Business Context Profile™.", recommendation: "Complete your Business Context Profile™.", expectedOutcome: "Personalized financial strategy.", supportingSignals: [], whatINoticed: "No context.", whyItMatters: "Financial strategy requires context.", whySelectedOrDeferred: null }

  const hasNoCredit = agg.businessCredit === "no-credit" || !agg.businessCredit
  const hasCreditOpportunity = agg.biggestOpportunities?.includes("business-credit")
  const hasCapitalOpportunity = agg.biggestOpportunities?.includes("raising-capital")
  const hasWealthOpportunity = agg.biggestOpportunities?.includes("wealth-building")
  const isEarlyStage = agg.revenueStage === "pre-revenue"

  if (hasNoCredit && !isEarlyStage) {
    return { ...base, priority: "high", confidence: 85, status: "opportunity-found" as const, currentFocus: "Establishing business credit foundation.", title: "Establish Business Credit™", summary: "Your business credit profile is not yet established — this is a high-priority financial infrastructure gap.", recommendation: "Open a business checking account in your business name (if not already done), obtain an EIN, and apply for a secured business credit card. These three steps begin your business credit profile.", expectedOutcome: "A business credit file that qualifies you for funding opportunities within 6–12 months.", supportingSignals: ["Business credit: not established", "Revenue stage: " + (agg.revenueStage ?? "active")], whatINoticed: "Your business is generating or preparing for revenue, but no business credit is established.", whyItMatters: "Business credit separates personal and business financial risk and opens access to capital on better terms.", whySelectedOrDeferred: null }
  }

  if (hasCreditOpportunity) {
    return { ...base, priority: "high", confidence: 80, status: "opportunity-found" as const, currentFocus: "Accelerating business credit profile.", title: "Business Credit Acceleration™", summary: "You identified business credit as a priority — the fastest path is a structured 90-day credit-building plan.", recommendation: "Review your current business credit profile (Dun & Bradstreet, Experian Business, Equifax Business). Identify and fill the largest gap this week.", expectedOutcome: "A credit profile positioned for tier-2 and tier-3 business credit within 90 days.", supportingSignals: ["Declared opportunity: business-credit"], whatINoticed: "You declared business credit as a growth opportunity.", whyItMatters: "Business credit is the financial infrastructure that enables every other capital strategy.", whySelectedOrDeferred: null }
  }

  if (hasCapitalOpportunity) {
    return { ...base, priority: "high", confidence: 78, status: "opportunity-found" as const, currentFocus: "Evaluating capital strategy options.", title: "Capital Strategy™", summary: "You are considering raising capital — proper positioning before approaching investors or lenders is critical.", recommendation: "Before seeking capital, document your business financials, defined use of funds, and projected ROI. Investors and lenders fund clarity, not just ideas.", expectedOutcome: "A capital-ready business presentation that increases funding probability.", supportingSignals: ["Declared opportunity: raising-capital"], whatINoticed: "You declared raising capital as a growth opportunity.", whyItMatters: "Founders who approach capital without clear documentation consistently underperform in funding outcomes.", whySelectedOrDeferred: null }
  }

  if (hasWealthOpportunity) {
    return { ...base, priority: "medium", confidence: 68, status: "reviewing" as const, currentFocus: "Evaluating wealth-building opportunities from business revenue.", title: "Wealth Building From Your Business™", summary: "You have identified wealth building as a priority — your business is the most powerful wealth-building vehicle you own.", recommendation: "Define how much of your monthly business revenue will be transferred to a personal wealth account. Even 5% monthly compounds significantly over 5 years.", expectedOutcome: "A systematic wealth transfer habit that builds personal net worth from business activity.", supportingSignals: ["Declared opportunity: wealth-building"], whatINoticed: "You declared wealth building as a growth opportunity.", whyItMatters: "Most founders invest everything back into the business — separating wealth transfer protects your long-term financial future.", whySelectedOrDeferred: null }
  }

  return { ...base, priority: "low", confidence: 58, status: "monitoring" as const, currentFocus: "Monitoring financial signals.", title: "Finance Monitoring™", summary: "Financial signals are nominal. No critical gaps detected.", recommendation: "Review your revenue from last month vs. the month before. Identify one pricing or offer adjustment that would improve that number.", expectedOutcome: "Intentional financial awareness that informs offer and pricing decisions.", supportingSignals: [], whatINoticed: "Financial signals are stable.", whyItMatters: "Regular financial review prevents reactive decisions.", whySelectedOrDeferred: null }
}

function evaluatePeopleCulture(agg: HarmonyContextAggregate | null): ExecutiveFinding {
  const base = { executiveId: "people-culture", executiveName: "People & Culture Executive™", executiveTitle: "Chief People & Culture Officer (CPCO)", department: "People & Culture", category: "Human Sustainability™", estimatedBusinessImpact: "high" as const, estimatedFounderEffort: "low" as const, businessAssets: ["team-operating-rules", "hiring-plan"], expiresAt: null }

  if (!agg) return { ...base, priority: "low", confidence: 25, status: "monitoring" as const, currentFocus: "Awaiting context.", title: "Context Needed", summary: "Complete your Business Context Profile™.", recommendation: "Complete your Business Context Profile™.", expectedOutcome: "Personalized people & culture recommendations.", supportingSignals: [], whatINoticed: "No context.", whyItMatters: "People strategy requires context.", whySelectedOrDeferred: null }

  const inLifeProtection = agg.inLifeProtectionMode
  const hasHiringOpportunity = agg.biggestOpportunities?.includes("hiring") || agg.biggestOpportunities?.includes("delegation")
  const lowStreak = (agg.progress?.nonNegotiableStreak ?? 0) === 0
  const isSolo = agg.teamSize === "solo" || agg.supportNetwork?.includes("just-me")

  if (inLifeProtection) {
    return { ...base, priority: "critical", confidence: 92, status: "alert" as const, currentFocus: "Protecting founder capacity ahead of a significant life event.", title: "Life Protection Protocol™ Active", summary: "A significant life event is approaching — protecting your Human Sustainability™ is the highest priority.", recommendation: "Reduce your CEO Workday™ to essential activities only this week. Protect all non-negotiables without exception. Delegate or defer everything that can wait.", expectedOutcome: "Preserved founder energy and protected life commitments during a critical personal period.", supportingSignals: ["Life protection mode: active", "Days to significant event: " + (agg.daysUntilNextSignificantEvent ?? "soon")], whatINoticed: "A significant life event is within 3 days.", whyItMatters: "Human Sustainability™ is the operating principle that protects the founder from building a business that destroys the life they are building it for.", whySelectedOrDeferred: null }
  }

  if (lowStreak) {
    return { ...base, priority: "high", confidence: 80, status: "opportunity-found" as const, currentFocus: "Resetting Daily Non-Negotiables™ streak.", title: "Non-Negotiables™ Reset Needed", summary: "Your Daily Non-Negotiables™ streak has broken — this is the highest-priority human sustainability signal.", recommendation: "Recommit to one non-negotiable today. Not all of them — just one. A single honored commitment today rebuilds the streak and the identity.", expectedOutcome: "Streak reset and momentum re-established within 24 hours.", supportingSignals: ["Non-negotiable streak: 0"], whatINoticed: "Your Daily Non-Negotiables™ streak has broken.", whyItMatters: "Non-negotiables are the foundation of Human Sustainability™. When they break, the operating system weakens.", whySelectedOrDeferred: null }
  }

  if (hasHiringOpportunity) {
    return { ...base, priority: "medium", confidence: 72, status: "reviewing" as const, currentFocus: "Defining the first hire or delegation opportunity.", title: "First Hire or Delegation™", summary: "Hiring or delegation is your declared opportunity — the first step is defining exactly what to hand off.", recommendation: "List every task you did last week. Highlight the ones a $20/hr contractor could do. That list is your first delegation brief.", expectedOutcome: "A clear delegation brief ready for a first hire or contractor engagement.", supportingSignals: ["Declared opportunity: hiring or delegation"], whatINoticed: "You declared hiring or delegation as a growth opportunity.", whyItMatters: "The bottleneck in most founder-led businesses is the founder. Delegation removes that bottleneck.", whySelectedOrDeferred: null }
  }

  if (isSolo) {
    return { ...base, priority: "medium", confidence: 65, status: "reviewing" as const, currentFocus: "Building founder capacity for long-term solo sustainability.", title: "Solo Founder Sustainability™", summary: "Operating solo requires intentional capacity management — the biggest risk is invisible burnout.", recommendation: "Schedule one protected hour of deep recovery this week — no screens, no business. Your most valuable business asset is your cognitive capacity.", expectedOutcome: "One protected recovery block per week as a non-negotiable.", supportingSignals: ["Team size: solo"], whatINoticed: "You are operating as a solo founder.", whyItMatters: "Solo founders who protect recovery time consistently outperform those who do not.", whySelectedOrDeferred: null }
  }

  return { ...base, priority: "low", confidence: 60, status: "monitoring" as const, currentFocus: "Monitoring founder and team sustainability signals.", title: "Sustainability Monitoring™", summary: "Human Sustainability™ signals are nominal. No critical gaps detected.", recommendation: "Check in with your team (or yourself) this week: what is the most draining task this month? That is your next delegation or elimination target.", expectedOutcome: "Maintained team and founder sustainability through proactive monitoring.", supportingSignals: [], whatINoticed: "Sustainability signals are stable.", whyItMatters: "Regular sustainability checks prevent accumulated burnout.", whySelectedOrDeferred: null }
}

function evaluateClientSuccess(agg: HarmonyContextAggregate | null): ExecutiveFinding {
  const base = { executiveId: "client-success", executiveName: "Client Success Executive™", executiveTitle: "Chief Experience Officer (CXO)", department: "Client Experience", category: "Client Experience", estimatedBusinessImpact: "high" as const, estimatedFounderEffort: "low" as const, businessAssets: ["client-journey", "onboarding-system"], expiresAt: null }

  if (!agg) return { ...base, priority: "low", confidence: 25, status: "monitoring" as const, currentFocus: "Awaiting context.", title: "Context Needed", summary: "Complete your Business Context Profile™.", recommendation: "Complete your Business Context Profile™.", expectedOutcome: "Personalized client experience recommendations.", supportingSignals: [], whatINoticed: "No context.", whyItMatters: "Client strategy requires context.", whySelectedOrDeferred: null }

  const hasRecurringOpportunity = agg.biggestOpportunities?.includes("recurring-revenue")
  const isActiveRevenue = agg.revenueStage !== "pre-revenue" && agg.revenueStage !== null

  if (hasRecurringOpportunity && isActiveRevenue) {
    return { ...base, priority: "high", confidence: 80, status: "opportunity-found" as const, currentFocus: "Converting existing clients into recurring relationships.", title: "Client Retention Architecture™", summary: "Your existing clients are your best recurring revenue source — a structured retention system is the highest-leverage next step.", recommendation: "Contact your top 3 clients this week and ask: 'What would make working with me even better?' Their answers design your recurring offer.", expectedOutcome: "Direct client feedback that designs your retention and recurring revenue strategy.", supportingSignals: ["Declared opportunity: recurring-revenue", "Revenue stage: active"], whatINoticed: "You want recurring revenue and have active clients.", whyItMatters: "Retention is 5x cheaper than acquisition. Your best new clients are your current clients.", whySelectedOrDeferred: null }
  }

  if (isActiveRevenue) {
    return { ...base, priority: "medium", confidence: 65, status: "reviewing" as const, currentFocus: "Reviewing client experience for retention opportunities.", title: "Client Experience Review™", summary: "Your business is generating revenue — the highest-leverage next step is documenting the client journey.", recommendation: "Map your client journey from first contact to final delivery. Identify the moment where clients feel most and least supported. Fix the least-supported moment first.", expectedOutcome: "A documented client journey with one identified improvement to implement this week.", supportingSignals: ["Revenue stage: active"], whatINoticed: "Your business has active revenue — your client experience is now a competitive advantage.", whyItMatters: "Client experience directly drives referrals, testimonials, and retention.", whySelectedOrDeferred: null }
  }

  return { ...base, priority: "low", confidence: 50, status: "monitoring" as const, currentFocus: "Preparing for first client relationships.", title: "Pre-Client Architecture™", summary: "No active client relationships yet — preparing the client experience foundation.", recommendation: "Write your ideal client welcome message now, before you have clients. Having it ready means you can onboard immediately when the first client says yes.", expectedOutcome: "A ready-to-deploy onboarding message that creates a great first impression.", supportingSignals: ["Revenue stage: pre-revenue"], whatINoticed: "Your business is in a pre-revenue stage.", whyItMatters: "First impressions in onboarding set the tone for the entire client relationship.", whySelectedOrDeferred: null }
}

function evaluateInnovation(agg: HarmonyContextAggregate | null): ExecutiveFinding {
  const base = { executiveId: "innovation", executiveName: "Innovation Executive™", executiveTitle: "Chief Innovation & AI Officer", department: "Innovation & AI", category: "AI & Technology", estimatedBusinessImpact: "high" as const, estimatedFounderEffort: "medium" as const, businessAssets: ["ai-workflow", "automation-system"], expiresAt: null }

  if (!agg) return { ...base, priority: "low", confidence: 25, status: "monitoring" as const, currentFocus: "Awaiting context.", title: "Context Needed", summary: "Complete your Business Context Profile™.", recommendation: "Complete your Business Context Profile™.", expectedOutcome: "Personalized AI recommendations.", supportingSignals: [], whatINoticed: "No context.", whyItMatters: "AI strategy requires context.", whySelectedOrDeferred: null }

  const hasAIOpportunity = agg.biggestOpportunities?.includes("ai-implementation")
  const hasLearningInterestInAI = agg.learningInterests?.some(i => i.toLowerCase().includes("ai"))

  if (hasAIOpportunity) {
    return { ...base, priority: "high", confidence: 82, status: "opportunity-found" as const, currentFocus: "Identifying highest-ROI first AI workflow.", title: "AI Implementation Priority™", summary: "AI implementation is your declared opportunity — the most impactful first use case is almost always content creation or research.", recommendation: "This week, use AI to draft or outline one piece of content you would normally write from scratch. Time it. That time saved is your ROI measurement.", expectedOutcome: "First AI-assisted workflow implemented with a measurable time savings.", supportingSignals: ["Declared opportunity: ai-implementation"], whatINoticed: "You identified AI implementation as your biggest opportunity.", whyItMatters: "Founders who build AI workflows early create a compounding efficiency advantage over competitors.", whySelectedOrDeferred: null }
  }

  if (hasLearningInterestInAI) {
    return { ...base, priority: "medium", confidence: 65, status: "reviewing" as const, currentFocus: "Translating AI learning interest into first practical workflow.", title: "From AI Curiosity to AI Workflow™", summary: "You are interested in AI — the fastest path from curiosity to value is one practical workflow.", recommendation: "Choose one task from your week and spend 30 minutes building a custom AI prompt for it. The goal is one repeatable prompt that saves 30+ minutes per week.", expectedOutcome: "One custom AI prompt that replaces a repetitive manual task.", supportingSignals: ["Learning interest: AI"], whatINoticed: "You expressed interest in AI learning.", whyItMatters: "Moving from AI curiosity to one working workflow changes your relationship with AI permanently.", whySelectedOrDeferred: null }
  }

  return { ...base, priority: "low", confidence: 50, status: "monitoring" as const, currentFocus: "Monitoring AI adoption signals.", title: "Innovation Monitoring™", summary: "No AI opportunities declared. Monitoring for emerging signals.", recommendation: "Identify one task you did manually this week that could be partially AI-assisted. No commitment — just awareness.", expectedOutcome: "Increased AI opportunity awareness without adding overwhelm.", supportingSignals: [], whatINoticed: "No AI opportunities declared.", whyItMatters: "Awareness is the first step to effective AI adoption.", whySelectedOrDeferred: null }
}

function evaluateGrowth(agg: HarmonyContextAggregate | null): ExecutiveFinding {
  const base = { executiveId: "growth", executiveName: "Growth Executive™", executiveTitle: "Chief Growth & Leadership Officer", department: "Growth & Leadership", category: "Leadership & Thought Leadership", estimatedBusinessImpact: "medium" as const, estimatedFounderEffort: "medium" as const, businessAssets: ["thought-leadership-content", "signature-framework"], expiresAt: null }

  if (!agg) return { ...base, priority: "low", confidence: 25, status: "monitoring" as const, currentFocus: "Awaiting context.", title: "Context Needed", summary: "Complete your Business Context Profile™.", recommendation: "Complete your Business Context Profile™.", expectedOutcome: "Personalized leadership recommendations.", supportingSignals: [], whatINoticed: "No context.", whyItMatters: "Growth strategy requires context.", whySelectedOrDeferred: null }

  const hasScalingOpportunity = agg.biggestOpportunities?.includes("scaling") || agg.biggestOpportunities?.includes("leadership")
  const hasThoughtLeadership = agg.biggestOpportunities?.includes("strategic-partnerships")
  const hasPartnershipGoal = agg.biggestOpportunities?.includes("strategic-partnerships")

  if (hasScalingOpportunity) {
    return { ...base, priority: "high", confidence: 76, status: "opportunity-found" as const, currentFocus: "Building the leadership infrastructure required for scaling.", title: "Scaling Readiness Assessment™", summary: "Scaling is your declared opportunity — scaling a business requires scaling the founder first.", recommendation: "Identify the three decisions only you can make in your business. Everything else is a delegation or automation opportunity. Build a system for at least one this quarter.", expectedOutcome: "A founder-independent system for at least one business function, enabling sustainable scaling.", supportingSignals: ["Declared opportunity: scaling or leadership"], whatINoticed: "You declared scaling and leadership as growth opportunities.", whyItMatters: "Most businesses stop scaling when they hit the founder's capacity ceiling. Leadership development breaks that ceiling.", whySelectedOrDeferred: null }
  }

  if (hasThoughtLeadership || hasPartnershipGoal) {
    return { ...base, priority: "medium", confidence: 68, status: "reviewing" as const, currentFocus: "Developing thought leadership and partnership strategy.", title: "Thought Leadership Positioning™", summary: "Strategic partnerships require thought leadership credibility. Building your authority is the prerequisite.", recommendation: "Write and publish one piece of original thought leadership this week — a LinkedIn article, newsletter, or short-form video about your unique perspective on your industry.", expectedOutcome: "One published thought leadership piece that begins building your authority position.", supportingSignals: ["Declared opportunity: strategic-partnerships or partnerships goal"], whatINoticed: "You declared strategic partnerships or partnerships as a priority.", whyItMatters: "Partnerships approach founders who are already visible and credible. Thought leadership is the prerequisite.", whySelectedOrDeferred: null }
  }

  return { ...base, priority: "low", confidence: 52, status: "monitoring" as const, currentFocus: "Monitoring leadership development signals.", title: "Growth Monitoring™", summary: "No scaling or leadership opportunities declared. Monitoring for signals.", recommendation: "Ask yourself: 'What is one thing I did last month that made me a better leader or communicator?' If you cannot answer, this week is the time to start.", expectedOutcome: "A leadership growth reflection habit that builds founder capability over time.", supportingSignals: [], whatINoticed: "No scaling signals active.", whyItMatters: "Intentional leadership development compounds into competitive advantage.", whySelectedOrDeferred: null }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Evaluates all 9 executives and returns their findings, sorted by priority.
 */
export function deriveExecutiveFindings(
  agg: HarmonyContextAggregate | null,
): ExecutiveFinding[] {
  const findings: ExecutiveFinding[] = [
    evaluateStrategy(agg),
    evaluateMarketing(agg),
    evaluateSales(agg),
    evaluateOperations(agg),
    evaluateFinance(agg),
    evaluatePeopleCulture(agg),
    evaluateClientSuccess(agg),
    evaluateInnovation(agg),
    evaluateGrowth(agg),
  ]

  // Sort: highest priority first, then highest confidence
  return findings.sort((a, b) => {
    const rankDiff = priorityRank(b.priority) - priorityRank(a.priority)
    if (rankDiff !== 0) return rankDiff
    return b.confidence - a.confidence
  })
}

/**
 * Selects the winning finding and builds the ExecutiveBrief.
 */
export function buildExecutiveBrief(
  findings: ExecutiveFinding[],
  agg: HarmonyContextAggregate | null,
): ExecutiveBrief {
  const ranked = [...findings].sort((a, b) => {
    const rankDiff = priorityRank(b.priority) - priorityRank(a.priority)
    if (rankDiff !== 0) return rankDiff
    return b.confidence - a.confidence
  })

  const winner = ranked[0]
  const rest = ranked.slice(1)

  // Contributors: priority >= medium, not winner
  const contributors = rest.filter(
    (f) => priorityRank(f.priority) >= priorityRank("medium"),
  )

  // Deferred: the next 1–3 findings worth noting
  const deferred = rest
    .filter((f) => f.priority !== "none" && f.priority !== "low")
    .slice(0, 3)
    .map((f) => ({
      executiveId: f.executiveId,
      title: f.title,
      reason: `Priority: ${f.priority} (confidence ${f.confidence}%) — deferred in favor of ${winner.executiveName}'s higher-priority finding.`,
    }))

  // Annotate why selected / deferred
  winner.whySelectedOrDeferred = `Selected as the highest-priority recommendation (${winner.priority}, ${winner.confidence}% confidence) from ${findings.length} executive evaluations.`
  contributors.forEach((c) => {
    c.whySelectedOrDeferred = `Contributed supporting signals to the winning recommendation. Priority: ${c.priority}, confidence: ${c.confidence}%.`
  })

  // Signal inventory
  const signalsUsed = Array.from(
    new Set([
      ...winner.supportingSignals,
      ...contributors.flatMap((c) => c.supportingSignals),
    ]),
  )

  // Overall confidence
  const allScores = [winner, ...contributors].map((f) => f.confidence)
  const overallConfidence = clamp(
    allScores.reduce((acc, s) => acc + s, 0) / allScores.length,
  )

  // Cherry Blossom rationale
  const contextParts: string[] = []
  if (agg?.firstName) contextParts.push(agg.firstName)
  if (agg?.businessStage) contextParts.push(agg.businessStage.replace(/-/g, " "))
  if (agg?.revenueStage) contextParts.push(agg.revenueStage.replace(/-/g, " ") + " revenue stage")

  const rationale = `After reviewing all nine executive reports, ${winner.executiveName} surfaced the clearest, highest-leverage opportunity for you right now: ${winner.title}. ${winner.summary} ${contributors.length > 0 ? `The ${contributors.map(c => c.executiveName).join(" and ")} ${contributors.length === 1 ? "also identified" : "each identified"} supporting signals. ` : ""}Your next single step: ${winner.recommendation}`

  return {
    recommendation: winner.recommendation,
    rationale,
    winningExecutiveId: winner.executiveId,
    winningFinding: winner,
    contributors,
    deferred,
    signalsUsed,
    overallConfidence,
  }
}

/**
 * Produces the status row for each executive — used in the Status Dashboard.
 */
export function deriveExecutiveStatuses(
  findings: ExecutiveFinding[],
): ExecutiveStatusRow[] {
  return findings.map((f) => ({
    executiveId: f.executiveId,
    executiveName: f.executiveName,
    executiveTitle: f.executiveTitle,
    department: f.department,
    status: statusFromPriority(f.priority),
    currentFocus: f.currentFocus,
    lastInsight: f.summary,
    priority: f.priority,
    confidence: f.confidence,
  }))
}
