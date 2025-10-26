"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Moon, Plus, Trash2, Home, TrendingUp, TrendingDown } from 'lucide-react'

interface SleepEntry {
  id: string
  date: string
  bedtime: string
  wakeTime: string
  hoursSlept: number
  quality: number
  notes: string
}

export default function SleepTrackerPage() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    bedtime: "22:00",
    wakeTime: "06:00",
    quality: 3,
    notes: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardVisited", "true")
      const saved = localStorage.getItem("sleepEntries")
      if (saved) {
        try {
          setSleepEntries(JSON.parse(saved))
        } catch (e) {
          console.error("Error loading sleep entries:", e)
        }
      }
    }
  }, [])

  const saveSleepEntries = (updatedEntries: SleepEntry[]) => {
    setSleepEntries(updatedEntries)
    if (typeof window !== "undefined") {
      localStorage.setItem("sleepEntries", JSON.stringify(updatedEntries))
    }
  }

  const calculateHoursSlept = (bedtime: string, wakeTime: string): number => {
    const [bedHour, bedMin] = bedtime.split(":").map(Number)
    const [wakeHour, wakeMin] = wakeTime.split(":").map(Number)

    let bedMinutes = bedHour * 60 + bedMin
    let wakeMinutes = wakeHour * 60 + wakeMin

    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60
    }

    const totalMinutes = wakeMinutes - bedMinutes
    return Math.round((totalMinutes / 60) * 10) / 10
  }

  const addSleepEntry = () => {
    const hoursSlept = calculateHoursSlept(newEntry.bedtime, newEntry.wakeTime)

    const entry: SleepEntry = {
      id: Date.now().toString(),
      date: newEntry.date,
      bedtime: newEntry.bedtime,
      wakeTime: newEntry.wakeTime,
      hoursSlept,
      quality: newEntry.quality,
      notes: newEntry.notes,
    }

    saveSleepEntries([...sleepEntries, entry])
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      bedtime: "22:00",
      wakeTime: "06:00",
      quality: 3,
      notes: "",
    })
  }

  const deleteSleepEntry = (id: string) => {
    saveSleepEntries(sleepEntries.filter((e) => e.id !== id))
  }

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const recentEntries = sleepEntries.filter((e) => new Date(e.date) >= oneWeekAgo)

    if (recentEntries.length === 0) {
      return {
        avgHours: 0,
        avgQuality: 0,
        trend: "neutral" as const,
      }
    }

    const avgHours = recentEntries.reduce((sum, e) => sum + e.hoursSlept, 0) / recentEntries.length
    const avgQuality = recentEntries.reduce((sum, e) => sum + e.quality, 0) / recentEntries.length

    const halfPoint = Math.floor(recentEntries.length / 2)
    const firstHalf = recentEntries.slice(0, halfPoint)
    const secondHalf = recentEntries.slice(halfPoint)

    const firstHalfAvg = firstHalf.reduce((sum, e) => sum + e.hoursSlept, 0) / firstHalf.length
    const secondHalfAvg = secondHalf.reduce((sum, e) => sum + e.hoursSlept, 0) / secondHalf.length

    let trend: "up" | "down" | "neutral" = "neutral"
    if (secondHalfAvg > firstHalfAvg + 0.3) trend = "up"
    if (secondHalfAvg < firstHalfAvg - 0.3) trend = "down"

    return {
      avgHours: Math.round(avgHours * 10) / 10,
      avgQuality: Math.round(avgQuality * 10) / 10,
      trend,
    }
  }

  const stats = getWeeklyStats()

  const getQualityLabel = (quality: number): string => {
    const labels = ["Very Poor", "Poor", "Fair", "Good", "Excellent"]
    return labels[quality - 1] || "Fair"
  }

  const getQualityColor = (quality: number): string => {
    if (quality >= 4) return "text-green-600"
    if (quality >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#7FB069] mb-4">Sleep Tracker</h1>
          <p className="text-lg text-gray-600">Monitor your sleep patterns and quality</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-[#7FB069]/30">
            <CardHeader>
              <CardTitle className="text-[#7FB069]">Avg Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.avgHours}h</div>
              <div className="text-gray-600 mt-2">Last 7 days</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#7FB069]/30">
            <CardHeader>
              <CardTitle className="text-[#7FB069]">Avg Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.avgQuality}/5</div>
              <div className="text-gray-600 mt-2">{getQualityLabel(Math.round(stats.avgQuality))}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#7FB069]/30">
            <CardHeader>
              <CardTitle className="text-[#7FB069]">Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                {stats.trend === "up" && <TrendingUp className="w-12 h-12 text-green-600" />}
                {stats.trend === "down" && <TrendingDown className="w-12 h-12 text-red-600" />}
                {stats.trend === "neutral" && <div className="text-2xl">→</div>}
              </div>
              <div className="text-gray-600 mt-2 text-center capitalize">{stats.trend}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 border-2 border-[#7FB069]/30">
          <CardHeader>
            <CardTitle className="text-[#7FB069]">Log Sleep</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bedtime">Bedtime</Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={newEntry.bedtime}
                  onChange={(e) => setNewEntry({ ...newEntry, bedtime: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="wakeTime">Wake Time</Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={newEntry.wakeTime}
                  onChange={(e) => setNewEntry({ ...newEntry, wakeTime: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="quality">Sleep Quality (1-5)</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewEntry({ ...newEntry, quality: rating })}
                    className={`flex-1 py-2 px-4 rounded-md border-2 transition-all ${
                      newEntry.quality === rating
                        ? "bg-[#7FB069] border-[#7FB069] text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:border-[#7FB069]"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-1 text-center">{getQualityLabel(newEntry.quality)}</div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                type="text"
                placeholder="Dreams, interruptions, how you felt..."
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                className="mt-1"
              />
            </div>

            <Button onClick={addSleepEntry} className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Sleep Entry
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#7FB069]/30">
          <CardHeader>
            <CardTitle className="text-[#7FB069]">Sleep History</CardTitle>
          </CardHeader>
          <CardContent>
            {sleepEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Moon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No sleep entries logged yet. Add your first entry above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sleepEntries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-4 bg-[#7FB069]/5 rounded-lg border border-[#7FB069]/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{entry.hoursSlept}h sleep</span>
                          <span className={`text-sm font-medium ${getQualityColor(entry.quality)}`}>
                            {getQualityLabel(entry.quality)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-gray-600">
                          {entry.bedtime} → {entry.wakeTime}
                        </div>
                        {entry.notes && <div className="text-sm text-gray-600 mt-1 italic">{entry.notes}</div>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSleepEntry(entry.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-8 py-3">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}