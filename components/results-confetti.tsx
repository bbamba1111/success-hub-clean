"use client"

import { useEffect, useState } from "react"
import RepeatedConfetti from "./repeated-confetti"

interface ResultsConfettiProps {
  score: number
  speed?: "fast" | "normal" | "slow"
}

export default function ResultsConfetti({ score, speed = "normal" }: ResultsConfettiProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Only show confetti for good scores (above 70%) and only once per session
    if (score >= 70 && !hasAnimated) {
      // Slight delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        setShowConfetti(true)
        setHasAnimated(true)
      }, 500)

      // Hide confetti after 10 seconds
      const hideTimer = setTimeout(() => {
        setShowConfetti(false)
      }, 10000)

      return () => {
        clearTimeout(timer)
        clearTimeout(hideTimer)
      }
    }
  }, [score, hasAnimated])

  // Don't render anything if we're not showing confetti
  if (!showConfetti) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <RepeatedConfetti burstCount={3} burstDuration={3} interval={3000} />
    </div>
  )
}
