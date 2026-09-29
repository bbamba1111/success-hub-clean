# Business Blueprint™ Content Specification

**Status:** Design document — Specification layer only. No code, no registry entries.
**Layering:** `Specification → Content Library → Engine`. This document is the Specification. The Content Library (actual Capability/Asset/Deliverable/Mechanism records) and the Engine (already partially built — see §10–12) are separate, later work.

---

## 1. Purpose & Design Principles

This document defines the rules Harmony Lane uses to author Business Blueprint™ content — the knowledge that determines what a specific founder's specific business requires. It does not itself contain that knowledge. Its job is to make sure that when the Content Library is eventually populated, every record answers the same shape of question, in the same taxonomy, with the same evidentiary standard — so the system never ends up with two disconnected views of "what does a business need."

**Design principles:**

1. **One taxonomy, multiple lenses.** Operating Pillars™ are the single canonical answer to "where does this belong." ESA asks how ready the founder is within a pillar; the Blueprint asks what a pillar requires for this founder's chosen business; the Inventory asks what the founder already has. Three lenses, one taxonomy — not three taxonomies.
2. **Specification → Content Library → Engine.** Rules first, then knowledge, then computation. Content authors write against this spec; the Engine (activation-rules.ts, compose-requirements.ts, derive-requirements.ts — already built) computes against the Content Library. Changing the spec should never require changing the Engine, and vice versa.
3. **Flag, never silently resolve.** Wherever this spec allows ambiguity — a capability that could fit two pillars, two archetypes wanting incompatible configurations of the same capability — the rule is to surface the conflict, not to pick a winner on the content author's behalf.
4. **Do not force a fit.** A capability, asset, or deliverable that does not cleanly belong to the taxonomy as currently defined should be flagged as a gap, not shoehorned in. See §8 for a live example of this principle already in effect.
5. **Sources are inputs, not architecture.** Guru models and mentor frameworks are used to *extract* mechanisms (§7, §13) — they are never adopted as the organizing structure of the Blueprint itself. The architecture is Harmony Lane's; the mechanisms are informed by, and attributed to, their sources.

---

## 2. Operating Pillars™ (canonical taxonomy)

The eight Operating Pillars™ already defined in `lib/entrepreneur-success/esa-registry.ts` (`OPERATING_PILLARS`) are the canonical "where" taxonomy for **all** Business Blueprint™ content. No competing category system is introduced by this spec or by any future Content Library built against it.

Every founder operates in all eight — what varies by business model and stage is emphasis, not presence.

| Pillar | Tagline | Governs |
|---|---|---|
| **Strategic Foundation™** | The clarity that makes every other decision easier. | Vision, mission, positioning, offer architecture, decision frameworks. |
| **Revenue Engine™** | The system that creates predictable income. | Marketing, lead generation, sales, conversion. |
| **Operations & Systems™** | The infrastructure that creates capacity. | SOPs, delegation systems, automation, AI workflow adoption. |
| **Financial Intelligence™** | The numbers that keep the business healthy. | Pricing discipline, cash flow, margin management, financial review rhythms. |
| **People & Leadership™** | The human infrastructure that scales the vision. | Hiring, team development, culture, leadership practices. |
| **Client Excellence™** | The experience that earns loyalty and referrals. | Client journey, onboarding, delivery, retention, community. |
| **Growth & Innovation™** | The capability that creates the next chapter. | Leadership development, thought leadership, AI adoption, strategic innovation. |
| **Human Sustainability™** | The foundation that makes everything else possible. | Founder sleep, movement, nutrition, boundaries, recovery. |

**Rule:** every new Capability record (§5) declares one *primary* Operating Pillar. Secondary pillars are permitted only when a capability is genuinely cross-pillar in its own right — never as a way to avoid picking a primary. `BusinessAsset` already sets a precedent for this in production: `primaryPillars: OperatingPillarId[]` is populated as a multi-value array on every existing asset (e.g. `evergreen-webinar` → `["revenue-engine", "operations-systems", "growth-innovation"]`), and that is the pattern Capability records should follow.

---

## 3. The Dimensions

