"use client"

/**
 * CommunityClosedGate — engine-driven "Community Closed" lockout.
 *
 * Reads the single Operating Engine snapshot and shows the closed overlay
 * ONLY when `access.locked` is true. Members are locked during the Unplug
 * Digital Detox™ window (community closed, 11 PM–7 AM ET). Platform admins
 * with Developer Mode enabled have `access.locked === false`, so they are
 * never involuntarily locked out and can keep building at night.
 *
 * Countdown comes straight from the engine — no separate time logic here.
 */

import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useOperatingEngine } from "@/components/operating-engine-provider"

export function CommunityClosedGate() {
  const experience = useOperatingEngine()
  if (!experience || !experience.access.locked) return null

  const { countdown } = experience.community

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <Card className="mx-4 max-w-2xl border-4 border-[#E26C73] bg-white shadow-2xl">
        <CardContent className="p-12 text-center">
          <div className="mb-6 flex justify-center">
            <img
              src="/images/logo.png"
              alt="Make Time For More logo"
              width={96}
              height={96}
              className="rounded-full shadow-lg"
            />
          </div>

          <h2 className="mb-4 text-4xl font-bold text-balance text-gray-900">
            The Make Time For More Success Hub Is Closed For The Night
          </h2>

          <p className="mb-2 text-xl text-gray-700">From 11:00 PM ET to 7:00 AM ET.</p>
          <p className="mb-6 text-xl text-gray-700">
            We&apos;ll open at 7 AM ET during Work-Life Balance Business Hours.
          </p>

          <div className="mb-2 rounded-lg bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 p-6">
            <div className="flex items-center justify-center gap-3 text-2xl font-bold text-[#7FB069]">
              <Clock className="h-8 w-8" />
              <span>Opens in {countdown.label}</span>
            </div>
          </div>

          <p className="mt-6 text-2xl font-semibold text-gray-700">Now go get some rest. Sleep well.</p>
        </CardContent>
      </Card>
    </div>
  )
}
