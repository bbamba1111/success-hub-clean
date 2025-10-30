"use client"

import { useEffect, useRef, useState } from "react"

export default function CherryBlossomCountdown() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationActive, setAnimationActive] = useState(true)
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  })
  const [weekInfo, setWeekInfo] = useState({
    weekLabel: "Loading...",
    currentMonth: "Loading...",
    message: "Loading countdown message...",
  })

  // SVG petals as data URLs
  const petalImages = [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10,0C10,0,15,5,15,10S10,20,10,20S5,15,5,10S10,0,10,0z' fill='%23FBCFE8'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10,0C15,5,15,15,10,20C5,15,5,5,10,0z' fill='%23F472B6'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10,0C10,0,15,5,15,10S10,20,10,20S5,15,5,10S10,0,10,0z' fill='%23E26C73'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10,0C12,5,15,7,10,15C5,7,8,5,10,0z' fill='%23F9A8D4'/%3E%3C/svg%3E",
  ]

  // Create and animate petals
  const createPetal = () => {
    if (!animationActive || !containerRef.current) return

    const container = containerRef.current
    const petal = document.createElement("div")
    petal.className = "absolute pointer-events-none z-10 opacity-80"

    // Random properties
    const size = 15 + Math.random() * 15
    const startX = Math.random() * container.offsetWidth
    const rotation = Math.random() * 360
    const duration = 4 + Math.random() * 4
    const petalImage = petalImages[Math.floor(Math.random() * petalImages.length)]

    // Apply styles
    petal.style.width = `${size}px`
    petal.style.height = `${size}px`
    petal.style.backgroundImage = `url("${petalImage}")`
    petal.style.backgroundSize = "contain"
    petal.style.backgroundRepeat = "no-repeat"
    petal.style.left = `${startX}px`
    petal.style.top = "-20px"
    petal.style.transform = `rotate(${rotation}deg)`

    container.appendChild(petal)

    // Animate with JavaScript
    let startTime: number | null = null
    const endY = container.offsetHeight + 20
    const endX = startX + (Math.random() * 100 - 50)
    const endRotation = rotation + 360

    const animatePetal = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      const currentY = progress * endY
      const currentX = startX + progress * (endX - startX)
      const currentRotation = rotation + progress * (endRotation - rotation)

      petal.style.top = `${currentY}px`
      petal.style.left = `${currentX}px`
      petal.style.transform = `rotate(${currentRotation}deg)`

      if (progress < 1 && animationActive) {
        requestAnimationFrame(animatePetal)
      } else {
        if (container.contains(petal)) {
          container.removeChild(petal)
        }

        if (animationActive) {
          setTimeout(createPetal, Math.random() * 500)
        }
      }
    }

    requestAnimationFrame(animatePetal)
  }

  // Update countdown timer
  const updateCountdown = () => {
    const now = new Date()

    // Get next Sunday
    const nextSunday = new Date(now)
    nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7))

    // Determine which Sunday of the month it is
    let sundayCount = 0
    const tempDate = new Date(nextSunday.getFullYear(), nextSunday.getMonth(), 1)
    while (tempDate <= nextSunday) {
      if (tempDate.getDay() === 0) {
        sundayCount++
      }
      tempDate.setDate(tempDate.getDate() + 1)
    }

    // If it's the 4th or 5th Sunday, move to the 1st Sunday of next month
    let targetSunday = nextSunday
    if (sundayCount >= 4) {
      targetSunday = new Date(nextSunday.getFullYear(), nextSunday.getMonth() + 1, 1)
      while (targetSunday.getDay() !== 0) {
        targetSunday.setDate(targetSunday.getDate() + 1)
      }
    }

    // Set time to 1:00 PM EST
    targetSunday.setHours(13, 0, 0, 0)

    // If the target is in the past, move to next valid Sunday
    if (targetSunday <= now) {
      if (now.getDay() === 0 && now.getHours() >= 13) {
        targetSunday.setDate(targetSunday.getDate() + 7)

        let newSundayCount = 0
        const tempDate = new Date(targetSunday.getFullYear(), targetSunday.getMonth(), 1)
        while (tempDate <= targetSunday) {
          if (tempDate.getDay() === 0) {
            newSundayCount++
          }
          tempDate.setDate(tempDate.getDate() + 1)
        }

        if (newSundayCount >= 4) {
          targetSunday = new Date(targetSunday.getFullYear(), targetSunday.getMonth() + 1, 1)
          while (targetSunday.getDay() !== 0) {
            targetSunday.setDate(targetSunday.getDate() + 1)
          }
          targetSunday.setHours(13, 0, 0, 0)
        }
      }
    }

    // Calculate time difference
    const diff = targetSunday.getTime() - now.getTime()

    // Convert to days, hours, minutes, seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setCountdown({
      days: days.toString().padStart(2, "0"),
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    })

    // Determine which Sunday it is
    let sundayNumber = 0
    const tempDate2 = new Date(targetSunday.getFullYear(), targetSunday.getMonth(), 1)
    while (tempDate2 <= targetSunday) {
      if (tempDate2.getDay() === 0) {
        sundayNumber++
      }
      tempDate2.setDate(tempDate2.getDate() + 1)
    }

    const monthName = targetSunday.toLocaleString("default", { month: "long" })

    let weekLabel = ""
    let message = ""

    if (sundayNumber === 1) {
      weekLabel = "The 1st Week"
      message =
        "The 7-Day Work-Life Balance Reset Experience where You Reset Your Rhythms and Reclaim Your Time In One Powerful Week This Month!"
    } else if (sundayNumber === 2) {
      weekLabel = "The 2nd Week"
      message =
        "Our 14-Day Momentum Building Week -- Perfect if you're ready to start building real momentum toward your desired work-lifestyle!"
    } else if (sundayNumber === 3) {
      weekLabel = "The 3rd Week"
      message =
        "Our 21-Day Habit Building week followed by our 1-Week Recovery Break -- Perfect if you are truly ready to disrupt hustle culture, and reset your work-life balance habits for sustainable success."
    }

    setWeekInfo({
      weekLabel,
      currentMonth: monthName,
      message,
    })
  }

  const stopPetals = () => {
    setAnimationActive(false)
    if (containerRef.current) {
      const petals = containerRef.current.querySelectorAll(".absolute.pointer-events-none")
      petals.forEach((petal) => {
        if (containerRef.current?.contains(petal)) {
          containerRef.current.removeChild(petal)
        }
      })
    }
  }

  useEffect(() => {
    // Start petals animation
    if (animationActive) {
      for (let i = 0; i < 15; i++) {
        setTimeout(createPetal, i * 200)
      }
    }

    // Update countdown immediately and then every second
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => {
      clearInterval(interval)
      setAnimationActive(false)
    }
  }, [animationActive])

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Cherry Blossom Image Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden mb-5 rounded-2xl shadow-2xl"
      >
        <img
          src="/images/design-mode/1akick.png"
          alt="Women enjoying tea under cherry blossoms"
          className="w-full h-full object-cover"
        />
        {animationActive && (
          <button
            onClick={stopPetals}
            className="absolute bottom-5 right-5 bg-white/70 border border-[#E26C73] text-[#E26C73] px-4 py-2 rounded-full text-sm cursor-pointer z-20 hover:bg-[#E26C73] hover:text-white transition-colors"
          >
            Stop Petals
          </button>
        )}
      </div>

      {/* Countdown Timer Container */}
      <div className="w-full p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#E26C73] to-[#5D9D61] text-white shadow-lg relative overflow-hidden">
        <div className="text-2xl md:text-3xl font-bold text-center mb-6">
          Counting Down to <span className="text-white">{weekInfo.weekLabel}</span> of Work-Life Balance in{" "}
          <span className="text-white">{weekInfo.currentMonth}</span>
        </div>

        <div className="flex justify-center gap-6 md:gap-10 mb-6">
          <div className="text-center">
            <div className="text-3xl md:text-5xl font-bold leading-none">{countdown.days}</div>
            <div className="text-sm md:text-base uppercase font-medium mt-1">Days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-5xl font-bold leading-none">{countdown.hours}</div>
            <div className="text-sm md:text-base uppercase font-medium mt-1">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-5xl font-bold leading-none">{countdown.minutes}</div>
            <div className="text-sm md:text-base uppercase font-medium mt-1">Mins</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-5xl font-bold leading-none">{countdown.seconds}</div>
            <div className="text-sm md:text-base uppercase font-medium mt-1">Secs</div>
          </div>
        </div>

        <div className="text-center text-lg md:text-xl leading-relaxed mt-5 max-w-4xl mx-auto">{weekInfo.message}</div>
      </div>
    </div>
  )
}
