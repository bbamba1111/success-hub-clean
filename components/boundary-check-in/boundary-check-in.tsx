"use client"

/**
 * Boundary Check-In™ — shown in the last ~5 minutes of a segment.
 * Four steps: acknowledge the intended activity, respond with encouragement,
 * explore collisions, then connect to the right next step. Activity status and
 * collisions are stored independently in one record per member/date/segment.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { Check } from "lucide-react"
import { BOUNDARY_OPTIONS } from "@/lib/weekly-boundary-focus/catalog"
import { useWeeklyBoundaryFocus } from "@/lib/weekly-boundary-focus/use-weekly-boundary-focus"
import { COLLISION_GROUPS, type SelectedCollision } from "@/lib/boundary-check-ins/collisions"
import { todayKey, useBoundaryCheckIns } from "@/lib/boundary-check-ins/use-boundary-check-ins"
import { getCheckInAudience, type ActivityStatus } from "@/lib/boundary-check-ins/server"

interface BoundaryCheckInProps {
  segmentId: string
  segmentLabel?: string
}

const keyOf = (c: { id: string; source: string }) => `${c.source}:${c.id}`

const ACTIVITY_OPTIONS: { value: ActivityStatus; label: string }[] = [
  { value: "completed", label: "Yes, completed" },
  { value: "partial", label: "Partially completed" },
  { value: "not_completed", label: "Not completed" },
  { value: "no_activity", label: "I didn\u2019t set a specific activity for this segment" },
]

const NOT_COMPLETED_RESPONSES = [
  "That\u2019s okay. Your intention still matters. Let\u2019s see what competed with the time you set aside.",
  "No worries! Every check-in gives you useful information. What got in the way today?",
  "Good to know! This isn\u2019t about perfection. It\u2019s about understanding what your business and life are asking of you.",
  "Cool beans! Let\u2019s learn from today. Was there anything competing with your planned activity?",
]

const PARTIAL_OPENERS = ["That\u2019s great news!", "Good to know!", "Nice work!"]

/** Stable per segment + day, so the message rotates naturally without flickering. */
function pick<T>(list: T[], seed: string): T {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return list[Math.abs(h) % list.length]
}

function acknowledgment(status: ActivityStatus, seed: string): string {
  switch (status) {
    case "completed":
      return "Awesome! You followed through on your intention. Did anything compete with your time or collide with your boundary along the way?"
    case "partial":
      return `${pick(PARTIAL_OPENERS, seed)} Progress still counts. Let\u2019s see what helped, what competed with your time, and what might need to change.`
    case "not_completed":
      return pick(NOT_COMPLETED_RESPONSES, seed)
    case "no_activity":
      return "That\u2019s okay. Let\u2019s look at how this segment fit into your day."
  }
}

const COLLISION_QUESTION =
  "Did anything compete with your time, interrupt your plans, or collide with the boundary you intended to hold?"

const pillBase =
  "inline-flex items-center rounded-full border px-5 py-2 font-sans text-sm transition-colors disabled:opacity-60"
const pillOn = "border-[#E26C73] bg-[#E26C73] text-white"
const pillOff = "border-[#E26C73]/30 bg-white text-[#3A2E33] hover:bg-[#E26C73]/10"

