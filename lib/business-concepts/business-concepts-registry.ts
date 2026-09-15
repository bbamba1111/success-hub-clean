/**
 * Business Concepts™ — Canonical Registry (Phase 5.6)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for how Harmony Lane™ explains core business
 * concepts. Instead of scattering definitions throughout the app, every core
 * concept has ONE canonical definition PLUS five explanation variants — one for
 * each Business Comprehension™ Communication Style™.
 *
 * This is the reference architecture that demonstrates the guiding principle of
 * Business Comprehension™:
 *
 *   Adapt the EXPLANATION, never the PRINCIPLE.
 *   The underlying meaning is identical across all five variants — only the
 *   vocabulary, framing, and examples change.
 *
 * Cherry Blossom™, the Executive Leadership Team™, the Professional Advisory
 * Network™, the Deliverable Engine™, and Harmony Business Academy™ all reference
 * THIS registry, so founders everywhere learn the same underlying business
 * language — expressed in the style that helps them understand and apply it.
 *
 * This module is intentionally data-only. NO AI generation happens this phase;
 * these examples establish the framework future AI responses will follow.
 */

import type { CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"

/** Grouping for browsing the concept library. */
export type ConceptCategory = "Finance" | "Operations" | "People & Leadership" | "Growth"

/**
 * A single business concept with its canonical definition and one explanation
 * per Communication Style™. The `explanations` record is keyed by every
 * CommunicationStyle, so TypeScript guarantees all five variants exist.
 */
export interface BusinessConcept {
  /** Stable identifier — safe for routing, storage, and cross-references. */
  id: string
  /** The canonical term (e.g. "Margin", "Operating Rule™"). */
  term: string
  /** Browsing category. */
  category: ConceptCategory
  /**
   * The canonical, style-independent definition — the PRINCIPLE that never
   * changes. Every style variant expresses THIS meaning.
   */
  canonicalDefinition: string
  /** One explanation per Communication Style™ (same principle, adapted wording). */
  explanations: Record<CommunicationStyle, string>
}

/**
 * BUSINESS_CONCEPTS — the canonical concept library. Each concept demonstrates
 * how one principle is explained across all five Communication Styles™.
 */
export const BUSINESS_CONCEPTS: BusinessConcept[] = [
  {
    id: "margin",
    term: "Margin",
    category: "Finance",
    canonicalDefinition:
      "The portion of a sale you keep as profit after the costs tied to that sale, usually shown as a percentage of revenue.",
    explanations: {
      foundation:
        "Margin is how much money you actually get to keep from a sale after you pay for what it cost you. Sell something for $100 that cost you $60, and you keep $40 — that's your margin.",
      small_business:
        "Margin is the slice of each sale left over after the costs of delivering it. It tells you whether your pricing is healthy: higher margin means more of every dollar stays in the business.",
      business_owner:
        "Margin is profit expressed as a percentage of revenue after associated costs. Tracking it by product or service shows you which offers actually fund the business and which quietly drain it.",
      executive:
        "Margin measures the profitability of revenue after attributable costs. It's a core lever for pricing strategy, portfolio decisions, and forecasting the earnings power of the business.",
      boardroom:
        "Margin is a primary indicator of unit economics and enterprise value. Sustained margin structure informs capital allocation, valuation multiples, and the scalability thesis of the business model.",
    },
  },
  {
    id: "cash-flow",
    term: "Cash Flow",
    category: "Finance",
    canonicalDefinition:
      "The movement of money into and out of the business over time — being profitable on paper is not the same as having cash available.",
    explanations: {
      foundation:
        "Cash flow is simply the money coming in versus the money going out. Even a busy business can run into trouble if more is going out than coming in right now.",
      small_business:
        "Cash flow is the timing of money in and out. You can be profitable and still be short on cash if customers pay slowly while your bills are due now — so timing matters as much as totals.",
      business_owner:
        "Cash flow tracks the actual movement of money across operating, investing, and financing activity. Managing it means aligning receivables, payables, and reserves so the business stays liquid while it grows.",
      executive:
        "Cash flow reflects the liquidity the business generates and consumes. Free cash flow — after operating costs and investment — is what funds growth, debt service, and resilience without external capital.",
      boardroom:
        "Cash flow, particularly free cash flow generation, underpins solvency, capital allocation, and financing strategy. It is the ultimate measure of whether the enterprise creates or consumes value over time.",
    },
  },
  {
    id: "gross-profit",
    term: "Gross Profit",
    category: "Finance",
    canonicalDefinition:
      "Revenue minus the direct costs of producing what you sold, before overhead like rent, salaries, and marketing.",
    explanations: {
      foundation:
        "Gross profit is what's left after you subtract the cost of making or buying the thing you sold — but before other bills like rent. It shows if the core thing you sell actually makes money.",
      small_business:
        "Gross profit is your sales minus the direct cost of delivering them (materials, the product itself, direct labor). It's the money available to cover everything else and still profit.",
      business_owner:
        "Gross profit is revenue less cost of goods sold, before operating overhead. Watching gross profit and gross margin together shows how efficiently you turn delivery costs into contribution.",
      executive:
        "Gross profit isolates the profitability of core delivery before operating expenses. It's the foundation for contribution analysis, break-even planning, and evaluating operating leverage.",
      boardroom:
        "Gross profit anchors the P&L's operating leverage story and gross margin trajectory — key inputs to scalability, benchmarking, and the enterprise's long-run earnings model.",
    },
  },
  {
    id: "burn-rate",
    term: "Burn Rate",
    category: "Finance",
    canonicalDefinition:
      "How quickly the business spends its cash reserves, usually measured per month, and how long those reserves will last (runway).",
    explanations: {
      foundation:
        "Burn rate is how fast you're using up your savings each month. If you have $10,000 and spend $2,000 more than you make monthly, you have five months before it runs out.",
      small_business:
        "Burn rate is how much cash you use up each month beyond what you bring in. Knowing it tells you your runway — how many months you can operate before you need more revenue or funding.",
      business_owner:
        "Burn rate is net monthly cash consumption; divided into reserves it yields runway. Managing burn means balancing growth investment against the months of operating cushion you keep.",
      executive:
        "Burn rate quantifies the pace of cash depletion against reserves, defining runway and financing timing. It frames the trade-off between growth velocity and capital efficiency.",
      boardroom:
        "Burn rate and runway are central to capital strategy and financing cadence, governing dilution timing, scenario planning, and the board's risk posture on liquidity.",
    },
  },
  {
    id: "business-credit",
    term: "Business Credit",
    category: "Finance",
    canonicalDefinition:
      "A business's own credit profile — separate from the owner's personal credit — used to borrow, get terms with suppliers, and fund growth.",
    explanations: {
      foundation:
        "Business credit is like a credit score for your business instead of you personally. Building it lets the business borrow or buy on terms without everything resting on your own name.",
      small_business:
        "Business credit is your company's borrowing reputation, kept separate from your personal credit. Establishing it early helps you get supplier terms, cards, and loans as the business — not as you.",
      business_owner:
        "Business credit is the company's independent creditworthiness, built through trade lines, on-time payments, and a proper entity setup. It expands financing options while protecting personal exposure.",
      executive:
        "Business credit represents the enterprise's standalone credit profile, enabling access to capital and favorable terms while separating personal and corporate liability.",
      boardroom:
        "Business credit underpins the enterprise's debt capacity and cost of capital, shaping financing structure, counterparty terms, and the separation of corporate and personal risk.",
    },
  },
  {
    id: "customer-lifetime-value",
    term: "Customer Lifetime Value",
    category: "Growth",
    canonicalDefinition:
      "The total profit you expect from a customer across the entire time they do business with you — not just their first purchase.",
    explanations: {
      foundation:
        "Customer lifetime value is how much a customer is worth to you over all the time they keep buying — not just once. A loyal customer who returns for years is worth far more than a single sale.",
      small_business:
        "Customer lifetime value (CLV) is the total profit one customer brings over the whole relationship. Knowing it tells you how much you can spend to win a customer and still come out ahead.",
      business_owner:
        "CLV estimates the cumulative profit per customer across their lifecycle. Compared against acquisition cost (CLV:CAC), it reveals whether growth spending is efficient and where to focus retention.",
      executive:
        "Customer lifetime value models the discounted profit stream per customer relationship. It anchors acquisition budgets, retention strategy, and segmentation of the customer portfolio.",
      boardroom:
        "CLV, viewed against CAC and payback, is a core driver of unit economics and enterprise value — informing growth-capital allocation and the durability of the revenue base.",
    },
  },
  {
    id: "delegation",
    term: "Delegation",
    category: "People & Leadership",
    canonicalDefinition:
      "Entrusting a task or decision to someone else — with the authority to do it — so the founder's time is freed for higher-value work.",
    explanations: {
      foundation:
        "Delegation means handing a task to someone else and trusting them to do it, instead of doing everything yourself. It frees your time for the things only you can do.",
      small_business:
        "Delegation is giving work — and the authority to complete it — to someone else so you're not the bottleneck. Done well, it lets the business grow beyond what your own hours allow.",
      business_owner:
        "Delegation is transferring ownership of tasks and decisions with clear outcomes and authority. Effective delegation builds capacity, develops people, and moves the founder from doing to designing.",
      executive:
        "Delegation is the disciplined distribution of responsibility and decision rights across the team. It scales leadership capacity and is foundational to building an organization that runs without the founder.",
      boardroom:
        "Delegation, formalized through decision rights and accountability structures, is central to organizational design, succession, and the founder's transition from operator to enterprise leader.",
    },
  },
  {
    id: "human-zone-of-genius",
    term: "Human Zone of Genius™",
    category: "People & Leadership",
    canonicalDefinition:
      "The small set of things a person does exceptionally well and finds energizing — where their time creates the most value and should be protected.",
    explanations: {
      foundation:
        "Your Human Zone of Genius™ is the handful of things you're truly great at and love doing. The goal is to spend more of your day here and hand off the rest.",
      small_business:
        "Your Human Zone of Genius™ is the work where you're both excellent and energized. Protecting time for it — and delegating the rest — is how you get the most from your day as a founder.",
      business_owner:
        "The Human Zone of Genius™ identifies where a person's talent and energy create disproportionate value. Designing roles and delegation around it maximizes output and sustainability.",
      executive:
        "The Human Zone of Genius™ is where an individual's highest leverage lies. Aligning executive time and org design to it concentrates leadership energy on the work that most moves the business.",
      boardroom:
        "The Human Zone of Genius™ informs talent strategy and organizational design at scale — allocating leadership capacity to its highest-leverage use while systematizing everything else.",
    },
  },
  {
    id: "operating-rule",
    term: "Operating Rule™",
    category: "Operations",
    canonicalDefinition:
      "A clear standard a founder sets for how they will operate — a strategic decision made once, so it doesn't have to be re-decided every day.",
    explanations: {
      foundation:
        "An Operating Rule™ is a decision you make once about how you'll work — like \"I don't take calls before noon\" — so you don't have to decide it over and over.",
      small_business:
        "An Operating Rule™ is a personal standard for how you run your day or business, set in advance. It removes daily guesswork and protects what matters most to you.",
      business_owner:
        "An Operating Rule™ is a predefined operating standard that governs recurring decisions. It reduces decision fatigue and keeps behavior consistent with strategy and Human Sustainability™.",
      executive:
        "An Operating Rule™ codifies a strategic operating principle so execution stays aligned without constant re-litigation. It's a governance tool for the founder's own time and focus.",
      boardroom:
        "Operating Rules™ function as personal governance — encoding operating principles that preserve strategic discipline, protect capacity, and scale consistent decision-making.",
    },
  },
  {
    id: "sop",
    term: "SOP (Standard Operating Procedure)",
    category: "Operations",
    canonicalDefinition:
      "A documented, repeatable set of steps for completing a task the same way every time, so quality doesn't depend on any one person's memory.",
    explanations: {
      foundation:
        "An SOP is a simple step-by-step guide for doing a task the same way each time. It means anyone can follow it and get the job done right, even if you're not there.",
      small_business:
        "An SOP (standard operating procedure) is a written recipe for a task. Documenting how things are done makes training easier and keeps quality consistent as you hand work off.",
      business_owner:
        "An SOP documents a repeatable process step-by-step so outcomes stay consistent independent of who performs them. SOPs are the building blocks of delegation and reliable operations.",
      executive:
        "SOPs formalize repeatable processes to ensure consistency, quality, and transferability across the organization. They are core assets for scaling operations and reducing key-person risk.",
      boardroom:
        "SOPs institutionalize operational knowledge, underpinning quality systems, risk controls, and the process maturity that supports scale, diligence, and enterprise continuity.",
    },
  },
  {
    id: "capacity-planning",
    term: "Capacity Planning",
    category: "Operations",
    canonicalDefinition:
      "Matching the work you take on to the resources you actually have — time, people, and money — so you can deliver without overload.",
    explanations: {
      foundation:
        "Capacity planning is making sure you don't take on more than you can handle. It's looking at your time and help available before saying yes to more work.",
      small_business:
        "Capacity planning is matching how much work you accept to the time and people you have. It prevents overload and missed promises by planning limits before you commit.",
      business_owner:
        "Capacity planning aligns demand with available resources — people, hours, and budget — using forecasts so the business meets commitments without burning out its team.",
      executive:
        "Capacity planning balances projected demand against resource capacity to protect delivery, margins, and sustainability. It's essential to scaling operations predictably.",
      boardroom:
        "Capacity planning aligns resource investment with demand forecasts across the enterprise, informing workforce strategy, capital deployment, and the operational scalability thesis.",
    },
  },
]

/** Look up a concept by id. */
export function getBusinessConcept(id: string): BusinessConcept | undefined {
  return BUSINESS_CONCEPTS.find((c) => c.id === id)
}

/**
 * Get the explanation of a concept for a given Communication Style™ — the
 * canonical way every future consumer (Cherry Blossom™, Executives, Advisors,
 * Deliverables, Academy) will read an adapted explanation.
 */
export function getConceptExplanation(
  conceptId: string,
  style: CommunicationStyle,
): string | undefined {
  return getBusinessConcept(conceptId)?.explanations[style]
}

/** All concepts in a category (for a future concept-library browser). */
export function getConceptsByCategory(category: ConceptCategory): BusinessConcept[] {
  return BUSINESS_CONCEPTS.filter((c) => c.category === category)
}
