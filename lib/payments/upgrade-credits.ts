/**
 * Upgrade Credit architecture.
 *
 * The product ladder is cumulative: a founder's prior investment follows them
 * to the next level. Moving up the ladder is NOT a discount — the ladder price
 * never changes. Instead, the amount already invested at the current level is
 * credited toward the next one, and the founder pays only the difference.
 *
 *   Redesign ($497)      → Business Day ($1,997)   credit $497   → pay $1,500
 *   Business Day ($1,997) → Business Week ($3,997)  credit $1,997 → pay $2,000
 *
 * Cumulative investment: $497 → $1,997 → $3,997
 * Additional paid per step: $497 → $1,500 → $2,000
 *
 * Installation is by-application and excluded from automatic credit math.
 *
 * Customer-facing principle: "Your investment follows you." When a founder
 * moves to the next level, their previous investment is credited toward the
 * next experience — it is never lost.
 */
import { getPlanByLevel } from "./config"
import type { ProductLevel, UpgradeCredit } from "./types"

/** Ordered public ladder used for upgrade math (excludes by-application Installation). */
export const CREDIT_LADDER: ProductLevel[] = ["redesign", "business-day", "business-week"]

/**
 * The credit and additional amount for moving from a previously purchased
 * level up to a higher one. Returns null when it isn't a valid up-ladder move
 * or when either level has no numeric price.
 *
 * The credit equals the founder's prior investment at `from`; their previous
 * investment is never lost. Skipping a rung (e.g. Redesign → Week) still
 * credits the prior investment and charges the remaining difference.
 */
export function getUpgradeCredit(from: ProductLevel, to: ProductLevel): UpgradeCredit | null {
  const fromIndex = CREDIT_LADDER.indexOf(from)
  const toIndex = CREDIT_LADDER.indexOf(to)
  if (fromIndex === -1 || toIndex === -1 || toIndex <= fromIndex) return null

  const fromPlan = getPlanByLevel(from)
  const toPlan = getPlanByLevel(to)
  if (!fromPlan?.priceAmount || !toPlan?.priceAmount) return null

  const creditAmount = fromPlan.priceAmount
  const additionalAmount = Math.max(0, toPlan.priceAmount - creditAmount)
  return { from, to, creditAmount, additionalAmount }
}

/**
 * The single next upgrade available from a given level (one rung up the
 * ladder), or null if already at the top of the ladder / off-ladder.
 */
export function getNextUpgrade(current: ProductLevel): UpgradeCredit | null {
  const index = CREDIT_LADDER.indexOf(current)
  if (index === -1 || index >= CREDIT_LADDER.length - 1) return null
  return getUpgradeCredit(current, CREDIT_LADDER[index + 1])
}

/** Format a whole-dollar amount as compact USD (e.g. 1500 → "$1,500"). */
export function formatCredit(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`
}