The Blueprint answers "what does this business need" by composing four structural dimensions plus three qualifying dimensions:

```
Operating Pillar™   →  WHERE does this belong?
        ↓
Capability           →  WHAT must the business be able to do?
        ↓
Business Asset™      →  WHAT durable thing are we building?
        ↓
Deliverable          →  WHAT tangible thing gets produced?
```

Qualifying dimensions, applied to any node in that chain:

- **Mechanism** — the proven way to build/install it (§9).
- **Stage** — when it becomes necessary (§10).
- **Status** — whether the founder already has it (§12).

This four-plus-three structure replaces the previously-considered flat 15-category list. A category list answers only "what bucket is this in"; this structure answers "where, what, how, when, and whether" — which is what the Blueprint actually needs to compute a founder's specific gap map.

---

## 4. Business Model Dimensions

Business Model Dimensions describe **what kind of business the founder is choosing** — the "Build-a-Bear" configuration. They are a distinct concept from Operating Pillars: dimensions are choices a founder makes; pillars are where the resulting requirements live. A founder's dimension choices determine *which* Capabilities/Assets/Deliverables activate (see §10–11); pillars determine *where* those activated items are organized for reporting and gap analysis.

| Dimension | Example values |
|---|---|
| **Role / Expertise** | Coach, Consultant, Speaker, Thought Leader |
| **Business Format** | Boutique, Agency, Practice |
| **Revenue Model** | High-Ticket, Membership, Retainer |
| **Client Acquisition** | Speaking, Podcast, Publicity, Referrals |
| **Delivery Model** | Founder-Led, Team-Led, Facilitator-Led, Hybrid |
| **Growth Model** | Founder-led, Team, Licensing, Productization |

**This is not a new field set.** These dimensions are exactly what `BusinessModelProfile` (`lib/business-model-classification/types.ts`) already models via `primaryArchetype` / `secondaryArchetypes` (Role/Expertise) and its four characteristic arrays — `customerModel`, `revenueModel`, `deliveryModel`, `acquisitionModel`. `isCapabilityApplicable()` (`lib/business-blueprint/activation-rules.ts`) already gates on both archetype and the `applicableCharacteristics` field this spec's Capability records (§5) should populate. This section documents the existing mechanism's vocabulary; it does not propose a new one.

---

## 5. Capability Taxonomy

A Capability describes something the business must be able to *do*.

```
Capability
├── id
├── name
├── primaryPillar: OperatingPillarId          (required — see §2)
├── secondaryPillars?: OperatingPillarId[]     (only when genuinely cross-pillar)
├── description
├── businessModels: BusinessModelId[] | "all"
├── applicableCharacteristics?                 (Business Model Dimensions gate — see §4)
├── businessStages: BusinessStage[]
├── prerequisites?: CapabilityId[]
├── requiredBusinessAssets?: BusinessAssetId[]
├── relatedDeliverables: string[]
├── applicableMechanisms?: MechanismId[]        (§9 — types-only until the Mechanism Library exists)
├── evidenceOfInstallation                      (§12 — how the Inventory recognizes this is installed)
└── source / provenance?                        (§13 — required when derived from a specific guru model)
```

**Rule:** a capability gets exactly one primary pillar. If content authoring genuinely cannot decide between two pillars, that is a signal to either split the capability or add a secondary pillar — never to duplicate the capability under two ids to force a single-pillar fit.

**Known-gap report (not a code change):** scanning the 25 `ReadinessCapability` entries already live in `lib/excellence-intelligence/excellence-intelligence-registry.ts`, none carry a pillar field today — confirmed by grep; `pillarId`/`esaPillar`/`OPERATING_PILLAR` return zero matches in that file. Reading each entry's id/prose against the table in §2:

