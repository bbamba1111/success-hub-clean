"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoneOfGeniusChatModal } from "@/components/zone-of-genius-chat-modal"
import { executives, getExecutive } from "@/lib/executives-config"
import type { ExecutiveConfig } from "@/lib/executives-config"
import { MessageSquare, Brain, Users, Target, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export default function AIExecutiveTeamPage() {
  const [selectedExecutive, setSelectedExecutive] = useState<ExecutiveConfig | null>(null)
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false)

  const handleExecutiveClick = (executiveId: string) => {
    if (executiveId === "zone-of-genius") {
      setIsZoneModalOpen(true)
    } else {
      console.log("Executive chat coming soon:", executiveId)
    }
  }

  const regularExecutives = executives.filter(e => e.id !== "zone-of-genius")

  return (
    <div className="min-h-screen">
      {/* 4-Hour Focused CEO Workday Introduction - White Background */}
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

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Human Zone of Genius Card */}
            <Link href="/human-zone-of-genius">
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

            {/* AI Executive Team Card */}
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

      {/* 80/20 Pareto Principle Section - Peachy Background */}
      <div style={{ backgroundColor: '#FFE8D6' }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The 80/20 Pareto Principle
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
              Focus on the 20% of work that creates 80% of your results while AI handles the rest
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* You - The 20% */}
            <Card className="bg-white hover:shadow-xl transition-all border-2 border-green-300">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-pink-400 flex items-center justify-center text-3xl shadow-lg mb-4 mx-auto">
                  👤
                </div>
                <CardTitle className="text-2xl text-center mb-2">You - The 20%</CardTitle>
                <CardDescription className="text-center text-base font-semibold text-gray-700">
                  Your Human Zone of Genius
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Target className="h-4 w-4 mr-2 mt-1 text-green-600 flex-shrink-0" />
                    <span>Strategic thinking & visionary leadership</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-4 w-4 mr-2 mt-1 text-green-600 flex-shrink-0" />
                    <span>Authentic relationships & high-value sales</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-4 w-4 mr-2 mt-1 text-green-600 flex-shrink-0" />
                    <span>Coaching delivery & thought leadership</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-4 w-4 mr-2 mt-1 text-green-600 flex-shrink-0" />
                    <span>Personal storytelling & ethical decisions</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-700">80%</p>
                  <p className="text-sm text-gray-600">of results created</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Team - The 80% */}
            <Card className="bg-white hover:shadow-xl transition-all border-2 border-pink-300">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-pink-400 flex items-center justify-center text-3xl shadow-lg mb-4 mx-auto">
                  🤖
                </div>
                <CardTitle className="text-2xl text-center mb-2">AI Team - The 80%</CardTitle>
                <CardDescription className="text-center text-base font-semibold text-gray-700">
                  Operational Excellence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 mt-1 text-pink-600 flex-shrink-0" />
                    <span>Administrative tasks & scheduling</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 mt-1 text-pink-600 flex-shrink-0" />
                    <span>Content drafts & social media</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 mt-1 text-pink-600 flex-shrink-0" />
                    <span>Research & proposals</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="h-4 w-4 mr-2 mt-1 text-pink-600 flex-shrink-0" />
                    <span>Bookkeeping & transcription</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-pink-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-pink-700">20%</p>
                  <p className="text-sm text-gray-600">of work required</p>
                </div>
              </CardContent>
            </Card>

            {/* The Result */}
            <Card className="bg-white hover:shadow-xl transition-all border-2 border-purple-300">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-pink-400 flex items-center justify-center text-3xl shadow-lg mb-4 mx-auto">
                  ⚡
                </div>
                <CardTitle className="text-2xl text-center mb-2">The Result</CardTitle>
                <CardDescription className="text-center text-base font-semibold text-gray-700">
                  Maximum Leverage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-1 text-purple-600 flex-shrink-0" />
                    <span>Work 4 hours daily (Mon-Thu 1-5 PM)</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-1 text-purple-600 flex-shrink-0" />
                    <span>AI handles routine operations 24/7</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-1 text-purple-600 flex-shrink-0" />
                    <span>Daily guidance on next-best moves</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-1 text-purple-600 flex-shrink-0" />
                    <span>Scale to 6, 7, 8 figure+ revenue</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-700">10x</p>
                  <p className="text-sm text-gray-600">productivity increase</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Executive Team Section - Tan Background */}
      <div id="executive-team" style={{ backgroundColor: '#F5E6D3' }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your AI Executive Team</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Monday through Thursday, 1:00-5:00 PM EST, your AI Executive Team guides you through the exact next-best-move for forward momentum in your coaching or consulting business using the 80/20 Pareto Principle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularExecutives.map((exec) => (
              <Card key={exec.id} className="hover:shadow-xl transition-all bg-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-pink-400 flex items-center justify-center text-2xl shadow-lg">
                      {exec.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{exec.name}</CardTitle>
                      <CardDescription className="text-sm">{exec.role}</CardDescription>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {exec.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleExecutiveClick(exec.id)}
                    className="w-full"
                    variant="outline"
                    disabled
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ZoneOfGeniusChatModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
      />
    </div>
  )
}
