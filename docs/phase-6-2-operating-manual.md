# Phase 6.2 — Executive Decision Engine™ Operating Manual

## What Was Built

The **Executive Decision Engine™** is the constitutional governance layer of the Harmony Lane™ Operating System. It sits between the Harmony Context Engine™ (which understands the founder) and the Founder GPS™ (which recommends the next step).

**The chain:**

```
Harmony Context Engine™
        ↓  (HarmonyContextSnapshot)
Executive Decision Engine™
        ↓  (EdeDecisionOutput)
Founder GPS™
        ↓  (GpsRecommendation)
Cherry Blossom™
        ↓  (natural language)
Founder
```

The EDE does NOT generate language. It generates **structured, explainable priorities**.

---

## Files Created

```
lib/executive-decision-engine/
  types.ts               — Complete type surface (all 9 parts of the spec)
  constitution.ts        — Harmony Constitution™ (12 immutable principles)
  priority-framework.ts  — Decision Priority Framework™ (5 tiers)
  reasoning-rules.ts     — Executive Reasoning Rules™ (12 IF→THEN rules)
  leverage-framework.ts  — Business Leverage Framework™ (KEEP · DELEGATE · AUTOMATE · ELIMINATE)
  asset-registry.ts      — Business Asset Outcome Registry™ (20 assets + practice mappings)
  assignment-framework.ts — Executive Assignment Framework™ (8 founding templates)
  explainability.ts      — Explainability™ builder + formatting helpers
  index.ts               — Public barrel (all exports in one import)
```

---

## Part 1: Executive Decision Engine™

The EDE is the **constitutional brain** of Harmony Lane™. It does not execute work, schedule tasks, or generate recommendations. It evaluates context, applies principles and rules, and produces a single structured decision output (`EdeDecisionOutput`) that contains:

- The active priority tier
- The primary GPS Outcome™ to pursue
- The recommended leverage class
- The recommended assignment template id
- Whether growth recommendations should be suppressed
- A complete Explainability™ record

**Status:** Architecture. The `evaluateContext()` engine function is deferred to Phase 7. All registries and types are active.

---

## Part 2: Harmony Constitution™

**File:** `constitution.ts`

12 constitutional principles — each a first-class typed object with:
- Stable id (immutable, safe for storage and routing)
- Constitutional number (1–12, evaluation order)
- Full statement (precise, governance-weight language)
- Rationale (why it exists)
- Category (`life` | `business` | `execution` | `learning` | `wellbeing`)
- Protected GPS Outcomes™
- Override policy (`immutable` | `conditional` | `configurable`)
- Override conditions (only for `conditional` principles)

**Immutable principles** (can never be bypassed by any signal, rule, or AI call):
- Principle 2: Protect the Human Zone of Genius™
- Principle 3: Recommend ONE Highest-Leverage Outcome
- Principle 4: Build Compounding Business Assets™
- Principle 8: Prefer Delegate, Automate, or Eliminate Before Adding Work
- Principle 10: Time Freedom™ Is a Business Performance Indicator
- Principle 12: Recommendations Increase Clarity, Confidence, and Calm

**Helpers:** `getConstitutionById`, `getConstitutionByCategory`, `getConstitutionByOutcome`, `getImmutablePrinciples`

---

## Part 3: Decision Priority Framework™

**File:** `priority-framework.ts`

5 deterministic tiers, registry-driven (no hardcoded conditionals):

| Tier | Id | Primary Outcome |
|------|----|-----------------|
| 1 | `priority-1-life-safety` | `honor-non-negotiables` |
| 2 | `priority-2-non-negotiables-at-risk` | `honor-non-negotiables` |
| 3 | `priority-3-business-survival` | `build-compounding-assets` |
| 4 | `priority-4-strategic-growth` | `build-compounding-assets` |
| 5 | `priority-5-learning-optimization` | `build-compounding-assets` |

The EDE evaluates tiers top-down. The first tier with an active trigger signal becomes the `activeTier`. Tier 5 is the default.

Each tier carries: governing constitutional principles, trigger signals, primary GPS outcomes.

**Helpers:** `getPriorityTierById`, `getPriorityTiersOrdered`, `getDefaultPriorityTier`

---

## Part 4: Executive Reasoning Rules™

**File:** `reasoning-rules.ts`

12 deterministic IF→THEN rules, evaluated in `evaluationPriority` order:

| Priority | Rule | Effect |
|----------|------|--------|
| 1 | Burnout Critical → Reduce Workload | Elevates to Tier 2, leverage: eliminate |
| 2 | Life Protection Mode → Suspend Growth | Elevates to Tier 2, suppresses growth |
| 3 | Anniversary Approaching → Protect Evening | Surfaces preparation action |
| 4 | Event Requires Preparation → Surface Reminder | Injects reminder before assignments |
| 5 | Cash Runway Critical → Elevate Revenue Tasks | Elevates to Tier 3 |
| 6 | Weak Pipeline + Validated Offer → Favor Relationships | Routes to Revenue Engine™ |
| 7 | Task Is Delegable → Prefer Delegation | Modifies leverage class to delegate |
| 8 | Recurring Activity → Prefer Systemization | Routes to Operations & Systems™ |
| 9 | No Weekly Design → Recommend Sunday Ritual | Surfaces Sunday Design Day™ first |
| 10 | WLB Score Critical → Flag Sustainability | Elevates to Tier 2, surfaces risk |
| 11 | No ESA Completed → Recommend Assessment | Routes to assessment completion |
| 12 | Learning Not Connected → Add Implementation CTA | Always pairs learning with action |

