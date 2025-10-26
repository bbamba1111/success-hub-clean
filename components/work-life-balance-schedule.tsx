"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Sun, Dumbbell, Coffee, Briefcase, Heart, Moon } from 'lucide-react'

export default function WorkLifeBalanceSchedule() {
  const scheduleItems = [
    {
      time: "6:00 AM - 7:00 AM",
      title: "Morning GIV•EN™ Routine",
      description: "Spiritual alignment, meditation, and intentional morning practices",
      icon: Sun,
      color: "bg-[#E26C73]",
    },
    {
      time: "10:00 AM - 10:30 AM",
      title: "30-Minute Workday Workout Window",
      description: "Movement, energy optimization, and physical wellness",
      icon: Dumbbell,
      color: "bg-[#7FB069]",
    },
    {
      time: "12:00 PM - 1:30 PM",
      title: "Extended Healthy Hybrid Lunch Break",
      description: "Nourishment, social connections, and outdoor experiences",
      icon: Coffee,
      color: "bg-[#E26C73]",
    },
    {
      time: "1:30 PM - 5:30 PM",
      title: "4-Hour Focused CEO Workday",
      description: "Deep work, strategic planning, and high-value activities",
      icon: Briefcase,
      color: "bg-[#7FB069]",
    },
    {
      time: "5:30 PM - 8:00 PM",
      title: "Quality of Lifestyle Experiences",
      description: "Family time, hobbies, creativity, and meaningful experiences",
      icon: Heart,
      color: "bg-[#E26C73]",
    },
    {
      time: "8:00 PM - 10:00 PM",
      title: "Power Down & Unplug Digital Detox",
      description: "Evening wind-down, relaxation, and sleep preparation",
      icon: Moon,
      color: "bg-[#7FB069]",
    },
  ]

  return (
    <div className="space-y-4">
      {scheduleItems.map((item, index) => {
        const Icon = item.icon
        return (
          <Card key={index} className="border-2 border-gray-200 hover:border-[#7FB069] transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`${item.color} p-3 rounded-lg flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.time}
                    </Badge>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
      
      <div className="bg-gradient-to-r from-[#7FB069]/10 to-[#E26C73]/10 p-6 rounded-lg border-2 border-[#7FB069]/20">
        <p className="text-center text-gray-700 font-medium">
          <span className="font-bold text-[#7FB069]">Total Daily Time Investment:</span> Approximately 10.5 hours including 4 hours of focused work time
        </p>
      </div>
    </div>
  )
}
