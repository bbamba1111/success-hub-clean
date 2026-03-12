"use client"

import { useEffect, useState, useRef } from "react"

export function CountdownTimer() {
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [weekLabel, setWeekLabel] = useState("Loading...")
  const [currentMonth, setCurrentMonth] = useState("Loading...")
  const [countdownMessage, setCountdownMessage] = useState("Loading countdown message...")
  const [animationActive, setAnimationActive] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const petalsRef = useRef<HTMLDivElement[]>([])

  const maxPetals = 15

  const petalImages = [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10,0C10,0,15,5,15,10S10,20,10,20S5,15,5,10S10,0,10,0z' fill='%23FBCFE8'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10,0C15,5,15,15,10,20C5,15,5,5,10,0z' fill='%23F472B6'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10,0C10,0,15,5,15,10S10,20,10,20S5,15,5,10S10,0,10,0z' fill='%23E26C73'/%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M10,0C12,5,15,7,10,15C5,7,8,5,10,0z' fill='%23F9A8D4'/%3E%3C/svg%3E"
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Petal animation
  useEffect(() => {
    if (!mounted || !animationActive || !containerRef.current) return

    const container = containerRef.current

    const createPetal = () => {
      if (!animationActive || !container) return

      const petal = document.createElement('div')
      petal.className = 'petal'
      petal.style.cssText = `
        position: absolute;
        width: 15px;
        height: 15px;
        background-size: contain;
        background-repeat: no-repeat;
        opacity: 0.8;
        pointer-events: none;
        z-index: 10;
      `

      const size = 15 + Math.random() * 15
      const startX = Math.random() * container.offsetWidth
      const rotation = Math.random() * 360
      const duration = 4 + Math.random() * 4
      const petalImage = petalImages[Math.floor(Math.random() * petalImages.length)]

      petal.style.width = `${size}px`
      petal.style.height = `${size}px`
      petal.style.backgroundImage = `url("${petalImage}")`
      petal.style.left = `${startX}px`
      petal.style.top = '-20px'
      petal.style.transform = `rotate(${rotation}deg)`

      container.appendChild(petal)

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

    // Create initial petals
    for (let i = 0; i < maxPetals; i++) {
      setTimeout(createPetal, i * 200)
    }

    return () => {
      const petals = container.querySelectorAll('.petal')
      petals.forEach(petal => petal.remove())
    }
  }, [mounted, animationActive])

  // Countdown timer
  useEffect(() => {
    if (!mounted) return

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
      let targetSunday = new Date(nextSunday)
      if (sundayCount >= 4) {
        targetSunday = new Date(nextSunday.getFullYear(), nextSunday.getMonth() + 1, 1)
        while (targetSunday.getDay() !== 0) {
          targetSunday.setDate(targetSunday.getDate() + 1)
        }
      }

      // Set time to 1:00 PM EST
      targetSunday.setHours(13, 0, 0, 0)

      // If the target is in the past (we're on Sunday after 1pm), move to next valid Sunday
      if (targetSunday <= now) {
        if (now.getDay() === 0 && now.getHours() >= 13) {
          targetSunday.setDate(targetSunday.getDate() + 7)

          // Check if this would be the 4th Sunday
          let newSundayCount = 0
          const tempDate2 = new Date(targetSunday.getFullYear(), targetSunday.getMonth(), 1)
          while (tempDate2 <= targetSunday) {
            if (tempDate2.getDay() === 0) {
              newSundayCount++
            }
            tempDate2.setDate(tempDate2.getDate() + 1)
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

      setTimeLeft({ days, hours, minutes, seconds })

      // Determine which Sunday it is (1st, 2nd, or 3rd)
      let sundayNumber = 0
      const tempDate3 = new Date(targetSunday.getFullYear(), targetSunday.getMonth(), 1)
      while (tempDate3 <= targetSunday) {
        if (tempDate3.getDay() === 0) {
          sundayNumber++
        }
        tempDate3.setDate(tempDate3.getDate() + 1)
      }

      // Set month name
      const monthName = targetSunday.toLocaleString('default', { month: 'long' })
      setCurrentMonth(monthName)

      // Set week label and message
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

  const stopPetals = () => {
    setAnimationActive(false)
    if (containerRef.current) {
      const petals = containerRef.current.querySelectorAll('.petal')
      petals.forEach(petal => petal.remove())
    }
  }

  if (!mounted) {
    return (
      <div className="max-w-[1536px] mx-auto">
        <div className="relative w-full h-[1024px] overflow-hidden mb-5 bg-gray-200 animate-pulse" />
        <div className="p-8 rounded-lg bg-gradient-to-r from-[#E26C73] to-[#5D9D61]" />
      </div>
    )
  }

  return (
    <div className="max-w-[2000px] mx-auto">
      {/* Cherry Blossom Image Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-auto aspect-[1536/1024] overflow-hidden mb-5"
      >
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1akick-P2UP8ICvs4G1iTkVYmy5CEDFsMtTIB.png" 
          alt="Women enjoying tea under cherry blossoms" 
          className="w-full h-full object-cover block"
        />
        <button 
          onClick={stopPetals}
          className={`absolute bottom-5 right-5 bg-white/70 border border-[#D07F84] text-[#D07F84] py-2 px-4 rounded-full text-sm cursor-pointer z-20 hover:bg-[#D07F84] hover:text-white transition-colors ${!animationActive ? 'hidden' : ''}`}
        >
          Stop Petals
        </button>
      </div>

      {/* Countdown Timer Container */}
      <div className="max-w-[1536px] mx-auto p-8 rounded-lg bg-gradient-to-r from-[#E26C73] to-[#5D9D61] text-white shadow-lg relative overflow-hidden">
        <div className="text-3xl md:text-4xl font-bold text-center mb-6">
          Counting Down to <span>{weekLabel}</span> of Work-Life Balance in <span>{currentMonth}</span>
        </div>
        <div className="flex justify-center gap-10 md:gap-12 mb-6">
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold leading-none">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-base md:text-lg uppercase font-medium mt-1">Days</div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold leading-none">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <div className="text-base md:text-lg uppercase font-medium mt-1">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold leading-none">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className="text-base md:text-lg uppercase font-medium mt-1">Mins</div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold leading-none">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-base md:text-lg uppercase font-medium mt-1">Secs</div>
          </div>
        </div>
        <div className="text-center text-xl md:text-2xl leading-relaxed mt-5 max-w-[80%] mx-auto">
          {countdownMessage}
        </div>
      </div>
    </div>
  )
}
