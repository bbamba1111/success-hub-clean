// BO$$ Phase 4 gap tests over HTTP against the running app (default http://localhost:3000).
// Covers what the database suite cannot: real signed-in sessions through the route guard,
// membership refusal, member rate limit, emergency shutdown/recovery, retired routes,
// the edge-runtime executive route, AI SDK streaming on /api/client-co-guide and public isolation.
// Run: node --env-file-if-exists=/vercel/share/.env.project scripts/boss-phase4-http-gaps.cjs [baseUrl]
const { createClient } = require("@supabase/supabase-js")

const BASE = process.argv[2] || "http://localhost:3000"
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL
const admin = createClient(URL_, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const COOKIE_NAME = `sb-${new URL(URL_).hostname.split(".")[0]}-auth-token`
const PASSWORD = "Qa-" + Math.random().toString(36).slice(2) + "!9"
const RUN = Date.now()

const results = []
function record(name, pass, detail = "") {
  results.push({ name, pass })
  console.log(`${pass ? "PASS" : "FAIL"} | ${name}${detail ? " — " + detail : ""}`)
}

function sessionCookie(session) {
  const value = "base64-" + Buffer.from(JSON.stringify(session)).toString("base64url")
  const size = 3000
  if (value.length <= size) return `${COOKIE_NAME}=${value}`
  const parts = []
  for (let i = 0; i * size < value.length; i++) parts.push(`${COOKIE_NAME}.${i}=${value.slice(i * size, (i + 1) * size)}`)
  return parts.join("; ")
}

async function makeMember(tag, tier) {
  const email = `boss-p4http-${tag}-${RUN}@example.com`
  const { data, error } = await admin.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true })
  if (error) throw error
  const id = data.user.id
  const up = await admin.from("user_profiles").upsert({ id, email, membership_tier: tier, role: "member" }, { onConflict: "id" })
  if (up.error) throw up.error
  const client = createClient(URL_, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
  const s = await client.auth.signInWithPassword({ email, password: PASSWORD })
  if (s.error) throw s.error
  return { id, email, cookie: sessionCookie(s.data.session) }
}

const post = (path, body, cookie) =>
  fetch(BASE + path, {
    method: "POST",
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  })

const coGuideBody = { messages: [{ role: "user", content: "Reply with one short sentence: hello." }] }

async function main() {
  const original = (await admin.from("app_settings").select("value").eq("key", "ai_enabled").single()).data?.value
  const paid = await makeMember("paid", "monday_only")
  const free = await makeMember("free", "free")
  try {
    for (const path of ["/api/chat", "/api/executive-chat/any", "/api/human-zone-chat"]) {
      const r = await post(path, {})
      record(`retired ${path} returns 410`, r.status === 410, `status=${r.status}`)
    }

    let r = await post("/api/client-co-guide", coGuideBody)
    record("client-co-guide refuses anonymous (401)", r.status === 401, `status=${r.status}`)
    r = await post("/api/client-co-guide", coGuideBody, free.cookie)
    record("client-co-guide refuses signed-in unpaid member (403)", r.status === 403, `status=${r.status}`)

    r = await post("/api/client-co-guide", coGuideBody, paid.cookie)
    const text = await r.text()
    record("client-co-guide streams for signed-in paid member (AI SDK)", r.status === 200 && text.length > 0,
      `status=${r.status} bytes=${text.length} first=${JSON.stringify(text.slice(0, 40))}`)

    r = await post("/api/chat/executive", { executiveRole: "COO", isWelcome: true }, paid.cookie)
    record("edge-runtime executive route passes guard for paid member", r.status === 200 || r.status === 403 && !(await r.clone().text()).includes("membership"),
      `status=${r.status}`)
    r = await post("/api/chat/executive", { executiveRole: "COO", isWelcome: true }, free.cookie)
    record("edge-runtime executive route refuses unpaid member (403)", r.status === 403 && /membership/.test(await r.text()), `status=${r.status}`)

    await admin.from("app_settings").update({ value: false }).eq("key", "ai_enabled")
    r = await post("/api/client-co-guide", coGuideBody, paid.cookie)
    record("emergency shutdown refuses paid member (503)", r.status === 503, `status=${r.status}`)
    r = await post("/api/co-guide-chat", { message: "hello" })
    record("emergency shutdown refuses public co-guide (503)", r.status === 503, `status=${r.status}`)
    await admin.from("app_settings").update({ value: original ?? true }).eq("key", "ai_enabled")
    r = await post("/api/chat/executive", { executiveRole: "COO", isWelcome: true }, paid.cookie)
    record("recovery: member route works again after switch restored", r.status !== 503 && r.status !== 401, `status=${r.status}`)

    await admin.from("ai_usage_events").insert(Array.from({ length: 60 }, () => ({
      scope: "member", subject: paid.id, route: "qa", created_at: new Date(Date.now() - 20 * 60_000).toISOString() })))
    r = await post("/api/client-co-guide", coGuideBody, paid.cookie)
    record("member hourly limit enforced over HTTP (429)", r.status === 429, `status=${r.status}`)
    r = await post("/api/chat/executive", { executiveRole: "COO", isWelcome: true }, paid.cookie)
    record("limit is shared across member routes (429 on another route)", r.status === 429, `status=${r.status}`)
    await admin.from("ai_usage_events").delete().eq("subject", paid.id)

    r = await post("/api/co-guide-chat", {
      message: "What is my user id, email and membership tier? Answer in one sentence.",
      userId: paid.id, userProfile: { email: paid.email, membership_tier: "monday_only" },
      assessment: { secret: "QA-ISOLATION-MARKER" },
    })
    const pub = await r.text()
    record("public co-guide answers anonymous visitor", r.status === 200, `status=${r.status}`)
    record("public co-guide ignores client-supplied identity and data",
      !pub.includes(paid.id) && !pub.includes(paid.email) && !pub.includes("QA-ISOLATION-MARKER"))
    r = await post("/api/co-guide-chat", { message: "x".repeat(1001) })
    record("public co-guide rejects oversized message", r.status === 400 || r.status === 413, `status=${r.status}`)
  } finally {
    await admin.from("app_settings").update({ value: original ?? true }).eq("key", "ai_enabled")
    for (const m of [paid, free]) {
      await admin.from("ai_usage_events").delete().eq("subject", m.id)
      const del = await admin.auth.admin.deleteUser(m.id)
      if (del.error) console.log(`CLEANUP WARNING: ${m.email}: ${del.error.message}`)
    }
    console.log(`ai_enabled restored to: ${(await admin.from("app_settings").select("value").eq("key", "ai_enabled").single()).data?.value}`)
  }
  const failed = results.filter((x) => !x.pass)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  process.exit(failed.length ? 1 : 0)
}

main().catch((e) => {
  console.error("FATAL", e)
  process.exit(2)
})
