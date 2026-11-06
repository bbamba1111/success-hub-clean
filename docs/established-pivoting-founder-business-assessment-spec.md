# Established & Pivoting Founder Business Assessment™ — Source of Truth

**Document ID:** BOSS-PIVOT-ASSESSMENT-001  
**Version:** 1.0  
**Date:** 2026-11-06  
**Status:** APPROVED PRODUCT DIRECTION; QUESTION FLOW AND RUNTIME INTEGRATION SPECIFIED; IMPLEMENTATION NOT YET VERIFIED  
**Owner:** Thought Leader Barbara  
**Product:** The BO$$  
**Related experience:** Work-Life Balance Reality Check™; My Boundary Blueprint™; Startup Business Fundamentals™

---

## 1. Purpose

The Established & Pivoting Founder Business Assessment™ helps a founder who already has an operating business understand:
- What is working and should be retained.
- Which operating practices are consistent and which are not.
- Where the business depends too heavily on the founder.
- Where business demands conflict with the founder's desired life and boundaries.
- Which business fundamentals need to be built, improved, validated, or redesigned.
- What work should be prioritized inside Decide & Design My Business Day™ and the 4-Hour Focused CEO Workday™.

This assessment is not a startup questionnaire. It must begin with the business the founder actually has. It must not assume that an established founder is missing all the fundamentals or that years in business prove mastery.

The assessment is a diagnostic input to BO$$ planning. It is not a pass/fail exam, a business valuation, a legal/compliance certification, or a guarantee of business performance.

## 2. Core architecture decision

**Pivoting founders do not take the Startup Business Readiness Assessment™ as their default business assessment.**

They take this Established & Pivoting Founder Business Assessment™. Its findings are mapped to the same universal Startup Business Fundamentals™ library, so founders across all stages can access and strengthen the same foundational disciplines.

The assessment uses the existing BO$$ architecture:
- **ESA (Entrepreneur Success Assessment™):** canonical operating-practice questions and 5-point frequency scale.
- **Eight Operating Pillars™:** canonical business operating taxonomy in `lib/entrepreneur-success/esa-registry.ts`.
- **Operating Practices™:** existing practices measured by ESA.
- **Business Blueprint™:** canonical structure for requirements, capabilities, assets, deliverables, business model applicability, and evidence.
- **Business Stage™:** contextual signal (Launch, Growth, Scale, Legacy), not a proxy for startup/pivoting pathway.
- **Business Context / Business Profile:** existing founder-provided and founder-approved business facts.
- **Startup Business Fundamentals™:** universal learning/application library, not a separate assessment taxonomy.
- **Seven Business Functions™:** work routing taxonomy.
- **Cherry Blossom™ / Executive Leadership Team™:** coordination and specialist support.
- **Founder GPS™:** canonical next-step engine when connected and supplied with required signals.

Do not create a competing 8-pillar taxonomy, a second ESA, a duplicate readiness engine, or a second next-step engine.

## 3. Important taxonomy clarification

The BO$$ has several different structures that serve different purposes. They must not be conflated:

| Structure | What it answers | Canonical source |
|---|---|---|
| Eight Operating Pillars™ | Where does an operating practice or business requirement belong? | `OPERATING_PILLARS` in ESA registry |
| Operating Practices™ | What repeatable business practice is being assessed or strengthened? | `OPERATING_PRACTICES` |
| ESA questions | How consistently is the founder practicing it? | `ASSESSMENT_QUESTIONS` |
| Business Blueprint capabilities/assets/deliverables | What must this particular business be able to do and what durable asset should exist? | Business Blueprint specification and registries |
| Startup Business Fundamentals™ | How can a founder learn and apply foundational business disciplines? | Universal Fundamentals specification/registry |
| Seven Business Functions™ | Where should approved work be organized and routed? | `lib/business-functions.ts` |
| Business Stage™ | What stage-related context should influence emphasis? | `lib/business-stage/business-stage.ts` |
| Startup / Pivoting pathway | What is the founder's current change context: build from the beginning or improve/redesign an existing business? | Founder-selected context; not a Business Stage |

