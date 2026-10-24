# Blueprint Data Lineage Audit + Consolidation Map

Status: **Discovery only. No architectural code changes made in this pass.**
The `lib/cherry-blossom/executive-brief.ts` GPS→Cherry Blossom wiring from the
prior pass is untouched and confirmed intact (`gpsRecommendation`,
`owningExecutiveId`→`executiveDomain`, `reason`, `nextTurn` are still wired at
lines 174/213/345+/434+ of that file).

---

## 1. Original Data Inventory (traced from actual code)

### 1.1 Founder Profile™ — `lib/founder-profile/`, `utils/founder-profile-storage.ts`

- **Storage**: localStorage cache (`hl:founder-profile:v1`, untyped
  `Record<string, unknown>`) + Supabase `founder_profiles` table (source of
  truth, one row per `user_id`).
- **Exact fields** (from `FounderProfileData` in
  `utils/founder-profile-storage.ts`): `profilePhoto`, `fullName`,
  `preferredName`, `professionalTitle`, `customTitle`, `birthdate`, `city`,
  `stateProvince`, `country`, `maritalStatus`, `partnerName`, `anniversary`,
  `children[]` (`name`, `birthday`), `parentNames`, `numberOfSiblings`,
  `siblingNames`, `grandchildren`, `hasPets`, `pets[]` (`name`, `type`),
  `hobbies`, `favoriteRelax`, `bestFriend`, `mentor`,
  `accountabilityPartner`.
- **Writer**: `components/founder-profile/founder-profile-form.tsx` /
  `components/installation/step-founder-profile.tsx` (onboarding gate — no
  production skip path).
- **Reader**: `HarmonyProvider` (`components/harmony-context/harmony-context-provider.tsx`)
  hydrates it onto `HarmonyContextValue.founderProfile` as an untyped
  `Record<string, unknown>` and reconciles it against the DB.
- **Consumers**: exposed on `HarmonyContextValue.founderProfile` directly.
  **Not** part of `HarmonyContextSnapshot`; **not** read by GPS
  (`GpsContext`), ESA, Business Context, Business Reality/Destination, or
  the Business Operating Fingerprint. It is purely identity/personal-life
  metadata for Cherry Blossom-level personalization (name, family, personal
  support network) — never a business-builder signal today.

### 1.2 Business Context™ — `lib/business-context/`, `utils/business-context-storage.ts`

- **Storage**: localStorage (`hl:business-context:v1`) + Supabase
  `business_context_profiles` (source of truth).
- **Exact fields** (`BusinessContextProfile` via `toColumns`/`mapRow`):
  `businessName`, `businessStage`, `businessModel[]`, `industry`,
  `founderRole`, `teamSize`, `revenueStage`, `biggestGoals[]`,
  `biggestChallenges[]`, `biggestGoalText`, `biggestChallengeText`,
  `successVision`, `operatingEnvironment`, `supportNetwork`,
  `biggestOpportunities`, `longTermVision` (`oneYear`/`threeYear`/`fiveYear`/
  `tenYear`/`description`), `capitalStrategy[]`, `growthVision`,
  `exitVision`, `businessCredit`, `businessBanking`, `financialFoundation[]`,
  `wealthBuildingInterests[]`, `communicationLevel`, `learningInterests[]`.
- **Consumers**: exposed on `HarmonyContextValue.businessContext`; feeds
  `assembleHarmonySnapshot()` → `businessModelProfile` (via
  `classifyBusinessModel()`) and `businessOperatingFingerprint` (via
  `deriveBusinessOperatingFingerprint()`); `biggestChallenges`/
  `biggestOpportunities` feed `deriveReadinessRelevance()`
  (`lib/founder-intelligence/readiness-relevance.ts`) as corroborating
  evidence for capability priority.
- **This IS, in substance, current-state business reality** — confirmed:
  `deriveBusinessRealitySummary()` in `lib/founder-gps/build-my-business.ts`
  is already a pure read of `businessStage`/`teamSize`/`revenueStage`/
  `primaryArchetype`/`founderDependency` sourced from the Fingerprint, which
  is itself sourced from Business Context + Business Stage + Business Model
  Profile. **Business Reality™ already exists as a computed view over
  Business Context — it is not a new questionnaire.**

