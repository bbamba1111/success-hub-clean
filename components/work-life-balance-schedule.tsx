"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface ScheduleActivity {
  id: string
  time: string
  activity: string
  icon: string
  description: string
}

const activities: ScheduleActivity[] = [
  {
    id: "workout",
    time: "10:30 AM - 11:00 AM EST",
    activity: "30-Minute Workday Workout Window",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/30%20Minute%20Workout-DoToLrwHZSRsbMS1mJ9in3pan6jxhL.png",
    description: "Monday - Thursday 10:30 AM to 11:00 AM EST",
  },
  {
    id: "lunch",
    time: "11:00 AM - 1:00 PM EST",
    activity: "Extended Healthy Hybrid Lunch Break",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lunch%20break-eFXa4lPamPP8fEYCaP7Xkc338MG9HM.png",
    description: "Monday - Thursday 11:00 AM to 1:00 PM EST",
  },
  {
    id: "ceo-workday",
    time: "1:00 PM - 5:00 PM EST",
    activity: "4-Hour Focused CEO Workday",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4%20Hour%20CEO-2hg59kxqElXgcx4IvI8nOKQWAYVKos.png",
    description: "Monday - Thursday 1:00 PM to 5:00 PM EST",
  },
  {
    id: "morning-given",
    time: "9:00 AM - 10:30 AM EST",
    activity: "Morning GIV•EN™ Routine",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Morning%20GIVEN-lmkQhccvkCTn4B6m3bCSXVQMDU1ty4.png",
    description: "Monday - Thursday 9:00 AM to 10:30 AM EST",
  },
  {
    id: "quality-life",
    time: "Evenings & Weekends",
    activity: "Quality of Life Experiences",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lifestyle-5aRBBuCeS7yD4ev5ohdWGNiSCUVUNm.png",
    description: "Evenings and Weekends",
  },
  {
    id: "power-down",
    time: "9:00 PM - 10:00 PM EST",
    activity: "Power Down & Unplug Digital Detox",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Power%20Down-udygV6d4frAjyxPmG9mkC1FV1st5sN.png",
    description: "Monday - Thursday 9:00 PM to 10:00 PM EST",
  },
]

const scheduleItems = [
  {
    id: "morning-given",
    time: "9:00 AM - 10:30 AM",
    activity: "Morning GIV•EN™ Routine",
    joinLink: "https://join.butter.us/make-time-for-more/morning-routine",
    buttonText: "Join Us",
    buttonStyle: "green",
  },
  {
    id: "workout",
    time: "10:30 AM - 11:00 AM",
    activity: "30-Minute Workday Workout",
    joinLink: "https://join.butter.us/make-time-for-more/workout-window",
    buttonText: "Join Us",
    buttonStyle: "green",
  },
  {
    id: "lunch",
    time: "11:00 AM - 1:00 PM",
    activity: "Extended Healthy Hybrid Lunch Break",
    joinLink: "https://www.facebook.com/groups/maketimeformore",
    buttonText: "Post A Pic",
    buttonStyle: "pink",
  },
  {
    id: "ceo-workday",
    time: "1:00 PM - 5:00 PM",
    activity: "4-Hour Focused CEO Workday",
    joinLink: "https://join.butter.us/make-time-for-more/4-hour-workday",
    buttonText: "Join Us",
    buttonStyle: "green",
  },
  {
    id: "quality-life",
    time: "Evenings & Weekends",
    activity: "12 Curated Quality of Lifestyle Experiences",
    joinLink: "https://www.facebook.com/groups/maketimeformore",
    buttonText: "Post A Pic",
    buttonStyle: "pink",
  },
  {
    id: "power-down",
    time: "9:00 PM - 10:00 PM",
    activity: "Power Down & Unplug Digital Detox",
    joinLink: "https://join.butter.us/make-time-for-more/power-down",
    buttonText: "Join Us",
    buttonStyle: "green",
  },
]

function WorkLifeBalanceSchedule() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentActivity, setCurrentActivity] = useState<string | null>(null)

  // Carousel functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activities.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Schedule highlighting based on current time
  useEffect(() => {
    const updateCurrentActivity = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTime = hours * 60 + minutes
      const isWeekday = now.getDay() >= 1 && now.getDay() <= 4

      let activeActivity = null

      if (isWeekday) {
        if (currentTime >= 9 * 60 && currentTime < 10.5 * 60) {
          activeActivity = "morning-given"
        } else if (currentTime >= 10.5 * 60 && currentTime < 11 * 60) {
          activeActivity = "workout"
        } else if (currentTime >= 11 * 60 && currentTime < 13 * 60) {
          activeActivity = "lunch"
        } else if (currentTime >= 13 * 60 && currentTime < 17 * 60) {
          activeActivity = "ceo-workday"
        }
      }

      if (currentTime >= 21 * 60 && currentTime < 22 * 60) {
        activeActivity = "power-down"
      }

      const isEvening =
        (currentTime >= 17 * 60 && currentTime < 21 * 60) || currentTime >= 22 * 60 || currentTime < 9 * 60
      const isWeekend = now.getDay() === 0 || now.getDay() === 6

      if (isWeekend || (isWeekday && isEvening)) {
        activeActivity = "quality-life"
      }

      setCurrentActivity(activeActivity)
    }

    updateCurrentActivity()
    const interval = setInterval(updateCurrentActivity, 60000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="w-full bg-white shadow-lg overflow-hidden">
      {/* Activity Carousel */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-[#E26C73] to-[#7FB069]">
        <div className="relative h-full w-full">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex items-center justify-center h-full text-white text-center px-5">
                <div className="flex items-center justify-center w-full max-w-4xl mx-auto px-5">
                  <img
                    src={activity.icon || "/placeholder.svg"}
                    alt={activity.activity}
                    className="w-28 h-28 mr-5 object-contain flex-shrink-0"
                  />
                  <div className="flex-1 text-center max-w-lg">
                    <div className="text-2xl font-bold mb-2">{activity.activity}</div>
                    <div className="text-xl opacity-90">{activity.description}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {activities.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white w-5" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Schedule Section */}
      <div className="p-5 max-w-4xl mx-auto">
        <div className="text-2xl font-bold mb-5 text-[#7FB069] text-center">
          Our 9-to-5 & Night Time Non-Negotiables Co-Working Schedule
        </div>

        <div className="space-y-4">
          {scheduleItems.map((item) => {
            const isActive = currentActivity === item.id
            const buttonClass =
              item.buttonStyle === "pink"
                ? "bg-gradient-to-r from-[#E26C73] to-[#F4A6AB] hover:from-[#d15b61] hover:to-[#e89599] text-white"
                : "bg-[#7FB069] hover:bg-[#6fa058] text-white"

            return (
              <div
                key={item.id}
                className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-green-50 border-l-4 border-[#7FB069] shadow-md"
                    : "bg-gray-50 border-l-3 border-gray-300"
                }`}
              >
                <div className="min-w-[150px] font-bold text-lg">{item.time}</div>
                <div className="flex-1 text-center flex items-center justify-center gap-2">
                  <span className="text-lg font-medium">{item.activity}</span>
                  {isActive && (
                    <span className="text-[#E26C73] text-sm italic font-light animate-pulse whitespace-nowrap">
                      In Session
                    </span>
                  )}
                </div>
                <div className="min-w-[130px] flex justify-end">
                  <Button asChild className={buttonClass}>
                    <a href={item.joinLink} target="_blank" rel="noopener noreferrer">
                      {item.buttonText}
                    </a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WorkLifeBalanceSchedule
