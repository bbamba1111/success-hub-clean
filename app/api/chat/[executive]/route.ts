import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { getExecutive } from "@/lib/executives-config"

export const runtime = "edge"

export async function POST(
  req: Request,
  { params }: { params: { executive: string } }
) {
  const { messages } = await req.json()
  const executive = getExecutive(params.executive)

  if (!executive) {
    return new Response("Executive not found", { status: 404 })
  }

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: executive.systemPrompt,
    messages,
  })

  return result.toUIMessageStreamResponse()
}
