import { Configuration, OpenAIApi } from "openai-edge"
import { OpenAIStream, StreamingTextResponse } from "ai"
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

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(config)

  const response = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      { role: "system", content: executive.systemPrompt },
      ...messages,
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
