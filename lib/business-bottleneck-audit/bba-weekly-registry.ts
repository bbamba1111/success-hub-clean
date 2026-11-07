/**
 * Monday Weekly Business Measurement™ — Registry (DATA ONLY)
 * ---------------------------------------------------------------------------
 * The lightweight weekly layer that runs AFTER the founder has a BBA
 * baseline. This is deliberately NOT the full BBA — it measures the
 * previous 7 days only, per the approved spec's "BASELINE VS WEEKLY USE"
 * and "MONDAY WEEKLY REALITY CHECK™" sections.
 */

import type { BbaOption } from "./types"

/** "In the past 7 days, how did your life improve?" — simple, does not recreate the WBA. */
export const LIFE_IMPROVEMENT_OPTIONS: BbaOption[] = [
  { id: "protected-personal-time", label: "I protected personal/family time" },
  { id: "felt-more-present", label: "I felt more present outside of work" },
  { id: "better-rest-energy", label: "I had better rest or energy" },
  { id: "honored-a-non-negotiable", label: "I honored a Life Non-Negotiable™" },
  { id: "reduced-stress", label: "I felt less stressed" },
  { id: "no-meaningful-improvement", label: "No meaningful improvement this week" },
  { id: "other", label: "Other", allowOtherText: true },
]

/** "In the past 7 days, how did your business improve?" */
export const BUSINESS_IMPROVEMENT_OPTIONS: BbaOption[] = [
  { id: "generated-revenue", label: "Generated revenue" },
  { id: "made-sales", label: "Made sales" },
  { id: "advanced-sales-opportunities", label: "Advanced sales opportunities" },
  { id: "improved-marketing", label: "Improved marketing" },
  { id: "improved-offer", label: "Improved an offer/product/service" },
  { id: "improved-client-delivery", label: "Improved client delivery" },
  { id: "improved-system-process", label: "Improved a system/process" },
  { id: "delegated-work", label: "Delegated work" },
  { id: "reduced-founder-dependency", label: "Reduced founder dependency" },
  { id: "created-improved-business-asset", label: "Created or improved a business asset" },
  { id: "used-ai-automation", label: "Used AI/automation to improve the business" },
  { id: "improved-team-ownership", label: "Improved team ownership/accountability" },
  { id: "improved-communication", label: "Improved communication" },
  { id: "cleared-a-bottleneck", label: "Cleared a bottleneck" },
  { id: "improved-another-important-area", label: "Improved another important area" },
  { id: "no-meaningful-improvement", label: "No meaningful improvement yet" },
  { id: "other", label: "Other", allowOtherText: true },
]

/** "Did you have any problems implementing your Business Building Assignment last week?" */
export const ASSIGNMENT_IMPLEMENTATION_OPTIONS: BbaOption[] = [
  { id: "no-implemented", label: "No, I was able to implement it" },
  { id: "yes-some-problems", label: "Yes, I had some problems" },
  { id: "unable-to-implement", label: "I was unable to implement it" },
]

/** "What problems did you have?" — shown when the founder had implementation problems. */
export const ASSIGNMENT_PROBLEM_OPTIONS: BbaOption[] = [
  { id: "not-enough-time", label: "I didn't have enough time" },
  { id: "wasnt-sure-what-to-do", label: "I wasn't sure what to do" },
  { id: "needed-more-information", label: "I needed more information" },
  { id: "needed-a-decision", label: "I needed a decision" },
  { id: "needed-someone-else-to-do-something", label: "I needed someone else to do something" },
  { id: "someone-else-didnt-complete-their-part", label: "Someone else didn't complete their part" },
  { id: "needed-a-system-process", label: "I needed a system/process" },
  { id: "needed-a-tool-technology", label: "I needed a tool/technology" },
  { id: "needed-help-from-ai", label: "I needed help from AI" },
  { id: "needed-to-communicate-something-first", label: "I needed to communicate something first" },
  { id: "something-unexpected-came-up", label: "Something unexpected came up" },
  { id: "assignment-larger-than-expected", label: "The assignment was larger than expected" },
  { id: "assignment-no-longer-right-priority", label: "The assignment was no longer the right priority" },
  { id: "wasnt-ready-to-implement", label: "I wasn't ready to implement it" },
  { id: "other", label: "Other", allowOtherText: true },
]

/**
 * "What happened with last week's Business Building Assignment?" — this
 * status must reach GPS so it can distinguish completed / blocked /
 * no-longer-appropriate assignments per the approved spec.
 */
export const ASSIGNMENT_STATUS_OPTIONS: BbaOption[] = [
  { id: "completed", label: "Completed" },
  { id: "partially-completed", label: "Partially completed" },
  { id: "started-not-completed", label: "Started but not completed" },
  { id: "not-started", label: "Not started" },
  { id: "completed-and-in-use", label: "Completed and now in use" },
]

/** Three-state distinction the spec requires be preserved per business asset. */
export const ASSET_STATE_OPTIONS: BbaOption[] = [
  { id: "created", label: "Created" },
  { id: "communicated", label: "Communicated" },
  { id: "in-use", label: "Now being used" },
]
