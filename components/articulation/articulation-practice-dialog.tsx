"use client"

/**
 * Business Articulation Training™ — Practice Dialog (Phase 4 MVP)
 * ---------------------------------------------------------------------------
 * "Think it. Build it. Say it brilliantly."
 *
 * Opens on top of a founder's ACTUAL current work (a Business Asset™,
 * Delegation Brief™, Meeting Rule™, or any other CEO Workday™ item that
 * already has real content) and walks through:
 *
 *   audience → AI recommendation (order + spoken version) → founder
 *   practices (type or speak) → AI feedback → practice again
 *
 * Ephemeral by design — nothing here is persisted. No new artifact type,
 * no new database table, no History record. Reuses the founder's existing
 * Communication Style™ (business-comprehension-store) and the existing
 * browser Web Speech API pattern from components/barbara-chief-of-staff.tsx.
 */

import { useEffect, useRef, useState } from "react"
import { Loader2, Mic, MicOff, Sparkles, Volume2, VolumeX } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getCommunicationStyle } from "@/lib/business-comprehension/business-comprehension-store"

export interface ArticulationSourceContext {
  /** Display title of the thing being communicated, e.g. "Client Onboarding" or "Weekly Team Sync Rule". */
  sourceTitle: string
  /** Short human label for what kind of work this is, e.g. "Delegation Brief™", "Business Asset™". */
  sourceKind: string
  /** The real content being communicated — what it is, why it matters, and/or what was built. */
  sourceContent: string
  /** Why the founder is communicating this right now, e.g. "hand off this work to a team member". */
  purpose: string
}

const AUDIENCES = ["Team", "Employee", "Client", "Prospect", "Partner", "Investor", "Board", "Public"]

type Step = "audience" | "loading-recommend" | "recommend" | "practice" | "loading-feedback" | "feedback"

