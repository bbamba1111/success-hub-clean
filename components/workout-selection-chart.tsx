"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from "date-fns"
import { Trash2 } from "lucide-react"

interface WorkoutSession {
  id: string
  date: string
  type: string
  duration: number
  intensity: "Low" | "Medium" | "High"
  notes: string
}

const workoutTypes = [
  "Cardio",
  "Strength Training",
  "Yoga",
  "Pilates",
  "HIIT",
  "Running",
  "Cycling",
  "Swimming",
  "Walking",
  "Dancing",
  "Boxing",
  "Stretching",
  "Other",
]

export default function WorkoutSelectionChart() {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([])
  const [weeklyGoal, setWeeklyGoal] = useState(150) // minutes per week
  const [newSession, setNewSession] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    type: "Cardio",
    duration: 30,
    intensity: "Medium" as const,
    notes: "",
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("workoutSessions")
    const savedGoal = localStorage.getItem("weeklyWorkoutGoal")

    if (savedSessions) {
      setWorkoutSessions(JSON.parse(savedSessions))
    }
    if (savedGoal) {
      setWeeklyGoal(Number.parseInt(savedGoal))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("workoutSessions", JSON.stringify(workoutSessions))
  }, [workoutSessions])

  useEffect(() => {
    localStorage.setItem("weeklyWorkoutGoal", weeklyGoal.toString())
  }, [weeklyGoal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: newSession.date,
      type: newSession.type,
      duration: newSession.duration,
      intensity: newSession.intensity,
      notes: newSession.notes,
    }

    setWorkoutSessions((prev) => [session, ...prev].slice(0, 50)) // Keep last 50 sessions

    // Reset form
    setNewSession({
      date: format(new Date(), "yyyy-MM-dd"),
      type: "Cardio",
      duration: 30,
      intensity: "Medium",
      notes: "",
    })
  }

  const handleDeleteSession = (id: string) => {
    setWorkoutSessions((prev) => prev.filter((session) => session.id !== id))
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Calculate weekly stats
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  const thisWeekSessions = workoutSessions.filter((session) => {
    const sessionDate = parseISO(session.date)
    return sessionDate >= thisWeekStart && sessionDate <= thisWeekEnd
  })

  const thisWeekMinutes = thisWeekSessions.reduce((sum, session) => sum + session.duration, 0)
  const weekDays = eachDayOfInterval({ start: thisWeekStart, end: thisWeekEnd })

  // Calculate overall stats
  const totalSessions = workoutSessions.length
  const totalMinutes = workoutSessions.reduce((sum, session) => sum + session.duration, 0)
  const averageSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0

  // Calculate last 4 weeks average
  const last4WeeksStart = subDays(thisWeekStart, 21) // 3 weeks before this week
  const last4WeeksSessions = workoutSessions.filter((session) => {
    const sessionDate = parseISO(session.date)
    return sessionDate >= last4WeeksStart && sessionDate <= thisWeekEnd
  })
  const weeklyAverage = last4WeeksSessions.reduce((sum, session) => sum + session.duration, 0) / 4

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#E26C73]">{thisWeekMinutes}</div>
            <div className="text-sm text-gray-600">Minutes This Week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#E26C73]">{weeklyGoal}</div>
            <div className="text-sm text-gray-600">Weekly Goal</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#E26C73]">{Math.round(averageSessionLength)}</div>
            <div className="text-sm text-gray-600">Avg Session (min)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#E26C73]">{totalSessions}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goal Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#E26C73]">Weekly Workout Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="weeklyGoal">Weekly Goal (minutes):</Label>
            <Input
              id="weeklyGoal"
              type="number"
              min="30"
              max="600"
              step="15"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(Number.parseInt(e.target.value) || 150)}
              className="w-24"
            />
            <span className="text-sm text-gray-600">Recommended: 150+ minutes per week</span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>
                Progress: {thisWeekMinutes}/{weeklyGoal} minutes
              </span>
              <span>{Math.round((thisWeekMinutes / weeklyGoal) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#E26C73] h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((thisWeekMinutes / weeklyGoal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Logger */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#E26C73]">Log New Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Workout Type</Label>
                <select
                  id="type"
                  value={newSession.type}
                  onChange={(e) => setNewSession((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E26C73] focus:border-transparent"
                >
                  {workoutTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  max="300"
                  value={newSession.duration}
                  onChange={(e) =>
                    setNewSession((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 30 }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="intensity">Intensity</Label>
                <select
                  id="intensity"
                  value={newSession.intensity}
                  onChange={(e) => setNewSession((prev) => ({ ...prev, intensity: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E26C73] focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="How did it feel? Any achievements?"
                  value={newSession.notes}
                  onChange={(e) => setNewSession((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit" className="bg-[#E26C73] hover:bg-[#D55A60] text-white">
              Log Workout
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Workouts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#E26C73]">Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          {workoutSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No workouts logged yet. Add your first workout above!</p>
          ) : (
            <div className="space-y-3">
              {workoutSessions.slice(0, 10).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="font-medium">{format(parseISO(session.date), "MMM dd")}</div>
                    <div className="text-sm text-gray-600">{session.type}</div>
                    <div className="font-semibold text-[#E26C73]">{session.duration} min</div>
                    <Badge className={getIntensityColor(session.intensity)}>{session.intensity}</Badge>
                    {session.notes && <div className="text-sm text-gray-500 max-w-xs truncate">{session.notes}</div>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSession(session.id)}
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

      {/* This Week's Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#E26C73]">This Week's Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-lg font-semibold">Weekly Total: {thisWeekMinutes} minutes</div>
            <div className="text-sm text-gray-600">
              Goal: {weeklyGoal} minutes | 4-week average: {Math.round(weeklyAverage)} minutes
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayWorkouts = thisWeekSessions.filter(
                (session) => format(parseISO(session.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"),
              )
              const dayMinutes = dayWorkouts.reduce((sum, session) => sum + session.duration, 0)
              const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")

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
                      dayWorkouts.length > 0
                        ? "bg-[#E26C73]/10 border-[#E26C73]/30 text-[#E26C73]"
                        : "bg-gray-50 border-gray-200 text-gray-400"
                    }`}
                  >
                    {dayMinutes > 0 ? `${dayMinutes}m` : "-"}
                  </div>
                  {dayWorkouts.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {dayWorkouts.length} session{dayWorkouts.length > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#E26C73]/10 border border-[#E26C73]/30 rounded"></div>
              <span>Workout Day</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
              <span>Rest Day</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
