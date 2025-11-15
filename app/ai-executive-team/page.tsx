'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowLeft, MessageSquare, Trash2, Plus, Brain } from 'lucide-react'

interface Executive {
  name: string
  role: string
  description: string
  id: string
}

const executives: Executive[] = [
  { name: 'Optima Sage', role: 'COO', description: 'Streamlines operations and optimizes processes for maximum efficiency.', id: 'optima-sage' },
  { name: 'Ledger Maven', role: 'CFO', description: 'Manages financial strategy, pricing, and profitability.', id: 'ledger-maven' },
  { name: 'Brand Beacon', role: 'CMO', description: 'Crafts marketing strategies to attract ideal clients.', id: 'brand-beacon' },
  { name: 'Deal Catalyst', role: 'Sales Director', description: 'Develops sales strategies to convert prospects into clients.', id: 'deal-catalyst' },
  { name: 'Success Harmony', role: 'Customer Success Manager', description: 'Ensures exceptional client experiences and retention.', id: 'success-harmony' },
  { name: 'Flow Architect', role: 'Operations Manager', description: 'Handles day-to-day operations and workflow systems.', id: 'flow-architect' },
  { name: 'Voice Amplifier', role: 'PR Executive', description: 'Manages brand reputation and media relations.', id: 'voice-amplifier' },
  { name: 'Stage Presence', role: 'Speaking Coach', description: 'Helps secure and prepare for speaking engagements.', id: 'stage-presence' },
  { name: 'Event Orchestrator', role: 'Virtual Events Director', description: 'Plans and executes engaging webinars and online events.', id: 'event-orchestrator' },
  { name: 'Audio Storyteller', role: 'Podcast Producer', description: 'Guides through all aspects of podcasting.', id: 'audio-storyteller' },
  { name: 'Page Turner', role: 'Publishing Coach', description: 'Guides through book writing and publishing.', id: 'page-turner' },
  { name: 'Alliance Builder', role: 'Partnership Executive', description: 'Creates strategic partnerships and collaborations.', id: 'alliance-builder' },
  { name: 'Visual Narrator', role: 'Video Content Creator', description: 'Creates compelling marketing videos for speaking and social media.', id: 'visual-narrator' },
  { name: 'Social Pulse', role: 'Social Media Executive', description: 'Develops social media strategies to build authority.', id: 'social-pulse' },
  { name: 'Design Artisan', role: 'Graphic Designer', description: 'Creates professional visual branding and design assets.', id: 'design-artisan' },
]

export default function AIExecutiveTeamPage() {
  const [conversations] = useState<Array<{ id: string; name: string; role: string; date: string }>>([
    { id: '1', name: 'Human Zone of Genius Assessment', role: 'Cherry Blossom - CEO Workday', date: 'Nov 14, 2025' }
  ])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Barbara!</h1>
            <p className="text-lg text-muted-foreground mt-1">
              Choose an executive to start a coaching session
            </p>
          </div>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Human Zone of Genius - Special Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-2 border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-accent">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Human Zone Of Genius</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Your Command Center Above the AI Team
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                Discover your unique human capabilities and design your personalized 4-Hour CEO Workday. Take a comprehensive assessment to identify your Zone of Genius, entrepreneurial status, and create a customized 3-phase coaching/consulting business journey.
              </p>
              <Link href="/human-zone-of-genius">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#E26C73] hover:bg-[#D55A60]"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Start Your Zone of Genius Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Recent Conversations */}
        {conversations.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Recent Conversations</h2>
            <div className="space-y-3">
              {conversations.map((conv) => (
                <Card key={conv.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{conv.name}</h3>
                        <p className="text-sm text-[#E26C73] font-medium">{conv.role}</p>
                        <p className="text-sm text-muted-foreground mt-1">{conv.date}</p>
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
          </section>
        )}

        {/* AI Executive Team Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-[#5D9D61]">Your AI Executive Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executives.map((exec) => (
              <Card key={exec.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{exec.name}</CardTitle>
                  <CardDescription className="text-base font-semibold text-[#E26C73]">
                    {exec.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base leading-relaxed">{exec.description}</p>
                  <Link href={`/executives/${exec.id}`}>
                    <Button
                      className="w-full bg-[#E26C73] hover:bg-[#D55A60]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Start Conversation
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
