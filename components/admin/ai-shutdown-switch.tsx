"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { setAiEnabled } from "@/app/admin/members/actions"

export function AiShutdownSwitch({ enabled }: { enabled: boolean }) {
  const [isOn, setIsOn] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function toggle() {
    const next = !isOn
    if (!next && !window.confirm("Switch off all AI features for every member and visitor now?")) return
    setError(null)
    startTransition(async () => {
      const result = await setAiEnabled(next)
      if (result.ok) setIsOn(next)
      else setError(result.error)
    })
  }

  return (
    <section
      aria-labelledby="ai-switch-heading"
      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground md:flex-row md:items-center md:justify-between"
    >
      <div className="flex flex-col gap-1">
        <h2 id="ai-switch-heading" className="font-serif text-xl">
          AI features
        </h2>
        <p className="leading-relaxed text-muted-foreground" aria-live="polite">
          {isOn
            ? "On. Members and homepage visitors can use AI within their usage limits."
            : "Off. Every AI feature and AI action is refused until you switch it back on."}
        </p>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
      <Button variant={isOn ? "destructive" : "default"} onClick={toggle} disabled={pending} aria-pressed={!isOn}>
        {pending ? "Saving..." : isOn ? "Emergency shutdown" : "Switch AI back on"}
      </Button>
    </section>
  )
}
