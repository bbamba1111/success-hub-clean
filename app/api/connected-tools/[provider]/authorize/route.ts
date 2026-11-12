import { createHash, randomBytes } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  asConnectedProvider,
  connectedToolsRedirectUri,
  PROVIDER_SCOPES,
  providerIsConfigured,
} from "@/lib/connected-tools/config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const COOKIE_PREFIX = "boss_connected_oauth"

function cookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/api/connected-tools",
    maxAge: 10 * 60,
  }
}

export async function GET(request: NextRequest, context: { params: { provider: string } }) {
  const provider = asConnectedProvider(context.params.provider)
  if (!provider) {
    return NextResponse.redirect(new URL("/boss/connected-tools?connect=unsupported", request.url))
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL("/auth/login?redirect=/boss/connected-tools", request.url))
  }

  if (!providerIsConfigured(provider)) {
    return NextResponse.redirect(new URL("/boss/connected-tools?connect=setup&provider=" + provider, request.url))
  }

  const clientId = provider === "google"
    ? process.env.GOOGLE_CLIENT_ID!
    : process.env.MICROSOFT_CLIENT_ID!
  const redirectUri = connectedToolsRedirectUri(provider, request.url)
  const returnTo = request.nextUrl.searchParams.get("returnTo") || "/?openSpace=ceo-workday"\n  const safeReturnTo = returnTo.startsWith("/") && !returnTo.startsWith("//") && !returnTo.includes("\\\\") ? returnTo : "/?openSpace=ceo-workday"\n  const state = randomBytes(32).toString("hex")
  const verifier = randomBytes(32).toString("base64url")
  const challenge = createHash("sha256").update(verifier).digest("base64url")

  const authorizationUrl = provider === "google"
    ? new URL("https://accounts.google.com/o/oauth2/v2/auth")
    : new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize")

  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    response_mode: "query",
    scope: PROVIDER_SCOPES[provider].join(" "),
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    ...(provider === "google"
      ? {
          access_type: "offline",
          include_granted_scopes: "true",
          prompt: "consent",
        }
      : {}),
  }).toString()

  const response = NextResponse.redirect(authorizationUrl)
  response.cookies.set(COOKIE_PREFIX + "_state_" + provider, state, cookieOptions())
  response.cookies.set(COOKIE_PREFIX + "_verifier_" + provider, verifier, cookieOptions())\n  response.cookies.set(COOKIE_PREFIX + "_return_" + provider, safeReturnTo, cookieOptions())
  return response
}
