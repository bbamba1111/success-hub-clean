"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { getBusinessHoursStatus, type BusinessHoursStatus } from "@/lib/utils/business-hours"

export function HubClosedBanner() {
  const [status, setStatus] = useState<BusinessHoursStatus | null>(null)

  useEffect(() => {
    // Update status immediately
    setStatus(getBusinessHoursStatus())

    // Update every minute
    const interval = setInterval(() => {
      setStatus(getBusinessHoursStatus())
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [])

  if (!status || status.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <Card className="border-4 border-[#E26C73] bg-white shadow-2xl max-w-2xl mx-4">
        <CardContent className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={96}
              height={96}
              className="rounded-full shadow-lg"
            />
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The Make Time For More Success Hub Is Closed For The Night...
          </h2>

          <p className="text-xl text-gray-700 mb-2">From 11:00 PM ET to 7:00 AM ET.</p>
          <p className="text-xl text-gray-700 mb-6">We'll Open At 7 AM ET During Work-Life Balance Business Hours</p>

          <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center gap-3 text-[#7FB069] font-bold text-2xl">
              <Clock className="h-8 w-8" />
              <span>
                Opens in {status.hoursUntilChange}h {status.minutesUntilChange}m
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-full blur-md opacity-60 animate-pulse" />
              <svg
                className="relative h-10 w-10 animate-pulse"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: "#FFF4E6", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="url(#starGradient)"
                  filter="url(#glow)"
                  stroke="#FFD700"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <p className="text-gray-700 text-2xl font-semibold">Now Go Get Some Sleep... Rest Well</p>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-full blur-md opacity-60 animate-pulse" />
              <svg
                className="relative h-10 w-10 animate-pulse"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ animationDelay: "0.5s" }}
              >
                <defs>
                  <linearGradient id="starGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: "#FFF4E6", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="glow2">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="url(#starGradient2)"
                  filter="url(#glow2)"
                  stroke="#FFD700"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
