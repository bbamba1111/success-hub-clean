"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Target, TrendingUp, Zap, Brain, Sparkles } from 'lucide-react'

export default function FourHourWorkdayPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Hub
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={48}
                height={48}
                className="rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#7FB069]/10 to-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0">
              Core Non-Negotiable
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              4-Hour Focused CEO Workday
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Work ON your business with divine co-creation and quantum focus. Monday-Thursday, 1:00-5:00 PM ET
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <img
              src="/images/ceo-workday-focused.png"
              alt="Professional woman working at desk"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* The 4 Pillars */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The 4 Pillars of Your CEO Workday
            </h2>
            <p className="text-xl text-gray-600">
              Each hour focuses on a specific area of business growth using the 80/20 Pareto Principle
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Pillar 1: AI & Automation */}
            <Card className="border-2 border-[#7FB069]/30 hover:border-[#7FB069] transition-all hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-[#7FB069]">Hour 1: AI & Automation</CardTitle>
                    <p className="text-sm text-gray-600">1:00-2:00 PM</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Build and optimize your AI-powered systems to handle 80% of business operations automatically.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-[#7FB069] mt-0.5 flex-shrink-0" />
                    <span>Set up email sequences and automation workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-[#7FB069] mt-0.5 flex-shrink-0" />
                    <span>Train your AI executives (CMO, COO, CFO)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-[#7FB069] mt-0.5 flex-shrink-0" />
                    <span>Create systems that run without you</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pillar 2: Zone of Genius */}
            <Card className="border-2 border-[#E26C73]/30 hover:border-[#E26C73] transition-all hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-[#E26C73]">Hour 2: Zone of Genius</CardTitle>
                    <p className="text-sm text-gray-600">2:00-3:00 PM</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Focus on your unique human skills that AI cannot replicate - your irreplaceable value.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-[#E26C73] mt-0.5 flex-shrink-0" />
                    <span>Client delivery and high-touch coaching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-[#E26C73] mt-0.5 flex-shrink-0" />
                    <span>Strategic partnerships and collaborations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-[#E26C73] mt-0.5 flex-shrink-0" />
                    <span>Creative content and thought leadership</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pillar 3: Visibility & Growth */}
            <Card className="border-2 border-[#7FB069]/30 hover:border-[#7FB069] transition-all hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-[#7FB069]">Hour 3: Visibility & Growth</CardTitle>
                    <p className="text-sm text-gray-600">3:00-4:00 PM</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Build your platform, authority, and reach through strategic visibility activities.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-[#7FB069] mt-0.5 flex-shrink-0" />
                    <span>Content creation and social media</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-[#7FB069] mt-0.5 flex-shrink-0" />
                    <span>Podcast interviews and speaking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-[#7FB069] mt-0.5 flex-shrink-0" />
                    <span>Community building and engagement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pillar 4: Revenue & Delivery */}
            <Card className="border-2 border-[#E26C73]/30 hover:border-[#E26C73] transition-all hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-[#E26C73]">Hour 4: Revenue & Delivery</CardTitle>
                    <p className="text-sm text-gray-600">4:00-5:00 PM</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Generate income and deliver exceptional results to your clients and customers.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-[#E26C73] mt-0.5 flex-shrink-0" />
                    <span>Sales calls and client consultations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-[#E26C73] mt-0.5 flex-shrink-0" />
                    <span>Follow-ups and conversion activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-[#E26C73] mt-0.5 flex-shrink-0" />
                    <span>Program delivery and client success</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-gradient-to-br from-[#E26C73]/10 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why 4 Hours is Your Sweet Spot
            </h2>
            <p className="text-xl text-gray-600">
              The science and spirituality behind focused CEO time
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white border-2 border-[#7FB069]/30">
              <CardHeader>
                <CardTitle className="text-[#7FB069]">Spiritual Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>• Divine co-creation: You become the visionary while AI handles execution</p>
                <p>• Energy alignment: Work during your peak creative hours</p>
                <p>• Soul nourishment: Time for what truly matters outside of work</p>
                <p>• Purpose-driven: Focus on high-impact work aligned with your mission</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-[#E26C73]/30">
              <CardHeader>
                <CardTitle className="text-[#E26C73]">Scientific Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p>• Prefrontal cortex capacity: Your brain's best 4-5 hours for deep work</p>
                <p>• Parkinson's Law: Work expands to fill time - constraint creates focus</p>
                <p>• Circadian rhythm: 1-5 PM aligns with optimal cognitive performance</p>
                <p>• Decision fatigue prevention: Limited hours = better decision quality</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Plan Your 4-Hour CEO Workday?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Chat with Cherry Blossom to get your personalized workday plan based on your business type, stage, and monthly intention.
          </p>
          <Button
            size="lg"
            disabled
            className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold px-12 py-6 text-xl opacity-50 cursor-not-allowed"
          >
            <Clock className="mr-2 h-5 w-5" />
            Plan My 4-Hour CEO Workday (Coming Soon)
          </Button>
        </div>
      </div>

    </div>
  )
}
