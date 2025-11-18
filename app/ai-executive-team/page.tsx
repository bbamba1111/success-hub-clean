"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExecutiveChatModal } from "@/components/executive-chat-modal"
import { MessageSquare, Brain, Users } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from "@/hooks/useAuth"

const executives = [
  { id: "optima-sage", name: "Optima Sage", role: "COO", icon: "🎯", description: "Streamlines operations and optimizes processes for maximum efficiency." },
  { id: "ledger-maven", name: "Ledger Maven", role: "CFO", icon: "💰", description: "Manages financial strategy, profitability, and pricing." },
  { id: "brand-beacon", name: "Brand Beacon", role: "CMO", icon: "📢", description: "Crafts marketing strategies to attract ideal clients." },
  { id: "deal-catalyst", name: "Deal Catalyst", role: "Sales Director", icon: "🤝", description: "Develops sales strategies and conversion systems." },
  { id: "success-harmony", name: "Success Harmony", role: "Customer Success Manager", icon: "⭐", description: "Ensures exceptional client experiences and retention." },
  { id: "flow-architect", name: "Flow Architect", role: "Operations Manager", icon: "⚙️", description: "Handles day-to-day operations and workflows." },
  { id: "voice-amplifier", name: "Voice Amplifier", role: "PR Executive", icon: "📻", description: "Manages brand reputation and media relations." },
  { id: "stage-presence", name: "Stage Presence", role: "Speaking Coach", icon: "🎤", description: "Helps secure speaking engagements and opportunities." },
  { id: "event-orchestrator", name: "Event Orchestrator", role: "Virtual Events Director", icon: "🎪", description: "Plans engaging webinars and virtual events." },
  { id: "audio-storyteller", name: "Audio Storyteller", role: "Podcast Producer", icon: "🎙️", description: "Guides through all aspects of podcasting." },
  { id: "page-turner", name: "Page Turner", role: "Publishing Coach", icon: "📚", description: "Guides through book writing and publishing." },
  { id: "alliance-builder", name: "Alliance Builder", role: "Partnership Executive", icon: "🔗", description: "Creates strategic partnerships and collaborations." },
  { id: "visual-narrator", name: "Visual Narrator", role: "Video Content Creator", icon: "🎬", description: "Creates compelling marketing videos." },
  { id: "social-pulse", name: "Social Pulse", role: "Social Media Executive", icon: "📱", description: "Develops social media strategies and content." },
  { id: "design-artisan", name: "Design Artisan", role: "Graphic Designer", icon: "🎨", description: "Creates professional visual branding and design assets." },
];

export default function AIExecutiveTeamPage() {
  const { isAuthenticated, isLoading: isLoadingAuth } = useAuth()
  const [selectedExecutive, setSelectedExecutive] = useState<typeof executives[0] | null>(null)

  return (
    <div className="min-h-screen">
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The 4-Hour Focused CEO Workday
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Build your AI-powered business while developing your irreplaceable human skills. Work Mon-Thu, 1-5 PM EST focusing on the 20% that creates 80% of your results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <Link href="/human-zone-of-genius-team">
              <Card className="hover:shadow-xl transition-all cursor-pointer h-full bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-pink-400 flex items-center justify-center text-3xl shadow-lg mb-4 mx-auto">
                    🧠
                  </div>
                  <CardTitle className="text-2xl text-center">Human Zone of Genius</CardTitle>
                  <CardDescription className="text-center text-base">
                    Discover and develop your 8 irreplaceable human-only business skills using the 80/20 Pareto Principle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Brain className="mr-2 h-5 w-5" />
                    Explore Your Zone
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-xl transition-all h-full bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-pink-400 flex items-center justify-center text-3xl shadow-lg mb-4 mx-auto">
                  🤖
                </div>
                <CardTitle className="text-2xl text-center">15 AI Executives</CardTitle>
                <CardDescription className="text-center text-base">
                  Build your AI-powered executive team to handle 80% of business operations automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  onClick={() => {
                    document.getElementById('executive-team')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Meet Your Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div id="executive-team" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Your 15 AI Executive Team
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Specialized AI executives ready to guide you through every aspect of your business
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {executives.map((exec) => (
              <Card 
                key={exec.id} 
                className="border-2 border-gray-200 hover:border-purple-300 transition-all cursor-pointer hover:shadow-lg"
                onClick={() => setSelectedExecutive(exec)}
                data-testid={`card-executive-${exec.id}`}
              >
                <CardHeader>
                  <div className="text-5xl mb-3 text-center">{exec.icon}</div>
                  <CardTitle className="text-lg text-center">{exec.name}</CardTitle>
                  <CardDescription className="text-base font-semibold text-purple-600 text-center">
                    {exec.role}
                  </CardDescription>
                  <CardDescription className="text-base leading-relaxed text-center pt-2">
                    {exec.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    data-testid={`button-chat-${exec.id}`}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Coaching
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedExecutive && (
        <ExecutiveChatModal
          isOpen={!!selectedExecutive}
          onClose={() => setSelectedExecutive(null)}
          executiveId={selectedExecutive.id}
          executiveName={selectedExecutive.name}
          executiveRole={selectedExecutive.role}
          executiveIcon={selectedExecutive.icon}
          isAuthenticated={isAuthenticated}
          isLoadingAuth={isLoadingAuth}
        />
      )}
    </div>
  )
}
