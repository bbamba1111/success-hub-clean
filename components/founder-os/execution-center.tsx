"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, Rocket, CalendarClock, CheckCircle2 } from "lucide-react"

/**
 * Workspace 5 — 🚀 Execution Center™ (architecture placeholder).
 *
 * The future home where deliverables produced by the AI Executive Leadership
 * Team™ flow through four states before going live. Phase 1A shows the states
 * only — no real assets yet.
 */

const STATES = [
  {
    id: "awaiting-approval",
    icon: ClipboardCheck,
    title: "Awaiting Your Approval",
    description: "Drafts your AI Executive Leadership Team™ has prepared, waiting for your review and sign-off.",
    accent: "#E26C73",
  },
  {
    id: "ready-to-publish",
    icon: Rocket,
    title: "Ready to Publish",
    description: "Approved deliverables staged and ready to go live the moment you say the word.",
    accent: "#5D9D61",
  },
  {
    id: "scheduled",
    icon: CalendarClock,
    title: "Scheduled",
    description: "Work queued to publish or send automatically at the times you choose.",
    accent: "#5D9D61",
  },
  {
    id: "published",
    icon: CheckCircle2,
    title: "Published",
    description: "Completed, live work — a running record of momentum from your 4-hour workdays.",
    accent: "#3A2E33",
  },
]

export function ExecutionCenter() {
  return (
    <div className="space-y-5">
      <p className="text-[#3A2E33] leading-relaxed">
        {"This is where execution comes together. As your "}
        <strong>AI Executive Leadership Team™</strong>
        {" produces deliverables, they'll move through these four states — always with your approval before anything goes live."}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATES.map((state) => (
          <Card key={state.id} className="border-2 border-[#5D9D61]/20">
            <CardHeader>
              <div
                className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: `${state.accent}1A` }}
              >
                <state.icon className="h-5 w-5" style={{ color: state.accent }} />
              </div>
              <CardTitle className="text-base text-[#3A2E33]">{state.title}</CardTitle>
              <CardDescription className="leading-relaxed">{state.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="border-[#E26C73]/40 text-[#E26C73] font-normal">
                Coming soon
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
