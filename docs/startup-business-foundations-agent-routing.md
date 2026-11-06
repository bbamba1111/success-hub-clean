# Startup Business Foundations™ — BO$$ Function, Executive & Deliverable Map

**Document ID:** BOSS-STARTUP-ROUTING-001  
**Version:** 1.0  
**Date:** 2026-11-06  
**Status:** APPROVED ROUTING DIRECTION; RUNTIME AGENT RETRIEVAL NOT YET VERIFIED  
**Owner:** Thought Leader Barbara  
**Parent specification:** [Startup Business Readiness Assessment™](./startup-business-readiness-assessment-spec.md)

---

## 1. Purpose

This document defines how the BO$$ should turn a founder's Startup Business Readiness Assessment™ into coordinated business-building work.

It maps each foundation gap to:
- The relevant BO$$ business function(s).
- The existing AI Executive or Executives responsible for specialist work.
- Cherry Blossom™'s orchestration responsibility.
- The expected business asset or deliverable.
- The founder decision or approval required.
- The knowledge source the agent should consult.

This is a routing and responsibility map. It does not assert that all executives, tools, or retrieval connections are currently live. The current executive registry marks the functional executives as architecture-stage definitions; their runtime AI conversations and knowledge access must be implemented and tested.

## 2. Existing BO$$ structure to reuse

### 2.1 Seven Business Functions™

Use the exact shared taxonomy in lib/business-functions.ts. Do not create a new top-level function or replace the seven-function model.

| # | Business Function | Stored key | Purpose |
|---|---|---|---|
| 1 | Client Attraction | attraction | Help the right people find you. |
| 2 | Sales & Conversion | sales | Help people say yes and buy. |
| 3 | Service or Product Delivery | delivery | Give people what you promised. |
| 4 | Business Operations | operations | Keep the business running each day. |
| 5 | Business Operations Design & Redesign | design | Make the way you work better. |
| 6 | Programs, Events & Experiences | experiences | Design, host, and follow up on programs, events, and live experiences. |
| 7 | Thought Leadership & Intellectual Property | thought_leadership | Share your ideas and build the intellectual property you own. |

These are interchangeable work areas, not sequential phases. A founder can work in any function during the 4-Hour Focused CEO Workday™. The system may recommend prerequisite order between individual assets, but must not turn the functions into a rigid daily sequence.

### 2.2 Existing Executive Leadership Team™

Use the existing IDs from lib/executive-team/executive-registry.ts.

| Executive ID | Executive | Primary domain |
|---|---|---|
| strategy | Strategy Executive™ | Business model, vision, offers, positioning, decisions, long-term strategy |
| marketing-brand | Marketing & Brand Executive™ | Brand, marketing, ideal-client attraction, PR, media, social, website, content, launches |
| sales | Sales Executive™ | Sales, partnerships, networking, conversion, client acquisition |
| operations | Operations Executive™ | SOPs, delegation, automation, AI implementation, workflows, technology, efficiency |
| finance | Finance Executive™ | Pricing, cash flow, KPIs, forecasting, budgeting |
| people-culture | People & Culture Executive™ | Hiring, team development, organizational design, human sustainability, operating rules, leadership, communication, capacity |
| client-success | Client Success Executive™ | Onboarding, retention, community, customer journey, testimonials |
| innovation | Innovation Executive™ | AI strategy, AI adoption, research, emerging technology, AI education |
| growth | Growth Executive™ | Leadership, communication, publishing, speaking, courses, personal brand development, learning |

**Cherry Blossom™ is not another specialist in the roster.** She is the founder's Chief of Staff & Executive Conductor™ and coordinates the team.

Do not invent new executive identities or create a parallel list. Do not route a task to a non-existent "startup agent."

## 3. Responsibility model

- **BO$$:** Owns the founder's business context, readiness inventory, business asset records, work assignments, dependencies, approval state, progress, and history.
- **Cherry Blossom™:** Understands the founder's context, explains the next step, selects and coordinates the appropriate Executive(s), prepares the founder for decisions, and keeps work within the founder's boundaries and permissions.
- **AI Executive:** Performs specialist research, analysis, drafting, planning, and other authorized work within its domain. It consults the approved source documents and the founder's authorized business records.
- **Founder:** Owns decisions and approvals. The founder approves the business concept, target client, offer, pricing, positioning, public claims, legal/financial commitments, and external communications.
- **4-Hour Focused CEO Workday™:** Provides the protected execution environment in which the founder reviews deliverables, makes decisions, approves work, and moves business priorities forward.

