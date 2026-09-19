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
              the left (behind the logo) and again on the right (behind the
              text). */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(233,224,206,0.94) 0%, rgba(233,224,206,0.6) 16%, rgba(233,224,206,0) 33%, rgba(201,162,75,0) 45%, rgba(201,162,75,0.55) 62%, rgba(201,162,75,0.85) 82%, rgba(201,162,75,0.95) 100%)",
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

        {/* Top-right lockup: tagline + name, ~1/4in from the top */}
        <div className="absolute right-0 top-0 z-10 flex w-[66%] justify-end pr-[1.5%] pt-[2%] text-right">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="font-playfair whitespace-nowrap text-[clamp(1.1rem,2.7vw,2.2rem)] font-bold text-white drop-shadow-sm">
              Make Time For More<sup className="text-[0.4em] align-super">&trade;</sup>
            </p>
            <p className="font-poppins mt-[0.15em] whitespace-nowrap pr-[0.85em] text-[clamp(0.5rem,1.25vw,1rem)] font-medium italic tracking-wide text-white/90">
              with Thought Leader Barbara
            </p>
          </motion.div>
        </div>

        {/* Bottom lockup: headline + full-width subtitle, ~1/4in from the bottom */}
        <div className="absolute inset-y-0 right-0 left-[24%] bottom-0 z-10 flex flex-col justify-end px-[1.5%] pb-[2.5%] text-right">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h2 className="font-playfair whitespace-nowrap text-[clamp(0.82rem,2.35vw,1.9rem)] font-bold leading-[1.05] text-white drop-shadow-sm">
              Join The Work-Life Balance Business Day<sup className="text-[0.4em] align-super">&trade;</sup>
            </h2>
            <p className="font-poppins mt-[0.5em] whitespace-nowrap text-[clamp(0.42rem,1.15vw,0.9rem)] font-medium leading-snug text-white/90">
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
