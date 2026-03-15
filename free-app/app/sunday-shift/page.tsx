"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, CheckCircle, Download } from "lucide-react"

// Countdown Timer Component
function CountdownTimer() {
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [weekLabel, setWeekLabel] = useState("Loading...")
  const [currentMonth, setCurrentMonth] = useState("Loading...")
  const [countdownMessage, setCountdownMessage] = useState("Loading countdown message...")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const updateCountdown = () => {
      const now = new Date()
      const nextSunday = new Date(now)
      nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7))

      let sundayCount = 0
      const tempDate = new Date(nextSunday.getFullYear(), nextSunday.getMonth(), 1)
      while (tempDate <= nextSunday) {
        if (tempDate.getDay() === 0) sundayCount++
        tempDate.setDate(tempDate.getDate() + 1)
      }

      let targetSunday = new Date(nextSunday)
      if (sundayCount >= 4) {
        targetSunday = new Date(nextSunday.getFullYear(), nextSunday.getMonth() + 1, 1)
        while (targetSunday.getDay() !== 0) {
          targetSunday.setDate(targetSunday.getDate() + 1)
        }
      }

      targetSunday.setHours(13, 0, 0, 0)

      if (targetSunday <= now && now.getDay() === 0 && now.getHours() >= 13) {
        targetSunday.setDate(targetSunday.getDate() + 7)
      }

      const diff = targetSunday.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })

      let sundayNumber = 0
      const tempDate3 = new Date(targetSunday.getFullYear(), targetSunday.getMonth(), 1)
      while (tempDate3 <= targetSunday) {
        if (tempDate3.getDay() === 0) sundayNumber++
        tempDate3.setDate(tempDate3.getDate() + 1)
      }

      const monthName = targetSunday.toLocaleString('default', { month: 'long' })
      setCurrentMonth(monthName)

      let label = ''
      let message = ''

      if (sundayNumber === 1) {
        label = 'The 1st Week'
        message = 'Disrupt the grind. Reclaim your rhythm.'
      } else if (sundayNumber === 2) {
        label = 'The 2nd Week'
        message = 'No more survival Mondays. Lead from alignment.'
      } else if (sundayNumber === 3) {
        label = 'The 3rd Week'
        message = 'Hustle ends here. Harmony begins now.'
      }

      setWeekLabel(label)
      setCountdownMessage(message)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [mounted])

  if (!mounted) {
    return <div className="h-[120px] bg-gray-200 animate-pulse rounded-lg" />
  }

  return (
    <div className="bg-gradient-to-r from-[#E26C73] to-[#5D9D61] rounded-2xl p-6 text-white shadow-lg">
      <div className="text-lg font-bold text-center mb-4">
        Counting Down to <span>{weekLabel}</span> in <span>{currentMonth}</span>
      </div>
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
          <div className="text-xs uppercase">Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-xs uppercase">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs uppercase">Mins</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs uppercase">Secs</div>
        </div>
      </div>
      <div className="text-center text-sm mt-4">{countdownMessage}</div>
    </div>
  )
}

export default function SundayShiftPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Header Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10" />
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#7FB069] to-[#E26C73] bg-clip-text text-transparent mb-4">
              Make The Sunday Shift<sup className="text-xl">™</sup>
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              Adopt The Work-Life Balance Business Model & SOP™ -- the "Sustainable" Operating Procedure
            </p>
          </div>

          <div className="text-center mb-12">
            <CountdownTimer />
          </div>

          <div className="flex justify-center">
            <div className="space-y-4 flex flex-col max-w-4xl w-full bg-white/80 rounded-2xl shadow-xl p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-700 bg-white/80 p-3 rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-[#7FB069] flex-shrink-0" />
                  <span className="font-semibold text-lg">Join Us Live: Sunday @ 1:00-2:00 PM ET</span>
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
            <h2 className="text-3xl font-bold text-[#7FB069] mb-4">
              Complete Onboarding: Your First 3-Steps to Balance, Freedom & Success
            </h2>
          </div>

          <div className="text-center mb-8">
            <p className="text-lg text-gray-600">
              Complete these three essential steps to prepare for your transformation journey
            </p>
          </div>

          {/* Three Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Step 1 - Audit Card */}
            <Card className="bg-[#7FB069] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">Step 1</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">Take The Work-Life Balance Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Discover exactly where you stand across 15 key life areas with our comprehensive assessment.
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
                </div>
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
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">Step 2</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Set Your 28-Day Desired Work-LifeStyle Intention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Transform your audit insights into powerful, actionable intentions.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <span className="text-white/90 text-sm">Select 1-3 focus areas for maximum impact</span>
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
                </div>
              </CardContent>
            </Card>

            {/* Step 3 - Preparation Checklist Card */}
            <Card className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] border-0 text-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm">Step 3</Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  Prepare For The Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  Get ready for your transformation with our comprehensive preparation checklist.
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

      {/* Footer */}
      <footer className="bg-[#2F4F4F] text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-lg font-bold mb-4">The Sunday Shift<sup className="text-sm">™</sup></p>
          <p className="text-white/70 text-sm">
            A free weekly experience by Make Time For More
          </p>
          <p className="text-white/50 text-sm mt-4">
            © {new Date().getFullYear()} Make Time For More™. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
