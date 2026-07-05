"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Workflow, Bot, UserCheck, ArrowDown } from "lucide-react"
import CherryBlossomChatModal from "@/components/cherry-blossom-chat-modal"
import { AITransformationExecutive } from "@/components/founder-os/ai-transformation-executive"
import { getBusinessFoundation, type BusinessFoundationRecord } from "@/utils/business-foundation-storage"

/**
 * Workspace 3 — 🤖 AI Augmentation Hour™.
 *
 * The daily Eliminate / Systemize / Automate / Delegate session, each launching
 * Cherry Blossom with a tailored prefill. The AI Transformation Executive™
 * (Chief AI Officer) lives inside this workspace. If the Business Foundation™
 * (Step 2) isn't set yet, we gently point the founder back to it first.
 */

const ESAD = [
  {
    id: "eliminate",
    icon: Trash2,
    title: "Eliminate",
    description: "What no longer serves your business? Let's find what to stop doing entirely.",
    prompt:
      "Let's do the Eliminate step of my AI Augmentation Hour. Help me identify low-value tasks and commitments I can stop doing entirely so I can protect my 4-Hour CEO Workday.",
  },
  {
    id: "systemize",
    icon: Workflow,
    title: "Systemize",
    description: "Which repeatable work should become a documented, repeatable system?",
    prompt:
      "Let's do the Systemize step of my AI Augmentation Hour. Help me turn a repetitive part of my business into a simple, documented system or SOP.",
  },
  {
    id: "automate",
    icon: Bot,
    title: "Automate",
    description: "What can AI or tools handle for you so it runs without your time?",
    prompt:
      "Let's do the Automate step of my AI Augmentation Hour. Recommend specific AI tools or automations for a task that's eating my time.",
  },
  {
    id: "delegate",
    icon: UserCheck,
    title: "Delegate",
    description: "What belongs with your AI Executive Leadership Team™ or a human teammate?",
    prompt:
      "Let's do the Delegate step of my AI Augmentation Hour. Help me decide what to hand to my AI Executive Leadership Team or a human, and how to brief them well.",
  },
] as const

export function AIAugmentationHour() {
  const { data, isLoading } = useSWR<BusinessFoundationRecord | null>("business-foundation", getBusinessFoundation, {
    revalidateOnFocus: false,
  })
  const [chat, setChat] = useState<(typeof ESAD)[number] | null>(null)

  const hasCompleted = Boolean(data?.completedAt)

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-6 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-[#5D9D61]" />
        <span>Loading your AI Augmentation Hour™…</span>
      </div>
    )
  }

  // Foundation not set yet → gently point back to Step 2.
  if (!hasCompleted) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-[#E26C73]/20 bg-[#E26C73]/5 p-5">
        <p className="text-[#3A2E33] leading-relaxed">
          {"To personalize your AI Augmentation Hour™, let's set your "}
          <strong>Business Foundation™</strong>
          {" first — it only takes a few minutes, and you'll never have to do it again."}
        </p>
        <div className="flex items-center gap-2 text-sm font-medium text-[#E26C73]">
          <ArrowDown className="h-4 w-4" />
          <span>Open Step 2 · Business Foundation Assessment™ above</span>
        </div>
      </div>
    )
  }

  // Returning member → the daily Eliminate / Systemize / Automate / Delegate session.
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-[#3A2E33] leading-relaxed">
          {"Before today's CEO Workday, let's lighten your load. Choose one lever — "}
          <strong>Eliminate</strong>, <strong>Systemize</strong>, <strong>Automate</strong>, or{" "}
          <strong>Delegate</strong>
          {" — and I'll coach you through it."}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {ESAD.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer border-2 border-[#5D9D61]/25 transition-all hover:border-[#E26C73]"
              onClick={() => setChat(item)}
            >
              <CardHeader>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#5D9D61]/10">
                  <item.icon className="h-6 w-6 text-[#5D9D61]" />
                </div>
                <CardTitle className="text-lg text-[#3A2E33]">{item.title}</CardTitle>
                <CardDescription className="leading-relaxed">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-[#E26C73] text-white hover:bg-[#E26C73]/90">
                  Start with Cherry Blossom
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Transformation Executive™ — the Chief AI Officer lives inside the Hour. */}
      <div id="ai-transformation-executive" className="scroll-mt-6 border-t border-[#E26C73]/15 pt-8">
        <AITransformationExecutive />
      </div>

      {chat && (
        <CherryBlossomChatModal
          isOpen={Boolean(chat)}
          onClose={() => setChat(null)}
          prefillMessage={chat.prompt}
          conversationTitle={`AI Augmentation Hour — ${chat.title}`}
          executiveRole="Cherry Blossom - AI Augmentation Coach"
        />
      )}
    </div>
  )
}
