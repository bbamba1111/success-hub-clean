# Founder Connected Tools — Product and Technical Requirements

Status: Phase 6 connected-account backend and CEO Workday integration committed on the development branch; provider app credentials and Preview build verification remain outstanding  
Scope: The BO$$ / Harmony Lane  
Initial providers: Gmail and Outlook

## Environment verification

- Development branch: `feature/founder-connected-tools`.
- Isolated Supabase project: `boss-phase2-test` (`uuvcpijrjbiyhikmcgsj`), active and healthy in `us-east-1`.
- Branch-scoped Vercel Preview variables are configured: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- The value stored in the existing `NEXT_PUBLIC_SUPABASE_ANON_KEY` variable is the project's modern publishable key. The variable name is retained because the current app helper reads that name.
- The current `lib/supabase/server.ts` uses these two public variables for its SSR and API client helpers; repository search found no `SUPABASE_SERVICE_ROLE_KEY` reference. Do not add a service-role key unless a specific server operation is demonstrated to require it.
- These values are restricted to the Vercel Preview environment for `feature/founder-connected-tools`. No Production environment variables or Production Supabase project settings were changed.
- Preview build for commit `9e461c3998277a4a9de511d0d207004db2e8c4ae` completed successfully. Later commits on this branch trigger subsequent Preview builds.

## Phase 4 authority foundation — applied to the test project

The following repository SQL scripts are now recorded in the `boss-phase2-test` migration history:

1. `scripts/phase4_authority_and_ai_security.sql` — creates the authority RPCs, proposal/preauthorization structures, immutable history behavior, AI shutdown and quota controls.
2. `scripts/phase4_fix_execute_approved.sql` — fixes the approved (non-preauthorized) execution path. The first rollback-only smoke test exposed the original unassigned-record defect; this repository fix uses a nullable UUID for the optional preauthorization ID.
3. `scripts/phase4_harden_service_only_tables.sql` — removes `anon` and `authenticated` table privileges on `app_settings` and `ai_usage_events`, retaining service-role access.
4. `scripts/phase4_restrict_internal_definer_functions.sql` — prevents direct execution of internal `SECURITY DEFINER` helpers and trigger functions by `anon` or `authenticated`.

Verified database behavior:
- `boss_create_proposal`, `boss_decide_proposal`, `boss_grant_preauthorization`, `boss_revoke_preauthorization`, and `boss_execute_proposal` exist and are executable by `authenticated`, not `anon`.
- The internal `boss_ai_enabled`, `boss_job_unfinished_prereqs`, and trigger-only definer functions are not directly executable by `anon` or `authenticated`.
- `app_settings` and `ai_usage_events` have RLS enabled, no end-user policies, and no table privileges for `anon` or `authenticated`. The service role retains access.
- `app_settings.ai_enabled` is currently `true` in the isolated test project.
- Phase 4 approval and preauthorization smoke tests passed in rollback-only transactions. The tests verified: an exact approved proposal can execute; an uncovered preauthorized action is refused; a scoped grant enables the action; and the use counter increments.
- Post-test checks confirmed the test account's original `free` membership tier was restored and no QA jobs, proposals, grants, or history rows remained.
- The full repository Phase 4 acceptance suite has not yet been run. It requires a dedicated test runner with the isolated project's service-role credential; that credential has not been added to Vercel or exposed in chat.

Security advisor findings still to review before Production use:
- Five authenticated `SECURITY DEFINER` authority RPCs remain intentionally callable by signed-in users; each is the existing founder authority gate and must retain its `auth.uid()` ownership checks.
- Two service-only tables are flagged as RLS-enabled with no policies. This is intentional; table-level grants have also been removed for end-user roles.
- Six existing functions still have mutable `search_path` warnings: `handle_updated_at`, `set_ceo_workday_updated_at`, `boss_action_required_level`, `boss_payload_hash`, `boss_job_history_immutable`, and `boss_job_proposals_immutable`.
- Supabase Auth leaked-password protection is disabled in the test project.
- Existing trigger functions remain installed after their direct RPC execute privileges were revoked. The trigger definitions were verified after the change.

## Product principle

The founder experiences plug-and-play AI, not an AI setup project. The AI workforce is built into The BO$$. A founder connects a business service once; Cherry Blossom and the nine executives can use that service only through the capabilities and authority the founder has granted.

The founder should not have to select an executive, configure an agent, write prompts, or connect the same account repeatedly.

## Founder experience — placement is inside the Four-Hour CEO Workday™

The founder does not go to a separate Connected Tools page. The execution surface is the Four-Hour CEO Workday™ space, where work designed in Decide & Design™ appears in its assigned hour.

Inside each CEO Workday assignment card:
1. The founder chooses herself, Cherry Blossom™, or one of the nine AI executives under Who does this?
2. The card contains an embedded Connected Services panel. The founder can connect Gmail or Outlook there, see account status, and disconnect an account.
3. Account connections belong to the founder, not to an individual task or executive. Connect once; authorized capabilities can be reused by the founder, Cherry Blossom™, and the assigned executive in other CEO Workday tasks.
4. For the current first release, the founder must explicitly enable Let the assigned AI executive search connected email for this task. That choice is per task and read-only.
5. The executive receives only a small set of matching subject lines and message snippets as work context. Provider credentials remain server-side.
6. OAuth returns the founder to the CEO Workday™ space and shows the connection result in the embedded panel.

