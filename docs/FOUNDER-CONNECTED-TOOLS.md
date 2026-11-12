# Founder Connected Tools — Product and Technical Requirements

Status: implementation foundation  
Scope: The BO$$ / Harmony Lane  
Initial providers: Gmail and Outlook

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

1. Confirm the development branch and isolated Preview database/environment.
2. Inspect current database migrations, RLS policies, authority RPCs, and deployment configuration.
3. Implement the shared connection registry, secure token handling, OAuth callback foundations, and Connected Tools UI.
4. Implement Gmail read/draft capabilities.
5. Route send proposals through the existing BO$$ authority gate and audit trail.
6. Add Outlook through the same provider interface.
7. Test account isolation, scope enforcement, refresh/revocation, approval, auditability, and failure handling.
8. Open a reviewable pull request. No Production merge or deployment without explicit approval.
