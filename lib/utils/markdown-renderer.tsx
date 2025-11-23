import React from 'react'

export function renderMarkdown(text: string): React.ReactNode {
  console.log("[v0] Rendering markdown for text:", text.substring(0, 100))
  
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let listItems: string[] = []
  let listType: 'bullet' | 'number' | null = null

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'bullet') {
        elements.push(
          <ul key={elements.length} className="list-disc list-inside space-y-2 my-3 ml-4">
            {listItems.map((item, i) => (
              <li key={i} className="text-foreground leading-relaxed">{processInline(item)}</li>
            ))}
          </ul>
        )
      } else if (listType === 'number') {
        elements.push(
          <ol key={elements.length} className="list-decimal list-inside space-y-2 my-3 ml-4">
            {listItems.map((item, i) => (
              <li key={i} className="text-foreground leading-relaxed">{processInline(item)}</li>
            ))}
          </ol>
        )
      }
      listItems = []
      listType = null
    }
  }

  lines.forEach((line) => {
    // Headers
    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={elements.length} className="text-lg font-bold mt-4 mb-2 text-[#5D9D61]">
          {processInline(line.slice(4))}
        </h3>
      )
    } else if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={elements.length} className="text-xl font-bold mt-4 mb-2 text-[#5D9D61]">
          {processInline(line.slice(3))}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      flushList()
      elements.push(
        <h1 key={elements.length} className="text-2xl font-bold mt-4 mb-3 text-[#E26C73]">
          {processInline(line.slice(2))}
        </h1>
      )
    }
    // Bullet lists (- or *)
    else if (/^[-*]\s/.test(line)) {
      const content = line.replace(/^[-*]\s+/, '')
      if (listType !== 'bullet') {
        flushList()
        listType = 'bullet'
      }
      listItems.push(content)
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s+/, '')
      if (listType !== 'number') {
        flushList()
        listType = 'number'
      }
      listItems.push(content)
    }
    // Empty lines
    else if (line.trim() === '') {
      flushList()
      elements.push(<div key={elements.length} className="h-2" />)
    }
    // Regular paragraphs
    else {
      flushList()
      elements.push(
        <p key={elements.length} className="mb-2 text-foreground leading-relaxed">
          {processInline(line)}
        </p>
      )
    }
  })

  flushList()
  return <div className="space-y-1">{elements}</div>
}

function processInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Bold: **text** or __text__
    const boldMatch = remaining.match(/^(.*?)(\*\*|__)(.+?)\2/)
    if (boldMatch) {
      if (boldMatch[1]) {
        parts.push(<span key={key++}>{boldMatch[1]}</span>)
      }
      parts.push(
        <strong key={key++} className="font-bold text-[#5D9D61]">
          {boldMatch[3]}
        </strong>
      )
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // Italic: *text* or _text_ (but not ** or __)
    const italicMatch = remaining.match(/^(.*?)([*_])(?!\2)(.+?)\2(?!\2)/)
    if (italicMatch) {
      if (italicMatch[1]) {
        parts.push(<span key={key++}>{italicMatch[1]}</span>)
      }
      parts.push(
        <em key={key++} className="italic text-[#E26C73]">
          {italicMatch[3]}
        </em>
      )
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // No more matches, add the rest
    parts.push(<span key={key++}>{remaining}</span>)
    break
  }

  return parts.length > 0 ? <>{parts}</> : text
}
