# Work-Life Operating Engine™ — Architecture Report

Status: **Audit only. No schema changes, no code changes.** This is the report requested before any implementation begins.

---

## Executive Summary

The codebase already contains three tiers of maturity for the data the Work-Life Operating Engine™ needs:

1. **Real, persisted, per-founder Supabase data** that already IS operating-event-shaped — most importantly `segment_intentions` / `segment_declarations` / `segment_completions` (per-segment, per-day decision → declaration → execution with an AI reflection and a `completion_status` of honored/modified/not-completed) and `reality_checks` (weekly snapshot). These are real Work-Life Operating Events already flowing into Supabase today.
2. **A parallel, unconnected, richer localStorage system** (`lib/wlbb-week`) that models almost the same thing — daily selected/completed/carried-forward Business Outcomes — but has never been migrated to Supabase, even though a `wlbb_weekly_debrief` table already exists for it with **zero code references**.
3. **A long tail of `sessionStorage`/`localStorage`-only "architecture hook" engines** (Progress Intelligence™, Founder Memory™, Harmony Memory™, Executive Office Engine™, Digital Twin™, Adaptive Workspace™) that were explicitly built as pure, session-scoped placeholders, self-documented as "SESSION-ONLY this phase" / "ARCHITECTURE ONLY," awaiting the exact persistence layer this initiative is designing.

The single most important finding: **the founder's real, persisted execution history (`segment_completions`) is not read by anything.** Cherry Blossom's guidance, Founder GPS™, and HarmonyContextProvider all currently reason from `sessionStorage` `Progress Intelligence™` (cleared every tab close) or from nothing at all — not from the Supabase rows that already exist. Wiring the Work-Life Operating Engine™ is therefore less "build new tables" and more "stop ignoring the tables we have, extend them deliberately, and retire the duplicate localStorage paths."

---

## A. Current Data Map

Every meaningful founder input, and where it currently lives.

