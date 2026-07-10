# The Harmony Lane™ Operating Manual v1.0

> **Internal architectural blueprint — not user-facing.**
> This is the single source of truth for the Work-Life Balance Operating System™.
> Every future feature MUST be checked against this manual before it is built.
> When the product and this manual disagree, update this manual deliberately —
> do not let them drift silently.

**Status legend used throughout:** `[BUILT]` shipped & functional · `[SCAFFOLD]`
UI/architecture only, not yet functional · `[PLANNED]` specified, not yet built.

---

## 0. Guiding Principle

Members are not managing time. They are **installing an operating system**.

- **Sunday designs the week.**
- **Monday–Thursday install the design** through practice and repetition.
- **Every fourth Sunday**, the platform pauses to review the previous 28 days,
  measure progress, and begin the next cycle of continuous improvement.

Everything in this platform serves that principle. If a feature does not help a
member design, install, live, or review their operating system, it does not
belong here.

---

## 1. The Two Synchronized Rhythms

The platform runs on two clocks at once.

### Rhythm 1 — Weekly Operating Rhythm
Every Sunday, members complete **Sunday Design Day™** to prepare for the coming
**Work-Life Balance Business Week™**. This is the recurring weekly installation
experience. It never skips.

### Rhythm 2 — 28-Day Installation Cycle
Every **fourth Sunday** includes a deeper **Operating System Review** that:
- measures progress across the previous 28 days, and
- launches the next 28-day growth cycle.

The 28-day review **enhances** the weekly rhythm; it never replaces it. The
weekly rhythm continues uninterrupted underneath it.

> **Architectural decision (resolved):** each member's cycle is anchored to
> their **first completed Sunday Design Day™**. Cycle-day math and "every fourth
> Sunday" detection count forward from that date. Missed weeks are **non-punitive**
> — the rhythm resumes without penalty on the member's next Sunday Design Day™.
> Full cycle engine implementation is Phase 4B.2.

---

## 2. The Work-Life Balance Time Hierarchy

| Unit | Name | Meaning |
| --- | --- | --- |
| Day | Work-Life Balance Business Day™ | The 7 operating segments, lived once per weekday. |
| Week | Work-Life Balance Business Week™ | Sunday designs it; Mon–Thu install it; Fri–Sat are Time Freedom™. |
| Month | 28-Day Installation Cycle | Four weeks; reviewed on every fourth Sunday. |
| Quarter | Work-Life Balance Business Quarter™ | Three 28-day cycles. `[PLANNED]` |
| Year | Work-Life Balance Business Year™ | The full arc of continuous improvement. `[PLANNED]` |

---

## 3. The Weekly Calendar

| Day | Role |
| --- | --- |
| **Sunday** | **Sunday Design Day™** — design the week ahead. |
| **Monday** | Live the design. End-of-segment window designs Tuesday. |
| **Tuesday** | Live the design. Designs Wednesday. |
| **Wednesday** | Live the design. Designs Thursday. |
| **Thursday** | Live the design. Concludes the work week. |
| **Friday** | **Time Freedom™** — recovery, relationships, recreation, learning, creativity. |
| **Saturday** | **Time Freedom™**. |

- **Live co-working** is offered **Monday–Thursday** only.
- **Power Down & Unplug™** remains available **every evening** as a self-guided
  experience, including Friday and Saturday.
- Members **do not redesign the week** Monday–Thursday. They live it, and use the
  short end-of-segment windows only to refine the *next* segment/day.

---

## 4. The Four Foundational Pillars (Primary Navigation)

The authenticated navigation contains **only four permanent destinations**, in
this order. Source of truth: `lib/navigation/primary-nav.ts`.

1. **Sunday Design Day™** → `/sunday-design-day` — the weekly installation experience. `[SCAFFOLD]`
2. **Live Today™** → `/live-today` — the primary daily operating workspace. `[BUILT]`
3. **Time Freedom™** → `/time-freedom` — the life the business supports. `[SCAFFOLD]`
4. **My Harmony™** → `/my-harmony` — results, memory, milestones, growth. `[SCAFFOLD]`

