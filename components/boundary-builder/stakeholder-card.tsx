"use client"

/**
 * One Stakeholder Alignment™ record inside the Boundary Builder™ (Step 7).
 *
 * Each required stakeholder gets their own response record with the agreed
 * three-response model (👍 / 👎 / ❓) plus ⏳ pending. Silence is never
 * approval, questions must be resolved before re-response, and a thumbs-down
 * opens a resolve → revise → Communicate It™ → reconfirm loop. A stakeholder
 * cannot read as aligned while a question or objection is open.
 */

import { Trash2 } from "lucide-react"
import { STAKEHOLDER_TYPES } from "@/lib/boundary-library"
import {
  RESPONSE_SLA_LABEL,
  isStakeholderAligned,
  type ResponseSla,
  type SosStakeholder,
  type StakeholderResponseState,
} from "@/lib/human-sos/types"

const RESPONSE_CHOICES: { value: StakeholderResponseState; icon: string; label: string }[] = [
  { value: "thumbs-up", icon: "👍", label: "Understands & supports" },
  { value: "thumbs-down", icon: "👎", label: "Cannot support as presented" },
  { value: "question", icon: "❓", label: "Has a question" },
  { value: "pending", icon: "⏳", label: "No response yet" },
]

const SLA_CHOICES: ResponseSla[] = ["same-day", "24h", "48h", "custom"]

const inputClass =
  "w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#3A2E33] outline-none focus:border-[#5A7A45]"
const labelClass = "font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B5860]"

