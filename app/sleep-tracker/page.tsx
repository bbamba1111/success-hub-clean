"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Moon, Clock, TrendingUp, Target, Plus, Trash2, Home } from "lucide-react"

interface SleepEntry {
  id: string
  date: string
  bedtime: string
  wakeTime: string
  quality: "Poor" | "Fair" | "Good" | "Excellent"
  notes: string
}

export default function SleepTrackerPage() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    bedtime: "22:00",
    wakeTime: "06:00",
    quality: "Good" as const,
    notes: "",
  })

  useEffect(() => {
    // Mark dashboard as visited
    localStorage.setItem("dashboardVisited", "true")

    // Load sleep entries from localStorage
    const savedEntries = localStorage.getItem("sleepEntries")
    if (savedEntries) {
      setSleepEntries(JSON.parse(savedEntries))
    }
  }, [])

  const calculateDuration = (bedtime: string, wakeTime: string) => {
    const [bedHour, bedMin] = bedtime.split(":").map(Number)
    const [wakeHour, wakeMin] = wakeTime.split(":").map(Number)

    const bedMinutes = bedHour * 60 + bedMin
    let wakeMinutes = wakeHour * 60 + wakeMin

    // Handle crossing midnight
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60
    }

    const totalMinutes = wakeMinutes - bedMinutes
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return { hours, minutes, totalMinutes }
  }

  const addEntry = () => {
    const entry: SleepEntry = {
      id: Date.now().toString(),
      ...newEntry,
    }

    const updatedEntries = [...sleepEntries, entry]
    setSleepEntries(updatedEntries)
    localStorage.setItem("sleepEntries", JSON.stringify(updatedEntries))

    // Reset form
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      bedtime: "22:00",
      wakeTime: "06:00",
      quality: "Good",
      notes: "",
    })
  }

  const deleteEntry = (id: string) => {
    const updatedEntries = sleepEntries.filter((e) => e.id !== id)
    setSleepEntries(updatedEntries)
    localStorage.setItem("sleepEntries", JSON.stringify(updatedEntries))
  }

  const getWeeklyStats = () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const weeklyEntries = sleepEntries.filter((e) => {
      const entryDate = new Date(e.date)
      return entryDate >= weekAgo && entryDate <= now
    })

    const totalMinutes = weeklyEntries.reduce((sum, e) => {
      const { totalMinutes } = calculateDuration(e.bedtime, e.wakeTime)
      return sum + totalMinutes
    }, 0)

    return {
      count: weeklyEntries.length,
      averageHours: weeklyEntries.length > 0 ? totalMinutes / weeklyEntries.length / 60 : 0,
    }
  }

  const encouragingMessages = [
    "Good for you!",
    "Great job!",
    "Awesome YOU!",
    "You're crushing it!",
    "Keep it up!",
    "Sleep champion!",
    "Well done!",
    "You're amazing!",
    "Fantastic work!",
    "Sleep goals achieved!",
  ]

  const getEncouragingMessage = () => {
    return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
  }

  const shouldShowEncouragement = (hours: number, quality: string) => {
    return hours >= 8 && hours <= 9 && (quality === "Good" || quality === "Excellent")
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

  const stats = getWeeklyStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#E26C73] to-[#7FB069] rounded-full flex items-center justify-center">
              <Moon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#E26C73] mb-4">Sleep Tracker</h1>
          <p className="text-2xl text-gray-600">Monitor your sleep patterns and quality</p>
        </div>

        {/* Weekly Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-[#E26C73]/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-medium text-gray-600 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Nights Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E26C73]">{stats.count}</div>
              <p className="text-xl text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#E26C73]/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Average Sleep
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E26C73]">{stats.averageHours.toFixed(1)}h</div>
              <p className="text-xl text-gray-500 mt-1">Per night</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#E26C73]/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Sleep Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E26C73]">7-9h</div>
              <p className="text-xl text-gray-500 mt-1">Recommended</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Sleep Entry Form */}
        <Card className="mb-8 border-2 border-[#E26C73]/30">
          <CardHeader>
            <CardTitle className="text-[#E26C73] flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Log Sleep Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-xl">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality" className="text-xl">
                  Sleep Quality
                </Label>
                <select
                  id="quality"
                  value={newEntry.quality}
                  onChange={(e) => setNewEntry({ ...newEntry, quality: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E26C73] focus:border-transparent text-xl"
                >
                  <option value="Poor">Poor</option>
                  <option value="Fair">Fair</option>
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedtime" className="text-xl">
                  Bedtime
                </Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={newEntry.bedtime}
                  onChange={(e) => setNewEntry({ ...newEntry, bedtime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wakeTime" className="text-xl">
                  Wake Time
                </Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={newEntry.wakeTime}
                  onChange={(e) => setNewEntry({ ...newEntry, wakeTime: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-xl">
                  Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="How did you sleep? Any observations?"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  rows={3}
                  className="text-xl"
                />
              </div>

              <div className="md:col-span-2 p-4 bg-[#E26C73]/5 rounded-lg">
                <p className="text-xl text-gray-700">
                  <strong>Estimated Sleep Duration:</strong> {(() => {
                    const { hours, minutes } = calculateDuration(newEntry.bedtime, newEntry.wakeTime)
                    return `${hours}h ${minutes}m`
                  })()}
                </p>
              </div>
            </div>

            <Button onClick={addEntry} className="w-full mt-6 bg-[#E26C73] hover:bg-[#D55A60] text-white text-xl py-6">
              <Plus className="mr-2 h-4 w-4" />
              Add Sleep Entry
            </Button>
          </CardContent>
        </Card>

        {/* Sleep History */}
        <Card className="mb-8 border-2 border-[#E26C73]/30">
          <CardHeader>
            <CardTitle className="text-[#E26C73] flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sleep History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sleepEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-xl">
                No sleep entries yet. Add your first entry above!
              </p>
            ) : (
              <div className="space-y-4">
                {sleepEntries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => {
                    const { hours, minutes } = calculateDuration(entry.bedtime, entry.wakeTime)
                    const showEncouragement = shouldShowEncouragement(hours, entry.quality)

                    return (
                      <div
                        key={entry.id}
                        className="flex items-start justify-between p-4 bg-gradient-to-br from-[#E26C73]/5 to-transparent rounded-lg border border-[#E26C73]/20"
                      >
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <Badge className={getQualityColor(entry.quality)}>{entry.quality}</Badge>
                            <span className="text-xl text-gray-600 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(entry.date).toLocaleDateString()}
                            </span>
                            <span className="text-xl text-gray-600 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {hours}h {minutes}m
                            </span>
                            {showEncouragement && (
                              <span className="text-xl font-semibold text-[#E26C73] flex items-center gap-1">
                                🌸 {getEncouragingMessage()}
                              </span>
                            )}
                          </div>
                          <div className="text-xl text-gray-600">
                            {entry.bedtime} → {entry.wakeTime}
                          </div>
                          {entry.notes && <p className="text-xl text-gray-700 mt-2">{entry.notes}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Home Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-[#E26C73] text-[#E26C73] hover:bg-[#E26C73] hover:text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
