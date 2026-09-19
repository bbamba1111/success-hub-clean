"use client"

/**
 * LinkedInHeader — a dedicated, responsive LinkedIn profile banner that is a
 * direct visual extension of the Harmony Lane™ landing page. It reuses the same
 * panoramic Work-Life Balance Business Day™ imagery (the canonical SCHEDULE
 * backgrounds the landing hero cycles through), recomposed for LinkedIn's
 * 1584×396 (4:1) banner rather than shrinking the landing-page section.
 *
 * Deliberate departures from the landing hero:
 *  - No large glass / glassmorphism panel. The panoramic environment is the hero.
 *  - Text is minimal, anchored to the upper-right, and kept out of the
 *    lower-left safe area where LinkedIn overlays the profile photo + name.
 *  - object-position keeps the primary subjects visible across breakpoints.
 */
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SCHEDULE } from "@/operating-engine/config/schedule"

export function LinkedInHeader({
  showSafeArea = false,
  capture = false,
  captureIndex = 0,
}: {
  showSafeArea?: boolean
  /** Freeze on a single image with no animation/rounding — for exporting a static PNG. */
  capture?: boolean
  /** Which SCHEDULE phase image to freeze on when capturing. */
  captureIndex?: number
}) {
  const [index, setIndex] = useState(capture ? captureIndex % SCHEDULE.length : 0)

  useEffect(() => {
    if (capture) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SCHEDULE.length)
    }, 6400)
    return () => clearInterval(timer)
  }, [capture])

  const block = SCHEDULE[index]
  const image = (Array.isArray(block.backgroundImage) ? block.backgroundImage[0] : block.backgroundImage) || "/placeholder.svg"

  return (
    <div className={`relative w-full overflow-hidden bg-[#FFF1F5] ${capture ? "" : "rounded-xl"}`}>
      {/* LinkedIn banner ratio: 1584 × 396 = 4:1 */}
      <div className="relative aspect-[4/1] w-full">
        {/* Panoramic Work-Life Balance Business Day™ imagery, in motion */}
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.img
              key={image}
              src={image}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 2.6, ease: "easeInOut" }, scale: { duration: 8.5, ease: "easeOut" } }}
              className="absolute inset-0 h-full w-full object-contain"
              style={{ objectPosition: "center" }}
            />
          </AnimatePresence>

          {/* Readability wash drawn from the Harmony logo palette — warm tan on
              the left (behind the logo), the logo's plum-pink replacing the old
              brown on the right (behind the text). */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(233,224,206,0.94) 0%, rgba(233,224,206,0.6) 16%, rgba(233,224,206,0) 33%, rgba(138,46,80,0) 45%, rgba(138,46,80,0.42) 62%, rgba(138,46,80,0.8) 82%, rgba(138,46,80,0.9) 100%)",
            }}
          />
        </div>

        {/* Harmony logo, anchored left over the tan wash */}
        <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-[2%]">
          <img
            src="/images/harmony-logo.png"
            alt="Harmony — Make Time For More"
            className="h-[84%] w-auto object-contain"
          />
        </div>

        {/* Fixed editorial message, stretched across the right, bottom-anchored */}
        <div className="relative z-10 flex h-full items-end justify-end">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="w-[66%] pr-[1.5%] pb-[6.1%] text-right"
          >
            <p className="font-playfair whitespace-nowrap text-[clamp(1rem,2.5vw,2rem)] font-semibold text-[#A3B18A]">
              Make Time For More&trade; &mdash; In Real Time
            </p>
            <h2 className="font-playfair mt-[0.3em] whitespace-nowrap text-[clamp(0.82rem,2.35vw,1.9rem)] font-bold leading-[1.05] text-white drop-shadow-sm">
              Join The Work-Life Balance Business Day&trade;
            </h2>
            <p className="font-poppins mt-[0.5em] whitespace-nowrap text-[clamp(0.4rem,1vw,0.82rem)] font-medium leading-snug text-white/90">
              For Founders Ready to Build Boundaries In Business&mdash;and Workplaces&mdash;that Make Room for Life in the AI Age.
            </p>
          </motion.div>
        </div>

        {/* Optional safe-area guide (preview only) */}
        {showSafeArea && (
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute bottom-0 left-0 h-[62%] w-[22%] border-2 border-dashed border-white/70 bg-white/10">
              <span className="font-poppins absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                Profile photo / name
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
