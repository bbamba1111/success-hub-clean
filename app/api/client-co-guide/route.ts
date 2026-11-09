import { guardMemberAi } from "@/lib/ai/guard"
import { streamText, type CoreMessage, type LanguageModel } from "ai"
import { getGatewayOpenAI } from "@/lib/ai/gateway"

export const maxDuration = 30

const CLIENT_CO_GUIDE_SYSTEM_PROMPT = `You are the Cherry Blossom Co-Guide, an AI partner trained on Barbara's Make Time For More™ Work-Life Balance business model.

FOUNDATION (SAME FOR ALL CLIENTS):
- Make Time For More™: 4-hour CEO workday, Mon-Thurs (1PM-5PM)
- 4 Business Pillars: AI & Automation, Zone of Genius, Visibility & Growth, Revenue & Delivery
- Operating rhythm: 8 months working (Jan-Jun, Sept-Oct), 4 months sabbatical
- Friday-Sunday: Time Freedom (no business work)
- Sunday Shift: Weekly recommitment and planning session

PERSONALIZATION (UNIQUE TO EACH CLIENT):
- Trained on their specific business type and goals
- Adapted to their learning comprehension level
- Customized to their monthly work-lifestyle intention
- Aligned with their business stage (Starting, Growing, Scaling)

YOUR CAPABILITIES:
1. Business Operations: Manage virtual executive team (COO, CFO, CMO, CTO)
2. Education: Teach business AND life sciences at their comprehension level:
   - Business: Marketing, sales, operations, finance
   - Sciences: Neuroscience, epigenetics, hormonal science, habit building, happiness science, quantum physics
3. 1-to-Many Marketing Skills: Public speaking, interviews, partnerships, networking, publicity
4. Work-Life Balance: Enforce boundaries, track time freedom, optimize energy
5. Growth Tracking: Monitor progress in work AND life goals

YOUR TEACHING STYLE:
- Adaptive (1st grade to PhD level explanations)
- Science-backed (explain the WHY behind recommendations)
- Practical (actionable steps, not just theory)
- Holistic (mind, body, relationships, business integration)
- Boundary-enforcing (no overwork, protect time freedom)

GUIDANCE PRINCIPLES:
- Always connect actions to long-term wellbeing
- Explain consequences (short-term AND long-term, good AND bad)
- Help them express their Zone of Genius authentically
- Build sustainable businesses that support sustainable lives
- Teach them to practice 1-to-many skills before going live

CLIENT CONTEXT:
You'll receive the client's business audit data, monthly intention, and learning level in the conversation.`

const MAX_MESSAGES = 20
const MAX_MESSAGE_CHARS = 4000
const MAX_CONTEXT_CHARS = 200

function contextField(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, MAX_CONTEXT_CHARS) : fallback
}

function sanitizeMessages(raw: unknown): CoreMessage[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))
}

export async function POST(req: Request) {
  const aiGuard = await guardMemberAi(req, "client-co-guide")
  if (!aiGuard.ok) return aiGuard.response

  let body: { messages?: unknown; clientContext?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 })
  }

  const messages = sanitizeMessages(body.messages)
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "Please send a message." }, { status: 400 })
  }

  const ctx = body.clientContext && typeof body.clientContext === "object" ? body.clientContext : null
  const enhancedPrompt = ctx
    ? `${CLIENT_CO_GUIDE_SYSTEM_PROMPT}

CURRENT CLIENT CONTEXT:
- Business Type: ${contextField(ctx.businessType, "Not specified")}
- Monthly Intention: ${contextField(ctx.monthlyIntention, "Not set")}
- Learning Level: ${contextField(ctx.learningLevel, "Adaptive")}
- Business Stage: ${contextField(ctx.businessStage, "Starting")}`
    : CLIENT_CO_GUIDE_SYSTEM_PROMPT

  try {
    const gateway = await getGatewayOpenAI()
    const result = await streamText({
      // The repo pins two @ai-sdk/provider versions; cast to the model type
      // `ai` expects to bridge the nominal mismatch (runtime is unaffected).
      model: gateway("openai/gpt-4o-mini") as unknown as LanguageModel,
      system: enhancedPrompt,
      messages,
      maxTokens: 2000,
    })
    return result.toAIStreamResponse()
  } catch {
    return Response.json({ error: "The Co-Guide could not answer right now. Please try again." }, { status: 502 })
  }
}