The eight fundamentals presented in the founder-facing library are learning/navigation groupings. They must be mapped to existing Operating Pillars, Operating Practices, Business Blueprint capabilities/assets, and Business Functions. They must not replace the canonical taxonomy.

## 4. Assessment experience and sequence

### Step 1 — Confirm the founder's change context

Ask:

**Which best describes the work you want to do in your business right now?**
- I am starting a business and need to establish its foundations.
- I have an operating business and want to improve or redesign it.
- I am changing my business model, offers, audience, or direction.
- I am not sure yet; help me understand the best starting point.

This selection determines the assessment framing, not eligibility or Business Stage. A founder can choose different work modes for different functions later.

### Step 2 — Reuse known business context

Before asking questions, retrieve authorized and available facts from the founder's existing Business Profile, Business Context, Business Model Profile, prior assessments, submitted assets, and approved records.

Show a concise confirmation summary and ask the founder to correct or update it. Do not repeat questions when reliable current answers already exist.

Confirm or collect only missing/changed information:
- Business name and short description.
- Business model / type (use existing `BUSINESS_MODELS` IDs and Business Model Profile fields).
- Primary products/services/offers.
- Primary customer/client groups.
- Revenue model (use existing Business Model Profile).
- Current Business Stage™ (Launch, Growth, Scale, Legacy) where not already known.
- Team and support model (founder alone, contractors, employees, partners, AI/automation, hybrid).
- Geographic/jurisdiction context only where a specific administrative or regulatory research task requires it.

Do not infer Business Stage solely from revenue, age, headcount, or founder identity. The founder's selected stage is context and can be reviewed.

### Step 3 — Understand the pivot or redesign intention

Ask these questions in conversational blocks. Keep the answers concise and allow "not sure" or "not applicable" where appropriate.

**P1. What is prompting you to make a change now?**
- I am working too many hours / carrying too much.
- Revenue or profitability is inconsistent.
- Client attraction or sales is not working as intended.
- Delivery or operations depend too heavily on me.
- The business has grown more complex than the way it operates.
- My offers, audience, or business model no longer fit.
- I want to make room for a different direction or opportunity.
- I want the business to better support the life I intended.
- Other / not sure.

**P2. What do you want to be different when this work is successful?**
Open response. Prompt for desired business outcome and desired work-life outcome. Reuse the founder's saved intention and boundaries; ask only what is new or unclear.

**P3. What parts of the current business are working and should be protected or retained?**
Open response with optional examples: offers, client relationships, revenue streams, team strengths, reputation, intellectual property, delivery methods, systems, partnerships.

**P4. What parts of the business feel difficult, inconsistent, outdated, or unnecessarily dependent on you?**
Open response. Allow more than one.

**P5. What are you considering changing?**
Multi-select: business direction/model; ideal client/audience; offers/products/services; pricing/revenue model; marketing/client attraction; sales/conversion; delivery/client experience; team/roles; operations/workflows; tools/technology/AI; schedule/availability/boundaries; not sure; other.

**P6. What must not be disrupted while the business changes?**
Open response with optional examples: client commitments, core revenue, team stability, quality, reputation, intellectual property, cash position, personal non-negotiables.

**P7. Where does the business currently rely on you personally?**
Multi-select: finding leads; marketing/content; sales conversations; proposals/closing; service/product delivery; customer support; scheduling/admin; finance/approvals; people management; operations/problem solving; technology/tools; nearly everything; not sure. Follow with: "Which of these would you most like to stop carrying personally?"

**P8. What is your current operating workload?**
Collect founder estimate, not assumed fact:
- Typical hours worked per week (numeric range or "not sure").
- Days per week involved in business (1–7 or variable).
- How often work spills into evenings, weekends, or planned time off (never / rarely / sometimes / often / almost always).
- Biggest recurring interruption or source of rework (open response).

These are contextual diagnostic answers, not medical or psychological assessments and not a substitute for the separate Work-Life Balance Reality Check™.

### Step 4 — Run the existing Entrepreneur Success Assessment™