The system should avoid asking founders to repeat information already saved. Each Executive receives only the information needed for its assigned work and only when the founder's permissions allow it.

## 4. Foundation-to-function-to-executive map

| Startup foundation | BO$$ function(s) | Lead Executive | Supporting Executive(s) | Core deliverable(s) |
|---|---|---|---|---|
| Business identity, concept, purpose, business model | Business Operations Design & Redesign; Thought Leadership & IP | Strategy Executive™ | Innovation Executive™; Growth Executive™ | Business Concept & Direction Brief™; Business Model Canvas/Lean Model draft |
| Ideal client and market understanding | Client Attraction; Thought Leadership & IP | Marketing & Brand Executive™ | Strategy Executive™; Innovation Executive™; Sales Executive™ | Ideal Client Profile™; Market Research Brief™; Market Validation Plan™ |
| Client discovery and validation | Client Attraction; Sales & Conversion | Sales Executive™ | Marketing & Brand Executive™; Innovation Executive™ | Customer Discovery Guide; Interview Questions; Validation Findings Log |
| Business message and value proposition | Client Attraction; Thought Leadership & IP | Strategy Executive™ | Marketing & Brand Executive™; Growth Executive™ | Positioning Statement; Value Proposition; Messaging Brief |
| 30-second pitch | Client Attraction; Sales & Conversion; Thought Leadership & IP | Marketing & Brand Executive™ | Strategy Executive™; Sales Executive™; Growth Executive™ | 30-Second Business Introduction™; practice and rehearsal guide |
| Product/service offer | Sales & Conversion; Service or Product Delivery | Strategy Executive™ | Client Success Executive™; Finance Executive™; Operations Executive™ | Offer Blueprint™; scope and delivery definition |
| Pricing and revenue model | Sales & Conversion; Business Operations | Finance Executive™ | Strategy Executive™; Operations Executive™ | Pricing & Revenue Model™; cost-to-deliver worksheet; scenario assumptions |
| Client attraction and marketing | Client Attraction; Programs, Events & Experiences; Thought Leadership & IP | Marketing & Brand Executive™ | Growth Executive™; Sales Executive™; Innovation Executive™ | Client Attraction Plan; channel plan; campaign brief; content plan |
| Sales process and conversion | Sales & Conversion | Sales Executive™ | Marketing & Brand Executive™; Finance Executive™ | Sales Pathway; discovery call guide; proposal outline; follow-up sequence |
| Client onboarding and experience | Service or Product Delivery; Business Operations | Client Success Executive™ | Operations Executive™; Sales Executive™ | Client Journey Map; onboarding checklist; communication standards |
| Product/service delivery | Service or Product Delivery | Client Success Executive™ | Operations Executive™; Strategy Executive™ | Delivery Workflow; service/product delivery checklist; quality standards |
| Business workflows, tools, records, SOPs | Business Operations; Business Operations Design & Redesign | Operations Executive™ | Innovation Executive™; Client Success Executive™ | Initial Business Operating System Map™; SOPs; tool inventory; workflow diagrams |
| AI and automation opportunities | Business Operations; Business Operations Design & Redesign | Operations Executive™ | Innovation Executive™; People & Culture Executive™ | AI & Automation Opportunity Map; approved tool/agent inventory; human oversight rules |
| People, support, capacity, and professional network | Business Operations; Business Operations Design & Redesign | People & Culture Executive™ | Operations Executive™; Growth Executive™; Client Success Executive™ | Support & Capacity Map; responsibility map; hiring/delegation options |
| Administration, bookkeeping, cash flow, budgeting | Business Operations | Finance Executive™ | Operations Executive™ | Startup Financial Setup Checklist; budget; cash-flow assumptions; recordkeeping workflow |
| Legal structure, registration, licensing, insurance, contracts | Business Operations | Finance Executive™ (coordination only) | Operations Executive™ | Jurisdiction-specific research checklist; professional-advisor questions; compliance task list |
| Founder sustainability and operating boundaries | Business Operations Design & Redesign | Cherry Blossom™ (coordination) | People & Culture Executive™; Operations Executive™; Strategy Executive™ | Startup Boundary Design™; Founder Operating Rules; boundary-aware work plan |
| Speaking, publishing, media, and thought leadership | Thought Leadership & IP; Programs, Events & Experiences; Client Attraction | Growth Executive™ | Marketing & Brand Executive™; Strategy Executive™ | Speaker One Sheet; media/podcast target list; article outline; IP inventory |

