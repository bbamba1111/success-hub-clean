"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { HOLIDAY_SCENES as HERO_SCENES, HOLIDAY_SCENE_INTERVAL_MS } from "@/lib/holiday-scenes"


function getNextMonthlySundaySession() {
  const now = new Date()
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", year: "numeric", month: "numeric", day: "numeric",
    weekday: "short", hour: "numeric", hour12: false,
  }).formatToParts(now)
  const values = Object.fromEntries(dateParts.map((part) => [part.type, part.value]))
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const weekday = weekdays.indexOf(values.weekday)
  let date = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)))
  let daysUntilSunday = (7 - weekday) % 7
  if (daysUntilSunday === 0 && Number(values.hour) >= 13) daysUntilSunday = 7
  date.setUTCDate(date.getUTCDate() + daysUntilSunday)

  const sundayOrdinal = (d: Date) => Math.floor((d.getUTCDate() - 1 + new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).getUTCDay()) / 7) + 1
  if (sundayOrdinal(date) >= 4) {
    date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))
    while (date.getUTCDay() !== 0) date.setUTCDate(date.getUTCDate() + 1)
  }

  const year = date.getUTCFullYear(), month = date.getUTCMonth(), day = date.getUTCDate()
  const localNoonGuess = new Date(Date.UTC(year, month, day, 13))
  const offsetParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York", timeZoneName: "shortOffset",
  }).formatToParts(localNoonGuess)
  const offset = offsetParts.find((part) => part.type === "timeZoneName")?.value ?? "GMT-5"
  const match = offset.match(/GMT([+-])(\\d{1,2})(?::(\\d{2}))?/)
  const offsetMinutes = match ? (match[1] === "+" ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3] ?? 0)) : -300
  return new Date(Date.UTC(year, month, day, 13) - offsetMinutes * 60_000)
}

function SundayCountdown() {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [petalsActive, setPetalsActive] = useState(true)
  const petalsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const target = getNextMonthlySundaySession()
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

  useEffect(() => {
    if (!petalsActive || !petalsRef.current) return
    const host = petalsRef.current
    const colors = ["#FBCFE8", "#F472B6", "#E26C73", "#F9A8D4"]
    const timers: number[] = []
    const makePetal = () => {
      if (!petalsRef.current || !petalsActive) return
      const petal = document.createElement("span")
      const size = 9 + Math.random() * 12
      const duration = 4 + Math.random() * 4
      const drift = Math.random() * 100 - 50
      petal.className = "pointer-events-none absolute top-0 rounded-full opacity-80"
      petal.style.left = `${Math.random() * 100}%`
      petal.style.width = `${size}px`
      petal.style.height = `${size * 1.3}px`
      petal.style.background = colors[Math.floor(Math.random() * colors.length)]
      petal.style.borderRadius = "100% 0 100% 0"
      petal.style.animation = `petal-fall ${duration}s linear forwards`
      petal.style.setProperty("--petal-drift", `${drift}px`)
      host.appendChild(petal)
      window.setTimeout(() => petal.remove(), duration * 1000)
    }
    for (let i = 0; i < 15; i++) timers.push(window.setTimeout(makePetal, i * 200))
    const interval = window.setInterval(makePetal, 650)
    return () => {
      timers.forEach(window.clearTimeout)
      window.clearInterval(interval)
      host.replaceChildren()
    }
  }, [petalsActive])

  const units = [
    { value: remaining.days, label: "Days" },
    { value: remaining.hours, label: "Hours" },
    { value: remaining.minutes, label: "Minutes" },
    { value: remaining.seconds, label: "Seconds" },
  ]

  return (
    <div className="flex w-full max-w-[35rem] flex-col items-center gap-2">
      <p className="font-poppins text-sm font-semibold uppercase tracking-[0.12em] text-[#FFF8F4] sm:text-[16px]">
        Countdown to Your Next Work-Life Balance Sunday · 1:00 PM ET
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {units.map((unit) => (
          <div key={unit.label} className="min-w-[4.4rem] rounded-xl border border-[#F6D6E1]/25 bg-[#2E2228]/65 px-3 py-2 text-center backdrop-blur-sm">
            <span className="font-playfair block text-2xl font-bold tabular-nums text-[#FFF8F4]">{String(unit.value).padStart(2, "0")}</span>
            <span className="font-poppins text-[10px] uppercase tracking-[0.12em] text-[#F6D6E1]">{unit.label}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-1 h-28 w-full overflow-hidden rounded-2xl border border-[#F6D6E1]/25 bg-[url('/images/design-mode/1akick.png')] bg-cover bg-center shadow-lg">
        <div className="absolute inset-0 bg-[#2E2228]/10" />
        <div ref={petalsRef} className="absolute inset-0 overflow-hidden" />
        <button
          type="button"
          onClick={() => setPetalsActive((active) => !active)}
          className="absolute bottom-2 right-2 z-10 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-semibold text-[#A8305B] shadow-sm"
        >
          {petalsActive ? "Stop Petals" : "Start Petals"}
        </button>
      </div>
      <style jsx>{`
        @keyframes petal-fall {
          0% { transform: translate3d(0, -18px, 0) rotate(0deg); opacity: 0; }
          10% { opacity: .85; }
          100% { transform: translate3d(var(--petal-drift), 130px, 0) rotate(360deg); opacity: 0; }
        }
      `}</style>
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
          transition={{ duration: 1.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative left-0 flex w-full max-w-3xl flex-col items-center gap-3 text-center sm:left-[-96px]"
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
          <div className="flex max-w-2xl flex-col items-center gap-1 text-balance">
            <p className="font-poppins text-[14.33px] font-medium leading-[1.25] text-[#FFF8F4] sm:text-[20.33px]">
              Give Yourself the Gift of Work-Life Balance, Time Freedom &amp; Sustainable Success.
            </p>
            <p className="font-poppins text-[14.33px] font-semibold leading-[1.2] text-[#FFF8F4] sm:text-[23px]">
              Don't Let AI Automate Your Hustle.
            </p>
            <p className="font-poppins text-[16.33px] font-bold leading-[1.2] text-[#F6A9C2] sm:text-[22.33px]">
              Set Non-Negotiable Human Sustainability Boundaries Before You Deploy.
            </p>
          </div>
          <div className="flex w-full flex-col items-center gap-3 pt-2">
            <a
              href="#reality-check"
              className="font-poppins inline-flex w-full max-w-[35rem] items-center justify-center rounded-2xl bg-[#C13B6B] px-6 py-3.5 text-center text-[10.33px] font-bold leading-snug tracking-[0.01em] text-[#FFF8F4] shadow-xl shadow-[#C13B6B]/30 transition-transform hover:scale-[1.03] hover:bg-[#A8305B] sm:px-10 sm:py-4 sm:text-[15px]"
            >
              Join the Free Sunday Work-Life Balance Reality Check™
            </a>
          </div>
          <div className="w-full max-w-[28rem] self-center pt-1">
            <SundayCountdown />
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
