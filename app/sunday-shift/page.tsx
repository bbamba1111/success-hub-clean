"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Target, TrendingUp, Calendar, Zap, Moon, CheckCircle, Star, Download, CheckCircle2, Sparkles, Heart, Users } from "lucide-react"
import CherryBlossomCountdown from "@/components/cherry-blossom-countdown"
import { SimpleChatModal } from "@/components/simple-chat-modal"
import { CherryBlossomCoGuide } from "@/components/cherry-blossom-co-guide"
import { createBrowserClient } from "@supabase/ssr"

export default function SundayShiftPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatContext, setChatContext] = useState<string>("")
  const [chatTitle, setChatTitle] = useState("")
  const [isCoGuideOpen, setIsCoGuideOpen] = useState(false)
  const [userId, setUserId] = useState<string | undefined>()

  useEffect(() => {
    const getUserId = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
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

  const openChat = (context: string, title: string) => {
    setChatContext(context)
    setChatTitle(title)
    setIsChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Make The Sunday Shift Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent mb-4">
              Make The Sunday Shift<sup className="text-xl">™</sup>
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              In the Parallel Lane of Harmony Entrepreneurship, Monday Is Not Reactive — It’s Intentional.
            </p>
          </div>

          <div className="text-center mb-12">
            <CherryBlossomCountdown />
          </div>

          <div className="flex justify-center">
            <div className="space-y-4 flex flex-col max-w-4xl w-full bg-white/80 rounded-2xl shadow-xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-700 bg-white/80 p-3 rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-[#7FB069] flex-shrink-0" />
                  <span className="font-semibold text-lg">Join Us Live: Sunday @ 1:00-3:00 PM ET</span>
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

      {/* Complete Onboarding Section */}
      <div className="bg-gradient-to-br from-[#F5F1E8] to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-6">
            <p
              className="text-[39px] text-gray-700 mb-4"
              style={{ fontFamily: "'Playfair Display'", fontWeight: 400 }}
            >
              Live with Thought Leader Barbara
            </p>
            <h2 className="text-3xl font-medium text-[#7FB069] mb-4">
              Your First 3 Steps to Clarity, Non-Negotiable Priorities & Intentional Success
            </h2>
          </div>

          {/* Barbara Image & Quote */}
          <div className="bg-gradient-to-r from-[#F9F6F1] via-[#FAF7F2] to-[#F9F6F1] rounded-2xl overflow-hidden shadow-xl mb-12 border border-gray-200">
            <div className="grid md:grid-cols-[320px,1fr] gap-0">
              <div className="relative h-full min-h-[280px] bg-[#F9F6F1] flex items-center justify-center py-6 px-8">
                <div className="relative flex items-center justify-center">
                  <img
                    src="/images/barbara-cherry-garden.jpg"
                    alt="Barbara"
                    className="w-[270px] h-[270px] rounded-full object-cover shadow-2xl"
                  />
                </div>
              </div>

              <div className="py-6 px-8 flex flex-col justify-center bg-white">
                <p
                  className="text-[33px] text-gray-700 text-center italic leading-relaxed"
                  style={{ fontFamily: "'Cormorant Garamond'", fontWeight: 400 }}
                >
                  {"\"How you enter the week determines how you live, work and lead your week.\" — B. Bamba"}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-[20px] text-gray-700">
              Complete these three essential steps to prepare your energy, calendar, and focus for Monday and the days ahead.
            </p>
          </div>

          {/* Three Steps Grid - Audit, Intention, Prep */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Step 1 - Audit Card */}
            <Card className="bg-[#7FB069] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/images/logo.png" alt="Make Time For More Logo" width={48} height={48} className="rounded-full shadow-lg" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">Step 1</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">Take The Work-Life Balance Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Discover exactly where you stand across 15 key life areas with our comprehensive assessment. Get personalized insights and identify your biggest opportunities for growth.
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
                    <Button size="lg" className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
                      Take The Work-Life Balance Audit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 - Intention Setting Card */}
            <Card className="bg-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/images/logo.png" alt="Make Time For More Logo" width={48} height={48} className="rounded-full shadow-lg" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">Step 2</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Set Your 7-Day Desired Work-LifeStyle Intention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Transform your audit insights into powerful, actionable intentions. Choose 1-3 focus areas and let Cherry Blossom guide you through creating your personalized 7-day transformation plan.
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
                    <Button size="lg" className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold">
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

            {/* Step 3 - Preparation Checklist Card */}
            <Card className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/images/logo.png" alt="Make Time For More Logo" width={48} height={48} className="rounded-full shadow-lg" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">Step 3</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Prepare For The Monday Reset: Download Your Preparation Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Get ready for your transformation with our comprehensive preparation checklist. Complete these steps to create the optimal environment for your work-life balance journey.
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
              What Happens After You Make The Sunday Shift™
            </p>
          </div>
        </div>
      </div>
{/* Monday Reset Masterclass Invitation Section */}
      <div className="py-20 bg-gradient-to-br from-[#2F4F4F] to-[#1a3535] relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#7FB069]" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#E26C73]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Cherry Blossom Header */}
          <div className="text-center mb-12">
            <p className="text-[#E26C73] text-sm font-semibold tracking-widest uppercase mb-4">What Happens After The Sunday Shift</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              The Monday Reset<sup className="text-xl">™</sup>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              The Sunday Shift creates clarity. The Monday Reset installs the container.
            </p>
          </div>

          {/* Hero Image + Intro */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Feb%2011%2C%202026%2C%2011_29_58%20AM-GpoaKt4dbVfVYKzrkkHmBOk789E8Tq.png"
                alt="Woman enjoying peaceful morning with coffee - Make Time For More Harmony"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-6 text-white">
              <div className="space-y-4">
                <p className="text-lg leading-relaxed text-white/90">
                  You identified the imbalances. You chose your 1-3 non-negotiable priorities. You clarified what matters most this week.
                </p>
                <p className="text-xl font-semibold text-[#7FB069]">
                  Now you are invited to live inside a structure that supports it.
                </p>
                <p className="text-lg leading-relaxed text-white/90">
                  Most women try to improve their lives without changing the structure that is exhausting them. They set intentions — but enter Monday inside the same reactive framework.
                </p>
                <p className="text-lg leading-relaxed text-white/90">
                  In the Harmony Lane of Entrepreneurship, we do something different. We redesign how the week begins.
                </p>
              </div>
            </div>
          </div>

          {/* Why This Works - Science Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 mb-16 border border-white/20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Why This Works</h3>
                <p className="text-lg text-white/90 leading-relaxed mb-6">
                  Burnout is not a discipline problem. It is a structural one. When you have been conditioned to push, force, overwork, and over-effort your way to success, your nervous system stays in stress chemistry.
                </p>
                <p className="text-lg text-white/90 leading-relaxed mb-6">
                  But science shows us something powerful:
                </p>
                <div className="space-y-3">
                  <p className="text-[#7FB069] font-semibold text-lg">Energy precedes execution.</p>
                  <p className="text-[#7FB069] font-semibold text-lg">Clarity precedes results.</p>
                  <p className="text-[#7FB069] font-semibold text-lg">Structure shapes behavior.</p>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Feb%2011%2C%202026%2C%2011_15_45%20AM-KtQZLNIuyo8SJCTL71G2WeKgifNDbE.png"
                  alt="Make Time For More Harmony - from hustle to harmony"
                  className="w-80 h-80 rounded-2xl shadow-xl object-cover"
                />
              </div>
            </div>
          </div>

          {/* The Shift */}
          <div className="text-center mb-16">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-[#E26C73]/20 rounded-2xl p-6 border border-[#E26C73]/30">
                <p className="text-[#E26C73] font-semibold mb-2">FROM</p>
                <p className="text-white text-lg">Over-efforting</p>
                <p className="text-[#7FB069] font-bold text-2xl my-2">&#8594;</p>
                <p className="text-[#7FB069] font-semibold mb-2">TO</p>
                <p className="text-white text-lg">Intentional Execution</p>
              </div>
              <div className="bg-[#E26C73]/20 rounded-2xl p-6 border border-[#E26C73]/30">
                <p className="text-[#E26C73] font-semibold mb-2">FROM</p>
                <p className="text-white text-lg">Forcing Outcomes</p>
                <p className="text-[#7FB069] font-bold text-2xl my-2">&#8594;</p>
                <p className="text-[#7FB069] font-semibold mb-2">TO</p>
                <p className="text-white text-lg">Focused Leadership</p>
              </div>
              <div className="bg-[#E26C73]/20 rounded-2xl p-6 border border-[#E26C73]/30">
                <p className="text-[#E26C73] font-semibold mb-2">FROM</p>
                <p className="text-white text-lg">Hustling Harder</p>
                <p className="text-[#7FB069] font-bold text-2xl my-2">&#8594;</p>
                <p className="text-[#7FB069] font-semibold mb-2">TO</p>
                <p className="text-white text-lg">Harmonizing Rhythm</p>
              </div>
            </div>
          </div>

          {/* What You Experience on Monday */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-white text-center mb-10">What You Experience on Monday</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#7FB069]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#7FB069] text-xl font-bold">1</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Morning GIV*EN Alignment</h4>
                <p className="text-white/70 text-sm">A grounded ritual to set your intention before the day begins.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#7FB069]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#7FB069] text-xl font-bold">2</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Workday Workout Window</h4>
                <p className="text-white/70 text-sm">Built-in movement to reset your energy mid-day.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#7FB069]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#7FB069] text-xl font-bold">3</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Extended Healthy Hybrid Lunch</h4>
                <p className="text-white/70 text-sm">A real break — not a rushed meal at your desk.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#E26C73]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#E26C73] text-xl font-bold">4</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">4-Hour Focused CEO Workday</h4>
                <p className="text-white/70 text-sm">Co-worked deep focus — your highest-value work gets done here.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#E26C73]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#E26C73] text-xl font-bold">5</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">20 Hours Protected Time Freedom</h4>
                <p className="text-white/70 text-sm">Your life expands in the space work no longer occupies.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#E26C73]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#E26C73] text-xl font-bold">6</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Power Down & Unplug</h4>
                <p className="text-white/70 text-sm">A structured close so you truly disconnect and recharge.</p>
              </div>
            </div>
            <p className="text-center text-white/60 mt-6 text-sm italic">
              Four elements are co-worked. Two are lived independently. Work has a start time. Work has a stop time.
            </p>
          </div>

          {/* Monday Is the On-Ramp */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 text-white">
              <h3 className="text-3xl font-bold">Monday Is the On-Ramp</h3>
              <p className="text-lg text-white/90 leading-relaxed">
                The Monday Reset is your first installation day. Some women experience one Reset and feel the shift. Some return weekly to strengthen the rhythm.
              </p>
              <p className="text-lg text-white/90 leading-relaxed">
                Some expand into the full Monday-Thursday model, where frequency and repetition wire this as their new default operating system.
              </p>
              <div className="space-y-3 pt-4">
                <p className="text-[#7FB069] font-semibold text-lg">Frequency builds sustainability.</p>
                <p className="text-[#7FB069] font-semibold text-lg">Repetition builds identity.</p>
                <p className="text-[#7FB069] font-semibold text-lg">Rhythm builds legacy.</p>
              </div>
              <p className="text-xl font-semibold text-white pt-4">
                You prepared the lane. Now you are invited to step into it.
              </p>
            </div>
            <div className="flex justify-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Dec%2021%2C%202025%2C%2003_31_18%20AM-QJOoaSnovH48wFCYRsMtGAljPojxL7.png"
                alt="No more grinding into the week. You now ease into it harmonized, intentional, and fully aligned."
                className="w-full max-w-md rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] rounded-3xl p-10 text-center shadow-2xl">
            <p className="text-white/90 text-sm font-semibold tracking-widest uppercase mb-4">Pilot Case Study Opportunity</p>
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Reserve Your Spot for The Monday Reset<sup className="text-lg">™</sup>
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Step into the structure that replaces survival with sustainability. One Monday can shift everything.
            </p>
            <div className="flex flex-col items-center gap-4">
              <a
                href="https://www.maketimeformore.com/checkout/monday-reset-297"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="bg-white text-[#2F4F4F] hover:bg-gray-50 text-lg px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-semibold tracking-wide">CASE STUDY INVESTMENT</span>
                    <span className="text-3xl font-bold">$297</span>
                  </div>
                </Button>
              </a>
              <p className="text-white/70 text-sm italic">Limited spots available for the founding pilot cohort</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Your Sunday Shift Reflection */}
      <div className="py-20 bg-gradient-to-br from-[#E26C73]/10 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#E26C73]">
                Share Your Sunday Shift Reflection
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
               After completing your Audit + Intention, we invite you to{" "}
                <span className="font-bold text-[#E26C73]">reflect, celebrate, and share</span> your experience.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Your testimony matters — not just for you, but for every woman entrepreneur still trapped in hustle culture, wondering if she can start her week differently.
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#E26C73]/20">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What to Share:</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#E26C73] flex-shrink-0 mt-1" />
                    <span>What shifted for you?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#E26C73] flex-shrink-0 mt-1" />
                    <span>The clarity you gained from the Audit?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#E26C73] flex-shrink-0 mt-1" />
                    <span>The power of choosing 1–3 non-negotiable priorities?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-[#E26C73] flex-shrink-0 mt-1" />
                    <span>How you now feel about starting Monday?</span>
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
                    Submit Your Testimony
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <p className="text-center text-gray-600 text-sm italic">
                  Your testimony may be featured on our website, in our community, and/or in our marketing to inspire others.
                </p>
              </div>
            </div>

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

          {/* Content Section */}
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

              <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto mt-12">

                {/* Column 1 - Habit Building Installation */}
                <div className="flex flex-col">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg flex-grow flex flex-col border border-gray-100 hover:shadow-xl transition-all">
                    <div className="h-[400px] overflow-hidden flex items-center justify-center bg-gray-50">
                      <img src="/images/14-day-momentum-builder.png" alt="Woman in peaceful meditation in serene room with cherry blossoms"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-[#2F4F4F] mb-3">
                        <strong>Habit Building Installation™</strong>
                      </h3>

                      <p className="text-gray-700 mb-3 italic">
                        <strong>Repetition · Momentum · Wiring</strong>
                      </p>

                      <p className="text-gray-700 mb-3 italic">
                        Increased frequency to actively build the rhythm through lived repetition.
                      </p>
                      
                      <p className="text-gray-700 mb-5 leading-relaxed">
                        The Habit Building Installation™ is for women who already know the rhythm works — and want it to install <strong>faster.</strong> Instead of practicing once a week, you practice
                        <strong> four days per week (Monday-Thursday)</strong> during the structured weeks of a single 28-day cycle.
                      </p>

                      <div className="bg-[#F5F1E8] rounded-xl p-5 mb-6">
                        <p className="font-semibold text-gray-800 mb-4">Structure & Frequency</p>
                        <ul className="space-y-3 text-base text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069] font-bold">•</span>
                            <span><strong>Frequency:</strong> 4 days per week (Mon-Thu)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069] font-bold">•</span>
                            <span><strong>Structure:</strong> 3 structured weeks + 1 Integration Week</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069] font-bold">•</span>
                            <span><strong>Duration:</strong> 1 full 28-day cycle</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069] font-bold">•</span>
                            <span><strong>Total Installation Days:</strong> 12</span>
                          </li>
                        </ul>

                        <div className="mt-5 pt-5 border-t border-[#e6dfd3]">
                          <p className="font-semibold text-gray-800 mb-4">Purpose</p>
                          <p className="text-gray-700">
                            This installation is designed to <strong>normalize the rhythm as your baseline.</strong> It answers the question: "How do I make this my life — not a phase?" This is where the 4-Day Workweek and 4-Hour Focused CEO Workdays become natural — unlocking <strong>152 hours of weekly time freedom</strong> as a lived reality, not a goal.
                          </p>
                        </div>

                        <div className="mt-5 pt-5 border-t border-[#e6dfd3]">
                          <p className="font-semibold text-gray-800 mb-4">Time Freedom Outcome</p>
                          <p className="text-gray-700">
                            Reclaim <strong>608 hours</strong> in 28 days by installing the full Mon-Thurs model + Integration Week.
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">
                        <p className="font-semibold text-gray-800 mb-2">Investment</p>
                        <ul className="text-gray-700 space-y-2">
                          <li><strong>$9,997</strong> per 28-day cycle</li>
                          <li>Includes 12 live Mon-Thurs days + 1 Integration Week</li>
                          <li>Option to repeat the cycle or move into Maintenance after proof</li>
                        </ul>
                      </div>

                      <div className="space-y-4 mt-auto">
                        <a
                          href="https://www.maketimeformore.com/checkout/28-day-founding"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                        >
                          <div className="bg-[#E26C73] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
                            <div className="font-bold text-sm tracking-wide mb-3"><strong>UPGRADE</strong></div>
                            <div className="text-lg font-bold mb-1"><strong>Habit Building Installation</strong></div>
                            <div className="text-white/80 text-sm mb-4">Full 4-Day Workweeks · 4-Hour Workdays = 152 hrs/week time freedom</div>
                            <div className="text-xl font-bold mb-1"><strong>$9,997</strong></div>
                            <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
                              <strong>Click here to upgrade →</strong>
                            </div>
                          </div>
                        </a>
                        <p className="text-xs text-gray-500 text-center px-2">For women ready to close the Tue-Thu gap.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 - Desired Work-Lifestyle Installation */}
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
                        <strong>Desired Work-Lifestyle Installation</strong>
                      </h3>
                      <p className="text-gray-700 mb-3 italic">
                        <strong>Normalization · Identity · Baseline</strong>
                      </p>
                      <p className="text-gray-700 mb-3 italic">
                        This installation is for women who are ready to normalize the rhythm as their default way of living and leading.
                      </p>
                      <p className="text-gray-700 mb-5 leading-relaxed">
                        You live the full 4-Day (Mon-Thu) rhythm across three consecutive 28-day cycles — allowing the structure to move from familiar → embodied → automatic.
                      </p>
                      <p className="text-gray-700 mb-5 leading-relaxed">
                        This is where the rhythm stops being built — and becomes who you are.
                      </p>

                      <div className="bg-[#F5F1E8] rounded-xl p-5 mb-6">
                        <p className="font-semibold text-gray-800 mb-3">Structure & Frequency</p>
                        <ul className="space-y-3 text-base text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069] font-bold">•</span>
                            <span><strong>Frequency:</strong> 4 days per week (Mon-Thu)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069] font-bold">•</span>
                            <span><strong>Structure:</strong> 4-Day Workweek 4-Hour Workday</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069] font-bold">•</span>
                            <span><strong>Duration:</strong> 3 consecutive 28-day cycles</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#7FB069] font-bold">•</span>
                            <span><strong>Purpose:</strong> Customize and normalize the rhythm as your baseline</span>
                          </li>
                        </ul>

                        <div className="mt-5 pt-5 border-t border-[#e6dfd3]">
                          <p className="font-semibold text-gray-800 mb-3">Purpose</p>
                          <p className="text-gray-700">
                            This installation is designed to <strong>normalize the rhythm as your baseline.</strong> It answers the question: "How do I make this my life — not a phase?" This is where the 4-Day Workweek and 4-Hour Focused CEO Workdays become natural — unlocking <strong>152 hours of weekly time freedom</strong> as a lived reality, not a goal.
                          </p>
                        </div>

                        <div className="mt-5 pt-5 border-t border-[#e6dfd3]">
                          <p className="font-semibold text-gray-800 mb-3">Time Freedom Outcome</p>
                          <p className="text-gray-700">
                            Reclaim <strong>608 hours</strong> in 28 days by installing the full Mon-Thurs model + Integration Week.
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">
                        <p className="font-semibold text-gray-800 mb-2">Investment</p>
                        <ul className="text-gray-700 space-y-2">
                          <li><strong>Investment is shared by invitation.</strong> This container is intentionally limited to ensure alignment, support, and sustainability.</li>
                          <li>Request Invitation</li>
                          <li>Message Thought Leader Barbara</li>
                        </ul>
                      </div>

                      <div className="space-y-4 mt-auto">
                        <a
                          href="https://www.maketimeformore.com/checkout/90-day-founding"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                        >
                          <div className="bg-[#7FB069] text-white rounded-2xl p-6 text-center shadow-lg transition-all">
                            <div className="font-bold text-sm tracking-wide mb-3"><strong>INVITATION-ONLY</strong></div>
                            <div className="font-bold mb-1 text-lg"><strong>Desired Work-Lifestyle Installation</strong></div>
                            <div className="mt-3 bg-white/20 rounded-full py-2 px-4 text-white font-bold text-sm">
                              <strong>Contact TL Barbara →</strong>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* $297 Monthly Membership */}
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
                        <div className="font-bold text-sm tracking-wide mb-3"><strong>MONTHLY MEMBERSHIP</strong></div>
                        <div className="font-bold mb-1 text-lg"><strong>Mondays Only</strong></div>
                        <div className="text-xs text-gray-500 italic mb-3">Cancel Anytime</div>
                        <div className="text-xl font-bold mb-1"><strong>$297/mo</strong></div>
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

      <CherryBlossomCoGuide isOpen={isCoGuideOpen} onClose={() => setIsCoGuideOpen(false)} userId={userId} />
    </div>
  )
}
