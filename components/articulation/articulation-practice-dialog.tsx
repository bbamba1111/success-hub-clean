"use client"

/**
 * Business Articulation Training™ — Practice Dialog (Phase 4B)
 * ---------------------------------------------------------------------------
 * Integration contract UNCHANGED from Phase 4 MVP:
 *   <ArticulationPracticeDialog open={...} onClose={...} source={...} />
 * Both call sites (todays-work-queue.tsx, articulation-highlight-banner.tsx)
 * need zero changes — everything new lives inside this file and its
 * lib/articulation/* helpers.
 *
 * Flow: Source → Understand → Purpose/Audience/Style/Duration → Versions
 * (pick one) → Strengthen (accept/edit/skip suggested insertions) →
 * Rehearsal (teleprompter + timer + lock) → Speak/Type → Feedback (diff-
 * grounded) → Practice Again / Memorization / Retrieval → Print.
 *
 * Nothing here is persisted. Closing the dialog discards the session.
 */

import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  Printer,
  Sparkles,
  Square,
  Volume2,
  X,
} from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { getCommunicationStyle as getStyleDefinition, COMMUNICATION_STYLES } from "@/lib/business-comprehension/business-comprehension"
import { getCommunicationStyle as getSavedCommunicationStyleId } from "@/lib/business-comprehension/business-comprehension-store"
import { getLocalePreferences } from "@/lib/i18n/locale-preferences-store"
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/language"
import {
  ARTICULATION_AUDIENCES,
  ARTICULATION_DURATION_PRESETS,
  ARTICULATION_PURPOSES,
  ARTICULATION_BLOCK_LABELS,
  MEMORIZATION_LEVELS,
  type ArticulationAudience,
  type ArticulationBlock,
  type ArticulationPurpose,
  type ArticulationStrengthenSuggestion,
  type ArticulationUnderstanding,
  type ArticulationVersion,
  type MemorizationLevel,
  type RehearsalLock,
} from "@/lib/articulation/types"
import { diffTranscript, summarizeDiffForPrompt, type TranscriptDiffSummary } from "@/lib/articulation/transcript-diff"
import { applyMemorizationLevel, getNextBlockForRetrieval } from "@/lib/articulation/memorization"

export interface ArticulationSourceContext {
  sourceTitle: string
  sourceKind: string
  sourceContent: string
  purpose: string
}

interface ArticulationPracticeDialogProps {
  open: boolean
  onClose: () => void
  source: ArticulationSourceContext
}

type Step = "understand" | "configure" | "versions" | "strengthen" | "rehearsal" | "practice" | "feedback" | "after"

