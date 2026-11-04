// BO$$ Phase 5 Step 2a tests: the seventh business function ("Own Work").
// Run: node --env-file-if-exists=/vercel/share/.env.project scripts/boss-phase5-step2a.cjs
// Uses a temporary account signed in through its own session so RLS and SECURITY DEFINER
// checks apply as in the app. All test data is removed at the end.
const { createClient } = require("@supabase/supabase-js")

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const admin = createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const results = []
function record(name, pass, detail = "") {
  results.push({ name, pass, detail })
  console.log(`${pass ? "PASS" : "FAIL"} | ${name}${detail ? " — " + detail : ""}`)
}
const expectOk = (name, res) => record(name, !res.error, res.error?.message ?? "")
const expectError = (name, res, pattern) =>
  record(name, Boolean(res.error) && (!pattern || pattern.test(res.error.message)), res.error?.message ?? "no error")

const BOSS_FUNCTIONS = ["attraction", "sales", "delivery", "operations", "design", "experiences", "own_work"]
const PASSWORD = "Qa-" + Math.random().toString(36).slice(2) + "!9"
const RUN = Date.now()
const inDays = (d) => new Date(Date.now() + d * 86_400_000).toISOString()

async function main() {
  const email = `boss-p5-2a-${RUN}@example.com`
  const created = await admin.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true })
  if (created.error) throw created.error
  const uid = created.data.user.id
  try {
    const up = await admin.from("user_profiles").upsert({ id: uid, email, membership_tier: "monday_only", role: "member" }, { onConflict: "id" })
    if (up.error) throw up.error
    const db = createClient(URL, ANON, { auth: { persistSession: false } })
    const signIn = await db.auth.signInWithPassword({ email, password: PASSWORD })
    if (signIn.error) throw signIn.error

    // A1
    let rank = 0
    const createJob = (fields) =>
      db.from("boss_jobs").insert({
        user_id: uid, assignee_type: "founder", do_first_rank: ++rank,
        last_change_actor: "founder", last_change_action: "created", title: "QA job", ...fields,
      }).select().single()
    const jobs = {}
    for (const fn of BOSS_FUNCTIONS) {
      const res = await createJob({ business_function: fn, title: `QA ${fn}` })
      expectOk(`A1 job saves with function ${fn}`, res)
      jobs[fn] = res.data
    }
    expectError("A1 made-up eighth function is rejected", await createJob({ business_function: "marketing_magic" }), /check constraint/)

    // A2
    expectOk("A2 team member assigned to Own Work saves",
      await db.from("boss_team_members").insert({ user_id: uid, name: "QA helper", business_functions: ["own_work", "sales"] }).select().single())
    expectError("A2 team member with made-up function is rejected",
      await db.from("boss_team_members").insert({ user_id: uid, name: "QA bad", business_functions: ["own_work", "nope"] }).select().single(), /check constraint/)

    // A3
    const plan = await db.from("ceo_workday_plans").insert({ user_id: uid, plan_date: "2099-01-05", week_key: "2099-W02" }).select().single()
    expectOk("(setup) CEO Workday plan", plan)
    const item = (business_function, title) =>
      db.from("ceo_workday_plan_items").insert({
        plan_id: plan.data.id, user_id: uid, title, treatment: "implement-operate", business_function,
      }).select().single()
    expectOk("A3 CEO Workday item under own-work saves", await item("own-work", "QA own work"))
    for (const legacy of ["own", "build", "client-attraction", "trust-experiences"]) {
      expectOk(`A3 legacy value ${legacy} still saves/loads`, await item(legacy, `QA legacy ${legacy}`))
    }
    expectError("A3 made-up CEO Workday function is rejected", await item("nope", "QA bad"), /check constraint/)
    const loaded = await db.from("ceo_workday_plan_items").select("business_function").eq("plan_id", plan.data.id)
    record("A3 plan items read back", !loaded.error && loaded.data.length === 5, `rows=${loaded.data?.length}`)

    // A4
    const grant = (args) => db.rpc("boss_grant_preauthorization", {
      p_job_id: null, p_business_function: null, p_max_uses: null, p_note: null, ...args,
    })
    const g = await grant({ p_business_function: "own_work", p_action_kinds: ["job.set_status"], p_expires_at: inDays(5) })
    expectOk("A4 area-wide Own Work pre-authorization saves", g)
    expectError("A4 area grant for made-up function is rejected",
      await grant({ p_business_function: "nope", p_action_kinds: ["job.set_status"], p_expires_at: inDays(5) }), /not recognized/)

    await db.from("boss_jobs").update({ permission_level: "preauthorized_execution" }).eq("id", jobs.own_work.id)
    const pr = await db.rpc("boss_create_proposal", {
      p_job_id: jobs.own_work.id, p_proposed_by: "cherry", p_ai_capability: "qa", p_summary: "QA own work status",
      p_action_kind: "job.set_status", p_action_payload: { status: "working" },
    })
    expectOk("(setup) proposal on Own Work job", pr)
    const ex = await db.rpc("boss_execute_proposal", { p_proposal_id: pr.data })
    record("A4 Own Work area grant covers a job in Own Work",
      !ex.error && ex.data?.ok === true && ex.data.via === "preauthorization", ex.error?.message ?? JSON.stringify(ex.data))
  } finally {
    const del = await admin.auth.admin.deleteUser(uid)
    if (del.error) console.log(`CLEANUP WARNING: could not delete ${email}: ${del.error.message}`)
    const left = await admin.from("boss_jobs").select("id", { count: "exact", head: true }).eq("user_id", uid)
    console.log(`cleanup: leftover jobs for test user = ${left.count ?? "?"}`)
  }

  const failed = results.filter((r) => !r.pass)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  process.exit(failed.length ? 1 : 0)
}

main().catch((e) => { console.error(e); process.exit(1) })
