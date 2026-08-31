/**
 * Phase 4B fixtures — Business Articulation Training™ pure-logic checks.
 * Run with: npx tsx scripts/dev/phase-14-articulation-fixtures.ts
 */

import { diffTranscript, summarizeDiffForPrompt } from "../../lib/articulation/transcript-diff"
import { applyMemorizationLevel, getNextBlockForRetrieval } from "../../lib/articulation/memorization"
import type { ArticulationBlock } from "../../lib/articulation/types"

let passCount = 0
let failCount = 0

function check(label: string, condition: boolean) {
  if (condition) {
    passCount++
    console.log(`[v0] PASS - ${label}`)
  } else {
    failCount++
    console.log(`[v0] FAIL - ${label}`)
  }
}

// --- Transcript diff ---
const exactDiff = diffTranscript("We grew revenue by twenty percent this quarter", "We grew revenue by twenty percent this quarter")
check("exact match yields 100% coverage", exactDiff.coveragePercent === 100)
check("exact match has no skipped words", exactDiff.skippedWords.length === 0)
check("exact match has no added words", exactDiff.addedWords.length === 0)

const skippedDiff = diffTranscript("We grew revenue by twenty percent this quarter", "We grew revenue this quarter")
check("skipped words are detected", skippedDiff.skippedWords.length > 0)
check("skipped diff coverage is less than 100%", skippedDiff.coveragePercent < 100)

const addedDiff = diffTranscript("We grew revenue", "We definitely grew revenue a lot honestly")
check("added words are detected", addedDiff.addedWords.length > 0)

const summary = summarizeDiffForPrompt(skippedDiff)
check("summary mentions coverage", summary.includes("Coverage"))
check("summary mentions skipped content", summary.includes("Skipped"))

// --- Memorization scaffolding ---
const blocks: ArticulationBlock[] = [
  {
    id: "b1",
    type: "spoken",
    content: "We faced a genuinely serious customer retention problem across the entire last quarter without exception",
    source: "ai",
  },
  { id: "b2", type: "statistic", content: "Churn was up 18 percent.", source: "ai" },
  { id: "b3", type: "call-to-action", content: "Let's fix onboarding first.", source: "ai" },
]

const full = applyMemorizationLevel(blocks, "full")
check("full level shows complete content", full[0].display === blocks[0].content)

const keyPhrases = applyMemorizationLevel(blocks, "key-phrases")
check("key-phrases level shortens spoken content", keyPhrases[0].display.length < blocks[0].content.length)

const cueCard = applyMemorizationLevel(blocks, "cue-card")
check("cue-card level shows block type label, not content", cueCard[0].display === "Spoken line")

const noScript = applyMemorizationLevel(blocks, "no-script")
check("no-script level shows nothing and is revealable", noScript[0].display === "" && noScript[0].isRevealable === true)

// --- Retrieval mode ---
const first = getNextBlockForRetrieval(blocks, null)
check("retrieval starts at first block", first?.id === "b1")
const second = getNextBlockForRetrieval(blocks, "b1")
check("retrieval advances to second block", second?.id === "b2")
const afterLast = getNextBlockForRetrieval(blocks, "b3")
check("retrieval returns null after the last block", afterLast === null)

console.log(`\n[v0] ${passCount} passed, ${failCount} failed`)
if (failCount > 0) process.exit(1)
