"use client"

import { useCallback, useEffect, useState } from "react"
import { Link2, Loader2, Mail, ShieldCheck, Unplug } from "lucide-react"

type Provider = "google" | "microsoft"
type Account = {
  id: string
  provider: Provider
  email: string
  display_name: string | null
  granted_scopes: string[]
  status: "active" | "disconnected" | "error"
  access_token_expires_at: string | null
}
type ProviderConfig = { configured: boolean; label: string }
type AccountsResponse = {
  accounts: Account[]
  providers: Record<Provider, ProviderConfig>
  error?: string
}

const label: Record<Provider, string> = { google: "Gmail", microsoft: "Outlook" }

export function ConnectedServicesPanel({
  useConnectedMail,
  onUseConnectedMailChange,
  canUseWithExecutive,
}: {
  useConnectedMail: boolean
  onUseConnectedMailChange: (value: boolean) => void
  canUseWithExecutive: boolean
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [providers, setProviders] = useState<Record<Provider, ProviderConfig> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/connected-tools/accounts", { cache: "no-store" })
      const data = (await response.json().catch(() => ({}))) as AccountsResponse
      if (!response.ok) throw new Error(data.error ?? "Could not load connected services.")
      setAccounts(data.accounts ?? [])
      setProviders(data.providers)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load connected services.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) void load()
  }, [open, load])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get("connectedTool")
    const provider = params.get("provider") as Provider | null
    if (!status) return

    setOpen(true)
    if (status === "success") {
      setNotice((provider ? label[provider] : "Your account") + " connected. You can use it for this work.")
    } else if (status === "cancelled") {
      setNotice("The connection was cancelled. Nothing was connected.")
    } else if (status === "setup") {
      setNotice("This service is not ready to connect yet.")
    } else {
      setNotice("The connection did not finish. Please try again.")
    }

    params.delete("connectedTool")
    params.delete("provider")
    const query = params.toString()
    window.history.replaceState({}, "", query ? window.location.pathname + "?" + query : window.location.pathname)
  }, [])

  async function disconnect(id: string) {
    setSavingId(id)
    setError(null)
    try {
      const response = await fetch(`/api/connected-tools/${id}/disconnect`, { method: "POST" })
      const data = (await response.json().catch(() => ({}))) as { error?: string }
      if (!response.ok) throw new Error(data.error ?? "Could not disconnect this account.")
      await load()
      onUseConnectedMailChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not disconnect this account.")
    } finally {
      setSavingId(null)
    }
  }

  const activeAccounts = accounts.filter((a) => a.status === "active")
  const canSearchEmail = activeAccounts.some((a) =>
    a.provider === "google"
      ? a.granted_scopes?.includes("https://www.googleapis.com/auth/gmail.readonly")
      : a.granted_scopes?.includes("Mail.Read"),
  )

  return (
    <section className="rounded-xl border border-[#DCE7D5] bg-[#F7FAF4]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-base font-semibold text-[#2F4A2A]">
          <Link2 className="h-4 w-4" aria-hidden />
          Connected services
          <span className="rounded-full bg-white px-2 py-0.5 text-sm font-medium text-[#53634D]">
            {activeAccounts.length} connected
          </span>
        </span>
        <span className="text-sm font-medium text-[#53634D]">{open ? "Close" : "Manage"}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-3 border-t border-[#DCE7D5] px-4 py-4">
          {notice && <p role="status" className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#315B2D]">{notice}</p>}
          <p className="text-sm leading-relaxed text-[#52604D]">
            Connect an account once. Its approved services can then be used by you, Cherry Blossom™, or an executive when a task needs them.
          </p>

          {loading && <p className="flex items-center gap-2 text-sm text-[#52604D]"><Loader2 className="h-4 w-4 animate-spin" /> Loading accounts…</p>}

          {!loading && providers && (["google", "microsoft"] as Provider[]).map((provider) => {
            const connected = activeAccounts.filter((a) => a.provider === provider)
            return (
              <div key={provider} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#E6EAE2] bg-white px-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#263322]">{label[provider]}</p>
                  {connected.length > 0 ? connected.map((account) => (
                    <div key={account.id} className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[#52604D]">
                      <span className="break-all">{account.email}</span>
                      <span className="inline-flex items-center gap-1 text-[#3A6B3E]"><ShieldCheck className="h-3.5 w-3.5" /> Connected</span>
                      <button type="button" disabled={savingId === account.id} onClick={() => void disconnect(account.id)} className="inline-flex items-center gap-1 text-[#8A4C4C] underline underline-offset-2 disabled:opacity-50">
                        {savingId === account.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unplug className="h-3.5 w-3.5" />} Disconnect
                      </button>
                    </div>
                  )) : <p className="mt-1 text-sm text-[#737B70]">Not connected</p>}
                </div>
                {providers[provider].configured ? (
                  <a
                    href={`/api/connected-tools/${provider}/authorize?returnTo=${encodeURIComponent("/?openSpace=ceo-workday")}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#BFD4B3] bg-[#F3F8ED] px-3 py-2 text-sm font-semibold text-[#315B2D] hover:bg-[#E9F2E2]"
                  >
                    <Link2 className="h-3.5 w-3.5" /> {connected.length ? "Add account" : "Connect"}
                  </a>
                ) : (
                  <span className="text-sm text-[#8A817C]">Provider setup pending</span>
                )}
              </div>
            )
          })}

          <div className="rounded-lg border border-[#E6EAE2] bg-white px-3 py-3">
            <label className={`flex items-start gap-2 text-sm ${canUseWithExecutive && canSearchEmail ? "text-[#263322]" : "text-[#737B70]"}`}>
              <input
                type="checkbox"
                checked={useConnectedMail}
                disabled={!canUseWithExecutive || !canSearchEmail}
                onChange={(e) => onUseConnectedMailChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#5A7A45]"
              />
              <span>
                <span className="block font-semibold">Let the assigned AI executive search connected email for this task</span>
                <span className="mt-0.5 block leading-relaxed text-[#697464]">
                  Read-only. The executive receives matching subject lines and short snippets as context. Nothing is sent, deleted, or changed.
                </span>
              </span>
            </label>
            {!canUseWithExecutive && <p className="mt-2 text-xs text-[#8A817C]">Choose Cherry Blossom™ or an executive above to use email context.</p>}
            {canUseWithExecutive && !canSearchEmail && <p className="mt-2 text-xs text-[#8A817C]">Connect an account with read-email access to enable this option.</p>}
          </div>

          {error && <p role="alert" className="text-sm text-[#A74436]">{error}</p>}
          <p className="flex items-center gap-1.5 text-xs text-[#697464]"><Mail className="h-3.5 w-3.5" /> Email access is read-only in this first connection release.</p>
        </div>
      )}
    </section>
  )
}