Legacy **Lead™ / Share™ / Grow™** groupings are retired from navigation but
preserved as developer-only `INTERNAL_MODULES`; their routes/components remain
operational and will be embedded into the four pillars over time:
- CEO modules → **Live Today™ ▸ 4-Hour Focused CEO Workday™**
- Progress/profile modules → **My Harmony™**
- Community module → **Time Freedom™**

---

## 5. Sunday Design Day™ — The Weekly Installation Experience

**Tagline:** *Design Tomorrow. Live It Tomorrow.™*
Four phases, completed in order, one expanded at a time. Route:
`/sunday-design-day`. Content config: `components/sunday-design-day/sdd-config.ts`.

### Phase 1 — Reality Check™
*Understand where you are before designing where you're going.*

**Weekly Review (every Sunday):**
- Weekly Wins
- Weekly Lessons
- Weekly Gratitude
- Review Current Operating Rules™
- Cherry Blossom Weekly Review™
- Select 1–3 Priority Focus Areas™
- Weekly Intention™
- Weekly Declaration™

**Every Fourth Sunday — 28-Day Review (added *before* the weekly review):**
Reflecting on the past 28 days —
- Work-Life Balance Audit™ (15 areas)
- Business Foundation Assessment™
- Cherry Blossom 28-Day Review™
- Trend Review
- Celebrate Progress
- Create New 28-Day Intention™

Then continue into the normal weekly Reality Check™. The 28-day review enhances,
never replaces, the weekly review.

