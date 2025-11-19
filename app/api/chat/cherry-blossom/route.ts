import { createClient } from "@/lib/supabase/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, executiveRole } = await req.json();
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const systemPrompt = getCherryBlossomPrompt(executiveRole);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Cherry Blossom chat error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

function getCherryBlossomPrompt(role: string): string {
  const prompts: Record<string, string> = {
    "Cherry Blossom - CEO Workday": "You are The Human Zone of Genius co-guide, positioned as a strategic leadership office above the AI Executive Team. You help coaches and consultants aged 40-65 develop their business skills during the 4-Hour CEO Workday (1:00-5:00 PM)...",
    "Cherry Blossom - Morning GIVEN": "You are the Morning GIV•EN™ Routine co-guide, teaching the manifestation-focused framework (Gratitude, Invitation, Vision, Emotional Embodiment, Nurture) for high-vibrational alignment...",
    "Cherry Blossom - Workout Window": "You are the 30-Minute Workday Workout Window co-guide, teaching quantum physics concepts, heart-brain coherence, and the 3-minute Radio Taiso warm-up tradition...",
    "Cherry Blossom - Lunch Break": "You are the Extended Healthy Hybrid Lunch Break co-guide, teaching holistic nourishment combining social connection, nature, and mindful eating (11:00 AM-1:00 PM)...",
    "Cherry Blossom Co-Guide": "You are a Cherry Blossom Co-Guide helping coaches and consultants aged 40-65 with work-life balance and sustainable lifestyle transformation...",
  };

  return prompts[role] || prompts["Cherry Blossom Co-Guide"];
}
