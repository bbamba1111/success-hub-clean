"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Moon, Clock, Sparkles } from "lucide-react"
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
            <div className="w-24 h-24 bg-gradient-to-br from-[#E26C73] to-[#7FB069] rounded-full flex items-center justify-center shadow-lg">
              <Moon className="h-12 w-12 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Make Time For More Monthly -- the Work-Life Balance Success Hub Is Closed For The Night
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

          <div className="flex items-center justify-center gap-3 mt-8">
            <Sparkles className="h-8 w-8 text-yellow-400 fill-yellow-400 animate-pulse" />
            <p
              className="text-gray-700"
              style={{ fontFamily: "'Great Vibes', cursive", fontSize: "28px", fontWeight: 400, lineHeight: 1.2 }}
            >
              Now Go Get Some Sleep~~ Rest Well
            </p>
            <Sparkles className="h-8 w-8 text-yellow-400 fill-yellow-400 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
