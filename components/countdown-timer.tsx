"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate?: Date
  onComplete?: () => void
}

export default function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    if (!targetDate) return

    const calculateTimeRemaining = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference <= 0) {
        onComplete?.()
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    setTimeRemaining(calculateTimeRemaining())

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (!targetDate) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
        <h3 className="text-base font-semibold text-center text-gray-900 mb-3">Loading countdown...</h3>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
      <h3 className="text-base font-semibold text-center text-gray-900 mb-3">Next Sunday Shift Starts In:</h3>
      <div className="grid grid-cols-4 gap-3">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] text-white rounded-lg p-2.5 w-full text-center shadow-md">
            <div className="text-xl font-bold">{timeRemaining.days}</div>
            <div className="text-xs uppercase tracking-wide">Days</div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] text-white rounded-lg p-2.5 w-full text-center shadow-md">
            <div className="text-xl font-bold">{timeRemaining.hours}</div>
            <div className="text-xs uppercase tracking-wide">Hours</div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] text-white rounded-lg p-2.5 w-full text-center shadow-md">
            <div className="text-xl font-bold">{timeRemaining.minutes}</div>
            <div className="text-xs uppercase tracking-wide">Mins</div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-[#7FB069] to-[#E26C73] text-white rounded-lg p-2.5 w-full text-center shadow-md">
            <div className="text-xl font-bold">{timeRemaining.seconds}</div>
            <div className="text-xs uppercase tracking-wide">Secs</div>
          </div>
        </div>
      </div>
    </div>
  )
}
