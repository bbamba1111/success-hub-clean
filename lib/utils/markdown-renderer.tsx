import type React from "react"

export function renderMarkdown(content: string): React.ReactNode {
  console.log("[v0] Rendering markdown:", content.substring(0, 100))

  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let listItems: React.ReactNode[] = []
  let listType: "ul" | "ol" | null = null

  const processInlineFormatting = (text: string, key: string) => {
    const parts: React.ReactNode[] = []
    const remaining = text
    let partIndex = 0

    // Process bold first (**text** or __text__)
    const boldPattern = /(\*\*|__)((?:(?!\1).)+?)\1/g
    let lastIndex = 0
    let match

    while ((match = boldPattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const before = text.substring(lastIndex, match.index)
        parts.push(...processItalics(before, `${key}-b${partIndex++}`))
      }

      parts.push(
        <strong key={`${key}-bold-${partIndex++}`} className="font-bold text-[#4A7C4E] text-[1.05em]">
          {match[2]}
        </strong>,
      )
      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(...processItalics(text.substring(lastIndex), `${key}-end`))
    }

    return parts.length > 0 ? parts : [text]
  }

  const processItalics = (text: string, key: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    const italicPattern = /(?<!\*)(\*|_)(?!\1)((?:(?!\1).)+?)\1(?!\*)/g
    let lastIndex = 0
    let match

    while ((match = italicPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      parts.push(
        <em key={`${key}-italic-${match.index}`} className="italic text-[#D5596B]">
          {match[2]}
        </em>,
      )
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : [text]
  }

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListTag = listType
      const className =
        listType === "ul"
          ? "list-disc list-outside mb-5 ml-6 space-y-2.5 marker:text-[#5D9D61]"
          : "list-decimal list-outside mb-5 ml-6 space-y-2.5 marker:text-[#5D9D61] marker:font-semibold"

      elements.push(
        <ListTag key={`list-${elements.length}`} className={className}>
          {listItems}
        </ListTag>,
      )
      listItems = []
      listType = null
    }
  }

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      flushList()
      return
    }

    // Headers - render as bold paragraphs instead of large headers
    if (trimmedLine.startsWith("### ")) {
      flushList()
      const content = trimmedLine.substring(4)
      elements.push(
        <p key={`p-${lineIndex}`} className="mb-4 leading-[1.7] text-[0.95rem] font-bold">
          {processInlineFormatting(content, `p-${lineIndex}`)}
        </p>,
      )
      return
    }

    if (trimmedLine.startsWith("## ")) {
      flushList()
      const content = trimmedLine.substring(3)
      elements.push(
        <p key={`p-${lineIndex}`} className="mb-4 leading-[1.7] text-[0.95rem] font-bold">
          {processInlineFormatting(content, `p-${lineIndex}`)}
        </p>,
      )
      return
    }

    if (trimmedLine.startsWith("# ")) {
      flushList()
      const content = trimmedLine.substring(2)
      elements.push(
        <p key={`p-${lineIndex}`} className="mb-4 leading-[1.7] text-[0.95rem] font-bold">
          {processInlineFormatting(content, `p-${lineIndex}`)}
        </p>,
      )
      return
    }

    // Bullet points (- or *)
    if (trimmedLine.match(/^[-*]\s+/)) {
      if (listType !== "ul") {
        flushList()
        listType = "ul"
      }
      const content = trimmedLine.substring(2)
      listItems.push(
        <li key={`li-${lineIndex}`} className="leading-relaxed pl-2">
          {processInlineFormatting(content, `li-${lineIndex}`)}
        </li>,
      )
      return
    }

    // Numbered lists (1. 2. etc)
    if (trimmedLine.match(/^\d+\.\s+/)) {
      if (listType !== "ol") {
        flushList()
        listType = "ol"
      }
      const content = trimmedLine.replace(/^\d+\.\s+/, "")
      listItems.push(
        <li key={`li-${lineIndex}`} className="leading-relaxed pl-2">
          {processInlineFormatting(content, `li-${lineIndex}`)}
        </li>,
      )
      return
    }

    // Regular paragraph
    flushList()
    elements.push(
      <p key={`p-${lineIndex}`} className="mb-4 leading-[1.7] text-[0.95rem]">
        {processInlineFormatting(trimmedLine, `p-${lineIndex}`)}
      </p>,
    )
  })

  flushList()

  return <div className="space-y-3">{elements}</div>
}
