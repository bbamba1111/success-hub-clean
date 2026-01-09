"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Target, TrendingUp, Calendar, Zap, Moon, CheckCircle, Star, Download, CheckCircle2, Sparkles, Heart, Users } from "lucide-react"
import CherryBlossomCountdown from "@/components/cherry-blossom-countdown"
import WorkLifeBalanceSchedule from "@/components/work-life-balance-schedule"
import { SimpleChatModal } from "@/components/simple-chat-modal"
import { CherryBlossomCoGuide } from "@/components/cherry-blossom-co-guide"
import { createBrowserClient } from "@supabase/ssr"

export default function HomePage() {
  const [dashboardVisited, setDashboardVisited] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState<string>("")
  const [chatTitle, setChatTitle] = useState("")
  const [isCoGuideOpen, setIsCoGuideOpen] = useState(false)
  const [userId, setUserId] = useState<string | undefined>()
  const [isBarbaraStaffOpen, setIsBarbaraStaffOpen] = useState(false)

  useEffect(() => {
    // Check if user has visited dashboard from planner/tracker
    const visited = localStorage.getItem("dashboardVisited")
    if (visited === "true") {
      setDashboardVisited(true)
    }
  }, [])

  useEffect(() => {
    // Get user ID from Supabase auth
    const getUserId = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.log("[v0] Supabase env vars not available, skipping user ID fetch")
        return
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUserId()
  }, [])

  const scrollToWellnessDashboard = () => {
    const element = document.getElementById("wellness-dashboard")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const openChat = (context: string, title: string) => {
    setChatContext(context)
    setChatTitle(title)
    setIsChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="flex justify-center mb-6">
                <img
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={104}
                  height={104}
                  className="rounded-full shadow-lg"
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    Make Time For More<sup className="text-lg">™</sup> 
                  </h1>
                  <p className="text-lg text-gray-600 font-normal">
                   Welcome to The Work-Life Balance Installation Hub
                  </p>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  This is your central space to begin living the Work-Life Balance Business Model & SOP™. Here, you’ll Take The Audit, Set Your 28-Day Intention, and access Cherry Blossom your AI Powered Work-Life Balance Co-Guide. Experience non-negotiable co-working, community connections, wellness tracking, personalized guidance and more — all in one{" "}
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

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-women-tea-cherry-blossoms-new.png"
                  alt="Diverse women enjoying tea together in cherry blossom garden"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Section - Complete Onboarding */}
      <div className="bg-gradient-to-br from-[#F5F1E8] to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Step 1 Badge and Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
            <Badge variant="secondary" className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0">
              Step 1
            </Badge>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#7FB069] mb-4">
              Complete Onboarding: Your First 3-Steps to Balance, Freedom & Success
            </h2>
            <p
              className="text-[39px] text-gray-700 mt-6"
              style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400 }}
            >
              Live with Thought Leader Barbara
            </p>
          </div>

          {/* Live Onboarding Schedule - Compact Rectangular Banner */}
          <div className="bg-gradient-to-r from-[#F9F6F1] via-[#FAF7F2] to-[#F9F6F1] rounded-2xl overflow-hidden shadow-xl mb-12 border border-gray-200">
            <div className="grid md:grid-cols-[320px,1fr] gap-0">
              {/* Left: Barbara's Image with Shadow */}
              <div className="relative h-full min-h-[280px] bg-[#F9F6F1] flex items-center justify-center py-6 px-8">
                <div className="relative flex items-center justify-center">
                  {/* Barbara's image - increased by 20% with shadow */}
                  <img
                    src="/images/barbara-cherry-garden.jpg"
                    alt="Barbara"
                    className="w-[270px] h-[270px] rounded-full object-cover shadow-2xl"
                  />
                </div>
              </div>

              {/* Right: Onboarding Info */}
              <div className="py-6 px-8 flex flex-col justify-center bg-white">
                {/* Header */}
                <div className="mb-6 text-center">
                  <p className="text-sm text-gray-600 font-medium">Choose the option that fits your rhythm:</p>
                </div>

                {/* Stacked Options */}
                <div className="space-y-4 max-w-xl mx-auto">
                  {/* Option 1 */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-lg text-gray-800 mb-3">
                        <span className="font-semibold">Take The Audit:</span> Tuesday | 2:00 - 4:00 PM ET
                      </p>
                    </div>
                    <a
                      href="https://join.butter.us/make-time-for-more/audit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-[#7FB069]/80 hover:bg-[#7FB069] text-white rounded-lg text-base font-bold py-3">
                        Enter Audit Onboarding
                      </Button>
                    </a>
                  </div>

                  {/* Option 2 */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-lg text-gray-800 mb-3">
                        <span className="font-semibold">Set Your Intention:</span> Wednesday | 2:00 - 4:00 PM
                        ET
                      </p>
                    </div>
                    <a
                      href="https://join.butter.us/make-time-for-more/onboarding"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-[#E26C73]/80 hover:bg-[#E26C73] text-white rounded-lg text-base font-bold py-3">
                        Enter Intention Onboarding
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Footer Note */}
                <p className="text-[15px] text-gray-600 italic text-center mt-6">
                  No reminders will be sent — this is your monthly alignment assignment.
                </p>
              </div>
            </div>
          </div>

          {/* Description Text - Moved Here */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              Complete these three essential steps to prepare for your transformation journey
            </p>
          </div>

          {/* Three Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Step 1.1 - Audit Card */}
            <Card className="bg-[#7FB069] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="/images/logo.png"
                    alt="Make Time For More Logo"
                    width={48}
                    height={48}
                    className="rounded-full shadow-lg"
                  />
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

                <div className="h-9"></div>

                <div className="flex flex-col gap-3 mt-3">
                  <Link href="/audit" className="block">
                    <Button
                      size="lg"
                      className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold"
                    >
                      Take The Work-Life Balance Audit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Step 1.2 - Intention Setting Card */}
            <Card className="bg-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="/images/logo.png"
                    alt="Make Time For More Logo"
                    width={48}
                    height={48}
                    className="rounded-full shadow-lg"
                  />
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

                <div className="flex flex-col gap-3 mt-3">
                  <Link href="/focus-areas" className="block">
                    <Button
                      size="lg"
                      className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold"
                    >
                      Choose Your 1-3 Priority Focus Areas
                    </Button>
                  </Link>

                  <a
                    href="https://docs.google.com/document/d/1RtaoYOUQmmPSD2U5EaLPiilQifnSamE5Yo6SaOYf4UM/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
                      <Download className="mr-2 h-4 w-4" />
                      Open The Intention Setting Guide
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Step 1.3 - Preparation Checklist Card */}
            <Card className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="/images/logo.png"
                    alt="Make Time For More Logo"
                    width={48}
                    height={48}
                    className="rounded-full shadow-lg"
                  />
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

                <a
                  href="https://docs.google.com/document/d/1IZ5qefGnMQpYJP8wMgQS3tVY6sj56CHcCpRBkOGpGjU/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3"
                >
                  <Button className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
                    <Download className="mr-2 h-4 w-4" />
                    Open The Preparation Checklist
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Important Note */}
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
          {/* Step 2 Badge at Top */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
            <Badge variant="secondary" className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] text-white border-0">
              Step 2
            </Badge>
          </div>

          {/* Header Text Above Image */}
          <div className="text-center mb-8">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent mb-4">
              Make The Sunday Shift
            </h3>
            <p className="text-xl text-gray-700 font-medium">
              Adopt The Work-Life Balance Business Model & SOP™ -- the "Sustainable" Operating Procedure
            </p>
          </div>

          {/* Cherry Blossom Countdown Component */}
          <div className="text-center mb-12">
            <CherryBlossomCountdown />
          </div>

          {/* Content Grid with rounded corners and shadow */}
          <div className="flex justify-center">
            <div className="space-y-4 flex flex-col max-w-4xl w-full bg-white/80 rounded-2xl shadow-xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-700 bg-white/80 p-3 rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-[#7FB069] flex-shrink-0" />
                  <span className="font-semibold text-lg">Join Us Live: Sunday @ 1:00–2:00 PM ET</span>
                </div>

                <a
                  href="https://join.butter.us/make-time-for-more/sunday-shift"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full h-full bg-white hover:bg-gray-50 text-[#7FB069] border-2 border-[#7FB069] font-semibold py-3 text-lg">
                    Enter Here to Make The Sunday Shift
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 - Co-Working Non-Negotiables Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Step 3 Badge at Top */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
            <Badge variant="secondary" className="bg-[#7FB069] text-white border-0">
              Step 3
            </Badge>
          </div>

          {/* Header Text Above Image */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#7FB069] mb-4">
              Break The Hustle Habit — Co-Work Your Non-Negotiables™
            </h3>
          </div>

          {/* New Co-Working Women Image */}
          <div className="text-center mb-8">
            <div className="max-w-6xl mx-auto">
              <img
                src="/images/design-mode/00000000000001step4.png"
                alt="Diverse professional women in co-working environments with cherry blossoms"
                className="w-full h-auto object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Green Banner */}
          <div className="max-w-6xl mx-auto mb-8 -mt-4">
            <div className="bg-[#7FB069] text-white p-4 rounded-b-2xl shadow-lg text-center">
              <p className="text-lg lg:text-2xl font-medium leading-relaxed">
                You'll Practice, Embody & Live This Schedule with Us — 4 Days a Week
              </p>
            </div>
          </div>

          {/* Interactive Schedule Component */}
          <div className="rounded-2xl overflow-hidden mt-4">
            <WorkLifeBalanceSchedule />
          </div>
        </div>
      </div>

      

      {/* Cherry Blossom AI Suite */}
      <div className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 pt-20 pb-25">
        <div className="text-center mb-12">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-center gap-3 mb-8">
              <img
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={80}
                height={80}
                className="rounded-full shadow-lg"
              />
            </div>
            <img
              src="/images/cherry-blossom-suite-new.png"
              alt="Cherry Blossom Suite"
              className="w-full h-auto object-contain mx-auto mb-6 rounded-2xl"
            />
            <h2 className="text-2xl font-bold text-[#E26C73] mb-4">
              🌸 World's First AI-Powered Work-Life Balance Planner 🌸
            </h2>
            <p className="text-lg text-gray-900 mb-4">
              6 AI Powered Work-Life Balance Co-Guides to help plan your Experience — Each co-guide provides
              personalized planning, progress insights and transformation strategies.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto px-6">
          {/* Card 1 - Morning GIV•EN™ Routine */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/tea-cup-icon.png"
                    alt="Morning GIV•EN™ Routine"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Morning GIV•EN™ Routine</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your spiritual alignment and morning routine co-guide for starting each day with intention and divine
                connection.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/images/morning-routine-pink-meditation.webp"
                  alt="Woman meditating in pink attire"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("morning-routine", "Morning GIV•EN™ Routine")}
                className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold"
              >
                Plan Your Morning Routine
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 - 30-Minute Workday Workout Window */}
          <Card className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 border-2 border-[#7FB069]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/yoga-meditation-icon.png"
                    alt="30-Minute Workday Workout Window"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">30-Minute Workday Workout Window</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your movement and energy optimization co-guide for integrating physical wellness into your workday.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/images/workout-window-screen.webp"
                  alt="Woman viewing virtual workout class"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("workout-window", "30-Minute Workday Workout Window")}
                className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white font-semibold"
              >
                Plan Your Workout Window
              </Button>
            </CardContent>
          </Card>

          {/* Card 3 - Extended Healthy Hybrid Lunch Break */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/tea-cup-icon.png"
                    alt="Extended Healthy Hybrid Lunch Break"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                Extended Healthy Hybrid Lunch Break
              </CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your nourishment and activity-stacking co-guide for combining social connections, business meetings, and
                healthy eating in beautiful settings.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/images/hybrid-lunch-outdoor.png"
                  alt="Woman enjoying healthy salad outdoors"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("lunch-break", "Extended Healthy Hybrid Lunch Break")}
                className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold"
              >
                Plan Your Lunch Break
              </Button>
            </CardContent>
          </Card>

          {/* Card 4 - 4-Hour Focused CEO Workday */}
          <Card className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 border-2 border-[#7FB069]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/ceo-presentation-cherry-blossom-icon.png"
                    alt="4-Hour Focused CEO Workday"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">4-Hour Focused CEO Workday</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your productivity and business alignment co-guide for working ON your business with divine co-creation
                and quantum focus.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/images/ceo-workday-focused.png"
                  alt="Professional woman working at desk"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("ceo-workday", "4-Hour Focused CEO Workday")}
                className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white font-semibold"
              >
                Plan Your CEO Workday
              </Button>
            </CardContent>
          </Card>

          {/* Card 5 - Quality of Lifestyle Experiences */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E26C73] to-[#7FB069] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/family-vacation-icon.png"
                    alt="Quality of Lifestyle Experiences"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Quality of Lifestyle Experiences</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your joy, creativity, and connection co-guide for immersing in the real wealth of life experiences.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/images/family-lifestyle-experiences.png"
                  alt="Woman enjoying quality time with family"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("lifestyle-experiences", "Quality of Lifestyle Experiences")}
                className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold"
              >
                Plan Your Lifestyle Experiences
              </Button>
            </CardContent>
          </Card>

          {/* Card 6 - Power Down & Unplug Digital Detox */}
          <Card className="bg-gradient-to-br from-[#E26C73]/10 to-[#E26C73]/5 border-2 border-[#E26C73]/20 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7FB069] to-[#E26C73] flex items-center justify-center shadow-sm">
                  <img
                    src="/images/power-down-moon-cherry-blossom-icon.png"
                    alt="Power Down & Unplug Digital Detox"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-3">Power Down & Unplug Digital Detox</CardTitle>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your evening wind-down and nervous system regulation co-guide for restorative sleep and overnight
                hormone repair.
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src="/images/power-down-reading-night.png"
                  alt="Woman reading in cozy evening setting"
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={() => openChat("digital-detox", "Power Down & Unplug Digital Detox")}
                className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white font-semibold"
              >
                Plan Your Digital Detox
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wellness Tracking Dashboard */}
      <div id="wellness-dashboard" className="max-w-6xl mx-auto px-16 py-16">
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

        <Card className="border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Complete Wellness Tracking Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[#7FB069] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Date Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Every workout and sleep entry includes specific dates for accurate progress monitoring.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-[#E26C73] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Progress Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Comprehensive weekly and monthly progress tracking with visual charts and insights.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-[#7FB069] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Goal Setting</h4>
                  <p className="text-sm text-gray-600">
                    Set and track weekly goals for both movement and sleep optimization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-[#E26C73] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Habit Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Build and maintain healthy habits with our comprehensive tracking system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-[#7FB069] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Energy Optimization</h4>
                  <p className="text-sm text-gray-600">
                    Track your energy levels throughout the day and optimize your schedule accordingly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Moon className="h-5 w-5 text-[#E26C73] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Wellness Insights</h4>
                  <p className="text-sm text-gray-600">
                    Get personalized insights and recommendations based on your wellness data.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

{/* Week 4: Integration Week Section */}
      <div className="py-20 bg-gradient-to-br from-[#7FB069]/10 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="order-2 lg:order-1">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1balck-RiZx5UtrQ1qvJVC6d3ANH1aMYrFG11.png"
                alt="Integration Week - Living Your New Rhythm"
                className="w-full rounded-3xl shadow-2xl"
              />
            </div>

            {/* Right: Content */}
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#7FB069]">
                Week 4: Integration Week
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                Your fourth week of every cycle is designed for <span className="font-bold text-[#7FB069]">solo practice</span> — no co-working sessions, no live calls.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                This is where you prove to yourself that the Work-Life Balance rhythm you've been installing over the past three Mondays has truly become <span className="font-semibold">automatic</span>.
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#7FB069]/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens During Integration Week:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#7FB069] flex-shrink-0 mt-1" />
                    <span><strong>Monday - Thursday:</strong> You live the full model solo — GIV•EN, Workout Window, Extended Lunch, 4-Hour CEO Block, Quality of Life Experiences, Power Down Detox</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#7FB069] flex-shrink-0 mt-1" />
                    <span><strong>Friday - Sunday:</strong> Pure white space. No structure. Just life.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#7FB069] flex-shrink-0 mt-1" />
                    <span><strong>16-Hour Work Week:</strong> You work 4 focused hours per day, Monday-Thursday (16 total hours)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#7FB069] flex-shrink-0 mt-1" />
                    <span><strong>152 Hours Time Freedom:</strong> The remaining 152 hours of your week belong to YOU</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#E26C73]/10 rounded-2xl p-6">
                <p className="text-gray-800 font-medium">
                  <span className="text-[#E26C73] font-bold">This is the proof:</span> If you can live this rhythm independently for a full week — without external accountability or co-working support — you've successfully installed a sustainable Work-Life Balance business model.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Your Monthly Success Story Section */}
      <div className="py-20 bg-gradient-to-br from-[#E26C73]/10 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#E26C73]">
                Share Your Monthly Success Story
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                At the end of every 28-Day Installation Cycle, we invite you to{" "}
                <span className="font-bold text-[#E26C73]">reflect, celebrate, and share</span> your transformation.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Your story matters — not just for you, but for every entrepreneur still trapped in hustle culture, wondering if balance is actually possible.
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#E26C73]/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What to Share:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#E26C73] flex-shrink-0 mt-1" />
                    <span>What shifted for you this month?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#E26C73] flex-shrink-0 mt-1" />
                    <span>What habits finally stuck?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#E26C73] flex-shrink-0 mt-1" />
                    <span>What time freedom did you reclaim?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#E26C73] flex-shrink-0 mt-1" />
                    <span>How did your business or life transform?</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <a
                  href="https://www.maketimeformore.com/testimonials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-gradient-to-r from-[#E26C73] to-[#7FB069] hover:from-[#D55A60] hover:to-[#6FA055] text-white text-lg py-6">
                    Submit Your Success Story
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <p className="text-center text-gray-600 text-sm italic">
                  Your testimonial may be featured on our website, in our community, and in our marketing to inspire others.
                </p>
              </div>
            </div>

            {/* Right: Image */}
            <div>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1debrief-MRp5ajmcKDbCglvbDKinQcD0Ug8uCx.png"
                alt="Share Your Success Story"
                className="w-full rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Facebook Group CTA Section */}
      <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-8">
                <img
                  src="/images/logo.png"
                  alt="Make Time For More Logo"
                  width={80}
                  height={80}
                  className="rounded-full shadow-lg"
                />
              </div>
              <h2 className="text-3xl font-bold text-[#E26C73] mb-6">Join Our Facebook Community</h2>
              <p className="text-lg text-gray-600 mb-8">
                Connect with like-minded women on their work-life balance journey. Share experiences, get support,
                celebrate wins together, and share pics and videos of you making time for more.
              </p>
              <img
                src="/images/facebook-group-community.jpg"
                alt="Diverse community of women in cherry blossom setting"
                className="w-full h-auto object-cover rounded-2xl shadow-2xl mb-8"
              />
              <a
                href="https://www.facebook.com/groups/maketimeformore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold px-8 py-4 text-lg"
                >
                  Join Our Facebook Group
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rest, Recover & Recharge Section */}
      <div className="bg-gradient-to-br from-[#7FB069]/10 to-[#7FB069]/5 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
            <Badge variant="secondary" className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] text-white border-0">
              Week 4
            </Badge>
          </div>

          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#E26C73] to-[#7FB069] bg-clip-text text-transparent mb-4">
              Your Permission to Disconnect & Explore
            </h3>
            <p className="text-xl text-gray-700 font-medium">
              We don't just teach Work-Life Balance — we live it. That's why we take two community-wide sabbaticals every year where you have full permission to step away, explore, and recharge guilt-free.

