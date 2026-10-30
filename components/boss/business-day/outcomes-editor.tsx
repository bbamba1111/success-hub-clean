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
      title={checkable ? `Planned outcomes · ${done} of ${outcomes.length} achieved` : "Today's intended outcomes"}
      description={checkable ? "Change any outcome as the day develops." : "What must be true by 5:00 PM ET for today to be a success?"}
    >
      <ul className="flex flex-col gap-2">
        {outcomes.map((o) => (
          <li key={o.id} className="flex items-center gap-2">
            {checkable && (
              <input
                type="checkbox"
                checked={o.done}
                onChange={(e) => dispatch({ type: "OUTCOME_UPDATE", id: o.id, patch: { done: e.target.checked } })}
                className="h-4 w-4 accent-[hsl(var(--primary))]"
                aria-label={`Mark outcome achieved: ${o.text}`}
              />
            )}
            <input
              defaultValue={o.text}
              onBlur={(e) => e.target.value.trim() && dispatch({ type: "OUTCOME_UPDATE", id: o.id, patch: { text: e.target.value.trim() } })}
              className={cn(fieldClass, "border-transparent bg-transparent px-2 py-1.5 hover:border-input", o.done && "text-muted-foreground line-through")}
              aria-label="Outcome"
            />
            <button
              onClick={() => dispatch({ type: "OUTCOME_REMOVE", id: o.id })}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-brand-coral-dark"
              aria-label={`Remove outcome: ${o.text}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">
        <input
          className={fieldClass}
          placeholder="Add an outcome"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) add()
          }}
        />
        <button
          onClick={add}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-3 text-sm hover:bg-muted"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add
        </button>
      </div>
    </Panel>
  )
}
