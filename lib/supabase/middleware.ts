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
  "/sunday-shift",
  "/garden",
  "/audit",
  "/focus-areas",
  "/my-results",
  "/preview-results",
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
    // Redirect non-paid users to pricing/upgrade page
    const url = request.nextUrl.clone()
    url.pathname = "/pricing"
    url.searchParams.set("upgrade", "true")
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
