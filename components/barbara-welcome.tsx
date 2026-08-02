"use client"

import { motion } from "framer-motion"
import { useOperatingEngine } from "@/components/operating-engine-provider"


const VALUES = [
  "Your Spirit",
  "Mind",
  "Body",
  "Health",
  "Energy",
  "Relationships",
  "80/20 Leveraged High-Value Work",
  "Time Freedom",
  "Recovery",
  "Sleep",
]

/** Per-block live coaching messages from Barbara. */
const BLOCK_COACHING: Record<string, { message: string; reflection: { text: string; author?: string } }> = {
  "monday-flex": {
    message:
      "Welcome to Make Time For More\u2122 On Mondays\u2122 \u2014 your redesigned entry into the workweek. Before the demands of the day arrive, this time belongs entirely to you. Use it to ground yourself, set your intentions, and remember why you chose this path. The week ahead is full of possibility. Let\u2019s enter it with clarity, not chaos.",
    reflection: {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    },
  },
  "monday-reality-check": {
    message:
      "Welcome to Make Time For More On Mondays\u2122. This is your protected 30-minute window to redesign your entry into the workweek. Before you build, before you execute \u2014 pause, realign, and step into Monday with clarity and intention. How you enter your week shapes everything that follows.",
    reflection: {
      text: "Almost everything will work again if you unplug it for a few minutes, including you.",
      author: "Anne Lamott",
    },
  },
  "early-access": {
    message:
      "This is your Flex Time\u2122 \u2014 the quiet window before the day begins. The Work-Life Balance Business Day\u2122 is about to open, and this moment is yours to prepare with intention. Use it to move your body, review your focus, nourish yourself, or simply breathe. How you enter your day shapes everything that follows.",
    reflection: {
      text: "Lose an hour in the morning, and you will spend all day looking for it.",
      author: "Richard Whately",
    },
  },
  "morning-given": {
    message:
      "Welcome to the Morning GIV\u2022EN\u2122 Routine \u2014 the daily alignment practice at the heart of intentional leadership. Before you lead others, you must lead yourself. Before you build, you must become. These minutes are dedicated to the Human Identity Development Practices\u2122 that shape who you are as a founder, a professional, and a human being.",
    reflection: {
      text: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.",
      author: "Abraham Lincoln",
    },
  },
  "movement-window": {
    message:
      "Your body is not separate from your business \u2014 it is the foundation of it. The 30-Minute Movement Window\u2122 exists because sustainable high performance requires physical renewal. When you move, you think more clearly, lead more effectively, and show up more fully for everything and everyone that matters. Honor this time. Your best work depends on it.",
    reflection: {
      text: "Take care of your body. It\u2019s the only place you have to live.",
      author: "Jim Rohn",
    },
  },
  "lunch-break": {
    message:
      "The Extended Healthy Hybrid Lunch\u2122 is not a luxury \u2014 it is a boundary. A protected midday pause to nourish your body, reset your mind, and prevent the energy crash that undermines your afternoon. The most productive founders know that rest is a strategy. Step away from your screen. Eat well. You will return stronger.",
    reflection: {
      text: "Almost everything will work again if you unplug it for a few minutes, including you.",
      author: "Anne Lamott",
    },
  },
  "ceo-workday": {
    message:
      "This is the 4-Hour Focused CEO Workday\u2122 \u2014 the sacred container where your highest-value work gets done. Not busywork. Not reactive tasks. The work that actually builds your vision. Four intentional hours, protected by the boundaries you set before and after, create more progress than twelve scattered ones. Build with focus. Lead with purpose.",
    reflection: {
      text: "It\u2019s not about having time. It\u2019s about making time.",
      author: "Harmony\u2122",
    },
  },
  "time-freedom": {
    message:
      "You have arrived at Time Freedom\u2122 \u2014 the protected space your Work-Life Balance Business Week\u2122 was intentionally designed to create. This time is not idle. It is the reason you work the way you work. Protect it fiercely. Live in it fully. The life you built your business to support is happening right now. Be present for it.",
    reflection: {
      text: "The purpose of life is to live it, to taste experience to the utmost, to reach out eagerly and without fear for newer and richer experience.",
      author: "Eleanor Roosevelt",
    },
  },
  "power-down": {
    message:
      "Power Down\u2122 is one of the most important boundaries in your entire operating rhythm. The way you close your day determines the quality of your rest \u2014 and the quality of your rest determines the quality of your leadership tomorrow. Release today. Celebrate what was completed. Set tomorrow in motion with a clean close.",
    reflection: {
      text: "Each night, when I go to sleep, I die. And the next morning, when I wake up, I am reborn.",
      author: "Mahatma Gandhi",
    },
  },
  "digital-detox": {
    message:
      "The Unplug Digital Detox\u2122 is your final act of intentional leadership for today. Rest is not the absence of productivity \u2014 it is the foundation of it. The most resilient founders protect their sleep, their stillness, and their inner life. Step away from the screen. Let your mind recover. Tomorrow begins with you, rested and renewed.",
    reflection: {
      text: "Sleep is the best meditation.",
      author: "Dalai Lama",
    },
  },
}