| Fit | Capabilities |
|---|---|
| Obvious — Revenue Engine™ | `start-customer-clarity`, `start-offer-clarity`, `start-pricing-clarity` |
| Obvious — Operations & Systems™ | `start-foundational-operating-rhythm`, `growth-sop-before-hiring`, `growth-ai-workflow-adoption`, `pattern-operating-rhythm`, `principle-systems-before-complexity` |
| Obvious — Financial Intelligence™ | `growth-financial-visibility`, `principle-financial-discipline` |
| Obvious — People & Leadership™ | `growth-delegation-capacity`, `scale-leadership-depth`, `scale-org-design`, `research-cognitive-load-and-delegation` |
| Obvious — Human Sustainability™ | `methodology-human-sustainability`, `future-workplace-human-sustainability-standard` |
| Obvious — Strategic Foundation™ | `pattern-protected-strategic-time`, `scale-exit-readiness-foundations` |
| **Ambiguous — needs real content judgment, not resolved here** | `scale-executive-rhythm` (Operations & Systems™ vs. People & Leadership™); `future-workplace-ai-human-collaboration` (Operations & Systems™ vs. Growth & Innovation™); `evidence-based-research`, `enduring-business-principles`, `executive-practice-patterns`, `harmony-lane-methodology` (meta/cross-cutting — may not want a single pillar at all); `start-readiness`, `growth-readiness`, `scale-readiness`, `future-workplace-readiness` (composite stage-gates, not single-pillar capabilities by nature) |

This table is an observation for future content authoring, not an assignment. **No pillar field is added to any `ReadinessCapability` entry in this pass.**

---

## 6. Business Asset Taxonomy

A Business Asset™ is the durable thing a capability produces — something that compounds over time rather than being consumed once.

```
Business Asset
├── id
├── name
├── primaryPillars: OperatingPillarId[]     (already live — see BUSINESS_ASSET_REGISTRY)
├── purpose
├── whyItCompounds
├── requiredCapability: CapabilityId
├── relatedDeliverables: string[]
├── stage: BusinessStage
└── source / provenance?
```

`BusinessAsset` (`lib/executive-decision-engine/asset-registry.ts`) already implements this shape in production, with `primaryPillars: OperatingPillarId[]` populated on every entry — this is the reference implementation Capability and Deliverable records should follow, not a new design.

---

## 7. Deliverable Architecture

A Deliverable is the tangible artifact a founder actually receives.

```
Deliverable
├── id
├── name
├── format / renderers                (existing: supportedRenderers, recommendedRenderer)
├── purpose / description
├── relatedCapability: CapabilityId
├── relatedBusinessAsset?: BusinessAssetId
├── distribution: DistributionMethod[]
└── source / provenance?
```

**Rule:** a Deliverable's Operating Pillar is never stored on the Deliverable itself. It is resolved by following the Deliverable's relationship to its owning Capability or Business Asset, both of which already carry a pillar (§5, §6). This avoids a third place where pillar data could drift out of sync with the other two.

---

## 8. Deliverable Taxonomy Boundary (known gap — not fixed here)

`Deliverable.category` (`lib/output-architecture/deliverable-registry.ts`, `DeliverableCategory`) is a **pre-existing, separate 8-value taxonomy** — `Strategy`, `Marketing & Brand`, `Sales`, `Operations`, `Finance`, `People & Culture`, `Legal`, `Compliance` — already populated on every `Deliverable` in production. It does not map 1:1 onto the 8 Operating Pillars: there is no Client Excellence™, Growth & Innovation™, or Human Sustainability™ equivalent, and `Legal`/`Compliance` have no Operating Pillar equivalent at all.

**Ruling for this spec:**

- **Operating Pillars™ are canonical** for all new Business Blueprint™ architecture (Capabilities, Assets, and the pillar a Deliverable inherits per §7).
- **`Deliverable.category` is preserved exactly as-is** as a legacy/output classification taxonomy. It is not migrated, deprecated, or touched in this pass or as a direct consequence of this spec.
- **The two are not equivalent and must not be conflated.** A Deliverable may legitimately have both a primary Operating Pillar (inherited via §7) and a legacy `category` (e.g. primary pillar Revenue Engine™, legacy category `Sales`) — these answer different questions and neither should be inferred from the other.
- **No forced mapping is created now.** A future reconciliation/crosswalk between `DeliverableCategory` and `OperatingPillarId` may be undertaken later, but it requires dedicated content and architectural review and is explicitly out of scope here.

