"use client"

/**
 * Boundary Check-In™ — shown in the last ~5 minutes of a segment, independent
 * of the morning Decide & Design choice. Asks whether anything collided with
 * this week's Boundary Focus™ and saves the answer (Yes or No) to Supabase,
 * where the Business Boundary Builder™ and My Boundary Blueprint™ read it.
 */

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { BOUNDARY_OPTIONS } from "@/lib/weekly-boundary-focus/catalog"
import { useWeeklyBoundaryFocus } from "@/lib/weekly-boundary-focus/use-weekly-boundary-focus"
import { COLLISION_GROUPS, type SelectedCollision } from "@/lib/boundary-check-ins/collisions"
import { todayKey, useBoundaryCheckIns } from "@/lib/boundary-check-ins/use-boundary-check-ins"

interface BoundaryCheckInProps {
  segmentId: string
  segmentLabel?: string
}

const keyOf = (c: { id: string; source: string }) => `${c.source}:${c.id}`

export function BoundaryCheckIn({ segmentId, segmentLabel }: BoundaryCheckInProps) {
  const { focus } = useWeeklyBoundaryFocus()
  const { checkIns, save, isLoading } = useBoundaryCheckIns()
  const date = todayKey()
  const existing = checkIns.find((c) => c.checkInDate === date && c.segmentId === segmentId)

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
      setAnswer(existing.collided ? "yes" : "no")
      setSelected(existing.collisions)
      setNote(existing.note ?? "")
      setSaved(true)
    }
    setHydrated(true)
  }, [existing, hydrated, isLoading])

  const boundaryText =
    focus.boundaryText ?? BOUNDARY_OPTIONS.find((o) => o.id === focus.optionId)?.label ?? null

  async function persist(collided: boolean) {
    setSaving(true)
    setError(null)
    const res = await save({
      checkInDate: date,
      segmentId,
      segmentLabel: segmentLabel ?? null,
      boundaryOptionId: focus.optionId,
      boundaryText,
      boundaryWeekKey: focus.weekKey,
      collided,
      collisions: collided ? selected : [],
      note: collided ? note : null,
    })
    setSaving(false)
    if (res.ok) setSaved(true)
    else setError(res.error ?? "We couldn't save your check-in.")
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
      <p className="mb-4 font-sans text-sm leading-relaxed text-[#3A2E33]">Did anything collide with this boundary today?</p>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Did anything collide with this boundary today?">
        {(["yes", "no"] as const).map((value) => {
          const isSelected = answer === value
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isSelected}
              disabled={saving}
              onClick={value === "yes" ? chooseYes : chooseNo}
              className={`inline-flex items-center rounded-full border px-5 py-2 font-sans text-sm transition-colors disabled:opacity-60 ${
                isSelected
                  ? "border-[#E26C73] bg-[#E26C73] text-white"
                  : "border-[#E26C73]/30 bg-white text-[#3A2E33] hover:bg-[#E26C73]/10"
              }`}
            >
              {value === "yes" ? "Yes" : "No"}
            </button>
          )
        })}
      </div>

      {answer === "no" && saved && (
        <p className="mt-4 font-sans text-sm leading-relaxed text-[#5C4F55]">Saved. Nothing collided with your boundary in this segment.</p>
      )}

      {answer === "yes" && (
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
            {saved && (
              <span className="font-sans text-xs text-[#5A7A45]">
                Saved to your Business Boundary Builder™ and My Boundary Blueprint™.
              </span>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-3 font-sans text-sm text-[#B4304A]">{error}</p>}
    </div>
  )
}
