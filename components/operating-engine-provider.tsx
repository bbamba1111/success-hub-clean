"use client"

/**
 * OperatingEngineProvider — the React boundary for the shared Operating Engine.
 *
 * Responsibilities (and ONLY these):
 *  1. Tick the clock every 30s.
 *  2. Resolve the member's first name once (from Supabase, if configured).
 *  3. Run the pure engine and share ONE snapshot via context.
 *
 * Components never call `new Date()` or re-implement schedule logic — they
 * read the snapshot through `useOperatingEngine()`. This guarantees the Hero
 * and the Business Day timeline can never disagree.
 */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { getMemberExperience, type MemberExperience, type MemberInput } from "@/operating-engine"

const OperatingEngineContext = createContext<MemberExperience | null>(null)

/** Refresh cadence for the live snapshot. */
const TICK_MS = 30_000

function getFirstName(user: { user_metadata?: Record<string, unknown>; email?: string } | null): string | undefined {
  if (!user) return undefined
  const meta = user.user_metadata ?? {}
  const candidate =
    (meta.first_name as string) ||
    (meta.firstName as string) ||
    (meta.full_name as string) ||
    (meta.name as string) ||
    ""
  if (candidate.trim()) return candidate.trim().split(/\s+/)[0]
  if (user.email) return user.email.split("@")[0]
  return undefined
}

export function OperatingEngineProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<Date | null>(null)
  const [member, setMember] = useState<MemberInput>({})

  // 1. Tick the clock (client-only to avoid hydration mismatch).
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), TICK_MS)
    return () => clearInterval(id)
  }, [])

  // 2. Resolve member identity once.
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) return

    const supabase = createBrowserClient(url, anonKey)
    supabase.auth.getUser().then(({ data: { user } }) => {
      const firstName = getFirstName(user)
      if (firstName) setMember((prev) => ({ ...prev, firstName }))
    })
  }, [])

  // 3. Run the pure engine into a single shared snapshot.
  const experience = useMemo<MemberExperience | null>(() => {
    if (!now) return null
    return getMemberExperience(now, { member })
  }, [now, member])

  return <OperatingEngineContext.Provider value={experience}>{children}</OperatingEngineContext.Provider>
}

/**
 * Read the current Operating Engine snapshot.
 * Returns `null` until the client has mounted (first tick).
 */
export function useOperatingEngine(): MemberExperience | null {
  return useContext(OperatingEngineContext)
}
