import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { getExecutive } from '@/lib/executives-data'

export const runtime = 'edge'

export async function POST(
  req: Request,
  { params }: { params: { executiveId: string } }
) {
  try {
    const { messages } = await req.json()
    const executive = getExecutive(params.executiveId)

    if (!executive) {
      return new Response('Executive not found', { status: 404 })
    }

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        { role: 'system', content: executive.systemPrompt },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Executive chat error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
