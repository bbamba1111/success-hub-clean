"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from "date-fns"

interface SleepEntry {
  id: string
  date: string
  bedtime: string
  wakeTime: string
  hoursSlept: number
  quality: "Poor" | "Fair" | "Good" | "Excellent"
  digitalDetoxTime: string
}

export default function SleepTrackingChart() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [sleepGoal, setSleepGoal] = useState(8)
  const [newEntry, setNewEntry] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    bedtime: "",
    wakeTime: "",
    quality: "Good" as const,
    digitalDetoxTime: "21:00",
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("sleepEntries")
    const savedGoal = localStorage.getItem("sleepGoal")

    if (savedEntries) {
      setSleepEntries(JSON.parse(savedEntries))
    }
    if (savedGoal) {
      setSleepGoal(Number.parseInt(savedGoal))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("sleepEntries", JSON.stringify(sleepEntries))
  }, [sleepEntries])

  useEffect(() => {
    localStorage.setItem("sleepGoal", sleepGoal.toString())
  }, [sleepGoal])

  const calculateHoursSlept = (bedtime: string, wakeTime: string): number => {
    if (!bedtime || !wakeTime) return 0

    const [bedHour, bedMin] = bedtime.split(":").map(Number)
    const [wakeHour, wakeMin] = wakeTime.split(":").map(Number)

    const bedtimeMinutes = bedHour * 60 + bedMin
    let waketimeMinutes = wakeHour * 60 + wakeMin

    // If wake time is earlier than bedtime, assume it's the next day
    if (waketimeMinutes <= bedtimeMinutes) {
      waketimeMinutes += 24 * 60
    }

    const totalMinutes = waketimeMinutes - bedtimeMinutes
    return Math.round((totalMinutes / 60) * 10) / 10
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEntry.bedtime || !newEntry.wakeTime) {
      alert("Please fill in both bedtime and wake time")
      return
    }

    const hoursSlept = calculateHoursSlept(newEntry.bedtime, newEntry.wakeTime)

    const entry: SleepEntry = {
      id: Date.now().toString(),
      date: newEntry.date,
      bedtime: newEntry.bedtime,
      wakeTime: newEntry.wakeTime,
      hoursSlept,
      quality: newEntry.quality,
      digitalDetoxTime: newEntry.digitalDetoxTime,
    }

    setSleepEntries((prev) => [entry, ...prev].slice(0, 30)) // Keep last 30 entries

    // Reset form
    setNewEntry({
      date: format(new Date(), "yyyy-MM-dd"),
      bedtime: "",
      wakeTime: "",
      quality: "Good",
      digitalDetoxTime: "21:00",
    })
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Excellent":
        return "bg-green-100 text-green-800 border-green-200"
      case "Good":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Fair":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Poor":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Calculate weekly stats
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  const thisWeekEntries = sleepEntries.filter((entry) => {
    const entryDate = parseISO(entry.date)
    return entryDate >= thisWeekStart && entryDate <= thisWeekEnd
  })

  const averageHoursThisWeek =
    thisWeekEntries.length > 0
      ? thisWeekEntries.reduce((sum, entry) => sum + entry.hoursSlept, 0) / thisWeekEntries.length
      : 0

  const weekDays = eachDayOfInterval({ start: thisWeekStart, end: thisWeekEnd })

  // Calculate overall stats
  const totalEntries = sleepEntries.length
  const averageHours =
    totalEntries > 0 ? sleepEntries.reduce((sum, entry) => sum + entry.hoursSlept, 0) / totalEntries : 0

  const goalMetDays = sleepEntries.filter((entry) => entry.hoursSlept >= sleepGoal).length
  const goalPercentage = totalEntries > 0 ? (goalMetDays / totalEntries) * 100 : 0

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#E26C73]">{averageHours.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">Average Sleep</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#E26C73]">{sleepGoal}h</div>
            <div className="text-sm text-gray-600">Sleep Goal</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#E26C73]">{goalPercentage.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Goal Achievement</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#E26C73]">{totalEntries}</div>
            <div className="text-sm text-gray-600">Days Tracked</div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Goal Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#E26C73]">Sleep Goal Setting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="sleepGoal">Daily Sleep Goal (hours):</Label>
            <Input
              id="sleepGoal"
              type="number"
              min="4"
              max="12"
              step="0.5"
              value={sleepGoal}
              onChange={(e) => setSleepGoal(Number.parseFloat(e.target.value) || 8)}
              className="w-24"
            />
            <span className="text-sm text-gray-600">Recommended: 7-9 hours for adults</span>
          </div>
        </CardContent>
      </Card>

      {/* Sleep & Digital Detox Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#E26C73]">Sleep & Digital Detox Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bedtime">Bedtime</Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={newEntry.bedtime}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, bedtime: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="wakeTime">Wake Time</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={newEntry.wakeTime}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, wakeTime: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="quality">Sleep Quality</Label>
                <select
                  id="quality"
                  value={newEntry.quality}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, quality: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E26C73] focus:border-transparent"
                >
                  <option value="Poor">Poor</option>
                  <option value="Fair">Fair</option>
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>

              <div>
                <Label htmlFor="digitalDetox">Digital Detox Start</Label>
                <Input
                  id="digitalDetox"
                  type="time"
                  value={newEntry.digitalDetoxTime}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, digitalDetoxTime: e.target.value }))}
                />
                <div className="text-xs text-gray-500 mt-1">Recommended: 9-10 PM</div>
              </div>
            </div>

            <Button type="submit" className="bg-[#E26C73] hover:bg-[#D55A60] text-white">
              Add Sleep Entry
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Sleep Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#E26C73]">Recent Sleep Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {sleepEntries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sleep entries yet. Add your first entry above!</p>
          ) : (
            <div className="space-y-3">
              {sleepEntries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="font-medium">{format(parseISO(entry.date), "MMM dd")}</div>
                    <div className="text-sm text-gray-600">
                      {entry.bedtime} → {entry.wakeTime}
                    </div>
                    <div className="font-semibold text-[#E26C73]">{entry.hoursSlept}h</div>
                    <Badge className={getQualityColor(entry.quality)}>{entry.quality}</Badge>
                  </div>
                  <div className="text-sm text-gray-500">Detox: {entry.digitalDetoxTime}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* This Week's Sleep Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#E26C73]">This Week's Sleep Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-lg font-semibold">Weekly Average: {averageHoursThisWeek.toFixed(1)} hours</div>
            <div className="text-sm text-gray-600">Goal: {sleepGoal} hours per night</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayEntry = thisWeekEntries.find(
                (entry) => format(parseISO(entry.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"),
              )

              const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
              const metGoal = dayEntry && dayEntry.hoursSlept >= sleepGoal

              return (
                <div key={day.toISOString()} className="text-center">
                  <div className={`text-xs font-medium mb-1 ${isToday ? "text-[#E26C73]" : "text-gray-600"}`}>
                    {format(day, "EEE")}
                  </div>
                  <div className={`text-xs mb-1 ${isToday ? "text-[#E26C73]" : "text-gray-500"}`}>
                    {format(day, "dd")}
                  </div>
                  <div
                    className={`w-full h-16 rounded border-2 flex items-end justify-center pb-1 text-xs font-medium ${
                      dayEntry
                        ? metGoal
                          ? "bg-green-100 border-green-300 text-green-800"
                          : "bg-yellow-100 border-yellow-300 text-yellow-800"
                        : "bg-gray-50 border-gray-200 text-gray-400"
                    }`}
                  >
                    {dayEntry ? `${dayEntry.hoursSlept}h` : "-"}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Goal Met</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span>Below Goal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
              <span>No Data</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
