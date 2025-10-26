"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Plus, Trash2, Home } from 'lucide-react'

interface WorkoutEntry {
  id: string
  date: string
  type: string
  duration: number
  notes: string
}

const workoutTypes = [
  "Radio Taiso",
  "Yoga",
  "Pilates",
  "HIIT",
  "Walking",
  "Running",
  "Cycling",
  "Swimming",
  "Strength Training",
  "Dance",
  "Tai Chi",
  "Qigong",
  "Stretching",
  "Barre",
  "Boxing",
  "Kickboxing",
  "Rowing",
  "Elliptical",
  "Jump Rope",
  "Stair Climbing",
  "Zumba",
  "Aerobics",
  "CrossFit",
  "Martial Arts",
  "Rock Climbing",
  "Other",
]

export default function WorkoutPlannerPage() {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([])
  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "",
    duration: 30,
    notes: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dashboardVisited", "true")
      const saved = localStorage.getItem("workouts")
      if (saved) {
        try {
          setWorkouts(JSON.parse(saved))
        } catch (e) {
          console.error("Error loading workouts:", e)
        }
      }
    }
  }, [])

  const saveWorkouts = (updatedWorkouts: WorkoutEntry[]) => {
    setWorkouts(updatedWorkouts)
    if (typeof window !== "undefined") {
      localStorage.setItem("workouts", JSON.stringify(updatedWorkouts))
    }
  }

  const addWorkout = () => {
    if (!newWorkout.type) {
      alert("Please select a workout type")
      return
    }

    const workout: WorkoutEntry = {
      id: Date.now().toString(),
      ...newWorkout,
    }

    saveWorkouts([...workouts, workout])
    setNewWorkout({
      date: new Date().toISOString().split("T")[0],
      type: "",
      duration: 30,
      notes: "",
    })
  }

  const deleteWorkout = (id: string) => {
    saveWorkouts(workouts.filter((w) => w.id !== id))
  }

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const recentWorkouts = workouts.filter((w) => new Date(w.date) >= oneWeekAgo)

    return {
      count: recentWorkouts.length,
      totalMinutes: recentWorkouts.reduce((sum, w) => sum + w.duration, 0),
    }
  }

  const stats = getWeeklyStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#7FB069] mb-4">Workout Planner</h1>
          <p className="text-lg text-gray-600">Track your 30-minute workday workout windows</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-[#7FB069]/30">
            <CardHeader>
              <CardTitle className="text-[#7FB069]">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.count} workouts</div>
              <div className="text-gray-600 mt-2">{stats.totalMinutes} minutes total</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#7FB069]/30">
            <CardHeader>
              <CardTitle className="text-[#7FB069]">Weekly Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{Math.min(stats.count, 4)}/4 days</div>
              <div className="text-gray-600 mt-2">
                {stats.count >= 4 ? "Goal achieved! 🎉" : `${4 - stats.count} more to go`}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 border-2 border-[#7FB069]/30">
          <CardHeader>
            <CardTitle className="text-[#7FB069]">Log New Workout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newWorkout.date}
                  onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="type">Workout Type</Label>
                <select
                  id="type"
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7FB069] focus:border-transparent"
                >
                  <option value="">Select workout type</option>
                  {workoutTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="120"
                value={newWorkout.duration}
                onChange={(e) => setNewWorkout({ ...newWorkout, duration: Number.parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                type="text"
                placeholder="How did you feel? Any achievements?"
                value={newWorkout.notes}
                onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                className="mt-1"
              />
            </div>

            <Button onClick={addWorkout} className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Workout
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#7FB069]/30">
          <CardHeader>
            <CardTitle className="text-[#7FB069]">Workout History</CardTitle>
          </CardHeader>
          <CardContent>
            {workouts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No workouts logged yet. Add your first workout above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workouts
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((workout) => (
                    <div
                      key={workout.id}
                      className="flex items-center justify-between p-4 bg-[#7FB069]/5 rounded-lg border border-[#7FB069]/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{workout.type}</span>
                          <span className="text-sm text-gray-600">{workout.duration} min</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(workout.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        {workout.notes && <div className="text-sm text-gray-600 mt-1 italic">{workout.notes}</div>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWorkout(workout.id)}
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