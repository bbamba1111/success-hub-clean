"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  DollarSign,
  TrendingUp,
  Megaphone,
  Star,
  Mic,
  Palette,
  GraduationCap,
  MessageCircle,
  Clock,
  Check,
} from "lucide-react"
import CherryBlossomChatModal from "@/components/cherry-blossom-chat-modal"

/**
 * Workspace 4 — 👥 Your AI Executive Leadership Team™.
 *
 * Phase 1A: architecture + permission pattern only. The 15 AI executives are
 * organized by business FUNCTION (personalities kept as secondary labels).
 * Each function can: Educate (launch Cherry Blossom), show a Deliverables
 * catalog (coming soon), and Expand Awareness — always gated by a gentle
 * permission choice (Yes, Show Me / Maybe Later / No Thanks). No real asset
 * generation this phase.
 */

type Permission = "pending" | "yes" | "later" | "no"

interface FunctionArea {
  id: string
  name: string
  icon: typeof Settings
  tagline: string
  /** The AI executive personalities that serve this function. */
  members: { name: string; role: string }[]
  /** Cherry Blossom-voiced invitation shown before permission is granted. */
  invitation: string
  /** Deliverables this function will eventually produce (coming soon). */
  deliverables: string[]
  chatPrompt: string
}

const FUNCTIONS: FunctionArea[] = [
  {
    id: "operations",
    name: "Operations",
    icon: Settings,
    tagline: "Systems, SOPs, and smooth day-to-day execution.",
    members: [
      { name: "Optima Sage", role: "COO" },
      { name: "Flow Architect", role: "Operations Manager" },
    ],
    invitation:
      "There are opportunities to lighten your operational load with simple systems. Would you like me to show you where we could start?",
    deliverables: ["SOP drafts", "Workflow maps", "Weekly operations checklist", "Bottleneck audit"],
    chatPrompt:
      "As my Operations function (Optima Sage / Flow Architect), educate me on one operational system that would free up my time this week.",
  },
  {
    id: "finance",
    name: "Finance",
    icon: DollarSign,
    tagline: "Profit, pricing, and financial confidence.",
    members: [{ name: "Ledger Maven", role: "CFO" }],
    invitation:
      "There are opportunities to strengthen your pricing and profit. Would you like to explore them together?",
    deliverables: ["Pricing review", "Profit-margin snapshot", "Cash-flow overview", "Offer profitability map"],
    chatPrompt: "As my Finance function (Ledger Maven), educate me on one way to improve my pricing or profit.",
  },
  {
    id: "revenue",
    name: "Revenue",
    icon: TrendingUp,
    tagline: "Sales conversations, conversions, and partnerships.",
    members: [
      { name: "Deal Catalyst", role: "Sales Director" },
      { name: "Alliance Builder", role: "Partnership Executive" },
    ],
    invitation:
      "There are opportunities to make your revenue more consistent. Would you like me to show you a next best step?",
    deliverables: ["Sales conversation guide", "Follow-up sequences", "Partnership outreach list", "Offer positioning"],
    chatPrompt:
      "As my Revenue function (Deal Catalyst / Alliance Builder), educate me on one way to create more consistent revenue.",
  },
  {
    id: "growth",
    name: "Growth & Marketing",
    icon: Megaphone,
    tagline: "Visibility, content, and attracting ideal clients.",
    members: [
      { name: "Brand Beacon", role: "CMO" },
      { name: "Social Pulse", role: "Social Media Executive" },
      { name: "Voice Amplifier", role: "PR Executive" },
    ],
    invitation:
      "There are opportunities to grow your visibility without more hustle. Would you like to see where we could focus?",
    deliverables: ["Content calendar", "Social post drafts", "Email campaigns", "PR angle ideas"],
    chatPrompt:
      "As my Growth & Marketing function (Brand Beacon / Social Pulse / Voice Amplifier), educate me on one high-leverage visibility move.",
  },
  {
    id: "customer-success",
    name: "Customer Success",
    icon: Star,
    tagline: "Client experience, retention, and referrals.",
    members: [{ name: "Success Harmony", role: "Customer Success Manager" }],
    invitation:
      "There are opportunities to deepen your client experience and retention. Would you like to explore one together?",
    deliverables: ["Onboarding flow", "Check-in cadence", "Testimonial requests", "Retention playbook"],
    chatPrompt:
      "As my Customer Success function (Success Harmony), educate me on one way to improve client retention or referrals.",
  },
  {
    id: "authority",
    name: "Authority & Platform",
    icon: Mic,
    tagline: "Speaking, podcasting, publishing, and events.",
    members: [
      { name: "Stage Presence", role: "Speaking Coach" },
      { name: "Audio Storyteller", role: "Podcast Producer" },
      { name: "Page Turner", role: "Publishing Coach" },
      { name: "Event Orchestrator", role: "Virtual Events Director" },
    ],
    invitation:
      "There are opportunities to grow your authority and platform. Would you like me to show you a starting point?",
    deliverables: ["Signature talk outline", "Podcast pitch list", "Book chapter map", "Webinar plan"],
    chatPrompt:
      "As my Authority & Platform function (Stage Presence / Audio Storyteller / Page Turner / Event Orchestrator), educate me on one way to grow my authority.",
  },
  {
    id: "creative",
    name: "Creative",
    icon: Palette,
    tagline: "Visual branding, video, and design assets.",
    members: [
      { name: "Visual Narrator", role: "Video Content Creator" },
      { name: "Design Artisan", role: "Graphic Designer" },
    ],
    invitation:
      "There are opportunities to polish how your brand looks and feels. Would you like to explore them?",
    deliverables: ["Brand style notes", "Video scripts", "Social graphics briefs", "Slide templates"],
    chatPrompt:
      "As my Creative function (Visual Narrator / Design Artisan), educate me on one way to elevate my visual brand.",
  },
]

