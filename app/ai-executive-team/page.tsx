'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowLeft, MessageSquare, Trash2 } from 'lucide-react'

interface Executive {
  name: string
  role: string
  description: string
  id: string
}

const executives: Executive[] = [
  { name: 'Optima Sage', role: 'COO', description: 'Streamlines operations and optimizes processes.', id: 'optima-sage' },
  { name: 'Ledger Maven', role: 'CFO', description: 'Manages financial strategy and profitability.', id: 'ledger-maven' },
  { name: 'Brand Beacon', role: 'CMO', description: 'Crafts marketing strategies to attract clients.', id: 'brand-beacon' },
  { name: 'Deal Catalyst', role: 'Sales Director', description: 'Develops sales strategies and systems.', id: 'deal-catalyst' },
  { name: 'Success Harmony', role: 'Customer Success Manager', description: 'Ensures exceptional client experiences.', id: 'success-harmony' },
  { name: 'Flow Architect', role: 'Operations Manager', description: 'Handles day-to-day operations.', id: 'flow-architect' },
  { name: 'Voice Amplifier', role: 'PR Executive', description: 'Manages brand and reputation and media relations.', id: 'voice-amplifier' },
  { name: 'Stage Presence', role: 'Speaking Coach', description: 'Helps secure speaking engagements.', id: 'stage-presence' },
  { name: 'Event Orchestrator', role: 'Virtual Events Director', description: 'Plans engaging webinars and events.', id: 'event-orchestrator' },
  { name: 'Audio Storyteller', role: 'Podcast Producer', description: 'Guides through all aspects of podcasting.', id: 'audio-storyteller' },
  { name: 'Page Turner', role: 'Publishing Coach', description: 'Guides through book writing and publishing.', id: 'page-turner' },
  { name: 'Alliance Builder', role: 'Partnership Executive', description: 'Creates strategic partnerships.', id: 'alliance-builder' },
  { name: 'Visual Narrator', role: 'Video Creator', description: 'Creates compelling marketing videos.', id: 'visual-narrator' },
  { name: 'Social Pulse', role: 'Social Media Executive', description: 'Develops social media strategies.', id: 'social-pulse' },
  { name: 'Design Artisan', role: 'Graphic Designer', description: 'Creates professional visual branding and design assets.', id: 'design-artisan' },
]

export default function AIExecutiveTeamPage() {
  const [conversations, setConversations] = useState<Array<{ id: string; name: string; role: string; date: string }>>([
    { id: '1', name: 'Human Zone of Genius Assessment', role: 'Cherry Blossom - CEO Workday', date: 'Nov 14, 2025' }
  ])

  return (
    <div className="min-h-screen bg-[#F9EFE3]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Barbara!</h1>
            <p className="text-lg text-gray-600">Choose an executive to start a coaching session</p>
          </div>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Human Zone of Genius Featured Card */}
        <Card className="mb-8 border-2 border-[#E26C73] bg-gradient-to-br from-white to-pink-50">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#F9A8D4] flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">Human Zone Of Genius</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Your Command Center Above the AI Team
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Discover your unique human capabilities and design your personalized 4-Hour CEO Workday. Take a comprehensive assessment to identify your Zone of Genius, entrepreneurial status, and create a customized 3-phase coaching/consulting business journey.
            </p>
            <Link href="/human-zone-of-genius">
              <Button className="bg-[#E26C73] hover:bg-[#E26C73]/90 text-white">
                <Sparkles className="mr-2 h-4 w-4" />
                Start Your Zone of Genius Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Conversations */}
        {conversations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Conversations</h2>
            <div className="space-y-3">
              {conversations.map((conv) => (
                <Card key={conv.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{conv.name}</h3>
                        <p className="text-sm text-[#E26C73]">{conv.role}</p>
                        <p className="text-sm text-gray-500 mt-1">{conv.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Executive Team */}
        <div>
          <h2 className="text-2xl font-bold text-[#5D9D61] mb-6">Your AI Executive Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executives.map((executive) => (
              <Card key={executive.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{executive.name}</CardTitle>
                  <CardDescription className="text-[#E26C73] font-medium">
                    {executive.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{executive.description}</p>
                  <Link href={`/executives/${executive.id}`}>
                    <Button 
                      className="w-full bg-[#E26C73] hover:bg-[#E26C73]/90 text-white"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Start Conversation
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
