"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Sparkles, Heart, Brain, Zap, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import Link from "next/link"

export default function StartWithMondaysPage() {
  const [countdown, setCountdown] = useState({ days: 12, hours: 12, minutes: 30, seconds: 33 })

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F5F1E8]">
      {/* Hero Section */}
      <div style={{ backgroundColor: "#FDE8E8" }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-[#E26C73] text-white mb-6 text-sm px-4 py-2">
            Founding Member Offer • 80% Off • Ends Dec 31, 2025
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Make Time For More Monthly™
          </h1>

          <p className="text-2xl md:text-3xl text-[#E26C73] font-semibold mb-4">Start With Mondays</p>

          <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
            Your First Step to Experiencing a Life-First Business Rooted in Work-Life Balance, Time Freedom &
            Sustainable Success.
          </p>

          {/* Countdown Timer */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-4 font-semibold">
              Counting Down to The 1st Week of Work-Life Balance in December
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Mins", value: countdown.minutes },
                { label: "Secs", value: countdown.seconds },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-lg p-4 shadow-md min-w-[80px]">
                  <div className="text-3xl font-bold text-[#E26C73]">{item.value}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-8 italic">
            The 7-Day Work-Life Balance Reset Experience where You Reset Your Rhythms and Reclaim Your Time In One
            Powerful Week This Month!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white text-xl px-8 py-6 font-bold"
            >
              Plug In — $297/mo
            </Button>
          </div>
        </div>
      </div>

      {/* Who This Is For - Sage Green Background */}
      <div style={{ backgroundColor: "#E8F3E8" }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Who This Is For</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Coaches and consultants who left their 9-to-5 for freedom—and you're ready to actually live it",
              "Leaders who want balance, time-freedom and sustainable business success",
              "High-achievers done with burnout, ready for a life-first business model",
              "Growth-stage entrepreneurs choosing sustainable over sacrificial",
            ].map((item, i) => (
              <Card key={i} className="bg-white border-2 border-[#7FB069]/30">
                <CardContent className="p-6 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#7FB069] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg leading-relaxed">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Barbara Introduction - White Background */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/images/logo.png" alt="Thought Leader Barbara" className="rounded-2xl shadow-2xl w-full" />
            </div>
            <div>
              <Badge className="bg-[#E26C73] text-white mb-4">Work-Life Balance Mentor</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Hi, I'm Thought Leader Barbara</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Work-Life Balance Mentor • Co-Working Guide • Accountability Partner
              </p>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                I'm here to help you reconnect to your original entrepreneurial intentions and prioritize what matters
                most to you — because I know…
              </p>
              <div className="bg-[#FDE8E8] border-l-4 border-[#E26C73] p-6 rounded-lg mb-6">
                <p className="text-lg text-gray-800 font-semibold leading-relaxed">
                  You didn't leave your high-stress role to recreate burnout in your business —
                </p>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                You left for work-life balance, time-freedom and success on your terms. But, somewhere along the way,
                those unhealthy hustle habits crept in —
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* But It's Not Your Fault - Pink Background */}
      <div style={{ backgroundColor: "#FDE8E8" }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">But, It's Not Your Fault...</h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <p className="text-2xl font-bold text-[#E26C73] mb-4">The Truth?</p>
            <p className="text-xl text-gray-800 mb-6 leading-relaxed">
              You left the high-stress job — but... you didn't leave hustle culture. You brought it with you.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              You inherited a broken blueprint — one built for corporate survival, not entrepreneurial fulfillment. A
              model that rewards exhaustion, glorifies over-effort, and quietly demands that you sacrifice everything
              that makes life worth living.
            </p>
          </div>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            And those ingrained hustle habits? They're still running the show — keeping you from the peace, presence,
            and prosperity you started your business for.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Because — like so many visionary founders — you were never taught how to structure your business in a way
            that honors your time, energy, and values.
          </p>
        </div>
      </div>

      {/* Until Now - Sage Green Background */}
      <div style={{ backgroundColor: "#E8F3E8" }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Until Now…</h2>
          <h3 className="text-3xl font-bold text-center text-[#7FB069] mb-12">
            Tap Into The Spiritual, Scientific & AI Side of Life & Business Success
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Spiritual */}
            <Card className="bg-white border-2 border-[#E26C73]/30">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E26C73] to-pink-400 flex items-center justify-center mb-6 mx-auto">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">The Spiritual Side</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Everything you desire — already exists in energetic form. You just have to learn how to build inside
                  it.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You begin by "ASKING" aka planting your spiritual seed: your 28-Day Desired Work-Lifestyle Intention —
                  inspired by Matthew 7:7: "Ask, and it shall be GIVEN to you."
                </p>
                <div className="bg-[#FDE8E8] rounded-lg p-4 mt-4">
                  <p className="font-bold text-[#E26C73] mb-2">The GIVEN Framework:</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong>G</strong> = Gratitude
                    <br />
                    <strong>I</strong> = Invitation & Intention
                    <br />
                    <strong>V</strong> = Vision & Visualization
                    <br />
                    <strong>E</strong> = Emotional Embodiment
                    <br />
                    <strong>N</strong> = Nurture
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Scientific */}
            <Card className="bg-white border-2 border-[#7FB069]/30">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7FB069] to-green-400 flex items-center justify-center mb-6 mx-auto">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">The Scientific Side</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  While the spiritual work activates your higher energy, the science makes your transformation tangible.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Through neuroscience, habit science, hormonal regulation, and quantum alignment, you'll rewire the
                  physiological patterns that fuel stress, scarcity, and survival.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Each practice is designed to regulate your nervous system, retrain your Reticular Activating System
                  (RAS) for focus and flow, and balance your hormones for sustainable energy and clarity.
                </p>
              </CardContent>
            </Card>

            {/* AI */}
            <Card className="bg-white border-2 border-purple-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center mb-6 mx-auto">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">The AI Side</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In the Age of AI, your Human Zone of Genius is your greatest competitive advantage — not competing
                  with AI, but leading it.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your 15 AI Executives handle the 80% (operations, content, admin) so you can focus on your 8
                  Human-Only Skills that generate 80% of results.
                </p>
                <p className="text-gray-700 leading-relaxed font-semibold text-[#7FB069]">
                  This is how AI gives you time-freedom: by serving your vision while you lead from your Zone of Genius.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 6 Hustle Habits We Replace - White Background */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            The Six Ingrained Hustle Habits We Replace
          </h2>
          <p className="text-xl text-center text-gray-700 mb-12">Every Monday you practice the cure.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { old: "Waking up reactive", new: "Morning GIV•EN™ Routine", icon: "☀️" },
              { old: "Sitting all day on caffeine", new: "30-min movement window", icon: "💪" },
              { old: "Skipping lunch", new: "Extended Healthy Hybrid Lunch", icon: "🥗" },
              { old: "Working endlessly", new: "4-hour Focused CEO Workday (stop at 5 PM)", icon: "⏰" },
              { old: "Delaying joy", new: "Quality of Lifestyle Experiences", icon: "✨" },
              { old: "Pushing through exhaustion", new: "Power Down & Unplug", icon: "🌙" },
            ].map((habit, i) => (
              <Card
                key={i}
                className={`border-2 ${i % 2 === 0 ? "bg-[#FDE8E8] border-[#E26C73]/30" : "bg-[#E8F3E8] border-[#7FB069]/30"}`}
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-4 text-center">{habit.icon}</div>
                  <div className="text-center mb-3">
                    <p className="text-red-600 line-through text-sm mb-2">{habit.old}</p>
                    <ArrowRight className="w-5 h-5 mx-auto text-gray-400 mb-2" />
                    <p className="text-[#7FB069] font-bold text-lg">{habit.new}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Human Zone of Genius - Pink Background */}
      <div style={{ backgroundColor: "#FDE8E8" }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Your Human Zone of Genius in the Age of AI
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-purple-700 mb-4">You (Human CEO) - The 20%</h3>
                <p className="text-lg font-semibold text-gray-800 mb-4">Your 8 Human-Only Business Skills:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Authentic relationships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Visionary leadership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>High-value sales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Thought leadership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Coaching delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Intuitive problem-solving</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Ethical decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Personal storytelling</span>
                  </li>
                </ul>
                <p className="text-lg font-bold text-purple-700 mt-6">This is where you create 80% of results.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-green-700 mb-4">AI Executive Team - The 80%</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Your 15 AI Executives serve you by handling: administrative tasks, content drafts, research,
                  scheduling, inquiries, bookkeeping, transcription, proposals, social media, and operational execution.
                </p>
                <p className="text-lg font-bold text-green-700 mb-4">
                  They educate you on daily business progress and guide your next moves.
                </p>
                <div className="bg-white rounded-lg p-6 mt-6">
                  <p className="font-bold text-gray-900 mb-3">Result: Time-Freedom</p>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      <span>Work 4 hours instead of 12</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span>152 hours of weekly time freedom</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span>Focus on what you do best</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/human-zone-of-genius">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4"
              >
                <Brain className="mr-2 h-5 w-5" />
                Discover Your Human Zone of Genius
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Problems We Solve - Sage Green */}
      <div style={{ backgroundColor: "#E8F3E8" }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">The 4 Problems We Solve</h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Working non-stop",
                desc: '60–80 hour weeks, always "on," never unplugging. Freedom vanished.',
              },
              {
                title: "No work-life balance or time freedom",
                desc: "Health suffers. Relationships strain. Joy gets postponed.",
              },
              {
                title: "Trying to outwork AI",
                desc: 'Working harder to "stay ahead" leads to exhaustion—not leverage.',
              },
              {
                title: "High failure rate in the Age of AI",
                desc: "Entrepreneurship is the new normal—but most burn out, give up, or get displaced.",
              },
            ].map((problem, i) => (
              <Card key={i} className="bg-white border-2 border-red-200">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold text-red-600 mb-3">{problem.title}</h4>
                  <p className="text-gray-700">{problem.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-2xl font-bold text-[#7FB069] mb-4">What if you didn't have to hustle to win?</p>
            <p className="text-xl text-gray-700">What if you could harmonize work and life?</p>
          </div>
        </div>
      </div>

      {/* CTA Section - Coral Background */}
      <div style={{ backgroundColor: "#E26C73" }} className="py-16 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Work-Life Balance Journey?</h2>
          <p className="text-xl mb-4 opacity-90">Open Enrollment: Join Anytime</p>
          <p className="text-2xl font-bold mb-8">Founding Member Offer: $297/month</p>
          <p className="text-lg mb-8 opacity-90">(Original Value $1,500 — 80% Off Through Dec 31, 2025)</p>

          <Button size="lg" className="bg-white text-[#E26C73] hover:bg-gray-100 text-xl px-12 py-6 font-bold">
            Enroll Now — Plug In $297/Month
          </Button>

          <p className="text-sm mt-6 opacity-75">No Contracts • Billing Every 30 Days</p>
        </div>
      </div>

      {/* Back to Home */}
      <div className="bg-white py-8 text-center">
        <Link href="/">
          <Button variant="outline" className="text-gray-600 hover:text-gray-800 bg-transparent">
            ← Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