| Data / Event | Source (UI) | Current Storage | Persistent? | Harmony Context Access? | Cherry Blossom Access? | Owner |
|---|---|---|---|---|---|---|
| Founder Profile™ (identity, family, kids' birthdays, photo) | `/founder-profile` | Supabase `founder_profiles` + localStorage cache | Yes (cross-device) | Yes — `founderProfile` field | Indirectly via HarmonyContext | `lib/founder-profile/founder-profile-store.ts` + `utils/founder-profile-storage.ts` |
| Business Context Profile™ | `/business-context` | Supabase `business_context_profiles` + localStorage cache | Yes | Yes — `businessContext` field | Indirectly via HarmonyContext | `lib/business-context/business-context-store.ts` + `utils/business-context-storage.ts` |
| Founder Learning Profile™ | Business Context wizard | localStorage only (`lib/founder-learning`) | **No** | Yes — `founderLearning` field | No | `lib/founder-learning/founder-learning-store.ts` |
| Whole-Life Context™ (relationships, life events, life commitments, personal goals) | Not yet built as UI (architecture only) | localStorage only, namespaced `harmony.whole-life.*` | **No** | Consumed by `assembleHarmonySnapshot()` (Phase 6.1 aggregator), but that aggregator itself is **not wired into HarmonyProvider** — architecture-only | No | `lib/whole-life-context/*` |
| Weekly Reality Check™ / Work-Life Balance Audit™ | `/audit`, `/begin`, weekly reflection flows | **Supabase `reality_checks`** (one row per user per ISO week, upserted) + `localStorage` mirror (`workLifeBalanceAuditResults`) for instant UX | Yes | No — HarmonyContext does not read it directly; the Phase 6.1 aggregator expects it to be passed in as `auditScore` but nothing currently supplies that argument | Partially — `getLatestRealityCheck()` exists but is not called from the Cherry Blossom chat route today | `utils/reality-check-storage.ts` (client) + `utils/reality-check-server.ts` (server) |
| Entrepreneur Success Assessment™ (ESA) | `/entrepreneur-success-assessment` | localStorage only (`entrepreneurSuccessAssessmentResults` + a weekly `entrepreneurSuccessAssessmentHistory`) | **No** | Same as above — aggregator expects `esaResults` as an argument, not wired | No | `lib/entrepreneur-success/esa-storage.ts` |
| Daily Identity Decision (per-segment intention) | Identity Installation panel (built, **not mounted on any page**) | **Supabase `segment_intentions`** (upsert per user/segment/day) | Yes | No | No | `app/api/identity/intention/route.ts` |
| Daily Identity Declaration (Cherry-Blossom-generated, AI text) | Same panel | **Supabase `segment_declarations`** | Yes | No | No | `app/api/identity/declaration/route.ts` |
| Daily Identity Completion (honored / modified / not-completed + AI reflection) | Same panel | **Supabase `segment_completions`** | Yes | No | **No — this is the biggest gap** | `app/api/identity/completion/route.ts` |
| Daily Identity (local, older/parallel model: identity statement, boundary statement, CEO outcome ids, check-in) | `lib/daily-identity` consumers | localStorage only, keyed `dailyIdentity:{date}` | **No** | No | No | `lib/daily-identity/storage.ts` |
| Weekly WLBB Menu™ (Monday Debrief life intentions + business outcomes + daily selected/completed/carried-forward per Mon–Thu) | Design My Week / Live Today flows | localStorage only, keyed `wlbbWeek:{weekKey}` | **No** — a `wlbb_weekly_debrief` Supabase table exists for exactly this shape but has **zero code references anywhere in the repo** | No | No | `lib/wlbb-week/storage.ts`, `lib/wlbb-week/gps.ts` |
| Operating Rules™ (per segment, per week, human/business/ai/execution) | Sunday Design Day / segment planners | **Supabase `operating_rules`** | Yes | No — HarmonyContext reads only the *installed week's* rule text (a separate, session-only concept — see below), not this table | No | `lib/operating-rules/storage.ts` |
| Installed Week (Sunday Design Day™ output: weekly intention, per-segment rule + non-negotiable + declaration, CEO context, focus areas) | Sunday Design Day™ | `sessionStorage`/localStorage via `getInstalledWeek()` (`lib/sunday-design-day/installed-week.ts`) | **No** | Yes — this is the primary input to HarmonyContextValue today | Yes — this is Cherry Blossom's main input today | `lib/sunday-design-day/installed-week.ts` |
| Cherry Blossom Memory Vault™ (relationships, important dates, lifestyle/planning/work-life preferences, AI-learned facts) | Extracted from chat by an AI pass | **Supabase `member_memory`** (upsert on user+type+key) | Yes | No | **Yes** — loaded directly in the chat route via `lib/cherry-blossom/memory.ts` | `lib/cherry-blossom/memory.ts` |
| Cherry Blossom conversations/messages | Chat UI | **Supabase `conversations` + `messages`** | Yes | No | Yes, within a given conversation thread | `app/api/conversations/*` |
| Progress Intelligence™ (Non-Negotiable streak, workout streak, executive outcomes/wk, assets, SOPs, last outcome) | Various Live Today interactions (never actually wired to writers) | `sessionStorage` only, key `harmony:progress-intelligence:v1` | **No — and it's the input `cherry-blossom-guidance.ts` actually uses for streaks today** | No | Yes — via `ProgressSummary` passed into `getCherryBlossomGuidance()` | `lib/founder-gps/progress-intelligence.ts` |
| Business Stage™ | Set by founder | `sessionStorage`, event-driven | **No** | Yes | Yes (via HarmonyContext) | `lib/business-stage/business-stage-store.ts` |
| Business Comprehension™ / Communication Style™ | Set by founder | `sessionStorage`, event-driven | **No** | Yes | Yes | `lib/business-comprehension/business-comprehension-store.ts` |
| Locale preferences | Set by founder | `sessionStorage` | **No** | Yes | No | `lib/i18n/locale-preferences-store.ts` |
| Flex Time Days™ (deferred/borrowed items, resolution) | Flex time flows | **Supabase `flex_time_days`** | Yes | No | No | `utils/flex-time-storage.ts` |
| Morning GIV•EN™ days | Morning routine flow | **Supabase `morning_given_days`** | Yes | No | No | `utils/morning-given-storage.ts` |
| Founder Memory™ (pattern-recognition insights) | Auto-seeded / derived | `localStorage` only | **No** | No | No — architecture only | `lib/founder-memory/*` |
| Harmony Memory™ (narrative arc, milestones, predictive insights) | Auto-derived | `localStorage` only | **No** | No | No — architecture only | `lib/harmony-memory/*` |
| Executive Office Engine™ memory | AI Executive Team interactions | `localStorage` only | **No** | No | No | `lib/executive-office/executive-memory-store.ts` |
| Digital Twin™ (decisions, twin state, scenarios, foresight) | Decision Workspace | `localStorage` only | **No** | No | No | `lib/digital-twin/*` |
| Adaptive Workspace™ (operating mode, ritual intelligence, workspace adaptation log) | Live Today adaptive UI | `localStorage` only | **No** | No | No | `lib/adaptive-workspace/*` |
| Executive Reviews™ (weekly/monthly/quarterly) | Executive Reviews section | `localStorage` presumed (not read in this pass, same pattern as sibling engines) | **No** | No | No | `lib/executive-reviews/*` |
| Sunday Cycle (member cycle start/end dates, current cycle number) | Signup/membership flow | **Supabase `user_profiles`** (`current_cycle`, `cycle_start_date`, `cycle_end_date`) | Yes | No | No | `lib/sunday-cycle/cycle-actions.ts` |
| Community (posts, comments, likes, calendar events, activity streaks, accountability partners) | `/community` | **Supabase** (`community_posts`, `community_comments`, `community_post_likes`, `calendar_events`, `activity_completions`, `activity_streaks`, `accountability_partners`) | Yes | No | No | `lib/community/*` |
| Membership / entitlements | Signup, Stripe/SamCart webhooks | **Supabase `member_memberships`** + `user_profiles.membership_tier` | Yes | No (not a founder-context signal today) | No | `utils/membership-storage.ts`, `lib/entitlements.ts` |

---

## B. Current Engine Map

What each engine reads, writes, owns, and whether its output is persisted or visible to HarmonyContextProvider.

| Engine | Reads | Writes | Owns | Persisted? | Visible to HarmonyContextProvider? |
|---|---|---|---|---|---|
| **Harmony Context Engine™** (`components/harmony-context/harmony-context-provider.tsx`) | Operating Engine snapshot, installed week, business stage, communication style, locale prefs, Business Context Profile™ (DB), Founder Profile™ (DB), Founder Learning Profile™ (local) | `sessionStorage`/localStorage for session signals; delegates Founder Profile™/Business Context™ writes to their own stores | The canonical `HarmonyContextValue` React context | Partially (2 of ~10 signal groups are DB-backed; rest are session-only) | N/A — this IS the provider |
| **Harmony Context Aggregator** (`lib/harmony-context/engine.ts` — `assembleHarmonySnapshot`) | `HarmonyContextValue`, `WholeLifeContext`, `EsaResults`, audit score, `BusinessPerformanceSnapshot` — all passed as function arguments | Nothing (pure function) | The `HarmonyContextSnapshot` shape (5 layers: Identity, Business, Life, Operating, Intelligence Hooks) | N/A (pure) | **Not currently invoked by the live provider** — this is a fully-designed Phase 6.1 aggregator that nothing calls yet. It is the natural seam for a Work-Life Operating Engine™ context snapshot. |
| **Founder GPS™** (`lib/founder-gps/engine.ts`, `.../progress-intelligence.ts`) | `GpsContext` (architecture hook, largely unpopulated), Progress Intelligence™ (`sessionStorage`) | Progress Intelligence™ `sessionStorage` | Streaks, "next best move" derivations | No | No — GPS is disconnected/architecture-only per its own comments |
| **Weekly WLBB GPS™** (`lib/wlbb-week/gps.ts`) | This week's `WlbbWeekState` (localStorage) | Nothing (pure) | A small deterministic "what's next" string, explicitly NOT the AI-powered Founder GPS™ | No | No |
| **Founder Intelligence Engine™** (`lib/founder-intelligence/*`) | `HarmonyContextValue` (via its own `load-context.ts`) | Nothing found | Founder-level intelligence briefs shown in `components/founder-intelligence/operating-brief.tsx` | No | Reads FROM HarmonyContext (one-directional) |
| **Executive Decision Engine™** (`lib/executive-decision-engine/*`) | Constitution, asset registry, priority/leverage frameworks (all static config) | Nothing persisted | Deterministic, explainable decision reasoning for the AI Executive Team | No | No |
| **Progress Intelligence™** | `sessionStorage` | `sessionStorage` | Streaks and completion counts | **No — clears every tab close** | Feeds Cherry Blossom's guidance today (the only "history" she currently has) |
| **Founder Memory™** (`lib/founder-memory/*`) | `localStorage`, a `memory-seeder.ts` that seeds demo data | `localStorage` | Pattern-recognition insights, a "concierge context" | No | No |
| **Harmony Memory™** (`lib/harmony-memory/*`) | `localStorage` | `localStorage` | Narrative arc / milestone / predictive-insight engines (5 sub-engines) | No | No |
| **Cherry Blossom Memory Vault™** (`lib/cherry-blossom/memory.ts`) | **Supabase `member_memory`** | **Supabase `member_memory`** (via an AI extraction pass over chat) | Structured, typed long-term facts Cherry Blossom is explicitly authorized to recall | **Yes** | No (read only inside the chat route, not surfaced to HarmonyContext) |
| **Executive Office Engine™** (`lib/executive-office/*`) | `localStorage` | `localStorage` | Executive Office memory/briefings | No | No |
| **Operating Mode Engine™ / Ritual Intelligence Engine™ / Workspace Intelligence Engine™** (`lib/adaptive-workspace/*`) | `localStorage`, `HarmonyContextValue` (read-only) | `localStorage` (`adaptation-store.ts`) | Adaptive workspace mode + rituals | No | Reads FROM HarmonyContext (one-directional) |
| **Digital Twin / Foresight Engine / Scenario Analyzer / Twin Builder** (`lib/digital-twin/*`) | `localStorage`, `HarmonyContextValue` (read-only) | `localStorage` | Decision simulation | No | Reads FROM HarmonyContext (one-directional) |
| **Personal Cycle Engine™ / Sunday Cycle** (`lib/sunday-cycle/*`) | **Supabase `user_profiles`** | **Supabase `user_profiles`** | Membership cycle dates | Yes | No |
| **Harmony Week™ Engine** (`lib/harmony-week/*`) | Not traced in depth this pass — same directory pattern as siblings; presumed localStorage/session | — | Weekly cadence framing | Unconfirmed — flag for Step L verification | No |
| **Operating Rules™ storage** (`lib/operating-rules/storage.ts`) | **Supabase `operating_rules`** | **Supabase `operating_rules`** | Per-segment, per-week rule text with carry-forward and replace semantics | Yes | No — HarmonyContext's `segments[].rule` comes from the *installed week* (session-only), a separate, older concept that overlaps with this table without using it |
| **Daily Identity API** (`app/api/identity/*`) | **Supabase `segment_intentions`/`segment_declarations`/`segment_completions`** | Same three tables | The most complete real Work-Life Operating Event prototype in the codebase | Yes | No — and its own UI panel (`components/identity-installation/identity-installation-panel.tsx`) is not mounted anywhere either |

---

## C. What Already Looks Like a Work-Life Operating Event

Before proposing new event types, it's worth being explicit that **the shape already exists** in `segment_intentions` → `segment_declarations` → `segment_completions`:

1. A founder starts a segment (e.g. `movement-window`) → `POST /api/identity/intention` writes a row: what they intend, for how long.
2. Cherry Blossom generates a first-person declaration from that intention → `POST /api/identity/declaration` writes it.
3. The founder finishes the segment → `POST /api/identity/completion` writes `completion_status: "honored" | "modified" | "not-completed"` (the naming in code is inferred from the reflection prompts; the DB column is free-text) plus a Cherry-Blossom-generated reflection.

This is DECIDE → EMBODY → EXECUTE, scoped per segment, per day, per founder, already in Supabase, already RLS-protected. It is currently orphaned: no page mounts the panel that calls these routes, and nothing reads `segment_completions` back out except the panel's own history view. This is the strongest candidate foundation for the Work-Life Operating Event taxonomy — not a reason to start over.

---

## D. Proposed Work-Life Operating Event Taxonomy (draft — not final)

Organized by the lifecycle the existing `segment_*` tables already encode, generalized beyond just the Live Today segments:

**Identity / Decision events**
- `IDENTITY_DECIDED` (generalizes today's per-segment intention)
- `LIFE_PRIORITY_SELECTED`, `BUSINESS_PRIORITY_SELECTED` (from Business Outcomes™ selection in `wlbb-week`)
- `OPERATING_RULE_INSTALLED`, `OPERATING_RULE_REPLACED` (already modeled well by `operating_rules` status transitions — reuse, don't reinvent)

**Embodiment events**
- `DECLARATION_GENERATED` (generalizes `segment_declarations`)

**Execution events**
- `SEGMENT_HONORED`, `SEGMENT_MODIFIED`, `SEGMENT_NOT_COMPLETED` (generalizes `segment_completions.completion_status` — these should probably stay a single `SEGMENT_COMPLETED` event with a `status` field rather than three event types, to avoid taxonomy sprawl)
- `BUSINESS_OUTCOME_COMPLETED`, `BUSINESS_OUTCOME_CARRIED_FORWARD` (generalizes `wlbb-week`'s daily outcome tracking)
- `COURSE_CORRECTION_MADE` (net-new — no current storage owns "I changed my mind mid-week")

**Assessment / Reflection events**
- `REALITY_CHECK_COMPLETED` (already real — `reality_checks.scored_at`)
- `ESA_COMPLETED` (currently local-only — migration candidate)
- `WEEKLY_REFLECTION_SUBMITTED` (already a field on `reality_checks`)

**Boundary events**
- `BOUNDARY_PROTECTED`, `BOUNDARY_BREACHED` (net-new — closest existing proxy is `flex_time_days.outstanding`/`borrowed_items`, which already implies a boundary was crossed and repaid)

This list is intentionally provisional — Step L below sequences validating it against real usage before any table is built.

---

## E. HarmonyContextProvider Integration (proposed direction, not implemented)

The Phase 6.1 aggregator (`assembleHarmonySnapshot`) already defines the right seam and the right discipline: it takes a `ProgressSummary`-shaped input, not raw history, and produces `IntelligenceHooks` (urgent outcomes, top priority signal) as pre-computed derivations. The Work-Life Operating Engine™ should slot in as a **new named input** to that same function — a `WorkLifeOperatingFootprint` snapshot (recent completions, active streaks, boundary status) — computed server-side from the Work-Life Operating Event table(s), NOT the raw event rows themselves. The aggregator already enforces "snapshot in, snapshot out" — the discipline this phase needs is just calling it from the live provider at all, and feeding it a real snapshot instead of the currently-unused `Progress Intelligence™` `sessionStorage` stand-in.

## F. Founder GPS™ Integration (proposed direction)

`GpsContext` already has the right fields defined (`weakestEsaPillar`, `nonNegotiablesCount`, `inLifeProtectionMode`, etc.) — it is simply never populated with real data today. The Work-Life Operating Footprint should feed into `GpsContext` the same way ESA/audit/whole-life data already conceptually do in the aggregator: as derived counts and trend flags, never raw event lists.

## G. Cherry Blossom™ Integration (proposed direction)

Cherry Blossom already has two live data paths: `cherry-blossom-guidance.ts` (pure, reads `ProgressSummary` + upcoming events) and `lib/cherry-blossom/memory.ts` (real Supabase `member_memory`, read inside the chat route). The Work-Life Operating Footprint's natural entry point is as a **third input to `getCherryBlossomGuidance()`**, replacing/supplementing the sessionStorage-backed `ProgressSummary` with one derived from real `segment_completions` (and whatever new tables emerge). The chat route should also start reading recent operating events the same way it already reads `member_memory`, so "you committed to X yesterday but Y happened" becomes possible.

## H. Executive Team Integration (proposed direction)

Not scoped in this pass per the instructions — each of the 8 executives should be evaluated individually against the Work-Life Operating Event taxonomy once it's finalized (Step D). No executive currently reads or writes Founder Profile™/Business Context™ independently — confirmed no competing profile writers exist outside the two canonical stores.

## I. Memory Architecture Boundaries (proposed)

Given what exists today:
- **Work-Life Operating History™** = the raw event tables (`segment_intentions`/`declarations`/`completions`, `operating_rules`, `reality_checks`, and whatever WLBB migration follows). Append-only, per-founder, RLS-scoped.
- **Founder Memory™** = currently a localStorage pattern-recognition layer with a demo seeder; if kept, it should become a *derived, periodically-recomputed* summary over Operating History, not a second raw log.
- **Harmony Memory™** = currently a localStorage narrative/milestone engine; same recommendation — derived insights, not raw duplication.
- **Cherry Blossom Memory Vault™** (`member_memory`) = already correctly scoped as "specific facts Cherry Blossom is authorized to recall" (relationships, important dates, preferences) — this table should NOT absorb operating events; it stays about the founder as a *person*, not their *execution log*.

## J. Migration Plan (candidates, sequenced by risk)

1. **Zero-risk, immediate value**: Wire the existing `segment_completions`/`segment_intentions`/`segment_declarations` data into `cherry-blossom-guidance.ts` and the aggregator. No schema change — this data already exists and is already correctly RLS-scoped. This alone would make Cherry Blossom's "streak" language truthful instead of sessionStorage-fake.
2. **Low-risk**: Mount `identity-installation-panel.tsx` (or its successor) somewhere in the live product so the segment intention/declaration/completion loop actually produces data across the founder base, not just in isolated testing.
3. **Medium-risk**: Migrate `lib/wlbb-week/storage.ts` off localStorage into the already-existing but unused `wlbb_weekly_debrief` table (or a redesigned equivalent per Step D) — this is a straight port of a well-defined shape to a table that already exists.
4. **Medium-risk**: Migrate ESA results (`lib/entrepreneur-success/esa-storage.ts`) to Supabase, following the exact upsert-by-week pattern `reality_checks` already established — these two assessments are conceptually siblings and should end up structurally similar.
5. **Higher-risk / design-first**: Decide whether `Founder Memory™`, `Harmony Memory™`, and `Progress Intelligence™` become derived views over the new Operating History tables (recommended) or get their own persistence — do this only after the event taxonomy (Step D) is validated against a few weeks of real `segment_completions` data.

## K. Security Model

Every Supabase table inventoried above already has RLS enabled with per-user policies scoped by `user_id = auth.uid()` (verified live via the connected Supabase integration: `founder_profiles`, `business_context_profiles`, `reality_checks`, `operating_rules`, `segment_intentions`, `segment_declarations`, `segment_completions`, `member_memory`, `flex_time_days`, `morning_given_days`, `conversations`/`messages`, `user_profiles`, community tables, all show 1–4 owner-scoped policies and no public/service-role bypass in the policy list). Any new Work-Life Operating Event table(s) should follow the exact same pattern already established by `segment_completions` (a good reference implementation): `user_id uuid references auth.users`, RLS enabled, one policy per operation scoped to `auth.uid() = user_id`. No frontend-only filtering exists anywhere in the current persisted tables — this is already being done correctly and should be continued.

## L. Recommended Implementation Order

1. Validate the proposed event taxonomy (Step D) against 2–4 weeks of real usage of the *existing* `segment_completions` flow once it's mounted (Step J.2) — don't design new tables against a taxonomy no founder has actually exercised yet.
2. Wire existing persisted data (`segment_completions`, `reality_checks`, `member_memory`) into the aggregator and Cherry Blossom before creating anything new — this is the highest-leverage, lowest-risk step and was explicitly out of scope to skip per the brief, but it is the natural Phase 1 of the implementation this report unblocks.
3. Migrate `wlbb-week` to its already-provisioned `wlbb_weekly_debrief` table.
4. Migrate ESA to Supabase using the `reality_checks` pattern.
5. Only then design and create any genuinely new Work-Life Operating Event table(s), scoped narrowly to the events Step 1's real usage data proved matter.
6. Layer Founder GPS™ and executive-team consumption on top once the footprint has real data flowing through it for at least one full founder cohort week.

This order avoids the exact failure mode the brief warns against — building a speculative "giant event log" before confirming, from real founder behavior, which events are actually meaningful.