export function StakeholderCard({
  stakeholder,
  onChange,
  onRemove,
}: {
  stakeholder: SosStakeholder
  onChange: (next: SosStakeholder) => void
  onRemove: () => void
}) {
  const s = stakeholder
  const set = (patch: Partial<SosStakeholder>) => onChange({ ...s, ...patch })
  const aligned = isStakeholderAligned(s)

  return (
    <li className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className={labelClass}>Name / group</span>
              <input
                className={inputClass}
                value={s.name}
                placeholder="e.g. Operations Lead"
                onChange={(e) => set({ name: e.target.value })}
              />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Stakeholder type</span>
              <select
                className={inputClass}
                value={s.stakeholderType}
                onChange={(e) => set({ stakeholderType: e.target.value })}
              >
                {STAKEHOLDER_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove stakeholder"
          className="shrink-0 rounded-full p-1.5 text-[#6B5860] hover:bg-[#F4F7F0] hover:text-[#B4304A]"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className={labelClass}>Role</span>
          <input className={inputClass} value={s.role} onChange={(e) => set({ role: e.target.value })} />
        </label>
        <label className="space-y-1">
          <span className={labelClass}>Required action</span>
          <input
            className={inputClass}
            value={s.requiredAction}
            placeholder="What must they do?"
            onChange={(e) => set({ requiredAction: e.target.value })}
          />
        </label>
      </div>

      <label className="block space-y-1">
        <span className={labelClass}>What they need to understand</span>
        <textarea
          rows={2}
          className={inputClass}
          value={s.whatToUnderstand}
          onChange={(e) => set({ whatToUnderstand: e.target.value })}
        />
      </label>

      {/* Support needs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["trainingNeeded", "Training"],
            ["meetingNeeded", "Meeting"],
            ["qaNeeded", "Q&A"],
            ["followupNeeded", "Follow-up"],
          ] as const
        ).map(([key, label]) => {
          const active = s[key]
          return (
            <button
              key={key}
              type="button"
              onClick={() => set({ [key]: !active } as Partial<SosStakeholder>)}
              className={
                "rounded-full px-3 py-1.5 font-sans text-xs font-semibold transition-colors " +
                (active ? "bg-[#5A7A45] text-white" : "border border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-[#F4F7F0]")
              }
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Response SLA + deadline */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <span className={labelClass}>Response SLA</span>
          <div className="flex flex-wrap gap-1.5">
            {SLA_CHOICES.map((sla) => (
              <button
                key={sla}
                type="button"
                onClick={() => set({ responseSla: sla })}
                className={
                  "rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold transition-colors " +
                  (s.responseSla === sla
                    ? "bg-[#2E1F27] text-white"
                    : "border border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-[#F4F7F0]")
                }
              >
                {RESPONSE_SLA_LABEL[sla]}
              </button>
            ))}
          </div>
        </div>
        <label className="space-y-1">
          <span className={labelClass}>Actual deadline</span>
          <input
            type="datetime-local"
            className={inputClass}
            value={s.deadline ?? ""}
            onChange={(e) => set({ deadline: e.target.value || null })}
          />
        </label>
      </div>

      {/* Response state */}
      <div className="space-y-1.5">
        <span className={labelClass}>Their response</span>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {RESPONSE_CHOICES.map((c) => {
            const active = s.responseState === c.value
            return (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => {
                  // Entering a question / objection opens its resolution loop;
                  // moving away from it closes any that isn't already resolved.
                  const patch: Partial<SosStakeholder> = { responseState: c.value }
                  if (c.value === "question" && s.questionStatus === "none") patch.questionStatus = "open"
                  if (c.value === "thumbs-down" && s.objectionStatus === "none") patch.objectionStatus = "open"
                  set(patch)
                }}
                className={
                  "flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-sans text-xs font-semibold transition-colors " +
                  (active
                    ? "bg-[#5A7A45] text-white"
                    : "border border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-[#F4F7F0]")
                }
              >
                <span aria-hidden>{c.icon}</span>
                <span className="hidden sm:inline">{c.value === "pending" ? "Pending" : c.value === "thumbs-up" ? "Support" : c.value === "thumbs-down" ? "Object" : "Question"}</span>
              </button>
            )
          })}
        </div>
        {s.responseState === "pending" && (
          <p className="font-sans text-[11px] italic text-[#6B5860]">Silence is not approval.</p>
        )}
      </div>

      {/* ❓ Question resolution */}
      {s.responseState === "question" && (
        <div className="rounded-xl border border-[#D8B54A]/50 bg-[#FBF6E7] px-4 py-4 space-y-3">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A6D1E]">
            Question — resolve before they can re-respond
          </p>
          <label className="block space-y-1">
            <span className={labelClass}>Question</span>
            <textarea rows={2} className={inputClass} value={s.questionText ?? ""} onChange={(e) => set({ questionText: e.target.value })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className={labelClass}>Owner</span>
              <input className={inputClass} value={s.questionOwner ?? ""} onChange={(e) => set({ questionOwner: e.target.value })} />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Resolution deadline</span>
              <input
                type="datetime-local"
                className={inputClass}
                value={s.questionResolutionDeadline ?? ""}
                onChange={(e) => set({ questionResolutionDeadline: e.target.value || null })}
              />
            </label>
          </div>
          <label className="block space-y-1">
            <span className={labelClass}>Response</span>
            <textarea rows={2} className={inputClass} value={s.questionResponse ?? ""} onChange={(e) => set({ questionResponse: e.target.value })} />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={s.questionStatus === "resolved"}
              onChange={(e) => set({ questionStatus: e.target.checked ? "resolved" : "open" })}
            />
            <span className="font-sans text-sm text-[#3A2E33]">Question resolved — ask them to re-respond (👍 / 👎 / ❓)</span>
          </label>
        </div>
      )}

      {/* 👎 Objection resolution */}
      {s.responseState === "thumbs-down" && (
        <div className="rounded-xl border border-[#B4304A]/40 bg-[#FBEEF0] px-4 py-4 space-y-3">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#B4304A]">
            Thumbs down — resolve → revise → Communicate It™ → reconfirm
          </p>
          <label className="block space-y-1">
            <span className={labelClass}>Concern</span>
            <textarea rows={2} className={inputClass} value={s.concern ?? ""} onChange={(e) => set({ concern: e.target.value })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className={labelClass}>Impact</span>
              <input className={inputClass} value={s.impact ?? ""} onChange={(e) => set({ impact: e.target.value })} />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Requested change</span>
              <input className={inputClass} value={s.requestedChange ?? ""} onChange={(e) => set({ requestedChange: e.target.value })} />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Owner</span>
              <input className={inputClass} value={s.objectionOwner ?? ""} onChange={(e) => set({ objectionOwner: e.target.value })} />
            </label>
            <label className="space-y-1">
              <span className={labelClass}>Resolution deadline</span>
              <input
                type="datetime-local"
                className={inputClass}
                value={s.objectionResolutionDeadline ?? ""}
                onChange={(e) => set({ objectionResolutionDeadline: e.target.value || null })}
              />
            </label>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={s.objectionStatus === "resolved"}
              onChange={(e) => set({ objectionStatus: e.target.checked ? "resolved" : "open" })}
            />
            <span className="font-sans text-sm text-[#3A2E33]">Objection resolved &amp; reconfirmed</span>
          </label>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-[#F0EAEC] pt-3">
        <span className="font-sans text-xs text-[#6B5860]">
          {s.responseSla ? RESPONSE_SLA_LABEL[s.responseSla] : ""}
        </span>
        <span
          className={
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] " +
            (aligned ? "bg-[#8DAE72]/20 text-[#5A7A45]" : "bg-[#F4F7F0] text-[#6B5860]")
          }
        >
          {aligned ? "Aligned" : "Not yet aligned"}
        </span>
      </div>
    </li>
  )
}
