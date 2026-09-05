# Capability ↔ Asset ↔ Deliverable — Relationship Audit

Minimum-viable cross-reference pass over the three canonical registries. This is a
relationship audit, not the Business Blueprint™ — it documents what is connected
today and flags what still needs a human business-design decision.

## The three registries (confirmed distinct, not duplicates)

| Registry | File | Question it answers | Count |
|---|---|---|---|
| `READINESS_CAPABILITIES` | `lib/excellence-intelligence/excellence-intelligence-registry.ts` | What capability must be installed? | 25 |
| `BUSINESS_ASSET_REGISTRY` | `lib/executive-decision-engine/asset-registry.ts` | What durable, compounding asset are we building? | 20 |
| `DELIVERABLES` | `lib/output-architecture/deliverable-registry.ts` | What tangible output, in what format, gets produced/distributed? | 10 |

## A. Confirmed relationships

**Capability → Capability (dependency graph)** — already live, not new. `prerequisiteCapabilityIds` / `enablesCapabilityIds` (Phase 9C) populated on every seeded capability, consumed by `lib/founder-intelligence/readiness-relevance.ts` (`unmetPrerequisites`, `unlocks`) and `lib/build-record/build-record-engine.ts`. This corrects the earlier lineage audit, which undercounted this as missing.

**Capability → Deliverable** — already live via `relatedDeliverables: string[]`, rendered in `readiness-capability-card.tsx` via `getDeliverable()`. Every capability has this field populated (some as `[]`).

**Practice → Asset** — already live via `PRACTICE_ASSET_MAPPINGS` in `asset-registry.ts` (18 mappings, `connectionStrength: "direct" | "contributing" | "foundational"`).

**Capability → Asset (new this pass)** — added `ReadinessCapability.relatedBusinessAssetIds?: string[]`, populated for 2 capabilities with unambiguous matches:
- `growth-sop-before-hiring` (`requiredAssets: ["Five written SOPs"]`) → `relatedBusinessAssetIds: ["standard-operating-procedure"]`
- `scale-executive-rhythm` (`requiredAssets: ["A recurring leadership review with a shared KPI set"]`) → `relatedBusinessAssetIds: ["financial-dashboard"]`

**Asset → Deliverable (new this pass)** — added `BusinessAsset.relatedDeliverableIds?: string[]`, populated for 1 confirmed match:
- `strategic-plan` (asset) → `relatedDeliverableIds: ["strategic-plan"]` (deliverable). Same concept, verified — this is the collision case, resolved as a link (see section E).

## B. Inferred relationships requiring business validation

Plausible but **not wired into code** — flagged for a human decision, not guessed:

| Capability | `requiredAssets` (prose) | Plausible `BusinessAsset` match | Why unconfirmed |
|---|---|---|---|
| `start-customer-clarity` | "A one-sentence ideal customer description" | `brand-positioning-statement` | Positioning statement is broader than a customer description; could also feed `offer-suite`. |
| `start-offer-clarity` | "A one-sentence offer description" | `offer-suite` | `offer-suite` is a portfolio concept (multiple price points); this capability is about a single core offer — close but not exact. |
| `start-pricing-clarity` | "A margin calculation for the core offer", "A pricing review rhythm" | `pricing-framework`, `financial-dashboard` | Splits across two assets; unclear which is primary. |

Recommendation: resolve these when the Business Blueprint's requirements logic is actually built, since the right answer may depend on business stage/model, not just capability text.

## C. Unresolved relationships

Every other capability with `requiredAssets` set (roughly 20 of 25) has no `relatedBusinessAssetIds` — left `undefined` rather than force-matched. Examples where no existing `BusinessAsset` cleanly corresponds at all: capabilities whose required artifact is a decision/rhythm rather than a named asset (e.g. exit-readiness checklists, compliance rhythms). These may need new `BusinessAsset` entries rather than a link to an existing one — a Business Blueprint-time decision, not a registry-audit decision.

## D. Orphans

**Business Assets with no Practice link** (in `BUSINESS_ASSET_REGISTRY` but not in `PRACTICE_ASSET_MAPPINGS`):
- `content-library`
- `decision-framework`
- `partnership-system`

**Deliverables with no Capability link** (in `DELIVERABLES` but never appear in any `relatedDeliverables`):
- `press-release`
- `launch-timeline`
- `service-agreement`

**Capabilities with no Asset link:** all except the 2 listed in section A (confirmed) and the 3 listed in section B (inferred).

None of these orphans are bugs — they're registries seeded independently and not yet fully cross-wired, consistent with how `PRACTICE_ASSET_MAPPINGS` already documents itself as "a representative subset... completed in a future phase."

## E. ID collision: `"strategic-plan"`

Exists independently as:
- A `BusinessAsset` (`strategic-foundation` pillar, `roiHorizon: "90-days"`, compounding strategic asset)
- A `Deliverable` (category "Strategy", tangible document, owned by the strategy executive)

**Verified no consumer currently conflates them** — they're read from different registries by different lookup functions (`getAssetById` vs `getDeliverable`), so there was no runtime bug. Resolved by treating this as the first confirmed example of the new `BusinessAsset.relatedDeliverableIds` link (section A), not by renaming, merging, or deleting either entry. Both ids stay exactly as they are.

## F. What the Business Blueprint will still need to calculate

This pass only maps existing plumbing. The Business Blueprint™ itself still needs to compute, at run time, from a founder's actual Business Destination™ and Business Stage™:

1. Which capabilities are *required* (not just "exist in the registry") for this specific business.
2. For each required capability, which asset(s) must therefore be built — using `relatedBusinessAssetIds` where confirmed, and a business-design decision (section B/C) where not yet linked.
3. For each required asset, which deliverable(s) should be produced — using `relatedDeliverableIds` where confirmed, otherwise none yet exist.
4. Sequencing across capabilities using the already-live `prerequisiteCapabilityIds` / `enablesCapabilityIds` graph.
5. Whether new `BusinessAsset` or `Deliverable` entries are needed to cover the unresolved/orphan cases in C and D, rather than assuming everything already fits the existing 20 + 10.

## Files changed this pass

- `lib/executive-decision-engine/types.ts` — added optional `BusinessAsset.relatedDeliverableIds?: string[]`
- `lib/executive-decision-engine/asset-registry.ts` — populated it once, on `strategic-plan`
- `lib/excellence-intelligence/excellence-intelligence-registry.ts` — added optional `ReadinessCapability.relatedBusinessAssetIds?: string[]`; populated it on `growth-sop-before-hiring` and `scale-executive-rhythm`
- This document (new)
- `docs/blueprint-data-lineage-audit.md` — appended a correction note

## Explicitly out of scope this pass

No changes to Founder GPS, ESA, WLB Audit, Decide & Design, Executive Office, the live CEO Workday, or any UI. No renames of existing ids. No merging of registries. No full Business Blueprint requirements graph. `requiredAssets` (prose) is untouched and still renders exactly as before.

## Verification

- `tsc --noEmit`: no new errors. Full-project error count unchanged from baseline (140 lines of output, all pre-existing and unrelated to these 3 files).
- Both new fields are optional and additive — every other seeded entry compiles untouched.
- `readiness-capability-card.tsx` and `business-building-guide-engine.ts` render unchanged (new fields unused by them; `requiredAssets` untouched).
