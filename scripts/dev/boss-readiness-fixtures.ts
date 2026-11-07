/**
 * BO$$ Business Journey™ / readiness fixtures. Pure — no database.
 * Run: npx tsx scripts/dev/boss-readiness-fixtures.ts
 */
import {
  defaultInitiative,
  developAssignments,
  effectiveJourney,
  getInitiative,
  prepKey,
  suggestJourney,
  type ReadinessContext,
} from "../../lib/boss/readiness"
import { designCeoWorkday } from "../../lib/ceo-workday/design-engine"

let failed = 0
function check(name: string, ok: boolean, detail?: unknown) {
  if (ok) console.log(`PASS  ${name}`)
  else {
    failed++
    console.log(`FAIL  ${name}`, detail ?? "")
  }
}

const empty: ReadinessContext = { answers: {}, approvedFactLabels: [], approvedAssetIds: [] }
const base = { bottleneckEntries: [] as never[] }

// 1. Different journeys → different chains for the same area.
const titles = (["starting", "growing", "scaling"] as const).map((j) =>
  designCeoWorkday({ ...base, businessAreaId: "sales-revenue", journey: j, readiness: empty })
    .items.map((i) => i.title)
    .join("|"),
)
check("1 journeys produce different chains", new Set(titles).size === 3, titles)

// 2. Transitioning established founder is never treated as starting.
check("2 harmony transition never resets to starting", effectiveJourney("starting", true) !== "starting")
const scaling = designCeoWorkday({ ...base, businessAreaId: "sales-revenue", journey: "scaling", harmonyTransition: true, readiness: empty })
check("2b scaling+transition keeps scaling initiative", scaling.initiative?.id === "sales.handoff", scaling.initiative)

// 3. Suggested journey derives from business stage.
check("3 suggestJourney maps launch→starting", suggestJourney("launch") === "starting")

// 4. Installed assets are reused, not rebuilt.
const speaking = getInitiative("authority.speaking")!
const assetReq = speaking.requirements.find((r) => r.assetId)
if (assetReq) {
  const out = developAssignments({
    initiative: speaking,
    ctx: { ...empty, approvedAssetIds: [assetReq.assetId!] },
  })
  const prepForAsset = out.assignments.find((a) => a.assignmentKey === prepKey(speaking.id, assetReq.key))
  check("4 installed asset → no prep to rebuild it", !prepForAsset)
  check("4b installed asset satisfies requirement", !out.questions.some((q) => q.key === assetReq.key))
} else {
  check("4 speaking has an asset-backed requirement", false)
}

// 5. Asset-free work carries no template requirement.
const sp = developAssignments({ initiative: speaking, ctx: empty })
const research = sp.assignments.find((a) => a.assignmentKey === "authority.speaking.research")
check("5 asset-free work → assetRequirement none", research?.assetRequirement === "none", research)

// 6. Missing hard prerequisite → prep assignment + dependency key.
const missingBio = developAssignments({ initiative: speaking, ctx: { ...empty, answers: { "speaker-bio": "missing" } } })
const pitch = missingBio.assignments.find((a) => a.assignmentKey === "authority.speaking.pitch")
const bioPrep = prepKey(speaking.id, "speaker-bio")
check("6 missing bio creates prep item", missingBio.assignments.some((a) => a.assignmentKey === bioPrep))
check("6b pitch depends on bio prep", !!pitch?.prerequisiteKeys.includes(bioPrep), pitch?.prerequisiteKeys)
check("6c prep ordered before dependent", missingBio.assignments.findIndex((a) => a.assignmentKey === bioPrep) < missingBio.assignments.findIndex((a) => a.assignmentKey === "authority.speaking.pitch"))

// 7. Blocked item is never labeled ready.
check("7 blocked step not ready", pitch?.readiness === "blocked", pitch?.readiness)

// 8. Unknown hard requirement → info needed, asked as a question (not a deficiency).
const unknownPitch = sp.assignments.find((a) => a.assignmentKey === "authority.speaking.pitch")
check("8 unknown hard req → info_needed", unknownPitch?.readiness === "info_needed", unknownPitch?.readiness)
check("8b unknown reqs become questions", sp.questions.length > 0)

// 9. Speaking sequence: assess → materials → strategy → research → pipeline → pitch → evaluate.
const allHave = Object.fromEntries(speaking.requirements.map((r) => [r.key, "have" as const]))
const seq = developAssignments({ initiative: speaking, ctx: { ...empty, answers: allHave } }).assignments.map((a) =>
  a.assignmentKey.replace("authority.speaking.", ""),
)
check("9 speaking sequence", seq.join(",") === "assess,materials,strategy,research,pipeline,pitch,evaluate", seq)

// 10. Done keys are not re-proposed.
const afterDone = developAssignments({
  initiative: speaking,
  ctx: { ...empty, answers: allHave },
  doneKeys: ["authority.speaking.assess", "authority.speaking.materials"],
})
check("10 done keys skipped", !afterDone.assignments.some((a) => a.assignmentKey.endsWith(".assess") || a.assignmentKey.endsWith(".materials")))

// 11. Engine: 240-minute container respected; without a journey the legacy path runs.
const full = designCeoWorkday({ ...base, businessAreaId: "authority", journey: "growing", initiativeId: "authority.speaking", readiness: { ...empty, answers: allHave } })
check("11 container ≤ 240 minutes", full.plannedMinutes <= 240, full.plannedMinutes)
const legacy = designCeoWorkday({ ...base, businessAreaId: "authority" })
check("11b no journey → legacy path (no initiative)", !legacy.initiative)
check("11c default initiative exists for every area/journey", ["sales-revenue", "growth-innovation", "operations", "client-experience", "authority", "finance", "ai-automation"].every((a) =>
  (["starting", "growing", "scaling"] as const).every((j) => !!defaultInitiative(a, j)),
))

console.log(failed ? `\n${failed} failed` : "\nAll passed")
process.exit(failed ? 1 : 0)