Use the existing `ASSESSMENT_QUESTIONS` and `OPERATING_PRACTICES` from `lib/entrepreneur-success/esa-registry.ts`. The current registry defines 20 active practice questions across the eight Operating Pillars™. Reuse their stable IDs and exact question text unless a separately approved content revision is made.

The existing question set and pillar mapping are:

| Operating Pillar™ | Existing question IDs / practices |
|---|---|
| Strategic Foundation™ | `q-offer-clarity` / `offer-clarity`; `q-vision-direction` / `vision-direction`; `q-operating-rules` / `operating-rules` |
| Revenue Engine™ | `q-marketing-consistency` / `marketing-consistency`; `q-sales-process` / `sales-process`; `q-pricing-confidence` / `pricing-confidence` |
| Operations & Systems™ | `q-delegation-practice` / `delegation-practice`; `q-sop-documentation` / `sop-documentation`; `q-ai-integration` / `ai-integration` |
| Financial Intelligence™ | `q-financial-review-rhythm` / `financial-review-rhythm`; `q-cash-flow-awareness` / `cash-flow-awareness` |
| People & Leadership™ | `q-hiring-practice` / `hiring-practice`; `q-leadership-development` / `leadership-development` |
| Client Excellence™ | `q-client-onboarding` / `client-onboarding`; `q-retention-referral` / `retention-referral` |
| Growth & Innovation™ | `q-thought-leadership` / `thought-leadership`; `q-continuous-learning` / `continuous-learning` |
| Human Sustainability™ | `q-protected-recovery` / `protected-recovery`; `q-daily-non-negotiables` / `daily-non-negotiables`; `q-boundary-practice` / `boundary-practice` |

**Response scale (reuse existing ESA / Work-Life Balance Audit scale):**
- Always = 100
- Often = 75
- Sometimes = 50
- Rarely = 25
- Never = 0

The ESA question type is frequency-based and refers to the past 30 days. Preserve this scale and time frame. Do not replace it with Startup Readiness status options or mix the two scales in one question.

The ESA registry defines the questions, pillar and practice relationships, and result types. It states that scores are computed and not stored raw in the result type. Verify the live persistence and scoring implementation before assuming where responses or history are stored. Do not invent table names or claim persistence that has not been verified.

### Step 5 — Ask conditional follow-ups only where they add diagnostic value

Do not add a second 20-question assessment or ask all founders every follow-up. Use the ESA answers, Business Context, and available evidence to determine which follow-up is useful.

For low-frequency answers (Sometimes / Rarely / Never), or when a founder flags a practice as a concern, ask a short practice-specific follow-up:

1. **What makes this difficult or inconsistent in your business today?**
2. **What happens when this practice is not in place?** (optional)
3. **Do you have an existing process, document, tool, or person responsible for it?** (reuse known records; ask only if unknown)
4. **What would make this practice easier or more sustainable?** (optional)

For high-frequency answers (Always / Often), do not assume excellence. Where the practice is important to the founder's pivot, ask for the existing asset or an example of how it works. This distinguishes routine activity from an effective, documented, repeatable practice.

Specific conditional probes:

| Practice | Ask when response/context indicates a gap | Evidence or artifact to look for |
|---|---|---|
| Offer Clarity™ | What has changed in the offer, audience, outcome, or scope? | Current offer description, scope, pricing page/proposal |
| Vision & Direction™ | Which recent decisions feel disconnected from the direction you want? | Vision/strategy document, current goals |
| Business Operating Rules™ | Which recurring decisions or exceptions still come back to you? | Operating rules, approval/decision map |
| Marketing Consistency™ | Which channels create qualified interest and which consume time without useful results? | Channel plan, content/lead records |
| Sales Process™ | Where do prospects stall or require repeated founder intervention? | Sales stages, CRM/pipeline, proposal/follow-up templates |
| Pricing Confidence™ | Does price reflect delivery effort, capacity, costs, and desired margin? | Pricing model, cost-to-deliver assumptions |
| Delegation Practice™ | Which repeatable work remains with the founder, and why? | Responsibility map, delegation records |
| SOP Documentation™ | Which recurring process breaks or requires the founder to explain it again? | SOPs, checklists, workflows |
| AI Integration™ | Which tools/agents are used, what tasks do they perform, and what authority do they have? | AI/tool inventory, permission records, workflows |
| Financial Review Rhythm™ | What numbers are reviewed, by whom, and how often? | Financial dashboard/reporting rhythm |
| Cash Flow Awareness™ | What upcoming cash timing or expense issue needs attention? | Cash-flow view, forecast, bookkeeping records |
| Hiring Practice™ | Are roles, responsibilities, and capacity clear across human and AI contributors? | Role descriptions, capacity map |
| Leadership Development™ | Which leadership conversations or decisions are being deferred? | Leadership cadence, team feedback (if available) |
| Client Onboarding™ | Where do clients experience confusion, delay, or repeated questions? | Onboarding journey, checklist, welcome materials |
| Retention & Referral™ | Why do clients return, leave, renew, or refer? | Renewal/retention/referral evidence |
| Thought Leadership™ | Which visibility activities build trust and opportunities without creating unsustainable content load? | Speaking/media/content assets, opportunity records |
| Continuous Learning™ | What recent learning has changed an actual business practice? | Improvement log, updated asset or process |
| Protected Recovery™ | What work routinely interrupts evenings, weekends, or planned recovery? | Calendar/operating boundaries (founder-provided) |
| Daily Non-Negotiables™ | Which personal non-negotiables are repeatedly displaced by business demands? | Founder-defined boundaries; no health inference |
| Boundary Practice™ | Which client, team, or operating expectations make it hard to end work? | Communication/availability rules, escalation rules |

### Step 6 — Map findings to the universal Startup Business Fundamentals™

The eight Startup Business Fundamentals™ are a founder-facing learning and application collection, not a competing canonical taxonomy. Map each finding through existing ESA Operating Practices and Business Blueprint capability/asset/deliverable relationships.

Use this crosswalk as a navigation aid, not as a replacement for the canonical Operating Pillars™:

| Universal Fundamentals™ grouping | Primary ESA pillars/practices to inspect |
|---|---|
| Business Identity & Direction | Strategic Foundation™: offer-clarity, vision-direction, operating-rules |
| Ideal Client & Market Understanding | Revenue Engine™: marketing-consistency; Strategic Foundation™ offer-clarity; existing Business Model Profile and market evidence |
| Business Message & 30-Second Pitch | Strategic Foundation™ offer-clarity; Revenue Engine™ marketing-consistency; Growth & Innovation™ thought-leadership |
| Product, Service & Offer Development | Strategic Foundation™ offer-clarity; Client Excellence™ client-onboarding and retention-referral; relevant Blueprint capabilities/assets |
| Pricing & Revenue Model | Revenue Engine™ pricing-confidence and sales-process; Financial Intelligence™ financial-review-rhythm and cash-flow-awareness |
| Marketing, Client Attraction & Sales | Revenue Engine™ marketing-consistency and sales-process; Growth & Innovation™ thought-leadership |
| Operations, Delivery & Technology | Operations & Systems™ delegation-practice, sop-documentation, ai-integration; Client Excellence™ onboarding; People & Leadership™ hiring-practice |
| Business Administration & Financial Foundations | Financial Intelligence™ financial-review-rhythm and cash-flow-awareness; Operations & Systems™ SOPs and operating rules; qualified-advisor requirements |

Where the existing Blueprint capability library provides a more specific, business-model-appropriate requirement, use it. The Business Blueprint specification is explicit that one taxonomy and multiple lenses should be used: ESA assesses operating practice; Blueprint defines what the business requires; Inventory identifies what exists.

### Step 7 — Assign a work mode to each finding

For each relevant practice or asset, recommend one of these modes:
- **Build:** a required practice or asset does not exist.
- **Improve:** something exists but is incomplete, inconsistent, or ineffective.
- **Validate:** an assumption, business hypothesis, or claimed result needs real-world evidence.
- **Redesign:** the current approach works poorly, creates unnecessary friction, or conflicts with the founder's desired life/boundaries.

