"use client"

/**
 * LiveAiBuildChat — Business Asset Library™ (Phase 12.2 proof of concept)
 * ---------------------------------------------------------------------------
 * A REAL, live AI conversation for building a Business Asset™ — currently
 * enabled for exactly one asset (see lib/business-asset-library/live-build.ts)
 * to prove the full chain end to end: Founder → Business Stage™ → Business
 * Asset™ → owning Executive™ → live AI conversation → step-by-step build →
 * save. Every other asset keeps the fully static GuidedBuildFlow untouched.
 *
 * Talks to app/api/business-asset-build/route.ts (its own endpoint — Cherry
 * Blossom's engine is never touched) and persists the transcript + final
 * draft via utils/business-asset-build-storage.ts.
 */

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, CheckCircle2, Loader2, Send, Sparkles } from "lucide-react"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import type { BuildModeDefinition } from "@/lib/business-asset-library/build-modes"
import type { CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"
import {
  createBusinessAssetBuildInDb,
  getBusinessAssetBuildFromDb,
  updateBusinessAssetBuildInDb,
  type BusinessAssetBuildMessage,
} from "@/utils/business-asset-build-storage"

export function LiveAiBuildChat({
  asset,
  mode,
  style,
  executiveName,
  onExit,
}: {
  asset: BusinessAsset
  mode: BuildModeDefinition
  style: CommunicationStyle
  executiveName: string
  onExit: () => void
}) {
  const [messages, setMessages] = useState<BusinessAssetBuildMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isBooting, setIsBooting] = useState(true)
  const [buildId, setBuildId] = useState<string | null>(null)
  const [finalDraft, setFinalDraft] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const isAutonomous = mode.id === "let-ai-do-it"
  const isAi = mode.stepFraming === "ai-drafts" || isAutonomous
  const modeLabel = isAutonomous ? "Let AI Do It" : isAi ? "Build With AI" : "Do It Myself, guided"

  // Resume an in-progress session for this asset + mode, or start fresh.
  useEffect(() => {
    let active = true
    async function boot() {
      const existing = await getBusinessAssetBuildFromDb(asset.id, mode.id)
      if (!active) return
      if (existing && existing.status === "in-progress" && existing.messages.length > 0) {
        setBuildId(existing.id)
        setMessages(existing.messages)
      } else {
        const newId = await createBusinessAssetBuildInDb(asset.id, mode.id)
        if (!active) return
        setBuildId(newId)
        const opener: BusinessAssetBuildMessage = {
          role: "assistant",
          content: isAutonomous
            ? `Hi, I'm ${executiveName}. Tell me anything important about your business, and I'll go ahead and draft a complete ${asset.name} for you — making reasonable assumptions where I need to. You'll be able to edit anything that's off. Ready?`
            : isAi
              ? `Hi, I'm ${executiveName}. Let's build your ${asset.name} together — I'll ask a few questions and draft the language as we go. Ready to start?`
              : `Hi, I'm ${executiveName}. I'll coach you through building your ${asset.name} step by step — you do the writing, I'll guide you. Ready to start?`,
        }
        setMessages([opener])
      }
      setIsBooting(false)
    }
    boot()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset.id, mode.id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isLoading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading) return

    const nextMessages: BusinessAssetBuildMessage[] = [...messages, { role: "user", content: text }]
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/business-asset-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: asset.id,
          buildMode: mode.id,
          message: text,
          messages,
          communicationStyle: style,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.")
        setIsLoading(false)
        return
      }

      const updated: BusinessAssetBuildMessage[] = [
        ...nextMessages,
        { role: "assistant", content: data.message },
      ]
      setMessages(updated)

      if (data.finalDraft) {
        setFinalDraft(data.finalDraft)
      }

      if (buildId) {
        await updateBusinessAssetBuildInDb(buildId, updated, data.finalDraft ?? undefined)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage()
  }

  if (finalDraft) {
    return (
      <div className="harmony-panel p-6 text-center sm:p-8">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
          <CheckCircle2 className="h-7 w-7 text-brand-green" aria-hidden />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-brand-ink">
          Your {asset.name} is ready
        </h3>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-brand-ink-soft">
          {executiveName} drafted this with you, live. It has been saved — you can come back and refine it anytime.
        </p>
        <div className="mt-5 rounded-xl border border-black/[0.06] bg-brand-cream/60 p-5 text-left">
          <p className="whitespace-pre-wrap text-pretty text-sm leading-relaxed text-brand-ink">{finalDraft}</p>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setFinalDraft(null)
            }}
            className="ds-btn-secondary"
          >
            Keep Refining
          </button>
          <button type="button" onClick={onExit} className="ds-btn-primary">
            Back to {asset.name}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="harmony-panel flex h-[560px] flex-col overflow-hidden p-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
            <Sparkles className="h-4 w-4 text-brand-green" aria-hidden />
          </span>
          <div>
            <p className="ds-eyebrow">{executiveName} — Live</p>
            <p className="text-xs text-brand-ink-soft">
              {modeLabel} · {asset.name}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-ink-soft ds-transition hover:text-brand-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Exit
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {isBooting ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand-green" aria-hidden />
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-brand-green text-white"
                    : "border border-black/[0.06] bg-brand-cream/60 text-brand-ink"
                }`}
              >
                <p className="whitespace-pre-wrap text-pretty">{m.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-xl border border-black/[0.06] bg-brand-cream/60 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-brand-green" aria-hidden />
            </div>
          </div>
        )}
        {error && (
          <p className="text-center text-xs font-medium text-destructive">{error}</p>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-black/[0.06] px-5 py-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${executiveName}...`}
          disabled={isBooting || isLoading}
          className="flex-1 rounded-lg border border-black/[0.08] bg-card px-3 py-2 text-sm text-brand-ink outline-none ds-transition focus:border-brand-green disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isBooting || isLoading || !input.trim()}
          className="ds-btn-primary shrink-0 disabled:opacity-40"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        </button>
      </form>
    </div>
  )
}
