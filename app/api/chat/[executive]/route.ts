import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { getExecutive } from '@/lib/executives-config'

export const runtime = 'edge'

export async function POST(
  req: Request,
  { params }: { params: { executive: string } }
) {
  const { messages } = await req.json()
  const executive = getExecutive(params.executive)

  if (!executive) {
    return new Response('Executive not found', { status: 404 })
  }

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: executive.systemPrompt,
    messages,
  })

  return result.toAIStreamResponse()
}