This is the fourth taxonomy-related gap surfaced across this and prior passes (alongside the Business Blueprint requirements engine, the dependency graph, and the Mechanism Library, all addressed elsewhere). It is **not blocking** — the goal of this spec is to ensure the *new* architecture doesn't deepen the inconsistency, not to resolve every existing one before the Blueprint can be built.

---

## 9. Best-Practice Mechanisms

A Mechanism is the proven, attributable *way* a Capability or Asset gets built.

```
Mechanism
├── id
├── name
├── pillar                    (inherited from its Capability — never set independently)
├── capability: CapabilityId
├── problemItSolves
├── whenToUse
├── howItWorks
├── requiredAssets?: BusinessAssetId[]
├── requiredDeliverables?: string[]
├── stage: BusinessStage
├── expectedOutcome
└── source / provenance        (required — see §13)
```

This is a **types-only contract** in this pass — matching the placeholder `BestPracticeMechanism` shape already sketched in `lib/business-blueprint/types.ts`. Zero Mechanism records exist yet; the Mechanism Library is future content-authoring work, gated on this spec.

---

## 10. Stage / Timing Rules

Every activated requirement resolves to one of three timings, matching the existing `deriveRequirementTiming()` (`lib/business-blueprint/activation-rules.ts`):

- **`current`** — applicable now, given the founder's business model and stage.
- **`future`** — applicable to the founder's chosen model, but not yet at their current stage.
- **`not-applicable`** — does not apply to this founder's business model at all, regardless of stage.

Content authors classify each requirement by one of five requirement classes, which map onto that timing:

| Class | Meaning | Typical timing |
|---|---|---|
| **Universal** | Needed by essentially every business at the applicable stage. | `current` once the stage is reached. |
| **Conditional** | Activated by a specific Business Model Dimension choice (§4). | `current`/`future` depending on stage; `not-applicable` if the dimension isn't chosen. |
| **Destination-specific** | Activated by the founder's chosen Business Destination. | Same as Conditional. |
| **Stage-dependent** | Needed later, regardless of model. | `future` until the stage is reached. |
| **Optional** | Useful but never required. | Surfaced separately; never blocks a gap calculation. |

This classification is a content-authoring aid — it does not require new engine code. It informs how a content author sets `businessStages` and `applicableCharacteristics` on a Capability record (§5), which the existing engine already reads.

---

## 11. Dependency & Composition Rules

When a founder's Business Model Dimensions activate requirements from multiple archetypes simultaneously (e.g. Thought Leader + Speaker + Coach), those requirement sets are combined using the existing `composeRequirementSets()` (`lib/business-blueprint/compose-requirements.ts`):

- **Union with dedup** — a capability required by multiple archetypes appears once in the composed result, never duplicated.
- **Conflict flagging, never silent resolution** — if two archetypes require the same capability under genuinely divergent configuration scopes, the conflict is surfaced in `configurationConflicts` and the capability remains in the union. The engine does not pick a winner; that decision is left to the founder or a future resolution UI.
- **Prerequisites** — a Capability's `prerequisites` field (§5) declares ordering dependencies. The Content Library should keep prerequisite chains shallow and explicit rather than relying on the reader to infer sequencing from prose.

This section documents already-built engine behavior; no engine changes are proposed here.

---

## 12. Evidence & Installation Rules

Whether a founder already has a given Capability/Asset installed is answered by an evidence hierarchy, most to least authoritative — matching the already-built `BusinessAssetEvidenceSource` (`lib/business-asset-inventory/types.ts`):

1. **`founder-confirmed`** — the founder directly confirmed it. Always takes precedence and is never silently overridden by a weaker signal arriving later.
2. **`deliverable-completed`** — a related Deliverable (§7) was marked complete.
3. **`build-record`** — a Harmony Lane Build Record™ for a related Capability reached `"installed"`.
4. **`esa-signal`** — the legacy ESA-pillar-score proxy. Weakest evidence; kept only for backward compatibility with `deriveReadinessRelevance()`'s `"already-installed"` status. Never sufficient on its own to mark an asset installed going forward.

Content authors populate a Capability's `evidenceOfInstallation` field (§5) by naming which of these sources is expected to apply — they do not invent a fifth source or bypass this hierarchy.

