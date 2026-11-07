"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import {
  BOSS_JOURNEY_DESCRIPTION,
  BOSS_JOURNEY_LABEL,
  type BossJourney,
  type InitiativeRequirement,
  type ReadinessAnswerStatus,
  type StrategicInitiative,
} from "@/lib/boss/readiness"

const JOURNEYS: BossJourney[] = ["starting", "growing", "scaling"]

const ANSWER_LABEL: Record<ReadinessAnswerStatus, string> = {
  have: "I have this",
  missing: "Not yet",
  not_needed: "Not needed",
}

interface Props {
  journey: BossJourney
  suggested: boolean
  harmonyTransition: boolean
  onJourneyChange: (journey: BossJourney, harmonyTransition: boolean) => void
  initiatives: StrategicInitiative[]
  initiativeId: string | null
  onInitiativeChange: (id: string) => void
  objective: string | null
  questions: InitiativeRequirement[]
  answers: Record<string, ReadinessAnswerStatus>
  onAnswer: (key: string, status: ReadinessAnswerStatus) => void
  error?: string | null
}

export function BossJourneyPanel(props: Props) {
  const [openQuestions, setOpenQuestions] = useState(true)
  const pending = props.questions.filter((q) => !props.answers[q.key])

  return (
    <section aria-labelledby="boss-journey-heading" className="flex flex-col gap-4 rounded-2xl border border-[#E8DFE2] bg-[#FBF8F9] p-4">
      <div className="flex flex-col gap-1">
        <p id="boss-journey-heading" className="font-montserrat text-[14px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
          BO$$ Business Journey™
        </p>
        {props.suggested && (
          <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
            Suggested from your business stage. Confirm it so BO$$ plans the right work.
          </p>
        )}
      </div>

      <div role="radiogroup" aria-label="Business journey" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {JOURNEYS.map((j) => {
          const active = props.journey === j
          return (
            <button
              key={j}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => props.onJourneyChange(j, props.harmonyTransition)}
              className={`flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors ${
                active ? "border-[#5B835F] bg-[#5B835F]/10" : "border-[#E8DFE2] bg-background hover:border-[#5B835F]/50"
              }`}
            >
              <span className="flex items-center gap-1 font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-[#2E1F27]">
                {active && <Check className="h-4 w-4 text-[#5B835F]" aria-hidden />}
                {BOSS_JOURNEY_LABEL[j]}
              </span>
              <span className="font-sans text-sm leading-relaxed text-[#6B5860]">{BOSS_JOURNEY_DESCRIPTION[j]}</span>
            </button>
          )
        })}
      </div>

      <label className="flex items-start gap-2 font-sans text-sm leading-relaxed text-[#2E1F27]">
        <input
          type="checkbox"
          className="mt-1 accent-[#5B835F]"
          checked={props.harmonyTransition}
          onChange={(e) => props.onJourneyChange(props.journey, e.target.checked)}
        />
        <span>
          I&apos;m an established founder moving into the Harmony Lane™ — redesigning how my business runs, not starting over.
        </span>
      </label>

      {props.initiatives.length > 0 && (
        <div className="flex flex-col gap-2">
          <label htmlFor="boss-initiative" className="font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/70">
            Strategic initiative
          </label>
          <select
            id="boss-initiative"
            value={props.initiativeId ?? ""}
            onChange={(e) => props.onInitiativeChange(e.target.value)}
            className="rounded-lg border border-[#E8DFE2] bg-background px-3 py-2 font-sans text-sm text-[#2E1F27]"
          >
            {props.initiatives.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
          {props.objective && <p className="font-sans text-sm leading-relaxed text-[#6B5860]">{props.objective}</p>}
        </div>
      )}

      {props.questions.length > 0 && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setOpenQuestions((v) => !v)}
            aria-expanded={openQuestions}
            className="flex items-center justify-between text-left font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-[#2E1F27]"
          >
            <span>BO$$ needs to know</span>
            <span className="font-sans text-xs normal-case tracking-normal text-[#6B5860]">
              {pending.length ? `${pending.length} open` : "All answered"}
            </span>
          </button>
          {openQuestions && (
            <ul className="flex flex-col gap-2">
              {props.questions.map((q) => (
                <li key={q.key} className="flex flex-col gap-2 rounded-xl border border-[#E8DFE2] bg-background p-3">
                  <p className="font-sans text-sm leading-relaxed text-[#2E1F27]">{q.question}</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(ANSWER_LABEL) as ReadinessAnswerStatus[]).map((s) => {
                      const active = props.answers[q.key] === s
                      return (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={active}
                          onClick={() => props.onAnswer(q.key, s)}
                          className={`rounded-full border px-3 py-1 font-sans text-sm transition-colors ${
                            active
                              ? "border-[#5B835F] bg-[#5B835F] text-background"
                              : "border-[#E8DFE2] text-[#2E1F27] hover:border-[#5B835F]/60"
                          }`}
                        >
                          {ANSWER_LABEL[s]}
                        </button>
                      )
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {props.error && (
        <p role="alert" className="font-sans text-sm text-destructive">
          {props.error}
        </p>
      )}
    </section>
  )
}