The existing Decide & Design™ process is not changed. Its work item remains the source of the assignment and expected outcome. The existing hour-by-hour CEO Workday card is the integration point.

## Architecture

- Use per-founder OAuth connections. Never use a shared company mailbox or shared provider credential for founders.
- Store provider tokens server-side, encrypted at rest. Never expose access or refresh tokens to the browser, logs, prompts, or executive context.
- Use a centralized connected-account registry and tool broker. Executives request named capabilities from the broker; they do not receive provider credentials.
- Enforce founder ownership and tenant isolation on every connection lookup and operation.
- Keep provider OAuth consent, BO$$ capability grants, and action-specific founder approval as separate controls.
- Use least-privilege provider scopes. Request additional scopes only when a founder enables a capability that requires them.
- Support token refresh, expiration handling, provider error states, revocation, and disconnect.
- Record security-relevant events and external actions in an append-only audit trail.

## Authority model

Connection does not equal permission to perform every action.

Capabilities must be distinct, at minimum:
- Read/search messages
- Prepare a draft
- Send a message

Drafting must not send. Sending must pass through the existing BO$$ proposal/approval and execution pathway, with a new explicit action kind and server-side enforcement. Do not create a parallel send path that bypasses `boss_execute_proposal`, preauthorization rules, or audit history.

Any preauthorization for sending must be narrow, visible, revocable, and limited by scope, time, and/or use count. If no valid authority exists, the action remains a proposal for the founder.

**Current implementation boundary:** `lib/boss/jobs/definitions.ts` still allows only `job.save_whats_ready` and `job.set_status`. Email send is intentionally not an approved action yet. No email-send proposal or provider execution path has been added.

## Initial provider release — read-only email

### Gmail
- Google OAuth 2.0 authorization-code flow with PKCE and server-side token exchange.
- Gmail API message search and metadata/snippet retrieval through the centralized server-side broker.
- Scope is read-only (gmail.readonly); the first release does not send, compose, delete, or modify messages.

### Outlook
- Microsoft identity platform OAuth authorization-code flow with PKCE.
- Microsoft Graph message search and short preview retrieval through the same broker.
- Scope is read-only (Mail.Read); the first release does not send, compose, delete, or modify messages.

Provider OAuth app registrations and branch Preview credentials still need to be configured before a founder can complete either consent flow.

## Existing BO$$ systems to reuse

- Founder authentication through Supabase.
- Existing `boss_jobs`, job proposals, dependencies, and executive assignments.
- Existing `boss_execute_proposal` and `boss_decide_proposal` authority flow.
- Existing preauthorization framework where applicable.
- Existing job history/audit patterns.

The communications draft endpoint currently creates a draft response only; it is not a founder mailbox connection and must not be treated as one.

## Explicit exclusions

- Do not redesign or modify Decide & Design.
- Do not create nine separate integration setups.
- Do not give executives direct access to provider credentials.
- Do not auto-send email merely because an account is connected.
- Do not make Production database, environment, or deployment changes as part of initial implementation.

## Delivery status and remaining sequence

Completed on feature/founder-connected-tools:
1. Confirmed branch-scoped Preview environment and the isolated boss-phase2-test database. No Production database or environment changes were made.
2. Applied the Phase 4 authority baseline and Phase 6 connected-account migration to the isolated test project. Targeted rollback-only approval and preauthorization smoke tests passed.
3. Added server-only AES-256-GCM credential encryption, per-founder account storage, ownership-checked token retrieval, disconnect support, and Google/Microsoft OAuth callback foundations.
4. Added the Connected Services panel inside each CEO Workday assignment card. The connection flow returns to the CEO Workday rather than a standalone tool page.
5. Added read-only Gmail and Outlook message search through a server-side broker, with an explicit per-task opt-in and untrusted-email-content handling in the executive prompt.
6. Existing executive drafting still returns through the BO$$ proposal/review pathway. No send or publish capability was introduced.

Still required:
1. Configure and verify the Google and Microsoft OAuth app registrations and their exact Preview redirect URIs; add the provider client IDs/secrets as branch-scoped Preview variables.
2. Authorize Vercel team access for this connection, then verify the latest Preview deployment and inspect build logs. The Vercel access request has not yet been approved.
3. Run lint/typecheck/build and end-to-end tests for OAuth consent, account ownership, read-only scopes, token refresh, disconnect/reconnect, and per-task opt-in.
4. Test provider APIs with real consenting test accounts. The implementation has not yet been verified against live Gmail or Outlook accounts.
5. Expand to additional connected services only after the founder-facing task-card pattern and security controls are validated.
6. Add sending or other write capabilities only as separate capabilities with an explicit BO$$ action kind, founder approval, and audited execution. Do not enable them in this read-only release.
7. Open a reviewable pull request. No Production merge or deployment without explicit approval.
