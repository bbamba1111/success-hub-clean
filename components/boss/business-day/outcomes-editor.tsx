"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { Panel, fieldClass } from "../primitives"

export function OutcomesEditor({ checkable }: { checkable?: boolean }) {
  const { state, dispatch } = useBoss()
  const [text, setText] = useState("")
  const outcomes = state.day.outcomes
  const done = outcomes.filter((o) => o.done).length

  function add() {
    if (!text.trim()) return
    dispatch({ type: "OUTCOME_ADD", text: text.trim() })
    setText("")
  }

  return (
    <Panel
      title={checkable ? `Your goals: ${done} of ${outcomes.length} done` : "What do you want to get done today?"}
      description={checkable ? "Check a goal when it is done." : "Write one goal at a time. Ask: what must be true by 5:00 PM?"}
    >
      <ul className="flex flex-col gap-3">
        {outcomes.map((o) => (
          <li key={o.id} className="flex items-center gap-3">
            {checkable && (
              <input
                type="checkbox"
                checked={o.done}
                onChange={(e) => dispatch({ type: "OUTCOME_UPDATE", id: o.id, patch: { done: e.target.checked } })}
                className="h-6 w-6 shrink-0 accent-[hsl(var(--primary))]"
                aria-label={`Done: ${o.text}`}
              />
            )}
            <input
              defaultValue={o.text}
              onBlur={(e) => e.target.value.trim() && dispatch({ type: "OUTCOME_UPDATE", id: o.id, patch: { text: e.target.value.trim() } })}
              className={cn(fieldClass, "bg-muted/40", o.done && "text-muted-foreground line-through")}
              aria-label="Goal"
            />
            <button
              onClick={() => dispatch({ type: "OUTCOME_REMOVE", id: o.id })}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-brand-coral-dark"
              aria-label={`Remove goal: ${o.text}`}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-3">
        <input
          className={fieldClass}
          placeholder="Type a new goal"
          aria-label="New goal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) add()
          }}
        />
        <button
          onClick={add}
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border border-brand-green/40 px-5 text-base font-semibold text-brand-green-dark hover:bg-brand-sage-light"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Add
        </button>
      </div>
    </Panel>
  )
}
