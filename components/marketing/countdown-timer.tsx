"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { getNextSundayShift, getSundayOrdinal, getRotatingMessage, getMonthName } from "@/lib/utils/getNextSundayShift"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface Petal {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  speed: number
  drift: number
  opacity: number
  type: number
}

const petalColors = ["#FBCFE8", "#F472B6", "#E26C73", "#F9A8D4"]

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  const [petals, setPetals] = useState<Petal[]>([])
  const [animationActive, setAnimationActive] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const petalIdRef = useRef(0)

  const createPetal = useCallback((): Petal => {
    const containerWidth = containerRef.current?.offsetWidth || 800
    return {
      id: petalIdRef.current++,
      x: Math.random() * containerWidth,
      y: -20,
      size: 15 + Math.random() * 15,
      rotation: Math.random() * 360,
      speed: 1.5 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 2,
      opacity: 0.7 + Math.random() * 0.3,
      type: Math.floor(Math.random() * petalColors.length),
    }
  }, [])

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

  // Petal animation
  useEffect(() => {
    if (!animationActive || !mounted) return

    // Initialize petals
    const initialPetals = Array.from({ length: 12 }, createPetal)
    setPetals(initialPetals)

    const animationFrame = () => {
      setPetals(prevPetals => {
        const containerHeight = containerRef.current?.offsetHeight || 600
        const containerWidth = containerRef.current?.offsetWidth || 800

        return prevPetals.map(petal => {
          const newY = petal.y + petal.speed
          const newX = petal.x + petal.drift
          const newRotation = petal.rotation + 2

          if (newY > containerHeight + 20) {
            return {
              ...petal,
              id: petalIdRef.current++,
              x: Math.random() * containerWidth,
              y: -20,
              rotation: Math.random() * 360,
            }
          }

          return {
            ...petal,
            y: newY,
            x: newX,
            rotation: newRotation,
          }
        })
      })
    }

    const interval = setInterval(animationFrame, 50)
    return () => clearInterval(interval)
  }, [animationActive, mounted, createPetal])

  if (!mounted || !targetDate) {
    return (
      <div className="bg-gradient-to-r from-[#E26C73] to-[#5D9D61] rounded-2xl p-10 shadow-xl">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="h-10 bg-white/30 rounded w-3/4"></div>
          <div className="flex gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 w-24 bg-white/30 rounded-xl"></div>
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
    <div className="relative">
      {/* Cherry Blossom Image with Petals */}
      <div 
        ref={containerRef}
        className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-t-2xl"
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Mar%2027%2C%202025%2C%2001_52_43%20AM-YXHlRDw4ynWk2MHKKfV1Flm3qZbI1k.png"
          alt="Women enjoying tea under cherry blossoms"
          className="w-full h-full object-cover"
        />
        
        {/* Falling Petals */}
        {animationActive && petals.map((petal) => (
          <div
            key={petal.id}
            className="absolute pointer-events-none"
            style={{
              left: petal.x,
              top: petal.y,
              width: petal.size,
              height: petal.size,
              opacity: petal.opacity,
              transform: `rotate(${petal.rotation}deg)`,
              transition: 'transform 0.05s linear',
            }}
          >
            <svg viewBox="0 0 20 20" className="w-full h-full">
              <path
                d="M10,0C10,0,15,5,15,10S10,20,10,20S5,15,5,10S10,0,10,0z"
                fill={petalColors[petal.type]}
              />
            </svg>
          </div>
        ))}

        {/* Stop Petals Button */}
        <button
          onClick={() => setAnimationActive(false)}
          className={`absolute bottom-5 right-5 bg-white/70 border border-[#D07F84] text-[#D07F84] px-5 py-2 rounded-full text-base font-poppins hover:bg-[#D07F84] hover:text-white transition-colors ${!animationActive ? 'hidden' : ''}`}
        >
          Stop Petals
        </button>
      </div>

      {/* Countdown Timer */}
      <div className="bg-gradient-to-r from-[#E26C73] to-[#5D9D61] text-white p-10 rounded-b-2xl shadow-xl">
        <h3 className="text-2xl md:text-4xl font-playfair font-bold text-center mb-8">
          Counting Down to <span className="italic">The {ordinal} Week</span> of Work-Life Balance in {month}
        </h3>
        
        <div className="flex justify-center gap-6 md:gap-12 mb-8">
          <TimeBlock value={timeLeft.days} label="Days" />
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <TimeBlock value={timeLeft.minutes} label="Mins" />
          <TimeBlock value={timeLeft.seconds} label="Secs" />
        </div>

        <p className="text-xl md:text-2xl font-poppins text-center text-white/90 max-w-3xl mx-auto leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl md:text-6xl font-playfair font-bold leading-none">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-lg md:text-xl font-poppins font-medium mt-2 uppercase tracking-wide">{label}</span>
    </div>
  )
}
