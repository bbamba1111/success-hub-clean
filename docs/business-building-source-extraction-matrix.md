# Business-Building Source Extraction Matrix

**Status: reusable template. No real source material has been extracted yet.**

This document is the single controlled intake point between raw guru/mentor source
material (books, courses, transcripts, interviews, frameworks, websites) and the
production content libraries described in
[`business-blueprint-content-specification.md`](./business-blueprint-content-specification.md)
§13 (Source/Provenance Rules).

```
Source Material
      ↓
Extraction Matrix   ← you are here
      ↓
Content Review / Approval
      ↓
Production Content Libraries (lib/business-blueprint, lib/excellence-intelligence, ...)
      ↓
Business Blueprint™
```

No guru, mentor, book, course, or framework has been entered into this matrix yet. The
only example below is explicitly fictional (see §7). **Nothing in this document has been
promoted to a production registry.**

---

## 1. Purpose

Harmony Lane's Business Blueprint™ is meant to encode *proven* business-building
practices — not invented advice dressed up as proven practice. Before any capability,
asset, deliverable, or mechanism enters a production registry, it must trace back to:

- a specific source (§3), and
- an explicit, honest distinction between what that source actually says and how
  Harmony Lane chooses to operationalize it (§4).

This matrix is where that tracing happens. It is a research and authoring artifact —
not application code, not a runtime engine, and not itself a new taxonomy (see §10).

---

## 2. How to use the matrix

- **One row per extracted principle.** A row records a single discrete practice or
  claim, in the source's own terms, plus Harmony Lane's proposed operationalization of
  it.
- **A single source principle may produce multiple Harmony Lane records** — e.g. one
  practice might imply both a Capability and a related Deliverable. Use one row per
  principle and list multiple downstream records in the relevant columns if needed,
  or split into multiple rows if the mappings genuinely diverge.
- **Multiple sources may independently support the same Harmony Lane capability.**
  Record each source's row separately. Do not merge them into one row — independent
  corroboration is valuable to preserve, but...
- **...repetition across sources is not automatic proof of universal necessity.**
  Three gurus recommending the same practice does not, by itself, promote a practice
  from "conditional" to "universal." That judgment is made explicitly during content
  review (§9), informed by — but not dictated by — how many sources agree.
- **Do not paste the source text itself into this matrix.** Record a reference (book
  title + chapter/page, course name + module, transcript + timestamp, URL) and a
  concise paraphrase in column 4 — not verbatim excerpts. This keeps the matrix from
  becoming a copyrighted-text repository.

---

## 3. Field definitions

| # | Column | Definition |
|---|--------|------------|
| 1 | **Source / Mentor / Model** | The named person, book, course, or framework the principle comes from. |
| 2 | **Source Type** | One of: Book · Course · Transcript · Interview · Website · Framework doc · Other. |
| 3 | **Exact Source Reference** | Chapter/page, module/lesson, timestamp, or URL. A pointer, not the text itself. |
| 4 | **Source Principle / Practice** | The practice as the source actually describes it, in the source's own terminology as closely as possible. |
| 5 | **Source-Supported Business Problem** | The problem the source explicitly says this practice solves. Leave blank rather than guessing if the source doesn't say. |
| 6 | **Source-Supported Desired Outcome** | The outcome the source explicitly claims. Same rule — don't infer past what's stated. |
| 7 | **Harmony Lane Interpretation** | How Harmony Lane proposes to operationalize the principle inside the product. This is *our* language, clearly separated from column 4. |
| 8 | **Operating Pillar™** | One of the 8 existing pillars from `esa-registry.ts` / spec §2. Never a new pillar. |
| 9 | **Capability** | The candidate `ReadinessCapability` this principle maps to (existing id, or a proposed new one). |
| 10 | **Business Asset™** | The candidate durable asset (existing id from `asset-registry.ts`, or proposed new one). |
| 11 | **Deliverable** | The candidate tangible output (existing id from `deliverable-registry.ts`, or proposed new one). |
| 12 | **Best-Practice Mechanism** | The candidate mechanism record — how the capability/asset actually gets built (per spec §7; mechanism library does not exist yet, so this is provisional). |
| 13 | **Applicable Business Model(s)** | Which archetype(s) this applies to, or "all." |
| 14 | **Applicable Business Model Dimension** | Which Business Model Dimension (spec §4 — Role, Format, Revenue, Acquisition, Delivery, Growth) gates this, if conditional. |
| 15 | **Applicable Business Stage** | Which stage(s) this becomes relevant at. |
| 16 | **Prerequisites / Dependencies** | Other capabilities/assets that must exist first, if any. |
| 17 | **Current / Future / Conditional** | Per spec §5 — Universal, Conditional, Destination-specific, Stage-dependent, or Optional. |
| 18 | **Evidence / Provenance** | One of: **Source-Derived** / **Harmony Lane Interpretation** / **Model Inference** (§4 below). Every row must be explicit about which this is. |
| 19 | **Source Confidence** | Author's confidence that column 4 is a faithful representation of the source: High / Medium / Low. |
| 20 | **Harmony Lane Content Status** | Pending Review · Approved · Rejected · Deferred. Starts at "Pending Review" for every new row. |

