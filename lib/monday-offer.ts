/**
 * Canonical DISPLAY copy for the public "Make Time For More™" commercial
 * architecture. Presentation only — it does NOT drive entitlement,
 * access-control, or checkout logic (those live in lib/entitlements,
 * lib/membership, and the payment providers and are intentionally untouched).
 *
 * PUBLIC MODEL (spec-locked — do not reintroduce the retired entry/credit tiers):
 *
 *   $297 — The Work-Life Balance Business Day™   (the COMPLETE Business Day)
 *   $497 — The Work-Life Balance Business Week™   (Monday–Thursday)
 *
 * There is NO separate entry product, NO mid-day upgrade, and NO sales
 * transition inside the experience. The $297 buys the whole Day; the $497 Week
 * extends it. Retired amounts ($97 / $197 / $800 / $900 / $1,800 / $1,900 /
 * $997 / $1,997) must never appear on any public-facing surface.
 */

export const BUSINESS_DAY = {
  name: "The Work-Life Balance Business Day™",
  price: "$297",
  cadence: "One complete day",
  promise: "One day lets you experience it.",
} as const

export const BUSINESS_WEEK = {
  name: "The Work-Life Balance Business Week™",
  price: "$497",
  cadence: "Monday–Thursday",
  promise: "Four days lets you live the rhythm.",
} as const
