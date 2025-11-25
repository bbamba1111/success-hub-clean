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
                  You didn't leave your high-stres