---

## 4. Provenance rules

Every row must make an honest, explicit distinction between three different kinds of
claim. This is the load-bearing rule of the entire matrix — get this wrong and the
Business Blueprint™ silently misattributes Harmony Lane's own opinions to outside
authorities (or vice versa).

- **SOURCE-DERIVED** — what the source material actually states, or directly and
  unambiguously supports. If quoting or closely paraphrasing, this is source-derived.
- **HARMONY LANE INTERPRETATION** — our operationalization of a source-derived
  principle into Harmony Lane's own architecture (a specific Capability, Asset,
  Deliverable, or Mechanism). This is *not* something the source said — it's how we
  chose to build it.
- **MODEL INFERENCE** — a relationship the researcher or system inferred (e.g. "this
  probably also implies X"), which the source does not explicitly state and Harmony
  Lane has not yet deliberately decided to adopt as interpretation.

**Never present a Model Inference or a Harmony Lane Interpretation as though it came
directly from the mentor/guru.** Column 18 exists specifically so this distinction
survives into content review — reviewers must be able to tell, at a glance, whether
they're approving a faithful extraction or a Harmony Lane design choice.

---

## 5. Extraction workflow

1. Read/watch/review the source material directly (not a summary of it).
2. Identify one discrete, source-supported principle or practice.
3. Record columns 1–6 using the source's own terminology, staying strictly within
   what the source actually claims.
4. Separately, draft the Harmony Lane Interpretation (column 7) — the translation into
   Harmony Lane's architecture. Keep this visually and logically separate from columns
   1–6.
5. Propose mappings to Operating Pillar™, Capability, Business Asset™, Deliverable, and
   Mechanism (columns 8–12) — but only where the evidence genuinely supports a mapping.
   It is fine, and expected, to leave a column blank rather than force a fit (see §8).
6. Propose applicability (columns 13–16) and timing classification (column 17).
7. Set column 18 (provenance category) honestly for the row as a whole, or per-field if
   a single row mixes source-derived and interpreted content.
8. Set column 19 (confidence) and leave column 20 as `Pending Review`.
9. Submit for content review (§9) — do not self-approve.

---

## 6. Empty template

Duplicate this row per extracted principle:

| Source / Mentor / Model | Source Type | Exact Source Reference | Source Principle / Practice | Source-Supported Business Problem | Source-Supported Desired Outcome | Harmony Lane Interpretation | Operating Pillar™ | Capability | Business Asset™ | Deliverable | Best-Practice Mechanism | Applicable Business Model(s) | Applicable Business Model Dimension | Applicable Business Stage | Prerequisites / Dependencies | Current / Future / Conditional | Evidence / Provenance | Source Confidence | Harmony Lane Content Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | | | | | | | | | Pending Review |

---

## 7. Fictional placeholder example

> **⚠ FICTIONAL PLACEHOLDER — NOT SOURCE-DERIVED ⚠**
> The row below does not reference any real person, book, course, or framework. It
> exists solely to demonstrate how the columns are meant to be filled in. **It must
> never be copied into a production registry, and its "content" must never be treated
> as an actual proven practice.**

| Column | Value |
|---|---|
| Source / Mentor / Model | `[PLACEHOLDER — Fictional Business Mentor]` |
| Source Type | `[PLACEHOLDER] Book` |
| Exact Source Reference | `[PLACEHOLDER] Ch. 4, "Example Chapter Title"` |
| Source Principle / Practice | `[PLACEHOLDER — describes a hypothetical repeatable client-acquisition practice, e.g. "a founder should have one repeatable way new clients find out about them before adding a second"]` |
| Source-Supported Business Problem | `[PLACEHOLDER — inconsistent, ad-hoc client acquisition]` |
| Source-Supported Desired Outcome | `[PLACEHOLDER — predictable pipeline of new clients]` |
| Harmony Lane Interpretation | `[PLACEHOLDER — this could map to a "Primary Acquisition Channel" capability requiring one documented, repeatable acquisition mechanism before additional channels are added]` |
| Operating Pillar™ | `[PLACEHOLDER] Revenue Engine™` |
| Capability | `[PLACEHOLDER] test-primary-acquisition-channel` |
| Business Asset™ | `[PLACEHOLDER] test-acquisition-playbook` |
| Deliverable | `[PLACEHOLDER] test-acquisition-channel-doc` |
| Best-Practice Mechanism | `[PLACEHOLDER — not yet defined; Mechanism Library does not exist yet]` |
| Applicable Business Model(s) | `[PLACEHOLDER] all` |
| Applicable Business Model Dimension | `[PLACEHOLDER] Acquisition Model` |
| Applicable Business Stage | `[PLACEHOLDER] Launch` |
| Prerequisites / Dependencies | `[PLACEHOLDER] none` |
| Current / Future / Conditional | `[PLACEHOLDER] Universal` |
| Evidence / Provenance | `FICTIONAL — DO NOT USE IN PRODUCTION` |
| Source Confidence | `[PLACEHOLDER] N/A (fictional)` |
| Harmony Lane Content Status | `Rejected — fictional, template demonstration only` |

> **⚠ Reminder: everything above is fictional. Do not extract, cite, or promote it. ⚠**

---

## 8. Authoring rules

- Do not extract a practice merely because it sounds like good business advice — it
  must be something the source actually teaches.
- Preserve the source's own terminology when recording the Source Principle (column 4).
  Translation into Harmony Lane's language happens separately, in column 7.
- Harmony Lane may translate a principle into its own architecture, but that
  translation must always be labeled as interpretation (column 18), never as source-derived.
- Do not force every source concept into a Capability, Business Asset, Deliverable, or
  Mechanism if the evidence doesn't support that specific mapping — leave the column
  blank and note why in a review comment instead.
- One source principle may produce multiple Harmony Lane records; record each mapping
  clearly rather than collapsing them.
- Multiple sources may independently support the same Harmony Lane capability — that's
  useful corroboration, but is not itself proof that a practice is universal.
- A practice can legitimately be Optional, Conditional, Stage-dependent, or
  Model-specific — resist the urge to default everything to "Universal."

---

## 9. Rules for promoting content from the matrix into production libraries

A row does **not** automatically become a production `ReadinessCapability`,
`BusinessAsset`, `Deliverable`, or Mechanism record. Promotion requires:

1. The row reaches `Harmony Lane Content Status: Approved` through human content
   review — not automatically, and not by this document alone.
2. Review confirms the Evidence/Provenance column (§4) is set honestly and the
   Harmony Lane Interpretation is clearly distinguishable from what the source actually
   claims.
3. Only after approval does a content author (or a separate, explicitly-scoped future
   pass) create or update the corresponding record in the actual TypeScript registry
   (`lib/excellence-intelligence/excellence-intelligence-registry.ts`,
   `lib/executive-decision-engine/asset-registry.ts`,
   `lib/output-architecture/deliverable-registry.ts`, or a future Mechanism registry).
4. This matrix document itself is never treated as a data source the runtime reads —
   it is upstream of the registries, not a substitute for them.

---

## 10. Architectural boundary

This matrix is an **authoring/research artifact**. It is explicitly **not**:

- a new runtime engine
- a new assessment
- a new category taxonomy (the existing 8 Operating Pillars™ remain canonical — see
  `business-blueprint-content-specification.md` §2)
- a new production registry
- a replacement for ESA
- a replacement for Business Context
- a replacement for Founder Destination
- a replacement for the Work-Life Balance Audit
- a replacement for Founder GPS

Its only job is to be the controlled, reviewable bridge between raw source material and
the production content libraries — nothing more.
