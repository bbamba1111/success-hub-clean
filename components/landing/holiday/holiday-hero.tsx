"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { HOLIDAY_SCENES as HERO_SCENES, HOLIDAY_SCENE_INTERVAL_MS } from "@/lib/holiday-scenes"


function SundayCountdown() {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const getNextSunday = () => {
      const now = new Date()
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York", weekday: "short", year: "numeric", month: "numeric", day: "numeric",
        hour: "numeric", minute: "numeric", second: "numeric", hour12: false,
      }).formatToParts(now)
      const values = Object.fromEntries(parts.map((p) => [p.type, p.value]))
      const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(values.weekday)
      const daysUntil = (7 - weekday) % 7
      const targetDay = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day) + daysUntil, 13))
      const targetParts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York", year: "numeric", month: "numeric", day: "numeric",
        hour: "numeric", minute: "numeric", second: "numeric", hour12: false,
      }).formatToParts(targetDay)
      const targetValues = Object.fromEntries(targetParts.map((p) => [p.type, p.value]))
      const targetUtcGuess = Date.UTC(Number(targetValues.year), Number(targetValues.month) - 1, Number(targetValues.day), 13)
      const targetOffsetParts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York", timeZoneName: "shortOffset",
      }).formatToParts(targetDay)
      const offset = targetOffsetParts.find((p) => p.type === "timeZoneName")?.value ?? "GMT-5"
      const match = offset.match(/GMT([+-])(\\d{1,2})(?::(\\d{2}))?/)
      const offsetMinutes = match ? (match[1] === "+" ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3] ?? 0)) : -300
      let target = targetUtcGuess - offsetMinutes * 60000
      if (target <= now.getTime()) {
        const next = new Date(target + 7 * 86400000)
        target = next.getTime()
      }
      return target
    }
    let target = getNextSunday()
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      if (diff === 0) target = getNextSunday()
      const seconds = Math.floor(diff / 1000)
      setRemaining({
        days: Math.floor(seconds / 86400),
        hours: Math.floor((seconds % 86400) / 3600),
        minutes: Math.floor((seconds % 3600) / 60),
        seconds: seconds % 60,
      })
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])
  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ]
  return (
    <div className="mt-3 flex w-full max-w-[35rem] flex-col items-center gap-2" aria-live="off">
      <p className="font-poppins text-xs font-semibold uppercase tracking-[0.18em] text-[#FFF8F4]">Next Sunday Shift™ Begins In</p>
      <div className="grid w-full grid-cols-4 gap-2">
        {units.map((unit) => (
          <div key={unit.label} className="rounded-xl border border-white/25 bg-[#2E2228]/75 px-2 py-2 text-center backdrop-blur-sm">
            <span className="font-playfair block text-2xl font-bold tabular-nums text-[#FFF8F4] sm:text-3xl">{String(unit.value).padStart(2, "0")}</span>
            <span className="font-poppins text-[10px] uppercase tracking-wider text-[#F6D6E1]">{unit.label}</span>
          </div>
        ))}
      </div>
      <p className="font-poppins text-xs text-[#FFF8F4]/90">Every Sunday · 1:00 PM Eastern Time</p>
    </div>
  )
}

export function HolidayHero() {
  const [index, setIndex] = useState(0)
  const [inView, setInView] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reduceMotion) return
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % HERO_SCENES.length)
    }, HOLIDAY_SCENE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [inView, reduceMotion])

  const scene = HERO_SCENES[index]

  return (
    <section ref={sectionRef} id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-[#2E2228]">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={scene.src}
            src={scene.src}
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority={index === 0 ? "high" : "auto"}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: 7, ease: "easeOut" } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E2228]/85 via-[#2E2228]/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2E2228]/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-24 pt-28 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative left-0 flex w-full max-w-3xl flex-col items-center gap-5 text-center sm:left-[-96px]"
        >
          <div className="w-full max-w-full">
            <h1 className="font-playfair text-balance text-[31.33px] font-bold leading-[1.05] tracking-tight sm:text-[55.33px]">
              <span className="block text-[#F6A9C2]">Make Time For More</span>
              <span className="mt-3 inline-block font-[family-name:var(--font-great-vibes)] text-[2.533rem] font-normal leading-[1.25] text-[#FFF8F4] sm:text-[3.533rem]">This Holiday Season</span>
            </h1>
            <svg className="mx-auto -mt-1 h-4 w-[min(80%,20rem)] overflow-visible" viewBox="0 0 432 24" preserveAspectRatio="none" aria-hidden="true">
              <path d="M5 16 C105 2 190 23 278 11 S370 8 425 12" fill="none" stroke="#C51E3A" strokeWidth="8" strokeLinecap="round" />
              <path d="M12 17 C110 7 200 24 288 13 S378 10 418 14" fill="none" stroke="#E43B50" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>
          <div className="flex max-w-2xl flex-col items-center gap-3 text-balance">
            <p className="font-poppins text-[14.33px] font-medium leading-[1.5] text-[#FFF8F4] sm:text-[20.33px]">
              Give Yourself the Gift of Work-Life Balance, Time Freedom &amp; Sustainable Success.
            </p>
            <p className="font-poppins text-[14.33px] font-semibold leading-[1.4] text-[#FFF8F4] sm:text-[23px]">
              Don't Let AI Automate Your Hustle.
            </p>
            <p className="font-poppins text-[16.33px] font-bold leading-[1.35] text-[#F6A9C2] sm:text-[22.33px]">
              Set Non-Negotiable Human Sustainability Boundaries Before You Deploy.
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-3 pt-2">
            <a
              href="#reality-check"
              className="font-poppins inline-flex w-full max-w-[35rem] items-center justify-center rounded-2xl bg-[#C13B6B] px-6 py-3.5 text-center text-[13.33px] font-bold leading-snug tracking-[0.01em] text-[#FFF8F4] shadow-xl shadow-[#C13B6B]/30 transition-transform hover:scale-[1.03] hover:bg-[#A8305B] sm:px-10 sm:py-4 sm:text-lg"
            >
              Join the Free Sunday Work-Life Balance Reality Check™
            </a>
          </div>
          <div className="flex min-h-8 w-full items-center justify-center pt-1 text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={scene.caption}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ opacity: { duration: 1.5, ease: "easeInOut" }, y: { duration: 1.5, ease: "easeInOut" } }}
                className="font-playfair text-base italic text-[#FFF8F4]/90 sm:text-lg"
                aria-live="polite"
              >
                {scene.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-7xl items-center justify-center gap-4 px-5 sm:px-8">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Holiday scenes">
          {HERO_SCENES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={s.caption}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[#F6A9C2]" : "w-1.5 bg-[#FFF8F4]/50 hover:bg-[#FFF8F4]/80"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
