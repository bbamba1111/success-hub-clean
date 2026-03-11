"use client"

import { useEffect, useState } from "react"
import { getNextSundayShift, getSundayOrdinal, getRotatingMessage, getMonthName } from "@/lib/utils/getNextSundayShift"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const target = getNextSundayShift()
    setTargetDate(target)

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = target.getTime() - now.getTime()

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

  if (!mounted || !targetDate) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#F8C8C8]/30">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-6 bg-[#F8C8C8]/30 rounded w-3/4"></div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 bg-[#F8C8C8]/30 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const ordinal = getSundayOrdinal(targetDate)
  const month = getMonthName(targetDate)
  const sundayNumber = parseInt(ordinal)
  const message = getRotatingMessage(sundayNumber || 1)

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#F8C8C8]/30">
      <p className="text-sm font-medium tracking-widest text-[#E26C73] uppercase mb-2 text-center">
        Counting Down to
      </p>
      <h3 className="text-xl md:text-2xl font-semibold text-[#2F4F4F] text-center mb-2">
        The {ordinal} Week of Work-Life Balance in {month}
      </h3>
      <p className="text-[#7FB069] text-center italic mb-6">{message}</p>

      <div className="flex justify-center gap-3 md:gap-6">
        <TimeBlock value={timeLeft.days} label="Days" />
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <TimeBlock value={timeLeft.minutes} label="Minutes" />
        <TimeBlock value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F8C8C8]/20 rounded-xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-md border border-[#F8C8C8]/30">
        <span className="text-2xl md:text-3xl font-bold text-[#2F4F4F]">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs md:text-sm text-[#6B7280] mt-2 font-medium">{label}</span>
    </div>
  )
}
