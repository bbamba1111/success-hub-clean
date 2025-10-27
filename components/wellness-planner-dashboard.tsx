"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, TrendingUp, Zap, Moon, Star, CheckCircle, BarChart3, Activity } from "lucide-react"
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import Link from "next/link"

interface WorkoutSession {
  id: string
  date: Date
  type: string
  duration: number
  intensity: "Low" | "Medium" | "High"
  completed: boolean
}

interface SleepEntry {
  id: string
  date: Date
  hoursSlept: number
  quality: 1 | 2 | 3 | 4 | 5
  digitalDetox: boolean
}

export default function WellnessPlannerDashboard() {
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([])
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])

  useEffect(() => {
    // Load data from localStorage
    const savedWorkouts = localStorage.getItem("workoutSessions")
    const savedSleep = localStorage.getItem("sleepEntries")

    if (savedWorkouts) {
      const parsed = JSON.parse(savedWorkouts)
      setWorkoutSessions(parsed.map((s: any) => ({ ...s, date: new Date(s.date) })))
    }

    if (savedSleep) {
      const parsed = JSON.parse(savedSleep)
      setSleepEntries(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })))
    }
  }, [])

  const getWeeklyWorkoutStats = () => {
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)

    const thisWeekSessions = workoutSessions.filter((session) => {
      const sessionDate = new Date(session.date)
      return sessionDate >= weekStart && sessionDate <= weekEnd
    })

    const completed = thisWeekSessions.filter((s) => s.completed).length
    const total = thisWeekSessions.length
    const totalMinutes = thisWeekSessions.filter((s) => s.completed).reduce((sum, s) => sum + s.duration, 0)

    return { completed, total, totalMinutes, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const getWeeklySleepStats = () => {
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)

    const thisWeekEntries = sleepEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= weekStart && entryDate <= weekEnd
    })

    const avgHours =
      thisWeekEntries.length > 0
        ? Math.round(
            (thisWeekEntries.reduce((sum, entry) => sum + entry.hoursSlept, 0) / thisWeekEntries.length) * 10,
          ) / 10
        : 0

    const avgQuality =
      thisWeekEntries.length > 0
        ? Math.round((thisWeekEntries.reduce((sum, entry) => sum + entry.quality, 0) / thisWeekEntries.length) * 10) /
          10
        : 0

    const detoxDays = thisWeekEntries.filter((entry) => entry.digitalDetox).length

    return { avgHours, avgQuality, detoxDays, totalEntries: thisWeekEntries.length }
  }

  const getMonthlyOverview = () => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    const monthlyWorkouts = workoutSessions.filter((session) => {
      const sessionDate = new Date(session.date)
      return sessionDate >= monthStart && sessionDate <= monthEnd && session.completed
    })

    const monthlySleep = sleepEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= monthStart && entryDate <= monthEnd
    })

    const workoutMinutes = monthlyWorkouts.reduce((sum, s) => sum + s.duration, 0)
    const avgSleepHours =
      monthlySleep.length > 0
        ? Math.round((monthlySleep.reduce((sum, e) => sum + e.hoursSlept, 0) / monthlySleep.length) * 10) / 10
        : 0

    return {
      workoutSessions: monthlyWorkouts.length,
      workoutMinutes,
      sleepEntries: monthlySleep.length,
      avgSleepHours,
    }
  }

  const workoutStats = getWeeklyWorkoutStats()
  const sleepStats = getWeeklySleepStats()
  const monthlyStats = getMonthlyOverview()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wellness Planner Dashboard</h1>
        <p className="text-gray-600">Track your movement, sleep, and overall wellness journey</p>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2 border-[#7FB069]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7FB069]/20 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-[#7FB069]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-[#7FB069]">{workoutStats.completed} workouts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#E26C73]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E26C73]/20 rounded-full flex items-center justify-center">
                <Moon className="h-5 w-5 text-[#E26C73]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Sleep</p>
                <p className="text-2xl font-bold text-[#E26C73]">{sleepStats.avgHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#6B5B95]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6B5B95]/20 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-[#6B5B95]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Minutes</p>
                <p className="text-2xl font-bold text-[#6B5B95]">{workoutStats.totalMinutes}min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#FF6F61]/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6F61]/20 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-[#FF6F61]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sleep Quality</p>
                <p className="text-2xl font-bold text-[#FF6F61]">{sleepStats.avgQuality}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weekly Workout Progress */}
            <Card className="border-2 border-[#7FB069]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#7FB069]">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <img
                      src="/images/workout-meditation-cherry-blossom-new.png"
                      alt="Workout meditation"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  Weekly Workout Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed Sessions</span>
                  <Badge variant="secondary">
                    {workoutStats.completed}/{workoutStats.total}
                  </Badge>
                </div>
                <Progress value={workoutStats.percentage} className="h-2" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Minutes</p>
                    <p className="font-semibold text-[#7FB069]">{workoutStats.totalMinutes} min</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Completion Rate</p>
                    <p className="font-semibold text-[#7FB069]">{workoutStats.percentage}%</p>
                  </div>
                </div>
                <Link href="/workout-planner" scroll={true}>
                  <Button className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white">View Workout Planner</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Weekly Sleep Progress */}
            <Card className="border-2 border-[#E26C73]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#E26C73]">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <img
                      src="/images/sleep-moon-cherry-blossom-new.png"
                      alt="Sleep moon"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  Weekly Sleep Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Avg Hours</p>
                    <p className="font-semibold text-[#E26C73]">{sleepStats.avgHours}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Quality</p>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-[#E26C73]">{sleepStats.avgQuality}</span>
                      <div className="flex">
                        {Array.from({ length: Math.round(sleepStats.avgQuality) }, (_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Digital Detox Days</span>
                  <Badge variant="secondary">{sleepStats.detoxDays}/7</Badge>
                </div>
                <Progress value={(sleepStats.detoxDays / 7) * 100} className="h-2" />
                <Link href="/sleep-tracker" scroll={true}>
                  <Button className="w-full bg-[#E26C73] hover:bg-[#D55A60] text-white">View Sleep Tracker</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Workout Summary */}
            <Card className="border-2 border-[#7FB069]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#7FB069]">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Workout Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#7FB069] mb-2">{monthlyStats.workoutSessions}</div>
                  <p className="text-gray-600">Total Sessions Completed</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-[#7FB069]/10 rounded-lg">
                    <p className="text-gray-600">Total Minutes</p>
                    <p className="font-semibold text-[#7FB069]">{monthlyStats.workoutMinutes}</p>
                  </div>
                  <div className="text-center p-3 bg-[#7FB069]/10 rounded-lg">
                    <p className="text-gray-600">Avg per Session</p>
                    <p className="font-semibold text-[#7FB069]">
                      {monthlyStats.workoutSessions > 0
                        ? Math.round(monthlyStats.workoutMinutes / monthlyStats.workoutSessions)
                        : 0}{" "}
                      min
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Sleep Summary */}
            <Card className="border-2 border-[#E26C73]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#E26C73]">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Sleep Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#E26C73] mb-2">{monthlyStats.avgSleepHours}h</div>
                  <p className="text-gray-600">Average Sleep per Night</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-[#E26C73]/10 rounded-lg">
                    <p className="text-gray-600">Entries Logged</p>
                    <p className="font-semibold text-[#E26C73]">{monthlyStats.sleepEntries}</p>
                  </div>
                  <div className="text-center p-3 bg-[#E26C73]/10 rounded-lg">
                    <p className="text-gray-600">Goal Status</p>
                    <p className="font-semibold text-[#E26C73]">
                      {monthlyStats.avgSleepHours >= 8 ? "✓ On Track" : "⚠ Below Goal"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Workout Goals */}
            <Card className="border-2 border-[#7FB069]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#7FB069]">
                  <Target className="h-5 w-5" />
                  Workout Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Sessions Goal</span>
                    <Badge variant="outline">5 sessions</Badge>
                  </div>
                  <Progress value={(workoutStats.completed / 5) * 100} className="h-2" />
                  <p className="text-xs text-gray-600">{workoutStats.completed}/5 sessions completed this week</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Minutes Goal</span>
                    <Badge variant="outline">150 min</Badge>
                  </div>
                  <Progress value={(workoutStats.totalMinutes / 150) * 100} className="h-2" />
                  <p className="text-xs text-gray-600">{workoutStats.totalMinutes}/150 minutes completed this week</p>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Goals */}
            <Card className="border-2 border-[#E26C73]/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#E26C73]">
                  <Target className="h-5 w-5" />
                  Sleep Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nightly Sleep Goal</span>
                    <Badge variant="outline">8 hours</Badge>
                  </div>
                  <Progress value={(sleepStats.avgHours / 8) * 100} className="h-2" />
                  <p className="text-xs text-gray-600">Currently averaging {sleepStats.avgHours} hours per night</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Digital Detox Goal</span>
                    <Badge variant="outline">7 days</Badge>
                  </div>
                  <Progress value={(sleepStats.detoxDays / 7) * 100} className="h-2" />
                  <p className="text-xs text-gray-600">{sleepStats.detoxDays}/7 digital detox days this week</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#7FB069]" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/workout-planner" scroll={true}>
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Zap className="h-6 w-6 text-[#7FB069]" />
                <span className="text-sm">Add Workout</span>
              </Button>
            </Link>
            <Link href="/sleep-tracker" scroll={true}>
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Moon className="h-6 w-6 text-[#E26C73]" />
                <span className="text-sm">Log Sleep</span>
              </Button>
            </Link>
            <Link href="/audit">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <BarChart3 className="h-6 w-6 text-[#6B5B95]" />
                <span className="text-sm">Take Audit</span>
              </Button>
            </Link>
            <Link href="/cherry-blossom">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Star className="h-6 w-6 text-[#FF6F61]" />
                <span className="text-sm">Cherry Blossom AI</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
