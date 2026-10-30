"use client"

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react"
import { currentOrNextBusinessDate, etNow, readClock, type ClockReading } from "./clock"
import { createDemoState } from "./demo-data"
import { bossReducer, type BossAction } from "./reducer"
import type { BossState } from "./types"

const STORAGE_KEY = "the-boss-prototype-v1"

interface BossContextValue {
  state: BossState
  dispatch: (action: BossAction) => void
  clock: ClockReading
  resetDemo: () => void
}

const BossContext = createContext<BossContextValue | null>(null)

const initialDate = () => currentOrNextBusinessDate(etNow().dateISO)

export function BossProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bossReducer, undefined, () => createDemoState(initialDate()))
  const [tick, setTick] = useState(() => Date.now())
  const loaded = useRef(false)

  // Prototype persistence only: state lives in this browser's localStorage.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as BossState
        if (parsed.version === 1) dispatch({ type: "REPLACE", state: parsed })
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
    loaded.current = true
  }, [])

  useEffect(() => {
    if (loaded.current) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const t = window.setInterval(() => setTick(Date.now()), 30_000)
    return () => window.clearInterval(t)
  }, [])

  const clock = useMemo(() => readClock(state.clockMode, state.day.date, new Date(tick)), [state.clockMode, state.day.date, tick])

  const value = useMemo<BossContextValue>(
    () => ({
      state,
      dispatch,
      clock,
      resetDemo: () => {
        window.localStorage.removeItem(STORAGE_KEY)
        dispatch({ type: "REPLACE", state: createDemoState(initialDate()) })
      },
    }),
    [state, clock],
  )

  return <BossContext.Provider value={value}>{children}</BossContext.Provider>
}

export function useBoss() {
  const ctx = useContext(BossContext)
  if (!ctx) throw new Error("useBoss must be used inside BossProvider")
  return ctx
}
