"use client"

/**
 * Movement History™ + Movement Tracker™ storage — the completed-workout log
 * shared by `WorkoutPlannerWidget` (standalone /workout-planner page) and
 * `TodaysMovementCard` (the real 30-Minute Movement Window™ segment).
 * Both read/write the same `workouts_v2` localStorage key so history stays
 * unified no matter where a session was logged from.
 */

export interface WorkoutEntry {
  id: string
  date: string
  type: string
  duration: number
  declaration: string
  completionStatus: "yes" | "partially" | "no"
  completedDuration?: number
  reflection: string
}

const KEY = "workouts_v2"

/** Fired on window after any save/delete so other mounted widgets can refresh. */
export const MOVEMENT_HISTORY_EVENT = "hl:movement-history:changed"

export function loadMovementHistory(): WorkoutEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as WorkoutEntry[]) : []
  } catch {
    return []
  }
}

export function saveWorkoutEntry(entry: WorkoutEntry): WorkoutEntry[] {
  const updated = [entry, ...loadMovementHistory()]
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(MOVEMENT_HISTORY_EVENT))
  }
  return updated
}

export function deleteWorkoutEntry(id: string): WorkoutEntry[] {
  const updated = loadMovementHistory().filter((w) => w.id !== id)
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event(MOVEMENT_HISTORY_EVENT))
  }
  return updated
}

export interface WeeklyMovementStats {
  weeklySessions: WorkoutEntry[]
  weeklyMinutes: number
  avgPerSession: number
}

export function getWeeklyMovementStats(history: WorkoutEntry[]): WeeklyMovementStats {
  const now = new Date()
  const weeklySessions = history.filter((w) => new Date(w.date) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
  const weeklyMinutes = weeklySessions.reduce((sum, w) => sum + w.duration, 0)
  return {
    weeklySessions,
    weeklyMinutes,
    avgPerSession: weeklySessions.length > 0 ? Math.round(weeklyMinutes / weeklySessions.length) : 0,
  }
}
