"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Dumbbell, Clock, TrendingUp, Target, Plus, Trash2, Home } from "lucide-react"

interface WorkoutEntry {
  id: string
  date: string
  type: string
  duration: number | string
  notes: string
}

const WORKOUT_TYPES = [
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

const ENCOURAGING_MESSAGES = [
  "You're crushing it!",
  "Way to go!",
  "Keep up the amazing work!",
  "You're unstoppable!",
  "Fantastic effort!",
  "You're a rockstar!",
  "Incredible dedication!",
  "You're on fire!",
]

const getRandomMessage = () => {
  return ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)]
}

export default function WorkoutPlannerPage() {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([])
  const [newWorkout, setNewWorkout] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "",
    duration: 30,
    notes: "",
  })

  useEffect(() => {
    // Mark dashboard as visited
    localStorage.setItem("dashboardVisited", "true")

    // Load workouts from localStorage
    const savedWorkouts = localStorage.getItem("workouts")
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts))
    }
  }, [])

  const addWorkout = () => {
    if (!newWorkout.type) return

    const workout: WorkoutEntry = {
      id: Date.now().toString(),
      ...newWorkout,
    }

    const updatedWorkouts = [...workouts, workout]
    setWorkouts(updatedWorkouts)
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts))

    // Reset form
    setNewWorkout({
      date: new Date().toISOString().split("T")[0],
      type: "",
      duration: 30,
      notes: "",
    })
  }

  const deleteWorkout = (id: string) => {
    const updatedWorkouts = workouts.filter((w) => w.id !== id)
    setWorkouts(updatedWorkouts)
    localStorage.setItem("workouts", JSON.stringify(updatedWorkouts))
  }

  const getWeeklyStats = () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const weeklyWorkouts = workouts.filter((w) => {
      const workoutDate = new Date(w.date)
      return workoutDate >= weekAgo && workoutDate <= now
    })

    return {
      count: weeklyWorkouts.length,
      totalMinutes: weeklyWorkouts.reduce((sum, w) => sum + (typeof w.duration === "number" ? w.duration : 0), 0),
    }
  }

  const stats = getWeeklyStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#7FB069] mb-4">Workout Planner</h1>
          <p className="text-xl text-gray-600">Track your 30-minute workday workout sessions</p>
        </div>

        {/* Weekly Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-[#7FB069]/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-medium text-gray-600 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Weekly Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7FB069]">{stats.count}</div>
              <p className="text-xl text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#7FB069]/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Total Minutes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7FB069]">{stats.totalMinutes}</div>
              <p className="text-xl text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#7FB069]/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Average Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#7FB069]">
                {stats.count > 0 ? Math.round(stats.totalMinutes / stats.count) : 0}
              </div>
              <p className="text-xl text-gray-500 mt-1">Minutes per workout</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Workout Form */}
        <Card className="mb-8 border-2 border-[#7FB069]/30">
          <CardHeader>
            <CardTitle className="text-[#7FB069] flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Workout
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
                  value={newWorkout.date}
                  onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                  className="text-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-xl">
                  Workout Type
                </Label>
                <select
                  id="type"
                  value={newWorkout.type}
                  onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7FB069] focus:border-transparent text-xl"
                  required
                >
                  <option value="">Select workout type</option>
                  {WORKOUT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-xl">
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={newWorkout.duration}
                  onChange={(e) => {
                    const value = e.target.value
                    setNewWorkout({
                      ...newWorkout,
                      duration: value === "" ? ("" as any) : Number.parseInt(value) || 0,
                    })
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "" || Number.parseInt(e.target.value) < 1) {
                      setNewWorkout({ ...newWorkout, duration: 30 })
                    }
                  }}
                  className="text-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xl">
                  Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="How did you feel? Any observations?"
                  value={newWorkout.notes}
                  onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                  rows={3}
                  className="text-xl"
                />
              </div>
            </div>

            <Button
              onClick={addWorkout}
              className="w-full mt-6 bg-[#7FB069] hover:bg-[#6FA055] text-white text-xl py-6"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Workout
            </Button>
          </CardContent>
        </Card>

        {/* Workout History */}
        <Card className="mb-8 border-2 border-[#7FB069]/30">
          <CardHeader>
            <CardTitle className="text-[#7FB069] flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Workout History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workouts.length === 0 ? (
              <p className="text-xl text-gray-500 text-center py-8">
                No workouts logged yet. Add your first workout above!
              </p>
            ) : (
              <div className="space-y-4">
                {workouts
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((workout) => (
                    <div
                      key={workout.id}
                      className="flex items-start justify-between p-4 bg-gradient-to-br from-[#7FB069]/5 to-transparent rounded-lg border border-[#7FB069]/20"
                    >
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-[#7FB069] text-white text-xl px-3 py-1">{workout.type}</Badge>
                          <span className="text-xl text-gray-600 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(workout.date).toLocaleDateString()}
                          </span>
                          <span className="text-xl text-gray-600 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {typeof workout.duration === "number" ? workout.duration : 0} min
                          </span>
                        </div>
                        {workout.notes && <p className="text-xl text-gray-700 mt-2">{workout.notes}</p>}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-2xl">🌸</span>
                          <span className="text-2xl">🙌</span>
                          <span className="text-xl font-semibold text-[#E26C73] italic">{getRandomMessage()}</span>
                        </div>
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

        {/* Back to Home Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white text-xl py-6 px-8"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