### 1.3 Founder Destination™ — `lib/founder-destination/`, `utils/founder-destination-storage.ts`

- **Storage**: localStorage (`hl:founder-destination:v1`) + Supabase
  `founder_destinations` (source of truth). Explicitly documented as
  "distinct from Business Context™ (current state) and Founder Profile™
  (who the founder is today)."
- **Exact fields** (`FounderDestinationProfile`): `desiredBusinessSize`,
  `desiredTeamSize`, `desiredGeographicReach`, `desiredMarketPosition`,
  `revenueAmbition`, `desiredFounderRole`, `remainResponsibleFor[]`,
  `notResponsibleFor[]`, `desiredWorkingHoursPerWeek`,
  `desiredFounderInvolvement`, `desiredZoneOfGenius`,
  `desiredFounderIndependence`, `desiredWorkLifeBalanceModel`,
  `desiredTimeFreedomLevel`, `desiredLifestyle`,
  `nonNegotiableLifeBoundaries[]`, `businessLifePurpose`,
  `desiredWorkplaceType`, `desiredEmployeeExperience`, `desiredWorkDesign`,
  `desiredAiHumanRelationship`, `desiredLeadershipCulture`,
  `desiredHumanSustainabilityStandard`.
- **Consumers**: exposed on `HarmonyContextValue.founderDestination`; feeds
  `HarmonyContextSnapshot.destination` (four groupings — see 2.1 below);
  feeds `hasBusinessAmbitionSignal()` / `hasFutureWorkplaceSignal()`
  (`lib/excellence-intelligence/readiness.ts`) which drive
  `deriveRequiredCapabilities()`; feeds the Business Operating Fingerprint's
  DESTINATION + FUTURE WORKPLACE sections; feeds
  `deriveReadinessRelevance()` for `suggestedOwner` (via
  `remainResponsibleFor`/`notResponsibleFor`) and `destinationPhraseFor`.
- **This IS, in substance, Business Destination™** — confirmed:
  `deriveBusinessDestinationSummary()` in `lib/founder-gps/build-my-business.ts`
  already reads `desiredFounderRole`, `revenueAmbition`, `desiredTeamSize`,
  `desiredWorkplaceType` straight off the Fingerprint's DESTINATION/FUTURE
  WORKPLACE fields. **Business Destination™ already exists as a computed
  view over Founder Destination — it is not a new questionnaire.**

### 1.4 Entrepreneur Success Assessment (ESA)™ — `lib/entrepreneur-success/`

- **Registry** (`esa-registry.ts`, "DATA-ONLY", 889 lines): 8 permanent
  **Operating Pillars™** (`strategic-foundation`, `revenue-engine`,
  `operations-systems`, `financial-intelligence`, `people-leadership`,
  `client-excellence`, `growth-innovation`, `human-sustainability`), each
  with `owningExecutives`, `primaryStages`; many **Operating Practices™**
  (one practice = one question, e.g. `offer-clarity`, `sales-process`,
  `delegation-practice`), each cross-referencing `relatedExecutives`,
  `relatedDeliverables`, `gpsAlignment` (one of the 3 GPS Outcomes); a fixed
  set of **3 GPS Outcomes™** (`honor-non-negotiables`,
  `build-compounding-assets`, `reduce-execution-friction`) that the whole
  registry is organized around; `AssessmentQuestion`,
  `BusinessModel`/`BusinessPerformanceMetric` (architecture-only, not yet
  scored).
- **Results shape** (`EsaResults`, `types.ts`): `overallScore` (0–100),
  `pillarScores[]`, `practiceScores[]`, `responses` (questionId→0/25/50/75/100),
  `completedAt`.
- **Storage**: localStorage (`entrepreneurSuccessAssessmentResults` +
  weekly `entrepreneurSuccessAssessmentHistory`), not yet Supabase-backed.
