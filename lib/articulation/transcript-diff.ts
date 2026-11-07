/**
 * Business Articulation Training™ — lightweight word-level transcript diff.
 *
 * Compares what the founder actually said (recognized speech transcript, or
 * typed practice text) against the spoken text of the version they were
 * rehearsing. Pure client-side LCS diff, no dependency. Produces a
 * structured summary that is both rendered inline and sent to the AI
 * `feedback` action so critique is grounded in what actually happened, not
 * guessed from the raw transcript alone.
 */

export type DiffOpType = "match" | "skipped" | "added"

export interface DiffOp {
  type: DiffOpType
  word: string
}

export interface TranscriptDiffSummary {
  ops: DiffOp[]
  skippedWords: string[]
  addedWords: string[]
  matchedWordCount: number
  expectedWordCount: number
  spokenWordCount: number
  coveragePercent: number
}

function tokenize(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9']/g, "")
}

/**
 * Longest common subsequence over normalized tokens, then walked back into
 * an ordered list of match/skipped/added operations. O(n*m) — practice
 * transcripts are short (seconds of speech), so this stays fast.
 */
export function diffTranscript(expectedText: string, spokenText: string): TranscriptDiffSummary {
  const expected = tokenize(expectedText)
  const spoken = tokenize(spokenText)
  const expectedNorm = expected.map(normalize)
  const spokenNorm = spoken.map(normalize)

  const n = expectedNorm.length
  const m = spokenNorm.length
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (expectedNorm[i - 1] === spokenNorm[j - 1] && expectedNorm[i - 1].length > 0) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1])
      }
    }
  }

  const ops: DiffOp[] = []
  let i = n
  let j = m
  while (i > 0 && j > 0) {
    if (expectedNorm[i - 1] === spokenNorm[j - 1] && expectedNorm[i - 1].length > 0) {
      ops.unshift({ type: "match", word: expected[i - 1] })
      i--
      j--
    } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
      ops.unshift({ type: "skipped", word: expected[i - 1] })
      i--
    } else {
      ops.unshift({ type: "added", word: spoken[j - 1] })
      j--
    }
  }
  while (i > 0) {
    ops.unshift({ type: "skipped", word: expected[i - 1] })
    i--
  }
  while (j > 0) {
    ops.unshift({ type: "added", word: spoken[j - 1] })
    j--
  }

  const matchedWordCount = ops.filter((op) => op.type === "match").length
  const skippedWords = ops.filter((op) => op.type === "skipped").map((op) => op.word)
  const addedWords = ops.filter((op) => op.type === "added").map((op) => op.word)

  return {
    ops,
    skippedWords,
    addedWords,
    matchedWordCount,
    expectedWordCount: expected.length,
    spokenWordCount: spoken.length,
    coveragePercent: expected.length > 0 ? Math.round((matchedWordCount / expected.length) * 100) : 100,
  }
}

/** Short, human-readable summary of a diff, for the AI feedback prompt. */
export function summarizeDiffForPrompt(summary: TranscriptDiffSummary): string {
  const parts: string[] = [`Coverage: ${summary.coveragePercent}% of the intended words were said.`]
  if (summary.skippedWords.length > 0) {
    parts.push(`Skipped/omitted content: "${summary.skippedWords.join(" ")}"`)
  }
  if (summary.addedWords.length > 0) {
    parts.push(`Added/improvised content not in the script: "${summary.addedWords.join(" ")}"`)
  }
  if (summary.skippedWords.length === 0 && summary.addedWords.length === 0) {
    parts.push("Delivered essentially word-for-word.")
  }
  return parts.join(" ")
}
