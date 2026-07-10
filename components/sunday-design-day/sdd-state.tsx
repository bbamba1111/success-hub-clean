"use client"

/**
 * Sunday Design Day™ — session state (Phase 4B.1).
 *
 * SESSION-ONLY persistence: the full week design lives in React state and is
 * mirrored to sessionStorage so a refresh mid-session doesn't lose progress.
 * There is deliberately NO database, no cross-device sync, and no 28-day cycle
 * logic yet — those arrive in Phase 4B.2.
 */

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react"
import {
  PHASES,
  MAX_FOCUS_AREAS,
  DESIGN_SEGMENTS,
  type PhaseId,
  type PhaseStatus,
  type WeeklyReviewFieldId,
} from "@/components/sunday-design-day/sdd-config"

const STORAGE_KEY = "sdd:v1"

export interface DelegationItem {
  id: string
  text: string
  /** Category id from DELEGATION_CATEGORIES, or null when unclassified. */
  category: string | null
}

export interface SegmentDesign {
  /** The strategic standard — "how will I operate?" (persists across the week). */
  rule: string
  planner: string
  /** The Daily Non-Negotiable™ — "what will I absolutely honor tomorrow?" */
  nonNegotiable: string
  committed: boolean
}

export interface SddData {
  weekly: Record<WeeklyReviewFieldId, string>
  focusAreas: string[]
  delegationItems: DelegationItem[]
  segments: Record<string, SegmentDesign>
  ceo: Record<string, string>
  /** ISO timestamp set when the member clicks Install My Week™. */
  installedAt: string | null
}

export interface SddState {
  activePhase: PhaseId
  status: Record<PhaseId, PhaseStatus>
  data: SddData
}

type Action =
  | { type: "HYDRATE"; state: SddState }
  | { type: "SET_ACTIVE"; phase: PhaseId }
  | { type: "UPDATE_WEEKLY"; field: WeeklyReviewFieldId; value: string }
  | { type: "TOGGLE_FOCUS_AREA"; id: string }
  | { type: "ADD_ITEM"; text: string }
  | { type: "SET_ITEM_CATEGORY"; id: string; category: string | null }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "SET_SEGMENT"; segmentId: string; key: "rule" | "planner" | "nonNegotiable"; value: string }
  | { type: "TOGGLE_SEGMENT_COMMIT"; segmentId: string }
  | { type: "SET_CEO"; sectionId: string; value: string }
  | { type: "COMPLETE_PHASE"; phase: PhaseId }
  | { type: "INSTALL_WEEK" }
  | { type: "RESET" }

function emptyData(): SddData {
  const segments: Record<string, SegmentDesign> = {}
  for (const s of DESIGN_SEGMENTS) segments[s.id] = { rule: "", planner: "", nonNegotiable: "", committed: false }
  return {
    weekly: { wins: "", lessons: "", gratitude: "", rulesReview: "", intention: "", declaration: "" },
    focusAreas: [],
    delegationItems: [],
    segments,
    ceo: {},
    installedAt: null,
  }
}

function initialState(): SddState {
  return {
    activePhase: "reality-check",
    status: {
      "reality-check": "in-progress",
      "download-delegate": "not-started",
      "design-tomorrow": "not-started",
      "commit-prepare": "not-started",
    },
    data: emptyData(),
  }
}

function nextPhase(phase: PhaseId): PhaseId | null {
  const idx = PHASES.findIndex((p) => p.id === phase)
  return idx >= 0 && idx < PHASES.length - 1 ? PHASES[idx + 1].id : null
}

