// BO$$ Phase 4 acceptance tests: authority, approvals, pre-authorizations,
// execution gate, rate limits and emergency shutdown.
// Run: node --env-file-if-exists=/vercel/share/.env.project scripts/boss-phase4-acceptance.cjs
// Uses temporary accounts signed in through their own sessions so RLS, triggers and
// SECURITY DEFINER checks apply exactly as in the app (mirrors app/actions/boss-authority.ts).
// The emergency switch is always restored to its original value, and test data is removed.
const { createClient } = require("@supabase/supabase-js")

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const admin = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const fresh = () => createClient(URL, ANON, { auth: { persistSession: false } })

const results = []
let section = ""
function record(name, pass, detail = "") {
  results.push({ section, name, pass, detail })
  console.log(`${pass ? "PASS" : "FAIL"} | ${section} | ${name}${detail ? " — " + detail : ""}`)
}
const expectOk = (name, res) => record(name, !res.error, res.error?.message ?? "")
const expectError = (name, res, pattern) =>
  record(name, Boolean(res.error) && (!pattern || pattern.test(res.error.message)), res.error?.message ?? "no error")
const expectNoRows = (name, res) =>
  record(name, Boolean(res.error) || (Array.isArray(res.data) && res.data.length === 0),
    res.error ? `blocked: ${res.error.message}` : `rows: ${res.data?.length}`)
const expectRefused = (name, res, pattern) => {
  const ok = !res.error && res.data && res.data.ok === false && (!pattern || pattern.test(res.data.reason ?? ""))
  record(name, ok, res.error?.message ?? res.data?.reason ?? JSON.stringify(res.data))
}
const expectExecuted = (name, res, via) =>
  record(name, !res.error && res.data?.ok === true && (!via || res.data.via === via),
    res.error?.message ?? JSON.stringify(res.data))

const PASSWORD = "Qa-" + Math.random().toString(36).slice(2) + "!9"
const RUN = Date.now()

async function makeMember(tag, tier) {
  const email = `boss-p4-${tag}-${RUN}@example.com`
  const { data, error } = await admin.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true })
  if (error) throw error
  const id = data.user.id
  const up = await admin.from("user_profiles").upsert({ id, email, membership_tier: tier, role: "member" }, { onConflict: "id" })
  if (up.error) throw up.error
  const client = fresh()
  const signIn = await client.auth.signInWithPassword({ email, password: PASSWORD })
  if (signIn.error) throw signIn.error
  return { id, email, client }
}

let rank = 0
const createJob = (db, userId, fields) =>
  db.from("boss_jobs").insert({
    user_id: userId, business_function: "operations", assignee_type: "founder",
    do_first_rank: ++rank, last_change_actor: "founder", last_change_action: "created", ...fields,
  }).select().single()

const propose = (db, jobId, kind, payload, by = "cherry") =>
  db.rpc("boss_create_proposal", {
    p_job_id: jobId, p_proposed_by: by, p_ai_capability: "qa", p_summary: `QA ${kind}`,
    p_action_kind: kind, p_action_payload: payload,
  })
const proposal = async (db, id) => (await db.from("boss_job_proposals").select("*").eq("id", id).single()).data
const decide = (db, id, decision, hash) =>
  db.rpc("boss_decide_proposal", { p_proposal_id: id, p_decision: decision, p_expected_hash: hash, p_note: null })
const execute = (db, id) => db.rpc("boss_execute_proposal", { p_proposal_id: id })
const grant = (db, args) =>
  db.rpc("boss_grant_preauthorization", {
    p_job_id: null, p_business_function: null, p_max_uses: null, p_note: null, ...args,
  })
const inDays = (d) => new Date(Date.now() + d * 86_400_000).toISOString()

