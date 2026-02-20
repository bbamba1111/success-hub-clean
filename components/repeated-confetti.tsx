"use client"

import { useEffect, useState } from "react"
import CherryBlossomConfetti from "./cherry-blossom-confetti"

interface RepeatedConfettiProps {
  burstCount?: number
  burstDuration?: number
  interval?: number
}

export default function RepeatedConfetti({
  burstCount = 3,
  burstDuration = 3,
  interval = 3000,
}: RepeatedConfettiProps) {
  const [activeBursts, setActiveBursts] = useState<number[]>([])

  useEffect(() => {
    // Start with the first burst
    setActiveBursts([0])

    // Schedule subsequent bursts
    const timers: NodeJS.Timeout[] = []

    for (let i = 1; i < burstCount; i++) {
      const timer = setTimeout(() => {
        setActiveBursts((prev) => [...prev, i])
      }, i * interval)

      timers.push(timer)
    }

    // Clean up timers
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [burstCount, interval])

  return (
    <>
      {activeBursts.map((burstIndex) => (
        <CherryBlossomConfetti
          key={burstIndex}
          duration={burstDuration}
          speed="fast"
          density={burstIndex % 2 === 0 ? "low" : "medium"}
        />
      ))}
    </>
  )
}
