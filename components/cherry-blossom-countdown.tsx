"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function CherryBlossomCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const currentDay = now.getDay()
      const currentHour = now.getHours()
      
      // Calculate next Sunday at 1 PM ET
      let daysUntilSunday = (7 - currentDay) % 7
      
      // If it's Sunday but after 2 PM ET, count to next Sunday
      if (currentDay === 0 && currentHour >= 14) {
        daysUntilSunday = 7
      }
      
      const nextSunday = new Date(now)
      nextSunday.setDate(now.getDate() + daysUntilSunday)
      nextSunday.setHours(13, 0, 0, 0) // 1 PM
      
      const difference = nextSunday.getTime() - now.getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="bg-white/80 border-2 border-[#7FB069]/30 shadow-lg">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-[#7FB069] mb-2">Next Sunday Shift Starts In:</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#E26C73]">{timeLeft.days}</div>
            <div className="text-sm text-gray-600 font-medium">Days</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#E26C73]">{timeLeft.hours}</div>
            <div className="text-sm text-gray-600 font-medium">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#E26C73]">{timeLeft.minutes}</div>
            <div className="text-sm text-gray-600 font-medium">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#E26C73]">{timeLeft.seconds}</div>
            <div className="text-sm text-gray-600 font-medium">Seconds</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}