**Helpers:** `getReasoningRuleById`, `getRulesForSignal`, `getReasoningRulesOrdered`, `getRulesForPrinciple`

---

## Part 5: Business Leverage Framework™

**File:** `leverage-framework.ts`

Four leverage classifications, evaluated in this order:

```
ELIMINATE™ → AUTOMATE™ → DELEGATE™ → KEEP™
```

The EDE asks "can we eliminate this?" before "should the founder do this?".

**KEEP™** — Zone of Genius only. Irreplaceable judgment, relationships, creative work.

**DELEGATE™** — Six delegation targets: Human Team™, AI Executive™, Contractor™, Agency™, Partner™, Virtual Assistant™. Each target has a `bestFor` description and status.

**AUTOMATE™** — Rule-based, predictable, compounding forever after build.

**ELIMINATE™** — Evaluated first. The most efficient system is the one that doesn't run.

Each class includes qualifying questions — the EDE (and eventually Cherry Blossom™) uses these to determine classification.

**Helpers:** `getLeverageClassById`, `getLeverageFrameworkOrdered`

---

## Part 6: Business Asset Outcome Registry™

**File:** `asset-registry.ts`

20 Compounding Business Assets™, each with:
- Stable id
- Name and description
- Compounding mechanism (HOW it pays back)
- Primary Operating Pillars™
- Build class (which leverage class builds it)
- ROI horizon (`immediate` → `12-months-plus`)
- Primary GPS Outcome™
- Primary Business Stages™

**Practice → Asset Mappings** (17 founding connections): links Operating Practice™ ids from `esa-registry.ts` to the Business Assets™ they produce, with connection strength (`direct` | `contributing` | `foundational`).

**Helpers:** `getAssetById`, `getAssetsByOutcome`, `getAssetsByStage`, `getAssetsForPractice`

---

## Part 7: Executive Assignment Framework™

**File:** `assignment-framework.ts`

The complete contractual output shape for every future GPS recommendation. Every `ExecutiveAssignmentTemplate` carries:

- Objective, duration, business outcome
- Produced Business Asset™
- Owning Executive™ + optional Advisor™ + optional Academy lesson
- Success metric (how the founder knows it succeeded)
- Reflection prompt (what Cherry Blossom™ asks on completion)
- Follow-up trigger (what signal causes the GPS to continue this thread)
- GPS Outcomes™ advanced, Business Stages™, leverage class

8 founding templates cover: Strategic Foundation™, Revenue Engine™, Operations & Systems™, Financial Intelligence™, Growth & Innovation™, and Human Sustainability™.

**Helpers:** `getAssignmentById`, `getAssignmentsByPillar`, `getAssignmentsByAsset`, `getAssignmentsByStage`, `getAssignmentsByOutcome`

---

## Part 8: Explainability™

**File:** `explainability.ts`

Every EDE output carries a `DecisionExplainability` record built via `buildExplainability()`. The builder enforces:
- Non-empty `primaryReason`
- Parallel arrays for principle ids and application notes
- At least one signal or principle

**Signal helpers:** `primarySignal`, `contributingSignal`, `suppressingSignal` — typed constructors for `ExplainabilitySignal`.

**Utility helpers:** `formatExplainabilityForLogging` (structured log string), `summarizeExplainability` (minimal summary for Cherry Blossom™ context injection).

**`ARCHITECTURE_EXPLAINABILITY`** — a type-safe default for direct lookup results that bypassed the EDE reasoning cycle.

---

## What Is NOT Built (Deferred)

| Feature | Status | Target Phase |
|---------|--------|--------------|
| `evaluateContext()` engine function | Deferred | Phase 7 |
| Full population of all Operating Practice → Asset mappings | Deferred | Phase 7 |
| GPS recommendation generation | Deferred | Phase 7 |
| Cherry Blossom™ language generation from Explainability™ | Deferred | Phase 7–8 |
| Weekly EDE execution cycle | Deferred | Phase 8 |
| AI inference integration | Deferred | Phase 9+ |

---

## Architectural Invariants

These three invariants hold across the entire EDE surface and cannot be violated by future phases:

1. **Honor Life's Non-Negotiables™** — Principle 1 governs every cycle. Life context is always evaluated before business context.

2. **Build Compounding Business Assets™** — Every assignment template produces a `BusinessAsset`. No assignment is a task — it is an investment.

3. **Reduce Execution Friction™** — ELIMINATE → AUTOMATE → DELEGATE → KEEP is the canonical evaluation order. The founder executes last, not first.
