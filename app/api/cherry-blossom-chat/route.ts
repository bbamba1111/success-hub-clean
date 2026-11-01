import { type NextRequest, NextResponse } from "next/server"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"
import { createClient } from "@/lib/supabase/server"
import { savePlanningPreference } from "@/lib/cherry-blossom/memory"
import { buildCherrySystemPrompt, resolveSurface } from "@/lib/cherry-blossom/brain"

/** Maps a planning-choice marker id to a coaching-style label + model instruction. */
const PLANNING_CHOICE_MAP: Record<string, { style: string; instruction: string }> = {
  "lets-plan-together": {
    style: "Let's Plan Together",
    instruction:
      "The member chose LET'S PLAN TOGETHER for this experience. Begin a warm, collaborative planning conversation. Ask ONE thoughtful question at a time to help them plan and to learn about them naturally. Do not interrogate or list many questions.",
  },
  "give-me-ideas": {
    style: "Give Me a Few Ideas",
    instruction:
      "The member chose GIVE ME A FEW IDEAS for this experience. Do NOT interview them. Immediately offer 3-5 thoughtful, specific ideas tailored to this activity and anything you remember about them. Keep it brief and warm.",
  },
  "im-all-set": {
    style: "I'm All Set",
    instruction:
      "The member chose I'M ALL SET for this experience. Respond briefly and warmly (e.g. wish them a wonderful experience and say you're here if they need anything). Do NOT ask any planning questions or offer ideas.",
  },
}

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] API route called")

    if (!isWithinBusinessHours()) {
      return NextResponse.json(
        {
          error: "The Success Hub is closed for the night (11 PM - 7 AM ET). We'll see you tomorrow at 7 AM ET!",
          message:
            "The Success Hub is closed for the night. Business Hours: 7 AM - 11 PM ET. Remember: Work-Life Balance means rest too! 💚",
        },
        { status: 403 },
      )
    }

    const body = await req.json()
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { message, messages = [], context } = body

    if (!message) {
      console.log("[v0] No message provided")
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OPENAI_API_KEY is not set")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("[v0] Calling OpenAI API directly with message:", message)
    console.log("[v0] Context:", context)

    // Shared Cherry Blossom brain: core identity + the member's memory. Routine
    // contexts get exactly what they had before; ceo-workday adds the coordinator role.
    const systemPrompt = await buildCherrySystemPrompt(resolveSurface(context))

    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ]

    let userPrompt = message
    if (message === "WELCOME_MESSAGE" && context) {
      const welcomePrompts: Record<string, string> = {
        "morning-routine":
          "Please introduce yourself as Cherry Blossom and share this brief welcome:\n\nHello, I'm Cherry Blossom, your work-life harmony co-guide! I'm here to help you plan your Morning GIV•EN Routine - a sacred practice that shifts you from survival mode to creation mode.\n\nThe GIV•EN Framework (Gratitude, Invitation, Visualization, Embodiment, Nurturing) is both spiritual and scientific:\n• **Spiritually:** Connects you with your Creator and aligns your day with divine co-creation\n• **Scientifically:** Activates heart-brain coherence, releases oxytocin and serotonin, reduces cortisol, and rewires neural pathways\n\nWhen you practice GIV•EN, you're literally changing your biology and raising your energetic frequency.\n\nAre you ready to plan or ease into your Morning GIV•EN Routine?\n\n(I can share more about the neuroscience, the 5-step flow, or specific practices if you'd like!)",
        "workout-window":
          "Please introduce yourself as Cherry Blossom and share this brief welcome:\n\nHello, I'm Cherry Blossom, your work-life harmony co-guide! I'm here to help you plan your 30-Minute Workday Workout Window - a powerful practice that breaks the hustle habit of sitting all day on caffeine.\n\nThis workout window starts with **Radio Taiso** (a beloved Japanese movement tradition since 1928) at 10:25 AM ET, followed by your personal movement routine. When you move your body, you're literally raising your vibrational frequency and nurturing the spiritual seed of intention you planted during onboarding.\n\n**Quick Benefits:**\n• Spiritually: Elevates your energy and aligns you with your intentions\n• Scientifically: Releases endorphins, dopamine, and serotonin while reducing cortisol\n• Physically: Activates your lymphatic system, increases blood flow, and energizes every cell\n\nWill you be joining us at 10:25 AM ET for our 3-6 minute Radio Taiso warm-up?\n\n(I can share more about Radio Taiso's fascinating history, the body-as-energy science, or movement options if you'd like!)",
        "lunch-break":
          "Please introduce yourself as Cherry Blossom and share this brief welcome:\n\nHello, I'm Cherry Blossom, your work-life harmony co-guide! I'm here to help you plan your Extended Healthy Hybrid Lunch Break - a transformative practice that breaks the hustle habit of rushing through meals or eating at your desk.\n\n**What is 'Hybrid'?**\nThis 1.5-2 hour break blends three elements:\n• **Nourishment** - Mindful eating that fuels body and soul\n• **Connection** - Quality time with loved ones, colleagues, or yourself\n• **Creativity** - Space for inspiration, nature, and sensory pleasure\n\n**Quick Benefits:**\n• **Spiritually:** Sacred nourishment, presence practice, relationship cultivation\n• **Scientifically:** 300% better nutrient absorption in relaxed state, cortisol reduction, oxytocin release, improved afternoon focus\n• **Time-Saving:** Couples with your 30-Minute Workout Window for efficient well-being\n\n**Hybrid Ideas:** Lunch dates, outdoor cafes, picnics, networking lunches, celebration meals, beach dining, or breaking bread with new partners/collaborators.\n\nHow would you like to experience your lunch break today - nourishment + connection, nourishment + creativity, or nourishment + nature?\n\n(I can share more about the digestive science, tech-free benefits, or specific hybrid ideas if you'd like!)",
        "ceo-workday":
          "Please introduce yourself as Cherry Blossom and share this brief welcome:\n\nHello, I'm Cherry Blossom, your work-life harmony co-guide! I'm here to help you plan your 4-Hour Focused CEO Workday - a practice that breaks the hustle habit of working endlessly on everything.\n\nThis system is built on the **Pareto Principle (80/20 rule):** 20% of your activities produce 80% of your results. We focus ONLY on high-impact, needle-moving CEO work and delegate the rest.\n\n**Quick Benefits:**\n• **Spiritually:** You are the visionary and steward of your life's work - CEO energy is about leading with intention, not managing with reaction\n• **Scientifically:** Your prefrontal cortex has limited capacity. Four focused hours of deep work produce more value than eight scattered hours. Energy management > time management.\n\nThis isn't just time-blocking - it's energy protection and strategic leadership.\n\nHow can I help you plan your 4-hour CEO workday today?\n\n(I can share the 10 CEO Energy Ground Rules, the 10 CEO Energy Pillars, or walk you through the planning flow if you'd like!)",
        "lifestyle-experiences":
          "Please introduce yourself as Cherry Blossom and share this brief welcome:\n\nHello, I'm Cherry Blossom 🌸, your work-life harmony co-guide! I'm here to help you plan your Quality of Lifestyle Experiences - breaking the hustle habit of putting off joy until 'someday.'\n\n**The Cherry Blossom Wisdom:**\nIn Japan, Cherry Blossoms bloom for only 1-2 weeks each year. The tradition of Hanami teaches us that life is fleeting and transient - just like the blossoms. The moments you're delaying are slipping away like petals in the wind.\n\n**Quick Benefits:**\n• **Spiritually:** Living in divine timing, soul nourishment, energy elevation, legacy creation\n• **Scientifically:** Novel experiences trigger dopamine, oxytocin, and serotonin. They create neuroplasticity, reduce cortisol, and increase longevity\n• **Your Ripple Effect:** When you choose joy, you inspire your family, team, and community to do the same\n\n**12 Curated Experiences:** Treat yourself, practice self-care, learn or do something new, spend time in nature, work on a hobby, add beauty to your space, compliment others, spend quality time with loved ones, nurture relationships, plan social playdates, take a vacation, give to a cause.\n\nWhich one or two experiences will you immerse yourself into today? Or feel free to create your own unique experience not listed here - the possibilities are endless!\n\n(I can share more about the relationship with self, the BIG ripple effect, or help you brainstorm custom experiences if you'd like! And don't forget to take photos and share your joy in our community - your story might inspire someone else to choose joy today!)",
        "digital-detox":
          "Please introduce yourself as Cherry Blossom and share this brief welcome:\n\nHello, I'm Cherry Blossom, your work-life harmony co-guide! I'm here to help you plan your Power Down & Unplug Digital Detox - a practice that breaks the hustle habit of pushing through exhaustion.\n\nThis evening ritual is about sacred rest and cellular restoration, not just 'going to bed.'\n\n**Quick Benefits:**\n• **Spiritually:** Rest is an act of faith - you trust that the world will continue without your constant effort. Sleep is when your soul integrates the day's lessons\n• **Scientifically:** Blue light from screens suppresses melatonin by 50%. Consistent sleep schedules optimize cortisol, growth hormone, and cellular repair. Your glymphatic system (brain's waste removal) only activates during deep sleep\n\nThis isn't just bedtime - it's biological optimization and spiritual surrender.\n\nHow can I help you plan your evening wind-down routine today?\n\n(I can share more about circadian rhythm, digital sunset practices, or evening ritual options if you'd like!)",
        "sabbatical-planning":
          "Hello, I'm Cherry Blossom, your work-life harmony co-guide! I'm here to help you intentionally design restorative breaks that prevent burnout and create sustainable work-life harmony.\n\nWhether you're planning a 1-week mini-sabbatical, a 2-4 week sabbatical, or an extended leave, this process helps you restore what matters most: energy, creativity, relationships, and health.\n\n**Quick Benefits:**\n• **Spiritually:** Soul restoration, reconnection with purpose, honoring the sacred rhythm of work and rest\n• **Scientifically:** Prevents burnout, boosts creativity (incubation effect), improves health, increases long-term productivity\n• **Your ROI:** Rest isn't a luxury - it's a strategic investment that compounds your effectiveness\n\nI'll guide you through assessing your current state, designing your ideal break, overcoming resistance, and creating a re-entry plan.\n\nHow burned out are you feeling right now on a scale of 1-10?\n\n(I can share more about the Sabbatical Design Canvas, break resistance breakthrough strategies, or budget-friendly break ideas if you'd like!)",
      }

      userPrompt =
        welcomePrompts[context] || "Please introduce yourself as Cherry Blossom and ask how you can help today."
    } else if (typeof message === "string" && message.startsWith("[PLANNING_CHOICE:")) {
      // Universal planning-choice buttons. Persist the member's preferred coaching
      // style for this activity (best-effort) and steer the model accordingly.
      const match = message.match(/^\[PLANNING_CHOICE:\s*([a-z-]+)\]/i)
      const choiceId = match?.[1]?.toLowerCase() ?? ""
      const choice = PLANNING_CHOICE_MAP[choiceId]

      if (choice && context) {
        try {
          const supabase = await createClient()
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (user) {
            await savePlanningPreference(supabase, user.id, context, choice.style)
          }
        } catch (err) {
          console.log("[v0] savePlanningPreference skipped:", (err as Error)?.message)
        }
      }

      const instruction = choice?.instruction ?? "Help the member plan today's experience warmly."
      userPrompt = `[Context: ${context ?? "general"}]\n[Formatting: Do NOT use markdown headers (***, **, *, ###, ##, #) in your response. Use bold text (**text**) for emphasis instead.]\n\n${instruction}`
    } else if (context) {
      userPrompt = `[Context: ${context}]\n[Formatting: Do NOT use markdown headers (***, **, *, ###, ##, #) in your response. Use bold text (**text**) for emphasis instead.]\n\n${message}`
    }

    conversationMessages.push({ role: "user", content: userPrompt })

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] OpenAI API error:", response.status, errorData)
      return NextResponse.json(
        { error: "Failed to get response from OpenAI", details: errorData },
        { status: response.status },
      )
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."

    console.log("[v0] OpenAI response received, length:", text.length)

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("[v0] Error in cherry-blossom-chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to process your message. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
