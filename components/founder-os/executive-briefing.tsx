"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Sparkles } from "lucide-react"
import { renderMarkdown } from "@/lib/utils/markdown-renderer"

/**
 * Workspace 1 — 🌸 Executive Briefing.
 *
 * Fetches Cherry Blossom's AI-generated Daily Executive Briefing (mode
 * "daily-briefing") built from the member's live context package. Never cached
 * server-side; regenerated on demand so it always reflects the latest state.
 */

async function fetchBriefing(): Promise<string> {
  const res = await fetch("/api/founder-os/briefing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "daily-briefing" }),
  })
  const data = await res.json().catch(() => ({}))
  return (
    data?.message ||
    "**Welcome** — Good afternoon. Take a breath and choose the one thing that would move your business forward today."
  )
}

export function ExecutiveBriefing() {
  const [refreshing, setRefreshing] = useState(false)
  const { data, isLoading, mutate } = useSWR("founder-os-daily-briefing", fetchBriefing, {
    revalidateOnFocus: false,
  })

  const regenerate = async () => {
    setRefreshing(true)
    await mutate(fetchBriefing(), { revalidate: false })
    setRefreshing(false)
  }

  return (
    <div className="space-y-5">
      {isLoading ? (
        <div className="flex items-center gap-3 py-6 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-[#5D9D61]" />
          <span>Cherry Blossom is preparing your briefing…</span>
        </div>
      ) : (
        <div className="rounded-xl border border-[#5D9D61]/20 bg-[#F5F1E8]/60 p-5 text-[#3A2E33]">
          {renderMarkdown(data ?? "")}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={regenerate}
          disabled={refreshing || isLoading}
          className="border-[#5D9D61]/40 text-[#5D9D61] hover:bg-[#5D9D61]/10 bg-transparent"
        >
          {refreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Refresh briefing
        </Button>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[#E26C73]" />
          Generated fresh from your latest business + life data
        </span>
      </div>
    </div>
  )
}
