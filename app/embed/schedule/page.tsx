"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const slides = [
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/30%20Minute%20Workout-DoToLrwHZSRsbMS1mJ9in3pan6jxhL.png",
    title: "30-Minute Workday Workout Window",
    description: "Monday - Thursday 10:30 AM to 11:00 AM EST",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lunch%20break-eFXa4lPamPP8fEYCaP7Xkc338MG9HM.png",
    title: "Extended Healthy Hybrid Lunch Break",
    description: "Monday - Thursday 11:00 AM to 1:00 PM EST",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4%20Hour%20CEO-2hg59kxqElXgcx4IvI8nOKQWAYVKos.png",
    title: "4-Hour Focused CEO Workday",
    description: "Monday - Thursday 1:00 PM to 5:00 PM EST",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Morning%20GIVEN-lmkQhccvkCTn4B6m3bCSXVQMDU1ty4.png",
    title: "Morning GIV•EN™ Routine",
    description: "Monday - Thursday 9:00 AM to 10:30 AM EST",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lifestyle-5aRBBuCeS7yD4ev5ohdWGNiSCUVUNm.png",
    title: "Quality of Life Experiences",
    description: "Evenings and Weekends",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Power%20Down-udygV6d4frAjyxPmG9mkC1FV1st5sN.png",
    title: "Power Down & Unplug Digital Detox",
    description: "Monday - Thursday 9:00 PM to 10:00 PM EST",
  },
]

const scheduleItems = [
  {
    id: "morning-given",
    time: "9:00 AM - 10:30 AM",
    activity: "Morning GIV•EN™ Routine",
    buttonText: "Join Us",
    buttonColor: "green",
    link: "https://join.butter.us/make-time-for-more/morning-routine",
  },
  {
    id: "workout",
    time: "10:30 AM - 11:00 AM",
    activity: "30-Minute Workday Workout",
    buttonText: "Join Us",
    buttonColor: "green",
    link: "https://join.butter.us/make-time-for-more/workout-window",
  },
  {
    id: "lunch",
    time: "11:00 AM - 1:00 PM",
    activity: "Extended Healthy Hybrid Lunch Break",
    buttonText: "Post A Pic",
    buttonColor: "pink",
    link: "https://www.facebook.com/groups/maketimeformore",
  },
  {
    id: "ceo-workday",
    time: "1:00 PM - 5:00 PM",
    activity: "4-Hour Focused CEO Workday",
    buttonText: "Join Us",
    buttonColor: "green",
    link: "https://join.butter.us/make-time-for-more/4-hour-workday",
  },
  {
    id: "quality-life",
    time: "Evenings & Weekends",
    activity: "12 Curated Quality of Lifestyle Experiences",
    buttonText: "Post A Pic",
    buttonColor: "pink",
    link: "https://www.facebook.com/groups/maketimeformore",
  },
  {
    id: "power-down",
    time: "9:00 PM - 10:00 PM",
    activity: "Power Down & Unplug Digital Detox",
    buttonText: "Join Us",
    buttonColor: "green",
    link: "https://join.butter.us/make-time-for-more/power-down",
  },
]

export default function EmbedSchedulePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentActivity, setCurrentActivity] = useState<string | null>(null)

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Determine current activity based on time
  useEffect(() => {
    const updateCurrentActivity = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTime = hours * 60 + minutes
      const dayOfWeek = now.getDay()
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 4

      let active: string | null = null

      if (isWeekday) {
        if (currentTime >= 9 * 60 && currentTime < 10.5 * 60) {
          active = "morning-given"
        } else if (currentTime >= 10.5 * 60 && currentTime < 11 * 60) {
          active = "workout"
        } else if (currentTime >= 11 * 60 && currentTime < 13 * 60) {
          active = "lunch"
        } else if (currentTime >= 13 * 60 && currentTime < 17 * 60) {
          active = "ceo-workday"
        }
      }

      if (currentTime >= 21 * 60 && currentTime < 22 * 60) {
        active = "power-down"
      }

      const isEvening =
        (currentTime >= 17 * 60 && currentTime < 21 * 60) || currentTime >= 22 * 60 || currentTime < 9 * 60
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

      if (isWeekend || (isWeekday && isEvening)) {
        active = "quality-life"
      }

      setCurrentActivity(active)
    }

    updateCurrentActivity()
    const interval = setInterval(updateCurrentActivity, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-white font-sans">
      {/* Carousel Header */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-[#E26C73] to-[#7FB069]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center justify-center w-full max-w-4xl px-5 mx-auto">
              <Image
                src={slide.icon}
                alt={slide.title}
                width={112}
                height={112}
                className="w-28 h-28 mr-5 object-contain flex-shrink-0"
              />
              <div className="flex-1 text-center max-w-lg text-white">
                <div className="text-2xl font-bold mb-2">{slide.title}</div>
                <div className="text-xl opacity-90">{slide.description}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === currentSlide ? "w-5 bg-white" : "w-2.5 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Schedule Section */}
      <div className="px-4 py-3 max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#7FB069] text-center">
          Our 9-to-5 & Night Time Non-Negotiables Co-Working Schedule
        </h2>

        <div className="flex flex-col gap-3">
          {scheduleItems.map((item) => {
            const isActive = item.id === currentActivity
            return (
              <div
                key={item.id}
                className={`flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-green-50 border-l-4 border-[#7FB069] shadow-md"
                    : "bg-gray-50 border-l-[3px] border-gray-300"
                }`}
              >
                <div className="font-bold text-base">{item.time}</div>
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="text-base font-medium whitespace-nowrap">{item.activity}</div>
                  {isActive && (
                    <div className="text-[#E26C73] text-base font-semibold italic animate-pulse">
                      We&apos;re Here...
                    </div>
                  )}
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full md:w-auto min-w-[56px] px-4 py-2 rounded text-white text-sm font-semibold text-center transition-all hover:scale-105 shadow ${
                    item.buttonColor === "green"
                      ? "bg-[#7FB069]/80 hover:bg-[#7FB069]/90"
                      : "bg-[#E26C73]/80 hover:bg-[#E26C73]/90"
                  }`}
                >
                  {item.buttonText}
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
