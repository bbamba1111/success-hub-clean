import "server-only"

export type ConnectedProvider = "google" | "microsoft"

export const PROVIDER_SCOPES: Record<ConnectedProvider, string[]> = {
  google: [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/gmail.readonly",
  ],
  microsoft: [
    "openid",
    "profile",
    "email",
    "offline_access",
    "User.Read",
    "Mail.Read",
  ],
}

export function asConnectedProvider(value: string): ConnectedProvider | null {
  return value === "google" || value === "microsoft" ? value : null
}

export function providerIsConfigured(provider: ConnectedProvider): boolean {
  if (provider === "google") {
    return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  }
  return Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET)
}

export function connectedToolsBaseUrl(requestUrl: string): string {
  const configured = process.env.CONNECTED_TOOLS_BASE_URL?.trim()
  const candidate = configured || new URL(requestUrl).origin
  const parsed = new URL(candidate)
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
    throw new Error("Connected tools callback origin must use HTTPS.")
  }
  return parsed.origin
}

export function connectedToolsRedirectUri(provider: ConnectedProvider, requestUrl: string): string {
  return new URL(
    "/api/connected-tools/" + provider + "/callback",
    connectedToolsBaseUrl(requestUrl),
  ).toString()
}
