import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Routes that are publicly accessible without any authentication
// NOTE: "/" is intentionally NOT public — it is the authenticated daily
// Work-Life Balance Business Day experience and must require a paid membership.
const PUBLIC_ROUTES = [
  "/auth",
  "/api",
  "/_next",
  "/images",
  "/marketing",
  "/landing",
  "/monday",
  // "/1day" — the new $1,997 live group "Make Time For More on Mondays™"
  // offer landing page. Public for the same reason /monday is: it's a
  // pre-purchase marketing/checkout page, not gated app content.
  "/1day",
  "/sunday-shift",
  "/garden",
  "/audit",
  "/focus-areas",
  "/my-results",
  "/preview-results",
  // /pricing no longer has its own page — it's a thin redirect to
  // /experiences (the one canonical pricing page) and must stay public so
  // that redirect resolves before the auth check below runs.
  "/pricing",
  // /welcome is the brand-new customer's FIRST visit after purchase — they
  // have no session yet, so it must be reachable pre-login. Its security is
  // enforced independently by the one-time onboarding_token required by
  // /api/auth/send-confirmation (see that route for details), not by
  // Supabase session auth.
  "/welcome",
]

// Routes that require authentication but NOT paid membership (free access after login)
const AUTH_ONLY_ROUTES = [
  "/installation",
  "/human-zone-of-genius-team",
  "/ai-executive-team",
  // "Make Time For More Experiences™" is the upgrade/continuation decision
  // point itself — every logged-in member (paid or not) must be able to
  // reach it, otherwise non-paid members bounce straight back to the same
  // page and never see it.
  "/experiences",
]

// Valid paid membership tiers (from database constraint)
// 'free' is explicitly NOT in this list - only paying members get access
const PAID_TIERS = ["monday_only", "7_day", "21_day", "monthly", "annual", "premium"]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  )
}

function isAuthOnlyRoute(pathname: string): boolean {
  return AUTH_ONLY_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  )
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase env vars are not available, skip auth check (development mode)
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const pathname = request.nextUrl.pathname

  // DEVELOPMENT-ONLY: lets the "/dev-preview" fixture routes render without a
  // real paid account so the live 4-Hour CEO Workday™ UI can be visually
  // verified with realistic seeded data. The route itself also 404s outside
  // development (see app/dev-preview/workday/page.tsx) — this is a second,
  // independent guard so production auth/paywall behavior never changes.
  if (process.env.NODE_ENV !== "production" && pathname.startsWith("/dev-preview")) {
    return supabaseResponse
  }

  // Allow public routes without any checks
  if (isPublicRoute(pathname)) {
    return supabaseResponse
  }

  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not logged in, redirect to login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // For auth-only routes, just being logged in is enough
  if (isAuthOnlyRoute(pathname)) {
    return supabaseResponse
  }

  // For all other routes (protected hub routes), check for paid membership
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("membership_tier")
    .eq("id", user.id)
    .single()

  const membershipTier = profile?.membership_tier?.toLowerCase() || "free"
  const isPaid = PAID_TIERS.includes(membershipTier)

  if (!isPaid) {
    // Redirect non-paid users to the one canonical upgrade page.
    const url = request.nextUrl.clone()
    url.pathname = "/experiences"
    url.searchParams.set("upgrade", "true")
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