Do not infer the mode from ESA score alone. Combine frequency response, founder explanation, evidence, business model applicability, operating context, and founder intention. "Always" does not automatically mean "mastered"; "Never" does not automatically mean the item is applicable.

### Step 8 — Prioritize, report, and plan

The assessment should produce a useful diagnostic, not a wall of scores or an automatic to-do list.

Recommended output:
1. **What is working and should be retained.**
2. **The most consequential operating gaps** (ranked with reasons).
3. **Business boundary collisions** (what in the current operating model conflicts with chosen boundaries).
4. **Fundamentals gap map** (the eight learning groupings, with only applicable findings shown).
5. **Recommended work mode** for each priority: Build / Improve / Validate / Redesign.
6. **Evidence and confidence**: founder-reported, asset supplied, reviewed, approved, or observed.
7. **Three proposed priority outcomes** for founder review—not automatically assigned.
8. **Dependencies and decisions** requiring founder input.
9. **What not to change yet**: working assets or practices that should be protected during the pivot.

Cherry Blossom™ proposes the sequence and appropriate Executive support. The founder can accept, edit, decline, or defer recommendations. Use Founder GPS™ for next-step ranking when the required integration is available; until then, do not describe recommendations as GPS-generated.

## 5. Scoring and interpretation rules

- Reuse the existing ESA 0/25/50/75/100 response scale and existing score computation. Do not create a second pivot score.
- Preserve the existing ESA overall and pillar result model.
- Scores are signals about reported practice frequency, not a complete measure of business health, profitability, mastery, or success.
- A low score identifies a topic for exploration, not an automatic diagnosis or assignment.
- A high score is not proof of quality or effectiveness. Evidence may still be needed.
- Do not compare founders or use score thresholds as pass/fail.
- Do not calculate a new composite "pivot readiness" score in this specification.
- Work-Life Balance Reality Check™ results and the immutable 15-area baseline remain separate from ESA scores. Do not merge the two instruments.

## 6. Work-life boundary integration

The pivoting business assessment complements—but does not replace—the Work-Life Balance Reality Check™.

The Reality Check identifies alignment between the founder's desired life and business reality. This assessment investigates business practices and operating conditions that may be contributing to misalignment.

Use founder-selected active boundaries from My Boundary Blueprint™ as constraints when proposing work. Do not recommend a solution that increases workload or availability without explicitly surfacing that conflict.

Potential collision signals include:
- Founder is the default owner for recurring tasks or every exception.
- Client expectations exceed the founder's declared availability.
- Pricing or scope creates more delivery work than capacity supports.
- Sales/marketing depends on constant manual activity.
- Team members lack decision authority or escalation rules.
- Workflows require repeated explanation or rework.
- Tools/AI create extra supervision rather than reducing friction.
- Financial visibility arrives too late for timely decisions.
- Work repeatedly spills into protected personal time.

These are diagnostic prompts, not assumptions. Confirm with the founder.

## 7. Privacy, permissions, and evidence

- Ask only for information needed to complete the assessment and plan relevant work.
- Reuse saved data only when the user and product permissions authorize that use.
- Treat financial, client, employee, and operational data as confidential business information.
- Distinguish founder statements, imported records, AI analysis, and founder decisions.
- Never fabricate financial metrics, client feedback, market validation, team capacity, or operating results.
- Do not infer sensitive personal or health information from workload or boundary responses.
- For legal, tax, accounting, insurance, licensing, or regulatory questions, identify the issue and prepare questions/research for a qualified professional; do not represent AI output as professional advice or certification.
- Preserve prior answers and assessment history; a new assessment is a new dated observation, not a silent overwrite.

## 8. Runtime integration and implementation sequence

### Phase A — Audit existing implementations
- Verify how ESA questions are rendered, answered, scored, and persisted.
- Verify assessment history and result storage.
- Verify Business Profile, Business Context, Business Model Profile, and approved fact retrieval.
- Verify Business Blueprint capability/asset/deliverable registries and applicability logic.
- Verify how assessment results reach Founder GPS™, Cherry Blossom™, work planning, and My Boundary Blueprint™.
- Verify the current Work-Life Balance Reality Check separately; do not assume shared storage or UI.

