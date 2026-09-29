"use client"

/**
 * PolishedDraft — renders an AI-written document with a polished finish:
 * real bold, italic, bullet points, and proper spacing. It interprets the
 * lightweight markdown the model produces (**bold**, *italic*, "- " bullets,
 * "1." numbered lists) into actual formatting so the raw ** and * marks never
 * appear as literal characters, and strips any stray markdown (#, `, ~, >).
 *
 * Deliberately dependency-free: the project has no markdown renderer, and a
 * full one is unnecessary — the model is constrained to this small vocabulary.
 */

import { Fragment, type ReactNode } from "react"

/** Turn inline **bold** / *italic* / _italic_ into real emphasis, dropping the marks. */
function renderInline(text: string, keyBase: string): ReactNode[] {
  // Split on bold first, then italics inside each non-bold segment.
  const nodes: ReactNode[] = []
  const boldSplit = text.split(/(\*\*[^*]+\*\*)/g)
  boldSplit.forEach((chunk, bi) => {
    if (/^\*\*[^*]+\*\*$/.test(chunk)) {
      nodes.push(
        <strong key={`${keyBase}-b${bi}`} className="font-semibold text-[#2E1F27]">
          {chunk.slice(2, -2)}
        </strong>,
      )
      return
    }
    // Italics: *text* or _text_ (avoid matching bare ** already handled).
    const italicSplit = chunk.split(/(\*[^*\n]+\*|_[^_\n]+_)/g)
    italicSplit.forEach((piece, ii) => {
      if ((/^\*[^*\n]+\*$/.test(piece) || /^_[^_\n]+_$/.test(piece)) && piece.length > 2) {
        nodes.push(
          <em key={`${keyBase}-i${bi}-${ii}`} className="italic">
            {piece.slice(1, -1)}
          </em>,
        )
      } else if (piece) {
        // Strip any leftover stray markdown characters.
        nodes.push(<Fragment key={`${keyBase}-t${bi}-${ii}`}>{piece.replace(/[`~>]/g, "")}</Fragment>)
      }
    })
  })
  return nodes
}

/** Is this line a bullet? Accepts -, *, • as markers. */
function bulletContent(line: string): string | null {
  const m = line.match(/^\s*[-*•]\s+(.*)$/)
  return m ? m[1] : null
}

/** Is this line a numbered item? */
function numberedContent(line: string): string | null {
  const m = line.match(/^\s*\d+[.)]\s+(.*)$/)
  return m ? m[1] : null
}

/** Strip leading markdown header hashes but keep the text (rendered bold). */
function headerContent(line: string): string | null {
  const m = line.match(/^\s*#{1,6}\s+(.*)$/)
  return m ? m[1] : null
}

export function PolishedDraft({ text, className }: { text: string; className?: string }) {
  const clean = text.replace(/\r\n/g, "\n").replace(/^\s*[-*_]{3,}\s*$/gm, "") // drop horizontal rules
  const lines = clean.split("\n")

  const blocks: ReactNode[] = []
  let paragraph: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let key = 0

  function flushParagraph() {
    if (paragraph.length === 0) return
    const joined = paragraph.join(" ").trim()
    if (joined) {
      blocks.push(
        <p key={`p${key++}`} className="leading-relaxed text-[#3A2E33]">
          {renderInline(joined, `p${key}`)}
        </p>,
      )
    }
    paragraph = []
  }

  function flushList() {
    if (!list || list.items.length === 0) {
      list = null
      return
    }
    const items = list.items.map((it, i) => (
      <li key={i} className="leading-relaxed text-[#3A2E33]">
        {renderInline(it, `li${key}-${i}`)}
      </li>
    ))
    blocks.push(
      list.ordered ? (
        <ol key={`ol${key++}`} className="list-decimal space-y-1.5 pl-5 marker:text-[#5B835F]">
          {items}
        </ol>
      ) : (
        <ul key={`ul${key++}`} className="list-disc space-y-1.5 pl-5 marker:text-[#5B835F]">
          {items}
        </ul>
      ),
    )
    list = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    if (!line.trim()) {
      flushParagraph()
      flushList()
      continue
    }

    const header = headerContent(line)
    if (header !== null) {
      flushParagraph()
      flushList()
      blocks.push(
        <p key={`h${key++}`} className="pt-1 font-sans text-base font-bold text-[#2E1F27]">
          {renderInline(header, `h${key}`)}
        </p>,
      )
      continue
    }

    const bullet = bulletContent(line)
    if (bullet !== null) {
      flushParagraph()
      if (!list || list.ordered) {
        flushList()
        list = { ordered: false, items: [] }
      }
      list.items.push(bullet)
      continue
    }

    const numbered = numberedContent(line)
    if (numbered !== null) {
      flushParagraph()
      if (!list || !list.ordered) {
        flushList()
        list = { ordered: true, items: [] }
      }
      list.items.push(numbered)
      continue
    }

    flushList()
    paragraph.push(line)
  }
  flushParagraph()
  flushList()

  return <div className={`space-y-3 font-sans text-sm ${className ?? ""}`}>{blocks}</div>
}
