"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { HOLIDAY_SCENES as HERO_SCENES, HOLIDAY_SCENE_INTERVAL_MS } from "@/lib/holiday-scenes"
import { SESSION_TIME_LABEL, nextSessionDate, sessionStartsAt } from "@/lib/reality-check/session"

function SundayCountdown({ sessionLabel }: { sessionLabel: string }) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const update = () => {
      const target = sessionStartsAt(nextSessionDate(new Date()))
      const total = Math.max(0, target.getTime() - Date.now())
      setRemaining({
        days: Math.floor(total / 86_400_000),
        hours: Math.floor((total % 86_400_000) / 3_600_000),
        minutes: Math.floor((total % 3_600_000) / 60_000),
        seconds: Math.floor((total % 60_000) / 1_000),
      })
    }
    update()
    const timer = window.setInterval(update, 1_000)
    return () => window.clearInterval(timer)
  }, [])

  const units = [
    { value: remaining.days, label: "Days" },
    { value: remaining.hours, label: "Hours" },
    { value: remaining.minutes, label: "Minutes" },
    { value: remaining.seconds, label: "Seconds" },
  ]

  return (
    <div className="flex flex-col items-center gap-3 text-center" aria-live="off">
      <p className="font-poppins text-base font-semibold uppercase tracking-[0.12em] text-[#FFF8F4] sm:text-lg">
        Next: {sessionLabel} · {SESSION_TIME_LABEL}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {units.map((unit) => (
          <div key={unit.label} className="min-w-[4.4rem] rounded-xl border border-[#F6D6E1]/25 bg-[#2E2228]/55 px-3 py-2 text-center backdrop-blur-sm">
            <span className="font-playfair block text-2xl font-bold tabular-nums text-[#FFF8F4]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="font-poppins text-[10px] uppercase tracking-[0.12em] text-[#F6D6E1]">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HolidayHero({ sessionLabel }: { sessionLabel: string }) {
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
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex w-full max-w-3xl flex-col items-center gap-5 text-center sm:-translate-x-24"
        >
          <div className="w-full max-w-full">
            <h1 className="font-playfair text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              <span className="block text-[#F6A9C2]">Make Time For More</span>
              <span className="mt-3 inline-block font-[family-name:var(--font-great-vibes)] text-[2.825rem] font-normal leading-[1.25] text-[#FFF8F4] sm:text-[3.825rem]">This Holiday Season</span>
            </h1>
            <svg className="mx-auto -mt-1 h-4 w-[min(80%,20rem)] overflow-visible" viewBox="0 0 432 24" preserveAspectRatio="none" aria-hidden="true">
              <path d="M5 16 C105 2 190 23 278 11 S370 8 425 12" fill="none" stroke="#C51E3A" strokeWidth="8" strokeLinecap="round" />
              <path d="M12 17 C110 7 200 24 288 13 S378 10 418 14" fill="none" stroke="#E43B50" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            </svg>
          </div>
          <p className="font-poppins max-w-2xl text-balance text-[19px] font-medium leading-[1.5] text-[#FFF8F4] sm:text-[25px]">
            Give Yourself the Gift of Work-Life Balance, Time Freedom &amp; Sustainable Success.
          </p>
          <div className="flex w-full flex-col items-center gap-3 pt-2">
            <a
              href="#register"
              className="font-poppins inline-flex w-full max-w-[38rem] items-center justify-center rounded-2xl bg-[#C13B6B] px-6 py-3.5 text-center text-base font-bold leading-snug tracking-[0.01em] text-[#FFF8F4] shadow-xl shadow-[#C13B6B]/30 transition-transform hover:scale-[1.03] hover:bg-[#A8305B] sm:px-10 sm:py-4 sm:text-lg"
            >
              Take Your Free Work-Life Balance Reality Check™
            </a>
          </div>
          <div className="w-full max-w-[28rem] self-center pt-1">
            <SundayCountdown sessionLabel={sessionLabel} />
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={scene.caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-sm italic text-[#FFF8F4]/90 sm:text-base"
            aria-live="polite"
          >
            {scene.caption}
          </motion.p>
        </AnimatePresence>
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
