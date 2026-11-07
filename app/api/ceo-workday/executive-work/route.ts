import { generateObject, generateText, type LanguageModel } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { guardMemberAi } from "@/lib/ai/guard"
import { createClient } from "@/lib/supabase/server"
import { proposeJobAction } from "@/lib/boss/authority"
import { CHERRY_ROUTES, EXECUTIVE_FOCUS, executiveName } from "@/lib/boss/executive-personas"
import { labelFor, JOB_FUNCTIONS } from "@/lib/boss/jobs/definitions"

/**
 * The executive actually does the work on a CEO Workday™ job.
 *
 * "work": drafts the real deliverable and hands it back through the Phase 4
 *   proposal gate (`job.save_whats_ready`). Nothing is saved to the job until
 *   the founder approves it (or an active pre-authorization covers it).
 * "ask": the founder asks the executive a question about the job.
 */

export const maxDuration = 60

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const WorkSchema = z.object({
  whatIDid: z.array(z.string()).min(1).max(5).describe("Short, plain sentences: what you actually did, in order."),
  deliverable: z.string().min(1).describe("The finished work itself, ready to use. Not a plan to do the work."),
  needFromFounder: z.string().describe("One short question or thing you need from the founder, or an empty string."),
})

// Two @ai-sdk/provider versions are pinned in the repo; bridge the nominal type mismatch.
const model = () => openai("gpt-4o-mini") as unknown as LanguageModel

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export async function POST(req: Request) {
  const aiGuard = await guardMemberAi(req, "ceo-workday-executive-work")
  if (!aiGuard.ok) return aiGuard.response

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const jobId = typeof body.jobId === "string" ? body.jobId : ""
  const mode = body.mode === "ask" ? "ask" : "work"
  const instruction = clip(body.instruction, 2000)
  if (!UUID.test(jobId)) return Response.json({ error: "That work could not be found." }, { status: 400 })
  if (mode === "ask" && !instruction) return Response.json({ error: "Type your question first." }, { status: 400 })

  const supabase = await createClient()
  const { data: job } = await supabase
    .from("boss_jobs")
    .select("id, title, details, business_function, assignee_type, assignee_executive_id, permission_level, whats_ready, stopped, paused, status")
    .eq("id", jobId)
    .eq("user_id", aiGuard.user.id)
    .maybeSingle()
  if (!job) return Response.json({ error: "That work could not be found." }, { status: 404 })
  if (job.assignee_type !== "executive" && job.assignee_type !== "cherry") {
    return Response.json({ error: "Give this work to Cherry Blossom™ or an executive first." }, { status: 409 })
  }
  if (job.stopped || job.paused) return Response.json({ error: "This work is paused or stopped." }, { status: 409 })
  if (job.status === "done") return Response.json({ error: "This work is already done." }, { status: 409 })

  const executiveId =
    job.assignee_type === "executive" && job.assignee_executive_id
      ? job.assignee_executive_id
      : (CHERRY_ROUTES[job.business_function] ?? "strategy")
  const who = executiveName(executiveId)
  const viaCherry = job.assignee_type === "cherry"

  const { data: pending } = await supabase
    .from("boss_job_proposals")
    .select("action_payload")
    .eq("user_id", aiGuard.user.id)
    .eq("job_id", jobId)
    .eq("status", "pending")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle()
  const lastDraft = clip((pending?.action_payload as { text?: unknown } | null)?.text, 4000) || clip(job.whats_ready, 4000)

  const system = `You are the ${who} on a founder's AI executive team${viaCherry ? ", chosen by Cherry Blossom (the founder's AI guide)" : ""}.
${EXECUTIVE_FOCUS[executiveId] ?? ""}
Write in simple, warm, everyday words. No jargon. No emojis.
You cannot publish, send, pay or contact anyone. You prepare work; the founder reviews and approves it.
Never invent facts about the founder's business (prices, names, results). If you need one, leave a clear [blank] and ask for it.`

  const context = `Work: ${job.title}
Business area: ${labelFor(JOB_FUNCTIONS, job.business_function)}
${job.details ? `What the founder wants: ${clip(job.details, 2000)}` : ""}
${lastDraft ? `\nYour last draft:\n${lastDraft}` : ""}`

  try {
    if (mode === "ask") {
      const { text } = await generateText({
        model: model(),
        system,
        prompt: `${context}\n\nThe founder asks: ${instruction}\n\nAnswer in 1–4 short sentences.`,
        maxTokens: 300,
      })
      return Response.json({ answer: text.trim(), executive: who })
    }

    const { object } = await generateObject({
      model: model(),
      schema: WorkSchema,
      system,
      prompt: `${context}
${instruction ? `\nThe founder's instructions: ${instruction}` : ""}

Do the work now. Produce the finished deliverable (for example the full post, email, script or plan), not a description of it.${
        lastDraft ? " Improve your last draft using the founder's instructions." : ""
      } Keep the deliverable under 3,000 characters.`,
      maxTokens: 1400,
    })

    const deliverable = object.deliverable.trim().slice(0, 3900)
    const need = object.needFromFounder.trim()
    const summary = [
      `${who}: ${object.whatIDid.map((s) => s.trim()).join(" ")}`,
      need ? `I need from you: ${need}` : "",
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, 2000)

    const proposal = await proposeJobAction(supabase, {
      jobId,
      proposedBy: viaCherry ? "cherry" : "executive",
      aiCapability: `workday.draft:${executiveId}`,
      summary,
      actionKind: "job.save_whats_ready",
      payload: { text: deliverable },
    })
    if (!proposal.ok) {
      console.error("[executive-work] proposal failed:", proposal.error)
      return Response.json({ error: "The work was done but could not be saved. Please try again." }, { status: 500 })
    }
    return Response.json({
      executive: who,
      whatIDid: object.whatIDid,
      needFromFounder: need || null,
      proposalId: proposal.proposalId,
      savedWithoutReview: proposal.executed,
    })
  } catch (error) {
    console.error("[executive-work] error:", error instanceof Error ? error.message : error)
    return Response.json({ error: `${who} could not finish this right now. Please try again.` }, { status: 502 })
  }
}
