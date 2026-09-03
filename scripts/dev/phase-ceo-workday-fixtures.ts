/**
 * CEO Workday™ design engine + hour-block fixtures. Exercises the pure
 * intervention planner and the deterministic check-in timing without a
 * browser or Supabase. Run with: npx tsx scripts/dev/phase-ceo-workday-fixtures.ts
 */

import { designCeoWorkday, buildCeoWorkdayDeclaration, plannedMinutes } from "@/lib/ceo-workday/design-engine"
import {
  HOUR_BLOCKS,
  blockNeedingCheckin,
  currentHourBlock,
  isCheckinDue,
  isCheckinOverdue,
  minutesUntilCheckin,
  scheduledCheckinIso,
} from "@/lib/ceo-workday/hour-blocks"
import { INTERVENTION_MATRIX } from "@/lib/ceo-workday/intervention-matrix"
import type { EgaEntry } from "@/lib/ega/types"
import type { BbaSignalSummary } from "@/lib/founder-gps/context/bba-context-aggregator"

let pass = 0
let fail = 0
function check(label: string, ok: boolean) {
  if (ok) {
    pass++
    console.log(`  \u2713 ${label}`)
  } else {
    fail++
    console.log(`  \u2717 FAIL: ${label}`)
  }
}

const ega = (over: Partial<EgaEntry>): EgaEntry => ({
  id: over.id ?? "e1",
  userId: "u",
  source: "weekly_reality_check",
  signal: over.signal ?? "My offer is difficult to explain",
  status: "open",
  createdAt: "2026-09-01T00:00:00Z",
  updatedAt: "2026-09-01T00:00:00Z",
  ...over,
})

const bba = (over: Partial<BbaSignalSummary> = {}): BbaSignalSummary => ({
  hasBaseline: true,
  baselineCompletedAt: "2026-08-01T00:00:00Z",
  unownedCategoryIds: [],
  hasWidespreadOwnershipGap: false,
  hasThisWeeksCheckin: false,
  bottlenecksClearedThisWeek: null,
  lastAssignmentStatus: null,
  assignmentRepeatedlyBlocked: false,
  reportedBusinessAssetActivity: false,
  upcomingStakeholderDeadlineCount: 0,
  ...over,
})

const names = { "irresistible-offer": "Irresistible Offer™", "sales-conversation-guide": "Sales Conversation Guide™" }

/* [A] matrix sanity */
console.log("\n[A] Intervention matrix sanity\n")
check("[A] seven business areas covered", Object.keys(INTERVENTION_MATRIX).length === 7)
check(
  "[A] every area has a BUILD/CHANGE chain (ladder floor)",
  Object.values(INTERVENTION_MATRIX).every((a) => (a.chains["build-change"]?.length ?? 0) > 0),
)
check(
  "[A] every chain has exactly one primary card",
  Object.values(INTERVENTION_MATRIX).every((a) =>
    Object.values(a.chains).every((c) => c!.filter((s) => s.role === "primary").length === 1),
  ),
)

/* [B] no weekly priority → no proposal, explains why */
console.log("\n[B] No weekly priority\n")
const b = designCeoWorkday({ businessAreaId: null, bottleneckEntries: [] })
check("[B] not ok", !b.ok)
check("[B] reason present", !!b.reason && /Business Building Priority/.test(b.reason))
check("[B] zero items", b.items.length === 0)

/* [C] Sales & Revenue + unclear offer + no asset → BUILD/CHANGE chain */
console.log("\n[C] Sales & Revenue, offer unclear, nothing built\n")
const c = designCeoWorkday({
  businessAreaId: "sales-revenue",
  bottleneckEntries: [ega({ obstacleType: "knowledge", gap: "Offer/message not clear enough to sell consistently" })],
  bbaSignals: bba(),
  assetNameById: names,
  assetStatusById: {},
})
check("[C] ok", c.ok)
check("[C] treatment is build-change", c.treatment === "build-change")
check("[C] primary card first", c.items[0]?.role === "primary")
check("[C] build → articulate → test chain (3 cards)", c.items.length === 3)
check("[C] validate card uses practice-develop", c.items[2]?.treatment === "practice-develop")
check("[C] constraint names the gap", /not clear enough/.test(c.constraintSummary))
check("[C] every card has a WHY", c.items.every((i) => i.purpose.length > 20))
check("[C] every card has expected evidence", c.items.every((i) => i.expectedEvidence.length > 10))
check("[C] time is honest (150 ≤ total ≤ 240, not padded to 240)", c.plannedMinutes >= 150 && c.plannedMinutes < 240)
check("[C] gpsOriginal frozen on each card", c.items.every((i) => i.gpsOriginal?.title === i.title))
check("[C] primary WHY references weekly priority", /Sales & Revenue/.test(c.items[0].purpose))

