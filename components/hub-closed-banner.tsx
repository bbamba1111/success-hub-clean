"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Moon, Clock } from "lucide-react"
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
    <Card className="border-2 border-[#E26C73] bg-gradient-to-r from-[#E26C73]/10 to-[#7FB069]/10">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#E26C73] to-[#7FB069] rounded-full flex items-center justify-center">
            <Moon className="h-8 w-8 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">The Success Hub is Closed for the Night</h2>

        <p className="text-lg text-gray-700 mb-4">From 11:00 PM ET to 7:00 AM ET. We'll Open at 7 AM ET</p>

        <div className="flex items-center justify-center gap-2 text-[#7FB069] font-semibold">
          <Clock className="h-5 w-5" />
          <span>
            Opens in {status.hoursUntilChange}h {status.minutesUntilChange}m
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
