// BO$$ Phase 3 acceptance tests.
// Run: node --env-file-if-exists=/vercel/share/.env.project scripts/boss-phase3-acceptance.cjs
// Creates two real member accounts, signs in as each, and exercises the live
// database through their own sessions so Row Level Security and triggers apply
// exactly as in the app. Queries mirror app/actions/boss-jobs.ts and the
// close-out in lib/ceo-workday/plan-server.ts. Test accounts are deleted at the end.
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
const expectOk = (name, { error }) => record(name, !error, error?.message ?? "")
const expectBlocked = (name, res) => {
  const blocked = Boolean(res.error) || (Array.isArray(res.data) && res.data.length === 0)
  record(name, blocked, res.error ? `blocked: ${res.error.message}` : `rows affected: ${res.data?.length ?? 1}`)
}

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date())
const PASSWORD = "Qa-" + Math.random().toString(36).slice(2) + "!9"

async function makeMember(tag) {
  const email = `boss-qa-${tag}-${Date.now()}@example.com`
  const { data, error } = await admin.auth.admin.createUser({ email, password: PASSWORD, email_confirm: true })
  if (error) throw error
  const client = fresh()
  const signIn = await client.auth.signInWithPassword({ email, password: PASSWORD })
  if (signIn.error) throw signIn.error
  return { id: data.user.id, email, tag, client }
}
async function relogin(m) {
  const c = fresh()
  await c.auth.signInWithPassword({ email: m.email, password: PASSWORD })
  return c
}

async function createJob(db, userId, fields) {
  const { data: last } = await db.from("boss_jobs").select("do_first_rank").eq("user_id", userId)
    .order("do_first_rank", { ascending: false }).limit(1).maybeSingle()
  return db.from("boss_jobs").insert({
    user_id: userId, business_function: "operations", assignee_type: "founder",
    do_first_rank: (last?.do_first_rank ?? 0) + 1, last_change_actor: "founder", last_change_action: "created",
    ...fields,
  }).select().single()
}
const patch = (db, userId, id, fields, action, actor = "founder") =>
  db.from("boss_jobs").update({ ...fields, last_change_actor: actor, last_change_action: action })
    .eq("id", id).eq("user_id", userId).select()
const historyFor = (db, jobId) =>
  db.from("boss_job_history").select("*").eq("job_id", jobId).order("created_at")

