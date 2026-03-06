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
            <h2 className="text-2xl font-medium text-[#7FB069] mb-4">
           Start Your Week with Clarity Instead of Chaos
            </h2>

            <h1 className="text-6xl lg:text-6xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent mb-4">
              Make The Sunday Shift<sup className="text-2xl">™</sup>
            </h1>
        
            <h2 className="text-3xl font-medium text-[#7FB069] mb-4">
           Design Your Week On Sunday & Make Time For More On Monday
            </h2>
            
          </div>

          <div className="text-center mb-12">
            <CherryBlossomCountdown />
          </div>

          <div className="flex justify-center">
            <div className="space-y-4 flex flex-col max-w-6xl w-full bg-white/80 rounded-2xl shadow-xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-700 bg-white/80 p-3 rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-[#7FB069] flex-shrink-0" />
                  <span className="font-semibold text-lg">Join Barbara Live — Sunday @ 1:00–3:00 PM ET</span>
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
              className="text-[40px] text-gray-700 mb-4"
              style={{ fontFamily: "'Playfair Display'", fontWeight: 400 }}
            >
              In the Hustle Lane, the week begins in reaction and survival mode.
            </p>
            <h2 className="text-3xl font-medium text-[#7FB069] mb-4">
           In the Harmony Lane, you intentionally prepare how the week begins.
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
                  style={{ fontFamily: "'Playfair Display'", fontWeight: 400 }}
                >
                  {"\"How you enter the week determines how you live, work and lead the week.\" — B. Bamba"}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-xl text-gray-900">
              Complete these three steps to assess where you are, set your intention, and prepare to live in The Harmony Lane.
            </p>
          </div>

          {/* Three Steps Grid - Audit, Intention, Prep */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Step 2.1 - Audit Card */}
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

            {/* Step 2.2 - Intention Setting Card */}
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

            {/* Step 2.3 - Preparation Checklist Card */}
            <Card className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src="/images/logo.png" alt="Make Time For More Logo" width={48} height={48} className="rounded-full shadow-lg" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">Step 3</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Prepare to Live Monday In The Harmony Lane: Download Your Preparation Checklist
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

        </div>
      </div>

      {/* Monday Reset Masterclass Invitation Section */}
      <div className="py-20 bg-gradient-to-br from-[#58795C] to-[#1a3535] relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#7FB069]" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#E26C73]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Cherry Blossom Header */}
          <div className="text-center mb-12">
            <p className="text-[#FFFFFF] text-l font-semibold tracking-widest uppercase mb-4">What Happens After The Sunday Shift</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              Make Time For More On Monday<sup className="text-4xl">™</sup>
            </h2>
            <p className="text-2xl text-white/80 max-w-8xl mx-auto leading-relaxed">
              Participate in the Founding Case Study of Harmony — The Parallel Lane of Hustle Entrepreneurship
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
                  You identified the imbalances. You chose your 1-3 non-negotiable priorities. You’ve set your intention for the week.
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

          {/* This Is a Live Case-Study Installation */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 text-white">
              <h3 className="text-3xl font-bold">This Is a Live Case-Study Installation</h3>
              <p className="text-lg text-white/90 leading-relaxed">
                The Work-Life Balance Business Model & SOP has already been architected as a harmony-first operating system for women in entrepreneurship.
              </p>
              <p className="text-lg text-white/90 leading-relaxed">
                Make Time For More On Mondays is where you experience it in real time.
              </p>
              <p className="text-lg text-white/90 leading-relaxed">
                We are currently running live case-study installations validating the structural impact of the Parallel Lane.
              </p>
              <p className="text-xl font-semibold text-[#7FB069]">This is not about motivation.</p>
              <p className="text-lg text-white/90 leading-relaxed">
                {"It's about measuring:"}
              </p>
              <ul className="space-y-3 text-white/90 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-[#7FB069] font-bold mt-1">&#8226;</span>
                  <span>What shifts when work is intentionally contained</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#7FB069] font-bold mt-1">&#8226;</span>
                  <span>What happens when energy precedes execution</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#7FB069] font-bold mt-1">&#8226;</span>
                  <span>How a 4-Hour Focused CEO Workday affects output and clarity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#7FB069] font-bold mt-1">&#8226;</span>
                  <span>What 20 hours of protected time freedom does to leadership</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#7FB069] font-bold mt-1">&#8226;</span>
                  <span>How rhythm changes nervous system chemistry</span>
                </li>
              </ul>
              <div className="pt-4 space-y-2">
                <p className="text-xl font-semibold text-white">You are not a beta tester.</p>
                <p className="text-[#E26C73] font-semibold text-lg">You are a founding participant.</p>
                <p className="text-[#E26C73] font-semibold text-lg">A pioneer. A contributor. A lane-builder.</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Feb%2020%2C%202026%2C%2002_24_53%20AM-XpA8JBEKrb1lmrQfB0H72i1Z4RAx2q.png"
                alt="Mother laughing joyfully with her two children at a cherry blossom park picnic - Make Time For More Harmony"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Why This Matters */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 mb-16 border border-white/20">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">Why This Matters</h3>
            <p className="text-lg text-white/90 leading-relaxed text-center max-w-3xl mx-auto mb-8">
              The data and lived experience from these installations inform:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
                <p className="text-white font-semibold text-lg">{"Women's Associations"}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
                <p className="text-white font-semibold text-lg">Founder Communities</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
                <p className="text-white font-semibold text-lg">Entrepreneurial Ecosystems</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
                <p className="text-white font-semibold text-lg">Conference & Panel Conversations</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center lg:col-span-1 md:col-span-2">
                <p className="text-white font-semibold text-lg">Wellness-Focused Workplace Design in the AI Age</p>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-bold text-[#7FB069]">This is operating system architecture.</p>
              <p className="text-xl font-bold text-[#E26C73]">Not productivity advice.</p>
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
                <div className="w-12 h-12 bg-[#4F3B1D]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#7FB069] text-xl font-bold">1</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Morning GIV*EN Alignment</h4>
                <p className="text-white/70 text-m">A grounded ritual to set your intention before the day begins.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#4F3B1D]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#7FB069] text-xl font-bold">2</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">30 Min Workday Workout Window</h4>
                <p className="text-white/70 text-m">Built-in movement to reset your energy mid-day.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#4F3B1D]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#7FB069] text-xl font-bold">3</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Extended Healthy Hybrid Lunch</h4>
                <p className="text-white/70 text-m">A real break — not a rushed meal at your desk.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#4F3B1D]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#E26C73] text-xl font-bold">4</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">4-Hour Focused CEO Workday</h4>
                <p className="text-white/70 text-m">Co-worked deep focus — your highest-value work gets done here.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#4F3B1D]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#E26C73] text-xl font-bold">5</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">20 Hours Protected Time Freedom</h4>
                <p className="text-white/70 text-m">Your life expands in the space work no longer occupies.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-[#4F3B1D]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[#E26C73] text-xl font-bold">6</span>
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Power Down & Unplug</h4>
                <p className="text-white/70 text-m">A structured close so you truly disconnect and recharge.</p>
              </div>
            </div>
            <p className="text-center text-white/60 mt-6 text-m italic">
              Four elements are co-worked. Two are lived independently. Work has a start time. Work has a stop time.
            </p>
          </div>

          {/* Monday Is the On-Ramp */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 text-white">
              <h3 className="text-3xl font-bold">Monday Is the On-Ramp</h3>
              <p className="text-lg text-white/90 leading-relaxed">
                Make Time For More On Monday is your first installation day. Some women experience one Monday and feel the shift. Some return weekly, on Mondays, to strengthen the rhythm.
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
                We've paved the lane. Now you are invited to merge into it.
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
              Make Time For More On Monday<sup className="text-lg">™</sup>
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Step into the structure that replaces survival with sustainability.
            </p>
            <div className="flex flex-col items-center gap-4">
              <a
                href="https://www.maketimeformore.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="bg-white text-[#729A74] hover:bg-gray-50 text-lg px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold">
                  <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl font-bold">Merge Into The Parallel Lane $497</span>
                  </div>
                </Button>
              </a>
              <p className="text-white/70 text-m italic">Limited spots available for the founding pilot cohort.</p>
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
