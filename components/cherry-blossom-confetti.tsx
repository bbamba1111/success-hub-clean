"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CherryBlossomConfettiProps {
  duration?: number
  speed?: "fast" | "normal" | "slow"
  density?: "low" | "medium" | "high"
}

export default function CherryBlossomConfetti({
  duration = 8,
  speed = "normal",
  density = "medium",
}: CherryBlossomConfettiProps) {
  const [isActive, setIsActive] = useState(true)
  const [petals, setPetals] = useState<
    { id: number; x: number; delay: number; rotation: number; size: number; type: number }[]
  >([])

  useEffect(() => {
    // Determine number of petals based on density
    // Reduce count on mobile to improve performance
    const isMobile = window.innerWidth < 768
    const basePetalCount = density === "low" ? 10 : density === "medium" ? 20 : 30
    const petalCount = isMobile ? Math.floor(basePetalCount * 0.6) : basePetalCount

    // Generate random petals
    const newPetals = Array.from({ length: petalCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random horizontal position (0-100%)
      delay: Math.random() * (speed === "fast" ? 0.5 : speed === "normal" ? 1 : 1.5), // Random delay for animation start
      rotation: Math.random() * 360, // Random rotation
      size: 10 + Math.random() * 10, // Random size between 10-20px
      type: Math.floor(Math.random() * 3), // 3 different petal types for variety
    }))

    setPetals(newPetals)

    // Set a timeout to stop the animation
    const timer = setTimeout(() => {
      setIsActive(false)
    }, duration * 1000)

    return () => clearTimeout(timer)
  }, [duration, speed, density])

  // Determine animation duration based on speed
  const getAnimationDuration = () => {
    switch (speed) {
      case "fast":
        return 1.5 + Math.random() * 1.5 // 1.5-3 seconds
      case "slow":
        return 4 + Math.random() * 5 // 4-9 seconds
      default:
        return 2.5 + Math.random() * 2.5 // 2.5-5 seconds (normal)
    }
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute top-0"
          style={{ left: `${petal.x}%` }}
          initial={{ y: -20, opacity: 0, rotate: petal.rotation }}
          animate={{
            y: "100vh",
            opacity: [0, 1, 1, 0.5, 0],
            rotate: petal.rotation + 360,
          }}
          transition={{
            duration: getAnimationDuration(),
            delay: petal.delay,
            ease: "easeIn", // Changed from easeInOut to easeIn for faster falling
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {petal.type === 0 && (
              <>
                <path
                  d="M7.5,0C7.5,0,8.75,2.5,8.75,5S7.5,10,7.5,10S6.25,7.5,6.25,5S7.5,0,7.5,0z"
                  fill="#FBCFE8"
                  transform={`rotate(${Math.random() * 90} 7.5 7.5)`}
                />
                <path
                  d="M7.5,0C7.5,0,8.75,2.5,8.75,5S7.5,10,7.5,10S6.25,7.5,6.25,5S7.5,0,7.5,0z"
                  fill="#F9A8D4"
                  transform={`rotate(${90 + Math.random() * 90} 7.5 7.5)`}
                />
                <path
                  d="M7.5,0C7.5,0,8.75,2.5,8.75,5S7.5,10,7.5,10S6.25,7.5,6.25,5S7.5,0,7.5,0z"
                  fill="#F472B6"
                  transform={`rotate(${180 + Math.random() * 90} 7.5 7.5)`}
                />
                <path
                  d="M7.5,0C7.5,0,8.75,2.5,8.75,5S7.5,10,7.5,10S6.25,7.5,6.25,5S7.5,0,7.5,0z"
                  fill="#E26C73"
                  transform={`rotate(${270 + Math.random() * 90} 7.5 7.5)`}
                />
              </>
            )}
            {petal.type === 1 && (
              <path
                d="M7.5,0 C10,3 10,7 7.5,10 C5,7 5,3 7.5,0z"
                fill="#FBCFE8"
                transform={`rotate(${Math.random() * 360} 7.5 7.5)`}
              />
            )}
            {petal.type === 2 && (
              <path
                d="M7.5,0 C9,2 11,5 7.5,10 C4,5 6,2 7.5,0z"
                fill="#F472B6"
                transform={`rotate(${Math.random() * 360} 7.5 7.5)`}
              />
            )}
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
