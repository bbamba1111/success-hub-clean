# The BO$$ — Source-of-Truth Index

**Document ID:** BOSS-SOT-INDEX-001  
**Version:** 1.0  
**Updated:** 2026-11-06  
**Status:** Active documentation index for the feature/seven-functions development branch  
**Owner:** Thought Leader Barbara

This index tells builders, Cherry Blossom™, and AI Executives which source to consult. It prevents competing definitions, duplicate engines, and undocumented decisions.

## 1. Authority rules

When sources conflict, use this order:

1. Barbara's latest explicit decision in the current project work.
2. The approved BO$$ Decision Register and the most specific approved product specification.
3. The current Master Blueprint and Harmony Lane™ operating rules.
4. Canonical code registries and verified application/database behavior.
5. Architecture audits and technical handoff reports (they describe the state at the date they were produced; they are not automatically current after later changes).
6. Older drafts, screenshots, and assistant-generated proposals.

Every source must distinguish:
- **CONFIRMED / APPROVED:** Barbara explicitly approved the rule or direction.
- **CURRENT IMPLEMENTATION:** verified in the current branch or environment.
- **PROPOSED:** recommended, not yet approved.
- **UNRESOLVED:** requires a decision or technical verification.

Do not convert a proposal or an old audit observation into a current product rule without verification.

## 2. Canonical source map

| Subject | Canonical source | Authority |
|---|---|---|
| Overall BO$$ product and operating model | Master Blueprint / Harmony Lane™ operating manual | Product and operating rules |
| Current day/week rhythm and founder boundaries | docs/harmony-lane-operating-manual.md plus approved Master Blueprint | Founder operating model |
| Seven Business Functions™ | lib/business-functions.ts | Canonical function IDs, labels, purpose, executive routing |
| Executive roster and responsibilities | lib/executive-team/executive-registry.ts | Canonical executive IDs, roles, responsibilities, deliverables |
| Business concepts and plain-language definitions | lib/business-concepts/business-concepts-registry.ts | Canonical concept definitions |
| Business principles and methodology | lib/excellence-intelligence/excellence-intelligence-registry.ts | Canonical business knowledge content |
| Business knowledge content rules | docs/business-blueprint-content-specification.md | Content taxonomy, evidence, dependencies, provenance |
| Business-building research intake | docs/business-building-source-extraction-matrix.md | Research extraction and approval before promotion |
| Business stage | lib/business-stage/business-stage.ts | Canonical four-stage registry; known mapping conflict must be resolved before relying on other stage fields |
| Business capability / readiness questions | lib/entrepreneur-success/esa-registry.ts | Existing ESA Operating Pillars and Practices; reuse rather than duplicate |
| Existing architecture and integration gaps | docs/proactive-start-growth-scale-readiness-architecture-audit.md | Dated technical audit; verify before implementation |
| Startup assessment questions and status model | docs/startup-business-readiness-assessment-spec.md | Startup founder readiness assessment |
| Startup foundation routing and deliverables | docs/startup-business-foundations-agent-routing.md | BO$$ function and Executive responsibility map |
| Reality Check experience, offer and report | Latest approved Reality Check source-of-truth document and current approved product decisions | Reality Check questions, delivery, offer, report and entitlements |

## 3. Startup pathway documents added November 6, 2026

### Startup Business Readiness Assessment™

File: docs/startup-business-readiness-assessment-spec.md

Defines:
- Eight business foundation categories.
- Six distinct readiness statuses.
- Core assessment questions and conditional follow-ups.
- Business assets and deliverables expected from each foundation.
- Startup Boundary Design™.
- Assessment/report timing and status rules.
- Provenance, approval, and safety guardrails.

### Startup Business Foundations™ — BO$$ Function, Executive & Deliverable Map

File: docs/startup-business-foundations-agent-routing.md

Defines:
- The existing seven-function taxonomy.
- The existing Executive Leadership Team™ IDs.
- Specialist ownership and support responsibilities.
- Deliverables for each foundation.
- Which knowledge sources each agent should consult.
- Founder approval boundaries.
- Runtime integration gaps.

These documents are the design source of truth for the startup pathway. They do not, by themselves, mean the assessment, agents, or retrieval connections are implemented.

## 4. Required agent knowledge behavior

### BO$$
- Load the current founder pathway, assessment responses, approved assets, dependencies, active boundaries, and job history.
- Use canonical IDs from existing registries.
- Do not create a parallel taxonomy, new readiness engine, duplicate knowledge engine, or duplicate next-step engine.
- Treat founder-reported assets differently from reviewed and founder-approved assets.

### Cherry Blossom™
- Be the founder's primary guide and Executive Conductor™.
- Explain what is missing and why it matters in accessible language.
- Route work to the correct existing Executive using the routing map.
- Preserve continuity and avoid asking questions already answered.
- Coordinate work within the founder's boundaries and permissions.

### Functional AI Executives
- Retrieve only the source documents and founder context relevant to their assigned work.
- Use the canonical business concept and Excellence Intelligence content where applicable.
- Separate evidence, assumptions, recommendations, and founder decisions.
- Produce the defined deliverable with provenance and dependencies.
- Never treat a draft as founder-approved or take external action without required authority.

### Founder GPS™
- Remains the existing canonical next-step recommendation engine.
- May use readiness and dependency signals after the relevant data is connected and verified.
- Do not create a second readiness navigator or "next best step" engine.

## 5. Runtime retrieval status

**Documentation established:** startup assessment and routing documents are stored in the repository on feature/seven-functions.

**Not yet established by this documentation change:**
- Runtime document retrieval or prompt injection for Cherry Blossom™ or any Executive.
- Durable assessment response storage.
- Startup Business Foundations dashboard or My Boundary Blueprint™ UI.
- Business asset creation and persistence workflow.
- Agent-to-job assignment automation.
- New database tables, columns, or migrations.
- End-to-end startup founder workflow.

The next implementation work must inspect and reuse existing business context, ESA/readiness, business asset, deliverable, job, authority, and history structures. Test on the isolated test environment first. Do not change Production, merge branches, or deploy without explicit approval.

## 6. Current branch and implementation guardrails

- Repository: bbamba1111/success-hub-clean
- Working branch: feature/seven-functions
- Do not commit these changes to main or add-new-hero.
- Do not merge or deploy without Barbara's explicit approval.
- Apply database changes to the isolated test database first, and Production only with explicit approval.
- Treat the November 5, 2026 technical handoff as a dated snapshot, not a guarantee that the branch has not changed since then.
