"use client"

/**
 * FounderMediaSurface — the founder portrait's HOME STATE, upgraded into a
 * reusable live media surface.
 *
 * OFFLINE / ENDED (default): shows the founder's portrait, exactly as it
 * always has — no fake LIVE badge, no empty video player, no disabled
 * streaming controls.
 *
 * LIVE: when `useFounderLiveEvent()` resolves a real, provider-backed
 * `playbackUrl`, this surface swaps to the live broadcast with a tasteful
 * "● LIVE" indicator. The surface keeps the same footprint in both states so
 * the page never jumps when a broadcast starts or ends.
 *
 * This component never invents a live state — see `useFounderLiveEvent` for
 * the provider-agnostic integration boundary.
 */
import { useFounderLiveEvent } from "@/lib/live-event/use-founder-live-event"
import { cn } from "@/lib/utils"

interface FounderMediaSurfaceProps {
  portraitSrc: string
  portraitAlt: string
  className?: string
}

export function FounderMediaSurface({ portraitSrc, portraitAlt, className }: FounderMediaSurfaceProps) {
  const liveEvent = useFounderLiveEvent()
  const isLive = liveEvent?.status === "live" && Boolean(liveEvent.playbackUrl)

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-[2rem]", className)}
      style={{
        boxShadow: "0 20px 60px rgba(193,59,107,0.13), 0 4px 18px rgba(0,0,0,0.07)",
        aspectRatio: "3/4",
      }}
    >
      {isLive && liveEvent ? (
        <>
          <video
            key={liveEvent.id}
            src={liveEvent.playbackUrl}
            autoPlay
            muted
            playsInline
            controls
            className="h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#C13B6B] px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
            Live
          </span>
        </>
      ) : (
        <img
          src={portraitSrc || "/placeholder.svg"}
          alt={portraitAlt}
          className="h-full w-full object-cover object-top"
        />
      )}
    </div>
  )
}
