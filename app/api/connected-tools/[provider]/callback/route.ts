import { timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { encryptConnectedSecret } from "@/lib/connected-tools/crypto"
import {
  asConnectedProvider,
  connectedToolsBaseUrl,
  connectedToolsRedirectUri,
  PROVIDER_SCOPES,
  providerIsConfigured,
} from "@/lib/connected-tools/config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const COOKIE_PREFIX = "boss_connected_oauth"

type TokenResponse = {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  scope?: string
}

function sameSecret(left: string, right: string): boolean {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

function callbackRedirect(request: NextRequest, status: string, provider?: string) {
  const base = connectedToolsBaseUrl(request.url)
  const candidate = provider
    ? request.cookies.get(COOKIE_PREFIX + "_return_" + provider)?.value
    : null
  const returnTo = candidate && candidate.startsWith("/") && !candidate.startsWith("//") &&
    !candidate.includes("\\") && !/[\u0000-\u001f\u007f]/.test(candidate)
    ? candidate
    : "/?openSpace=ceo-workday"
  const target = new URL(returnTo, base)
  target.searchParams.set("connectedTool", status)
  if (provider) target.searchParams.set("provider", provider)
  return NextResponse.redirect(target)
}

function clearFlowCookies(response: NextResponse, provider: string) {
  for (const suffix of ["_state_", "_verifier_", "_return_"]) {
    response.cookies.set(COOKIE_PREFIX + suffix + provider, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/api/connected-tools",
      maxAge: 0,
    })
  }
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error("Provider authorization failed.")
  return response.json() as Promise<T>
}

export async function GET(request: NextRequest, context: { params: { provider: string } }) {
  const provider = asConnectedProvider(context.params.provider)
  if (!provider) return NextResponse.redirect(new URL("/?openSpace=ceo-workday", request.url))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL("/auth/login?redirect=%2F%3FopenSpace%3Dceo-workday", request.url))

  const stateCookie = request.cookies.get(COOKIE_PREFIX + "_state_" + provider)?.value
  const verifier = request.cookies.get(COOKIE_PREFIX + "_verifier_" + provider)?.value
  const returnedState = request.nextUrl.searchParams.get("state")
  const code = request.nextUrl.searchParams.get("code")
  const providerError = request.nextUrl.searchParams.get("error")

  if (providerError) {
    const response = callbackRedirect(request, "cancelled", provider)
    clearFlowCookies(response, provider)
    return response
  }

  if (!providerIsConfigured(provider) || !stateCookie || !verifier || !returnedState ||
      !sameSecret(stateCookie, returnedState) || !code) {
    const response = callbackRedirect(request, "invalid", provider)
    clearFlowCookies(response, provider)
    return response
  }

  try {
    const clientId = provider === "google"
      ? process.env.GOOGLE_CLIENT_ID!
      : process.env.MICROSOFT_CLIENT_ID!
    const clientSecret = provider === "google"
      ? process.env.GOOGLE_CLIENT_SECRET!
      : process.env.MICROSOFT_CLIENT_SECRET!
    const redirectUri = connectedToolsRedirectUri(provider, request.url)
    const tokenEndpoint = provider === "google"
      ? "https://oauth2.googleapis.com/token"
      : "https://login.microsoftonline.com/common/oauth2/v2.0/token"

    const tokenBody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    })

    const tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenBody,
      cache: "no-store",
    })
    const tokens = await readJson<TokenResponse>(tokenResponse)
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("Provider did not return durable offline access.")
    }

    let providerAccountId = ""
    let email = ""
    let displayName: string | null = null

    if (provider === "google") {
      const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: { Authorization: "Bearer " + tokens.access_token },
        cache: "no-store",
      })
      const profile = await readJson<{ sub?: string; email?: string; email_verified?: boolean; name?: string }>(profileResponse)
      if (!profile.sub || !profile.email || profile.email_verified !== true) {
        throw new Error("Google did not return a verified account email.")
      }
      providerAccountId = profile.sub
      email = profile.email
      displayName = profile.name ?? null
    } else {
      const profileResponse = await fetch("https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,userPrincipalName", {
        headers: { Authorization: "Bearer " + tokens.access_token },
        cache: "no-store",
      })
      const profile = await readJson<{ id?: string; displayName?: string; mail?: string | null; userPrincipalName?: string }>(profileResponse)
      const accountEmail = profile.mail || profile.userPrincipalName
      if (!profile.id || !accountEmail) throw new Error("Microsoft did not return an account email.")
      providerAccountId = profile.id
      email = accountEmail
      displayName = profile.displayName ?? null
    }

    const expiresIn = Number(tokens.expires_in ?? 3600)
    const expiresAt = new Date(Date.now() + Math.max(60, Math.min(expiresIn, 86400)) * 1000).toISOString()
    const grantedScopes = tokens.scope?.split(" ").filter(Boolean) ?? PROVIDER_SCOPES[provider]

    const { error } = await supabase.rpc("connected_account_store", {
      p_provider: provider,
      p_provider_account_id: providerAccountId,
      p_email: email,
      p_display_name: displayName,
      p_granted_scopes: grantedScopes,
      p_access_token_ciphertext: encryptConnectedSecret(tokens.access_token),
      p_refresh_token_ciphertext: encryptConnectedSecret(tokens.refresh_token),
      p_access_token_expires_at: expiresAt,
    })
    if (error) throw new Error("The connected account could not be saved.")

    const response = callbackRedirect(request, "success", provider)
    clearFlowCookies(response, provider)
    return response
  } catch {
    const response = callbackRedirect(request, "failed", provider)
    clearFlowCookies(response, provider)
    return response
  }
}
