// Mirrors closeCeoWorkdayPlan in lib/ceo-workday/plan-server.ts (keep in sync).
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function closeOut(supabase, userId, planId) {
  const closedAt = new Date().toISOString()
  const { data: plan } = await supabase.from("ceo_workday_plans").select("plan_date").eq("id", planId).single()
  await supabase.from("ceo_workday_plans").update({ status: "closed", closed_at: closedAt }).eq("id", planId).eq("user_id", userId)

  const { data: items } = await supabase
    .from("ceo_workday_plan_items").select("status, local_work_item_id").eq("plan_id", planId).eq("user_id", userId)
  const finishedJobIds = (items ?? [])
    .filter((i) => i.status === "completed" && typeof i.local_work_item_id === "string")
    .map((i) => i.local_work_item_id)
    .filter((id) => UUID.test(id))
  let outcome = "nothing to finish"
  if (finishedJobIds.length > 0) {
    const { error } = await supabase
      .from("boss_jobs")
      .update({ status: "done", paused: false, last_change_actor: "founder", last_change_action: "finished",
        last_change_note: "Finished during CEO Workday™ close-out" })
      .eq("user_id", userId).in("id", finishedJobIds).neq("status", "done")
    outcome = error ? `error: ${error.message}` : "ok"
  }
  const total = items?.length ?? 0
  const completed = items?.filter((i) => i.status === "completed").length ?? 0
  await supabase.from("segment_completions").upsert(
    { user_id: userId, segment_id: "ceo-workday", completed_date: plan.plan_date,
      completion_status: total === 0 ? "skipped" : completed === total ? "completed" : completed > 0 ? "partial" : "skipped",
      completed_at: closedAt },
    { onConflict: "user_id,segment_id,completed_date" },
  )
  return outcome
}

module.exports = { closeOut }
