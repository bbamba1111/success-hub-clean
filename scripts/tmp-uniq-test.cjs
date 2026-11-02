const { Client } = require("pg")
const url = process.env.SUPABASE_POSTGRES_URL_NON_POOLING.replace(/[?&]sslmode=[^&]*/, "")
const mk = () => new Client({ connectionString: url, ssl: { rejectUnauthorized: false } })

;(async () => {
  const a = mk()
  const b = mk()
  await a.connect()
  await b.connect()
  const out = {}
  try {
    const { rows } = await a.query(
      `select p.id as plan_id, p.user_id, o.id as occ_id
         from ceo_workday_plans p
         join boss_experience_occurrences o on o.user_id = p.user_id
        limit 1`,
    )
    if (!rows.length) throw new Error("no plan+occurrence pair available")
    const { plan_id, user_id, occ_id } = rows[0]
    const key = `${occ_id}:__uniq_test__`
    const ins = (c, occ, k) =>
      c.query(
        `insert into ceo_workday_plan_items (plan_id, user_id, position, title, assignment_key, experience_occurrence_id)
         values ($1,$2,999,'__uniq_test__',$3,$4) returning id`,
        [plan_id, user_id, k, occ],
      )

    await a.query("begin")
    await b.query("begin")
    await ins(a, occ_id, key)
    const bPromise = ins(b, occ_id, key).then(
      () => "inserted",
      (e) => e.code,
    )
    await new Promise((r) => setTimeout(r, 1500))
    out.bBlockedWhileAOpen = (await Promise.race([bPromise, Promise.resolve("blocked")])) === "blocked"
    await a.query("savepoint s")
    out.sameTxDuplicate = await ins(a, occ_id, key).then(() => "inserted", (e) => e.code)
    await a.query("rollback to savepoint s")
    await a.query("commit")
    out.bAfterACommit = await bPromise
    await b.query("rollback")
    const del = await a.query(`delete from ceo_workday_plan_items where title='__uniq_test__' and position=999`)
    out.cleanedUp = del.rowCount
  } finally {
    await a.end().catch(() => {})
    await b.end().catch(() => {})
  }
  console.log(JSON.stringify(out))
  process.exit(0)
})().catch((e) => {
  console.error("ERR", e.message)
  process.exit(1)
})
