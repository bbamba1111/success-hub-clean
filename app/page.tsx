"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Target, TrendingUp, Calendar, Zap, Moon, CheckCircle, Star } from 'lucide-react'
import CherryBlossomCountdown from "@/components/cherry-blossom-countdown"
import WorkLifeBalanceSchedule from "@/components/work-life-balance-schedule"

export default function HomePage() {
  const [dashboardVisited, setDashboardVisited] = useState(false)

  useEffect(() => {
    const visited = localStorage.getItem("dashboardVisited")
    if (visited === "true") {
      setDashboardVisited(true)
    }
  }, [])

  const scrollToWellnessDashboard = () => {
    const element = document.getElementById("wellness-dashboard")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex justify-center mb-6">
                <div className="w-26 h-26 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                  M
                </div>
              </div>

              <div className="space-y-6">
                <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  Make Time For More<sup className="text-lg">™</sup> Monthly
                  <br />
                  Success Hub
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Take The Audit, Set Your 28-Day Intention, and access Cherry Blossom your AI Powered Work-Life Balance
                  Co-Guide. Experience non-negotiable co-working, community connections, wellness tracking, personalized
                  guidance and more -- all in one{" "}
                  <button
                    onClick={scrollToWellnessDashboard}
                    className={`font-bold underline transition-colors ${
                      dashboardVisited
                        ? "text-[#7FB069] hover:text-[#6FA055] cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!dashboardVisited}
                  >
                    Dashboard
                  </button>
                  .
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#F5F1E8] to-white p-12 text-center">
                <div className="text-6xl mb-4">🌸</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Success Hub</h3>
                <p className="text-gray-600">Your journey to work-life balance starts here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 - Onboarding Section */}
      <div className="bg-gradient-to-br from-[#F5F1E8] to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              M
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0">
              Step 1
            </Badge>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#7FB069] mb-4">
              Complete Onboarding: Your First 3-Steps to Balance, Freedom & Success...
            </h2>
            <p className="text-lg text-gray-600">
              Complete these three essential steps to prepare for your transformation journey
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Step 1.1 - Audit Card */}
            <Card className="bg-[#7FB069] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    M
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                    Step 1.1
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">Take The Work-Life Balance Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Discover exactly where you stand across 15 key life areas with our comprehensive assessment. Get
                  personalized insights and identify your biggest opportunities for growth.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">15-question comprehensive assessment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Instant personalized results</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">AI-powered insights from Cherry Blossom</span>
                  </div>
                </div>

                <div className="mt-6 mb-4">
                  <a
                    href="https://join.butter.us/make-time-for-more/audit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-white hover:bg-gray-50 text-[#7FB069] border-2 border-white font-semibold">
                      Join The Work-Life Balance Audit
                    </Button>
                  </a>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/audit" className="block">
                    <Button size="lg" className="w-full bg-white text-[#7FB069] hover:bg-gray-50 font-semibold">
                      Take The Work-Life Balance Audit
                    </Button>
                  </Link>
                  <a
                    href="https://chatgpt.com/g/g-68d2da76c4d881919bf0ff4131ac8ca8-your-work-life-balance-audit-review-2-0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-[#7FB069] bg-transparent"
                    >
                      Review Your Audit with Cherry Blossom
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Step 1.2 - Intention Setting Card */}
            <Card className="bg-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    M
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                    Step 1.2
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Set Your 28-Day Desired Work-LifeStyle Intention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Transform your audit insights into powerful, actionable intentions. Choose 1-3 focus areas and let
                  Cherry Blossom guide you through creating your personalized 28-day transformation plan.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Select 1-3 focus areas for maximum impact</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">AI-guided intention crafting with Cherry Blossom</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Personalized daily practices & action plan</span>
                  </div>
                </div>

                <div className="mt-6 mb-4">
                  <a
                    href="https://join.butter.us/make-time-for-more/onboarding"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-white hover:bg-gray-50 text-[#E26C73] border-2 border-white font-semibold">
                      Join The Intention Setting Circle
                    </Button>
                  </a>
                </div>

                <div className="flex flex-col gap-3">
                  <Link href="/focus-areas" className="block">
                    <Button size="lg" className="w-full bg-white text-[#E26C73] hover:bg-gray-50 font-semibold">
                      Choose Your 1-3 Priority Focus Areas
                    </Button>
                  </Link>
                  <a
                    href="https://chatgpt.com/g/g-67ec80061e1c819192bc80c37a7ee320-set-your-desired-work-lifestyle-intention"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-[#E26C73] bg-transparent"
                    >
                      Set Your 28-Day Intention
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Step 1.3 - Preparation Checklist Card */}
            <Card className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    M
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">
                    Step 1.3
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Prepare For The Experience: Download Your Preparation Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Get ready for your transformation with our comprehensive preparation checklist. Complete these steps
                  to create the optimal environment for your work-life balance journey.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Clear your physical space</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Block off your calendar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Notify your family & team</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Delegate or delay tasks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Prepare your spirit</span>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="https://docs.google.com/document/d/1IZ5qefGnMQpYJP8wMgQS3tVY6sj56CHcCpRBkOGpGjU/edit?tab=t.0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-white text-[#7FB069] hover:bg-gray-50 border-2 border-white font-semibold"
                    >
                      Download The Checklist
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#E26C73]">
            <p className="text-xl font-bold text-[#E26C73] text-center">
              Completing Onboarding is Mandatory to Make The Sunday Shift™ and Start Co-Working
            </p>
          </div>
        </div>
      </div>

      {/* Step 2 - Sunday Shift Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              M
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0">
              Step 2
            </Badge>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent mb-4">
              Make The Sunday Shift
            </h3>
            <p className="text-xl text-gray-700 font-medium">
              Adopt The Work-Life Balance Business Model & SOP™ -- the "Sustainable" Operating Procedure
            </p>
          </div>

          <div className="text-center mb-12">
            <CherryBlossomCountdown />
          </div>

          <div className="flex justify-center">
            <div className="space-y-4 flex flex-col max-w-4xl w-full">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-3 text-gray-700 bg-white/80 p-3 rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-[#7FB069] flex-shrink-0" />
                  <span className="font-semibold text-lg">Join Us Live: Sunday @ 1:00–2:00 PM ET</span>
                </div>

                <a
                  href="https://join.butter.us/make-time-for-more/sunday-kickoff"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="w-full h-full bg-white/80 hover:bg-white p-3 rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2">
                    <span className="text-2xl">🌸</span>
                    <span className="font-semibold text-lg text-[#7FB069]">Click Here to Make The Sunday Shift™</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 - Co-Working Non-Negotiables Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              M
            </div>
            <Badge variant="secondary" className="bg-[#7FB069] text-white border-0">
              Step 3
            </Badge>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#7FB069] mb-4">
              Break The Hustle Habit — Co-Work Your Non-Negotiables™
            </h3>
          </div>

          <div className="text-center mb-8">
            <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#F5F1E8] to-white p-12 rounded-2xl">
              <div className="text-6xl mb-4">🌸 💼 🌸</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Daily Co-Working Schedule</h3>
              <p className="text-gray-600">4 Days a Week • Structured for Success</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mb-8 -mt-4">
            <div className="bg-[#7FB069] text-white p-4 rounded-b-2xl shadow-lg text-center">
              <p className="text-lg lg:text-2xl font-medium leading-relaxed">
                You'll Practice, Embody & Live This Schedule with Us — 4 Days a Week
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden mt-4">
            <WorkLifeBalanceSchedule />
          </div>
        </div>
      </div>

      {/* Wellness Tracking Dashboard */}
      <div id="wellness-dashboard" className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            M
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Wellness Tracking Dashboard</h2>
          <p className="text-lg text-gray-600">Monitor and optimize your daily wellness habits</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-2 border-[#7FB069]/30 hover:border-[#7FB069] transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-[#7FB069]">Workout Planner</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Track your 30-minute workday workout sessions. Plan, schedule, and monitor your movement and energy
                optimization journey.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Target className="w-4 h-4 text-[#7FB069]" />
                  Weekly workout goals and progress tracking
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-[#7FB069]" />
                  Date-specific workout scheduling
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="w-4 h-4 text-[#7FB069]" />
                  Monthly progress overview
                </div>
              </div>
              <Link href="/workout-planner">
                <Button className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white">
                  Open Workout Planner
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#E26C73]/30 hover:border-[#E26C73] transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E26C73] to-[#7FB069] rounded-full flex items-center justify-center">
                  <Moon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-[#E26C73]">Sleep Tracker</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Monitor your power down and unplug evening routine. Track sleep quality, duration, and digital detox
                habits.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Target className="w-4 h-4 text-[#E26C73]" />
                  Sleep quality and duration goals
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-[#E26C73]" />
                  Daily sleep log with dates
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="w-4 h-4 text-[#E26C73]" />
                  Weekly sleep pattern analysis
                </div>
              </div>
              <Link href="/sleep-tracker">
                <Button className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white">
                  Open Sleep Tracker
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}