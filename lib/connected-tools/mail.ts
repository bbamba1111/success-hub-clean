import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import { decryptConnectedSecret, encryptConnectedSecret, connectedToolsEncryptionKey } from "./crypto"

type Provider = "google" | "microsoft"
type Account = {
  id: string
  provider: Provider
  email: string
  display_name: string | null
  granted_scopes: string[]
  access_token_expires_at: string | null
}
type TokenBundle = {
  provider: Provider
  provider_account_id: string
  access_token_ciphertext: string
  refresh_token_ciphertext: string | null
  access_token_expires_at: string | null
}
type TokenResponse = {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  scope?: string
}
export type MailEvidence = {
  provider: Provider
  account: string
  subject: string
  from: string
  receivedAt: string | null
  snippet: string
}

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : ""
}

async function responseJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error("The connected mail provider returned an error.")
  return response.json() as Promise<T>
}

async function accessTokenForAccount(supabase: SupabaseClient, account: Account): Promise<string> {
  const { data, error } = await supabase.rpc("connected_account_token_bundle", {
    p_account_id: account.id,
    p_encryption_key: connectedToolsEncryptionKey(),
  })
  const bundle = (Array.isArray(data) ? data[0] : null) as TokenBundle | null
  if (error || !bundle?.access_token_ciphertext) {
    throw new Error("The connected account needs to be reconnected.")
  }

  const currentToken = decryptConnectedSecret(bundle.access_token_ciphertext)
  const expiry = bundle.access_token_expires_at ? new Date(bundle.access_token_expires_at).getTime() : 0
  if (expiry > Date.now() + 60_000) return currentToken

  if (!bundle.refresh_token_ciphertext) {
    throw new Error("The connected account needs to be reconnected.")
  }
  const refreshToken = decryptConnectedSecret(bundle.refresh_token_ciphertext)
  const google = account.provider === "google"
  const tokenEndpoint = google
    ? "https://oauth2.googleapis.com/token"
    : "https://login.microsoftonline.com/common/oauth2/v2.0/token"
  const clientId = google ? process.env.GOOGLE_CLIENT_ID : process.env.MICROSOFT_CLIENT_ID
  const clientSecret = google ? process.env.GOOGLE_CLIENT_SECRET : process.env.MICROSOFT_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new Error("The connected provider is not configured.")

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    ...(google ? {} : { scope: "openid profile email offline_access User.Read Mail.Read" }),
  })
  const refreshed = await responseJson<TokenResponse>(await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
    cache: "no-store",
  }))
  if (!refreshed.access_token) throw new Error("The connected account could not refresh its access.")

  const expiresAt = new Date(Date.now() + Math.max(60, Math.min(Number(refreshed.expires_in ?? 3600), 86400)) * 1000).toISOString()
  const { error: storeError } = await supabase.rpc("connected_account_store", {
    p_provider: account.provider,
    p_provider_account_id: bundle.provider_account_id,
    p_email: account.email,
    p_display_name: account.display_name,
    p_granted_scopes: account.granted_scopes,
    p_access_token_ciphertext: encryptConnectedSecret(refreshed.access_token),
    p_refresh_token_ciphertext: encryptConnectedSecret(refreshed.refresh_token ?? refreshToken),
    p_access_token_expires_at: expiresAt,
  })
  if (storeError) throw new Error("The refreshed account could not be saved.")
  return refreshed.access_token
}

