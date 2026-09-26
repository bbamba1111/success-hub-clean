"use client"

/**
 * Thought Leadership Studio™ — Template + Draft persistence
 * ---------------------------------------------------------------------------
 * Two localStorage-backed stores, both honoring "always save until the user
 * changes it":
 *
 *   1. Custom templates — when an Executive generates a template for a format
 *      the built-in library does not contain, it is saved here with a minted
 *      Template Code™ so the library grows and the same code is reused next
 *      time instead of regenerating.
 *   2. Drafts — the founder's in-progress fields, transcript, and finished
 *      draft for a given template code, so returning to a piece restores
 *      exactly where they left off.
 */

import type { ThoughtLeadershipFormat } from "./format-registry"

const TEMPLATES_KEY = "harmony:tl:templates:v1"
const DRAFTS_KEY = "harmony:tl:drafts:v1"

export const TL_TEMPLATES_CHANGED_EVENT = "harmony:tl:templates-changed"

export interface ThoughtLeadershipMessage {
  role: "user" | "assistant"
  content: string
}

export interface ThoughtLeadershipDraft {
  templateCode: string
  fieldValues: string[]
  messages: ThoughtLeadershipMessage[]
  finalDraft: string | null
  /** True once the founder has confirmed the build step for this piece. */
  buildConfirmed: boolean
  updatedAt: number
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be full or blocked; fail quietly rather than interrupting.
  }
}

// ── custom templates ────────────────────────────────────────────────────────

export function getStoredTemplates(): ThoughtLeadershipFormat[] {
  return readJson<ThoughtLeadershipFormat[]>(TEMPLATES_KEY, [])
}

export function getStoredTemplate(code: string): ThoughtLeadershipFormat | undefined {
  return getStoredTemplates().find((t) => t.code === code)
}

/** Mint a stable, readable code for a newly generated custom template. */
export function mintTemplateCode(): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `TL-CUSTOM-${suffix}`
}

export function saveStoredTemplate(template: ThoughtLeadershipFormat): ThoughtLeadershipFormat {
  const all = getStoredTemplates()
  const idx = all.findIndex((t) => t.code === template.code)
  if (idx >= 0) all[idx] = template
  else all.push(template)
  writeJson(TEMPLATES_KEY, all)
  if (typeof window !== "undefined") window.dispatchEvent(new Event(TL_TEMPLATES_CHANGED_EVENT))
  return template
}

// ── drafts ──────────────────────────────────────────────────────────────────

function allDrafts(): Record<string, ThoughtLeadershipDraft> {
  return readJson<Record<string, ThoughtLeadershipDraft>>(DRAFTS_KEY, {})
}

export function getDraft(templateCode: string): ThoughtLeadershipDraft | null {
  return allDrafts()[templateCode] ?? null
}

export function saveDraft(draft: Omit<ThoughtLeadershipDraft, "updatedAt">): ThoughtLeadershipDraft {
  const drafts = allDrafts()
  const next: ThoughtLeadershipDraft = { ...draft, updatedAt: Date.now() }
  drafts[draft.templateCode] = next
  writeJson(DRAFTS_KEY, drafts)
  return next
}

export function clearDraft(templateCode: string) {
  const drafts = allDrafts()
  delete drafts[templateCode]
  writeJson(DRAFTS_KEY, drafts)
}