/* [D] Same but Irresistible Offer™ is INSTALLED → not BUILD; implement/operate */
console.log("\n[D] Offer asset already installed → respects what exists\n")
const d = designCeoWorkday({
  businessAreaId: "sales-revenue",
  bottleneckEntries: [ega({ obstacleType: "time" })],
  bbaSignals: bba(),
  assetNameById: names,
  assetStatusById: { "irresistible-offer": "installed" },
})
check("[D] treatment is implement-operate", d.treatment === "implement-operate")
check("[D] primary title names the asset", /Irresistible Offer/.test(d.items[0].title))
check("[D] no card says 'Strengthen' (no rebuild)", !d.items.some((i) => /^Strengthen/.test(i.title)))
check("[D] relatedAssetId is the installed asset", d.relatedAssetId === "irresistible-offer")

/* [E] needs-update asset → revise existing (BUILD/CHANGE) but same asset id */
console.log("\n[E] Asset needs-update → revise, never a new asset\n")
const e = designCeoWorkday({
  businessAreaId: "sales-revenue",
  bottleneckEntries: [ega({ obstacleType: "knowledge" })],
  assetNameById: names,
  assetStatusById: { "irresistible-offer": "needs-update" },
})
check("[E] treatment is build-change", e.treatment === "build-change")
check("[E] related asset is the existing one", e.relatedAssetId === "irresistible-offer")
check("[E] intervention mentions revision", /revision|needs-update/i.test(e.items[0].purpose))

/* [F] BBA widespread ownership gap + installed asset → DELEGATE/TRANSFER */
console.log("\n[F] Installed asset + BBA ownership gap → delegate\n")
const f = designCeoWorkday({
  businessAreaId: "operations",
  bottleneckEntries: [ega({ obstacleType: "delegation", signal: "I own every client onboarding step" })],
  bbaSignals: bba({ hasWidespreadOwnershipGap: true, unownedCategoryIds: ["a", "b", "c"] as never }),
  assetNameById: { "client-onboarding-sop": "Client Onboarding SOP™" },
  assetStatusById: { "client-onboarding-sop": "installed" },
})
check("[F] treatment is delegate-transfer", f.treatment === "delegate-transfer")
check("[F] primary function is delegate", f.items[0].businessFunction === "delegate")
check("[F] WHY cites BBA", /BBA/.test(f.items[0].purpose))

/* [G] system obstacle but assignments repeatedly blocked → NOT automation */
console.log("\n[G] Automation pulled back when execution is unstable\n")
const g = designCeoWorkday({
  businessAreaId: "sales-revenue",
  bottleneckEntries: [ega({ obstacleType: "system" })],
  bbaSignals: bba({ assignmentRepeatedlyBlocked: true }),
  assetNameById: names,
  assetStatusById: { "irresistible-offer": "installed" },
})
check("[G] treatment is implement-operate (not automate)", g.treatment === "implement-operate")
check("[G] WHY explains stabilizing first", /stabiliz/i.test(g.items[0].purpose))

/* [H] system obstacle, stable → SYSTEMIZE/AUTOMATE allowed */
console.log("\n[H] Stable + system obstacle → automation earns its place\n")
const h = designCeoWorkday({
  businessAreaId: "sales-revenue",
  bottleneckEntries: [ega({ obstacleType: "system" })],
  bbaSignals: bba(),
  assetNameById: names,
  assetStatusById: { "irresistible-offer": "installed" },
})
check("[H] treatment is systemize-augment-automate-ai", h.treatment === "systemize-augment-automate-ai")

/* [I] Carry-forward only from the same area */
console.log("\n[I] Carry-forward respects the weekly priority\n")
const prior = {
  planDate: "2026-09-01",
  planStatus: "closed" as const,
  businessAreaId: "sales-revenue",
  plannedMinutes: 150,
  itemCount: 3,
  completedCount: 2,
  inProgressCount: 1,
  deferredCount: 0,
  delegatedCount: 0,
  eliminatedCount: 0,
  blockedCount: 0,
  founderChangedCount: 0,
  carryForward: [{ itemId: "x", title: "Prepare sales conversation", nextAction: "later" as const }],
  hoursCheckedIn: 4,
}
const i1 = designCeoWorkday({ businessAreaId: "sales-revenue", bottleneckEntries: [], assetNameById: names, priorEvidence: prior })
check("[I] same area → continue card first", i1.items[0].role === "continue" && /Prepare sales/.test(i1.items[0].title))
const i2 = designCeoWorkday({ businessAreaId: "authority", bottleneckEntries: [], priorEvidence: prior })
check("[I] different area → no unrelated carry-forward injected", !i2.items.some((i) => i.role === "continue"))