> Note: the current scaffold lists "Business Foundation Assessment™ — First
> Sunday Only." Per this manual, the Business Foundation Assessment™ belongs in
> the **every-fourth-Sunday 28-Day Review** (with a first-time baseline on the
> member's first Sunday). Reconcile `sdd-config.ts` during Phase 4B.

### Phase 2 — Download & Delegate™
*Reduce overload before Monday begins.* Cherry Blossom guides members to move
work out of their head and route each item to one of:
- Delegate to AI
- Delegate to Team
- Delegate to Contractors
- Delegate to Clients
- Delegate to Family
- Eliminate
- Automate
- Delay

Members leave Sunday with **greater capacity than they started with.**

> Note: the current scaffold uses six categories and merges "Eliminate / Delay."
> Per this manual the canonical set is **eight**: the five delegation targets
> plus **Eliminate, Automate, Delay** as distinct actions. Reconcile during Phase 4B.

### Phase 3 — Design Tomorrow™ (the centerpiece)
*Design Monday before you live it.* Move through each operating segment in
sequence (see §6). Within **each** segment the member:
- Reviews **Cherry Blossom Guidance™**
- Selects or refines **one Operating Rule™**
- Completes the **Operating Planner™**
- Commits to tomorrow's **non-negotiable**

**Within the 4-Hour Focused CEO Workday™**, members also design:
- AI Augmentation Hour™
- AI Executive Leadership Team™ recommendations
- Business Operating Rule™
- Human Zone of Genius™ priorities
- Execution Friction™ improvements

The CEO planner designs **tomorrow's executive behavior** — not a generic to-do list.

### Phase 4 — Commit & Prepare™
*Prepare to live Monday.* Cherry Blossom summarizes:
- Weekly Intention™
- Weekly Declaration™
- Priority Focus Areas™
- Operating Rules™
- CEO Priorities™
- Time Freedom Commitment™

The member commits to honoring Sunday evening **Power Down & Unplug™** so Monday
begins intentionally.

---

## 6. The Seven Operating Segments (Work-Life Balance Business Day™)

Order matters — this is the lived sequence of a weekday. Source of truth:
`components/operating-planner/planner-config.ts`.

| # | Segment | Room mood | Default rule type |
| --- | --- | --- | --- |
| 1 | **Early Access & Flex Time™** | Quiet · Unhurried · Open | human |
| 2 | **Morning GIV•EN™ Routine** | Light · Fresh · Hopeful | human |
| 3 | **30-Minute Workday Movement™** | Energizing · Present · Alive | human |
| 4 | **Extended Healthy Hybrid Lunch™** | Nourishing · Warm · Restorative | human |
| 5 | **4-Hour Focused CEO Workday™** | Focused · Grounded · Executive | business |
| 6 | **Time Freedom™** | Golden · Spacious · Free | human |
| 7 | **Power Down & Unplug™** | Quiet · Warm · Restorative | human |

Each segment renders as its own calm "room" with its own surface tint, an
editorial workspace label, an atmosphere line, concierge Cherry Blossom
Guidance™, and its Operating Rule™ centerpiece.

**GIV•EN™** = Gratitude · Invitation · Vision · Emotional embodiment · Nurture.

### CEO Workday™ planning blocks (vertical sequence)
1. **AI Augmentation Hour™** — partner with AI to accelerate highest-leverage work.
2. **AI Executive Leadership Team™** — consult AI executive advisors for strategy/decisions.
3. **Business Operating Rule™** — the rule for meetings, delegation, decisions.
4. **Human Zone of Genius™** — where only the human can create value.
5. **Execution Friction™** — identify and remove what slows execution.

---

## 7. Operating Rules™

- One clear rule per segment, member-set, of type **human** or **business**.
- Rules **persist across the whole week** unless the member intentionally
  changes them during a Mon–Thu end-of-segment planning window.
- Stated as a commitment, not a task. Presented as the centerpiece of each room.
- Storage: `operating_rules` (Supabase) via `lib/operating-rules/storage.ts`.
  Fields include rule text, rule type, and rule scope. `[BUILT]`

---

## 8. The Behavior Installation Model™

This is the core methodology of the Harmony Lane™ Operating System — and one of
its defining pieces of intellectual property. It explains **how** the platform
transforms principles into sustainable founder behavior. Every layer feeds the
next.

1. **Principles™** — The beliefs that guide how we operate: Human
   Sustainability™, 80/20 Thinking, the Progress Principle™, and Time Freedom™.
   *(Why we operate the way we do.)*
2. **Operating Rules™** — The strategic standards founders establish during
   Sunday Design Day™. They answer **"How will I operate?"** and persist across
   the week until intentionally revised on a future Sunday. *(The standard.)*
3. **Daily Non-Negotiables™** — The specific daily commitments that bring each
   Operating Rule™ to life. They answer **"What will I absolutely honor today?"**
   and are practiced one day at a time. *(The commitment.)*
4. **Practice & Repetition™** — Consistently honoring those Non-Negotiables™
   Monday through Thursday. Live Today™ surfaces each day's rule + non-negotiable
   and captures a lightweight honor check at the end of every segment. *(The reps.)*
5. **Identity Installation™** — Over time, repeated behaviors become habits, and
   habits become the founder's natural way of operating. The operating system is
   no longer something they *use* — it is who they have *become*. *(The outcome.)*

**The distinction that anchors the model:** Operating Rules™ are the *standard*
("how will I operate?"); Daily Non-Negotiables™ are the *practice* ("what will I
absolutely honor today?"). Rules are designed on Sunday and are durable;
Non-Negotiables are lived daily and are what actually install the identity.

The experience must always feel warm, encouraging, premium, calm, and
editorial — an executive guide, never a punitive productivity tracker. The model
reinforces behavior through practice and repetition, never guilt.

- **Sunday Review of the model:** During each Sunday Design Day™, members review
  their Operating Rules™ (**Keep · Refine · Replace**), then author new Daily
  Non-Negotiables™ for the upcoming Work-Life Balance Business Week™.

### 8.1 The Harmony Context Engine™ `[BUILT]` (Phase 4B.2)

The single, centralized operating-context layer that every workspace consumes.
It is the reason the platform can feel like one intelligent Operating System
rather than a set of disconnected pages. Any surface — Live Today™, Cherry
Blossom™, the AI Executive Leadership Team™, My Harmony™ — asks the same engine
"where is this member right now, and what did they design?" and gets one
normalized answer.

- **What it composes:** it merges the live **operating-engine** snapshot (current
  day, current segment/block, time of day, greeting, member first name) with the
  **installed week** from Sunday Design Day™ (Weekly Intention™, Priority Focus
  Areas™, per-segment Operating Rules™ + Daily Non-Negotiables™, and CEO Workday™
  context) into a single typed context object.
- **What it exposes:** `ready`, `hasDesignedWeek`, `firstName`, `timeOfDay`,
  `currentSegment` (mapped to the designed segment), `segments[]`,
  `weeklyIntention`, `focusAreas[]`, and `ceo` priorities.
- **Files:** provider `components/harmony-context/harmony-context-provider.tsx`;
  types `lib/harmony-context/types.ts`; block↔segment mapping
  `lib/harmony-context/segment-map.ts`. It reads the installed week via
  `lib/sunday-design-day/installed-week.ts`.
- **Design intent:** workspaces should **never** re-derive time-of-day, current
  segment, or Sunday's design on their own. They consume the engine so the whole
  system stays consistent. Session-only this pass; cross-device persistence is a
  later phase.

### 8.2 Cherry Blossom™ as the Executive Operating Guide™ `[BUILT]` (Phase 4B.2)

Cherry Blossom™ is context-aware, not a generic chatbot. Given the Harmony
Context Engine™, she reinforces the member's own design instead of asking what
they want to do.

- **Guidance module:** `lib/harmony-context/cherry-blossom-guidance.ts` — a pure
  function mapping the context (time of day, whether the week is designed, the
  active segment) to a warm, reinforcing greeting + message.
- **Tone:** premium, calm, editorial, encouraging — never punitive, never robotic.
  Reflection, memory, and true conversational chat arrive in a later phase.

### 8.3 The Executive Leadership Team™ `[BUILT — architecture]` (Phase 4B.2)

A permanent, private executive team for the founder-led business. It is **not** a
directory of assistants the member browses — it is a leadership structure that
Cherry Blossom™ **conducts** on the member's behalf.

- **Cherry Blossom™ = Chief of Staff & Executive Conductor™.** She is the member's
  only primary guide. She reads the Harmony Context Engine™ (§8.1) to know where
  the founder is, then introduces the right executive at the right moment. The
  founder never has to choose or manage a roster.
- **Nine executive functions, always in residence:** each represents a permanent
  leadership function (Strategy, Marketing & Brand, Sales, Operations, Finance,
  People & Culture, plus additional functions) with a title, mandate,
  responsibilities, and example deliverables.
- **Single source of truth:** `lib/executive-team/executive-registry.ts`. Every
  surface (the boardroom page, Live Today™ recommendations, future chat) reads the
  same registry so the team stays consistent everywhere.
- **Boardroom page:** `/executive-leadership-team` — an editorial, on-brand
  presentation of the Conductor + the executives. Components:
  `components/executive-team/executive-card.tsx` and `conductor-panel.tsx`.
- **This pass = architecture + presentation only.** Recommendation logic (matching
  CEO priorities to the right executive) and per-executive conversation are later
  phases. The Live Today™ panel links into the boardroom as the entry point.

### 8.4 The Professional Advisory Network™ `[BUILT — architecture]` (Phase 5.2)

The second layer of the Harmony Lane™ Leadership Ecosystem. The defining
distinction from §8.3: **the executives run the business; the advisors protect
it.** Advisors are trusted specialists Cherry Blossom™ and the executives bring
in when legal, financial, funding, insurance, or compliance expertise is needed.
Members do **not** browse advisors during normal workflow — Cherry Blossom™
introduces them contextually.

- **Five advisors, on call:** **AI Legal Advisor™**, **Tax Advisor™**, **Business
  Credit Advisor™**, **Insurance Advisor™**, and **Compliance Advisor™** — each
  covering an area that protects a founder-led business.
- **Education & drafting, not licensed advice.** Every advisor carries a
  **Professional Review Notice** that must accompany its outputs. Advisors help
  founders understand, prepare, and get ready — then hand off to a licensed
  professional. This is a protection layer, not a substitute for counsel.
- **Executive integration:** each advisor declares `relatedExecutives` (e.g. Legal
  ↔ People & Culture / Operations / Strategy; Business Credit ↔ Finance /
  Strategy; Tax ↔ Finance; Compliance ↔ People & Culture / Operations; Insurance
  ↔ Operations / Finance). Advisors are brought in **by** the executives.
- **Single source of truth:** `lib/advisory-network/advisor-registry.ts`. Each
  advisor declares `mission`, `primaryResponsibilities`, `typicalFounderQuestions`,
  `availableDeliverables`, `professionalReviewNotice`, `recommendationTriggers`,
  `relatedExecutives`, and a reserved `futureAiEndpoint`.
- **Network page:** `/professional-advisory-network` — an editorial, on-brand
  presentation matching the Executive boardroom's visual language. Component:
  `components/advisory-network/advisor-card.tsx`. The Executive Leadership Team™
  page cross-links to it as a companion layer.
- **This pass = architecture + presentation only.** No AI conversations,
  deliverable generation, Business Stage™/Comprehension™ adaptation, or the
  Specialist/Partner Networks™ — those belong to later phases.

### 8.5 The Deliverable Output Architecture™ `[BUILT — architecture]` (Phase 5.3)

The universal output layer every Executive™, Advisor™, Specialist™, and future AI
generator publishes through. Built as **infrastructure, not a document feature.**

**Core principle:** a deliverable **exists once** as **Structured Business
Content™** and is **rendered many ways**. A PDF is simply one possible output —
nothing is ever tied to a single file type. The flow is:

```
Executive / Advisor → Deliverable Engine™ → Structured Business Content™
→ Render Engine™ → Distribution Engine™
```

**The four engines:**

1. **Deliverable Engine™** — creates and manages structured business content.
   Deliverables are structured **fields** (sections + typed content blocks), not
   static text. Files: `lib/output-architecture/deliverable-registry.ts` (the
   single source of truth — `StructuredBusinessContent`, `Deliverable`, and a
   representative seed set spanning both executives and advisors).
2. **Render Engine™** — transforms one content model into many formats. Thirteen
   renderers: PDF, Editable Document, Email, Presentation, Spreadsheet, Dashboard
   Card, Checklist, Calendar, Web Page, Markdown, Slack, Teams, Notion. New
   renderers are added by appending to the catalog. File:
   `lib/output-architecture/render-engine.ts`.
3. **Distribution Engine™** — delivers rendered output to the right destination:
   Download, Print, Email, Copy, Save to Harmony Library™, Share with Team, Slack,
   Teams, Notion, and future integrations. Decoupled from rendering. File:
   `lib/output-architecture/distribution-engine.ts`.
4. **Storage Engine™** — owns templates, drafts, revisions, final versions, and
   (future) version history. Types only this phase. File:
   `lib/output-architecture/storage-engine.ts`.

- **Execution paths (delivery levels):** every deliverable declares one or more of
  **DIY · AI Assisted · Done With You · Done For You · Certified Partner**
  (`lib/output-architecture/execution-engine.ts`). No workflow logic this phase.
- **Deliverable definition fields:** `id`, `name`, `category`, `ownerType`,
  `ownerId`, `description`, `deliveryLevel`, `estimatedTime`,
  `requiresProfessionalReview`, `professionalNotice`, `supportedRenderers[]`,
  `recommendedRenderer`, `distributionOptions[]`, `executionOptions[]`, optional
  `content`, `futureGenerator`, `status`.
- **Reusable preview:** `components/output-architecture/deliverable-preview.tsx`
  shows name, owner, description, delivery level, recommended + available
  renderers, distribution options, and a Professional Review badge — **no
  generation, no download buttons.** Reference page: `/output-architecture`.
- **This pass = architecture only.** No AI generation, real rendering, live
  distribution, or persistence. Every future deliverable plugs in **without a
  redesign**.

### 8.6 Business Stage™ `[BUILT — signal]` (Phase 5.4)

A first-class **contextual signal** describing where the founder-led business is
in its journey. It is **not** a plan tier, an upsell, or a gate — **the member is
always in control**, sees the full team and every capability, and changes stage
only by their own choice. The whole platform is designed to become
**stage-aware** so guidance can adapt to the founder's reality.

- **The four stages:** **Launch™** (0–1 yr — build the foundation), **Growth™**
  (1–3 yr — gain traction & first hires), **Scale™** (3–7 yr — systemize & lead a
  team), **Legacy™** (7+ yr — optimize, protect, and transfer). Each is a
  contextual lens, never a ranking.
- **Single source of truth:** `lib/business-stage/business-stage.ts` —
  `BusinessStage` union, `ALL_BUSINESS_STAGES`, and per-stage definitions
  (`label`, `tagline`, `yearsRange`, `description`, `focus`,
  `recommendedFocusAreas`, `recommendedExecutives`, `recommendedAdvisors`). Stage
  selection is session-only via `business-stage-store.ts` (default **Growth™**),
  which broadcasts a change event so all surfaces stay in sync.
- **Harmony Context Engine™ integration (§8.1):** the engine now exposes
  `businessStage`, `businessStageDescription`, `recommendedFocusAreas`,
  `recommendedExecutives`, `recommendedAdvisors`, and `setBusinessStage`. These are
  **architecture hooks** — no recommendation logic consumes them yet.
- **Registry integration:** every Executive™ carries
  `supportedBusinessStages` (**all executives support all stages** — the founder
  always has the full team); every Advisor™ carries `recommendedBusinessStages`
  (emphasis, not availability); every Deliverable™ carries
  `recommendedBusinessStages` (relevance, not restriction).
- **Harmony Academy™ placeholders:** `lib/harmony-academy/academy.ts` maps future
  learning tracks to each stage. Structure only — **no lessons or content yet.**
- **UX:** `components/business-stage/business-stage-card.tsx` lets the founder view
  and change their stage; hosted on the Member Profile™ page at `/member-profile`.
- **This pass = the signal + wiring only.** Stage-aware recommendations, adaptive
  Cherry Blossom™ guidance, Business Comprehension™, and the Academy™ content layer
  are later phases.

---

## 9. Live Today™ — Living the Design (Mon–Thu)

- The primary daily operating workspace. Engine-driven daily rhythm of Operating
  Experiences™. Route: `/live-today`. `[BUILT]`
- Members **do not redesign the week here** — they live the operating system
  they designed on Sunday.
- **Today's Operating System™ `[BUILT]` (Phase 4B.2):** the intelligence surface
  of Live Today™. Cherry Blossom™ reads the **Harmony Context Engine™** (see §8.1)
  to know exactly where the member is inside the Operating System and reinforces
  what they designed on Sunday. She never asks what to do today — the Operating
  System already knows.
  - **Context-aware greeting:** a time-of-day greeting that uses the member's real
    first name (never a placeholder) and adapts to whether the week is designed and
    which segment is active.
  - **Current Operating Segment™ ("Today, Right Now"):** the active segment with
    **Today's Operating Rule™** (the strategic standard) and **Today's
    Non-Negotiable™** (the commitment lived today), plus the **Weekly Intention™**
    and **Priority Focus Areas™** carried from Sunday.
  - **Full designed day:** every segment with its Rule™ + Non-Negotiable™, the
    current one highlighted with a **Now** badge.
  - **AI Executive Leadership Team™:** placeholder panel — recommendation logic
    (matching CEO priorities to an AI Executive Advisor™) arrives later.
  - Component: `components/live-today/todays-operating-system.tsx`.
  - **End-of-segment accountability check:** at the close of each segment, members
    answer *"Did you honor today's Non-Negotiable™?"* — **Yes / Partially / Not
    Yet**. No scoring, coaching, journaling, or streaks; the response is simply
    captured (`lib/sunday-design-day/non-negotiable-log.ts`, session-only) for
    later phases. Reflection & coaching arrive in a later phase.
- **End-of-segment planning window (5–7 minutes) `[PLANNED]`:** at the close of
  each segment, members may refine *tomorrow's* corresponding segment.
  - Monday designs Tuesday · Tuesday designs Wednesday · Wednesday designs
    Thursday · Thursday concludes the week.
- Operating Rules™ carry forward untouched unless changed in one of these windows.

---

## 10. Time Freedom™ (Fri–Sat + the reward at each day's end)

- The life the business exists to support. Route: `/time-freedom`. `[SCAFFOLD]`
- Friday and Saturday are **not workdays** — they are dedicated to recovery,
  relationships, recreation, learning, creativity, and life.
- **Time Freedom Moments™** — members share and celebrate reclaimed life with the
  community (migrated from the legacy Share™ module).
- Visual register: golden-hour warmth (sunset sand), not a cool spa.

---

## 11. My Harmony™ (Results, Memory, Growth)

- The member's long arc: results, memory, milestones, and **Human Sustainability™**.
  Route: `/my-harmony`. `[SCAFFOLD]`
- Composes: **My Results™** (Reality Check™ trends), **Cherry Blossom Memory
  Vault™**, **Preview Results™**, **Welcome & Onboarding™** (migrated from Grow™).
- This is where 28-day trend data and progress celebration surface over time.

---

## 12. Cherry Blossom™ — The Guiding Intelligence

Cherry Blossom is the platform's calm, concierge voice and memory.

- **Guidance™** — warm, time-aware orientation at the top of every phase and room.
- **Reviews™** — Weekly Review™ and 28-Day Review™ reflections.
- **Memory Vault™** — what Cherry Blossom remembers about the member's journey.
- **Business Chat™** — contextual conversation, destined to be embedded in every
  workspace rather than living as a standalone destination.
- **Voice:** calm, editorial, non-judgmental, first-person-friendly. Never
  "SaaS," never pushy. Softness comes from language and space, not decoration.

---

## 13. The AI Executive Leadership Team™

- A set of AI executive advisors consulted during the CEO Workday™ for strategy
  and decisions (migrated from the legacy AI Executive Team™ module).
- Purpose: augment the member's executive behavior during the AI Augmentation
  Hour™ and inform the Business Operating Rule™ and Human Zone of Genius™ choices.
- `[SCAFFOLD]` — to be wired into Design Tomorrow™ ▸ CEO Workday™.

---

## 14. Design Language — The Harmony Lane™

Established in the foundation pass; every workspace inherits it by composition.

- **Radius hierarchy (restrained luxury):** forms 6px → buttons/inputs 8px →
  cards 10px → workspace panels 14px → hero/major surfaces 18px. Pills are for
  **status only**. Base token `--radius: 0.625rem`.
- **Material system:** `.harmony-surface`, `.harmony-panel`, `.harmony-workspace`,
  `.harmony-glass`, `.harmony-divider`, `.harmony-section`. Compose these instead
  of hand-rolling glass/borders/radii.
- **Typography:** Playfair Display → hero headlines & primary titles · Montserrat
  → UI/nav/labels/buttons/body · Lora → intentions, declarations, reflections.
- **Principles:** editorial spacing over dense dashboards; glass and whitespace
  for softness, not oversized corners; calm, linear navigation; boutique-hotel /
  executive-retreat feel, never generic startup SaaS.

---

## 15. Data & Persistence (current)

Backed by Supabase. Known tables/fields relevant to the operating system:
- `reality_checks` — declaration, weekly reflection, selected priority areas,
  life value scores, overall score, week key.
- `operating_rules` — per-segment rules (text, type, scope).
- `personalized_journeys.delegation_plan` (jsonb) — Download & Delegate™ data.
- `assessments` / `business_foundations` — Business Foundation Assessment™.

Principle: never use localStorage for real persistence; scope every user query
by the authenticated user; use parameterized queries and RLS.

---

## 16. Implementation Roadmap (living)

- **4A `[DONE]`** — Sunday Design Day™ architecture/scaffold (placeholders).
- **4A.1 `[DONE]`** — Operating System IA reset to the four pillars.
- **4B.1 `[DONE]`** — Functional Sunday Design Day™ engine (four phases,
  validation-gated, session-only persistence).
- **4B.1.5 `[DONE]`** — Install Operating Rules™ & Daily Non-Negotiables™:
  captured the Non-Negotiable™ per segment on Sunday, surfaced Today's Operating
  Rule™ + Non-Negotiable™ in Live Today™, and added the end-of-segment honor
  check (see §8, §9). Session-only; anchoring resolved in §1.
- **4B.2 `[DONE]`** — The Harmony Context Engine™ (§8.1): one centralized
  operating-context layer composing the engine snapshot with Sunday's installed
  week; Cherry Blossom™ context-aware guidance (§8.2); and the upgraded Today's
  Operating System™ surface in Live Today™ (context greeting, Current Operating
  Segment™, full designed day, AI Executive Team™ placeholder). Session-only.
- **5.1 `[DONE]`** — The Executive Leadership Team™ (§8.3): centralized executive
  registry (Cherry Blossom™ Conductor + nine executive functions) and the
  editorial boardroom at `/executive-leadership-team`. Architecture + presentation.
- **5.2 `[DONE]`** — The Professional Advisory Network™ (§8.4): centralized advisor
  registry (Legal, Tax, Business Credit, Insurance, Compliance), executive linkage,
  Professional Review Notices, and the network page at
  `/professional-advisory-network`. Architecture + presentation.
- **5.3 `[DONE]`** — The Deliverable Output Architecture™ (§8.5): the four-engine
  model (Deliverable, Render, Distribution, Storage), Structured Business Content™,
  the deliverable registry, execution paths, the reusable Deliverable Preview, and
  the reference page at `/output-architecture`. Architecture only.
- **5.4 `[DONE]`** — Business Stage™ (§8.6): the contextual stage signal (Launch,
  Growth, Scale, Legacy), the stage registry + session store, Harmony Context
  Engine™ hooks, registry integration (executives/advisors/deliverables), Harmony
  Academy™ placeholders, and the Business Stage™ card on `/member-profile`. Signal
  + wiring only; stage-aware recommendations are a later phase.
- **4B.3 / Next `[NEXT]`** — Cross-device persistence; 28-day cycle logic; Mon–Thu
  end-of-segment planning windows; deeper Cherry Blossom & AI Executive
  intelligence; reflection/coaching; reconciliation notes flagged in §5.
- **Later** — The Deliverables Engine™ generation layer (AI-authored Structured
  Business Content™) + real renderers/distribution integrations (Google Docs, Word,
  PDF, Slack, Teams, Notion, Harmony Library™); Specialist & Partner Networks™;
  Business Stage™ & Business Comprehension™ adaptation; AI conversations across the
  ecosystem; Time Freedom™ & My Harmony™ full builds; Quarter/Year layers.

---

*End of The Harmony Lane™ Operating Manual v1.0.*