function FunctionCard({ area }: { area: FunctionArea }) {
  const [permission, setPermission] = useState<Permission>("pending")
  const [chatOpen, setChatOpen] = useState(false)
  const Icon = area.icon

  return (
    <Card className="border-2 border-[#5D9D61]/25">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5D9D61]/10">
            <Icon className="h-6 w-6 text-[#5D9D61]" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg text-[#3A2E33]">{area.name}</CardTitle>
            <CardDescription className="leading-relaxed">{area.tagline}</CardDescription>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {area.members.map((m) => (
            <Badge key={m.name} variant="secondary" className="bg-[#F5F1E8] text-[#3A2E33] font-normal">
              {m.name} · {m.role}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {permission === "pending" && (
          <div className="rounded-lg border border-[#E26C73]/20 bg-[#E26C73]/5 p-3">
            <p className="text-sm text-[#3A2E33] leading-relaxed">{area.invitation}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                className="bg-[#5D9D61] text-white hover:bg-[#5D9D61]/90"
                onClick={() => setPermission("yes")}
              >
                Yes, Show Me
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#5D9D61]/40 text-[#3A2E33] bg-transparent"
                onClick={() => setPermission("later")}
              >
                Maybe Later
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => setPermission("no")}
              >
                No Thanks
              </Button>
            </div>
          </div>
        )}

        {(permission === "later" || permission === "no") && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-[#F5F1E8]/70 p-3">
            <p className="text-sm text-[#3A2E33]">
              {permission === "later"
                ? "No rush — I'll keep this ready for whenever you're interested."
                : "Understood. We'll leave this one aside for now."}
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="text-[#5D9D61]"
              onClick={() => setPermission("pending")}
            >
              Reconsider
            </Button>
          </div>
        )}

        {permission === "yes" && (
          <div className="space-y-4">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#3A2E33]">
                <Clock className="h-4 w-4 text-[#E26C73]" />
                Deliverables catalog
                <Badge variant="outline" className="border-[#E26C73]/40 text-[#E26C73] font-normal">
                  Coming soon
                </Badge>
              </p>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {area.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#5D9D61]" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              className="w-full bg-[#E26C73] text-white hover:bg-[#E26C73]/90"
              onClick={() => setChatOpen(true)}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Educate me with Cherry Blossom
            </Button>
          </div>
        )}
      </CardContent>

      {chatOpen && (
        <CherryBlossomChatModal
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          prefillMessage={area.chatPrompt}
          conversationTitle={`${area.name} — AI Executive Leadership Team`}
          executiveRole={`Cherry Blossom - ${area.name} Guide`}
        />
      )}
    </Card>
  )
}

export function AIExecutiveLeadershipTeam() {
  return (
    <div className="space-y-5">
      <p className="text-[#3A2E33] leading-relaxed">
        {"Your "}
        <strong>AI Executive Leadership Team™</strong>
        {
          " serves you by function. They educate you, recommend your next best move, and — soon — will build deliverables for your approval. Nothing happens without your permission."
        }
      </p>
      <div className="flex items-start gap-2 rounded-lg border border-[#E26C73]/20 bg-[#E26C73]/5 p-3">
        <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#E26C73]" />
        <p className="text-sm text-[#3A2E33] leading-relaxed">
          {"You're always the CEO. Each function offers opportunities — you decide "}
          <em>Yes, Show Me</em>
          {", "}
          <em>Maybe Later</em>
          {", or "}
          <em>No Thanks</em>
          {"."}
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {FUNCTIONS.map((area) => (
          <FunctionCard key={area.id} area={area} />
        ))}
      </div>
    </div>
  )
}
