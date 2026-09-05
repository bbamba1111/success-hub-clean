"use client"

import { HeartHandshake } from "lucide-react"
import { TimeFreedomSocial } from "@/components/time-freedom-social"

/**
 * Time Freedom Moments™ — the single, permanent home for the community feed
 * (Phase 3B cleanup). This experience lives ONLY in the Share area; it is no
 * longer embedded inside unrelated Operating Segments. Members come here to
 * celebrate the life they are reclaiming as work stays contained.
 */
export default function TimeFreedomMomentsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <header className="mb-8 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5D9D61]/10">
            <HeartHandshake className="h-7 w-7 text-[#5D9D61]" />
          </div>
          <div>
            <h1 className="text-balance font-playfair text-3xl font-medium italic text-[#3A2E33] sm:text-4xl">
              Time Freedom Moments™
            </h1>
            <p className="mt-2 max-w-2xl text-pretty font-serif italic leading-relaxed text-[#5C4F55]">
              Celebrate the life you are reclaiming. Share a moment from your expanded life and cheer on the
              community living their Time Freedom™.
            </p>
          </div>
        </header>

        <TimeFreedomSocial active />
      </div>
    </main>
  )
}
