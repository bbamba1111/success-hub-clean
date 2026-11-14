import { guardMemberAi } from "@/lib/ai/guard"
import { z } from "zod"

export const runtime = "nodejs"
export const maxDuration = 60

const RequestSchema = z.object({
  taskTitle: z.string().min(3).max(180),
  category: z.enum(["podcasts", "speaking", "media", "newsletters", "partners", "groups", "customers"]),
  businessName: z.string().max(160).nullable().optional(),
  businessDescription: z.string().max(700).nullable().optional(),
  idealAudience: z.string().max(500).nullable().optional(),
  expertise: z.array(z.string().max(120)).max(12).optional(),
  location: z.string().max(120).optional(),
  additionalDirection: z.string().max(500).optional(),
})

type SearchResult = { title: string; url: string; content: string; score?: number }

export async function POST(req: Request) {
  const gate = await guardMemberAi(req, "founder-gps-research")
  if (!gate.ok) return gate.response
  const parsed = RequestSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Please check the research details and try again." }, { status: 400 })
  const input = parsed.data
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) return Response.json({
    error: "Live web research is not connected yet. Add TAVILY_API_KEY to the Preview environment to enable verified web results.",
    code: "RESEARCH_PROVIDER_NOT_CONFIGURED",
  }, { status: 503 })

  const audience = input.idealAudience || "the audience served by this business"
  const topics = input.expertise?.join(", ") || input.businessDescription || "the founder's expertise"
  const location = input.location ? " " + input.location : ""
  const queries: Record<typeof input.category, string> = {
    podcasts: `podcasts accepting guest pitches about ${topics} for ${audience}${location}`,
    speaking: `conferences events speaker application call for speakers about ${topics}${location}`,
    media: `journalists publications media outlets seeking expert commentary about ${topics}${location}`,
    newsletters: `newsletters publications accepting expert contributors about ${topics}${location}`,
    partners: `organizations businesses potential strategic referral partners serving ${audience}${location}`,
    groups: `professional associations communities events for ${audience}${location}`,
    customers: `organizations directories communities where ${audience} can be reached${location}`,
  }
  const query = [queries[input.category], input.additionalDirection].filter(Boolean).join(". ")
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        topic: "general",
        max_results: 10,
        include_answer: false,
        include_raw_content: false,
      }),
      signal: AbortSignal.timeout(45000),
    })
    if (!response.ok) throw new Error(`Research provider returned ${response.status}`)
    const payload = await response.json() as { results?: SearchResult[] }
    const results = (payload.results ?? []).filter((item) => {
      try { return ["http:", "https:"].includes(new URL(item.url).protocol) } catch { return false }
    }).slice(0, 10).map((item) => ({
      title: String(item.title ?? "Untitled source").slice(0, 240),
      url: item.url,
      summary: String(item.content ?? "").slice(0, 900),
      relevance: typeof item.score === "number" ? Math.round(item.score * 100) : null,
    }))
    return Response.json({
      query,
      results,
      searchedAt: new Date().toISOString(),
      note: "These are live search results, not confirmed invitations or endorsements. Verify current deadlines, eligibility and contact details on each source site.",
    })
  } catch (error) {
    console.error("[founder-gps-research]", error instanceof Error ? error.message : error)
    return Response.json({ error: "The research search could not be completed. Please try again." }, { status: 502 })
  }
}