export function BoundaryCheckIn({ segmentId, segmentLabel }: BoundaryCheckInProps) {
  const { focus } = useWeeklyBoundaryFocus()
  const { checkIns, save, isLoading } = useBoundaryCheckIns()
  const { data: audience } = useSWR("boundary-check-in-audience", () => getCheckInAudience(), {
    revalidateOnFocus: false,
  })
  const date = todayKey()
  const existing = checkIns.find((c) => c.checkInDate === date && c.segmentId === segmentId)

  const [activity, setActivity] = useState<ActivityStatus | null>(null)
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null)
  const [selected, setSelected] = useState<SelectedCollision[]>([])
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (hydrated || isLoading) return
    if (existing) {
      setActivity(existing.activityStatus)
      setAnswer(existing.collided ? "yes" : "no")
      setSelected(existing.collisions)
      setNote(existing.note ?? "")
      setSaved(true)
    }
    setHydrated(true)
  }, [existing, hydrated, isLoading])

  const boundaryText =
    focus.boundaryText ?? BOUNDARY_OPTIONS.find((o) => o.id === focus.optionId)?.label ?? null

  async function persist(collided: boolean, activityStatus: ActivityStatus | null = activity) {
    setSaving(true)
    setError(null)
    const res = await save({
      checkInDate: date,
      segmentId,
      segmentLabel: segmentLabel ?? null,
      boundaryOptionId: focus.optionId,
      boundaryText,
      boundaryWeekKey: focus.weekKey,
      activityStatus,
      collided,
      collisions: collided ? selected : [],
      note: collided ? note : null,
    })
    setSaving(false)
    if (res.ok) setSaved(true)
    else setError(res.error ?? "We couldn't save your check-in.")
  }

  function chooseActivity(value: ActivityStatus) {
    setActivity(value)
    if (answer === "no") void persist(false, value)
    else setSaved(false)
  }

  function chooseNo() {
    setAnswer("no")
    setSelected([])
    setNote("")
    void persist(false)
  }

  function chooseYes() {
    setAnswer("yes")
    setSaved(false)
  }

  function toggle(option: SelectedCollision) {
    setSaved(false)
    setSelected((list) =>
      list.some((c) => keyOf(c) === keyOf(option)) ? list.filter((c) => keyOf(c) !== keyOf(option)) : [...list, option],
    )
  }

  return (
    <div className="rounded-3xl border border-[#E26C73]/25 bg-[#FDF6F0] px-6 py-5 sm:px-7 sm:py-6">
      <p className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
        Boundary Check-In™
      </p>
      {boundaryText && (
        <p className="mb-3 font-sans text-xs leading-relaxed text-[#6B5860]">
          Boundary: <span className="font-semibold text-[#3A2E33]">{boundaryText}</span>
        </p>
      )}

      <p className="mb-4 font-sans text-sm leading-relaxed text-[#3A2E33]">
        Did you complete the activity you intended to complete during this segment?
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Did you complete your intended activity?">
        {ACTIVITY_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={activity === o.value}
            disabled={saving}
            onClick={() => chooseActivity(o.value)}
            className={`${pillBase} ${activity === o.value ? pillOn : pillOff}`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {activity && (
        <>
          <p className="mt-5 font-serif text-base italic leading-relaxed text-[#5C4F55]" aria-live="polite">
            {acknowledgment(activity, `${date}:${segmentId}`)}
          </p>

          <p className="mb-4 mt-5 font-sans text-sm leading-relaxed text-[#3A2E33]">{COLLISION_QUESTION}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={COLLISION_QUESTION}>
            {(["yes", "no"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={answer === value}
                disabled={saving}
                onClick={value === "yes" ? chooseYes : chooseNo}
                className={`${pillBase} ${answer === value ? pillOn : pillOff}`}
              >
                {value === "yes" ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </>
      )}

      {activity && answer === "no" && saved && (
        <p className="mt-4 font-sans text-sm leading-relaxed text-[#5C4F55]">Saved. Nothing collided in this segment.</p>
      )}

      {activity && answer === "yes" && (
        <div className="mt-5 flex flex-col gap-5">
          <p className="font-sans text-sm leading-relaxed text-[#5C4F55]">Choose everything that applied.</p>
          {COLLISION_GROUPS.map((group) => (
            <fieldset key={group.source} className="flex flex-col gap-2">
              <legend className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#5A7A45]">
                {group.title}
              </legend>
              <div className="flex flex-wrap gap-2">
                {group.options.map((o) => {
                  const option = { id: o.id, label: o.label, source: group.source }
                  const isOn = selected.some((c) => keyOf(c) === keyOf(option))
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={isOn}
                      title={o.hint}
                      onClick={() => toggle(option)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sans text-xs transition-colors ${
                        isOn
                          ? "border-[#5A7A45] bg-[#5A7A45] text-white"
                          : "border-[#7FB069]/35 bg-white text-[#3A2E33] hover:bg-[#7FB069]/10"
                      }`}
                    >
                      {isOn && <Check className="h-3 w-3" aria-hidden />}
                      {o.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}

          <label className="flex flex-col gap-2">
            <span className="font-sans text-sm font-semibold text-[#3A2E33]">What needs to change next time?</span>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value)
                setSaved(false)
              }}
              rows={3}
              maxLength={1000}
              placeholder="Optional"
              className="rounded-2xl border border-[#E26C73]/25 bg-white px-4 py-3 font-sans text-sm leading-relaxed text-[#3A2E33] outline-none focus:border-[#E26C73]/60"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void persist(true)}
              disabled={saving}
              className="inline-flex items-center rounded-full bg-[#7FA37F] px-5 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#6E926E] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Check-In"}
            </button>
          </div>
        </div>
      )}

      {activity && answer && saved && audience && <NextStep audience={audience} />}

      {error && <p className="mt-3 font-sans text-sm text-[#B4304A]">{error}</p>}
    </div>
  )
}

function NextStep({ audience }: { audience: "member" | "guest" }) {
  if (audience === "member") {
    return (
      <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-[#7FA37F]/30 bg-white px-5 py-4">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]">Your Next Step</p>
        <p className="font-sans text-sm leading-relaxed text-[#3A2E33]">
          This check-in is now part of your evidence in the Boundary Selection Tool™, Business Boundary Builder™, and My
          Boundary Blueprint™. Use what you&apos;re noticing to choose the one boundary you&apos;ll build this month.
        </p>
        <Link
          href="/my-blueprint#boundary-check-ins"
          className="self-start font-sans text-sm font-semibold text-[#C0545A] underline underline-offset-2 hover:text-[#A8305A]"
        >
          Review my check-in evidence
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-[#E26C73]/25 bg-white px-5 py-4">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#C0545A]">Your Next Step</p>
      <p className="font-sans text-sm leading-relaxed text-[#3A2E33]">
        What you just noticed is exactly why a business boundary helps. Monthly members use the Boundary Selection Tool™
        and Business Boundary Builder™ to turn moments like this into one clear operating rule each month.
      </p>
      <Link
        href="/pricing"
        className="self-start font-sans text-sm font-semibold text-[#C0545A] underline underline-offset-2 hover:text-[#A8305A]"
      >
        Explore monthly membership
      </Link>
    </div>
  )
}