export function ArticulationPracticeDialog({
  open,
  onClose,
  source,
}: {
  open: boolean
  onClose: () => void
  source: ArticulationSourceContext
}) {
  const [step, setStep] = useState<Step>("audience")
  const [audience, setAudience] = useState<string>(AUDIENCES[0])
  const [recommendedOrder, setRecommendedOrder] = useState<string[]>([])
  const [recommendedSpokenVersion, setRecommendedSpokenVersion] = useState("")
  const [practiceAttempt, setPracticeAttempt] = useState("")
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Reset to a fresh session every time the dialog is reopened for a new (or the same) source.
  useEffect(() => {
    if (open) {
      setStep("audience")
      setAudience(AUDIENCES[0])
      setRecommendedOrder([])
      setRecommendedSpokenVersion("")
      setPracticeAttempt("")
      setFeedback("")
      setError(null)
    }
  }, [open, source.sourceTitle])

  useEffect(() => {
    if (typeof window === "undefined") return
    synthRef.current = window.speechSynthesis
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setSpeechSupported(true)
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setPracticeAttempt((prev) => (prev ? `${prev} ${transcript}` : transcript))
        setIsListening(false)
      }
      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
    }
    return () => {
      synthRef.current?.cancel()
    }
  }, [])

  function toggleListening() {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  function speak(text: string) {
    if (!synthRef.current) return
    synthRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    synthRef.current.speak(utterance)
  }

  function stopSpeaking() {
    synthRef.current?.cancel()
    setIsSpeaking(false)
  }

  async function requestRecommendation() {
    setStep("loading-recommend")
    setError(null)
    try {
      const res = await fetch("/api/articulation-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "recommend",
          sourceTitle: source.sourceTitle,
          sourceKind: source.sourceKind,
          sourceContent: source.sourceContent,
          purpose: source.purpose,
          audience,
          communicationStyle: getCommunicationStyle(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setRecommendedOrder(data.recommendedOrder ?? [])
      setRecommendedSpokenVersion(data.recommendedSpokenVersion ?? "")
      setStep("recommend")
    } catch (err) {
      setError((err as Error).message)
      setStep("audience")
    }
  }

  async function requestFeedback() {
    if (!practiceAttempt.trim()) return
    setStep("loading-feedback")
    setError(null)
    try {
      const res = await fetch("/api/articulation-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "feedback",
          sourceTitle: source.sourceTitle,
          sourceKind: source.sourceKind,
          sourceContent: source.sourceContent,
          purpose: source.purpose,
          audience,
          communicationStyle: getCommunicationStyle(),
          recommendedSpokenVersion,
          practiceAttempt,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong.")
      setFeedback(data.feedback ?? "")
      setStep("feedback")
    } catch (err) {
      setError((err as Error).message)
      setStep("practice")
    }
  }

  function practiceAgain() {
    stopSpeaking()
    setPracticeAttempt("")
    setFeedback("")
    setError(null)
    setStep("practice")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          stopSpeaking()
          onClose()
        }
      }}
    >
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-coral" aria-hidden />
            <p className="ds-eyebrow">Business Articulation Training™</p>
          </div>
          <DialogTitle className="text-balance font-display text-xl font-semibold tracking-tight text-brand-ink">
            Say it brilliantly: {source.sourceTitle}
          </DialogTitle>
          <DialogDescription className="text-pretty text-sm leading-relaxed text-brand-ink-soft">
            {source.sourceKind} · {source.purpose}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p className="rounded-lg bg-brand-coral/[0.08] px-3 py-2 text-xs text-brand-coral" role="alert">
            {error}
          </p>
        )}

        {step === "audience" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-brand-ink">Who are you saying this to?</p>
            <div className="flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAudience(a)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ds-transition ${
                    audience === a
                      ? "bg-brand-ink text-white"
                      : "bg-brand-cream text-brand-ink-soft hover:bg-brand-cream/70"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <Button onClick={requestRecommendation} className="w-full">
              Get My Recommended Way to Say This
            </Button>
          </div>
        )}

        {step === "loading-recommend" && <LoadingState label="Finding the best way to say this…" />}

        {step === "recommend" && (
          <div className="space-y-5">
            {recommendedOrder.length > 0 && (
              <div className="ds-card ds-card-pad">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
                  Recommended order
                </p>
                <ol className="mt-2 space-y-1.5">
                  {recommendedOrder.map((line, i) => (
                    <li key={i} className="text-pretty text-sm leading-relaxed text-brand-ink">
                      <span className="font-semibold text-brand-ink-soft">{i + 1}.</span> {line}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="ds-card ds-card-pad">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
                  Recommended spoken version
                </p>
                {synthRef.current && (
                  <button
                    type="button"
                    onClick={() => (isSpeaking ? stopSpeaking() : speak(recommendedSpokenVersion))}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-ink-soft hover:text-brand-ink"
                  >
                    {isSpeaking ? <VolumeX className="h-3.5 w-3.5" aria-hidden /> : <Volume2 className="h-3.5 w-3.5" aria-hidden />}
                    {isSpeaking ? "Stop" : "Listen"}
                  </button>
                )}
              </div>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-brand-ink">{recommendedSpokenVersion}</p>
            </div>

            <Button onClick={() => setStep("practice")} className="w-full">
              Practice It
            </Button>
          </div>
        )}

        {step === "practice" && (
          <div className="space-y-4">
            <div className="ds-card ds-card-pad">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
                Now say it in your own words
              </p>
              <p className="mt-1 text-pretty text-xs leading-relaxed text-brand-ink-soft">
                Type it, or tap the mic to speak it{speechSupported ? "" : " (speech recognition isn't available in this browser — typing works everywhere)"}.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Textarea
                value={practiceAttempt}
                onChange={(e) => setPracticeAttempt(e.target.value)}
                placeholder="Say what you'd actually say…"
                className="min-h-[140px] flex-1"
                disabled={isListening}
              />
              {speechSupported && (
                <Button
                  type="button"
                  size="icon"
                  variant={isListening ? "default" : "outline"}
                  onClick={toggleListening}
                  className="shrink-0"
                  aria-label={isListening ? "Stop recording" : "Speak your attempt"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
            </div>
            <Button onClick={requestFeedback} disabled={!practiceAttempt.trim()} className="w-full">
              Get Feedback
            </Button>
          </div>
        )}

        {step === "loading-feedback" && <LoadingState label="Reviewing your attempt…" />}

        {step === "feedback" && (
          <div className="space-y-5">
            <div className="ds-card ds-card-pad">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Feedback</p>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-brand-ink">{feedback}</p>
            </div>
            <div className="ds-card ds-card-pad">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
                Recommended version
              </p>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-brand-ink">{recommendedSpokenVersion}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={practiceAgain} variant="outline" className="flex-1">
                Practice Again
              </Button>
              <Button onClick={() => onClose()} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <Loader2 className="h-5 w-5 animate-spin text-brand-ink-soft" aria-hidden />
      <p className="text-sm text-brand-ink-soft">{label}</p>
    </div>
  )
}