async function main() {
  const A = await makeMember("a")
  const B = await makeMember("b")
  const a = A.client
  try {
    // 1. JOBS
    section = "1 Jobs"
    const j1 = await createJob(a, A.id, { title: "Write the welcome email", details: "First draft" })
    expectOk("create job", j1)
    const j2 = await createJob(a, A.id, { title: "Record onboarding video" })
    const j3 = await createJob(a, A.id, { title: "Update sales page", business_function: "sales" })
    const id1 = j1.data.id, id2 = j2.data.id, id3 = j3.data.id
    expectOk("edit title, details, area, due date", await patch(a, A.id, id1,
      { title: "Write the welcome email v2", details: "Second draft", business_function: "attraction", due_date: "2026-12-01" }, "changed"))
    expectOk("assign to an executive (Marketing & Brand)", await patch(a, A.id, id2,
      { assignee_type: "executive", assignee_executive_id: "marketing-brand" }, "changed"))
    expectBlocked("reject 'executive' assignment with no executive chosen", await patch(a, A.id, id2,
      { assignee_type: "executive", assignee_executive_id: null }, "changed"))
    expectOk("rank: swap Do First order", await patch(a, A.id, id1, { do_first_rank: 2 }, "reordered"))
    await patch(a, A.id, id2, { do_first_rank: 1 }, "reordered")
    expectOk("pause", await patch(a, A.id, id3, { paused: true }, "paused"))
    expectOk("stop", await patch(a, A.id, id3, { stopped: true, paused: false }, "stopped"))
    expectOk("complete (founder marks Done)", await patch(a, A.id, id1, { status: "done", paused: false }, "finished"))

    const a2 = await relogin(A)
    const { data: after } = await a2.from("boss_jobs").select("*").in("id", [id1, id2, id3])
    const r1 = after.find((j) => j.id === id1), r2 = after.find((j) => j.id === id2), r3 = after.find((j) => j.id === id3)
    record("after refresh: edits saved", r1.title === "Write the welcome email v2" && r1.details === "Second draft"
      && r1.business_function === "attraction" && r1.due_date === "2026-12-01")
    record("after refresh: assignment saved", r2.assignee_type === "executive" && r2.assignee_executive_id === "marketing-brand")
    record("after refresh: Do First order saved", r2.do_first_rank === 1 && r1.do_first_rank === 2)
    record("after refresh: stopped saved (and un-paused)", r3.stopped === true && r3.paused === false)
    record("after refresh: Done saved with completion time", r1.status === "done" && Boolean(r1.completed_at))
    const h1 = (await historyFor(a2, id1)).data
    record("Work History recorded every change", ["title", "details", "business_function", "due_date", "do_first_rank", "status"]
      .every((f) => h1.some((h) => h.field === f)), `${h1.length} entries`)
    expectOk("re-open a Done job", await patch(a, A.id, id1, { status: "working" }, "status_changed"))
    const reopened = (await a.from("boss_jobs").select("completed_at").eq("id", id1).single()).data
    record("re-opened job clears completion time", reopened.completed_at === null)

    // 2. DEPENDENCIES
    section = "2 Dependencies"
    const first = (await createJob(a, A.id, { title: "Choose the offer price" })).data
    const second = (await createJob(a, A.id, { title: "Launch the offer" })).data
    expectOk("link: 'Choose price' must happen first", await a.from("boss_job_dependencies")
      .insert({ user_id: A.id, job_id: second.id, depends_on_job_id: first.id }))
    expectBlocked("blocked job cannot start Working", await patch(a, A.id, second.id, { status: "working" }, "status_changed"))
    expectBlocked("blocked job cannot be marked Done", await patch(a, A.id, second.id, { status: "done" }, "finished"))
    expectBlocked("cannot create a loop (A needs B, B needs A)", await a.from("boss_job_dependencies")
      .insert({ user_id: A.id, job_id: first.id, depends_on_job_id: second.id }).select())
    await patch(a, A.id, first.id, { status: "done" }, "finished")
    expectOk("once the first job is Done, the second can start", await patch(a, A.id, second.id, { status: "working" }, "status_changed"))
    record("dependency link recorded in Work History", (await historyFor(a, second.id)).data.some((h) => h.action === "dependency_added"))

    // 3. CHERRY BLOSSOM
    section = "3 Cherry Blossom"
    const cj = await createJob(a, A.id, { title: "Draft the newsletter", assignee_type: "cherry" })
    expectOk("founder assigns a job to Cherry Blossom", cj)
    const { data: cherryList } = await a.from("boss_jobs").select("id").eq("assignee_type", "cherry")
    record("Cherry's job appears in her list", cherryList.some((j) => j.id === cj.data.id))
    expectOk("Cherry prepares work (What's Ready + Working)", await patch(a, A.id, cj.data.id,
      { whats_ready: "Draft is ready for review", status: "working" }, "ready_updated", "cherry"))
    expectOk("Cherry asks the founder a question", await patch(a, A.id, cj.data.id,
      { waiting_question: "Send Tuesday or Thursday?", status: "waiting_for_you" }, "question_asked", "cherry"))
    expectBlocked("Cherry cannot raise her own permission level", await patch(a, A.id, cj.data.id,
      { permission_level: "approved_execution" }, "changed", "cherry"))
    expectBlocked("Cherry cannot mark her own work Done", await patch(a, A.id, cj.data.id, { status: "done" }, "finished", "cherry"))
    expectBlocked("Cherry cannot record a founder decision", await patch(a, A.id, cj.data.id,
      { decision: "yes_do_it" }, "decided", "cherry"))
    expectBlocked("Cherry cannot create a job with higher authority", await createJob(a, A.id,
      { title: "Self-approved job", assignee_type: "cherry", permission_level: "preauthorized_execution", last_change_actor: "cherry" }))
    expectBlocked("Cherry cannot create a job already Done", await createJob(a, A.id,
      { title: "Pre-finished job", assignee_type: "cherry", status: "done", last_change_actor: "cherry" }))
    expectBlocked("an executive cannot raise permission either", await patch(a, A.id, id2,
      { permission_level: "prepare" }, "changed", "executive"))
    expectOk("founder CAN raise Cherry's permission", await patch(a, A.id, cj.data.id, { permission_level: "prepare" }, "changed"))
    const cherryHist = (await historyFor(a, cj.data.id)).data
    record("Work History shows who did what (Cherry vs founder)",
      cherryHist.some((h) => h.actor === "cherry" && h.field === "whats_ready")
      && cherryHist.some((h) => h.actor === "founder" && h.field === "permission_level"))

    // 4. FOUNDER DECISIONS (mirrors decideJob)
    section = "4 Decisions"
    const effects = {
      yes_do_it: { status: "working", paused: false, waiting_question: null },
      no_stop: { stopped: true, paused: false, waiting_question: null },
      change_it: { status: "working", paused: false, waiting_question: null },
      wait: { paused: true },
    }
    for (const [decision, effect] of Object.entries(effects)) {
      const job = (await createJob(a, A.id, { title: `Decision test: ${decision}`, assignee_type: "cherry" })).data
      await patch(a, A.id, job.id, { waiting_question: "Shall I go ahead?", status: "waiting_for_you" }, "question_asked", "cherry")
      const note = decision === "change_it" ? "Make it shorter" : null
      expectOk(`${decision}: saved`, await patch(a, A.id, job.id, { decision, decision_note: note, ...effect }, "decided"))
      const row = (await (await relogin(A)).from("boss_jobs").select("*").eq("id", job.id).single()).data
      const ok = row.decision === decision && Boolean(row.decided_at)
        && (decision !== "yes_do_it" || row.status === "working")
        && (decision !== "no_stop" || row.stopped === true)
        && (decision !== "change_it" || (row.status === "working" && row.decision_note === "Make it shorter"))
        && (decision !== "wait" || (row.paused === true && row.waiting_question === "Shall I go ahead?"))
      record(`${decision}: correct effect after refresh`, ok,
        `status=${row.status} paused=${row.paused} stopped=${row.stopped} question=${row.waiting_question ?? "none"}`)
      const hist = (await historyFor(a, job.id)).data.filter((h) => h.field === "decision")
      record(`${decision}: recorded in Work History`, hist.length === 1 && hist[0].new_value === decision && hist[0].actor === "founder")
    }
    const repeat = (await createJob(a, A.id, { title: "Two questions, same answer", assignee_type: "cherry" })).data
    for (const q of ["Question one?", "Question two?"]) {
      await patch(a, A.id, repeat.id, { waiting_question: q, status: "waiting_for_you" }, "question_asked", "cherry")
      await patch(a, A.id, repeat.id, { decision: "yes_do_it", decision_note: null, status: "working", waiting_question: null }, "decided")
    }
    const rep = (await historyFor(a, repeat.id)).data.filter((h) => h.field === "decision")
    record("same answer to two different questions is recorded twice", rep.length === 2, `${rep.length} decision entries`)

    // 5. TEAM
    section = "5 Team"
    const tm = await a.from("boss_team_members").insert({ user_id: A.id, name: "Jordan Lee", role: "VA", member_type: "employee",
      business_functions: ["operations", "delivery"] }).select().single()
    expectOk("add an employee", tm)
    const tj = await createJob(a, A.id, { title: "Clean up the CRM", assignee_type: "team_member", assignee_team_member_id: tm.data.id })
    expectOk("assign a job to the employee", tj)
    expectOk("archive the employee", await a.from("boss_team_members").update({ archived: true }).eq("id", tm.data.id).select())
    const kept = (await (await relogin(A)).from("boss_jobs").select("assignee_team_member_id").eq("id", tj.data.id).single()).data
    record("archived employee's job still assigned to them", kept.assignee_team_member_id === tm.data.id)
    record("archived employee's job history intact", (await historyFor(a, tj.data.id)).data.length >= 1)
    expectBlocked("team member cannot be deleted", await a.from("boss_team_members").delete().eq("id", tm.data.id).select())
    const still = (await a.from("boss_team_members").select("id, archived").eq("id", tm.data.id).single()).data
    record("employee record still exists, marked archived", still?.archived === true)

    // 6. WORKDAY CLOSE-OUT (mirrors closeCeoWorkdayPlan)
    section = "6 Close-out"
    const plan = await a.from("ceo_workday_plans").upsert({ user_id: A.id, plan_date: today, week_key: "qa", status: "in-progress" },
      { onConflict: "user_id,plan_date" }).select().single()
    expectOk("today's CEO Workday exists", plan)
    const done1 = (await createJob(a, A.id, { title: "Finish during workday" })).data
    const notDone = (await createJob(a, A.id, { title: "Planned but not finished" })).data
    const notOnPlan = (await createJob(a, A.id, { title: "Not on today's workday" })).data
    const blockedDep = (await createJob(a, A.id, { title: "Blocking prerequisite" })).data
    const blockedJob = (await createJob(a, A.id, { title: "Ticked off on workday but still blocked" })).data
    await a.from("boss_job_dependencies").insert({ user_id: A.id, job_id: blockedJob.id, depends_on_job_id: blockedDep.id })
    const items = [blockedJob, done1, notDone].map((j, i) => ({ plan_id: plan.data.id, user_id: A.id, position: i, title: j.title,
      treatment: "implement-operate", business_function: "operations", role: "founder-added", founder_decision: "added",
      status: j.id === notDone.id ? "planned" : "completed", local_work_item_id: j.id }))
    expectOk("jobs added to today's workday", await a.from("ceo_workday_plan_items").insert(items))

    const closeOut = () => require("./boss-phase3-closeout.cjs").closeOut(a, A.id, plan.data.id)
    const firstClose = await closeOut()
    const statuses = async () => Object.fromEntries((await a.from("boss_jobs").select("id,status")
      .in("id", [done1.id, notDone.id, notOnPlan.id, blockedJob.id])).data.map((j) => [j.id, j.status]))
    const st = await statuses()
    record("completed workday job marked Done", st[done1.id] === "done", JSON.stringify(firstClose))
    record("planned-but-unfinished job NOT marked Done", st[notDone.id] !== "done")
    record("job not on the workday untouched", st[notOnPlan.id] !== "done")
    record("still-blocked job not marked Done", st[blockedJob.id] !== "done")
    const count = async () => (await a.from("boss_job_history").select("id", { count: "exact", head: true }).eq("user_id", A.id)).count
    const before = await count()
    const doneAtBefore = (await a.from("boss_jobs").select("completed_at").eq("id", done1.id).single()).data.completed_at
    await closeOut()
    await closeOut()
    const afterCount = await count()
    const doneAtAfter = (await a.from("boss_jobs").select("completed_at").eq("id", done1.id).single()).data.completed_at
    record("closing out 3 times adds no extra history", before === afterCount, `${before} → ${afterCount} entries`)
    record("closing out again doesn't change completion time", doneAtBefore === doneAtAfter)
    const seg = (await a.from("segment_completions").select("id").eq("user_id", A.id).eq("segment_id", "ceo-workday").eq("completed_date", today)).data
    record("exactly one workday completion record after 3 close-outs", seg?.length === 1, `${seg?.length} records`)

    // 7. PRIVACY
    section = "7 Privacy"
    const b = B.client
    for (const t of ["boss_jobs", "boss_team_members", "boss_job_dependencies", "boss_job_history"]) {
      const { data } = await b.from(t).select("*").eq("user_id", A.id)
      record(`member B sees none of A's ${t}`, (data ?? []).length === 0, `${(data ?? []).length} rows`)
    }
    const { data: decisionsVisible } = await b.from("boss_jobs").select("decision").eq("id", cj.data.id)
    record("member B cannot read A's decisions even by exact job id", (decisionsVisible ?? []).length === 0)
    expectBlocked("B cannot edit A's job", await b.from("boss_jobs").update({ title: "hacked", last_change_actor: "founder" }).eq("id", id2).select())
    expectBlocked("B cannot delete A's job", await b.from("boss_jobs").delete().eq("id", id2).select())
    expectBlocked("B cannot create a job owned by A", await b.from("boss_jobs").insert({ user_id: A.id, title: "x", business_function: "sales" }).select())
    expectBlocked("B cannot edit A's team member", await b.from("boss_team_members").update({ name: "x" }).eq("id", tm.data.id).select())
    expectBlocked("B cannot assign A's team member to B's job", await createJob(b, B.id,
      { title: "steal", assignee_type: "team_member", assignee_team_member_id: tm.data.id }))
    const bJob = (await createJob(b, B.id, { title: "B's own job" })).data
    expectBlocked("B cannot link B's job to A's job", await b.from("boss_job_dependencies")
      .insert({ user_id: B.id, job_id: bJob.id, depends_on_job_id: id2 }).select())
    const anonRead = await fresh().from("boss_jobs").select("id").limit(1)
    record("signed-out visitor sees no jobs", (anonRead.data ?? []).length === 0)
    const untouched = (await a.from("boss_jobs").select("title").eq("id", id2).single()).data
    record("A's job unchanged after B's attempts", untouched.title === "Record onboarding video")

    // 8. WORK HISTORY IS PERMANENT
    section = "8 History locked"
    const someHist = (await historyFor(a, id1)).data[0]
    expectBlocked("member cannot edit Work History", await a.from("boss_job_history").update({ note: "rewritten" }).eq("id", someHist.id).select())
    expectBlocked("member cannot delete Work History", await a.from("boss_job_history").delete().eq("id", someHist.id).select())
    expectBlocked("member cannot insert fake Work History", await a.from("boss_job_history")
      .insert({ user_id: A.id, job_id: id1, action: "created", actor: "founder" }).select())
    expectBlocked("member cannot delete a job", await a.from("boss_jobs").delete().eq("id", id1).select())
    expectBlocked("member cannot call the history function directly", await a.rpc("boss_jobs_log"))
    const recheck = (await a.from("boss_job_history").select("note").eq("id", someHist.id).single()).data
    record("history entry unchanged", recheck.note === someHist.note)
  } finally {
    section = "Cleanup"
    for (const m of [A, B]) {
      const { error } = await admin.auth.admin.deleteUser(m.id)
      record(`test member ${m.tag} account removed cleanly`, !error, error?.message ?? "")
    }
  }
  const failed = results.filter((r) => !r.pass)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (process.argv[2]) require("fs").writeFileSync(process.argv[2], JSON.stringify(results, null, 2))
  process.exitCode = failed.length ? 1 : 0
}

main().catch((e) => { console.error("HARNESS ERROR", e); process.exit(2) })
