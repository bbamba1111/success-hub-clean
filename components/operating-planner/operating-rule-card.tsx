"use client"

/**
 * Today's Operating Rule™ — the one persisted section of the Operating
 * Planner™ (Phase 3B.1). Members set a short rule for the segment; it saves to
 * Supabase and stays active until they refine or replace it (carry-forward).
 *
 * Human rules are meant to hold through the Mon–Thu week; business / ai /
 * execution rules can evolve daily. Scope lets Cherry Blossom later organize
 * rules by audience (personal, team, company, client, …).
 */

import { useCallback, useEffect, useMemo, useState } from "react"
import { Check, Loader2, Pencil, Plus, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  createRule,
  deleteRule,
  getActiveRulesForSegment,
  refineRule,
  replaceRule,
  RULE_SCOPE_LABELS,
  RULE_TYPE_LABELS,
  type OperatingRule,
  type RuleScope,
  type RuleType,
} from "@/lib/operating-rules/storage"

interface OperatingRuleCardProps {
  segmentId: string
  defaultRuleType: RuleType
  /** When true, offers the full set of rule types (CEO Workday). */
  allowAllTypes?: boolean
}

const SCOPES = Object.keys(RULE_SCOPE_LABELS) as RuleScope[]
const TYPES = Object.keys(RULE_TYPE_LABELS) as RuleType[]

const chipBase =
  "rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
const chipOn = "bg-brand-green text-white"
const chipOff = "bg-brand-green/10 text-brand-green-dark hover:bg-brand-green/20"

export function OperatingRuleCard({ segmentId, defaultRuleType, allowAllTypes = false }: OperatingRuleCardProps) {
  const [rules, setRules] = useState<OperatingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [signedOut, setSignedOut] = useState(false)

  // Draft state for adding / editing a rule.
  const [isComposing, setIsComposing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftText, setDraftText] = useState("")
  const [draftType, setDraftType] = useState<RuleType>(defaultRuleType)
  const [draftScope, setDraftScope] = useState<RuleScope>("personal")
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const active = await getActiveRulesForSegment(segmentId)
    setRules(active)
    setLoading(false)
  }, [segmentId])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const active = await getActiveRulesForSegment(segmentId)
      if (cancelled) return
      setRules(active)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [segmentId])

  const resetDraft = useCallback(() => {
    setIsComposing(false)
    setEditingId(null)
    setDraftText("")
    setDraftType(defaultRuleType)
    setDraftScope("personal")
  }, [defaultRuleType])

  const startAdd = () => {
    resetDraft()
    setIsComposing(true)
  }

  const startEdit = (rule: OperatingRule) => {
    setIsComposing(true)
    setEditingId(rule.id)
    setDraftText(rule.ruleText)
    setDraftType(rule.ruleType)
    setDraftScope(rule.ruleScope)
  }

  const handleSave = async () => {
    const text = draftText.trim()
    if (!text) return
    setSaving(true)
    if (editingId) {
      const updated = await refineRule(editingId, { ruleText: text, ruleType: draftType, ruleScope: draftScope })
      if (!updated) setSignedOut(true)
    } else {
      const created = await createRule({
        operatingSegment: segmentId,
        ruleText: text,
        ruleType: draftType,
        ruleScope: draftScope,
      })
      if (!created) setSignedOut(true)
    }
    setSaving(false)
    resetDraft()
    await load()
  }

  const handleReplace = async (rule: OperatingRule) => {
    const next = window.prompt("Replace this rule with:", rule.ruleText)
    if (next === null) return
    const text = next.trim()
    if (!text) return
    await replaceRule(rule.id, text)
    await load()
  }

  const handleDelete = async (rule: OperatingRule) => {
    await deleteRule(rule.id)
    await load()
  }

  const showTypeChips = allowAllTypes
  const heading = useMemo(() => "Today's Operating Rule™", [])

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-ds-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="ds-section-title text-base">{heading}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            One clear rule to operate by. It stays in effect until you refine or replace it.
          </p>
        </div>
        {!isComposing && (
          <Button size="sm" onClick={startAdd} className="ds-btn-primary shrink-0">
            <Plus className="ds-icon-sm" aria-hidden />
            Set Rule
          </Button>
        )}
      </div>

      {/* Existing active rules */}
      <div className="mt-4 space-y-2.5">
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="ds-icon-sm animate-spin" aria-hidden />
            Loading your rules…
          </div>
        ) : signedOut ? (
          <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
            Sign in to set and save your Operating Rules™.
          </p>
        ) : rules.length === 0 && !isComposing ? (
          <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
            No rule set yet. Set one clear rule to operate by for this segment.
          </p>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="rounded-xl border border-border bg-background p-3.5">
              <p className="font-serif text-[15px] italic leading-relaxed text-brand-ink">{rule.ruleText}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="ds-badge-green">{RULE_TYPE_LABELS[rule.ruleType]}</span>
                <span className="ds-badge-neutral">{RULE_SCOPE_LABELS[rule.ruleScope]}</span>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(rule)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-brand-ink-soft hover:bg-brand-green/10"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                    Refine
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReplace(rule)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-brand-ink-soft hover:bg-brand-green/10"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(rule)}
                    aria-label="Remove rule"
                    className="inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium text-brand-coral-dark hover:bg-brand-coral/10"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      {isComposing && (
        <div className="mt-3 rounded-xl border border-brand-green/30 bg-brand-green/[0.04] p-3.5">
          <Textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="e.g. Protect the first 90 minutes for deep work — no meetings."
            rows={2}
            className="resize-none border-border bg-background text-sm"
            autoFocus
          />

          {showTypeChips && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-semibold text-brand-ink-soft">Rule type</p>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDraftType(t)}
                    className={`${chipBase} ${draftType === t ? chipOn : chipOff}`}
                  >
                    {RULE_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3">
            <p className="mb-1.5 text-xs font-semibold text-brand-ink-soft">Scope</p>
            <div className="flex flex-wrap gap-1.5">
              {SCOPES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDraftScope(s)}
                  className={`${chipBase} ${draftScope === s ? chipOn : chipOff}`}
                >
                  {RULE_SCOPE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving || !draftText.trim()} className="ds-btn-primary">
              {saving ? (
                <Loader2 className="ds-icon-sm animate-spin" aria-hidden />
              ) : (
                <Check className="ds-icon-sm" aria-hidden />
              )}
              {editingId ? "Save changes" : "Save rule"}
            </Button>
            <Button size="sm" variant="ghost" onClick={resetDraft} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OperatingRuleCard