function makeLocalId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function ArticulationPracticeDialog({ open, onClose, source }: ArticulationPracticeDialogProps) {
  const [step, setStep] = useState<Step>("understand")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Understand
  const [understanding, setUnderstanding] = useState<ArticulationUnderstanding | null>(null)

  // Configure
  const [purpose, setPurpose] = useState<ArticulationPurpose>((source.purpose as ArticulationPurpose) || "Explain")
  const [audience, setAudience] = useState<ArticulationAudience>("A customer")
  const [communicationStyle, setCommunicationStyle] = useState<string>(() => getSavedCommunicationStyleId())
  const [durationSeconds, setDurationSeconds] = useState<number>(60)
  const [practiceLanguage, setPracticeLanguage] = useState<string>(() => getLocalePreferences().language)

  // Versions
  const [versions, setVersions] = useState<ArticulationVersion[]>([])
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null)
  const selectedVersion = versions.find((v) => v.id === selectedVersionId) ?? null

  // Strengthen
  const [suggestions, setSuggestions] = useState<ArticulationStrengthenSuggestion[]>([])
  const [dismissedSuggestionIds, setDismissedSuggestionIds] = useState<Set<string>>(new Set())

  // Rehearsal
  const [rehearsalLock, setRehearsalLock] = useState<RehearsalLock | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Practice
  const [practiceMode, setPracticeMode] = useState<"speak" | "type">("type")
  const [practiceAttempt, setPracticeAttempt] = useState("")
  const [isRecognizing, setIsRecognizing] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Feedback
  const [diffSummary, setDiffSummary] = useState<TranscriptDiffSummary | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  // After: memorization / retrieval / challenge
  const [memorizationLevel, setMemorizationLevel] = useState<MemorizationLevel>("full")
  const [retrievalCurrentBlockId, setRetrievalCurrentBlockId] = useState<string | null>(null)
  const [retrievalRevealed, setRetrievalRevealed] = useState(false)
  const [challengeQuestions, setChallengeQuestions] = useState<string[] | null>(null)

  useEffect(() => {
    if (!open) return
    // Reset the whole session each time the dialog opens fresh.
    setStep("understand")
    setError(null)
    setUnderstanding(null)
    setVersions([])
    setSelectedVersionId(null)
    setSuggestions([])
    setDismissedSuggestionIds(new Set())
    setRehearsalLock(null)
    setTimerSeconds(0)
    setTimerRunning(false)
    setPracticeAttempt("")
    setRecordedAudioUrl(null)
    setDiffSummary(null)
    setFeedback(null)
    setMemorizationLevel("full")
    setRetrievalCurrentBlockId(null)
    setRetrievalRevealed(false)
    setChallengeQuestions(null)
    void fetchUnderstanding()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimerSeconds((s) => s + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerRunning])

  async function callApi(action: string, extra: Record<string, unknown>) {
    setError(null)
    const res = await fetch("/api/articulation-practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        sourceTitle: source.sourceTitle,
        sourceKind: source.sourceKind,
        sourceContent: source.sourceContent,
        purpose,
        audience,
        communicationStyle,
        practiceLanguage,
        ...extra,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong. Please try again.")
    }
    return data
  }

  async function fetchUnderstanding() {
    setLoading(true)
    try {
      const data = await callApi("understand", {})
      setUnderstanding(data.understanding)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't understand the source. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function fetchVersions() {
    setLoading(true)
    setError(null)
    try {
      const data = await callApi("versions", { durationSeconds })
      const fetchedVersions: ArticulationVersion[] = data.versions
      setVersions(fetchedVersions)
      setSelectedVersionId(fetchedVersions[0]?.id ?? null)
      setStep("versions")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't generate versions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function fetchStrengthenSuggestions() {
    if (!selectedVersion) return
    setLoading(true)
    setError(null)
    try {
      const data = await callApi("strengthen", { blocks: selectedVersion.blocks })
      setSuggestions(data.suggestions)
      setDismissedSuggestionIds(new Set())
      setStep("strengthen")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't generate suggestions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function applySuggestion(suggestion: ArticulationStrengthenSuggestion) {
    if (!selectedVersionId) return
    setVersions((prev) =>
      prev.map((v) => {
        if (v.id !== selectedVersionId) return v
        const newBlock: ArticulationBlock = {
          id: makeLocalId("block"),
          type: suggestion.blockType,
          content: suggestion.content,
          source: "ai",
          rationale: suggestion.why,
        }
        const insertIndex = suggestion.insertAfterBlockId
          ? v.blocks.findIndex((b) => b.id === suggestion.insertAfterBlockId) + 1
          : 0
        const blocks = [...v.blocks]
        blocks.splice(Math.max(0, insertIndex), 0, newBlock)
        return { ...v, blocks }
      }),
    )
    setDismissedSuggestionIds((prev) => new Set(prev).add(suggestion.id))
  }

  function dismissSuggestion(id: string) {
    setDismissedSuggestionIds((prev) => new Set(prev).add(id))
  }

  function updateBlockContent(blockId: string, content: string) {
    if (!selectedVersionId) return
    setVersions((prev) =>
      prev.map((v) =>
        v.id !== selectedVersionId
          ? v
          : { ...v, blocks: v.blocks.map((b) => (b.id === blockId ? { ...b, content, source: "founder" as const } : b)) },
      ),
    )
  }

  function removeBlock(blockId: string) {
    if (!selectedVersionId) return
    setVersions((prev) =>
      prev.map((v) => (v.id !== selectedVersionId ? v : { ...v, blocks: v.blocks.filter((b) => b.id !== blockId) })),
    )
  }

  function moveBlock(blockId: string, direction: -1 | 1) {
    if (!selectedVersionId) return
    setVersions((prev) =>
      prev.map((v) => {
        if (v.id !== selectedVersionId) return v
        const index = v.blocks.findIndex((b) => b.id === blockId)
        const target = index + direction
        if (index === -1 || target < 0 || target >= v.blocks.length) return v
        const blocks = [...v.blocks]
        const [moved] = blocks.splice(index, 1)
        blocks.splice(target, 0, moved)
        return { ...v, blocks }
      }),
    )
  }

  function addOwnBlock() {
    if (!selectedVersionId) return
    setVersions((prev) =>
      prev.map((v) =>
        v.id !== selectedVersionId
          ? v
          : {
              ...v,
              blocks: [...v.blocks, { id: makeLocalId("block"), type: "spoken" as const, content: "", source: "founder" as const }],
            },
      ),
    )
  }

  function startRehearsal() {
    if (!selectedVersion) return
    setRehearsalLock({
      versionId: selectedVersion.id,
      style: communicationStyle,
      audience,
      purpose,
      durationSeconds,
    })
    setTimerSeconds(0)
    setStep("rehearsal")
  }

  function endRehearsal() {
    setRehearsalLock(null)
    setTimerRunning(false)
  }

  function speakVersionAloud() {
    if (!selectedVersion || typeof window === "undefined" || !("speechSynthesis" in window)) return
    const text = selectedVersion.blocks.map((b) => b.content).join(" ")
    const utterance = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }

  function startSpeechRecognition() {
    if (typeof window === "undefined") return
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionCtor) {
      setError("Speech recognition isn't supported in this browser. Use typed practice instead.")
      setPracticeMode("type")
      return
    }
    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = practiceLanguage.startsWith("en") ? practiceLanguage : "en-US"
    let finalTranscript = ""
    recognition.onresult = (event: any) => {
      let interim = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " "
        } else {
          interim += transcript
        }
      }
      setPracticeAttempt(finalTranscript + interim)
    }
    recognition.onerror = () => setIsRecognizing(false)
    recognition.onend = () => setIsRecognizing(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsRecognizing(true)
  }

  function stopSpeechRecognition() {
    recognitionRef.current?.stop()
    setIsRecognizing(false)
  }

  async function startAudioRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      audioChunksRef.current = []
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setRecordedAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecordingAudio(true)
    } catch {
      setError("Couldn't access the microphone for recording. Check browser permissions.")
    }
  }

  function stopAudioRecording() {
    mediaRecorderRef.current?.stop()
    setIsRecordingAudio(false)
  }

  async function submitPractice() {
    if (!selectedVersion || !practiceAttempt.trim()) return
    setLoading(true)
    setError(null)
    try {
      const expectedText = selectedVersion.blocks.map((b) => b.content).join(" ")
      const diff = diffTranscript(expectedText, practiceAttempt)
      setDiffSummary(diff)
      const data = await callApi("feedback", {
        blocks: selectedVersion.blocks,
        practiceAttempt,
        diffSummary: summarizeDiffForPrompt(diff),
      })
      setFeedback(data.feedback)
      setStep("feedback")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't generate feedback. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function fetchChallengeQuestions() {
    setLoading(true)
    setError(null)
    try {
      const data = await callApi("challenge", {})
      setChallengeQuestions(data.questions)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't generate questions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function practiceAgain() {
    setPracticeAttempt("")
    setRecordedAudioUrl(null)
    setDiffSummary(null)
    setFeedback(null)
    setStep("practice")
  }

  function handlePrint() {
    window.print()
  }

  function formatTimer(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const activeSuggestions = suggestions.filter((s) => !dismissedSuggestionIds.has(s.id))
  const memorizationLines = selectedVersion ? applyMemorizationLevel(selectedVersion.blocks, memorizationLevel) : []

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="fixed inset-0 top-0 left-0 h-screen w-screen max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 sm:rounded-none print:h-auto print:overflow-visible">
        <DialogTitle className="sr-only">Business Articulation Training™ — Practice Communicating This</DialogTitle>
        <div className="flex h-full flex-col bg-[#FBF8F6] print:hidden">
          <header className="flex items-center justify-between border-b border-[#E7DCE0] bg-white px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#5A7A45]" aria-hidden />
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#6B5860]">
                Business Articulation Training™
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-[#6B5860] hover:bg-[#F4EDEF] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto max-w-2xl">
              <p className="mb-6 font-sans text-sm text-[#6B5860]">
                Practicing: <span className="font-bold text-[#2B1B22]">{source.sourceTitle}</span>
              </p>

              {error && (
                <div className="mb-6 rounded-lg border border-[#E4A5AE] bg-[#FBEDEF] px-4 py-3 font-sans text-sm text-[#8A3A45]">
                  {error}
                </div>
              )}

              {step === "understand" && (
                <UnderstandStep
                  loading={loading}
                  understanding={understanding}
                  onNext={() => setStep("configure")}
                  onRegenerate={fetchUnderstanding}
                />
              )}

              {step === "configure" && (
                <ConfigureStep
                  purpose={purpose}
                  setPurpose={setPurpose}
                  audience={audience}
                  setAudience={setAudience}
                  communicationStyle={communicationStyle}
                  setCommunicationStyle={setCommunicationStyle}
                  durationSeconds={durationSeconds}
                  setDurationSeconds={setDurationSeconds}
                  practiceLanguage={practiceLanguage}
                  setPracticeLanguage={setPracticeLanguage}
                  loading={loading}
                  onBack={() => setStep("understand")}
                  onNext={fetchVersions}
                />
              )}

              {step === "versions" && (
                <VersionsStep
                  loading={loading}
                  versions={versions}
                  selectedVersionId={selectedVersionId}
                  onSelect={setSelectedVersionId}
                  onBack={() => setStep("configure")}
                  onNext={fetchStrengthenSuggestions}
                  onRegenerate={fetchVersions}
                />
              )}

              {step === "strengthen" && selectedVersion && (
                <StrengthenStep
                  version={selectedVersion}
                  suggestions={activeSuggestions}
                  onApply={applySuggestion}
                  onDismiss={dismissSuggestion}
                  onUpdateBlock={updateBlockContent}
                  onRemoveBlock={removeBlock}
                  onMoveBlock={moveBlock}
                  onAddOwnBlock={addOwnBlock}
                  onBack={() => setStep("versions")}
                  onNext={startRehearsal}
                />
              )}

              {step === "rehearsal" && selectedVersion && rehearsalLock && (
                <RehearsalStep
                  version={selectedVersion}
                  lock={rehearsalLock}
                  timerSeconds={timerSeconds}
                  timerRunning={timerRunning}
                  onToggleTimer={() => setTimerRunning((r) => !r)}
                  onResetTimer={() => setTimerSeconds(0)}
                  onSpeakAloud={speakVersionAloud}
                  formatTimer={formatTimer}
                  onEndRehearsal={() => {
                    endRehearsal()
                    setStep("practice")
                  }}
                />
              )}

              {step === "practice" && selectedVersion && (
                <PracticeStep
                  practiceMode={practiceMode}
                  setPracticeMode={setPracticeMode}
                  practiceAttempt={practiceAttempt}
                  setPracticeAttempt={setPracticeAttempt}
                  isRecognizing={isRecognizing}
                  onStartRecognition={startSpeechRecognition}
                  onStopRecognition={stopSpeechRecognition}
                  isRecordingAudio={isRecordingAudio}
                  recordedAudioUrl={recordedAudioUrl}
                  onStartRecording={startAudioRecording}
                  onStopRecording={stopAudioRecording}
                  loading={loading}
                  onBack={() => setStep("rehearsal")}
                  onSubmit={submitPractice}
                />
              )}

              {step === "feedback" && selectedVersion && diffSummary && (
                <FeedbackStep
                  feedback={feedback}
                  diffSummary={diffSummary}
                  onPracticeAgain={practiceAgain}
                  onContinue={() => setStep("after")}
                />
              )}

              {step === "after" && selectedVersion && (
                <AfterStep
                  version={selectedVersion}
                  memorizationLevel={memorizationLevel}
                  setMemorizationLevel={setMemorizationLevel}
                  memorizationLines={memorizationLines}
                  retrievalCurrentBlockId={retrievalCurrentBlockId}
                  retrievalRevealed={retrievalRevealed}
                  onRetrievalNext={() => {
                    const next = getNextBlockForRetrieval(selectedVersion.blocks, retrievalCurrentBlockId)
                    setRetrievalCurrentBlockId(next?.id ?? null)
                    setRetrievalRevealed(false)
                  }}
                  onRetrievalReveal={() => setRetrievalRevealed(true)}
                  challengeQuestions={challengeQuestions}
                  onFetchChallenge={fetchChallengeQuestions}
                  loading={loading}
                  onPracticeAgain={practiceAgain}
                  onPrint={handlePrint}
                />
              )}
            </div>
          </div>
        </div>

        {/* Print-only view: structure, key phrases, transitions, stage directions, the ask. */}
        <div className="hidden print:block p-8">
          <h1 className="font-bold text-xl mb-1">{source.sourceTitle}</h1>
          <p className="text-sm mb-4">
            {purpose} · {audience} · {ARTICULATION_DURATION_PRESETS.find((d) => d.seconds === durationSeconds)?.label}
          </p>
          {selectedVersion?.blocks.map((block, i) => (
            <div key={block.id} className="mb-3">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                {i + 1}. {ARTICULATION_BLOCK_LABELS[block.type]}
              </p>
              <p className="text-sm">{block.content}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-8 text-[#6B5860]">
      <Loader2 className="h-4 w-4 animate-spin" />
      <p className="font-sans text-sm">{label}</p>
    </div>
  )
}

function StepNav({
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  loading,
}: {
  onBack?: () => void
  onNext: () => void
  nextLabel: string
  nextDisabled?: boolean
  loading?: boolean
}) {
  return (
    <div className="mt-8 flex items-center justify-between">
      {onBack ? (
        <Button variant="ghost" onClick={onBack} className="gap-1.5 text-[#6B5860]">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      ) : (
        <span />
      )}
      <Button onClick={onNext} disabled={nextDisabled || loading} className="gap-1.5 bg-[#5A7A45] hover:bg-[#4A6838]">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {nextLabel}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  )
}

function UnderstandStep({
  loading,
  understanding,
  onNext,
  onRegenerate,
}: {
  loading: boolean
  understanding: ArticulationUnderstanding | null
  onNext: () => void
  onRegenerate: () => void
}) {
  if (loading && !understanding) return <LoadingBlock label="Understanding what you're working on..." />
  if (!understanding) return null
  return (
    <div>
      <h2 className="font-montserrat text-lg font-bold text-[#2B1B22] mb-1">Let&apos;s confirm what this is</h2>
      <p className="font-sans text-sm text-[#6B5860] mb-6">
        Here&apos;s what I understand. If anything is off, keep it in mind — you can adjust wording as you go.
      </p>
      <div className="space-y-4 rounded-xl border border-[#E7DCE0] bg-white p-5">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-wide text-[#B7A6AE]">Core idea</p>
          <p className="font-sans text-sm text-[#2B1B22]">{understanding.coreIdea}</p>
        </div>
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-wide text-[#B7A6AE]">Objective</p>
          <p className="font-sans text-sm text-[#2B1B22]">{understanding.objective}</p>
        </div>
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-wide text-[#B7A6AE]">This audience cares about</p>
          <p className="font-sans text-sm text-[#2B1B22]">{understanding.audienceSummary}</p>
        </div>
        {understanding.keyClaims.length > 0 && (
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-wide text-[#B7A6AE]">Key claims</p>
            <ul className="list-disc pl-4 font-sans text-sm text-[#2B1B22]">
              {understanding.keyClaims.map((claim, i) => (
                <li key={i}>{claim}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onRegenerate}
        disabled={loading}
        className="mt-3 font-sans text-xs font-bold text-[#5A7A45] hover:underline disabled:opacity-50"
      >
        Regenerate
      </button>
      <StepNav onNext={onNext} nextLabel="Continue" />
    </div>
  )
}

function ConfigureStep({
  purpose,
  setPurpose,
  audience,
  setAudience,
  communicationStyle,
  setCommunicationStyle,
  durationSeconds,
  setDurationSeconds,
  practiceLanguage,
  setPracticeLanguage,
  loading,
  onBack,
  onNext,
}: {
  purpose: ArticulationPurpose
  setPurpose: (p: ArticulationPurpose) => void
  audience: ArticulationAudience
  setAudience: (a: ArticulationAudience) => void
  communicationStyle: string
  setCommunicationStyle: (s: string) => void
  durationSeconds: number
  setDurationSeconds: (d: number) => void
  practiceLanguage: string
  setPracticeLanguage: (l: string) => void
  loading: boolean
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div>
      <h2 className="font-montserrat text-lg font-bold text-[#2B1B22] mb-1">Set up this practice</h2>
      <p className="font-sans text-sm text-[#6B5860] mb-6">Who are you talking to, why, and how long do you have?</p>
      <div className="space-y-5">
        <Field label="Purpose">
          <Select value={purpose} onValueChange={(v) => setPurpose(v as ArticulationPurpose)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ARTICULATION_PURPOSES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Audience">
          <Select value={audience} onValueChange={(v) => setAudience(v as ArticulationAudience)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ARTICULATION_AUDIENCES.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Communication Style™">
          <Select value={communicationStyle} onValueChange={setCommunicationStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMUNICATION_STYLES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Duration">
          <div className="flex flex-wrap gap-2">
            {ARTICULATION_DURATION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setDurationSeconds(preset.seconds)}
                className={cn(
                  "rounded-full border px-3 py-1.5 font-sans text-xs font-bold transition-colors",
                  durationSeconds === preset.seconds
                    ? "border-[#5A7A45] bg-[#5A7A45] text-white"
                    : "border-[#E7DCE0] bg-white text-[#6B5860] hover:border-[#5A7A45]",
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Practice Language (this session only)">
          <Select value={practiceLanguage} onValueChange={setPracticeLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.englishName} ({lang.nativeName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <StepNav onBack={onBack} onNext={onNext} nextLabel="Generate versions" loading={loading} />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 font-sans text-xs font-bold uppercase tracking-wide text-[#6B5860]">{label}</p>
      {children}
    </div>
  )
}

function VersionsStep({
  loading,
  versions,
  selectedVersionId,
  onSelect,
  onBack,
  onNext,
  onRegenerate,
}: {
  loading: boolean
  versions: ArticulationVersion[]
  selectedVersionId: string | null
  onSelect: (id: string) => void
  onBack: () => void
  onNext: () => void
  onRegenerate: () => void
}) {
  if (loading && versions.length === 0) return <LoadingBlock label="Drafting your versions..." />
  return (
    <div>
      <h2 className="font-montserrat text-lg font-bold text-[#2B1B22] mb-1">Choose your version</h2>
      <p className="font-sans text-sm text-[#6B5860] mb-6">
        Each one is restructured for your audience and duration — not the same words padded or cut.
      </p>
      <div className="space-y-3">
        {versions.map((version) => (
          <button
            key={version.id}
            type="button"
            onClick={() => onSelect(version.id)}
            className={cn(
              "w-full rounded-xl border p-4 text-left transition-colors",
              selectedVersionId === version.id
                ? "border-[#5A7A45] bg-[#EEF3EA]"
                : "border-[#E7DCE0] bg-white hover:border-[#5A7A45]",
            )}
          >
            <p className="font-montserrat text-sm font-bold text-[#2B1B22]">{version.name}</p>
            <p className="mt-1 font-sans text-sm text-[#6B5860] line-clamp-3">
              {version.blocks.map((b) => b.content).join(" ")}
            </p>
            <p className="mt-2 font-sans text-xs font-bold text-[#B7A6AE]">{version.blocks.length} blocks</p>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onRegenerate}
        disabled={loading}
        className="mt-3 font-sans text-xs font-bold text-[#5A7A45] hover:underline disabled:opacity-50"
      >
        Regenerate versions
      </button>
      <StepNav
        onBack={onBack}
        onNext={onNext}
        nextLabel="Strengthen this"
        nextDisabled={!selectedVersionId}
        loading={loading}
      />
    </div>
  )
}

function StrengthenStep({
  version,
  suggestions,
  onApply,
  onDismiss,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlock,
  onAddOwnBlock,
  onBack,
  onNext,
}: {
  version: ArticulationVersion
  suggestions: ArticulationStrengthenSuggestion[]
  onApply: (s: ArticulationStrengthenSuggestion) => void
  onDismiss: (id: string) => void
  onUpdateBlock: (blockId: string, content: string) => void
  onRemoveBlock: (blockId: string) => void
  onMoveBlock: (blockId: string, direction: -1 | 1) => void
  onAddOwnBlock: () => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div>
      <h2 className="font-montserrat text-lg font-bold text-[#2B1B22] mb-1">Strengthen it</h2>
      <p className="font-sans text-sm text-[#6B5860] mb-6">
        Edit, reorder, or remove any line. Accept a suggestion to insert it exactly where recommended.
      </p>

      {suggestions.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="font-sans text-xs font-bold uppercase tracking-wide text-[#6B5860]">Suggestions</p>
          {suggestions.map((s) => (
            <div key={s.id} className="rounded-lg border border-[#D7C9A9] bg-[#FBF6E9] p-3">
              <p className="font-sans text-sm font-bold text-[#2B1B22]">
                {s.what} <span className="text-[#B7A6AE]">— {s.where}</span>
              </p>
              <p className="font-sans text-xs text-[#6B5860] mb-2">{s.why}</p>
              <p className="font-sans text-sm text-[#2B1B22] italic mb-2">&quot;{s.content}&quot;</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => onApply(s)} className="bg-[#5A7A45] hover:bg-[#4A6838]">
                  <Check className="h-3.5 w-3.5 mr-1" /> Insert
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDismiss(s.id)}>
                  Skip
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {version.blocks.map((block, i) => (
          <div key={block.id} className="rounded-lg border border-[#E7DCE0] bg-white p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <Badge variant="secondary" className="font-sans text-[10px]">
                {ARTICULATION_BLOCK_LABELS[block.type]}
              </Badge>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onMoveBlock(block.id, -1)}
                  disabled={i === 0}
                  className="rounded p-1 text-[#B7A6AE] hover:text-[#2B1B22] disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveBlock(block.id, 1)}
                  disabled={i === version.blocks.length - 1}
                  className="rounded p-1 text-[#B7A6AE] hover:text-[#2B1B22] disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveBlock(block.id)}
                  className="rounded p-1 text-[#B7A6AE] hover:text-[#C4707B]"
                  aria-label="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <Textarea
              value={block.content}
              onChange={(e) => onUpdateBlock(block.id, e.target.value)}
              className="min-h-[2.5rem] border-0 p-0 font-sans text-sm text-[#2B1B22] shadow-none focus-visible:ring-0"
            />
          </div>
        ))}
      </div>

      <button type="button" onClick={onAddOwnBlock} className="mt-3 font-sans text-xs font-bold text-[#5A7A45] hover:underline">
        + Add my own line
      </button>

      <StepNav onBack={onBack} onNext={onNext} nextLabel="Start rehearsal" nextDisabled={version.blocks.length === 0} />
    </div>
  )
}

function RehearsalStep({
  version,
  lock,
  timerSeconds,
  timerRunning,
  onToggleTimer,
  onResetTimer,
  onSpeakAloud,
  formatTimer,
  onEndRehearsal,
}: {
  version: ArticulationVersion
  lock: RehearsalLock
  timerSeconds: number
  timerRunning: boolean
  onToggleTimer: () => void
  onResetTimer: () => void
  onSpeakAloud: () => void
  formatTimer: (s: number) => string
  onEndRehearsal: () => void
}) {
  const overTarget = timerSeconds > lock.durationSeconds
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-montserrat text-lg font-bold text-[#2B1B22]">Rehearsal — {version.name}</h2>
        <Badge variant="outline" className="font-sans">
          Locked for this session
        </Badge>
      </div>

      <div className="mb-4 flex items-center justify-between rounded-xl border border-[#E7DCE0] bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTimer}
            className="flex items-center gap-1.5 rounded-full bg-[#5A7A45] px-3 py-1.5 text-white"
          >
            {timerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <p className={cn("font-mono text-lg font-bold", overTarget ? "text-[#C4707B]" : "text-[#2B1B22]")}>
            {formatTimer(timerSeconds)}
          </p>
          <p className="font-sans text-xs text-[#B7A6AE]">/ target {formatTimer(lock.durationSeconds)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onResetTimer} className="font-sans text-xs font-bold text-[#6B5860] hover:underline">
            Reset
          </button>
          <button
            type="button"
            onClick={onSpeakAloud}
            className="flex items-center gap-1 font-sans text-xs font-bold text-[#5A7A45] hover:underline"
          >
            <Volume2 className="h-3.5 w-3.5" /> Listen
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[#E7DCE0] bg-white p-6 max-h-[50vh] overflow-y-auto">
        {version.blocks.map((block) => (
          <p
            key={block.id}
            className={cn(
              "mb-4 font-sans text-lg leading-relaxed text-[#2B1B22]",
              block.type === "pause" && "italic text-[#B7A6AE] text-sm",
              block.type === "emphasis" && "font-bold",
            )}
          >
            {block.content}
          </p>
        ))}
      </div>

      <StepNav onNext={onEndRehearsal} nextLabel="Ready to speak or type" />
    </div>
  )
}

function PracticeStep({
  practiceMode,
  setPracticeMode,
  practiceAttempt,
  setPracticeAttempt,
  isRecognizing,
  onStartRecognition,
  onStopRecognition,
  isRecordingAudio,
  recordedAudioUrl,
  onStartRecording,
  onStopRecording,
  loading,
  onBack,
  onSubmit,
}: {
  practiceMode: "speak" | "type"
  setPracticeMode: (m: "speak" | "type") => void
  practiceAttempt: string
  setPracticeAttempt: (v: string) => void
  isRecognizing: boolean
  onStartRecognition: () => void
  onStopRecognition: () => void
  isRecordingAudio: boolean
  recordedAudioUrl: string | null
  onStartRecording: () => void
  onStopRecording: () => void
  loading: boolean
  onBack: () => void
  onSubmit: () => void
}) {
  return (
    <div>
      <h2 className="font-montserrat text-lg font-bold text-[#2B1B22] mb-1">Your turn</h2>
      <p className="font-sans text-sm text-[#6B5860] mb-6">Speak it out loud, or type what you&apos;d say.</p>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setPracticeMode("type")}
          className={cn(
            "rounded-full px-3 py-1.5 font-sans text-xs font-bold",
            practiceMode === "type" ? "bg-[#5A7A45] text-white" : "bg-white text-[#6B5860] border border-[#E7DCE0]",
          )}
        >
          Type it
        </button>
        <button
          type="button"
          onClick={() => setPracticeMode("speak")}
          className={cn(
            "rounded-full px-3 py-1.5 font-sans text-xs font-bold",
            practiceMode === "speak" ? "bg-[#5A7A45] text-white" : "bg-white text-[#6B5860] border border-[#E7DCE0]",
          )}
        >
          Speak it
        </button>
      </div>

      {practiceMode === "speak" && (
        <div className="mb-3 flex items-center gap-3">
          <button
            type="button"
            onClick={isRecognizing ? onStopRecognition : onStartRecognition}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-sm font-bold",
              isRecognizing ? "bg-[#C4707B] text-white" : "bg-[#5A7A45] text-white",
            )}
          >
            {isRecognizing ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecognizing ? "Stop listening" : "Start speaking"}
          </button>
          <button
            type="button"
            onClick={isRecordingAudio ? onStopRecording : onStartRecording}
            className="flex items-center gap-1.5 rounded-full border border-[#E7DCE0] bg-white px-4 py-2 font-sans text-sm font-bold text-[#6B5860]"
          >
            {isRecordingAudio ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecordingAudio ? "Stop recording" : "Record audio (optional)"}
          </button>
        </div>
      )}

      {recordedAudioUrl && (
        <audio controls src={recordedAudioUrl} className="mb-3 w-full">
          <track kind="captions" />
        </audio>
      )}

      <Textarea
        value={practiceAttempt}
        onChange={(e) => setPracticeAttempt(e.target.value)}
        placeholder={practiceMode === "speak" ? "Your speech will appear here as you talk..." : "Type what you'd say..."}
        className="min-h-[10rem] font-sans text-sm"
      />

      <StepNav onBack={onBack} onNext={onSubmit} nextLabel="Get feedback" nextDisabled={!practiceAttempt.trim()} loading={loading} />
    </div>
  )
}

function FeedbackStep({
  feedback,
  diffSummary,
  onPracticeAgain,
  onContinue,
}: {
  feedback: string | null
  diffSummary: TranscriptDiffSummary
  onPracticeAgain: () => void
  onContinue: () => void
}) {
  return (
    <div>
      <h2 className="font-montserrat text-lg font-bold text-[#2B1B22] mb-1">Feedback</h2>
      <div className="mb-4 rounded-xl border border-[#E7DCE0] bg-white p-5">
        <p className="mb-2 font-sans text-xs font-bold uppercase tracking-wide text-[#B7A6AE]">
          Coverage: {diffSummary.coveragePercent}%
        </p>
        <p className="font-sans text-sm leading-relaxed text-[#2B1B22]">{feedback}</p>
      </div>

      {(diffSummary.skippedWords.length > 0 || diffSummary.addedWords.length > 0) && (
        <div className="mb-4 rounded-xl border border-[#E7DCE0] bg-white p-4">
          <p className="mb-2 font-sans text-xs font-bold uppercase tracking-wide text-[#6B5860]">What changed</p>
          <p className="font-sans text-sm leading-relaxed">
            {diffSummary.ops.map((op, i) => (
              <span
                key={i}
                className={cn(op.type === "skipped" && "text-[#C4707B] line-through", op.type === "added" && "text-[#5A7A45] underline")}
              >
                {op.word}{" "}
              </span>
            ))}
          </p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onPracticeAgain} className="text-[#6B5860]">
          Practice again
        </Button>
        <Button onClick={onContinue} className="gap-1.5 bg-[#5A7A45] hover:bg-[#4A6838]">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function AfterStep({
  version,
  memorizationLevel,
  setMemorizationLevel,
  memorizationLines,
  retrievalCurrentBlockId,
  retrievalRevealed,
  onRetrievalNext,
  onRetrievalReveal,
  challengeQuestions,
  onFetchChallenge,
  loading,
  onPracticeAgain,
  onPrint,
}: {
  version: ArticulationVersion
  memorizationLevel: MemorizationLevel
  setMemorizationLevel: (l: MemorizationLevel) => void
  memorizationLines: { blockId: string; display: string; isRevealable: boolean }[]
  retrievalCurrentBlockId: string | null
  retrievalRevealed: boolean
  onRetrievalNext: () => void
  onRetrievalReveal: () => void
  challengeQuestions: string[] | null
  onFetchChallenge: () => void
  loading: boolean
  onPracticeAgain: () => void
  onPrint: () => void
}) {
  const [mode, setMode] = useState<"memorize" | "retrieval" | "challenge">("memorize")
  const retrievalBlock = version.blocks.find((b) => b.id === retrievalCurrentBlockId) ?? null

  return (
    <div>
      <h2 className="font-montserrat text-lg font-bold text-[#2B1B22] mb-1">Make it yours</h2>
      <p className="font-sans text-sm text-[#6B5860] mb-6">Keep practicing until you don&apos;t need the script.</p>

      <div className="mb-5 flex gap-2">
        {(["memorize", "retrieval", "challenge"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m)
              if (m === "challenge" && !challengeQuestions) onFetchChallenge()
            }}
            className={cn(
              "rounded-full px-3 py-1.5 font-sans text-xs font-bold capitalize",
              mode === m ? "bg-[#5A7A45] text-white" : "bg-white text-[#6B5860] border border-[#E7DCE0]",
            )}
          >
            {m === "memorize" ? "Memorize" : m === "retrieval" ? "Retrieval practice" : "Challenge my thinking"}
          </button>
        ))}
      </div>

      {mode === "memorize" && (
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {MEMORIZATION_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setMemorizationLevel(level.id)}
                className={cn(
                  "rounded-full border px-3 py-1 font-sans text-xs font-bold",
                  memorizationLevel === level.id
                    ? "border-[#5A7A45] bg-[#EEF3EA] text-[#5A7A45]"
                    : "border-[#E7DCE0] bg-white text-[#6B5860]",
                )}
              >
                {level.label}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-[#E7DCE0] bg-white p-5 space-y-3">
            {memorizationLines.map((line) => (
              <p key={line.blockId} className="font-sans text-sm text-[#2B1B22]">
                {line.display || <span className="italic text-[#B7A6AE]">(recall from memory)</span>}
              </p>
            ))}
          </div>
        </div>
      )}

      {mode === "retrieval" && (
        <div className="rounded-xl border border-[#E7DCE0] bg-white p-6 text-center">
          {retrievalBlock ? (
            <>
              <p className="mb-3 font-sans text-xs font-bold uppercase tracking-wide text-[#B7A6AE]">What comes next?</p>
              {retrievalRevealed ? (
                <p className="mb-4 font-sans text-base text-[#2B1B22]">{retrievalBlock.content}</p>
              ) : (
                <p className="mb-4 font-sans text-base text-[#B7A6AE] italic">Try to recall it, then reveal.</p>
              )}
              <div className="flex justify-center gap-2">
                {!retrievalRevealed && (
                  <Button size="sm" variant="outline" onClick={onRetrievalReveal}>
                    Reveal
                  </Button>
                )}
                <Button size="sm" onClick={onRetrievalNext} className="bg-[#5A7A45] hover:bg-[#4A6838]">
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div>
              <p className="mb-4 font-sans text-sm text-[#6B5860]">Ready to test your recall from the top?</p>
              <Button onClick={onRetrievalNext} className="bg-[#5A7A45] hover:bg-[#4A6838]">
                Start
              </Button>
            </div>
          )}
        </div>
      )}

      {mode === "challenge" && (
        <div className="rounded-xl border border-[#E7DCE0] bg-white p-5">
          {loading && !challengeQuestions ? (
            <LoadingBlock label="Thinking of tough questions..." />
          ) : (
            <ul className="space-y-3">
              {challengeQuestions?.map((q, i) => (
                <li key={i} className="font-sans text-sm text-[#2B1B22]">
                  {i + 1}. {q}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 font-sans text-xs text-[#B7A6AE]">For your own reflection only — not scored, not shared.</p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onPracticeAgain} className="text-[#6B5860]">
          Practice again
        </Button>
        <Button onClick={onPrint} variant="outline" className="gap-1.5">
          <Printer className="h-4 w-4" /> Print my rehearsal
        </Button>
      </div>
    </div>
  )
}