### Phase B — Pathway and context layer
- Add founder-selected assessment context (startup/build vs established/pivoting/redesign) only after checking whether an existing field already supports this.
- Do not alter the four Business Stage™ values or overload Business Stage as a pathway field.
- Reuse existing ESA question IDs and responses for pivoting founders.

### Phase C — Pivot context questions
- Implement P1–P8 as contextual questions only where saved data is absent or stale.
- Use stable IDs and schema only after auditing existing assessment storage conventions.
- Keep questions conversational and progressive; do not present all conditional probes at once.

### Phase D — Conditional gap exploration and mapping
- Trigger targeted practice follow-ups from ESA responses and context.
- Link findings to existing Operating Practice IDs and Blueprint capability/asset/deliverable IDs.
- Map findings to the eight universal Fundamentals learning groupings for navigation.
- Reuse existing Seven Business Functions and Executive IDs for work routing.

### Phase E — Report and workday integration
- Generate the diagnostic summary and proposed priority outcomes.
- Present proposed assignments in Decide & Design for founder approval.
- Carry accepted work into the 4-Hour Focused CEO Workday.
- Preserve workday boundaries, approvals, authority limits, and work history.

### Phase F — Verification
Test at minimum:
1. Established solo founder with strong offer and weak systems.
2. Established founder with team but unclear roles and decision rights.
3. Pivoting founder changing offer and target market while retaining existing clients.
4. Founder with revenue but poor pricing/cash-flow visibility.
5. Founder with consistent marketing but high founder-dependent delivery.
6. Founder with strong practices that should be protected, not rebuilt.
7. Founder unsure whether to pivot or improve current model.
8. Founder with non-applicable practices due to business model/team configuration.

Verify no repeated questions, no duplicate score, no forced rebuild, no assumptions of mastery, and no recommendations that violate active boundaries.

## 9. Acceptance criteria

1. Pivoting founders are routed to the Established & Pivoting Founder Business Assessment™, not automatically to the Startup Business Readiness Assessment™.
2. Startup founders continue to use the Startup Business Readiness Assessment™.
3. Both pathways map to the same universal Startup Business Fundamentals™ library.
4. The existing eight ESA Operating Pillars™ remain the canonical operating taxonomy.
5. The existing 20 ESA question IDs and 5-point frequency scale are reused; no duplicate ESA is created.
6. Pivot context questions are conditional and do not ask for facts already available and current.
7. The assessment distinguishes what works, what is missing, what is inconsistent, and what should be redesigned.
8. It distinguishes business foundation gaps from business boundary collisions.
9. It records evidence and confidence separately from founder-reported status.
10. It proposes Build / Improve / Validate / Redesign work modes at the practice/asset level.
11. It protects working business assets and current commitments during a pivot.
12. It produces no automatic assignments or external actions without founder approval and applicable permissions.
13. It respects active boundaries and the 4-Hour Focused CEO Workday.
14. No new business taxonomy, duplicate readiness score, or next-step engine is introduced.
15. The feature is not marked live until the application and data integrations are tested.

## 10. Canonical source references

- ESA registry: `lib/entrepreneur-success/esa-registry.ts`
- ESA types: `lib/entrepreneur-success/types.ts`
- Business Stage™: `lib/business-stage/business-stage.ts`
- Business Blueprint™ specification: `docs/business-blueprint-content-specification.md`
- Startup Readiness Assessment™: `docs/startup-business-readiness-assessment-spec.md`
- Universal Fundamentals™: `docs/startup-business-fundamentals-universal-access-spec.md`
- Fundamentals registry: `lib/startup-business-fundamentals/registry.ts`
- Seven Business Functions™: `lib/business-functions.ts`
- Executive registry: `lib/executive-team/executive-registry.ts`
- BO$$ source index: `docs/boss-source-of-truth-index.md`
