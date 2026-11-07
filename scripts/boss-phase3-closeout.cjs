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
  const errors = []
  for (const jobId of finishedJobIds) {
    const { error } = await supabase
      .from("boss_jobs")
      .update({ status: "done", paused: false, last_change_actor: "founder", last_change_action: "finished",
        last_change_note: "Finished during CEO Workday™ close-out" })
      .eq("user_id", userId).eq("id", jobId).neq("status", "done")
    if (error) errors.push(error.message)
  }
  const total = items?.length ?? 0
  const completed = items?.filter((i) => i.status === "completed").length ?? 0
  const completionStatus =
    total > 0 && completed === total ? "honored" : completed > 0 ? "modified" : "not-completed"
  const { data: existing } = await supabase.from("segment_completions").select("id")
    .eq("user_id", userId).eq("segment_id", "ceo-workday").eq("segment_date", plan.plan_date).limit(1).maybeSingle()
  const seg = existing
    ? await supabase.from("segment_completions").update({ completion_status: completionStatus }).eq("id", existing.id).eq("user_id", userId)
    : await supabase.from("segment_completions").insert({ user_id: userId, segment_id: "ceo-workday",
        segment_date: plan.plan_date, completion_status: completionStatus })
  if (seg.error) errors.push(`segment: ${seg.error.message}`)
  return finishedJobIds.length === 0 ? "nothing to finish" : errors.length ? `refused: ${errors.join("; ")}` : "ok"
}

module.exports = { closeOut }