- **Consumers — extensive**: `HarmonyContextSnapshot.business.esaResults` /
  `.entrepreneurSuccessScore` / `.hasCompletedEsa`; `intelligence.weakestPillar`
  / `.strongestPillar`; `GpsContext.entrepreneurSuccessScore` /
  `.weakestEsaPillar` / `.strongestEsaPillar`; `deriveReadinessRelevance()`
  reads `pillarScores` twice — once via `pillarScoreFor()` (executive→pillar
  crosswalk, corroborates/marks-installed a capability) and once via the
  `human-sustainability` pillar specifically for `capacityConstrained`
  (**the legitimate, business-diagnostic capacity signal — confirmed
  distinct from the Work-Life Balance Audit's own score**, matching
  `v0_plans/practical-guide.md`'s already-executed separation).
- **Role today**: confirmed **both** an assessment (self-report UI,
  `entrepreneur-success-assessment.tsx`) **and** a readiness/intelligence
  layer (its pillar scores are read as corroborating evidence by
  `deriveReadinessRelevance()`, and its Human Sustainability™ pillar gates
  `capacityConstrained`). It is not a duplicate of Gap & Readiness — Gap &
  Readiness (§2.3 `deriveReadinessRelevance`) is *stage/destination-driven*
  capability selection that ESA only *corroborates*; ESA does not itself
  select which capabilities are relevant.

### 1.5 Work-Life Balance Audit™ — `utils/audit-storage.ts`

- **Storage**: localStorage only (`workLifeBalanceAuditResults`), no DB
  persistence layer found.
- **Exact fields** (`AuditData`): `overallScore`, `results[]`
  (`category`, `percentage`, `label`), `timestamp`, `assessmentType?`.
- **Confirmed separation already executed** (per
  `v0_plans/practical-guide.md`, verified live in code this pass — no
  `workLifeBalanceScore` reference remains in `lib/founder-gps/types.ts`):
  `workLifeBalanceScore` and `hasCompletedAudit` still live on
  `HarmonyContextSnapshot.business` (legitimate storage passthrough) but are
  **absent** from `GpsContext`, `GPS_SIGNAL_WEIGHTS`, `deriveUrgentOutcomes()`,
  `deriveTopPrioritySignal()`, and `readiness-relevance.ts`'s
  `capacityConstrained` (which now reads only the ESA's Human
  Sustainability™ pillar). **Confirmed: the WLB Audit is NOT a Business
  Builder input today.** Do not reopen this.
- **Feeds**: Reality Check™ (`app/reality-check/page.tsx`), Sunday
  Design Day intention flows, its own results/community/schedule UI. It
  remains the life-side rhythm: WLB Audit → Reality Check → Decide & Design
  → WLBB Day — untouched by this audit.

---

## 2. New Architecture Inventory (what actually exists vs. conceptual)

| Concept | Status | Where |
|---|---|---|
| **Business Destination™** | **Already implemented** as a pure computed summary, not a new data model | `deriveBusinessDestinationSummary()` in `lib/founder-gps/build-my-business.ts`, reading the Fingerprint's DESTINATION/FUTURE WORKPLACE fields (sourced from Founder Destination™) |
| **Business Reality™** | **Already implemented** the same way | `deriveBusinessRealitySummary()`, same file, reading the Fingerprint's BUSINESS/OPERATING MODEL fields (sourced from Business Context™ + Business Stage™ + Business Model Profile™) |
| **Business Operating Fingerprint™** | **Fully implemented** (Phase 9A) | `lib/business-operating-fingerprint/{types,derive}.ts` — a derived, read-only snapshot over Business Context + Business Stage + Founder Destination + Business Model Profile. Every field is `T | "unknown"`. This is the actual mechanical backbone Business Reality™/Destination™ are read from. |
| **Business Model Profile™** | **Fully implemented** (Phase 9B) | `lib/business-model-classification/{types,classify}.ts` — classifies `primaryArchetype`/`secondaryArchetypes`/customer/revenue/delivery/acquisition/scale model + `founderDependency`, from Business Context signals. Assembled once inside `assembleHarmonySnapshot()`. |
| **Business Blueprint™** | **Partially implemented, under a different name** | `lib/build-strategy/{types,blueprint-engine}.ts`'s `BuildBlueprint` — but this is a **per-recommendation execution plan** ("how do I build THIS ONE move"), not the founder-level "what must exist for this business model to work" blueprint described in the new spec. It is downstream of GPS, not upstream/parallel to it. |
| **Gap & Readiness™** | **Fully implemented**, just not under that name | `deriveReadinessRelevance()` (`lib/founder-intelligence/readiness-relevance.ts`) — produces exactly "required vs. installed vs. partial vs. future vs. blocked" via `relevanceStatus` (`priority`/`relevant`/`emerging`/`already-installed`/`not-yet-relevant`/`future`) plus `prerequisiteSatisfied`/`unmetPrerequisites`. This is the real Gap & Readiness layer. |
| **Dependencies™ / Dependency Map** | **Implemented at the capability level only** | `ReadinessCapability.prerequisiteCapabilityIds` / `.enablesCapabilityIds` (`lib/excellence-intelligence/excellence-intelligence-registry.ts`), surfaced by `deriveReadinessRelevance()` as `unmetPrerequisites`/`unlocks`, and carried onto `GpsRecommendation.prerequisites`/`.unlocksCapabilities`. There is **no separate cross-capability dependency-graph module** — it's a flat prerequisite list per capability, not a graph structure with topological sequencing across the whole registry. |
| **Business Asset Registry™** | **Fully implemented**, two overlapping registries | (1) `BUSINESS_ASSET_REGISTRY` / `PRACTICE_ASSET_MAPPINGS` in `lib/executive-decision-engine/asset-registry.ts` (assets by outcome/stage, mapped from ESA practices). (2) `READINESS_CAPABILITIES` itself already carries `relatedDeliverables` per capability. These two registries are not yet explicitly reconciled — see Redundancy Report §3. |
| **Best-Practice Mechanism Library™** | **NOT implemented** — explicitly a partial placeholder | `lib/daily-plan/business-building-methods.ts`'s own doc comment: *"a small, explicitly-labeled STARTER list, not the full 6-category Best-Practice Mechanism Library from the original spec... Metadata only — no matching or recommendation logic is built around this list."* This is genuine future work, exactly as the audit brief anticipated. |
| **Founder GPS™** | **Fully implemented** | `lib/founder-gps/next-best-move-engine.ts`'s `deriveNextBestMove()` → one `GpsRecommendation`. Confirmed (prior pass) as the sole live CEO Workday recommendation surface via `FounderGpsWorkspace`. |
| **Build My Business™** | **Fully implemented** | `lib/founder-gps/build-my-business.ts` — pure presentation-layer derivations (`deriveBusinessDestinationSummary`, `deriveBusinessRealitySummary`, `deriveBusinessGapMap`, `deriveRelevantExecutives`), all explicitly documented as introducing **no new recommendation engine, no new scoring, no new data source** — every one is a read of GPS/EDE/Fingerprint output already computed elsewhere. |
| **4-Hour CEO Workday™** | **Fully implemented** | `TodaysCeoWorkdayCard` → `FounderGpsWorkspace`; `Decide & Design` populates `ceoActivities[]` (title/minutes/definitionOfDone/buildPathId) via `decide-design-additions.tsx`, capped at `CEO_WORKDAY_CAP_MINUTES`. |
| **Executive Decision Engine (EDE)** | **Fully implemented**, and is the real "why" behind GPS | `lib/executive-decision-engine/` — constitution, priority framework, reasoning rules, leverage framework, asset registry, assignment framework, explainability, `evaluateCandidate()`/`rankCandidates()`. This is the reasoning substrate `deriveNextBestMove()` calls into. Per the prior pass, this is confirmed a **separate, legitimate product layer** also powering Executive Office/Command Center/Cherry Blossom's morning brief/Knowledge Library/Human Zone of Genius — not to be collapsed into GPS. |

---

## 3. Redundancy Report

1. **Two asset registries not reconciled.** `BUSINESS_ASSET_REGISTRY`
   (`executive-decision-engine/asset-registry.ts`) and
   `ReadinessCapability.relatedDeliverables`
   (`excellence-intelligence-registry.ts`) both describe "the tangible thing
   this work produces," from two different registries built in different
   phases. Not yet duplicated in effect (different consumers today), but a
   likely collision point once the Business Blueprint work begins.
2. **`BuildBlueprint` name collision with "Business Blueprint™."** The spec's
   new "Business Blueprint™" (what must exist for the whole business) and
   the already-shipped `BuildBlueprint` type (`lib/build-strategy/types.ts`,
   a single-recommendation execution plan) will be genuinely confusing under
   near-identical names once the founder-level Blueprint is built. They are
   NOT the same thing and must not be merged or renamed into each other
   without a deliberate decision (see §6).
3. **No redundancy found between ESA and Gap & Readiness.** Confirmed these
   do NOT calculate the same thing: `deriveRequiredCapabilities()` decides
   *which capabilities are candidates* from Business Stage™ + Founder
   Destination™ only; ESA pillar scores only *corroborate or mark installed*
   candidates already selected that way. Removing ESA would degrade
   confidence, not eliminate a duplicate calculation.
4. **No redundancy found between Business Context/Founder Destination and
   the new Business Reality™/Destination™ concepts** — confirmed these are
   the same data, already read through a single derived Fingerprint, not two
   parallel questionnaires. Nothing to retire; this is a naming/framing
   question only (see §6).
5. **Executive Office vs. Founder GPS** — already resolved and preserved per
   the prior pass; not reopened here.
6. **WLB Audit vs. Business Builder** — already resolved and preserved per
   `practical-guide.md`; verified still correct in code this pass.
7. **Decide & Design vs. GPS/Blueprint/Assignment selection** — checked
   directly against `decide-design-additions.tsx`: it is plain
   record-keeping (movement, lunch, CEO activity title/minutes/DoD/build
   path picked from the existing `BUILD_PATH_DEFINITIONS`, time freedom,
   power down). It does **not** duplicate Business Strategy, Gap Analysis,
   Blueprint, or GPS — it consumes the Build Path™ choice, it doesn't decide
   it. No redundancy found; this file already matches the target contract
   in Part 7 of the request.

---

## 4. KEEP / REUSE / MOVE / MERGE / DERIVE / CONDITIONALIZE / RETIRE Map

| Existing Data | Source | Disposition | New Home / Notes |
|---|---|---|---|
| `businessName`, `industry`, `businessModel[]`, `founderRole`, `teamSize`, `revenueStage` | Business Context™ | **REUSE** | Already surfaced as Business Reality™ via the Fingerprint. No new field needed. |
| `biggestGoals`/`biggestChallenges`/`biggestOpportunities`/`longTermVision` | Business Context™ | **KEEP** | Feeds Gap & Readiness corroboration (`conceptOverlap`) directly; not yet on the Fingerprint — candidate to add to Business Reality™'s surfaced summary if the founder-facing Reality view needs it. |
| `capitalStrategy`/`growthVision`/`exitVision`/`businessCredit`/`businessBanking`/`financialFoundation`/`wealthBuildingInterests`/`communicationLevel`/`learningInterests` | Business Context™ | **PRESERVE AS HISTORICAL / CONDITIONALIZE** | Not read by any Business Builder engine found in this audit. Likely candidates to become **CONDITIONALIZE** (only ask if Business Destination selects a model where they're relevant, e.g. `capitalStrategy` only if `desiredBusinessSize`/`revenueAmbition` implies outside capital) rather than asked unconditionally at onboarding. |
| `desiredBusinessSize`/`revenueAmbition`/`desiredMarketPosition`/`desiredTeamSize` | Founder Destination™ | **REUSE** | Already surfaced as Business Destination™ via the Fingerprint. |
| `desiredFounderRole`/`desiredFounderIndependence`/`desiredWorkingHoursPerWeek`/`desiredFounderInvolvement`/`desiredZoneOfGenius` | Founder Destination™ | **REUSE** | Feeds `founderRoleDestination` in `HarmonyContextSnapshot.destination` and `suggestedOwnerFor()` in Gap & Readiness. |
| `nonNegotiableLifeBoundaries`/`desiredWorkLifeBalanceModel`/`desiredTimeFreedomLevel`/`businessLifePurpose` | Founder Destination™ | **KEEP SEPARATE** | These are the founder's *life* destination, legitimately GPS-relevant via "Honor Life's Non-Negotiables™" (per `practical-guide.md`), and explicitly distinct from the WLB Audit. Do not move into WLB Audit or Business Reality. |
| `desiredWorkplaceType`/`desiredEmployeeExperience`/`desiredWorkDesign`/`desiredAiHumanRelationship`/`desiredLeadershipCulture`/`desiredHumanSustainabilityStandard` | Founder Destination™ | **REUSE** | Already surfaced as Future Workplace Destination™; feeds Readiness's `hasFutureWorkplaceSignal()`. |
| ESA `overallScore`/`entrepreneurSuccessScore` | ESA | **KEEP** | Corroborating evidence signal for Gap & Readiness; also its own standalone assessment/score UI. Do not fold into a single "readiness score" per the audit brief's explicit prohibition. |
| ESA `pillarScores[human-sustainability]` | ESA | **KEEP** | Sole legitimate `capacityConstrained` input (already correctly scoped per prior pass — do not touch). |
| ESA `weakestPillar`/`strongestPillar` | ESA (via `HarmonyContextSnapshot.intelligence`) | **KEEP** | Architecture hook for GPS's "primary candidate for its next recommendation" — legitimate, not yet wired into `deriveNextBestMove()`'s actual signal list per this audit's file reads; worth confirming in a future pass whether it should be. |
| WLB Audit `overallScore`/`results[]`/`hasCompletedAudit` | WLB Audit | **KEEP SEPARATE** | Confirmed correctly isolated from the Business Builder. Continues to feed Reality Check → Decide & Design → WLBB Day only. |
| Founder Profile (identity/family fields) | Founder Profile™ | **KEEP** | Not a Business Builder input; purely Cherry Blossom personalization. No disposition change needed — it was never merged with Business Reality/Destination in the first place. |
| `ReadinessCapability.prerequisiteCapabilityIds`/`.enablesCapabilityIds` | Excellence Intelligence Registry | **REUSE, then EXTEND** | This *is* today's Dependency Map at the capability level. Extending it into the "cross-capability Dependency Graph" the user wants (topological sequencing across the whole registry, not just per-capability prereq lists) is genuine new work — not a duplicate. |
| `BUSINESS_ASSET_REGISTRY` (EDE) vs. `relatedDeliverables` (Readiness Capabilities) | EDE / Excellence Intelligence | **MERGE (future work)** | Both describe the tangible output of doing the work. Should be reconciled into one canonical Asset Registry before the Business Blueprint work begins, per Redundancy Report §3.2. |
| `STARTER_BUSINESS_BUILDING_METHODS` | `lib/daily-plan/business-building-methods.ts` | **REUSE as seed, then EXTEND** | Already explicitly labeled a starter; the real 6-category Best-Practice Mechanism Library is new work, not a rename. |
| `BuildBlueprint` (per-recommendation plan) | `lib/build-strategy/types.ts` | **KEEP, RENAME RISK FLAGGED** | Do not rename this to "Business Blueprint™" — it answers a different, narrower question ("how do I build this one move") than the founder-level Business Blueprint the user described ("what must exist for this business to work"). Recommend the new founder-level concept be named distinctly (e.g. **Business Requirements Blueprint™**) to avoid the collision. |
| `decide-design-additions.tsx` fields (`movement`, `lunch`, `ceoActivities`, `timeFreedom`, `powerDown`) | Decide & Design | **KEEP** | Confirmed already correctly scoped — plain record-keeping, no duplicate strategy/GPS logic. No changes needed. |

---

## 5. Canonical Architecture (validated against actual code)

```text
BUSINESS BUILDER (validated, mostly already implemented)

  Business Context™ ─┐
  Founder Destination™ ─┼─► Business Model Profile™ (classify.ts)
  Business Stage™ ─────┘         │
                                  ▼
                    Business Operating Fingerprint™ (derive.ts)
                         │                    │
                         ▼                    ▼
              Business Reality™ view   Business Destination™ view
              (deriveBusinessRealitySummary)  (deriveBusinessDestinationSummary)
                         │                    │
                         └────────┬───────────┘
                                  ▼
                    deriveRequiredCapabilities()          [Business Stage + Destination signal]
                                  │
                                  ▼
                    deriveReadinessRelevance()             ← ESA pillar scores corroborate
                    (= Gap & Readiness™)                     (never the WLB Audit)
                                  │
                    ┌─────────────┴──────────────┐
                    ▼                             ▼
        prerequisiteCapabilityIds/          Business Asset Registry™
        enablesCapabilityIds                (EDE asset-registry.ts +
        (= today's Dependency Map,           relatedDeliverables —
         capability-level only)               needs reconciliation)
                    │
                    ▼
        Executive Decision Engine™ (evaluateCandidate/rankCandidates)
                    │
                    ▼
        deriveNextBestMove()  →  GpsRecommendation  (Founder GPS™)
                    │
                    ▼
        Build Strategy™ → BuildBlueprint (per-move execution plan)
                    │
                    ▼
        Build My Business™ (deriveBusinessGapMap, deriveRelevantExecutives)
                    │
                    ▼
        Decide & Design → ceoActivities[] (Build Path chosen here)
                    │
                    ▼
        4-Hour CEO Workday™ (TodaysCeoWorkdayCard → FounderGpsWorkspace)
```

```text
LIFE / WORK-LIFE BALANCE OPERATING SYSTEM (validated, unchanged, kept separate)

  Founder Profile™ (identity/family — Cherry Blossom personalization only)

  Work-Life Balance Audit™
        │
        ▼
  Weekly Reality Check™
        │
        ▼
  Decide & Design (movement/lunch/time-freedom/power-down record-keeping)
        │
        ▼
  WLBB Day
```

**Not yet built** (genuine future work, confirmed by absence in the codebase):
1. A founder-level **Business Requirements Blueprint™** ("what must exist for
   THIS business model to work") — distinct from the existing per-move
   `BuildBlueprint`.
2. A true **cross-capability Dependency Graph** (today: flat per-capability
   prerequisite lists only).
3. The full 6-category **Best-Practice Mechanism Library™** (today: a
   12-item starter list with no matching logic).
4. Reconciliation of the two overlapping asset registries.

---

## 6. Onboarding Flow (validated)

**First onboarding** (matches the code's actual gating — Founder Profile has
"no production skip path"; Business Context and Founder Destination have
their own `hasCompleted*` gates):

```
Founder Profile™ (who are you — identity/family, gates entry)
   → Business Context™ (where is the business now)
   → Founder Destination™ (where do you want it to go)
   → [Business Model Profile™ + Business Operating Fingerprint™ auto-derived — no new questions]
   → ESA (readiness/capability signal — corroborates, does not gate)
   → deriveReadinessRelevance() computes the initial Gap & Readiness view
   → Founder GPS™ produces the first Next Best Move
```

**Every Monday** (Sunday Design Day / installed week, per
`getInstalledWeek()` in the Harmony Context provider):
- Business Context™/Founder Destination™ are **not** re-asked — they are
  living records edited only when the founder chooses to, from "My
  Work-Life Harmony Blueprint™" (confirmed by both storage layers' doc
  comments: "ONE record per member... updated whenever the founder edits it").
- `deriveReadinessRelevance()` and `deriveNextBestMove()` recompute fresh
  against whatever changed (new ESA score, new build-record statuses via
  `capabilityBuildStatusById`, new Business Stage).
- **Separately**, the Work-Life Balance Reality Check refreshes the life
  side and feeds Decide & Design — confirmed already isolated from the
  above.

**During the 1–5PM CEO Workday**: `Decide & Design` populates
`ceoActivities[]` (already knows the GPS's chosen Build Path options);
`TodaysCeoWorkdayCard`/`FounderGpsWorkspace` execute against
`deriveNextBestMove()`'s live output.

---

## 7. Decide & Design Contract (as implemented today — confirmed correct)

**Receives**: `TodaysPlanRecord` from `lib/daily-plan/storage.ts`
(date-keyed local record) + `BUILD_PATH_DEFINITIONS` (read-only reference
list from Build Strategy™).

**Responsible for**: recording the founder's choices for Movement, Healthy
Hybrid Lunch™, CEO Workday activity titles/minutes/definition-of-done/build
path selection (capped at `CEO_WORKDAY_CAP_MINUTES`), Time Freedom
allocations (capped at `TIME_FREEDOM_CAP_MINUTES`), and Power Down
reflections.

**NOT responsible for** (confirmed by absence in the file): choosing *what*
business capability to build (that's GPS), computing gaps (that's Gap &
Readiness), deciding the Business Blueprint, or picking the Build Path's
*content* — it only lets the founder tag an already-chosen CEO activity with
an existing `BuildPathId`.

**No changes recommended.** This file already matches the target contract.

---

## 8. GPS Contract (as implemented today)

**Receives** (`NextBestMoveInput` in `lib/founder-gps/next-best-move-engine.ts`,
confirmed WLB-score-free per §1.5): Business Stage™, Founder Destination™,
Business Context™ challenge/opportunity signals, ESA results (corroboration
only), Business Model Profile™, Operating History™, active build-record
statuses, and the EDE's evaluated/ranked candidates.

**Outputs**: one `GpsRecommendation` — `nextTurn`, `reason`, `cta`,
`primaryOutcome`/`secondaryOutcomes` (of the 3 fixed GPS Outcomes),
`targetPillar`, `currentState`/`targetState`, `executiveDomain`, `owner`,
`leverageMode`, `prerequisites`/`unlocksCapabilities`, `confidence`,
`evidence`, `explainability`.

**Does not receive or output**: the WLB Audit score (confirmed removed),
Founder Profile identity fields (never wired), or a second "winner" —
Executive Office's own `buildExecutiveBrief()` remains a separate, parallel
consumer of the same underlying signals, not a competing GPS (per prior
pass).

---

## 9. Business Requirements Blueprint — What It Still Needs to Calculate

Given everything above already exists, the genuinely new work for the
future founder-level Blueprint is narrow:

1. **A business-model-to-requirements mapping**: given a classified
   `primaryArchetype` (Business Model Profile™) + selected Business
   Destination™ configuration (e.g. "Coach + High-Ticket + Speaking"), derive
   the *set* of Operating Practices™/Readiness Capabilities that combination
   requires — today, `deriveRequiredCapabilities()` only reasons from
   Business Stage™ + a binary ambition/future-workplace signal, not from a
   rich destination configuration. This is the real gap.
2. **A true dependency graph** across that required set (topological
   ordering), not just per-capability prerequisite lists.
3. **A reconciled Asset Registry** (merge EDE's `BUSINESS_ASSET_REGISTRY`
   with `relatedDeliverables`) so the Blueprint can name required outputs
   without ambiguity.
4. **The 6-category Best-Practice Mechanism Library™**, to let the Blueprint
   say not just *what* must exist but *how* it's typically built.

None of this requires touching Founder GPS™, the Executive Decision Engine™,
Decide & Design, the WLB Audit, or Executive Office — all four are already
correctly scoped per this audit and the prior pass.

---

## 10. No-Redundancy Rule — Canonical Ownership Going Forward

| Information type | Canonical owner |
|---|---|
| Current business state | Business Context™ → Business Operating Fingerprint™ → Business Reality™ view |
| Desired business state | Founder Destination™ → Business Operating Fingerprint™ → Business Destination™ view |
| Capability/readiness gaps | `deriveReadinessRelevance()` (Gap & Readiness™) |
| Capacity signal | ESA Human Sustainability™ pillar only, never the WLB Audit |
| Next action | Founder GPS™ (`deriveNextBestMove()`) exclusively |
| Executive-domain intelligence (outside CEO Workday) | Executive Office Engine — untouched, per prior pass |
| Per-move execution plan | `BuildBlueprint` (Build Strategy™) |
| Founder-level business requirements | **New**: proposed Business Requirements Blueprint™ (§9) — not yet built |
| Life/WLB state | Work-Life Balance Audit™ → Reality Check → Decide & Design → WLBB Day |
| Identity/personalization | Founder Profile™ |

---

## 11. Follow-up: Capability ↔ Asset ↔ Deliverable relationship audit

A dedicated follow-up pass traced the Capability → Asset → Deliverable
relationships referenced in §5's canonical architecture diagram in detail —
see `docs/capability-asset-deliverable-relationship-audit.md`. Headline
findings: the three registries (`READINESS_CAPABILITIES`,
`BUSINESS_ASSET_REGISTRY`, `DELIVERABLES`) are confirmed distinct and
non-duplicative; a typed `relatedBusinessAssetIds` link (Capability → Asset)
and `relatedDeliverableIds` link (Asset → Deliverable) were added as optional,
additive fields and populated only where a confirmed match exists; the
`"strategic-plan"` id, which exists independently in both the Asset and
Deliverable registries, was confirmed to be a benign naming coincidence (no
consumer conflated them) and resolved via the new link rather than a rename
or merge. That document also lists orphaned assets/deliverables and
capability→asset matches that still need a human business-design decision —
those remain open work for whenever the Business Requirements Blueprint™
(§9 above) is actually built.