### 4.1 Important role boundaries

- Finance Executive™ may organize financial assumptions, budgets, pricing scenarios, and questions for qualified professionals. It must not claim to provide individualized legal, tax, accounting, investment, or regulated financial advice.
- Operations Executive™ may identify and design workflow, tool, automation, and AI opportunities. It must not grant tools or agents authority that the founder has not approved.
- Marketing & Brand Executive™ and Growth Executive™ may draft public-facing materials. Publication, pitching, submission, and external communication require the appropriate approval and permission.
- Sales Executive™ may research and prepare prospecting, proposals, and follow-up. Sending or making commitments requires approved authority.
- Client Success Executive™ may design customer experience and delivery systems. It must not promise outcomes that the offer does not support.
- Strategy Executive™ may recommend positioning, business model, and offer choices. The founder decides.

## 5. Source-of-truth retrieval map

Agents must retrieve approved knowledge from the existing registries and the new source documents. They must not independently invent a second business knowledge base.

| Source | Canonical location | Agents that need it | How it is used |
|---|---|---|---|
| Startup readiness questions and status rules | docs/startup-business-readiness-assessment-spec.md | BO$$; Cherry Blossom™; all relevant Executives | Interpret responses, preserve status distinctions, avoid duplicate questions |
| Executive/function routing and deliverable map | This document | BO$$; Cherry Blossom™; all Executives | Route work, define ownership, expected outputs, approvals |
| Business concept definitions | lib/business-concepts/business-concepts-registry.ts | Cherry Blossom™; Strategy; Marketing & Brand; Sales; Growth; all agents as needed | Explain concepts consistently |
| Business principles and methodology | lib/excellence-intelligence/excellence-intelligence-registry.ts | Cherry Blossom™; all relevant Executives | Ground recommendations in approved business knowledge |
| Business Blueprint content specification | docs/business-blueprint-content-specification.md | BO$$; Cherry Blossom™; Strategy; Operations; Finance; other Executives as relevant | Apply content taxonomy, evidence, stage, dependencies, and asset standards |
| ESA Operating Pillars and Practices | lib/entrepreneur-success/esa-registry.ts | BO$$; Cherry Blossom™; Strategy; Operations; Finance; People & Culture; Client Success | Reuse the existing business capability/readiness taxonomy where applicable |
| Business Stage™ | lib/business-stage/business-stage.ts | BO$$; Cherry Blossom™; Founder GPS™; all Executives | Stage-aware guidance; resolve the existing 4-stage/9-value mapping before relying on conflicting values |
| Seven Business Functions | lib/business-functions.ts | BO$$; Cherry Blossom™; all Executives | Classify jobs, work, and outcomes using canonical function IDs |
| Executive roster and responsibilities | lib/executive-team/executive-registry.ts | BO$$; Cherry Blossom™; all Executives | Use canonical IDs, responsibilities, supported stages, and deliverable declarations |
| Founder and business context | founder_profiles, business_context_profiles, and approved context services | BO$$; Cherry Blossom™; authorized assigned Executives | Personalize work using current, permissioned founder data |
| Reality Check and life boundaries | reality_checks and approved Reality Check services | BO$$; Cherry Blossom™; authorized assigned Executives | Protect life priorities and original baseline; do not overwrite historic baseline |
| Founder operating rules and work history | Existing operating-rule and execution-history sources | BO$$; Cherry Blossom™; authorized assigned Executives | Keep assignments inside the founder's declared boundaries and learn from actual outcomes |

**Important:** The documentation map is not proof of runtime retrieval. The current architecture audit reports that the Business Concepts and Excellence Intelligence registries are not yet consumed by the live Founder GPS™ or Cherry Blossom™ reasoning path, and the functional executive records are not yet live AI agents. Runtime wiring must be verified separately.

## 6. Deliverable standard

Every business foundation deliverable must carry the following metadata:

