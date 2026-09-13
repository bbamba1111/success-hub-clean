/**
 * Canonical DISPLAY copy for the Monday "Make Time For More™" commercial
 * architecture. This is presentation only — it does NOT drive entitlement,
 * access-control, or checkout logic (those live in lib/entitlements,
 * lib/membership, and the payment providers and are intentionally untouched).
 *
 * The model (spec-locked — do not "simplify" the remaining amounts):
 *
 *   $197 — Redesign Your Entry Into The Workweek™   (entry investment)
 *   Day  — $997 total = $197 entry + $800 remaining
 *   Week — $1,997 total = $197 entry + $1,800 remaining
 *
 * The $197 entry is CREDITED toward either the Day or the Week, so the amounts
 * shown at the Transition Space™ invitation are the remaining $800 / $1,800 —
 * NOT $900 / $1,900, and NOT the full totals.
 */

export const ENTRY = {
  price: "$197",
  name: "Redesign Your Entry Into The Workweek™",
} as const

export const LIVE_DAY = {
  name: "Live The Work-Life Balance Business Day™",
  total: "$997",
  credit: "$197",
  remaining: "$800",
} as const

export const LIVE_WEEK = {
  name: "Live The Work-Life Balance Business Week™",
  total: "$1,997",
  credit: "$197",
  remaining: "$1,800",
} as const