async function searchGoogle(token: string, account: string, query: string | null, limit: number): Promise<MailEvidence[]> {
  const listUrl = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages")
  const listParams = new URLSearchParams({ maxResults: String(limit) })
  if (query) listParams.set("q", query)
  listUrl.search = listParams.toString()
  const list = await responseJson<{ messages?: Array<{ id: string }> }>(await fetch(listUrl, {
    headers: { Authorization: "Bearer " + token },
    cache: "no-store",
  }))
  const ids = (list.messages ?? []).map((m) => m.id).filter(Boolean).slice(0, limit)
  const messages = await Promise.all(ids.map(async (id) => {
    const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages/" + encodeURIComponent(id))
    url.searchParams.set("format", "metadata")
    url.searchParams.append("metadataHeaders", "From")
    url.searchParams.append("metadataHeaders", "Subject")
    url.searchParams.append("metadataHeaders", "Date")
    const message = await responseJson<{ snippet?: string; internalDate?: string; payload?: { headers?: Array<{ name?: string; value?: string }> } }>(await fetch(url, {
      headers: { Authorization: "Bearer " + token },
      cache: "no-store",
    }))
    const headers = message.payload?.headers ?? []
    const readHeader = (name: string) => headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? ""
    return {
      provider: "google" as const,
      account,
      subject: clip(readHeader("Subject") || "(No subject)", 200),
      from: clip(readHeader("From"), 200),
      receivedAt: message.internalDate && Number.isFinite(Number(message.internalDate))
        ? new Date(Number(message.internalDate)).toISOString()
        : clip(readHeader("Date"), 100) || null,
      snippet: clip(message.snippet, 600),
    }
  }))
  return messages
}

async function searchMicrosoft(token: string, account: string, query: string | null, limit: number): Promise<MailEvidence[]> {
  const url = new URL("https://graph.microsoft.com/v1.0/me/messages")
  const params = new URLSearchParams({
    "$top": String(limit),
    "$select": "subject,from,receivedDateTime,bodyPreview",
  })
  if (query) params.set("$search", `"${query.replace(/["\\]/g, " ").slice(0, 200)}"`)
  else params.set("$orderby", "receivedDateTime desc")
  url.search = params.toString()
  const data = await responseJson<{ value?: Array<{
    subject?: string
    from?: { emailAddress?: { name?: string; address?: string } }
    receivedDateTime?: string
    bodyPreview?: string
  }> }>(await fetch(url, {
    headers: { Authorization: "Bearer " + token, ConsistencyLevel: "eventual" },
    cache: "no-store",
  }))
  return (data.value ?? []).slice(0, limit).map((m) => ({
    provider: "microsoft",
    account,
    subject: clip(m.subject || "(No subject)", 200),
    from: clip(m.from?.emailAddress?.name || m.from?.emailAddress?.address, 200),
    receivedAt: clip(m.receivedDateTime, 100) || null,
    snippet: clip(m.bodyPreview, 600),
  }))
}

/**
 * Searches only accounts owned by the authenticated founder. Called only when
 * the founder explicitly enables connected-email context for a CEO Workday job.
 * Results are short snippets; provider tokens never leave this server module.
 */
export async function searchConnectedMail(
  supabase: SupabaseClient,
  queryInput: string,
  limit = 5,
  recentOnly = false,
  googleOnly = false,
): Promise<{ messages: MailEvidence[]; accountsSearched: number }> {
  const query = clip(queryInput, 300)
  if (!query && !recentOnly) throw new Error("Add a few words to search your connected email.")

  const { data, error } = await supabase
    .from("connected_accounts")
    .select("id, provider, email, display_name, granted_scopes, access_token_expires_at")
    .eq("status", "active")
    .order("updated_at", { ascending: false })
  if (error) throw new Error("Connected accounts could not be loaded.")

  const accounts = (data ?? []) as Account[]
  if (!accounts.length) throw new Error("Connect Gmail or Outlook in this workday card before using email context.")

  const eligible = accounts.filter((a) =>
    (googleOnly ? a.provider === "google" : true) &&
    (a.provider === "google"
      ? a.granted_scopes?.includes("https://www.googleapis.com/auth/gmail.readonly")
      : a.granted_scopes?.includes("Mail.Read")),
  )
  if (!eligible.length) throw new Error("Your connected account does not have read-email permission. Reconnect it to grant that access.")

  const results = await Promise.all(eligible.map(async (account) => {
    try {
      const token = await accessTokenForAccount(supabase, account)
      return account.provider === "google"
        ? await searchGoogle(token, account.email, query, limit)
        : await searchMicrosoft(token, account.email, query, limit)
    } catch {
      return []
    }
  }))

  const messages = results.flat().slice(0, limit)
  if (!messages.length) {
    throw new Error(recentOnly
      ? "No recent email messages were returned. Check that the connected account is active and has read-email permission."
      : "No matching email was found, or a connected account needs to be reconnected.")
  }
  return { messages, accountsSearched: eligible.length }
}