- Stable asset/deliverable ID.
- Founder ID and business ID.
- Foundation category and related BO$$ business function(s).
- Lead Executive and supporting Executive(s).
- Status: identified, researching, drafting, founder review, approved, in use, review due.
- Source/provenance references for research-based claims.
- Founder inputs used and date captured.
- Assumptions, confidence, and validation needs.
- Dependencies and downstream assets affected.
- Founder approval state and timestamp.
- Version and change history.
- Boundary constraints relevant to creating or using the asset.

Do not store sensitive personal details in general business assets unless necessary and authorized. Keep personal life, health, family, and private financial context under appropriate access controls.

## 7. How the work is coordinated

1. The BO$$ records the assessment response and its status.
2. The existing readiness and recommendation logic (including Founder GPS™ and the Executive Capability Engine™ architecture seam) determines or proposes the next useful foundation to work on. Do not create a second "next best step" engine.
3. Cherry Blossom™ explains why the foundation matters and proposes the work.
4. Cherry Blossom™ assigns the work to the lead Executive, with supporting Executives where needed.
5. The Executive retrieves the relevant source documents, canonical registries, and authorized founder context.
6. The Executive researches, analyzes, and drafts the deliverable.
7. The BO$$ records the draft and dependencies.
8. The founder reviews and approves or requests changes.
9. Approved assets are saved in the founder's Business Foundations workspace and made available to authorized downstream functions.
10. Progress and decisions are recorded in the existing BO$$ job and history model.

The BO$$ should not create all missing assets at once. It should prioritize by dependencies, the founder's 90-day goal, customer and revenue needs, risks, and available time inside the chosen operating boundaries.

## 8. 4-Hour Focused CEO Workday™ integration

The 4-Hour Focused CEO Workday™ is the founder's protected execution environment, not a requirement that the founder personally perform every business-building task.

The system should:
- Prepare research and draft work for founder review.
- Show what an AI Executive is working on, what is ready, what is blocked, and what needs a founder decision.
- Allow the founder to move between the seven business functions.
- Fit founder work and decisions within the available 240-minute plan.
- Keep assignments aligned with approved boundaries and work rules.
- Avoid moving unfinished business work into protected personal time by default.
- Require explicit founder approval for external actions and commitments.

AI work outside the CEO Workday™ may continue only where the founder has granted the relevant authority and the action is permitted by the current system. The existence of an AI Executive assignment does not itself grant external-action authority.

## 9. Runtime implementation gaps to close

The architecture audit (docs/proactive-start-growth-scale-readiness-architecture-audit.md) identified existing components to reuse and integration gaps. Before claiming this routing is live, implementation must:

1. Wire the startup assessment responses to durable, per-founder storage with RLS.
2. Connect assessment statuses and business assets to the existing Business Context and readiness structures without duplicating fields or taxonomies.
3. Reconcile the canonical four-stage Business Stage™ registry with the conflicting nine-value Business Context stage field.
4. Extend the existing capability/readiness architecture rather than creating a new readiness engine.
5. Connect Business Concepts™ and Excellence Intelligence Engine™ retrieval to the appropriate live reasoning paths.
6. Connect Cherry Blossom™ to authorized founder context, readiness, business asset status, Founder GPS™ recommendations, and job progress.
7. Implement per-executive context retrieval using the canonical executive IDs and least-privilege access.
8. Ensure the job and deliverable lifecycle uses the existing BO$$ authority and audit-history mechanisms.
9. Test end-to-end on the isolated test environment before production changes.
10. Verify all external actions use explicit approved execution and are recorded.

Do not create a new database schema until the existing business_context_profiles, readiness/ESA stores, business asset registry, deliverable registry, jobs, and authority tables have been inspected for reusable fields and relationships.

## 10. Status

**Approved design direction:**
- One BO$$ supports startup/build and established/redesign pathways.
- The seven existing BO$$ business functions remain the top-level work taxonomy.
- Cherry Blossom™ coordinates; existing specialist Executives own specialist work.
- Startup readiness gaps should become assigned business-building work and approved durable assets.
- The founder remains the decision authority.
- The 4-Hour Focused CEO Workday™ is the protected founder execution environment.

**Proposed / not yet implemented:**
- The exact readiness-to-job automation.
- Runtime source retrieval for each Executive.
- Any new business asset persistence or UI.
- Any AI Executive tool access not already verified.
- Exact prioritization weights and readiness triggers.

No runtime agent, database, or UI change is made by this document alone.
