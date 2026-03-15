"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

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

      if (targetSunday <= now) {
        if (now.getDay() === 0 && now.getHours() >= 13) {
          targetSunday.setDate(targetSunday.getDate() + 7)
        }
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
    return <div className="h-[200px] bg-gray-200 animate-pulse rounded-lg" />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-8 rounded-lg bg-gradient-to-r from-[#E26C73] to-[#5D9D61] text-white shadow-lg">
        <div className="text-xl md:text-2xl font-bold text-center mb-6">
          Counting Down to <span>{weekLabel}</span> of Work-Life Balance in <span>{currentMonth}</span>
        </div>
        <div className="flex justify-center gap-8 md:gap-12 mb-6">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
            <div className="text-sm uppercase">Days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
            <div className="text-sm uppercase">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
            <div className="text-sm uppercase">Mins</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
            <div className="text-sm uppercase">Secs</div>
          </div>
        </div>
        <div className="text-center text-lg">{countdownMessage}</div>
      </div>
    </div>
  )
}

// Email Form Component
function SundayShiftForm() {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push("/garden")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl p-10 shadow-2xl border border-[#F8C8C8]/30">
        <h4 className="text-2xl font-bold text-[#2F4F4F] text-center mb-3">
          Reserve Your Seat
        </h4>
        <p className="text-lg text-[#6B7280] text-center mb-8">
          Join us in the Cherry Blossom Garden
        </p>

        <div className="space-y-5">
          <div>
            <label htmlFor="firstName" className="block text-base font-medium text-[#4A5568] mb-2">
              First Name
            </label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Your first name"
              className="w-full border-[#F8C8C8]/50 focus:border-[#E26C73] rounded-xl py-6 text-lg"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-base font-medium text-[#4A5568] mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border-[#F8C8C8]/50 focus:border-[#E26C73] rounded-xl py-6 text-lg"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E26C73] hover:bg-[#D15A61] text-white py-7 text-xl font-semibold rounded-full shadow-lg"
          >
            {isSubmitting ? "Reserving..." : "Enter the Cherry Blossom Garden"}
          </Button>
        </div>

        <p className="text-base text-[#6B7280] text-center mt-6 italic">
          Free weekly ritual - Sundays - Live inside the Cherry Blossom Garden
        </p>
      </div>
    </form>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#F7E9D6] overflow-hidden">
        <div className="relative z-20 max-w-7xl mx-auto px-6 pt-20 pb-12">
          <div className="flex flex-col items-center text-center">
            <p className="text-lg font-medium tracking-widest text-[#E26C73] uppercase mb-6">
              Welcome to
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-[#2F4F4F] mb-8 tracking-tight">
              The Sunday Shift<sup className="text-2xl">™</sup>
            </h1>
            <p className="text-xl md:text-2xl text-[#4A5568] max-w-4xl mb-12 leading-relaxed">
              A free weekly reset where women entrepreneurs design the week before it begins. Your first step to merging into Harmony.
            </p>
            <div className="w-full max-w-5xl mx-auto mb-12">
              <CountdownTimer />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-28 bg-gradient-to-br from-white via-[#FDF8F5] to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#2F4F4F] mb-10 leading-tight">
            You didn't leave the workforce just to recreate burnout in your business.
          </h2>
          <div className="space-y-8 text-xl text-[#4A5568] leading-relaxed">
            <p>You left for balance, freedom, and success on your terms.</p>
            <p>But the hustle habits followed you into entrepreneurship.</p>
            <p>Now work is bleeding into your body, your evenings, your relationships, and your peace.</p>
            <p className="text-[#7FB069] font-medium text-2xl">Not because you lack discipline.</p>
            <p className="text-[#E26C73] font-semibold text-2xl pt-4">
              Because the only visible business model most women were shown was hustle.
            </p>
          </div>
        </div>
      </section>

      {/* Sunday Shift Section */}
      <section id="sunday-shift" className="py-28 bg-gradient-to-br from-[#FDF8F5] via-white to-[#F0F7F4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-lg font-semibold tracking-widest text-[#7FB069] uppercase mb-4">
              Your First Step
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F4F4F] mb-6">
              Make The Sunday Shift<sup className="text-xl">™</sup>
            </h2>
            <p className="text-2xl text-[#E26C73] font-medium mb-4">
              Your first step to safely merge into Harmony.
            </p>
            <p className="text-xl text-[#4A5568] max-w-2xl mx-auto leading-relaxed">
              A free weekly reset where women entrepreneurs design the week before it begins.
            </p>
          </div>

          {/* Three Step Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Card 1 */}
            <div className="bg-[#7FB069] rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#5A8A4A] text-white text-sm font-medium px-4 py-1 rounded-full">
                  Step 1
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Take The Work-Life Balance Audit</h3>
              <p className="text-xl text-white/95 leading-relaxed">
                Discover exactly where you stand across 15 key life areas with our comprehensive assessment.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#E26C73] rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#C25A60] text-white text-sm font-medium px-4 py-1 rounded-full">
                  Step 2
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Set Your Desired Work-LifeStyle Intention</h3>
              <p className="text-xl text-white/95 leading-relaxed">
                Transform your audit insights into powerful, actionable intentions for your 28-day transformation plan.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-[#7FB069] via-[#A08060] to-[#E26C73] rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-white/30 text-white text-sm font-medium px-4 py-1 rounded-full">
                  Step 3
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Prepare For Your Experience</h3>
              <p className="text-xl text-white/95 leading-relaxed">
                Get ready for your transformation with our comprehensive preparation checklist.
              </p>
            </div>
          </div>

          {/* Email Form */}
          <SundayShiftForm />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#2F4F4F] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Work-Life Balance?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Start with our free Work-Life Balance Audit to discover your current state across 15 key areas.
          </p>
          <Link href="/audit">
            <Button size="lg" className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-10 py-7 text-xl font-semibold rounded-full">
              Take The Free Audit Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2F4F4F] text-white py-12 border-t border-white/10">
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
    </main>
  )
}
