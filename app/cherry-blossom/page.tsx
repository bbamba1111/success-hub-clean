"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function CherryBlossomPage() {
  const [selectedSpecialist, setSelectedSpecialist] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const specialist = searchParams.get("specialist")
    if (specialist) {
      setSelectedSpecialist(specialist)
    }
  }, [searchParams])

  const specialists = [
    {
      id: "morning-routine",
      title: "Morning GIV•EN™ Routine",
      timeSlot: "9:00 AM - 10:30 AM EST",
      description:
        "Your spiritual alignment and morning routine co-guide for starting each day with intention and divine connection.",
      bgColor: "bg-gradient-to-br from-pink-100 to-pink-50",
      borderColor: "border-pink-200",
      buttonColor: "bg-pink-400 hover:bg-pink-500",
      icon: "/images/tea-cup-icon.png",
      expertise: [
        "GIV•EN Framework implementation",
        "Morning spiritual practices",
        "Intention setting and visualization",
        "Gratitude and divine co-creation",
        "High-vibrational morning routines",
        "Breaking reactive phone habits",
      ],
    },
    {
      id: "workout-window",
      title: "30-Minute Workday Workout Window",
      timeSlot: "10:30 AM - 11:00 AM EST",
      description:
        "Your movement and energy optimization co-guide for integrating physical wellness into your workday.",
      bgColor: "bg-gradient-to-br from-green-100 to-green-50",
      borderColor: "border-green-200",
      buttonColor: "bg-green-400 hover:bg-green-500",
      icon: "/images/yoga-meditation-icon.png",
      expertise: [
        "Workday movement integration",
        "Energy optimization strategies",
        "Desk exercises and stretches",
        "Hormone-supporting workouts",
        "Sustainable fitness habits",
        "Breaking sedentary patterns",
      ],
    },
    {
      id: "lunch-break",
      title: "Extended Healthy Hybrid Lunch Break",
      timeSlot: "11:00 AM - 1:00 PM EST",
      description:
        "Your nourishment and activity-stacking co-guide for combining social connections, business meetings, and healthy eating in beautiful settings.",
      bgColor: "bg-gradient-to-br from-pink-100 to-pink-50",
      borderColor: "border-pink-200",
      buttonColor: "bg-pink-400 hover:bg-pink-500",
      icon: "/images/tea-cup-icon.png",
      expertise: [
        "Hybrid activity stacking & time-saving",
        "Restaurant suggestions by occasion",
        "Fashion tips for lunch meetings",
        "Social + nutrition combinations",
        "Business meetings at garden eateries",
        "Mindful eating in nature settings",
      ],
    },
    {
      id: "ceo-workday",
      title: "4-Hour Focused CEO Workday",
      timeSlot: "1:00 PM - 5:00 PM EST",
      description:
        "Your productivity and business alignment co-guide for working ON your business with divine co-creation and quantum focus.",
      bgColor: "bg-gradient-to-br from-green-100 to-green-50",
      borderColor: "border-green-200",
      buttonColor: "bg-green-400 hover:bg-green-500",
      icon: "/images/ceo-presentation-cherry-blossom-icon.png",
      expertise: [
        "CEO-level strategic thinking",
        "Quantum productivity methods",
        "Divine business co-creation",
        "High-impact task prioritization",
        "Sustainable work boundaries",
        "Revenue-generating focus",
      ],
    },
    {
      id: "lifestyle-experiences",
      title: "Quality of Lifestyle Experiences",
      timeSlot: "Evenings, Weekends & Vacations",
      description:
        "Your joy, creativity, and connection co-guide for immersing in the real wealth of life experiences.",
      bgColor: "bg-gradient-to-br from-pink-100 to-pink-50",
      borderColor: "border-pink-200",
      buttonColor: "bg-pink-400 hover:bg-pink-500",
      icon: "/images/family-vacation-icon.png",
      expertise: [
        "Joy and creativity cultivation",
        "Quality relationship building",
        "Life experience planning",
        "Work-life integration",
        "Celebration and gratitude practices",
        "Eliminating 'someday' thinking",
      ],
    },
    {
      id: "digital-detox",
      title: "Power Down & Unplug Digital Detox",
      timeSlot: "9:00 PM - 10:00 PM EST",
      description:
        "Your evening wind-down and nervous system regulation co-guide for restorative sleep and overnight hormone repair.",
      bgColor: "bg-gradient-to-br from-green-100 to-green-50",
      borderColor: "border-green-200",
      buttonColor: "bg-green-400 hover:bg-green-500",
      icon: "/images/power-down-moon-cherry-blossom-icon.png",
      expertise: [
        "Evening wind-down routines",
        "Digital detox strategies",
        "Nervous system regulation",
        "Sleep optimization",
        "Hormone repair support",
        "Breaking 24/7 'on' habits",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-green-400 rounded-full flex items-center justify-center shadow-lg">
              <img src="/images/cherry.png" alt="Cherry Blossom" className="w-10 h-10" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-pink-500">
                World's First AI-Powered Work-Life Balance & Wellness Planner
              </h1>
              <p className="text-gray-600">Complete Cherry Blossom GPT Suite with Advanced Planning Features</p>
            </div>
            <Link href="/">
              <Button variant="ghost" size="sm" className="ml-auto">
                <X className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Make Time For More™ Monthly Work-Life Balance Experience
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            6 Cherry Blossom Co-Guides with Advanced Planning, Tracking & Insights
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-green-100 text-green-800 border-green-200">AI Planning</Badge>
            <Badge className="bg-pink-100 text-pink-800 border-pink-200">Progress Tracking</Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">Habit Monitoring</Badge>
            <Badge className="bg-pink-100 text-pink-800 border-pink-200">Journal Integration</Badge>
          </div>
        </div>

        {/* Specialists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {specialists.map((specialist) => (
            <Card
              key={specialist.id}
              className={`${specialist.bgColor} ${specialist.borderColor} border-2 hover:shadow-xl transition-all duration-300 cursor-pointer`}
              onClick={() => window.open("https://chat.openai.com", "_blank")}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                    <img
                      src={specialist.icon || "/placeholder.svg"}
                      alt={specialist.title}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{specialist.timeSlot}</p>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-3">{specialist.title}</CardTitle>
                <p className="text-gray-700 text-sm leading-relaxed">{specialist.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">MY EXPERTISE INCLUDES:</h4>
                  <ul className="space-y-2">
                    {specialist.expertise.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={`w-full ${specialist.buttonColor} text-white font-semibold`}
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open("https://chat.openai.com", "_blank")
                  }}
                >
                  Plan Your{" "}
                  {specialist.title.includes("GIV•EN")
                    ? "Morning Routine"
                    : specialist.title.includes("30-Minute")
                      ? "30-Minute Workout"
                      : specialist.title.includes("Extended")
                        ? "Extended Lunch Break"
                        : specialist.title.includes("4-Hour")
                          ? "CEO Workday"
                          : specialist.title.includes("Quality")
                            ? "Quality Lifestyle Experiences"
                            : "Digital Detox"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-green-50 to-pink-50 border-2 border-green-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-pink-500 mb-4">
            🌸 World's First AI-Powered Work-Life Balance Planner 🌸
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
            Each co-guide provides personalized planning, habit tracking, progress insights, journaling prompts, and
            transformation strategies for their specific time slot.
          </p>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button variant="outline" className="px-8 py-3 bg-transparent">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