/* [J] plannedMinutes ignores removed */
console.log("\n[J] Founder decisions\n")
const j = designCeoWorkday({ businessAreaId: "finance", bottleneckEntries: [] })
const jItems = j.items.map((it, idx) => (idx === 0 ? { ...it, founderDecision: "remove" as const } : it))
check("[J] removed item excluded from planned minutes", plannedMinutes(jItems) === j.plannedMinutes - j.items[0].estimatedMinutes)
const jDeferred = j.items.map((it, idx) =>
  idx === 0 ? { ...it, founderDecision: "defer" as const, status: "deferred" as const } : it,
)
check("[J] deferred item leaves today's minutes", plannedMinutes(jDeferred) === j.plannedMinutes - j.items[0].estimatedMinutes)
const jDelegated = j.items.map((it, idx) =>
  idx === 0 ? { ...it, founderDecision: "delegate" as const, status: "delegated" as const } : it,
)
check("[J] delegated item leaves today's minutes", plannedMinutes(jDelegated) === j.plannedMinutes - j.items[0].estimatedMinutes)

/* [K] Declaration */
console.log("\n[K] Declaration\n")
const dec = buildCeoWorkdayDeclaration({
  identityStatement: "A calm, decisive CEO",
  items: c.items,
  areaName: c.areaName,
  destination: c.destination,
})
check("[K] starts with identity", /^I am a calm, decisive CEO\./.test(dec))
check("[K] names the primary work", /strengthen/i.test(dec))
check("[K] has a purpose clause", /because/.test(dec))
const dec2 = buildCeoWorkdayDeclaration({ identityStatement: "I'm someone who finishes what she starts", items: c.items, areaName: c.areaName, destination: c.destination, variant: 1 })
check("[K] variant differs and keeps 'I'm' identity", dec2 !== dec && /^I'm someone/.test(dec2))
const dec3 = buildCeoWorkdayDeclaration({ identityStatement: null, items: [], areaName: null, destination: null })
check("[K] graceful with no inputs", /I am a focused CEO/.test(dec3))

/* [L] Hour blocks — deterministic check-in timing */
console.log("\n[L] Hour blocks & 5-Minute Check-In™ timing\n")
check("[L] four blocks", HOUR_BLOCKS.length === 4)
check("[L] blocks are 1:00–2:00 … 4:00–5:00", HOUR_BLOCKS[0].label === "1:00–2:00" && HOUR_BLOCKS[3].label === "4:00–5:00")
check(
  "[L] check-ins at 1:55/2:55/3:55/4:55",
  HOUR_BLOCKS.map((b) => b.checkinLabel).join(",") === "1:55 PM,2:55 PM,3:55 PM,4:55 PM",
)
const m = (h: number, mm: number) => h * 60 + mm
check("[L] 1:30 is block 1", currentHourBlock(m(13, 30))?.index === 1)
check("[L] 12:59 is outside", currentHourBlock(m(12, 59)) === null)
check("[L] 5:00 is outside", currentHourBlock(m(17, 0)) === null)
check("[L] 1:54 → block 1 check-in NOT due", !isCheckinDue(HOUR_BLOCKS[0], m(13, 54)))
check("[L] 1:55 → block 1 check-in due", isCheckinDue(HOUR_BLOCKS[0], m(13, 55)))
check("[L] 2:00 → block 1 overdue (still openable)", isCheckinOverdue(HOUR_BLOCKS[0], m(14, 0)))
check("[L] 1:40 → 15 min until check-in", minutesUntilCheckin(HOUR_BLOCKS[0], m(13, 40)) === 15)
check("[L] blockNeedingCheckin at 1:30 with none saved → null", blockNeedingCheckin(m(13, 30), new Set()) === null)
check("[L] blockNeedingCheckin at 1:56 → block 1", blockNeedingCheckin(m(13, 56), new Set())?.index === 1)
check("[L] blockNeedingCheckin at 2:56, block 1 saved → block 2", blockNeedingCheckin(m(14, 56), new Set([1]))?.index === 2)
check("[L] blockNeedingCheckin at 2:56, block 1 unsaved → block 1 (gates later)", blockNeedingCheckin(m(14, 56), new Set())?.index === 1)
const iso = scheduledCheckinIso(HOUR_BLOCKS[0], "2026-09-02")
const back = new Date(new Date(iso).toLocaleString("en-US", { timeZone: "America/New_York" }))
check("[L] scheduledCheckinIso round-trips to 13:55 platform time", back.getHours() === 13 && back.getMinutes() === 55)

console.log(`\n${pass} passed, ${fail} failed\n`)
if (fail > 0) process.exit(1)
