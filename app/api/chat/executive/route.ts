import { createClient } from "@/lib/supabase/server"
import { StreamingTextResponse } from "ai"
import { NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { messages, conversationId, executiveRole } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse("Messages are required", { status: 400 })
    }

    const systemPrompt = `You are ${executiveRole}, a specialized AI executive coach for coaches and consultants aged 40-65. You provide educational coaching with warm, empathetic guidance while being transparent about being an AI trained on proven methodology.

Your approach:
1. Recommend: Share top 0.1% industry examples
2. Define: Explain concepts clearly
3. Rationale: Provide strategic reasoning
4. Implement: Offer actionable next steps
5. Measure: Define success metrics

Keep responses focused, practical, and example-rich. Use warm, approachable language that balances AI transparency with coaching expertise.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("OpenAI API error:", error)
      return new NextResponse("Error from OpenAI API", { status: response.status })
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        const decoder = new TextDecoder()
        let buffer = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || trimmed === "data: [DONE]") continue
              if (!trimmed.startsWith("data: ")) continue

              try {
                const json = JSON.parse(trimmed.slice(6))
                const content = json.choices?.[0]?.delta?.content
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content))
                }
              } catch (e) {
                console.error("Error parsing SSE:", e)
              }
            }
          }
        } finally {
          controller.close()
        }
      },
    })

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error in executive chat:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
