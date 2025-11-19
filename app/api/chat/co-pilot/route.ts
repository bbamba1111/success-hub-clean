import { createClient } from "@/lib/supabase/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const systemPrompt = "You are the Co-Pilot, a friendly AI assistant guiding coaches and consultants aged 40-65 through the 4-Hour CEO platform. You help them navigate the 25 AI coaching guides and understand the work-life balance transformation journey.";

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Co-Pilot chat error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