async function main() {
  const original = (await admin.from("app_settings").select("value").eq("key", "ai_enabled").single()).data?.value
  const A = await makeMember("paid", "monday_only")
  const B = await makeMember("unpaid", "free")
  const a = A.client, b = B.client
  const QA_SUBJECT = `qa-p4-${RUN}`
  try {
    section = "1 Permission levels"
    const research = (await createJob(a, A.id, { title: "QA research job", permission_level: "research" })).data
    const prepare = (await createJob(a, A.id, { title: "QA prepare job", permission_level: "prepare" })).data
    const approved = (await createJob(a, A.id, { title: "QA approved job", permission_level: "approved_execution" })).data
    const preauthJob = (await createJob(a, A.id, { title: "QA preauth job", permission_level: "preauthorized_execution", business_function: "sales" })).data
    record("founder creates jobs at all four levels", Boolean(research && prepare && approved && preauthJob))

    expectError("Cherry cannot create a job above Research",
      await createJob(a, A.id, { title: "QA cherry job", permission_level: "prepare", last_change_actor: "cherry" }), /founder/)
    expectError("Cherry cannot raise a job's permission level",
      await a.from("boss_jobs").update({ permission_level: "preauthorized_execution", last_change_actor: "cherry", last_change_action: "changed" }).eq("id", research.id).select(), /founder/)
    expectError("executive cannot raise a job's permission level",
      await a.from("boss_jobs").update({ permission_level: "approved_execution", last_change_actor: "executive", last_change_action: "changed" }).eq("id", prepare.id).select(), /founder/)
    expectError("unknown action kinds cannot be proposed", await propose(a, research.id, "email.send", {}), /not allowed/)

    let id = (await propose(a, research.id, "job.save_whats_ready", { text: "draft" })).data
    let p = await proposal(a, id)
    await decide(a, id, "yes_do_it", p.payload_hash)
    expectRefused("Research job cannot run even an approved Prepare action", await execute(a, id), /not allowed/)

    id = (await propose(a, prepare.id, "job.set_status", { status: "working" })).data
    p = await proposal(a, id)
    await decide(a, id, "yes_do_it", p.payload_hash)
    expectRefused("Prepare job cannot run an execution action, even approved", await execute(a, id), /not allowed/)

    id = (await propose(a, prepare.id, "job.save_whats_ready", { text: "prepared draft" })).data
    p = await proposal(a, id)
    await decide(a, id, "yes_do_it", p.payload_hash)
    expectExecuted("Prepare job can save prepared work once approved", await execute(a, id), "approval")

    section = "2 Exact-proposal approval"
    const v1 = (await propose(a, approved.id, "job.set_status", { status: "working" })).data
    const p1 = await proposal(a, v1)
    expectRefused("pending (unapproved) proposal cannot execute", await execute(a, v1), /Not approved/)
    expectError("approval with a different payload hash is rejected", await decide(a, v1, "yes_do_it", "0".repeat(64)), /changed/)
    const v2 = (await propose(a, approved.id, "job.set_status", { status: "working", note: "changed" })).data
    const p2 = await proposal(a, v2)
    record("material change creates a new version", p2.version === p1.version + 1 && p2.payload_hash !== p1.payload_hash)
    record("previous version is superseded", (await proposal(a, v1)).status === "superseded")
    expectError("superseded version can no longer be approved", await decide(a, v1, "yes_do_it", p1.payload_hash), /no longer waiting/)
    expectRefused("superseded version cannot execute", await execute(a, v1))
    expectError("approving v2 with v1's hash is rejected", await decide(a, v2, "yes_do_it", p1.payload_hash), /changed/)

    expectNoRows("member cannot approve by writing proposal status directly",
      await a.from("boss_job_proposals").update({ status: "approved" }).eq("id", v2).select())
    record("proposal still pending after direct-write attempt", (await proposal(a, v2)).status === "pending")
    expectError("another member cannot decide this proposal", await decide(b, v2, "yes_do_it", p2.payload_hash), /not found/)
    expectRefused("another member cannot execute this proposal", await execute(b, v2), /not found/)
    expectError("invalid decision word rejected", await decide(a, v2, "approve_all", p2.payload_hash), /Unknown decision/)

    expectOk("founder chooses Wait", await decide(a, v2, "wait", p2.payload_hash))
    expectRefused("waiting proposal cannot execute", await execute(a, v2), /Not approved/)
    expectOk("founder chooses Yes, do it after waiting", await decide(a, v2, "yes_do_it", p2.payload_hash))
    expectExecuted("approved exact proposal executes", await execute(a, v2), "approval")
    const after = (await a.from("boss_jobs").select("status").eq("id", approved.id).single()).data
    record("job status reflects the executed proposal", after.status === "working", after.status)
    expectRefused("executed proposal cannot run twice", await execute(a, v2))

    const v3 = (await propose(a, approved.id, "job.set_status", { status: "stuck" })).data
    const p3 = await proposal(a, v3)
    expectOk("founder chooses No, stop", await decide(a, v3, "no_stop", p3.payload_hash))
    expectRefused("rejected proposal cannot execute", await execute(a, v3), /Not approved/)
    expectError("rejected proposal is closed", await decide(a, v3, "yes_do_it", p3.payload_hash))

    const v4 = (await propose(a, approved.id, "job.set_status", { status: "stuck" })).data
    const p4 = await proposal(a, v4)
    expectOk("founder chooses Change it", await decide(a, v4, "change_it", p4.payload_hash))
    expectRefused("change-requested proposal cannot execute", await execute(a, v4), /Not approved/)

    section = "3 Pre-authorizations"
    expectError("pre-authorization longer than 90 days is rejected",
      await grant(a, { p_job_id: preauthJob.id, p_action_kinds: ["job.set_status"], p_expires_at: inDays(91) }), /check constraint/)
    expectError("pre-authorization cannot include unknown actions",
      await grant(a, { p_job_id: preauthJob.id, p_action_kinds: ["payments.refund"], p_expires_at: inDays(5) }), /not allowed/)
    expectNoRows("member cannot insert a pre-authorization directly",
      await a.from("boss_preauthorizations").insert({ user_id: A.id, job_id: preauthJob.id, action_kinds: ["job.set_status"], expires_at: inDays(5) }).select())

    let pr = (await propose(a, preauthJob.id, "job.set_status", { status: "working" })).data
    expectRefused("pre-authorized job without an active grant cannot execute", await execute(a, pr), /no active pre-authorization/)

    const wrongArea = await grant(a, { p_business_function: "operations", p_action_kinds: ["job.set_status"], p_expires_at: inDays(5) })
    expectOk("grant scoped to a different business area", wrongArea)
    expectRefused("grant for another area does not cover this job", await execute(a, pr), /no active pre-authorization/)
    await a.rpc("boss_revoke_preauthorization", { p_id: wrongArea.data, p_note: "qa" })

    const onlyDraft = await grant(a, { p_job_id: preauthJob.id, p_action_kinds: ["job.save_whats_ready"], p_expires_at: inDays(5) })
    expectRefused("grant for other actions does not cover this action", await execute(a, pr), /no active pre-authorization/)
    await a.rpc("boss_revoke_preauthorization", { p_id: onlyDraft.data, p_note: "qa" })

    const g = await grant(a, { p_job_id: preauthJob.id, p_action_kinds: ["job.set_status"], p_expires_at: inDays(30), p_max_uses: 1 })
    expectOk("founder grants a scoped, limited, expiring pre-authorization", g)
    expectExecuted("pre-authorized proposal executes without per-action approval", await execute(a, pr), "preauthorization")
    const used = (await a.from("boss_preauthorizations").select("uses").eq("id", g.data).single()).data
    record("use counter increments", used.uses === 1, `uses=${used.uses}`)
    pr = (await propose(a, preauthJob.id, "job.set_status", { status: "stuck" })).data
    expectRefused("grant at its use limit cannot execute", await execute(a, pr), /no active pre-authorization/)

    const g2 = await grant(a, { p_job_id: preauthJob.id, p_action_kinds: ["job.set_status"], p_expires_at: inDays(30) })
    expectOk("revoke the new grant", await a.rpc("boss_revoke_preauthorization", { p_id: g2.data, p_note: "qa revoke" }))
    expectRefused("revoked grant cannot execute", await execute(a, pr), /no active pre-authorization/)

    const expired = await admin.from("boss_preauthorizations").insert({
      user_id: A.id, job_id: preauthJob.id, action_kinds: ["job.set_status"],
      created_at: new Date(Date.now() - 2 * 86_400_000).toISOString(), expires_at: new Date(Date.now() - 60_000).toISOString(),
    }).select().single()
    expectOk("(setup) expired grant", expired)
    expectRefused("expired grant cannot execute", await execute(a, pr), /no active pre-authorization/)
    expectNoRows("member cannot extend a grant directly",
      await a.from("boss_preauthorizations").update({ expires_at: inDays(80), revoked_at: null }).eq("id", g2.data).select())

    section = "4 Execution gate"
    const first = (await createJob(a, A.id, { title: "QA prerequisite", permission_level: "approved_execution" })).data
    const second = (await createJob(a, A.id, { title: "QA blocked", permission_level: "approved_execution" })).data
    expectOk("dependency added", await a.from("boss_job_dependencies").insert({ user_id: A.id, job_id: second.id, depends_on_job_id: first.id }))
    expectError("circular dependency rejected",
      await a.from("boss_job_dependencies").insert({ user_id: A.id, job_id: first.id, depends_on_job_id: second.id }), /each oth/)
    expectError("blocked job cannot move to Working directly",
      await a.from("boss_jobs").update({ status: "working", last_change_actor: "founder", last_change_action: "status" }).eq("id", second.id).select(), /first/)
    const blocked = (await propose(a, second.id, "job.set_status", { status: "working" })).data
    const bp = await proposal(a, blocked)
    await decide(a, blocked, "yes_do_it", bp.payload_hash)
    expectRefused("approved proposal on a blocked job is refused", await execute(a, blocked), /must happen first/)

    expectOk("(setup) emergency shutdown on", await admin.from("app_settings").update({ value: false }).eq("key", "ai_enabled"))
    const offJob = (await propose(a, approved.id, "job.set_status", { status: "working" })).data
    const op = await proposal(a, offJob)
    await decide(a, offJob, "yes_do_it", op.payload_hash)
    expectRefused("approved proposal refused during emergency shutdown", await execute(a, offJob), /emergency/)
    await admin.from("app_settings").update({ value: original ?? true }).eq("key", "ai_enabled")
    expectExecuted("same approved proposal runs after AI is re-enabled", await execute(a, offJob), "approval")

    const bJob = (await createJob(b, B.id, { title: "QA unpaid job", permission_level: "approved_execution" })).data
    const bProp = (await propose(b, bJob.id, "job.set_status", { status: "working" })).data
    const bpp = await proposal(b, bProp)
    await decide(b, bProp, "yes_do_it", bpp.payload_hash)
    expectRefused("unpaid member's approved proposal is refused", await execute(b, bProp), /membership/)
    expectError("member cannot propose on another member's job", await propose(b, approved.id, "job.set_status", { status: "done" }), /not found/)

    section = "5 Audit history"
    const { data: hist } = await a.from("boss_job_history").select("action, result, error, proposal_id, preauthorization_id").eq("user_id", A.id)
    const has = (action) => hist.some((h) => h.action === action)
    for (const action of ["proposal_created", "proposal_decided", "executed", "execution_refused", "preauthorization_granted", "preauthorization_revoked"]) {
      record(`history records ${action}`, has(action))
    }
    record("refusals record the reason", hist.some((h) => h.action === "execution_refused" && /emergency/.test(h.error ?? "")))
    record("pre-authorized execution links its grant", hist.some((h) => h.action === "executed" && h.preauthorization_id === g.data))
    expectError("history cannot be edited", await a.from("boss_job_history").update({ note: "tampered" }).eq("user_id", A.id).select(), /permanent|permission denied/)
    expectError("history cannot be deleted", await a.from("boss_job_history").delete().eq("user_id", A.id).select(), /permanent|permission denied/)
    const histAfter = (await admin.from("boss_job_history").select("id", { count: "exact", head: true }).eq("user_id", A.id)).count
    record("history unchanged after tamper attempts", histAfter === hist.length, `${histAfter} vs ${hist.length}`)

    section = "6 Rate limits and settings"
    expectError("signed-in member cannot call the quota function", await a.rpc("ai_consume_quota", {
      p_scope: "member", p_subject: A.id, p_route: "qa", p_per_minute: 1000, p_per_hour: 1000 }), /permission/)
    expectError("anonymous visitor cannot call the quota function", await fresh().rpc("ai_consume_quota", {
      p_scope: "public", p_subject: "x", p_route: "qa", p_per_minute: 1000, p_per_hour: 1000 }), /permission/)
    const consume = (route, perHour = 60) => admin.rpc("ai_consume_quota", {
      p_scope: "member", p_subject: QA_SUBJECT, p_route: route, p_per_minute: 10, p_per_hour: perHour })
    const burst = await Promise.all(Array.from({ length: 12 }, (_, i) => consume(i % 2 ? "/api/chat/cherry-blossom" : "/api/communications/draft")))
    const allowed = burst.filter((r) => r.data?.allowed).length
    record("10/minute enforced atomically across routes (12 concurrent)", allowed === 10, `allowed=${allowed}`)
    await admin.from("ai_usage_events").delete().eq("subject", QA_SUBJECT)
    await admin.from("ai_usage_events").insert(Array.from({ length: 60 }, () => ({
      scope: "member", subject: QA_SUBJECT, route: "qa", created_at: new Date(Date.now() - 30 * 60_000).toISOString() })))
    const hour = await consume("/api/founder-os/briefing")
    record("60/hour enforced", hour.data?.allowed === false && hour.data?.reason === "hour", JSON.stringify(hour.data))
    const pub = await admin.rpc("ai_consume_quota", { p_scope: "public", p_subject: QA_SUBJECT, p_route: "qa", p_per_minute: 10, p_per_hour: 10 })
    record("public pool is counted separately from member pool", pub.data?.allowed === true, JSON.stringify(pub.data))

    expectNoRows("member cannot read app settings", await a.from("app_settings").select("*"))
    expectNoRows("member cannot switch AI on/off", await a.from("app_settings").update({ value: false }).eq("key", "ai_enabled").select())
    expectNoRows("member cannot read usage events", await a.from("ai_usage_events").select("*").limit(1))
  } finally {
    await admin.from("app_settings").update({ value: original ?? true }).eq("key", "ai_enabled")
    await admin.from("ai_usage_events").delete().eq("subject", QA_SUBJECT)
    for (const m of [A, B]) {
      const del = await admin.auth.admin.deleteUser(m.id)
      if (del.error) console.log(`CLEANUP WARNING: could not delete ${m.email}: ${del.error.message}`)
    }
    const restored = (await admin.from("app_settings").select("value").eq("key", "ai_enabled").single()).data?.value
    console.log(`ai_enabled restored to: ${restored}`)
  }

  const failed = results.filter((r) => !r.pass)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  process.exit(failed.length ? 1 : 0)
}

main().catch((e) => {
  console.error("FATAL", e)
  process.exit(2)
})
