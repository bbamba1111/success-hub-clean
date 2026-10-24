# Phase 6.1 Operating Manual
# Harmony Context Engine™ & Founder GPS™ Intelligence Architecture

---

## Architectural Philosophy

Harmony Lane™ does not manage calendars. It protects what matters.

Harmony Lane™ is an AI Founder Operating System™. It is not a planner, CRM, calendar, chatbot, or LMS. Every feature exists to answer one question:

> "How can I help this founder build a healthier life, stronger relationships, and a more valuable business — without sacrificing one for the other?"

The Harmony Context Engine™ is the brain that enables that answer.

---

## Files Added This Sprint

### `lib/whole-life-context/types.ts`
The canonical Whole-Life Context™ type surface.

Primary types:
- `FounderProfile` — identity, preferences, goals
- `RelationshipPerson` — the people who matter most (family, friends, pets)
- `ImportantDate` — annual or one-time meaningful dates attached to a person
- `LifeEvent` — first-class context objects (birthdays, soccer tournaments, vacations, anniversaries)
- `LifeCommitment` — recurring, non-negotiable life commitments (Church, Gym, Date Night™)
- `PersonalGoal` — what the founder is working toward outside the immediate business
- `GoalMilestone` — milestone markers within a personal goal
- `WholeLifeContext` — the aggregate snapshot
- `ProactiveSignal` — architecture-only shape of every future Cherry Blossom™ proactive message

Enums defined: `RelationshipType`, `LoveLanguage`, `LifeEventType`, `LifeEventSignificance`, `LifeCommitmentCategory`, `CommitmentFrequency`, `DayOfWeek`, `PersonalGoalDomain`, `PersonalGoalStatus`, `ProactiveSignalType`, `ProactiveSignalUrgency`

Human-readable label maps: `RELATIONSHIP_TYPE_LABELS`, `LOVE_LANGUAGE_LABELS`, `LIFE_COMMITMENT_CATEGORY_LABELS`, `PERSONAL_GOAL_DOMAIN_LABELS`, `LIFE_EVENT_TYPE_LABELS`, `LIFE_EVENT_SIGNIFICANCE_LABELS`

Architecture constants: `DEFAULT_AWARENESS_WINDOWS` (how many days ahead Cherry Blossom starts awareness per significance level)

### `lib/whole-life-context/storage.ts`
localStorage persistence layer. One key per domain to enable future Supabase migration one domain at a time.

Keys: `harmony.founder.profile`, `harmony.whole-life.relationships`, `harmony.whole-life.life-events`, `harmony.whole-life.life-commitments`, `harmony.whole-life.personal-goals`, `harmony.whole-life.proactive-signals`

Notable helpers:
- `getUpcomingLifeEvents(withinDays)` — pre-filters by awareness window
- `getNonNegotiableCommitments()` — returns only active non-negotiables
- `getActivePersonalGoals()` — returns only active goals
- `getWholeLifeContext()` — loads the complete snapshot in one call
- `clearWholeLifeContext()` — removes all data (logout / testing)

### `lib/whole-life-context/index.ts`
Public barrel — single import point for all types and storage functions.

### `lib/harmony-context/engine.ts`
The Harmony Context Engine™ aggregator — the single source of contextual truth.

Assembles a `HarmonyContextSnapshot` from five layers:

| Layer | Source |
|-------|--------|
| Identity™ | `HarmonyContextValue` + `FounderProfile` |
| Business Context™ | `BusinessStage`, `EsaResults`, audit score, `BusinessPerformanceSnapshot` |
| Whole-Life Context™ | `WholeLifeContext` |
| Operating Context™ | `HarmonyContextValue` (SDD, segments, intention) |
| Intelligence Hooks™ | Derived deterministically from all above |

The `assembleHarmonySnapshot(input: AssemblyInput)` function is **pure** — same inputs always produce the same output. No side effects. No AI calls. Safe for SSR.

Intelligence Hooks pre-compute:
- `gpsContext` — the complete `GpsContext` signal surface for Founder GPS™
- `urgentOutcomes` — the three GPS Outcomes™ ranked by current urgency
- `upcomingLifeEvents` — filtered to the current awareness window
- `activeNonNegotiables` — active, non-negotiable life commitments
- `activePersonalGoals` — currently active personal goals
- `weakestPillar` / `strongestPillar` — derived from ESA pillar scores
- `topPrioritySignal` — the single GPS signal that would fire first
- `inLifeProtectionMode` — true when a significant event is within 3 days

### `lib/founder-gps/types.ts` (extended)
New fields added to `GpsContext` (all optional / architecture hooks):
- `nonNegotiablesCount` — number of active Life Non-Negotiables™
- `upcomingLifeEventsCount` — number of events within the awareness window
- `hasEventRequiringPreparation` — whether any event needs gift/planning
- `hasPersonalGoals` / `activePersonalGoalsCount` — personal goal signals
- `hasRelationships` — whether Relationship Intelligence™ has been populated
- `daysUntilNextSignificantEvent` — days until next high/life-defining event
- `inLifeProtectionMode` — true when significant event is within 3 days

New `GpsSignalId` values:
- `life-defining-event-imminent` (priority 2 — second only to non-negotiables-at-risk)
- `high-significance-event-soon` (priority 4)
- `event-requires-preparation` (priority 5)
- `no-non-negotiables-defined` (priority 12)
- `no-personal-goals-defined` (priority 13)
- `no-relationships-defined` (priority 14)