const DEFAULT_COACHING = {
  message:
    "Together, we move through the Work-Life Balance Business Day\u2122 \u2014 an intentionally designed operating rhythm built around Identity Development Boundaries\u2122. These dedicated time frames create space for a daily identity practice, helping you become the founder, leader, and person you aspire to be while protecting the things that matter most.",
  reflection: {
    text: "The key is not to prioritize what\u2019s on your schedule, but to schedule your priorities.",
    author: "Stephen R. Covey",
  },
}

/** Returns the proper time-of-day salutation based on minutes-since-midnight. */
function getSalutation(minutes: number): string {
  if (minutes >= 22 * 60 || minutes < 5 * 60) return "Good Night"
  if (minutes < 12 * 60) return "Good Morning"
  if (minutes < 17 * 60) return "Good Afternoon"
  return "Good Evening"
}

export function BarbaraWelcome() {
  const experience = useOperatingEngine()
  const blockId = experience?.businessDay.current.id ?? ""
  const coaching = BLOCK_COACHING[blockId] ?? DEFAULT_COACHING
  const firstName = experience?.member.firstName ?? "Friend"
  const minutes = experience?.time.minutesSinceMidnight ?? new Date().getHours() * 60 + new Date().getMinutes()
  const salutation = getSalutation(minutes)
  // Full greeting shown as lead line: "Good Morning, Friend"
  const greeting = `${salutation}, ${firstName}`

  return (
    <section className="w-full bg-[#FDFAF5]">

      {/* ── Two-column intro ── */}
      <div className="mx-auto max-w-[1320px] px-6 pb-12 pt-20 sm:px-10 sm:pb-14 sm:pt-24 lg:px-16 lg:pb-16 lg:pt-28">
        <div className="flex flex-col items-start gap-14 lg:flex-row lg:items-start lg:gap-20">

          {/* Left column — 60% — coaching front and center */}
          <motion.div
            key={blockId}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="flex min-w-0 flex-1 flex-col"
          >
            {/* Personalized greeting */}
            <p className="font-playfair text-[20px] italic text-[#78AD7D] sm:text-[22px]">
              {greeting}
            </p>

            {/* Coaching message — front and center */}
            <p className="mt-4 max-w-[580px] font-montserrat text-[15px] leading-[1.7] text-[#4A3A42]">
              {coaching.message}
            </p>

            {/* Today's Reflection */}
            <div className="mt-7 border-l-2 border-[#C13B6B]/30 pl-4">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-[#C13B6B]">
                {"Today\u2019s Reflection"}
              </p>
              <p className="mt-2 font-playfair text-[15px] italic leading-relaxed text-[#4A3A42]">
                &ldquo;{coaching.reflection.text}&rdquo;
              </p>
              {coaching.reflection.author && (
                <p className="mt-1 font-montserrat text-[11px] font-semibold tracking-wide text-[#7A6A72]">
                  {"\u2014 "}{coaching.reflection.author}
                </p>
              )}
            </div>
          </motion.div>

          {/* Right column — 40% portrait */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="flex w-full shrink-0 justify-center lg:w-[40%] lg:justify-end"
          >
            <div
              className="w-full max-w-[300px] overflow-hidden rounded-[2rem] sm:max-w-[340px] lg:max-w-[380px]"
              style={{
                boxShadow: "0 20px 60px rgba(193,59,107,0.13), 0 4px 18px rgba(0,0,0,0.07)",
                aspectRatio: "3/4",
              }}
            >
              <img
                src="/images/barbara-live-portrait.png"
                alt="Thought Leader Barbara \u2014 Founder of Harmony Lane\u2122"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Non-Negotiables — full-width centered, hero gradient bg ── */}
      <div className="w-full" style={{ background: "linear-gradient(135deg, #FDF6F0 0%, #FBF0F4 40%, #F0F5EE 70%, #FDFAF6 100%)" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-[1320px] px-6 pb-8 pt-12 text-center sm:px-10 sm:pb-10 sm:pt-14 lg:px-16 lg:pb-10 lg:pt-16"
        >
          <div className="flex flex-wrap items-baseline justify-center gap-3">
            <h2 className="text-balance font-playfair text-3xl font-semibold text-[#1C161A] sm:text-4xl lg:text-5xl">
              {"Your New 9\u20115 & Nighttime Non-Negotiables\u2122"}
            </h2>
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C13B6B] font-montserrat text-[11px] font-bold text-white">
              {VALUES.length}
            </span>
          </div>
          <div className="mx-auto mt-4 flex flex-nowrap items-center justify-center gap-x-3 overflow-x-auto">
            {VALUES.map((value, i) => (
              <span key={value} className="flex shrink-0 items-center gap-x-3">
                <span className="font-montserrat text-[13px] font-semibold tracking-wide text-[#1C161A]">
                  {value}
                </span>
                {i < VALUES.length - 1 && (
                  <span className="text-[#C13B6B] opacity-70" aria-hidden>&bull;</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  )
}
