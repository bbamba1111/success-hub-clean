# Founder Connected Tools — Product and Technical Requirements

Status: isolated Preview and Phase 4 authority foundation configured and smoke-tested; connected-tool implementation not yet started  
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

## Founder experience

1. A single Connected Tools area lists available services and their connection status.
2. The founder connects Gmail or Outlook through the provider's OAuth consent flow.
3. The founder sees, in plain language, what the connection allows: for example, read email, prepare drafts, or send email.
4. The founder can disconnect or reconnect an account and review recent AI activity involving it.
5. The founder gives Cherry Blossom an outcome in ordinary language. Cherry Blossom coordinates the appropriate executive and existing BO$$ job workflow.
6. If a required connection or permission is missing, the app explains the missing step at the moment it is needed.

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

## Initial provider plan

### Gmail
- Google OAuth 2.0 authorization-code flow with server-side token exchange.
- Gmail API access through the centralized tool broker.
- Begin with the smallest scope set needed for the first supported capability; do not request send scope merely to support reading or drafting.

### Outlook
- Microsoft identity platform OAuth authorization-code flow.
- Microsoft Graph access through the same centralized tool broker.
- Use equivalent least-privilege capabilities and authority checks.

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

## Delivery sequence

1. Confirm the development branch and isolated Preview database/environment. This is complete; the Preview target is branch-scoped and the test database is verified.
2. Inspect current database migrations, RLS policies, authority RPCs, and deployment configuration. The Phase 4 authority baseline is applied and the founder approval/preauthorization paths have passed targeted rollback-only smoke tests.
3. Implement the shared connection registry, secure token handling, OAuth callback foundations, and Connected Tools UI.
4. Implement Gmail read/draft capabilities.
5. Add an explicit email action kind and route send proposals through the existing BO$$ authority gate and audit trail. Do not enable send until end-to-end authority tests pass.
6. Add Outlook through the same provider interface.
7. Run the full acceptance suite and test account isolation, scope enforcement, refresh/revocation, approval, auditability, and failure handling.
8. Open a reviewable pull request. No Production merge or deployment without explicit approval.