New constants added:
- `GPS_OUTCOME_DESCRIPTIONS` — the three GPS Outcomes™ with labels, descriptions, and examples
- Complete **Founder GPS Reasoning Pipeline™** documentation block

---

## Founder GPS Reasoning Pipeline™

```
Harmony Context Engine™
  ↓ (identity, language, communication style)
Business Context™
  ↓ (stage, model, performance)
Life Context™
  ↓ (commitments, events, goals, relationships)
Current Operating Segment™
  ↓ (what was designed for this moment)
Business Stage™
  ↓ (launch → growth → scale → legacy)
Business Model™
  ↓ (service, product, coaching, agency, etc.)
Business Performance™
  ↓ (revenue, cash flow, capacity, retention)
Work-Life Balance™
  ↓ (human sustainability baseline)
Entrepreneur Success™
  ↓ (8-pillar operating health)
Excellence Intelligence™
  ↓ (domain competency signals)
Founder GPS™ Signal Weights
  ↓ (ranked by urgency using GPS_SIGNAL_WEIGHTS)
ONE Highest-Leverage Recommendation™
  ↓ (GpsRecommendation — one turn, one reason, one CTA)
Executive Assignment™
  ↓ (which Executive™ executes the next turn)
Business Asset™
  ↓ (what Compounding Asset™ will be built)
Time Freedom™
  ↓ (the life that is being protected throughout)
```

---

## Three Architectural Constants (GPS Invariants)

Every future recommendation the GPS produces must respect these three invariants:

### 1. Honor Life's Non-Negotiables™
Protect: Sleep, Health, Relationships, Recovery, Family, Time Freedom™

### 2. Build Compounding Business Assets™
Every turn should build something lasting: Signature Talks™, Evergreen Webinars™, SOPs™, Referral Systems™, Hiring Systems™, AI Workflows™, Marketing Funnels™, Books™, Frameworks™, Templates™

### 3. Reduce Execution Friction™
Every system installed should reduce how much the founder has to think, decide, or do manually: Delegation, AI, Automation, Business Operating Rules™, Templates, Checklists, Decision Frameworks, Systems

---

## Proactive Cherry Blossom™ Architecture

The `ProactiveSignal` type defines the exact shape of every future Cherry Blossom™ proactive message.

Key fields:
- `type` — what kind of awareness (upcoming birthday, event imminent, commitment at risk, etc.)
- `urgency` — celebrate / prepare / protect / nurture
- `message` — Cherry Blossom's voice (warm, first-person, specific)
- `offerMessage` — what Cherry Blossom is offering to help with
- `relevantDate` / `expiresAt` — time bounds
- `status` — pending / surfaced / acted / dismissed / expired (architecture hook)

Default awareness windows by significance:
- Life-Defining: 14 days
- High: 7 days
- Medium: 3 days
- Normal: 1 day

---

## Implemented This Sprint

- `lib/whole-life-context/types.ts` — complete Whole-Life Context™ canonical type surface
- `lib/whole-life-context/storage.ts` — localStorage persistence with domain-isolated keys
- `lib/whole-life-context/index.ts` — public barrel / single import point
- `lib/harmony-context/engine.ts` — Harmony Context Engine™ aggregator (pure, SSR-safe)
- `lib/founder-gps/types.ts` — extended with 8 new Whole-Life GPS signals + Reasoning Pipeline™ docs

## Deferred (Future Phases)

- Supabase persistence for Whole-Life Context™ (keys isolated for drop-in migration)
- Proactive Cherry Blossom™ delivery mechanism (notification, surfacing logic)
- Founder GPS™ recommendation engine (pipeline documented, types defined)
- Business Model™ registry and selection UI
- Business Performance™ capture UI
- Relationship Intelligence™ UI (add/edit relationships)
- Life Events™ UI (add/edit events)
- Life Commitments™ UI (add/edit recurring commitments)
- Personal Goals™ UI (add/edit goals with milestones)
- GPS Life Protection Mode™ visual indicator

## Future Integrations

- Google Calendar / Apple Calendar — Life Events™ bidirectional sync (architecture hook: `LifeEvent.date`)
- Supabase Row-Level Security — one RLS policy per Whole-Life Context™ table
- AI inference on `GpsContext` — Cherry Blossom™ reasoning over the full snapshot
- Anniversary / birthday gift suggestion engine reading `RelationshipPerson.giftIdeas`

---

## Usage Pattern (Future Consumer)

```typescript
import { assembleHarmonySnapshot } from "@/lib/harmony-context/engine"
import { getWholeLifeContext } from "@/lib/whole-life-context"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"

// In a server action or RSC:
const snapshot = assembleHarmonySnapshot({
  userId: session.user.id,
  harmonyContext: contextValue,        // from HarmonyProvider
  wholeLife: getWholeLifeContext(),     // from localStorage (client) or Supabase (future)
  esaResults: getEsaResults(),
  auditScore: getAuditScore(),
})

// Cherry Blossom™ reads:
snapshot.identity.preferredName
snapshot.business.entrepreneurSuccessScore
snapshot.life.relationships
snapshot.intelligence.upcomingLifeEvents
snapshot.intelligence.topPrioritySignal
snapshot.intelligence.inLifeProtectionMode
```
