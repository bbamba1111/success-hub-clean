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
  Heart,
  Palette,
  Flower2,
  Bot,
  MessageCircle,
  Clock,
  Check,
  GraduationCap,
} from "lucide-react"
import CherryBlossomChatModal from "@/components/cherry-blossom-chat-modal"

/**
 * Workspace — 👥 Your AI Executive Leadership Team™.
 *
 * Cherry Blossom (Executive Advisor & Chief of Staff) sits centered above the
 * team. She coordinates, introduces the right executive, and routes the work —
 * so the founder never feels like they're choosing between departments.
 *
 * Below her, eight executives each educate, recommend a next best step, and —
 * soon — will build deliverables for approval. Nothing happens without the
 * founder's permission (Yes, Show Me / Maybe Later / No Thanks).
 */

type Permission = "pending" | "yes" | "later" | "no"

interface FunctionArea {
  id: string
  name: string
  icon: typeof Settings
  tagline: string
  members: { name: string; role: string }[]
  invitation: string
  deliverables: string[]
  chatPrompt: string
}

const FUNCTIONS: FunctionArea[] = [
  {
    id: "operations",
    name: "Operations",
    icon: Settings,
    tagline: "Systems, SOPs, and smooth day-to-day execution.",
    members: [{ name: "Optima Sage", role: "COO" }],
    invitation:
      "There are opportunities to lighten your operational load with simple systems. Would you like me to show you where we could start?",
    deliverables: ["SOP drafts", "Workflow maps", "Weekly operations checklist", "Bottleneck audit"],
    chatPrompt:
      "As my Operations function (Optima Sage, COO), educate me on one operational system that would free up my time this week.",
  },
  {
    id: "growth",
    name: "Growth",
    icon: Megaphone,
    tagline: "Visibility, content, and attracting ideal customers.",
    members: [
      { name: "Brand Beacon", role: "CMO" },
      { name: "Social Pulse", role: "Social Media Executive" },
    ],
    invitation:
      "There are opportunities to grow your visibility without more hustle. Would you like to see where we could focus?",
    deliverables: ["Content calendar", "Social post drafts", "Email campaigns", "Messaging refresh"],
    chatPrompt: "As my Growth function (Brand Beacon / Social Pulse), educate me on one high-leverage visibility move.",
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
    chatPrompt: "As my Finance function (Ledger Maven, CFO), educate me on one way to improve my pricing or profit.",
  },
  {
    id: "revenue",
    name: "Revenue",
    icon: TrendingUp,
    tagline: "Sales conversations, conversions, and consistent income.",
    members: [{ name: "Deal Catalyst", role: "Sales Director" }],
    invitation:
      "There are opportunities to make your revenue more consistent. Would you like me to show you a next best step?",
    deliverables: ["Sales conversation guide", "Follow-up sequences", "Offer positioning", "Pipeline review"],
    chatPrompt:
      "As my Revenue function (Deal Catalyst, Sales Director), educate me on one way to create more consistent revenue.",
  },
  {
    id: "customer-success",
    name: "Customer Success",
    icon: Heart,
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
    name: "Authority",
    icon: Star,
    tagline: "Speaking, podcasting, publishing, PR, and events.",
    members: [
      { name: "Voice Amplifier", role: "PR Executive" },
      { name: "Stage Presence", role: "Speaking Coach" },
    ],
    invitation:
      "There are opportunities to grow your authority and platform. Would you like me to show you a starting point?",
    deliverables: ["Signature talk outline", "Podcast pitch list", "PR angle ideas", "Book chapter map"],
    chatPrompt:
      "As my Authority function (Voice Amplifier / Stage Presence), educate me on one way to grow my authority.",
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
    invitation: "There are opportunities to polish how your brand looks and feels. Would you like to explore them?",
    deliverables: ["Brand style notes", "Video scripts", "Social graphics briefs", "Slide templates"],
    chatPrompt: "As my Creative function (Visual Narrator / Design Artisan), educate me on one way to elevate my visual brand.",
  },
  {
    id: "ai-transformation",
    name: "AI Transformation",
    icon: Bot,
    tagline: "AI opportunities, adoption, and responsible transformation.",
    members: [{ name: "AI Transformation Executive™", role: "Chief AI Officer" }],
    invitation:
      "There are opportunities to increase your Founder Capacity™ and reduce Founder Risk™ with AI — always your decision. Would you like to explore one together?",
    deliverables: ["AI opportunity map", "Adoption roadmap", "Tool recommendations", "Automation blueprints"],
    chatPrompt:
      "As my AI Transformation Executive (Chief AI Officer), educate me on one way AI could increase my capacity this week — without handing over the work only I should do.",
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
            <Badge key={m.name} variant="secondary" className="bg-[#F5F1E8] font-normal text-[#3A2E33]">
              {m.name} · {m.role}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {permission === "pending" && (
          <div className="rounded-lg border border-[#E26C73]/20 bg-[#E26C73]/5 p-3">
            <p className="text-sm leading-relaxed text-[#3A2E33]">{area.invitation}</p>
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
                className="border-[#5D9D61]/40 bg-transparent text-[#3A2E33]"
                onClick={() => setPermission("later")}
              >
                Maybe Later
              </Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => setPermission("no")}>
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
            <Button size="sm" variant="ghost" className="text-[#5D9D61]" onClick={() => setPermission("pending")}>
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
                <Badge variant="outline" className="border-[#E26C73]/40 font-normal text-[#E26C73]">
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
            <Button className="w-full bg-[#E26C73] text-white hover:bg-[#E26C73]/90" onClick={() => setChatOpen(true)}>
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

/** Cherry Blossom — the coordinating Executive Advisor & Chief of Staff. */
function CherryBlossomCard() {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <Card className="mx-auto max-w-xl border-2 border-[#E26C73]/35 bg-gradient-to-br from-[#E26C73]/5 to-transparent text-center">
      <CardHeader>
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#E26C73]/10">
            <Flower2 className="h-7 w-7 text-[#E26C73]" />
          </div>
          <CardTitle className="text-xl text-[#3A2E33]">Cherry Blossom™</CardTitle>
          <CardDescription className="leading-relaxed">Executive Advisor &amp; Chief of Staff</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-[#3A2E33]">
          {
            "I sit above your whole team — I coordinate, introduce the right executive, summarize their recommendations, and hold the memory of your business across every function. You're always the CEO; I route the work so it all comes together for you."
          }
        </p>
        <Button className="bg-[#E26C73] text-white hover:bg-[#E26C73]/90" onClick={() => setChatOpen(true)}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Talk with Cherry Blossom
        </Button>
      </CardContent>
      {chatOpen && (
        <CherryBlossomChatModal
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          conversationTitle="Cherry Blossom — Executive Advisor & Chief of Staff"
          executiveRole="Cherry Blossom - Executive Advisor & Chief of Staff"
        />
      )}
    </Card>
  )
}

export function AIExecutiveLeadershipTeam() {
  return (
    <div className="space-y-8">
      <p className="leading-relaxed text-[#3A2E33]">
        {"Your "}
        <strong>AI Executive Leadership Team™</strong>
        {
          " is one team, coordinated by Cherry Blossom. Each executive educates you, recommends your next best move, and — soon — will build deliverables for your approval. Nothing happens without your permission — you decide "
        }
        <em>Yes, Show Me</em>
        {", "}
        <em>Maybe Later</em>
        {", or "}
        <em>No Thanks</em>
        {"."}
      </p>

      {/* Cherry Blossom sits centered above everyone. */}
      <CherryBlossomCard />

      {/* The eight executives she coordinates. */}
      <div className="grid gap-4 sm:grid-cols-2">
        {FUNCTIONS.map((area) => (
          <FunctionCard key={area.id} area={area} />
        ))}
      </div>
    </div>
  )
}
