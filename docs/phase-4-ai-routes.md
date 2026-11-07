# Phase 4 — AI Route Record

All 19 routes that call an AI model, with their classification and final disposition.
Every route that stays open passes through one shared guard (`lib/ai/guard.ts`). The guard
fails closed: if login, membership, shutdown status or usage cannot be verified, the request is refused.

## Limits

| Pool | Who | Limit | Counted by |
| --- | --- | --- | --- |
| Member | Logged-in, active paid member (or platform admin) | 10 per minute and 60 per hour, **shared across all member routes** | Member user id |
| Public | Homepage visitor | 10 per hour (and 10 per minute) | One-way hash of the visitor's IP |

The two pools are counted separately (`ai_usage_events.scope`), so visitor traffic can never use up or loosen a member's allowance.
Counting is atomic in the database (`ai_consume_quota`, advisory lock per subject).

## Emergency shutdown

Every guarded route is refused (HTTP 503) when **either**:

- the server environment variable `AI_EMERGENCY_SHUTDOWN` is `true` (works even if the database is down), or
- the admin-only switch in Developer Mode is off (`app_settings.ai_enabled`).

If the switch can't be read, the route is refused.

## Routes

| # | Route | Classification | Auth required | Rate limit | Input cap | Final disposition |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `/api/chat/cherry-blossom` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 2 | `/api/chat/executive` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 3 | `/api/ceo-workday/work-affirmation` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 4 | `/api/client-co-guide` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 5 | `/api/cherry-blossom-chat` | Member (was login-free) | Active paid member | Member pool | 64 KB | Guarded. `/test-chat` now also requires an active paid member |
| 6 | `/api/cherry-blossom/remember` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 7 | `/api/time-freedom-moments/remember` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 8 | `/api/articulation-practice` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 9 | `/api/business-asset-build` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 10 | `/api/thought-leadership/write` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 11 | `/api/thought-leadership/generate-template` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 12 | `/api/identity/declaration` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 13 | `/api/identity/completion` (POST) | Member | Active paid member | Member pool | 64 KB | Guarded (GET reads saved results only, no AI call, still requires login) |
| 14 | `/api/communications/draft` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 15 | `/api/founder-os/briefing` | Member | Active paid member | Member pool | 64 KB | Guarded |
| 16 | `/api/co-guide-chat` | Public (homepage) | None | Public pool, 10/hour | 8 KB request; message 1,000 chars; last 10 turns | Guarded and isolated: client-supplied profile, assessment and user id are ignored; fixed public instructions; no tools, no member data, no BO$$ actions |
| 17 | `/api/chat` | Unused | n/a | n/a | n/a | Disabled — `410 Gone` |
| 18 | `/api/executive-chat/[executiveId]` | Unused | n/a | n/a | n/a | Disabled — `410 Gone` |
| 19 | `/api/human-zone-chat` | Unused | n/a | n/a | n/a | Disabled — `410 Gone` |

All member routes use the logged-in member's identity from the session. No route trusts an identity sent in the request body.
Response length was already capped on every route by its existing `maxOutputTokens` setting.