function reducer(state: SddState, action: Action): SddState {
  switch (action.type) {
    case "HYDRATE":
      return action.state
    case "SET_ACTIVE":
      return { ...state, activePhase: action.phase }
    case "UPDATE_WEEKLY":
      return { ...state, data: { ...state.data, weekly: { ...state.data.weekly, [action.field]: action.value } } }
    case "TOGGLE_FOCUS_AREA": {
      const has = state.data.focusAreas.includes(action.id)
      if (!has && state.data.focusAreas.length >= MAX_FOCUS_AREAS) return state
      const focusAreas = has
        ? state.data.focusAreas.filter((a) => a !== action.id)
        : [...state.data.focusAreas, action.id]
      return { ...state, data: { ...state.data, focusAreas } }
    }
    case "ADD_ITEM": {
      const text = action.text.trim()
      if (!text) return state
      const item: DelegationItem = { id: crypto.randomUUID(), text, category: null }
      return { ...state, data: { ...state.data, delegationItems: [...state.data.delegationItems, item] } }
    }
    case "SET_ITEM_CATEGORY":
      return {
        ...state,
        data: {
          ...state.data,
          delegationItems: state.data.delegationItems.map((it) =>
            it.id === action.id ? { ...it, category: action.category } : it,
          ),
        },
      }
    case "REMOVE_ITEM":
      return {
        ...state,
        data: { ...state.data, delegationItems: state.data.delegationItems.filter((it) => it.id !== action.id) },
      }
    case "SET_SEGMENT":
      return {
        ...state,
        data: {
          ...state.data,
          segments: {
            ...state.data.segments,
            [action.segmentId]: { ...state.data.segments[action.segmentId], [action.key]: action.value },
          },
        },
      }
    case "TOGGLE_SEGMENT_COMMIT": {
      const seg = state.data.segments[action.segmentId]
      return {
        ...state,
        data: {
          ...state.data,
          segments: { ...state.data.segments, [action.segmentId]: { ...seg, committed: !seg.committed } },
        },
      }
    }
    case "SET_CEO":
      return { ...state, data: { ...state.data, ceo: { ...state.data.ceo, [action.sectionId]: action.value } } }
    case "COMPLETE_PHASE": {
      const next = nextPhase(action.phase)
      const status: Record<PhaseId, PhaseStatus> = { ...state.status, [action.phase]: "complete" }
      if (next && status[next] === "not-started") status[next] = "in-progress"
      return { ...state, status, activePhase: next ?? action.phase }
    }
    case "INSTALL_WEEK":
      return {
        ...state,
        status: { ...state.status, "commit-prepare": "complete" },
        data: { ...state.data, installedAt: new Date().toISOString() },
      }
    case "RESET":
      return initialState()
    default:
      return state
  }
}

const SddContext = createContext<{ state: SddState; dispatch: React.Dispatch<Action> } | null>(null)

export function SddProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  // Hydrate once from sessionStorage.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as SddState
        // Merge onto a fresh baseline so new segment ids are always present.
        const base = initialState()
        dispatch({
          type: "HYDRATE",
          state: {
            activePhase: parsed.activePhase ?? base.activePhase,
            status: { ...base.status, ...parsed.status },
            data: { ...base.data, ...parsed.data, segments: { ...base.data.segments, ...parsed.data?.segments } },
          },
        })
      }
    } catch {
      /* ignore malformed session data */
    }
  }, [])

  // Persist on every change.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage may be unavailable; session-only is best-effort */
    }
  }, [state])

  return <SddContext.Provider value={{ state, dispatch }}>{children}</SddContext.Provider>
}

export function useSdd() {
  const ctx = useContext(SddContext)
  if (!ctx) throw new Error("useSdd must be used within SddProvider")
  return ctx
}

/* ---- Validation helpers (gate phase completion) ------------------------- */

export function isRealityCheckComplete(data: SddData): boolean {
  const { weekly, focusAreas } = data
  const hasCoreReflections = Boolean(weekly.wins.trim() && weekly.intention.trim() && weekly.declaration.trim())
  return hasCoreReflections && focusAreas.length >= 1
}

export function isDelegateComplete(data: SddData): boolean {
  // At least one item captured and every captured item classified.
  return data.delegationItems.length > 0 && data.delegationItems.every((it) => it.category !== null)
}

export function isDesignComplete(data: SddData): boolean {
  // Every segment has at least an Operating Rule™ set.
  return DESIGN_SEGMENTS.every((s) => data.segments[s.id]?.rule.trim())
}

export function canCompletePhase(phase: PhaseId, data: SddData): boolean {
  switch (phase) {
    case "reality-check":
      return isRealityCheckComplete(data)
    case "download-delegate":
      return isDelegateComplete(data)
    case "design-tomorrow":
      return isDesignComplete(data)
    case "commit-prepare":
      return true
    default:
      return false
  }
}
