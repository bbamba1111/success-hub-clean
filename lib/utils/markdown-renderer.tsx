import React from 'react'

export function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []
  let listItems: string[] = []
  let listType: 'bullet' | 'number' | null = null

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'bullet') {
        elements.push(
          <ul key={elements.length} className="list-disc list-inside space-y-1 my-3 ml-4">
            {listItems.map((item, i) => (
              <li key={i} className="text-foreground">{processInlineMarkdown(item)}</li>
            ))}
          </ul>
        )
      } else if (listType === 'number') {
        elements.push(
          <ol key={elements.length} className="list-decimal list-inside space-y-1 my-3 ml-4">
            {listItems.map((item, i) => (
              <li key={i} className="text-foreground">{processInlineMarkdown(item)}</li>
            ))}
          </ol>
        )
      }
      listItems = []
      listType = null
    }
  }

  lines.forEach((line, index) => {
    // Headers
    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={elements.length} className="text-lg font-bold mt-4 mb-2 text-[#5D9D61]">
          {processInlineMarkdown(line.slice(4))}
        </h3>
      )
    } else if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={elements.length} className="text-xl font-bold mt-4 mb-2 text-[#5D9D61]">
          {processInlineMarkdown(line.slice(3))}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      flushList()
      elements.push(
        <h1 key={elements.length} className="text-2xl font-bold mt-4 mb-3 text-[#E26C73]">
          {processInlineMarkdown(line.slice(2))}
        </h1>
      )
    }
    // Bullet lists
    else if (line.match(/^[-*]\s+/)) {
      const content = line.replace(/^[-*]\s+/, '')
      if (listType !== 'bullet') {
        flushList()
        listType = 'bullet'
      }
      listItems.push(content)
    }
    // Numbered lists
    else if (line.match(/^\d+\.\s+/)) {
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
      elements.push(<br key={elements.length} />)
    }
    // Regular paragraphs
    else {
      flushList()
      elements.push(
        <p key={elements.length} className="mb-2 text-foreground leading-relaxed">
          {processInlineMarkdown(line)}
        </p>
      )
    }
  })

  flushList()
  return <div className="space-y-1">{elements}</div>
}

function processInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let currentText = text
  let key = 0

  // Process bold (**text** or __text__)
  const boldRegex = /(\*\*|__)(.*?)\1/g
  let lastIndex = 0
  let match

  while ((match = boldRegex.exec(currentText)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      const beforeText = currentText.slice(lastIndex, match.index)
      parts.push(processItalics(beforeText, key++))
    }
    // Add bold text
    parts.push(
      <strong key={key++} className="font-bold text-[#5D9D61]">
        {match[2]}
      </strong>
    )
    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < currentText.length) {
    parts.push(processItalics(currentText.slice(lastIndex), key++))
  }

  return parts.length > 0 ? parts : currentText
}

function processItalics(text: string, baseKey: number): React.ReactNode {
  const parts: React.ReactNode[] = []
  const italicRegex = /(\*|_)(.*?)\1/g
  let lastIndex = 0
  let match
  let key = 0

  while ((match = italicRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`${baseKey}-${key++}`}>{text.slice(lastIndex, match.index)}</span>
      )
    }
    // Add italic text
    parts.push(
      <em key={`${baseKey}-${key++}`} className="italic text-[#E26C73]">
        {match[2]}
      </em>
    )
    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={`${baseKey}-${key++}`}>{text.slice(lastIndex)}</span>)
  }

  return parts.length > 0 ? parts : text
}
