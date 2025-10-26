"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Moon, Plus, Trash2, Home } from 'lucide-react'

interface SleepEntry {
  id: string
  date: string
  bedtime: string
  wakeTime: string
  quality: string
  notes: string
}

export default function SleepTrackerPage() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    bedtime: "22:00",
    wakeTime: "06:00",
    quality: "",
    notes: "",
  })

  useEffect(() => {
    localStorage.setItem("dashboardVisited", "true")
    const saved = localStorage.getItem("sleepEntries")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const validEntries = parsed.filter((entry: SleepEntry) => entry.bedtime && entry.wakeTime && entry.date)
        setSleepEntries(validEntries)
      } catch (e) {
        console.error("Error loading sleep entries:", e)
      }
    }
  }, [])

  const saveEntries = (updatedEntries: SleepEntry[]) => {
    setSleepEntries(updatedEntries)
    localStorage.setItem("sleepEntries", JSON.stringify(updatedEntries))
  }

  const calculateDuration = (bedtime: string, wakeTime: string): { hours: number; minutes: number } => {
    if (!bedtime || !wakeTime) {
      return { hours: 0, minutes: 0 }
    }

    try {
      const [bedHour, bedMin] = bedtime.split(":").map(Number)
      const [wakeHour, wakeMin] = wakeTime.split(":").map(Number)

      let totalMinutes = wakeHour * 60 + wakeMin - (bedHour * 60 + bedMin)

      if (totalMinutes < 0) {
        totalMinutes += 24 * 60
      }

      return {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
      }
    } catch (e) {
      console.error("Error calculating duration:", e)
      return { hours: 0, minutes: 0 }
    }
  }

  const addEntry = () => {
    if (!newEntry.quality) {
      alert("Please select sleep quality")
      return
    }

    const entry: SleepEntry = {
      id: Date.now().toString(),
      ...newEntry,
    }

    saveEntries([...sleepEntries, entry])
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      bedtime: "22:00",
      wakeTime: "06:00",
      quality: "",
      notes: "",
    })
  }

  const deleteEntry = (id: string) => {
    saveEntries(sleepEntries.filter((e) => e.id !== id))
  }

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const recentEntries = sleepEntries.filter((e) => new Date(e.date) >= oneWeekAgo)

    const totalMinutes = recentEntries.reduce((sum, entry) => {
      const duration = calculateDuration(entry.bedtime, entry.wakeTime)
      return sum + (duration.hours * 60 + duration.minutes)
    }, 0)

    const avgMinutes = recentEntries.length > 0 ? Math.round(totalMinutes / recentEntries.length) : 0

    return {
      count: recentEntries.length,
      avgHours: Math.floor(avgMinutes / 60),
      avgMinutes: avgMinutes % 60,
    }
  }

  const stats = getWeeklyStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#E26C73] mb-4">Sleep Tracker</h1>
          <p className="text-lg text-gray-600">Monitor your power down & unplug routine</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-[#E26C73]/30">
            <CardHeader>
              <CardTitle className="text-[#E26C73]">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.count} nights</div>
              <div className="text-gray-600 mt-2">
                Avg: {stats.avgHours}h {stats.avgMinutes}m per night
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#E26C73]/30">
            <CardHeader>
              <CardTitle className="text-[#E26C73]">Sleep Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">7-8 hours</div>
              <div className="text-gray-600 mt-2">
                {stats.avgHours >= 7 && stats.avgHours <= 9 ? "On track! 🌙" : "Keep improving"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 border-2 border-[#E26C73]/30">
          <CardHeader>
            <CardTitle className="text-[#E26C73]">Log Sleep Entry</CardTitle>
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
              <Label htmlFor="quality">Sleep Quality</Label>
              <select
                id="quality"
                value={newEntry.quality}
                onChange={(e) => setNewEntry({ ...newEntry, quality: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E26C73] focus:border-transparent"
              >
                <option value="">Select quality</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                type="text"
                placeholder="How do you feel? Any dreams or disruptions?"
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                className="mt-1"
              />
            </div>

            <Button onClick={addEntry} className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Sleep Entry
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#E26C73]/30">
          <CardHeader>
            <CardTitle className="text-[#E26C73]">Sleep History</CardTitle>
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
                  .map((entry) => {
                    const duration = calculateDuration(entry.bedtime, entry.wakeTime)
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-[#E26C73]/5 rounded-lg border border-[#E26C73]/20"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900">{entry.quality}</span>
                            <span className="text-sm text-gray-600">
                              {duration.hours}h {duration.minutes}m
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

        <div className="mt-8 text-center">
          <Link href="/">
            <Button className="bg-[#E26C73] hover:bg-[#D55A60] text-white px-8 py-3">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}