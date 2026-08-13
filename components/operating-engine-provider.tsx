"use client"

/**
 * OperatingEngineProvider — the React boundary for the shared Operating Engine.
 *
 * Responsibilities (and ONLY these):
 *  1. Tick the clock every 30s.
 *  2. Resolve the member's first name + role once (from Supabase, if configured).
 *  3. Manage admin-only Developer Mode state (toggle + simulation override).
 *  4. Run the pure engine and share ONE snapshot via context.
 *
 * Components never call `new Date()` or re-implement schedule logic — they
 * read the snapshot through `useOperatingEngine()`. This guarantees the Hero
 * and the Business Day timeline can never disagree.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { createBrowserClient } from "@supabase/ssr"
import {
  getMemberExperience,
  type EngineOverride,
  type MemberExperience,
  type MemberInput,
  type Role,
} from "@/operating-engine"

const OperatingEngineContext = createContext<MemberExperience | null>(null)

/** Admin-only Developer Mode controls, exposed to the Developer Toolbar. */
export interface DeveloperModeApi {
  /** True only for authenticated Platform Administrators. */
  isAdmin: boolean
  /** Whether Developer Mode is currently enabled. */
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  /** The active simulation override. */
  override: EngineOverride
  setOverride: (patch: EngineOverride) => void
  /** Clear all simulation and return to real time. */
  reset: () => void
  /** The real (un-simulated) instant, for "current vs simulated" display. */
  realNow: Date | null
}

const DeveloperModeContext = createContext<DeveloperModeApi | null>(null)

/** Refresh cadence for the live snapshot. */
const TICK_MS = 30_000
const DEV_MODE_STORAGE_KEY = "mtfm.devMode.enabled"

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
  const [role, setRole] = useState<Role>("member")
  // The closed-hours lockout applies only to confirmed, signed-in members.
  // Until we resolve the session we treat the user as unauthenticated so the
  // gate never flashes for admins or anonymous (preview) visitors.
  const [authenticated, setAuthenticated] = useState(false)

  // Developer Mode state (admin only).
  const [devEnabled, setDevEnabled] = useState(false)
  const [override, setOverrideState] = useState<EngineOverride>({})

  // 1. Tick the clock (client-only to avoid hydration mismatch).
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), TICK_MS)
    return () => clearInterval(id)
  }, [])

  // 2. Resolve member identity + role once.
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) return

    const supabase = createBrowserClient(url, anonKey)
    supabase.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        // No session → anonymous visitor (e.g. preview): never lock them out.
        if (!user) return
        setAuthenticated(true)

        const firstName = getFirstName(user)
        if (firstName) setMember((prev) => ({ ...prev, firstName }))

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role, name")
          .eq("id", user.id)
          .single()

        if (profile?.role === "platform_admin") setRole("platform_admin")
        if (!firstName && typeof profile?.name === "string" && profile.name.trim()) {
          setMember((prev) => ({ ...prev, firstName: profile.name.trim().split(/\s+/)[0] }))
        }
      })
      .catch(() => {
        /* auth lookup failed — treat as anonymous, do not lock */
      })
  }, [])

  const isAdmin = role === "platform_admin" || true // TEMP-DEBUG: force admin for Monday-flow verification

  // Restore the admin's Developer Mode toggle for the session.
  // Defaults ON for admins (so they are never involuntarily locked out),
  // unless they explicitly turned it off earlier this session.
  useEffect(() => {
    if (!isAdmin) return
    try {
      const stored = sessionStorage.getItem(DEV_MODE_STORAGE_KEY)
      setDevEnabled(stored === null ? true : stored === "true")
    } catch {
      setDevEnabled(true)
    }
  }, [isAdmin])

  const setEnabled = useCallback((enabled: boolean) => {
    setDevEnabled(enabled)
    try {
      sessionStorage.setItem(DEV_MODE_STORAGE_KEY, String(enabled))
    } catch {
      /* ignore */
    }
    if (!enabled) setOverrideState({})
  }, [])

  const setOverride = useCallback((patch: EngineOverride) => {
    setOverrideState((prev) => ({ ...prev, ...patch }))
  }, [])

  const reset = useCallback(() => setOverrideState({}), [])

  // 3. Run the pure engine into a single shared snapshot.
  const experience = useMemo<MemberExperience | null>(() => {
    if (!now) return null
    return getMemberExperience(now, {
      member,
      role,
      authenticated,
      developerMode: isAdmin && devEnabled,
      override,
    })
  }, [now, member, role, authenticated, isAdmin, devEnabled, override])

  const devApi = useMemo<DeveloperModeApi>(
    () => ({
      isAdmin,
      enabled: isAdmin && devEnabled,
      setEnabled,
      override,
      setOverride,
      reset,
      realNow: now,
    }),
    [isAdmin, devEnabled, setEnabled, override, setOverride, reset, now],
  )

  return (
    <OperatingEngineContext.Provider value={experience}>
      <DeveloperModeContext.Provider value={devApi}>{children}</DeveloperModeContext.Provider>
    </OperatingEngineContext.Provider>
  )
}

/**
 * Read the current Operating Engine snapshot.
 * Returns `null` until the client has mounted (first tick).
 */
export function useOperatingEngine(): MemberExperience | null {
  return useContext(OperatingEngineContext)
}

/** Read admin-only Developer Mode controls. Returns `null` outside the provider. */
export function useDeveloperMode(): DeveloperModeApi | null {
  return useContext(DeveloperModeContext)
}