---

## 13. Source / Provenance Rules

Every Capability, Asset, Deliverable, and Mechanism record derived from a specific mentor/guru model must carry:

```
Source / Provenance
├── model            (the mentor/framework, e.g. "Guru X's client acquisition system")
├── sourceAsset      (the book/course/interview it was extracted from)
├── principleExtracted   (what the source actually teaches, in its own terms)
└── harmonyLaneInterpretation  (how Harmony Lane operationalizes that principle)
```

**Rule:** `principleExtracted` and `harmonyLaneInterpretation` are always kept separate fields, never merged into one description. This is the boundary that prevents Harmony Lane's interpretation of a model from being misattributed as something the original source actually claimed — essential if these are to be represented as proven/tested practices. Records with no specific source (i.e. original Harmony Lane content) omit this block entirely; it is not required to be populated with a placeholder.

---

## 14. Content Authoring Standards

- Use the exact, trademarked pillar names (`Operating Pillars™`, `Strategic Foundation™`, etc.) consistently with how `OPERATING_PILLARS` already renders them.
- Never invent a pillar or Business Model Dimension assignment to fill an empty field — flag the record as ambiguous (per §5's known-gap table) instead, and leave the decision to a dedicated content-review pass.
- A Capability's primary pillar is a single value; resist the temptation to add secondary pillars merely because a description happens to touch multiple domains in passing.
- When authoring a new Capability, check §5's ambiguous list first — if the new capability resembles one of those, that is a signal the taxonomy itself may need a decision, not just this one record.
- Every new record should be reviewable independent of code — a content author should be able to add a row to a future Content Library table without needing to read the Engine source.

---

## 15. Reference Example

Founder configuration: **Thought Leader + Speaker + Coach**, **Boutique + High-Ticket**, acquisition via **Speaking + Podcast + Publicity**, founder-led delivery today with planned **Facilitator-led** expansion later.

| Operating Pillar™ | Capability | Business Asset™ | Deliverables (examples) | Timing |
|---|---|---|---|---|
| Strategic Foundation™ | Authority Positioning | Signature Point of View™ | Positioning statement, messaging architecture | `current` |
| Revenue Engine™ | High-Ticket Client Acquisition | Authority-Based Acquisition System | Application, qualification mechanism, sales assets | `current` |
| Client Excellence™ | Premium Client Delivery | Signature Client Experience | Onboarding, client journey, delivery materials | `current` |
| Operations & Systems™ | Repeatable Delivery | Delivery Operating System | SOPs, workflows, templates | `current` |
| Growth & Innovation™ | Thought Leadership Distribution | Authority Content Engine | Articles, podcast strategy, speaking assets | `current` |
| People & Leadership™ | Delegated Delivery | Facilitator Operating System | Facilitator training materials, delivery playbook | `future` (activates once Facilitator-led delivery is chosen as current, not merely planned) |

**Human Sustainability™ — deliberately split, not merged:**

```
Human Sustainability™
    │
    ├── Business-architecture capability requirements   (this Blueprint — e.g. sustainable
    │                                                      workload design, founder-dependency
    │                                                      reduction, operating boundaries)
    │
    └── WLB Audit                                         (a separate system — measures the
                                                            founder's LIVED work-life reality)
```

Human Sustainability™ is a legitimate Operating Pillar within the business architecture — it can require capabilities like sustainable operating practices and workload design, same as any other pillar. The WLB Audit remains a distinct, unmerged system: it measures the founder's lived reality, not the business's structural requirements. The pillar is shared as a taxonomy; the WLB Audit is not folded into the Blueprint as an input.

---

## Explicitly out of scope (this document)

- No `Deliverable.category` migration or crosswalk (§8) — flagged only.
- No pillar field written onto any real `ReadinessCapability` entry — §5's table is a report, not a code change.
- No ESA or WLB Audit redesign.
- No new TypeScript types or files beyond this document. The `BestPracticeMechanism` placeholder referenced in §9 already exists from a prior pass in `lib/business-blueprint/types.ts` and is unmodified.
- No Content Library entries — no new Capabilities, Assets, Deliverables, or Mechanisms.
