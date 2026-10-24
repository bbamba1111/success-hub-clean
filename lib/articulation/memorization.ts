/**
 * Business Articulation Training™ — memorization scaffolding.
 *
 * Pure display transforms over the SAME block array used by the
 * teleprompter and print view — no new AI calls, no duplicate content
 * representation. Each level reveals progressively less of the script.
 */

import { ARTICULATION_BLOCK_LABELS, type ArticulationBlock, type MemorizationLevel } from "./types"

export interface MemorizationLine {
  blockId: string
  display: string
  isRevealable: boolean
}

/** First clause of a spoken line — up to the first comma/period, or ~6 words. */
function firstClause(content: string): string {
  const clauseMatch = content.match(/^[^,.!?]+[,.!?]?/)
  const clause = clauseMatch ? clauseMatch[0].trim() : content
  const words = clause.split(/\s+/)
  if (words.length > 8) {
    return words.slice(0, 8).join(" ") + "…"
  }
  return clause
}

export function applyMemorizationLevel(blocks: ArticulationBlock[], level: MemorizationLevel): MemorizationLine[] {
  return blocks.map((block) => {
    switch (level) {
      case "full":
        return { blockId: block.id, display: block.content, isRevealable: false }
      case "key-phrases":
        return {
          blockId: block.id,
          display: block.type === "spoken" || block.type === "story" ? firstClause(block.content) : block.content,
          isRevealable: false,
        }
      case "cue-card":
        return {
          blockId: block.id,
          display: ARTICULATION_BLOCK_LABELS[block.type],
          isRevealable: false,
        }
      case "structure-only":
        return {
          blockId: block.id,
          display: ARTICULATION_BLOCK_LABELS[block.type],
          isRevealable: false,
        }
      case "no-script":
        return { blockId: block.id, display: "", isRevealable: true }
      default:
        return { blockId: block.id, display: block.content, isRevealable: false }
    }
  })
}

/**
 * Retrieval mode: given the block the founder is currently on, return the
 * next block's full content to reveal after they attempt to recall it
 * themselves — "what comes next?" then reveal.
 */
export function getNextBlockForRetrieval(
  blocks: ArticulationBlock[],
  currentBlockId: string | null,
): ArticulationBlock | null {
  if (blocks.length === 0) return null
  if (currentBlockId === null) return blocks[0]
  const index = blocks.findIndex((b) => b.id === currentBlockId)
  if (index === -1 || index + 1 >= blocks.length) return null
  return blocks[index + 1]
}