Travel to new destinations, learn something new, spend quality time with family, pursue a passion project, or simply rest. No work. No guilt. No FOMO.
            </p>
          </div>

          <div className="text-center mb-8">
            <div className="max-w-4xl mx-auto">
              <img
                src="/images/vacation-celebration-women-cherry-blossoms.png"
                alt="Three diverse women celebrating together in cherry blossom setting"
                className="w-full h-auto object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* The Button for Sabbatical Planning was updated here */}
          <div className="max-w-4xl mx-auto mb-8">
            <Button
              onClick={() => openChat("sabbatical-planning", "Plan Your Summer or Winter Holiday Sabbatical")}
              size="lg"
              className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-bold px-12 py-6 text-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Plan Your Summer & Winter Holiday Sabbaticals Here
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            <Card className="border-2 border-[#E26C73]/30 bg-white/80">
              <CardHeader>
                <CardTitle className="text-[#E26C73] flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Summer Sabbatical (July - August)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Two full months to travel, play, and fully disconnect. Share vacation plans, family
                          adventures, and sabbatical experiences in the Facebook Group.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Share photos from epic family vacations and travel adventures</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Post about new hobbies, skills, or experiences you're exploring
</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Celebrate your guilt-free time off and inspire others to disconnect</span>
                  </div>
                </div>

                <a
                  href="https://www.facebook.com/groups/maketimeformore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white">
                    Share Your Summer Sabbatical Experiences Here
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#E26C73]/30 bg-white/80">
              <CardHeader>
                <CardTitle className="text-[#E26C73] flex items-center gap-2">
                  <Star className="h-5 w-5" />
                 Winter Sabbatical (November - December)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Two months to celebrate holidays, reflect on the year, and rest deeply. No pressure, no
                         deadlines — just intentional time with loved ones.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Share holiday celebrations and quality time with loved ones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Post year-end reflections and transformation stories</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#E26C73] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Inspire the community by showing what intentional rest looks like</span>
                  </div>
                </div>

                <a
                  href="https://www.facebook.com/groups/maketimeformore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white">
                    Share Your Winter Holiday Sabbatical Experiences Here
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Ready For More - Pricing Section */}
          <div className="py-20 rounded-2xl">
            <div className="max-w-7xl mx-auto px-6">
              <div className="bg-gradient-to-r from-[#E26C73] to-[#7FB069] text-white py-12 px-6 rounded-t-2xl text-center mb-0">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <img
                    src="/images/logo.png"
                    alt="Make Time For More Logo"
                    width={80}
                    height={80}
                    className="rounded-full shadow-lg"
                  />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready For More? Choose Your Next Level</h2>
                <p className="text-xl text-white/90">
                  Founding Member Scholarship: 50% Credit on All Experiences Through March 31, 2026
                </p>
              </div>

              {/* Content Section - Cream/beige background */}
              <div className="bg-[#F5F1E8] py-12 px-6 lg:px-12 rounded-b-2xl">
                <div className="max-w-5xl mx-auto space-y-6 mb-12">
                  <h3 className="text-2xl font-bold text-gray-900">
                    How Deeply Will You Root Your New Work-Life Balance Blueprint?
                  </h3>

                  <p className="text-lg text-gray-800 leading-relaxed">
                    Choose your experience level based on the transformation you're ready for. Each includes our
                    complete Make Time For More™ SOP with co-working sessions (Mon-Thu 1-5pm ET) plus independent
                    practice days.
                  </p>

                  <div className="bg-white rounded-2xl p-6 border border-[#7FB069]/20">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🌸</span> 2026 Community Sabbaticals & Schedule
                    </h4>
                    <p className="text-gray-700 mb-4">
                      We run <strong>(8) 28-Day Cycles per year</strong> during January - June and September - October.
                      If you're planning the 90-Day Full Installation, choose 3 consecutive months when we're in
                      session.
                    </p>
                    <p className="text-gray-700 mb-4">
                      As a member, you'll also join us for two annual sabbaticals where the entire community takes
                      intentional time off together:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-[#F5F1E8] rounded-xl p-4 shadow-sm">
                        <p className="font-semibold text-[#7FB069]">Summer Sabbatical</p>
                        <p className="text-gray-600">July - August 2026</p>
                        <p className="text-sm text-gray-500 mt-1">8 weeks of rest, travel & family time</p>
                      </div>
                      <div className="bg-[#F5F1E8] rounded-xl p-4 shadow-sm">
                        <p className="font-semibold text-[#E26C73]">Winter Holiday Sabbatical</p>
                        <p className="text-gray-600">November - December 2026</p>
                        <p className="text-sm text-gray-500 mt-1">8 weeks of celebration & reflection</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-12">
                   {/* Column 1 - The Monday Installation */}
<div className="flex flex-col">
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-grow flex flex-col border border-gray-100 hover:shadow-xl transition-all">
    <div className="h-[400px] overflow-hidden flex items-center justify-center bg-gray-50">
      <img src="/images/7-day-work-life-balance.png" alt="Professional woman working on laptop at outdoor cafe with cherry blossoms" className="w-full h-full object-cover" /> </div>

    <div className="p-6 flex-grow flex flex-col">
      <h3 className="text-2xl font-bold text-[#2F4F4F] mb-2">
        <strong>Make Time For More On Mondays™</strong>
      </h3>

      <p className="text-gray-700 mb-4 italic">
        The Monday Installation — a Work-Life Balance rhythm installed by living it.
      </p>

      <p className="text-gray-700 mb-4 leading-relaxed">
        Reclaim <strong>212 hours of time freedom</strong> in each 28-day cycle (32% of your month back) — without
        overhauling your entire week.
      </p>

      <div className="bg-[#F5F1E8] rounded-xl p-5 mb-6">
        <p className="font-semibold text-lg text-gray-800 mb-4">
          Your 28-Day Installation Cycle Includes:
        </p>

        <ul className="space-y-3 text-base text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>(3) Full Monday Installation Days</strong> (live, co-worked)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>(1) Integration Week</strong> to live the rhythm solo (no live co-working)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <strong>Work-Life Balance Audit + 28-Day Intention Setting</strong>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>(3) Sunday Shifts™</strong> (weekly alignment ritual)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>New 9–5 & Nighttime Non-Negotiables™ SOP</strong> (revealed in Sunday Shift)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              Access to the <strong>Work-Life Balance Installation Hub</strong> (tools, trackers, resources)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>Cherry Blossom™ AI Co-Guide</strong> (guided support inside the Hub)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>Private Facebook Community</strong> (accountability, wins, social proof, support)
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">
        <p className="font-semibold text-gray-800 mb-2">Your Commitment</p>
        <ul className="text-gray-600 space-y-2">
          <li>• <strong>3 consecutive 28-Day Installation Cycles</strong></li>
          <li>• <strong>$997 per cycle</strong> (3 payments total)</li>
          <li>• Mondays-only live co-working + Integration Week after each cycle</li>
          <li>• <strong>No refunds</strong> — this is an installation, not a drop-in program</li>
        </ul>
      </div>

      <div className="space-y-4 mt-auto">
        <a
          href="https://www.maketimeformore.com/checkout/1-week-hzlvl"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
        >
          <div className="bg-[#7FB069] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
            <div className="font-bold text-sm tracking-wide mb-3">
              <strong>FOUNDING MEMBER INSTALLATION</strong>
            </div>
            <div className="font-bold mb-1 text-lg">
              <strong>The Monday Installation</strong>
            </div>
            <div className="text-m text-white/80 italic mb-3">
              3-cycle commitment (3 payments)
            </div>
            <div className="text-xl font-bold mb-1">
              <strong>$997</strong>
              <span className="text-white/80 font-normal"> / cycle</span>
            </div>
            <div className="text-white/80 text-sm mb-4">
              Total commitment: <strong>$2,991</strong>
            </div>
            <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
              <strong>Enroll & Start Onboarding →</strong>
            </div>
          </div>
        </a>

        <p className="text-xs text-gray-500 text-center px-2">
          Weekly open enrollment · Sync into the rhythm · No catching up required
        </p>
      </div>
    </div>
  </div>
</div>


                    {/* Column 2 — 21-Day Habit Breaker + 1 Week Integration */}
<div className="flex flex-col">
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-grow flex flex-col border border-gray-100 hover:shadow-xl transition-all">
    <div className="h-[400px] overflow-hidden flex items-center justify-center bg-gray-50">
      <img
        src="/images/21-day-habit-breaker.png"
        alt="Mid-life woman living the full 4-day workweek work-life balance model"
        className="w-full h-full object-cover"
      />
    </div>

    <div className="p-6 flex-grow flex flex-col">
      <h3 className="text-2xl font-bold text-[#2F4F4F] mb-3">
        <strong>21-Day Habit Breaker + Integration Week</strong>
      </h3>

      <p className="text-gray-700 mb-3 italic">
        <strong>Full Work-Life Balance Business Model™ & SOP</strong>
      </p>

      <p className="text-gray-700 mb-5 leading-relaxed">
        Eliminate the Tue–Thu gap. Live the complete <strong>4-Day Workweek</strong> with
        <strong> 4-Hour Focused CEO Workdays</strong>—and install the rhythm as your operating system.
      </p>

      <div className="bg-[#F5F1E8] rounded-xl p-5 mb-6">
        <p className="font-semibold text-lg text-gray-800 mb-4">
          Your 28-Day Habit Breaker Includes:
        </p>

        <ul className="space-y-3 text-base text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>(12) Live Co-Working Days</strong> (Mon–Thurs across 3 weeks)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>(1) Integration Week</strong> (solo lived proof · no live co-working)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>4-Day Workweek</strong> + <strong>4-Hour Focused CEO Workdays</strong>
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>152 Hours of Weekly Time Freedom</strong> (your new baseline)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>New 9–5 & Nighttime Non-Negotiables™ SOP</strong> (full details inside the Hub)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>Work-Life Balance Audit</strong> + <strong>28-Day Intention</strong>
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>Sunday Shift™</strong> (alignment + rhythm preview)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>16 AI Executive Advisors</strong> (systemize/delegate Tue–Thu)
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>Custom SOP for Human Zone of Genius Pricing</strong>
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>Priority Support</strong> + cohort guidance
            </span>
          </li>

          <li className="flex items-start gap-2">
            <span className="text-[#7FB069] font-bold">✓</span>
            <span>
              <strong>Private Facebook Community</strong> (accountability + proof + support)
            </span>
          </li>
        </ul>

        <div className="mt-5 pt-5 border-t border-[#e6dfd3]">
          <p className="font-semibold text-gray-800 mb-2">Time Freedom Outcome</p>
          <p className="text-gray-700">
            Reclaim <strong>608 hours</strong> in 28 days by installing the full Mon–Thurs model + Integration Week.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">
        <p className="font-semibold text-gray-800 mb-2">Investment</p>
        <ul className="text-gray-700 space-y-2">
          <li>• <strong>$9,997</strong> per 28-day cycle</li>
          <li>• Includes 12 live Mon–Thurs days + 1 Integration Week</li>
          <li>• Option to repeat the cycle or move into Maintenance after proof</li>
        </ul>
      </div>

      <div className="space-y-4 mt-auto">
        <a
          href="https://www.maketimeformore.com/checkout/21-day-habit-breaker"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
        >
          <div className="bg-[#E26C73] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
            <div className="font-bold text-sm tracking-wide mb-3">
              <strong>UPGRADE — HABIT BREAKER</strong>
            </div>
            <div className="text-lg font-bold mb-1">
              <strong>21-Day Habit Breaker + Integration</strong>
            </div>
            <div className="text-white/80 text-sm mb-4">
              Full 4-Day Workweek · 152 hrs/week time freedom
            </div>
            <div className="text-xl font-bold mb-1">
              <strong>$9,997</strong>
            </div>
            <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
              <strong>Click here to upgrade →</strong>
            </div>
          </div>
        </a>

        <p className="text-xs text-gray-500 text-center px-2">
          For women ready to close the Tue–Thu gap and wire the full lifestyle rhythm.
        </p>
      </div>
    </div>
  </div>
</div>

{/* Column 3 - 90-Day Installation */}
                    <div className="flex flex-col">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-grow flex flex-col border border-gray-100 hover:shadow-xl transition-all">
                        <div className="h-[400px] overflow-hidden flex items-center justify-center bg-gray-50">
                          <img
                            src="/images/21-day-habit-builder.png"
                            alt="Woman in luxury airplane seat with cherry blossom design"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-2xl font-bold text-[#2F4F4F] mb-4">
                            <strong>90-Day Full Installation</strong>
                          </h3>

                          <p className="text-gray-700 mb-4 italic">
                            Permanently Install the Work-Life Balance Business Model as Your Operating System.
                          </p>

                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Perfect if you're all-in on transformation—3 consecutive 28-day cycles to make the 4-day
                            workweek and 4-hour workday automatic.
                          </p>

                          <div className="bg-[#F5F1E8] rounded-xl p-5 mb-6">
                            <p className="font-semibold text-lg text-gray-800 mb-4">Your 90-Day Experience Includes:</p>
                            <ul className="space-y-3 text-base text-gray-600">
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <strong>2-Part Onboarding: Work-Life Balance Audit & 28-Day Intention Setting</strong>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>
                                  (9) <strong>4-Day Workweeks</strong> with (9) <strong>3-Day Weekends</strong>
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>
                                  (36) <strong>4-Hour Focused CEO Workdays</strong>
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <strong>152 Hours of Weekly Time Freedom (x9 weeks)</strong>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Expansion in 13 Core Life Value Areas</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(36) Morning GIV•EN™ Routines</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(36) 30-Minute Workday Workout Windows</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(36) Extended Healthy Hybrid Lunch Breaks</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(36) Power Down & Unplug Digital Detoxes</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Quality of Lifestyle Experiences</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(9) Sunday Shifts</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(3) Intention Setting Ceremonies (GIVEN)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>6 Hustle Habit Replacements (Mastered)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>(3) Weeks Rest, Recover & Recharge Breaks</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Cherry Blossom Suite: 6 AI-Powered Planners</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Workout Planner & Sleep Tracker Access</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Advanced AI Executive Workflows</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Priority Support & 1:1 Check-ins</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-[#7FB069] font-bold">✓</span>
                                <span>Facebook Community Access</span>
                              </li>
                            </ul>
                          </div>

                          <div className="space-y-4 mt-auto">
                            <a
                              href="https://www.maketimeformore.com/checkout/90-day-black-friday"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                            >
                              <div className="bg-[#E26C73] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
                                <div className="font-bold text-sm tracking-wide mb-3">
                                  <strong>BLACK FRIDAY SPECIAL</strong>
                                </div>
                                <div className="font-bold mb-1 text-lg">
                                  <strong>90-Day Installation</strong>
                                </div>
                                <div className="text-m text-white/80 italic mb-3">(Now - December 31)</div>
                                <div className="text-xl font-bold mb-1">
                                  <strong>$8,997</strong>
                                </div>
                                <div className="text-white/80 text-sm mb-4">
                                  Reg <span className="line-through">$22,500</span>
                                </div>
                                <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
                                  <strong>Click here to upgrade →</strong>
                                </div>
                              </div>
                            </a>

                            <a
                              href="https://www.maketimeformore.com/checkout/90-day-founding"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                            >
                              <div className="bg-[#7FB069] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
                                <div className="font-bold text-sm tracking-wide mb-3">
                                  <strong>FOUNDING MEMBER</strong>
                                </div>
                                <div className="font-bold mb-1 text-lg">
                                  <strong>90-Day Installation</strong>
                                </div>
                                <div className="text-m text-white/80 italic mb-3">(Jan 1 - March 31)</div>
                                <div className="text-xl font-bold mb-1">
                                  <strong>$11,250</strong>
                                </div>
                                <div className="text-white/80 text-sm mb-4">
                                  Reg <span className="line-through">$22,500</span>
                                </div>
                                <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
                                  <strong>Click here to upgrade →</strong>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 bg-gradient-to-r from-[#E26C73] to-[#7FB069] rounded-2xl p-8 shadow-lg">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="lg:w-2/3 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                          <strong>Make Time For More On Mondays</strong>
                        </h3>
                        <p className="mb-4 italic text-white/90">Stay Connected with 3 Mondays Per Month</p>
                        <p className="mb-4 leading-relaxed text-white/90">
                          Perfect if you want to maintain your connection to the community, keep your rhythms steady, or
                          need a lighter commitment after completing an experience. Join us for 3 powerful Mondays each
                          month during the habit-building weeks.
                        </p>
                        <ul className="grid md:grid-cols-2 gap-3 text-base text-white/90">
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>(3) Monday Co-Working Sessions (1-5pm ET)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>Morning GIV•EN™ Routine Access</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>SOP Access on Mondays</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>AI Executive Team Demos</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>Facebook Community Access</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-white font-bold">✓</span>
                            <span>Upgrade Anytime</span>
                          </li>
                        </ul>
                      </div>
                      <div className="lg:w-1/3 flex flex-col gap-4">
                        <a
                          href="https://www.maketimeformore.com/checkout/mondays-membership"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                        >
                          <div className="bg-white text-[#2F4F4F] rounded-2xl p-6 text-center shadow-lg transition-all">
                            <div className="font-bold text-sm tracking-wide mb-3">
                              <strong>MONTHLY MEMBERSHIP</strong>
                            </div>
                            <div className="font-bold mb-1 text-lg">
                              <strong>Mondays Only</strong>
                            </div>
                            <div className="text-xs text-gray-500 italic mb-3">Cancel Anytime</div>
                            <div className="text-xl font-bold mb-1">
                              <strong>$297/mo</strong>
                            </div>
                            <div className="mt-3 bg-gradient-to-r from-[#E26C73] to-[#7FB069] rounded-full py-2 px-4 text-white font-bold text-sm">
                              <strong>Click here to join →</strong>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
                    
          {/* Book Thought Leader Barbara section */}
          {/* Book Thought Leader Barbara Section */}
          <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 py-8 pb-24">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-12">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <img
                      src="/images/logo.png"
                      alt="Make Time For More Logo"
                      width={80}
                      height={80}
                      className="rounded-full shadow-lg"
                    />
                  </div>
                  <h2
                    className="text-4xl text-[#E26C73] mb-8"
                    style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400 }}
                  >
                    Book Thought Leader Barbara
                  </h2>
                  <div className="flex justify-center mb-8">
                    <img
                      src="/images/barbara-cherry-garden.jpg"
                      alt="Barbara"
                      className="w-64 h-64 rounded-full object-cover shadow-2xl"
                    />
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    To learn more about Barbara's availability for speaking engagements and interviews, or to schedule
                    private coaching sessions or VIP DAYs, email Barbara:{" "}
                    <a
                      href="mailto:coachbarbara@maketimeformore.com"
                      className="text-[#7FB069] hover:text-[#6FA055] font-semibold underline"
                    >
                      coachbarbara@maketimeformore.com
                    </a>
                  </p>
                  <p className="text-base text-gray-600 italic">
                    Put <span className="font-bold">SPEAKING</span>, <span className="font-bold">INTERVIEW</span>,{" "}
                    <span className="font-bold">COACHING</span>, <span className="font-bold">VIP DAY</span> in the
                    subject line in all caps.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <SimpleChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            context={chatContext}
            title={chatTitle}
          />

          {/* Removed FloatingChatButton component */}

          <CherryBlossomCoGuide isOpen={isCoGuideOpen} onClose={() => setIsCoGuideOpen(false)} userId={userId} />
        </div>
      </div>
    </div>
  )
}
